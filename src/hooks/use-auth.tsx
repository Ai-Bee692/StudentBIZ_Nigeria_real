import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type UserRole = "student_entrepreneur" | "investor" | "admin";
type InvestorType = "student" | "alumni" | "community";

interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  investor_type?: InvestorType;
  school_name?: string;
  phone_number?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Helper to fetch profile once
    const syncProfile = async (userId: string) => {
      // Don't fetch if we already have this profile in state
      if (profile?.id === userId) {
        setLoading(false);
        return;
      }
      await fetchProfile(userId);
    };

    // Listen for auth changes (Supabase handles INITIAL_SESSION automatically here too)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth Event:", event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await syncProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Fallback: If for some reason the listener didn't pick up the session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session && !user) {
        setSession(session);
        setUser(session.user);
        syncProfile(session.user.id);
      } else if (!session) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile is missing but we have a session, attempt recovery
        if (error.code === "PGRST116" && user) {
          console.warn("Profile missing. Attempting recovery...");
          await recoverProfile(user);
          return;
        }
        throw error;
      };
      setProfile(data as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const recoverProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || "New User",
          role: authUser.user_metadata?.role || "investor",
          investor_type: authUser.user_metadata?.investor_type,
          school_name: authUser.user_metadata?.school_name,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data as Profile);
      console.log("Profile recovered successfully");
    } catch (error) {
      console.error("Recovery failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // 1. Force clear all storage mediums completely
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      // 2. Clear context states to sever active ties
      setSession(null);
      setUser(null);
      setProfile(null);
      
      // 3. Attempt network signout (no await, so it doesn't block)
      supabase.auth.signOut();
      
      // 4. Perform a HARD browser reload to the landing page
      // This is the absolute guarantee that no cached state survives
      window.location.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
