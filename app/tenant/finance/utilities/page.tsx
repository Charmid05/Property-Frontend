"use client";

import React, { useState, useEffect } from "react";
import { Zap, Droplet, Flame, Wifi, Trash2, Shield } from "lucide-react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { getUtilityCharges } from "@/app/api/finance";
import { getBillingPeriods } from "@/app/api/finance";
import type { UtilityCharge } from "@/types/finance";
import { toast } from "sonner";

export default function TenantUtilitiesPage() {
  const [charges, setCharges] = useState<UtilityCharge[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [billedFilter, setBilledFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [typeFilter, periodFilter, billedFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chargesData, periodsData] = await Promise.all([
        getUtilityCharges({
          utility_type: typeFilter || undefined,
          billing_period: periodFilter ? parseInt(periodFilter) : undefined,
          is_billed: billedFilter ? billedFilter === "true" : undefined,
        }),
        getBillingPeriods(),
      ]);

      setCharges(Array.isArray(chargesData) ? chargesData : []);
      setPeriods(Array.isArray(periodsData) ? periodsData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load utility charges");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTypeFilter("");
    setPeriodFilter("");
    setBilledFilter("");
  };

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "Electricity":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "Water":
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case "Gas":
        return <Flame className="h-5 w-5 text-orange-500" />;
      case "Internet":
        return <Wifi className="h-5 w-5 text-purple-500" />;
      case "Garbage Collection":
        return <Trash2 className="h-5 w-5 text-green-600" />;
      case "Security":
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: "Utility Type",
      accessor: (row: UtilityCharge) => (
        <div className="flex items-center gap-2">
          {getUtilityIcon(row.utility_type)}
          <span className="font-medium">{row.utility_type}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: (row: UtilityCharge) => (
        <span className="font-semibold text-lg">${row.amount}</span>
      ),
    },
    {
      header: "Description",
      accessor: "description" as keyof UtilityCharge,
      className: "text-sm",
    },
    {
      header: "Reference",
      accessor: "reference_number" as keyof UtilityCharge,
      className: "text-sm text-gray-600",
    },
    {
      header: "Status",
      accessor: (row: UtilityCharge) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.is_billed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.is_billed ? "Billed" : "Pending"}
        </span>
      ),
    },
  ];

  // Calculate totals by utility type
  const utilityTotals = charges.reduce(
    (acc, charge) => {
      if (!acc[charge.utility_type]) {
        acc[charge.utility_type] = 0;
      }
      acc[charge.utility_type] += parseFloat(charge.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedUtilityTypes = Object.entries(utilityTotals).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Utility Charges</h1>
        <p className="text-gray-600 mt-1">
          Breakdown of your utility bills and consumption
        </p>
      </div>

      {/* Utility Breakdown Cards */}
      {sortedUtilityTypes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-3">
            Total by Utility Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUtilityTypes.map(([type, total]) => {
              const icon = getUtilityIcon(type);
              const count = charges.filter(
                (c) => c.utility_type === type,
              ).length;

              return (
                <div
                  key={type}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="font-medium text-gray-900">{type}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {count} {count === 1 ? "charge" : "charges"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Charges</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            $
            {charges
              .reduce((sum, c) => sum + parseFloat(c.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700 font-medium">Pending Bills</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            $
            {charges
              .filter((c) => !c.is_billed)
              .reduce((sum, c) => sum + parseFloat(c.amount), 0)
              .toFixed(2)}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            {charges.filter((c) => !c.is_billed).length} unbilled
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Billed Charges</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            $
            {charges
              .filter((c) => c.is_billed)
              .reduce((sum, c) => sum + parseFloat(c.amount), 0)
              .toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {charges.filter((c) => c.is_billed).length} billed
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              About Utility Charges
            </h3>
            <div className="mt-2 text-sm text-purple-700">
              <p>
                Utility charges are added to your monthly invoice. "Pending"
                charges will appear on your next invoice, while "Billed" charges
                have already been invoiced.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm=""
        onSearchChange={() => {}}
        filters={[
          {
            name: "type",
            label: "All Utilities",
            value: typeFilter,
            options: [
              { value: "Electricity", label: "Electricity" },
              { value: "Water", label: "Water" },
              { value: "Gas", label: "Gas" },
              { value: "Internet", label: "Internet" },
              { value: "Garbage Collection", label: "Garbage Collection" },
              { value: "Security", label: "Security" },
              { value: "Sewer", label: "Sewer" },
              { value: "Other", label: "Other" },
            ],
            onChange: setTypeFilter,
          },
          {
            name: "period",
            label: "Billing Period",
            value: periodFilter,
            options: periods.map((p) => ({
              value: p.id.toString(),
              label: p.name,
            })),
            onChange: setPeriodFilter,
          },
          {
            name: "billed",
            label: "Status",
            value: billedFilter,
            options: [
              { value: "false", label: "Pending" },
              { value: "true", label: "Billed" },
            ],
            onChange: setBilledFilter,
          },
        ]}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable
          data={charges}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No utility charges found"
        />
      </div>
    </div>
  );
}
