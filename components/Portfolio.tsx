"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, CLIENTS, DEFAULT_VIDEO, PORTFOLIO_ITEMS } from "@/lib/portfolio";
import Lightbox from "@/components/Lightbox";

function PortfolioVideo({ src }: { src: string }) {
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

  return <video ref={ref} src={src} muted loop playsInline autoPlay />;
}

function ViewsBadge({ views }: { views: string }) {
  return (
    <span className="woi-views-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      {views} views
    </span>
  );
}

export default function Portfolio() {
  // the portfolio opens on the highlight reels, not the full catalogue
  const [filter, setFilter] = useState<string>("Highlight");
  // "Our Clients" narrows once more, one brand at a time
  const [client, setClient] = useState<string>(CLIENTS[0] ?? "");
  const [selected, setSelected] = useState<number | null>(null);
  const items = PORTFOLIO_ITEMS.filter(
    (it) =>
      (filter === "All" || it.cat === filter) &&
      (filter !== "Our Clients" || it.client === client),
  );

  return (
    <div
      id="portfolio"
      className="woi-section"
      style={{
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
            onClick={() => {
              setFilter(c);
              setSelected(null);
            }}
          >
            {c}
          </button>
        ))}
      </div>
      {filter === "Our Clients" && CLIENTS.length > 1 && (
        <div className="woi-subfilter" role="group" aria-label="Choose a client">
          {CLIENTS.map((c) => (
            <button
              key={c}
              className={`woi-filter-pill woi-filter-pill--sub${client === c ? " is-active" : ""}`}
              onClick={() => {
                setClient(c);
                setSelected(null);
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="woi-portfolio-grid">
        {items.map((it, i) => (
          <div key={it.title} className="woi-card" onClick={() => setSelected(i)}>
            <div className="woi-card-media">
              {it.isVideo ? (
                <PortfolioVideo src={it.video ?? DEFAULT_VIDEO} />
              ) : (
                <img src={it.img} alt={it.title} />
              )}
            </div>
            {it.views && <ViewsBadge views={it.views} />}
            <div className="woi-cap">
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{it.title}</span>
              <span style={{ fontSize: 12, color: "#a9bbe0" }}>{it.cat}</span>
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <Lightbox
          items={items}
          index={selected}
          onClose={() => setSelected(null)}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}
