"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { DataTable } from "../components/DataTable";
import { FilterBar } from "../components/FilterBar";
import { FinanceNav } from "../components/FinanceNav";
import { getTransactions, reverseTransaction } from "@/app/api/finance";
import type { TransactionListItem } from "@/types/finance";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    loadTransactions();
  }, [typeFilter, methodFilter]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (typeFilter) params.transaction_type = typeFilter;
      if (methodFilter) params.payment_method = methodFilter;

      const response = await getTransactions(params);

      if (Array.isArray(response)) {
        const filtered = searchTerm
          ? response.filter(
              (t) =>
                t.transaction_id
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : response;
        setTransactions(filtered);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReverse = async (id: number) => {
    const reason = prompt("Enter reason for reversal:");
    if (!reason) return;

    try {
      await reverseTransaction(id, { reason });
      toast.success("Transaction reversed successfully");
      loadTransactions();
    } catch (error: any) {
      toast.error(error.message || "Failed to reverse transaction");
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setTypeFilter("");
    setMethodFilter("");
  };

  const columns = [
    {
      header: "Date",
      accessor: (row: TransactionListItem) =>
        new Date(row.created_at).toLocaleDateString(),
    },
    {
      header: "Transaction ID",
      accessor: "transaction_id" as keyof TransactionListItem,
      className: "font-medium",
    },
    {
      header: "Type",
      accessor: (row: TransactionListItem) => (
        <span
          className={`capitalize ${
            row.transaction_type === "payment"
              ? "text-green-800 font-semibold"
              : row.transaction_type === "charge"
              ? "text-red-600 font-semibold"
              : "text-gray-700"
          }`}
        >
          {row.transaction_type.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: (row: TransactionListItem) => (
        <span
          className={`font-semibold ${
            row.transaction_type === "payment"
              ? "text-green-800"
              : row.transaction_type === "charge"
              ? "text-red-600"
              : "text-gray-700"
          }`}
        >
          ${row.amount}
        </span>
      ),
    },
    {
      header: "Method",
      accessor: (row: TransactionListItem) =>
        row.payment_method ? (
          <span className="capitalize">
            {row.payment_method.replace("_", " ")}
          </span>
        ) : (
          "-"
        ),
    },
    {
      header: "Description",
      accessor: "description" as keyof TransactionListItem,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <FinanceNav />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Transactions</h1>
          <p className="text-gray-600 mt-1">View all financial transactions</p>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={[
            {
              name: "type",
              label: "All Types",
              value: typeFilter,
              options: [
                { value: "payment", label: "Payment" },
                { value: "charge", label: "Charge" },
                { value: "refund", label: "Refund" },
                { value: "adjustment", label: "Adjustment" },
                { value: "penalty", label: "Penalty" },
                { value: "credit", label: "Credit" },
              ],
              onChange: setTypeFilter,
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
            data={transactions}
            columns={columns}
            isLoading={isLoading}
            emptyMessage="No transactions found"
          />
        </div>

        {/* Summary */}
        {!isLoading && transactions.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold text-black">
                  {transactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payments</p>
                <p className="text-xl font-bold text-green-800">
                  {
                    transactions.filter((t) => t.transaction_type === "payment")
                      .length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Charges</p>
                <p className="text-xl font-bold text-red-600">
                  {
                    transactions.filter((t) => t.transaction_type === "charge")
                      .length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Volume</p>
                <p className="text-xl font-bold text-black">
                  $
                  {transactions
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
