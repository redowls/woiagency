"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("home");
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

  return (
    <nav className="woi-nav">
      <a href="#home" className="woi-brand">
        <img
          src="/assets/woi-logo-new.png"
          alt="WOI"
          style={{ width: 38, height: 38, borderRadius: 12, objectFit: "cover" }}
        />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.2px" }}>
          WOI Agency
        </span>
      </a>
      {NAV_ITEMS.map((n) => (
        <a
          key={n.id}
          href={`#${n.id}`}
          className={`woi-nav-pill${active === n.id ? " is-active" : ""}`}
          onClick={() => {
            lockUntil.current = performance.now() + 900;
            setActive(n.id);
          }}
        >
          {n.label}
        </a>
      ))}
      <a href="#contact" className="woi-nav-cta">
        Contact Us
      </a>
    </nav>
  );
}
