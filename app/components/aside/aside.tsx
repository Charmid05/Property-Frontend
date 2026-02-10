"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Settings,
  Users,
  CreditCard,
  Receipt,
  BarChart3,
  Calendar,
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
  role: "property-manager" | "tenant";
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const buildMenu = (role: NavProps["role"]): MenuSection[] => {
  const allSections: MenuSection[] = [
    {
      title: "Main",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          path: `/${role}`,
        },
        {
          id: "properties",
          label: "Properties",
          icon: Building2,
          path: `/${role}/properties`,
        },
        {
          id: "units",
          label: "Units",
          icon: Settings,
          path: `/${role}/units`,
        },
        {
          id: "tenants",
          label: "Tenants",
          icon: Users,
          path: `/${role}/tenants`,
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
          path: `/${role}/finance/payments`,
        },
        {
          id: "transactions",
          label: "Transactions",
          icon: Receipt,
          path: `/${role}/finance/transactions`,
        },
        {
          id: "invoices",
          label: "Invoices",
          icon: Receipt,
          path: `/${role}/finance/invoices`,
        },
        {
          id: "receipts",
          label: "Receipts",
          icon: Receipt,
          path: `/${role}/finance/receipts`,
        },
        {
          id: "utilities",
          label: "Utilities",
          icon: Receipt,
          path: `/${role}/finance/utilities`,
        },
        {
          id: "statements",
          label: "Statements",
          icon: Receipt,
          path: `/${role}/finance/statements`,
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
          path: `/${role}/reports`,
        },
        {
          id: "maintenance",
          label: "Maintenance",
          icon: Calendar,
          path: `/${role}/maintenance`,
        },
      ],
    },
  ];

  if (role === "tenant") {
    // Remove "Properties" and the "units.tenants" sub-page
    return allSections.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.id !== "properties" &&
          it.id !== "tenants" &&
          it.id !== "units" &&
          it.id !== "statements",
      ),
    }));
  }

  if (role === "property-manager") {
    // Remove "Properties" and the "units.tenants" sub-page
    return allSections.map((sec) => ({
      ...sec,
      items: sec.items.filter((it) => it.id !== "receipts"),
    }));
  }

  return allSections;
};

/* --------------------------------------------------------------- */
/*  Shared sidebar component (used by both roles)                  */
/* --------------------------------------------------------------- */
const SidebarBase: React.FC<NavProps> = ({
  role,
  activeItem = "dashboard",
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuSections = buildMenu(role);

  const handleClick = (item: MenuItem) => {
    onItemClick?.(item.id);
    router.push(item.path);
  };

  const currentActiveItem =
    activeItem ||
    menuSections.flatMap((s) => s.items).find((i) => pathname === i.path)?.id ||
    menuSections
      .flatMap((s) => s.items)
      .find((i) => pathname?.startsWith(i.path) && i.path !== `/${role}`)?.id ||
    "dashboard";

  return (
    <aside
      className={`bg-white min-h-screen border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-58"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-5 border-b border-gray-200 h-20 flex items-center bg-white">
        <div className="flex items-center gap-3 justify-between w-full">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900 truncate">
                  {role === "property-manager" ? "Property Manager" : "Tenant"}
                </h2>
              </div>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
      <nav className="flex-1 px-3 py-4 overflow-y-auto bg-white">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}

            {isCollapsed && sectionIndex > 0 && (
              <div className="my-3 mx-auto w-8 h-px bg-gray-200" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveItem === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-900"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                      ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-700 rounded-r" />
                    )}

                    <Icon
                      size={22}
                      className={`flex-shrink-0 ${
                        isActive
                          ? "text-blue-700"
                          : "text-gray-600 group-hover:text-gray-700"
                      }`}
                    />

                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left truncate">
                          {item.label}
                        </span>

                        {item.badge && (
                          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-md">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export const PropertyManagerSideBar: React.FC<Omit<NavProps, "role">> = (
  props,
) => <SidebarBase role="property-manager" {...props} />;

export const TenantSideBar: React.FC<Omit<NavProps, "role">> = (props) => (
  <SidebarBase role="tenant" {...props} />
);
