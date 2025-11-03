-- Create realtor_settings table
CREATE TABLE IF NOT EXISTS public.realtor_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1EAEDB',
  secondary_color TEXT DEFAULT '#0FA0CE',
  accent_color TEXT DEFAULT '#33C3F0',
  contact_email TEXT,
  contact_phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create client_access table
CREATE TABLE IF NOT EXISTS public.client_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  realtor_id UUID NOT NULL,
  client_email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(realtor_id, client_email)
);

-- Create service_providers table
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  realtor_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.realtor_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for realtor_settings
CREATE POLICY "Users can view their own settings"
  ON public.realtor_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.realtor_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.realtor_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for client_access
CREATE POLICY "Realtors can view their client access"
  ON public.client_access FOR SELECT
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can insert client access"
  ON public.client_access FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

CREATE POLICY "Realtors can delete their client access"
  ON public.client_access FOR DELETE
  USING (auth.uid() = realtor_id);

-- RLS Policies for service_providers
CREATE POLICY "Realtors can view their providers"
  ON public.service_providers FOR SELECT
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can insert providers"
  ON public.service_providers FOR INSERT
  WITH CHECK (auth.uid() = realtor_id);

CREATE POLICY "Realtors can update their providers"
  ON public.service_providers FOR UPDATE
  USING (auth.uid() = realtor_id);

CREATE POLICY "Realtors can delete their providers"
  ON public.service_providers FOR DELETE
  USING (auth.uid() = realtor_id);

-- Create function to verify client access
CREATE OR REPLACE FUNCTION public.verify_client_access(client_email_input TEXT)
RETURNS TABLE (
  realtor_id UUID,
  realtor_name TEXT,
  realtor_company TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ca.realtor_id,
    COALESCE(rs.business_name, u.email) as realtor_name,
    rs.business_name as realtor_company
  FROM public.client_access ca
  LEFT JOIN public.realtor_settings rs ON ca.realtor_id = rs.user_id
  LEFT JOIN auth.users u ON ca.realtor_id = u.id
  WHERE ca.client_email = client_email_input
    AND ca.is_active = true
    AND (ca.expires_at IS NULL OR ca.expires_at > now());
END;
$$;

-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('realtor-logos', 'realtor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for realtor-logos
CREATE POLICY "Users can upload their own logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'realtor-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'realtor-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'realtor-logos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'realtor-logos');

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_realtor_settings_updated_at
  BEFORE UPDATE ON public.realtor_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_providers_updated_at
  BEFORE UPDATE ON public.service_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();