import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── AUTH HELPER ──────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  return { user, userId: user?.id ?? null, loading };
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ORANGE   = "#FF6B2B";  // primary accent — ember orange
const TEXT     = "#1A1A2E";  // main text — deep navy
const BG       = "#E3ECFF";  // background — pale blue
const BLUE     = "#3B82F6";  // secondary accent — ocean blue
const TEXT_FAINT = "rgba(26,26,46,0.08)";
const TEXT_MED   = "rgba(26,26,46,0.18)";

// ─── PICKLISTS ────────────────────────────────────────────────────────────────
// No separate DB tables needed — these are fixed, small, and app-managed.
const GENRES = [
  "Fiction","Literary Fiction","Mystery","Sci-Fi","Fantasy",
  "Non-Fiction","History","Biography","Essays","Poetry",
  "Romance","Thriller","Self-Help","Science","Other",
];
const AGE_RANGES = [
  "Under 18","18–24","25–34","35–44","45–54","55–64","65+","Prefer not to say",
];
const GENDERS = [
  "Man","Woman","Non-binary","Prefer to self-describe","Prefer not to say",
];
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
  "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
  "District of Columbia","Outside the US",
];
const PALETTE  = ["#2C3E6B","#4A6B8A","#7A1520","#1E3A5F","#5C3D6B","#2A4A5A","#6B2030","#1A3048","#4A3560","#2E5068"];
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const QUOTES   = [
  '"A reader lives a thousand lives before he dies." — George R.R. Martin',
  '"Not all those who wander are lost." — J.R.R. Tolkien',
  '"So many books, so little time." — Frank Zappa',
  '"One must always be careful of books." — Cassandra Clare',
  '"I am not afraid of storms, for I am learning how to sail my ship." — Louisa May Alcott',
];

const INTRO_STEPS = [
  { label:"I · princeps",   title:"the first edition",  sub:"a reading record worthy of what you read.",     body:"Princeps is a personal library for serious readers. Log every book, annotate your editions, and build a collection that reflects exactly who you are.", cta:"Enter →" },
  { label:"II · catalogue", title:"your catalogue",      sub:"every volume deserves a proper entry.",         body:"Record ratings, private annotations, favourite passages, and the editions you own. Scan a cover to fill in details instantly.", cta:"Continue →" },
  { label:"III · the stacks",title:"the stacks",         sub:"rooms for readers who go deep.",                body:"Join discussions by genre, author, and theme. Find your next book from people whose taste you trust.", cta:"Almost there →" },
];

// ─── FONTS & STYLES ──────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400;1,600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{width:100%;min-height:100vh;font-size:16px}
    body{background:${BG};color:${TEXT};font-family:'Lora',Georgia,serif;font-weight:500;-webkit-font-smoothing:antialiased}
    .t-display{font-family:'Playfair Display',Georgia,serif;font-style:italic}
    .t-heading{font-family:'Libre Baskerville',Georgia,serif;font-weight:700}
    .t-label{font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:10px;color:${TEXT};opacity:.45;display:inline-block}
    .t-label-lg{font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:${TEXT};opacity:.55}
    .container{max-width:1200px;width:100%;margin:0 auto;padding:0 40px}
    .rule{border:none;border-top:1px solid rgba(26,26,46,.1);margin:0}
    .rule-thick{border:none;border-top:1px solid rgba(26,26,46,.4);margin:0}
    input,textarea,select{background:rgba(26,26,46,.05);border:1px solid rgba(26,26,46,.15);color:${TEXT};font-family:'Lora',Georgia,serif;font-size:14px;padding:10px 12px;border-radius:0;outline:none;width:100%;appearance:none;-webkit-appearance:none}
    input:focus,textarea:focus,select:focus{border-color:${ORANGE};box-shadow:1px 1px 0 ${ORANGE}}
    input::placeholder,textarea::placeholder{color:rgba(26,26,46,.3);font-style:italic}
    select option{background:#dce6ff;color:${TEXT}}
    .btn-primary{background:${ORANGE};color:${BG};border:1px solid ${ORANGE};font-family:'Nunito',sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:11px;padding:12px 28px;cursor:pointer;border-radius:0;transition:background .15s,border-color .15s;display:inline-block}
    .btn-primary:hover{background:#6B0F1A;border-color:#6B0F1A}
    .btn-ghost{background:transparent;color:${TEXT};border:1px solid rgba(26,26,46,.25);font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:10px;padding:8px 16px;cursor:pointer;border-radius:0;transition:background .15s,border-color .15s}
    .btn-ghost:hover{background:rgba(26,26,46,.04);border-color:rgba(26,26,46,.4)}
    .nav{border-bottom:1px solid rgba(26,26,46,.08);background:${BG};position:sticky;top:0;z-index:100;width:100%}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;padding:16px 40px;max-width:1200px;margin:0 auto}
    .nav-links{display:flex;gap:24px;align-items:center;flex-wrap:wrap}
    .nav-link{font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:10px;color:rgba(26,26,46,.4);cursor:pointer;padding-bottom:2px;border-bottom:1px solid transparent;transition:color .15s,border-color .15s;text-decoration:none}
    .nav-link:hover{color:rgba(26,26,46,.75)}
    .nav-link.active{color:${TEXT};border-bottom:1px solid ${BLUE}}
    .book-row{display:flex;align-items:flex-start;gap:16px;padding:18px 0;border-bottom:1px solid rgba(26,26,46,.07);cursor:pointer;transition:background .1s}
    .book-row:hover{background:rgba(26,26,46,.03);margin:0 -8px;padding-left:8px;padding-right:8px}
    .stamp{display:inline-flex;align-items:center;justify-content:center;width:90px;height:90px;border:1px solid rgba(59,130,246,.5);border-radius:50%;flex-shrink:0}
    .section-label{color:${ORANGE};font-family:'Nunito',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:10px;color:${ORANGE};opacity:.9;display:block}
    .pullquote{border-left:2px solid ${ORANGE};padding:14px 22px;font-family:'Playfair Display',serif;font-style:italic;font-size:17px;line-height:1.7;background:rgba(122,21,32,.08)}
    .private-area{background:rgba(26,26,46,.04);border:1px solid rgba(26,26,46,.1);padding:16px}
    .modal-overlay{position:fixed;inset:0;background:rgba(227,236,255,.96);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center}
    .modal{background:#dce6ff;border:1px solid rgba(59,130,246,.2);max-width:480px;width:90%;max-height:90vh;overflow-y:auto;position:relative;color:${TEXT}}
    .modal .section-label{color:${ORANGE};opacity:.9}
    .modal .btn-primary{background:${ORANGE};color:${BG};border-color:${ORANGE}}
    .modal .btn-primary:hover{background:#6B0F1A;border-color:#6B0F1A}
    .modal .btn-ghost{color:${TEXT};border-color:rgba(26,26,46,.18)}
    .modal .btn-ghost:hover{background:rgba(26,26,46,.04)}
    .modal input,.modal textarea,.modal select{background:rgba(26,26,46,.06);color:${TEXT};border-color:rgba(26,26,46,.15)}
    .modal input::placeholder,.modal textarea::placeholder{color:rgba(26,26,46,.3)}
    .modal input:focus,.modal textarea:focus,.modal select:focus{box-shadow:1px 1px 0 ${ORANGE};border-color:${ORANGE}}
    .modal .private-area{background:rgba(26,26,46,.04);border-color:rgba(26,26,46,.1)}
    .modal .pullquote{border-left-color:${ORANGE};background:rgba(122,21,32,.1);color:${TEXT}}
    .modal .rule{border-top-color:rgba(26,26,46,.1)}
    .modal-header{padding:24px 28px 16px;border-bottom:1px solid rgba(26,26,46,.08)}
    .modal-body{padding:24px 28px}
    .ring-track{fill:none;stroke:rgba(26,26,46,.08)}
    .ring-progress{fill:none;stroke:${ORANGE};stroke-linecap:butt;transition:stroke-dashoffset .6s ease}
    .post-card{border:1px solid rgba(26,26,46,.07);border-left:2px solid ${ORANGE};padding:20px;margin-bottom:16px;background:rgba(26,26,46,.02)}
    .monogram{width:40px;height:40px;background:transparent;border:1px solid ${ORANGE};color:${ORANGE};display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-style:italic;font-size:18px;font-weight:700;flex-shrink:0}
    .spine{width:28px;cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;transition:transform .2s;box-shadow:inset -3px 0 8px rgba(0,0,0,.4),inset 1px 0 3px rgba(122,21,32,.12)}
    .spine:hover{transform:translateY(-8px)}
    .spine-text{writing-mode:vertical-rl;transform:rotate(180deg);font-family:'Nunito',sans-serif;font-size:8px;letter-spacing:.15em;color:rgba(255,255,255,.85);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;max-height:90px;text-transform:uppercase}
    .reading-badge{display:inline-flex;align-items:center;gap:6px;background:transparent;border:1px solid ${BLUE};color:${BLUE};padding:3px 10px;font-family:'Nunito',sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:.25em}
    .fav-card{background:rgba(122,21,32,.08);border:1px solid rgba(59,130,246,.2);border-left:3px solid ${ORANGE};padding:20px}
    .recap-card{background:rgba(26,26,46,.03);border:1px solid rgba(26,26,46,.08);padding:28px;margin-bottom:20px}
    .recap-big{font-family:'Playfair Display',serif;font-style:italic;font-size:72px;line-height:1;color:${TEXT}}
    .onboard-overlay{position:fixed;inset:0;background:${BG};z-index:300;display:flex;align-items:center;justify-content:center}
    .onboard-dot{width:6px;height:6px;border-radius:50%;background:rgba(26,26,46,.18);transition:background .2s;cursor:pointer}
    .onboard-dot.active{background:${ORANGE}}
    .profile-field{margin-bottom:20px}
    .profile-field label{display:block;margin-bottom:6px}
    .confetti-piece{position:fixed;top:-10px;animation:confettiFall linear forwards;pointer-events:none;z-index:999}
    @keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}
    .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none}
    .hamburger span{display:block;width:22px;height:2px;background:${TEXT};transition:all .2s}
    .mobile-menu{display:none;position:fixed;inset:0;background:${BG};z-index:200;padding:24px;flex-direction:column}
    .mobile-menu.open{display:flex}
    @media(max-width:768px){
      .nav-links{display:none}
      .hamburger{display:flex}
      .stat-num{font-size:48px!important}
      .recap-big{font-size:52px!important}
    }
    @media(max-width:640px){.stat-num{font-size:48px!important}.recap-big{font-size:52px!important}}
  `}</style>
);

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Stars = ({ value, max=10, size=14 }) => (
  <span style={{display:"inline-flex",gap:2}}>
    {Array.from({length:max}).map((_,i)=>(
      <span key={i} style={{fontSize:size,color:i<Math.round(value)?ORANGE:"rgba(26,26,46,.14)"}}>★</span>
    ))}
  </span>
);
const StarPicker = ({ value, onChange, max=10 }) => {
  const [hover,setHover]=useState(null);
  return (
    <span style={{display:"inline-flex",gap:3}}>
      {Array.from({length:max}).map((_,i)=>(
        <span key={i} onMouseEnter={()=>setHover(i+1)} onMouseLeave={()=>setHover(null)} onClick={()=>onChange(i+1)}
          style={{fontSize:20,cursor:"pointer",color:i<(hover??value)?ORANGE:"rgba(26,26,46,.18)"}}>★</span>
      ))}
    </span>
  );
};
const Rule  = ({thick,style})=><hr className={thick?"rule-thick":"rule"} style={style}/>;
const SL    = ({children,style})=><span className="section-label" style={style}>{children}</span>;
const fmt   = (d)=>d?new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
const Sel   = ({label,value,onChange,options,placeholder})=>(
  <div className="profile-field">
    <SL style={{marginBottom:6}}>{label}</SL>
    <select value={value} onChange={e=>onChange(e.target.value)}>
      {placeholder&&<option value="">{placeholder}</option>}
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const RingProgress = ({value,max,size=100,label,sublabel})=>{
  const r=(size-12)/2,circ=2*Math.PI*r,offset=circ*(1-Math.min(value/max,1));
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} className="ring-track" strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} className="ring-progress" strokeWidth={6} strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`}/>
        <text x={size/2} y={size/2-4} textAnchor="middle" fill={TEXT} fontFamily="'Playfair Display',serif" fontStyle="italic" fontSize={size*.2} fontWeight="700">{value}</text>
        <text x={size/2} y={size/2+14} textAnchor="middle" fill={TEXT} fontFamily="'Nunito',sans-serif" fontSize={8} letterSpacing=".12em" opacity=".6">OF {max}</text>
      </svg>
      {label&&<span className="t-label-lg" style={{fontSize:11}}>{label}</span>}
      {sublabel&&<span style={{fontFamily:"Lora",fontSize:12,fontStyle:"italic",opacity:.7}}>{sublabel}</span>}
    </div>
  );
};

