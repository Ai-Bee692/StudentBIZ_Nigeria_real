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
  address?: string;
  state?: string;
  date_of_birth?: string;
  national_id_number?: string;
  kyc_status?: 'pending' | 'under_review' | 'verified' | 'rejected';
  bvn?: string;
  bank_name?: string;
  bank_account_number?: string;
  student_id_url?: string;
  business_reg_url?: string;
  kyc_submitted_at?: string;
  matric_number?: string;
  semester_gpa?: number;
  cgpa?: number;
  instagram_handle?: string;
  twitter_handle?: string;
  facebook_handle?: string;
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
  const fetchingId = React.useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Helper to fetch profile once
    const syncProfile = async (userId: string) => {
      // Don't fetch if we already have this profile or it's currently fetching
      if (profile?.id === userId || fetchingId.current === userId) {
        if (profile?.id === userId) setLoading(false);
        return;
      }
      await fetchProfile(userId);
    };

    // Main initialization: Use getSession() to start, and ONLY then set up the listener
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
          await syncProfile(session.user.id);
        } else {
          setLoading(false);
        }

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await syncProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth initialization error:", err);
        setLoading(false);
      }
    };

    const cleanup = initAuth();

    return () => {
      mounted = false;
      cleanup.then(unsub => unsub?.());
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    if (fetchingId.current === userId) return;
    fetchingId.current = userId;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .limit(1);

      if (error) {
        // If profile is missing but we have a session, attempt recovery
        if (error.code === "PGRST116" && user) {
          await recoverProfile(user);
          return;
        }
        throw error;
      };
      
      const profileData = data && data.length > 0 ? data[0] : null;

      if (!profileData && user) {
        await recoverProfile(user);
        return;
      }

      if (profileData) {
        setProfile(profileData as Profile);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message || error);
    } finally {
      fetchingId.current = null;
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
          role: authUser.user_metadata?.role || "student_entrepreneur",
          investor_type: authUser.user_metadata?.investor_type,
          school_name: authUser.user_metadata?.school_name,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error("Profile recovery failed:", error.message || error);
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
