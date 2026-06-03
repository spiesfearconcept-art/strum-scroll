import { useState } from "react";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const STEPS = ["welcome","basics","bodytype","health","goals","budget","generating","results"];

const BODY_TYPES = [
  { id:"ectomorph",    icon:"🏃", title:"Ectomorph",        desc:"Lean & long, difficulty gaining mass, fast metabolism" },
  { id:"mesomorph",   icon:"💪", title:"Mesomorph",         desc:"Athletic build, gains muscle easily, moderate metabolism" },
  { id:"endomorph",   icon:"🏋️", title:"Endomorph",         desc:"Stocky build, gains fat easily, slow metabolism" },
  { id:"ecto-meso",   icon:"⚡", title:"Ecto-Meso Hybrid",  desc:"Lean with some muscle, moderate-fast metabolism" },
  { id:"endo-meso",   icon:"🔥", title:"Endo-Meso Hybrid",  desc:"Muscular but carries more fat, slower metabolism" },
  { id:"unsure",      icon:"🤔", title:"Not Sure",           desc:"Describe your body and let AI decide" },
];

const HEALTH_CONDITIONS = [
  "Type 2 Diabetes","High Blood Pressure","High Cholesterol","Thyroid Issues","PCOS",
  "Celiac Disease / Gluten Intolerance","Lactose Intolerance","Kidney Disease","Heart Disease",
  "Arthritis / Joint Issues","IBS / Digestive Issues","Food Allergies","None of the above",
];

const GOALS = [
  { id:"lose-fat",    icon:"📉", title:"Lose Fat",             desc:"Reduce body fat while preserving muscle" },
  { id:"build-muscle",icon:"💪", title:"Build Muscle",          desc:"Gain lean mass and strength" },
  { id:"recomp",      icon:"⚖️", title:"Body Recomp",           desc:"Lose fat and build muscle simultaneously" },
  { id:"endurance",   icon:"🏃", title:"Endurance",             desc:"Improve cardiovascular fitness and stamina" },
  { id:"maintain",    icon:"🎯", title:"Maintain",              desc:"Keep current physique, improve health markers" },
  { id:"athletic",    icon:"🏆", title:"Athletic Performance",  desc:"Sport-specific strength and conditioning" },
];

const ACTIVITY_LEVELS = [
  { id:"sedentary", label:"Sedentary",        desc:"Desk job, little movement" },
  { id:"light",     label:"Lightly Active",   desc:"1–2 workouts/week" },
  { id:"moderate",  label:"Moderately Active",desc:"3–4 workouts/week" },
  { id:"very",      label:"Very Active",       desc:"5–6 workouts/week" },
  { id:"athlete",   label:"Athlete",           desc:"Daily intense training" },
];

const DIET_PREFS = [
  "No Restriction","Vegetarian","Vegan","Pescatarian",
  "Keto","Paleo","Mediterranean","Halal","Kosher",
];

const BLOOD_TYPES = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"];

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg:      #110C07;
  --surf:    #1C1209;
  --card:    #241810;
  --card2:   #2C1E12;
  --coral:   #C4523A;
  --gold:    #B8924A;
  --peach:   #D4A882;
  --cream:   #F0E8DC;
  --muted:   #8A7A68;
  --border:  #2E2018;
  --border2: #3A2618;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.ff-root {
  min-height:100vh;
  background:var(--bg);
  color:var(--cream);
  font-family:'DM Sans',sans-serif;
  font-weight:400;
  position:relative;
  overflow-x:hidden;
}

/* grain */
.ff-root::after {
  content:'';
  position:fixed;
  inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events:none;
  z-index:999;
  opacity:.5;
}

/* warm radial glow */
.ff-root::before {
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(ellipse 55% 40% at 15% 10%, rgba(196,82,58,.07) 0%, transparent 60%),
    radial-gradient(ellipse 45% 50% at 85% 85%, rgba(184,146,74,.06) 0%, transparent 60%);
  pointer-events:none;
  z-index:0;
}

/* ── NAV ── */
.ff-nav {
  position:fixed;
  top:0;left:0;right:0;
  z-index:100;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:16px 32px;
  background:rgba(17,12,7,.85);
  backdrop-filter:blur(16px);
  border-bottom:1px solid var(--border);
}

.ff-nav-logo {
  display:flex;
  align-items:center;
  gap:12px;
  cursor:pointer;
}

.ff-nav-wordmark {
  display:flex;
  flex-direction:column;
  line-height:1;
}

.ff-nav-form {
  font-family:'Bebas Neue',sans-serif;
  font-size:1.3rem;
  letter-spacing:.08em;
  color:var(--cream);
  line-height:.95;
}

.ff-nav-fuel {
  font-family:'Bebas Neue',sans-serif;
  font-size:1.3rem;
  letter-spacing:.08em;
  background:linear-gradient(135deg,var(--coral),var(--gold));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  line-height:.95;
}

/* ── LAYOUT ── */
.ff-page {
  position:relative;
  z-index:1;
  max-width:820px;
  margin:0 auto;
  padding:96px 24px 80px;
}

/* ── STEP PROGRESS ── */
.ff-progress {
  display:flex;
  gap:5px;
  margin-bottom:44px;
}
.ff-prog-seg {
  height:2px;
  flex:1;
  border-radius:2px;
  background:var(--border2);
  transition:background .4s;
  position:relative;
  overflow:hidden;
}
.ff-prog-seg.done {
  background:linear-gradient(90deg,var(--coral),var(--gold));
}
.ff-prog-seg.active::after {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg,var(--coral),var(--gold));
  animation:progFill .5s ease forwards;
}
@keyframes progFill{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1);transform-origin:left}}

