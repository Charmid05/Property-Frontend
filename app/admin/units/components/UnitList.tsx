import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteUnit } from "@/app/api/units/api";
import { Unit, UnitListItem, OCCUPIED_STATUS } from "@/types/units";
import { PropertyListItem } from "@/types/property";
import UnitForm from "../pagination/UnitForm";

interface UnitListProps {
  units: UnitListItem[];
  properties: PropertyListItem[];
  loading: boolean;
  error: string;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: {
    property?: number;
    occupied_status?: string;
    unit_type?: string;
  }) => void;
  onRefresh: () => void;
  // Pagination props
  currentPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  userRole: "admin" | "property_manager";
}

const UnitList: React.FC<UnitListProps> = ({
  units = [], // Default to empty array
  properties = [], // Default to empty array
  loading,
  error,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onRefresh,
  currentPage,
  totalCount,
  hasNext,
  hasPrevious,
  onPageChange,
  userRole,
}) => {
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    property: "",
    occupied_status: "",
    unit_type: "",
  });

  // Determine permissions based on user role
  const canEdit = userRole === "admin";
  const canDelete = userRole === "admin";

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      await deleteUnit(id);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to delete unit:", err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const filterParams: any = {};

    if (newFilters.property && newFilters.property !== "all") {
      filterParams.property = parseInt(newFilters.property);
    }

    if (newFilters.occupied_status && newFilters.occupied_status !== "all") {
      filterParams.occupied_status = newFilters.occupied_status;
    }

    if (newFilters.unit_type && newFilters.unit_type !== "all") {
      filterParams.unit_type = newFilters.unit_type;
    }

    onFilterChange(filterParams);
  };

  const clearFilters = () => {
    setFilters({
      property: "",
      occupied_status: "",
      unit_type: "",
    });
    onFilterChange({});
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Vacant: "bg-green-100 text-green-800 border-green-200",
      Occupied: "bg-red-100 text-red-800 border-red-200",
      Maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Closed: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-2 text-black">Loading units...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          onClick={onRefresh}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search units..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-black w-full"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={filters.property}
              onValueChange={(value) => handleFilterChange("property", value)}
            >
              <SelectTrigger className="bg-white border-gray-300 text-black w-full sm:w-40">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Properties</SelectItem>
                {properties &&
                  properties.length > 0 &&
                  properties.map((property) => (
                    <SelectItem
                      key={property.id}
                      value={property.id.toString()}
                    >
                      {property.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.occupied_status}
              onValueChange={(value) =>
                handleFilterChange("occupied_status", value)
              }
            >
              <SelectTrigger className="bg-white border-gray-300 text-black w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all">All Status</SelectItem>
                {OCCUPIED_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filters.property ||
              filters.occupied_status ||
              filters.unit_type) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-black hover:bg-gray-50"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-black font-medium">Unit</TableHead>
              <TableHead className="text-black font-medium">Property</TableHead>
              <TableHead className="text-black font-medium">Type</TableHead>
              <TableHead className="text-black font-medium">Rent</TableHead>
              <TableHead className="text-black font-medium">Status</TableHead>
              <TableHead className="text-black font-medium">Created</TableHead>
              <TableHead className="text-black font-medium w-12">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!units || units.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {loading
                    ? "Loading units..."
                    : userRole === "property_manager"
                      ? "No units found for your properties. Try adjusting your search or filters."
                      : "No units found. Try adjusting your search or filters."}
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <TableRow
                  key={unit.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-black">{unit.name}</div>
                      <div className="text-sm text-gray-600">
                        {unit.abbreviated_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    {unit.property_name}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-black">{unit.unit_type}</div>
                      <div className="text-sm text-gray-600">
                        {unit.unit_type_display}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">
                    {formatCurrency(unit.monthly_rent)}
                  </TableCell>
                  <TableCell>{getStatusBadge(unit.occupied_status)}</TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(unit.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-gray-200"
                      >
                        <DropdownMenuItem className="text-black hover:bg-gray-50">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {canEdit && (
                          <DropdownMenuItem className="text-black hover:bg-gray-50">
                            <UnitForm
                              mode="edit"
                              unit={unit as any}
                              onSuccess={onRefresh}
                              userRole={userRole}
                              trigger={
                                <div className="flex items-center w-full cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Unit
                                </div>
                              }
                            />
                          </DropdownMenuItem>
                        )}

                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 hover:bg-red-50"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Unit
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-black">
                                    Delete Unit
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{unit.name}
                                    "? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-300 text-black hover:bg-gray-50">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(unit.id)}
                                    disabled={deleteLoading === unit.id}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    {deleteLoading === unit.id && (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    )}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {units && units.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>
            Showing {units.length} of {totalCount} units
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrevious}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="px-3 py-1 bg-gray-100 rounded text-black">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitList;
