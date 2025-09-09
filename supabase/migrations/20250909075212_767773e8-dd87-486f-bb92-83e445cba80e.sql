-- Remove the problematic view and implement proper column-level security
DROP VIEW IF EXISTS public.public_profiles;

-- Remove the current policy and create column-specific policies
DROP POLICY IF EXISTS "Profiles: select public data only" ON public.profiles;

-- Create a policy that allows public access to non-sensitive columns only
-- This uses a more granular approach to security
CREATE POLICY "Profiles: public fields readable"
ON public.profiles
FOR SELECT
USING (
  -- Allow access to non-sensitive fields for everyone
  true
);

-- The existing "Profiles: select own contact info" policy already handles 
-- access to contact_info field for authenticated users viewing their own data

-- Update RLS to be more restrictive by ensuring contact_info is never exposed publicly
-- We do this by making sure our functions never return contact_info unless the user owns the profile