/* global React, ReactDOM, COUNTRIES */
const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#0A0A0A",
  "cornerRadius": 24,
  "fieldRadius": 14,
  "headerTreatment": "headline_sub"
}/*EDITMODE-END*/;

// ---------- Phone formatting ----------
const PHONE_FORMATS = {
  "1":   [3, 3, 4],
  "44":  [4, 6],
  "91":  [5, 5],
  "61":  [3, 3, 3],
  "971": [2, 3, 4],
  "65":  [4, 4],
  "49":  [4, 4, 4],
  "33":  [1, 2, 2, 2, 2],
  "86":  [3, 4, 4],
  "81":  [3, 4, 4],
  "82":  [3, 4, 4],
  "92":  [3, 7],
  "880": [4, 6],
  "55":  [2, 5, 4],
  "52":  [2, 4, 4],
  "234": [3, 3, 4]
};

function formatPhone(dial, raw) {
  const digits = (raw || "").replace(/\D/g, "");
  const groups = PHONE_FORMATS[dial] || [3, 3, 4];
  const out = []; let i = 0;
  for (const g of groups) { if (i >= digits.length) break; out.push(digits.slice(i, i + g)); i += g; }
  if (i < digits.length) out.push(digits.slice(i));
  return out.join(" ");
}

function maxDigitsFor(dial) {
  const groups = PHONE_FORMATS[dial] || [3, 3, 4];
  return Math.max(groups.reduce((a, b) => a + b, 0), 15);
}

// ---------- Icons ----------
const ScanIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <path d="M7 12h10"/>
  </svg>
);
const ChevronDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const Check = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

function Header({ treatment }) {
  if (treatment === "logo_headline") {
    return (
      <div className="sheet-header">
        <div className="logo-mark"><ScanIcon size={22}/></div>
        <h1 className="sheet-title">Create your account</h1>
        <p className="sheet-sub">Scan produce. Skip the duds.</p>
      </div>
    );
  }
  if (treatment === "handle_minimal") {
    return (
      <div className="sheet-header sheet-header--minimal">
        <h1 className="sheet-title sheet-title--small">Sign up</h1>
      </div>
    );
  }
  return (
    <div className="sheet-header">
      <h1 className="sheet-title">Know before you buy.</h1>
      <p className="sheet-sub">Sign up to scan fruit & veg for freshness in seconds.</p>
    </div>
  );
}

