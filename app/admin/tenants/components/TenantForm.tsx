"use client";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  X,
  User,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  TenantCreateRequest,
  TenantStatus,
  Gender,
  UserRole,
  TenantListItem,
} from "@/types/tenant";
import { PropertyListItem } from "@/types/property";
import { UnitListItem } from "@/types/units";
import { getPropertiesWithFilters } from "@/app/api/properties/api";
import { getUnitsWithFilters } from "@/app/api/units/api";
import { createTenant, updateTenant } from "@/app/api/tenant/api";

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant?: TenantListItem | null;
  userRole: "admin" | "property_manager";
}

const TenantForm: React.FC<TenantFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  tenant,
  userRole,
}) => {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!tenant;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TenantCreateRequest>({
    defaultValues: {
      role: "tenant",
      status: "pending",
      send_welcome_email: true,
      gender: "",
      phone_number: "",
      notes: "",
    },
  });

  const [watchProperty, setWatchProperty] = useState<number | null>(null);
  const watchUnit = watch("unit");

  // Load properties on mount
  useEffect(() => {
    if (isOpen) {
      loadProperties();
      reset(); // Reset form when modal opens
    }
  }, [isOpen, reset]);

  // Load units when property changes
  const handlePropertyChange = (propertyId: number) => {
    if (propertyId) {
      loadUnits(propertyId);
      setWatchProperty(propertyId);
    } else {
      setUnits([]);
      setWatchProperty(null);
    }
  };

  const loadProperties = async () => {
    setIsLoadingProperties(true);
    try {
      const response = await getPropertiesWithFilters();
      setProperties(response.results || []);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const loadUnits = async (propertyId: number) => {
    setIsLoadingUnits(true);
    try {
      const response = await getUnitsWithFilters({
        property: propertyId,
      });
      setUnits(response.results || []);
      setValue("unit", 0); // Reset unit selection
    } catch (error) {
      console.error("Failed to load units:", error);
      setUnits([]);
    } finally {
      setIsLoadingUnits(false);
    }
  };

  const onSubmit = async (data: TenantCreateRequest) => {
    setIsSubmitting(true);
    try {
      if (isEditing && tenant) {
        await updateTenant(tenant.id, data);
      } else {
        await createTenant(data);
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to create tenant:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Tenant" : "Add New Tenant"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-8">
          {/* Property & Unit Selection */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium text-gray-900">Property & Unit</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property *
                </label>
                <Controller
                  name="unit" // This should be a separate field for property selection
                  control={control}
                  rules={{ required: "Property is required" }}
                  render={({ field }) => (
                    <select
                      value={watchProperty || ""}
                      onChange={(e) => {
                        const propertyId = Number(e.target.value);
                        handlePropertyChange(propertyId);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={isLoadingProperties}
                    >
                      <option value="">
                        {isLoadingProperties
                          ? "Loading properties..."
                          : "Select a property"}
                      </option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.name} - {property.address}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">
                    Property is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <Controller
                  name="unit"
                  control={control}
                  rules={{ required: "Unit is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={isLoadingUnits || !watchProperty}
                    >
                      <option value="">
                        {isLoadingUnits
                          ? "Loading units..."
                          : watchProperty
                            ? "Select a unit"
                            : "Select property first"}
                      </option>
                      {units.map((unit) => (
                        <option
                          key={unit.id}
                          value={unit.id}
                          className={
                            unit.occupied_status === "Occupied"
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {unit.name} - {unit.unit_type_display} ($
                          {unit.monthly_rent}/month)
                          {unit.occupied_status === "Occupied"
                            ? " - OCCUPIED"
                            : ""}
                          {unit.occupied_status === "Maintenance"
                            ? " - MAINTENANCE"
                            : ""}
                          {unit.occupied_status === "Closed" ? " - CLOSED" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.unit.message}
                  </p>
                )}
                {watchUnit &&
                  units.find((u) => u.id === watchUnit)?.occupied_status ===
                    "Occupied" && (
                    <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                      ⚠️ Warning: This unit is currently occupied
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      value={field.value ?? ""} // ✅ fallback to empty string
                      placeholder="Enter username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                />

                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        {...field}
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      value={field.value ?? ""} // ✅ ensure controlled
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                />

                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  )}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        {...field}
                        type="tel"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Password Fields - Only show when creating new tenant */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <Controller
                    name="password2"
                    control={control}
                    rules={{
                      required: "Password confirmation is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Confirm password"
                      />
                    )}
                  />
                  {errors.password2 && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password2.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Lease Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-orange-500" />
              <h3 className="font-medium text-gray-900">Lease Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Start Date *
                </label>
                <Controller
                  name="lease_start_date"
                  control={control}
                  rules={{ required: "Lease start date is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      value={field.value ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.lease_start_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lease_start_date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease End Date
                </label>
                <Controller
                  name="lease_end_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      value={field.value !== null ? field.value : ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move In Date
                </label>
                <Controller
                  name="move_in_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      value={field.value !== null ? field.value : ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  )}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent Override
                </label>
                <Controller
                  name="monthly_rent_override"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter amount"
                        value={field.value ?? ""}
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount Override
                </label>
                <Controller
                  name="deposit_amount_override"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter amount"
                        value={field.value ?? ""}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Enter any additional notes..."
                  />
                </div>
              )}
            />
          </div>

          {/* Welcome Email Toggle - Only show when creating */}
          {!isEditing && (
            <div className="flex items-center gap-3">
              <Controller
                name="send_welcome_email"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                )}
              />
              <label className="text-sm text-gray-700">
                Send welcome email to tenant
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Tenant"
              ) : (
                "Create Tenant"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantForm;
