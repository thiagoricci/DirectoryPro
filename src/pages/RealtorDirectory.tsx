import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Provider {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  contact_name?: string;
}

interface Profile {
  company?: string;
  full_name?: string;
}

interface RealtorSettings {
  business_name: string;
  tagline: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  contact_email?: string;
  contact_phone?: string;
  bio: string;
}

export function RealtorDirectory() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [profile, setProfile] = useState<Profile>({
    company: 'Your Real Estate Business',
    full_name: '',
  });
  const [realtorSettings, setRealtorSettings] = useState<RealtorSettings>({
    business_name: 'Your Real Estate Business',
    tagline: 'Trusted Service Providers',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    accent_color: '#06b6d4',
    contact_email: '',
    contact_phone: '',
    bio: 'Professional real estate services with a curated network of trusted providers.',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchProviders(user.id);
    fetchRealtorSettings(user.id);
    fetchProfile(user.id);
  }, [user]);

  const fetchProviders = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: "Error Loading Directory",
          description: "Unable to load service providers.",
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

  const fetchRealtorSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('realtor_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching realtor settings:', error);
        return;
      }

      if (data) {
        setRealtorSettings({
          business_name: data.business_name,
          tagline: data.tagline,
          logo_url: data.logo_url || '',
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          bio: data.bio,
        });
      }
    } catch (error) {
      console.error('Error fetching realtor settings:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company, full_name')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          company: data.company || 'Your Real Estate Business',
          full_name: data.full_name || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your directory.</p>
      </div>
    );
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
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              {realtorSettings.logo_url ? (
                <div className="h-12 w-12 rounded-xl mr-3 overflow-hidden">
                  <img 
                    src={realtorSettings.logo_url} 
                    alt="Business Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="h-12 w-12 rounded-xl mr-3"
                  style={{ backgroundColor: realtorSettings.primary_color }}
                ></div>
              )}
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.company || realtorSettings.business_name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {realtorSettings.business_name}
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{realtorSettings.tagline}</h2>
            <p className="text-muted-foreground">
              {realtorSettings.bio}
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
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <div className="mt-12 text-center py-8 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Questions about these recommendations? Contact {profile.company} for more information.
              </p>
              {(realtorSettings.contact_email || realtorSettings.contact_phone) && (
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  {realtorSettings.contact_email && (
                    <a 
                      href={`mailto:${realtorSettings.contact_email}`}
                      className="hover:text-primary transition-colors"
                    >
                      📧 {realtorSettings.contact_email}
                    </a>
                  )}
                  {realtorSettings.contact_phone && (
                    <a 
                      href={`tel:${realtorSettings.contact_phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      📞 {realtorSettings.contact_phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RealtorDirectory;
