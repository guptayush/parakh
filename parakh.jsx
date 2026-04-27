/* Parakh prototype — shared SVGs, hooks, helpers */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ------------------------------------------------------------------
   ASSAY STAMP — shared SVG, used at multiple sizes
------------------------------------------------------------------ */
function AssayStamp({ animate = false, color = "var(--ink)", tilak = "var(--tilak)", micro = true, ringText = "PARAKH · परख · TEST · ASSAY · APPRAISE · " }) {
  // Repeat the ringText so it wraps the full circle
  const wrappedText = (ringText + ringText + ringText).slice(0, 220);
  return (
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="2"
        className={animate ? "ring-outer" : ""} />
      <circle cx="100" cy="100" r="82" fill="none" stroke={color} strokeWidth="0.75"
        strokeDasharray="2 4" className={animate ? "ring-dash" : ""} />
      <circle cx="100" cy="100" r="68" fill="none" stroke={color} strokeWidth="1.5"
        className={animate ? "ring-inner" : ""} />
      {micro && (
        <>
          <defs>
            <path id="ring-path-shared" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"/>
          </defs>
          <text fontFamily="JetBrains Mono" fontSize="6.5" letterSpacing="2.5" fill={color}>
            <textPath href="#ring-path-shared" startOffset="0">{wrappedText}</textPath>
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

/* ------------------------------------------------------------------
   MANGO — hand-drawn SVG, sits in the viewfinder
------------------------------------------------------------------ */
function Mango() {
  return (
    <svg className="vf-mango" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mango-body" cx="38%" cy="35%" r="75%">
          <stop offset="0%"  stopColor="#FFD46B" />
          <stop offset="40%" stopColor="#F2A23A" />
          <stop offset="80%" stopColor="#C25A1F" />
          <stop offset="100%" stopColor="#7A2E0E" />
        </radialGradient>
        <radialGradient id="mango-blush" cx="62%" cy="22%" r="35%">
          <stop offset="0%" stopColor="#E64A1B" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E64A1B" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* mango body — a soft asymmetric oval */}
      <path
        d="M120,28
           C172,28 208,72 210,140
           C212,210 168,260 118,260
           C70,260 28,210 30,144
           C32,82 70,28 120,28 Z"
        fill="url(#mango-body)"
      />
      <path
        d="M120,28
           C172,28 208,72 210,140
           C212,210 168,260 118,260
           C70,260 28,210 30,144
           C32,82 70,28 120,28 Z"
        fill="url(#mango-blush)"
      />
      {/* highlight */}
      <ellipse cx="86" cy="80" rx="26" ry="14" fill="#FFE9A8" opacity="0.55" />
      {/* stem */}
      <path d="M118,30 C116,18 122,8 130,4" stroke="#5A3A1A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* leaf */}
      <path d="M130,6 C150,2 168,14 168,30 C152,32 138,22 130,6 Z" fill="#3F6B2A"/>
      <path d="M132,10 C148,12 158,22 162,28" stroke="#2A4A1A" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ------------------------------------------------------------------
   ICONS — line-drawn, the four tests
------------------------------------------------------------------ */
const TestIcons = {
  ripeness: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 12 C 40 12 46 22 46 32 C 46 42 38 48 28 48 C 18 48 10 42 10 32 C 10 22 16 12 28 12 Z" />
      <path d="M28 12 C 27 8 29 5 32 4" />
      <path d="M30 5 C 36 4 39 9 39 13 C 35 13 31 10 30 5 Z" fill="currentColor" opacity="0.18"/>
      <circle cx="20" cy="26" r="1.2" fill="currentColor"/>
      <circle cx="36" cy="34" r="1.2" fill="currentColor"/>
    </svg>
  ),
  dye: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 20 C 14 14 22 10 28 10 C 34 10 42 14 42 20 L 40 42 C 40 46 34 48 28 48 C 22 48 16 46 16 42 Z" />
      <path d="M14 24 C 22 26 34 26 42 24" />
      <path d="M22 33 L 22 38" />
      <path d="M28 30 L 28 40" />
      <path d="M34 33 L 34 38" />
    </svg>
  ),
  carbide: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 8 L 28 16" />
      <path d="M16 14 L 20 20" />
      <path d="M40 14 L 36 20" />
      <path d="M22 22 C 22 18 26 16 28 16 C 30 16 34 18 34 22 L 34 26 C 38 28 42 32 42 38 C 42 44 36 48 28 48 C 20 48 14 44 14 38 C 14 32 18 28 22 26 Z" />
      <path d="M22 38 L 28 34 L 32 38 L 28 42 Z" fill="currentColor" opacity="0.18"/>
    </svg>
  ),
  pesticide: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 4 C 32 12 40 16 40 24 C 40 32 34 36 28 36 C 22 36 16 32 16 24 C 16 16 24 12 28 4 Z" />
      <path d="M28 36 L 28 50" />
      <path d="M22 44 L 28 40 L 34 44" />
      <circle cx="22" cy="22" r="1.2" fill="currentColor"/>
      <circle cx="34" cy="22" r="1.2" fill="currentColor"/>
      <circle cx="28" cy="28" r="1.2" fill="currentColor"/>
    </svg>
  ),
};

/* ------------------------------------------------------------------
   FLOW NAV — top bar with progress
------------------------------------------------------------------ */
const STEPS = [
  { id: "splash",   label: "Splash" },
  { id: "value",    label: "What we test" },
  { id: "scanner",  label: "Scan" },
  { id: "signup",   label: "Identity" },
  { id: "verdict",  label: "Verdict" },
];

function TopBar({ stepIndex, onJump }) {
  const step = STEPS[stepIndex];
  return (
    <header className="topbar">
      <div className="left">
        <span className="step-meta">Step <b>{String(stepIndex + 1).padStart(2, "0")}</b> · {step.label}</span>
      </div>
      <div className="lockup">
        <span className="deva">परख</span>
        <span className="rule"></span>
        <span className="latin">Parakh</span>
      </div>
      <div className="right">
        <span className="flow-progress">
          {STEPS.map((s, i) => (
            <i key={s.id}
               className={i < stepIndex ? "on" : i === stepIndex ? "cur" : ""}
               onClick={() => onJump && onJump(i)}
               style={{ cursor: "pointer" }} />
          ))}
        </span>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------
   01 SPLASH
------------------------------------------------------------------ */
function Splash({ onNext }) {
  return (
    <div className="splash screen-enter">
      <div className="splash-stamp">
        <AssayStamp animate />
        <div className="deva-center">परख</div>
      </div>
      <h1 className="splash-lockup">Parakh.</h1>
      <p className="splash-tag"><span className="deva-tag">परख</span> the assayer of fresh produce</p>
      <div className="splash-cta">
        <button className="btn" onClick={onNext}>Begin</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   02 VALUE PROP
------------------------------------------------------------------ */
function ValueProp({ onNext, onBack }) {
  return (
    <div className="value screen-enter">
      <div className="value-hed">
        <p className="eyebrow"><b>01 / 04</b> · what Parakh tests</p>
        <h1>Trust. <em>Then buy.</em></h1>
        <p>Hold a fruit up to the camera. Parakh runs the same kind of tests a jeweller runs on gold — only for produce. Four checks, one verdict, in seconds.</p>
        <div style={{display:'flex', gap: 12, marginTop: 24}}>
          <button className="btn ghost" onClick={onBack}>Back</button>
          <button className="btn tilak" onClick={onNext}>Try a scan →</button>
        </div>
      </div>
      <div className="value-tests">
        <div className="test-card">
          <p className="num">01</p>
          <div className="icon">{TestIcons.ripeness}</div>
          <h3>Ripeness</h3>
          <p className="deva">पकाव</p>
          <p>Color, surface, stem condition. Is it ready to eat today, or wait two more days?</p>
        </div>
        <div className="test-card">
          <p className="num">02</p>
          <div className="icon">{TestIcons.dye}</div>
          <h3>Surface dye</h3>
          <p className="deva">रंग</p>
          <p>Artificial color washed onto the skin to fake ripeness. Common in mangoes and tomatoes.</p>
        </div>
        <div className="test-card">
          <p className="num">03</p>
          <div className="icon">{TestIcons.carbide}</div>
          <h3>Carbide ripening</h3>
          <p className="deva">मसाला</p>
          <p>Chemically forced ripening with calcium carbide. Tell-tale uniform color, no stem freshness.</p>
        </div>
        <div className="test-card">
          <p className="num">04</p>
          <div className="icon">{TestIcons.pesticide}</div>
          <h3>Pesticide signs</h3>
          <p className="deva">कीटनाशक</p>
          <p>Visual proxy: residue spots, oily sheen, surface waxing patterns. Wash before eating.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   03 SCANNER — runs the four tests one by one
------------------------------------------------------------------ */
const SCAN_TESTS = [
  { key: "ripe",   label: "Ripeness",          deva: "पकाव",      meta: "COLOR · SURFACE · STEM" },
  { key: "dye",    label: "Surface dye",       deva: "रंग",        meta: "PIGMENT · GLOSS" },
  { key: "carb",   label: "Carbide ripening",  deva: "मसाला",      meta: "UNIFORMITY · STEM" },
  { key: "pest",   label: "Pesticide signs",   deva: "कीटनाशक",   meta: "RESIDUE · SHEEN" },
];

function Scanner({ onNext, onBack }) {
  const [active, setActive] = useState(0); // index of currently-running test
  const [progress, setProgress] = useState(0); // 0..1
  const intervalRef = useRef(null);

  useEffect(() => {
    // run each test for ~1.6s
    const PER = 1600;
    const TOTAL = PER * SCAN_TESTS.length;
    const start = performance.now();
    intervalRef.current = setInterval(() => {
      const t = performance.now() - start;
      const p = Math.min(1, t / TOTAL);
      setProgress(p);
      const idx = Math.min(SCAN_TESTS.length, Math.floor(t / PER));
      setActive(idx);
      if (p >= 1) {
        clearInterval(intervalRef.current);
        // small delay before nudging on
        setTimeout(() => onNext && onNext(), 700);
      }
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, [onNext]);

  return (
    <div className="scanner screen-enter">
      <div className="viewfinder">
        <div className="vf-meta">
          <span className="live"><i></i>Live · 1080p</span>
          <span>Subject · Mango</span>
        </div>
        <div className="vf-stage">
          <Mango />
        </div>
        <div className="vf-reticle">
          <span className="vf-cor tl"></span><span className="vf-cor tr"></span>
          <span className="vf-cor bl"></span><span className="vf-cor br"></span>
          <div className="vf-scan"></div>
        </div>
        <div className="vf-foot">
          <span>Assay 0241-A</span>
          <span>02:14 IST</span>
        </div>
      </div>

      <aside className="readout">
        <div className="readout-head">
          <span>Assay <b>0241-A</b></span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <h2>Examining the mango.</h2>
        <p className="deva-h">परख चल रही है।</p>

        <ul className="readout-list">
          {SCAN_TESTS.map((t, i) => {
            const state = i < active ? "done" : i === active ? "run" : "pending";
            return (
              <li key={t.key} className={state}>
                <span className="pip"></span>
                <span className="label">
                  {t.label} <span style={{fontFamily:'var(--deva)', color:'var(--tilak)', fontSize: 13}}>· {t.deva}</span>
                </span>
                <span className="meta">{t.meta}</span>
                <span className="ck">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7.5 L 5.5 11 L 12 3.5"/>
                  </svg>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="readout-foot">
          <div className="meter"><i style={{ width: `${progress * 100}%` }}></i></div>
          <div className="progress-meta">
            <span>{progress < 1 ? "Running tests" : "Compiling verdict"}</span>
            <span><b>{progress < 1 ? "in progress" : "complete"}</b></span>
          </div>
          <div style={{display:'flex', gap: 10, marginTop: 4}}>
            <button className="btn ghost" onClick={onBack}>Back</button>
            <button className="btn" onClick={onNext} disabled={progress < 1} style={{opacity: progress < 1 ? 0.5 : 1}}>
              See verdict →
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------
   04 SIGN UP — name + phone + OTP
------------------------------------------------------------------ */
function SignUp({ onNext, onBack }) {
  const [stage, setStage] = useState("details"); // details | otp
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendIn, setResendIn] = useState(30);
  const otpRefs = useRef([]);

  // format phone XXXXX XXXXX
  const formatPhone = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 5) return d;
    return d.slice(0, 5) + " " + d.slice(5);
  };

  const phoneDigits = phone.replace(/\D/g, "");
  const canSendOtp = name.trim().length >= 2 && phoneDigits.length === 10;

  useEffect(() => {
    if (stage !== "otp") return;
    setResendIn(30);
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  const sendOtp = () => {
    if (!canSendOtp) return;
    setStage("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 200);
  };

  const setOtpAt = (i, val) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const onOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const otpComplete = otp.every((d) => d !== "");
  const verify = () => {
    if (otpComplete) onNext && onNext({ name, phone: phoneDigits });
  };

  return (
    <div className="signup-wrap screen-enter">
      <aside className="signup-aside">
        <div className="stamp-mini">
          <AssayStamp color="rgba(244,238,226,0.85)" tilak="var(--tilak)" micro={false} />
          <div className="deva-c">परख</div>
        </div>
        <h2>One last <em>seal.</em></h2>
        <p className="deva-line">मुहर लगाओ।</p>
        <p>Your verdict is ready. We just need a name to write on the certificate, and a number so you can find it again later.</p>
        <div className="seal-bg">
          <AssayStamp color="#F4EEE2" tilak="#F4EEE2" />
        </div>
      </aside>

      <section className="signup">
        <p className="eyebrow"><b>02 / 04</b> · identity</p>
        <h3>{stage === "details" ? "Tell us who you are." : "Enter the OTP."}</h3>

        {stage === "details" && (
          <>
            <div className="field">
              <label htmlFor="su-name">Your name</label>
              <input id="su-name" className="input" placeholder="e.g. Ananya Iyer"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="su-phone">Mobile number</label>
              <div className="phone-row">
                <span className="cc">+91</span>
                <input id="su-phone" className="input" placeholder="98765 43210"
                  value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                  inputMode="numeric" />
              </div>
            </div>

            <div className="signup-cta">
              <p className="legal">By continuing, you agree to Parakh's terms. We'll text you a one-time code.</p>
              <div style={{display:'flex', gap: 10}}>
                <button className="btn ghost" onClick={onBack}>Back</button>
                <button className="btn tilak" onClick={sendOtp} disabled={!canSendOtp}
                  style={{opacity: canSendOtp ? 1 : 0.5}}>
                  Send code →
                </button>
              </div>
            </div>
          </>
        )}

        {stage === "otp" && (
          <>
            <div className="field">
              <label>Sent to +91 {phone}</label>
              <div className="otp-row">
                {otp.map((d, i) => (
                  <input key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className={"otp-cell" + (d ? " has" : "")}
                    value={d}
                    onChange={(e) => setOtpAt(i, e.target.value)}
                    onKeyDown={(e) => onOtpKey(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                  />
                ))}
              </div>
              <div className="otp-meta">
                <span>{resendIn > 0 ? `Resend in 0:${String(resendIn).padStart(2,'0')}` : <a onClick={() => setResendIn(30)}>Resend code</a>}</span>
                <a onClick={() => setStage("details")}>Wrong number?</a>
              </div>
            </div>

            <div className="signup-cta" style={{marginTop: 24}}>
              <p className="legal">Khara hai. Just one more step to your verdict.</p>
              <div style={{display:'flex', gap: 10}}>
                <button className="btn ghost" onClick={() => setStage("details")}>Back</button>
                <button className="btn tilak" onClick={verify} disabled={!otpComplete}
                  style={{opacity: otpComplete ? 1 : 0.5}}>
                  Verify & continue →
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------
   05 VERDICT
------------------------------------------------------------------ */
function Verdict({ onRestart, name }) {
  const ts = "02:14 IST · 28 Apr";
  return (
    <div className="verdict-wrap screen-enter">
      <div className="verdict-card">
        <div className="verdict-meta">
          <span>Assay <b>0241-A</b></span>
          <span>{ts}</span>
        </div>

        <div className="verdict-stamp-press">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="var(--pass)" strokeWidth="3"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--pass)" strokeWidth="1" strokeDasharray="2 4"/>
            <circle cx="100" cy="100" r="64" fill="none" stroke="var(--pass)" strokeWidth="2"/>
            <text fontFamily="JetBrains Mono" fontSize="10" letterSpacing="3" fill="var(--pass)" fontWeight="700">
              <textPath href="#stamp-ring-pass" startOffset="0">PASS · खरा है · PASS · खरा है · </textPath>
            </text>
            <defs>
              <path id="stamp-ring-pass" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"/>
            </defs>
          </svg>
          <div className="deva-c">खरा</div>
        </div>

        <p className="eyebrow" style={{marginTop: 6}}>
          <b>03 / 04</b> · verdict {name && <>· for <span className="tilak-mark">{name.split(" ")[0]}</span></>}
        </p>
        <h1 className="verdict-headline">Khara hai. <em>Buy it.</em></h1>
        <p className="verdict-deva">खरा है। आज ही खाओ।</p>
        <p className="verdict-sub">A clean mango — naturally ripened, no surface dye, no signs of carbide. Slice it tonight; flavour peaks in the next 36 hours.</p>

        <div className="verdict-meta-row">
          <div className="cell">Subject<span className="v">Mango · Alphonso</span></div>
          <div className="cell">Confidence<span className="v">92%</span></div>
          <div className="cell">Best by<span className="v">29 Apr</span></div>
        </div>
      </div>

      <aside className="report">
        <h4>Test report · <b>4 of 4 passed</b></h4>
        <ul className="report-list">
          <li>
            <div>
              <span className="label">Ripeness <span className="deva">· पकाव</span></span>
              <div className="sub">Color &amp; surface read natural; stem fresh.</div>
            </div>
            <span className="verdict-pip pass">Pass</span>
          </li>
          <li>
            <div>
              <span className="label">Surface dye <span className="deva">· रंग</span></span>
              <div className="sub">No pigment transfer; gloss reads natural.</div>
            </div>
            <span className="verdict-pip pass">Pass</span>
          </li>
          <li>
            <div>
              <span className="label">Carbide ripening <span className="deva">· मसाला</span></span>
              <div className="sub">Color variation present; stem moisture intact.</div>
            </div>
            <span className="verdict-pip pass">Pass</span>
          </li>
          <li>
            <div>
              <span className="label">Pesticide signs <span className="deva">· कीटनाशक</span></span>
              <div className="sub">Light surface wax. Wash before eating.</div>
            </div>
            <span className="verdict-pip pass">Pass</span>
          </li>
        </ul>

        <div className="report-foot">
          <span className="ts">Sealed {ts}</span>
          <button className="btn ghost" onClick={onRestart}>Scan another</button>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------
   APP — wires the flow with hash routing
------------------------------------------------------------------ */
function App() {
  const [stepIndex, setStepIndex] = useState(() => {
    const h = location.hash.replace("#", "");
    const i = STEPS.findIndex((s) => s.id === h);
    return i >= 0 ? i : 0;
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    location.hash = STEPS[stepIndex].id;
  }, [stepIndex]);

  useEffect(() => {
    const onHash = () => {
      const h = location.hash.replace("#", "");
      const i = STEPS.findIndex((s) => s.id === h);
      if (i >= 0 && i !== stepIndex) setStepIndex(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [stepIndex]);

  const next = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  const back = () => setStepIndex((i) => Math.max(0, i - 1));
  const restart = () => setStepIndex(0);

  const current = STEPS[stepIndex].id;

  return (
    <div className="app-shell" data-screen-label={`${String(stepIndex + 1).padStart(2,'0')} ${STEPS[stepIndex].label}`}>
      <TopBar stepIndex={stepIndex} onJump={(i) => setStepIndex(i)} />
      <main className="stage">
        {current === "splash"  && <Splash onNext={next} />}
        {current === "value"   && <ValueProp onNext={next} onBack={back} />}
        {current === "scanner" && <Scanner key={"sc-" + stepIndex} onNext={next} onBack={back} />}
        {current === "signup"  && <SignUp onNext={(u) => { setUser(u); next(); }} onBack={back} />}
        {current === "verdict" && <Verdict onRestart={restart} name={user?.name} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
