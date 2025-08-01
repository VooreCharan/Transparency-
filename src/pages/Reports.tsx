import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Download, Eye, Calendar, Building2, Tag } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  submitted_by: string;
  created_at: string;
}

interface TransparencyReport {
  id: string;
  product_id: string;
  transparency_score: number;
  report_data: any;
  generated_at: string;
  pdf_url?: string;
}

interface ReportWithProduct extends TransparencyReport {
  product: Product;
}

const Reports = () => {
  const [reports, setReports] = useState<ReportWithProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('transparency_reports')
        .select(`
          *,
          products (*)
        `)
        .order('generated_at', { ascending: false });

      if (reportsError) throw reportsError;

      const reportsWithProduct = reportsData?.map(report => ({
        ...report,
        product: report.products
      })) as ReportWithProduct[];

      setReports(reportsWithProduct || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report =>
    report.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.product?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = async (reportId: string, productId: string) => {
    try {
      toast({
        title: "Generating PDF",
        description: "Creating your transparency report...",
      });

      const { data, error } = await supabase.functions.invoke('generate-pdf-report', {
        body: { product_id: productId }
      });

      if (error) throw error;

      if (data.html_content) {
        // Create a new window with the HTML content for now
        // In production, this would be a proper PDF download
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(data.html_content);
          newWindow.document.close();
        }
        
        toast({
          title: "Report Ready",
          description: "PDF preview opened in new window. In production, this would be a downloadable PDF.",
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transparency Reports</h1>
          <p className="text-muted-foreground">
            Browse and download detailed transparency reports for submitted products
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by product name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No reports match your search criteria." : "No transparency reports have been generated yet."}
              </p>
              <Button variant="hero" asChild>
                <a href="/submit">Submit First Product</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-elevation-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{report.product?.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        {report.product?.brand && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {report.product.brand}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {report.product?.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.generated_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(report.transparency_score)}`}>
                        {report.transparency_score}/100
                      </div>
                      <Badge variant={report.transparency_score >= 80 ? "default" : report.transparency_score >= 60 ? "secondary" : "destructive"}>
                        {getScoreBadge(report.transparency_score)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Transparency Score</span>
                      <span>{report.transparency_score}%</span>
                    </div>
                    <Progress value={report.transparency_score} className="h-2" />
                  </div>

                  {report.report_data?.key_findings && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Findings:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {report.report_data.key_findings.map((finding: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="default" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => generatePDF(report.id, report.product_id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;