-- Tighten profiles SELECT policy to prevent public exposure of contact_info
-- 1) Drop overly permissive public SELECT policy
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;

-- 2) Allow only owners to SELECT via direct table access (authenticated users only)
CREATE POLICY "Users can view their own profiles via table"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note:
-- Public and cross-user views should be performed via SECURITY DEFINER RPCs:
--  - get_public_profiles (does not expose contact_info)
--  - get_public_profile_by_id (exposes contact_info only for owner)
-- These functions already exist and include SET search_path = 'public'.