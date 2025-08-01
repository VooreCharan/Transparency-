import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, Key, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AIServiceStatus = () => {
  const [apiKey, setApiKey] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkApiKeyStatus();
  }, []);

  const checkApiKeyStatus = async () => {
    setIsChecking(true);
    try {
      // Try to call a simple edge function to check if API key is configured
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { product: { name: "Test", category: "Test", brand: "Test" } }
      });
      
      if (error && error.message?.includes('API key')) {
        setHasApiKey(false);
      } else {
        setHasApiKey(true);
      }
    } catch (error) {
      console.log('API key status check:', error);
      setHasApiKey(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) return;
    
    toast({
      title: "API Key Info",
      description: "In production, this would be set in Supabase Edge Function Secrets. For now, AI features use fallback logic.",
    });
  };

  if (hasApiKey) {
    return (
      <Card className="mb-6 border-success/20 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <h4 className="font-medium text-success">AI Services Active</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced question generation and scoring available
              </p>
            </div>
            <Badge variant="default" className="ml-auto">
              <Brain className="h-3 w-3 mr-1" />
              AI Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-warning/20 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warning">
          <AlertTriangle className="h-5 w-5" />
          AI Services Configuration
        </CardTitle>
        <CardDescription>
          Configure OpenAI API key for enhanced AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apikey">OpenAI API Key (Optional)</Label>
          <div className="flex gap-2">
            <Input
              id="apikey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit} disabled={!apiKey.trim()}>
              <Key className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Without API key:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Basic category-specific questions will be used</li>
            <li>Standard transparency scoring algorithm</li>
            <li>All core features remain functional</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIServiceStatus;