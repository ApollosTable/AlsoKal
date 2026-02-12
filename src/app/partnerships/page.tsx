"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  DEAL_STAGE_LABELS,
  DEAL_STAGE_COLORS,
  PLATFORM_CONFIG,
} from "@/lib/constants";
import type { Partnership, DealStage } from "@/types/analytics";

const PIPELINE_STAGES: DealStage[] = [
  "lead",
  "pitched",
  "negotiating",
  "contracted",
  "delivering",
  "completed",
];

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);

  useEffect(() => {
    fetch("/api/data/partnerships")
      .then((r) => r.json())
      .then(setPartnerships)
      .catch(() => {});
  }, []);

  const activeStages: DealStage[] = [
    "lead",
    "pitched",
    "negotiating",
    "contracted",
    "delivering",
  ];
  const active = partnerships.filter((p) =>
    activeStages.includes(p.stage)
  );
  const completed = partnerships.filter((p) => p.stage === "completed");
  const totalEarned = completed.reduce((sum, p) => sum + p.compensation, 0);
  const avgDeal =
    completed.length > 0 ? totalEarned / completed.length : 0;
  const pipelineValue = active.reduce((sum, p) => sum + p.compensation, 0);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">partnerships</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Pipeline</p>
            <p className="text-2xl font-bold">
              {formatCurrency(pipelineValue)}
            </p>
            <p className="text-xs text-muted-foreground">
              {active.length} active deals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed Deals</p>
            <p className="text-2xl font-bold">{completed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold">{formatCurrency(totalEarned)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Deal Value</p>
            <p className="text-2xl font-bold">{formatCurrency(avgDeal)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
            {PIPELINE_STAGES.filter((s) => s !== "completed").map((stage) => {
              const deals = partnerships.filter((p) => p.stage === stage);
              return (
                <div key={stage} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: DEAL_STAGE_COLORS[stage] }}
                    />
                    <h3 className="text-sm font-bold uppercase tracking-wide">
                      {DEAL_STAGE_LABELS[stage]}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      ({deals.length})
                    </span>
                  </div>
                  {deals.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                      No deals
                    </div>
                  ) : (
                    deals.map((deal) => (
                      <Card key={deal.id}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm">
                              {deal.brandName}
                            </p>
                            <p className="text-sm font-bold">
                              {formatCurrency(deal.compensation)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {deal.campaignName}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {deal.platforms.map((p) => (
                              <Badge
                                key={p}
                                variant="outline"
                                className="text-xs"
                                style={{
                                  borderColor:
                                    PLATFORM_CONFIG[
                                      p as keyof typeof PLATFORM_CONFIG
                                    ]?.color,
                                  color:
                                    PLATFORM_CONFIG[
                                      p as keyof typeof PLATFORM_CONFIG
                                    ]?.color,
                                }}
                              >
                                {PLATFORM_CONFIG[
                                  p as keyof typeof PLATFORM_CONFIG
                                ]?.name || p}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>
                              {deal.deliverables.length} deliverable
                              {deal.deliverables.length !== 1 ? "s" : ""}
                            </p>
                            <p>
                              Last activity:{" "}
                              {new Date(deal.lastActivity).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-3">
            {completed.map((deal) => (
              <Card key={deal.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{deal.brandName}</p>
                    <p className="text-sm text-muted-foreground">
                      {deal.campaignName}
                    </p>
                    <div className="mt-1 flex gap-1">
                      {deal.platforms.map((p) => (
                        <Badge
                          key={p}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor:
                              PLATFORM_CONFIG[
                                p as keyof typeof PLATFORM_CONFIG
                              ]?.color,
                            color:
                              PLATFORM_CONFIG[
                                p as keyof typeof PLATFORM_CONFIG
                              ]?.color,
                          }}
                        >
                          {PLATFORM_CONFIG[
                            p as keyof typeof PLATFORM_CONFIG
                          ]?.name || p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {formatCurrency(deal.compensation)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deal.startDate} — {deal.endDate || "ongoing"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
