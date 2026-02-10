"use client";
import React, { useState } from "react";
import { Bell, LogOut, ChevronDown, Menu, X, Search, User } from "lucide-react";
import { useAuthContext } from "@/context/ApiContext";
import { User as UserType } from "@/types/user";

interface TopNavProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  user: UserType | null;
  role: "property-manager" | "tenant";
}

/* --------------------------------------------------------------- */
/*  Shared TopNav – handles both roles                             */
/* --------------------------------------------------------------- */
const TopNavBase: React.FC<TopNavProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
  user,
  role,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [notifications] = useState<number>(3);
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Role-specific configuration
  const config = {
    "property-manager": {
      title: "Property Manager",
      searchPlaceholder: "Search properties, units, tenants...",
    },
    tenant: {
      title: "Tenant",
      searchPlaceholder: "Search payments, maintenance, invoices...",
    },
  }[role];

  const displayName = user?.full_name || config.title;
  const displayRole = (
    user?.role?.replace(/_/g, " ") || role.replace("-", " ")
  ).replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <nav className="px-5 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                className="pl-10 pr-4 py-2 w-80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-gray-200" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-gray-100">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-semibold text-gray-900 leading-tight">
                    {displayName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize leading-tight">
                    {displayRole}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden lg:block text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  {/* Overlay */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center ring-2 ring-blue-100">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {displayName}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user?.email || `${role}@example.com`}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md capitalize">
                        {displayRole}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group">
                        <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
                          <User size={14} className="text-gray-600" />
                        </div>
                        <span className="font-medium">View Profile</span>
                      </button>

                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group">
                        <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
                          <Bell size={14} className="text-gray-600" />
                        </div>
                        <span className="font-medium">Notifications</span>
                        {notifications > 0 && (
                          <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {notifications}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-red-50 group-hover:bg-red-100 transition-colors">
                          <LogOut size={14} className="text-red-600" />
                        </div>
                        <span className="font-medium">Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

/* --------------------------------------------------------------- */
/*  Exported components – role-specific wrappers                   */
/* --------------------------------------------------------------- */
export const PropertyManagerTopNav: React.FC<Omit<TopNavProps, "role">> = (
  props
) => <TopNavBase role="property-manager" {...props} />;

export const TenantTopNav: React.FC<Omit<TopNavProps, "role">> = (props) => (
  <TopNavBase role="tenant" {...props} />
);
