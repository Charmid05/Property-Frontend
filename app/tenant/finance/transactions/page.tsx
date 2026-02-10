"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/app/admin/finance/components/DataTable";
import { FilterBar } from "@/app/admin/finance/components/FilterBar";
import { getTransactions } from "@/app/api/finance";
import type { TransactionListItem } from "@/types/finance";
import { toast } from "sonner";

export default function TenantTransactionsPage() {
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
                t.description.toLowerCase().includes(searchTerm.toLowerCase()),
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
      className: "font-medium text-sm",
    },
    {
      header: "Type",
      accessor: (row: TransactionListItem) => {
        const isCredit =
          row.transaction_type === "payment" ||
          row.transaction_type === "refund" ||
          row.transaction_type === "credit";
        const isDebit =
          row.transaction_type === "charge" ||
          row.transaction_type === "penalty";

        return (
          <div className="flex items-center gap-2">
            {isCredit && <span className="text-green-600 text-xl">↓</span>}
            {isDebit && <span className="text-red-600 text-xl">↑</span>}
            <span
              className={`capitalize font-medium ${
                isCredit
                  ? "text-green-800"
                  : isDebit
                    ? "text-red-600"
                    : "text-gray-700"
              }`}
            >
              {row.transaction_type.replace("_", " ")}
            </span>
          </div>
        );
      },
    },
    {
      header: "Amount",
      accessor: (row: TransactionListItem) => {
        const isCredit =
          row.transaction_type === "payment" ||
          row.transaction_type === "refund" ||
          row.transaction_type === "credit";
        const isDebit =
          row.transaction_type === "charge" ||
          row.transaction_type === "penalty";

        return (
          <span
            className={`font-bold text-lg ${
              isCredit
                ? "text-green-800"
                : isDebit
                  ? "text-red-600"
                  : "text-gray-700"
            }`}
          >
            {isCredit && "+"}
            {isDebit && "-"}${row.amount}
          </span>
        );
      },
    },
    {
      header: "Method",
      accessor: (row: TransactionListItem) =>
        row.payment_method ? (
          <span className="capitalize text-sm">
            {row.payment_method.replace("_", " ")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      header: "Description",
      accessor: "description" as keyof TransactionListItem,
      className: "text-sm",
    },
  ];

  // Calculate running balance
  const calculateBalance = () => {
    let balance = 0;
    const credits = transactions
      .filter(
        (t) =>
          t.transaction_type === "payment" ||
          t.transaction_type === "refund" ||
          t.transaction_type === "credit",
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const debits = transactions
      .filter(
        (t) =>
          t.transaction_type === "charge" || t.transaction_type === "penalty",
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return credits - debits;
  };

  const totalCredits = transactions
    .filter(
      (t) =>
        t.transaction_type === "payment" ||
        t.transaction_type === "refund" ||
        t.transaction_type === "credit",
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalDebits = transactions
    .filter(
      (t) =>
        t.transaction_type === "charge" || t.transaction_type === "penalty",
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">My Transactions</h1>
        <p className="text-gray-600 mt-1">
          Complete history of your account activity
        </p>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">Total Credits</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            +${totalCredits.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-1">Payments & Refunds</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 font-medium">Total Debits</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            -${totalDebits.toFixed(2)}
          </p>
          <p className="text-xs text-red-600 mt-1">Charges & Penalties</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Net Position</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              calculateBalance() >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {calculateBalance() >= 0 ? "+" : ""}${calculateBalance().toFixed(2)}
          </p>
          <p className="text-xs text-blue-600 mt-1">Credits - Debits</p>
        </div>
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
  );
}
