import { Button } from "@/components/ui/button";
import { Shield, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TruthTrack
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/submit" className="text-muted-foreground hover:text-foreground transition-colors">
            Submit Product
          </Link>
          <Link to="/reports" className="text-muted-foreground hover:text-foreground transition-colors">
            Reports
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports">
              <FileText className="h-4 w-4" />
              View Reports
            </Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/submit">Submit Product</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;