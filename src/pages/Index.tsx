import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Brain, FileText, CheckCircle, Star, Users } from "lucide-react";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-transparency.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-6">
            AI-Powered Transparency Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Uncover Product
            <span className="block bg-gradient-to-r from-white to-accent-light bg-clip-text text-transparent">
              Transparency
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Build trust through intelligent product analysis. Our AI-powered platform generates 
            comprehensive transparency reports to help consumers make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <a href="/submit">
                Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              View Sample Report
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How TruthTrack Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform combines AI-powered questioning with comprehensive analysis 
              to deliver actionable transparency insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-elevation-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Submit Product</CardTitle>
                <CardDescription>
                  Enter basic product information and our AI generates tailored questions 
                  based on category and industry standards.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-elevation-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-accent/10">
                  <Brain className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Advanced AI analyzes your responses and generates intelligent follow-up 
                  questions to ensure comprehensive transparency coverage.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-elevation-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-success/10">
                  <FileText className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>
                  Receive a professional transparency report with scoring, insights, 
                  and actionable recommendations for improvement.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why Choose TruthTrack</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transparency That Drives Trust
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                In today's market, consumers demand transparency. Our platform helps 
                businesses build trust through comprehensive product disclosure and analysis.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">AI-Powered Intelligence</h4>
                    <p className="text-muted-foreground text-sm">
                      Dynamic questioning adapts to your product category and industry
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Comprehensive Reports</h4>
                    <p className="text-muted-foreground text-sm">
                      Professional PDF reports with scoring and recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold">Industry Standards</h4>
                    <p className="text-muted-foreground text-sm">
                      Questions based on regulatory requirements and best practices
                    </p>
                  </div>
                </div>
              </div>
              
              <Button variant="hero" size="lg" className="mt-8" asChild>
                <a href="/submit">Get Started Now</a>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Average Transparency Score Improvement</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Products Analyzed</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Average Report Generation</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-warning mb-2">4.9</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Trust Through Transparency?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading brands that prioritize transparency and build consumer trust 
            through comprehensive product disclosure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <a href="/submit">
                Submit Your Product <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="/reports">Browse Reports</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">TruthTrack</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 TruthTrack. Building transparency, one product at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
