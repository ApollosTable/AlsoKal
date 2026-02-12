"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLATFORM_CONFIG } from "@/lib/constants";
import type { CalendarItem } from "@/types/analytics";

const STATUS_COLORS: Record<string, string> = {
  idea: "bg-gray-100 text-gray-700",
  scripting: "bg-blue-100 text-blue-700",
  filming: "bg-purple-100 text-purple-700",
  editing: "bg-amber-100 text-amber-700",
  scheduled: "bg-emerald-100 text-emerald-700",
  published: "bg-green-100 text-green-700",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/data/calendar")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getItemsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return items.filter((item) => item.scheduledDate === dateStr);
  };

  const sponsored = items.filter((i) => i.isSponsored).length;
  const organic = items.filter((i) => !i.isSponsored).length;
  const mixRatio = items.length > 0 ? ((sponsored / items.length) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">content calendar</h1>

      {/* Content Mix */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Content</p>
            <p className="text-2xl font-bold">{items.length} pieces</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sponsored Mix</p>
            <p className="text-2xl font-bold">{mixRatio}%</p>
            <p className="text-xs text-muted-foreground">
              {sponsored} sponsored / {organic} organic
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(
                items.reduce(
                  (acc, i) => {
                    acc[i.status] = (acc[i.status] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                )
              ).map(([status, count]) => (
                <Badge
                  key={status}
                  className={`text-xs ${STATUS_COLORS[status]}`}
                >
                  {status}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentDate(new Date(year, month - 1, 1))
              }
              className="rounded px-3 py-1 text-sm hover:bg-muted"
            >
              &larr;
            </button>
            <CardTitle className="font-heading text-xl">{monthName}</CardTitle>
            <button
              onClick={() =>
                setCurrentDate(new Date(year, month + 1, 1))
              }
              className="rounded px-3 py-1 text-sm hover:bg-muted"
            >
              &rarr;
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px">
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-bold text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const dayItems = day ? getItemsForDay(day) : [];
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();
              return (
                <div
                  key={i}
                  className={`min-h-[80px] rounded border p-1.5 ${
                    day ? "bg-white" : "bg-muted/30"
                  } ${isToday ? "border-[#6bd9c5] border-2" : "border-muted"}`}
                >
                  {day && (
                    <>
                      <p
                        className={`text-xs font-medium ${isToday ? "text-[#6bd9c5]" : "text-muted-foreground"}`}
                      >
                        {day}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        {dayItems.map((item) => (
                          <div
                            key={item.id}
                            className={`cursor-pointer truncate rounded px-1 py-0.5 text-xs ${
                              item.isSponsored
                                ? "bg-amber-100 text-amber-800"
                                : "bg-[#cdecdd] text-[#1A2E1A]"
                            }`}
                            title={`${item.title} — ${item.platforms.map((p) => PLATFORM_CONFIG[p as keyof typeof PLATFORM_CONFIG]?.name || p).join(", ")}`}
                          >
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">all content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items
              .sort(
                (a, b) =>
                  new Date(a.scheduledDate).getTime() -
                  new Date(b.scheduledDate).getTime()
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {item.title}
                      </p>
                      {item.isSponsored && (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-xs text-amber-600 border-amber-300"
                        >
                          Sponsored
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex gap-2">
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
                      {new Date(item.scheduledDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}
                    </p>
                    <Badge
                      className={`mt-1 text-xs ${STATUS_COLORS[item.status]}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
