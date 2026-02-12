"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { PLATFORM_CONFIG, formatNumber } from "@/lib/constants";
import type { PlatformMetrics } from "@/types/analytics";

interface YouTubeData {
  channel: {
    title: string;
    subscriberCount: number;
    totalViewCount: number;
    videoCount: number;
    thumbnail: string;
  };
  metrics: {
    recentVideoCount: number;
    totalRecentViews: number;
    avgViewsPerVideo: number;
    engagementRate: number;
    shortsCount: number;
    longFormCount: number;
    shortsEngagement: number;
    longFormEngagement: number;
  };
  recentVideos: {
    id: string;
    title: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnail: string;
    isShort: boolean;
  }[];
  topVideos: {
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnail: string;
    isShort: boolean;
  }[];
  shorts: { count: number; totalViews: number; avgViews: number };
  longForm: { count: number; totalViews: number; avgViews: number };
}

export default function AnalyticsPage() {
  const [platforms, setPlatforms] = useState<PlatformMetrics[]>([]);
  const [youtube, setYoutube] = useState<YouTubeData | null>(null);
  const [ytLoading, setYtLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data/platforms")
      .then((r) => r.json())
      .then(setPlatforms)
      .catch(() => {});

    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setYoutube(data);
      })
      .catch(() => {})
      .finally(() => setYtLoading(false));
  }, []);

  // Build growth comparison data
  const allDates = new Set<string>();
  platforms.forEach((p) => p.history.forEach((h) => allDates.add(h.date)));
  const sortedDates = Array.from(allDates).sort();

  const growthData = sortedDates.map((date) => {
    const point: Record<string, string | number> = {
      date: new Date(date).toLocaleDateString("en-US", { month: "short" }),
    };
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
      ? platforms.reduce((sum, p) => sum + p.engagementRate, 0) / platforms.length
      : 0;

  return (
    <div className="space-y-6 p-6">
      <h1 className="font-heading text-3xl">analytics</h1>

      {/* YouTube Live Data */}
      {youtube && (
        <>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <h2 className="font-heading text-2xl">youtube — live data</h2>
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
              LIVE
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Subscribers"
              value={youtube.channel.subscriberCount}
              color="#FF0000"
            />
            <StatCard
              label="Total Views"
              value={youtube.channel.totalViewCount}
              color="#FF0000"
            />
            <StatCard
              label="Videos"
              value={youtube.channel.videoCount}
              formatValue={false}
              color="#FF4444"
            />
            <StatCard
              label="Engagement Rate"
              value={`${youtube.metrics.engagementRate}%`}
              formatValue={false}
              color="#FF4444"
            />
          </div>

          {/* Shorts vs Long Form Comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg">shorts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Count</p>
                    <p className="text-xl font-bold">{youtube.shorts.count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Views</p>
                    <p className="text-xl font-bold">{formatNumber(youtube.shorts.totalViews)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Views</p>
                    <p className="text-xl font-bold">{formatNumber(youtube.shorts.avgViews)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {youtube.metrics.shortsEngagement}% engagement rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg">long form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Count</p>
                    <p className="text-xl font-bold">{youtube.longForm.count}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Views</p>
                    <p className="text-xl font-bold">{formatNumber(youtube.longForm.totalViews)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Views</p>
                    <p className="text-xl font-bold">{formatNumber(youtube.longForm.avgViews)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {youtube.metrics.longFormEngagement}% engagement rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                top performing videos — all time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {youtube.topVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <a
                          href={`https://youtube.com/watch?v=${video.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 hover:underline"
                        >
                          {video.thumbnail && (
                            <img
                              src={video.thumbnail}
                              alt=""
                              className="h-10 w-16 rounded object-cover"
                            />
                          )}
                          <span className="text-sm line-clamp-2">
                            {video.title}
                          </span>
                        </a>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(video.viewCount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(video.likeCount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(video.commentCount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            video.isShort
                              ? "text-red-500 border-red-300"
                              : "text-blue-500 border-blue-300"
                          }`}
                        >
                          {video.isShort ? "Short" : "Long"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                recent videos — last 20
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={youtube.recentVideos.map((v) => ({
                      title: v.title.substring(0, 25) + (v.title.length > 25 ? "..." : ""),
                      views: v.viewCount,
                      likes: v.likeCount,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="title" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#FF0000" radius={[4, 4, 0, 0]} name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {ytLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading YouTube data...
          </CardContent>
        </Card>
      )}

      {/* Other Platforms (JSON data) */}
      <div className="flex items-center gap-2 pt-4">
        <h2 className="font-heading text-2xl">all platforms</h2>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Manual data
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Followers" value={totalFollowers} color="#6bd9c5" />
        <StatCard
          label="Avg Engagement Rate"
          value={`${avgEngagement.toFixed(1)}%`}
          formatValue={false}
          color="#7C9A82"
        />
        <StatCard label="Platforms Tracked" value={platforms.length} formatValue={false} color="#5BA55B" />
      </div>

      {/* Growth Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">follower growth — all platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Legend />
                {platforms.map((p) => (
                  <Line
                    key={p.platform}
                    type="monotone"
                    dataKey={p.platform}
                    name={PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG]?.name || p.platform}
                    stroke={PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG]?.color || "#94a3b8"}
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
          const config = PLATFORM_CONFIG[p.platform as keyof typeof PLATFORM_CONFIG];
          return (
            <Card key={p.platform}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: config?.color }} />
                  <h3 className="font-bold">{config?.name || p.platform}</h3>
                  <span className="text-xs text-muted-foreground">{p.handle}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-bold">{formatNumber(p.followers)}</p>
                    <p className={`text-xs ${p.followersDelta >= 0 ? "text-emerald-600" : "text-red-500"}`}>
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
                    <p className="font-bold">{formatNumber(p.avgViewsPerPost)}</p>
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
