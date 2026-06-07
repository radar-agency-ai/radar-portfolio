/* ============================================================
   PROJECT SHOWCASE — living asymmetric grid (FLIP reorg),
   3 view modes, plan lightbox (zoom/pan), focus mode.
   ============================================================ */
const { useState:rsUseState, useEffect:rsUseEffect, useRef:rsUseRef, useLayoutEffect:rsUseLayout, useCallback:rsUseCb } = React;

/* ---------------- PLAN LIGHTBOX ---------------- */
function PlanLightbox({ project, onClose }){
  const [t, setT] = rsUseState({ s:1, x:0, y:0 });
  const drag = rsUseRef(null);
  const stageRef = rsUseRef(null);
  const [dragging, setDragging] = rsUseState(false);

  const clamp = (s)=>Math.min(5, Math.max(1, s));
  const zoom = (factor, cx, cy)=> setT(p=>{
    const ns = clamp(p.s*factor);
    if(ns===p.s) return p;
    const k = ns/p.s;
    // zoom toward point (cx,cy) relative to centre
    const nx = cx - (cx - p.x)*k;
    const ny = cy - (cy - p.y)*k;
    return { s:ns, x: ns===1?0:nx, y: ns===1?0:ny };
  });

  rsUseEffect(()=>{
    const onKey = (e)=>{ if(e.key==="Escape") onClose(); if(e.key==="+"||e.key==="=") zoom(1.3,0,0); if(e.key==="-") zoom(1/1.3,0,0); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow="hidden";
    return ()=>{ window.removeEventListener("keydown", onKey); document.body.style.overflow=""; };
  },[]);

  const onWheel = (e)=>{
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width/2;
    const cy = e.clientY - rect.top - rect.height/2;
    zoom(e.deltaY<0?1.16:1/1.16, cx, cy);
  };
  const onDown = (e)=>{ if(t.s<=1) return; setDragging(true); drag.current={ x:e.clientX, y:e.clientY, ox:t.x, oy:t.y }; };
  const onMove = (e)=>{ if(!drag.current) return; setT(p=>({ ...p, x:drag.current.ox+(e.clientX-drag.current.x), y:drag.current.oy+(e.clientY-drag.current.y) })); };
  const onUp = ()=>{ drag.current=null; setDragging(false); };

  return (
    <div className="lb" onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
      <div className="lb__bar">
        <div className="col" style={{gap:4}}>
          <div className="mono" style={{color:"#fff"}}>{project.n} — Plans & coupes</div>
          <div className="mono-sm" style={{color:"rgba(255,255,255,.5)"}}>{project.structure}</div>
        </div>
        <button className="lb__close" onClick={onClose}>Fermer <span style={{fontSize:15,lineHeight:1}}>✕</span></button>
      </div>
      <div ref={stageRef} className={`lb__stage ${dragging?"dragging":""}`} onWheel={onWheel} onMouseDown={onDown} onDoubleClick={(e)=>{ const rect=stageRef.current.getBoundingClientRect(); zoom(t.s>1?1/t.s:1.8, e.clientX-rect.left-rect.width/2, e.clientY-rect.top-rect.height/2);} }>
        <div className="lb__hint">Molette pour zoomer · glisser pour déplacer · double-clic</div>
        <div className="lb__doc" style={{ transform:`translate(-50%,-50%) translate(${t.x}px,${t.y}px) scale(${t.s})` }}>
          <div className="lb__sheet" style={{ width:"min(82vw,1100px)", aspectRatio:"1100/760" }}>
            <PhPlan seed={project.id} detailed={true} />
            <div style={{position:"absolute",left:18,top:14,fontFamily:"var(--mono)",fontSize:10,letterSpacing:".14em",color:"rgba(11,11,11,.55)"}}>dl-c · {project.n.toUpperCase()} · PLAN R+0</div>
            <div style={{position:"absolute",right:18,top:14,fontFamily:"var(--mono)",fontSize:10,letterSpacing:".14em",color:"rgba(11,11,11,.55)"}}>{project.area}</div>
          </div>
        </div>
      </div>
      <div className="lb__zoomui">
        <button onClick={()=>zoom(1/1.3,0,0)}>−</button>
        <button onClick={()=>setT({s:1,x:0,y:0})} style={{minWidth:64}}>{Math.round(t.s*100)}%</button>
        <button onClick={()=>zoom(1.3,0,0)}>+</button>
      </div>
    </div>
  );
}

/* ---------------- FOCUS MODE ---------------- */
function FocusMode({ projects, index, setIndex, onClose }){
  const [hideChrome, setHide] = rsUseState(false);
  const p = projects[index];
  rsUseEffect(()=>{
    const onKey = (e)=>{
      if(e.key==="Escape") onClose();
      if(e.key==="ArrowRight") setIndex((index+1)%projects.length);
      if(e.key==="ArrowLeft") setIndex((index-1+projects.length)%projects.length);
      if(e.key===" "){ e.preventDefault(); setHide(h=>!h); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow="hidden";
    return ()=>{ window.removeEventListener("keydown", onKey); document.body.style.overflow=""; };
  },[index]);
  return (
    <div className={`focus ${hideChrome?"hide-chrome":""}`} onClick={()=>setHide(h=>!h)}>
      <Parallax amount={28} className="focus__img" style={{inset:"-4%"}}>
        <div style={{position:"absolute",inset:0,filter:"grayscale(.25) brightness(.82) contrast(1.05)"}}>
          <PhImage seed={p.id} variant={1} />
        </div>
      </Parallax>
      <div className="focus__chrome" onClick={(e)=>e.stopPropagation()}>
        <div className="focus__top">
          <div className="focus__count">{String(index+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")} — Mode contemplation</div>
          <button className="focus__exit" onClick={onClose}>Quitter <span style={{fontSize:14}}>✕</span></button>
        </div>
        <div className="focus__bot">
          <div className="col" style={{gap:8}}>
            <div className="focus__title">{p.n}</div>
            <div className="mono" style={{color:"rgba(255,255,255,.6)"}}>{p.city} · {p.year} · {p.area}</div>
          </div>
          <div className="focus__nav">
            <button onClick={()=>setIndex((index-1+projects.length)%projects.length)} aria-label="Précédent"><Arrow d="left" s={15}/></button>
            <button onClick={()=>setIndex((index+1)%projects.length)} aria-label="Suivant"><Arrow d="right" s={15}/></button>
          </div>
        </div>
        <div style={{position:"absolute",left:"50%",bottom:24,transform:"translateX(-50%)",pointerEvents:"none"}} className="focus__count hide-mob">Espace / clic — masquer l’interface</div>
      </div>
    </div>
  );
}

/* ---------------- LIVING GRID + DETAIL ---------------- */
function ProjectShowcase(){
  const all = window.PROJECTS;
  const [order, setOrder] = rsUseState(all.map(p=>p.id));
  const [expanded, setExpanded] = rsUseState(null);
  const [mode, setMode] = rsUseState("img");
  const [lightbox, setLightbox] = rsUseState(null);
  const [focus, setFocus] = rsUseState(null);
  const [transing, setTransing] = rsUseState(false);

  const byId = rsUseRef(Object.fromEntries(all.map(p=>[p.id,p]))).current;
  const cardRefs = rsUseRef(new Map());
  const prevRects = rsUseRef(null);

  const ordered = order.map(id=>byId[id]);

  const capture = ()=>{ const m=new Map(); cardRefs.current.forEach((el,id)=>{ if(el) m.set(id, el.getBoundingClientRect()); }); return m; };

  const go = (updater)=>{ prevRects.current = capture(); setTransing(true); updater(); };

  const openProject = (id)=> go(()=>{ setExpanded(id); setMode("img"); setOrder(o=>[id, ...o.filter(x=>x!==id)]); });
  const collapse = ()=> go(()=>{ setExpanded(null); });

  rsUseLayout(()=>{
    if(!prevRects.current) return;
    const last = capture();
    const prev = prevRects.current;
    prevRects.current = null;
    let any=false;
    cardRefs.current.forEach((el,id)=>{
      const f = prev.get(id), l = last.get(id);
      if(!el||!f||!l) return;
      const dx=f.left-l.left, dy=f.top-l.top, sx=f.width/l.width, sy=f.height/l.height;
      if(Math.abs(dx)<1&&Math.abs(dy)<1&&Math.abs(sx-1)<.01&&Math.abs(sy-1)<.01) return;
      any=true;
      el.style.transition="none";
      el.style.transformOrigin="top left";
      el.style.transform=`translate(${dx}px,${dy}px) scale(${sx},${sy})`;
    });
    if(!any){ setTransing(false); return; }
    // commit the inverted state, then play to identity — no rAF (robust when throttled)
    void document.body.offsetWidth;
    cardRefs.current.forEach((el)=>{ if(!el) return; el.style.transition="transform .68s cubic-bezier(.22,.61,.36,1)"; el.style.transform=""; });
    const done = setTimeout(()=>{
      cardRefs.current.forEach((el)=>{ if(el){ el.style.transition=""; el.style.transformOrigin=""; } });
      setTransing(false);
    }, 720);
    return ()=>clearTimeout(done);
  },[order, expanded]);

  const setRef = (id)=>(el)=>{ if(el) cardRefs.current.set(id,el); else cardRefs.current.delete(id); };
  const ep = expanded ? byId[expanded] : null;

  return (
    <div className="pg">
      {/* detail header */}
      {ep && (
        <div className="pdetail__bar reveal in" style={{borderTop:"1px solid var(--line)", marginBottom:18}}>
          <button className="btn-ghost" onClick={collapse}><Arrow d="left"/> Tous les projets</button>
          <div className="flex center gap-m" style={{flexWrap:"wrap"}}>
            <div className="modes">
              {window.MODES.map(m=>(
                <button key={m.id} className={mode===m.id?"is-active":""} onClick={()=>setMode(m.id)}>{m.label}</button>
              ))}
            </div>
            <button className="btn-dark" onClick={()=>setFocus({ index: order.indexOf(expanded) })}>Mode Focus <Arrow d="right"/></button>
          </div>
        </div>
      )}

      {/* living grid */}
      <div className={`pgrid ${ep?"is-detail":""}`} style={ep?{gridAutoRows:"auto"}:null}>
        {ordered.map((p, i)=>{
          const isHero = ep && p.id===expanded;
          const span = ep ? (isHero?12:3) : 4;
          const ar = isHero ? "16/9" : (ep ? "4/3" : "4/3");
          return (
            <div
              key={p.id}
              ref={setRef(p.id)}
              className="pcard"
              onClick={()=> isHero ? setFocus({ index: order.indexOf(p.id) }) : openProject(p.id)}
              style={{ gridColumn:`span ${span}`, aspectRatio:ar, cursor: isHero?"zoom-in":"pointer" }}
            >
              <div className="pcard__media">
                <ProjectMedia project={p} mode={isHero?mode:"img"} variant={isHero?1:0} />
              </div>
              {!transing && (<>
                <div className="pcard__veil" />
                {!isHero && <div className="pcard__idx mono">{String(i+1).padStart(2,"0")}</div>}
                <div className="pcard__info">
                  <div className="pcard__top">
                    <div className="pcard__name">{p.n}</div>
                    <div className="mono-sm" style={{textAlign:"right"}}>{p.year}<br/>{p.status}</div>
                  </div>
                  <div className="pcard__meta mono-sm">
                    <span>{p.use}</span><span>{p.city}</span><span>{p.area}</span>
                  </div>
                </div>
              </>)}
              {isHero && (
                <div style={{position:"absolute",right:16,bottom:14,zIndex:4}} className="mono" >
                  <span style={{background:"rgba(255,255,255,.9)",padding:"6px 10px"}}>Cliquer — contemplation</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* detail body */}
      {ep && (
        <div className="reveal in" style={{marginTop:34}}>
          <div className="cap-head" style={{marginBottom:40}}>
            <div>
              <div className="eyebrow" style={{marginBottom:18}}><span className="idx">{String(order.indexOf(expanded)+1).padStart(2,"0")}</span> {ep.use} · {ep.city}</div>
              <h2 className="h-lg">{ep.n}</h2>
              <p className="lede ink2" style={{marginTop:18, maxWidth:"40ch"}}>{ep.tag}</p>
            </div>
            <div className="spec" style={{alignSelf:"end"}}>
              {[["Localisation",`${ep.city} (${ep.country})`],["Année",ep.year],["Surface",ep.area],["Statut",ep.status],["Mandat",ep.role],["Maître d’ouvrage",ep.team]].map(([k,v],i)=>(
                <div className="spec__row" key={i}><div className="spec__k mono-sm">{k}</div><div className="spec__v">{v}</div></div>
              ))}
            </div>
          </div>

          <div className="flex between center" style={{marginBottom:16}}>
            <div className="mono muted">Lecture des plans — cliquer pour ouvrir le visionneur HD</div>
            <button className="btn-ghost" onClick={()=>setLightbox(ep)}>Ouvrir les plans <Arrow d="up" s={11}/></button>
          </div>
          <div className="thumbstrip" style={{marginBottom:60}}>
            <div className="thumb" onClick={()=>setLightbox(ep)}><PhPlan seed={ep.id} detailed/><div className="tlbl mono-sm">Plan R+0</div></div>
            <div className="thumb" onClick={()=>setLightbox(ep)}><PhPlan seed={ep.id+"b"} detailed/><div className="tlbl mono-sm">Coupe AA</div></div>
            <div className="thumb" onClick={()=>setFocus({ index: order.indexOf(expanded) })} style={{cursor:"pointer"}}><PhDraw seed={ep.id}/><div className="tlbl mono-sm">Détail jonction</div></div>
            <div className="thumb" onClick={()=>setFocus({ index: order.indexOf(expanded) })} style={{cursor:"pointer"}}><PhImage seed={ep.id} variant={2}/><div className="tlbl mono-sm">Vue HD</div></div>
          </div>

          {/* mini locator */}
          <MiniLocator project={ep} />
        </div>
      )}

      {lightbox && <PlanLightbox project={lightbox} onClose={()=>setLightbox(null)} />}
      {focus && <FocusMode projects={ordered} index={focus.index} setIndex={(i)=>setFocus({index:i})} onClose={()=>setFocus(null)} />}
    </div>
  );
}

/* small map locator inside detail */
function MiniLocator({ project }){
  return (
    <div style={{position:"relative",border:"1px solid var(--line)",height:"clamp(220px,30vh,320px)",overflow:"hidden",background:"var(--paper-2)"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(11,11,11,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(11,11,11,.05) 1px,transparent 1px)",backgroundSize:"34px 34px"}} />
      <div className="map__pin is-active" style={{left:project.x+"%",top:project.y+"%"}}>
        <div className="map__ring" /><div className="map__dot" />
        <div className="map__lbl" style={{opacity:1,transform:"none"}}>{project.n}</div>
      </div>
      <div style={{position:"absolute",left:18,top:16}} className="eyebrow">Localisation</div>
      <div style={{position:"absolute",left:18,bottom:16}} className="mono muted">{project.city} ({project.country}) · 46.20°N 6.14°E</div>
    </div>
  );
}

Object.assign(window, { ProjectShowcase, PlanLightbox, FocusMode, MiniLocator });
