"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Receipt as ReceiptIcon } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FilterBar } from "../components/FilterBar";
import { ActionButton } from "../components/ActionButton";
import { getPayments } from "@/app/api/finance";
import type { Payment } from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PaymentsPage() {
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
                .includes(searchTerm.toLowerCase())
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
        <span className="font-semibold text-green-800">${row.amount}</span>
      ),
    },
    {
      header: "Method",
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
              router.push(`/admin/finance/receipts/${row.receipt}`);
            }}
            className="text-orange-500 hover:text-orange-600"
          >
            <ReceiptIcon className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Payments</h1>
          <p className="text-gray-600 mt-1">Track all payment transactions</p>
        </div>
        <ActionButton
          onClick={() => router.push("/admin/finance/payments/new")}
          icon={Plus}
          variant="primary"
        >
          Record Payment
        </ActionButton>
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
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-black">
                $
                {payments
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
