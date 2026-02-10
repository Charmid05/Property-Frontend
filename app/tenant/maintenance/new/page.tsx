"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wrench,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createMaintenanceRequest } from "@/app/api/maintenance/api";
import type { MaintenanceRequestCreateRequest } from "@/types/maintenance";
import { toast } from "sonner";
import { useAuthContext } from "@/context/ApiContext";

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<MaintenanceRequestCreateRequest>({
    title: "",
    description: "",
    category: "other",
    priority: "medium",
    tenant_notes: "",
  });

  const categories = [
    { value: "plumbing", label: "Plumbing", icon: "🚰" },
    { value: "electrical", label: "Electrical", icon: "⚡" },
    { value: "hvac", label: "HVAC / Climate", icon: "❄️" },
    { value: "appliance", label: "Appliance", icon: "🔌" },
    { value: "structural", label: "Structural", icon: "🏗️" },
    { value: "pest_control", label: "Pest Control", icon: "🐛" },
    { value: "cleaning", label: "Cleaning", icon: "🧹" },
    { value: "other", label: "Other", icon: "🔧" },
  ];

  const priorities = [
    {
      value: "low",
      label: "Low",
      description: "Can wait, not urgent",
      color: "green",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Should be addressed soon",
      color: "yellow",
    },
    {
      value: "high",
      label: "High",
      description: "Needs attention quickly",
      color: "orange",
    },
    {
      value: "urgent",
      label: "Urgent",
      description: "Emergency, immediate attention",
      color: "red",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title for your request");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please provide a description of the issue");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createMaintenanceRequest(formData);
      setSubmitted(true);
      toast.success("Maintenance request submitted successfully!");
      setTimeout(() => {
        router.push("/tenant/maintenance");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to create maintenance request:", error);
      toast.error(error.message || "Failed to submit maintenance request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">
            Request Submitted!
          </h2>
          <p className="text-gray-600 mb-4">
            Your maintenance request has been submitted successfully. You will
            be notified once it's been reviewed.
          </p>
          <p className="text-sm text-gray-500">Redirecting to your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-black">
            New Maintenance Request
          </h1>
          <p className="text-gray-600 mt-1">
            Submit a request for maintenance or repairs
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Need immediate assistance?</p>
            <p>
              For emergencies (gas leaks, flooding, no heat in winter, etc.),
              please contact the property manager directly at the emergency
              number provided in your lease.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-black mb-4">
              Request Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g., Leaking faucet in kitchen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.category === category.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-xs font-medium text-center text-black">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Please describe the issue in detail, including when it started, how often it occurs, and any other relevant information..."
                />
                <p className="text-sm text-gray-600 mt-1">
                  Be as specific as possible to help us resolve the issue
                  quickly
                </p>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-black mb-4">
              Priority Level *
            </h2>
            <div className="space-y-3">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.priority === priority.value
                      ? `border-${priority.color}-500 bg-${priority.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-black">{priority.label}</p>
                    <p className="text-sm text-gray-600">
                      {priority.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-black mb-4">
              Additional Information
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="tenant_notes"
                value={formData.tenant_notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Any additional information, preferred times for access, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Wrench className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

