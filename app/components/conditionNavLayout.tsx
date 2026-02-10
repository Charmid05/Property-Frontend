"use client";
import { useAuthContext } from "@/context/ApiContext";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const ConditionalNavbar = () => {
  const { isLoggedIn, loading } = useAuthContext();
  const pathname = usePathname();

  const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/forgot-password",
    "/contact-support",
  ];

  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));

  // Show navbar only for public pages when user is not logged in
  if (!loading && !isLoggedIn && !isAuthRoute) {
    return <Navbar />;
  }

  return null;
};

// Component that conditionally renders footer
export const ConditionalFooter = () => {
  const { isLoggedIn, loading } = useAuthContext();
  const pathname = usePathname();

  // Routes where public layout should never be shown
  const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/forgot-password",
    "/contact-support",
  ];

  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));
  if (!loading && !isLoggedIn && !isAuthRoute) {
    return <Footer />;
  }

  return null;
};
