import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Shield, ExternalLink, Check, Star, HelpCircle, DollarSign } from 'lucide-react';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account, customize your branding, and start adding your trusted service providers. You can have your directory ready in minutes."
    },
    {
      question: "Can I customize the look and feel?",
      answer: "Absolutely! You can customize colors, add your logo, business name, and contact information to match your brand perfectly."
    },
    {
      question: "How do clients access my directory?",
      answer: "You add your client's email address to the system, and they can then use that email to access your directory through the client login page. No password required - just their email address."
    },
    {
      question: "Is there a limit to how many providers I can add?",
      answer: "Our free Starter plan allows you to add up to 25 service providers. For unlimited providers and other advanced features, you can upgrade to our Professional plan."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Elite Realty Group",
      text: "This directory has been a game-changer for my business. Clients love having access to my trusted network, and it saves me so much time.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "Premier Properties",
      text: "The professional branding options make this look like a custom-built solution. My clients are impressed every time.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "Sunset Real Estate",
      text: "Simple to set up and even easier to manage. My clients appreciate having reliable service providers at their fingertips.",
      rating: 5
    }
  ];

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
              className="text-lg px-10 py-6"
            >
              <Link to="/directory/demo">
                <ExternalLink className="mr-2 h-5 w-5" />
                View Directory
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
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your professional service directory up and running in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Customize</h3>
              <p className="text-muted-foreground">
                Create your account and personalize your directory with your branding, colors, and business information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Providers</h3>
              <p className="text-muted-foreground">
                Import or manually add your trusted service providers with their contact information and specialties.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with Clients</h3>
              <p className="text-muted-foreground">
                Provide your clients with a professional, branded directory they can access anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features in Detail Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed specifically for real estate professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-3">Professional Branding</h3>
                <p className="text-muted-foreground mb-4">
                  Customize your directory with your business colors, logo, and branding to maintain a consistent professional image.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Custom colors and themes</li>
                  <li>• Business logo integration</li>
                  <li>• Personalized contact information</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
                <p className="text-muted-foreground mb-4">
                  Add, edit, and organize your service providers with our intuitive dashboard designed for busy realtors.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bulk import via CSV</li>
                  <li>• Category organization</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-3">Client Access Control</h3>
                <p className="text-muted-foreground mb-4">
                  Control who can access your directory and manage client permissions with ease.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Email-based access control</li>
                  <li>• No client login required</li>
                  <li>• Easy access revocation</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-3">Mobile Responsive</h3>
                <p className="text-muted-foreground mb-4">
                  Your directory looks great on all devices, ensuring clients can access it anywhere, anytime.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Responsive design</li>
                  <li>• Fast loading</li>
                  <li>• Search functionality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What Realtors Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of real estate professionals who trust Directory Pro
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Get answers to common questions about Directory Pro
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <HelpCircle className={`h-5 w-5 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Hidden for now
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that works best for your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  Free
                  <span className="text-lg text-muted-foreground">/forever</span>
                </div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Up to 25 service providers
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic branding customization
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Client access management
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Mobile-responsive directory
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/login">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="p-8 text-center border-primary">
              <CardContent className="p-0">
                <Badge className="mb-2">Most Popular</Badge>
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  $19
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited service providers
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Advanced branding options
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Bulk import via CSV
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/login">Start Professional Plan</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of realtors who are providing better service to their clients
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">Create Your Directory Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
