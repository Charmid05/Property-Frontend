import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  X,
  MapPin,
  FileText,
  Building,
  Save,
  CheckCircle,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { createOffice, updateOffice } from "@/app/api/office/api";
import { getUsers } from "@/app/api/users/api";
import {
  Office,
  OfficeCreateRequest,
  OfficeUpdateRequest,
} from "@/types/office";

interface OfficeFormProps {
  office?: Office;
  onSuccess: (office: Office) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface Manager {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  full_name: string;
}

export default function OfficeForm({
  office,
  onSuccess,
  onClose,
  isOpen,
}: OfficeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    description: "",
    address: "",
    contact_number: "",
    email: "",
  });

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [managersLoading, setManagersLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = !!office;

  useEffect(() => {
    if (isOpen) {
      loadManagers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (office) {
      setFormData({
        name: office.name,
        manager: office.manager.id.toString(),
        description: office.description || "",
        address: office.address,
        contact_number: office.contact_number,
        email: office.email,
      });
    } else {
      setFormData({
        name: "",
        manager: "",
        description: "",
        address: "",
        contact_number: "",
        email: "",
      });
    }
    setError("");
    setSuccess("");
  }, [office, isOpen]);

  const loadManagers = async () => {
    setManagersLoading(true);
    try {
      // Fetch all users from API
      const usersData = await getUsers();

      // Filter for property managers who are active
      const managersData = usersData.filter(
        (user) => user.role === "property_manager" && user.is_active
      );

      setManagers(managersData);
    } catch (error) {
      console.error("Error loading managers:", error);
      setError("Failed to load managers");
    } finally {
      setManagersLoading(false);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Office name is required");
      return false;
    }
    if (!formData.manager) {
      setError("Manager selection is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Office address is required");
      return false;
    }
    if (!formData.contact_number.trim()) {
      setError("Contact number is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result: Office;

      if (isEditing && office) {
        // Update existing office
        const updateData: OfficeUpdateRequest = {
          name: formData.name,
          manager: parseInt(formData.manager),
          description: formData.description || undefined,
          address: formData.address,
          contact_number: formData.contact_number,
          email: formData.email,
        };

        result = await updateOffice(office.id, updateData);
        setSuccess("Office updated successfully!");
      } else {
        // Create new office
        const createData: OfficeCreateRequest = {
          name: formData.name,
          manager: parseInt(formData.manager),
          description: formData.description,
          address: formData.address,
          contact_number: formData.contact_number,
          email: formData.email,
        };

        result = await createOffice(createData);
        setSuccess("Office created successfully!");
      }

      onSuccess(result);

      // Reset form for new office creation
      if (!isEditing) {
        setFormData({
          name: "",
          manager: "",
          description: "",
          address: "",
          contact_number: "",
          email: "",
        });
      }

      // Close the form after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the office");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b border-green-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">
                {isEditing ? "Edit Office" : "Add New Office"}
              </h2>
              <p className="text-green-600 mt-1">
                {isEditing
                  ? "Update office information"
                  : "Create a new office profile"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-green-600 hover:bg-green-50"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <Building className="mr-2 h-5 w-5 text-green-600" />
                  Office Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Basic office details and management
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-black"
                    >
                      Office Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter office name"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500 text-black"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="manager"
                      className="text-sm font-medium text-black"
                    >
                      Manager <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.manager}
                      onValueChange={(value) =>
                        handleSelectChange("manager", value)
                      }
                      required
                      disabled={loading || managersLoading}
                    >
                      <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500 text-black">
                        <SelectValue
                          placeholder={
                            managersLoading
                              ? "Loading managers..."
                              : "Select a manager"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem
                            key={manager.id}
                            value={manager.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="text-black">
                                {manager.full_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {manager.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  Location & Contact Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Office location and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-black"
                    >
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-green-400 h-4 w-4" />
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter office address"
                        className="w-full pl-10 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                        rows={3}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact_number"
                        className="text-sm font-medium text-black"
                      >
                        Contact Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                        <Input
                          id="contact_number"
                          name="contact_number"
                          value={formData.contact_number}
                          onChange={handleInputChange}
                          placeholder="Enter contact number"
                          className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500 text-black"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-black"
                      >
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter office email"
                          className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500 text-black"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-black flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  Additional Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Office description and details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-black"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter office description"
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
                    rows={4}
                    disabled={loading}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t border-green-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="min-w-[100px] border-green-200 text-green-700 hover:bg-green-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || managersLoading}
                className="min-w-[120px] bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Office" : "Create Office"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
