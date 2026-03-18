import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Services", "Materials", "Clients", "Strengths", "Contact"];

const SERVICES = [
  { icon: "⚙️", title: "MS Scrap Procurement", desc: "Structured buying and collection for ongoing industrial requirements." },
  { icon: "🔩", title: "Ferrous & Non-Ferrous Scrap Handling", desc: "Segregation, loading, and movement with rigorous site discipline." },
  { icon: "🏗️", title: "Machinery Scrap Purchasing", desc: "Assessment and purchase of machinery and asset scrap." },
  { icon: "🏭", title: "Industrial Scrap Clearance", desc: "Timely removal from plants, yards, and operational areas." },
  { icon: "🔧", title: "PEMB Construction Scrap Handling", desc: "Scrap segregation and removal for steel building works." },
  { icon: "🚇", title: "Flat & Metro Construction Scrap Handling", desc: "Jobsite scrap management aligned to project timelines." },
  { icon: "🏢", title: "Warehouse Scrap Management", desc: "Ongoing scrap control, storage handling, and dispatch." },
];

const MATERIALS = [
  {
    id: 1,
    title: "Electric Motor Scrap",
    subtitle: "Machinery & Equipment",
    tags: ["Industrial Motors", "Ferrous", "Copper Windings"],
    desc: "Decommissioned electric motors, pumps, and industrial drive units. We assess, purchase, and clear motor scrap from plants and operational yards.",
    accent: "#c0392b",
    img: "SCRAP2",
  },
  {
    id: 2,
    title: "Structural Steel & MS Scrap",
    subtitle: "Ferrous Scrap",
    tags: ["MS Angles", "Pipes", "Channels", "Structural Steel"],
    desc: "Mild steel sections, angle iron, pipes, channels, and structural members sourced from construction sites, industrial facilities, and warehouses.",
    accent: "#0a1a3a",
    img: "SCRAP1",
  },
  {
    id: 3,
    title: "Precision Metal Scrap",
    subtitle: "Non-Ferrous & Alloy",
    tags: ["Stainless Steel", "Alloy Tubes", "Machined Parts"],
    desc: "High-value precision-cut metal offcuts, stainless steel tubing, alloy components, and machined parts from manufacturing and engineering industries.",
    accent: "#2c3e50",
    img: "SCRAP3",
  },
];

const CLIENTS = [
  { name: "Larsen & Toubro", abbr: "L&T", sector: "Infrastructure" },
  { name: "Priya Engineering", abbr: "PE", sector: "Industrial Works" },
  { name: "KNR Construction", abbr: "KNR", sector: "Project Sites" },
  { name: "Kochi Metro Rail", abbr: "KMRL", sector: "Metro Infrastructure" },
  { name: "Bharat Petroleum", abbr: "BPCL", sector: "Petroleum" },
  { name: "Central Warehousing Corporation", abbr: "CWC", sector: "Warehousing" },
];

const STRENGTHS = [
  { stat: "20+", label: "Years Experience", sub: "Scrap & industrial services" },
  { stat: "7", label: "Service Lines", sub: "End-to-end coverage" },
  { stat: "2–3", label: "On-site Supervisors", sub: "Every project, every site" },
  { stat: "100%", label: "Transparent Ops", sub: "Accurate weighment always" },
];

// Image placeholders mapped to upload names
const IMG_URLS = {
  SCRAP1: "/SCRAP1.jpeg",
  SCRAP2: "/SCRAP2.jpeg",
  SCRAP3: "/SCRAP3.jpeg",
};

