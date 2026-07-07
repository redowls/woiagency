# WOI Agency — Wave of Innovation

One-page marketing website for **WOI Agency**, an Indonesian creative content
studio (graphic design, branding, motion graphics, social media, content
creation). Built with **Next.js 15** (App Router, TypeScript), converted from
the design reference in [`Initial/`](Initial/).

Single scrolling page: Nav → Hero (with 3D portfolio carousel) → Services →
Portfolio (filterable) → Contact/Footer. Fully responsive from desktop to
mobile (hamburger nav under 880px, adaptive grids, stacked lightbox),
Montserrat via `next/font`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm start
```

## Project structure

- `app/` — App Router layout, page, and global styles (design tokens from the handoff)
- `components/` — `Nav` (scroll spy), `Hero` (ambient orbs + 3D auto-scroll carousel), `Services`, `Portfolio` (category filter + autoplay video), `Contact`
- `lib/portfolio.ts` — portfolio items and carousel image list
- `public/assets/` — web-optimized client work images and the bumper video
- `scripts/prepare-assets.mjs` — regenerates `public/assets/` from the local raw `portfolio-assets` folder (resizes 15MB+ print-resolution sources down for web); run with `npm run prepare-assets`, source dir overridable via `ASSETS_SRC`
- `Initial/` — original design handoff (HTML reference + README), kept for reference
