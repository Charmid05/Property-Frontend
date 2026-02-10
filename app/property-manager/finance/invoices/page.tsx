"use client";

import React, { useState, useEffect } from "react";
import { Plus, Eye, Send, X, DollarSign } from "lucide-react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { StatusBadge } from "@/app/admin/finance/components/StatusBadge";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { ActionButton } from "@/app/admin/finance/components/ActionButton";
import { getInvoices, sendInvoice, cancelInvoice } from "@/app/api/finance";
import type { InvoiceListItem } from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PropertyManagerInvoicesPage() {
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
        // Filter by search term locally
        const filtered = searchTerm
          ? response.filter(
              (inv) =>
                inv.invoice_number
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                inv.tenant_name
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

  const handleSendInvoice = async (id: number) => {
    try {
      await sendInvoice(id);
      toast.success("Invoice sent successfully");
      loadInvoices();
    } catch (error: any) {
      toast.error(error.message || "Failed to send invoice");
    }
  };

  const handleCancelInvoice = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this invoice?")) return;

    try {
      await cancelInvoice(id);
      toast.success("Invoice cancelled");
      loadInvoices();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel invoice");
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
      header: "Tenant",
      accessor: "tenant_name" as keyof InvoiceListItem,
    },
    {
      header: "Issue Date",
      accessor: (row: InvoiceListItem) =>
        new Date(row.issue_date).toLocaleDateString(),
    },
    {
      header: "Due Date",
      accessor: (row: InvoiceListItem) =>
        new Date(row.due_date).toLocaleDateString(),
    },
    {
      header: "Total",
      accessor: (row: InvoiceListItem) => (
        <span className="font-semibold">${row.total_amount}</span>
      ),
    },
    {
      header: "Paid",
      accessor: (row: InvoiceListItem) => `$${row.amount_paid}`,
    },
    {
      header: "Balance",
      accessor: (row: InvoiceListItem) => (
        <span
          className={
            row.balance_due !== "0.00" ? "text-orange-500 font-semibold" : ""
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
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/property-manager/finance/invoices/${row.id}`);
            }}
            className="text-orange-500 hover:text-orange-600"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === "draft" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSendInvoice(row.id);
              }}
              className="text-green-800 hover:text-green-900"
              title="Send Invoice"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
          {(row.status === "draft" || row.status === "sent") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelInvoice(row.id);
              }}
              className="text-red-600 hover:text-red-700"
              title="Cancel Invoice"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {(row.status === "sent" || row.status === "partial") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(
                  `/property-manager/finance/payments/new?invoice_id=${row.id}`,
                );
              }}
              className="text-blue-600 hover:text-blue-700"
              title="Apply Payment"
            >
              <DollarSign className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-black">Invoices</h1>
          <p className="text-gray-600 mt-1">
            Manage invoices for your properties
          </p>
        </div>
        <ActionButton
          onClick={() => router.push("/property-manager/finance/invoices/new")}
          icon={Plus}
          variant="primary"
        >
          Create Invoice
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
            label: "Overdue Status",
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
            router.push(`/property-manager/finance/invoices/${invoice.id}`)
          }
          emptyMessage="No invoices found for your properties"
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
              <p className="text-sm text-gray-600">Total Amount</p>
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
              <p className="text-sm text-gray-600">Balance Due</p>
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
