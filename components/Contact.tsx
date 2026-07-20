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
            href="https://instagram.com/woiagency"
            target="_blank"
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
            href="https://youtube.com/@woiagency"
            target="_blank"
            aria-label="YouTube"
            className="woi-social"
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="#fff">
              <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="2" />
              <path d="M10 9.5v5l4.5-2.5z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/company/woiagency"
            target="_blank"
            aria-label="LinkedIn"
            className="woi-social"
          >
            in
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
