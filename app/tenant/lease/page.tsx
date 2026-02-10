"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Home,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { getDashboardOverview } from "@/app/api/finance/dashboard/api";
import { toast } from "sonner";

export default function LeaseDetailsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [leaseData, setLeaseData] = useState<any>(null);

  useEffect(() => {
    loadLeaseData();
  }, []);

  const loadLeaseData = async () => {
    setIsLoading(true);
    try {
      const dashboardData = await getDashboardOverview();
      setLeaseData(dashboardData);
    } catch (error) {
      console.error("Failed to load lease data:", error);
      toast.error("Failed to load lease information");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  const daysRemaining = leaseData?.lease_end_date
    ? calculateDaysRemaining(leaseData.lease_end_date)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">Lease Agreement</h1>
            <p className="text-gray-600 mt-1">
              Your rental agreement details and terms
            </p>
          </div>
          <button
            onClick={() => toast.info("Download feature coming soon")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Lease Status Banner */}
        <div
          className={`rounded-xl p-6 mb-6 ${
            leaseData?.lease_status === "active"
              ? "bg-green-50 border-2 border-green-200"
              : "bg-red-50 border-2 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {leaseData?.lease_status === "active" ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <h2
                className={`text-2xl font-bold ${
                  leaseData?.lease_status === "active"
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                Lease Status:{" "}
                {leaseData?.lease_status === "active" ? "Active" : "Inactive"}
              </h2>
              {daysRemaining !== null && daysRemaining > 0 && (
                <p
                  className={`${
                    leaseData?.lease_status === "active"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {daysRemaining} days remaining until lease end
                </p>
              )}
              {daysRemaining !== null && daysRemaining <= 0 && (
                <p className="text-red-700 font-semibold">
                  Lease has expired or ending soon
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Property Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-black">
                Property Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Property Address</p>
                <p className="font-semibold text-black">
                  {leaseData?.property_address || "N/A"}
                </p>
              </div>
              {leaseData?.unit_number && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unit Number</p>
                  <p className="font-semibold text-black">
                    {leaseData.unit_number}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Property Type</p>
                <p className="font-semibold text-black">Residential</p>
              </div>
            </div>
          </div>

          {/* Lease Terms */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-black">Lease Terms</h2>
            </div>
            <div className="space-y-4">
              {leaseData?.lease_start_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="font-semibold text-black">
                    {new Date(leaseData.lease_start_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {leaseData?.lease_end_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-semibold text-black">
                    {new Date(leaseData.lease_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Lease Duration</p>
                <p className="font-semibold text-black">
                  {leaseData?.lease_start_date && leaseData?.lease_end_date
                    ? `${Math.ceil(
                        (new Date(leaseData.lease_end_date).getTime() -
                          new Date(leaseData.lease_start_date).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )} months`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Rent Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-black">Rent Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                <p className="text-2xl font-bold text-green-600">
                  ${leaseData?.monthly_rent || "N/A"}
                </p>
              </div>
              {leaseData?.next_payment_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Payment Due</p>
                  <p className="font-semibold text-black">
                    {new Date(leaseData.next_payment_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Frequency</p>
                <p className="font-semibold text-black">Monthly</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Security Deposit</p>
                <p className="font-semibold text-black">
                  ${leaseData?.security_deposit || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-black">Account Status</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    leaseData?.is_in_debt ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${Math.abs(leaseData?.current_balance || 0).toFixed(2)}
                  {leaseData?.is_in_debt && (
                    <span className="text-sm ml-2">(Due)</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Outstanding Invoices
                </p>
                <p
                  className={`font-semibold ${
                    leaseData?.overdue_invoices > 0
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {leaseData?.overdue_invoices || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    !leaseData?.is_in_debt
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {!leaseData?.is_in_debt ? "Good Standing" : "Payment Due"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Terms & Conditions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-black">
              Terms & Conditions Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-black mb-2">Rent Payment</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Due on the 1st of each month</li>
                <li>• Grace period: 5 days</li>
                <li>• Late fee: $50 after grace period</li>
                <li>• Accepted methods: Bank transfer, card, mobile money</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-black mb-2">Maintenance</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Submit requests through tenant portal</li>
                <li>• Emergency: Call 24/7 hotline</li>
                <li>• Normal requests: 3-5 business days</li>
                <li>• Tenant responsible for minor repairs</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-black mb-2">Utilities</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tenant pays: Electricity, Water</li>
                <li>• Landlord pays: Trash, Common areas</li>
                <li>• Billed monthly with rent</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-black mb-2">
                Termination & Renewal
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 60 days notice required</li>
                <li>• Auto-renewal: Month-to-month</li>
                <li>• Early termination fee may apply</li>
                <li>• Security deposit refund: 30 days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  • This is a summary of your lease agreement. For complete
                  terms and conditions, please refer to your signed lease
                  document.
                </li>
                <li>
                  • If you have questions about your lease terms, please contact
                  your property manager.
                </li>
                <li>
                  • Lease renewal discussions typically begin 90 days before
                  lease end date.
                </li>
                <li>
                  • Any modifications to the lease must be made in writing and
                  signed by both parties.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

