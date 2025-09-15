-- Delete all users who signed up with email/password using a Gmail address
-- Safely remove related data from public schema as well
BEGIN;

-- Collect target users: Gmail addresses with email/password provider
CREATE TEMP TABLE tmp_target_users ON COMMIT DROP AS
SELECT u.id, u.email
FROM auth.users u
JOIN auth.identities i ON i.user_id = u.id
WHERE u.email ILIKE '%@gmail.com'
  AND i.provider = 'email';

-- Remove related public data first
DELETE FROM public.user_roles ur
WHERE ur.user_id IN (SELECT id FROM tmp_target_users);

DELETE FROM public.profiles p
WHERE p.user_id IN (SELECT id FROM tmp_target_users);

DELETE FROM public.password_reset_tokens prt
WHERE prt.email IN (SELECT email FROM tmp_target_users);

-- Remove auth identities (defensive; may cascade from users as well)
DELETE FROM auth.identities i
WHERE i.user_id IN (SELECT id FROM tmp_target_users);

-- Finally remove the users themselves
DELETE FROM auth.users u
WHERE u.id IN (SELECT id FROM tmp_target_users);

COMMIT;
