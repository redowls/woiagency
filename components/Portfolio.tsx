"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PORTFOLIO_ITEMS } from "@/lib/portfolio";

function PortfolioVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // autoplay-race guard: retry play on mount / remount after filter change
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      if (v.paused) {
        v.muted = true;
        v.play().catch(() => {});
      }
    };
    tryPlay();
    const id = setInterval(tryPlay, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <video
      ref={ref}
      src="/assets/video-bumper.mp4"
      muted
      loop
      playsInline
      autoPlay
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const items = PORTFOLIO_ITEMS.filter((it) => filter === "All" || it.cat === filter);

  return (
    <div
      id="portfolio"
      style={{
        padding: "72px 48px",
        background: "#f4f7fd",
        color: "#0b1c3d",
        scrollMarginTop: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          maxWidth: 560,
          margin: "0 auto 32px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(to left,#0a48ff66,transparent)",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#0a48ff",
          }}
        >
          Portfolio
        </p>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(to right,#0a48ff66,transparent)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`woi-filter-pill${filter === c ? " is-active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
        {items.map((it) => (
          <div key={it.title} className="woi-card">
            <div style={{ width: "100%", height: "100%", background: "#eef2fa", overflow: "hidden" }}>
              {it.isVideo ? (
                <PortfolioVideo />
              ) : (
                <img
                  src={it.img}
                  alt={it.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              )}
            </div>
            <div className="woi-cap">
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{it.title}</span>
              <span style={{ fontSize: 12, color: "#a9bbe0" }}>{it.cat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
