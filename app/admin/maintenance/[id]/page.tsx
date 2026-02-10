"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  User,
  DollarSign,
  MapPin,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import {
  getMaintenanceRequestById,
  updateMaintenanceRequest,
} from "@/app/api/maintenance/api";
import type { MaintenanceRequest } from "@/types/maintenance";
import { toast } from "sonner";

export default function AdminMaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = parseInt(params.id as string);

  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Editable fields
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    setIsLoading(true);
    try {
      const data = await getMaintenanceRequestById(requestId);
      setRequest(data);
      setStatus(data.status);
      setPriority(data.priority);
      setScheduledDate(data.scheduled_date || "");
      setEstimatedCost(data.estimated_cost || "");
      setActualCost(data.actual_cost || "");
      setNotes(data.notes || "");
    } catch (error) {
      console.error("Failed to load maintenance request:", error);
      toast.error("Failed to load maintenance request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMaintenanceRequest(requestId, {
        status,
        priority,
        scheduled_date: scheduledDate || undefined,
        estimated_cost: estimatedCost || undefined,
        actual_cost: actualCost || undefined,
        notes,
      });
      toast.success("Maintenance request updated successfully");
      loadRequest();
    } catch (error: any) {
      console.error("Failed to update request:", error);
      toast.error(error.message || "Failed to update request");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Request Not Found</h2>
          <button
            onClick={() => router.push("/admin/maintenance")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Maintenance
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Maintenance
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">{request.title}</h1>
            <p className="text-gray-600">Request #{request.id}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Request Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-black whitespace-pre-wrap">{request.description}</p>
                </div>
                {request.tenant_notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tenant Notes</p>
                    <p className="text-black whitespace-pre-wrap">{request.tenant_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Management Notes */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Management Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Add notes for internal use..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Status & Priority</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Scheduling</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reported</p>
                  <p className="font-semibold">{new Date(request.reported_date).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Cost</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Tenant Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Tenant Information</h2>
              <div className="space-y-3">
                {request.tenant_name && (
                  <div>
                    <p className="text-sm text-gray-600">Tenant</p>
                    <p className="font-semibold">{request.tenant_name}</p>
                  </div>
                )}
                {request.unit_number && (
                  <div>
                    <p className="text-sm text-gray-600">Unit</p>
                    <p className="font-semibold">{request.unit_number}</p>
                  </div>
                )}
                {request.property_name && (
                  <div>
                    <p className="text-sm text-gray-600">Property</p>
                    <p className="font-semibold">{request.property_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

