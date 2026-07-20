"use client";

import { useEffect, useRef, useState } from "react";
import { CAROUSEL_IMAGES, PORTFOLIO_ITEMS, type PortfolioItem } from "@/lib/portfolio";
import { scrollToSection } from "@/lib/scroll";
import Lightbox from "@/components/Lightbox";

// each carousel thumbnail maps back to its full portfolio entry so a click
// can open the same Lightbox the Portfolio grid uses
const CAROUSEL_ITEMS: PortfolioItem[] = CAROUSEL_IMAGES
  .map((ci) => PORTFOLIO_ITEMS.find((it) => it.img === ci.src))
  .filter((it): it is PortfolioItem => Boolean(it));

type Orb = {
  el: HTMLDivElement | null;
  ox: number;
  oy: number;
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  ph: number;
  pull: number;
  lag: number;
  sAmp: number;
  sf: number;
  mx: number;
  my: number;
};

const makeOrbs = (): Orb[] => [
  { el: null, ox: -260, oy: -260, ax: 210, ay: 130, fx: 0.00011, fy: 0.00007, ph: 0.0, pull: 0.22, lag: 0.030, sAmp: 0.10, sf: 0.00013, mx: 0, my: 0 },
  { el: null, ox: -60,  oy: -220, ax: 150, ay: 170, fx: 0.00008, fy: 0.00013, ph: 2.1, pull: 0.38, lag: 0.045, sAmp: 0.14, sf: 0.00017, mx: 0, my: 0 },
  { el: null, ox: -240, oy: -40,  ax: 260, ay: 110, fx: 0.00013, fy: 0.00009, ph: 4.2, pull: 0.60, lag: 0.065, sAmp: 0.18, sf: 0.00010, mx: 0, my: 0 },
];

