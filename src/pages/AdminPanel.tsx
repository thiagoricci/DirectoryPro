import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Palette, Eye, Save, RotateCcw, Plus, Trash2, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface ClientAccess {
  id: string;
  client_email: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
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

const AdminPanel = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clientAccess, setClientAccess] = useState<ClientAccess[]>([]);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<RealtorSettings>({
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

  useEffect(() => {
    if (user) {
      fetchClientAccess();
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('realtor_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setSettings({
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
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "Failed to load your branding settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAccess = async () => {
    if (!user) return;
    
    setIsLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from('client_access')
        .select('*')
        .eq('realtor_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client access:', error);
        toast({
          title: "Error Loading Clients",
          description: "Unable to load client access list.",
          variant: "destructive",
        });
        return;
      }

      setClientAccess(data || []);
    } catch (error) {
      console.error('Error fetching client access:', error);
    } finally {
      setIsLoadingClients(false);
    }
  };

  const addClientAccess = async () => {
    if (!user || !newClientEmail || !newClientEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const emailToAdd = newClientEmail.toLowerCase().trim();
      
      const { error } = await supabase
        .from('client_access')
        .insert({
          realtor_user_id: user.id,
          client_email: emailToAdd,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Client Already Added",
            description: "This client already has access to your directory.",
            variant: "destructive",
          });
        } else {
          console.error('Error adding client access:', error);
          toast({
            title: "Error Adding Client",
            description: "Unable to add client access. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Client Added Successfully",
        description: `${emailToAdd} can now access your directory.`,
      });
      
      setNewClientEmail('');
      fetchClientAccess();
    } catch (error) {
      console.error('Error adding client access:', error);
    }
  };

  const removeClientAccess = async (id: string, email: string) => {
    try {
      const { error } = await supabase
        .from('client_access')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing client access:', error);
        toast({
          title: "Error Removing Access",
          description: "Unable to remove client access. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Access Removed",
        description: `${email} no longer has access to your directory.`,
      });
      
      fetchClientAccess();
    } catch (error) {
      console.error('Error removing client access:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('realtor_settings')
        .upsert({
          user_id: user.id,
          ...settings,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      // Apply theme changes immediately
      const root = document.documentElement;
      
      // Convert hex to HSL for CSS custom properties
      const hexToHsl = (hex: string): string => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
          }
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      const getContrastColor = (hexColor: string): string => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '0 0% 0%' : '0 0% 100%';
      };

      // Apply theme changes
      root.style.setProperty('--color-primary', settings.primary_color);
      root.style.setProperty('--color-secondary', settings.secondary_color);
      root.style.setProperty('--color-accent', settings.accent_color);
      
      root.style.setProperty('--primary', hexToHsl(settings.primary_color));
      root.style.setProperty('--secondary', hexToHsl(settings.secondary_color));
      root.style.setProperty('--accent', hexToHsl(settings.accent_color));
      
      root.style.setProperty('--primary-foreground', getContrastColor(settings.primary_color));
      root.style.setProperty('--secondary-foreground', getContrastColor(settings.secondary_color));
      root.style.setProperty('--accent-foreground', getContrastColor(settings.accent_color));

      toast({
        title: "Settings Saved",
        description: "Your branding settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "Failed to save your branding settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({
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
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Delete old logo if exists
      if (settings.logo_url) {
        const oldPath = settings.logo_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('realtor-logos')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new logo
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('realtor-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('realtor-logos')
        .getPublicUrl(filePath);

      setSettings({ ...settings, logo_url: data.publicUrl });

      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully. Don't forget to save your settings.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const themePresets = [
    { name: 'Default Blue', primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' },
    { name: 'Professional Slate', primary: '#475569', secondary: '#64748b', accent: '#94a3b8' },
    { name: 'Navy Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
    { name: 'Ruby Red', primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' },
    { name: 'Dark Brown', primary: '#7c2d12', secondary: '#a16207', accent: '#ca8a04' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Customize your directory branding and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>

            {/* Branding Tab */}
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Business Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="logo">Business Logo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="h-20 w-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center overflow-hidden">
                          {settings.logo_url ? (
                            <img 
                              src={settings.logo_url} 
                              alt="Logo preview" 
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <Input
                            ref={fileInputRef}
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            {settings.logo_url ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={settings.business_name}
                        onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      />
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Theme Presets</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {themePresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-start"
                          onClick={() => setSettings({
                            ...settings,
                            primary_color: preset.primary,
                            secondary_color: preset.secondary,
                            accent_color: preset.accent,
                          })}
                        >
                          <div className="flex gap-1 mb-1">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <span className="text-xs">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accent_color}
                        onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contact_phone}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">About / Bio</Label>
                      <Textarea
                        id="bio"
                        rows={4}
                        value={settings.bio}
                        onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                      />
                    </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Management Tab */}
            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Directory Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="clientEmail">Client Email Address</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        placeholder="client@example.com"
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addClientAccess()}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={addClientAccess}
                        disabled={!newClientEmail || !newClientEmail.includes('@')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg">
                    <div className="p-4 border-b bg-muted/50">
                      <h4 className="font-medium">Authorized Clients</h4>
                      <p className="text-sm text-muted-foreground">
                        Clients who can access your service provider directory
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {isLoadingClients ? (
                        <div className="p-4 text-center text-muted-foreground">
                          Loading clients...
                        </div>
                      ) : clientAccess.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No clients have been granted access yet.
                        </div>
                      ) : (
                        clientAccess.map((client) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between p-4 border-b last:border-b-0"
                          >
                            <div>
                              <p className="font-medium">{client.client_email}</p>
                              <p className="text-sm text-muted-foreground">
                                Added {new Date(client.created_at).toLocaleDateString()}
                                {client.expires_at && ` • Expires ${new Date(client.expires_at).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={client.is_active ? "default" : "secondary"}>
                                {client.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeClientAccess(client.id, client.client_email)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Add client email addresses to grant access to your directory</li>
                      <li>Clients visit the client login page and enter their email</li>
                      <li>They'll see your service provider directory in read-only mode</li>
                      <li>Remove access anytime by clicking the trash icon</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center space-x-3 mb-4">
                  {settings.logo_url ? (
                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                      <img 
                        src={settings.logo_url} 
                        alt="Logo" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      <div className="h-8 w-8 bg-white/20 rounded"></div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-foreground">{settings.business_name}</h3>
                    <p className="text-sm text-muted-foreground">{settings.tagline}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{settings.bio}</p>
                  <div className="flex gap-1">
                    <Badge 
                      style={{ backgroundColor: settings.accent_color }}
                      className="text-white"
                    >
                      Professional
                    </Badge>
                    <Badge variant="outline">Trusted Network</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
