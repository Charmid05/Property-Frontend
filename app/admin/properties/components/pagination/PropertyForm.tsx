import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getUsers } from "@/app/api/users/api";
import {
  Loader2,
  Upload,
  X,
  MapPin,
  FileText,
  Building,
  Save,
  CheckCircle,
} from "lucide-react";
import { createProperty, updateProperty } from "@/app/api/properties/api";
import {
  Property,
  PropertyCreateRequest,
  PropertyUpdateRequest,
} from "@/types/property";

interface PropertyFormProps {
  property?: Property;
  onSuccess: (property: Property) => void;
  onClose: () => void;
  isOpen: boolean;
  userRole: "admin" | "property_manager";
}

export default function PropertyForm({
  property,
  onSuccess,
  onClose,
  isOpen,
  userRole,
}: PropertyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    office: "",
    manager: "",
    is_active: true,
  });

  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = !!property;

  // Property managers cannot create or edit properties - only admins can
  const canSubmit = userRole === "admin";

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        description: property.description || "",
        office: property.office.id.toString(),
        manager: property.manager.id.toString(),
        is_active: property.is_active,
      });

      if (property.picture_url) {
        setPicturePreview(property.picture_url);
      }
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        office: "",
        manager: "",
        is_active: true,
      });
      setPictureFile(null);
      setPicturePreview("");
    }
    setError("");
    setSuccess("");
  }, [property, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setPictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePicture = () => {
    setPictureFile(null);
    setPicturePreview("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Property name is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Property address is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("You don't have permission to perform this action");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result: Property;

      if (isEditing && property) {
        // Update existing property
        const updateData: PropertyUpdateRequest = {
          name: formData.name,
          address: formData.address,
          description: formData.description || undefined,
          office: parseInt(formData.office),
          manager: parseInt(formData.manager),
          is_active: formData.is_active,
        };

        // Only include picture if a new file was selected
        if (pictureFile) {
          updateData.picture = pictureFile;
        }

        result = await updateProperty(property.id, updateData);
        setSuccess("Property updated successfully!");
      } else {
        // Create new property
        const createData: PropertyCreateRequest = {
          name: formData.name,
          address: formData.address,
          description: formData.description || undefined,
          office: parseInt(formData.office),
          manager: parseInt(formData.manager),
          is_active: formData.is_active,
        };

        if (pictureFile) {
          createData.picture = pictureFile;
        }

        result = await createProperty(createData);
        setSuccess("Property created successfully!");
      }

      // Call the success callback
      onSuccess(result);

      // Reset form for new property creation
      if (!isEditing) {
        setFormData({
          name: "",
          address: "",
          description: "",
          office: "",
          manager: "",
          is_active: true,
        });
        setPictureFile(null);
        setPicturePreview("");
      }

      // Close the form after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the property");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // If property manager tries to access this form
  if (!canSubmit) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
        <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
          <div className="sticky top-0 bg-white border-b p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-red-900">
                  Access Denied
                </h2>
                <p className="text-red-600 mt-1">
                  You don't have permission to access this form
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Only administrators can create or edit properties.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-900">
                {isEditing ? "Edit Property" : "Add New Property"}
              </h2>
              <p className="text-green-600 mt-1">
                {isEditing
                  ? "Update property information"
                  : "Create a new property profile"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
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
                <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Property Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Basic property details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-green-700"
                    >
                      Property Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter property name"
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="is_active"
                      className="text-sm font-medium text-green-700"
                    >
                      Status
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={handleSwitchChange}
                        className="data-[state=checked]:bg-green-600"
                        disabled={loading}
                      />
                      <Label
                        htmlFor="is_active"
                        className="text-sm font-medium text-green-700"
                      >
                        Active Property
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Property location details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-green-700"
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
                      placeholder="Enter property address"
                      className="w-full pl-10 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows={3}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 shadow-sm">
              <CardHeader className="bg-green-50/50">
                <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Additional Information
                </CardTitle>
                <CardDescription className="text-green-600">
                  Optional property details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-green-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter property description"
                    className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 mt-6">
                  <Label className="text-sm font-medium text-green-700">
                    Property Picture
                  </Label>
                  <div className="p-6 border-2 border-dashed border-green-200 rounded-md bg-green-50/50">
                    <div className="flex flex-col items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                        disabled={loading}
                      />
                      <p className="text-sm text-green-600">
                        Upload a property image (optional)
                      </p>
                    </div>
                  </div>

                  {picturePreview && (
                    <div className="relative inline-block mt-4">
                      <img
                        src={picturePreview}
                        alt="Property preview"
                        className="w-40 h-40 object-cover rounded-md border border-green-200"
                      />
                      <Button
                        type="button"
                        onClick={removePicture}
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 bg-red-500 hover:bg-red-600 text-white"
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
                disabled={loading}
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
                    {isEditing ? "Update Property" : "Create Property"}
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
