"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, RefreshCw, Users } from "lucide-react";
import TenantForm from "./TenantForm";
import TenantList from "./TenantList";
import TenantStats from "./TenantStats";
import { TenantListItem, TenantStatus, TenantDashboard } from "@/types/tenant";
import {
  getTenants,
  getTenantDashboard,
  deleteTenant,
  updateTenantStatus,
} from "@/app/api/tenant/api";

interface TenantsPageContainerProps {
  userRole: "admin" | "property_manager";
}

const TenantsPageContainer: React.FC<TenantsPageContainerProps> = ({
  userRole,
}) => {
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<TenantDashboard | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "">("");
  const [selectedTenant, setSelectedTenant] = useState<TenantListItem | null>(
    null,
  );

  useEffect(() => {
    loadTenants();
    loadDashboardStats();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadTenants();
    }, 300);
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const loadTenants = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter) params.status = statusFilter;
      const response = await getTenants(params);
      if (Array.isArray(response)) {
        setTenants(response);
      } else {
        setTenants(response?.results || []);
      }
    } catch (error) {
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    setIsStatsLoading(true);
    try {
      const stats = await getTenantDashboard();
      setDashboardStats(stats || null);
    } catch (error) {
      console.error("Failed to load stats");
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    loadTenants();
    loadDashboardStats();
    setIsFormOpen(false);
    setSelectedTenant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {userRole === "admin" ? "Tenants Management" : "My Tenants"}
                </h1>
              </div>
              <p className="text-gray-600">
                {userRole === "admin"
                  ? "Manage all tenants and their lease information"
                  : "Manage tenants for your properties"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  loadTenants();
                  loadDashboardStats();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => {
                  setSelectedTenant(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Add Tenant
              </button>
            </div>
          </div>
        </div>

        <TenantStats
          stats={
            dashboardStats?.stats || {
              total_tenants: 0,
              active_tenants: 0,
              pending_tenants: 0,
              expiring_leases: 0,
              recent_tenants: 0,
            }
          }
          isLoading={isStatsLoading}
          userRole={userRole}
        />

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as TenantStatus | "")
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <TenantList
          tenants={tenants}
          isLoading={isLoading}
          onEdit={(t) => {
            setSelectedTenant(t);
            setIsFormOpen(true);
          }}
          onDelete={async (id) => {
            if (confirm("Delete tenant?")) {
              await deleteTenant(id);
              loadTenants();
              loadDashboardStats();
            }
          }}
          onView={(id) => console.log("View", id)}
          onStatusChange={async (id, status) => {
            await updateTenantStatus(id, status);
            loadTenants();
          }}
          userRole={userRole}
        />

        {isFormOpen && (
          <TenantForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedTenant(null);
            }}
            onSuccess={handleFormSuccess}
            tenant={selectedTenant}
            userRole={userRole}
          />
        )}
      </div>
    </div>
  );
};

export default TenantsPageContainer;
