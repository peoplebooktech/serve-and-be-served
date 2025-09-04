-- Remove overly permissive public SELECT policy exposing contact_info
DROP POLICY IF EXISTS "Profiles: select public data" ON public.profiles;