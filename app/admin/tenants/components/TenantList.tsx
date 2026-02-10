"use client";
import React, { JSX, useRef, useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  DollarSign,
  MoreVertical,
  Calendar,
  MapPin,
} from "lucide-react";
import { TenantListItem, TenantStatus } from "@/types/tenant";

interface TenantListProps {
  tenants: TenantListItem[];
  isLoading: boolean;
  onEdit: (tenant: TenantListItem) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onStatusChange: (id: number, status: TenantStatus) => void;
  userRole: "admin" | "property_manager";
}

const TenantList: React.FC<TenantListProps> = ({
  tenants,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  userRole,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">(
    "down",
  );
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const getStatusColor = (status: TenantStatus): string => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
      suspended: "bg-red-100 text-red-800",
      moved_out: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusDisplay = (status: TenantStatus): string => {
    const displays = {
      active: "Active",
      pending: "Pending",
      inactive: "Inactive",
      suspended: "Suspended",
      moved_out: "Moved Out",
    };
    return displays[status] || status;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const handleToggleDropdown = (tenantId: number) => {
    const newActive = activeDropdown === tenantId ? null : tenantId;
    setActiveDropdown(newActive);

    if (newActive !== null && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If not enough space below (less than 200px), open upward
      setDropdownDirection(
        spaceBelow < 200 && spaceAbove > spaceBelow ? "up" : "down",
      );
    }
  };

  const getDaysUntilExpiry = (days: number | null): JSX.Element => {
    if (days === null)
      return <span className="text-gray-500">No end date</span>;
    if (days < 0)
      return <span className="text-red-600 font-medium">Expired</span>;
    if (days <= 30)
      return <span className="text-orange-600 font-medium">{days} days</span>;
    return <span className="text-gray-600">{days} days</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tenants found
        </h3>
        <p className="text-gray-500 mb-6">
          {userRole === "admin"
            ? "Get started by adding your first tenant."
            : "No tenants found for your properties. Add your first tenant to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property & Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lease Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires In
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-500">
                        {tenant.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {tenant.user_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {tenant.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tenant.property_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Unit {tenant.unit_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      tenant.status,
                    )}`}
                  >
                    {getStatusDisplay(tenant.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tenant.monthly_rent
                    ? formatCurrency(tenant.monthly_rent)
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{formatDate(tenant.lease_start_date)}</div>
                  <div className="text-gray-500">
                    to{" "}
                    {tenant.lease_end_date
                      ? formatDate(tenant.lease_end_date)
                      : "Ongoing"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getDaysUntilExpiry(tenant.days_until_lease_expires)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <div className="inline-block text-left">
                    <button
                      ref={buttonRef}
                      onClick={() => handleToggleDropdown(tenant.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>

                    {activeDropdown === tenant.id && (
                      <div
                        className={`absolute right-0 z-50 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${
                          dropdownDirection === "up"
                            ? "bottom-full mb-2"
                            : "top-full mt-2"
                        }`}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onView(tenant.id);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              onEdit(tenant);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Tenant
                          </button>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => {
                                onDelete(tenant.id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Tenant
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-orange-500">
                      {tenant.user_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tenant.user_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tenant.property_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Unit {tenant.unit_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      tenant.status,
                    )}`}
                  >
                    {getStatusDisplay(tenant.status)}
                  </span>
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === tenant.id ? null : tenant.id,
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {tenant.monthly_rent
                    ? formatCurrency(tenant.monthly_rent)
                    : "N/A"}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  {getDaysUntilExpiry(tenant.days_until_lease_expires)}
                </div>
              </div>

              {/* Mobile Dropdown */}
              {activeDropdown === tenant.id && (
                <div className="mt-3 bg-gray-50 rounded-md p-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onView(tenant.id);
                        setActiveDropdown(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white rounded border hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        onEdit(tenant);
                        setActiveDropdown(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white rounded border hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(tenant.id);
                        setActiveDropdown(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-700 bg-white rounded border hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantList;