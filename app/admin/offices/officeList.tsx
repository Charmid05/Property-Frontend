import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  RefreshCw,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { getOffices, searchOffices, deleteOffice } from "@/app/api/office/api";
import { Office } from "@/types/office";

interface OfficeListProps {
  onCreateNew: () => void;
  onEdit: (office: Office) => void;
  onView: (office: Office) => void;
}

export default function OfficeList({
  onCreateNew,
  onEdit,
  onView,
}: OfficeListProps) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffices = async (search = "") => {
    setLoading(true);
    setError("");

    try {
      let response: Office[];

      if (search.trim()) {
        response = await searchOffices(search.trim());
      } else {
        response = await getOffices();
      }

      setOffices(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch offices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleSearch = () => {
    fetchOffices(searchQuery);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOffices(searchQuery);
    setRefreshing(false);
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await deleteOffice(id);
      await fetchOffices(searchQuery);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete office");
    } finally {
      setDeleting(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchOffices("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getManagerDisplayName = (manager: Office["manager"]) => {
    if (manager.first_name || manager.last_name) {
      return `${manager.first_name} ${manager.last_name}`.trim();
    }
    return manager.username;
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="border-green-200 shadow-sm">
        <CardHeader className="bg-green-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-green-800">
                Offices
              </CardTitle>
              <CardDescription className="text-green-600">
                Manage your office locations ({offices.length} total)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={onCreateNew}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Office
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
              <Input
                placeholder="Search offices by name, address, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Search
            </Button>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={clearSearch}
                disabled={loading}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                Clear
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-green-600">Loading offices...</span>
            </div>
          ) : (
            <div className="rounded-md border border-green-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50/50">
                    <TableHead className="text-green-800">
                      Office Name
                    </TableHead>
                    <TableHead className="text-green-800">Manager</TableHead>
                    <TableHead className="text-green-800">Contact</TableHead>
                    <TableHead className="text-green-800">Address</TableHead>
                    <TableHead className="text-green-800">Created</TableHead>
                    <TableHead className="text-right text-green-800">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offices.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-green-600"
                      >
                        {searchQuery ? (
                          <div className="space-y-2">
                            <p>No offices found matching "{searchQuery}"</p>
                            <Button
                              variant="link"
                              onClick={clearSearch}
                              className="text-green-600 hover:text-green-700"
                            >
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p>No offices found</p>
                            <Button
                              variant="link"
                              onClick={onCreateNew}
                              className="text-green-600 hover:text-green-700"
                            >
                              Create your first office
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    offices.map((office) => (
                      <TableRow
                        key={office.id}
                        className="hover:bg-green-50/30"
                      >
                        <TableCell className="font-medium text-green-800">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-green-600" />
                            {office.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-700">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            {getManagerDisplayName(office.manager)}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-700">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-green-600" />
                              {office.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              {office.contact_number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-green-700">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            {office.address}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-700">
                          {formatDate(office.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(office)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="View office details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(office)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              title="Edit office"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(office.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deleting}
                              title="Delete office"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent className="border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-800">
              Delete Office
            </AlertDialogTitle>
            <AlertDialogDescription className="text-green-700">
              Are you sure you want to delete this office? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Office"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
