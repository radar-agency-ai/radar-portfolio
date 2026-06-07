/* ============================================================
   DATA — fictional architecture portfolio (demo content for dl-c)
   + Radar studio team. All placeholder, no real assets.
   ============================================================ */

// Architecture projects — the canvas Radar uses to demo capability.
// span = column span (of 12) for the asymmetric living grid; ar = aspect ratio.
const PROJECTS = [
  { id:"p01", n:"Halle des Forges",      use:"Culturel",   city:"Genève",     country:"CH", year:2024, area:"4 200 m²",  status:"Livré",     size:"L",  span:7, ar:"16/10", x:34, y:42, mass:[[18,52,30,46]],
    tag:"Réhabilitation d’une halle industrielle en lieu culturel.", team:"dl-c · Ville de Genève", role:"Architecte mandataire", structure:"Charpente métallique rivetée conservée" },
  { id:"p02", n:"Maison Vallon",         use:"Logement",   city:"Lausanne",   country:"CH", year:2023, area:"310 m²",   status:"Livré",     size:"S",  span:5, ar:"4/5",   x:46, y:58, mass:[[30,40,40,52]],
    tag:"Villa contemporaine en béton matricé, face au lac.", team:"dl-c", role:"Conception & réalisation", structure:"Voiles béton apparent, chêne massif" },
  { id:"p03", n:"Îlot Sécheron",         use:"Mixte",      city:"Genève",     country:"CH", year:2025, area:"11 800 m²", status:"Chantier",  size:"XL", span:8, ar:"16/9",  x:31, y:38, mass:[[12,40,22,50],[40,46,30,44]],
    tag:"Îlot urbain mixte : logements, bureaux, commerces.", team:"dl-c · CFF Immobilier", role:"Lauréat concours", structure:"Ossature bois-béton, façade terre cuite" },
  { id:"p04", n:"École du Lignon",       use:"Public",     city:"Vernier",    country:"CH", year:2022, area:"2 600 m²",  status:"Livré",     size:"M",  span:4, ar:"3/4",   x:28, y:44, mass:[[24,50,52,40]],
    tag:"Extension d’un groupe scolaire moderniste classé.", team:"dl-c", role:"Architecte", structure:"Béton préfabriqué, brise-soleil bois" },
  { id:"p05", n:"Pavillon Rhône",        use:"Culturel",   city:"Genève",     country:"CH", year:2024, area:"680 m²",   status:"Livré",     size:"S",  span:5, ar:"5/4",   x:36, y:46, mass:[[22,58,56,34]],
    tag:"Pavillon d’exposition démontable au bord de l’eau.", team:"dl-c", role:"Conception", structure:"Structure acier déployable" },
  { id:"p06", n:"Tour Acacias",          use:"Bureaux",    city:"Genève",     country:"CH", year:2026, area:"18 500 m²", status:"Concours",  size:"XL", span:7, ar:"3/4",   x:33, y:50, mass:[[38,18,26,72]],
    tag:"Tour tertiaire bas carbone, surélévation existante.", team:"dl-c", role:"Concours international", structure:"Noyau béton, planchers bois-CLT" },
  { id:"p07", n:"Chai de Dardagny",      use:"Industriel", city:"Dardagny",   country:"CH", year:2021, area:"1 900 m²",  status:"Livré",     size:"M",  span:6, ar:"16/10", x:18, y:40, mass:[[16,56,64,30]],
    tag:"Cave viticole semi-enterrée dans le coteau.", team:"dl-c", role:"Architecte", structure:"Béton banché, toiture végétalisée" },
  { id:"p08", n:"Passage Mont-Blanc",    use:"Mixte",      city:"Annecy",     country:"FR", year:2023, area:"5 400 m²",  status:"Livré",     size:"L",  span:5, ar:"4/5",   x:54, y:30, mass:[[20,44,28,50],[52,48,26,46]],
    tag:"Réaménagement d’un passage commercial couvert.", team:"dl-c · Ville d’Annecy", role:"Maîtrise d’œuvre", structure:"Verrière acier, sols pierre" },
  { id:"p09", n:"Refuge des Diablerets", use:"Tourisme",   city:"Diablerets", country:"CH", year:2022, area:"540 m²",   status:"Livré",     size:"S",  span:4, ar:"1/1",   x:52, y:64, mass:[[28,54,44,38]],
    tag:"Refuge d’altitude en bois, autonome en énergie.", team:"dl-c", role:"Conception & suivi", structure:"Madriers épicéa, fondations micropieux" },
  { id:"p10", n:"Quai Wilson",           use:"Logement",   city:"Genève",     country:"CH", year:2025, area:"8 900 m²",  status:"Chantier",  size:"L",  span:8, ar:"16/9",  x:35, y:35, mass:[[16,42,30,52],[48,40,28,54]],
    tag:"Immeuble de logements en front de lac.", team:"dl-c", role:"Architecte mandataire", structure:"Façade pierre agrafée, balcons béton" },
];

