"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Home,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  getDashboardOverview,
  getRecentActivity,
} from "@/app/api/finance/dashboard/api";
import { getOverdueInvoices } from "@/app/api/finance/invoices/api";
import { getOverdueRentPayments } from "@/app/api/finance/rent-payments/api";
import Link from "next/link";

const PropertyManagerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [overdueInvoices, setOverdueInvoices] = useState<any[]>([]);
  const [overduePayments, setOverduePayments] = useState<any[]>([]);

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

      const [overview, activity, overdue, payments] = await Promise.allSettled([
        getDashboardOverview(),
        getRecentActivity(20),
        getOverdueInvoices(),
        getOverdueRentPayments(),
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

      if (overdue.status === "fulfilled") {
        setOverdueInvoices(overdue.value.slice(0, 5));
      } else {
        console.error("Overdue invoices failed:", overdue.reason);
        setOverdueInvoices([]);
      }

      if (payments.status === "fulfilled") {
        setOverduePayments(payments.value.slice(0, 5));
      } else {
        console.error("Overdue payments failed:", payments.reason);
        setOverduePayments([]);
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
      case "excellent":
      case "completed":
      case "paid":
        return "bg-green-800 text-white";
      case "good":
      case "in-progress":
      case "partial":
        return "bg-blue-600 text-white";
      case "attention":
      case "pending":
      case "sent":
        return "bg-orange-500 text-white";
      case "overdue":
        return "bg-red-600 text-white";
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
          <p className="text-gray-600">Loading dashboard...</p>
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
            {error || "There was an error loading the dashboard data."}
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

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Property Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your portfolio performance
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
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Link href="/manager/reports">
            <button className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reports
            </button>
          </Link>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Total Properties
              </p>
              <p className="text-3xl font-bold text-black">
                {dashboardData.total_properties || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {dashboardData.total_units || 0} total units
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Building2 className="w-7 h-7 text-green-800" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Occupancy Rate
              </p>
              <p className="text-3xl font-bold text-black">
                {dashboardData.occupancy_rate?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {dashboardData.occupied_units || 0} /{" "}
                {dashboardData.total_units || 0} occupied
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Home className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Monthly Revenue
              </p>
              <p className="text-3xl font-bold text-black">
                ${((dashboardData.monthly_revenue || 0) / 1000).toFixed(1)}k
              </p>
              <p
                className={`text-sm mt-2 flex items-center gap-1 font-medium ${
                  (dashboardData.collection_rate || 0) >= 90
                    ? "text-green-800"
                    : "text-orange-500"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{dashboardData.collection_rate || 0}% collected</span>
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <DollarSign className="w-7 h-7 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">
                Outstanding
              </p>
              <p className="text-3xl font-bold text-black">
                ${((dashboardData.total_outstanding || 0) / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-red-600 mt-2 font-medium">
                {dashboardData.overdue_invoices || 0} overdue invoices
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <AlertCircle className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Overdue Invoices
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Requires immediate attention
                  </p>
                </div>
                <Link href="/manager/invoices?status=overdue">
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {overdueInvoices.length > 0 ? (
                <div className="space-y-3">
                  {overdueInvoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/manager/invoices/${invoice.id}`}
                    >
                      <div className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-black">
                              {invoice.invoice_number}
                            </h3>
                            <p className="text-sm text-gray-700 mt-1">
                              {invoice.tenant_name}
                            </p>
                            <p className="text-sm text-red-700 font-medium mt-1">
                              Due:{" "}
                              {new Date(invoice.due_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-black">
                              ${parseFloat(invoice.balance_due).toFixed(2)}
                            </p>
                            <span className="text-xs px-2 py-1 rounded-full font-semibold bg-red-600 text-white inline-block mt-1">
                              Overdue
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-800 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No overdue invoices
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    All invoices are up to date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Latest transactions and updates
                  </p>
                </div>
                <Link href="/manager/activity">
                  <button className="text-green-800 hover:text-green-900 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentActivity ? (
                <div className="space-y-3">
                  {/* Invoices */}
                  {recentActivity.invoices?.slice(0, 3).map((invoice: any) => (
                    <Link
                      key={`invoice-${invoice.id}`}
                      href={`/manager/invoices/${invoice.id}`}
                    >
                      <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="p-2 rounded-lg bg-orange-50 flex-shrink-0">
                          <FileText className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black">
                            New Invoice: {invoice.invoice_number}
                          </p>
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {invoice.tenant_name} - $
                            {parseFloat(invoice.total_amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(invoice.issue_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${getStatusColor(
                            invoice.status,
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {/* Payments */}
                  {recentActivity.payments?.slice(0, 3).map((payment: any) => (
                    <div
                      key={`payment-${payment.id}`}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-green-50 flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-green-800" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black">
                          Payment Received
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          ${parseFloat(payment.amount).toFixed(2)} from{" "}
                          {payment.tenant?.user?.first_name || "Tenant"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${getStatusColor(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                  {!recentActivity.invoices?.length &&
                    !recentActivity.payments?.length && (
                      <p className="text-gray-500 text-center py-8">
                        No recent activity
                      </p>
                    )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Loading activity...
                </p>
              )}
            </div>
          </div>

          {/* Pending Payments */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Pending Payments
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Payments awaiting processing
                  </p>
                </div>
                <Link href="/manager/payments?status=pending">
                  <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {overduePayments.length > 0 ? (
                <div className="space-y-3">
                  {overduePayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <Clock className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">
                            {payment.tenant_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payment.period_name || "Payment"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-black">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold inline-block mt-1 ${getStatusColor(
                            payment.status,
                          )}`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-800 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">
                    No pending payments
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    All payments processed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Total Invoices</span>
                <span className="text-3xl font-bold">
                  {dashboardData.total_invoices || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Paid This Month</span>
                <span className="text-3xl font-bold">
                  {dashboardData.paid_invoices || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Collection Rate</span>
                <span className="text-3xl font-bold">
                  {dashboardData.collection_rate || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Current Period */}
          {dashboardData.current_period && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-black">Current Period</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Period Name</p>
                  <p className="font-semibold text-black text-lg">
                    {dashboardData.current_period}
                  </p>
                </div>
                {dashboardData.days_until_due !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Days Until Due</p>
                    <p className="font-semibold text-black text-lg">
                      {dashboardData.days_until_due} days
                    </p>
                  </div>
                )}
              </div>
              <Link href="/manager/billing-periods">
                <button className="w-full mt-6 py-2.5 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm">
                  Manage Billing Periods
                </button>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/manager/invoices/generate">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  📄 Generate Invoices
                </button>
              </Link>
              <Link href="/manager/payments/process">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  💳 Process Payments
                </button>
              </Link>
              <Link href="/manager/tenants">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  👥 Manage Tenants
                </button>
              </Link>
              <Link href="/manager/reports">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium text-sm text-left px-4">
                  📊 View Reports
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagerDashboard;