const ORB_STYLES = [
  { width: 520, height: 520, background: "radial-gradient(circle,rgba(10,72,255,.55),rgba(10,72,255,0) 70%)", filter: "blur(60px)" },
  { width: 340, height: 340, background: "radial-gradient(circle,rgba(1,189,249,.45),rgba(1,189,249,0) 70%)", filter: "blur(50px)" },
  { width: 200, height: 200, background: "radial-gradient(circle,rgba(121,224,252,.35),rgba(121,224,252,0) 70%)", filter: "blur(36px)" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const orbs = useRef<Orb[]>(makeOrbs());

  const target = useRef({ x: 640, y: 300 });
  const center = useRef({ x: 640, y: 300 });
  const mouseIn = useRef(false);
  const blend = useRef(0);
  const carHover = useRef(false);
  const hoverCard = useRef<HTMLImageElement | null>(null);
  const dragging = useRef(false);
  // set while a drag/swipe is in progress so the ending click doesn't open the Lightbox
  const gestureMoved = useRef(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // per-card hover factor, eased toward 1 while the card is hovered
    const hoverFactor = new WeakMap<Element, number>();
    let lastT = 0;
    let raf = 0;

    const tick = (t: number) => {
      // curved 3D carousel, JS-scrolled: auto-advances, pauses + expands the
      // hovered card, and lets the user scroll/drag left-right
      const half = track.scrollWidth / 2;
      const dt = lastT ? Math.min(64, t - lastT) : 16;
      let p = wrap.scrollLeft;
      if (!carHover.current && !dragging.current && half > 0) p += dt * (half / 42000);
      if (half > 0) {
        if (p >= half) p -= half;
        else if (p < 0) p += half;
      }
      wrap.scrollLeft = p;
      const mid = wrap.clientWidth / 2;
      for (const card of Array.from(track.children) as HTMLElement[]) {
        const cx = card.offsetLeft + card.offsetWidth / 2 - p;
        const k = Math.max(-1.15, Math.min(1.15, (cx - mid) / mid));
        const prev = hoverFactor.get(card) ?? 0;
        const h = prev + ((card === hoverCard.current ? 1 : 0) - prev) * 0.14;
        hoverFactor.set(card, h);
        const rot = -k * 34 * (1 - h);
        const dip = k * k * 46 * (1 - h) - 10 * h;
        const back = -Math.abs(k) * 120 * (1 - h) + 90 * h;
        const sc = (1 - Math.abs(k) * 0.08) * (1 - h) + 1.08 * h;
        card.style.transform = `translateY(${dip}px) translateZ(${back}px) rotateY(${rot}deg) scale(${sc})`;
      }
      lastT = t;

      // ambient drifting orbs + gentle mouse influence (parallax); the mouse
      // only sways each orb from its own slow Lissajous path
      const dx = target.current.x - center.current.x;
      const dy = target.current.y - center.current.y;
      blend.current += ((mouseIn.current ? 1 : 0) - blend.current) * 0.05;
      for (const o of orbs.current) {
        if (!o.el) continue;
        const pull = o.pull + (1 - o.pull) * blend.current * 0.9;
        o.mx += (dx * pull - o.mx) * o.lag;
        o.my += (dy * pull - o.my) * o.lag;
        const wAmp = 1 - blend.current * 0.75;
        const wx = center.current.x + Math.sin(t * o.fx + o.ph) * o.ax * wAmp;
        const wy = center.current.y + Math.cos(t * o.fy + o.ph * 1.7) * o.ay * wAmp;
        const s = 1 + Math.sin(t * o.sf + o.ph) * o.sAmp;
        o.el.style.transform = `translate(${wx + o.mx + o.ox}px, ${wy + o.my + o.oy}px) scale(${s})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const hero = heroRef.current;
      if (hero) center.current = { x: hero.offsetWidth / 2, y: hero.offsetHeight / 2 };
    };
    onResize();
    window.addEventListener("resize", onResize);

    // vertical wheel scrolls the carousel horizontally
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        wrap.scrollLeft += e.deltaY;
      }
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });

    // drag-to-scroll with mouse
    let dragX = 0;
    let dragS = 0;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      e.preventDefault();
      dragging.current = true;
      gestureMoved.current = false;
      dragX = e.clientX;
      dragS = wrap.scrollLeft;
      wrap.setPointerCapture(e.pointerId);
      wrap.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const moved = e.clientX - dragX;
      if (Math.abs(moved) > 6) gestureMoved.current = true;
      wrap.scrollLeft = dragS - moved;
    };
    const onPointerUp = () => {
      dragging.current = false;
      wrap.style.cursor = "grab";
    };
    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove);
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);

    // touch devices scroll natively — pause the auto-advance while the
    // finger is down and briefly after, so it doesn't fight the fling
    let touchResume = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      carHover.current = true;
      clearTimeout(touchResume);
      gestureMoved.current = false;
      const t0 = e.touches[0];
      if (t0) {
        touchStartX = t0.clientX;
        touchStartY = t0.clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      const t0 = e.touches[0];
      if (!t0) return;
      if (Math.abs(t0.clientX - touchStartX) > 8 || Math.abs(t0.clientY - touchStartY) > 8)
        gestureMoved.current = true;
    };
    const onTouchEnd = () => {
      clearTimeout(touchResume);
      touchResume = window.setTimeout(() => {
        carHover.current = false;
      }, 1500);
    };
    wrap.addEventListener("touchstart", onTouchStart, { passive: true });
    wrap.addEventListener("touchmove", onTouchMove, { passive: true });
    wrap.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchmove", onTouchMove);
      wrap.removeEventListener("touchend", onTouchEnd);
      clearTimeout(touchResume);
    };
  }, []);

  return (
    <div
      id="home"
      ref={heroRef}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        mouseIn.current = true;
      }}
      onMouseLeave={() => {
        target.current = { ...center.current };
        mouseIn.current = false;
      }}
      className="woi-hero"
      style={{
        background:
          "radial-gradient(ellipse 90% 70% at 50% -10%,rgba(10,72,255,.4),transparent 60%),radial-gradient(ellipse 60% 50% at 85% 100%,rgba(1,189,249,.18),transparent 65%),#050d21",
      }}
    >
      {ORB_STYLES.map((s, i) => (
        <div
          key={i}
          ref={(el) => {
            orbs.current[i].el = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "50%",
            pointerEvents: "none",
            willChange: "transform",
            ...s,
          }}
        />
      ))}
      <img src="/assets/woi-logo-new.png" alt="WOI Agency logo" className="woi-hero-logo" />
      <h1 className="woi-h1">Ride the Wave. Own the Innovation.</h1>
      <p className="woi-hero-sub">
        WOI Agency — Wave of Innovation. A creative content studio for graphic
        design, branding, motion graphics, and social media. From ideas to work
        that makes an impact.
      </p>
      <div className="woi-hero-cta-row">
        <a
          href="#portfolio"
          className="woi-btn-solid"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("portfolio");
          }}
        >
          View Portfolio
        </a>
        <a
          href="#contact"
          className="woi-btn-outline"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("contact");
          }}
        >
          Free Consultation
        </a>
      </div>

      {/* carousel fused with hero: one continuous background */}
      <div className="woi-car-outer">
        <div
          ref={wrapRef}
          className="woi-car-wrap"
          onMouseEnter={() => {
            carHover.current = true;
          }}
          onMouseLeave={() => {
            carHover.current = false;
            hoverCard.current = null;
          }}
        >
          <div
            ref={trackRef}
            onMouseOver={(e) => {
              const img = (e.target as HTMLElement).closest?.("img");
              hoverCard.current = (img as HTMLImageElement) || null;
            }}
            style={{ display: "flex", width: "max-content", transformStyle: "preserve-3d" }}
          >
            {/* duplicated once (16 total) for seamless looping */}
            {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt=""
                className="woi-car-img"
                style={{ cursor: "pointer", ...(img.whiteBg ? { background: "#fff" } : {}) }}
                onClick={() => {
                  // ignore the click that ends a drag / swipe
                  if (gestureMoved.current) return;
                  setSelected(i % CAROUSEL_IMAGES.length);
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 130,
            background:
              "linear-gradient(to bottom,rgba(5,13,33,0),rgba(5,13,33,.9) 65%,#050d21)",
            pointerEvents: "none",
          }}
        />
      </div>

      {selected !== null && (
        <Lightbox
          items={CAROUSEL_ITEMS}
          index={selected}
          onClose={() => setSelected(null)}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}
