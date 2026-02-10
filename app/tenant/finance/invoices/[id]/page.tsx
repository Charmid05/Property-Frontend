"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  CreditCard,
  Loader2,
} from "lucide-react";
import { getInvoiceById, getInvoicePaymentHistory } from "@/app/api/finance";
import type { InvoiceDetail } from "@/types/finance";
import { toast } from "sonner";
import { generatePDF } from "@/app/utils/pdfGenerator";

export default function TenantInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = parseInt(params.id as string);

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoiceDetails();
  }, [invoiceId]);

  const loadInvoiceDetails = async () => {
    setIsLoading(true);
    try {
      const [invoiceData, paymentsData] = await Promise.allSettled([
        getInvoiceById(invoiceId),
        getInvoicePaymentHistory(invoiceId),
      ]);

      if (invoiceData.status === "fulfilled") {
        setInvoice(invoiceData.value);
      } else {
        toast.error("Failed to load invoice");
      }

      if (paymentsData.status === "fulfilled") {
        setPaymentHistory(paymentsData.value);
      }
    } catch (error) {
      console.error("Failed to load invoice details:", error);
      toast.error("Failed to load invoice details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info("Generating PDF...");
      await generatePDF(
        "invoice-content",
        `Invoice-${invoice?.invoice_number}`,
        {
          orientation: "portrait",
          format: "a4",
          quality: 2,
        }
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  // Separate rent and utility charges
  const rentCharges = invoice?.charges?.filter((charge: any) =>
    ["rent", "monthly_rent", "base_rent"].some(type =>
      charge.charge_type_name?.toLowerCase().includes(type.toLowerCase())
    )
  ) || [];

  const utilityCharges = invoice?.charges?.filter((charge: any) =>
    ["water", "electricity", "gas", "internet", "trash", "sewer", "utility"].some(type =>
      charge.charge_type_name?.toLowerCase().includes(type.toLowerCase())
    )
  ) || [];

  const otherCharges = invoice?.charges?.filter((charge: any) =>
    !rentCharges.includes(charge) && !utilityCharges.includes(charge)
  ) || [];

  const isOverdue =
    invoice &&
    new Date(invoice.due_date) < new Date() &&
    invoice.status !== "paid" &&
    invoice.status !== "cancelled";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/tenant/finance/invoices")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto" id="invoice-content">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Invoices
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">
                Invoice {invoice.invoice_number}
              </h1>
              <p className="text-gray-600 mt-1">Invoice details and charges</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                <button
                  onClick={() =>
                    router.push(`/tenant/payments/new?invoice_id=${invoice.id}`)
                  }
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alert for Overdue */}
        {isOverdue && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Overdue Invoice</h3>
                <p className="text-sm text-red-800 mt-1">
                  This invoice is past due. Please make a payment as soon as
                  possible to avoid late fees.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Invoice Status</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Issue Date</p>
              <p className="font-semibold text-black">
                {new Date(invoice.issue_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Date</p>
              <p
                className={`font-semibold ${
                  isOverdue ? "text-red-600" : "text-black"
                }`}
              >
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Billing Period</p>
              <p className="font-semibold text-black">
                {invoice.billing_period_details?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-black">
                  ${parseFloat(invoice.total_amount).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${parseFloat(invoice.amount_paid).toFixed(2)}
                </p>
              </div>
              <div
                className={`rounded-lg p-4 ${
                  parseFloat(invoice.balance_due) > 0
                    ? "bg-orange-50"
                    : "bg-gray-50"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">Balance Due</p>
                <p
                  className={`text-2xl font-bold ${
                    parseFloat(invoice.balance_due) > 0
                      ? "text-orange-600"
                      : "text-gray-600"
                  }`}
                >
                  ${parseFloat(invoice.balance_due).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-black mb-4">Invoice Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.charges && invoice.charges.length > 0 ? (
                  <>
                    {/* Rent Charges */}
                    {rentCharges.length > 0 && (
                      <>
                        <tr className="bg-blue-50">
                          <td colSpan={4} className="py-2 px-2 font-semibold text-blue-900">
                            Rent
                          </td>
                        </tr>
                        {rentCharges.map((charge: any, index: number) => (
                          <tr key={`rent-${index}`} className="border-b border-gray-100">
                            <td className="py-3 px-2 pl-6">
                              <p className="font-medium text-black">
                                {charge.charge_type_name}
                              </p>
                              {charge.description && (
                                <p className="text-sm text-gray-600">
                                  {charge.description}
                                </p>
                              )}
                            </td>
                            <td className="text-center py-3 px-2 text-black">
                              {parseFloat(charge.quantity).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 text-black">
                              ${parseFloat(charge.unit_price).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 font-semibold text-black">
                              ${parseFloat(charge.total).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}

                    {/* Utility Charges */}
                    {utilityCharges.length > 0 && (
                      <>
                        <tr className="bg-green-50">
                          <td colSpan={4} className="py-2 px-2 font-semibold text-green-900">
                            Utilities
                          </td>
                        </tr>
                        {utilityCharges.map((charge: any, index: number) => (
                          <tr key={`utility-${index}`} className="border-b border-gray-100">
                            <td className="py-3 px-2 pl-6">
                              <p className="font-medium text-black">
                                {charge.charge_type_name}
                              </p>
                              {charge.description && (
                                <p className="text-sm text-gray-600">
                                  {charge.description}
                                </p>
                              )}
                            </td>
                            <td className="text-center py-3 px-2 text-black">
                              {parseFloat(charge.quantity).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 text-black">
                              ${parseFloat(charge.unit_price).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 font-semibold text-black">
                              ${parseFloat(charge.total).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}

                    {/* Other Charges */}
                    {otherCharges.length > 0 && (
                      <>
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="py-2 px-2 font-semibold text-gray-900">
                            Other Charges
                          </td>
                        </tr>
                        {otherCharges.map((charge: any, index: number) => (
                          <tr key={`other-${index}`} className="border-b border-gray-100">
                            <td className="py-3 px-2 pl-6">
                              <p className="font-medium text-black">
                                {charge.charge_type_name}
                              </p>
                              {charge.description && (
                                <p className="text-sm text-gray-600">
                                  {charge.description}
                                </p>
                              )}
                            </td>
                            <td className="text-center py-3 px-2 text-black">
                              {parseFloat(charge.quantity).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 text-black">
                              ${parseFloat(charge.unit_price).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-2 font-semibold text-black">
                              ${parseFloat(charge.total).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No charges listed
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={3}
                    className="py-4 px-2 text-right font-bold text-black"
                  >
                    Subtotal:
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-black">
                    ${parseFloat(invoice.subtotal).toFixed(2)}
                  </td>
                </tr>
                {parseFloat(invoice.tax_amount) > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 px-2 text-right text-gray-700"
                    >
                      Tax:
                    </td>
                    <td className="py-2 px-2 text-right text-gray-700">
                      ${parseFloat(invoice.tax_amount).toFixed(2)}
                    </td>
                  </tr>
                )}
                {invoice.discount_amount && parseFloat(invoice.discount_amount) > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 px-2 text-right text-green-700"
                    >
                      Discount:
                    </td>
                    <td className="py-2 px-2 text-right text-green-700">
                      -${parseFloat(invoice.discount_amount).toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-300">
                  <td
                    colSpan={3}
                    className="py-4 px-2 text-right font-bold text-black text-lg"
                  >
                    Total:
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-orange-600 text-lg">
                    ${parseFloat(invoice.total_amount).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-black mb-4">
              Payment History
            </h2>
            <div className="space-y-3">
              {paymentHistory.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">
                        {payment.reference_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.payment_date).toLocaleDateString()} •{" "}
                        {payment.payment_method.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {invoice.notes && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-black mb-4">Notes</h2>
            <p className="text-gray-700">{invoice.notes}</p>
          </div>
        )}

        {/* Action Section */}
        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
          <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Ready to Pay?</h3>
                <p className="text-sm opacity-90">
                  Click below to make a payment for this invoice
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(`/tenant/payments/new?invoice_id=${invoice.id}`)
                }
                className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Pay ${parseFloat(invoice.balance_due).toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

