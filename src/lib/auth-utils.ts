import { supabase } from '@/integrations/supabase/client';

/**
 * Clears all authentication state and forces a fresh start
 */
export const clearAuthState = async () => {
  try {
    console.log('Clearing all authentication state...');
    
    // Sign out from Supabase first
    await supabase.auth.signOut();
    
    // Clear all localStorage items
    localStorage.clear();
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    
    // Clear any Supabase specific storage
    localStorage.removeItem('supabase.auth.token');
    
    // Clear any remaining auth-related items
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('auth'))) {
        localStorage.removeItem(key);
      }
    }
    
    console.log('Authentication state cleared successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing auth state:', error);
    return { success: false, error };
  }
};

/**
 * Forces a complete application reset
 */
export const forceAuthReset = async () => {
  await clearAuthState();
  
  // Force reload for complete fresh start
  window.location.href = '/auth';
};