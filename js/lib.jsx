/* ============================================================
   LIB — hooks, motion primitives, placeholder art
   ============================================================ */
const { useState, useEffect, useRef, useLayoutEffect, useCallback } = React;

/* ---- intersection reveal hook ---- */
function useInView(opts){
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    // safety: always reveal within a short window even if the tab is
    // backgrounded / IntersectionObserver never fires (hidden iframe, print, etc.)
    const safety = setTimeout(()=>setSeen(true), 800);
    if(typeof IntersectionObserver === "undefined"){ setSeen(true); return ()=>clearTimeout(safety); }
    const io = new IntersectionObserver((es)=>{
      es.forEach(e=>{ if(e.isIntersecting){ setSeen(true); io.unobserve(el); } });
    }, { threshold:(opts&&opts.threshold)||0.18, rootMargin:(opts&&opts.rootMargin)||"0px 0px -8% 0px" });
    io.observe(el);
    return ()=>{ io.disconnect(); clearTimeout(safety); };
  },[]);
  return [ref, seen];
}

/* ---- generic reveal wrapper ---- */
function Reveal({ as="div", className="", delay=0, children, ...rest }){
  const [ref, seen] = useInView();
  const Tag = as;
  const d = delay ? `reveal-d${delay}` : "";
  return <Tag ref={ref} className={`reveal ${d} ${seen?"in":""} ${className}`} {...rest}>{children}</Tag>;
}

