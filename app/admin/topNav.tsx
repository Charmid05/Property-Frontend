import React, { useState } from "react";
import {
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  User,
} from "lucide-react";
import { useAuthContext } from "@/context/ApiContext";
import { User as UserType } from "@/types/user";

interface TopNavProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  user: UserType | null;
}

const TopNav: React.FC<TopNavProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
  user,
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

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-30 shadow-sm">
      <nav className="px-5 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none transition-all duration-200 group-focus-within:text-green-600" />
              <input
                type="text"
                placeholder="Search properties, tenants..."
                className="pl-11 pr-4 py-2.5 w-80 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-sm bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 transition-all duration-200 placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 relative hover:scale-105 active:scale-95 group"
              aria-label="Notifications"
            >
              <Bell
                size={20}
                className="transition-transform duration-200 group-hover:rotate-12"
              />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-lg shadow-red-500/30 animate-pulse">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              className="hidden sm:flex p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
              aria-label="Settings"
            >
              <Settings
                size={20}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-green-700 via-green-600 to-green-500 rounded-xl flex items-center justify-center ring-2 ring-green-100 shadow-lg shadow-green-500/20">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-gray-900 leading-tight">
                    {user?.full_name || "Admin User"}
                  </div>
                  <div className="text-xs text-gray-500 capitalize leading-tight font-medium">
                    {user?.role || "Administrator"}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden lg:block text-gray-400 transition-all duration-300 ${
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

                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-700 via-green-600 to-green-500 rounded-xl flex items-center justify-center ring-2 ring-green-100 shadow-lg shadow-green-500/20">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm truncate">
                            {user?.full_name || "Admin User"}
                          </div>
                          <div className="text-xs text-gray-500 truncate font-medium">
                            {user?.email || "admin@example.com"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-bold rounded-lg capitalize shadow-sm">
                        {user?.role || "Administrator"}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 flex items-center gap-3 transition-all duration-200 group">
                        <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-gray-200 group-hover:to-gray-100 transition-all duration-200 group-hover:scale-110">
                          <User
                            size={16}
                            className="text-gray-600 group-hover:text-gray-700"
                          />
                        </div>
                        <span className="font-semibold">View Profile</span>
                      </button>

                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 flex items-center gap-3 transition-all duration-200 group">
                        <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-gray-200 group-hover:to-gray-100 transition-all duration-200 group-hover:scale-110">
                          <Settings
                            size={16}
                            className="text-gray-600 group-hover:text-gray-700 transition-transform duration-200 group-hover:rotate-90"
                          />
                        </div>
                        <span className="font-semibold">Account Settings</span>
                      </button>

                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 flex items-center gap-3 transition-all duration-200 group">
                        <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-gray-200 group-hover:to-gray-100 transition-all duration-200 group-hover:scale-110">
                          <Bell
                            size={16}
                            className="text-gray-600 group-hover:text-gray-700"
                          />
                        </div>
                        <span className="font-semibold">Notifications</span>
                        {notifications > 0 && (
                          <span className="ml-auto bg-gradient-to-br from-red-100 to-red-50 text-red-600 text-xs px-2.5 py-1 rounded-lg font-bold shadow-sm">
                            {notifications}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 flex items-center gap-3 transition-all duration-200 group"
                      >
                        <div className="p-2 rounded-xl bg-red-50 group-hover:bg-gradient-to-br group-hover:from-red-100 group-hover:to-red-50 transition-all duration-200 group-hover:scale-110">
                          <LogOut size={16} className="text-red-600" />
                        </div>
                        <span className="font-semibold">Sign out</span>
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

export default TopNav;
