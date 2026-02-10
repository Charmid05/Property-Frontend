import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit } from "lucide-react";
import { createUnit, updateUnit } from "@/app/api/units/api";
import { getPropertiesWithFilters } from "@/app/api/properties/api";
import {
  Unit,
  UnitCreateRequest,
  UnitUpdateRequest,
  UNIT_TYPES,
  OCCUPIED_STATUS,
} from "@/types/units";
import {
  Property,
  PropertyListItem,
  PropertyListResponse,
} from "@/types/property";

interface UnitFormProps {
  unit?: Unit;
  onSuccess: () => void;
  trigger?: React.ReactNode;
  mode?: "create" | "edit";
  userRole: "admin" | "property_manager";
}

const UnitForm: React.FC<UnitFormProps> = ({
  unit,
  onSuccess,
  trigger,
  mode = "create",
  userRole,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    property: unit?.property || 0,
    name: unit?.name || "",
    abbreviated_name: unit?.abbreviated_name || "",
    unit_number: unit?.unit_number || "",
    unit_type: unit?.unit_type || "",
    description: unit?.description || "",
    monthly_rent: unit?.monthly_rent || "",
    deposit_amount: unit?.deposit_amount || "",
    occupied_status:
      unit?.occupied_status ||
      ("Vacant" as "Occupied" | "Vacant" | "Maintenance" | "Closed"),
  });

  // Determine permissions based on user role
  const canCreate = true; // Both admin and property_manager can create
  const canEdit = userRole === "admin"; // Only admin can edit

  const fetchProperties = async (search = "") => {
    setPropertiesLoading(true);
    try {
      let response: PropertyListResponse;

      if (search.trim()) {
        response = await getPropertiesWithFilters({
          search: search.trim(),
        });
      } else {
        response = await getPropertiesWithFilters({});
      }

      setProperties(response.results);
    } catch (err: any) {
      console.error("Failed to fetch properties:", err.message);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProperties();
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "property" ? parseInt(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.property) {
      setError("Please select a property");
      return false;
    }
    if (!formData.name.trim()) {
      setError("Unit name is required");
      return false;
    }
    if (!formData.abbreviated_name.trim()) {
      setError("Abbreviated name is required");
      return false;
    }
    if (!formData.unit_number.trim()) {
      setError("Unit number is required");
      return false;
    }
    if (!formData.unit_type.trim()) {
      setError("Unit type is required");
      return false;
    }
    if (!formData.monthly_rent.trim()) {
      setError("Monthly rent is required");
      return false;
    }
    if (!formData.deposit_amount.trim()) {
      setError("Deposit amount is required");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check permissions
    if (mode === "create" && !canCreate) {
      setError("You don't have permission to create units");
      return;
    }

    if (mode === "edit" && !canEdit) {
      setError("You don't have permission to edit units");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await createUnit(formData as UnitCreateRequest);
      } else if (unit) {
        await updateUnit(unit.id, formData as UnitUpdateRequest);
      }

      setOpen(false);
      onSuccess();

      // Reset form if creating
      if (mode === "create") {
        setFormData({
          property: 0,
          name: "",
          abbreviated_name: "",
          unit_number: "",
          unit_type: "",
          description: "",
          monthly_rent: "",
          deposit_amount: "",
          occupied_status: "Vacant",
        });
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} unit`);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
      {mode === "create" ? (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </>
      ) : (
        <>
          <Edit className="w-4 h-4 mr-2" />
          Edit Unit
        </>
      )}
    </Button>
  );

  // If user doesn't have permission for this action, don't show the form
  if (mode === "edit" && !canEdit) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-black">
            {mode === "create" ? "Create New Unit" : "Edit Unit"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === "create"
              ? "Add a new unit to your property management system."
              : "Update the unit information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="property" className="text-black">
              Property *
            </Label>
            <Select
              value={formData.property.toString()}
              onValueChange={(value) => handleSelectChange("property", value)}
              disabled={mode === "edit"} // Can't change property when editing
            >
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue placeholder="Select a property">
                  {propertiesLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mode === "edit" && (
              <p className="text-xs text-gray-500">
                Property cannot be changed when editing
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">
                Unit Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white border-gray-300 text-black"
                placeholder="e.g., Sunny Apartments"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abbreviated_name" className="text-black">
                Abbreviated Name *
              </Label>
              <Input
                id="abbreviated_name"
                name="abbreviated_name"
                value={formData.abbreviated_name}
                onChange={handleInputChange}
                className="bg-white border-gray-300 text-black"
                placeholder="e.g., SA"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_number" className="text-black">
                Unit Number *
              </Label>
              <Input
                id="unit_number"
                name="unit_number"
                value={formData.unit_number}
                onChange={handleInputChange}
                className="bg-white border-gray-300 text-black"
                placeholder="e.g., 101B"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_type" className="text-black">
                Unit Type *
              </Label>
              <Select
                value={formData.unit_type}
                onValueChange={(value) =>
                  handleSelectChange("unit_type", value)
                }
              >
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Select unit type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  {UNIT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-black">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-white border-gray-300 text-black"
              placeholder="Unit description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_rent" className="text-black">
                Monthly Rent *
              </Label>
              <Input
                id="monthly_rent"
                name="monthly_rent"
                type="number"
                value={formData.monthly_rent}
                onChange={handleInputChange}
                className="bg-white border-gray-300 text-black"
                placeholder="1200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_amount" className="text-black">
                Deposit Amount *
              </Label>
              <Input
                id="deposit_amount"
                name="deposit_amount"
                type="number"
                value={formData.deposit_amount}
                onChange={handleInputChange}
                className="bg-white border-gray-300 text-black"
                placeholder="500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupied_status" className="text-black">
              Status
            </Label>
            <Select
              value={formData.occupied_status}
              onValueChange={(value) =>
                handleSelectChange("occupied_status", value)
              }
            >
              <SelectTrigger className="bg-white border-gray-300 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {OCCUPIED_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Unit" : "Update Unit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UnitForm;
