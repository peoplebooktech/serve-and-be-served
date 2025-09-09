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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch roles and add to user object
          const roles = await fetchUserRoles(session.user.id);
          const userWithRoles = { ...session.user, roles };
          setUser(userWithRoles);
          
          // If user just signed up and has role metadata but no roles in database, assign the role
          if (event === 'SIGNED_IN' && session.user.user_metadata?.role && roles.length === 0) {
            console.log('Assigning role from metadata:', session.user.user_metadata.role);
            await assignUserRole(session.user.id, session.user.user_metadata.role);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        const roles = await fetchUserRoles(session.user.id);
        const userWithRoles = { ...session.user, roles };
        setUser(userWithRoles);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: AppRole) => {
    try {
      // Use a proper confirmation URL 
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
              message: 'An account with this email already exists. Please try signing in instead, or use the "Resend Confirmation" option if you haven\'t confirmed your email yet.'
            } 
          };
        }
        
        return { error };
      }
      
      // If user is created and confirmed immediately, assign the role
      if (data?.user && data?.session) {
        console.log('User created and confirmed, assigning role...');
        const roleResult = await assignUserRole(data.user.id, role);
        if (roleResult.error) {
          console.error('Failed to assign role:', roleResult.error);
        }
      }
      
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

  const assignUserRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role });
      
      if (error) {
        console.error('Error assigning role:', error);
        return { error };
      }
      
      // Refresh user roles after assignment
      if (user && user.id === userId) {
        const roles = await fetchUserRoles(userId);
        setUser({ ...user, roles });
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Exception assigning role:', err);
      return { error: err };
    }
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
    await supabase.auth.signOut();
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