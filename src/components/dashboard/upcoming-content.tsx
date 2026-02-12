import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_CONFIG } from "@/lib/constants";
import type { CalendarItem } from "@/types/analytics";

interface UpcomingContentProps {
  items: CalendarItem[];
}

const STATUS_COLORS: Record<string, string> = {
  idea: "bg-gray-100 text-gray-700",
  scripting: "bg-blue-100 text-blue-700",
  filming: "bg-purple-100 text-purple-700",
  editing: "bg-amber-100 text-amber-700",
  scheduled: "bg-emerald-100 text-emerald-700",
  published: "bg-green-100 text-green-700",
};

export function UpcomingContent({ items }: UpcomingContentProps) {
  const upcoming = items
    .filter((item) => item.status !== "published")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading">upcoming content</CardTitle>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming content scheduled
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-md border p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {item.title}
                    </p>
                    {item.isSponsored && (
                      <Badge variant="outline" className="shrink-0 text-xs text-amber-600 border-amber-300">
                        Sponsored
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {item.platforms.map((p) => (
                      <span
                        key={p}
                        className="text-xs"
                        style={{
                          color:
                            PLATFORM_CONFIG[
                              p as keyof typeof PLATFORM_CONFIG
                            ]?.color,
                        }}
                      >
                        {PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG]
                          ?.name || p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.scheduledDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`mt-1 text-xs ${STATUS_COLORS[item.status] || ""}`}
                  >
                    {item.status}
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
