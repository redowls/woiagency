export type PortfolioItem = {
  img: string;
  title: string;
  cat: string;
  desc: string;
  isVideo?: boolean;
};

export const CATEGORIES = [
  "All",
  "Poster & Flyer",
  "Banner",
  "Logo",
  "Animation",
] as const;

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    img: "/assets/poster-architecture.png",
    title: "Architecture Study Program",
    cat: "Poster & Flyer",
    desc: "Instagram feed poster introducing the Architecture study program — bold typographic hierarchy over a clean, structured layout that mirrors the discipline itself.",
  },
  {
    img: "/assets/poster-final.png",
    title: "Scholarship Campaign",
    cat: "Poster & Flyer",
    desc: "Campaign poster for a scholarship program, designed to stop the scroll: a strong headline first, supporting details layered underneath to drive registrations.",
  },
  {
    img: "/assets/poster-bogor-depok.png",
    title: "Bogor–Depok Feed",
    cat: "Poster & Flyer",
    desc: "Location-focused feed design promoting the Bogor–Depok area, keeping campus branding consistent across regional content.",
  },
  {
    img: "/assets/poster-beasiswa.png",
    title: "OSIS Scholarship",
    cat: "Poster & Flyer",
    desc: "Announcement visual for the OSIS scholarship track, laying out the benefits and requirements in an easy-to-scan structure.",
  },
  {
    img: "/assets/poster-why-binus.png",
    title: "Why BINUS (A3)",
    cat: "Poster & Flyer",
    desc: "A3 print poster answering “Why BINUS?” — benefit-led copy organized into a structured grid for on-campus display.",
  },
  {
    img: "/assets/banner-cover.png",
    title: "Ambassador Cover",
    cat: "Banner",
    desc: "Cover visual for the ambassador program, built around a cinematic hero shot with the campaign identity applied on top.",
  },
  {
    img: "/assets/banner-kemanggisan.png",
    title: "Kemanggisan Banner",
    cat: "Banner",
    desc: "Large-format banner for the @Kemanggisan campus — designed to stay legible and on-brand at a distance.",
  },
  {
    img: "/assets/banner-80x200.png",
    title: "80×200 Banner",
    cat: "Banner",
    desc: "80×200 cm roll-up banner for event and registration booths, with a vertical information flow from headline to call to action.",
  },
  {
    img: "/assets/banner-a5.png",
    title: "A5 Print Materials",
    cat: "Banner",
    desc: "A5 print collateral adapted from the campaign master visual, keeping the system consistent from screen to handout.",
  },
  {
    img: "/assets/logo-piring-sewu.png",
    title: "Piring Sewu",
    cat: "Logo",
    desc: "Playful logotype for Piring Sewu, a homestyle food brand — a chef's hat perched on an expressive red script wordmark.",
  },
  {
    img: "/assets/logo-dapoer-lien.png",
    title: "Dapoer Lien",
    cat: "Logo",
    desc: "Warm, homey brand mark for Dapoer Lien's kitchen business, designed to feel personal and handmade.",
  },
  {
    img: "/assets/logo-1.png",
    title: "Kacang Ndeso",
    cat: "Logo",
    desc: "Vintage badge logo for Kacang Ndeso featuring a hand-drawn portrait mark — nostalgic, earthy, and instantly recognizable on packaging.",
  },
  {
    img: "/assets/logo-2.png",
    title: "Lens of Joy",
    cat: "Logo",
    desc: "Gradient logotype for Lens of Joy photography, with a camera aperture tucked into the wordmark as the brand's signature detail.",
  },
  {
    isVideo: true,
    img: "",
    title: "Bumper Video",
    cat: "Animation",
    desc: "Short animated bumper — a branded opener that gives video content a consistent, polished start.",
  },
];

export const CAROUSEL_IMAGES: { src: string; whiteBg?: boolean }[] = [
  { src: "/assets/poster-bogor-depok.png" },
  { src: "/assets/poster-architecture.png" },
  { src: "/assets/banner-cover.png" },
  { src: "/assets/logo-dapoer-lien.png", whiteBg: true },
  { src: "/assets/poster-final.png" },
  { src: "/assets/poster-why-binus.png" },
  { src: "/assets/logo-piring-sewu.png", whiteBg: true },
];