function CountryPicker({ open, onClose, onSelect, selected }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current && inputRef.current.focus(), 220); }
  }, [open]);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COUNTRIES;
    return COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(needle) ||
      c.dial.includes(needle.replace(/^\+/, "")) ||
      c.code.toLowerCase().includes(needle)
    );
  }, [q]);
  return (
    <div className={`cp-overlay ${open ? "is-open" : ""}`} onClick={onClose} aria-hidden={!open}>
      <div className="cp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose country code">
        <div className="cp-handle" />
        <div className="cp-head">
          <h2 className="cp-title">Country code</h2>
          <button className="cp-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="cp-search">
          <SearchIcon />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country or code" inputMode="search" />
        </div>
        <div className="cp-list" role="listbox">
          {filtered.length === 0 && <div className="cp-empty">No matches</div>}
          {filtered.map(c => {
            const isSel = selected && selected.code === c.code;
            return (
              <button key={c.code} className={`cp-item ${isSel ? "is-selected" : ""}`} onClick={() => { onSelect(c); onClose(); }} role="option" aria-selected={isSel}>
                <span className="cp-flag">{c.flag}</span>
                <span className="cp-name">{c.name}</span>
                <span className="cp-dial">+{c.dial}</span>
                {isSel && <span className="cp-check"><Check /></span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [name, setName] = useState("");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [country, setCountry] = useState(COUNTRIES.find(c => c.code === "IN"));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--brand", tweaks.primaryColor);
    r.style.setProperty("--brand-contrast", contrastOn(tweaks.primaryColor));
    r.style.setProperty("--sheet-radius", tweaks.cornerRadius + "px");
    r.style.setProperty("--field-radius", tweaks.fieldRadius + "px");
  }, [tweaks.primaryColor, tweaks.cornerRadius, tweaks.fieldRadius]);

  const phoneFormatted = formatPhone(country.dial, phoneRaw);
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 6;
  const nameValid = name.trim().length >= 2;
  const canSubmit = nameValid && phoneValid;

  function handlePhoneChange(e) {
    const max = maxDigitsFor(country.dial);
    setPhoneRaw(e.target.value.replace(/\D/g, "").slice(0, max));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1800);
  }

  return (
    <>
      <BackgroundApp onScanTap={() => setSheetOpen(true)} />
      <div className={`scrim ${sheetOpen ? "is-open" : ""}`} onClick={() => setSheetOpen(false)} />
      <div className={`sheet ${sheetOpen ? "is-open" : ""}`} role="dialog" aria-label="Sign up" aria-modal="true">
        <div className="sheet-handle" />
        <Header treatment={tweaks.headerTreatment} />

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span className="field-label">Full name</span>
            <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Apple" className="field-input" />
          </label>

          <label className="field">
            <span className="field-label">Phone number</span>
            <div className="phone-row">
              <button type="button" className="cc-btn" onClick={() => setPickerOpen(true)} aria-label={`Country code, currently ${country.name} +${country.dial}`}>
                <span className="cc-flag">{country.flag}</span>
                <span className="cc-dial">+{country.dial}</span>
                <ChevronDown />
              </button>
              <div className="cc-divider" />
              <input type="tel" autoComplete="tel-national" inputMode="numeric" value={phoneFormatted} onChange={handlePhoneChange} placeholder={placeholderFor(country.dial)} className="field-input phone-input" />
            </div>
          </label>

          <button type="submit" className={`cta ${canSubmit ? "" : "is-disabled"} ${submitted ? "is-done" : ""}`} disabled={!canSubmit}>
            <span className="cta-label">{submitted ? "Welcome 👋" : "Continue"}</span>
            {!submitted && (
              <svg className="cta-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            )}
          </button>

          <p className="sign-in">
            Already have an account? <a href="#" onClick={(e) => e.preventDefault()}>Sign in</a>
          </p>
        </form>
      </div>

      <CountryPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(c) => { setCountry(c); setPhoneRaw(""); }} selected={country} />

      <window.TweaksPanel>
        <window.TweakSection title="Brand">
          <window.TweakColor label="Primary color" value={tweaks.primaryColor} onChange={(v) => setTweak("primaryColor", v)} presets={["#0A0A0A", "#1B5E20", "#FF6F3C", "#1F2937", "#7C3AED", "#0EA5E9"]} />
        </window.TweakSection>
        <window.TweakSection title="Shape">
          <window.TweakSlider label="Sheet radius" min={0} max={40} step={1} value={tweaks.cornerRadius} onChange={(v) => setTweak("cornerRadius", v)} />
          <window.TweakSlider label="Field radius" min={0} max={28} step={1} value={tweaks.fieldRadius} onChange={(v) => setTweak("fieldRadius", v)} />
        </window.TweakSection>
        <window.TweakSection title="Header">
          <window.TweakRadio
            label="Treatment"
            options={[
              { value: "headline_sub", label: "Headline + sub" },
              { value: "logo_headline", label: "Logo + headline" },
              { value: "handle_minimal", label: "Minimal" }
            ]}
            value={tweaks.headerTreatment}
            onChange={(v) => setTweak("headerTreatment", v)}
          />
        </window.TweakSection>
        <window.TweakSection title="Sheet">
          <window.TweakButton onClick={() => setSheetOpen(true)}>Re-open sheet</window.TweakButton>
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

function placeholderFor(dial) {
  switch (dial) {
    case "91": return "98765 43210";
    case "1":  return "415 555 0132";
    case "44": return "7911 123456";
    case "61": return "412 345 678";
    case "65": return "8123 4567";
    default:   return "Phone number";
  }
}

function contrastOn(hex) {
  const m = hex.replace("#", "");
  if (m.length !== 6) return "#FFFFFF";
  const r = parseInt(m.slice(0,2), 16), g = parseInt(m.slice(2,4), 16), b = parseInt(m.slice(4,6), 16);
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.6 ? "#0A0A0A" : "#FFFFFF";
}

function BackgroundApp({ onScanTap }) {
  return (
    <div className="bg-app" aria-hidden="true">
      <div className="bg-status">
        <span>9:41</span>
        <div className="bg-status-icons"><span className="dot"/><span className="dot"/><span className="dot"/></div>
      </div>
      <div className="bg-camera">
        <div className="bg-reticle">
          <span className="bg-corner tl"/><span className="bg-corner tr"/>
          <span className="bg-corner bl"/><span className="bg-corner br"/>
          <div className="bg-scanline"/>
        </div>
        <div className="bg-hint">Point at a fruit or vegetable</div>
      </div>
      <button className="bg-shutter" onClick={onScanTap} aria-label="Scan"><span/></button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
