/* ============================================================
   SAVOIR-FAIRE — the live case study (dl-c) composing all demos
   ============================================================ */
const { useState:sfUseState } = React;

function SavoirFaire(){
  const [tab, setTab] = sfUseState("projets");
  const caps = window.CAPABILITIES;
  const tabs = [
    { id:"projets", label:"Projets" },
    { id:"carte",   label:"Carte" },
    { id:"agence",  label:"Agence" },
  ];
  return (
    <div className="page page-enter">
      {/* intro */}
      <section className="section wrap" style={{paddingBottom:"clamp(40px,6vh,90px)"}}>
        <div className="eyebrow" style={{marginBottom:40}}><span className="idx">02</span> Savoir-faire <span className="ln"/> Étude de cas en direct</div>
        <div className="cap-head">
          <Reveal>
            <h1 className="display">Une démo,<br/><span className="italic thin">pas un argumentaire.</span></h1>
          </Reveal>
          <Reveal delay={2}>
            <RevealText className="lede ink2" style={{maxWidth:"40ch"}}
              text="Plutôt que de décrire ce que nous savons faire, nous l’avons construit. Voici une maquette vivante d’un portfolio pensée pour une agence d’architecture — chaque interaction ci-dessous est réelle." />
            <div className="mono muted" style={{marginTop:24}}>Contenu fictif · client illustratif “dl-c”</div>
          </Reveal>
        </div>

        {/* capability index */}
        <div style={{marginTop:"clamp(48px,7vh,90px)",borderTop:"1px solid var(--line)"}}>
          {caps.map((c,i)=>(
            <Reveal key={c.id} className="flex" style={{borderBottom:"1px solid var(--line)",padding:"20px 0",alignItems:"baseline",gap:"clamp(16px,3vw,60px)",flexWrap:"wrap"}}>
              <span className="mono muted" style={{width:32}}>{String(i+1).padStart(2,"0")}</span>
              <span className="h-md" style={{flex:"0 0 auto",minWidth:"min(260px,40vw)"}}>{c.k}</span>
              <span className="ink2" style={{flex:1,minWidth:"min(280px,60vw)",fontSize:17,lineHeight:1.45}}>{c.d}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* sticky case sub-nav */}
      <div className="casebar">
        <div className="casebar__in">
          <div className="flex center gap-m">
            <span className="mono" style={{display:"flex",gap:9,alignItems:"center"}}><span className="dot" style={{width:6,height:6,borderRadius:"50%",background:"var(--ink)",display:"inline-block"}}/>dl-c — architectes</span>
          </div>
          <div className="casebar__tabs">
            {tabs.map(t=>(
              <button key={t.id} className={`casetab ${tab===t.id?"is-active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <div className="mono muted hide-mob">Genève · CH</div>
        </div>
      </div>

      <section className="wrap section" style={{paddingTop:"clamp(40px,6vh,80px)"}}>
        {tab==="projets" && (
          <div>
            <div className="flex between center mb-l" style={{flexWrap:"wrap",gap:16}}>
              <h2 className="h-md">Projets — grille symétrique</h2>
              <div className="mono muted maxw-38" style={{textAlign:"right"}}>Survol : données du projet · Clic : la grille se réorganise et révèle le détail</div>
            </div>
            <ProjectShowcase />
          </div>
        )}
        {tab==="carte" && (
          <div>
            <div className="flex between center mb-l" style={{flexWrap:"wrap",gap:16}}>
              <h2 className="h-md">Carte — ancrage territorial</h2>
              <div className="mono muted maxw-38" style={{textAlign:"right"}}>Filtrage multicritère · cliquer un point pour le situer</div>
            </div>
            <MapExplorer />
          </div>
        )}
        {tab==="agence" && <CultureDemo />}
      </section>
    </div>
  );
}
Object.assign(window, { SavoirFaire });
