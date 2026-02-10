"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { DataTable } from "./components/DataTable";
import { StatusBadge } from "./components/StatusBadge";
import { FinanceNav } from "./components/FinanceNav";
import { getDashboardOverview, getRecentActivity } from "@/app/api/finance";
import type {
  DashboardOverview,
  RecentActivity,
  TransactionListItem,
  InvoiceListItem,
} from "@/types/finance";
import { useRouter } from "next/navigation";

export default function FinanceDashboard() {
  const router = useRouter();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [overviewData, activityData] = await Promise.all([
        getDashboardOverview(),
        getRecentActivity(10),
      ]);
      setOverview(overviewData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const transactionColumns = [
    {
      header: "Date",
      accessor: (row: TransactionListItem) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: "Type",
      accessor: (row: TransactionListItem) => (
        <span className="capitalize font-semibold text-gray-700">
          {row.transaction_type.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Description",
      accessor: "description" as keyof TransactionListItem,
    },
    {
      header: "Amount",
      accessor: (row: TransactionListItem) => (
        <span className="font-bold text-gray-900">${row.amount}</span>
      ),
    },
  ];

  const invoiceColumns = [
    {
      header: "Invoice #",
      accessor: "invoice_number" as keyof InvoiceListItem,
    },
    {
      header: "Tenant",
      accessor: "tenant_name" as keyof InvoiceListItem,
    },
    {
      header: "Amount",
      accessor: (row: InvoiceListItem) => (
        <span className="font-bold text-gray-900">${row.total_amount}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row: InvoiceListItem) => (
        <StatusBadge status={row.status} type="invoice" />
      ),
    },
    {
      header: "Due Date",
      accessor: (row: InvoiceListItem) =>
        new Date(row.due_date).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <FinanceNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <FinanceNav />
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-700 font-semibold">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <FinanceNav />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-gray-900">Finance Dashboard</h1>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Overview of your financial operations
            </p>
          </div>
          <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-xl px-4 py-2.5 shadow-sm">
            {overview.current_period && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">Current Period:</span>
                <span className="font-semibold">{overview.current_period}</span>
                {overview.days_until_due !== null && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-lg font-bold text-xs">
                    <Clock className="h-3 w-3" />
                    {overview.days_until_due} days until due
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Outstanding"
            value={`$${overview.total_outstanding.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-orange-500"
            subtitle={`${overview.overdue_invoices} overdue`}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${overview.monthly_revenue.toLocaleString()}`}
            icon={TrendingUp}
            iconColor="text-green-800"
            subtitle={`${overview.collection_rate}% collection rate`}
          />
          <StatCard
            title="Active Invoices"
            value={overview.sent_invoices}
            icon={FileText}
            iconColor="text-blue-500"
            subtitle={`${overview.total_invoices} total`}
          />
          <StatCard
            title="Pending Payments"
            value={overview.pending_payments}
            icon={Clock}
            iconColor="text-orange-500"
            subtitle={`${overview.partial_payments} partial`}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md p-4 border border-gray-200/80 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Overdue Invoices
                </p>
                <p className="text-2xl font-black text-red-600">
                  {overview.overdue_invoices}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-100 to-red-50 shadow-lg shadow-red-500/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md p-4 border border-gray-200/80 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Accounts in Debt
                </p>
                <p className="text-2xl font-black text-orange-500">
                  {overview.accounts_in_debt}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  ${overview.total_debt.toLocaleString()} total
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 shadow-lg shadow-orange-500/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md p-4 border border-gray-200/80 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Draft Invoices
                </p>
                <p className="text-2xl font-black text-gray-600">
                  {overview.draft_invoices}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-lg shadow-gray-500/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Transactions */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md border border-gray-200/80 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900">
                  Recent Transactions
                </h2>
                <button
                  onClick={() => router.push("/admin/finance/transactions")}
                  className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold hover:gap-2 transition-all duration-200 group"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div className="p-3">
              {recentActivity?.transactions && (
                <DataTable
                  data={recentActivity.transactions}
                  columns={transactionColumns}
                  emptyMessage="No recent transactions"
                />
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md border border-gray-200/80 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900">
                  Recent Invoices
                </h2>
                <button
                  onClick={() => router.push("/admin/finance/invoices")}
                  className="flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold hover:gap-2 transition-all duration-200 group"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div className="p-3">
              {recentActivity?.invoices && (
                <DataTable
                  data={recentActivity.invoices}
                  columns={invoiceColumns}
                  onRowClick={(invoice) =>
                    router.push(`/admin/finance/invoices/${invoice.id}`)
                  }
                  emptyMessage="No recent invoices"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}