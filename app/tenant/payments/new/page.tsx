"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  CreditCard,
  Smartphone,
  Banknote,
  FileCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { quickPayment } from "@/app/api/finance";
import { getInvoices, getInvoiceById } from "@/app/api/finance";
import type { QuickPaymentRequest, InvoiceListItem } from "@/types/finance";
import { toast } from "sonner";
import { useAuthContext } from "@/context/ApiContext";

export default function PayRentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceIdParam = searchParams.get("invoice_id");
  const { user } = useAuthContext();

  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const [formData, setFormData] = useState<QuickPaymentRequest>({
    tenant_id: user?.tenant_info?.id || 0,
    invoice_id: invoiceIdParam ? parseInt(invoiceIdParam) : undefined,
    amount: "",
    payment_method: "mobile_money",
    reference_number: "",
    notes: "",
  });

  useEffect(() => {
    if (user?.tenant_info?.id) {
      setFormData((prev) => ({ ...prev, tenant_id: user.tenant_info.id }));
      loadInvoices();
    }
  }, [user]);

  useEffect(() => {
    if (invoiceIdParam) {
      loadInvoice(parseInt(invoiceIdParam));
    }
  }, [invoiceIdParam]);

  const loadInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const response = await getInvoices({});
      if (Array.isArray(response)) {
        // Filter unpaid and partially paid invoices
        const unpaidInvoices = response.filter(
          (inv) =>
            inv.status !== "paid" &&
            inv.status !== "cancelled" &&
            parseFloat(inv.balance_due) > 0
        );
        setInvoices(unpaidInvoices);
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const loadInvoice = async (id: number) => {
    try {
      const invoice = await getInvoiceById(id);
      setSelectedInvoice(invoice);
      setFormData((prev) => ({
        ...prev,
        invoice_id: id,
        amount: invoice.balance_due,
      }));
    } catch (error) {
      console.error("Failed to load invoice:", error);
      toast.error("Failed to load invoice details");
    }
  };

  const handleInvoiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const invoiceId = e.target.value ? parseInt(e.target.value) : undefined;
    if (invoiceId) {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        setSelectedInvoice(invoice);
        setFormData((prev) => ({
          ...prev,
          invoice_id: invoiceId,
          amount: invoice.balance_due,
        }));
      }
    } else {
      setSelectedInvoice(null);
      setFormData((prev) => ({
        ...prev,
        invoice_id: undefined,
        amount: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.invoice_id) {
      toast.error("Please select an invoice to pay");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    // Auto-generate reference number if not provided
    if (!formData.reference_number?.trim()) {
      const autoRef = `AUTO-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      formData.reference_number = autoRef;
      toast.info(`Auto-generated reference: ${autoRef}`);
    }

    setIsLoading(true);
    try {
      const result = await quickPayment({
        ...formData,
        tenant_id: user?.tenant_info?.id || formData.tenant_id,
      });

      toast.success(
        `Payment processed successfully! Receipt: ${result.receipt.receipt_number}`
      );
      router.push(`/tenant/finance/receipts/${result.receipt.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const paymentMethods = [
    { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
    { value: "bank_transfer", label: "Bank Transfer", icon: Banknote },
    { value: "card", label: "Debit/Credit Card", icon: CreditCard },
    { value: "cash", label: "Cash", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-black">Pay Rent</h1>
          <p className="text-gray-600 mt-1">
            Make a payment for your outstanding invoices
          </p>
        </div>

        {loadingInvoices ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <FileCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">
              No Outstanding Invoices
            </h2>
            <p className="text-gray-600 mb-4">
              You don't have any unpaid invoices at the moment.
            </p>
            <button
              onClick={() => router.push("/tenant")}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-black mb-4">
                Select Invoice
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice *
                  </label>
                  <select
                    name="invoice_id"
                    value={formData.invoice_id || ""}
                    onChange={handleInvoiceSelect}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select an invoice...</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} - Due:{" "}
                        {new Date(invoice.due_date).toLocaleDateString()} -
                        Balance: ${invoice.balance_due}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedInvoice && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Invoice Number</p>
                        <p className="font-semibold text-black">
                          {selectedInvoice.invoice_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold text-black">
                          {new Date(
                            selectedInvoice.due_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-semibold text-black">
                          ${selectedInvoice.total_amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Balance Due</p>
                        <p className="font-bold text-orange-600 text-lg">
                          ${selectedInvoice.balance_due}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-black mb-4">
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0.01"
                      max={selectedInvoice?.balance_due}
                      required
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                  {selectedInvoice && (
                    <p className="text-sm text-gray-600 mt-1">
                      Maximum: ${selectedInvoice.balance_due}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.payment_method === method.value
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.value}
                          checked={formData.payment_method === method.value}
                          onChange={handleChange}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <method.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-black">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Reference Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Leave blank to auto-generate (e.g., MPesa code, bank reference)"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Leave blank to auto-generate, or enter your payment provider's reference
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Simulation Mode</p>
                <p>
                  This is a payment simulation. Simply fill in the amount and click Submit.
                  A reference number will be auto-generated if you don't provide one.
                  Your payment will be recorded immediately.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.invoice_id}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Submit Payment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

