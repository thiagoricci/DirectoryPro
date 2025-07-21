import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !email.includes('@')) return;
    
    setIsLoading(true);
    
    try {
      // Check if client has access to any realtor's directory
      const { data, error } = await supabase.rpc('verify_client_access', {
        client_email_param: email.toLowerCase().trim()
      });

      if (error) {
        console.error('Error checking client access:', error);
        toast({
          title: "Access Error",
          description: "Unable to verify access. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Client access data:', data); // Debug log

      if (!data || data.length === 0) {
        toast({
          title: "Access Denied",
          description: "Your email is not authorized to access any directory. Please contact your realtor.",
          variant: "destructive",
        });
        return;
      }

      const clientAccess = data[0];
      
      if (!clientAccess.access_granted) {
        toast({
          title: "Access Expired",
          description: "Your access has expired. Please contact your realtor.",
          variant: "destructive",
        });
        return;
      }

      // Store client access info in localStorage
      localStorage.setItem('clientEmail', email.toLowerCase().trim());
      localStorage.setItem('realtorUserId', clientAccess.realtor_user_id);
      localStorage.setItem('realtorName', clientAccess.realtor_name || '');
      localStorage.setItem('realtorCompany', clientAccess.realtor_company || '');
      
      toast({
        title: "Access Granted",
        description: `Welcome! Redirecting to ${clientAccess.realtor_name || 'your realtor'}'s directory...`,
      });
      
      // Redirect to directory
      setTimeout(() => {
        window.location.href = '/directory';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/30 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
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
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking access...
              </>
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
