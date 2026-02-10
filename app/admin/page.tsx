"use client";
import React, { JSX, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/ApiContext";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Receipt,
  Sparkles,
} from "lucide-react";
import { getProperties } from "@/app/api/properties/api";
import { getTenants } from "@/app/api/tenant/api";
import { getPayments } from "@/app/api/finance/payments/api";
import type { Payment } from "@/types/finance";

interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: "blue" | "green" | "orange" | "purple";
}

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
  onClick?: () => void;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthContext();

  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [tenantCount, setTenantCount] = useState<number>(0);
  const [monthlyPaymentsTotal, setMonthlyPaymentsTotal] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [propsRes, tenantsRes, paymentsRes] = await Promise.all([
          getProperties(),
          getTenants(),
          getPayments({}),
        ]);

        const propsResults: any = (propsRes as any)?.results || propsRes || [];
        setPropertyCount(Array.isArray(propsResults) ? propsResults.length : 0);

        const tenantResults: any = tenantsRes as any;
        const tenantTotal =
          tenantResults?.count ?? tenantResults?.results?.length ?? 0;
        setTenantCount(tenantTotal);

        const paymentsList: Payment[] = Array.isArray(paymentsRes)
          ? (paymentsRes as Payment[])
          : (paymentsRes as any)?.results || [];
        setPayments(paymentsList);

        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const monthTotal = paymentsList
          .filter((p) => {
            const d = new Date(p.created_at as any);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((sum, p: any) => sum + (Number(p.amount) || 0), 0);
        setMonthlyPaymentsTotal(monthTotal);
      } catch (e: any) {
        setError(e?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const stats: Stat[] = [
    {
      title: "Active Properties",
      value: String(propertyCount),
      change: "",
      changeType: "increase",
      icon: Building2,
      color: "blue",
    },
    {
      title: "Active Tenants",
      value: String(tenantCount),
      change: "",
      changeType: "increase",
      icon: Users,
      color: "green",
    },
    {
      title: "Monthly Payments",
      value: `KSh ${monthlyPaymentsTotal.toLocaleString()}`,
      change: "",
      changeType: "increase",
      icon: DollarSign,
      color: "orange",
    },
    {
      title: "Payment Trend",
      value: "30d",
      change: "",
      changeType: "increase",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      label: "Add Property",
      icon: Building2,
      color:
        "bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg shadow-indigo-500/30",
      onClick: () => router.push("/admin/properties"),
    },
    {
      label: "Add Unit",
      icon: Building2,
      color:
        "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30",
      onClick: () => router.push("/admin/units"),
    },
    {
      label: "Add Tenant",
      icon: Users,
      color:
        "bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-500/30",
      onClick: () => router.push("/admin/tenants"),
    },
    {
      label: "Finance",
      icon: Receipt,
      color:
        "bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-500/30",
      onClick: () => router.push("/admin/finance"),
    },
    {
      label: "Generate Report",
      icon: TrendingUp,
      color:
        "bg-gradient-to-br from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 shadow-lg shadow-sky-500/30",
      onClick: () => router.push("/admin/reports"),
    },
  ];

  const last30Days = useMemo(() => {
    const days: { date: string; total: number; daily: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayTotal = payments
        .filter((p: any) => (p.created_at || "").slice(0, 10) === key)
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      days.push({ date: key, total: dayTotal, daily: dayTotal });
    }
    let running = 0;
    return days.map((d) => {
      running += d.daily;
      return { ...d, total: running };
    });
  }, [payments]);

  const weeklyData = useMemo(() => {
    const weeks: { week: string; total: number }[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7 + 6));
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - i * 7);

      const weekTotal = payments
        .filter((p: any) => {
          const paymentDate = new Date(p.created_at as any);
          return paymentDate >= weekStart && paymentDate <= weekEnd;
        })
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

      weeks.push({
        week: `W${12 - i}`,
        total: weekTotal,
      });
    }
    return weeks;
  }, [payments]);

  const LineChart: React.FC = () => {
    const width = 800;
    const height = 240;
    const padding = { top: 20, right: 40, bottom: 40, left: 60 };
    const values = last30Days.map((d) => d.total);
    const max = Math.max(1, ...values);

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = values.map((v, i) => {
      const x = padding.left + (i * chartWidth) / (values.length - 1);
      const y = padding.top + chartHeight - (v / max) * chartHeight;
      return { x, y, value: v };
    });

    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
      .join(" ");

    const areaData = `${pathData} L ${points[points.length - 1].x},${
      height - padding.bottom
    } L ${padding.left},${height - padding.bottom} Z`;

    const yTicks = 5;
    const yStep = max / yTicks;

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="mt-4">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = padding.top + (chartHeight * i) / yTicks;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500 font-medium"
              >
                KSh {((max - yStep * i) / 1000).toFixed(1)}k
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {points
          .filter((_, i) => i % 5 === 0)
          .map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="text-xs fill-gray-500 font-medium"
            >
              {last30Days[i * 5].date.slice(5)}
            </text>
          ))}

        {/* Area under curve */}
        <path d={areaData} fill="url(#areaGradient)" />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#fff"
              stroke="#f97316"
              strokeWidth="2.5"
              filter="url(#shadow)"
              className="transition-all duration-200 hover:r-6"
            />
          </g>
        ))}
      </svg>
    );
  };

  const BarChart: React.FC = () => {
    const width = 800;
    const height = 240;
    const padding = { top: 20, right: 40, bottom: 40, left: 60 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const max = Math.max(1, ...weeklyData.map((d) => d.total));
    const barWidth = chartWidth / weeklyData.length - 8;

    const yTicks = 5;
    const yStep = max / yTicks;

    return (
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="mt-4">
        <defs>
          <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065f46" />
          </linearGradient>
          <filter id="barShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = padding.top + (chartHeight * i) / yTicks;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500 font-medium"
              >
                KSh {((max - yStep * i) / 1000).toFixed(1)}k
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {weeklyData.map((d, i) => {
          const barHeight = (d.total / max) * chartHeight;
          const x = padding.left + (i * chartWidth) / weeklyData.length + 4;
          const y = padding.top + chartHeight - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx="6"
                filter="url(#barShadow)"
                className="transition-all duration-200 hover:opacity-80"
              />
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500 font-medium"
              >
                {d.week}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top Navigation with Quick Actions */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 rounded-2xl shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex items-center justify-center shadow-lg shadow-green-800/30">
                <Building2 size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={(action as any).onClick}
                    className={`${action.color} text-white px-3 py-2 rounded-xl transition-all flex items-center space-x-2 text-sm font-semibold hover:scale-105 active:scale-95`}
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 border border-red-200 bg-gradient-to-r from-red-50 to-red-100/50 text-red-700 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}
        {isLoading && (
          <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            Loading dashboard...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Welcome Message - Enhanced */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md border border-gray-200/80 p-5 h-full flex items-center space-x-3 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <User size={22} className="text-green-800" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h2 className="text-sm font-bold text-gray-900 truncate">
                    Welcome back!
                  </h2>
                  <Sparkles
                    size={14}
                    className="text-amber-500 flex-shrink-0"
                  />
                </div>
                <p className="text-xs text-gray-600 truncate font-medium">
                  {user?.full_name || "Admin"}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards - Enhanced */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md border border-gray-200/80 p-5 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`p-3 rounded-xl shadow-lg ${
                          stat.color === "blue"
                            ? "bg-gradient-to-br from-orange-100 to-orange-50 shadow-orange-500/20"
                            : stat.color === "green"
                              ? "bg-gradient-to-br from-green-100 to-emerald-50 shadow-green-500/20"
                              : stat.color === "orange"
                                ? "bg-gradient-to-br from-orange-100 to-amber-50 shadow-orange-500/20"
                                : "bg-gradient-to-br from-purple-100 to-purple-50 shadow-purple-500/20"
                        } group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon
                          size={20}
                          className={
                            stat.color === "blue"
                              ? "text-orange-600"
                              : stat.color === "green"
                                ? "text-green-800"
                                : stat.color === "orange"
                                  ? "text-orange-600"
                                  : "text-purple-600"
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-black text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts - Enhanced */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md border border-gray-200/80 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                Cumulative Payments
              </h3>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                  <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
                  <span className="text-gray-700 font-semibold">Total</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 font-medium">
              Last 30 days
            </p>
            <LineChart />
          </div>

          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md border border-gray-200/80 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                Weekly Revenue
              </h3>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg">
                  <div className="w-3 h-3 rounded bg-green-800 shadow-sm"></div>
                  <span className="text-gray-700 font-semibold">Weekly</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 font-medium">
              Last 12 weeks
            </p>
            <BarChart />
          </div>
        </div>
      </div>
    </div>
  );
}
