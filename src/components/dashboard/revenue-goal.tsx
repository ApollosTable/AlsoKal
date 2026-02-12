"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/constants";

interface RevenueGoalProps {
  earned: number;
  target: number;
}

export function RevenueGoal({ earned, target }: RevenueGoalProps) {
  const percentage = Math.min((earned / target) * 100, 100);
  const monthsElapsed = new Date().getMonth() + 1;
  const expectedPace = (target / 12) * monthsElapsed;
  const paceStatus = earned >= expectedPace ? "on-track" : "behind";
  const paceDelta = Math.abs(earned - expectedPace);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading">
          revenue goal — {new Date().getFullYear()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(earned)}</p>
            <p className="text-sm text-muted-foreground">
              of {formatCurrency(target)} goal
            </p>
          </div>
          <p className="text-2xl font-bold text-muted-foreground/50">
            {percentage.toFixed(1)}%
          </p>
        </div>
        <Progress value={percentage} className="h-3" />
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              paceStatus === "on-track" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <p className="text-sm">
            {paceStatus === "on-track" ? (
              <span className="text-emerald-600">
                On track — {formatCurrency(paceDelta)} ahead of pace
              </span>
            ) : (
              <span className="text-amber-600">
                Behind pace by {formatCurrency(paceDelta)} — time to push brand
                deals
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
