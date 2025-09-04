-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.get_public_profiles()
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  company TEXT,
  bio TEXT,
  skills TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
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

CREATE OR REPLACE FUNCTION public.get_public_profile_by_id(profile_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  title TEXT,
  company TEXT,
  bio TEXT,
  skills TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  contact_info TEXT,
  user_id UUID,
  is_own_profile BOOLEAN
) 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
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
    CASE 
      WHEN auth.uid() = p.user_id THEN p.contact_info
      ELSE NULL 
    END as contact_info,
    p.user_id,
    (auth.uid() = p.user_id) as is_own_profile
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;