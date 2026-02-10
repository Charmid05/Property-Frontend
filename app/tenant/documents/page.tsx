"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  FolderOpen,
  Loader2,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { getReceipts } from "@/app/api/finance";
import { toast } from "sonner";

export default function DocumentsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const receiptData = await getReceipts({});
      if (Array.isArray(receiptData)) {
        setReceipts(receiptData);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const documentCategories = [
    {
      id: "lease",
      title: "Lease Agreement",
      description: "Your current lease agreement and terms",
      icon: FileText,
      color: "blue",
      count: 0, // Would come from API
      action: () => toast.info("Lease documents feature coming soon"),
    },
    {
      id: "receipts",
      title: "Payment Receipts",
      description: "All your payment receipts and confirmations",
      icon: ReceiptIcon,
      color: "green",
      count: receipts.length,
      action: () => router.push("/tenant/finance/receipts"),
    },
    {
      id: "notices",
      title: "Notices & Letters",
      description: "Important notices from property management",
      icon: FileText,
      color: "orange",
      count: 0, // Would come from API
      action: () => toast.info("Notices feature coming soon"),
    },
    {
      id: "other",
      title: "Other Documents",
      description: "Additional documents and files",
      icon: FolderOpen,
      color: "purple",
      count: 0, // Would come from API
      action: () => toast.info("Additional documents feature coming soon"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">My Documents</h1>
          <p className="text-gray-600 mt-1">
            Access your lease, receipts, and other important documents
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            {/* Document Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {documentCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={category.action}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon
                      className={`w-6 h-6 text-${category.color}-600`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black">
                      {category.count}
                    </span>
                    <span className="text-sm text-orange-500 group-hover:text-orange-600">
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Receipts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">
                  Recent Payment Receipts
                </h2>
                <button
                  onClick={() => router.push("/tenant/finance/receipts")}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              {receipts.length > 0 ? (
                <div className="space-y-3">
                  {receipts.slice(0, 5).map((receipt) => (
                    <div
                      key={receipt.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/tenant/finance/receipts/${receipt.id}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <ReceiptIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">
                            {receipt.receipt_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(receipt.issue_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-green-600">
                          ${parseFloat(receipt.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/tenant/finance/receipts/${receipt.id}`
                            );
                          }}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ReceiptIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No receipts available</p>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">
                    Document Storage & Access
                  </h3>
                  <p className="text-sm text-blue-800 mb-2">
                    All your important documents are stored securely and are
                    accessible anytime. You can view and download:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>• Lease agreements and addendums</li>
                    <li>• Payment receipts and transaction history</li>
                    <li>• Property notices and communications</li>
                    <li>• Move-in/move-out inspection reports</li>
                  </ul>
                  <p className="text-sm text-blue-800 mt-3">
                    If you need a specific document that isn't listed here,
                    please contact your property manager.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

