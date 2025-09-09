-- CRITICAL FIX: Remove the insecure public policy entirely
-- RLS policies work at row-level, not column-level, so our previous policy 
-- was still exposing contact_info to everyone

-- Remove the insecure policy that allows public access to all fields
DROP POLICY IF EXISTS "Profiles: public fields readable" ON public.profiles;

-- DO NOT create any public read policy for the profiles table
-- This ensures that ONLY authenticated users can access profiles directly
-- and public access must go through controlled SECURITY DEFINER functions

-- The existing policies remain and provide proper security:
-- 1. "Profiles: select own contact info" - allows users to see their own data including contact_info
-- 2. "Profiles: insert own row" - allows users to create their profile  
-- 3. "Profiles: update own row" - allows users to update their profile
-- 4. "Profiles: delete own row" - allows users to delete their profile

-- Public access is ONLY available through the get_public_profiles() function
-- which is SECURITY DEFINER and explicitly excludes contact_info
-- This is the secure way to provide public profile data

-- Verify that our public functions are secure by ensuring they never return contact_info
-- The get_public_profiles() function already only returns safe fields
-- The get_public_profile_by_id() function already has conditional logic for contact_info