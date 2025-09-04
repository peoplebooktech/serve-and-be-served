-- Add user_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure RLS policies
CREATE POLICY "Profiles are publicly viewable" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create their own profiles" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create public-safe RPC functions
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