/* ── TYPOGRAPHY ── */
.ff-eyebrow {
  font-family:'Cormorant Garamond',serif;
  font-size:.72rem;
  letter-spacing:.22em;
  text-transform:uppercase;
  color:var(--muted);
  margin-bottom:12px;
  display:block;
}

.ff-h1 {
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(3rem,8vw,5.5rem);
  letter-spacing:.04em;
  line-height:.95;
  margin-bottom:20px;
}

.ff-h2 {
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(2.2rem,5vw,3.4rem);
  letter-spacing:.04em;
  line-height:.95;
  margin-bottom:16px;
}

.ff-grad {
  background:linear-gradient(135deg,var(--coral),var(--gold));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}

.ff-sub {
  font-size:1rem;
  color:var(--muted);
  line-height:1.7;
  font-weight:300;
  margin-bottom:36px;
  max-width:560px;
}

/* ── CARDS ── */
.ff-card {
  background:var(--card);
  border:1px solid var(--border);
  border-radius:20px;
  padding:28px;
  margin-bottom:16px;
  transition:border-color .2s;
}
.ff-card:hover{border-color:var(--border2);}

/* ── INPUTS ── */
.ff-label {
  font-family:'Cormorant Garamond',serif;
  font-size:.7rem;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--gold);
  margin-bottom:8px;
  display:block;
  font-weight:600;
}

.ff-input {
  width:100%;
  background:rgba(255,255,255,.03);
  border:1px solid var(--border2);
  border-radius:12px;
  padding:13px 16px;
  color:var(--cream);
  font-family:'DM Sans',sans-serif;
  font-size:.95rem;
  outline:none;
  transition:border-color .2s,background .2s;
  appearance:none;
  -webkit-appearance:none;
}
.ff-input::placeholder{color:var(--muted);}
.ff-input:focus{border-color:var(--coral);background:rgba(196,82,58,.04);}
.ff-input option{background:#1C1209;}

.ff-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:500px){.ff-grid2{grid-template-columns:1fr;}}

/* ── CHOICE GRID ── */
.ff-choices {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(195px,1fr));
  gap:10px;
  margin-bottom:8px;
}

.ff-choice {
  background:var(--card);
  border:1.5px solid var(--border);
  border-radius:16px;
  padding:18px 16px;
  cursor:pointer;
  transition:all .18s;
  text-align:left;
}
.ff-choice:hover{border-color:var(--coral);background:rgba(196,82,58,.05);}
.ff-choice.sel{border-color:var(--coral);background:rgba(196,82,58,.08);}

.ff-choice-icon{font-size:1.6rem;margin-bottom:8px;display:block;}
.ff-choice-title{font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:.05em;margin-bottom:4px;color:var(--cream);}
.ff-choice-desc{font-size:.76rem;color:var(--muted);line-height:1.4;font-weight:300;}

/* ── CHECKBOX ── */
.ff-check-row {
  display:flex;align-items:flex-start;gap:12px;
  padding:11px 0;
  border-bottom:1px solid rgba(255,255,255,.04);
  cursor:pointer;
  transition:opacity .15s;
}
.ff-check-row:hover{opacity:.85;}
.ff-check-row:last-child{border-bottom:none;}

.ff-checkbox {
  width:19px;height:19px;flex-shrink:0;margin-top:2px;
  border-radius:5px;
  border:1.5px solid var(--border2);
  background:transparent;
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;
}
.ff-checkbox.on{background:linear-gradient(135deg,var(--coral),var(--gold));border-color:transparent;}
.ff-checkbox.on::after{content:'✓';font-size:.65rem;color:#110C07;font-weight:700;}

/* ── RADIO ── */
.ff-radio-dot {
  width:18px;height:18px;flex-shrink:0;margin-top:3px;
  border-radius:50%;
  border:1.5px solid var(--border2);
  background:transparent;
  transition:all .15s;
  position:relative;
}
.ff-radio-dot.on{border-color:var(--coral);}
.ff-radio-dot.on::after{
  content:'';position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:8px;height:8px;border-radius:50%;
  background:linear-gradient(135deg,var(--coral),var(--gold));
}

/* ── BUTTONS ── */
.ff-btn {
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,var(--coral),var(--gold));
  color:#110C07;
  border:none;border-radius:12px;
  padding:15px 30px;
  font-family:'Bebas Neue',sans-serif;
  font-size:1.05rem;letter-spacing:.08em;
  cursor:pointer;
  transition:opacity .2s,transform .15s,box-shadow .2s;
  box-shadow:0 4px 24px rgba(196,82,58,.25);
}
.ff-btn:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 32px rgba(196,82,58,.35);}
.ff-btn:active{transform:translateY(0);}
.ff-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.ff-btn-ghost {
  background:transparent;
  color:var(--muted);
  border:1.5px solid var(--border2);
  box-shadow:none;
}
.ff-btn-ghost:hover{color:var(--cream);border-color:var(--border2);opacity:1;transform:none;box-shadow:none;}

.ff-btn-row{display:flex;gap:10px;margin-top:32px;flex-wrap:wrap;}

/* ── TAGS ── */
.ff-tag {
  display:inline-block;
  padding:3px 10px;border-radius:20px;
  font-size:.7rem;font-weight:600;
  font-family:'Cormorant Garamond',serif;
  letter-spacing:.06em;
  background:rgba(196,82,58,.12);
  color:var(--peach);
  border:1px solid rgba(196,82,58,.2);
}

/* ── LOADING ── */
.ff-loading{text-align:center;padding:80px 0;}
.ff-spinner{
  width:52px;height:52px;border-radius:50%;
  border:2px solid rgba(196,82,58,.15);
  border-top-color:var(--coral);
  animation:spin .85s linear infinite;
  margin:0 auto 24px;
}
@keyframes spin{to{transform:rotate(360deg)}}
.ff-load-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:1.6rem;letter-spacing:.06em;
  color:var(--cream);margin-bottom:8px;
}
.ff-load-sub{font-size:.85rem;color:var(--muted);animation:pulse 1.6s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}

