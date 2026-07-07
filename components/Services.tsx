const SERVICES = [
  {
    icon: "Aa",
    title: "Graphic Design",
    body: "Posters, flyers, and banners for print and digital promotion.",
  },
  {
    icon: "◆",
    title: "Logo & Branding",
    body: "A strong, consistent, and memorable visual identity.",
  },
  {
    icon: "▶",
    title: "Motion Graphics",
    body: "Bumper videos and animation to strengthen your digital content.",
  },
  {
    icon: "＠",
    title: "Social Media Management",
    body: "End-to-end content planning and social media management.",
  },
  {
    icon: "✦",
    title: "Content Creation",
    body: "Photo, video, and copywriting content made for your brand.",
  },
];

export default function Services() {
  return (
    <div
      id="services"
      className="woi-section"
      style={{ background: "#081530", scrollMarginTop: 80 }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#01BDF9",
          textAlign: "center",
        }}
      >
        Services
      </p>
      <h2 className="woi-h2">What We Do</h2>
      <p
        style={{
          margin: "0 auto 40px",
          fontSize: 15,
          color: "#93a4c8",
          textAlign: "center",
          maxWidth: 540,
          lineHeight: 1.65,
        }}
      >
        Five core services to build and grow your brand.
      </p>
      <div className="woi-services-grid">
        {SERVICES.map((s) => (
          <div key={s.title} className="woi-service-card">
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: "linear-gradient(135deg,#0a48ff,#01BDF9)",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {s.icon}
            </div>
            <h3 style={{ margin: "6px 0 0", fontSize: 17, fontWeight: 700 }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: "#93a4c8" }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
