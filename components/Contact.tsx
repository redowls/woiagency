export default function Contact() {
  return (
    <div
      id="contact"
      className="woi-contact-section"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 110%,rgba(10,72,255,.35),transparent 65%),#050d21",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 18,
        }}
      >
        <img
          src="/assets/woi-logo-new.png"
          alt=""
          style={{ width: 72, height: 72, borderRadius: 20, objectFit: "cover" }}
        />
        <h2 className="woi-contact-h2">Ready to Create Together?</h2>
        <p
          style={{
            margin: 0,
            fontSize: 15.5,
            color: "#93a4c8",
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Tell us what your brand needs — the first consultation is free, with
          no commitment.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <a
            href="mailto:waveofinnovation.agency@gmail.com"
            className="woi-contact-pill-solid"
          >
            ✉ waveofinnovation.agency@gmail.com
          </a>
          <a
            href="https://wa.me/6289696116932?text=Halo%20WOI%20Agency,%20saya%20tertarik%20dengan%20layanan%20Anda."
            target="_blank"
            rel="noopener noreferrer"
            className="woi-contact-pill-outline"
          >
            ✆ +62 896-9611-6932
          </a>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <a
            href="https://www.instagram.com/woi.agency?igsh=bDZpb2hxOGxmajdu&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="woi-social"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@woi.agency?is_from_webapp=1&sender_device=pc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="woi-social"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
              <path d="M16.5 2h-3v13.5a2.5 2.5 0 1 1-2.5-2.5c.17 0 .34.02.5.05V9.9a5.5 5.5 0 1 0 5 5.48V8.2a7.5 7.5 0 0 0 4 1.15V6.35A4.5 4.5 0 0 1 16.5 2z" />
            </svg>
          </a>
        </div>
      </div>
      <p
        style={{
          margin: "64px 0 0",
          padding: "24px 0",
          borderTop: "1px solid rgba(255,255,255,.08)",
          fontSize: 13,
          color: "#5f6f92",
          textAlign: "center",
        }}
      >
        © 2026 WOI Agency — Wave of Innovation. All rights reserved.
      </p>
    </div>
  );
}
