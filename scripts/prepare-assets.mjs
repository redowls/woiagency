// Copies and optimizes assets from the local `portfolio-assets` folder into
// public/assets using the names the design reference expects. Images are
// resized down (some sources are 15MB+ print-resolution PNGs) so the site
// ships web-sized files. Run: npm run prepare-assets
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SRC = process.env.ASSETS_SRC ?? "D:/Woi Agency/portfolio-assets";
const OUT = fileURLToPath(new URL("../public/assets/", import.meta.url));

const MAX_EDGE = 1400;

const images = {
  "woi-logo-new.png": "LOGO.png",
  "poster-architecture.png": "DESIGN/POSTER- FLYER/ARCHITECTURE.png",
  "poster-final.png": "DESIGN/POSTER- FLYER/FINAL.png",
  "poster-hiring.png": "DESIGN/POSTER- FLYER/FEED WE_RE HIRING.png",
  "poster-bogor-depok.png": "DESIGN/POSTER- FLYER/FEED BOGOR DEPOK.png",
  "poster-beasiswa.png": "DESIGN/POSTER- FLYER/BEASISWA OSIS.png",
  "poster-why-binus.png": "DESIGN/POSTER- FLYER/WHY BINUS A3.png",
  "banner-cover.png": "DESIGN/BANNER/COVER OPSI 1.png",
  "banner-kemanggisan.png": "DESIGN/BANNER/BINUS @KEMANGGISAN.png",
  "banner-80x200.png": "DESIGN/BANNER/80X200.png",
  "banner-a5.png": "DESIGN/BANNER/A5 CETAK.png",
  "logo-piring-sewu.png": "DESIGN/LOGO/LOGO FIX.png",
  "logo-dapoer-lien.png": "DESIGN/LOGO/DAPOER LIEN v2.png",
  "logo-1.png": "DESIGN/LOGO/LOGO 1.png",
  "logo-2.png": "DESIGN/LOGO/LOGO.png",
};

const videos = {
  "video-bumper.mp4": "DESIGN/DESIGN ANIMASI/VIDEO BUMPER.mp4",
};

await mkdir(OUT, { recursive: true });

for (const [out, src] of Object.entries(images)) {
  const from = path.join(SRC, src);
  const to = path.join(OUT, out);
  await sharp(from)
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(to);
  console.log(`ok  ${out}  <-  ${src}`);
}

for (const [out, src] of Object.entries(videos)) {
  await copyFile(path.join(SRC, src), path.join(OUT, out));
  console.log(`ok  ${out}  <-  ${src}`);
}

console.log("done");
