import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    // Mock authentication - in real app, check if client email exists
    setTimeout(() => {
      localStorage.setItem('clientEmail', email);
      window.location.href = '/directory';
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="h-12 w-12 rounded-xl bg-primary mx-auto mb-4"></div>
          <CardTitle className="text-2xl">Client Directory Access</CardTitle>
          <p className="text-muted-foreground">
            Enter your email to access your realtor's service provider directory
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={!email || !email.includes('@') || isLoading}
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Access Directory
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Only clients who have been given access by their realtor can view the directory.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientLogin;