import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
} from "lucide-react";
import {
  getProperties,
  getPropertiesWithFilters,
  getProperty,
  deleteProperty,
} from "@/app/api/properties/api";
import {
  Property,
  PropertyListItem,
  PropertyListResponse,
} from "@/types/property";
import AssignPropertyManager from "./AssignPropertyManager";

interface PropertyListProps {
  onCreateNew: () => void;
  onEdit: (property: Property) => void;
  onView: (property: Property) => void;
  userRole: "admin" | "property_manager";
}

export default function PropertyList({
  onCreateNew,
  onEdit,
  onView,
  userRole,
}: PropertyListProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);

  // Determine permissions based on user role
  const canCreate = userRole === "admin";
  const canEdit = userRole === "admin";
  const canDelete = userRole === "admin";
  const canAssignManager = userRole === "admin";

  const fetchProperties = async (page = 1, search = "") => {
    setLoading(true);
    setError("");

    try {
      let response: PropertyListResponse;

      if (search.trim()) {
        response = await getPropertiesWithFilters({
          page: page,
          search: search.trim(),
        });
      } else {
        response = await getPropertiesWithFilters({
          page: page,
        });
      }

      setProperties(response.results);
      setTotalCount(response.count);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProperties(1, searchQuery);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProperties(currentPage, searchQuery);
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await deleteProperty(id);
      const newTotalAfterDelete = totalCount - 1;
      const maxPageAfterDelete = Math.ceil(newTotalAfterDelete / 10);
      const pageToLoad =
        currentPage > maxPageAfterDelete
          ? Math.max(1, maxPageAfterDelete)
          : currentPage;

      setCurrentPage(pageToLoad);
      await fetchProperties(pageToLoad, searchQuery);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete property");
    } finally {
      setDeleting(false);
    }
  };

  const handleView = async (propertyItem: PropertyListItem) => {
    try {
      setLoading(true);
      const fullProperty = await getProperty(propertyItem.id);
      onView(fullProperty);
    } catch (err: any) {
      setError(err.message || "Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (propertyItem: PropertyListItem) => {
    try {
      setLoading(true);
      const fullProperty = await getProperty(propertyItem.id);
      onEdit(fullProperty);
    } catch (err: any) {
      setError(err.message || "Failed to fetch property details");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (
    propertyItem: PropertyListItem,
    e: React.MouseEvent,
  ) => {
    if (e.target instanceof HTMLElement && e.target.closest("button")) {
      return; // Let button handle its own click
    }
    await handleView(propertyItem);
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchProperties(1, "");
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getVacancyColor = (rate: string) => {
    const numRate = parseFloat(rate);
    if (numRate > 20) return "bg-red-100 text-red-800 border-red-200";
    if (numRate > 10) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusColor = (isActive: boolean) => {
    if (isActive) return "bg-orange-100 text-orange-500 border-orange-200";
    return "bg-gray-100 text-gray-500 border-gray-200";
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full">
      <Card className="border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-black">
                {userRole === "admin" ? "All Properties" : "My Properties"}
              </CardTitle>
              <CardDescription className="text-black">
                {userRole === "admin"
                  ? `Manage your property listings (${totalCount} total)`
                  : `Properties you manage (${totalCount} total)`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="border-gray-200 text-black hover:bg-gray-100"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              {canCreate && (
                <Button
                  onClick={onCreateNew}
                  className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-black">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties by name or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-black"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md transition-all"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={clearSearch}
                disabled={loading}
                className="border-gray-200 text-black hover:bg-gray-100"
              >
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <span className="ml-2 text-black">Loading properties...</span>
            </div>
          ) : (
            <>
              {properties.length === 0 ? (
                <div className="text-center py-8 text-black">
                  {searchQuery ? (
                    <div className="space-y-2">
                      <p>No properties found matching "{searchQuery}"</p>
                      <Button
                        variant="link"
                        onClick={clearSearch}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        Clear search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>
                        {userRole === "admin"
                          ? "No properties found"
                          : "You don't have any properties assigned yet"}
                      </p>
                      {canCreate && (
                        <Button
                          variant="link"
                          onClick={onCreateNew}
                          className="text-orange-500 hover:text-orange-600"
                        >
                          Create your first property
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manager
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Units
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vacancy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.map((property) => (
                        <tr
                          key={property.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={(e) => handleRowClick(property, e)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                            {property.name}
                          </td>

                          <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-900">
                            {property.address}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {property.manager_name || "Unassigned"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {property.occupied_units_count}/
                            {property.total_units}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Badge
                              className={getVacancyColor(property.vacancy_rate)}
                            >
                              {property.vacancy_rate}%
                            </Badge>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Badge
                              className={getStatusColor(property.is_active)}
                            >
                              {property.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {/* Icon Buttons */}
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView(property);
                                  }}
                                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 h-8 w-8 p-0 flex items-center justify-center"
                                  title="View property details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                {canEdit && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(property);
                                    }}
                                    className="text-green-800 hover:text-green-900 hover:bg-green-50 h-8 w-8 p-0 flex items-center justify-center"
                                    title="Edit property"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}

                                {canDelete && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteId(property.id);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex items-center justify-center"
                                    title="Delete property"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>

                              {/* Assign Manager Button */}
                              {canAssignManager && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPropertyIds([property.id]);
                                    setAssignOpen(true);
                                  }}
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50 h-8 flex items-center gap-1"
                                >
                                  <User className="h-4 w-4" />
                                  <span className="text-sm">Assign</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalCount > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <div className="text-sm text-black">
                    Showing{" "}
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}{" "}
                    to {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                    {totalCount} properties
                    {searchQuery && (
                      <span className="ml-2 text-orange-500">
                        (filtered by "{searchQuery}")
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={!previousPage || loading}
                      className="border-gray-200 text-black hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-black">
                      <span>
                        Page {currentPage} of {Math.max(1, totalPages)}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={!nextPage || loading}
                      className="border-gray-200 text-black hover:bg-gray-100"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {canDelete && (
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={() => setDeleteId(null)}
        >
          <AlertDialogContent className="border-gray-200 bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black">
                Delete Property
              </AlertDialogTitle>
              <AlertDialogDescription className="text-black">
                Are you sure you want to delete this property? This action
                cannot be undone and will permanently remove all associated
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleting}
                className="border-gray-200 text-black hover:bg-gray-100"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete Property"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canAssignManager && assignOpen && selectedPropertyIds.length > 0 && (
        <AssignPropertyManager
          propertyIds={selectedPropertyIds}
          open={assignOpen}
          onClose={() => {
            setAssignOpen(false);
            setSelectedPropertyIds([]);
          }}
          onSuccess={async () => {
            await fetchProperties(currentPage, searchQuery);
          }}
        />
      )}
    </div>
  );
}
