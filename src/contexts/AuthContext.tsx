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

  // Helper function to check if user has a profile
  const checkUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      return !error && data;
    } catch (err) {
      console.error('Error checking user profile:', err);
      return false;
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
          
          // Check if user has a profile (for new users, trigger might create it)
          const hasProfile = await checkUserProfile(session.user.id);
          if (!hasProfile) {
            console.log('No profile found, trigger should create one automatically');
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
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: AppRole) => {
    try {
      console.log('Starting signup process...');
      console.log('Email:', email);
      console.log('Role:', role);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
              message: 'An account with this email already exists. Please try signing in instead.'
            } 
          };
        }
        
        return { error };
      }
      
      // Check if user was created successfully
      if (data?.user) {
        if (data?.session) {
          console.log('User created and signed in immediately - no email confirmation required');
        } else {
          console.log('User created but needs email confirmation - check Supabase settings to disable this');
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