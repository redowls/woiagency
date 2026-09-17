"use client";

import { useMemo, useRef, useState } from "react";
import {
  INSIGHTS,
  TOTALS,
  cumulativeViews,
  dayLabel,
  followerSeries,
  formatCompact,
  formatFull,
  kindLabel,
  ranked,
  type SeriesPoint,
} from "@/lib/insights";

const ACCENT = "#3d8bff";
const SURFACE = "#0c1a3a";
const INK = { primary: "#f2f6ff", secondary: "#93a4c8", muted: "#5f6f92" };
const GRID = "rgba(255,255,255,0.08)";

const W = 600;
const H = 220;
const PAD = { top: 18, right: 18, bottom: 26, left: 46 };

/** 1 / 2 / 5 × 10ⁿ — the tick step that gives round axis labels. */
function niceStep(rough: number): number {
  const p = 10 ** Math.floor(Math.log10(rough));
  const r = rough / p;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p;
}

type ChartProps = {
  title: string;
  subtitle: string;
  points: SeriesPoint[];
  area?: boolean;
  /** hold each value until the next point — for totals that jump, not drift */
  step?: boolean;
  unit: string;
};

function TimeSeriesChart({ title, subtitle, points, area, step, unit }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const geo = useMemo(() => {
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const max = Math.max(1, ...points.map((p) => p.value));
    const tick = niceStep(max / 5);
    const top = Math.ceil(max / tick) * tick;
    const iw = W - PAD.left - PAD.right;
    const ih = H - PAD.top - PAD.bottom;
    const base = PAD.top + ih;
    const x = (t: number) => PAD.left + (t1 === t0 ? iw : ((t - t0) / (t1 - t0)) * iw);
    const y = (v: number) => PAD.top + ih - (v / top) * ih;
    const xy = points.map((p) => [x(p.t), y(p.value)] as const);
    const line = xy
      .map(([px, py], i) => {
        const p = `${px.toFixed(1)},${py.toFixed(1)}`;
        if (!i) return `M${p}`;
        return step ? `H${px.toFixed(1)} V${py.toFixed(1)}` : `L${p}`;
      })
      .join(" ");
    const areaPath = `${line} L${xy[xy.length - 1][0].toFixed(1)},${base} L${xy[0][0].toFixed(1)},${base} Z`;
    const ticks: number[] = [];
    for (let v = 0; v <= top; v += tick) ticks.push(v);
    const xLabels = [0, Math.floor((points.length - 1) / 2), points.length - 1].filter(
      (v, i, a) => a.indexOf(v) === i,
    );
    return { xy, line, areaPath, ticks, y, base, xLabels };
  }, [points, step]);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const vx = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    let dist = Infinity;
    geo.xy.forEach(([px], i) => {
      const d = Math.abs(px - vx);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setHover(best);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setHover((h) => Math.min(points.length - 1, (h ?? -1) + 1));
    else if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? points.length) - 1));
    else if (e.key === "Escape") setHover(null);
    else return;
    e.preventDefault();
  };

  const last = points[points.length - 1];
  const [lx, ly] = geo.xy[geo.xy.length - 1];
  const hp = hover !== null ? points[hover] : null;
  const hxy = hover !== null ? geo.xy[hover] : null;

  return (
    <div className="woi-chart-card">
      <h3 className="woi-chart-title">{title}</h3>
      <p className="woi-chart-sub">{subtitle}</p>
      <div style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${title}: ${formatFull(last.value)} ${unit} as of ${last.label}`}
          tabIndex={0}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
          style={{ width: "100%", height: "auto", display: "block", outline: "none" }}
        >
          {geo.ticks.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={geo.y(v)} y2={geo.y(v)} stroke={GRID} strokeWidth={1} />
              <text
                x={PAD.left - 8}
                y={geo.y(v) + 3.5}
                textAnchor="end"
                fontSize={10}
                fill={INK.muted}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatCompact(v)}
              </text>
            </g>
          ))}
          {geo.xLabels.map((i) => (
            <text
              key={i}
              x={geo.xy[i][0]}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
              fontSize={10}
              fill={INK.muted}
            >
              {points[i].label}
            </text>
          ))}
          {area && <path d={geo.areaPath} fill={ACCENT} fillOpacity={0.1} />}
          <path d={geo.line} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {hxy && (
            <line x1={hxy[0]} x2={hxy[0]} y1={PAD.top} y2={geo.base} stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
          )}
          <circle cx={lx} cy={ly} r={4.5} fill={ACCENT} stroke={SURFACE} strokeWidth={2} />
          {!hp && (
            <text x={lx} y={ly - 11} textAnchor="end" fontSize={11.5} fontWeight={700} fill={INK.primary}>
              {formatCompact(last.value)}
            </text>
          )}
          {hxy && <circle cx={hxy[0]} cy={hxy[1]} r={5} fill={INK.primary} stroke={ACCENT} strokeWidth={2} />}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={W - PAD.left - PAD.right}
            height={H - PAD.top - PAD.bottom}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {hp && hxy && (
          <div
            className="woi-chart-tip"
            style={{ left: `${(hxy[0] / W) * 100}%`, top: `${(hxy[1] / H) * 100}%` }}
          >
            <strong>{formatFull(hp.value)}</strong> {unit}
            <span style={{ color: "#5f6f92", marginLeft: 6 }}>{hp.label}</span>
          </div>
        )}
      </div>
      <table className="woi-sr-only">
        <caption>{title}</caption>
        <tbody>
          {points.map((p) => (
            <tr key={p.t}>
              <td>{p.label}</td>
              <td>{formatFull(p.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ label, value, note, delta }: { label: string; value: string; note?: string; delta?: string }) {
  return (
    <div className="woi-kpi">
      <span className="woi-kpi-label">{label}</span>
      <span className="woi-kpi-value">{value}</span>
      {delta ? <span className="woi-kpi-delta">▲ {delta}</span> : note ? <span className="woi-kpi-label">{note}</span> : null}
    </div>
  );
}

export default function Insights() {
  const views = useMemo(cumulativeViews, []);
  const followers = useMemo(followerSeries, []);
  const rows = useMemo(ranked, []);
  if (!INSIGHTS.media.length) return null;
  const maxViews = Math.max(1, ...rows.map((m) => m.views));

  return (
    <div id="insights" className="woi-section" style={{ background: "#081530", scrollMarginTop: 80 }}>
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#01BDF9",
          textAlign: "center",
        }}
      >
        Insights
      </p>
      <h2 className="woi-h2">The Numbers Behind the Work</h2>
      <p
        style={{
          margin: "0 auto 40px",
          fontSize: 15,
          color: "#93a4c8",
          textAlign: "center",
          maxWidth: 600,
          lineHeight: 1.65,
        }}
      >
        Live from our Instagram, refreshed daily. Every post counted.
      </p>

      <div className="woi-kpi-grid">
        <Kpi label="Total views" value={formatCompact(TOTALS.views)} note={`across ${INSIGHTS.media.length} posts`} />
        <Kpi label="Accounts reached" value={formatCompact(TOTALS.reach30d)} note="last 30 days" />
        <Kpi
          label="Followers"
          value={formatFull(INSIGHTS.account.followers)}
          delta={TOTALS.followerDelta30d > 0 ? `${formatFull(TOTALS.followerDelta30d)} in 30 days` : undefined}
          note="on Instagram"
        />
        <Kpi label="Interactions" value={formatCompact(TOTALS.interactions)} note="likes, comments, saves & shares" />
      </div>

      <div className="woi-chart-grid">
        {views.length > 1 && (
          <TimeSeriesChart
            title="Views, cumulative"
            subtitle="Running total, credited to each post's publish date"
            points={views}
            area
            step
            unit="views"
          />
        )}
        {followers.length > 1 && (
          <TimeSeriesChart
            title="Followers"
            subtitle="Last 30 days"
            points={followers}
            unit="followers"
          />
        )}
      </div>

      <div className="woi-chart-card">
        <h3 className="woi-chart-title">Every post, ranked by views</h3>
        <p className="woi-chart-sub">
          {TOTALS.reels} reels and {TOTALS.feed} feed posts — tap one to open it on Instagram
        </p>
        <div>
          {rows.map((m, i) => (
            <a
              key={m.id}
              className="woi-rank-row"
              href={m.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${kindLabel(m.type)} from ${dayLabel(m.timestamp, true)}: ${formatFull(m.views)} views`}
            >
              <span style={{ fontSize: 12, color: INK.muted, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <strong>{kindLabel(m.type)}</strong>
                <span style={{ color: INK.muted }}> · {dayLabel(m.timestamp)}</span>
              </span>
              <span className="woi-rank-track">
                <span className="woi-rank-bar" style={{ width: `${(m.views / maxViews) * 100}%` }} />
              </span>
              <span
                style={{ fontSize: 13, fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}
                title={`${formatFull(m.views)} views`}
              >
                {formatCompact(m.views)}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p style={{ margin: "22px 0 0", fontSize: 12, color: INK.muted, textAlign: "center" }}>
        Source: Instagram API, @{INSIGHTS.account.username} · updated {dayLabel(INSIGHTS.generatedAt, true)}
      </p>
    </div>
  );
}
