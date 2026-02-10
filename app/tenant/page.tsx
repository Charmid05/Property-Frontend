"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  DollarSign,
  Wrench,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ChevronRight,
  Loader2,
  RefreshCw,
  Bell,
} from "lucide-react";
import {
  getDashboardOverview,
  getRecentActivity,
} from "@/app/api/finance/dashboard/api";
import { getInvoices } from "@/app/api/finance/invoices/api";
import { getRentPayments } from "@/app/api/finance/rent-payments/api";
import Link from "next/link";

const TenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [overview, activity, invoiceData, paymentData] =
        await Promise.allSettled([
          getDashboardOverview(),
          getRecentActivity(10),
          getInvoices({ status: undefined }),
          getRentPayments({ status: undefined }),
        ]);

      if (overview.status === "fulfilled") {
        setDashboardData(overview.value);
      } else {
        console.error("Overview failed:", overview.reason);
      }

      if (activity.status === "fulfilled") {
        setRecentActivity(activity.value);
      } else {
        console.error("Activity failed:", activity.reason);
      }

      if (invoiceData.status === "fulfilled") {
        setInvoices(invoiceData.value.slice(0, 5));
      } else {
        console.error("Invoices failed:", invoiceData.reason);
        setInvoices([]);
      }

      if (paymentData.status === "fulfilled") {
        setPayments(paymentData.value.slice(0, 5));
      } else {
        console.error("Payments failed:", paymentData.reason);
        setPayments([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-800 text-white";
      case "pending":
      case "sent":
        return "bg-orange-500 text-white";
      case "overdue":
        return "bg-red-600 text-white";
      case "in-progress":
      case "partial":
        return "bg-blue-600 text-white";
      case "draft":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "There was an error loading your dashboard data."}
          </p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if tenant has overdue payments
  const hasOverdue =
    dashboardData.is_in_debt || dashboardData.overdue_invoices > 0;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your rental
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <Link href="/tenant/payments/new">
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pay Rent
            </button>
          </Link>
          <Link href="/tenant/maintenance/new">
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors font-medium flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              New Request
            </button>
          </Link>
        </div>
      </div>

      {/* Alert Banner for Overdue */}
      {hasOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Action Required</h3>
            <p className="text-sm text-red-800 mt-1">
              You have {dashboardData.overdue_invoices || 0} overdue invoice(s).
              Please make a payment to avoid late fees.
            </p>
          </div>
          <Link href="/tenant/finance/invoices?status=overdue">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap">
              View Invoices
            </button>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Current Balance
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  dashboardData.is_in_debt ? "text-red-600" : "text-green-800"
                }`}
              >
                ${Math.abs(dashboardData.current_balance || 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {dashboardData.is_in_debt ? "Amount Due" : "Credit Balance"}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                dashboardData.is_in_debt ? "bg-red-50" : "bg-orange-50"
              }`}
            >
              <DollarSign
                className={`w-6 h-6 ${
                  dashboardData.is_in_debt ? "text-red-600" : "text-orange-500"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Lease Status
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  dashboardData.lease_status === "active"
                    ? "text-green-800"
                    : "text-red-600"
                }`}
              >
                {dashboardData.lease_status === "active"
                  ? "Active"
                  : "Inactive"}
              </p>
              <p className="text-xs text-gray-500 mt-2 truncate">
                {dashboardData.lease_end_date
                  ? `Until ${new Date(dashboardData.lease_end_date).toLocaleDateString()}`
                  : "No end date"}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-800" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Maintenance
              </p>
              <p className="text-2xl font-bold text-black mt-1">
                {dashboardData.active_maintenance_requests || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Active requests</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Next Payment
              </p>
              <p className="text-2xl font-bold text-black mt-1">
                {dashboardData.days_until_payment !== null
                  ? `${dashboardData.days_until_payment} Days`
                  : "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-2 truncate">
                {dashboardData.next_payment_date
                  ? new Date(
                      dashboardData.next_payment_date,
                    ).toLocaleDateString()
                  : "No payment due"}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Recent Invoices
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your billing history
                  </p>
                </div>
                <Link href="/tenant/finance/invoices">
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/tenant/finance/invoices/${invoice.id}`}
                    >
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              invoice.status === "overdue"
                                ? "bg-red-600"
                                : "bg-orange-500"
                            }`}
                          >
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-black">
                              {invoice.invoice_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              Due:{" "}
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-black">
                            ${parseFloat(invoice.total_amount).toFixed(2)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold inline-block mt-1 ${getStatusColor(
                              invoice.status,
                            )}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No invoices found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your invoices will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Payment History
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your recent transactions
                  </p>
                </div>
                <Link href="/tenant/finance/payments">
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-2 text-sm text-black">
                            {new Date(
                              payment.payment_date,
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 text-sm font-semibold text-black">
                            ${parseFloat(payment.amount).toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                payment.status,
                              )}`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            {payment.receipt && (
                              <Link
                                href={`/tenant/receipts/${payment.receipt.id}`}
                              >
                                <button className="text-orange-500 hover:text-orange-600 text-xs font-medium flex items-center gap-1 ml-auto">
                                  <Download className="w-3 h-3" />
                                  Receipt
                                </button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No payments yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your payment history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Property Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Home className="w-6 h-6 text-green-800" />
              </div>
              <h2 className="text-xl font-bold text-black">My Property</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold text-black">
                  {dashboardData.property_address || "N/A"}
                </p>
                {dashboardData.unit_number && (
                  <p className="text-sm text-gray-600 mt-1">
                    Unit: {dashboardData.unit_number}
                  </p>
                )}
              </div>
              {dashboardData.lease_end_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lease End</p>
                  <p className="font-semibold text-black">
                    {new Date(
                      dashboardData.lease_end_date,
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                <p className="font-semibold text-black text-lg">
                  ${dashboardData.monthly_rent || "N/A"}
                </p>
              </div>
            </div>
            <Link href="/tenant/lease">
              <button className="w-full mt-6 py-2.5 border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-colors font-medium">
                View Lease Details
              </button>
            </Link>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-6">This Year</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Total Paid</span>
                <span className="text-3xl font-bold">
                  ${((dashboardData.yearly_payments || 0) / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Invoices</span>
                <span className="text-3xl font-bold">
                  {dashboardData.total_invoices || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">On Time</span>
                <span className="text-3xl font-bold">
                  {dashboardData.paid_invoices || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/tenant/contact">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  💬 Contact Property Manager
                </button>
              </Link>
              <Link href="/tenant/maintenance">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  🔧 View Maintenance Requests
                </button>
              </Link>
              <Link href="/tenant/documents">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  📄 View Documents
                </button>
              </Link>
              <Link href="/tenant/payments/history">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  📊 Payment History
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
