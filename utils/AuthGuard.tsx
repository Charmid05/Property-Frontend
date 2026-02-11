"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthContext } from "@/context/ApiContext";
import { Loader, Shield } from "lucide-react";
import { User } from "@/types/user";
export const globalUserStore = {
  userData: null as User | null,
  isLoaded: false,
  setUserData: function (data: User) {
    this.userData = data;
    this.isLoaded = true;
  },
  clearUserData: function () {
    this.userData = null;
    this.isLoaded = false;
  },
  getUserRole: function () {
    return this.userData?.role || null;
  },
};

interface AuthGuardProps {
  children: ReactNode;
  publicRoutes?: string[];
  allowedRoles?: string[];
}
export default function AuthGuard({
  children,
  publicRoutes = ["/auth/login", "/forgot-password", "/contact-support", "/"],
  allowedRoles = ["auth/login", "tenant"],
}: AuthGuardProps) {
  const { isLoggedIn, user, loading, refreshUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  useEffect(() => {
    async function checkAuthentication() {
      setIsCheckingAuth(true);

      const isPublicPath = publicRoutes.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname?.startsWith(route);
      });
      if (isPublicPath) {
        setIsAuthorized(true);
        setIsCheckingAuth(false);
        return;
      }

      if (!isLoggedIn || !user) {
        if (pathname !== "/auth/login") {
          toast.error("Please log in to access this page");
        }
        router.push("/auth/login");
        setIsAuthorized(false);
        globalUserStore.clearUserData();
        setIsCheckingAuth(false);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        const userCorrectPath = user.role === "admin" ? "/admin" : "/tenant";
        if (pathname !== userCorrectPath) {
          toast.info(`Redirecting to ${user.role} dashboard...`);
        }

        switch (user.role.toLowerCase()) {
          case "admin":
            router.push("/admin");
            break;
          case "property_manager":
            router.push("/property-manager");
            break;
          case "landlord":
            router.push("/landlord");
            break;
          case "tenant":
            router.push("/tenant");
            break;
          default:
            toast.error("Invalid user role. Please contact support.");
            router.push("/auth/login");
        }

        setIsAuthorized(false);
        setIsCheckingAuth(false);
        return;
      }

      if (
        !globalUserStore.isLoaded ||
        globalUserStore.userData?.id !== user.id
      ) {
        try {
          globalUserStore.setUserData(user);
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      }

      setIsAuthorized(true);
      setIsCheckingAuth(false);
    }

    if (!loading) {
      checkAuthentication();
    }
  }, [
    isLoggedIn,
    user,
    loading,
    pathname,
    publicRoutes,
    allowedRoles,
    router,
    refreshUser,
  ]);

  if (loading || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-orange-100">
        <div className="text-center space-y-4">
          {/* Logo/Icon Circle */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-800 rounded-full mb-4 shadow-md">
            <Shield className="h-8 w-8 text-white" />
          </div>

          {/* Loader Spinner */}
          <Loader className="h-8 w-8 text-green-800 animate-spin mx-auto" />

          {/* Text Area */}
          <div>
            <p className="text-green-900 font-semibold text-lg">
              Aux Property Management
            </p>
            <p className="text-orange-600 text-sm">
              Checking access permissions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  // Return null for unauthorized users (they should be redirected anyway)
  return null;
}
