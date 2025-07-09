import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield, ExternalLink } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            For Real Estate Professionals
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Your Professional<br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Service Directory
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Create, manage, and share a curated directory of trusted service providers with your clients. 
            Enhance your value proposition with professional recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              className="text-lg px-8 py-3"
            >
              <Link to="/login">Get Started Free</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="text-lg px-8 py-3"
            >
              <Link to="/directory/demo">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Demo Directory
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manage Providers</h3>
              <p className="text-muted-foreground">
                Easily add, edit, and organize your trusted network of service providers in one central location.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Client-Friendly</h3>
              <p className="text-muted-foreground">
                Clients can easily search and find the right professionals for their needs through a clean interface.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Professional Branding</h3>
              <p className="text-muted-foreground">
                Share a professional, branded directory that enhances your reputation and client relationships.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Navigation */}
        <div className="text-center bg-card rounded-xl p-8 border">
          <h2 className="text-2xl font-bold mb-4">Explore the Platform</h2>
          <p className="text-muted-foreground mb-6">
            See how Directory Pro works from both perspectives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              asChild
              className="text-lg px-6"
            >
              <Link to="/dashboard">View Realtor Dashboard</Link>
            </Button>
             <Button 
              variant="outline"
              asChild
              className="text-lg px-6"
            >
              <Link to="/client-login">Client Directory Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;