import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Home,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { getUnitsWithFilters } from "@/app/api/units/api";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorClass?: string;
  
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  colorClass = "text-gray-600",
}) => (
  <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
      <CardTitle className="text-sm font-medium text-black">{title}</CardTitle>
      <div className={`p-1.5 rounded-lg bg-gray-50 ${colorClass}`}>{icon}</div>
    </CardHeader>
    <CardContent className="p-4">
      <div className="text-xl font-bold text-black mb-1">{value}</div>
      {subtitle && <p className="text-xs text-gray-600 mb-1">{subtitle}</p>}
      {trend && (
        <div
          className={`flex items-center text-xs ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <TrendingUp
            className={`w-3 h-3 mr-1 ${!trend.isPositive ? "rotate-180" : ""}`}
          />
          {trend.value}
        </div>
      )}
    </CardContent>
  </Card>
);

interface UnitStatsCardProps {
  refreshTrigger?: number;
  userRole: "admin" | "property_manager";
}

const UnitStatsCard: React.FC<UnitStatsCardProps> = ({
  refreshTrigger,
  userRole,
}) => {
  const [stats, setStats] = useState({
    totalUnits: 0,
    vacantUnits: 0,
    occupiedUnits: 0,
    maintenanceUnits: 0,
    closedUnits: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch all units - the backend will automatically filter based on user role
      const allUnitsResponse = await getUnitsWithFilters({});
      const allUnits = allUnitsResponse.results || [];

      // Calculate stats
      const totalUnits = allUnits.length;
      const vacantUnits = allUnits.filter(
        (unit) => unit.occupied_status === "Vacant",
      ).length;
      const occupiedUnits = allUnits.filter(
        (unit) => unit.occupied_status === "Occupied",
      ).length;
      const maintenanceUnits = allUnits.filter(
        (unit) => unit.occupied_status === "Maintenance",
      ).length;
      const closedUnits = allUnits.filter(
        (unit) => unit.occupied_status === "Closed",
      ).length;

      // Calculate total revenue from occupied units
      const totalRevenue = allUnits
        .filter((unit) => unit.occupied_status === "Occupied")
        .reduce((sum, unit) => sum + parseFloat(unit.monthly_rent), 0);

      // Calculate occupancy rate
      const occupancyRate =
        totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      setStats({
        totalUnits,
        vacantUnits,
        occupiedUnits,
        maintenanceUnits,
        closedUnits,
        totalRevenue,
        occupancyRate,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch unit statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard
        title={userRole === "admin" ? "Total Units" : "My Total Units"}
        value={stats.totalUnits}
        subtitle={
          userRole === "admin"
            ? "All registered units"
            : "Units in your properties"
        }
        icon={<Building2 className="w-4 h-4" />}
        colorClass="text-blue-600 bg-blue-50"
      />

      <StatsCard
        title="Vacant Units"
        value={stats.vacantUnits}
        subtitle="Ready for occupancy"
        icon={<Home className="w-4 h-4" />}
        colorClass="text-green-600 bg-green-50"
        trend={{
          value: `${((stats.vacantUnits / stats.totalUnits) * 100).toFixed(
            1,
          )}% of total`,
          isPositive: stats.vacantUnits > 0,
        }}
      />

      <StatsCard
        title="Occupied Units"
        value={stats.occupiedUnits}
        subtitle="Currently rented"
        icon={<Users className="w-4 h-4" />}
        colorClass="text-orange-600 bg-orange-50"
        trend={{
          value: `${stats.occupancyRate.toFixed(1)}% occupancy rate`,
          isPositive: stats.occupancyRate >= 80,
        }}
      />

      <StatsCard
        title="Monthly Revenue"
        value={formatCurrency(stats.totalRevenue)}
        subtitle="From occupied units"
        icon={<DollarSign className="w-4 h-4" />}
        colorClass="text-green-600 bg-green-50"
      />

      {(stats.maintenanceUnits > 0 || stats.closedUnits > 0) && (
        <>
          {stats.maintenanceUnits > 0 && (
            <StatsCard
              title="Maintenance Units"
              value={stats.maintenanceUnits}
              subtitle="Under maintenance"
              icon={<AlertTriangle className="w-4 h-4" />}
              colorClass="text-yellow-600 bg-yellow-50"
            />
          )}
          {stats.closedUnits > 0 && (
            <StatsCard
              title="Closed Units"
              value={stats.closedUnits}
              subtitle="Temporarily closed"
              icon={<AlertTriangle className="w-4 h-4" />}
              colorClass="text-red-600 bg-red-50"
            />
          )}
        </>
      )}
    </div>
  );
};

export default UnitStatsCard;
