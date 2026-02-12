import fs from "fs";
import path from "path";
import type {
  Platform,
  PlatformMetrics,
  RevenueEntry,
  Partnership,
  CalendarItem,
  GoalsConfig,
  MediaKitConfig,
  Inquiry,
} from "@/types/analytics";

const DATA_DIR = path.join(process.cwd(), "data");

function readJsonFile<T>(filePath: string): T | null {
  try {
    const fullPath = path.join(DATA_DIR, filePath);
    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readJsonDir<T>(dirPath: string): T[] {
  try {
    const fullPath = path.join(DATA_DIR, dirPath);
    const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".json"));
    return files.map((file) => {
      const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
      return JSON.parse(raw) as T;
    });
  } catch {
    return [];
  }
}

export function loadPlatformMetrics(
  platform: Platform
): PlatformMetrics | null {
  return readJsonFile<PlatformMetrics>(`platforms/${platform}.json`);
}

export function loadAllPlatforms(): PlatformMetrics[] {
  return readJsonDir<PlatformMetrics>("platforms");
}

export function loadRevenue(): RevenueEntry[] {
  return readJsonFile<RevenueEntry[]>("revenue/entries.json") ?? [];
}

export function loadPartnerships(): Partnership[] {
  return readJsonFile<Partnership[]>("partnerships/entries.json") ?? [];
}

export function loadCalendar(): CalendarItem[] {
  return readJsonFile<CalendarItem[]>("calendar/entries.json") ?? [];
}

export function loadGoals(): GoalsConfig {
  return readJsonFile<GoalsConfig>("goals/config.json") ?? {
    annualRevenueTarget: 100000,
    quarterlyTargets: { q1: 15000, q2: 25000, q3: 30000, q4: 30000 },
    platformTargets: [],
    milestones: [],
    rateCard: [],
  };
}

export function loadMediaKit(): MediaKitConfig {
  return readJsonFile<MediaKitConfig>("media-kit/config.json") ?? {
    creatorName: "AlsoKal",
    tagline: "Skoolie life, family travel, outdoor adventure",
    bio: "",
    heroImage: "",
    profileImage: "",
    socialLinks: {},
    highlightMetrics: [],
    demographics: { ageRanges: [], genderSplit: [], topLocations: [] },
    packages: [],
    pastPartners: [],
  };
}

export function loadInquiries(): Inquiry[] {
  return readJsonFile<Inquiry[]>("inquiries/entries.json") ?? [];
}
