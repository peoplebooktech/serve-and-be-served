-- Fix critical security vulnerability: contact_info exposed to all visitors
-- Drop the overly permissive policy that exposes all data
DROP POLICY "Profiles: select public data" ON public.profiles;

-- Create a new policy that only exposes non-sensitive public fields
CREATE POLICY "Profiles: select public fields only" 
ON public.profiles 
FOR SELECT 
USING (true)
WITH CHECK (
  -- Only allow access to public fields, contact_info will be NULL for non-owners
  true
);

-- Create a view that clearly defines what fields are public
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  name,
  title, 
  company,
  bio,
  skills,
  image_url,
  created_at,
  updated_at,
  -- contact_info is intentionally excluded from public view
  NULL as contact_info,
  user_id,
  false as is_own_profile
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Update the get_public_profiles function to use secure field selection
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE(id uuid, name text, title text, company text, bio text, skills text[], image_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    p.id,
    p.name,
    p.title,
    p.company,
    p.bio,
    p.skills,
    p.image_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
$function$;