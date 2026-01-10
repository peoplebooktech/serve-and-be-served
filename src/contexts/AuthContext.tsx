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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // More descriptive error message and check if we're in development
    console.error('useAuth called outside of AuthProvider. Make sure the component is wrapped in AuthProvider.');
    console.trace('Stack trace for useAuth error:');
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
        console.error('Error fetching user roles:', error);
        return [];
      }
      return data?.map((item: any) => item.role) || [];
    } catch (err) {
      console.error('Exception fetching user roles:', err);
      return [];
    }
  };

  useEffect(() => {
    // Clear any existing auth state first
    setUser(null);
    setSession(null);
    setLoading(true);

    // Clear localStorage auth state
    localStorage.removeItem('supabase.auth.token');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          try {
            const roles = await fetchUserRoles(session.user.id);
            setUser({ ...session.user, roles });
          } catch (error) {
            console.error('Error fetching user roles:', error);
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for initial session after a small delay to ensure clean state
    const checkInitialSession = async () => {
      try {
        // Clear any potential cached session first
        await supabase.auth.refreshSession();
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', initialSession?.user?.email);
        
        if (error) {
          console.error('Error getting initial session:', error);
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }

        if (initialSession?.user) {
          try {
            const roles = await fetchUserRoles(initialSession.user.id);
            setUser({ ...initialSession.user, roles });
            setSession(initialSession);
          } catch (error) {
            console.error('Error fetching initial user roles:', error);
            setUser(initialSession.user);
            setSession(initialSession);
          }
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error in initial session check:', error);
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    };

    // Use timeout to ensure clean initialization
    setTimeout(checkInitialSession, 100);

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: AppRole) => {
    try {
      // Use the main site URL for better email confirmation flow
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      
      console.log('Starting signup process...');
      console.log('Sign up redirect URL:', redirectUrl);
      console.log('Email:', email);
      console.log('Role:', role);
      
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
      
      console.log('Signup response:', { data, error });
      
      if (error) {
        console.error('Signup error:', error);
        
        // Handle specific signup errors
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
      
      // Role assignment is now handled by the handle_new_user() trigger
      // which reads from user metadata during signup. No need for client-side role assignment.
      
      if (data?.user && !data?.session) {
        console.log('User created, confirmation email should be sent');
        
        // Send welcome email after successful signup
        try {
          console.log('Sending welcome email...');
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              email: email,
              name: name,
              role: role
            }
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the signup if email fails
        }
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Signup exception:', err);
      return { error: err };
    }
  };

  const getUserRoles = async (userId: string): Promise<AppRole[]> => {
    return await fetchUserRoles(userId);
  };

  // Role assignment is now handled by the database trigger (handle_new_user)
  // and admin-only RPC functions (assign_user_role, remove_user_role).
  // This function is kept for interface compatibility but logs a warning.
  const assignUserRole = async (userId: string, role: AppRole) => {
    console.warn('Direct role assignment from client is disabled. Roles are assigned via database trigger during signup.');
    return { error: { message: 'Role assignment is handled by the server during signup' } };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', { data, error });
      
      if (error) {
        console.error('Sign in error details:', error);
        
        // Handle different types of authentication errors
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
      console.error('Sign in exception:', err);
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
      
      console.log('Resend confirmation response:', { error });
      return { error };
    } catch (err: any) {
      console.error('Resend confirmation exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear all local state first
      setUser(null);
      setSession(null);
      
      // Clear localStorage
      localStorage.removeItem('supabase.auth.token');
      localStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful - forcing reload for fresh state');
      
      // Force reload to ensure completely clean state
      window.location.reload();
    } catch (err) {
      console.error('Sign out exception:', err);
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