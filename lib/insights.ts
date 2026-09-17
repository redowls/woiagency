import raw from "@/data/insights.json";

/**
 * Instagram numbers for the account, written by scripts/sync_insights.py.
 * Everything on the site that shows a view count reads from here, so the
 * figures move together and nothing is hand-typed.
 */

export type MediaKind = "REEL" | "IMAGE" | "CAROUSEL";

export type InsightMedia = {
  id: string;
  shortcode: string;
  permalink: string;
  type: MediaKind;
  timestamp: string;
  caption: string;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
};

export type DailyPoint = { date: string; followerDelta?: number; reach?: number };

export type Insights = {
  generatedAt: string;
  account: { username: string; followers: number; following: number; posts: number };
  media: InsightMedia[];
  daily: DailyPoint[];
};

export type SeriesPoint = { t: number; label: string; value: number };

export const INSIGHTS = raw as unknown as Insights;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-08…" → "8 Sep". Hand-rolled so server and browser agree byte-for-byte. */
export function dayLabel(iso: string, withYear = false): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ""}`;
}

/** Meta stamps offsets as +0000, which Date.parse doesn't take everywhere. */
export function toMs(iso: string): number {
  return Date.parse(iso.replace(/\+0000$/, "Z"));
}

/** 4,217,355 → "4.2M", 14,460 → "14.4K" — truncated, the way Instagram shows it. */
export function formatCompact(n: number): string {
  const one = (x: number) => (Math.floor(x * 10) / 10).toString();
  if (n >= 1e6) return `${one(n / 1e6)}M`;
  if (n >= 1e3) return `${one(n / 1e3)}K`;
  return formatFull(n);
}

export function formatFull(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function kindLabel(k: MediaKind): string {
  return k === "REEL" ? "Reel" : k === "CAROUSEL" ? "Carousel" : "Photo";
}

/** Live view count for a portfolio item, matched by the reel's shortcode. */
export function liveViews(link?: string): string | undefined {
  if (!link) return undefined;
  const code = link.split("/").filter(Boolean).pop();
  const hit = INSIGHTS.media.find((m) => m.shortcode === code);
  return hit && hit.views > 0 ? formatCompact(hit.views) : undefined;
}

const last30 = (rows: DailyPoint[]) => rows.slice(-30);

export const TOTALS = (() => {
  const m = INSIGHTS.media;
  const sum = (pick: (x: InsightMedia) => number) => m.reduce((a, x) => a + pick(x), 0);
  const daily = INSIGHTS.daily;
  return {
    views: sum((x) => x.views),
    interactions: sum((x) => x.likes + x.comments + x.saves + x.shares),
    reach30d: last30(daily.filter((d) => d.reach !== undefined)).reduce((a, d) => a + (d.reach ?? 0), 0),
    followerDelta30d: last30(daily.filter((d) => d.followerDelta !== undefined)).reduce(
      (a, d) => a + (d.followerDelta ?? 0),
      0,
    ),
  };
})();

/** Running total of views, attributed to each post's publish date. */
export function cumulativeViews(): SeriesPoint[] {
  const sorted = [...INSIGHTS.media].sort((a, b) => toMs(a.timestamp) - toMs(b.timestamp));
  let acc = 0;
  const pts = sorted.map((m) => {
    acc += m.views;
    return { t: toMs(m.timestamp), label: dayLabel(m.timestamp), value: acc };
  });
  // carry the total forward to the sync date so the line reads "as of today"
  const now = toMs(INSIGHTS.generatedAt);
  if (pts.length && now > pts[pts.length - 1].t) {
    pts.push({ t: now, label: dayLabel(INSIGHTS.generatedAt), value: acc });
  }
  return pts;
}

/** Absolute follower count per day, rebuilt from today's total and the daily deltas. */
export function followerSeries(): SeriesPoint[] {
  const days = last30(INSIGHTS.daily.filter((d) => d.followerDelta !== undefined));
  const out: SeriesPoint[] = [];
  let f = INSIGHTS.account.followers;
  for (let i = days.length - 1; i >= 0; i--) {
    out.unshift({ t: toMs(days[i].date), label: dayLabel(days[i].date), value: f });
    f -= days[i].followerDelta ?? 0;
  }
  return out;
}