const Stamp = ()=>(
  <div className="stamp" style={{fontSize:0}}>
    <svg viewBox="0 0 90 90" width="90" height="90">
      <defs><path id="cp" d="M 45,45 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"/></defs>
      <text fontFamily="'Nunito',sans-serif" fontSize="8.5" fill={TEXT} letterSpacing="1.8" textAnchor="middle" opacity=".5">
        <textPath href="#cp" startOffset="50%">EST. MMXXIV · PRINCEPS · EDITIO PRINCEPS ·</textPath>
      </text>
      <text x="45" y="38" textAnchor="middle" fontFamily="'Playfair Display',serif" fontStyle="italic" fontSize="13" fill={TEXT} fontWeight="700">prin</text>
      <text x="45" y="54" textAnchor="middle" fontFamily="'Playfair Display',serif" fontStyle="italic" fontSize="13" fill={TEXT} fontWeight="700">ceps</text>
    </svg>
  </div>
);

const Logo = ({size="md"})=>{
  const s={sm:[20,7],md:[28,8]}[size]||[28,8];
  return (
    <div style={{lineHeight:1,cursor:"pointer"}}>
      <span className="t-display" style={{fontSize:s[0],color:TEXT,display:"block"}}>princeps</span>
      <span className="t-label" style={{fontSize:s[1],marginTop:2,display:"block",opacity:.5}}>editio princeps</span>
    </div>
  );
};

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({active,onDone}){
  const [pieces,setPieces]=useState([]);
  useEffect(()=>{
    if(!active)return;
    const colors=[TEXT,ORANGE,BLUE,"#FFECBD","#6B8CAE","#7A1520","#4A6B8A"];
    setPieces(Array.from({length:80},(_,i)=>({
      id:i,left:Math.random()*100,width:6+Math.random()*8,height:10+Math.random()*12,
      color:colors[Math.floor(Math.random()*colors.length)],
      duration:2+Math.random()*2,delay:Math.random()*.8,
    })));
    const t=setTimeout(()=>{setPieces([]);onDone?.();},4000);
    return()=>clearTimeout(t);
  },[active]);
  return <>{pieces.map(p=>(
    <div key={p.id} className="confetti-piece" style={{left:`${p.left}%`,width:p.width,height:p.height,background:p.color,animationDuration:`${p.duration}s`,animationDelay:`${p.delay}s`}}/>
  ))}</>;
}

// ─── ONBOARDING (4 steps: 3 intro + 1 profile setup) ─────────────────────────
function Onboarding({onComplete,userId}){
  const [step,setStep]=useState(0);
  const [profile,setProfile]=useState({first_name:"",last_name:"",state:"",age_range:"",gender:"",favorite_genre:""});
  const [saving,setSaving]=useState(false);
  const set=(k,v)=>setProfile(p=>({...p,[k]:v}));

  const saveProfile=async()=>{
    setSaving(true);
    await supabase.from("users").upsert({
      id:userId,
      first_name:profile.first_name,
      last_name:profile.last_name,
      state:profile.state,
      age_range:profile.age_range,
      gender:profile.gender,
      favorite_genre:profile.favorite_genre,
    },{onConflict:"id"});
    setSaving(false);
    onComplete();
  };

  const totalSteps=INTRO_STEPS.length+1; // 3 intro + 1 profile

  if(step<INTRO_STEPS.length){
    const cur=INTRO_STEPS[step];
    return(
      <div className="onboard-overlay">
        <div style={{maxWidth:520,width:"90%",textAlign:"center",padding:"0 24px"}}>
          <Stamp/>
          <div style={{marginTop:40,marginBottom:48}}>
            <SL style={{display:"block",textAlign:"center",marginBottom:20,opacity:1,fontWeight:800}}>{cur.label}</SL>
            <h1 className="t-display" style={{fontSize:"clamp(36px,7vw,56px)",lineHeight:1.05,color:TEXT,marginBottom:12}}>{cur.title}</h1>
            <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:16,color:TEXT,opacity:.7,marginBottom:24}}>{cur.sub}</p>
            <p style={{fontFamily:"Lora",fontSize:15,lineHeight:1.8,color:TEXT,opacity:.6,maxWidth:380,margin:"0 auto"}}>{cur.body}</p>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:40}}>
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} className={`onboard-dot${i===step?" active":""}`} onClick={()=>i<step&&setStep(i)}/>
            ))}
          </div>
          <button className="btn-primary" style={{fontSize:13,padding:"14px 40px"}} onClick={()=>setStep(s=>s+1)}>{cur.cta}</button>
          {step>0&&<button className="btn-ghost" style={{marginLeft:12}} onClick={()=>setStep(s=>s-1)}>← back</button>}
          <div style={{marginTop:24}}>
            <button onClick={onComplete} style={{background:"none",border:"none",color:TEXT,opacity:.25,fontFamily:"Nunito",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>skip intro</button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4 — Profile setup
  return(
    <div className="onboard-overlay" style={{overflowY:"auto",alignItems:"flex-start",paddingTop:40,paddingBottom:40}}>
      <div style={{maxWidth:520,width:"90%",margin:"0 auto",padding:"0 24px"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <Stamp/>
          <div style={{marginTop:32}}>
            <SL style={{display:"block",textAlign:"center",marginBottom:16,opacity:.4}}>IV · your profile</SL>
            <h1 className="t-display" style={{fontSize:"clamp(32px,6vw,48px)",lineHeight:1.05,color:TEXT,marginBottom:12}}>tell us about yourself</h1>
            <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:15,color:TEXT,opacity:.6}}>We use this to personalise your experience. You can change it anytime.</p>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:40}}>
          {Array.from({length:totalSteps}).map((_,i)=>(
            <div key={i} className={`onboard-dot${i===step?" active":""}`} onClick={()=>i<step&&setStep(i)}/>
          ))}
        </div>

        <Rule style={{marginBottom:32}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:4}}>
          <div className="profile-field">
            <SL style={{marginBottom:6}}>First Name</SL>
            <input value={profile.first_name} onChange={e=>set("first_name",e.target.value)} placeholder="Jane"/>
          </div>
          <div className="profile-field">
            <SL style={{marginBottom:6}}>Last Name</SL>
            <input value={profile.last_name} onChange={e=>set("last_name",e.target.value)} placeholder="Eyre"/>
          </div>
        </div>

        <Sel label="State" value={profile.state} onChange={v=>set("state",v)} options={US_STATES} placeholder="Select your state…"/>
        <Sel label="Age Range" value={profile.age_range} onChange={v=>set("age_range",v)} options={AGE_RANGES} placeholder="Select…"/>
        <Sel label="Gender" value={profile.gender} onChange={v=>set("gender",v)} options={GENDERS} placeholder="Select…"/>
        <Sel label="Favourite Genre" value={profile.favorite_genre} onChange={v=>set("favorite_genre",v)} options={GENRES} placeholder="Select…"/>

        <div style={{marginTop:32,display:"flex",gap:12,alignItems:"center"}}>
          <button className="btn-primary" style={{fontSize:13,padding:"14px 40px"}} onClick={saveProfile} disabled={saving}>
            {saving?"Saving…":"Enter Princeps →"}
          </button>
          <button className="btn-ghost" onClick={()=>setStep(s=>s-1)}>← back</button>
        </div>
        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={onComplete} style={{background:"none",border:"none",color:TEXT,opacity:.25,fontFamily:"Nunito",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer"}}>skip for now</button>
        </div>
      </div>
    </div>
  );
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function callClaude(messages){
  const res=await fetch("/.netlify/functions/claude",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages}),
  });
  const d=await res.json();
  return d.content?.map(b=>b.text||"").join("")||"";
}

