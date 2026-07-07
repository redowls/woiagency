# Handoff: WOI Agency One-Page Website

## Overview
A one-page marketing website for **WOI Agency — Wave of Innovation**, an Indonesian creative content studio (graphic design, branding, motion graphics, social media, content creation). Single scrolling page: Nav → Hero (with 3D portfolio carousel) → Services → Portfolio (filterable) → Contact/Footer.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look and behavior, not production code to copy directly. Your task is to **recreate this design in the target codebase's existing environment** (React, Vue, Next.js, etc.) using its established patterns and libraries. If no environment exists yet, choose an appropriate modern framework (e.g. React/Next.js) and implement it there.

`WOI Agency Final.dc.html` is the reference. It uses a small proprietary template runtime (`<x-dc>`, `{{ }}` holes, `sc-for`/`sc-if`) — ignore the runtime; read it as: inline-styled markup + a `Component` class at the bottom containing all the interaction logic (plain JS, directly portable).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly.

## Design Tokens
- Background dark: `#050d21` (page), `#081530` (services section)
- Background light: `#f4f7fd` (portfolio section), card wells `#eef2fa`
- Text: `#f2f6ff` (on dark), `#0b1c3d` (on light), muted `#93a4c8` (dark) / `#5f6f92` (light), caption muted `#a9bbe0`
- Brand blues: `#0a48ff` (primary), `#01BDF9` (cyan), accent glow `#79e0fc`
- Brand gradient: `linear-gradient(120–135deg, #0a48ff, #01BDF9)`
- Font: **Montserrat** (Google Fonts), weights 500/600/700 only
- Radii: pills `999px`, cards `20–22px`, icon tiles `14px`, hero logo `36px`
- Shadows: cards `0 4px 22px rgba(11,28,61,.08)` → hover `0 12px 34px rgba(10,72,255,.18)`; CTA `0 4px 18px rgba(0,140,255,.35)`
- Desktop-only layout, min-width `1100px`

## Screens / Sections

### 1. Sticky Nav (glass pill)
- Sticky at `top:14px`, margin `14px 28px 0`, border-radius `999px`
- Glass: `linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04))`, `backdrop-filter: blur(28px) saturate(1.8)`, 1px border `rgba(255,255,255,.14)`, inset top highlight
- Left: logo image (38px, radius 12) + "WOI Agency" 17px/700; hover scales 1.04 with springy easing `cubic-bezier(.34,1.56,.64,1)`
- Center-right: Home / Services / Portfolio / Contact pills, 14px. Active: 600 weight, `rgba(255,255,255,.12)` bg. Inactive: 500, `#93a4c8`. Hover: lift `translateY(-2px)`
- **Scroll spy**: active pill follows the section in view (section top ≤ 140px from viewport top). Clicking a pill locks the spy for ~900ms so smooth-scroll doesn't flicker the state
- Right: "Contact Us" gradient CTA pill, hover scale 1.06, active scale .95

### 2. Hero (`#home`)
- Padding `88px 48px 0`, centered column, radial blue glows top-center and bottom-right over `#050d21`
- 3 blurred orb divs (520/340/200px, radial blue/cyan gradients, `blur(60/50/36px)`) — see Interactions
- Logo 150px, radius 36, floats up/down 14px over 6s (`ease-in-out infinite`)
- H1: 76px/700, letter-spacing −2.5px, max-width 900px — copy: "Ride the Wave. Own the Innovation."
- Sub: 17px `#93a4c8`, max-width 640px
- Buttons: "View Portfolio" (white pill, dark text) + "Free Consultation" (outline pill)

### 3. Hero carousel (fused with hero background)
- Full-bleed horizontal strip of 8 work images (250px tall, radius 20, 18px gap), duplicated once (16 total) for seamless looping
- Each image has a CSS reflection: `-webkit-box-reflect: below 14px linear-gradient(transparent 52%, rgba(255,255,255,.28))`
- Bottom fade overlay (130px tall): `linear-gradient(to bottom, rgba(5,13,33,0), rgba(5,13,33,.9) 65%, #050d21)` — blends reflections into the background
- See Interactions for the 3D curve / autoscroll / hover behavior

### 4. Services (`#services`, dark `#081530`)
- Eyebrow "SERVICES" (13px/700, tracking 2px, cyan) + H2 "What We Do" 40px + sub "Five core services…"
- 5-column grid, gap 18px. Cards: `rgba(255,255,255,.04)` bg, 1px `rgba(255,255,255,.09)` border, radius 22, padding `30px 26px`
- Hover: border `rgba(1,189,249,.5)`, bg `rgba(10,72,255,.08)`
- Each card: 50px gradient icon tile (radius 14) + 17px/700 title + 13.5px muted body
- Cards: Graphic Design ("Aa"), Logo & Branding ("◆"), Motion Graphics ("▶"), Social Media Management ("＠"), Content Creation ("✦")

