-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_public_profiles();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table with user metadata
  INSERT INTO public.profiles (
    id, 
    user_id, 
    name
  )
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.raw_user_meta_data ->> 'name'
  );

  -- Insert user role from metadata
  IF NEW.raw_user_meta_data ->> 'role' IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, (NEW.raw_user_meta_data ->> 'role')::app_role);
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update profiles table to have better RLS policies for public viewing
DROP POLICY IF EXISTS "Profiles: select public info" ON public.profiles;
CREATE POLICY "Profiles: select public info"
ON public.profiles
FOR SELECT
USING (true);

-- Recreate the get_public_profiles function with user roles
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
  updated_at timestamp with time zone,
  user_roles text[]
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
    COALESCE(
      array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL),
      '{}'::text[]
    ) as user_roles
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
  GROUP BY p.id, p.name, p.title, p.company, p.bio, p.skills, p.image_url, p.created_at, p.updated_at
  ORDER BY p.created_at DESC;
$$;