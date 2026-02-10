"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { ActionButton } from "../../components/ActionButton";
import { getReceiptById, downloadReceipt } from "@/app/api/finance";
import type { Receipt } from "@/types/finance";
import { toast } from "sonner";
import { generatePDF } from "@/app/utils/pdfGenerator";

export default function ReceiptDetailPage() {
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
          "admin-receipt-content",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!receipt) {
    return <div className="p-6 text-center">Receipt not found</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header - Hide on print */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black">Receipt</h1>
              <p className="text-gray-600 mt-1">{receipt.receipt_number}</p>
            </div>
            <div className="flex gap-2">
              <ActionButton
                onClick={handlePrint}
                icon={Printer}
                variant="secondary"
              >
                Print
              </ActionButton>
              <ActionButton
                onClick={handleDownload}
                icon={Download}
                variant="primary"
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Receipt Content - Printable */}
        <div id="admin-receipt-content" className="bg-white border-2 border-gray-300 rounded-lg p-8 print:border-0">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">
              Payment Receipt
            </h2>
            <p className="text-lg font-semibold text-orange-500">
              {receipt.receipt_number}
            </p>
          </div>

          {/* Receipt Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Date</p>
              <p className="font-semibold text-black">
                {new Date(receipt.payment_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-semibold text-black capitalize">
                {receipt.payment_method.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
            <p className="text-4xl font-bold text-orange-500">
              ${receipt.amount}
            </p>
          </div>

          {/* Payment Allocation */}
          <div className="mb-8">
            <h3 className="font-semibold text-black mb-4">
              Payment Allocation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Applied to Invoice</span>
                <span className="font-semibold text-black">
                  ${receipt.amount_allocated_to_invoice}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Credited to Account</span>
                <span className="font-semibold text-black">
                  ${receipt.amount_to_account}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {receipt.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-black mb-2">Notes</h3>
              <p className="text-gray-700 text-sm">{receipt.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-300">
            <p className="text-sm text-gray-600">Thank you for your payment</p>
            <p className="text-xs text-gray-500 mt-2">
              This is an official receipt
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:border-0,
          .print\\:border-0 * {
            visibility: visible;
          }
          .print\\:border-0 {
            position: absolute;
            left: 0;
            top: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
