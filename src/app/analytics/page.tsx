"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PLATFORM_CONFIG, formatNumber } from "@/lib/constants";
import type { PlatformMetrics } from "@/types/analytics";

export default function AnalyticsPage() {
  const [platforms, setPlatforms] = useState<PlatformMetrics[]>([]);

  useEffect(() => {
    fetch("/api/data/platforms")
      .then((r) => r.json())
      .then(setPlatforms)
      .catch(() => {});
  }, []);

  // Build growth comparison data
  const allDates = new Set<string>();
  platforms.forEach((p) => p.history.forEach((h) => allDates.add(h.date)));
  const sortedDates = Array.from(allDates).sort();

  const growthData = sortedDates.map((date) => {
    const point: Record<string, string | number> = { date: new Date(date).toLocaleDateString("en-US", { month: "short" }) };
    platforms.forEach((p) => {
      const snapshot = p.history.find((h) => h.date === date);
      if (snapshot) {
        point[p.platform] = snapshot.followers;
      }
    });
    return point;
  });

  const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0);
  const avgEngagement =
    platforms.length > 0
      ? platforms.reduce((sum, p) => sum + p.engagementRate, 0) /
        platforms.length
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">analytics</h1>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Followers"
          value={totalFollowers}
          color="#6bd9c5"
        />
        <StatCard
          label="Avg Engagement Rate"
          value={`${avgEngagement.toFixed(1)}%`}
          formatValue={false}
          color="#7C9A82"
        />
        <StatCard
          label="Platforms Tracked"
          value={platforms.length}
          formatValue={false}
          color="#5BA55B"
        />
      </div>

      {/* Growth Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            follower growth — all platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => formatNumber(v)}
                />
                <Tooltip
                  formatter={(value) => formatNumber(Number(value))}
                />
                <Legend />
                {platforms.map((p) => (
                  <Line
                    key={p.platform}
                    type="monotone"
                    dataKey={p.platform}
                    name={
                      PLATFORM_CONFIG[
                        p.platform as keyof typeof PLATFORM_CONFIG
                      ]?.name || p.platform
                    }
                    stroke={
                      PLATFORM_CONFIG[
                        p.platform as keyof typeof PLATFORM_CONFIG
                      ]?.color || "#94a3b8"
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => {
          const config =
            PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
          return (
            <Card key={p.platform}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config?.color }}
                  />
                  <h3 className="font-bold">{config?.name || p.platform}</h3>
                  <span className="text-xs text-muted-foreground">
                    {p.handle}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-bold">{formatNumber(p.followers)}</p>
                    <p
                      className={`text-xs ${p.followersDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {p.followersDelta >= 0 ? "+" : ""}
                      {formatNumber(p.followersDelta)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-bold">{p.engagementRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Views/Post</p>
                    <p className="font-bold">
                      {formatNumber(p.avgViewsPerPost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Posts</p>
                    <p className="font-bold">{p.postsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
