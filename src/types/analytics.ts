export type Platform =
  | "tiktok"
  | "instagram"
  | "youtube-shorts"
  | "youtube-long"
  | "facebook"
  | "snapchat"
  | "patreon";

export interface PlatformMetrics {
  platform: Platform;
  displayName: string;
  handle: string;
  url: string;
  snapshotDate: string;
  followers: number;
  followersDelta: number;
  totalViews: number;
  engagementRate: number;
  postsCount: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  history: GrowthSnapshot[];
}

export interface GrowthSnapshot {
  date: string;
  followers: number;
  views: number;
}

export type RevenueSource =
  | "brand-deal"
  | "patreon"
  | "adsense"
  | "merch"
  | "cameo"
  | "affiliate"
  | "other";

export type RevenueStatus = "pending" | "invoiced" | "paid";

export interface RevenueEntry {
  id: string;
  date: string;
  source: RevenueSource;
  platform?: string;
  brandName?: string;
  amount: number;
  description: string;
  status: RevenueStatus;
}

export type DealStage =
  | "lead"
  | "pitched"
  | "negotiating"
  | "contracted"
  | "delivering"
  | "completed"
  | "declined";

export interface Partnership {
  id: string;
  brandName: string;
  brandLogo?: string;
  contactName: string;
  contactEmail: string;
  platforms: Platform[];
  campaignName: string;
  startDate: string;
  endDate?: string;
  deliverables: string[];
  compensation: number;
  stage: DealStage;
  lastActivity: string;
  notes: string;
}

export type ContentStatus =
  | "idea"
  | "scripting"
  | "filming"
  | "editing"
  | "scheduled"
  | "published";

export interface CalendarItem {
  id: string;
  title: string;
  platforms: Platform[];
  scheduledDate: string;
  status: ContentStatus;
  description?: string;
  partnershipId?: string;
  publishedUrl?: string;
  isSponsored: boolean;
}

export interface GoalsConfig {
  annualRevenueTarget: number;
  quarterlyTargets: { q1: number; q2: number; q3: number; q4: number };
  platformTargets: { platform: Platform; targetFollowers: number; targetDate: string }[];
  milestones: Milestone[];
  rateCard: RateCardItem[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface RateCardItem {
  contentType: string;
  platform: Platform;
  rate: number;
  notes?: string;
}

export interface MediaKitConfig {
  creatorName: string;
  tagline: string;
  bio: string;
  heroImage: string;
  profileImage: string;
  socialLinks: Record<string, string>;
  highlightMetrics: { label: string; value: string }[];
  demographics: {
    ageRanges: { range: string; percentage: number }[];
    genderSplit: { gender: string; percentage: number }[];
    topLocations: { location: string; percentage: number }[];
  };
  packages: { name: string; description: string; startingAt: string }[];
  pastPartners: { name: string; logo?: string; result?: string }[];
}

export interface Inquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  company: string;
  budgetRange: string;
  campaignType: string;
  platforms: string[];
  timeline: string;
  message: string;
  status: "new" | "reviewed" | "responded" | "archived";
}
