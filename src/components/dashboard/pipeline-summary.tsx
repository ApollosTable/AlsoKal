import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEAL_STAGE_LABELS, DEAL_STAGE_COLORS, formatCurrency } from "@/lib/constants";
import type { Partnership } from "@/types/analytics";

interface PipelineSummaryProps {
  partnerships: Partnership[];
}

export function PipelineSummary({ partnerships }: PipelineSummaryProps) {
  const stageCounts = partnerships.reduce(
    (acc, p) => {
      acc[p.stage] = (acc[p.stage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const activeStages = ["lead", "pitched", "negotiating", "contracted", "delivering"];
  const activePipeline = partnerships.filter((p) =>
    activeStages.includes(p.stage)
  );
  const pipelineValue = activePipeline.reduce(
    (sum, p) => sum + p.compensation,
    0
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading">deals pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(pipelineValue)}</p>
          <p className="text-sm text-muted-foreground">
            in active pipeline ({activePipeline.length} deals)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeStages.map((stage) => (
            <Badge
              key={stage}
              variant="outline"
              className="text-xs"
              style={{
                borderColor: DEAL_STAGE_COLORS[stage],
                color: DEAL_STAGE_COLORS[stage],
              }}
            >
              {DEAL_STAGE_LABELS[stage]}: {stageCounts[stage] || 0}
            </Badge>
          ))}
        </div>
        {activePipeline.length > 0 && (
          <div className="space-y-2">
            {activePipeline.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                className="flex items-center justify-between rounded-md border p-2 text-sm"
              >
                <div>
                  <p className="font-medium">{deal.brandName}</p>
                  <p className="text-xs text-muted-foreground">
                    {deal.campaignName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(deal.compensation)}</p>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: DEAL_STAGE_COLORS[deal.stage],
                      color: DEAL_STAGE_COLORS[deal.stage],
                    }}
                  >
                    {DEAL_STAGE_LABELS[deal.stage]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