/* ---- word-by-word text reveal ---- */
function RevealText({ text, className="", tag="p", stagger=42, style }){
  const [ref, seen] = useInView({ threshold:0.3 });
  const Tag = tag;
  const words = String(text).split(" ");
  return (
    <Tag ref={ref} className={`rt ${seen?"in":""} ${className}`} style={style}>
      {words.map((w,i)=>(
        <React.Fragment key={i}>
          <span className="w"><span style={{ transitionDelay:`${i*stagger}ms` }}>{w}</span></span>
          {i<words.length-1 ? " " : ""}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* ---- animated counter ---- */
function Counter({ to=0, suffix="", dur=1500, className="" }){
  const [ref, seen] = useInView({ threshold:0.5 });
  const [v, setV] = useState(0);
  useEffect(()=>{
    if(!seen) return;
    let raf, start;
    const step = (t)=>{
      if(!start) start = t;
      const p = Math.min((t-start)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      setV(Math.round(e*to));
      if(p<1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // fallback: ensure final value lands even if rAF is throttled (hidden tab)
    const settle = setTimeout(()=>setV(to), dur+500);
    return ()=>{ cancelAnimationFrame(raf); clearTimeout(settle); };
  },[seen,to,dur]);
  return <span ref={ref} className={className}>{v}{suffix}</span>;
}

/* ---- soft parallax on scroll ---- */
function Parallax({ amount=40, className="", children, style }){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    let raf=0;
    const onScroll = ()=>{
      if(raf) return;
      raf = requestAnimationFrame(()=>{
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const prog = (r.top + r.height/2 - vh/2) / vh; // -1..1 ish
        el.style.transform = `translate3d(0, ${(-prog*amount).toFixed(2)}px, 0)`;
        raf=0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", onScroll);
    return ()=>{ window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  },[amount]);
  return <div ref={ref} className={className} style={{ willChange:"transform", ...style }}>{children}</div>;
}

/* ============================================================
   PLACEHOLDER ART — image / dessin / plan / portrait
   Deterministic per project id so it stays stable.
   ============================================================ */
function hash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0); }
function rng(seed){ let s=seed%2147483647; if(s<=0) s+=2147483646; return ()=> (s=s*16807%2147483647)/2147483647; }

/* ink tones shared by the sketch generators */
const INK = "#15140f";
const INK_MID = "rgba(11,11,11,.45)";
const INK_FAINT = "rgba(11,11,11,.28)";
const INK_HATCH = "rgba(11,11,11,.14)";

/* IMAGE — clean architectural elevation sketch (line + window grid + shadow hatch) */
function PhImage({ seed="x", variant=0 }){
  const r = rng(hash(seed)+variant*97);
  const ground = 82;
  const n = 2 + Math.floor(r()*2);
  const vols = [];
  let x = 10 + r()*6;
  for(let i=0;i<n && x<84;i++){
    const w = Math.min(15 + r()*20, 86-x);
    const h = 24 + r()*42;
    if(w < 8) break;
    vols.push({ x, w, h });
    x += w + 1.5 + r()*3;
  }
  return (
    <div className="ph ph--img">
      <svg className="ph__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* ground line + survey ticks */}
        <line x1="0" y1={ground} x2="100" y2={ground} stroke={INK} strokeWidth="0.7" />
        <g stroke={INK_MID} strokeWidth="0.3">
          {Array.from({length:15}).map((_,i)=>(<line key={i} x1={i*7} y1={ground} x2={i*7-2.4} y2={ground+2.6} />))}
        </g>
        {vols.map((v,i)=>{
          const top = ground - v.h;
          const cols = Math.max(2, Math.round(v.w/5));
          const rows = Math.max(3, Math.round(v.h/7));
          const el = [];
          for(let c=1;c<cols;c++){ const xx=v.x+v.w*c/cols; el.push(<line key={"c"+i+c} x1={xx} y1={top+1.6} x2={xx} y2={ground-1.6} stroke={INK_FAINT} strokeWidth="0.3" />); }
          for(let rr=1;rr<rows;rr++){ const yy=top+v.h*rr/rows; el.push(<line key={"r"+i+rr} x1={v.x+1.4} y1={yy} x2={v.x+v.w-1.4} y2={yy} stroke={INK_FAINT} strokeWidth="0.3" />); }
          const hatch=[]; const hx0=v.x+v.w*0.72;
          for(let h=2; h<v.h-1; h+=2.3){ hatch.push(<line key={"h"+i+h} x1={hx0} y1={top+h} x2={v.x+v.w} y2={Math.max(top, top+h-2)} stroke={INK_HATCH} strokeWidth="0.3" />); }
          return (
            <g key={i}>
              {hatch}
              <rect x={v.x} y={top} width={v.w} height={v.h} fill="none" stroke={INK} strokeWidth="0.7" />
              {el}
            </g>
          );
        })}
      </svg>
      <div className="ph__grain" />
    </div>
  );
}

/* DESSIN — axonometric line drawing (clean wireframe + construction guides) */
function PhDraw({ seed="x" }){
  const r = rng(hash(seed)+311);
  const w=24+r()*10, h=20+r()*16, d=11+r()*7;
  const x=24+r()*8, y=62+r()*5;
  const ox=d*0.72, oy=-d*0.52;
  const F=[[x,y-h],[x+w,y-h],[x+w,y],[x,y]];
  const top=[F[0],F[1],[F[1][0]+ox,F[1][1]+oy],[F[0][0]+ox,F[0][1]+oy]];
  const side=[F[1],F[2],[F[2][0]+ox,F[2][1]+oy],[F[1][0]+ox,F[1][1]+oy]];
  const pts=a=>a.map(p=>p.join(",")).join(" ");
  return (
    <div className="ph ph--draw">
      <svg className="ph__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g stroke={INK_FAINT} strokeWidth="0.3" strokeDasharray="1.6 1.6">
          <line x1={x} y1={y} x2={x} y2="96" />
          <line x1={x+w} y1={y} x2={x+w} y2="96" />
          <line x1="6" y1={y} x2={x} y2={y} />
          <line x1={F[1][0]+ox} y1={F[1][1]+oy} x2={F[1][0]+ox} y2="96" />
        </g>
        <polygon points={pts(top)} fill="rgba(11,11,11,.045)" stroke={INK} strokeWidth="0.6" />
        <polygon points={pts(side)} fill="rgba(11,11,11,.09)" stroke={INK} strokeWidth="0.6" />
        <polygon points={pts(F)} fill="none" stroke={INK} strokeWidth="0.75" />
        <line x1={x+w/2} y1={y-h} x2={x+w/2} y2={y} stroke={INK_FAINT} strokeWidth="0.3" />
        <line x1={x} y1={y-h/2} x2={x+w} y2={y-h/2} stroke={INK_FAINT} strokeWidth="0.3" />
      </svg>
    </div>
  );
}

/* PLAN — schematic floor plan (outer wall, partitions, door swings, dim line, north) */
function PhPlan({ seed="x", detailed=false }){
  const r = rng(hash(seed)+733);
  const ox=12, oy=15, W=76, H=68;
  const vx = ox + W*(0.38+r()*0.24);
  const hy = oy + H*(0.42+r()*0.2);
  const hy2 = oy + H*(0.72+r()*0.12);
  const vx2 = ox + W*(0.62+r()*0.18);
  return (
    <div className="ph ph--plan">
      <svg className="ph__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <g stroke="rgba(11,11,11,.06)" strokeWidth="0.3">
          {Array.from({length:11}).map((_,i)=>(<line key={"v"+i} x1={i*10} y1="0" x2={i*10} y2="100" />))}
          {Array.from({length:11}).map((_,i)=>(<line key={"h"+i} x1="0" y1={i*10} x2="100" y2={i*10} />))}
        </g>
        <rect x={ox} y={oy} width={W} height={H} fill="none" stroke={INK} strokeWidth="1.5" />
        <line x1={vx} y1={oy} x2={vx} y2={hy} stroke={INK} strokeWidth="0.8" />
        <line x1={ox} y1={hy} x2={ox+W} y2={hy} stroke={INK} strokeWidth="0.8" />
        {detailed && <line x1={vx} y1={hy} x2={vx} y2={oy+H} stroke={INK} strokeWidth="0.8" />}
        {detailed && <line x1={vx} y1={hy2} x2={ox+W} y2={hy2} stroke={INK} strokeWidth="0.6" />}
        {detailed && <line x1={vx2} y1={oy} x2={vx2} y2={hy} stroke={INK} strokeWidth="0.6" />}
        {/* door swings */}
        <path d={`M ${vx} ${hy-8} A 8 8 0 0 1 ${vx-8} ${hy}`} fill="none" stroke={INK_MID} strokeWidth="0.4" />
        <path d={`M ${ox+11} ${hy} A 8 8 0 0 1 ${ox+11} ${hy-8}`} fill="none" stroke={INK_MID} strokeWidth="0.4" />
        {/* dimension line (top) */}
        <g stroke={INK_MID} strokeWidth="0.35">
          <line x1={ox} y1={oy-5} x2={ox+W} y2={oy-5} />
          <line x1={ox} y1={oy-7} x2={ox} y2={oy-3} />
          <line x1={ox+W} y1={oy-7} x2={ox+W} y2={oy-3} />
        </g>
        {/* north arrow */}
        <g transform="translate(91,89)" stroke={INK} strokeWidth="0.5" fill="none">
          <line x1="0" y1="5" x2="0" y2="-5" />
          <polyline points="-2,-2 0,-5 2,-2" />
        </g>
      </svg>
      {detailed && <div className="ph__plan-meta mono-sm">éch. 1:200</div>}
    </div>
  );
}

/* dispatch by mode */
function ProjectMedia({ project, mode="img", variant=0 }){
  if(mode==="draw") return <PhDraw seed={project.id} />;
  if(mode==="plan") return <PhPlan seed={project.id} detailed={variant>0} />;
  return <PhImage seed={project.id} variant={variant} />;
}

/* PORTRAIT placeholder — clean line sketch, head & shoulders */
function Portrait({ seed="x", className="", style }){
  const r = rng(hash(seed));
  const cx = 50;
  const headW = 21 + r()*4;
  const headH = 26 + r()*4;
  const headCy = 33 + r()*3;
  const tilt = (r()*6 - 3);
  return (
    <div className={"pp "+className} style={style}>
      <svg className="ph__svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {/* shadow hatching, lower-right */}
        <g stroke="rgba(11,11,11,.10)" strokeWidth="0.35">
          {Array.from({length:11}).map((_,i)=>(<line key={i} x1={56+i*4.2} y1="100" x2={70+i*4.2} y2={70} />))}
        </g>
        <g transform={`rotate(${tilt} ${cx} ${headCy})`} stroke="#15140f" fill="none" strokeLinecap="round">
          {/* shoulders */}
          <path d={`M ${cx-34} 100 C ${cx-31} 73 ${cx-17} 64 ${cx} 64 C ${cx+17} 64 ${cx+31} 73 ${cx+34} 100`} strokeWidth="0.9" />
          {/* neck */}
          <line x1={cx-5} y1={headCy+headH/2-3} x2={cx-5} y2="66" strokeWidth="0.7" />
          <line x1={cx+5} y1={headCy+headH/2-3} x2={cx+5} y2="66" strokeWidth="0.7" />
          {/* head */}
          <ellipse cx={cx} cy={headCy} rx={headW/2} ry={headH/2} strokeWidth="0.9" />
          {/* hairline */}
          <path d={`M ${cx-headW/2} ${headCy-1} C ${cx-headW/2-2} ${headCy-headH/2-6} ${cx+headW/2+2} ${headCy-headH/2-6} ${cx+headW/2} ${headCy-1}`} strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/* small arrow glyph */
function Arrow({ d="right", s=12 }){
  const rot = { right:0, down:90, up:-90, left:180 }[d]||0;
  return <svg width={s} height={s} viewBox="0 0 16 16" style={{ transform:`rotate(${rot}deg)` }} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 8h10M9 4l4 4-4 4"/></svg>;
}

Object.assign(window, { useInView, Reveal, RevealText, Counter, Parallax, PhImage, PhDraw, PhPlan, ProjectMedia, Portrait, Arrow });
