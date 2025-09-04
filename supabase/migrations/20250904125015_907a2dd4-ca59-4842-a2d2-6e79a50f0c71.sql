-- Secure profiles table: restrict direct SELECT to owners; keep public access via security-definer RPCs
BEGIN;

-- Ensure RLS is enabled and enforced
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Drop ALL existing policies on public.profiles to remove any permissive public read
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT polname FROM pg_policy WHERE polrelid = 'public.profiles'::regclass LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.polname);
  END LOOP;
END$$;

-- Owner-only policies
CREATE POLICY "Profiles: select own row"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Profiles: insert own row"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Profiles: update own row"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Profiles: delete own row"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

COMMIT;