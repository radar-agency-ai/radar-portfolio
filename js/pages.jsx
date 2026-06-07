/* ============================================================
   PAGES — Index (home), Studio (Radar team), Contact, Footer
   ============================================================ */
const { useState:pgUseState } = React;

/* ---------------- INDEX / HOME ---------------- */
function Home({ navigate }){
  const services = ["Direction artistique","Design system","Développement React","Headless CMS","Motion & WebGL","SEO / GEO","Performance","Accessibilité"];
  const stats = [
    { n:3,   suf:"",  l:"associés, trois métiers" },
    { n:11,  suf:"",  l:"ans d’expérience cumulés" },
    { n:100, suf:"%", l:"sur-mesure, zéro template" },
    { n:0,   suf:"",  l:"projet livré au hasard" },
  ];
  return (
    <div className="page page-enter">
      {/* HERO */}
      <section className="hero wrap">
        <div className="hero__bg"><div className="hero__grid" /></div>
        <div className="hero__head">
          <div className="eyebrow" style={{marginBottom:"clamp(24px,4vh,46px)"}}><span className="idx">R—01</span> Studio de création web <span className="ln" style={{maxWidth:120}}/> Paris · FR</div>
          <h1 className="display">Sites sur-mesure.</h1>
          <div className="hero__sub">
            <p className="lede ink2">Radar conçoit et développe — de la direction artistique au code. Trois associés, un projet à la fois.</p>
            <div className="col" style={{alignItems:"flex-end", gap:18}}>
              <div className="flex center gap-s mono-sm muted">
                <Arrow d="down" s={11}/>
                <span>Découvrez le studio</span>
              </div>
              <button className="btn-dark" onClick={()=>navigate("savoir-faire")}>Voir le travail <Arrow d="right"/></button>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee__row">
          <span>{services.join(" ")}</span><span>{services.join(" ")}</span>
        </div>
      </div>

      {/* MANIFESTE */}
      <section className="section wrap">
        <div className="eyebrow" style={{marginBottom:"clamp(30px,5vh,60px)"}}><span className="idx">R—02</span> Manifeste</div>
        <RevealText tag="h2" className="h-xl" stagger={34}
          text="La forme suit le projet. Pas l'inverse." />
        <Reveal delay={2} className="cap-head" style={{marginTop:"clamp(40px,6vh,80px)"}}>
          <p className="lede ink2 maxw-46">Nous travaillons avec des agences qui savent ce qu'elles veulent montrer. Notre rôle : que le site soit à la hauteur du travail qu'il présente.</p>
          <p className="ink2 maxw-46" style={{alignSelf:"end",fontSize:17}}>Un projet actif à la fois. C'est le prix de la précision.</p>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="wrap" style={{paddingBottom:"clamp(40px,6vh,80px)"}}>
        <div className="stats">
          {stats.map((s,i)=>(
            <Reveal as="div" className="stat" delay={i+1} key={i}>
              <div className="stat__n"><Counter to={s.n} suffix={s.suf} /></div>
              <div className="stat__l ink2">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CASE TEASER */}
      <section className="section wrap">
        <div className="eyebrow" style={{marginBottom:"clamp(24px,4vh,40px)"}}><span className="idx">R—03</span> Étude de cas <span className="ln"/> En direct</div>
        <div className="cap-head" style={{marginBottom:"clamp(28px,4vh,52px)"}}>
          <Reveal><h2 className="h-lg">dl-c, architectes.<br/><span className="muted">Un portfolio construit comme un ouvrage.</span></h2></Reveal>
          <Reveal delay={2} className="col gap-m" style={{alignSelf:"end"}}>
            <p className="ink2 maxw-46" style={{fontSize:17}}>Grille vivante, lecture des plans en HD, mode contemplation, carte du territoire. Chaque interaction ci-dessous est réelle — c'est notre travail, pas une maquette.</p>
            <button className="btn-dark" style={{alignSelf:"flex-start"}} onClick={()=>navigate("savoir-faire")}>Voir la démonstration <Arrow d="right"/></button>
          </Reveal>
        </div>
        <Reveal className="pgrid">
          {window.PROJECTS.slice(0,3).map((p,i)=>(
            <div key={p.id} className="pcard" style={{gridColumn:`span ${[5,4,3][i]}`, aspectRatio:[ "4/5","3/4","4/5"][i], cursor:"pointer"}} onClick={()=>navigate("savoir-faire")}>
              <div className="pcard__media"><PhImage seed={p.id} variant={0} /></div>
              <div className="pcard__veil" />
              <div className="pcard__idx mono">{String(i+1).padStart(2,"0")}</div>
              <div className="pcard__info">
                <div className="pcard__top"><div className="pcard__name">{p.n}</div></div>
                <div className="pcard__meta mono-sm"><span>{p.use}</span><span>{p.city}</span></div>
              </div>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}

/* ---------------- STUDIO (Radar team) ---------------- */
function Studio({ navigate }){
  const team = window.RADAR;
  return (
    <div className="page page-enter">
      <section className="section wrap" style={{paddingBottom:"clamp(30px,5vh,60px)"}}>
        <div className="eyebrow" style={{marginBottom:40}}><span className="idx">04</span> Studio <span className="ln"/> Qui sommes-nous</div>
        <Reveal><h1 className="display">Jonathan, Alex, Justin.<br/><span className="italic thin">Stratégie, design, code.</span></h1></Reveal>
        <Reveal delay={2}>
          <RevealText className="lede ink2" style={{maxWidth:"46ch",marginTop:"clamp(28px,4vh,48px)"}}
            text="Du brief au lancement, vous parlez aux mêmes personnes — celles qui font." />
        </Reveal>
      </section>

      <section className="wrap" style={{paddingBottom:"clamp(40px,7vh,100px)"}}>
        <div style={{borderTop:"1px solid var(--line)"}}>
          {team.map((m,i)=>(
            <div className="member" key={i}>
              <Reveal className="member__media">
                <img src={`${m.first.toLowerCase()}.png`} alt={m.first} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} />
                <div style={{position:"absolute",left:16,bottom:14}} className="mono">{m.short}</div>
              </Reveal>
              <Reveal delay={1}>
                <div className="member__role mono" style={{marginBottom:18}}><span style={{color:"var(--ink)"}}>{m.n}</span> — {m.role}</div>
                <h2 className="member__big">{m.first}</h2>
                <p className="lede ink2" style={{marginTop:22,maxWidth:"34ch"}}>{m.line}</p>
                <div className="flex gap-s" style={{marginTop:26,flexWrap:"wrap"}}>
                  {m.focus.map(f=><span key={f} className="chip" style={{cursor:"default"}}>{f}</span>)}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* approach */}
      <section className="section wrap">
        <div className="eyebrow" style={{marginBottom:40}}><span className="idx">04.1</span> Comment on travaille</div>
        <div className="lifeband">
          {[["Stratégie","On cadre l’intention avant la forme. Audience, objectifs, mesure."],["Conception","Direction artistique, système, prototype cliquable validé avec vous."],["Développement","Front sur-mesure, CMS headless, vous restez autonome sur le contenu."],["Pérennité","Performance, accessibilité, suivi. Un ouvrage qui tient dans le temps."]].map((s,i)=>(
            <Reveal key={i} delay={i+1} style={{gridColumn:"span 3",borderTop:"1px solid var(--line)",paddingTop:18}}>
              <div className="mono muted" style={{marginBottom:14}}>{String(i+1).padStart(2,"0")}</div>
              <h3 className="h-md" style={{fontSize:25}}>{s[0]}</h3>
              <p className="ink2" style={{marginTop:10,fontSize:16,lineHeight:1.45}}>{s[1]}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- CONTACT + FOOTER ---------------- */
function Contact(){
  return (
    <section className="contact">
      <div className="wrap section">
        <div className="eyebrow" style={{marginBottom:"clamp(30px,5vh,60px)"}}><span className="idx" style={{color:"#fff"}}>05</span> Contact <span className="ln"/> Parlons-en</div>
        <RevealText tag="h2" className="h-xl" stagger={36}
          text="Un projet en tête ? On écoute d'abord." />
        <div className="cap-head" style={{marginTop:"clamp(40px,6vh,80px)",alignItems:"end"}}>
          <a className="big" href="mailto:bonjour@radar.studio">bonjour@radar.studio <Arrow d="right" s={26}/></a>
          <div className="col gap-m" style={{alignSelf:"end"}}>
            <div><div className="mono">Studio</div><div style={{marginTop:8,opacity:.85}}>Paris</div></div>
            <div className="flex gap-l mono">
              <a href="#" onClick={e=>e.preventDefault()}>Instagram</a>
              <a href="#" onClick={e=>e.preventDefault()}>LinkedIn</a>
              <a href="#" onClick={e=>e.preventDefault()}>Behance</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ navigate, page }){
  const links = [["index","Home"],["savoir-faire","Savoir-faire"],["studio","Studio"],["contact","Contact"]];
  return (
    <footer className="footer">
      <div className="wrap" style={{paddingBlock:"clamp(36px,5vh,64px)"}}>
        <div className="flex between" style={{flexWrap:"wrap",gap:24,alignItems:"flex-end"}}>
          <div>
            <div style={{fontFamily:"var(--serif)",fontSize:40,fontWeight:300,color:"#fff"}}>Radar<span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#fff",marginLeft:6,verticalAlign:"middle"}}/></div>
            <div className="mono-sm" style={{marginTop:14,opacity:.6}}>Studio de création web · Paris</div>
          </div>
          <div className="flex gap-l mono" style={{flexWrap:"wrap"}}>
            {links.map(([id,l])=>(<button key={id} onClick={()=>navigate(id)} style={{color: page===id?"#fff":"inherit"}}>{l}</button>))}
          </div>
        </div>
        <div className="rule" style={{margin:"32px 0 18px"}}/>
        <div className="flex between mono-sm" style={{opacity:.55,flexWrap:"wrap",gap:10}}>
          <span>© {new Date().getFullYear()} Radar Studio — maquette de démonstration</span>
          <span>Conçu & développé sur-mesure</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Home, Studio, Contact, Footer });
