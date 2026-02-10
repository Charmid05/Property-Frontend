"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Users,
  CreditCard,
  Receipt,
  Settings,
  Shield,
  BarChart3,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface NavProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AdminSideBar: React.FC<NavProps> = ({
  activeItem = "dashboard",
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuSections: MenuSection[] = [
    {
      title: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Home, path: "/admin" },
        {
          id: "properties",
          label: "Properties",
          icon: Building2,
          path: "/admin/properties",
        },
        { id: "units", label: "Units", icon: Settings, path: "/admin/units" },
        {
          id: "tenants",
          label: "Tenants",
          icon: Users,
          path: "/admin/tenants",
        },
      ],
    },
    {
      title: "Financial",
      items: [
        {
          id: "payments",
          label: "Payments",
          icon: CreditCard,
          path: "/admin/finance/payments",
        },
        {
          id: "finance",
          label: "Finance",
          icon: Receipt,
          path: "/admin/finance",
        },
        {
          id: "invoices",
          label: "Invoices",
          icon: Receipt,
          path: "/admin/finance/invoices",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: BarChart3,
          path: "/admin/reports",
        },
        { id: "users", label: "Users", icon: User, path: "/admin/users" },
        {
          id: "maintenance",
          label: "Maintenance",
          icon: Calendar,
          path: "/admin/maintenance",
        },
      ],
    },
  ];

  const handleClick = (item: MenuItem) => {
    onItemClick?.(item.id);
    router.push(item.path);
  };

  const currentActiveItem =
    activeItem ||
    menuSections
      .flatMap((section) => section.items)
      .find((item) => pathname === item.path)?.id ||
    menuSections
      .flatMap((section) => section.items)
      .find((item) => pathname?.startsWith(item.path) && item.path !== "/admin")
      ?.id ||
    "dashboard";

  return (
    <aside
      className={`bg-gradient-to-b from-white to-gray-50/50 min-h-screen border-r border-gray-200/80 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-200/80 h-20 flex items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 justify-between w-full">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-green-800 via-green-700 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-800/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-bold text-gray-900 truncate tracking-tight">
                  Admin Panel
                </h2>
              </div>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-10 h-10 bg-gradient-to-br from-green-800 via-green-700 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-800/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  title="Expand sidebar"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}

            {isCollapsed && sectionIndex > 0 && (
              <div className="my-3 mx-auto w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveItem === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                      ${
                        isActive
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 shadow-sm shadow-green-100/50"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                      hover:scale-[1.02] active:scale-[0.98]`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-600 to-green-800 rounded-r shadow-lg shadow-green-500/30" />
                    )}

                    {/* Active glow effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl" />
                    )}

                    <Icon
                      size={20}
                      className={`flex-shrink-0 relative z-10 transition-all duration-200 ${
                        isActive
                          ? "text-green-700"
                          : "text-gray-500 group-hover:text-gray-700 group-hover:scale-110"
                      }`}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-semibold flex-1 text-left truncate relative z-10">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-lg shadow-sm relative z-10">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-600 to-green-700 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-lg shadow-green-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Settings */}
        <div className="mt-6 pt-4 border-t border-gray-200/80">
          <button
            onClick={() => router.push("/admin/settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900 transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98] ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings
              size={20}
              className="flex-shrink-0 text-gray-500 group-hover:text-gray-700 transition-all duration-200 group-hover:rotate-90 group-hover:scale-110"
            />
            {!isCollapsed && (
              <span className="text-sm font-semibold flex-1 text-left">
                Settings
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
