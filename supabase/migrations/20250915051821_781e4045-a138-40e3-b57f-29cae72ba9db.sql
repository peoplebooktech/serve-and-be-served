-- Delete all user data
-- Start with tables that reference users, then delete users themselves

-- Delete all user roles
DELETE FROM public.user_roles;

-- Delete all profiles
DELETE FROM public.profiles;

-- Delete all password reset tokens
DELETE FROM public.password_reset_tokens;

-- Delete all users from auth.users (this will cascade any remaining references)
DELETE FROM auth.users;