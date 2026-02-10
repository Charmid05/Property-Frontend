"use client";
import React from "react";
import { Users, UserCheck, Clock, Calendar, TrendingUp } from "lucide-react";
import { TenantDashboardStats } from "@/types/tenant";

interface TenantStatsProps {
  stats: TenantDashboardStats;
  isLoading: boolean;
  userRole: "admin" | "property_manager";
}

const TenantStats: React.FC<TenantStatsProps> = ({ stats, isLoading, userRole }) => {
  const statItems = [
    {
      id: "total",
      name: userRole === "admin" ? "Total Tenants" : "My Tenants",
      value: stats?.total_tenants || 0,
      icon: Users,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "active",
      name: "Active Tenants",
      value: stats?.active_tenants || 0,
      icon: UserCheck,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      id: "pending",
      name: "Pending Tenants",
      value: stats?.pending_tenants || 0,
      icon: Clock,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      id: "expiring",
      name: "Expiring Leases",
      value: stats?.expiring_leases || 0,
      icon: Calendar,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      id: "recent",
      name: "New This Month",
      value: stats?.recent_tenants || 0,
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-6 w-6 ${item.textColor}`} />
                </div>
              </div>
              {item.id === "active" && stats && stats.total_tenants > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Occupancy Rate</span>
                    <span className="text-gray-700">{Math.round((stats.active_tenants / stats.total_tenants) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-800 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.active_tenants / stats.total_tenants) * 100)}%` }}></div>
                  </div>
                </div>
              )}
              {item.id === "expiring" && item.value > 0 && (
                <div className="mt-3 flex items-center gap-1">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">Requires attention</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TenantStats;