import { supabase } from '@/integrations/supabase/client';

/**
 * Clears all authentication state and forces a fresh start
 */
export const clearAuthState = async () => {
  try {
    // Sign out from Supabase first
    await supabase.auth.signOut();
    
    // Clear Supabase specific storage keys only
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing auth state');
    return { success: false, error };
  }
};

/**
 * Forces a complete application reset
 */
export const forceAuthReset = async () => {
  await clearAuthState();
  window.location.href = '/auth';
};