/* ── TABS ── */
.ff-tabs{
  display:flex;gap:3px;
  background:var(--surf);
  border:1px solid var(--border);
  border-radius:14px;padding:4px;
  margin-bottom:28px;flex-wrap:wrap;
}
.ff-tab{
  flex:1;min-width:90px;
  text-align:center;padding:10px 12px;
  border-radius:10px;
  font-family:'Bebas Neue',sans-serif;
  font-size:.95rem;letter-spacing:.06em;
  cursor:pointer;
  color:var(--muted);
  transition:all .2s;border:none;background:transparent;
}
.ff-tab.on{background:var(--card2);color:var(--peach);}

/* ── RESULTS ── */
.ff-stat-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(120px,1fr));
  gap:10px;margin-bottom:20px;
}
.ff-stat{
  background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:16px;text-align:center;
}
.ff-stat-val{
  font-family:'Bebas Neue',sans-serif;font-size:1.7rem;
  letter-spacing:.04em;
  background:linear-gradient(135deg,var(--coral),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.ff-stat-label{font-size:.68rem;color:var(--muted);margin-top:3px;letter-spacing:.06em;}
.ff-stat-sub{font-size:.62rem;color:rgba(196,82,58,.6);margin-top:2px;}

.ff-section-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:1.1rem;letter-spacing:.08em;
  margin-bottom:14px;
  color:var(--peach);
  display:flex;align-items:center;gap:8px;
}

.ff-insight-row{
  display:flex;gap:10px;align-items:flex-start;
  padding:9px 0;
  border-bottom:1px solid rgba(255,255,255,.04);
  font-size:.88rem;color:rgba(240,232,220,.75);line-height:1.55;
}
.ff-insight-row:last-child{border-bottom:none;}
.ff-insight-num{color:var(--coral);font-family:'Bebas Neue',sans-serif;font-size:1rem;flex-shrink:0;margin-top:1px;}

/* meal */
.ff-meal{
  background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:22px;margin-bottom:12px;
  transition:border-color .2s;
}
.ff-meal:hover{border-color:var(--border2);}
.ff-meal-head{
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:8px;flex-wrap:wrap;gap:8px;
}
.ff-meal-name{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:.05em;}
.ff-meal-label{font-size:.7rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;font-family:'Cormorant Garamond',serif;margin-bottom:2px;}
.ff-meal-desc{font-size:.83rem;color:var(--muted);margin-bottom:12px;font-weight:300;line-height:1.5;}

.ff-recipe-step{
  display:flex;gap:10px;font-size:.82rem;
  color:rgba(240,232,220,.7);margin-bottom:6px;line-height:1.5;
}
.ff-step-num{color:var(--gold);font-family:'Bebas Neue',sans-serif;font-size:.95rem;flex-shrink:0;}

.ff-ing-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.ff-ing{
  background:rgba(255,255,255,.04);border-radius:8px;
  padding:4px 10px;font-size:.76rem;color:rgba(240,232,220,.65);
}
.ff-ing-cost{color:rgba(184,146,74,.7);margin-left:4px;}

/* grocery */
.ff-budget-bar{
  display:flex;justify-content:space-between;align-items:center;
  background:var(--card);border:1px solid var(--border);border-radius:16px;
  padding:22px 24px;margin-bottom:16px;
}
.ff-budget-val{
  font-family:'Bebas Neue',sans-serif;font-size:2.4rem;letter-spacing:.04em;
  background:linear-gradient(135deg,var(--coral),var(--gold));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.ff-grocery-cat{
  background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:20px;margin-bottom:12px;
}
.ff-grocery-cat-title{
  font-family:'Bebas Neue',sans-serif;font-size:.95rem;letter-spacing:.1em;
  color:var(--gold);margin-bottom:12px;
}
.ff-grocery-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04);
  font-size:.88rem;
}
.ff-grocery-row:last-child{border-bottom:none;}
.ff-grocery-qty{font-size:.74rem;color:var(--muted);margin-top:2px;}
.ff-grocery-price{font-family:'Bebas Neue',sans-serif;color:var(--peach);font-size:.95rem;flex-shrink:0;margin-left:12px;}

/* workout */
.ff-workout-day{
  background:var(--card);border:1px solid var(--border);
  border-radius:16px;padding:20px;margin-bottom:12px;
}
.ff-day-label{
  font-family:'Bebas Neue',sans-serif;letter-spacing:.12em;
  font-size:.85rem;color:var(--coral);margin-bottom:4px;
}
.ff-day-focus{
  font-family:'Bebas Neue',sans-serif;font-size:1.15rem;letter-spacing:.04em;
  color:var(--cream);margin-bottom:12px;
}
.ff-ex-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04);
}
.ff-ex-row:last-child{border-bottom:none;}
.ff-ex-name{font-size:.9rem;font-weight:500;}
.ff-ex-note{font-size:.74rem;color:var(--muted);font-weight:300;margin-top:2px;}
.ff-ex-sets{
  font-family:'Bebas Neue',sans-serif;font-size:.95rem;
  color:var(--peach);flex-shrink:0;margin-left:12px;text-align:right;
}
.ff-ex-rest{font-size:.7rem;color:var(--muted);margin-top:2px;}

/* tip rows */
.ff-tip-row{
  display:flex;gap:10px;padding:9px 0;
  border-bottom:1px solid rgba(255,255,255,.04);
  font-size:.88rem;color:rgba(240,232,220,.75);line-height:1.5;
}
.ff-tip-row:last-child{border-bottom:none;}
.ff-tip-arrow{color:var(--gold);flex-shrink:0;}

