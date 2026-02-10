"use client";
import React, { useState } from "react";
import AdminSideBar from "./aside";
import AuthGuard from "@/utils/AuthGuard";
import TopNav from "./topNav";
import { useAuthContext } from "@/context/ApiContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string>("dashboard");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { user } = useAuthContext();

  return (
    <AuthGuard allowedRoles={["admin"]} publicRoutes={["/auth/login"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex relative">
        {/* Mobile Menu Overlay with blur effect */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block shadow-xl">
          <AdminSideBar
            activeItem={activeMenuItem}
            onItemClick={setActiveMenuItem}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Sidebar with slide animation */}
        <div
          className={`
          fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out lg:hidden shadow-2xl
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <AdminSideBar
            activeItem={activeMenuItem}
            onItemClick={(item: string) => {
              setActiveMenuItem(item);
              setIsMobileMenuOpen(false);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
            user={user}
          />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="max-w-[1920px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
