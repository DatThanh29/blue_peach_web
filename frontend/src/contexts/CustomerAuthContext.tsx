"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { clearCart } from "@/lib/cart";
import { AUTH_INVALID_EVENT, authFetch } from "@/lib/api";

export type CustomerProfile = {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  created_at: string | null;
  email: string | null;
  ma_role: string | null;
  updated_at: string;
  ngay_sinh: string | null;
  gioi_tinh: string | null;
  avatar: string | null;
  is_active: boolean;
  is_blocked: boolean;
};

type CustomerAuthContextType = {
  session: Session | null;
  user: User | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<{ error: string | null }>;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
);

async function fetchProfile(userId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Không thể tải hồ sơ người dùng");
  }

  return data as CustomerProfile | null;
}

function checkEmailVerified(user: User | null) {
  if (!user) return false;

  return !!user.email_confirmed_at;
}

export function CustomerAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMountedRef = useRef(true);
  const latestProfileRequestRef = useRef(0);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    const requestId = ++latestProfileRequestRef.current;

    if (!nextUser) {
      if (isMountedRef.current) {
        setProfile(null);
      }
      return;
    }

    try {
      const nextProfile = await fetchProfile(nextUser.id);

      if (!isMountedRef.current) return;
      if (requestId !== latestProfileRequestRef.current) return;

      setProfile(nextProfile);
    } catch (error) {
      console.error("[CustomerAuth] loadProfile failed:", error);

      if (!isMountedRef.current) return;
      if (requestId !== latestProfileRequestRef.current) return;

      setProfile(null);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    let ignore = false;

    async function init() {
      setIsLoading(true);

      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (ignore || !isMountedRef.current) return;

        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        await loadProfile(currentUser);
      } catch (error) {
        console.error("[CustomerAuth] init failed:", error);

        if (ignore || !isMountedRef.current) return;

        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (!ignore && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, nextSession) => {
      const nextUser = nextSession?.user ?? null;

      setSession(nextSession);
      setUser(nextUser);

      void loadProfile(nextUser);

      if (isMountedRef.current) {
        setIsLoading(false);
      }
    });

    return () => {
      ignore = true;
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  useEffect(() => {
    function handleAuthInvalid() {
      void supabase.auth.signOut();

      if (isMountedRef.current) {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    }

    window.addEventListener(AUTH_INVALID_EVENT, handleAuthInvalid);

    return () => {
      window.removeEventListener(AUTH_INVALID_EVENT, handleAuthInvalid);
    };
  }, []);

  useEffect(() => {
    async function createWelcomeCouponNotification() {
      if (!session?.user || !checkEmailVerified(session.user)) return;

      const storageKey = `bp_welcome_coupon_created_${session.user.id}`;

      if (typeof window !== "undefined") {
        const alreadyCreated = window.localStorage.getItem(storageKey);
        if (alreadyCreated === "true") return;
      }

      try {
        await authFetch("/notifications/welcome-coupon", {
          method: "POST",
          body: JSON.stringify({}),
        });

        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, "true");
        }
      } catch (error) {
        console.error(
          "[CustomerAuth] create welcome coupon notification failed:",
          error
        );
      }
    }

    void createWelcomeCouponNotification();
  }, [session]);

  const refreshProfile = useCallback(async () => {
    const currentUser = session?.user ?? null;

    if (!currentUser) {
      setProfile(null);
      return;
    }

    await loadProfile(currentUser);
  }, [loadProfile, session]);

  const signOut = useCallback(async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message || "Đăng xuất thất bại" };
  }

  clearCart();

  if (isMountedRef.current) {
    setSession(null);
    setUser(null);
    setProfile(null);
  }

  return { error: null };
}, []);

  const value = useMemo<CustomerAuthContextType>(() => {
    return {
      session,
      user,
      profile,
      isLoading,
      isAuthenticated: !!session?.user,
      isEmailVerified: checkEmailVerified(user),
      refreshProfile,
      signOut,
    };
  }, [session, user, profile, isLoading, refreshProfile, signOut]);

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }

  return context;
}