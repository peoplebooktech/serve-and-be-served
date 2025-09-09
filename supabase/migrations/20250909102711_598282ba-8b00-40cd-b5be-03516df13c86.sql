-- Add admin role to the enum (must be in separate transaction)
ALTER TYPE public.app_role ADD VALUE 'admin';