### 5. Portfolio (`#portfolio`, light `#f4f7fd`)
- Header: slim centered "PORTFOLIO" label (13px/700, tracking 5px, `#0a48ff`) flanked by 1px gradient hairlines fading outward (max-width 560px). **No H2 title.**
- Filter pills: All / Poster & Flyer / Banner / Logo / Animation. Active: brand gradient bg, white text, glow shadow. Inactive: white bg, `#5f6f92` text, `1.5px solid #dde5f2` border
- 4-column grid, gap 18px. Cards: 270px tall, radius 20, full-bleed image (`object-fit: cover; object-position: top`), no visible caption at rest
- **Hover caption**: dark gradient overlay slides up from bottom (`linear-gradient(to top, rgba(5,13,33,.88), rgba(5,13,33,.45) 55%, transparent)`, padding `44px 18px 16px`), title 14px/700 white + category 12px `#a9bbe0`; `opacity 0→1` + `translateY(10px→0)` over `.35s ease`. Card also lifts −4px with blue shadow
- One item is a looping muted autoplay video (Animation category). Prototype re-calls `.play()` every ~1s as an autoplay-race guard — in production, retry play on mount/filter change
- 15 items with exact titles/categories are in the `data` getter in the reference file

### 6. Contact (`#contact`, dark, bottom radial glow)
- Logo 72px, H2 "Ready to Create Together?" 48px, sub copy
- Pills: `✉ hello@woiagency.id` (white, mailto) + `✆ +62 812-3456-7890` (outline, tel)
- 3 round 48px social buttons (Instagram, YouTube SVG icons; LinkedIn as "in" text), hover bg `rgba(10,72,255,.35)`
- Footer line: "© 2026 WOI Agency — Wave of Innovation. All rights reserved." above a 1px `rgba(255,255,255,.08)` top border

## Interactions & Behavior

### Hero ambient orbs (cursor-follow)
- Each of 3 orbs wanders on its own slow Lissajous path (per-orb frequency/phase/amplitude — exact constants in the `_orbs` class field) plus slow scale "breathing" (±10–18%)
- On `mousemove` in the hero, a blend factor eases toward 1 (`+= (1 − v) * 0.05` per frame). While blended in: orbs are pulled toward the cursor (per-orb base pull 0.22/0.38/0.60 boosted toward ~1, damped by per-orb lag 0.030–0.065 for parallax depth) and wander amplitude damps to 25%
- On mouseleave: blend eases back to 0, orbs resume full ambient drift toward hero center
- All motion in one `requestAnimationFrame` loop writing `transform: translate(...) scale(...)`; orbs are `pointer-events:none; will-change:transform`

### Hero carousel (3D, auto-scroll, hover, drag)
- Horizontally scrollable wrapper (`overflow-x:auto`, hidden scrollbar, `cursor:grab`) with `perspective:1400px`; track is `width:max-content; transform-style:preserve-3d`
- **Auto-scroll**: rAF loop advances `scrollLeft` at (half track width) / 42s; wraps modulo half-width for infinite loop
- **3D curve**: per image, `k` = signed distance of image center from viewport center (clamped ±1.15). Transform: `rotateY(−k·34°)`, `translateY(k²·46px)`, `translateZ(−|k|·120px)`, `scale(1 − |k|·0.08)`
- **Hover**: auto-scroll pauses (mouseenter on wrapper); the hovered image smoothly expands — per-image hover factor eases toward 1 at 0.14/frame, blending to `scale(1.08)`, `translateZ(+90px)`, `translateY(−10px)`, `rotateY(0)`
- **Manual scroll**: vertical wheel is translated to horizontal scroll (preventDefault); mouse drag-to-scroll via pointer capture (`grab` → `grabbing`)

### Other
- Anchor navigation with `scroll-behavior: smooth`; sections have `scroll-margin-top: 80px`
- Portfolio filter is instant (no animation on grid change)

## State Management
- `filter`: active portfolio category (string, default "All")
- `nav`: active nav section id, driven by scroll spy + clicks
- Ephemeral (non-render) state: orb positions, carousel scroll/hover/drag, nav spy lock timestamp — all mutated inside the rAF loop, never triggering re-render

## Assets
All in `assets/` (client work supplied by WOI Agency; logo is the brand mark):
`woi-logo-new.png`, posters (`poster-architecture/final/hiring/bogor-depok/beasiswa/why-binus.png`), banners (`banner-cover/kemanggisan/80x200/a5.png`), logos (`logo-piring-sewu/dapoer-lien/1/2.png`), `video-bumper.mp4`. Montserrat loads from Google Fonts.

## Files
- `WOI Agency Final.dc.html` — the full design reference (markup + interaction logic)
- `assets/` — all images/video referenced by the design
