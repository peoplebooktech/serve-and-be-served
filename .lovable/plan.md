

## Plan: Switch to Supabase Built-in Password Reset

The current custom edge function approach fails because Resend's free tier only allows sending to the account owner's email. Supabase has a built-in password reset flow that works out of the box with no domain verification needed.

### Changes

**1. Update `handleForgotPassword` in `src/pages/Auth.tsx`**
- Replace `supabase.functions.invoke('send-reset-email', ...)` with `supabase.auth.resetPasswordForEmail(email, { redirectTo })`
- The `redirectTo` URL will point to `/reset-password` (without a token param, since Supabase handles tokens via URL fragments)

**2. Update `src/pages/ResetPassword.tsx`**
- Remove custom token validation and `reset-password-with-token` edge function call
- Instead, on mount, listen for Supabase's `PASSWORD_RECOVERY` auth event via `supabase.auth.onAuthStateChange`
- When the recovery session is established, use `supabase.auth.updateUser({ password })` to set the new password
- This is the standard Supabase flow and requires no custom edge functions

**3. Update routing in `src/App.tsx`**
- Change `/reset-password/:token` to `/reset-password` (no token param needed — Supabase uses hash fragments)

### What This Fixes
- Eliminates dependency on Resend entirely for password reset
- Supabase sends the reset email using its own email infrastructure (works immediately)
- No domain verification required