.ff-disclaimer{
  font-size:.73rem;color:rgba(138,122,104,.6);
  margin-top:32px;line-height:1.7;
  padding:16px;border:1px solid var(--border);border-radius:12px;
}

/* ── WELCOME ── */
.ff-hero{padding:48px 0 32px;position:relative;}

.ff-hero-emblem{
  display:flex;align-items:center;gap:16px;margin-bottom:40px;
}

.ff-features{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
  gap:10px;margin:32px 0 44px;
}
.ff-feature{
  background:var(--card);border:1px solid var(--border);
  border-radius:14px;padding:18px 14px;
}
.ff-feature-icon{font-size:1.4rem;margin-bottom:8px;}
.ff-feature-title{font-family:'Bebas Neue',sans-serif;font-size:.9rem;letter-spacing:.06em;margin-bottom:4px;color:var(--cream);}
.ff-feature-desc{font-size:.73rem;color:var(--muted);line-height:1.4;font-weight:300;}

/* divider */
.ff-divider{height:1px;background:linear-gradient(90deg,transparent,var(--border2),transparent);margin:24px 0;}

/* scroll fade in */
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.ff-fadein{animation:fadeUp .5s ease both;}
.ff-fadein-d1{animation:fadeUp .5s .1s ease both;opacity:0;animation-fill-mode:forwards;}
.ff-fadein-d2{animation:fadeUp .5s .2s ease both;opacity:0;animation-fill-mode:forwards;}
.ff-fadein-d3{animation:fadeUp .5s .3s ease both;opacity:0;animation-fill-mode:forwards;}
`;

/* ─────────────────────────────────────────
   SVG EMBLEM (reusable)
───────────────────────────────────────── */
function Emblem({ size = 54 }) {
  const id = `e${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
      <defs>
        <linearGradient id={`sg${id}`} x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4523A"/><stop offset="100%" stopColor="#B8924A"/>
        </linearGradient>
        <linearGradient id={`fg${id}`} x1="30" y1="10" x2="60" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F0E8DC"/><stop offset="100%" stopColor="#D4A882"/>
        </linearGradient>
        <linearGradient id={`ag${id}`} x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4523A" stopOpacity="0"/>
          <stop offset="50%" stopColor="#B8924A"/>
          <stop offset="100%" stopColor="#C4523A" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M45 4 L80 23 L80 67 L45 86 L10 67 L10 23 Z" fill={`url(#sg${id})`} opacity=".14"/>
      <path d="M45 4 L80 23 L80 67 L45 86 L10 67 L10 23 Z" fill="none" stroke={`url(#sg${id})`} strokeWidth="1.5"/>
      <path d="M45 14 L72 29.5 L72 60.5 L45 76 L18 60.5 L18 29.5 Z" fill="none" stroke={`url(#ag${id})`} strokeWidth=".5" opacity=".4"/>
      <circle cx="45" cy="25" r="6" fill={`url(#fg${id})`}/>
      <path d="M38 33 Q34 38 35 46 L38 46 L37 56 L43 56 L45 46 L47 56 L53 56 L52 46 L55 46 Q56 38 52 33 Z" fill={`url(#fg${id})`}/>
      <path d="M38 35 L28 28 L26 31 L36 39 Z" fill={`url(#fg${id})`}/>
      <path d="M52 35 L62 28 L64 31 L54 39 Z" fill={`url(#fg${id})`}/>
      <path d="M40 56 L37 70 L41 70 L45 59 L49 70 L53 70 L50 56 Z" fill={`url(#fg${id})`}/>
      <line x1="22" y1="78" x2="68" y2="78" stroke={`url(#ag${id})`} strokeWidth="1" opacity=".6"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function FormFuel() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState({
    name:"", age:"", weight:"", weightUnit:"lbs", height:"", heightUnit:"ft",
    bloodType:"", sex:"",
    bodyType:"", healthConditions:[], otherConditions:"",
    goal:"", activityLevel:"", dietPref:"No Restriction",
    budget:"", city:"", state:"", weeks:"4",
  });
  const [tab,    setTab]      = useState("overview");
  const [result, setResult]   = useState(null);
  const [loadMsg,setLoadMsg]  = useState("Analyzing your profile…");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleCond = (c) => {
    if (c === "None of the above") { set("healthConditions", ["None of the above"]); return; }
    setForm(f => {
      const arr = f.healthConditions.filter(x => x !== "None of the above");
      return { ...f, healthConditions: arr.includes(c) ? arr.filter(x=>x!==c) : [...arr, c] };
    });
  };

  /* prompt */
  const buildPrompt = () => `
You are an elite certified nutritionist, personal trainer, and registered dietitian.
Create a HIGHLY personalized health plan for this exact profile:

Name: ${form.name||"User"} | Age: ${form.age} | Sex: ${form.sex}
Weight: ${form.weight} ${form.weightUnit} | Height: ${form.height} ${form.heightUnit}
Blood Type: ${form.bloodType} | Body Type: ${form.bodyType}
Health Conditions: ${form.healthConditions.join(", ")||"None"}
${form.otherConditions ? `Other: ${form.otherConditions}` : ""}
Primary Goal: ${form.goal} | Activity Level: ${form.activityLevel}
Dietary Preference: ${form.dietPref}
Weekly Grocery Budget: $${form.budget} | Location: ${form.city}, ${form.state}
Plan Duration: ${form.weeks} weeks

Return ONLY valid JSON, no markdown, no explanation:
{
  "bmi":"22.4","bmiCategory":"Normal Weight",
  "dailyCalories":"2150","proteinG":"168","carbsG":"215","fatG":"72",
  "bodyTypeAnalysis":"2-3 sentence analysis of their body type and what it means",
  "keyInsights":["insight 1","insight 2","insight 3"],
  "dietNotes":"2-3 sentences about diet customization for their conditions and blood type",
  "mealPlan":[
    {"meal":"Breakfast","name":"Meal name","calories":"430","protein":"36g",
     "description":"Brief appetizing description",
     "recipe":["Step 1","Step 2","Step 3"],
     "ingredients":[{"item":"Eggs","qty":"3 large","estCost":"$0.75"}]},
    {"meal":"Mid-Morning Snack","name":"...","calories":"...","protein":"...","description":"...","recipe":[],"ingredients":[]},
    {"meal":"Lunch","name":"...","calories":"...","protein":"...","description":"...","recipe":["Step 1","Step 2"],"ingredients":[{"item":"...","qty":"...","estCost":"$0.00"}]},
    {"meal":"Afternoon Snack","name":"...","calories":"...","protein":"...","description":"...","recipe":[],"ingredients":[]},
    {"meal":"Dinner","name":"...","calories":"...","protein":"...","description":"...","recipe":["Step 1","Step 2","Step 3","Step 4"],"ingredients":[{"item":"...","qty":"...","estCost":"$0.00"}]}
  ],
  "groceryList":[
    {"category":"Proteins","items":[{"name":"Chicken Breast","qty":"3 lbs","estCost":"$11.99"}]},
    {"category":"Produce","items":[{"name":"Spinach","qty":"5 oz","estCost":"$2.49"}]},
    {"category":"Dairy & Alternatives","items":[]},
    {"category":"Grains & Pantry","items":[]},
    {"category":"Fats & Oils","items":[]}
  ],
  "estimatedWeeklyCost":"$XX.XX",
  "workoutPlan":[
    {"day":"Monday","focus":"Upper Body Strength","duration":"45 min",
     "exercises":[{"name":"Bench Press","sets":"4","reps":"8","rest":"90s","notes":"Keep shoulder blades retracted"}]},
    {"day":"Tuesday","focus":"...","duration":"...","exercises":[{"name":"...","sets":"...","reps":"...","rest":"...","notes":"..."}]},
    {"day":"Wednesday","focus":"Active Recovery","duration":"30 min","exercises":[{"name":"Light Walk or Yoga","sets":"1","reps":"30 min","rest":"-","notes":"Keep heart rate low"}]},
    {"day":"Thursday","focus":"...","duration":"...","exercises":[]},
    {"day":"Friday","focus":"...","duration":"...","exercises":[]},
    {"day":"Saturday","focus":"...","duration":"...","exercises":[]},
    {"day":"Sunday","focus":"Rest & Recovery","duration":"-","exercises":[]}
  ],
  "supplementSuggestions":["Suggestion 1","Suggestion 2","Suggestion 3"],
  "progressTips":["Tip 1","Tip 2","Tip 3"]
}
Adapt ALL recommendations for: health conditions (${form.healthConditions.join(", ")||"none"}), dietary preference (${form.dietPref}), and local pricing in ${form.city}, ${form.state}.`;

  const generate = async () => {
    setStep(6);
    const msgs = [
      "Analyzing your biology…","Calculating your macros…",
      "Crafting personalized meals…","Building your workout split…",
      "Estimating grocery costs…","Putting it all together…",
    ];
    let i = 0;
    setLoadMsg(msgs[0]);
    const iv = setInterval(() => { i=(i+1)%msgs.length; setLoadMsg(msgs[i]); }, 2200);
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:4000,
          messages:[{role:"user",content:buildPrompt()}],
        }),
      });
      const data = await res.json();
      const txt  = (data.content||[]).map(b=>b.text||"").join("");
      const clean= txt.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
      setStep(7);
    } catch(e) {
      setResult({error:true});
      setStep(7);
    } finally {
      clearInterval(iv);
    }
  };

  const reset = () => {
    setStep(0); setResult(null); setTab("overview");
    setForm({name:"",age:"",weight:"",weightUnit:"lbs",height:"",heightUnit:"ft",
      bloodType:"",sex:"",bodyType:"",healthConditions:[],otherConditions:"",
      goal:"",activityLevel:"",dietPref:"No Restriction",budget:"",city:"",state:"",weeks:"4"});
  };

  const stepsBetween = STEPS.slice(1,-1);

  return (
    <>
      <style>{CSS}</style>
      <div className="ff-root">

        {/* NAV */}
        <nav className="ff-nav">
          <div className="ff-nav-logo" onClick={reset}>
            <Emblem size={38}/>
            <div className="ff-nav-wordmark">
              <span className="ff-nav-form">FORM</span>
              <span className="ff-nav-fuel">FUEL</span>
            </div>
          </div>
          {step > 0 && step < 7 && (
            <span style={{fontSize:".75rem",color:"var(--muted)",fontFamily:"'Cormorant Garamond',serif",letterSpacing:".12em"}}>
              STEP {step} OF 5
            </span>
          )}
        </nav>

        <div className="ff-page">

          {/* ── PROGRESS BAR ── */}
          {step > 0 && step < 7 && (
            <div className="ff-progress">
              {stepsBetween.map((_,i) => (
                <div key={i} className={`ff-prog-seg ${i<step?"done":""} ${i===step-1?"active":""}`}/>
              ))}
            </div>
          )}

          {/* ═══════════════ WELCOME ═══════════════ */}
          {step===0 && (
            <div className="ff-hero ff-fadein">
              <div className="ff-hero-emblem">
                <Emblem size={72}/>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,8vw,5rem)",letterSpacing:".04em",lineHeight:.9}}>
                    <span style={{color:"var(--cream)"}}>FORM</span>
                    <span className="ff-grad">FUEL</span>
                  </div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:".8rem",letterSpacing:".2em",color:"var(--muted)",marginTop:6,textTransform:"uppercase"}}>
                    Your body. Your plan.
                  </div>
                </div>
              </div>

              <p className="ff-sub">
                AI-powered nutrition and fitness built around your exact biology — body type, health conditions, budget, and local market prices. No templates. No guesswork.
              </p>

              <div className="ff-features">
                {[
                  ["🧬","Body Analysis","Blood type, somatotype & health-condition aware"],
                  ["🍽️","Meal Plans","5 curated meals/day with full recipes"],
                  ["🛒","Grocery Lists","Itemized shopping list with cost estimates"],
                  ["📍","Local Pricing","Calibrated to your city & state"],
                  ["💪","Workouts","Tailored 7-day training split"],
                  ["📊","Macro Targets","Precise protein, carb & fat breakdown"],
                ].map(([icon,title,desc])=>(
                  <div key={title} className="ff-feature">
                    <div className="ff-feature-icon">{icon}</div>
                    <div className="ff-feature-title">{title}</div>
                    <div className="ff-feature-desc">{desc}</div>
                  </div>
                ))}
              </div>

              <button className="ff-btn ff-fadein-d2" onClick={()=>setStep(1)}>
                BUILD MY PLAN →
              </button>
            </div>
          )}

          {/* ═══════════════ STEP 1 — BASICS ═══════════════ */}
          {step===1 && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Step 1 of 5</span>
              <h2 className="ff-h2">YOUR <span className="ff-grad">PROFILE</span></h2>
              <p className="ff-sub">This data is the foundation of your entire personalized plan.</p>

              <div className="ff-card">
                <div className="ff-grid2" style={{marginBottom:16}}>
                  <div>
                    <label className="ff-label">First Name</label>
                    <input className="ff-input" placeholder="e.g. Alex" value={form.name} onChange={e=>set("name",e.target.value)}/>
                  </div>
                  <div>
                    <label className="ff-label">Age</label>
                    <input className="ff-input" type="number" placeholder="e.g. 28" value={form.age} onChange={e=>set("age",e.target.value)}/>
                  </div>
                </div>
                <div className="ff-grid2" style={{marginBottom:16}}>
                  <div>
                    <label className="ff-label">Biological Sex</label>
                    <select className="ff-input" value={form.sex} onChange={e=>set("sex",e.target.value)}>
                      <option value="">Select…</option>
                      <option>Male</option><option>Female</option><option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="ff-label">Blood Type</label>
                    <select className="ff-input" value={form.bloodType} onChange={e=>set("bloodType",e.target.value)}>
                      <option value="">Select…</option>
                      {BLOOD_TYPES.map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ff-grid2">
                  <div>
                    <label className="ff-label">Weight</label>
                    <div style={{display:"flex",gap:8}}>
                      <input className="ff-input" type="number" placeholder="175" value={form.weight} onChange={e=>set("weight",e.target.value)} style={{flex:1}}/>
                      <select className="ff-input" value={form.weightUnit} onChange={e=>set("weightUnit",e.target.value)} style={{width:68,flexShrink:0}}>
                        <option>lbs</option><option>kg</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="ff-label">Height</label>
                    <div style={{display:"flex",gap:8}}>
                      <input className="ff-input" placeholder={form.heightUnit==="ft"?"5'10\"":"178 cm"} value={form.height} onChange={e=>set("height",e.target.value)} style={{flex:1}}/>
                      <select className="ff-input" value={form.heightUnit} onChange={e=>set("heightUnit",e.target.value)} style={{width:68,flexShrink:0}}>
                        <option>ft</option><option>cm</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ff-btn-row">
                <button className="ff-btn" onClick={()=>setStep(2)}>CONTINUE →</button>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 2 — BODY TYPE ═══════════════ */}
          {step===2 && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Step 2 of 5</span>
              <h2 className="ff-h2">YOUR <span className="ff-grad">SOMATOTYPE</span></h2>
              <p className="ff-sub">Body type shapes how you respond to food and training. Hybrids are common and valid.</p>
              <div className="ff-choices">
                {BODY_TYPES.map(bt=>(
                  <div key={bt.id} className={`ff-choice ${form.bodyType===bt.id?"sel":""}`} onClick={()=>set("bodyType",bt.id)}>
                    <span className="ff-choice-icon">{bt.icon}</span>
                    <div className="ff-choice-title">{bt.title}</div>
                    <div className="ff-choice-desc">{bt.desc}</div>
                  </div>
                ))}
              </div>
              <div className="ff-btn-row">
                <button className="ff-btn-ghost ff-btn" onClick={()=>setStep(1)}>← BACK</button>
                <button className="ff-btn" onClick={()=>setStep(3)} disabled={!form.bodyType}>CONTINUE →</button>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 3 — HEALTH ═══════════════ */}
          {step===3 && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Step 3 of 5</span>
              <h2 className="ff-h2">HEALTH <span className="ff-grad">&amp; DIET</span></h2>
              <p className="ff-sub">Your plan adapts around any conditions or restrictions — this is where one-size-fits-all ends.</p>

              <div className="ff-card" style={{marginBottom:14}}>
                <label className="ff-label">Health Conditions — select all that apply</label>
                {HEALTH_CONDITIONS.map(c=>(
                  <div key={c} className="ff-check-row" onClick={()=>toggleCond(c)}>
                    <div className={`ff-checkbox ${form.healthConditions.includes(c)?"on":""}`}/>
                    <span style={{fontSize:".88rem"}}>{c}</span>
                  </div>
                ))}
                <div style={{marginTop:16}}>
                  <label className="ff-label">Other conditions, allergies or intolerances</label>
                  <input className="ff-input" placeholder="e.g. peanut allergy, gout, lactose intolerant…" value={form.otherConditions} onChange={e=>set("otherConditions",e.target.value)}/>
                </div>
              </div>

              <div className="ff-card">
                <label className="ff-label">Dietary Preference</label>
                <div className="ff-choices" style={{gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))"}}>
                  {DIET_PREFS.map(d=>(
                    <div key={d} className={`ff-choice ${form.dietPref===d?"sel":""}`} onClick={()=>set("dietPref",d)} style={{padding:"12px 14px"}}>
                      <div className="ff-choice-title" style={{fontSize:".85rem"}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ff-btn-row">
                <button className="ff-btn-ghost ff-btn" onClick={()=>setStep(2)}>← BACK</button>
                <button className="ff-btn" onClick={()=>setStep(4)}>CONTINUE →</button>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 4 — GOALS ═══════════════ */}
          {step===4 && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Step 4 of 5</span>
              <h2 className="ff-h2">GOALS <span className="ff-grad">&amp; ACTIVITY</span></h2>
              <p className="ff-sub">Your primary goal determines the structure of your nutrition and training split.</p>

              <div className="ff-choices" style={{marginBottom:20}}>
                {GOALS.map(g=>(
                  <div key={g.id} className={`ff-choice ${form.goal===g.id?"sel":""}`} onClick={()=>set("goal",g.id)}>
                    <span className="ff-choice-icon">{g.icon}</span>
                    <div className="ff-choice-title">{g.title}</div>
                    <div className="ff-choice-desc">{g.desc}</div>
                  </div>
                ))}
              </div>

              <div className="ff-card">
                <label className="ff-label">Current Activity Level</label>
                {ACTIVITY_LEVELS.map(a=>(
                  <div key={a.id} className="ff-check-row" onClick={()=>set("activityLevel",a.id)}>
                    <div className={`ff-radio-dot ${form.activityLevel===a.id?"on":""}`}/>
                    <div>
                      <div style={{fontSize:".9rem",fontWeight:500}}>{a.label}</div>
                      <div style={{fontSize:".76rem",color:"var(--muted)"}}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ff-btn-row">
                <button className="ff-btn-ghost ff-btn" onClick={()=>setStep(3)}>← BACK</button>
                <button className="ff-btn" onClick={()=>setStep(5)} disabled={!form.goal||!form.activityLevel}>CONTINUE →</button>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 5 — BUDGET ═══════════════ */}
          {step===5 && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Step 5 of 5</span>
              <h2 className="ff-h2">BUDGET <span className="ff-grad">&amp; LOCATION</span></h2>
              <p className="ff-sub">Grocery recommendations and pricing are calibrated to your weekly budget and local market.</p>

              <div className="ff-card">
                <div className="ff-grid2" style={{marginBottom:16}}>
                  <div>
                    <label className="ff-label">Weekly Grocery Budget ($)</label>
                    <input className="ff-input" type="number" placeholder="e.g. 120" value={form.budget} onChange={e=>set("budget",e.target.value)}/>
                  </div>
                  <div>
                    <label className="ff-label">Plan Duration</label>
                    <select className="ff-input" value={form.weeks} onChange={e=>set("weeks",e.target.value)}>
                      <option value="1">1 Week</option>
                      <option value="4">4 Weeks</option>
                      <option value="8">8 Weeks</option>
                      <option value="12">12 Weeks</option>
                    </select>
                  </div>
                </div>
                <div className="ff-grid2">
                  <div>
                    <label className="ff-label">City</label>
                    <input className="ff-input" placeholder="e.g. Austin" value={form.city} onChange={e=>set("city",e.target.value)}/>
                  </div>
                  <div>
                    <label className="ff-label">State</label>
                    <input className="ff-input" placeholder="e.g. TX" value={form.state} onChange={e=>set("state",e.target.value)}/>
                  </div>
                </div>
              </div>

              <div className="ff-btn-row">
                <button className="ff-btn-ghost ff-btn" onClick={()=>setStep(4)}>← BACK</button>
                <button className="ff-btn" onClick={generate} disabled={!form.budget||!form.city}>
                  🔥 GENERATE MY PLAN
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════ LOADING ═══════════════ */}
          {step===6 && (
            <div className="ff-loading">
              <div className="ff-spinner"/>
              <div className="ff-load-title">BUILDING YOUR PLAN</div>
              <div className="ff-load-sub">{loadMsg}</div>
            </div>
          )}

          {/* ═══════════════ RESULTS ═══════════════ */}
          {step===7 && result && !result.error && (
            <div className="ff-fadein">
              <span className="ff-eyebrow">Your personalized plan</span>
              <h2 className="ff-h2">
                {form.name ? `${form.name.toUpperCase()}'S ` : ""}
                <span className="ff-grad">FORMFUEL PLAN</span>
              </h2>

              <div className="ff-tabs">
                {[["overview","📊 Overview"],["diet","🍽️ Meals"],["grocery","🛒 Grocery"],["workout","💪 Workout"]].map(([id,lbl])=>(
                  <button key={id} className={`ff-tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>
                ))}
              </div>

              {/* ── OVERVIEW ── */}
              {tab==="overview" && (
                <>
                  <div className="ff-stat-grid">
                    {[
                      ["BMI",      result.bmi,           result.bmiCategory],
                      ["Calories", result.dailyCalories,  "per day"],
                      ["Protein",  result.proteinG+"g",   "daily target"],
                      ["Carbs",    result.carbsG+"g",     "daily target"],
                      ["Fat",      result.fatG+"g",       "daily target"],
                    ].map(([label,val,sub])=>(
                      <div key={label} className="ff-stat">
                        <div className="ff-stat-val">{val}</div>
                        <div className="ff-stat-label">{label}</div>
                        {sub && <div className="ff-stat-sub">{sub}</div>}
                      </div>
                    ))}
                  </div>

                  <div className="ff-card ff-fadein-d1">
                    <div className="ff-section-title">Body Type Analysis</div>
                    <p style={{fontSize:".88rem",lineHeight:1.7,color:"rgba(240,232,220,.8)",fontWeight:300}}>{result.bodyTypeAnalysis}</p>
                  </div>

                  <div className="ff-card ff-fadein-d2">
                    <div className="ff-section-title">Key Insights</div>
                    {(result.keyInsights||[]).map((ins,i)=>(
                      <div key={i} className="ff-insight-row">
                        <span className="ff-insight-num">0{i+1}</span>
                        <span>{ins}</span>
                      </div>
                    ))}
                  </div>

                  <div className="ff-card ff-fadein-d3">
                    <div className="ff-section-title">Dietary Notes</div>
                    <p style={{fontSize:".88rem",lineHeight:1.7,color:"rgba(240,232,220,.8)",fontWeight:300}}>{result.dietNotes}</p>
                  </div>

                  {result.supplementSuggestions?.length > 0 && (
                    <div className="ff-card">
                      <div className="ff-section-title">Supplement Suggestions</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                        {result.supplementSuggestions.map((s,i)=><span key={i} className="ff-tag">{s}</span>)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── MEALS ── */}
              {tab==="diet" && (result.mealPlan||[]).map((meal,i)=>(
                <div key={i} className="ff-meal">
                  <div className="ff-meal-label">{meal.meal}</div>
                  <div className="ff-meal-head">
                    <div className="ff-meal-name">{meal.name}</div>
                    <div style={{display:"flex",gap:8",flexShrink:0}}>
                      <span className="ff-tag">{meal.calories} cal</span>
                      <span className="ff-tag">{meal.protein} protein</span>
                    </div>
                  </div>
                  <p className="ff-meal-desc">{meal.description}</p>

                  {meal.recipe?.length > 0 && (
                    <>
                      <label className="ff-label" style={{marginBottom:8}}>Recipe</label>
                      {meal.recipe.map((s,si)=>(
                        <div key={si} className="ff-recipe-step">
                          <span className="ff-step-num">{si+1}.</span>{s}
                        </div>
                      ))}
                    </>
                  )}

                  {meal.ingredients?.length > 0 && (
                    <>
                      <div className="ff-divider"/>
                      <label className="ff-label">Ingredients</label>
                      <div className="ff-ing-list">
                        {meal.ingredients.map((ing,ii)=>(
                          <span key={ii} className="ff-ing">
                            {ing.qty} {ing.item}
                            <span className="ff-ing-cost">{ing.estCost}</span>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* ── GROCERY ── */}
              {tab==="grocery" && (
                <>
                  <div className="ff-budget-bar">
                    <div>
                      <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>Estimated Weekly Cost</div>
                      <div className="ff-budget-val">{result.estimatedWeeklyCost}</div>
                      <div style={{fontSize:".73rem",color:"var(--muted)",marginTop:4}}>Prices for {form.city}, {form.state}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>Your Budget</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"var(--cream)"}}>${form.budget}</div>
                    </div>
                  </div>

                  {(result.groceryList||[]).filter(c=>c.items?.length>0).map((cat,i)=>(
                    <div key={i} className="ff-grocery-cat">
                      <div className="ff-grocery-cat-title">{cat.category}</div>
                      {cat.items.map((item,ii)=>(
                        <div key={ii} className="ff-grocery-row">
                          <div>
                            <div>{item.name}</div>
                            <div className="ff-grocery-qty">{item.qty}</div>
                          </div>
                          <div className="ff-grocery-price">{item.estCost}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}

              {/* ── WORKOUT ── */}
              {tab==="workout" && (
                <>
                  {(result.workoutPlan||[]).map((day,i)=>(
                    <div key={i} className="ff-workout-day">
                      <div className="ff-day-label">{day.day}{day.duration!=="-" && ` · ${day.duration}`}</div>
                      <div className="ff-day-focus">{day.focus}</div>
                      {(day.exercises||[]).map((ex,ei)=>(
                        <div key={ei} className="ff-ex-row">
                          <div>
                            <div className="ff-ex-name">{ex.name}</div>
                            {ex.notes && <div className="ff-ex-note">{ex.notes}</div>}
                          </div>
                          <div className="ff-ex-sets">
                            {ex.sets!=="1"||ex.reps!=="-"
                              ? <div>{ex.sets}×{ex.reps}</div>
                              : <div style={{fontSize:".82rem",color:"var(--muted)"}}>{ex.reps}</div>}
                            {ex.rest&&ex.rest!=="-"&&<div className="ff-ex-rest">Rest {ex.rest}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {result.progressTips?.length > 0 && (
                    <div className="ff-card" style={{marginTop:8}}>
                      <div className="ff-section-title">Progress Tips</div>
                      {result.progressTips.map((t,i)=>(
                        <div key={i} className="ff-tip-row">
                          <span className="ff-tip-arrow">→</span>{t}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="ff-disclaimer">
                ⚠️ <strong>Medical Disclaimer:</strong> FormFuel provides AI-generated wellness content for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or a registered dietitian before making significant dietary or exercise changes — especially if you have pre-existing health conditions.
              </div>

              <div className="ff-btn-row" style={{marginTop:28}}>
                <button className="ff-btn-ghost ff-btn" onClick={reset}>START OVER</button>
              </div>
            </div>
          )}

          {/* ERROR */}
          {step===7 && result?.error && (
            <div className="ff-card" style={{textAlign:"center",padding:"56px 32px"}}>
              <div style={{fontSize:"2.5rem",marginBottom:16}}>⚠️</div>
              <p style={{color:"var(--muted)",marginBottom:24,fontWeight:300}}>Something went wrong generating your plan. Please try again.</p>
              <button className="ff-btn" onClick={()=>setStep(5)}>← TRY AGAIN</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