// ─── CAMERA MODAL ─────────────────────────────────────────────────────────────
function CameraModal({onClose,onResult,mode}){
  const videoRef=useRef(null),canvasRef=useRef(null);
  const [streaming,setStreaming]=useState(false),[captured,setCaptured]=useState(null);
  const [loading,setLoading]=useState(false),[result,setResult]=useState(null),[error,setError]=useState("");
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})
      .then(s=>{videoRef.current.srcObject=s;videoRef.current.play();setStreaming(true);})
      .catch(()=>setError("Camera access denied."));
    return()=>{if(videoRef.current?.srcObject)videoRef.current.srcObject.getTracks().forEach(t=>t.stop());};
  },[]);
  const capture=()=>{
    const c=canvasRef.current,v=videoRef.current;
    c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);
    setCaptured(c.toDataURL("image/jpeg",.85).split(",")[1]);
    v.srcObject?.getTracks().forEach(t=>t.stop());
  };
  const analyze=async()=>{
    setLoading(true);
    try{
      const prompt=mode==="cover"?"Analyze this book cover. Return ONLY JSON: {title,author,genre}.":"Extract the most beautiful quote (1-3 sentences). Return ONLY the quote.";
      const text=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:captured}},{type:"text",text:prompt}]}]);
      if(mode==="cover"){try{setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));}catch{setResult({raw:text});}}
      else setResult({quote:text.trim()});
    }catch{setError("Analysis failed.");}
    setLoading(false);
  };
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <SL>{mode==="cover"?"📷 Scan Book Cover":"📖 Scan a Page"}</SL>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:TEXT,opacity:.6}}>×</button>
          </div>
        </div>
        <div className="modal-body">
          {error&&<p style={{color:TEXT,fontFamily:"Lora",fontSize:13,marginBottom:16,opacity:.7}}>{error}</p>}
          {!captured?(
            <>
              <div style={{position:"relative",border:`1px solid rgba(26,26,46,.15)`,marginBottom:16,background:"#cdd9ff"}}>
                <video ref={videoRef} style={{width:"100%",display:"block"}}/>
                {[[0,0],[0,1],[1,0],[1,1]].map((sides,i)=>(
                  <div key={i} style={{position:"absolute",top:sides[0]===0?"0":"auto",bottom:sides[0]===1?"0":"auto",left:sides[1]===0?"0":"auto",right:sides[1]===1?"0":"auto",width:20,height:20,borderTop:sides[0]===0?`2px solid ${TEXT}`:"none",borderBottom:sides[0]===1?`2px solid ${TEXT}`:"none",borderLeft:sides[1]===0?`2px solid ${TEXT}`:"none",borderRight:sides[1]===1?`2px solid ${TEXT}`:"none"}}/>
                ))}
              </div>
              <canvas ref={canvasRef} style={{display:"none"}}/>
              <button className="btn-primary" style={{width:"100%"}} onClick={capture} disabled={!streaming}>Capture</button>
            </>
          ):result?(
            <div>
              {mode==="cover"&&result.title&&(
                <div style={{marginBottom:16}}>
                  <SL style={{marginBottom:8}}>Detected</SL>
                  <Rule style={{margin:"8px 0 12px"}}/>
                  <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:18,marginBottom:4}}>{result.title}</p>
                  <p style={{fontFamily:"Nunito",textTransform:"uppercase",letterSpacing:".15em",fontSize:11,opacity:.6}}>{result.author}</p>
                </div>
              )}
              {mode==="page"&&result.quote&&<div className="pullquote" style={{marginBottom:16}}>"{result.quote}"</div>}
              <div style={{display:"flex",gap:12}}>
                <button className="btn-primary" onClick={()=>{onResult(result);onClose();}}>Use This</button>
                <button className="btn-ghost" onClick={()=>{setCaptured(null);setResult(null);}}>Retake</button>
              </div>
            </div>
          ):(
            <>
              <img src={`data:image/jpeg;base64,${captured}`} style={{width:"100%",marginBottom:16}} alt="cap"/>
              {loading?<p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:14,textAlign:"center",opacity:.6}}>Analysing…</p>:(
                <div style={{display:"flex",gap:12}}>
                  <button className="btn-primary" onClick={analyze}>Analyse</button>
                  <button className="btn-ghost" onClick={()=>setCaptured(null)}>Retake</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GOODREADS IMPORT ─────────────────────────────────────────────────────────
function GoodreadsImport({onImport,onClose}){
  const [parsed,setParsed]=useState(null),[error,setError]=useState("");
  const fileRef=useRef(null);
  const handleFile=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      try{
        const lines=ev.target.result.split("\n").filter(l=>l.trim());
        const headers=lines[0].split(",").map(h=>h.replace(/"/g,"").trim());
        const rows=lines.slice(1).map(line=>{
          const fields=[];let cur="",inQ=false;
          for(const ch of line){if(ch==='"'){inQ=!inQ;}else if(ch===","&&!inQ){fields.push(cur.trim());cur="";}else cur+=ch;}
          fields.push(cur.trim());
          const obj={};headers.forEach((h,i)=>{obj[h]=(fields[i]||"").replace(/^"|"$/g,"");});
          return obj;
        });
        const books=rows.filter(r=>r["Title"]&&r["Exclusive Shelf"]==="read").map((r,idx)=>({
          id:`gr-${Date.now()}-${idx}`,title:r["Title"]||"",author:r["Author"]||"",genre:"Fiction",
          pages:parseInt(r["Number of Pages"])||null,start_date:r["Date Read"]||null,end_date:r["Date Read"]||null,
          rating:Math.round((parseFloat(r["My Rating"])||0)*2)||null,genre_rating:Math.round((parseFloat(r["My Rating"])||0)*2)||null,
          review:r["My Review"]||"",private_notes:"",quotes:"",recommended_by:"",
          spine_color:PALETTE[idx%PALETTE.length],status:"finished",
        }));
        setParsed(books);setError("");
      }catch{setError("Couldn't parse that file. Make sure it's a Goodreads export CSV.");}
    };
    reader.readAsText(file);
  };
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <SL>Import from Goodreads</SL>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:TEXT,opacity:.6}}>×</button>
          </div>
          <h2 className="t-display" style={{fontSize:24,marginTop:8}}>bring your library home</h2>
        </div>
        <div className="modal-body">
          {!parsed?(
            <>
              <p style={{fontFamily:"Lora",fontSize:14,lineHeight:1.8,opacity:.7,marginBottom:20}}>Export your Goodreads library: My Books → Import/Export → Export Library. Then upload the CSV here.</p>
              {error&&<p style={{color:ORANGE,fontFamily:"Nunito",fontSize:11,textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>{error}</p>}
              <div style={{border:`1px solid rgba(26,26,46,.15)`,padding:32,textAlign:"center",marginBottom:16,cursor:"pointer",background:"rgba(26,26,46,.03)"}} onClick={()=>fileRef.current.click()}>
                <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:16,marginBottom:8,opacity:.7}}>drop your CSV here</p>
                <p className="t-label" style={{opacity:.4}}>or click to browse</p>
              </div>
              <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={handleFile}/>
            </>
          ):(
            <>
              <p style={{fontFamily:"Lora",fontSize:14,opacity:.7,marginBottom:16}}>Found <strong>{parsed.length}</strong> books on your read shelf.</p>
              <div style={{border:`1px solid rgba(26,26,46,.1)`,marginBottom:20,maxHeight:280,overflowY:"auto"}}>
                {parsed.slice(0,10).map(b=>(
                  <div key={b.id} style={{padding:"10px 14px",borderBottom:`1px solid rgba(26,26,46,.07)`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontFamily:"Libre Baskerville",fontSize:13,fontWeight:700}}>{b.title}</span>
                    <span style={{fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",opacity:.5}}>{b.rating}/10</span>
                  </div>
                ))}
                {parsed.length>10&&<div style={{padding:"10px 14px",fontFamily:"Lora",fontStyle:"italic",fontSize:13,opacity:.5}}>+ {parsed.length-10} more…</div>}
              </div>
              <div style={{display:"flex",gap:12}}>
                <button className="btn-primary" onClick={()=>{onImport(parsed);onClose();}}>Import All</button>
                <button className="btn-ghost" onClick={()=>setParsed(null)}>Choose Different File</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LOG BOOK FORM ────────────────────────────────────────────────────────────
const F=({label,children})=><div style={{marginBottom:20}}><SL style={{marginBottom:6}}>{label}</SL>{children}</div>;

function LogBookModal({onClose,onSave,initial}){
  const blank={title:"",author:"",genre:GENRES[0],pages:"",isbn:"",start_date:"",end_date:"",recommended_by:"",spine_color:PALETTE[0],rating:0,genre_rating:0,review:"",private_notes:"",quotes:"",book_club_questions:"",id:null,status:"finished"};
  const [form,setForm]=useState(initial||blank);
  const [camera,setCamera]=useState(null);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleCam=(res)=>{
    if(camera==="cover"&&res.title)setForm(f=>({...f,title:res.title||f.title,author:res.author||f.author,genre:res.genre||f.genre}));
    else if(camera==="page"&&res.quote)setForm(f=>({...f,quotes:f.quotes?f.quotes+"\n\n"+res.quote:res.quote}));
  };
  const save=()=>{if(!form.title.trim())return;onSave({...form,id:form.id||Date.now().toString()});onClose();};
  return(
    <>
      {camera&&<CameraModal mode={camera} onClose={()=>setCamera(null)} onResult={handleCam}/>}
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
          <div className="modal-header">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <SL style={{marginBottom:4}}>{form.id?"Edit Entry":"Log a Book"}</SL>
                <h2 className="t-display" style={{fontSize:28,lineHeight:1.1}}>add to your shelf</h2>
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:TEXT,opacity:.6}}>×</button>
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="btn-ghost" style={{fontSize:10}} onClick={()=>setCamera("cover")}>📷 Scan Cover</button>
              <button className="btn-ghost" style={{fontSize:10}} onClick={()=>setCamera("page")}>📖 Scan a Page</button>
            </div>
          </div>
          <div className="modal-body">
            <div style={{marginBottom:20}}>
              <SL style={{marginBottom:8}}>Status</SL>
              <div style={{display:"flex",border:`1px solid rgba(26,26,46,.15)`}}>
                {[["finished","Finished"],["reading","Currently Reading"],["wishlist","Want to Read"]].map(([val,lbl])=>(
                  <button key={val} onClick={()=>set("status",val)} style={{flex:1,padding:"8px 4px",background:form.status===val?ORANGE:"transparent",color:form.status===val?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".1em"}}>{lbl}</button>
                ))}
              </div>
            </div>
            <F label="Title *"><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="The title of your book…" autoComplete="off"/></F>
            <F label="Author"><input value={form.author} onChange={e=>set("author",e.target.value)} placeholder="Author's full name" autoComplete="off"/></F>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div><SL style={{marginBottom:6}}>Genre</SL><select value={form.genre} onChange={e=>set("genre",e.target.value)}>{GENRES.map(g=><option key={g}>{g}</option>)}</select></div>
              <div><SL style={{marginBottom:6}}>Pages</SL><input type="number" value={form.pages} onChange={e=>set("pages",e.target.value)} placeholder="320"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div><SL style={{marginBottom:6}}>ISBN <span style={{opacity:.4,fontFamily:"Lora",fontStyle:"italic",textTransform:"none",letterSpacing:0,fontSize:10}}>(for bookshop.org)</span></SL><input value={form.isbn||""} onChange={e=>set("isbn",e.target.value)} placeholder="9780374533557"/></div>
              <div><SL style={{marginBottom:6}}>Recommended By</SL><input value={form.recommended_by} onChange={e=>set("recommended_by",e.target.value)} placeholder="A friend, a newsletter…"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div><SL style={{marginBottom:6}}>Date Started</SL><input type="date" value={form.start_date} onChange={e=>set("start_date",e.target.value)}/></div>
              <div><SL style={{marginBottom:6}}>Date Finished</SL><input type="date" value={form.end_date} onChange={e=>set("end_date",e.target.value)}/></div>
            </div>
            <div style={{marginBottom:20}}>
              <SL style={{marginBottom:8}}>Spine Colour</SL>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
                <input type="color" value={form.spine_color||"#2C3E6B"} onChange={e=>set("spine_color",e.target.value)}
                  style={{width:52,height:52,padding:2,cursor:"pointer",border:`1px solid rgba(26,26,46,.2)`,background:"none",borderRadius:0,flexShrink:0}}/>
                <div style={{width:80,height:52,background:form.spine_color||"#2C3E6B",boxShadow:"inset -4px 0 8px rgba(0,0,0,.3)",display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:5,flexShrink:0}}>
                  <span style={{fontFamily:"Nunito",fontSize:7,letterSpacing:".1em",color:"rgba(255,255,255,.7)",textTransform:"uppercase"}}>spine</span>
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {PALETTE.map(c=>(
                    <div key={c} onClick={()=>set("spine_color",c)} title={c}
                      style={{width:22,height:22,background:c,cursor:"pointer",border:form.spine_color===c?`2px solid ${TEXT}`:"2px solid transparent"}}/>
                  ))}
                </div>
              </div>
              <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:11,opacity:.4}}>Click the colour box to choose any colour, or pick from the palette.</p>
            </div>
            {form.status==="finished"&&(
              <>
                <Rule style={{marginBottom:20}}/>
                <div style={{marginBottom:20}}><SL style={{marginBottom:8}}>Overall Rating</SL><StarPicker value={form.rating} onChange={v=>set("rating",v)}/></div>
                <div style={{marginBottom:20}}><SL style={{marginBottom:8}}>Genre Rating</SL><StarPicker value={form.genre_rating} onChange={v=>set("genre_rating",v)}/></div>
                <F label="Public Review"><textarea value={form.review} onChange={e=>set("review",e.target.value)} rows={4} placeholder="What did you think? Share with the Stacks…"/></F>
              </>
            )}
            <div className="private-area" style={{marginBottom:20}}>
              <SL style={{marginBottom:8}}>🔒 Private Notes</SL>
              <textarea value={form.private_notes} onChange={e=>set("private_notes",e.target.value)} rows={3} placeholder="Just for you. Your unfiltered thoughts…" style={{background:"rgba(26,26,46,.05)",border:"1px dashed rgba(26,26,46,.1)"}}/>
            </div>
            <F label="Favourite Quotes"><textarea value={form.quotes} onChange={e=>set("quotes",e.target.value)} rows={3} placeholder="Passages that stayed with you…"/></F>
            <BookClubQuestions title={form.title} genre={form.genre} questions={form.book_club_questions||""} onChange={v=>set("book_club_questions",v)}/>
            <div style={{display:"flex",gap:12,marginTop:8}}>
              <button className="btn-primary" onClick={save}>Save to Shelf</button>
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// ─── RECOMMEND A BOOK ─────────────────────────────────────────────────────────
function RecommendModal({book,onClose}){
  const [name,setName]=useState("");
  const [note,setNote]=useState("");
  const [copied,setCopied]=useState(false);
  const link=`${window.location.origin}?rec=${encodeURIComponent(JSON.stringify({title:book.title,author:book.author,genre:book.genre,rating:book.rating,note,from:name}))}`;
  const copy=()=>{navigator.clipboard.writeText(link);setCopied(true);setTimeout(()=>setCopied(false),2500);};
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <SL>Recommend a Book</SL>
            <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:TEXT,opacity:.6}}>×</button>
          </div>
          <h2 className="t-display" style={{fontSize:24,marginTop:8}}>{book.title}</h2>
          <p style={{fontFamily:"Nunito",fontSize:11,textTransform:"uppercase",letterSpacing:".12em",opacity:.5,marginTop:4}}>{book.author}</p>
        </div>
        <div className="modal-body">
          <p style={{fontFamily:"Lora",fontSize:14,lineHeight:1.8,opacity:.7,marginBottom:20}}>Create a link to share with a friend. They'll see your recommendation when they open it.</p>
          <div style={{marginBottom:16}}><SL style={{marginBottom:6}}>Your Name</SL><input value={name} onChange={e=>setName(e.target.value)} placeholder="So your friend knows who it's from…"/></div>
          <div style={{marginBottom:20}}><SL style={{marginBottom:6}}>Your Note <span style={{opacity:.4,fontFamily:"Lora",fontStyle:"italic",textTransform:"none",letterSpacing:0,fontSize:11}}>(optional)</span></SL><textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Why should they read this?…"/></div>
          <div style={{background:"rgba(26,26,46,.04)",border:"1px solid rgba(26,26,46,.1)",padding:"10px 14px",marginBottom:16,wordBreak:"break-all",fontFamily:"Lora",fontSize:11,opacity:.5,lineHeight:1.6}}>{link}</div>
          <div style={{display:"flex",gap:12}}>
            <button className="btn-primary" onClick={copy}>{copied?"✓ Copied!":"Copy Link"}</button>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECOMMENDATION BANNER ────────────────────────────────────────────────────
function RecBanner(){
  const [rec,setRec]=useState(null);
  const [dismissed,setDismissed]=useState(false);
  useEffect(()=>{
    try{
      const params=new URLSearchParams(window.location.search);
      const r=params.get("rec");
      if(r)setRec(JSON.parse(decodeURIComponent(r)));
    }catch{}
  },[]);
  if(!rec||dismissed)return null;
  return(
    <div style={{background:ORANGE,color:"white",padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:22}}>📖</span>
        <div>
          <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15,marginBottom:3}}>
            {rec.from?`${rec.from} recommends: `:"Recommended: "}<em>{rec.title}</em>{rec.author?` by ${rec.author}`:""}
          </p>
          {rec.note&&<p style={{fontFamily:"Lora",fontSize:13,opacity:.9,marginTop:2}}>"{rec.note}"</p>}
          {rec.rating>0&&<p style={{fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".12em",opacity:.8,marginTop:4}}>Rated {rec.rating}/10</p>}
        </div>
      </div>
      <button onClick={()=>setDismissed(true)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",color:"white",fontFamily:"Nunito",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:".1em",padding:"8px 16px",cursor:"pointer",flexShrink:0}}>Dismiss</button>
    </div>
  );
}

