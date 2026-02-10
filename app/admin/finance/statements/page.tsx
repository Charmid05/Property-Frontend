"use client";

import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import { FormInput } from "../components/FormInput";
import { ActionButton } from "../components/ActionButton";
import { generateTenantStatement, getCurrentBalance } from "@/app/api/finance";
import { getTenants } from "@/app/api/tenant/api";
import type { TenantStatement, CurrentBalanceResponse } from "@/types/finance";
import { toast } from "sonner";
import { FinanceNav } from "../components/FinanceNav";

export default function StatementsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statement, setStatement] = useState<TenantStatement | null>(null);
  const [balance, setBalance] = useState<CurrentBalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const response = await getTenants();
      setTenants(Array.isArray(response) ? response : response?.results || []);
    } catch (error) {
      console.error("Failed to load tenants:", error);
      toast.error("Failed to load tenants");
    }
  };

  const handleGenerateStatement = async () => {
    if (!selectedTenant || !startDate || !endDate) {
      toast.error("Please select tenant and date range");
      return;
    }

    setIsLoading(true);
    try {
      const [statementData, balanceData] = await Promise.all([
        generateTenantStatement({
          tenant_id: selectedTenant,
          period_start: startDate,
          period_end: endDate,
        }),
        getCurrentBalance(selectedTenant),
      ]);

      setStatement(statementData);
      setBalance(balanceData);
      toast.success("Statement generated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate statement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <FinanceNav />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">
          Tenant Statements
        </h1>
        <p className="text-gray-600 mb-6">
          Generate account statements and view balances
        </p>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Generate Statement
          </h2>

          <div className="grid grid-cols-4 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Tenant <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
              >
                <option value={0}>Select Tenant</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.user
                      ? `${t.user.first_name} ${t.user.last_name}`
                      : `Tenant ${t.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-black"
              />
            </div>

            <ActionButton
              onClick={handleGenerateStatement}
              icon={Search}
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate"}
            </ActionButton>
          </div>
        </div>

        {/* Current Balance */}
        {balance && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-black mb-4">
              Current Balance
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    parseFloat(balance.current_balance) >= 0
                      ? "text-green-800"
                      : "text-red-600"
                  }`}
                >
                  ${balance.current_balance}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Debt Amount</p>
                <p className="text-2xl font-bold text-orange-500">
                  ${balance.debt_amount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                <p className="text-2xl font-bold text-black">
                  ${balance.credit_limit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Credit</p>
                <p className="text-2xl font-bold text-green-800">
                  ${balance.available_credit}
                </p>
              </div>
            </div>
            {balance.is_in_debt && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ This account is currently in debt
                </p>
              </div>
            )}
          </div>
        )}

        {/* Statement */}
        {statement && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Statement Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  Account Statement
                </h2>
                <p className="text-gray-600 mt-1">{statement.tenant_name}</p>
                <p className="text-sm text-gray-500">
                  Period:{" "}
                  {new Date(statement.period_start).toLocaleDateString()} -{" "}
                  {new Date(statement.period_end).toLocaleDateString()}
                </p>
              </div>
              <ActionButton
                onClick={() => window.print()}
                icon={Download}
                variant="secondary"
                size="sm"
              >
                Print
              </ActionButton>
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Opening Balance</p>
                <p className="text-lg font-semibold text-black">
                  ${statement.opening_balance}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Charges</p>
                <p className="text-lg font-semibold text-red-600">
                  ${statement.total_charges}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-lg font-semibold text-green-800">
                  ${statement.total_payments}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Closing Balance</p>
                <p className="text-lg font-semibold text-orange-500">
                  ${statement.closing_balance}
                </p>
              </div>
            </div>

            {/* Transactions */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-3">
                Transactions
              </h3>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {statement.transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 text-sm text-black">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-black capitalize">
                        {tx.transaction_type.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {tx.description}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-semibold ${
                          tx.transaction_type === "payment"
                            ? "text-green-800"
                            : "text-red-600"
                        }`}
                      >
                        {tx.transaction_type === "payment" ? "+" : "-"}$
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoices */}
            {statement.invoices.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-3">
                  Invoices
                </h3>
                <div className="space-y-2">
                  {statement.invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-black">
                          {inv.invoice_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(inv.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">
                          ${inv.total_amount}
                        </p>
                        <p className="text-sm text-gray-600">
                          Balance: ${inv.balance_due}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Receipts */}
            {statement.receipts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">
                  Receipts
                </h3>
                <div className="space-y-2">
                  {statement.receipts.map((receipt) => (
                    <div
                      key={receipt.id}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-black">
                          {receipt.receipt_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(receipt.payment_date).toLocaleDateString()}{" "}
                          • {receipt.payment_method}
                        </p>
                      </div>
                      <p className="font-semibold text-green-800">
                        ${receipt.amount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
