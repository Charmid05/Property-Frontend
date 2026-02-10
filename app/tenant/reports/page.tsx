"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Wrench,
  Home,
  Loader2,
} from "lucide-react";
import { getDashboardOverview } from "@/app/api/finance/dashboard/api";
import { getPayments } from "@/app/api/finance";
import { getMaintenanceRequests } from "@/app/api/maintenance/api";
import { toast } from "sonner";
import { generatePDF } from "@/app/utils/pdfGenerator";

export default function TenantReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const [overview, paymentData, maintenanceData] = await Promise.allSettled(
        [
          getDashboardOverview(),
          getPayments({}),
          getMaintenanceRequests({}),
        ]
      );

      if (overview.status === "fulfilled") {
        setDashboardData(overview.value);
      }

      if (paymentData.status === "fulfilled") {
        setPayments(paymentData.value);
      }

      if (maintenanceData.status === "fulfilled") {
        setMaintenanceRequests(maintenanceData.value);
      }
    } catch (error) {
      console.error("Failed to load report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate payment statistics
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const completedPayments = payments.filter((p) => p.status === "completed");
  const thisYearPayments = completedPayments.filter(
    (p) => new Date(p.payment_date).getFullYear() === currentYear
  );
  const thisMonthPayments = completedPayments.filter((p) => {
    const date = new Date(p.payment_date);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  });

  const totalPaidThisYear = thisYearPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  const totalPaidThisMonth = thisMonthPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  const averageMonthlyPayment =
    thisYearPayments.length > 0 ? totalPaidThisYear / 12 : 0;

  // Maintenance statistics
  const maintenanceStats = {
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter((r) => r.status === "pending").length,
    completed: maintenanceRequests.filter((r) => r.status === "completed")
      .length,
    in_progress: maintenanceRequests.filter(
      (r) => r.status === "in_progress" || r.status === "assigned"
    ).length,
  };

  // Payment by method breakdown
  const paymentsByMethod = completedPayments.reduce((acc: any, payment) => {
    const method = payment.payment_method;
    acc[method] = (acc[method] || 0) + parseFloat(payment.amount);
    return acc;
  }, {});

  const handleDownloadPDF = async () => {
    try {
      toast.info("Generating PDF report...");
      const filename = `Tenant-Report-${new Date().toISOString().split('T')[0]}`;
      await generatePDF("report-content", filename, {
        orientation: "portrait",
        format: "a4",
        quality: 2,
      });
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to download PDF report");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content,
          #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
      <div id="report-content" className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            View your payment history and maintenance statistics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-xs opacity-90">This Year</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              ${totalPaidThisYear.toFixed(2)}
            </p>
            <p className="text-sm opacity-90">Total Paid</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8" />
              <span className="text-xs opacity-90">This Month</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              ${totalPaidThisMonth.toFixed(2)}
            </p>
            <p className="text-sm opacity-90">Payments Made</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-xs opacity-90">Average</span>
            </div>
            <p className="text-3xl font-bold mb-1">
              ${averageMonthlyPayment.toFixed(2)}
            </p>
            <p className="text-sm opacity-90">Per Month</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8" />
              <span className="text-xs opacity-90">Transactions</span>
            </div>
            <p className="text-3xl font-bold mb-1">{completedPayments.length}</p>
            <p className="text-sm opacity-90">Completed</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Payment Summary</h2>
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Current Balance</span>
                <span
                  className={`text-lg font-bold ${
                    dashboardData?.is_in_debt ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${Math.abs(dashboardData?.current_balance || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Monthly Rent</span>
                <span className="text-lg font-bold text-black">
                  ${dashboardData?.monthly_rent || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Invoices</span>
                <span className="text-lg font-bold text-black">
                  {dashboardData?.total_invoices || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Paid Invoices</span>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData?.paid_invoices || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Overdue Invoices</span>
                <span className="text-lg font-bold text-red-600">
                  {dashboardData?.overdue_invoices || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Maintenance Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">
                Maintenance Summary
              </h2>
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Requests</span>
                <span className="text-lg font-bold text-black">
                  {maintenanceStats.total}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Pending</span>
                <span className="text-lg font-bold text-yellow-600">
                  {maintenanceStats.pending}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-gray-700">In Progress</span>
                <span className="text-lg font-bold text-blue-600">
                  {maintenanceStats.in_progress}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-gray-700">Completed</span>
                <span className="text-lg font-bold text-green-600">
                  {maintenanceStats.completed}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Active Requests</span>
                <span className="text-lg font-bold text-black">
                  {dashboardData?.active_maintenance_requests || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">
                Payment Methods Used
              </h2>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-3">
              {Object.entries(paymentsByMethod).map(([method, amount]: any) => (
                <div
                  key={method}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 capitalize">
                    {method.replace("_", " ")}
                  </span>
                  <span className="font-semibold text-black">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {Object.keys(paymentsByMethod).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No payment data available
                </p>
              )}
            </div>
          </div>

          {/* Lease Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">
                Lease Information
              </h2>
              <Home className="w-6 h-6 text-purple-500" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Property</p>
                <p className="font-semibold text-black">
                  {dashboardData?.property_address || "N/A"}
                </p>
              </div>
              {dashboardData?.unit_number && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Unit</p>
                  <p className="font-semibold text-black">
                    {dashboardData.unit_number}
                  </p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Lease Status</p>
                <p
                  className={`font-semibold ${
                    dashboardData?.lease_status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {dashboardData?.lease_status === "active"
                    ? "Active"
                    : "Inactive"}
                </p>
              </div>
              {dashboardData?.lease_end_date && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Lease End Date</p>
                  <p className="font-semibold text-black">
                    {new Date(
                      dashboardData.lease_end_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              {dashboardData?.next_payment_date && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Next Payment Due</p>
                  <p className="font-semibold text-orange-600">
                    {new Date(
                      dashboardData.next_payment_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block mb-8 pb-4 border-b-2 border-gray-300">
          <h1 className="text-3xl font-bold text-center text-black mb-2">
            Tenant Report
          </h1>
          <p className="text-center text-gray-600">
            Generated on {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Download Section */}
        <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Download Reports</h2>
              <p className="text-sm opacity-90">
                Export your payment and maintenance history
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

