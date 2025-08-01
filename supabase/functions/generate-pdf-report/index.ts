import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Fetch the transparency report
    const { data: report, error: reportError } = await supabase
      .from('transparency_reports')
      .select(`
        *,
        products (*)
      `)
      .eq('product_id', product_id)
      .single();

    if (reportError) throw reportError;

    // Generate HTML content for the PDF
    const htmlContent = generateHTMLReport(report);

    // For now, return the HTML content
    // In a production environment, you would use a PDF generation service
    // like Puppeteer, jsPDF, or a dedicated PDF API
    return new Response(JSON.stringify({ 
      html_content: htmlContent,
      message: "PDF generation service would convert this HTML to PDF",
      download_url: `/reports/${product_id}/pdf` // Placeholder URL
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating PDF report:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateHTMLReport(report: any): string {
  const product = report.products;
  const reportData = report.report_data || {};
  const scoreBreakdown = reportData.score_breakdown || {};

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Transparency Report - ${product.name}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        .score-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        .score-large {
            font-size: 48px;
            font-weight: bold;
            color: #2563eb;
        }
        .breakdown {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .breakdown-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2563eb;
        }
        .product-info {
            background: white;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .insights, .recommendations {
            background: white;
            padding: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .insights ul, .recommendations ul {
            list-style-type: none;
            padding: 0;
        }
        .insights li, .recommendations li {
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .insights li:before {
            content: "✓ ";
            color: #10b981;
            font-weight: bold;
        }
        .recommendations li:before {
            content: "→ ";
            color: #f59e0b;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Product Transparency Report</h1>
        <h2>${product.name}</h2>
        <p>Generated on ${new Date(report.generated_at).toLocaleDateString()}</p>
    </div>

    <div class="score-section">
        <div class="score-large">${report.transparency_score}/100</div>
        <p>Overall Transparency Score</p>
        
        <div class="breakdown">
            <div class="breakdown-item">
                <h4>Completeness</h4>
                <div style="font-size: 24px; color: #2563eb;">${scoreBreakdown.completeness || 0}/25</div>
            </div>
            <div class="breakdown-item">
                <h4>Quality</h4>
                <div style="font-size: 24px; color: #2563eb;">${scoreBreakdown.quality || 0}/25</div>
            </div>
            <div class="breakdown-item">
                <h4>Transparency Level</h4>
                <div style="font-size: 24px; color: #2563eb;">${scoreBreakdown.transparency_level || 0}/25</div>
            </div>
            <div class="breakdown-item">
                <h4>Category Specific</h4>
                <div style="font-size: 24px; color: #2563eb;">${scoreBreakdown.category_specific || 0}/25</div>
            </div>
        </div>
    </div>

    <div class="product-info">
        <h3>Product Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Product Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${product.name}</td>
            </tr>
            ${product.brand ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Brand:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${product.brand}</td>
            </tr>
            ` : ''}
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Category:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${product.category}</td>
            </tr>
            ${product.description ? `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Description:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${product.description}</td>
            </tr>
            ` : ''}
        </table>
    </div>

    ${reportData.insights ? `
    <div class="insights">
        <h3>Key Insights</h3>
        <ul>
            ${reportData.insights.map((insight: string) => `<li>${insight}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${reportData.recommendations ? `
    <div class="recommendations">
        <h3>Recommendations for Improvement</h3>
        <ul>
            ${reportData.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="footer">
        <p>This report was generated by TruthTrack - Product Transparency Platform</p>
        <p>Report ID: ${report.id}</p>
    </div>
</body>
</html>
  `;
}