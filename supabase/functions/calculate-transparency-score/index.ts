import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Answer {
  question_id: string;
  answer_value: string;
  question_text: string;
  question_type: string;
  priority: string;
}

interface ScoreBreakdown {
  completeness: number;
  quality: number;
  transparency_level: number;
  category_specific: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product_id }: { product_id: string } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch answers with question details
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select(`
        *,
        questions!inner(
          question_text,
          question_type,
          ai_generated
        )
      `)
      .eq('product_id', product_id);

    if (answersError) throw answersError;

    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError) throw productError;

    // Calculate transparency score
    const scoreData = calculateScore(answers, product);

    // Generate insights and recommendations
    const insights = generateInsights(answers, product, scoreData);

    const reportData = {
      product,
      score_breakdown: scoreData.breakdown,
      total_score: scoreData.total_score,
      insights,
      recommendations: scoreData.recommendations,
      questions_answered: answers.length,
      timestamp: new Date().toISOString()
    };

    // Update the transparency report
    const { error: updateError } = await supabase
      .from('transparency_reports')
      .update({
        transparency_score: scoreData.total_score,
        report_data: reportData
      })
      .eq('product_id', product_id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ 
      score: scoreData.total_score,
      breakdown: scoreData.breakdown,
      insights,
      recommendations: scoreData.recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error calculating transparency score:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateScore(answers: any[], product: any) {
  const breakdown: ScoreBreakdown = {
    completeness: 0,
    quality: 0,
    transparency_level: 0,
    category_specific: 0
  };

  // Completeness Score (0-25 points)
  const totalQuestions = answers.length;
  const answeredQuestions = answers.filter(a => a.answer_value && a.answer_value.trim().length > 0).length;
  breakdown.completeness = Math.round((answeredQuestions / Math.max(totalQuestions, 1)) * 25);

  // Quality Score (0-25 points)
  let qualityScore = 0;
  answers.forEach(answer => {
    const answerLength = answer.answer_value?.length || 0;
    if (answerLength > 50) qualityScore += 3; // Detailed answer
    else if (answerLength > 20) qualityScore += 2; // Moderate answer
    else if (answerLength > 0) qualityScore += 1; // Basic answer
  });
  breakdown.quality = Math.min(25, Math.round(qualityScore));

  // Transparency Level (0-25 points)
  const transparencyKeywords = [
    'certified', 'organic', 'sustainable', 'recyclable', 'biodegradable',
    'fair trade', 'cruelty-free', 'non-toxic', 'locally sourced',
    'transparency', 'disclosure', 'verified', 'tested', 'compliant'
  ];
  
  let transparencyScore = 0;
  answers.forEach(answer => {
    const lowerAnswer = answer.answer_value?.toLowerCase() || '';
    transparencyKeywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) transparencyScore += 1;
    });
  });
  breakdown.transparency_level = Math.min(25, transparencyScore);

  // Category-Specific Score (0-25 points)
  breakdown.category_specific = calculateCategoryScore(answers, product.category);

  const total_score = Math.min(100, 
    breakdown.completeness + 
    breakdown.quality + 
    breakdown.transparency_level + 
    breakdown.category_specific
  );

  const recommendations = generateRecommendations(breakdown, total_score);

  return {
    breakdown,
    total_score,
    recommendations
  };
}

function calculateCategoryScore(answers: any[], category: string): number {
  const categoryKeywords: Record<string, string[]> = {
    "Food & Beverages": [
      'ingredients', 'allergens', 'nutrition', 'preservatives', 'additives',
      'source', 'farm', 'organic', 'gmo', 'shelf life'
    ],
    "Cosmetics & Personal Care": [
      'ingredients', 'testing', 'cruelty', 'parabens', 'sulfates',
      'natural', 'dermatologist', 'hypoallergenic', 'fragrance'
    ],
    "Electronics": [
      'materials', 'recycling', 'energy', 'conflict minerals', 'warranty',
      'repair', 'lifecycle', 'disposal', 'manufacturing'
    ]
  };

  const keywords = categoryKeywords[category] || [];
  let score = 0;

  answers.forEach(answer => {
    const lowerAnswer = answer.answer_value?.toLowerCase() || '';
    keywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) score += 2;
    });
  });

  return Math.min(25, score);
}

function generateRecommendations(breakdown: ScoreBreakdown, totalScore: number): string[] {
  const recommendations: string[] = [];

  if (breakdown.completeness < 20) {
    recommendations.push("Complete all required questions to improve transparency score");
  }

  if (breakdown.quality < 15) {
    recommendations.push("Provide more detailed responses with specific information");
  }

  if (breakdown.transparency_level < 15) {
    recommendations.push("Include more transparency-related information like certifications and standards");
  }

  if (breakdown.category_specific < 15) {
    recommendations.push("Add more category-specific details relevant to your product type");
  }

  if (totalScore >= 80) {
    recommendations.push("Excellent transparency! Consider publishing this report to build consumer trust");
  } else if (totalScore >= 60) {
    recommendations.push("Good transparency level. Focus on the areas above to reach excellence");
  } else {
    recommendations.push("Significant improvements needed. Focus on providing comprehensive product information");
  }

  return recommendations;
}

function generateInsights(answers: any[], product: any, scoreData: any): string[] {
  const insights: string[] = [];

  const hasDetailedIngredients = answers.some(a => 
    a.answer_value?.toLowerCase().includes('ingredient') && a.answer_value.length > 30
  );

  if (hasDetailedIngredients) {
    insights.push("Comprehensive ingredient disclosure provided");
  }

  const hasCertifications = answers.some(a => 
    a.answer_value?.toLowerCase().includes('certified') || 
    a.answer_value?.toLowerCase().includes('certification')
  );

  if (hasCertifications) {
    insights.push("Product includes third-party certifications");
  }

  const hasOriginInfo = answers.some(a => 
    a.answer_value?.toLowerCase().includes('origin') ||
    a.answer_value?.toLowerCase().includes('source') ||
    a.answer_value?.toLowerCase().includes('manufactured')
  );

  if (hasOriginInfo) {
    insights.push("Supply chain origin information provided");
  }

  if (scoreData.total_score > 75) {
    insights.push("High transparency score indicates strong commitment to disclosure");
  }

  return insights;
}