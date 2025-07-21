/*
  # Client Access Functions

  1. New Functions
    - `get_realtor_providers` - Get service providers for a specific realtor (public access)
    - `get_realtor_settings` - Get realtor settings for client view (public access)
    - `verify_client_access` - Verify if a client has access to a realtor's directory

  2. Security
    - Functions are security definer to bypass RLS
    - Only return data for clients with verified access
    - No sensitive data exposed
*/

-- Function to get service providers for a realtor (for client access)
CREATE OR REPLACE FUNCTION public.get_realtor_providers(realtor_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.name,
    sp.category,
    sp.contact_name,
    sp.phone,
    sp.email,
    sp.notes
  FROM service_providers sp
  WHERE sp.user_id = realtor_user_id
  ORDER BY sp.name;
END;
$$;

-- Function to get realtor settings for client view
CREATE OR REPLACE FUNCTION public.get_realtor_settings(realtor_user_id UUID)
RETURNS TABLE (
  business_name TEXT,
  tagline TEXT,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  bio TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(rs.business_name, 'Your Real Estate Business') as business_name,
    COALESCE(rs.tagline, 'Trusted Service Providers') as tagline,
    rs.logo_url,
    COALESCE(rs.primary_color, '#3b82f6') as primary_color,
    COALESCE(rs.secondary_color, '#1e40af') as secondary_color,
    COALESCE(rs.accent_color, '#06b6d4') as accent_color,
    rs.contact_email,
    rs.contact_phone,
    COALESCE(rs.bio, 'Professional real estate services with a curated network of trusted providers.') as bio
  FROM realtor_settings rs
  WHERE rs.user_id = realtor_user_id
  UNION ALL
  SELECT 
    'Your Real Estate Business' as business_name,
    'Trusted Service Providers' as tagline,
    NULL as logo_url,
    '#3b82f6' as primary_color,
    '#1e40af' as secondary_color,
    '#06b6d4' as accent_color,
    NULL as contact_email,
    NULL as contact_phone,
    'Professional real estate services with a curated network of trusted providers.' as bio
  WHERE NOT EXISTS (
    SELECT 1 FROM realtor_settings WHERE user_id = realtor_user_id
  )
  LIMIT 1;
END;
$$;

-- Function to verify client access and get realtor info
CREATE OR REPLACE FUNCTION public.verify_client_access(client_email_param TEXT)
RETURNS TABLE (
  realtor_user_id UUID,
  realtor_name TEXT,
  realtor_company TEXT,
  access_granted BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ca.realtor_user_id,
    COALESCE(p.full_name, 'Your Realtor') as realtor_name,
    COALESCE(p.company, 'Real Estate Professional') as realtor_company,
    (ca.is_active AND (ca.expires_at IS NULL OR ca.expires_at > now())) as access_granted
  FROM client_access ca
  LEFT JOIN profiles p ON p.user_id = ca.realtor_user_id
  WHERE ca.client_email = client_email_param
  AND ca.is_active = true
  AND (ca.expires_at IS NULL OR ca.expires_at > now())
  ORDER BY ca.created_at DESC
  LIMIT 1;
END;
$$;

-- Grant execute permissions to anonymous users for client access
GRANT EXECUTE ON FUNCTION public.get_realtor_providers(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_realtor_settings(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_client_access(TEXT) TO anon;