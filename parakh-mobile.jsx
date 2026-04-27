/* Parakh — mobile web prototype */
const { useState, useEffect, useRef, useMemo } = React;

/* ---------- Assay stamp (shared) ---------- */
function AssayStamp({ animate = false, color = "var(--ink)", tilak = "var(--tilak)", micro = true }) {
  const wrappedText = "PARAKH · परख · TEST · ASSAY · APPRAISE · PARAKH · परख · TEST · ASSAY · APPRAISE · ";
  return (
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="2" className={animate ? "ring-outer" : ""} />
      <circle cx="100" cy="100" r="82" fill="none" stroke={color} strokeWidth="0.75" strokeDasharray="2 4" className={animate ? "ring-dash" : ""} />
      <circle cx="100" cy="100" r="68" fill="none" stroke={color} strokeWidth="1.5" className={animate ? "ring-inner" : ""} />
      {micro && (
        <>
          <defs>
            <path id="m-ring-path" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"/>
          </defs>
          <text fontFamily="JetBrains Mono" fontSize="6.5" letterSpacing="2.5" fill={color}>
            <textPath href="#m-ring-path" startOffset="0">{wrappedText}</textPath>
          </text>
        </>
      )}
      <line x1="100" y1="14" x2="100" y2="22" stroke={tilak} strokeWidth="2" className={animate ? "hash" : ""} />
      <line x1="100" y1="178" x2="100" y2="186" stroke={tilak} strokeWidth="2" className={animate ? "hash" : ""} />
      <line x1="14" y1="100" x2="22" y2="100" stroke={tilak} strokeWidth="2" className={animate ? "hash" : ""} />
      <line x1="178" y1="100" x2="186" y2="100" stroke={tilak} strokeWidth="2" className={animate ? "hash" : ""} />
    </svg>
  );
}

