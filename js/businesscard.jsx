/* ============================================================
   BUSINESS CARD — 3D flippable studio card (Radar Design System)
   Adapted for the site: wrapped in an IIFE so its internals
   (hooks aliases, helpers) never collide with the global scope
   shared across the other text/babel scripts. Exposes window.BusinessCard.
   ============================================================ */
(function(){
  const { useState, useRef, useEffect, useCallback } = React;

  /* Inject component CSS once — plain stylesheet leaning on Radar tokens. */
  const RDC_CSS = `
.rdc-stage{
  --rdc-w:460px;
  display:flex; flex-direction:column; align-items:center; gap:var(--sp-6,34px);
  font-family:var(--serif,Georgia,serif); color:var(--ink,#0b0b0b);
  user-select:none; -webkit-user-select:none;
}
.rdc-scene{
  width:var(--rdc-w); height:calc(var(--rdc-w) / 1.75);
  perspective:1600px;
  touch-action:none; cursor:grab;
}
.rdc-scene.is-drag{ cursor:grabbing; }
.rdc-card{
  position:relative; width:100%; height:100%;
  transform-style:preserve-3d;
  will-change:transform;
}

/* —— the two faces —— */
.rdc-face{
  position:absolute; inset:0;
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  border-radius:var(--r-card,2px);
  box-shadow:
    0 1px 1px rgba(11,11,11,.04),
    0 18px 40px rgba(11,11,11,.16),
    0 40px 80px rgba(11,11,11,.12);
}
.rdc-back{ transform:rotateY(180deg); }

/* —— paper material —— */
.rdc-ivory{ background:var(--paper-2,#f6f5f2); color:var(--ink,#0b0b0b); }
.rdc-cream{ background:#f4f1e9; color:var(--ink,#0b0b0b); }
.rdc-ink{   background:var(--ink,#0b0b0b);   color:var(--paper,#fff); }
.rdc-paper{
  position:absolute; inset:0; border-radius:var(--r-card,2px);
  background-image:
    radial-gradient(140% 120% at 22% 0%, rgba(255,255,255,.65), transparent 55%),
    radial-gradient(120% 120% at 100% 100%, rgba(11,11,11,.05), transparent 60%);
}
.rdc-ink .rdc-paper{
  background-image:
    radial-gradient(140% 120% at 22% 0%, rgba(255,255,255,.10), transparent 55%),
    radial-gradient(120% 120% at 100% 100%, rgba(0,0,0,.5), transparent 60%);
}
.rdc-grain{
  position:absolute; inset:0; opacity:.05; mix-blend-mode:multiply; pointer-events:none; border-radius:var(--r-card,2px);
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>");
}
.rdc-ink .rdc-grain{ mix-blend-mode:screen; opacity:.06; }

/* —— engraved inner frame (old-money tell) —— */
.rdc-frame{ position:absolute; inset:14px; border:1px solid var(--hair,rgba(11,11,11,.10)); pointer-events:none; }
.rdc-ink .rdc-frame{ border-color:rgba(255,255,255,.16); }

/* —— content —— */
.rdc-pad{ position:absolute; inset:0; z-index:4; padding:30px 32px; display:flex; flex-direction:column; }
.rdc-row{ display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.rdc-spacer{ flex:1; }
.rdc-mono{
  font-family:var(--mono,monospace); font-weight:430;
  font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted,#7c7c78);
}
.rdc-ink .rdc-mono{ color:rgba(255,255,255,.6); }
.rdc-brand{ display:flex; align-items:baseline; gap:6px; font-family:var(--serif); font-weight:400; font-size:19px; letter-spacing:.01em; }
.rdc-dot{ width:5px; height:5px; border-radius:50%; background:currentColor; display:inline-block; transform:translateY(-2px); }
.rdc-name{ font-family:var(--serif); font-weight:320; font-size:30px; line-height:1.02; letter-spacing:-.015em; }
.rdc-title{ margin-top:9px; }
.rdc-rule{ height:1px; background:var(--line-2,#d8d6d0); margin:16px 0 12px; }
.rdc-ink .rdc-rule{ background:rgba(255,255,255,.2); }

/* back face */
.rdc-back .rdc-pad{ align-items:center; justify-content:center; text-align:center; }
.rdc-mark{
  font-family:var(--serif); font-weight:200; font-size:74px; line-height:1; letter-spacing:.02em;
  display:flex; align-items:baseline; gap:.06em;
  text-shadow:0 1px 0 rgba(255,255,255,.7), 0 -1px 0 rgba(11,11,11,.08);
}
.rdc-ink .rdc-mark{ text-shadow:0 1px 0 rgba(0,0,0,.5), 0 -1px 1px rgba(255,255,255,.12); }
.rdc-mark .rdc-dot{ width:9px; height:9px; transform:translateY(-6px); }
.rdc-contact{ margin-top:22px; display:flex; flex-direction:column; gap:7px; }
.rdc-contact .rdc-mono{ letter-spacing:.14em; }

/* —— Gilt accent (old-money gold foil) — layered over any paper. —— */
.rdc-gilt .rdc-frame{ border-color:var(--gilt,#9c7b43); }
.rdc-ink.rdc-gilt .rdc-frame{ border-color:var(--gilt-light,#e7cd97); }
.rdc-gilt .rdc-rule{ background:linear-gradient(90deg, var(--gilt-deep,#7d6234), var(--gilt-light,#e7cd97), var(--gilt-deep,#7d6234)); height:1px; }
.rdc-gilt .rdc-dot{ background:linear-gradient(135deg, var(--gilt-deep,#7d6234), var(--gilt-light,#e7cd97)); }
.rdc-gilt .rdc-mark{
  background:linear-gradient(135deg, var(--gilt-deep,#7d6234) 0%, var(--gilt-light,#e7cd97) 48%, var(--gilt,#9c7b43) 100%);
  -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
  text-shadow:none;
}
.rdc-gilt .rdc-brand{ color:var(--gilt,#9c7b43); }
.rdc-ink.rdc-gilt .rdc-brand{ color:var(--gilt-light,#e7cd97); }

/* —— mobile: shrink the card to fit and scale the type so nothing overflows —— */
@media (max-width:560px){
  .rdc-scene{ width:min(var(--rdc-w), 86vw); height:calc(min(var(--rdc-w), 86vw) / 1.75); }
  .rdc-pad{ padding:22px 24px; }
  .rdc-frame{ inset:11px; }
  .rdc-mono{ font-size:8.5px; letter-spacing:.1em; }
  .rdc-brand{ font-size:16px; }
  .rdc-name{ font-size:24px; }
  .rdc-rule{ margin:13px 0 10px; }
  .rdc-mark{ font-size:58px; }
  .rdc-contact{ margin-top:18px; gap:6px; }
  .rdc-contact .rdc-mono{ letter-spacing:.1em; }
}
`;

  function useInjectCss(){
    useEffect(() => {
      if (document.getElementById("rdc-style")) return;
      const el = document.createElement("style");
      el.id = "rdc-style";
      el.textContent = RDC_CSS;
      document.head.appendChild(el);
    }, []);
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const IDLE = { x: 0, y: 0, z: 0 };

  function BusinessCard({
    name = "Au-delà du possible.",
    title = "Créativité business",
    company = "Radar",
    monogram = "R",
    email = "contact.radar.paris@gmail.com",
    phone = "+33 6 03 62 20 81",
    tel = "+33603622081",          // E.164 — used for the tap-to-call link
    website = "radar.paris",
    location = "Paris · 48.85°N",
    index = "05",
    variant = "cream",
    accent = "gilt",
    width = 400,
    controls = false,
  }) {
    useInjectCss();

    // pas d'auto-rotation si l'utilisateur préfère réduire les animations
    const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const [rot, setRot] = useState(IDLE);
    const [spin, setSpin] = useState(!reduced);
    const [drag, setDrag] = useState(false);

    const rotRef = useRef(rot);
    rotRef.current = rot;
    const dragRef = useRef(null);
    const spinRaf = useRef(0);
    const animRaf = useRef(0);
    const idleTimer = useRef(0);

    /* —— auto-spin (continuous, slow) —— */
    useEffect(() => {
      if (!spin) return;
      let prev = performance.now();
      const tick = (now) => {
        const dt = (now - prev) / 1000; prev = now;
        setRot((r) => ({ ...r, y: r.y + dt * 12 }));
        spinRaf.current = requestAnimationFrame(tick);
      };
      spinRaf.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(spinRaf.current);
    }, [spin]);

    /* —— relancer l'auto-rotation après 3 s sans interaction —— */
    const scheduleIdleSpin = useCallback(() => {
      if (reduced) return;
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setSpin(true), 3000);
    }, [reduced]);

    /* cleanup any tween / idle timer on unmount */
    useEffect(() => () => {
      cancelAnimationFrame(animRaf.current);
      clearTimeout(idleTimer.current);
    }, []);

    /* —— tween helper —— */
    const animateTo = useCallback((target, dur = 640) => {
      setSpin(false);
      cancelAnimationFrame(animRaf.current);
      const start = { ...rotRef.current };
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = ease(p);
        setRot({
          x: start.x + (target.x - start.x) * e,
          y: start.y + (target.y - start.y) * e,
          z: start.z + (target.z - start.z) * e,
        });
        if (p < 1) animRaf.current = requestAnimationFrame(step);
      };
      animRaf.current = requestAnimationFrame(step);
    }, []);

    /* —— pointer drag —— */
    const onDown = useCallback((e) => {
      setSpin(false);
      cancelAnimationFrame(animRaf.current);
      clearTimeout(idleTimer.current);
      setDrag(true);
      // sx/sy = origine du geste, moved = a-t-on dépassé le seuil de glissement ?
      dragRef.current = { px: e.clientX, py: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }, []);
    const onMove = useCallback((e) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.px, dy = e.clientY - d.py;
      d.px = e.clientX; d.py = e.clientY;
      if (Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) > 8) d.moved = true;
      setRot((r) => ({ ...r, y: r.y + dx * 0.6, x: clamp(r.x - dy * 0.6, -82, 82) }));
    }, []);
    const onUp = useCallback((e) => {
      const d = dragRef.current;
      setDrag(false);
      dragRef.current = null;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      // clic simple (pas de glissement) → proposer l'appel ; glissement → rotation seule
      if (d && !d.moved) {
        window.location.href = `tel:${tel}`;
      }
      scheduleIdleSpin();
    }, [scheduleIdleSpin, tel]);

    const setAxis = (k) => (e) => {
      setSpin(false);
      cancelAnimationFrame(animRaf.current);
      setRot((r) => ({ ...r, [k]: parseFloat(e.target.value) }));
    };
    const flip = () => { animateTo({ ...rotRef.current, y: rotRef.current.y + 180 }); scheduleIdleSpin(); };
    const reset = () => { animateTo({ ...IDLE }); scheduleIdleSpin(); };

    /* —— which face is toward the viewer? —— */
    const frontVisible = Math.cos((rot.y * Math.PI) / 180) >= 0;

    const surfaceClass = variant === "ink" ? "rdc-ink" : variant === "cream" ? "rdc-cream" : "rdc-ivory";
    const giltClass = accent === "gilt" ? " rdc-gilt" : "";

    const Face = (back) => (
      <div
        className={`rdc-face ${surfaceClass}${giltClass} ${back ? "rdc-back" : "rdc-front"}`}
        style={{ opacity: back ? (frontVisible ? 0 : 1) : (frontVisible ? 1 : 0) }}
      >
        <div className="rdc-paper" />
        <div className="rdc-grain" />
        <div className="rdc-frame" />
        {!back ? (
          <div className="rdc-pad">
            <div className="rdc-row">
              <div className="rdc-brand">{company}<span className="rdc-dot" /></div>
              <div className="rdc-mono">{index} / Carte</div>
            </div>
            <div className="rdc-spacer" />
            <div>
              <div className="rdc-mono rdc-title">{title}</div>
              <div className="rdc-name">{name}</div>
              <div className="rdc-rule" />
              <div className="rdc-row">
                <span className="rdc-mono">{email}</span>
                <span className="rdc-mono">{location}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rdc-pad">
            <div className="rdc-mark">{monogram}<span className="rdc-dot" /></div>
            <div className="rdc-contact">
              <span className="rdc-mono">{website}</span>
              <span className="rdc-mono">{phone}</span>
              <span className="rdc-mono">{location}</span>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="rdc-stage" style={{ "--rdc-w": width + "px" }}>
        <div
          className={"rdc-scene" + (drag ? " is-drag" : "")}
          title="Cliquer pour appeler · glisser pour faire pivoter"
          role="button"
          aria-label={`Appeler le studio au ${phone}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div
            className="rdc-card"
            style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)` }}
          >
            {Face(false)}
            {Face(true)}
          </div>
        </div>

        {controls && (
          <div className="rdc-controls">
            <div className="rdc-controls__head">
              <span className="rdc-eyebrow"><span className="rdc-idx">↻</span> Manipuler la carte</span>
              <span className="rdc-mono">{(((Math.round(rot.y) % 360) + 360) % 360)}°</span>
            </div>
            <div className="rdc-sliders">
              {[
                ["x", "Pitch", -82, 82],
                ["y", "Yaw", -180, 180],
                ["z", "Roll", -45, 45],
              ].map(([k, lbl, min, max]) => (
                <div className="rdc-slider" key={k}>
                  <label>{lbl}</label>
                  <input
                    className="rdc-range" type="range" min={min} max={max} step="1"
                    value={clamp(k === "y" ? (((rot[k] % 360) + 540) % 360) - 180 : rot[k], min, max)}
                    onChange={setAxis(k)}
                  />
                  <output>{Math.round(rot[k])}°</output>
                </div>
              ))}
            </div>
            <div className="rdc-btns">
              <button className="rdc-btn" onClick={flip}>Retourner</button>
              <button className={"rdc-btn" + (spin ? " is-on" : "")} onClick={() => setSpin((s) => !s)}>
                {spin ? "Arrêter" : "Rotation auto"}
              </button>
              <button className="rdc-btn" onClick={reset}>Réinitialiser</button>
            </div>
            <div className="rdc-hint">Glisser la carte pour la faire pivoter</div>
          </div>
        )}
      </div>
    );
  }

  window.BusinessCard = BusinessCard;
})();
