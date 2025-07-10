import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Phone, Mail, User, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  contact_name?: string;
}

export function ClientDirectory() {
  const [clientEmail, setClientEmail] = useState<string>('');
  const [realtorName, setRealtorName] = useState<string>('');
  const [realtorCompany, setRealtorCompany] = useState<string>('');
  const [realtorUserId, setRealtorUserId] = useState<string>('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem('clientEmail');
    const userId = localStorage.getItem('realtorUserId');
    const name = localStorage.getItem('realtorName');
    const company = localStorage.getItem('realtorCompany');
    
    if (!email || !userId) {
      window.location.href = '/client-login';
      return;
    }
    
    setClientEmail(email);
    setRealtorUserId(userId);
    setRealtorName(name || '');
    setRealtorCompany(company || '');
    
    fetchProviders(userId);
  }, []);

  const fetchProviders = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: "Error Loading Directory",
          description: "Unable to load service providers. Please try refreshing the page.",
          variant: "destructive",
        });
        return;
      }

      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error Loading Directory",
        description: "An unexpected error occurred while loading the directory.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('realtorUserId');
    localStorage.removeItem('realtorName');
    localStorage.removeItem('realtorCompany');
    window.location.href = '/client-login';
  };

  if (!clientEmail || !realtorUserId) {
    return null; // Will redirect to login
  }
  
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(providers.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-6">
            <div className="text-sm text-muted-foreground">
              Logged in as: {clientEmail}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary mr-3"></div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">
                  {realtorName || 'Your Realtor'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {realtorCompany || 'Licensed Real Estate Agent'}
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Trusted Service Providers</h2>
            <p className="text-muted-foreground">
              These are {realtorName ? `${realtorName}'s` : 'your realtor\'s'} personally recommended professionals for all your home-related needs. 
              They have been carefully selected to provide you with excellent service.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search by name or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Filter by Service Category:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge 
                variant={selectedCategory === '' ? "default" : "secondary"} 
                className="cursor-pointer text-sm transition-colors hover:bg-primary/80"
                onClick={() => setSelectedCategory('')}
              >
                All Services
              </Badge>
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer text-sm transition-colors hover:bg-primary/80"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategory) && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchTerm && (
                  <Badge variant="outline" className="text-xs">
                    Search: "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="outline" className="text-xs">
                    Category: {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading directory...</p>
          </div>
        ) : (
          <>
            {/* Providers Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground leading-tight">
                        {provider.name}
                      </h3>
                      <Badge variant="outline" className="ml-2 flex-shrink-0">
                        {provider.category}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {provider.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <a 
                            href={`tel:${provider.phone}`}
                            className="hover:text-primary transition-colors"
                          >
                            {provider.phone}
                          </a>
                        </div>
                      )}
                      {provider.email && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <a 
                            href={`mailto:${provider.email}`}
                            className="hover:text-primary transition-colors truncate"
                          >
                            {provider.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">
                No providers found
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="mt-3 text-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </CardContent>
          </Card>
        )}

            {/* Footer */}
            <div className="mt-12 text-center py-8 border-t">
              <p className="text-sm text-muted-foreground">
                Questions about these recommendations? Contact {realtorName || 'your realtor'} for more information.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}