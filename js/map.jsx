/* ============================================================
   MAP EXPLORER — interactive map + multicriteria filtering
   ============================================================ */
const { useState:mUseState, useMemo:mUseMemo } = React;

function FilterGroup({ title, options, sel, onToggle }){
  return (
    <div className="fgroup">
      <div className="fgroup__h">
        <span className="mono">{title}</span>
        <span className="mono-sm muted">{sel.length||"—"}</span>
      </div>
      <div className="fchips">
        {options.map(o=>(
          <button key={o} className={`chip ${sel.includes(o)?"is-on":""}`} onClick={()=>onToggle(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function MapExplorer(){
  const all = window.PROJECTS, F = window.FILTERS;
  const [f, setF] = mUseState({ use:[], city:[], status:[], size:[] });
  const [active, setActive] = mUseState(null);

  const toggle = (cat,val)=> setF(p=>({ ...p, [cat]: p[cat].includes(val) ? p[cat].filter(x=>x!==val) : [...p[cat], val] }));
  const reset = ()=> setF({ use:[], city:[], status:[], size:[] });

  const match = (p)=> (!f.use.length||f.use.includes(p.use)) && (!f.city.length||f.city.includes(p.city)) && (!f.status.length||f.status.includes(p.status)) && (!f.size.length||f.size.includes(p.size));
  const shown = all.filter(match);
  const activeP = active ? all.find(p=>p.id===active) : null;
  const activeVisible = activeP && match(activeP);
  const count = Object.values(f).reduce((a,b)=>a+b.length,0);

  return (
    <div>
      <div className="flex between center" style={{marginBottom:22, flexWrap:"wrap", gap:16}}>
        <div className="mono muted"><span style={{color:"var(--ink)"}}>{shown.length}</span> / {all.length} projets affichés</div>
        {count>0 && <button className="btn-ghost" onClick={reset}>Réinitialiser ({count}) ✕</button>}
      </div>
      <div className="map">
        <div className="map__filters">
          <FilterGroup title="Usage" options={F.use} sel={f.use} onToggle={(v)=>toggle("use",v)} />
          <FilterGroup title="Localisation" options={F.city} sel={f.city} onToggle={(v)=>toggle("city",v)} />
          <FilterGroup title="Statut" options={F.status} sel={f.status} onToggle={(v)=>toggle("status",v)} />
          <FilterGroup title="Échelle" options={F.size} sel={f.size} onToggle={(v)=>toggle("size",v)} />
        </div>
        <div className="map__canvas">
          {/* abstract lake / river hint */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.4}}>
            <path d="M0,46 C18,40 26,52 38,50 C52,48 60,60 78,56 C88,53 96,58 100,55" fill="none" stroke="rgba(11,11,11,.25)" strokeWidth=".4"/>
            <path d="M30,100 C32,80 28,64 36,50 C40,42 38,30 42,18" fill="none" stroke="rgba(11,11,11,.18)" strokeWidth=".4"/>
          </svg>
          {all.map(p=>{
            const on = match(p);
            return (
              <div key={p.id} className={`map__pin ${active===p.id?"is-active":""}`}
                style={{ left:p.x+"%", top:p.y+"%", opacity:on?1:.16, pointerEvents:on?"auto":"none", transition:"opacity .4s" }}
                onClick={()=>setActive(p.id)} >
                <div className="map__ring" /><div className="map__dot" />
                <div className="map__lbl">{p.n}</div>
              </div>
            );
          })}
          <div className="map__coords mono-sm">LÉMAN · 46.2°N / 6.1°E — échelle indicative</div>
          {activeP && activeVisible && (
            <div className="map__card reveal in">
              <button className="mono-sm muted" onClick={()=>setActive(null)} style={{position:"absolute",top:10,right:12,zIndex:4,background:"rgba(255,255,255,.8)",width:26,height:26,borderRadius:"50%"}}>✕</button>
              <div className="mc-media"><PhImage seed={activeP.id} variant={1} /></div>
              <div className="mc-body">
                <h4 className="h-md" style={{fontSize:23,lineHeight:1.05}}>{activeP.n}</h4>
                <div className="pcard__meta mono-sm" style={{marginTop:12,color:"var(--muted)"}}>
                  <span>{activeP.use}</span><span>{activeP.city}</span><span>{activeP.year}</span><span>{activeP.area}</span>
                </div>
                <p className="ink2" style={{marginTop:14,fontSize:16,lineHeight:1.4}}>{activeP.tag}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MapExplorer, FilterGroup });
