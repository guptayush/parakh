/* global React, ReactDOM */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "fullbleed",
  "showTrust": true,
  "primaryColor": "#0A0A0A"
}/*EDITMODE-END*/;

// ---------- Line icons (1.5 stroke) ----------
const IconCarbide = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* mango-ish drop with a warning tick */}
    <path d="M12 3c4 2 6 5 6 9a6 6 0 1 1-12 0c0-4 2-7 6-9z"/>
    <path d="M9.5 12.5l1.8 1.8 3.5-3.8"/>
  </svg>
);
const IconDye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* droplet on a leaf */}
    <path d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/>
    <path d="M9 13c1.2.6 2.4.6 3.6 0"/>
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* eye-with-lens */}
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// ---------- Camera background (for "sheet" layout) ----------
function CameraBg() {
  return (
    <div className="cam" aria-hidden="true">
      <div className="cam-status">
        <span>9:41</span>
        <span className="cam-dots"><i/><i/><i/></span>
      </div>
      <div className="cam-stage">
        <div className="cam-reticle">
          <span className="cor tl"/><span className="cor tr"/>
          <span className="cor bl"/><span className="cor br"/>
          <div className="cam-scan"/>
        </div>
      </div>
    </div>
  );
}

// ---------- Value prop trio ----------
function ValueRows() {
  const items = [
    { Icon: IconCarbide, title: "Spot carbide-ripening",  sub: "Mangoes, bananas, papayas" },
    { Icon: IconDye,     title: "Catch surface dyes",      sub: "Watermelons, palak, carrots" },
    { Icon: IconCheck,   title: "The one check that beats the camera", sub: "When sight isn't enough" }
  ];
  return (
    <ul className="vrows">
      {items.map((it, i) => (
        <li key={i} className="vrow" style={{ "--i": i }}>
          <span className="vrow-ico"><it.Icon/></span>
          <span className="vrow-text">
            <span className="vrow-title">{it.title}</span>
            <span className="vrow-sub">{it.sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function CTA({ onStart, layout }) {
  return (
    <div className={`cta-stack ${layout}`}>
      <button className="cta-primary" onClick={onStart}>
        <span>Get started</span>
        <ArrowRight/>
      </button>
      <button className="cta-secondary" onClick={onStart}>
        Already have an account? <b>Sign in</b>
      </button>
    </div>
  );
}

// ---------- Layouts ----------
function FullBleed({ trust, onStart }) {
  return (
    <div className="screen fullbleed">
      <header className="status">
        <span>9:41</span>
        <span className="status-dots"><i/><i/><i/></span>
      </header>

      <section className="hero">
        <div className="wordmark">
          <span className="wm-dot"/>
          <span className="wm-text">Scanner</span>
        </div>
        <h1 className="headline">Know before<br/>you buy.</h1>
        <p className="sub">Scan any fruit or vegetable. Get an honest verdict in seconds — and the one quick check that confirms it.</p>
      </section>

      <ValueRows/>

      <footer className="foot">
        {trust && <p className="trust">Built on FSSAI guidelines + food-science research.</p>}
        <CTA onStart={onStart} layout="fullbleed"/>
      </footer>
    </div>
  );
}

function SheetOverCamera({ trust, onStart }) {
  return (
    <div className="screen sheet-layout">
      <CameraBg/>
      <div className="sc-scrim"/>
      <div className="sc-sheet">
        <div className="sc-handle"/>
        <h1 className="headline sm">Know before you buy.</h1>
        <p className="sub">Scan any fruit or vegetable. Get an honest verdict in seconds — and the one quick check that confirms it.</p>
        <ValueRows/>
        {trust && <p className="trust">Built on FSSAI guidelines + food-science research.</p>}
        <CTA onStart={onStart} layout="sheet"/>
      </div>
    </div>
  );
}

function Editorial({ trust, onStart }) {
  return (
    <div className="screen editorial">
      <header className="status">
        <span>9:41</span>
        <span className="status-dots"><i/><i/><i/></span>
      </header>
      <div className="ed-block">
        <p className="ed-eyebrow">Produce Scanner</p>
        <h1 className="headline xl">Know<br/>before<br/>you buy.</h1>
        <div className="ed-rule"/>
        <p className="sub">Scan any fruit or vegetable. Get an honest verdict in seconds — and the one quick check that confirms it.</p>
      </div>
      <ValueRows/>
      <footer className="foot">
        {trust && <p className="trust">Built on FSSAI guidelines + food-science research.</p>}
        <CTA onStart={onStart} layout="editorial"/>
      </footer>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--brand", tweaks.primaryColor);
  }, [tweaks.primaryColor]);

  function onStart() {
    window.location.href = "Sign Up Bottom Sheet.html";
  }

  const layouts = {
    fullbleed: FullBleed,
    sheet: SheetOverCamera,
    editorial: Editorial
  };
  const Layout = layouts[tweaks.layout] || FullBleed;

  return (
    <>
      <Layout trust={tweaks.showTrust} onStart={onStart}/>

      <window.TweaksPanel>
        <window.TweakSection title="Layout">
          <window.TweakRadio
            label="Style"
            options={[
              { value: "fullbleed", label: "Full-bleed" },
              { value: "sheet", label: "Sheet on camera" },
              { value: "editorial", label: "Editorial" }
            ]}
            value={tweaks.layout}
            onChange={(v) => setTweak("layout", v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Content">
          <window.TweakToggle
            label="Show FSSAI trust line"
            value={tweaks.showTrust}
            onChange={(v) => setTweak("showTrust", v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Brand">
          <window.TweakColor
            label="Primary"
            value={tweaks.primaryColor}
            onChange={(v) => setTweak("primaryColor", v)}
            presets={["#0A0A0A", "#1B5E20", "#1F2937", "#7C3AED"]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
