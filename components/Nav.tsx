"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "@/lib/scroll";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  // clicking a pill locks the scroll spy briefly so smooth-scroll
  // doesn't flicker the active state on its way to the section
  const lockUntil = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (performance.now() < lockUntil.current) return;
      let cur = "home";
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      setActive((prev) => (prev === cur ? prev : cur));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    lockUntil.current = performance.now() + 900;
    setActive(id);
    setMenuOpen(false);
    scrollToSection(id);
  };

  const pill = (n: (typeof NAV_ITEMS)[number]) => (
    <a
      key={n.id}
      href={`#${n.id}`}
      className={`woi-nav-pill${active === n.id ? " is-active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        go(n.id);
      }}
    >
      {n.label}
    </a>
  );

  const cta = (
    <a
      href="#contact"
      className="woi-nav-cta"
      onClick={(e) => {
        e.preventDefault();
        go("contact");
      }}
    >
      Contact Us
    </a>
  );

  return (
    <nav className="woi-nav">
      <a
        href="#home"
        className="woi-brand"
        onClick={(e) => {
          e.preventDefault();
          go("home");
        }}
      >
        <img
          src="/assets/woi-logo-new.png"
          alt="WOI"
          style={{ width: 38, height: 38, borderRadius: 12, objectFit: "cover" }}
        />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.2px" }}>
          WOI Agency
        </span>
      </a>
      <div className="woi-nav-links">
        {NAV_ITEMS.map(pill)}
        {cta}
      </div>
      <button
        className="woi-nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>
      {menuOpen && (
        <div className="woi-nav-menu">
          {NAV_ITEMS.map(pill)}
          {cta}
        </div>
      )}
    </nav>
  );
}
