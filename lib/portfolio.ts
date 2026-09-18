import { liveViews } from "@/lib/insights";

export type PortfolioItem = {
  img: string;
  title: string;
  cat: string;
  desc: string;
  isVideo?: boolean;
  /** source for isVideo items; falls back to DEFAULT_VIDEO */
  video?: string;
  /** social proof, e.g. "4.2M" — renders as a views badge on the card */
  views?: string;
  /** where the work is published (Instagram reel, etc.) */
  link?: string;
  /** brand the work was made for — groups "Our Clients" into sub-tabs */
  client?: string;
};

export const CATEGORIES = [
  "All",
  "Highlight",
  "Poster & Flyer",
  "Banner",
  "Logo",
  "Animation",
  "Our Clients",
] as const;

export const DEFAULT_VIDEO = "/assets/video-bumper.mp4";

const ITEMS: PortfolioItem[] = [
  // kept first so it opens both the "All" grid and the "Highlight" tab
  {
    isVideo: true,
    img: "",
    video: "/assets/Highlight/highlight-1.mp4",
    title: "RESULT vs BTS Reel",
    cat: "Highlight",
    desc: "Our most-watched piece: a split-screen reel that puts the finished content up top and the behind-the-scenes process underneath — the edit, the shot list, the work nobody usually sees.",
    views: "4.2M",
    link: "https://www.instagram.com/reel/DdBbDFIBIap/",
  },
  {
    isVideo: true,
    img: "",
    video: "/assets/Highlight/highlight-2.mp4",
    title: "DIY Phone Stabilizer",
    cat: "Highlight",
    desc: "A gear-hack reel: two phones and two rubber bands turned into a stabilizer rig, then the horizontal-versus-vertical results it produces on a real shoot. Practical, cheap, and built for saves and shares.",
    views: "14.4K",
    link: "https://www.instagram.com/reel/DdQ4gFwoNI6/",
  },
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
  {
    img: "/assets/ngefamous/shopee.png",
    title: "Shopee",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Social campaign visual for Shopee, built for the NGEFAMOUS content series — bold, feed-native art direction made to stop the scroll.",
  },
  {
    img: "/assets/ngefamous/yamaha.png",
    title: "Yamaha",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Yamaha brand content for the NGEFAMOUS series, pairing a hero product shot with punchy campaign typography.",
  },
  {
    img: "/assets/ngefamous/nco-parfume.png",
    title: "NCO Parfume",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Product-led feed design for NCO Parfume — clean styling that lets the bottle carry the frame while the brand voice sits underneath.",
  },
  {
    img: "/assets/ngefamous/teh-tjap-solo.png",
    title: "Teh Tjap Solo",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Heritage-meets-modern campaign visual for Teh Tjap Solo, keeping the classic brand identity intact in a contemporary social layout.",
  },
  {
    img: "/assets/ngefamous/heygurl.png",
    title: "Heygurl",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Playful, high-energy feed design for Heygurl — colour-forward styling tuned to a young, trend-driven audience.",
  },
  {
    isVideo: true,
    img: "",
    video: "/assets/ngefamous/reel.mp4",
    title: "NGEFAMOUS Reel",
    cat: "Our Clients",
    client: "NGEFAMOUS",
    desc: "Vertical video edit for the NGEFAMOUS campaign — fast-cut, sound-led storytelling built for Reels and TikTok.",
  },
  {
    img: "/assets/ownMyNails/logo.PNG",
    title: "Own My Nails",
    cat: "Our Clients",
    client: "Own My Nails",
    desc: "Logo and brand mark for Own My Nails by Michelle Aurell — we set a quiet, editorial serif logotype inside an open circle, with the founder's name tracing the curve. Restrained on purpose: it lets the nail art be the colour, and holds up on a salon window and an Instagram profile alike.",
  },
];

/** brands under "Our Clients", in first-seen order — drives the sub-filter pills */
export const CLIENTS = Array.from(
  new Set(ITEMS.filter((it) => it.cat === "Our Clients" && it.client).map((it) => it.client as string)),
);

// view badges come from data/insights.json when the reel is found there;
// the literal is only the fallback for a post the sync has not seen
export const PORTFOLIO_ITEMS: PortfolioItem[] = ITEMS.map((it) => ({
  ...it,
  views: liveViews(it.link) ?? it.views,
}));

export const CAROUSEL_IMAGES: { src: string; whiteBg?: boolean }[] = [
  { src: "/assets/poster-bogor-depok.png" },
  { src: "/assets/poster-architecture.png" },
  { src: "/assets/banner-cover.png" },
  { src: "/assets/logo-dapoer-lien.png", whiteBg: true },
  { src: "/assets/poster-final.png" },
  { src: "/assets/poster-why-binus.png" },
  { src: "/assets/logo-piring-sewu.png", whiteBg: true },
];
