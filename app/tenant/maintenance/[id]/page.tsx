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
  XCircle,
  Loader2,
} from "lucide-react";
import {
  getMaintenanceRequestById,
  cancelMaintenanceRequest,
} from "@/app/api/maintenance/api";
import type { MaintenanceRequest } from "@/types/maintenance";
import { toast } from "sonner";

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = parseInt(params.id as string);

  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    setIsLoading(true);
    try {
      const data = await getMaintenanceRequestById(requestId);
      setRequest(data);
    } catch (error) {
      console.error("Failed to load maintenance request:", error);
      toast.error("Failed to load maintenance request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      await cancelMaintenanceRequest(requestId, cancelReason);
      toast.success("Maintenance request cancelled successfully");
      setShowCancelModal(false);
      loadRequest();
    } catch (error: any) {
      console.error("Failed to cancel request:", error);
      toast.error(error.message || "Failed to cancel request");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "in_progress":
        return <Clock className="w-6 h-6 text-blue-600" />;
      case "assigned":
        return <Wrench className="w-6 h-6 text-purple-600" />;
      case "pending":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-gray-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-4">
            The maintenance request you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/tenant/maintenance")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Maintenance
          </button>
        </div>
      </div>
    );
  }

  const canCancel =
    request.status === "pending" || request.status === "assigned";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Maintenance Requests
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">{request.title}</h1>
              <p className="text-gray-600 mt-1">
                Request #{request.id} • Created{" "}
                {new Date(request.reported_date).toLocaleDateString()}
              </p>
            </div>
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Request
              </button>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`rounded-xl p-6 mb-6 border-2 ${getStatusColor(request.status)}`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(request.status)}
            <div>
              <h2 className="text-2xl font-bold">
                {request.status
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </h2>
              <p className="text-sm opacity-90">Current Status</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                Request Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-black whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                      {formatCategory(request.category)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Priority</p>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority.charAt(0).toUpperCase() +
                        request.priority.slice(1)}
                    </span>
                  </div>
                </div>

                {request.tenant_notes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Additional Notes
                    </p>
                    <p className="text-black whitespace-pre-wrap">
                      {request.tenant_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-black mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black">Request Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(request.reported_date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {request.scheduled_date && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">
                        Scheduled Service
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.scheduled_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {request.completed_date && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Completed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.completed_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Property Manager Notes */}
            {request.notes && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-black mb-4">
                  Property Manager Notes
                </h2>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-black whitespace-pre-wrap">
                    {request.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Property Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-black">Location</h2>
              </div>
              <div className="space-y-3">
                {request.property_name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Property</p>
                    <p className="font-semibold text-black">
                      {request.property_name}
                    </p>
                  </div>
                )}
                {request.unit_number && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unit</p>
                    <p className="font-semibold text-black">
                      {request.unit_number}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned To */}
            {request.assigned_to && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-black">Assigned To</h2>
                </div>
                <p className="font-semibold text-black">
                  {request.assigned_to_name || `Technician #${request.assigned_to}`}
                </p>
              </div>
            )}

            {/* Cost Information */}
            {(request.estimated_cost || request.actual_cost) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-bold text-black">Cost</h2>
                </div>
                <div className="space-y-3">
                  {request.estimated_cost && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated</p>
                      <p className="text-lg font-bold text-black">
                        ${parseFloat(request.estimated_cost).toFixed(2)}
                      </p>
                    </div>
                  )}
                  {request.actual_cost && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Actual Cost</p>
                      <p className="text-lg font-bold text-green-600">
                        ${parseFloat(request.actual_cost).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Info */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-3">Need Help?</h3>
              <p className="text-sm opacity-90 mb-3">
                If you have questions about this request, contact your property
                manager.
              </p>
              <button
                onClick={() => router.push("/tenant/contact")}
                className="w-full px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-black mb-4">
              Cancel Maintenance Request
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this maintenance request? Please
              provide a reason.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4"
              placeholder="Reason for cancellation..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Request
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