// ─── BOOK CLUB QUESTIONS ──────────────────────────────────────────────────────
function BookClubQuestions({title,genre,questions,onChange}){
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const generate=async()=>{
    if(!title.trim())return;
    setLoading(true);
    const t=await callClaude([{role:"user",content:`Generate 5 thoughtful book club discussion questions for "${title}" (${genre}). Return ONLY a numbered list, no intro text.`}]);
    onChange(t);setLoading(false);
  };
  return(
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",paddingBottom:8}} onClick={()=>setOpen(o=>!o)}>
        <SL>Book Club Questions <span style={{opacity:.4,fontFamily:"Lora",fontStyle:"italic",textTransform:"none",letterSpacing:0,fontSize:11}}>(optional)</span></SL>
        <span style={{fontFamily:"Nunito",fontSize:10,opacity:.4,userSelect:"none"}}>{open?"▲ hide":"▼ show"}</span>
      </div>
      {open&&(
        <div>
          <textarea value={questions} onChange={e=>onChange(e.target.value)} rows={5} placeholder="Your discussion questions…" style={{marginBottom:10}}/>
          <button className="btn-ghost" style={{fontSize:10}} onClick={generate} disabled={loading||!title.trim()}>
            {loading?"Generating…":"✦ Generate with AI"}
          </button>
          {!title.trim()&&<p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:12,opacity:.5,marginTop:6}}>Add a title first to use AI generation.</p>}
        </div>
      )}
    </div>
  );
}

