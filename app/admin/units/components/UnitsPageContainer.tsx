"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Plus, FileText, Download } from "lucide-react";
import UnitForm from "../pagination/UnitForm";
import UnitList from "./UnitList";
import UnitStatsCard from "../pagination/UnitStatsCard";
import { getUnitsWithFilters } from "@/app/api/units/api";
import { getPropertiesWithFilters } from "@/app/api/properties/api";
import { Unit, UnitListItem, UnitListResponse } from "@/types/units";
import {
  Property,
  PropertyListItem,
  PropertyListResponse,
} from "@/types/property";

interface UnitsPageContainerProps {
  userRole: "admin" | "property_manager";
}

const UnitsPageContainer: React.FC<UnitsPageContainerProps> = ({
  userRole,
}) => {
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<{
    property?: number;
    occupied_status?: string;
    unit_type?: string;
  }>({});

  // Determine permissions based on user role
  const canCreate = true; // Both admin and property_manager can create units
  const canEdit = userRole === "admin"; // Only admin can edit units
  const canDelete = userRole === "admin"; // Only admin can delete units

  const fetchUnits = async (page = 1, search = "", filterParams = {}) => {
    setLoading(true);
    setError("");

    try {
      let response: UnitListResponse;

      const params = {
        page: page,
        ...filterParams,
        search: search.trim() ? search.trim() : undefined,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      response = await getUnitsWithFilters(params);

      // Ensure we have the expected structure
      const units = response.results || [];
      const count = response.count || 0;

      setUnits(units);
      setTotalCount(count);
      setNextPage(response.next || null);
      setPreviousPage(response.previous || null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response: PropertyListResponse = await getPropertiesWithFilters({});
      setProperties(response.results || []);
    } catch (err: any) {
      console.error("Failed to fetch properties:", err.message);
      setProperties([]); // Ensure it's always an array
    }
  };

  useEffect(() => {
    // Initial load
    fetchProperties();
    fetchUnits(1, "", {});
  }, []);

  useEffect(() => {
    fetchUnits(currentPage, searchQuery, filters);
  }, [currentPage, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUnits(1, searchQuery, filters);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchUnits(currentPage, searchQuery, filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: {
    property?: number;
    occupied_status?: string;
    unit_type?: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  const handleUnitSuccess = () => {
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Unit Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {userRole === "admin"
                ? "Manage and monitor all property units"
                : "Manage units for your properties"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            {canCreate && (
              <UnitForm
                mode="create"
                onSuccess={handleUnitSuccess}
                userRole={userRole}
                trigger={
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto flex items-center gap-2 px-3 py-2 text-sm">
                    <Plus className="w-4 h-4" />
                    Add Unit
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <UnitStatsCard refreshTrigger={refreshTrigger} userRole={userRole} />

        {/* Main Content */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 px-4 py-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Units List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <UnitList
              units={units}
              properties={properties}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onRefresh={handleRefresh}
              currentPage={currentPage}
              totalCount={totalCount}
              hasNext={!!nextPage}
              hasPrevious={!!previousPage}
              onPageChange={handlePageChange}
              userRole={userRole}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitsPageContainer;
