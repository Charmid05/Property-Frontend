"use client";

import React, { useState, useEffect } from "react";
import { Download, Eye, Printer } from "lucide-react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { getReceipts, downloadReceipt } from "@/app/api/finance";
import type { Receipt } from "@/types/finance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TenantReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    loadReceipts();
  }, [methodFilter]);

  const loadReceipts = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (methodFilter) params.payment_method = methodFilter;

      const response = await getReceipts(params);

      if (Array.isArray(response)) {
        const filtered = searchTerm
          ? response.filter((r) =>
              r.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : response;
        setReceipts(filtered);
      } else {
        setReceipts([]);
      }
    } catch (error) {
      console.error("Failed to load receipts:", error);
      setReceipts([]);
      toast.error("Failed to load receipts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setMethodFilter("");
  };

  const handleDownload = async (receiptId: number, receiptNumber: string) => {
    try {
      await downloadReceipt(receiptId);
      toast.success(`Receipt ${receiptNumber} downloaded successfully`);
    } catch (error: any) {
      console.error("Failed to download receipt:", error);
      toast.error(error.message || "Failed to download receipt");
    }
  };

  const columns = [
    {
      header: "Receipt #",
      accessor: "receipt_number" as keyof Receipt,
      className: "font-medium text-orange-600",
    },
    {
      header: "Payment Date",
      accessor: (row: Receipt) =>
        new Date(row.payment_date).toLocaleDateString(),
    },
    {
      header: "Amount",
      accessor: (row: Receipt) => (
        <span className="font-bold text-green-800 text-lg">${row.amount}</span>
      ),
    },
    {
      header: "Payment Method",
      accessor: (row: Receipt) => (
        <span className="capitalize">
          {row.payment_method.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Invoice",
      accessor: (row: Receipt) =>
        row.invoice ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tenant/finance/invoices/${row.invoice}`);
            }}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            View Invoice
          </button>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      header: "Actions",
      accessor: (row: Receipt) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tenant/finance/receipts/${row.id}`);
            }}
            className="text-orange-500 hover:text-orange-600"
            title="View Receipt"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(row.id, row.receipt_number);
            }}
            className="text-blue-600 hover:text-blue-700"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">My Receipts</h1>
        <p className="text-gray-600 mt-1">
          Download and view your payment receipts
        </p>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Receipt Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Keep these receipts for your records. You can download them as
                PDFs for printing or digital storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
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
          data={receipts}
          columns={columns}
          isLoading={isLoading}
          onRowClick={(receipt) =>
            router.push(`/tenant/finance/receipts/${receipt.id}`)
          }
          emptyMessage="No receipts found"
        />
      </div>

      {/* Summary */}
      {!isLoading && receipts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Receipts</p>
              <p className="text-xl font-bold text-black">{receipts.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-green-800">
                $
                {receipts
                  .reduce((sum, r) => sum + parseFloat(r.amount), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
