/* ============================================================
   APP — loader/wipe, nav, no-reload page transitions, mount
   ============================================================ */
const { useState:aUseState, useEffect:aUseEffect, useRef:aUseRef } = React;

const PAGES = [
  { id:"index", label:"Home", num:"01" },
  { id:"savoir-faire", label:"Savoir-faire", num:"02" },
  { id:"studio", label:"Studio", num:"03" },
  { id:"contact", label:"Contact", num:"04" },
];

function Loader({ onDone }){
  const [wiping, setWiping] = aUseState(false);
  aUseEffect(()=>{
    document.body.style.overflow="hidden";
    const t1 = setTimeout(()=>setWiping(true), 1250);
    const t2 = setTimeout(()=>{ document.body.style.overflow=""; onDone(); }, 1250+1150);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); document.body.style.overflow=""; };
  },[]);
  return (
    <div className={`loader ${wiping?"is-wiping":""}`}>
      <div className="loader__inner">
        <div className="loader__mark">
          {"RADAR".split("").map((c,i)=><span key={i} style={{animationDelay:`${i*0.06}s`}}>{c}</span>)}
        </div>
        <div className="loader__bar"><i/></div>
        <div className="loader__meta mono-sm">
          <span>Studio de création web</span><span>Paris · FR</span>
        </div>
      </div>
    </div>
  );
}

function Nav({ page, navigate }){
  const [hidden, setHidden] = aUseState(false);
  const [scrolled, setScrolled] = aUseState(false);
  aUseEffect(()=>{
    let prev = window.scrollY;
    let ticking = false;
    const onScroll = ()=>{
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(()=>{
        const y = window.scrollY;
        const delta = y - prev;
        setScrolled(y > 80);
        if(y < 80){
          setHidden(false);           // toujours visible en haut de page
        } else if(delta > 6){
          setHidden(true);            // scroll vers le bas → cache
        } else if(delta < -6){
          setHidden(false);           // scroll vers le haut → révèle
        }
        prev = y;
        ticking = false;
      });
    };
    const onMove = (e)=>{ if(e.clientY <= 72) setHidden(false); };
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("mousemove", onMove, { passive:true });
    onScroll();
    return ()=>{ window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMove); };
  },[]);
  return (
    <nav className={`nav ${hidden?"is-hidden":""} ${scrolled?"is-blur":""}`}>
      <button className="nav__brand" onClick={()=>navigate("index")}>
        Radar<span className="dot"/>
      </button>
      <div className="nav__links">
        {PAGES.map(p=>(
          <button key={p.id} className={`nav__link ${page===p.id?"is-active":""}`} onClick={()=>navigate(p.id)}>
            <span className="num">{p.num}</span>{p.label}
          </button>
        ))}
      </div>
      <button className="nav__cta" onClick={()=>navigate("contact")}>Prendre contact</button>
    </nav>
  );
}

function App(){
  const [loaded, setLoaded] = aUseState(false);
  const hashPage = (typeof location!=="undefined" && location.hash.replace("#","")) || "index";
  const [page, setPage] = aUseState(PAGES.some(p=>p.id===hashPage)?hashPage:"index");
  const [curtain, setCurtain] = aUseState(null);
  const busy = aUseRef(false);

  const navigate = (next)=>{
    if(busy.current) return;
    if(next===page){ window.scrollTo({top:0,behavior:"smooth"}); return; }
    busy.current = true;
    setCurtain("in");
    setTimeout(()=>{
      setPage(next);
      if(typeof location!=="undefined") location.hash = next;
      window.scrollTo(0,0);
      setCurtain("out");
      setTimeout(()=>{ setCurtain(null); busy.current=false; }, 520);
    }, 520);
  };

  aUseEffect(()=>{
    const onHash = ()=>{ const h=location.hash.replace("#",""); if(PAGES.some(p=>p.id===h)&&h!==page) navigate(h); };
    window.addEventListener("hashchange", onHash);
    return ()=>window.removeEventListener("hashchange", onHash);
  },[page]);

  const render = ()=>{
    if(page==="savoir-faire") return <SavoirFaire navigate={navigate} />;
    if(page==="studio") return <Studio navigate={navigate} />;
    if(page==="contact") return <div className="page page-enter"><Contact /></div>;
    return <Home navigate={navigate} />;
  };

  return (
    <div className="app">
      {!loaded && <Loader onDone={()=>setLoaded(true)} />}
      {curtain && <div className={`curtain ${curtain}`} />}
      <Nav page={page} navigate={navigate} />
      <main key={page}>{render()}</main>
      {page!=="contact" && <Contact />}
      <Footer navigate={navigate} page={page} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
