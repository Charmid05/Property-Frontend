"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/ApiContext";
import { globalUserStore } from "@/utils/AuthGuard";
import Hero from "./components/HomePage/Hero";
import WhatWeDo from "./components/HomePage/WhatWeDo";
import PropertyManagementSection from "./components/HomePage/manage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function HomePage() {
  const { isLoggedIn, user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    function handleRouting() {
      if (loading) return;

      if (!isLoggedIn) {
        // Already on home page, nothing to do
        return;
      }

      if (isLoggedIn && user) {
        if (
          !globalUserStore.isLoaded ||
          globalUserStore.userData?.id !== user.id
        ) {
          globalUserStore.setUserData(user);
        }

        const userRole = globalUserStore.getUserRole() || user.role;
        if (!userRole) return;

        switch (userRole.toLowerCase()) {
          case "admin":
            router.replace("/admin");
            break;
          case "property_manager":
            router.replace("/property-manager");
            break;
          case "tenant":
            router.replace("/tenant");
            break;
          case "landlord":
            router.replace("/landlord");
            break;
          default:
            // For unknown roles, maybe take to login or keep here
            break;
        }
      }
    }

    handleRouting();
  }, [isLoggedIn, user, loading, router]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render homepage when we're SURE user is not logged in
  if (!isLoggedIn) {
    return (
      <div>
        <Navbar />
        <Hero />
        <PropertyManagementSection />
        <WhatWeDo />
        <Footer />
      </div>
    );
  }

  // When logged in, useEffect will handle redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
