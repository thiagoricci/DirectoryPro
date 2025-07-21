-- Add plan column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'starter';

-- Create index for plan queries
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);

-- Update existing profiles to have starter plan
UPDATE public.profiles 
SET plan = 'starter' 
WHERE plan IS NULL;

-- Add plan to realtor_settings for consistency
ALTER TABLE public.realtor_settings 
ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'starter';

-- Update existing realtor_settings
UPDATE public.realtor_settings 
SET plan = 'starter' 
WHERE plan IS NULL;
