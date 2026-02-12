import { loadAllPlatforms, loadRevenue, loadPartnerships, loadCalendar, loadInquiries, loadGoals } from "@/lib/data/loader";
import { PLATFORM_CONFIG, formatCurrency, ANNUAL_REVENUE_TARGET } from "@/lib/constants";
import { RevenueGoal } from "@/components/dashboard/revenue-goal";
import { StatCard } from "@/components/dashboard/stat-card";
import { PipelineSummary } from "@/components/dashboard/pipeline-summary";
import { UpcomingContent } from "@/components/dashboard/upcoming-content";
import { ActionItems } from "@/components/dashboard/action-items";

export default function DashboardPage() {
  const platforms = loadAllPlatforms();
  const revenue = loadRevenue();
  const partnerships = loadPartnerships();
  const calendar = loadCalendar();
  const inquiries = loadInquiries();
  const goals = loadGoals();

  const totalEarned = revenue
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);

  // Monthly revenue
  const currentMonth = new Date().getMonth();
  const monthlyRevenue = revenue
    .filter((e) => new Date(e.date).getMonth() === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl">dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s how the business is doing.
        </p>
      </div>

      {/* Revenue Goal */}
      <RevenueGoal earned={totalEarned} target={goals.annualRevenueTarget} />

      {/* Platform Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {platforms.map((p) => {
          const config = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
          if (!config) return null;
          return (
            <StatCard
              key={p.platform}
              label={config.name}
              value={p.followers}
              delta={p.followersDelta}
              color={config.color}
              sparklineData={p.history.map((h) => ({ value: h.followers }))}
            />
          );
        })}
      </div>

      {/* Monthly Revenue + Pipeline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="This Month"
            value={formatCurrency(monthlyRevenue)}
            formatValue={false}
            color="#6bd9c5"
          />
          <StatCard
            label="YTD Revenue"
            value={formatCurrency(totalEarned)}
            formatValue={false}
            color="#7C9A82"
          />
        </div>
        <PipelineSummary partnerships={partnerships} />
      </div>

      {/* Content + Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingContent items={calendar} />
        <ActionItems
          partnerships={partnerships}
          calendar={calendar}
          inquiries={inquiries}
        />
      </div>
    </div>
  );
}
