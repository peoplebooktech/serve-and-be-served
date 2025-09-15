-- Clear user data efficiently
TRUNCATE public.user_roles CASCADE;
TRUNCATE public.profiles CASCADE;
TRUNCATE public.password_reset_tokens CASCADE;

-- Delete auth users
DELETE FROM auth.users;