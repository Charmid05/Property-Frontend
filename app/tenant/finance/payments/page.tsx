"use client";

import React, { useState, useEffect } from "react";
import { Receipt as ReceiptIcon, Download } from "lucide-react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { StatusBadge } from "@/app/admin/finance/components/StatusBadge";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { getPayments } from "@/app/api/finance";
import type { Payment } from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TenantPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    loadPayments();
  }, [statusFilter, methodFilter]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.payment_method = methodFilter;

      const response = await getPayments(params);

      if (Array.isArray(response)) {
        const filtered = searchTerm
          ? response.filter((p) =>
              p.reference_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            )
          : response;
        setPayments(filtered);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      setPayments([]);
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setMethodFilter("");
  };

  const columns = [
    {
      header: "Date",
      accessor: (row: Payment) =>
        new Date(row.payment_date).toLocaleDateString(),
    },
    {
      header: "Reference #",
      accessor: "reference_number" as keyof Payment,
      className: "font-medium",
    },
    {
      header: "Amount",
      accessor: (row: Payment) => (
        <span className="font-semibold text-green-800 text-lg">
          ${row.amount}
        </span>
      ),
    },
    {
      header: "Payment Method",
      accessor: (row: Payment) => (
        <span className="capitalize">
          {row.payment_method.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: Payment) => (
        <StatusBadge status={row.status} type="payment" />
      ),
    },
    {
      header: "Receipt",
      accessor: (row: Payment) =>
        row.receipt ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tenant/finance/receipts/${row.receipt}`);
            }}
            className="flex items-center gap-1 text-orange-500 hover:text-orange-600"
          >
            <ReceiptIcon className="h-4 w-4" />
            <span className="text-xs">View</span>
          </button>
        ) : (
          <span className="text-gray-400 text-sm">Pending</span>
        ),
    },
  ];

  // Calculate totals by month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthTotal = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date);
      return (
        p.status === "completed" &&
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const lastMonthTotal = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        p.status === "completed" &&
        paymentDate.getMonth() === lastMonth &&
        paymentDate.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const yearToDateTotal = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date);
      return (
        p.status === "completed" && paymentDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">My Payments</h1>
        <p className="text-gray-600 mt-1">View your payment history</p>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">This Month</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            ${thisMonthTotal.toFixed(2)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {
              payments.filter(
                (p) =>
                  new Date(p.payment_date).getMonth() === currentMonth &&
                  p.status === "completed",
              ).length
            }{" "}
            payments
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Last Month</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            ${lastMonthTotal.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Year to Date</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${yearToDateTotal.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {
              payments.filter(
                (p) =>
                  new Date(p.payment_date).getFullYear() === currentYear &&
                  p.status === "completed",
              ).length
            }{" "}
            payments
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            name: "status",
            label: "All Statuses",
            value: statusFilter,
            options: [
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
            ],
            onChange: setStatusFilter,
          },
          {
            name: "method",
            label: "Payment Method",
            value: methodFilter,
            options: [
              { value: "cash", label: "Cash" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "mobile_money", label: "Mobile Money" },
              { value: "card", label: "Card" },
              { value: "check", label: "Check" },
            ],
            onChange: setMethodFilter,
          },
        ]}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable
          data={payments}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No payments found"
        />
      </div>

      {/* Summary */}
      {!isLoading && payments.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-xl font-bold text-black">{payments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-green-800">
                {payments.filter((p) => p.status === "completed").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount Paid</p>
              <p className="text-xl font-bold text-black">
                $
                {payments
                  .filter((p) => p.status === "completed")
                  .reduce((sum, p) => sum + parseFloat(p.amount), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
