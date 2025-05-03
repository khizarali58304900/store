
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Update the admin emails array to include the new email
  const ADMIN_EMAILS = ['muhammadjunaid372413@gmail.com', 'khizarali58304900@gmail.com'];

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: ADMIN_EMAILS.includes(session.user.email || '')
          };
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: ADMIN_EMAILS.includes(session.user.email || '')
          };
          
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return false;
      }
      
      // Successful signup triggers a confirmation email
      toast.success("Signup successful! Please check your email for verification link.");
      return true;
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast.error("An unexpected error occurred during signup.");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }
      
      // Update user state with the returned session data
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        isAdmin: ADMIN_EMAILS.includes(data.user.email || '')
      };
      
      setUser(userData);
      toast.success("Login successful");
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error("An unexpected error occurred during login.");
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        return;
      }
      
      setUser(null);
      toast.success("Logout successful");
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error("An unexpected error occurred during logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.isAdmin || false,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
