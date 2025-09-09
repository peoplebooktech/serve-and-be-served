import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle email confirmation success
        if (event === 'SIGNED_IN' && session?.user && !session?.user?.email_confirmed_at) {
          console.log('User signed in, redirecting to profiles');
          window.location.href = '/profiles';
        } else if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          console.log('Email confirmed, redirecting to profiles');
          window.location.href = '/profiles';
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Use a proper confirmation URL 
      const redirectUrl = `${window.location.origin}/auth/confirm`;
      
      console.log('Starting signup process...');
      console.log('Sign up redirect URL:', redirectUrl);
      console.log('Email:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });
      
      console.log('Signup response:', { data, error });
      
      if (error) {
        console.error('Signup error:', error);
        return { error };
      }
      
      if (data?.user && !data?.session) {
        console.log('User created, confirmation email should be sent');
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Signup exception:', err);
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
        // Check if it's an unconfirmed account
        if (error.message === 'Invalid login credentials') {
          // Try to determine if account exists but unconfirmed by attempting password reset
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/confirm`
          });
          
          if (!resetError) {
            return { 
              error: { 
                message: 'Account not confirmed. Please check your email for the confirmation link or click "Resend Confirmation" below.' 
              } 
            };
          }
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};