'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { User } from "@/types/user";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/api/auth/api";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  navigateToRoleDashboard: () => void;
  getRoleBasedRedirectUrl: (role: string) => string;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
  navigateToRoleDashboard: () => {},
  getRoleBasedRedirectUrl: () => "/",
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout: authLogout,
    fetchUser,
    getRoleBasedRedirectUrl,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "refresh_token") {
        fetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await authLogout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  const refreshUser = async () => {
    if (isAuthenticated) {
      try {
        await fetchUser();
      } catch (error) {
        toast.error("Error refreshing user data");
      }
    }
  };

  const navigateToRoleDashboard = () => {
    if (user?.role) {
      const redirectUrl = getRoleBasedRedirectUrl(user.role);
      router.push(redirectUrl);
    } else {
      router.push("/auth/login");
    }
  };

  const getRedirectUrl = (role: string): string => {
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
      case "admin":
        return "/admin";
      case "property_manager":
        return "/property-manager";
      case "tenant":
        return "/tenant";
      case "landlord":
        return "/landlord";
      default:
        return "/admin";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: isAuthenticated,
        loading: isLoading,
        logout: handleLogout,
        refreshUser,
        navigateToRoleDashboard,
        getRoleBasedRedirectUrl: getRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
