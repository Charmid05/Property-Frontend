"use client";
import React, { useState } from "react";
import { PropertyManagerSideBar, TenantSideBar } from "../aside/aside";
import { PropertyManagerTopNav, TenantTopNav } from "../topNav/topNav";
import AuthGuard from "@/utils/AuthGuard";
import { useAuthContext } from "@/context/ApiContext";

interface LayoutProps {
  children: React.ReactNode;
  role: "property_manager" | "tenant";
  allowedRoles: string[];
}

const BaseLayout: React.FC<LayoutProps> = ({
  children,
  role,
  allowedRoles,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { user } = useAuthContext();

  // Select correct sidebar & topnav components
  const Sidebar =
    role === "property_manager" ? PropertyManagerSideBar : TenantSideBar;
  const TopNav =
    role === "property_manager" ? PropertyManagerTopNav : TenantTopNav;

  return (
    <AuthGuard allowedRoles={allowedRoles} publicRoutes={["/auth/login"]}>
      <div className="min-h-screen bg-gray-50 flex relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            activeItem={activeMenuItem}
            onItemClick={setActiveMenuItem}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar
            activeItem={activeMenuItem}
            onItemClick={(item: string) => {
              setActiveMenuItem(item);
              setIsMobileMenuOpen(false);
            }}
            isCollapsed={false} // Mobile always expanded
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            user={user}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export const PropertyManagerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <BaseLayout role="property_manager" allowedRoles={["property_manager"]}>
    {children}
  </BaseLayout>
);

export const TenantLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <BaseLayout role="tenant" allowedRoles={["tenant"]}>
    {children}
  </BaseLayout>
);
