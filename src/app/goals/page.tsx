"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  formatCurrency,
  formatNumber,
  PLATFORM_CONFIG,
} from "@/lib/constants";
import type { GoalsConfig } from "@/types/analytics";

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalsConfig | null>(null);

  useEffect(() => {
    fetch("/api/data/goals")
      .then((r) => r.json())
      .then(setGoals)
      .catch(() => {});
  }, []);

  if (!goals) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl">goals & strategy</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
  const quarterKeys = ["q1", "q2", "q3", "q4"] as const;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">goals & strategy</h1>

      {/* Annual Target */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            {new Date().getFullYear()} revenue target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold">
            {formatCurrency(goals.annualRevenueTarget)}
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            {quarterKeys.map((q, i) => (
              <div
                key={q}
                className={`rounded-lg border p-3 ${
                  i + 1 === currentQuarter
                    ? "border-[#6bd9c5] bg-[#cdecdd]/20"
                    : ""
                }`}
              >
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Q{i + 1}{" "}
                  {i + 1 === currentQuarter && (
                    <span className="text-[#6bd9c5]">(current)</span>
                  )}
                </p>
                <p className="mt-1 text-lg font-bold">
                  {formatCurrency(goals.quarterlyTargets[q])}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Growth Targets */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            platform growth targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.platformTargets.map((target) => {
              const config =
                PLATFORM_CONFIG[
                  target.platform as keyof typeof PLATFORM_CONFIG
                ];
              return (
                <div key={target.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: config?.color }}
                      />
                      <p className="text-sm font-medium">
                        {config?.name || target.platform}
                      </p>
                    </div>
                    <p className="text-sm">
                      Target: {formatNumber(target.targetFollowers)} by{" "}
                      {new Date(target.targetDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Progress
                    value={30}
                    className="h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goals.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      milestone.completed
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-muted-foreground"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      milestone.completed
                        ? "text-muted-foreground line-through"
                        : "font-medium"
                    }`}
                  >
                    {milestone.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(milestone.targetDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">rate card</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {goals.rateCard.map((item, i) => {
              const config =
                PLATFORM_CONFIG[
                  item.platform as keyof typeof PLATFORM_CONFIG
                ];
              return (
                <div key={i} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.contentType}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: config?.color,
                          color: config?.color,
                        }}
                      >
                        {config?.name || item.platform}
                      </Badge>
                      {item.notes && (
                        <span className="text-xs text-muted-foreground">
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-bold">
                    {formatCurrency(item.rate)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
