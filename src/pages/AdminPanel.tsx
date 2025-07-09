import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, Palette, Eye, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [settings, setSettings] = useState({
    businessName: 'Your Real Estate Business',
    tagline: 'Trusted Service Providers',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    accentColor: '#06b6d4',
    contactEmail: 'contact@yourbusiness.com',
    contactPhone: '(555) 123-4567',
    bio: 'Professional real estate services with a curated network of trusted providers.',
  });

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings Saved",
      description: "Your branding settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      businessName: 'Your Real Estate Business',
      tagline: 'Trusted Service Providers',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      accentColor: '#06b6d4',
      contactEmail: 'contact@yourbusiness.com',
      contactPhone: '(555) 123-4567',
      bio: 'Professional real estate services with a curated network of trusted providers.',
    });
    setLogoFile(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const themePresets = [
    { name: 'Professional Blue', primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' },
    { name: 'Elegant Gold', primary: '#eab308', secondary: '#ca8a04', accent: '#f59e0b' },
    { name: 'Modern Green', primary: '#22c55e', secondary: '#16a34a', accent: '#10b981' },
    { name: 'Classic Red', primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' },
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
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="branding" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
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
                      <div className="h-20 w-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        {logoFile ? (
                          <img 
                            src={URL.createObjectURL(logoFile)} 
                            alt="Logo preview" 
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
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
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary,
                            accentColor: preset.accent,
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
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
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
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
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
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {logoFile ? (
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Logo" 
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-white/20 rounded"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{settings.businessName}</h3>
                    <p className="text-sm text-muted-foreground">{settings.tagline}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{settings.bio}</p>
                  <div className="flex gap-1">
                    <Badge 
                      style={{ backgroundColor: settings.accentColor }}
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