-- Create client_access table to manage which clients can access which realtor's directory
CREATE TABLE public.client_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  realtor_user_id UUID NOT NULL,
  client_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT unique_realtor_client UNIQUE (realtor_user_id, client_email)
);

-- Enable Row Level Security
ALTER TABLE public.client_access ENABLE ROW LEVEL SECURITY;

-- Create policies for client_access table
-- Realtors can manage their own client access records
CREATE POLICY "Realtors can view their own client access records" 
ON public.client_access 
FOR SELECT 
USING (auth.uid() = realtor_user_id);

CREATE POLICY "Realtors can create client access records" 
ON public.client_access 
FOR INSERT 
WITH CHECK (auth.uid() = realtor_user_id);

CREATE POLICY "Realtors can update their own client access records" 
ON public.client_access 
FOR UPDATE 
USING (auth.uid() = realtor_user_id);

CREATE POLICY "Realtors can delete their own client access records" 
ON public.client_access 
FOR DELETE 
USING (auth.uid() = realtor_user_id);

-- Create function to check client access (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_client_access(client_email_param TEXT)
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
    p.full_name as realtor_name,
    p.company as realtor_company,
    (ca.is_active AND (ca.expires_at IS NULL OR ca.expires_at > now())) as access_granted
  FROM client_access ca
  JOIN profiles p ON p.user_id = ca.realtor_user_id
  WHERE ca.client_email = client_email_param
  AND ca.is_active = true
  AND (ca.expires_at IS NULL OR ca.expires_at > now())
  ORDER BY ca.created_at DESC
  LIMIT 1;
END;
$$;