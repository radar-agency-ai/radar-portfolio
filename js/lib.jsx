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

/* IMAGE — abstract massing of a building, duotone */
function PhImage({ seed="x", variant=0 }){
  const r = rng(hash(seed)+variant*97);
  const blocks = [];
  const n = 2 + Math.floor(r()*3);
  for(let i=0;i<n;i++){
    const w = 16+r()*34, h = 30+r()*48;
    blocks.push({ l:6+i*(82/n)+r()*6, w, h, b:8+r()*8 });
  }
  return (
    <div className="ph ph--img">
      <div className="ph__sky" />
      {blocks.map((b,i)=>(
        <div key={i} className="ph__mass" style={{ left:b.l+"%", bottom:b.b+"%", width:b.w+"%", height:b.h+"%" }} />
      ))}
      <div className="ph__grain" />
    </div>
  );
}

/* DESSIN — axonometric-ish line drawing */
function PhDraw({ seed="x" }){
  const r = rng(hash(seed)+311);
  const boxes = [];
  const n = 3 + Math.floor(r()*3);
  for(let i=0;i<n;i++){
    boxes.push({ l:10+r()*60, t:18+r()*52, w:14+r()*30, h:14+r()*34 });
  }
  const lines = [];
  for(let i=0;i<5;i++){ lines.push({ x:8+i*18+r()*4, h:40+r()*40, t:14+r()*8 }); }
  return (
    <div className="ph ph--draw">
      {/* faint construction grid */}
      <div style={{position:"absolute",inset:0,opacity:.25,backgroundImage:"linear-gradient(rgba(11,11,11,.5) .5px,transparent .5px),linear-gradient(90deg,rgba(11,11,11,.5) .5px,transparent .5px)",backgroundSize:"26px 26px"}} />
      {boxes.map((b,i)=>(
        <div key={i} className="lnf" style={{ left:b.l+"%", top:b.t+"%", width:b.w+"%", height:b.h+"%", transform:`skewY(-12deg)` }} />
      ))}
      {boxes.map((b,i)=>(
        <div key={"d"+i} className="lnf" style={{ left:(b.l+4)+"%", top:(b.t-6)+"%", width:b.w+"%", height:b.h+"%", opacity:.4 }} />
      ))}
      <div className="ln" style={{ left:"8%", right:"8%", bottom:"22%", height:"1px" }} />
    </div>
  );
}

/* PLAN — schematic floor plan, zoomable detail */
function PhPlan({ seed="x", detailed=false }){
  const r = rng(hash(seed)+733);
  const rooms = [];
  const cols = detailed?5:3, rows = detailed?4:3;
  const W=84, H=78, ox=8, oy=11;
  let used=[];
  for(let i=0;i<(detailed?9:6);i++){
    const cw = (1+Math.floor(r()*2)) * (W/cols);
    const ch = (1+Math.floor(r()*2)) * (H/rows);
    const cx = ox + Math.floor(r()*cols)*(W/cols);
    const cy = oy + Math.floor(r()*rows)*(H/rows);
    rooms.push({ l:cx, t:cy, w:Math.min(cw, ox+W-cx), h:Math.min(ch, oy+H-cy) });
  }
  return (
    <div className="ph ph--plan">
      <div className="grid" />
      {/* outer wall */}
      <div className="room" style={{ left:ox+"%", top:oy+"%", width:W+"%", height:H+"%", borderWidth:"2px" }} />
      {rooms.map((rm,i)=>(
        <div key={i} className="room" style={{ left:rm.l+"%", top:rm.t+"%", width:rm.w+"%", height:rm.h+"%" }} />
      ))}
      {/* door swings + fixtures when detailed */}
      {detailed && rooms.map((rm,i)=>(
        <div key={"d"+i} style={{ position:"absolute", left:(rm.l+1)+"%", top:(rm.t+1)+"%", width:"14px", height:"14px", borderTop:"1px solid rgba(11,11,11,.6)", borderRight:"1px solid rgba(11,11,11,.6)", borderRadius:"0 14px 0 0" }} />
      ))}
      {/* dimension line */}
      <div className="dim" style={{ left:ox+"%", right:(100-ox-W)+"%", top:(oy-4)+"%" }} />
      <div style={{ position:"absolute", left:ox+"%", top:(oy-7)+"%", fontFamily:"var(--mono)", fontSize:"8px", letterSpacing:".1em", color:"rgba(11,11,11,.5)" }}>± {Math.round(20+r()*30)} M</div>
      {detailed && <div style={{ position:"absolute", right:"7%", bottom:"6%", fontFamily:"var(--mono)", fontSize:"8px", letterSpacing:".12em", color:"rgba(11,11,11,.5)" }}>N ↑ &nbsp; 1:200</div>}
    </div>
  );
}

/* dispatch by mode */
function ProjectMedia({ project, mode="img", variant=0 }){
  if(mode==="draw") return <PhDraw seed={project.id} />;
  if(mode==="plan") return <PhPlan seed={project.id} detailed={variant>0} />;
  return <PhImage seed={project.id} variant={variant} />;
}

/* PORTRAIT placeholder */
function Portrait({ seed="x", className="", style }){
  const r = rng(hash(seed));
  const hue = 0; // monochrome
  const tone = 0.78 + r()*0.16;
  return (
    <div className={"pp "+className} style={{ filter:`grayscale(1) brightness(${tone})`, ...style }} />
  );
}

/* small arrow glyph */
function Arrow({ d="right", s=12 }){
  const rot = { right:0, down:90, up:-90, left:180 }[d]||0;
  return <svg width={s} height={s} viewBox="0 0 16 16" style={{ transform:`rotate(${rot}deg)` }} fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 8h10M9 4l4 4-4 4"/></svg>;
}

Object.assign(window, { useInView, Reveal, RevealText, Counter, Parallax, PhImage, PhDraw, PhPlan, ProjectMedia, Portrait, Arrow });
