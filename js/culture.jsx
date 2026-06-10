/* ============================================================
   CULTURE / AGENCE demo — employer brand (~16 people)
   ============================================================ */
function CultureDemo(){
  const team = window.TEAM_AGENCY, stats = window.CULTURE_STATS, values = window.CULTURE_VALUES;
  return (
    <div>
      <div className="cap-head" style={{marginBottom:54}}>
        <div>
          <Reveal><h3 className="h-lg">L’atelier.</h3></Reveal>
          <RevealText className="lede ink2" style={{marginTop:20, maxWidth:"34ch"}}
            text="Seize personnes, un plateau, une table à dessin. La page qui donne envie aux jeunes talents de pousser la porte." />
        </div>
        <Reveal delay={2} className="col gap-s" style={{alignSelf:"end"}}>
          <div className="mono muted">Recrutement permanent</div>
          <a className="btn-dark" style={{alignSelf:"flex-start"}} href="#" onClick={(e)=>e.preventDefault()}>Rejoindre l’atelier <Arrow d="right"/></a>
        </Reveal>
      </div>

      {/* stats */}
      <div className="stats stats--4" style={{marginBottom:64}}>
        {stats.map((s,i)=>(
          <Reveal as="div" className="stat" delay={i+1} key={i}>
            <div className="stat__n"><Counter to={s.n} suffix={s.suf} /></div>
            <div className="stat__l ink2">{s.l}</div>
          </Reveal>
        ))}
      </div>

      {/* team faces */}
      <div className="flex between center" style={{marginBottom:18}}>
        <div className="eyebrow"><span className="idx">16</span> L’équipe</div>
        <div className="mono muted hide-mob">survol — fonction & ancienneté</div>
      </div>
      <div className="team-grid" style={{marginBottom:72}}>
        {team.map((m,i)=>(
          <div className="tcell" key={i}>
            <Portrait seed={m.name+i} className="tcell__ph" />
            <div className="tcell__info">
              <div className="mono-sm" style={{color:"var(--ink)"}}>{m.name}</div>
              <div className="mono-sm muted" style={{marginTop:4}}>{m.role}</div>
              <div className="mono-sm muted" style={{marginTop:8,fontSize:9.5}}>depuis {m.since}</div>
            </div>
          </div>
        ))}
      </div>

      {/* values + life */}
      <div className="lifeband" style={{marginBottom:40}}>
        <div style={{gridColumn:"span 5"}}>
          {values.map((v,i)=>(
            <Reveal key={i} delay={i+1} style={{paddingBlock:"22px",borderTop:"1px solid var(--line)"}}>
              <h4 className="h-md" style={{fontSize:26}}>{v[0]}</h4>
              <p className="ink2" style={{marginTop:10,maxWidth:"36ch",fontSize:17,lineHeight:1.45}}>{v[1]}</p>
            </Reveal>
          ))}
        </div>
        <div style={{gridColumn:"span 7", display:"grid", gridTemplateColumns:"repeat(2,1fr)", gridAutoRows:"1fr", gap:"clamp(10px,1vw,16px)"}}>
          <Parallax amount={26} style={{gridColumn:"span 2",aspectRatio:"16/9",position:"relative",overflow:"hidden",background:"var(--wash)"}}>
            <PhImage seed="studio-a" variant={1} />
            <div style={{position:"absolute",left:14,bottom:12}} className="mono-sm" >Le plateau — rue du Stand, Genève</div>
          </Parallax>
          <div style={{aspectRatio:"4/3",position:"relative",overflow:"hidden",background:"var(--wash)"}}><PhDraw seed="studio-b" /><div style={{position:"absolute",left:12,bottom:10}} className="mono-sm muted">Maquette 1:50</div></div>
          <div style={{aspectRatio:"4/3",position:"relative",overflow:"hidden",background:"var(--wash)"}}><PhImage seed="studio-c" variant={2} /><div style={{position:"absolute",left:12,bottom:10}} className="mono-sm" >Visite de chantier</div></div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { CultureDemo });
