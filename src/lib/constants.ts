import type { Platform } from "@/types/analytics";

export const PLATFORM_CONFIG: Record<
  Platform,
  { name: string; color: string; icon: string }
> = {
  tiktok: { name: "TikTok", color: "#69C9D0", icon: "tiktok" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "instagram" },
  "youtube-shorts": { name: "YT Shorts", color: "#FF4444", icon: "youtube" },
  "youtube-long": { name: "YouTube", color: "#FF0000", icon: "youtube" },
  facebook: { name: "Facebook", color: "#1877F2", icon: "facebook" },
  snapchat: { name: "Snapchat", color: "#FFFC00", icon: "snapchat" },
  patreon: { name: "Patreon", color: "#FF424D", icon: "patreon" },
};

export const REVENUE_SOURCE_LABELS: Record<string, string> = {
  "brand-deal": "Brand Deals",
  patreon: "Patreon",
  adsense: "AdSense",
  merch: "Merch",
  cameo: "Cameo",
  affiliate: "Affiliate",
  other: "Other",
};

export const REVENUE_SOURCE_COLORS: Record<string, string> = {
  "brand-deal": "#6bd9c5",
  patreon: "#FF424D",
  adsense: "#34a853",
  merch: "#f59e0b",
  cameo: "#8b5cf6",
  affiliate: "#06b6d4",
  other: "#94a3b8",
};

export const DEAL_STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  pitched: "Pitched",
  negotiating: "Negotiating",
  contracted: "Contracted",
  delivering: "Delivering",
  completed: "Completed",
  declined: "Declined",
};

export const DEAL_STAGE_COLORS: Record<string, string> = {
  lead: "#94a3b8",
  pitched: "#3b82f6",
  negotiating: "#f59e0b",
  contracted: "#8b5cf6",
  delivering: "#6bd9c5",
  completed: "#22c55e",
  declined: "#ef4444",
};

export const ANNUAL_REVENUE_TARGET = 100000;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
