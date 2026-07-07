"use client";

import { useEffect, useRef } from "react";
import type { PortfolioItem } from "@/lib/portfolio";
import { scrollToSection } from "@/lib/scroll";

type Props = {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function Lightbox({ items, index, onClose, onNavigate }: Props) {
  const item = items[index];
  const videoRef = useRef<HTMLVideoElement>(null);

  const prev = () => onNavigate((index - 1 + items.length) % items.length);
  const next = () => onNavigate((index + 1) % items.length);

  // lock page scroll while open; Esc closes, arrows navigate
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
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
        v.muted = true;
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
      {items.length > 1 && (
        <>
          <button
            className="woi-lightbox-nav"
            style={{ left: 22 }}
            aria-label="Previous work"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <button
            className="woi-lightbox-nav"
            style={{ right: 22 }}
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
              src="/assets/video-bumper.mp4"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <img src={item.img} alt={item.title} />
          )}
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
  );
}
