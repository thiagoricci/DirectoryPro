import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Phone, Mail, User } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
}

const sampleProviders: Provider[] = [
  {
    id: '1',
    name: 'Mike\'s Plumbing Solutions',
    category: 'Plumbing',
    phone: '(555) 123-4567',
    email: 'mike@plumbingsolutions.com'
  },
  {
    id: '2',
    name: 'Elite Home Inspections',
    category: 'Home Inspector',
    phone: '(555) 987-6543',
    email: 'info@eliteinspections.com'
  },
  {
    id: '3',
    name: 'First National Mortgage',
    category: 'Lender',
    phone: '(555) 456-7890',
    email: 'loans@firstnational.com'
  },
  {
    id: '4',
    name: 'Bright Electric Co.',
    category: 'Electrical',
    phone: '(555) 234-5678',
    email: 'service@brightelectric.com'
  },
  {
    id: '5',
    name: 'Premium Title Services',
    category: 'Title Company',
    phone: '(555) 345-6789',
    email: 'info@premiumtitle.com'
  }
];

export function ClientDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProviders = sampleProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(sampleProviders.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/20">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary mr-3"></div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">Sarah Johnson</h1>
                <p className="text-sm text-muted-foreground">Licensed Real Estate Agent</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Trusted Service Providers</h2>
            <p className="text-muted-foreground">
              These are my personally recommended professionals for all your home-related needs. 
              I've worked with each of them and trust them to take great care of you.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search by name or service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </div>

        {/* Category badges */}
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Service Categories Available:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-sm">
                {category}
              </Badge>
            ))}
          </div>
        </div>

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
                No providers found matching "{searchTerm}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching for a different service type or provider name
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            Questions about these recommendations? Contact Sarah at{' '}
            <a href="tel:(555) 000-0000" className="text-primary hover:underline">
              (555) 000-0000
            </a>{' '}
            or{' '}
            <a href="mailto:sarah@realestate.com" className="text-primary hover:underline">
              sarah@realestate.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}