export default function SREnterprises() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [activeMaterial, setActiveMaterial] = useState(0);
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [e.target.id]: true }));
            setActiveNav(e.target.dataset.nav || activeNav);
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeNav]);

  const registerRef = (id, nav) => (el) => {
    if (el) {
      el.dataset.nav = nav;
      sectionRefs.current[id] = el;
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const isVisible = (id) => visibleSections[id];

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#fff", color: "#0a1a3a", margin: 0, padding: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .sr-font-display { font-family: 'Playfair Display', Georgia, serif; }
        .sr-font-body { font-family: 'Source Sans 3', 'Segoe UI', sans-serif; }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.2s; }
        .fade-up.d3 { transition-delay: 0.3s; }
        .fade-up.d4 { transition-delay: 0.4s; }
        .fade-up.d5 { transition-delay: 0.5s; }
        .fade-up.d6 { transition-delay: 0.6s; }
        .fade-up.d7 { transition-delay: 0.7s; }

        .sr-nav-link {
          cursor: pointer;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a1a3a;
          padding: 6px 0;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .sr-nav-link:hover, .sr-nav-link.active {
          color: #c0392b;
          border-bottom-color: #c0392b;
        }

        .sr-btn-primary {
          display: inline-block;
          background: #c0392b;
          color: #fff;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 36px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .sr-btn-primary:hover { background: #a93226; transform: translateY(-2px); }

        .sr-btn-outline {
          display: inline-block;
          background: transparent;
          color: #fff;
          font-family: 'Source Sans 3', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 13px 35px;
          border: 2px solid rgba(255,255,255,0.6);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .sr-btn-outline:hover { background: rgba(255,255,255,0.1); border-color: #fff; transform: translateY(-2px); }

        .service-card {
          border: 1px solid #e8ecf0;
          padding: 28px 24px;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          background: #fff;
        }
        .service-card:hover {
          border-color: #c0392b;
          box-shadow: 0 8px 32px rgba(192,57,43,0.1);
          transform: translateY(-4px);
        }

        .client-card {
          border: 2px solid #e8ecf0;
          padding: 20px 16px;
          text-align: center;
          transition: border-color 0.25s, transform 0.25s;
          background: #fff;
        }
        .client-card:hover {
          border-color: #0a1a3a;
          transform: translateY(-3px);
        }

        .material-tab {
          cursor: pointer;
          padding: 16px 20px;
          border-left: 3px solid transparent;
          transition: all 0.25s;
          background: transparent;
        }
        .material-tab:hover {
          background: rgba(192,57,43,0.04);
        }
        .material-tab.active-tab {
          border-left-color: #c0392b;
          background: rgba(192,57,43,0.06);
        }
        .material-img-wrap {
          overflow: hidden;
          position: relative;
          height: 360px;
        }
        .material-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .material-img-wrap:hover img {
          transform: scale(1.04);
        }

        .divider-red {
          width: 48px;
          height: 3px;
          background: #c0392b;
          margin: 16px 0 24px;
        }

        /* ─── RESPONSIVE ─── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .about-inner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .strengths-ops-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .materials-layout { display: grid; grid-template-columns: 280px 1fr; gap: 0; border: 1px solid #e8ecf0; }
        .hero-cta-row { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-badges { display: flex; gap: 32px; margin-top: 56px; flex-wrap: wrap; }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-inner-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
          .strengths-ops-grid { grid-template-columns: 1fr; }
          .materials-layout { grid-template-columns: 1fr; }
          .material-img-wrap { height: 260px; }
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hero-badges { gap: 20px; margin-top: 36px; }
          .section-pad { padding: 64px 16px !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .clients-grid { grid-template-columns: 1fr 1fr !important; }
          .strengths-grid { grid-template-columns: 1fr 1fr !important; }
          .cred-grid { grid-template-columns: 1fr !important; }
          .service-promise { flex-direction: column !important; align-items: flex-start !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .footer-nav { gap: 16px !important; }
          .footer-copy { text-align: left !important; }
          .material-tab { padding: 12px 16px; }
          .material-img-wrap { height: 220px; }
          .about-dark-box { grid-column: auto !important; }
          .contact-cta-hide { display: none; }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }

        @media (max-width: 480px) {
          .hero-cta-row { flex-direction: column; }
          .hero-cta-row a, .hero-cta-row span { text-align: center; }
          .strengths-grid { grid-template-columns: 1fr !important; }
          .clients-grid { grid-template-columns: 1fr !important; }
        }

        .mobile-nav-open { display: block !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
        borderBottom: "1px solid #e8ecf0",
        boxShadow: scrolled ? "0 2px 20px rgba(10,26,58,0.08)" : "none",
        transition: "box-shadow 0.3s"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => scrollTo("home")}>
            <div style={{
              width: 38, height: 38, background: "#0a1a3a", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1rem", color: "#c0392b"
            }}>SR</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.95rem", color: "#0a1a3a", lineHeight: 1.1 }}>S.R. ENTERPRISES</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.6rem", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scrap & Industrial Services</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 22, alignItems: "center" }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className={`sr-nav-link${activeNav === l ? " active" : ""}`} onClick={() => scrollTo(l.toLowerCase())}>
                {l}
              </span>
            ))}
          </div>

          <a className="desktop-cta sr-btn-primary" href="tel:+919790401015" style={{ fontSize: "0.75rem", padding: "9px 18px", flexShrink: 0 }}>
            Get Quote
          </a>

          {/* Mobile burger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8
          }}>
            <span style={{ width: 24, height: 2, background: "#0a1a3a", display: "block", transition: "0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
            <span style={{ width: 24, height: 2, background: "#0a1a3a", display: "block", opacity: menuOpen ? 0 : 1, transition: "0.3s" }} />
            <span style={{ width: 24, height: 2, background: "#0a1a3a", display: "block", transition: "0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="mobile-nav mobile-nav-open" style={{ background: "#fff", borderTop: "1px solid #e8ecf0", padding: "8px 20px 16px" }}>
            {NAV_LINKS.map((l) => (
              <div key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
                padding: "12px 0", borderBottom: "1px solid #f0f0f0", fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600, fontSize: "0.88rem", color: "#0a1a3a", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase"
              }}>{l}</div>
            ))}
            <a href="tel:+919790401015" className="sr-btn-primary" style={{ display: "block", textAlign: "center", marginTop: 12 }}>
              📞 Call Now
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" ref={registerRef("home", "Home")} style={{
        minHeight: "100vh", background: "linear-gradient(135deg, #0a1a3a 0%, #0d2254 60%, #0a1a3a 100%)",
        display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 64
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "45%", height: "100%",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)",
          pointerEvents: "none"
        }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(192,57,43,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 60, right: "10%", width: 200, height: 200, border: "1px solid rgba(255,255,255,0.06)", transform: "rotate(45deg)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 20px", position: "relative", width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
              background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)",
              padding: "6px 14px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem",
              color: "#e87c73", letterSpacing: "0.12em", textTransform: "uppercase"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c0392b", display: "inline-block", flexShrink: 0 }} />
              Tirunelveli, Tamil Nadu · GST: 33BZEPS6674QZC
            </div>

            <h1 className="sr-font-display" style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 8, letterSpacing: "-0.02em" }}>
              S.R.
            </h1>
            <h1 className="sr-font-display" style={{ fontSize: "clamp(2.4rem, 8vw, 5rem)", fontWeight: 900, color: "#c0392b", lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em" }}>
              ENTERPRISES
            </h1>

            <div style={{ width: 60, height: 3, background: "#c0392b", marginBottom: 28 }} />

            <p className="sr-font-body" style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 16, fontWeight: 300 }}>
              Dealers in all kinds of plant & machinery — ferrous & non-ferrous scrap.
            </p>
            <p className="sr-font-body" style={{ fontSize: "clamp(0.88rem, 2.5vw, 1rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40 }}>
              Trusted partner for MS scrap, machinery scrap, industrial scrap clearance, and bulk scrap handling with <strong style={{ color: "#e87c73", fontWeight: 700 }}>20+ years</strong> of experience.
            </p>

            <div className="hero-cta-row">
              <a className="sr-btn-primary" href="tel:+919790401015">Call: +91 97904 01015</a>
              <span className="sr-btn-outline" onClick={() => scrollTo("services")} style={{ cursor: "pointer" }}>Our Services</span>
            </div>

            <div className="hero-badges">
              {[["⚖️", "Transparent Pricing"], ["🚛", "Strong Logistics"], ["⚡", "Quick Payment"]].map(([ic, lb]) => (
                <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.1rem" }}>{ic}</span>
                  <span className="sr-font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span className="sr-font-body" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" ref={registerRef("about", "About")} className="section-pad" style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="about-grid">
            <div className={`fade-up${isVisible("about") ? " visible" : ""}`}>
              <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", lineHeight: 1.15, marginBottom: 0 }}>Built on Trust.</h2>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", lineHeight: 1.15, marginBottom: 4 }}>
                Powered by <span style={{ color: "#c0392b" }}>Experience.</span>
              </h2>
              <div className="divider-red" />
              <p className="sr-font-body" style={{ fontSize: "1rem", color: "#444", lineHeight: 1.8, marginBottom: 20 }}>
                S.R. Enterprises is a well-established scrap trading and industrial services company with over <strong>20 years of industry experience</strong>, serving industrial, infrastructure, and construction sectors.
              </p>
              <p className="sr-font-body" style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.8, marginBottom: 32 }}>
                A family-driven enterprise led by experienced professionals, we have successfully executed multiple private and government projects — delivering efficient operations and maintaining high levels of client satisfaction.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Transparent", "Reliable", "Fast"].map(tag => (
                  <span key={tag} className="sr-font-body" style={{
                    border: "1.5px solid #0a1a3a", padding: "6px 16px", fontSize: "0.78rem",
                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a1a3a"
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="about-inner-grid">
              {[
                { icon: "🔬", title: "What We Specialize In", items: ["Ferrous & Non-Ferrous scrap handling", "MS scrap and machinery procurement", "Industrial scrap management"], dark: true },
                { icon: "🏛️", title: "Delivery & Credibility", items: ["Family-driven, expert-led enterprise", "Multiple govt & private projects", "Transparent operations always"], dark: false },
              ].map(({ icon, title, items, dark }, i) => (
                <div key={i} className={`fade-up d${i + 2}${isVisible("about") ? " visible" : ""}${dark ? " about-dark-box" : ""}`} style={{
                  background: dark ? "#0a1a3a" : "#fff",
                  border: !dark ? "2px solid #e8ecf0" : "none",
                  padding: "24px 20px",
                  gridColumn: dark ? "1/3" : "auto"
                }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: 10 }}>{icon}</div>
                  <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.85rem", color: dark ? "#fff" : "#0a1a3a", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</div>
                  {items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#c0392b", fontWeight: 700, fontSize: "0.85rem", marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span className="sr-font-body" style={{ fontSize: "0.88rem", color: dark ? "rgba(255,255,255,0.8)" : "#555", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className={`fade-up d4${isVisible("about") ? " visible" : ""}`} style={{ background: "#c0392b", padding: "24px 20px" }}>
                <div className="sr-font-display" style={{ fontSize: "2.2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>20+</div>
                <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Years of Industry Experience</div>
              </div>

              <div className={`fade-up d5${isVisible("about") ? " visible" : ""}`} style={{ background: "#f7f8fa", border: "2px solid #e8ecf0", padding: "24px 20px" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🛡️</div>
                <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0a1a3a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Core Values</div>
                <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.6 }}>Transparency · Reliability · Clear Communication · Consistent Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" ref={registerRef("services", "Services")} className="section-pad" style={{ padding: "100px 24px", background: "#f7f8fa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={`fade-up${isVisible("services") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Services</div>
            <h2 className={`fade-up d1${isVisible("services") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 8 }}>
              End-to-End Scrap & Site Solutions
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
            <p className={`fade-up d2${isVisible("services") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.95rem", color: "#777", marginTop: 18, maxWidth: 580, margin: "18px auto 0", lineHeight: 1.7 }}>
              Comprehensive services for industrial plants, warehouses, and construction sites.
            </p>
          </div>

          <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className={`service-card fade-up d${Math.min(i + 1, 7)}${isVisible("services") ? " visible" : ""}`}>
                <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>{s.icon}</div>
                <h3 className="sr-font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "#0a1a3a", marginBottom: 8 }}>{s.title}</h3>
                <p className="sr-font-body" style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className={`fade-up service-promise${isVisible("services") ? " visible" : ""}`} style={{ marginTop: 44, background: "#0a1a3a", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div className="sr-font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>Service Promise</div>
              <div className="sr-font-display" style={{ fontSize: "1.8rem", fontWeight: 900, color: "#c0392b" }}>Clean. Safe. Efficient.</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {["Safety Focus", "On-Time", "Accurate", "Supervised"].map(tag => (
                <div key={tag} className="sr-font-body" style={{ padding: "7px 16px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MATERIALS WE DEAL IN ── */}
      <section id="materials" ref={registerRef("materials", "Materials")} className="section-pad" style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={`fade-up${isVisible("materials") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Scrap Gallery</div>
            <h2 className={`fade-up d1${isVisible("materials") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 4 }}>
              Materials We <span style={{ color: "#c0392b" }}>Deal In</span>
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
            <p className={`fade-up d2${isVisible("materials") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.95rem", color: "#777", marginTop: 18, maxWidth: 600, margin: "18px auto 0", lineHeight: 1.7 }}>
              From electric motor scrap to structural steel and precision alloys — we handle it all with expertise and transparent pricing.
            </p>
          </div>

          {/* Desktop: tabbed layout | Mobile: stacked cards */}
          <div className={`fade-up d2${isVisible("materials") ? " visible" : ""}`}>
            {/* Tab selector — desktop */}
            <div style={{ display: "none" }} className="materials-desktop-tabs" />

            {/* Main materials layout */}
            <div className="materials-layout" style={{ overflow: "hidden" }}>
              {/* Tab list */}
              <div style={{ borderRight: "1px solid #e8ecf0", background: "#f7f8fa" }}>
                <div className="sr-font-body" style={{ padding: "14px 20px", fontSize: "0.7rem", color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "1px solid #e8ecf0" }}>
                  Select Material
                </div>
                {MATERIALS.map((m, i) => (
                  <div key={m.id} className={`material-tab${activeMaterial === i ? " active-tab" : ""}`} onClick={() => setActiveMaterial(i)}>
                    <div className="sr-font-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: activeMaterial === i ? "#c0392b" : "#0a1a3a", marginBottom: 4 }}>{m.title}</div>
                    <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.subtitle}</div>
                  </div>
                ))}
                <div style={{ padding: "20px", borderTop: "1px solid #e8ecf0", marginTop: "auto" }}>
                  <a href="tel:+919790401015" className="sr-btn-primary" style={{ display: "block", textAlign: "center", fontSize: "0.78rem", padding: "10px 16px" }}>
                    Get Quote
                  </a>
                </div>
              </div>

              {/* Content panel */}
              {MATERIALS.map((m, i) => (
                <div key={m.id} style={{ display: activeMaterial === i ? "block" : "none" }}>
                  <div className="material-img-wrap">
                    <img
                      src={`/mnt/user-data/uploads/${m.img === "SCRAP1" ? "SCRAP1" : m.img === "SCRAP2" ? "SCRAP2" : "SCRAP3"}.jpeg`}
                      alt={m.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.style.background = "#0a1a3a";
                        e.target.parentNode.style.display = "flex";
                        e.target.parentNode.style.alignItems = "center";
                        e.target.parentNode.style.justifyContent = "center";
                      }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "linear-gradient(to top, rgba(10,26,58,0.85) 0%, transparent 100%)",
                      padding: "24px 24px 20px"
                    }}>
                      <div className="sr-font-body" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{m.subtitle}</div>
                      <div className="sr-font-display" style={{ color: "#fff", fontSize: "1.4rem", fontWeight: 700 }}>{m.title}</div>
                    </div>
                  </div>
                  <div style={{ padding: "28px 28px 24px" }}>
                    <p className="sr-font-body" style={{ fontSize: "0.95rem", color: "#444", lineHeight: 1.8, marginBottom: 20 }}>{m.desc}</p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {m.tags.map(tag => (
                        <span key={tag} className="sr-font-body" style={{
                          background: "#f7f8fa", border: "1px solid #e8ecf0",
                          padding: "5px 14px", fontSize: "0.78rem", fontWeight: 600,
                          color: "#0a1a3a", letterSpacing: "0.06em"
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: show all as stacked cards */}
            <div style={{ marginTop: 0 }}>
              <style>{`
                @media (max-width: 900px) {
                  .materials-layout { display: none !important; }
                  .materials-mobile { display: flex !important; }
                }
                @media (min-width: 901px) {
                  .materials-mobile { display: none !important; }
                }
              `}</style>
              <div className="materials-mobile" style={{ display: "none", flexDirection: "column", gap: 24 }}>
                {MATERIALS.map((m) => (
                  <div key={m.id} style={{ border: "1px solid #e8ecf0", overflow: "hidden" }}>
                    <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                      <img
                        src={`/mnt/user-data/uploads/${m.img}.jpeg`}
                        alt={m.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; e.target.parentNode.style.background = "#0a1a3a"; }}
                      />
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "linear-gradient(to top, rgba(10,26,58,0.85) 0%, transparent 100%)",
                        padding: "20px 20px 16px"
                      }}>
                        <div className="sr-font-body" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>{m.subtitle}</div>
                        <div className="sr-font-display" style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>{m.title}</div>
                      </div>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <p className="sr-font-body" style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7, marginBottom: 16 }}>{m.desc}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {m.tags.map(tag => (
                          <span key={tag} className="sr-font-body" style={{
                            background: "#f7f8fa", border: "1px solid #e8ecf0",
                            padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, color: "#0a1a3a"
                          }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className={`fade-up d3${isVisible("materials") ? " visible" : ""}`} style={{
            marginTop: 40, background: "#f7f8fa", border: "1px solid #e8ecf0",
            padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
          }}>
            <div>
              <div className="sr-font-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0a1a3a" }}>Don't see your material type?</div>
              <div className="sr-font-body" style={{ fontSize: "0.88rem", color: "#666", marginTop: 4 }}>We deal in a wide range of ferrous, non-ferrous, and mixed industrial scrap. Call us to discuss.</div>
            </div>
            <a href="tel:+919790401015" className="sr-btn-primary" style={{ fontSize: "0.85rem", flexShrink: 0 }}>
              📞 Enquire Now
            </a>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section id="clients" ref={registerRef("clients", "Clients")} className="section-pad" style={{ padding: "100px 24px", background: "#f7f8fa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={`fade-up${isVisible("clients") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Clients & Projects</div>
            <h2 className={`fade-up d1${isVisible("clients") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 4 }}>Trusted by Industry &</h2>
            <h2 className={`fade-up d2${isVisible("clients") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#c0392b" }}>Infrastructure Leaders</h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
          </div>

          <div className="clients-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
            {CLIENTS.map((c, i) => (
              <div key={c.name} className={`client-card fade-up d${Math.min(i + 1, 6)}${isVisible("clients") ? " visible" : ""}`}>
                <div style={{
                  width: 52, height: 52, background: "#0a1a3a", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.85rem", color: "#c0392b",
                  margin: "0 auto 14px"
                }}>{c.abbr.length > 3 ? c.abbr.slice(0,3) : c.abbr}</div>
                <div className="sr-font-display" style={{ fontWeight: 700, color: "#0a1a3a", fontSize: "0.9rem", marginBottom: 5 }}>{c.name}</div>
                <div className="sr-font-body" style={{ fontSize: "0.72rem", color: "#c0392b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.sector}</div>
              </div>
            ))}
          </div>

          <div className="cred-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {[
              { icon: "📋", title: "Government Tender Participation", desc: "Executed contracts through structured processes and clear documentation." },
              { icon: "🤝", title: "Secured Service Contracts", desc: "Long-term partnerships with leading industrial and infrastructure players." },
              { icon: "⚖️", title: "Transparent & Accurate Operations", desc: "Every transaction backed by precise weighment and clear communication." },
            ].map((item, i) => (
              <div key={item.title} className={`fade-up d${i + 2}${isVisible("clients") ? " visible" : ""}`} style={{ background: "#fff", padding: "24px 20px", borderLeft: "4px solid #c0392b" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 10 }}>{item.icon}</div>
                <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0a1a3a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.title}</div>
                <div className="sr-font-body" style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRENGTHS ── */}
      <section id="strengths" ref={registerRef("strengths", "Strengths")} className="section-pad" style={{ padding: "100px 24px", background: "#0a1a3a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className={`fade-up${isVisible("strengths") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#e87c73", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Strengths & Team</div>
            <h2 className={`fade-up d1${isVisible("strengths") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#fff" }}>
              Execution Strength You Can <span style={{ color: "#c0392b" }}>Depend On</span>
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
          </div>

          <div className="strengths-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
            {STRENGTHS.map((s, i) => (
              <div key={s.label} className={`fade-up d${i + 1}${isVisible("strengths") ? " visible" : ""}`} style={{ borderTop: "4px solid #c0392b", padding: "28px 22px", background: "rgba(255,255,255,0.04)" }}>
                <div className="sr-font-display" style={{ fontSize: "2.8rem", fontWeight: 900, color: "#c0392b", lineHeight: 1, marginBottom: 8 }}>{s.stat}</div>
                <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{s.label}</div>
                <div className="sr-font-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="strengths-ops-grid">
            <div className={`fade-up${isVisible("strengths") ? " visible" : ""}`} style={{ background: "rgba(255,255,255,0.05)", padding: "28px 24px" }}>
              <div className="sr-font-body" style={{ fontWeight: 700, color: "#c0392b", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Key Strengths</div>
              <div className="sr-font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: 22 }}>Operational Confidence</div>
              {[
                ["⚖️", "Transparent operations", "Accurate weighment and clear communication"],
                ["👷", "Reliable manpower supply", "Supervised deployment for site needs"],
                ["🚛", "Logistics execution", "Pickup · loading · dispatch coordination"],
              ].map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.1rem", marginTop: 2 }}>{ic}</span>
                  <div>
                    <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem", marginBottom: 3 }}>{t}</div>
                    <div className="sr-font-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`fade-up d2${isVisible("strengths") ? " visible" : ""}`} style={{ background: "#c0392b", padding: "28px 24px" }}>
              <div className="sr-font-body" style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>How We Deliver</div>
              <div className="sr-font-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: 22 }}>Operational Model</div>
              {[
                ["Site-first execution", "On-ground supervision and daily coordination"],
                ["Clear scope & coordination", "Site assessment · allocation · reporting"],
                ["Logistics-backed movement", "Field-ready pickup, loading & dispatch"],
                ["Transparent pricing", "Process-driven, documented, compliance-aware"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 14 }}>
                  <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem", marginBottom: 3 }}>{t}</div>
                  <div className="sr-font-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" ref={registerRef("contact", "Contact")} className="section-pad" style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="contact-grid">
            <div className={`fade-up${isVisible("contact") ? " visible" : ""}`}>
              <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</div>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 4 }}>Contact Us</h2>
              <div className="divider-red" />
              <p className="sr-font-body" style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.8, marginBottom: 32 }}>
                Reach out for scrap procurement, machinery scrap purchasing, industrial clearance, and bulk scrap handling. We ensure clear evaluation and timely settlements.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { bg: "#0a1a3a", icon: "👤", label: "Owner / Primary Contact", main: "R. Sheik Oli Badusha", sub: "Tirunelveli, Tamil Nadu", href: null },
                  { bg: "#c0392b", icon: "📞", label: "Mobile · Call for quotations & pickups", main: "+91 9790401015", sub: null, href: "tel:+919790401015", red: true },
                  { bg: "#f7f8fa", border: "2px solid #e8ecf0", icon: "📋", label: "GST · For billing & documentation", main: "33BZEPS6674QZC", sub: null, href: null },
                  { bg: "#f7f8fa", border: "2px solid #e8ecf0", icon: "📍", label: "Address", main: "37D, Krishnaperi (opp. Jeyam Mahal Kodeeswaran Nagar)", sub: "Tirunelveli Town – 627006, Tamil Nadu", href: null },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, background: item.bg, border: item.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem" }}>{item.icon}</div>
                    <div>
                      <div className="sr-font-body" style={{ fontSize: "0.72rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="sr-font-display" style={{ fontWeight: 700, color: "#c0392b", fontSize: "1.2rem", textDecoration: "none" }}>{item.main}</a>
                      ) : (
                        <div className="sr-font-display" style={{ fontWeight: 700, color: "#0a1a3a", fontSize: "1rem", lineHeight: 1.4 }}>{item.main}</div>
                      )}
                      {item.sub && <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "#666", marginTop: 2 }}>{item.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <a className="sr-btn-primary" href="tel:+919790401015" style={{ marginTop: 36, display: "inline-block" }}>
                📞 Call for Quick Quote
              </a>
            </div>

            <div className={`fade-up d2 contact-cta-hide${isVisible("contact") ? " visible" : ""}`}>
              <div style={{ background: "#0a1a3a", padding: "40px 32px" }}>
                <div className="sr-font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>Ready to clear your scrap?</div>
                <div className="sr-font-display" style={{ fontSize: "1rem", fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>Get a transparent quote within hours.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { icon: "🏭", title: "Industrial Scrap Clearance", desc: "Plants, yards, and operational areas" },
                    { icon: "⚙️", title: "Machinery Scrap Purchase", desc: "Accurate assessment & fast payment" },
                    { icon: "🏗️", title: "Construction Scrap Handling", desc: "PEMB, metro & flat construction sites" },
                    { icon: "📦", title: "Bulk Scrap Procurement", desc: "MS, ferrous & non-ferrous materials" },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", alignItems: "center" }}>
                      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem", marginBottom: 2 }}>{item.title}</div>
                        <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                      </div>
                      <span style={{ color: "#c0392b", fontSize: "1rem" }}>→</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, padding: "14px 18px", background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)" }}>
                  <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quick Response Guaranteed</div>
                  <div className="sr-font-body" style={{ color: "#e87c73", fontWeight: 700, fontSize: "1.05rem" }}>+91 9790401015</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#050f1f", padding: "36px 20px" }}>
        <div className="footer-inner" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, background: "#0a1a3a", border: "1px solid #1a2d5a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.85rem", color: "#c0392b" }}>SR</div>
              <div className="sr-font-display" style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>S.R. ENTERPRISES</div>
            </div>
            <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              Scrap & Industrial Services · Tirunelveli, Tamil Nadu<br />
              GST: 33BZEPS6674QZC
            </div>
          </div>

          <div className="footer-nav" style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {NAV_LINKS.map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} className="sr-font-body" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#c0392b"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{l}</span>
            ))}
          </div>

          <div className="footer-copy" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", fontFamily: "'Source Sans 3', sans-serif", textAlign: "right" }}>
            © 2026 S.R. Enterprises<br />All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}