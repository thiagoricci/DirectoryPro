-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search_path for verify_client_access function
CREATE OR REPLACE FUNCTION public.verify_client_access(client_email_input TEXT)
RETURNS TABLE (
  realtor_id UUID,
  realtor_name TEXT,
  realtor_company TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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