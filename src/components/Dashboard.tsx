import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, ExternalLink, Users, Upload, Download } from 'lucide-react';
import Papa from 'papaparse';

interface Provider {
  id: string;
  name: string;
  category: string;
  contactName?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface Client {
  id: string;
  email: string;
  addedAt: string;
}

export function Dashboard() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'Mike\'s Plumbing Solutions',
      category: 'Plumbing',
      contactName: 'Mike Johnson',
      phone: '(555) 123-4567',
      email: 'mike@plumbingsolutions.com',
      notes: 'Available 24/7 for emergencies'
    },
    {
      id: '2',
      name: 'Elite Home Inspections',
      category: 'Home Inspector',
      contactName: 'Sarah Chen',
      phone: '(555) 987-6543',
      email: 'info@eliteinspections.com',
      notes: 'Very thorough, great reports'
    },
    {
      id: '3',
      name: 'First National Mortgage',
      category: 'Lender',
      contactName: 'David Rodriguez',
      phone: '(555) 456-7890',
      email: 'loans@firstnational.com',
      notes: 'Fast pre-approvals'
    }
  ]);

  const [clients, setClients] = useState<Client[]>([]);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: '',
    category: '',
    contactName: '',
    phone: '',
    email: '',
    notes: ''
  });

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProvider = () => {
    if (newProvider.name && newProvider.category) {
      const provider: Provider = {
        id: Date.now().toString(),
        ...newProvider
      };
      setProviders([...providers, provider]);
      setNewProvider({ name: '', category: '', contactName: '', phone: '', email: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter(p => p.id !== id));
  };

  const handleAddClient = () => {
    if (newClientEmail && newClientEmail.includes('@')) {
      const client: Client = {
        id: Date.now().toString(),
        email: newClientEmail,
        addedAt: new Date().toISOString()
      };
      setClients([...clients, client]);
      setNewClientEmail('');
    }
  };

  const handleRemoveClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const downloadTemplate = () => {
    const template = `Name,Category,Contact Name,Phone,Email,Notes
Mike's Plumbing Solutions,Plumbing,Mike Johnson,(555) 123-4567,mike@plumbing.com,Available 24/7
Elite Home Inspections,Home Inspector,Sarah Chen,(555) 987-6543,info@elite.com,Very thorough`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'provider-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validProviders: Provider[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          if (!row.Name || !row.Category) {
            errors.push(`Row ${index + 2}: Name and Category are required`);
            return;
          }

          validProviders.push({
            id: Date.now().toString() + index,
            name: row.Name,
            category: row.Category,
            contactName: row['Contact Name'] || '',
            phone: row.Phone || '',
            email: row.Email || '',
            notes: row.Notes || ''
          });
        });

        if (errors.length > 0) {
          toast({
            title: "Import Warnings",
            description: `${validProviders.length} providers imported. ${errors.length} rows had errors.`,
          });
        } else {
          toast({
            title: "Import Successful",
            description: `Successfully imported ${validProviders.length} providers.`,
          });
        }

        setProviders([...providers, ...validProviders]);
        setShowImportDialog(false);
      },
      error: (error) => {
        toast({
          title: "Import Error",
          description: "Failed to parse the CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Service Provider Directory</h1>
        <p className="text-muted-foreground">Manage your trusted network of service providers and share with clients.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Providers</p>
                <p className="text-2xl font-bold text-foreground">{providers.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(providers.map(p => p.category)).size}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent border-accent">
          <CardContent className="p-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Client Access Management</p>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter client email..."
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleAddClient}>
                  Add Client
                </Button>
              </div>
              {clients.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{clients.length} client(s) with access</p>
                  {clients.slice(0, 2).map((client) => (
                    <div key={client.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{client.email}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveClient(client.id)}>
                        ×
                      </Button>
                    </div>
                  ))}
                  {clients.length > 2 && (
                    <p className="text-xs text-muted-foreground">+{clients.length - 2} more</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search providers or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Service Providers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Upload a CSV file with your service providers. Required columns: Name, Category
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={downloadTemplate} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    ref={fileInputRef}
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowAddForm(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>
      </div>

      {/* Add Provider Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Service Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Provider Name *</Label>
                <Input
                  id="name"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  placeholder="e.g., Mike's Plumbing Solutions"
                />
              </div>
              <div>
                <Label htmlFor="category">Service Category *</Label>
                <Input
                  id="category"
                  value={newProvider.category}
                  onChange={(e) => setNewProvider({...newProvider, category: e.target.value})}
                  placeholder="e.g., Plumbing, Electrical, etc."
                />
              </div>
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={newProvider.contactName}
                  onChange={(e) => setNewProvider({...newProvider, contactName: e.target.value})}
                  placeholder="e.g., Mike Johnson"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={newProvider.email}
                  onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                  placeholder="contact@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newProvider.notes}
                onChange={(e) => setNewProvider({...newProvider, notes: e.target.value})}
                placeholder="Any additional notes about this provider..."
                rows={2}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProvider}>Add Provider</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Providers List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                    <Badge variant="secondary">{provider.category}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {provider.contactName && <p>👤 {provider.contactName}</p>}
                    {provider.phone && <p>📞 {provider.phone}</p>}
                    {provider.email && <p>✉️ {provider.email}</p>}
                    {provider.notes && <p className="italic">"{provider.notes}"</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No providers found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}