import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'consumer' | 'producer' | 'ad_hoc';

export interface UserWithRoles extends User {
  roles?: AppRole[];
}

interface AuthContextType {
  user: UserWithRoles | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string, role: AppRole) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  getUserRoles: (userId: string) => Promise<AppRole[]>;
  assignUserRole: (userId: string, role: AppRole) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dev-only logger to prevent information leakage in production
const devLog = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (import.meta.env.DEV) {
      console.error('useAuth called outside of AuthProvider.');
      console.trace('Stack trace for useAuth error:');
    }
    throw new Error('useAuth must be used within an AuthProvider. Check that your component is properly wrapped.');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to fetch user roles
  const fetchUserRoles = async (userId: string): Promise<AppRole[]> => {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', { _user_id: userId });
      if (error) {
        console.error('Error fetching user roles:', error.message);
        return [];
      }
      return data?.map((item: any) => item.role) || [];
    } catch (err) {
      console.error('Exception fetching user roles:', err);
      return [];
    }
  };

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) return;
        devLog('Auth state change:', event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          return;
        }

        setSession(currentSession);

        if (currentSession?.user) {
          setTimeout(async () => {
            if (!isMounted) return;
            try {
              const roles = await fetchUserRoles(currentSession.user.id);
              if (isMounted) setUser({ ...currentSession.user, roles });
            } catch {
              if (isMounted) setUser(currentSession.user);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        devLog('Initial session check:', initialSession ? 'session exists' : 'no session');
        setSession(initialSession);

        if (initialSession?.user) {
          try {
            const roles = await fetchUserRoles(initialSession.user.id);
            if (isMounted) setUser({ ...initialSession.user, roles });
          } catch {
            if (isMounted) setUser(initialSession.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in initial session check:', error instanceof Error ? error.message : 'Unknown error');
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: AppRole) => {
    try {
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      
      devLog('Starting signup process...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
            role: role
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        
        if (error.message === 'User already registered') {
          return { 
            error: { 
              message: 'An account with this email already exists. Please try signing in instead, or use the "Resend Confirmation Email" button if you haven\'t confirmed your email yet.'
            } 
          };
        }
        
        if (error.message?.includes('already been registered')) {
          return { 
            error: { 
              message: 'This email is already registered. Please sign in instead or use "Resend Confirmation Email" if you need to confirm your account.'
            } 
          };
        }
        
        return { error };
      }
      
      if (data?.user && !data?.session) {
        devLog('User created, confirmation email should be sent');
        
        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              email: email,
              name: name,
              role: role
            }
          });
          devLog('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send welcome email');
        }
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Signup exception:', err instanceof Error ? err.message : 'Unknown error');
      return { error: err };
    }
  };

  const getUserRoles = async (userId: string): Promise<AppRole[]> => {
    return await fetchUserRoles(userId);
  };

  const assignUserRole = async (userId: string, role: AppRole) => {
    devLog('Direct role assignment from client is disabled. Roles are assigned via database trigger during signup.');
    return { error: { message: 'Role assignment is handled by the server during signup' } };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      devLog('Sign in completed');
      
      if (error) {
        console.error('Sign in error:', error.message);
        
        if (error.message === 'Invalid login credentials') {
          return { 
            error: { 
              message: 'Invalid email or password. Please check your credentials and try again.'
            } 
          };
        } else if (error.message === 'Email not confirmed') {
          return { 
            error: { 
              message: 'Please check your email and click the confirmation link before signing in. Check your spam folder if needed.'
            } 
          };
        } else if (error.message?.includes('signup') || error.message?.includes('confirm')) {
          return { 
            error: { 
              message: 'Account not confirmed. Please check your email for the confirmation link or click "Resend Confirmation" below.'
            } 
          };
        }
        
        return { error };
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Sign in exception:', err instanceof Error ? err.message : 'Unknown error');
      return { error: err };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });
      
      devLog('Resend confirmation completed');
      return { error };
    } catch (err: any) {
      console.error('Resend confirmation exception:', err instanceof Error ? err.message : 'Unknown error');
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      devLog('Starting sign out process...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
      }
      
      setUser(null);
      setSession(null);
      
      devLog('Sign out successful');
      
      window.location.href = '/auth';
    } catch (err) {
      console.error('Sign out exception:', err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    getUserRoles,
    assignUserRole,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};