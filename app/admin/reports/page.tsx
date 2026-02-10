"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  DollarSign,
  Users,
  Home,
  TrendingUp,
  Calendar,
  Download,
  Loader2,
  Wrench,
  FileText,
} from "lucide-react";
import { getFinancialSummary, getDashboardOverview } from "@/app/api/finance/dashboard/api";
import { getPayments, getInvoices } from "@/app/api/finance";
import { getTenants } from "@/app/api/tenant/api";
import { getProperties } from "@/app/api/properties/api";
import { getMaintenanceRequests } from "@/app/api/maintenance/api";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [financialData, setFinancialData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    loadReportData();
  }, []);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const [
        financialSummary,
        paymentsData,
        invoicesData,
        tenantsData,
        propertiesData,
        maintenanceData,
      ] = await Promise.allSettled([
        getFinancialSummary(),
        getPayments({}),
        getInvoices({}),
        getTenants(),
        getProperties(),
        getMaintenanceRequests({}),
      ]);

      if (financialSummary.status === "fulfilled") setFinancialData(financialSummary.value);
      if (paymentsData.status === "fulfilled") setPayments(paymentsData.value);
      if (invoicesData.status === "fulfilled") setInvoices(invoicesData.value);
      if (tenantsData.status === "fulfilled") {
        setTenants(Array.isArray(tenantsData.value) ? tenantsData.value : tenantsData.value?.results || []);
      }
      if (propertiesData.status === "fulfilled") {
        setProperties(Array.isArray(propertiesData.value) ? propertiesData.value : propertiesData.value?.results || []);
      }
      if (maintenanceData.status === "fulfilled") setMaintenanceRequests(maintenanceData.value);
    } catch (error) {
      console.error("Failed to load report data:", error);
      toast.error("Failed to load some report data");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    document.title = `Admin Reports - ${new Date().toLocaleDateString()}`;
    window.print();
    setTimeout(() => {
      document.title = "Admin Reports";
    }, 100);
    toast.info("Use 'Save as PDF' in the print dialog");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const completedPayments = payments.filter((p) => p.status === "completed");
  const thisYearPayments = completedPayments.filter(
    (p) => new Date(p.payment_date).getFullYear() === currentYear
  );
  const thisMonthPayments = completedPayments.filter((p) => {
    const date = new Date(p.payment_date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const totalRevenue = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const yearRevenue = thisYearPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const monthRevenue = thisMonthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled");
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  const totalOutstanding = pendingInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.balance_due || 0),
    0
  );

  const maintenanceStats = {
    total: maintenanceRequests.length,
    pending: maintenanceRequests.filter((r) => r.status === "pending").length,
    inProgress: maintenanceRequests.filter((r) => r.status === "in_progress" || r.status === "assigned").length,
    completed: maintenanceRequests.filter((r) => r.status === "completed").length,
  };

  const occupancyRate = properties.length > 0
    ? ((tenants.length / properties.reduce((sum, p) => sum + (p.total_units || 1), 0)) * 100).toFixed(1)
    : "0";

  return (
    <div className="p-6 bg-white min-h-screen">
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #report-content, #report-content * { visibility: visible; }
          #report-content { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      <div id="report-content" className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-black">Admin Reports</h1>
            <p className="text-gray-600 mt-1">System-wide analytics and statistics</p>
          </div>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-8 pb-4 border-b-2">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Reports</h1>
          <p className="text-center text-gray-600">
            Generated on {currentDate || "..."}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-xs opacity-90">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
            <p className="text-sm opacity-90">All Time</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-xs opacity-90">Active</span>
            </div>
            <p className="text-3xl font-bold">{tenants.length}</p>
            <p className="text-sm opacity-90">Tenants</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Home className="w-8 h-8" />
              <span className="text-xs opacity-90">Portfolio</span>
            </div>
            <p className="text-3xl font-bold">{properties.length}</p>
            <p className="text-sm opacity-90">Properties</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8" />
              <span className="text-xs opacity-90">Rate</span>
            </div>
            <p className="text-3xl font-bold">{occupancyRate}%</p>
            <p className="text-sm opacity-90">Occupancy</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Financial Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">This Year Revenue</span>
                <span className="text-lg font-bold text-green-600">${yearRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">This Month Revenue</span>
                <span className="text-lg font-bold text-blue-600">${monthRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Payments</span>
                <span className="text-lg font-bold text-black">{completedPayments.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Outstanding Balance</span>
                <span className="text-lg font-bold text-orange-600">${totalOutstanding.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Invoice Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Invoices</span>
                <span className="text-lg font-bold text-black">{invoices.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Paid Invoices</span>
                <span className="text-lg font-bold text-green-600">{paidInvoices.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Pending Invoices</span>
                <span className="text-lg font-bold text-yellow-600">{pendingInvoices.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">Overdue Invoices</span>
                <span className="text-lg font-bold text-red-600">{overdueInvoices.length}</span>
              </div>
            </div>
          </div>

          {/* Maintenance Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-purple-600" />
              Maintenance Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Requests</span>
                <span className="text-lg font-bold text-black">{maintenanceStats.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700">Pending</span>
                <span className="text-lg font-bold text-yellow-600">{maintenanceStats.pending}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">In Progress</span>
                <span className="text-lg font-bold text-blue-600">{maintenanceStats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Completed</span>
                <span className="text-lg font-bold text-green-600">{maintenanceStats.completed}</span>
              </div>
            </div>
          </div>

          {/* Property Overview */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Home className="w-6 h-6 text-orange-600" />
              Property Overview
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Properties</span>
                <span className="text-lg font-bold text-black">{properties.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Active Tenants</span>
                <span className="text-lg font-bold text-blue-600">{tenants.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Occupancy Rate</span>
                <span className="text-lg font-bold text-green-600">{occupancyRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Avg. Revenue/Property</span>
                <span className="text-lg font-bold text-purple-600">
                  ${properties.length > 0 ? (totalRevenue / properties.length).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-black mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {paidInvoices.length > 0 ? ((paidInvoices.length / invoices.length) * 100).toFixed(1) : "0"}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Collection Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ${completedPayments.length > 0 ? (totalRevenue / completedPayments.length).toFixed(0) : "0"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Avg Payment</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {maintenanceStats.total > 0
                  ? ((maintenanceStats.completed / maintenanceStats.total) * 100).toFixed(1)
                  : "0"}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {tenants.length > 0 ? (totalRevenue / tenants.length).toFixed(0) : "0"}
              </p>
              <p className="text-sm text-gray-600 mt-1">Revenue/Tenant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

