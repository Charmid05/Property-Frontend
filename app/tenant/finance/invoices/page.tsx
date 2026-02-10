"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { StatusBadge } from "@/app/admin/finance/components/StatusBadge";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { getInvoices } from "@/app/api/finance";
import type { InvoiceListItem } from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TenantInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [overdueFilter, setOverdueFilter] = useState("");

  useEffect(() => {
    loadInvoices();
  }, [searchTerm, statusFilter, overdueFilter]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (overdueFilter === "true") params.overdue = true;

      const response = await getInvoices(params);

      if (Array.isArray(response)) {
        const filtered = searchTerm
          ? response.filter((inv) =>
              inv.invoice_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
            )
          : response;
        setInvoices(filtered);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
      setInvoices([]);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("");
    setOverdueFilter("");
  };

  const columns = [
    {
      header: "Invoice #",
      accessor: "invoice_number" as keyof InvoiceListItem,
      className: "font-medium",
    },
    {
      header: "Issue Date",
      accessor: (row: InvoiceListItem) =>
        new Date(row.issue_date).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessor: (row: InvoiceListItem) => {
        const dueDate = new Date(row.due_date);
        const isOverdue = dueDate < new Date() && row.status !== "paid";
        return (
          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      header: "Total Amount",
      accessor: (row: InvoiceListItem) => (
        <span className="font-semibold text-gray-900">${row.total_amount}</span>
      ),
    },
    {
      header: "Amount Paid",
      accessor: (row: InvoiceListItem) => (
        <span className="text-green-800">${row.amount_paid}</span>
      ),
    },
    {
      header: "Balance Due",
      accessor: (row: InvoiceListItem) => (
        <span
          className={
            row.balance_due !== "0.00"
              ? "text-orange-500 font-bold text-lg"
              : "text-gray-600"
          }
        >
          ${row.balance_due}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: InvoiceListItem) => (
        <StatusBadge status={row.status} type="invoice" />
      ),
    },
    {
      header: "Actions",
      accessor: (row: InvoiceListItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/tenant/finance/invoices/${row.id}`);
          }}
          className="text-orange-500 hover:text-orange-600"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  // Calculate statistics
  const totalOwed = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + parseFloat(inv.balance_due), 0);

  const overdueAmount = invoices
    .filter(
      (inv) =>
        new Date(inv.due_date) < new Date() &&
        inv.status !== "paid" &&
        inv.status !== "cancelled",
    )
    .reduce((sum, inv) => sum + parseFloat(inv.balance_due), 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">My Invoices</h1>
        <p className="text-gray-600 mt-1">View your billing statements</p>
      </div>

      {/* Alert for overdue invoices */}
      {overdueAmount > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Overdue Payment Alert
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  You have overdue invoices totaling{" "}
                  <span className="font-bold">${overdueAmount.toFixed(2)}</span>
                  . Please make payment as soon as possible to avoid late fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-orange-700 font-medium">
            Total Outstanding
          </p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            ${totalOwed.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">Overdue Amount</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            ${overdueAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Paid This Month</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            $
            {invoices
              .filter(
                (inv) =>
                  inv.status === "paid" &&
                  new Date(inv.issue_date).getMonth() === new Date().getMonth(),
              )
              .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0)
              .toFixed(2)}
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
              { value: "draft", label: "Draft" },
              { value: "sent", label: "Sent" },
              { value: "paid", label: "Paid" },
              { value: "partial", label: "Partial" },
              { value: "overdue", label: "Overdue" },
              { value: "cancelled", label: "Cancelled" },
            ],
            onChange: setStatusFilter,
          },
          {
            name: "overdue",
            label: "Payment Status",
            value: overdueFilter,
            options: [
              { value: "true", label: "Overdue Only" },
              { value: "false", label: "Not Overdue" },
            ],
            onChange: setOverdueFilter,
          },
        ]}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(invoice) =>
            router.push(`/tenant/finance/invoices/${invoice.id}`)
          }
          emptyMessage="No invoices found"
        />
      </div>

      {/* Summary */}
      {!isLoading && invoices.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-xl font-bold text-black">{invoices.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Billed</p>
              <p className="text-xl font-bold text-black">
                $
                {invoices
                  .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold text-green-800">
                $
                {invoices
                  .reduce((sum, inv) => sum + parseFloat(inv.amount_paid), 0)
                  .toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding Balance</p>
              <p className="text-xl font-bold text-orange-500">
                $
                {invoices
                  .reduce((sum, inv) => sum + parseFloat(inv.balance_due), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