/* ---------- Mango ---------- */
function Mango({ className }) {
  return (
    <svg className={className} viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="m-mango-body" cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FFD46B" />
          <stop offset="40%" stopColor="#F2A23A" />
          <stop offset="80%" stopColor="#C25A1F" />
          <stop offset="100%" stopColor="#7A2E0E" />
        </radialGradient>
        <radialGradient id="m-mango-blush" cx="62%" cy="22%" r="35%">
          <stop offset="0%" stopColor="#E64A1B" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E64A1B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M120,28 C172,28 208,72 210,140 C212,210 168,260 118,260 C70,260 28,210 30,144 C32,82 70,28 120,28 Z" fill="url(#m-mango-body)"/>
      <path d="M120,28 C172,28 208,72 210,140 C212,210 168,260 118,260 C70,260 28,210 30,144 C32,82 70,28 120,28 Z" fill="url(#m-mango-blush)"/>
      <ellipse cx="86" cy="80" rx="26" ry="14" fill="#FFE9A8" opacity="0.55"/>
      <path d="M118,30 C116,18 122,8 130,4" stroke="#5A3A1A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M130,6 C150,2 168,14 168,30 C152,32 138,22 130,6 Z" fill="#3F6B2A"/>
    </svg>
  );
}

/* ---------- Test icons ---------- */
const Icons = {
  ripeness: <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M28 12 C 40 12 46 22 46 32 C 46 42 38 48 28 48 C 18 48 10 42 10 32 C 10 22 16 12 28 12 Z"/><path d="M28 12 C 27 8 29 5 32 4"/><path d="M30 5 C 36 4 39 9 39 13 C 35 13 31 10 30 5 Z" fill="currentColor" opacity="0.18"/></svg>,
  dye: <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 20 C 14 14 22 10 28 10 C 34 10 42 14 42 20 L 40 42 C 40 46 34 48 28 48 C 22 48 16 46 16 42 Z"/><path d="M14 24 C 22 26 34 26 42 24"/></svg>,
  carbide: <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M28 8 L 28 16"/><path d="M22 22 C 22 18 26 16 28 16 C 30 16 34 18 34 22 L 34 26 C 38 28 42 32 42 38 C 42 44 36 48 28 48 C 20 48 14 44 14 38 C 14 32 18 28 22 26 Z"/></svg>,
  pesticide: <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M28 4 C 32 12 40 16 40 24 C 40 32 34 36 28 36 C 22 36 16 32 16 24 C 16 16 24 12 28 4 Z"/><path d="M28 36 L 28 50"/></svg>,
};

/* ---------- Country picker (bottom sheet) ---------- */
function CountryPicker({ open, onClose, onPick, current }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const all = window.COUNTRIES || [];
    if (!q) return all;
    const s = q.toLowerCase();
    return all.filter(c => c.name.toLowerCase().includes(s) || c.dial.includes(s.replace(/\D/g,"")));
  }, [q]);

  useEffect(() => { if (!open) setQ(""); }, [open]);

  return (
    <div className={"m-cp" + (open ? " open" : "")} onClick={onClose}>
      <div className="m-cp-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="m-cp-handle"></div>
        <div className="m-cp-head">
          <h3>Select country</h3>
          <button className="m-cp-x" onClick={onClose}>Done</button>
        </div>
        <input className="m-cp-search"
          placeholder="Search country or code"
          value={q} onChange={(e) => setQ(e.target.value)}
          autoFocus={open}/>
        <div className="m-cp-list">
          {list.length === 0 && <div className="m-cp-empty">No matches</div>}
          {list.map(c => (
            <button key={c.code}
              className={"m-cp-row" + (current?.code === c.code ? " sel" : "")}
              onClick={() => onPick(c)}>
              <span className="flag">{c.flag}</span>
              <span className="name">{c.name}</span>
              <span className="dial">+{c.dial}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */
const STEPS = ["splash", "value", "signup", "scanner", "verdict"];

function Progress({ idx, dark }) {
  return (
    <div className="m-progress">
      {STEPS.map((s, i) => (
        <i key={s} className={i < idx ? "on" : i === idx ? "cur" : ""}/>
      ))}
    </div>
  );
}

function BackLink({ onClick }) {
  return (
    <button className="m-back" onClick={onClick}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2 L 2 5 L 6 8"/><path d="M2 5 H 9"/></svg>
      Back
    </button>
  );
}

/* ---------- 01 Splash ---------- */
function Splash({ onNext }) {
  return (
    <div className="m-screen dark">
      <div className="m-splash">
        <div className="m-splash-stamp">
          <AssayStamp animate color="rgba(244,238,226,0.92)" tilak="var(--tilak)"/>
          <div className="deva-c">परख</div>
        </div>
        <h1 className="m-splash-lockup">Parakh.</h1>
        <p className="m-splash-tag"><span className="deva-tag">परख</span> the assayer of fresh produce</p>
      </div>
      <div className="m-splash-cta">
        <button className="m-btn tilak" onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

/* ---------- 02 Value ---------- */
function ValueProp({ onNext, onBack }) {
  return (
    <div className="m-screen">
      <div className="m-content m-top screen-enter">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
          <BackLink onClick={onBack}/>
          <Progress idx={1}/>
        </div>
        <p className="m-eyebrow"><b>01 / 03</b> · what we test</p>
        <div className="m-value-hed">
          <h1>Trust. <em>Then buy.</em></h1>
          <p>Hold a fruit up to the camera. Parakh runs four checks — the same kind a jeweller runs on gold — and gives one verdict.</p>
        </div>
        <div className="m-tests">
          <div className="m-test-card">
            <div className="icon">{Icons.ripeness}</div>
            <div>
              <h3><span className="deva">पकाव ·</span>Ripeness</h3>
              <p>Color, surface, stem condition.</p>
            </div>
          </div>
          <div className="m-test-card">
            <div className="icon">{Icons.dye}</div>
            <div>
              <h3><span className="deva">रंग ·</span>Surface dye</h3>
              <p>Artificial color washed onto the skin.</p>
            </div>
          </div>
          <div className="m-test-card">
            <div className="icon">{Icons.carbide}</div>
            <div>
              <h3><span className="deva">मसाला ·</span>Carbide ripening</h3>
              <p>Forced ripening with calcium carbide.</p>
            </div>
          </div>
          <div className="m-test-card">
            <div className="icon">{Icons.pesticide}</div>
            <div>
              <h3><span className="deva">कीटनाशक ·</span>Pesticide signs</h3>
              <p>Residue, oily sheen, surface waxing.</p>
            </div>
          </div>
        </div>
        <div className="m-bottom-bar">
          <button className="m-btn tilak" onClick={onNext}>Try a scan</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- 03 Scanner ---------- */
const SCAN_TESTS = [
  { key: "ripe", label: "Ripeness", deva: "पकाव", meta: "COLOR · STEM" },
  { key: "dye", label: "Surface dye", deva: "रंग", meta: "PIGMENT" },
  { key: "carb", label: "Carbide", deva: "मसाला", meta: "UNIFORMITY" },
  { key: "pest", label: "Pesticide", deva: "कीटनाशक", meta: "SHEEN" },
];

function Scanner({ onComplete, onBack }) {
  const [phase, setPhase] = useState("framing"); // framing | scanning | error
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [camReady, setCamReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  // Start camera
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setCamReady(true);
        }
      } catch (e) {
        console.warn("camera unavailable:", e);
        setCamReady(false);
      }
    }
    start();
    return () => {
      cancelled = true;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const captureFromVideo = () => {
    const v = videoRef.current;
    if (!v) return null;
    const w = v.videoWidth || 720, h = v.videoHeight || 720;
    const size = Math.min(w, h);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    const sx = (w - size) / 2, sy = (h - size) / 2;
    ctx.drawImage(v, sx, sy, size, size, 0, 0, 1024, 1024);
    return canvas.toDataURL("image/jpeg", 0.85);
  };

  const sendImage = async (dataUrl) => {
    setCapturedUrl(dataUrl);
    setPhase("scanning");
    setError(null);
    setActive(0);
    setProgress(0);
    stopCamera();

    // Animate progress to ~70% then wait for API
    const t0 = performance.now();
    const animId = setInterval(() => {
      const t = performance.now() - t0;
      const p = Math.min(0.7, t / 4500);
      setProgress(p);
      setActive(Math.min(SCAN_TESTS.length - 1, Math.floor(p * SCAN_TESTS.length / 0.7)));
    }, 60);

    const apiBase = window.PARAKH_API || "/api";
    try {
      const r = await fetch(apiBase + "/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      clearInterval(animId);
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || `Scan failed (${r.status})`);
      }
      const data = await r.json();
      setProgress(1);
      setActive(SCAN_TESTS.length);
      setTimeout(() => onComplete && onComplete(data), 600);
    } catch (e) {
      clearInterval(animId);
      console.warn("scan fallback:", e.message);
      // Demo fallback when backend unreachable (e.g. GitHub Pages without API)
      if (window.PARAKH_DEMO !== false) {
        const demo = {
          name: "Mango", emoji: "🥭",
          verdict: "hold", stampEn: "Check", stampDeva: "ठीक",
          headline: "Smell it first.", deva: "ठीक है।",
          sub: "Demo verdict — full AI pipeline runs when the backend is connected. The visual cues look fine, but smell tells the truth.",
          list: [
            { label: "Color", status: "GOOD", pip: "pass" },
            { label: "Surface", status: "GOOD", pip: "pass" },
            { label: "Smell", status: "CHECK", pip: "hold" },
          ],
          checks: [
            { icon: "nose", title: "Sniff the stem end", body: "Sweet & fruity = naturally ripe. No smell or chemical = carbide-ripened." },
          ],
          demo: true,
        };
        setProgress(1);
        setActive(SCAN_TESTS.length);
        setTimeout(() => onComplete && onComplete(demo), 600);
        return;
      }
      setError(e.message || "Scan failed");
      setPhase("error");
    }
  };

  const handleCapture = () => {
    const url = captureFromVideo();
    if (!url) { setError("Couldn't capture frame"); setPhase("error"); return; }
    sendImage(url);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => sendImage(reader.result);
    reader.readAsDataURL(f);
  };

  const retry = () => {
    setError(null);
    setPhase("framing");
    setCapturedUrl(null);
    setProgress(0);
    setActive(0);
    // re-start camera
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }, audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamReady(true);
      } catch {}
    })();
  };

  return (
    <div className="m-screen scanner-screen">
      <div className="m-vf">
        {capturedUrl ? (
          <img src={capturedUrl} alt="" className="m-vf-video"/>
        ) : (
          <video ref={videoRef} className="m-vf-video" autoPlay playsInline muted/>
        )}
        <div className="m-vf-reticle">
          <span className="m-cor tl"></span><span className="m-cor tr"></span>
          <span className="m-cor bl"></span><span className="m-cor br"></span>
          {phase === "scanning" && <div className="m-scan"></div>}
        </div>
      </div>
      <div className="m-vf-meta">
        <span className="live"><i></i>{phase === "scanning" ? "Scanning" : camReady ? "Live" : "Ready"}</span>
        <span>{phase === "framing" ? "Hold produce in frame" : "Examining…"}</span>
      </div>

      {phase === "framing" && (
        <div className="m-cap-bar">
          <button className="m-cap-ghost" onClick={onBack}>Back</button>
          <button className="m-cap-shutter" onClick={handleCapture} disabled={!camReady} aria-label="Capture">
            <span/>
          </button>
          <button className="m-cap-ghost" onClick={() => fileRef.current?.click()}>Upload</button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={handleFile}/>
        </div>
      )}

      {(phase === "scanning" || phase === "error") && (
        <div className="m-readout">
          <div className="m-readout-head">
            <span>Assay <b>{phase === "error" ? "—" : "live"}</b></span>
            <span>{phase === "error" ? "error" : `${Math.round(progress * 100)}%`}</span>
          </div>
          <h2>{phase === "error" ? "Couldn't read it." : "Examining."}</h2>
          <p className="deva-h">{phase === "error" ? "फिर कोशिश करो।" : "परख चल रही है।"}</p>
          {phase === "error" && (
            <p style={{ marginTop: 8, color: "var(--skip)", fontSize: 13 }}>{error}</p>
          )}
          {phase === "scanning" && (
            <ul className="m-readout-list">
              {SCAN_TESTS.map((t, i) => {
                const state = i < active ? "done" : i === active ? "run" : "pending";
                return (
                  <li key={t.key} className={state}>
                    <span className="pip"></span>
                    <span className="label">{t.label} <span style={{fontFamily:'var(--deva)', color:'var(--tilak)', fontSize: 11}}>· {t.deva}</span></span>
                    <span className="meta">{t.meta}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {phase === "scanning" && <div className="m-meter"><i style={{width: `${progress * 100}%`}}></i></div>}
          <div style={{display:'flex', gap: 8}}>
            <button className="m-btn ghost" onClick={onBack} style={{flex: '0 0 90px'}}>Back</button>
            {phase === "error"
              ? <button className="m-btn tilak" onClick={retry}>Try again</button>
              : <button className="m-btn" disabled>Examining…</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 04 Sign Up ---------- */
function SignUp({ onNext, onBack }) {
  const [stage, setStage] = useState("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(() => (window.COUNTRIES || []).find(c => c.code === "IN") || { code: "IN", name: "India", dial: "91", flag: "🇮🇳" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [otp, setOtp] = useState(["","","","","",""]);
  const [resendIn, setResendIn] = useState(30);
  const otpRefs = useRef([]);

  const formatPhone = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    return d.length <= 5 ? d : d.slice(0,5) + " " + d.slice(5);
  };
  const phoneDigits = phone.replace(/\D/g, "");
  const canSendOtp = name.trim().length >= 2 && phoneDigits.length >= 7;

  useEffect(() => {
    if (stage !== "otp") return;
    setResendIn(30);
    const t = setInterval(() => setResendIn(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const sendOtp = () => {
    if (!canSendOtp) return;
    // Best-effort save to Google Sheet — don't block the flow on it
    if (window.PARAKH_SHEET_URL) {
      fetch(window.PARAKH_SHEET_URL, {
        method: "POST",
        // text/plain avoids CORS preflight (Apps Script doesn't support OPTIONS)
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name, phone: phoneDigits,
          dial: country.dial, country: country.name,
          userAgent: navigator.userAgent,
        }),
      }).catch((e) => console.warn("sheet save failed:", e));
    }
    onNext && onNext({ name, phone: phoneDigits, dial: country.dial });
  };
  const setOtpAt = (i, val) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) otpRefs.current[i+1]?.focus();
  };
  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i-1]?.focus();
  };
  const otpComplete = otp.every(d => d !== "");
  const verify = () => { if (otpComplete) onNext && onNext({ name, phone: phoneDigits }); };

  return (
    <div className="m-screen">
      <div className="m-content m-top screen-enter">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16}}>
          <BackLink onClick={() => stage === "otp" ? setStage("details") : onBack()}/>
          <Progress idx={2}/>
        </div>

        <div className="m-signup-head">
          <div className="m-signup-stamp">
            <AssayStamp color="var(--ink)" tilak="var(--tilak)" micro={false}/>
            <div className="deva-c">परख</div>
          </div>
          <p className="m-eyebrow"><b>02 / 03</b> · sign up</p>
          <h1>Before we <em>begin.</em></h1>
          <p className="deva-line">शुरू करने से पहले।</p>
          <p>A name and number to save your assays. Aage badho — let's parakh your produce.</p>
        </div>

        {stage === "details" && (
          <>
            <div className="m-field">
              <label>Your name</label>
              <input className="m-input" placeholder="Ananya Iyer" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div className="m-field">
              <label>Mobile number</label>
              <div className="m-phone-row">
                <button type="button" className="m-cc-btn" onClick={() => setPickerOpen(true)}>
                  <span className="flag">{country.flag}</span>
                  <span className="dial">+{country.dial}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="chev"><path d="M1 1.5 L 5 4.5 L 9 1.5"/></svg>
                </button>
                <input className="m-input" placeholder="98765 43210" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} inputMode="numeric"/>
              </div>
            </div>
            <CountryPicker
              open={pickerOpen}
              current={country}
              onClose={() => setPickerOpen(false)}
              onPick={(c) => { setCountry(c); setPickerOpen(false); }}/>
            <div className="m-bottom-bar">
              <button className="m-btn tilak" onClick={sendOtp} disabled={!canSendOtp}>Continue to scan</button>
            </div>
          </>
        )}

        {stage === "otp" && (
          <>
            <div className="m-field">
              <label>6-digit code</label>
              <div className="m-otp-row">
                {otp.map((d, i) => (
                  <input key={i}
                    ref={el => otpRefs.current[i] = el}
                    className={"m-otp-cell" + (d ? " has" : "")}
                    value={d}
                    onChange={e => setOtpAt(i, e.target.value)}
                    onKeyDown={e => onOtpKey(i, e)}
                    inputMode="numeric"
                    maxLength={1}/>
                ))}
              </div>
              <div className="m-otp-meta">
                <span>{resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2,'0')}` : <a onClick={() => setResendIn(30)}>Resend</a>}</span>
                <a onClick={() => setStage("details")}>Wrong number?</a>
              </div>
            </div>
            <div className="m-bottom-bar">
              <button className="m-btn tilak" onClick={verify} disabled={!otpComplete}>Verify & continue</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- 05 Verdict ---------- */
const VERDICT_THEME = {
  pass:    { color: "var(--pass)", pipClass: "pass",  label: "Pass" },
  hold:    { color: "var(--hold)", pipClass: "hold",  label: "Check" },
  skip:    { color: "var(--skip)", pipClass: "skip",  label: "Skip" },
  unknown: { color: "var(--ink-3)", pipClass: "skip", label: "—" },
  retake:  { color: "var(--ink-3)", pipClass: "skip", label: "—" },
};

const PIP_FOR = (s) => {
  if (!s) return "skip";
  const v = String(s).toLowerCase();
  if (v === "pass" || v === "good") return "pass";
  if (v === "hold" || v === "okay" || v === "check") return "hold";
  return "skip";
};

function Verdict({ name, result, onRestart, onRetake }) {
  const verdict = result?.verdict || "unknown";
  const theme = VERDICT_THEME[verdict] || VERDICT_THEME.unknown;
  const stampEn = result?.stampEn || (verdict === "pass" ? "Buy" : verdict === "hold" ? "Check" : "Skip");
  const stampDeva = result?.stampDeva || "—";
  const headline = result?.headline || "—";
  const devaLine = result?.deva || "";
  const sub = result?.sub || "";
  const subject = result?.name || "Unknown";
  const list = Array.isArray(result?.list) ? result.list : [];
  const checks = Array.isArray(result?.checks) ? result.checks : [];
  const passCount = list.filter(x => PIP_FOR(x.pip) === "pass").length;

  const ts = useMemo(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    return `${hh}:${mm} IST · ${d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}`;
  }, []);

  if (verdict === "retake") {
    return (
      <div className="m-screen">
        <div className="m-content m-top screen-enter">
          <Progress idx={4}/>
          <div className="m-verdict-head" style={{marginTop: 12}}>
            <span>Assay <b>—</b></span>
            <span>{ts}</span>
          </div>
          <h1 className="m-verdict-h" style={{marginTop: 24}}>Photo unclear. <em>Retake.</em></h1>
          <p className="m-verdict-deva">फोटो साफ़ नहीं — फिर कोशिश करो।</p>
          <p className="m-verdict-sub">{sub || "Try again in better light, with the produce filling most of the frame."}</p>
          <div className="m-bottom-bar">
            <button className="m-btn tilak" onClick={onRetake}>Take new photo</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-screen">
      <div className="m-content m-top screen-enter">
        <p className="m-verdict-eyebrow"><b>{subject}</b> · {ts}</p>

        <div className="m-verdict-card">
          <div className="m-verdict-stamp">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" fill="none" stroke={theme.color} strokeWidth="3"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke={theme.color} strokeWidth="1" strokeDasharray="2 4"/>
              <circle cx="100" cy="100" r="64" fill="none" stroke={theme.color} strokeWidth="2"/>
              <defs><path id="m-stamp-ring" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"/></defs>
              <text fontFamily="JetBrains Mono" fontSize="9" letterSpacing="3" fill={theme.color} fontWeight="700">
                <textPath href="#m-stamp-ring" startOffset="0">{`${stampEn.toUpperCase()} · ${stampDeva} · `.repeat(2)}</textPath>
              </text>
            </svg>
            <div className="deva-c" style={{ color: theme.color }}>{stampDeva}</div>
          </div>
          <h1 className="m-verdict-h">{headline}</h1>
          {devaLine && <p className="m-verdict-deva">{devaLine}</p>}
          {sub && <p className="m-verdict-sub">{sub}</p>}
        </div>

        {list.length > 0 && (
          <div className="m-report">
            <h4>Report · <b>{passCount} of {list.length} clean</b></h4>
            <ul className="m-report-list">
              {list.map((row, i) => (
                <li key={i}>
                  <div>
                    <span className="label">{row.label}</span>
                    <div className="sub">{row.status}</div>
                  </div>
                  <span className={"pip " + PIP_FOR(row.pip)}>{row.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {checks.length > 0 && (
          <div className="m-report">
            <h4>Do this at the stall</h4>
            <ul className="m-report-list">
              {checks.map((c, i) => (
                <li key={i}>
                  <div>
                    <span className="label">{c.title}</span>
                    <div className="sub">{c.body}</div>
                  </div>
                  <span className="pip hold">{c.icon || "·"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="m-bottom-bar">
          <button className="m-btn" onClick={onRestart}>Scan another</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
const USER_KEY = "parakh:user";

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch { return null; }
  });
  const [idx, setIdx] = useState(() => {
    const h = location.hash.replace("#","");
    const i = STEPS.indexOf(h);
    return i >= 0 ? i : 0;
  });
  const [result, setResult] = useState(null);

  // Persist user across reloads
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  // Returning users: skip straight to the camera on page load
  useEffect(() => {
    const cur = STEPS[idx];
    if (user && (cur === "splash" || cur === "value" || cur === "signup")) {
      setIdx(STEPS.indexOf("scanner"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { location.hash = STEPS[idx]; }, [idx]);
  useEffect(() => {
    const onHash = () => {
      const i = STEPS.indexOf(location.hash.replace("#",""));
      if (i >= 0 && i !== idx) setIdx(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [idx]);

  // Advance — skip the signup step if the user is already signed up
  const next = () => setIdx(i => {
    let n = Math.min(STEPS.length - 1, i + 1);
    if (STEPS[n] === "signup" && user) n = STEPS.indexOf("scanner");
    return n;
  });
  const back = () => setIdx(i => Math.max(0, i - 1));
  // "Scan another" — returning user goes back to camera, new user goes to splash
  const restart = () => { setResult(null); setIdx(user ? STEPS.indexOf("scanner") : 0); };
  const cur = STEPS[idx];

  const goToScanner = () => setIdx(STEPS.indexOf("scanner"));

  let screen;
  if (cur === "splash")  screen = <Splash onNext={next}/>;
  if (cur === "value")   screen = <ValueProp onNext={next} onBack={back}/>;
  if (cur === "scanner") screen = <Scanner key={"sc"+idx} onComplete={(data) => { setResult(data); setIdx(STEPS.indexOf("verdict")); }} onBack={back}/>;
  if (cur === "signup")  screen = <SignUp onNext={(u) => { setUser(u); next(); }} onBack={back}/>;
  if (cur === "verdict") screen = <Verdict name={user?.name} result={result} onRestart={restart} onRetake={goToScanner}/>;

  return (
    <div data-screen-label={`${String(idx+1).padStart(2,'0')} ${cur}`} style={{height:'100%'}}>
      {screen}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
