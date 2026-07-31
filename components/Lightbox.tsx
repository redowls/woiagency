"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_VIDEO, type PortfolioItem } from "@/lib/portfolio";
import { scrollToSection } from "@/lib/scroll";

type Props = {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H3v6h3l5 4z" fill="#fff" />
      {muted ? (
        <path d="M17 9.5l4 5M21 9.5l-4 5" />
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a9 9 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

export default function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const item = items[index];
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullviewVideoRef = useRef<HTMLVideoElement>(null);
  const [fullview, setFullview] = useState(false);
  // videos must start muted or browsers block autoplay; a tap unmutes (Instagram-style)
  const [muted, setMuted] = useState(true);

  const prev = () => onNavigate((index - 1 + items.length) % items.length);
  const next = () => onNavigate((index + 1) % items.length);

  // leave fullscreen when moving to another work, and re-mute so the next
  // video can autoplay (an unmuted autoplay would be blocked)
  useEffect(() => {
    setFullview(false);
    setMuted(true);
  }, [index]);

  // React only sets `muted` on mount, so drive it imperatively on every change
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
    for (const ref of [videoRef, fullviewVideoRef]) {
      if (ref.current) ref.current.muted = muted;
    }
  }, [muted, fullview, index]);

  // lock page scroll while open; Esc closes (fullscreen first), arrows navigate
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullview) setFullview(false);
        else onClose();
      } else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  });

  // autoplay-race guard, same as the grid video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      if (v.paused) {
        // only force-mute while the viewer still wants silence — otherwise
        // this would quietly undo their unmute on the next tick
        if (mutedRef.current) v.muted = true;
        v.play().catch(() => {});
      }
    };
    tryPlay();
    const id = setInterval(tryPlay, 1000);
    return () => clearInterval(id);
  }, [index]);

  if (!item) return null;

  return (
    <div
      className="woi-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <button className="woi-lightbox-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <div className="woi-lightbox-shell">
        {items.length > 1 && (
          <>
            <button
              className="woi-lightbox-nav woi-lightbox-nav--prev"
              aria-label="Previous work"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              ‹
            </button>
            <button
              className="woi-lightbox-nav woi-lightbox-nav--next"
              aria-label="Next work"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          </>
        )}
        <div className="woi-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="woi-lightbox-media">
          {item.isVideo ? (
            <video
              ref={videoRef}
              src={item.video ?? DEFAULT_VIDEO}
              muted
              loop
              playsInline
              autoPlay
              onClick={() => setMuted((m) => !m)}
            />
          ) : (
            <img src={item.img} alt={item.title} />
          )}
          {item.isVideo && (
            <button
              className="woi-sound-btn"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            >
              <SoundIcon muted={muted} />
            </button>
          )}
          <button
            className="woi-fullscreen-btn"
            aria-label="View full screen"
            onClick={() => setFullview(true)}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M9 3H4a1 1 0 0 0-1 1v5M15 3h5a1 1 0 0 1 1 1v5M9 21H4a1 1 0 0 1-1-1v-5M15 21h5a1 1 0 0 0 1-1v-5" />
            </svg>
          </button>
        </div>
        <div className="woi-lightbox-panel">
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <img
              src="/assets/woi-logo-new.png"
              alt=""
              style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>WOI Agency</span>
              <span style={{ fontSize: 11.5, color: "#5f6f92" }}>Wave of Innovation</span>
            </div>
          </div>
          <div
            style={{
              height: 1,
              background: "#e6ecf7",
              margin: "16px 0 18px",
            }}
          />
          <span
            style={{
              alignSelf: "flex-start",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#0a48ff",
              background: "#eef2fa",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            {item.cat}
          </span>
          <h3
            style={{
              margin: "14px 0 10px",
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.75,
              color: "#5f6f92",
            }}
          >
            {item.desc}
          </p>
          <div style={{ flex: 1 }} />
          <div
            style={{
              height: 1,
              background: "#e6ecf7",
              margin: "18px 0 16px",
            }}
          />
          <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#5f6f92" }}>
            Like what you see? Let's make something for your brand.
          </p>
          <a
            href="#contact"
            className="woi-lightbox-cta"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              // wait for the modal to unmount so body scroll is unlocked
              setTimeout(() => scrollToSection("contact"), 60);
            }}
          >
            Start a Project
          </a>
        </div>
        </div>
      </div>
      {fullview && (
        <div
          className="woi-fullview"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} — full screen`}
          onClick={(e) => {
            e.stopPropagation();
            setFullview(false);
          }}
        >
          {item.isVideo ? (
            <video
              ref={fullviewVideoRef}
              src={item.video ?? DEFAULT_VIDEO}
              muted
              loop
              playsInline
              autoPlay
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            />
          ) : (
            <img src={item.img} alt={item.title} />
          )}
          {item.isVideo && (
            <button
              className="woi-sound-btn"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              onClick={(e) => {
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            >
              <SoundIcon muted={muted} />
            </button>
          )}
          <button
            className="woi-lightbox-close"
            style={{ background: "rgba(5,13,33,.55)", borderColor: "rgba(255,255,255,.25)" }}
            aria-label="Exit full screen"
            onClick={(e) => {
              e.stopPropagation();
              setFullview(false);
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
