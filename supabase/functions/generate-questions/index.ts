import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  name: string;
  brand?: string;
  category: string;
  description?: string;
}

interface Question {
  question_text: string;
  question_type: 'text' | 'textarea' | 'select';
  options?: string[];
  ai_generated: boolean;
  priority: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product }: { product: ProductData } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `As a product transparency expert, generate 5-8 specific, actionable questions for analyzing the transparency of this product:

Product: ${product.name}
Brand: ${product.brand || 'Unknown'}
Category: ${product.category}
Description: ${product.description || 'No description provided'}

Generate questions that would help assess:
1. Supply chain transparency
2. Environmental impact
3. Safety and quality standards
4. Ethical manufacturing practices
5. Ingredient/material disclosure

For each question, provide:
- The question text
- Question type (text, textarea, or select)
- If select type, provide 3-4 realistic options
- Priority level (high, medium, low)

Format as JSON array with this structure:
{
  "questions": [
    {
      "question_text": "Question here?",
      "question_type": "select",
      "options": ["Option 1", "Option 2", "Option 3"],
      "priority": "high"
    }
  ]
}

Focus on questions specific to the ${product.category} category and avoid generic questions.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert in product transparency and supply chain analysis. Generate specific, actionable questions that would help assess product transparency. Always respond with valid JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response to extract questions
    let questions: Question[] = [];
    try {
      const parsedResponse = JSON.parse(aiResponse);
      questions = parsedResponse.questions.map((q: any) => ({
        ...q,
        ai_generated: true
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to category-specific questions if AI parsing fails
      questions = getFallbackQuestions(product.category);
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-questions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getFallbackQuestions(category: string): Question[] {
  const baseQuestions = [
    {
      question_text: "What is the country of origin for this product?",
      question_type: "text" as const,
      ai_generated: true,
      priority: "high" as const
    },
    {
      question_text: "Are there any third-party certifications for this product?",
      question_type: "textarea" as const,
      ai_generated: true,
      priority: "high" as const
    }
  ];

  const categoryQuestions: Record<string, Question[]> = {
    "Food & Beverages": [
      {
        question_text: "What is the source of the main ingredients?",
        question_type: "textarea",
        ai_generated: true,
        priority: "high"
      },
      {
        question_text: "Are any ingredients genetically modified?",
        question_type: "select",
        options: ["Yes", "No", "Unknown", "Some ingredients"],
        ai_generated: true,
        priority: "medium"
      }
    ],
    "Cosmetics & Personal Care": [
      {
        question_text: "What preservatives are used in this product?",
        question_type: "textarea",
        ai_generated: true,
        priority: "high"
      },
      {
        question_text: "Is this product cruelty-free?",
        question_type: "select",
        options: ["Yes - certified", "Yes - not certified", "No", "Unknown"],
        ai_generated: true,
        priority: "high"
      }
    ],
    "Electronics": [
      {
        question_text: "What materials are used in the product construction?",
        question_type: "textarea",
        ai_generated: true,
        priority: "high"
      },
      {
        question_text: "Is there a take-back or recycling program?",
        question_type: "select",
        options: ["Yes - full program", "Limited program", "No", "Unknown"],
        ai_generated: true,
        priority: "medium"
      }
    ]
  };

  return [...baseQuestions, ...(categoryQuestions[category] || [])];
}