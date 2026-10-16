import { DEMO_USER_ID } from "@/src/api/auth/currentUser";
import { getMyProfile, type Profile } from "@/src/api/profile/api";
import { supabase } from "@/supabase/supabase";
import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userId: string;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userId: DEMO_USER_ID,
  loading: true,
  profile: null,
  profileLoading: false,
  profileError: null,
  refreshProfile: async () => {},
  setProfile: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const user = session?.user ?? null;
  const sessionUserId = user?.id ?? null;
  const userId = sessionUserId ?? DEMO_USER_ID;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!sessionUserId) {
      setProfile(null);
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      const data = await getMyProfile(sessionUserId);
      setProfile(data);
    } catch (err) {
      console.error("[AuthContext] profile load failed:", err);
      setProfileError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  }, [sessionUserId]);

  // load once per logged-in user (not on hourly token refreshes)
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userId,
        loading,
        profile,
        profileLoading,
        profileError,
        refreshProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}