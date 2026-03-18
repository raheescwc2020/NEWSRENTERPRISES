import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Home", "About", "Services", "Clients", "Strengths", "Contact"];

const SERVICES = [
  { icon: "⚙️", title: "MS Scrap Procurement", desc: "Structured buying and collection for ongoing industrial requirements." },
  { icon: "🔩", title: "Ferrous & Non-Ferrous Scrap Handling", desc: "Segregation, loading, and movement with rigorous site discipline." },
  { icon: "🏗️", title: "Machinery Scrap Purchasing", desc: "Assessment and purchase of machinery and asset scrap." },
  { icon: "🏭", title: "Industrial Scrap Clearance", desc: "Timely removal from plants, yards, and operational areas." },
  { icon: "🔧", title: "PEMB Construction Scrap Handling", desc: "Scrap segregation and removal for steel building works." },
  { icon: "🚇", title: "Flat & Metro Construction Scrap Handling", desc: "Jobsite scrap management aligned to project timelines." },
  { icon: "🏢", title: "Warehouse Scrap Management", desc: "Ongoing scrap control, storage handling, and dispatch." },
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

export default function SREnterprises() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  },  [activeNav]);

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
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  },  [activeNav]);

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
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a1a3a;
          padding: 6px 0;
          border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          text-decoration: none;
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
          padding: 24px;
          text-align: center;
          transition: border-color 0.25s, transform 0.25s;
          background: #fff;
        }
        .client-card:hover {
          border-color: #0a1a3a;
          transform: translateY(-3px);
        }

        .stat-card {
          border-top: 4px solid #c0392b;
          padding: 32px 24px 24px;
          background: #fff;
          transition: box-shadow 0.25s;
        }
        .stat-card:hover { box-shadow: 0 8px 32px rgba(10,26,58,0.1); }

        .divider-red {
          width: 48px;
          height: 3px;
          background: #c0392b;
          margin: 16px 0 24px;
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
        borderBottom: scrolled ? "1px solid #e8ecf0" : "1px solid #e8ecf0",
        boxShadow: scrolled ? "0 2px 20px rgba(10,26,58,0.08)" : "none",
        transition: "box-shadow 0.3s"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <div style={{
              width: 40, height: 40, background: "#0a1a3a", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.1rem", color: "#c0392b", letterSpacing: "0.05em"
            }}>SR</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem", color: "#0a1a3a", lineHeight: 1.1 }}>S.R. ENTERPRISES</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.65rem", color: "#888", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scrap & Industrial Services</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", gap: 28 }}>
            {NAV_LINKS.map((l) => (
              <span key={l} className={`sr-nav-link${activeNav === l ? " active" : ""}`} onClick={() => scrollTo(l.toLowerCase())}>
                {l}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a className="desktop-nav sr-btn-primary" href="tel:+919790401015" style={{ fontSize: "0.78rem", padding: "10px 22px" }}>
            Get Quote
          </a>

          {/* Mobile burger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8
          }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 24, height: 2, background: "#0a1a3a", display: "block", transition: "0.3s" }} />)}
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <div className="mobile-nav" style={{ background: "#fff", borderTop: "1px solid #e8ecf0", padding: "16px 24px" }}>
            {NAV_LINKS.map((l) => (
              <div key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
                padding: "12px 0", borderBottom: "1px solid #f0f0f0", fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 600, fontSize: "0.9rem", color: "#0a1a3a", cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase"
              }}>{l}</div>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" ref={registerRef("home", "Home")} style={{
        minHeight: "100vh", background: "linear-gradient(135deg, #0a1a3a 0%, #0d2254 60%, #0a1a3a 100%)",
        display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 68
      }}>
        {/* Geometric bg elements */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: "45%", height: "100%",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80, width: 400, height: 400,
          borderRadius: "50%", background: "rgba(192,57,43,0.08)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: 60, right: "10%", width: 200, height: 200,
          border: "1px solid rgba(255,255,255,0.06)", transform: "rotate(45deg)", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
              background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)",
              padding: "6px 16px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.78rem",
              color: "#e87c73", letterSpacing: "0.15em", textTransform: "uppercase"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c0392b", display: "inline-block" }} />
              Tirunelveli, Tamil Nadu · GST: 33BZEPS6674QZC
            </div>

            <h1 className="sr-font-display" style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, color: "#fff",
              lineHeight: 1.05, marginBottom: 8, letterSpacing: "-0.02em"
            }}>
              S.R.
            </h1>
            <h1 className="sr-font-display" style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, color: "#c0392b",
              lineHeight: 1.05, marginBottom: 28, letterSpacing: "-0.02em"
            }}>
              ENTERPRISES
            </h1>

            <div style={{ width: 60, height: 3, background: "#c0392b", marginBottom: 28 }} />

            <p className="sr-font-body" style={{
              fontSize: "1.2rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 16, fontWeight: 300
            }}>
              Dealers in all kinds of plant & machinery — ferrous & non-ferrous scrap.
            </p>
            <p className="sr-font-body" style={{
              fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 40
            }}>
              Trusted partner for MS scrap, machinery scrap, industrial scrap clearance, and bulk scrap handling with <strong style={{ color: "#e87c73", fontWeight: 700 }}>20+ years</strong> of experience.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a className="sr-btn-primary" href="tel:+919790401015">Call Now: +91 97904 01015</a>
              <span className="sr-btn-outline" onClick={() => scrollTo("services")} style={{ cursor: "pointer" }}>Our Services</span>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: 32, marginTop: 56, flexWrap: "wrap" }}>
              {[["⚖️", "Transparent Pricing"], ["🚛", "Strong Logistics"], ["⚡", "Quick Payment"]].map(([ic, lb]) => (
                <div key={lb} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "1.2rem" }}>{ic}</span>
                  <span className="sr-font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span className="sr-font-body" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={registerRef("about", "About")} style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div className={`fade-up${isVisible("about") ? " visible" : ""}`}>
              <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>About Us</div>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", lineHeight: 1.15, marginBottom: 0 }}>
                Built on Trust.
              </h2>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", lineHeight: 1.15, marginBottom: 4 }}>
                Powered by <span style={{ color: "#c0392b" }}>Experience.</span>
              </h2>
              <div className="divider-red" />
              <p className="sr-font-body" style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.8, marginBottom: 20 }}>
                S.R. Enterprises is a well-established scrap trading and industrial services company with over <strong>20 years of industry experience</strong>, serving industrial, infrastructure, and construction sectors.
              </p>
              <p className="sr-font-body" style={{ fontSize: "1rem", color: "#666", lineHeight: 1.8, marginBottom: 32 }}>
                A family-driven enterprise led by experienced professionals, we have successfully executed multiple private and government projects — delivering efficient operations and maintaining high levels of client satisfaction.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["Transparent", "Reliable", "Fast"].map(tag => (
                  <span key={tag} className="sr-font-body" style={{
                    border: "1.5px solid #0a1a3a", padding: "6px 18px", fontSize: "0.8rem",
                    fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a1a3a"
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { icon: "🔬", title: "What We Specialize In", items: ["Ferrous & Non-Ferrous scrap handling", "MS scrap and machinery procurement", "Industrial scrap management"] },
                { icon: "🏛️", title: "Delivery & Credibility", items: ["Family-driven, expert-led enterprise", "Multiple govt & private projects", "Transparent operations always"] },
              ].map(({ icon, title, items }, i) => (
                <div key={i} className={`fade-up d${i + 2}${isVisible("about") ? " visible" : ""}`} style={{
                  background: i === 0 ? "#0a1a3a" : "#fff",
                  border: i === 1 ? "2px solid #e8ecf0" : "none",
                  padding: "28px 24px", gridColumn: i === 0 ? "1/3" : "auto"
                }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: 10 }}>{icon}</div>
                  <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.9rem", color: i === 0 ? "#fff" : "#0a1a3a", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</div>
                  {items.map(item => (
                    <div key={item} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#c0392b", fontWeight: 700, fontSize: "0.9rem", marginTop: 2 }}>✓</span>
                      <span className="sr-font-body" style={{ fontSize: "0.9rem", color: i === 0 ? "rgba(255,255,255,0.8)" : "#555", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className={`fade-up d4${isVisible("about") ? " visible" : ""}`} style={{ background: "#c0392b", padding: "28px 24px" }}>
                <div className="sr-font-display" style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>20+</div>
                <div className="sr-font-body" style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Years of Industry Experience</div>
              </div>

              <div className={`fade-up d5${isVisible("about") ? " visible" : ""}`} style={{ background: "#f7f8fa", border: "2px solid #e8ecf0", padding: "28px 24px" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>🛡️</div>
                <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0a1a3a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Core Values</div>
                <div className="sr-font-body" style={{ fontSize: "0.85rem", color: "#888" }}>Transparency · Reliability · Clear Communication · Consistent Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={registerRef("services", "Services")} style={{ padding: "100px 24px", background: "#f7f8fa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className={`fade-up${isVisible("services") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Services</div>
            <h2 className={`fade-up d1${isVisible("services") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 8 }}>
              End-to-End Scrap & Site Solutions
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
            <p className={`fade-up d2${isVisible("services") ? " visible" : ""} sr-font-body`} style={{ fontSize: "1rem", color: "#777", marginTop: 20, maxWidth: 600, margin: "20px auto 0", lineHeight: 1.7 }}>
              Comprehensive services for industrial plants, warehouses, and construction sites — designed for safe handling, efficient clearance, and reliable execution.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className={`service-card fade-up d${Math.min(i + 1, 7)}${isVisible("services") ? " visible" : ""}`}>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{s.icon}</div>
                <h3 className="sr-font-display" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0a1a3a", marginBottom: 10 }}>{s.title}</h3>
                <p className="sr-font-body" style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Service promise banner */}
          <div className={`fade-up${isVisible("services") ? " visible" : ""}`} style={{ marginTop: 48, background: "#0a1a3a", padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="sr-font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>Service Promise</div>
              <div className="sr-font-display" style={{ fontSize: "2rem", fontWeight: 900, color: "#c0392b" }}>Clean. Safe. Efficient.</div>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Safety Focus", "On-Time", "Accurate", "Supervised"].map(tag => (
                <div key={tag} className="sr-font-body" style={{ padding: "8px 20px", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" ref={registerRef("clients", "Clients")} style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className={`fade-up${isVisible("clients") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Clients & Projects</div>
            <h2 className={`fade-up d1${isVisible("clients") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 4 }}>
              Trusted by Industry &
            </h2>
            <h2 className={`fade-up d2${isVisible("clients") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#c0392b" }}>
              Infrastructure Leaders
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
            {CLIENTS.map((c, i) => (
              <div key={c.name} className={`client-card fade-up d${Math.min(i + 1, 6)}${isVisible("clients") ? " visible" : ""}`}>
                <div style={{
                  width: 56, height: 56, background: "#0a1a3a", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.9rem", color: "#c0392b",
                  margin: "0 auto 16px"
                }}>{c.abbr.length > 3 ? c.abbr.slice(0,3) : c.abbr}</div>
                <div className="sr-font-display" style={{ fontWeight: 700, color: "#0a1a3a", fontSize: "0.95rem", marginBottom: 6 }}>{c.name}</div>
                <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{c.sector}</div>
              </div>
            ))}
          </div>

          {/* Credential highlights */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { icon: "📋", title: "Government Tender Participation", desc: "Executed contracts through structured processes and clear documentation." },
              { icon: "🤝", title: "Secured Service Contracts", desc: "Long-term partnerships with leading industrial and infrastructure players." },
              { icon: "⚖️", title: "Transparent & Accurate Operations", desc: "Every transaction backed by precise weighment and clear communication." },
            ].map((item, i) => (
              <div key={item.title} className={`fade-up d${i + 2}${isVisible("clients") ? " visible" : ""}`} style={{ background: "#f7f8fa", padding: "28px 24px", borderLeft: "4px solid #c0392b" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 12 }}>{item.icon}</div>
                <div className="sr-font-body" style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0a1a3a", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.title}</div>
                <div className="sr-font-body" style={{ fontSize: "0.88rem", color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRENGTHS */}
      <section id="strengths" ref={registerRef("strengths", "Strengths")} style={{ padding: "100px 24px", background: "#0a1a3a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className={`fade-up${isVisible("strengths") ? " visible" : ""} sr-font-body`} style={{ fontSize: "0.78rem", color: "#e87c73", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Our Strengths & Team</div>
            <h2 className={`fade-up d1${isVisible("strengths") ? " visible" : ""} sr-font-display`} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff" }}>
              Execution Strength You Can <span style={{ color: "#c0392b" }}>Depend On</span>
            </h2>
            <div style={{ width: 48, height: 3, background: "#c0392b", margin: "16px auto 0" }} />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, marginBottom: 48 }}>
            {STRENGTHS.map((s, i) => (
              <div key={s.label} className={`fade-up d${i + 1}${isVisible("strengths") ? " visible" : ""}`} style={{ borderTop: "4px solid #c0392b", padding: "32px 24px", background: "rgba(255,255,255,0.04)" }}>
                <div className="sr-font-display" style={{ fontSize: "3rem", fontWeight: 900, color: "#c0392b", lineHeight: 1, marginBottom: 8 }}>{s.stat}</div>
                <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
                <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Operational model */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className={`fade-up${isVisible("strengths") ? " visible" : ""}`} style={{ background: "rgba(255,255,255,0.05)", padding: "32px 28px" }}>
              <div className="sr-font-body" style={{ fontWeight: 700, color: "#c0392b", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Key Strengths</div>
              <div className="sr-font-display" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: 24 }}>Operational Confidence</div>
              {[
                ["⚖️", "Transparent operations", "Accurate weighment and clear communication"],
                ["👷", "Reliable manpower supply", "Supervised deployment for site needs"],
                ["🚛", "Logistics execution", "Pickup · loading · dispatch coordination"],
              ].map(([ic, t, d]) => (
                <div key={t} style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem", marginTop: 2 }}>{ic}</span>
                  <div>
                    <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", marginBottom: 4 }}>{t}</div>
                    <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`fade-up d2${isVisible("strengths") ? " visible" : ""}`} style={{ background: "#c0392b", padding: "32px 28px" }}>
              <div className="sr-font-body" style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>How We Deliver</div>
              <div className="sr-font-display" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: 24 }}>Operational Model</div>
              {[
                ["Site-first execution", "On-ground supervision and daily coordination"],
                ["Clear scope & coordination", "Site assessment · allocation · reporting"],
                ["Logistics-backed movement", "Field-ready pickup, loading & dispatch"],
                ["Transparent pricing", "Process-driven, documented, compliance-aware"],
              ].map(([t, d]) => (
                <div key={t} style={{ marginBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 16 }}>
                  <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", marginBottom: 4 }}>{t}</div>
                  <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={registerRef("contact", "Contact")} style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div className={`fade-up${isVisible("contact") ? " visible" : ""}`}>
              <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "#c0392b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</div>
              <h2 className="sr-font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0a1a3a", marginBottom: 4 }}>Contact Us</h2>
              <div className="divider-red" />
              <p className="sr-font-body" style={{ fontSize: "1rem", color: "#666", lineHeight: 1.8, marginBottom: 36 }}>
                Reach out for scrap procurement, machinery scrap purchasing, industrial clearance, and bulk scrap handling. We ensure clear evaluation and timely settlements.
              </p>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, background: "#0a1a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.2rem" }}>👤</div>
                  <div>
                    <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Owner / Primary Contact</div>
                    <div className="sr-font-display" style={{ fontWeight: 700, color: "#0a1a3a", fontSize: "1.2rem" }}>R. Sheik Oli Badusha</div>
                    <div className="sr-font-body" style={{ fontSize: "0.85rem", color: "#666", marginTop: 2 }}>Tirunelveli, Tamil Nadu</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.2rem" }}>📞</div>
                  <div>
                    <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Mobile · Call for quotations & pickups</div>
                    <a href="tel:+919790401015" className="sr-font-display" style={{ fontWeight: 700, color: "#c0392b", fontSize: "1.3rem", textDecoration: "none" }}>+91 9790401015</a>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, background: "#f7f8fa", border: "2px solid #e8ecf0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.2rem" }}>📋</div>
                  <div>
                    <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>GST · For billing & documentation</div>
                    <div className="sr-font-display" style={{ fontWeight: 700, color: "#0a1a3a", fontSize: "1.1rem" }}>33BZEPS6674QZC</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, background: "#f7f8fa", border: "2px solid #e8ecf0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.2rem" }}>📍</div>
                  <div>
                    <div className="sr-font-body" style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Address</div>
                    <div className="sr-font-body" style={{ fontWeight: 600, color: "#0a1a3a", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      37D, Krishnaperi (opp. Jeyam Mahal Kodeeswaran Nagar)<br />
                      Tirunelveli Town – 627006, Tamil Nadu
                    </div>
                  </div>
                </div>
              </div>

              <a className="sr-btn-primary" href="tel:+919790401015" style={{ marginTop: 40, display: "inline-block" }}>
                📞 Call for Quick Quote
              </a>
            </div>

            {/* CTA Panel */}
            <div className={`fade-up d2${isVisible("contact") ? " visible" : ""}`}>
              <div style={{ background: "#0a1a3a", padding: "48px 40px" }}>
                <div className="sr-font-display" style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>Ready to clear your scrap?</div>
                <div className="sr-font-display" style={{ fontSize: "1.1rem", fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>Get a transparent quote within hours.</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: "🏭", title: "Industrial Scrap Clearance", desc: "Plants, yards, and operational areas" },
                    { icon: "⚙️", title: "Machinery Scrap Purchase", desc: "Accurate assessment & fast payment" },
                    { icon: "🏗️", title: "Construction Scrap Handling", desc: "PEMB, metro & flat construction sites" },
                    { icon: "📦", title: "Bulk Scrap Procurement", desc: "MS, ferrous & non-ferrous materials" },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", alignItems: "center" }}>
                      <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div className="sr-font-body" style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", marginBottom: 2 }}>{item.title}</div>
                        <div className="sr-font-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                      </div>
                      <span style={{ color: "#c0392b", marginLeft: "auto", fontSize: "1.1rem" }}>→</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.3)" }}>
                  <div className="sr-font-body" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quick Response Guaranteed</div>
                  <div className="sr-font-body" style={{ color: "#e87c73", fontWeight: 700, fontSize: "1.1rem" }}>+91 9790401015</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#050f1f", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, background: "#0a1a3a", border: "1px solid #1a2d5a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "0.9rem", color: "#c0392b" }}>SR</div>
              <div className="sr-font-display" style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>S.R. ENTERPRISES</div>
            </div>
            <div className="sr-font-body" style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              Scrap & Industrial Services · Tirunelveli, Tamil Nadu<br />
              GST: 33BZEPS6674QZC
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {NAV_LINKS.map(l => (
              <span key={l} onClick={() => scrollTo(l.toLowerCase())} className="sr-font-body" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#c0392b"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{l}</span>
            ))}
          </div>

          <div className="sr-font-body" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
            © 2026 S.R. Enterprises<br />All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}