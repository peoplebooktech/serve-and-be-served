-- Fix critical security vulnerability: Remove public access to contact_info
-- The current "Public can view basic profile info" policy allows direct table access
-- to all columns including sensitive contact_info field

-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;

-- Remove the duplicate policy if it exists
DROP POLICY IF EXISTS "Users can view their own full profile" ON public.profiles;

-- Create a restrictive policy that only allows users to access their own profiles directly
CREATE POLICY "Users can access their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- For public access, users must go through the secure get_public_profiles() function
-- which explicitly excludes contact_info and other sensitive data

-- Ensure the get_public_profiles function is properly secured
-- Update it to make it clear it's for public use and doesn't require auth
DROP FUNCTION IF EXISTS public.get_public_profiles();

CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE(
  id uuid, 
  name text, 
  title text, 
  company text, 
  bio text, 
  skills text[], 
  image_url text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- This function provides public access to non-sensitive profile data only
  -- contact_info and user_id are explicitly excluded for security
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
$$;

-- Update the authenticated profiles function to be more explicit about security
DROP FUNCTION IF EXISTS public.get_authenticated_profiles();

CREATE OR REPLACE FUNCTION public.get_authenticated_profiles()
RETURNS TABLE(
  id uuid, 
  name text, 
  title text, 
  company text, 
  bio text, 
  skills text[], 
  image_url text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  user_roles text[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- This function provides authenticated users with enhanced profile data
  -- Still excludes contact_info unless it's the user's own profile
  SELECT 
    p.id,
    p.name,
    p.title,
    p.company,
    p.bio,
    p.skills,
    p.image_url,
    p.created_at,
    p.updated_at,
    COALESCE(
      array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL),
      '{}'::text[]
    ) as user_roles
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  WHERE auth.uid() IS NOT NULL  -- Require authentication
  GROUP BY p.id, p.name, p.title, p.company, p.bio, p.skills, p.image_url, p.created_at, p.updated_at
  ORDER BY p.created_at DESC;
$$;

-- The get_public_profile_by_id function already handles contact_info correctly
-- by only showing it to the profile owner, so no changes needed there

-- Grant appropriate permissions
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated; -- Only for own profiles via RLS

GRANT EXECUTE ON FUNCTION public.get_public_profiles() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_authenticated_profiles() TO authenticated;

-- Ensure the existing get_public_profile_by_id function permissions are correct
GRANT EXECUTE ON FUNCTION public.get_public_profile_by_id(uuid) TO anon, authenticated;