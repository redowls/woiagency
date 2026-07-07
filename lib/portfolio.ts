export type PortfolioItem = {
  img: string;
  title: string;
  cat: string;
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
  { img: "/assets/poster-architecture.png", title: "Architecture Study Program", cat: "Poster & Flyer" },
  { img: "/assets/poster-final.png", title: "Scholarship Campaign", cat: "Poster & Flyer" },
  { img: "/assets/poster-hiring.png", title: "We're Hiring", cat: "Poster & Flyer" },
  { img: "/assets/poster-bogor-depok.png", title: "Bogor–Depok Feed", cat: "Poster & Flyer" },
  { img: "/assets/poster-beasiswa.png", title: "OSIS Scholarship", cat: "Poster & Flyer" },
  { img: "/assets/poster-why-binus.png", title: "Why BINUS (A3)", cat: "Poster & Flyer" },
  { img: "/assets/banner-cover.png", title: "Ambassador Cover", cat: "Banner" },
  { img: "/assets/banner-kemanggisan.png", title: "Kemanggisan Banner", cat: "Banner" },
  { img: "/assets/banner-80x200.png", title: "80×200 Banner", cat: "Banner" },
  { img: "/assets/banner-a5.png", title: "A5 Print Materials", cat: "Banner" },
  { img: "/assets/logo-piring-sewu.png", title: "Piring Sewu", cat: "Logo" },
  { img: "/assets/logo-dapoer-lien.png", title: "Dapoer Lien", cat: "Logo" },
  { img: "/assets/logo-1.png", title: "Kacang Ndeso", cat: "Logo" },
  { img: "/assets/logo-2.png", title: "Lens of Joy", cat: "Logo" },
  { isVideo: true, img: "", title: "Bumper Video", cat: "Animation" },
];

export const CAROUSEL_IMAGES: { src: string; whiteBg?: boolean }[] = [
  { src: "/assets/poster-bogor-depok.png" },
  { src: "/assets/poster-architecture.png" },
  { src: "/assets/banner-cover.png" },
  { src: "/assets/logo-dapoer-lien.png", whiteBg: true },
  { src: "/assets/poster-final.png" },
  { src: "/assets/poster-why-binus.png" },
  { src: "/assets/poster-hiring.png" },
  { src: "/assets/logo-piring-sewu.png", whiteBg: true },
];
