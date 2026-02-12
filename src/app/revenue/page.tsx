"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  formatCurrency,
  REVENUE_SOURCE_LABELS,
  REVENUE_SOURCE_COLORS,
  ANNUAL_REVENUE_TARGET,
} from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import type { RevenueEntry } from "@/types/analytics";

export default function RevenuePage() {
  const [entries, setEntries] = useState<RevenueEntry[]>([]);

  useEffect(() => {
    fetch("/api/data/revenue")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  const totalEarned = entries
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingAmount = entries
    .filter((e) => e.status === "pending" || e.status === "invoiced")
    .reduce((sum, e) => sum + e.amount, 0);

  const bySource = entries.reduce(
    (acc, e) => {
      acc[e.source] = (acc[e.source] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = Object.entries(bySource).map(([source, amount]) => ({
    name: REVENUE_SOURCE_LABELS[source] || source,
    value: amount,
    color: REVENUE_SOURCE_COLORS[source] || "#94a3b8",
  }));

  const byMonth = entries.reduce(
    (acc, e) => {
      const month = new Date(e.date).toLocaleDateString("en-US", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const barData = Object.entries(byMonth).map(([month, amount]) => ({
    month,
    amount,
  }));

  const percentage = Math.min(
    (totalEarned / ANNUAL_REVENUE_TARGET) * 100,
    100
  );
  const monthsElapsed = new Date().getMonth() + 1;
  const projectedAnnual =
    monthsElapsed > 0 ? (totalEarned / monthsElapsed) * 12 : 0;

  const STATUS_COLORS: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    invoiced: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">revenue</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">YTD Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending / Invoiced</p>
            <p className="text-2xl font-bold text-amber-600">
              {formatCurrency(pendingAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Projected Annual</p>
            <p className="text-2xl font-bold">
              {formatCurrency(projectedAnnual)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Goal Progress</p>
            <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
            <Progress value={percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              revenue by month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="amount" fill="#6bd9c5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              revenue by source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">all entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: REVENUE_SOURCE_COLORS[entry.source],
                          color: REVENUE_SOURCE_COLORS[entry.source],
                        }}
                      >
                        {REVENUE_SOURCE_LABELS[entry.source]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {entry.description}
                      {entry.brandName && (
                        <span className="ml-1 text-muted-foreground">
                          ({entry.brandName})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${STATUS_COLORS[entry.status]}`}
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
