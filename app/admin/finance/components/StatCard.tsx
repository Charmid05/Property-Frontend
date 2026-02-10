import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-orange-500",
  subtitle,
  trend,
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-md border border-gray-200/80 p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-xl font-black text-gray-900 mb-1 truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-600 font-medium truncate">
              {subtitle}
            </p>
          )}
          {trend && (
            <div
              className={`flex items-center mt-1.5 text-xs font-bold ${trend.isPositive ? "text-green-700" : "text-red-600"}`}
            >
              <span>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${
            iconColor.includes("orange")
              ? "from-orange-100 to-orange-50 shadow-orange-500/20"
              : iconColor.includes("green")
                ? "from-green-100 to-emerald-50 shadow-green-500/20"
                : iconColor.includes("blue")
                  ? "from-blue-100 to-blue-50 shadow-blue-500/20"
                  : iconColor.includes("red")
                    ? "from-red-100 to-red-50 shadow-red-500/20"
                    : "from-gray-100 to-gray-50 shadow-gray-500/20"
          } shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
