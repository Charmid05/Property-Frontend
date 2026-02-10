"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle,
  Calendar,
  CreditCard,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getReceiptById, downloadReceipt } from "@/app/api/finance";
import type { Receipt } from "@/types/finance";
import { toast } from "sonner";
import { generatePDF } from "@/app/utils/pdfGenerator";

export default function TenantReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const receiptId = parseInt(params.id as string);

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadReceipt();
  }, [receiptId]);

  const loadReceipt = async () => {
    setIsLoading(true);
    try {
      const data = await getReceiptById(receiptId);
      setReceipt(data);
    } catch (error) {
      console.error("Failed to load receipt:", error);
      toast.error("Failed to load receipt");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Try API download first
      try {
        await downloadReceipt(receiptId);
        toast.success("Receipt downloaded successfully");
      } catch (apiError) {
        // If API download fails, fallback to client-side PDF generation
        console.log("API download failed, using client-side PDF generation");
        toast.info("Generating PDF...");
        await generatePDF(
          "receipt-content",
          `Receipt-${receipt?.receipt_number || receiptId}`,
          {
            orientation: "portrait",
            format: "a4",
            quality: 2,
          }
        );
        toast.success("Receipt downloaded successfully");
      }
    } catch (error: any) {
      console.error("Failed to download receipt:", error);
      toast.error(error.message || "Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-black mb-2">Receipt Not Found</h2>
          <p className="text-gray-600 mb-4">
            The receipt you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/tenant/finance/receipts")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Receipts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Hide on print */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Receipts
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Payment Receipt</h1>
              <p className="text-gray-600 mt-1">{receipt.receipt_number}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Content - Printable */}
        <div id="receipt-content" className="bg-white rounded-xl border border-gray-200 p-8 print:border-0 print:shadow-none">
          {/* Success Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Payment Received
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-2">
              Payment Receipt
            </h2>
            <p className="text-lg font-semibold text-orange-500">
              {receipt.receipt_number}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {new Date(receipt.issue_date || receipt.payment_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Amount Section - Prominent */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-8 mb-8 text-center">
            <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
              Amount Paid
            </p>
            <p className="text-5xl font-bold text-green-600">
              ${parseFloat(receipt.amount).toFixed(2)}
            </p>
          </div>

          {/* Receipt Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Payment Date
                </p>
              </div>
              <p className="text-lg font-bold text-black">
                {new Date(receipt.payment_date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Payment Method
                </p>
              </div>
              <p className="text-lg font-bold text-black capitalize">
                {receipt.payment_method.replace("_", " ")}
              </p>
            </div>

            {receipt.transaction && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Transaction ID
                  </p>
                </div>
                <p className="text-lg font-bold text-black">
                  #{receipt.transaction}
                </p>
              </div>
            )}

            {receipt.invoice && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">
                    Related Invoice
                  </p>
                </div>
                <button
                  onClick={() =>
                    router.push(`/tenant/finance/invoices/${receipt.invoice}`)
                  }
                  className="text-lg font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  View Invoice
                </button>
              </div>
            )}
          </div>

          {/* Payment Allocation */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">
              Payment Allocation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Applied to Invoice</span>
                <span className="text-lg font-bold text-black">
                  ${parseFloat(receipt.amount_allocated_to_invoice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Credited to Account</span>
                <span className="text-lg font-bold text-black">
                  ${parseFloat(receipt.amount_to_account).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-semibold text-green-800">Total</span>
                <span className="text-xl font-bold text-green-600">
                  ${parseFloat(receipt.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Notes</h3>
              <p className="text-sm text-blue-800">{receipt.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-6 mt-6 border-t-2 border-gray-200">
            <p className="text-green-600 font-semibold mb-2">
              ✓ Thank you for your payment
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This is an official receipt for your records. Please keep it for
              your files.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Receipt generated on{" "}
              {new Date(receipt.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Info Section - Hide on print */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 print:hidden">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Receipt Information</p>
              <p>
                This receipt confirms your payment has been received and
                processed. You can download a PDF copy or print this page for
                your records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