const FILTERS = {
  use:   ["Culturel","Logement","Mixte","Public","Bureaux","Industriel","Tourisme"],
  city:  ["Genève","Lausanne","Vernier","Dardagny","Annecy","Diablerets"],
  status:["Livré","Chantier","Concours"],
  size:  ["S","M","L","XL"],
};

// View modes for the project viewer
const MODES = [
  { id:"img",  label:"Image" },
  { id:"draw", label:"Dessin" },
  { id:"plan", label:"Plans" },
];

// dl-c agency culture (the "marque employeur" demo, ~16 people)
const ROLES = [
  "Architecte associée","Architecte associé","Cheffe de projet","Chef de projet",
  "Architecte","Architecte","Architecte HES","Dessinatrice",
  "Dessinateur","Modeleuse BIM","Modeleur BIM","Architecte d’intérieur",
  "Conduite de travaux","Communication","Office manager","Stagiaire architecte",
];
const FIRSTS = ["Camille","Léa","Noah","Théo","Inès","Maya","Lucas","Jade","Hugo","Anaïs","Yanis","Soraya","Émile","Naomi","Adrien","Sacha"];
const TEAM_DLC = FIRSTS.map((f,i)=>({ name:f, role:ROLES[i], since:2014+(i%11) }));

const CULTURE_STATS = [
  { n:16,  suf:"",   l:"personnes au studio" },
  { n:11,  suf:"",   l:"nationalités confondues" },
  { n:38,  suf:"h",  l:"semaine · 4½ jours" },
  { n:6,   suf:"",   l:"langues parlées" },
];
const CULTURE_VALUES = [
  ["Matière d’abord","On dessine avec ce qui se construit. Maquettes, prototypes 1:1, visites de chantier le vendredi."],
  ["Atelier ouvert","Un plateau, pas de bureaux fermés. La critique se fait debout, autour de la table à dessin."],
  ["Le temps long","On choisit peu de projets pour les mener loin. La pérennité avant la cadence."],
];

// Radar studio — the real 3-person team
const RADAR = [
  { first:"Jonathan", short:"Jo", role:"Stratégie & Growth", n:"01",
    line:"Cadre l’intention, le positionnement et la mesure. Transforme un site en outil d’acquisition.",
    focus:["Positionnement","SEO / GEO","Analytics","Contenu"] },
  { first:"Alex", short:"Alex", role:"Direction artistique", n:"02",
    line:"Donne la forme. Système typographique, grille, mouvement — la signature visuelle du projet.",
    focus:["Art direction","Design system","Motion","Identité"] },
  { first:"Justin", short:"Justin", role:"Développement", n:"03",
    line:"Construit l’expérience. Front sur-mesure, intégrations headless, performance et accessibilité.",
    focus:["React / WebGL","Headless CMS","Perf","Accessibilité"] },
];

const CAPABILITIES = [
  { id:"grid",   k:"Grille symétrique",   d:"Une grille modulaire symétrique qui se réorganise sous les yeux au clic — sans rechargement." },
  { id:"modes",  k:"Triple lecture",     d:"Chaque projet en trois regards : Image, Dessin, Plans. Une UX propre à l’agence." },
  { id:"plan",   k:"Lecture des plans",  d:"Visionneur haute définition avec zoom et déplacement — coupes et détails enfin lisibles." },
  { id:"focus",  k:"Mode Focus",         d:"Un clic efface toute l’interface. Contemplation plein écran des espaces et de la lumière." },
  { id:"map",    k:"Ancrage territorial",d:"Carte interactive et filtrage multicritère : l’empreinte de l’agence d’un coup d’œil." },
  { id:"culture",k:"Marque employeur",   d:"Une page Agence vivante qui montre l’équipe et séduit les jeunes talents." },
];

Object.assign(window, { PROJECTS, FILTERS, MODES, TEAM_DLC, CULTURE_STATS, CULTURE_VALUES, RADAR, CAPABILITIES });
