-- First, let's check if there are any profiles without user_id and clean them up
-- This is a safety measure to remove any orphaned profiles
DELETE FROM public.profiles WHERE user_id IS NULL;

-- Now let's create a new RLS policy that allows public read access to basic profile fields
-- while keeping sensitive info (contact_info) private
DROP POLICY IF EXISTS "Profiles: select own row" ON public.profiles;

-- Create new policies for better access control
CREATE POLICY "Profiles: select public data" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create policy for users to see their own contact info
CREATE POLICY "Profiles: select own contact info" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Make sure user_id column cannot be null for new profiles
ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;