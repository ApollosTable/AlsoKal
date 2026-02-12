import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC3Qjm7mwZDQ5jIsxo3tU1MQ";

interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnail: string;
  isShort: boolean;
}

function isYouTubeShort(duration: string): boolean {
  const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return false;
  const minutes = parseInt(match[1] || "0");
  const seconds = parseInt(match[2] || "0");
  return minutes * 60 + seconds <= 60;
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 });
  }

  try {
    // Get channel stats
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const stats = channel.statistics;

    // Get recent videos (up to 50)
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&maxResults=50&type=video&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const searchData = await searchRes.json();
    const videoIds = searchData.items?.map((item: { id: { videoId: string } }) => item.id.videoId).join(",");

    // Get video details
    let videos: YouTubeVideo[] = [];
    if (videoIds) {
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`,
        { next: { revalidate: 3600 } }
      );
      const videosData = await videosRes.json();
      videos = videosData.items?.map((v: {
        id: string;
        snippet: { title: string; publishedAt: string; thumbnails: { medium?: { url: string }; default?: { url: string } } };
        contentDetails: { duration: string };
        statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
      }) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        duration: v.contentDetails.duration,
        viewCount: parseInt(v.statistics.viewCount || "0"),
        likeCount: parseInt(v.statistics.likeCount || "0"),
        commentCount: parseInt(v.statistics.commentCount || "0"),
        thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || "",
        isShort: isYouTubeShort(v.contentDetails.duration),
      })) || [];
    }

    // Get top videos by view count
    const topSearchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=viewCount&maxResults=10&type=video&key=${API_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const topSearchData = await topSearchRes.json();
    const topVideoIds = topSearchData.items?.map((item: { id: { videoId: string } }) => item.id.videoId).join(",");

    let topVideos: YouTubeVideo[] = [];
    if (topVideoIds) {
      const topVideosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${topVideoIds}&key=${API_KEY}`,
        { next: { revalidate: 3600 } }
      );
      const topVideosData = await topVideosRes.json();
      topVideos = topVideosData.items?.map((v: {
        id: string;
        snippet: { title: string; publishedAt: string; thumbnails: { medium?: { url: string }; default?: { url: string } } };
        contentDetails: { duration: string };
        statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
      }) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        duration: v.contentDetails.duration,
        viewCount: parseInt(v.statistics.viewCount || "0"),
        likeCount: parseInt(v.statistics.likeCount || "0"),
        commentCount: parseInt(v.statistics.commentCount || "0"),
        thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || "",
        isShort: isYouTubeShort(v.contentDetails.duration),
      })) || [];
    }

    // Split recent videos into shorts and long-form
    const shorts = videos.filter((v) => v.isShort);
    const longForm = videos.filter((v) => !v.isShort);

    // Calculate engagement metrics
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
    const avgViewsPerVideo = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;
    const engagementRate = totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0";

    const shortsViews = shorts.reduce((sum, v) => sum + v.viewCount, 0);
    const shortsLikes = shorts.reduce((sum, v) => sum + v.likeCount, 0);
    const shortsEngagement = shortsViews > 0 ? ((shortsLikes / shortsViews) * 100).toFixed(1) : "0";

    const longViews = longForm.reduce((sum, v) => sum + v.viewCount, 0);
    const longLikes = longForm.reduce((sum, v) => sum + v.likeCount, 0);
    const longEngagement = longViews > 0 ? ((longLikes / longViews) * 100).toFixed(1) : "0";

    return NextResponse.json({
      channel: {
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails?.high?.url,
        subscriberCount: parseInt(stats.subscriberCount),
        totalViewCount: parseInt(stats.viewCount),
        videoCount: parseInt(stats.videoCount),
      },
      metrics: {
        recentVideoCount: videos.length,
        totalRecentViews: totalViews,
        avgViewsPerVideo,
        engagementRate: parseFloat(engagementRate),
        shortsCount: shorts.length,
        longFormCount: longForm.length,
        shortsEngagement: parseFloat(shortsEngagement),
        longFormEngagement: parseFloat(longEngagement),
      },
      recentVideos: videos.slice(0, 20),
      topVideos,
      shorts: {
        count: shorts.length,
        totalViews: shortsViews,
        avgViews: shorts.length > 0 ? Math.round(shortsViews / shorts.length) : 0,
      },
      longForm: {
        count: longForm.length,
        totalViews: longViews,
        avgViews: longForm.length > 0 ? Math.round(longViews / longForm.length) : 0,
      },
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Failed to fetch YouTube data" }, { status: 500 });
  }
}
