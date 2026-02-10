"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReceipts } from "@/app/api/finance";
import type { Receipt } from "@/types/finance";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function ReceiptsPage() {
  const router = useRouter();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    setIsLoading(true);
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error("Failed to load receipts:", error);
      toast.error("Failed to load receipts");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Receipts</h1>
          <p className="text-gray-600 mt-1">View all payment receipts</p>
        </div>

        {/* Empty state */}
        {receipts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No receipts found
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {receipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/finance/receipts/${receipt.id}`)
                    }
                  >
                    <td className="px-6 py-4 font-medium text-black">
                      {receipt.receipt_number}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(receipt.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {receipt.payment_method.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-orange-500">
                      ${receipt.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
