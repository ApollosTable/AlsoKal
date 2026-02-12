import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Partnership, CalendarItem, Inquiry } from "@/types/analytics";

interface ActionItemsProps {
  partnerships: Partnership[];
  calendar: CalendarItem[];
  inquiries: Inquiry[];
}

interface ActionItem {
  type: "deal" | "content" | "inquiry";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export function ActionItems({
  partnerships,
  calendar,
  inquiries,
}: ActionItemsProps) {
  const actions: ActionItem[] = [];

  // Unanswered inquiries
  const newInquiries = inquiries.filter((i) => i.status === "new");
  if (newInquiries.length > 0) {
    actions.push({
      type: "inquiry",
      priority: "high",
      title: `${newInquiries.length} new brand inquir${newInquiries.length === 1 ? "y" : "ies"}`,
      description: newInquiries.map((i) => i.company).join(", "),
    });
  }

  // Deals needing follow-up (no activity in 7+ days)
  const now = Date.now();
  const staleDeals = partnerships.filter((p) => {
    const activeStages = ["pitched", "negotiating", "contracted", "delivering"];
    if (!activeStages.includes(p.stage)) return false;
    const daysSince = (now - new Date(p.lastActivity).getTime()) / 86400000;
    return daysSince > 7;
  });
  staleDeals.forEach((deal) => {
    actions.push({
      type: "deal",
      priority: "medium",
      title: `Follow up: ${deal.brandName}`,
      description: `${deal.campaignName} — no activity in ${Math.floor((now - new Date(deal.lastActivity).getTime()) / 86400000)} days`,
    });
  });

  // Content due soon (within 3 days, not published)
  const soonContent = calendar.filter((item) => {
    if (item.status === "published") return false;
    const daysUntil =
      (new Date(item.scheduledDate).getTime() - now) / 86400000;
    return daysUntil >= 0 && daysUntil <= 3;
  });
  soonContent.forEach((item) => {
    actions.push({
      type: "content",
      priority: item.status === "idea" || item.status === "scripting" ? "high" : "medium",
      title: `Content due: ${item.title}`,
      description: `Status: ${item.status} — due ${new Date(item.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    });
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading">action items</CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-sm text-emerald-600">All caught up!</p>
        ) : (
          <div className="space-y-2">
            {actions.slice(0, 5).map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md border p-2.5"
              >
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs ${PRIORITY_STYLES[action.priority]}`}
                >
                  {action.priority}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
