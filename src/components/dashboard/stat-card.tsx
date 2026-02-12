"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/constants";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: number;
  color: string;
  sparklineData?: { value: number }[];
  prefix?: string;
  suffix?: string;
  formatValue?: boolean;
}

export function StatCard({
  label,
  value,
  delta,
  color,
  sparklineData,
  prefix = "",
  suffix = "",
  formatValue = true,
}: StatCardProps) {
  const displayValue =
    typeof value === "number" && formatValue ? formatNumber(value) : value;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">
              {prefix}
              {displayValue}
              {suffix}
            </p>
            {delta !== undefined && (
              <p
                className={`text-xs font-medium ${
                  delta >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {delta >= 0 ? "+" : ""}
                {formatNumber(delta)} this month
              </p>
            )}
          </div>
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-3 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient
                    id={`gradient-${label}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${label})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
