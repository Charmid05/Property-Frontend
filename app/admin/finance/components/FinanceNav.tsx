"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Receipt, CreditCard, DollarSign, Plus } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

export function FinanceNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/admin/finance", icon: DollarSign },
    { label: "Invoices", path: "/admin/finance/invoices", icon: FileText },
    { label: "Payments", path: "/admin/finance/payments", icon: CreditCard },
    { label: "Receipts", path: "/admin/finance/receipts", icon: CreditCard },
    {
      label: "Statements",
      path: "/admin/finance/statements",
      icon: CreditCard,
    },
    {
      label: "Transactions",
      path: "/admin/finance/transactions",
      icon: Receipt,
    },
    {
      label: "Utilities",
      path: "/admin/finance/utility-charges",
      icon: Receipt,
    },
    {
      label: "Billing Periods",
      path: "/admin/finance/billing-periods",
      icon: Receipt,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin/finance") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm mb-6 sticky top-0 z-20">
      <div className="px-6 py-3">
        <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap text-sm flex-shrink-0 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-105 active:scale-95"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