// ─── BOOK DETAIL ──────────────────────────────────────────────────────────────
function BookDetail({book,onBack,onEdit}){
  const [similar,setSimilar]=useState(""),[loading,setLoading]=useState(false);
  const [showRec,setShowRec]=useState(false);
  const findSimilar=async()=>{
    setLoading(true);
    const t=await callClaude([{role:"user",content:`I finished "${book.title}" by ${book.author} (${book.genre}). Suggest 4 similar books. Format: "Title by Author — one sentence why". Be specific and literary.`}]);
    setSimilar(t);setLoading(false);
  };
  return(
    <>
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <button className="btn-ghost" style={{marginBottom:32,fontSize:10}} onClick={onBack}>← Back</button>
      {book.status==="reading"&&<div className="reading-badge" style={{marginBottom:20}}><span style={{width:6,height:6,borderRadius:"50%",background:BLUE,display:"inline-block"}}/> Currently Reading</div>}
      <div style={{display:"flex",gap:24,alignItems:"flex-start",marginBottom:40}}>
        <div style={{width:40,height:140,background:book.spine_color||PALETTE[0],flexShrink:0,boxShadow:"inset -3px 0 6px rgba(0,0,0,.3)"}}/>
        <div style={{flex:1}}>
          <SL style={{marginBottom:8}}>{book.genre}</SL>
          <h1 className="t-display" style={{fontSize:42,lineHeight:1.1,marginBottom:8}}>{book.title}</h1>
          <p className="t-label-lg" style={{marginBottom:16,fontSize:13}}>{book.author}</p>
          {book.status==="finished"&&<div style={{display:"flex",gap:24}}><div><SL style={{marginBottom:4}}>Overall</SL><Stars value={book.rating}/></div><div><SL style={{marginBottom:4}}>Genre</SL><Stars value={book.genre_rating}/></div></div>}
        </div>
        <div style={{display:"flex",gap:10,flexShrink:0}}>
          <button className="btn-primary" style={{padding:"8px 18px",fontSize:10}} onClick={()=>setShowRec(true)}>📖 Recommend</button>
          <button className="btn-ghost" onClick={onEdit}>Edit</button>
        </div>
      </div>
      <Rule style={{marginBottom:32}}/>
      <div style={{display:"flex",gap:32,marginBottom:32,flexWrap:"wrap"}}>
        {[["Pages",book.pages||"—"],["Started",fmt(book.start_date)],["Finished",fmt(book.end_date)],["Recommended By",book.recommended_by||"—"]].map(([l,v])=>(
          <div key={l}><SL style={{marginBottom:4}}>{l}</SL><p style={{fontFamily:"Lora",fontSize:15}}>{v}</p></div>
        ))}
      </div>
      {book.review&&<><Rule style={{marginBottom:24}}/><SL style={{marginBottom:16}}>Review</SL><p style={{fontFamily:"Lora",fontSize:16,lineHeight:1.8,maxWidth:640}}>{book.review}</p></>}
      {book.quotes&&<><Rule style={{margin:"28px 0 24px"}}/><SL style={{marginBottom:16}}>Favourite Passages</SL>{book.quotes.split("\n\n").filter(Boolean).map((q,i)=><div key={i} className="pullquote" style={{marginBottom:16}}>"{q.trim()}"</div>)}</>}
      {book.private_notes&&<><Rule style={{margin:"28px 0 24px"}}/><div className="private-area"><SL style={{marginBottom:12}}>🔒 Private Notes</SL><p style={{fontFamily:"Lora",fontSize:14,lineHeight:1.7,fontStyle:"italic"}}>{book.private_notes}</p></div></>}
      <Rule style={{margin:"32px 0 24px"}}/>
      <div style={{background:"rgba(122,21,32,.08)",border:`1px solid rgba(122,21,32,.2)`,borderLeft:`3px solid ${ORANGE}`,padding:24,marginBottom:40}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
          <div>
            <SL style={{marginBottom:8}}>support independent bookstores</SL>
            <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15,marginBottom:6}}>Acquire <span style={{fontStyle:"italic"}}>{book.title}</span></p>
            <p style={{fontFamily:"Lora",fontSize:13,lineHeight:1.7,opacity:.6,maxWidth:380}}>Every purchase through Princeps goes to an independent bookstore via Bookshop.org — not a warehouse.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,flexShrink:0}}>
            <a href={book.isbn?`https://bookshop.org/a/YOUR_AFFILIATE_ID/${book.isbn}`:`https://bookshop.org/search?keywords=${encodeURIComponent(book.title+" "+book.author)}`}
              target="_blank" rel="noopener noreferrer"
              style={{display:"inline-block",background:ORANGE,color:BG,border:`1px solid ${ORANGE}`,fontFamily:"Nunito",fontWeight:400,textTransform:"uppercase",letterSpacing:".22em",fontSize:11,padding:"12px 24px",textDecoration:"none",textAlign:"center"}}>
              Buy from Bookshop.org →
            </a>
            <p style={{fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".15em",opacity:.35,textAlign:"center"}}>10% supports indie stores · we earn a small commission</p>
          </div>
        </div>
      </div>
      <SL style={{marginBottom:16}}>AI Recommendations</SL>
      {!similar?<button className="btn-ghost" onClick={findSimilar} disabled={loading}>{loading?"Finding similar reads…":"✦ Find Similar Reads"}</button>
        :<div style={{fontFamily:"Lora",fontSize:15,lineHeight:1.9,whiteSpace:"pre-wrap",maxWidth:600}}>{similar}</div>}
    </div>
    {showRec&&<RecommendModal book={book} onClose={()=>setShowRec(false)}/>}
    </>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({books,setActiveTab,onAdd,profile}){
  const fin=books.filter(b=>b.status==="finished"||!b.status);
  const reading=books.filter(b=>b.status==="reading");
  const pages=fin.reduce((s,b)=>s+(+b.pages||0),0);
  const avg=fin.length?(fin.reduce((s,b)=>s+b.rating,0)/fin.length).toFixed(1):"—";
  const recent=[...fin].sort((a,b)=>b.id-a.id).slice(0,5);
  const top=[...fin].sort((a,b)=>b.rating-a.rating).slice(0,4);
  const greeting=profile?.first_name?`welcome back, ${profile.first_name}.`:"welcome back.";
  return(
    <div>
      <div style={{textAlign:"center",padding:"72px 24px 64px",borderBottom:`1px solid ${TEXT_FAINT}`,width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:32,marginBottom:32,flexWrap:"wrap"}}>
          <Stamp/>
          <div>
            <h1 className="t-display" style={{fontSize:"clamp(56px,10vw,96px)",lineHeight:.9,color:TEXT}}>princeps</h1>
            <p className="t-label" style={{marginTop:12,fontSize:11}}>editio princeps · est. mmxxiv</p>
          </div>
        </div>
        <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:18,color:TEXT,opacity:.7,maxWidth:420,margin:"0 auto 12px"}}>{greeting}</p>
        <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:15,color:TEXT,opacity:.45,maxWidth:420,margin:"0 auto"}}>for the love of reading.</p>
      </div>
      {reading.length>0&&(
        <div style={{borderBottom:`1px solid ${TEXT_FAINT}`,background:"rgba(122,21,32,.07)",width:"100%"}}>
          <div className="container" style={{padding:"28px 24px"}}>
            <div className="reading-badge" style={{marginBottom:16}}><span style={{width:6,height:6,borderRadius:"50%",background:BLUE,display:"inline-block"}}/> currently reading</div>
            <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
              {reading.map(b=>(
                <div key={b.id} style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:6,height:44,background:b.spine_color||PALETTE[0],flexShrink:0}}/>
                  <div><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15}}>{b.title}</p><p className="t-label">{b.author}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{borderBottom:`1px solid ${TEXT_FAINT}`,width:"100%"}}>
        <div className="container" style={{padding:"40px 24px"}}>
          <SL style={{marginBottom:24}}>your reading life</SL>
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {[{num:fin.length,label:"Books Read"},{num:pages.toLocaleString(),label:"Pages Turned"},{num:avg,label:"Average Rating"}].map(({num,label},i)=>(
              <div key={i} style={{flex:"1 1 160px",padding:"24px 32px",borderLeft:i>0?`1px solid ${TEXT_FAINT}`:"none"}}>
                <div className="t-display stat-num" style={{fontSize:64,lineHeight:1,color:TEXT}}>{num}</div>
                <SL style={{marginTop:8}}>{label}</SL>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container" style={{paddingTop:48,paddingBottom:80}}>
        {books.length===0?(
          <div style={{textAlign:"center",padding:"64px 0"}}>
            <p className="t-display" style={{fontSize:28,marginBottom:16,opacity:.7}}>your shelf is waiting</p>
            <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:15,opacity:.5,marginBottom:32}}>{QUOTES[0]}</p>
            <button className="btn-primary" onClick={onAdd}>+ Log your first book</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <SL>recently read</SL>
                <button className="t-label" style={{cursor:"pointer",background:"none",border:"none",color:TEXT,textDecoration:"underline"}} onClick={()=>setActiveTab("library")}>see all</button>
              </div>
              <Rule/>
              {recent.map(b=>(
                <div key={b.id} className="book-row">
                  <div style={{width:8,height:52,background:b.spine_color||PALETTE[0],flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:14,marginBottom:3}}>{b.title}</p>
                    <p className="t-label" style={{marginBottom:6}}>{b.author}</p>
                    <Stars value={b.rating} size={11}/>
                  </div>
                  <a href={b.isbn?`https://bookshop.org/a/YOUR_AFFILIATE_ID/${b.isbn}`:`https://bookshop.org/search?keywords=${encodeURIComponent(b.title+" "+b.author)}`}
                    target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                    style={{fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".15em",color:TEXT,opacity:.35,textDecoration:"none",flexShrink:0,alignSelf:"center"}}>
                    buy ↗
                  </a>
                </div>
              ))}
            </div>
            <div>
              <SL style={{marginBottom:20}}>top rated</SL>
              <Rule/>
              {top.map((b,i)=>(
                <div key={b.id} className="book-row" style={{alignItems:"center"}}>
                  <span className="t-display" style={{fontSize:28,width:32,textAlign:"right",flexShrink:0}}>{i+1}</span>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:14}}>{b.title}</p>
                    <p className="t-label">{b.genre}</p>
                  </div>
                  <span style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:20}}>{b.rating}/10</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
function Library({books,onSelect,onAdd,onGoodreads}){
  const [filter,setFilter]=useState("All"),[status,setStatus]=useState("all"),[sort,setSort]=useState("recent"),[view,setView]=useState("shelf");
  const byStatus=status==="all"?books:books.filter(b=>(b.status||"finished")===status);
  const genres=["All",...new Set(byStatus.map(b=>b.genre))];
  let filtered=filter==="All"?byStatus:byStatus.filter(b=>b.genre===filter);
  filtered=[...filtered].sort((a,b)=>sort==="recent"?b.id-a.id:sort==="rating"?b.rating-a.rating:a.title.localeCompare(b.title));
  const counts={reading:books.filter(b=>b.status==="reading").length,finished:books.filter(b=>b.status==="finished"||!b.status).length,wishlist:books.filter(b=>b.status==="wishlist").length};
  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:16}}>
        <div><SL style={{marginBottom:8}}>your collection</SL><h2 className="t-display" style={{fontSize:40,lineHeight:1}}>editio princeps</h2></div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-ghost" style={{fontSize:10}} onClick={onGoodreads}>↑ Import Goodreads</button>
          <button className="btn-primary" onClick={onAdd}>+ Log a Book</button>
        </div>
      </div>
      <div style={{display:"flex",gap:0,border:`1px solid ${TEXT_MED}`,marginBottom:20,width:"fit-content"}}>
        {[["all",`All (${books.length})`],["reading",`Reading (${counts.reading})`],["finished",`Finished (${counts.finished})`],["wishlist","Want to Read"]].map(([v,l])=>(
          <button key={v} onClick={()=>setStatus(v)} style={{padding:"8px 14px",background:status===v?TEXT:"transparent",color:status===v?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".12em"}}>{l}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",flex:1}}>
          {genres.map(g=>(
            <button key={g} onClick={()=>setFilter(g)} style={{padding:"5px 14px",border:`1px solid ${filter===g?TEXT:TEXT_MED}`,background:filter===g?TEXT:"transparent",color:filter===g?BG:TEXT,fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".15em",cursor:"pointer",borderRadius:0}}>{g}</button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{width:"auto",fontSize:10,padding:"5px 28px 5px 10px",fontFamily:"Nunito",letterSpacing:".1em"}}>
          <option value="recent">Most Recent</option><option value="rating">Top Rated</option><option value="title">A–Z</option>
        </select>
        <div style={{display:"flex",border:`1px solid ${TEXT_MED}`}}>
          {["shelf","list"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{padding:"5px 12px",background:view===v?TEXT:"transparent",color:view===v?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".1em"}}>{v}</button>
          ))}
        </div>
      </div>
      {filtered.length===0?(
        <div style={{textAlign:"center",padding:"80px 0"}}>
          <p className="t-display" style={{fontSize:24,marginBottom:16,opacity:.6}}>your shelf awaits…</p>
          <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:14,opacity:.5}}>{QUOTES[1]}</p>
        </div>
      ):view==="shelf"?(
        <>
          <div style={{padding:"24px 0 0",overflowX:"auto"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,minHeight:160}}>
              {filtered.map((b,i)=>(
                <div key={b.id} className="spine" onClick={()=>onSelect(b)} style={{height:100+(i*17)%60,background:b.spine_color||PALETTE[0]}} title={b.title}>
                  <div className="spine-text">{b.title}</div>
                </div>
              ))}
            </div>
            <Rule thick/>
          </div>
          <p className="t-label" style={{textAlign:"center",marginTop:8,opacity:.35}}>click a spine to open</p>
          <div style={{height:40}}/>
          <Rule/>
          {filtered.map(b=>(
            <div key={b.id} className="book-row" onClick={()=>onSelect(b)}>
              <div style={{width:8,height:56,background:b.spine_color||PALETTE[0],flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
                  <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15}}>{b.title}</p>
                  {b.status==="reading"&&<div className="reading-badge">reading</div>}
                </div>
                <p className="t-label" style={{marginBottom:6}}>{b.author} · {b.genre}</p>
                <Stars value={b.rating} size={11}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                <span style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:18}}>{b.rating?`${b.rating}/10`:""}</span>
                <span style={{fontFamily:"Nunito",fontSize:10,opacity:.4}}>{b.pages?`${b.pages}pp`:""}</span>
                <a href={b.isbn?`https://bookshop.org/a/YOUR_AFFILIATE_ID/${b.isbn}`:`https://bookshop.org/search?keywords=${encodeURIComponent(b.title+" "+b.author)}`}
                  target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                  style={{fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".15em",color:TEXT,opacity:.35,textDecoration:"none"}}>
                  buy ↗
                </a>
              </div>
            </div>
          ))}
        </>
      ):(
        <>
          <Rule/>
          {filtered.map(b=>(
            <div key={b.id} className="book-row" onClick={()=>onSelect(b)}>
              <div style={{width:8,height:56,background:b.spine_color||PALETTE[0],flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
                  <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15}}>{b.title}</p>
                  {b.status==="reading"&&<div className="reading-badge">reading</div>}
                </div>
                <p className="t-label">{b.author} · {b.genre}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:18,marginBottom:4}}>{b.rating?`${b.rating}/10`:""}</p>
                <Stars value={b.rating} size={10}/>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── FAVOURITES ───────────────────────────────────────────────────────────────
function Favourites({books}){
  const fin=books.filter(b=>b.status==="finished"||!b.status);
  if(fin.length===0)return(
    <div className="container" style={{paddingTop:80,paddingBottom:80,textAlign:"center"}}>
      <p className="t-display" style={{fontSize:28,opacity:.6,marginBottom:16}}>nothing here yet</p>
      <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:15,opacity:.4}}>Log some finished books to see your favourites.</p>
    </div>
  );
  const topBook=[...fin].sort((a,b)=>b.rating-a.rating)[0];
  const authorCount={};fin.forEach(b=>{authorCount[b.author]=(authorCount[b.author]||0)+1;});
  const topAuthor=Object.entries(authorCount).sort((a,b)=>b[1]-a[1])[0];
  const genreCount={};fin.forEach(b=>{genreCount[b.genre]=(genreCount[b.genre]||0)+1;});
  const topGenre=Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0];
  const allQuotes=fin.filter(b=>b.quotes).map(b=>({book:b.title,quote:b.quotes.split("\n\n")[0]}));
  const randQuote=allQuotes[Math.floor(Math.random()*allQuotes.length)];
  const nineOrTen=fin.filter(b=>b.rating>=9).sort((a,b)=>b.rating-a.rating);
  const recommended=fin.filter(b=>b.recommended_by&&b.rating>=7).sort((a,b)=>b.rating-a.rating);
  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <SL style={{marginBottom:8}}>your favourites</SL>
      <h2 className="t-display" style={{fontSize:40,lineHeight:1,marginBottom:40}}>what you loved</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16,marginBottom:48}}>
        {topBook&&<div className="fav-card"><SL style={{marginBottom:12}}>★ Favourite Book</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:16,marginBottom:4}}>{topBook.title}</p><p className="t-label">{topBook.author}</p></div>}
        {topAuthor&&<div className="fav-card"><SL style={{marginBottom:12}}>✦ Favourite Author</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:16,marginBottom:4}}>{topAuthor[0]}</p><p className="t-label">{topAuthor[1]} book{topAuthor[1]>1?"s":""}</p></div>}
        {topGenre&&<div className="fav-card"><SL style={{marginBottom:12}}>◈ Favourite Genre</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:16,marginBottom:4}}>{topGenre[0]}</p><p className="t-label">{topGenre[1]} book{topGenre[1]>1?"s":""}</p></div>}
      </div>
      {randQuote&&<><SL style={{marginBottom:16}}>A passage you loved</SL><div className="pullquote" style={{marginBottom:8}}>"{randQuote.quote}"</div><p className="t-label" style={{marginBottom:48,paddingLeft:22}}>— {randQuote.book}</p></>}
      {nineOrTen.length>0&&<><Rule style={{marginBottom:32}}/><SL style={{marginBottom:24}}>Rated 9 or 10 out of 10</SL>{nineOrTen.map(b=><div key={b.id} className="book-row"><div style={{width:8,height:52,background:b.spine_color||PALETTE[0],flexShrink:0}}/><div style={{flex:1}}><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15}}>{b.title}</p><p className="t-label">{b.author}</p></div><span className="t-display" style={{fontSize:32,color:ORANGE}}>{b.rating}</span></div>)}</>}
      {recommended.length>0&&<><Rule style={{margin:"48px 0 32px"}}/><SL style={{marginBottom:24}}>Loved it — and someone told you to read it</SL>{recommended.map(b=><div key={b.id} className="book-row"><div style={{width:8,height:52,background:b.spine_color||PALETTE[0],flexShrink:0}}/><div style={{flex:1}}><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15}}>{b.title}</p><p className="t-label">{b.recommended_by}</p></div><span style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:18}}>{b.rating}/10</span></div>)}</>}
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
function Stats({books,onGoalHit}){
  const [booksGoal,setBooksGoal]=useState(24),[pagesGoal,setPagesGoal]=useState(7500),[editing,setEditing]=useState(false);
  const thisYear=new Date().getFullYear();
  const fin=books.filter(b=>{
    if(b.status!=="finished"&&b.status!==undefined&&b.status!=="")return false;
    if(!b.end_date)return false;
    return new Date(b.end_date).getFullYear()===thisYear;
  });
  const booksRead=fin.length,pagesRead=fin.reduce((s,b)=>s+(+b.pages||0),0);
  const hit=booksRead>=booksGoal||pagesRead>=pagesGoal;
  const [alerted,setAlerted]=useState(false);
  useEffect(()=>{if(hit&&!alerted){onGoalHit();setAlerted(true);}}, [hit]);
  const genreCount={};fin.forEach(b=>{genreCount[b.genre]=(genreCount[b.genre]||0)+1;});
  const topGenres=Object.entries(genreCount).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxG=topGenres[0]?.[1]||1;
  const top5=[...fin].sort((a,b)=>b.rating-a.rating).slice(0,5);
  const avgRating=fin.length?(fin.reduce((s,b)=>s+b.rating,0)/fin.length).toFixed(1):0;
  const avgPages=fin.length?Math.round(fin.reduce((s,b)=>s+(+b.pages||0),0)/fin.length):0;
  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <SL style={{marginBottom:8}}>your numbers</SL>
      <h2 className="t-display" style={{fontSize:40,lineHeight:1,marginBottom:40}}>reading stats</h2>
      <div style={{border:`1px solid rgba(26,26,46,.1)`,padding:32,marginBottom:48}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <SL>Annual Goals</SL>
          <button className="btn-ghost" style={{fontSize:9}} onClick={()=>setEditing(e=>!e)}>{editing?"Done":"Set Goals"}</button>
        </div>
        {editing&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div><SL style={{marginBottom:6}}>Books Goal</SL><input type="number" value={booksGoal} onChange={e=>setBooksGoal(+e.target.value)} style={{textAlign:"center"}}/></div>
            <div><SL style={{marginBottom:6}}>Pages Goal</SL><input type="number" value={pagesGoal} onChange={e=>setPagesGoal(+e.target.value)} style={{textAlign:"center"}}/></div>
          </div>
        )}
        {hit&&<div style={{background:"rgba(122,21,32,.12)",border:`1px solid ${ORANGE}`,padding:"12px 16px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>🎉</span><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:14}}>you hit your reading goal!</p></div>}
        <div style={{display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap"}}>
          <RingProgress value={booksRead} max={booksGoal} size={120} label="Books" sublabel={`${booksGoal - booksRead > 0 ? booksGoal - booksRead + " to go" : "goal reached!"}`}/>
          <RingProgress value={Math.min(pagesRead,pagesGoal)} max={pagesGoal} size={120} label="Pages" sublabel={`${pagesRead.toLocaleString()} read`}/>
        </div>
      </div>
      {topGenres.length>0&&(
        <div style={{marginBottom:48}}>
          <SL style={{marginBottom:24}}>By Genre</SL>
          {topGenres.map(([g,c])=>(
            <div key={g} style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
              <span style={{fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".1em",width:120,flexShrink:0,opacity:.7}}>{g}</span>
              <div style={{flex:1,height:6,background:"rgba(26,26,46,.08)",position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${(c/maxG)*100}%`,background:ORANGE,transition:"width .5s ease"}}/>
              </div>
              <span style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:16,width:20,textAlign:"right"}}>{c}</span>
            </div>
          ))}
        </div>
      )}
      {top5.length>0&&(
        <div style={{marginBottom:48}}>
          <SL style={{marginBottom:24}}>Top 5 All Time</SL>
          {top5.map((b,i)=>(
            <div key={b.id} style={{display:"flex",gap:20,alignItems:"center",paddingBottom:20,marginBottom:20,borderBottom:`1px solid rgba(26,26,46,.07)`}}>
              <span className="t-display" style={{fontSize:48,lineHeight:1,opacity:.25,width:48,textAlign:"right"}}>{i+1}</span>
              <div style={{flex:1}}><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:16,marginBottom:4}}>{b.title}</p><p className="t-label">{b.author}</p></div>
              <Stars value={b.rating}/>
            </div>
          ))}
        </div>
      )}
      <div style={{background:"rgba(122,21,32,.08)",borderLeft:`3px solid ${ORANGE}`,padding:28}}>
        <SL style={{marginBottom:20}}>Reading Average</SL>
        <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
          <div><div className="t-display" style={{fontSize:48,lineHeight:1,marginBottom:8}}>{avgRating}</div><SL>Avg Rating / 10</SL></div>
          <div><div className="t-display" style={{fontSize:48,lineHeight:1,marginBottom:8}}>{avgPages.toLocaleString()}</div><SL>Avg Pages / Book</SL></div>
        </div>
      </div>
    </div>
  );
}

// ─── RECAP ────────────────────────────────────────────────────────────────────
function Recap({books}){
  const year=new Date().getFullYear();
  const yr=books.filter(b=>{
    if(b.status!=="finished"&&b.status!==undefined&&b.status!=="")return false;
    if(!b.end_date)return false;
    return new Date(b.end_date).getFullYear()===year;
  });
  if(yr.length===0)return(
    <div className="container" style={{paddingTop:80,paddingBottom:80,textAlign:"center"}}>
      <p className="t-display" style={{fontSize:28,opacity:.6,marginBottom:16}}>the year is still unwritten</p>
      <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:15,opacity:.4}}>Log finished books with a date to see your {year} recap.</p>
    </div>
  );
  const pages=yr.reduce((s,b)=>s+(+b.pages||0),0);
  const avgR=(yr.reduce((s,b)=>s+b.rating,0)/yr.length).toFixed(1);
  const quotes=yr.filter(b=>b.quotes).length;
  const mC=Array(12).fill(0);yr.forEach(b=>{if(b.end_date){const m=new Date(b.end_date).getMonth();mC[m]++;}});
  const peak=mC.indexOf(Math.max(...mC));
  const topBook=[...yr].sort((a,b)=>b.rating-a.rating)[0];
  const genreC={};yr.forEach(b=>{genreC[b.genre]=(genreC[b.genre]||0)+1;});
  const topGenres=Object.entries(genreC).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const authorC={};yr.forEach(b=>{authorC[b.author]=(authorC[b.author]||0)+1;});
  const topAuthor=Object.entries(authorC).sort((a,b)=>b[1]-a[1])[0];
  const longest=[...yr].sort((a,b)=>(+b.pages||0)-(+a.pages||0))[0];
  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <SL style={{marginBottom:8}}>{year} · reading year</SL>
      <h2 className="t-display" style={{fontSize:40,lineHeight:1,marginBottom:40}}>your year in books</h2>
      <div className="recap-card">
        <div className="recap-big">{yr.length}</div>
        <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:18,marginTop:8,marginBottom:4}}>books this year</p>
        <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:14,opacity:.6}}>{pages.toLocaleString()} pages across {yr.length} volume{yr.length!==1?"s":""}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:32}}>
        {[["Avg Rating",avgR+"/10"],["Pages Read",pages.toLocaleString()],["Quotes Saved",quotes]].map(([l,v])=>(
          <div key={l} className="recap-card" style={{textAlign:"center",padding:"20px 16px"}}>
            <div className="t-display" style={{fontSize:36,marginBottom:4}}>{v}</div>
            <SL>{l}</SL>
          </div>
        ))}
      </div>
      <div className="recap-card">
        <SL style={{marginBottom:20}}>Books by Month</SL>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
          {mC.map((c,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{width:"100%",background:i===peak?ORANGE:"rgba(26,26,46,.12)",height:`${Math.max((c/Math.max(...mC))*80,c>0?4:0)}px`,transition:"height .4s ease"}}/>
              <span style={{fontFamily:"Nunito",fontSize:8,textTransform:"uppercase",letterSpacing:".1em",opacity:.4}}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
        <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:13,opacity:.5,marginTop:16}}>{MONTHS[peak]} was your biggest reading month.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {topBook&&<div className="fav-card"><SL style={{marginBottom:12}}>★ Book of the Year</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15,marginBottom:4}}>{topBook.title}</p><p className="t-label">{topBook.author}</p><p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:24,marginTop:8,color:ORANGE}}>{topBook.rating}/10</p></div>}
        {topGenres.length>0&&<div className="fav-card"><SL style={{marginBottom:12}}>◈ Genres Explored</SL>{topGenres.map(([g,c])=><p key={g} style={{fontFamily:"Lora",fontSize:14,marginBottom:6}}>{g} <span style={{opacity:.5}}>({c})</span></p>)}</div>}
        {topAuthor&&<div className="fav-card"><SL style={{marginBottom:12}}>✦ Author You Loved</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15,marginBottom:4}}>{topAuthor[0]}</p><p className="t-label">{topAuthor[1]} book{topAuthor[1]>1?"s":""} this year</p></div>}
        {longest&&<div className="fav-card"><SL style={{marginBottom:12}}>📖 Longest Read</SL><p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:15,marginBottom:4}}>{longest.title}</p><p className="t-label">{longest.pages} pages</p></div>}
      </div>
    </div>
  );
}

// ─── THE STACKS ───────────────────────────────────────────────────────────────
const DEFAULT_STACKS=[
  {id:"literary-fiction",name:"Literary Fiction",desc:"Prose that lingers. Books that refuse to leave you.",tag:"genre",members:1240},
  {id:"mystery-thriller",name:"Mystery & Thriller",desc:"The pleasures of plot. The art of the reveal.",tag:"genre",members:893},
  {id:"non-fiction",name:"Non-Fiction",desc:"The world as it is, rendered as beautifully as possible.",tag:"genre",members:674},
  {id:"sci-fi-speculative",name:"Sci-Fi & Speculative",desc:"What if. What next. What does it mean to be human.",tag:"genre",members:512},
  {id:"romance",name:"Romance",desc:"For readers who take love seriously.",tag:"genre",members:1102},
  {id:"poetry-essays",name:"Poetry & Essays",desc:"The short form. The long thought.",tag:"genre",members:318},
  {id:"ishiguro",name:"Kazuo Ishiguro",desc:"Memory, loss, and the stories we tell ourselves.",tag:"author",members:204},
  {id:"zadie-smith",name:"Zadie Smith",desc:"Culture, identity, and the examined life.",tag:"author",members:187},
  {id:"toni-morrison",name:"Toni Morrison",desc:"Language as an act of love and resistance.",tag:"author",members:441},
  {id:"classics",name:"The Classics",desc:"What has survived and why.",tag:"theme",members:729},
  {id:"debuts",name:"Debut Novels",desc:"First books. First impressions that last.",tag:"theme",members:355},
  {id:"translation",name:"In Translation",desc:"Literature without borders.",tag:"theme",members:298},
];

function Stacks({books,userId}){
  const [joined,setJoined]=useState(new Set());
  const [filter,setFilter]=useState("all");
  const [activeStack,setActiveStack]=useState(null);
  const [stackPosts,setStackPosts]=useState([]);
  const [draft,setDraft]=useState({name:"",bookTag:"",text:""});
  const [posting,setPosting]=useState(false);
  const [aiPrompt,setAiPrompt]=useState(""),[ aiRec,setAiRec]=useState(""),[ aiLoading,setAiLoading]=useState(false);
  const [allStacks,setAllStacks]=useState(DEFAULT_STACKS);
  const [showCreate,setShowCreate]=useState(false);
  const [newStack,setNewStack]=useState({name:"",desc:"",tag:"genre",isPrivate:false});
  const [createdCode,setCreatedCode]=useState(null);
  const [joinCode,setJoinCode]=useState("");
  const [joinError,setJoinError]=useState("");

  useEffect(()=>{
    if(!userId)return;
    supabase.from("joined_stacks").select("stack_id").eq("user_id",userId)
      .then(({data})=>{if(data)setJoined(new Set(data.map(r=>r.stack_id)));});
  },[userId]);

  const toggleJoin=async(sid)=>{
    if(!userId)return;
    const isJoined=joined.has(sid);
    const next=new Set(joined);
    if(isJoined){
      next.delete(sid);
      await supabase.from("joined_stacks").delete().eq("user_id",userId).eq("stack_id",sid);
    }else{
      next.add(sid);
      await supabase.from("joined_stacks").insert({user_id:userId,stack_id:sid});
    }
    setJoined(next);
  };

  const loadPosts=async(sid)=>{
    const {data}=await supabase.from("stack_posts").select("*").eq("stack_id",sid).order("created_at",{ascending:false});
    setStackPosts(data||[]);
  };

  const enterStack=(s)=>{setActiveStack(s);loadPosts(s.id);};

  const postToStack=async()=>{
    if(!draft.text.trim()||!draft.name.trim()||!activeStack)return;
    setPosting(true);
    const post={user_id:userId||"anon",stack_id:activeStack.id,display_name:draft.name,book_tag:draft.bookTag,content:draft.text};
    const {data}=await supabase.from("stack_posts").insert(post).select().single();
    if(data)setStackPosts(p=>[data,...p]);
    setDraft({name:"",bookTag:"",text:""});
    setPosting(false);
  };

  const getAI=async()=>{
    if(!aiPrompt.trim())return;
    setAiLoading(true);
    const t=await callClaude([{role:"user",content:`I'm browsing the "${activeStack.name}" stack on Princeps, a literary reading app. The reader asks: "${aiPrompt}". Suggest 3-4 specific books that fit. Format each as "Title by Author — one sentence why".`}]);
    setAiRec(t);setAiLoading(false);
  };

  const createStack=async()=>{
    if(!newStack.name.trim())return;
    const s={id:`custom-${Date.now()}`,name:newStack.name,desc:newStack.desc,tag:newStack.tag,members:1};
    setAllStacks(a=>[...a,s]);
    toggleJoin(s.id);
    setShowCreate(false);setNewStack({name:"",desc:"",tag:"genre"});
  };

  const myStacks=allStacks.filter(s=>joined.has(s.id));
  const publicStacks=allStacks.filter(s=>!s.isPrivate);
  const filtered=filter==="all"?publicStacks:publicStacks.filter(s=>s.tag===filter);
  const joinByCode=()=>{
    const found=allStacks.find(s=>s.code&&s.code.toUpperCase()===joinCode.toUpperCase().trim());
    if(found){toggleJoin(found.id);setJoinCode("");setJoinError("");}
    else setJoinError("No private stack found with that code.");
  };

  if(activeStack) return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <button className="btn-ghost" style={{marginBottom:32,fontSize:10}} onClick={()=>{setActiveStack(null);setAiRec("");}}>← All Stacks</button>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:8,flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <SL style={{marginBottom:8}}>{activeStack.tag} · {activeStack.members.toLocaleString()} members</SL>
          <h2 className="t-display" style={{fontSize:40,lineHeight:1,marginBottom:12}}>{activeStack.name}</h2>
          <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:15,opacity:.65}}>{activeStack.desc}</p>
        </div>
        <button onClick={()=>toggleJoin(activeStack.id)} style={{background:joined.has(activeStack.id)?ORANGE:"transparent",color:joined.has(activeStack.id)?BG:TEXT,border:`1px solid ${joined.has(activeStack.id)?ORANGE:"rgba(26,26,46,.35)"}`,fontFamily:"Nunito",fontSize:11,textTransform:"uppercase",letterSpacing:".15em",padding:"10px 20px",cursor:"pointer",flexShrink:0}}>{joined.has(activeStack.id)?"✓ Joined":"Join Stack"}</button>
      </div>
      <Rule style={{margin:"28px 0 36px"}}/>
      <div style={{background:"rgba(122,21,32,.08)",padding:24,marginBottom:40,border:`1px solid rgba(122,21,32,.2)`,borderLeft:`4px solid ${ORANGE}`}}>
        <SL style={{marginBottom:12}}>✦ find your next read in this stack</SL>
        <div style={{display:"flex",gap:12}}>
          <input value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} placeholder={`What are you in the mood for in ${activeStack.name}?`} style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&getAI()}/>
          <button className="btn-primary" onClick={getAI} disabled={aiLoading} style={{whiteSpace:"nowrap"}}>{aiLoading?"…":"Find Reads"}</button>
        </div>
        {aiRec&&<div style={{marginTop:20,fontFamily:"Lora",fontSize:14,lineHeight:1.9,whiteSpace:"pre-wrap",paddingTop:16,borderTop:`1px solid rgba(26,26,46,.1)`}}>{aiRec}</div>}
      </div>
      <div style={{marginBottom:40}}>
        <SL style={{marginBottom:16}}>post to {activeStack.name}</SL>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} placeholder="Your name"/>
          <input value={draft.bookTag} onChange={e=>setDraft(d=>({...d,bookTag:e.target.value}))} placeholder="Book you're discussing" list="bl2"/>
          <datalist id="bl2">{books.map(b=><option key={b.id} value={b.title}/>)}</datalist>
        </div>
        <textarea value={draft.text} onChange={e=>setDraft(d=>({...d,text:e.target.value}))} rows={4} placeholder={`Share a thought about ${activeStack.name}…`} style={{marginBottom:12}}/>
        <button className="btn-primary" onClick={postToStack} disabled={posting}>{posting?"Posting…":"Post"}</button>
      </div>
      <Rule style={{marginBottom:32}}/>
      <SL style={{marginBottom:24}}>discussion · {stackPosts.length} post{stackPosts.length!==1?"s":""}</SL>
      {stackPosts.length===0?(
        <div style={{textAlign:"center",padding:"48px 0"}}>
          <p className="t-display" style={{fontSize:22,marginBottom:12,opacity:.6}}>be the first to post</p>
          <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:14,opacity:.4}}>Every great discussion starts with a single thought.</p>
        </div>
      ):stackPosts.map(p=>(
        <div key={p.id} className="post-card">
          <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
            <div className="monogram">{(p.display_name||"?").charAt(0).toUpperCase()}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:12,alignItems:"baseline",flexWrap:"wrap"}}>
                <span style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:14}}>{p.display_name}</span>
                {p.book_tag&&<span className="t-label" style={{background:ORANGE,color:TEXT,padding:"2px 8px",opacity:1}}>{p.book_tag}</span>}
                <span className="t-label" style={{opacity:.4}}>{fmt(p.created_at)}</span>
              </div>
            </div>
          </div>
          <p style={{fontFamily:"Lora",fontSize:14,lineHeight:1.8}}>{p.content}</p>
        </div>
      ))}
    </div>
  );

  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:16}}>
        <div><SL style={{marginBottom:8}}>community</SL><h2 className="t-display" style={{fontSize:40,lineHeight:1}}>the stacks</h2></div>
        <button className="btn-ghost" onClick={()=>setShowCreate(true)}>+ Create a Stack</button>
      </div>
      {createdCode&&(
        <div style={{background:ORANGE,color:"white",padding:"16px 24px",marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
          <div>
            <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:14,marginBottom:4}}>Private stack created!</p>
            <p style={{fontFamily:"Lora",fontSize:13}}>Share this code with friends: <strong style={{fontFamily:"Nunito",letterSpacing:".2em",fontSize:16}}>{createdCode}</strong></p>
          </div>
          <button onClick={()=>setCreatedCode(null)} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.3)",color:"white",fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".1em",padding:"6px 14px",cursor:"pointer"}}>Dismiss</button>
        </div>
      )}
      <div style={{marginBottom:24,display:"flex",gap:10,alignItems:"center"}}>
        <input value={joinCode} onChange={e=>setJoinCode(e.target.value)} placeholder="Have a friend code? Enter it here…" style={{maxWidth:320}} onKeyDown={e=>e.key==="Enter"&&joinByCode()}/>
        <button className="btn-ghost" onClick={joinByCode}>Join</button>
        {joinError&&<span style={{fontFamily:"Lora",fontStyle:"italic",fontSize:13,color:ORANGE,marginLeft:8}}>{joinError}</span>}
      </div>
      {myStacks.length>0&&(
        <div style={{marginBottom:32}}>
          <SL style={{marginBottom:16}}>your stacks</SL>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {myStacks.map(s=>(
              <button key={s.id} onClick={()=>enterStack(s)} style={{background:"rgba(122,21,32,.1)",border:`1px solid rgba(122,21,32,.25)`,color:TEXT,fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".15em",padding:"8px 16px",cursor:"pointer",borderRadius:0}}>{s.name}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {[["all","All"],["genre","Genre"],["author","Author"],["theme","Theme"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:"7px 14px",background:filter===v?BLUE:"transparent",color:filter===v?BG:TEXT,border:`1px solid ${filter===v?BLUE:"rgba(26,26,46,.18)"}`,fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".15em",cursor:"pointer",borderRadius:0}}>{l}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {filtered.map(s=>(
          <div key={s.id} style={{border:`1px solid rgba(26,26,46,.1)`,padding:20,cursor:"pointer",transition:"border-color .15s",position:"relative",borderLeft:`3px solid ${joined.has(s.id)?ORANGE:"rgba(26,26,46,.1)"}`}}>
            <SL style={{marginBottom:8,fontSize:9}}>{s.tag}</SL>
            <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:16,marginBottom:8,cursor:"pointer"}} onClick={()=>enterStack(s)}>{s.name}</p>
            <p style={{fontFamily:"Lora",fontStyle:"italic",fontSize:13,opacity:.6,marginBottom:16,lineHeight:1.6}}>{s.desc}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="t-label" style={{opacity:.4}}>{s.members.toLocaleString()} members</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={e=>{e.stopPropagation();toggleJoin(s.id);}} style={{background:joined.has(s.id)?ORANGE:"transparent",color:joined.has(s.id)?BG:TEXT,border:`1px solid ${joined.has(s.id)?ORANGE:"rgba(26,26,46,.3)"}`,fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".12em",padding:"4px 10px",cursor:"pointer"}}>{joined.has(s.id)?"Joined":"Join"}</button>
                <button onClick={()=>enterStack(s)} style={{background:"transparent",color:TEXT,border:"none",fontFamily:"Nunito",fontSize:9,textTransform:"uppercase",letterSpacing:".12em",padding:"4px 0",cursor:"pointer",opacity:.5}}>Enter →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCreate&&(
        <div className="modal-overlay" onClick={()=>setShowCreate(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <SL style={{marginBottom:4}}>New Stack</SL>
              <h2 className="t-display" style={{fontSize:24}}>create a stack</h2>
            </div>
            <div className="modal-body">
              <div style={{marginBottom:16}}><SL style={{marginBottom:6}}>Name</SL><input value={newStack.name} onChange={e=>setNewStack(n=>({...n,name:e.target.value}))} placeholder="What's this stack about?"/></div>
              <div style={{marginBottom:16}}><SL style={{marginBottom:6}}>Description</SL><textarea value={newStack.desc} onChange={e=>setNewStack(n=>({...n,desc:e.target.value}))} rows={3} placeholder="A sentence about what belongs here…"/></div>
              <div style={{marginBottom:24}}>
                <SL style={{marginBottom:8}}>Type</SL>
                <div style={{display:"flex",border:`1px solid rgba(26,26,46,.15)`}}>
                  {["genre","author","theme"].map(t=>(
                    <button key={t} onClick={()=>setNewStack(n=>({...n,tag:t}))} style={{flex:1,padding:"8px",background:newStack.tag===t?ORANGE:"transparent",color:newStack.tag===t?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".12em"}}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:20}}>
                <SL style={{marginBottom:8}}>Visibility</SL>
                <div style={{display:"flex",border:`1px solid rgba(26,26,46,.15)`}}>
                  {[[false,"Public"],[true,"Private — friends only"]].map(([val,lbl])=>(
                    <button key={String(val)} onClick={()=>setNewStack(n=>({...n,isPrivate:val}))} style={{flex:1,padding:"8px",background:newStack.isPrivate===val?ORANGE:"transparent",color:newStack.isPrivate===val?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".08em"}}>{lbl}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:12}}>
                <button className="btn-primary" onClick={createStack}>Create Stack</button>
                <button className="btn-ghost" onClick={()=>setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function Profile({userId,profile,onSaved}){
  const [form,setForm]=useState(profile||{first_name:"",last_name:"",state:"",age_range:"",gender:"",favorite_genre:""});
  const [saving,setSaving]=useState(false),[saved,setSaved]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const save=async()=>{
    setSaving(true);
    await supabase.from("users").upsert({id:userId,...form},{onConflict:"id"});
    setSaving(false);setSaved(true);
    onSaved(form);
    setTimeout(()=>setSaved(false),2000);
  };

  return(
    <div className="container" style={{paddingTop:48,paddingBottom:80}}>
      <SL style={{marginBottom:8}}>account</SL>
      <h2 className="t-display" style={{fontSize:40,lineHeight:1,marginBottom:40}}>your profile</h2>

      <div style={{maxWidth:560}}>
        <div style={{border:`1px solid rgba(26,26,46,.1)`,padding:32,marginBottom:32}}>
          <SL style={{marginBottom:24}}>Personal Details</SL>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div><SL style={{marginBottom:6}}>First Name</SL><input value={form.first_name} onChange={e=>set("first_name",e.target.value)} placeholder="Jane"/></div>
            <div><SL style={{marginBottom:6}}>Last Name</SL><input value={form.last_name} onChange={e=>set("last_name",e.target.value)} placeholder="Eyre"/></div>
          </div>
          <Sel label="State" value={form.state} onChange={v=>set("state",v)} options={US_STATES} placeholder="Select your state…"/>
        </div>

        <div style={{border:`1px solid rgba(26,26,46,.1)`,padding:32,marginBottom:32}}>
          <SL style={{marginBottom:24}}>Reading Preferences</SL>
          <Sel label="Age Range" value={form.age_range} onChange={v=>set("age_range",v)} options={AGE_RANGES} placeholder="Select…"/>
          <Sel label="Gender" value={form.gender} onChange={v=>set("gender",v)} options={GENDERS} placeholder="Select…"/>
          <Sel label="Favourite Genre" value={form.favorite_genre} onChange={v=>set("favorite_genre",v)} options={GENRES} placeholder="Select…"/>
        </div>

        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <button className="btn-primary" onClick={save} disabled={saving}>{saving?"Saving…":"Save Profile"}</button>
          {saved&&<span style={{fontFamily:"Nunito",fontSize:10,textTransform:"uppercase",letterSpacing:".2em",color:BLUE,opacity:.8}}>✓ Saved</span>}
        </div>
      </div>
    </div>
  );
}


// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen(){
  const [mode,setMode]=useState("signin");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [confirmSent,setConfirmSent]=useState(false);

  const submit=async()=>{
    setError("");setLoading(true);
    if(mode==="signin"){
      const {error:e}=await supabase.auth.signInWithPassword({email,password});
      if(e)setError(e.message);
    } else {
      const {error:e}=await supabase.auth.signUp({email,password});
      if(e)setError(e.message);
      else setConfirmSent(true);
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <FontLoader/>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <Stamp/>
          <h1 className="t-display" style={{fontSize:42,marginTop:24,marginBottom:8}}>princeps</h1>
          <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:15,opacity:.5}}>a reading record worthy of what you read.</p>
        </div>
        {confirmSent?(
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"Libre Baskerville",fontWeight:700,fontSize:18,marginBottom:12}}>Check your email</p>
            <p style={{fontFamily:"Lora",fontSize:14,lineHeight:1.8,opacity:.7}}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account then come back and sign in.</p>
          </div>
        ):(
          <>
            <div style={{display:"flex",border:`1px solid rgba(26,26,46,.15)`,marginBottom:28}}>
              {[["signin","Sign In"],["signup","Create Account"]].map(([val,lbl])=>(
                <button key={val} onClick={()=>{setMode(val);setError("");}} style={{flex:1,padding:"10px",background:mode===val?ORANGE:"transparent",color:mode===val?BG:TEXT,border:"none",cursor:"pointer",fontFamily:"Nunito",fontWeight:700,fontSize:11,textTransform:"uppercase",letterSpacing:".1em"}}>{lbl}</button>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <SL style={{marginBottom:6}}>Email</SL>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            <div style={{marginBottom:24}}>
              <SL style={{marginBottom:6}}>Password</SL>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            {error&&<p style={{fontFamily:"Lora",fontSize:13,color:ORANGE,marginBottom:16,fontStyle:"italic"}}>{error}</p>}
            <button className="btn-primary" style={{width:"100%",padding:"14px"}} onClick={submit} disabled={loading||!email||!password}>
              {loading?"…":mode==="signin"?"Sign In →":"Create Account →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const {user,userId,loading:authLoading}=useAuth();
  const [books,setBooks]=useState([]);
  const [profile,setProfile]=useState(null);
  const [tab,setTab]=useState("home");
  const [selected,setSelected]=useState(null);
  const [showLog,setShowLog]=useState(false);
  const [editBook,setEditBook]=useState(null);
  const [showGR,setShowGR]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [onboarded,setOnboarded]=useState(true);
  const [confetti,setConfetti]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);

  // ── Bootstrap: upsert user row, load books + profile ──
  useEffect(()=>{
    if(!userId)return;
    const init=async()=>{
      // Ensure user row exists
      await supabase.from("users").upsert({id:userId},{onConflict:"id",ignoreDuplicates:true});

      // Load profile
      const {data:pData}=await supabase.from("users").select("*").eq("id",userId).single();
      if(pData)setProfile(pData);

      // Check onboarding
      const hasName=pData?.first_name;
      if(!hasName)setOnboarded(false);

      // Load books
      const {data:bData}=await supabase.from("books").select("*").eq("user_id",userId).order("created_at",{ascending:false});
      if(bData)setBooks(bData);

      setLoaded(true);
    };
    init();
  },[userId]);

  // ── Save a book to Supabase ──
  const handleSave=async(b)=>{
    const row={...b,user_id:userId,id:b.id||crypto.randomUUID()};
    const {data,error}=await supabase.from("books").upsert(row,{onConflict:"id"}).select().single();
    if(data){
      setBooks(prev=>prev.find(e=>e.id===data.id)?prev.map(e=>e.id===data.id?data:e):[data,...prev]);
      if(selected?.id===data.id)setSelected(data);
    }
  };

  // ── Import from Goodreads ──
  const handleImport=async(imported)=>{
    const rows=imported.map(b=>({...b,user_id:userId}));
    const {data}=await supabase.from("books").upsert(rows,{onConflict:"id",ignoreDuplicates:true}).select();
    if(data)setBooks(prev=>{
      const existingIds=new Set(prev.map(b=>b.id));
      const newOnes=data.filter(b=>!existingIds.has(b.id));
      return[...newOnes,...prev];
    });
  };

  // ── Complete onboarding ──
  const completeOnboard=()=>setOnboarded(true);

  const TABS=[
    {id:"home",l:"Home"},
    {id:"library",l:"Library"},
    {id:"favourites",l:"Favourites"},
    {id:"stats",l:"Stats"},
    {id:"recap",l:`${new Date().getFullYear()} Recap`},
    {id:"stacks",l:"The Stacks"},
    {id:"profile",l:"Profile"},
  ];

  if(authLoading)return(
    <><FontLoader/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:BG}}>
        <p className="t-display" style={{fontSize:32,opacity:.4}}>opening princeps…</p>
      </div>
    </>
  );

  if(!user)return <AuthScreen/>;

  if(!loaded)return(
    <><FontLoader/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:BG}}>
        <p className="t-display" style={{fontSize:32,opacity:.4}}>opening princeps…</p>
      </div>
    </>
  );

  if(!onboarded)return(
    <><FontLoader/><Onboarding onComplete={completeOnboard} userId={userId}/></>
  );

  return(
    <>
      <FontLoader/>
      <Confetti active={confetti} onDone={()=>setConfetti(false)}/>
      <div style={{minHeight:"100vh",background:BG,width:"100%"}}>
        <nav className="nav">
          <div className="nav-inner">
            <div onClick={()=>{setTab("home");setSelected(null);}}>
              <Logo size="sm"/>
            </div>
            <div className="nav-links">
              {TABS.map(t=>(
                <span key={t.id} className={`nav-link${tab===t.id&&!selected?" active":""}`} onClick={()=>{setTab(t.id);setSelected(null);}}>{t.l}</span>
              ))}
              <button className="btn-primary" style={{padding:"8px 18px",fontSize:10}} onClick={()=>setShowLog(true)}>+ Log Book</button>
              <button className="btn-ghost" style={{fontSize:10}} onClick={()=>supabase.auth.signOut()}>Sign Out</button>
            </div>
            <button className="hamburger" onClick={()=>setMenuOpen(o=>!o)} aria-label="Menu">
              <span style={{transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none"}}/>
              <span style={{opacity:menuOpen?0:1}}/>
              <span style={{transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none"}}/>
            </button>
          </div>
        </nav>
        <div className={`mobile-menu${menuOpen?" open":""}`}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
            <Logo size="md"/>
            <button onClick={()=>setMenuOpen(false)} style={{background:"none",border:"none",fontSize:28,cursor:"pointer",color:TEXT,opacity:.5}}>×</button>
          </div>
          {TABS.map(t=>(
            <span key={t.id} onClick={()=>{setTab(t.id);setSelected(null);setMenuOpen(false);}}
              style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:28,color:TEXT,padding:"12px 0",borderBottom:"1px solid rgba(26,26,46,.07)",cursor:"pointer",opacity:tab===t.id?1:.6}}>
              {t.l}
            </span>
          ))}
          <div style={{marginTop:"auto",paddingTop:32,display:"flex",flexDirection:"column",gap:12}}>
            <button className="btn-primary" style={{width:"100%",padding:"14px"}} onClick={()=>{setShowLog(true);setMenuOpen(false);}}>+ Log Book</button>
            <button className="btn-ghost" style={{width:"100%",padding:"12px"}} onClick={()=>supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
        <main>
          <RecBanner/>
          {selected?(
            <BookDetail book={selected} onBack={()=>setSelected(null)} onEdit={()=>{setEditBook(selected);setShowLog(true);}}/>
          ):tab==="home"    ?<Home books={books} setActiveTab={setTab} onAdd={()=>setShowLog(true)} profile={profile}/>
          :tab==="library"  ?<Library books={books} onSelect={setSelected} onAdd={()=>setShowLog(true)} onGoodreads={()=>setShowGR(true)}/>
          :tab==="favourites"?<Favourites books={books}/>
          :tab==="stats"    ?<Stats books={books} onGoalHit={()=>setConfetti(true)}/>
          :tab==="recap"    ?<Recap books={books}/>
          :tab==="stacks"   ?<Stacks books={books} userId={userId}/>
          :tab==="profile"  ?<Profile userId={userId} profile={profile} onSaved={p=>setProfile(prev=>({...prev,...p}))}/>
          :null}
        </main>
        <footer style={{borderTop:"1px solid rgba(26,26,46,.08)",padding:"40px 24px",textAlign:"center"}}>
          <p style={{fontFamily:"Playfair Display",fontStyle:"italic",fontSize:15,opacity:.4,marginBottom:10}}>for the love of reading.</p>
          <p className="t-label" style={{opacity:.25,marginBottom:6}}>princeps partners with bookshop.org — every purchase supports an independent bookstore</p>
          <p className="t-label" style={{opacity:.18}}>princeps · editio princeps · est. mmxxiv</p>
        </footer>
        {showLog&&<LogBookModal initial={editBook} onClose={()=>{setShowLog(false);setEditBook(null);}} onSave={b=>{handleSave(b);setShowLog(false);setEditBook(null);}}/>}
        {showGR&&<GoodreadsImport onImport={handleImport} onClose={()=>setShowGR(false)}/>}
      </div>
    </>
  );
}