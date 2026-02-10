import React from "react";

interface StatusBadgeProps {
  status: string;
  type: "invoice" | "payment" | "rentPayment";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const getStatusColor = () => {
    const statusLower = status.toLowerCase();

    if (type === "invoice") {
      switch (statusLower) {
        case "paid":
          return "bg-gradient-to-r from-green-800 to-green-700 text-white shadow-sm shadow-green-500/30";
        case "draft":
          return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-500/30";
        case "sent":
          return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/30";
        case "partial":
          return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30";
        case "overdue":
          return "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm shadow-red-500/30";
        case "cancelled":
          return "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-sm shadow-gray-500/30";
        default:
          return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-500/30";
      }
    }

    if (type === "payment" || type === "rentPayment") {
      switch (statusLower) {
        case "completed":
          return "bg-gradient-to-r from-green-800 to-green-700 text-white shadow-sm shadow-green-500/30";
        case "pending":
          return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30";
        case "processing":
          return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/30";
        case "failed":
          return "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm shadow-red-500/30";
        case "partial":
          return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30";
        case "refunded":
          return "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm shadow-gray-500/30";
        default:
          return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-500/30";
      }
    }

    return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-500/30";
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor()} transition-all duration-200 hover:scale-105`}
    >
      {status.toUpperCase()}
    </span>
  );
};
