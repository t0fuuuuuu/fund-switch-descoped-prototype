const app = document.querySelector('#app');
const toast = document.querySelector('#toast');
const dialogRoot = document.querySelector('#dialog-root');
const mobileNav = document.querySelector('#mobile-navigation');
const mobileMenuButton = document.querySelector('[data-action="open-mobile-nav"]');
const scenarioGuideButton = document.querySelector('.scenario-guide-fab');
const mainNav = document.querySelector('.main-nav');
let mobileNavReturnFocus = null;
let waiverReturnFocus = null;

function syncDialogScrollLock() {
  const hasBlockingDialog = Boolean(dialogRoot.querySelector('.modal-backdrop, .drawer-backdrop, .factsheet-backdrop'));
  document.body.classList.toggle('dialog-open', hasBlockingDialog);
}

const dialogObserver = new MutationObserver(syncDialogScrollLock);
dialogObserver.observe(dialogRoot, { childList: true });

function openMobileNav() {
  mobileNavReturnFocus = document.activeElement;
  mobileNav.hidden = false;
  document.body.classList.add('mobile-nav-open');
  mainNav.inert = true;
  app.inert = true;
  toast.inert = true;
  dialogRoot.inert = true;
  scenarioGuideButton.inert = true;
  mobileMenuButton.setAttribute('aria-expanded', 'true');
  mobileNav.querySelector('.mobile-nav-panel').focus({ preventScroll: true });
}

function closeMobileNav({ restoreFocus = true } = {}) {
  if (mobileNav.hidden) return;
  mobileNav.hidden = true;
  document.body.classList.remove('mobile-nav-open');
  mainNav.inert = false;
  app.inert = false;
  toast.inert = false;
  dialogRoot.inert = false;
  scenarioGuideButton.inert = false;
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus && mobileNavReturnFocus instanceof HTMLElement) mobileNavReturnFocus.focus({ preventScroll: true });
}

const productFundMatrix = {
  'future-assure-max-sp-peso': ['bond', 'balanced', 'high-dividend', 'active-equity', 'asian-equity', 'peso-global-esg', 'global-reit'],
  'future-assure-max-sp-usd': ['dollar-esg', 'dollar-bond', 'dollar-income'],
  'future-assure-3-pay-peso': ['bond', 'balanced', 'high-dividend', 'active-equity', 'asian-equity', 'peso-global-esg', 'global-reit', 'global-strategic'],
  'future-assure-5-pay-peso': ['bond', 'balanced', 'high-dividend', 'active-equity', 'asian-equity', 'peso-global-esg'],
  'future-assure-10-pay-peso': ['bond', 'balanced', 'high-dividend', 'active-equity', 'asian-equity', 'peso-global-esg'],
  'future-assure-regular-peso': ['bond', 'balanced', 'high-dividend', 'active-equity', 'asian-equity', 'peso-global-esg'],
};

const policies = [
  { id: '810000085627', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE (REGULAR PAY PESO)', productKey: 'future-assure-regular-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000086143', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP US DOLLAR)', productKey: 'future-assure-max-sp-usd', productType: 'VUL', currency: 'USD', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000089312', owner: 'Elizabeth Garcia', product: 'DREAM BUILDER', productType: 'Non-VUL', status: 'Inforce', fundSwitchEligible: false, selectable: true },
  { id: '810000090301', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP PESO)', productKey: 'future-assure-max-sp-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090302', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE (3-PAY PESO)', productKey: 'future-assure-3-pay-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090303', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE (5-PAY PESO)', productKey: 'future-assure-5-pay-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090304', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE (10-PAY PESO)', productKey: 'future-assure-10-pay-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090305', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP US DOLLAR)', productKey: 'future-assure-max-sp-usd', productType: 'VUL', currency: 'USD', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090306', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP US DOLLAR)', productKey: 'future-assure-max-sp-usd', productType: 'VUL', currency: 'USD', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090307', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE (5-PAY PESO)', productKey: 'future-assure-5-pay-peso', productType: 'VUL', currency: 'PHP', status: 'Inforce', fundSwitchEligible: true, selectable: false, pendingRequest: true },
  { id: '810000090308', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP US DOLLAR)', productKey: 'future-assure-max-sp-usd', productType: 'VUL', currency: 'USD', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000090309', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX (SP US DOLLAR)', productKey: 'future-assure-max-sp-usd', productType: 'VUL', currency: 'USD', status: 'Inforce', fundSwitchEligible: true, selectable: true },
  { id: '810000087920', owner: 'Elizabeth Garcia', product: 'SURE START', productType: 'Non-VUL', status: 'Lapsed', fundSwitchEligible: false, selectable: false },
  { id: '810000088405', owner: 'Elizabeth Garcia', product: 'FUTURE ASSURE MAX', productType: 'VUL', status: 'Terminated', fundSwitchEligible: false, selectable: false },
];

const funds = [
  { id: 'bond', name: 'Peso Bond Fund', currency: 'PHP', type: 'Fixed Income', risk: 'Moderately Conservative', riskScore: 3 },
  { id: 'balanced', name: 'Peso Balanced Fund', currency: 'PHP', type: 'Balanced', risk: 'Moderate', riskScore: 6 },
  { id: 'equity', name: 'Peso Equity Fund', currency: 'PHP', type: 'Equity', risk: 'Moderately Aggressive', riskScore: 7 },
  { id: 'high-dividend', name: 'Peso High Dividend Equity Fund', currency: 'PHP', type: 'Equity', risk: 'Moderately Aggressive', riskScore: 7 },
  { id: 'active-equity', name: 'Peso Active Equity Fund', currency: 'PHP', type: 'Equity', risk: 'Moderately Aggressive', riskScore: 7 },
  { id: 'asian-equity', name: 'Asian Equity Fund', currency: 'PHP', type: 'Equity', risk: 'Aggressive', riskScore: 9 },
  { id: 'peso-global-esg', name: 'Peso Global ESG Equity Fund', currency: 'PHP', type: 'Equity', risk: 'Aggressive', riskScore: 9 },
  { id: 'global-reit', name: 'Peso Global REIT Payout Fund', currency: 'PHP', type: 'Multi-Asset', risk: 'Aggressive', riskScore: 9 },
  { id: 'global-strategic', name: 'Peso Global Strategic Payout Fund', currency: 'PHP', type: 'Multi-Asset', risk: 'Aggressive', riskScore: 9 },
  { id: 'dollar-esg', name: 'Dollar Global ESG Equity Fund', currency: 'USD', type: 'Equity', risk: 'Aggressive', riskScore: 9 },
  { id: 'dollar-bond', name: 'Dollar Global Bond Fund', currency: 'USD', type: 'Fixed Income', risk: 'Moderate', riskScore: 6 },
  { id: 'dollar-global-equity-sample', name: 'Dollar Global Equity Fund', currency: 'USD', type: 'Equity', risk: 'Aggressive', riskScore: 9 },
  { id: 'dollar-global-balanced-sample', name: 'Dollar Global Balanced Fund', currency: 'USD', type: 'Balanced', risk: 'Moderate', riskScore: 6 },
  { id: 'dollar-income', name: 'Dollar Income Paying Fund', currency: 'USD', type: 'Multi-Asset', risk: 'Aggressive', riskScore: 9 },
];

const policyHoldings = {
  '810000085627': [
    { id: 'balanced', allocation: 60, value: 210000, navpu: 'PHP 1.1023', units: '190,526.379', accent: 'balanced' },
    { id: 'bond', allocation: 40, value: 140000, navpu: 'PHP 1.1102', units: '126,103.016', accent: 'bond' },
  ],
  '810000086143': [
    { id: 'dollar-esg', allocation: 100, value: 10500, navpu: 'USD 1.0749', units: '9,768.351', accent: 'balanced' },
  ],
  '810000090301': [
    { id: 'bond', allocation: 50, value: 50000, navpu: 'PHP 1.1102', units: '45,036.930', accent: 'bond' },
    { id: 'global-reit', allocation: 50, value: 50000, navpu: 'PHP 1.0575', units: '47,281.324', accent: 'balanced' },
  ],
  '810000090302': [
    { id: 'bond', allocation: 67, value: 50000, navpu: 'PHP 1.1102', units: '45,036.930', accent: 'bond' },
    { id: 'global-strategic', allocation: 33, value: 25000, navpu: 'PHP 1.0290', units: '24,295.432', accent: 'balanced' },
  ],
  '810000090303': [
    { id: 'bond', allocation: 33, value: 9999.99, navpu: 'PHP 1.1102', units: '9,007.197', accent: 'bond' },
    { id: 'balanced', allocation: 67, value: 20000, navpu: 'PHP 1.1023', units: '18,143.881', accent: 'balanced' },
  ],
  '810000090304': [
    { id: 'bond', allocation: 100, value: 10000, navpu: 'PHP 1.1102', units: '9,007.206', accent: 'bond' },
  ],
  '810000090305': [
    { id: 'dollar-income', allocation: 100, value: 500, navpu: 'USD 1.0000', units: '500.000', accent: 'bond' },
  ],
  '810000090306': [
    { id: 'dollar-income', allocation: 100, value: 499.99, navpu: 'USD 1.0000', units: '499.990', accent: 'bond' },
  ],
  '810000090308': [
    { id: 'dollar-esg', allocation: 40, value: 4200, navpu: 'USD 1.0749', units: '3,907.340', accent: 'balanced' },
    { id: 'dollar-bond', allocation: 25, value: 2625, navpu: 'USD 1.1102', units: '2,364.439', accent: 'bond' },
    { id: 'dollar-global-equity-sample', allocation: 20, value: 2100, navpu: 'USD 1.2000', units: '1,750.000', accent: 'balanced' },
    { id: 'dollar-global-balanced-sample', allocation: 15, value: 1575, navpu: 'USD 1.0500', units: '1,500.000', accent: 'bond' },
  ],
  '810000090309': [
    { id: 'dollar-esg', allocation: 100, value: 10500, navpu: 'USD 1.0749', units: '9,768.351', accent: 'balanced', switchableAllocation: 60, switchableValue: 6300 },
  ],
};

const fundDetails = {
  balanced: {
    description: 'The Peso Balanced Fund invests in a diversified mix of peso-denominated fixed income securities and equities for investors seeking both income and long-term growth.',
    objective: 'The fund aims to balance capital growth and regular income through a diversified portfolio of fixed income securities and equities.',
    horizon: '3 - 5 years or more',
    horizonLabel: 'Medium to Long Term',
    launchDate: 'June 18, 2012',
  },
  bond: {
    category: 'Balanced',
    description: 'The Peso Bond Fund invests in a diversified portfolio of peso-dominated fixed income instruments such as government securities, corporate bonds, and other debt securities.',
    objective: 'The fund aims to provide regular income and capital stability by investing in a diversified portfolio of high quality fixed income securities.',
    horizon: '3 - 5 years or more',
    horizonLabel: 'Medium to Long Term',
    launchDate: 'March 15, 2011',
  },
  equity: {
    description: 'The Peso Equity Fund invests primarily in Philippine equities for investors seeking long-term capital growth and who can accept significant market fluctuations.',
    objective: 'The fund aims to achieve long-term capital appreciation through a diversified portfolio of listed Philippine equities.',
    horizon: '5 years or more',
    horizonLabel: 'Long Term',
    launchDate: 'September 3, 2013',
  },
  'dollar-esg': {
    description: 'The Dollar Global ESG Equity Fund provides exposure to global companies while considering environmental, social, and governance factors.',
    objective: 'The fund aims for long-term capital growth through a diversified portfolio of global equities.',
    horizon: '5 years or more',
    horizonLabel: 'Long Term',
    launchDate: 'February 1, 2022',
  },
  'dollar-income': {
    description: 'The Dollar Income Paying Fund invests in a diversified US-dollar portfolio designed to provide regular income.',
    objective: 'The fund aims to provide income and capital stability from US-dollar-denominated investments.',
    horizon: '3 - 5 years or more',
    horizonLabel: 'Medium to Long Term',
    launchDate: 'February 1, 2022',
  },
  'dollar-bond': {
    description: 'The Dollar Global Bond Fund invests in a diversified portfolio of US-dollar-denominated fixed income securities.',
    objective: 'The fund aims to provide income and capital stability through globally diversified bonds.',
    horizon: '3 - 5 years or more',
    horizonLabel: 'Medium to Long Term',
    launchDate: 'February 1, 2022',
  },
};

const investmentFunds = [
  { name: 'Dollar Income Paying Fund', value: 'USD 0.0001', change: '99.99%', tone: 'down', chart: 'income' },
  { name: 'Asian Equity Fund', value: 'PHP 1.1131', change: '11.31%', tone: 'up', chart: 'asian' },
  { name: 'Bond Fund', value: 'PHP 1.1102', change: '11.02%', tone: 'up', chart: 'bond' },
  { name: 'Balanced Fund', value: 'PHP 1.1023', change: '10.23%', tone: 'up', chart: 'balanced' },
  { name: 'Peso Active Equity Fund', value: 'PHP 1.1115', change: '11.15%', tone: 'up', chart: 'active' },
  { name: 'Peso High Dividend Equity Fund', value: 'PHP 1.1108', change: '11.08%', tone: 'up', chart: 'dividend' },
  { name: 'Peso Global ESG Equity Fund', value: 'PHP 1.0579', change: '5.79%', tone: 'up', chart: 'esg' },
  { name: 'Dollar Global ESG Equity Fund', value: 'USD 1.0749', change: '7.49%', tone: 'up', chart: 'global' },
  { name: 'Peso Global REIT Payout Fund', value: 'PHP 1.0575', change: '5.75%', tone: 'up', chart: 'reit' },
  { name: 'Peso Global Strategic Payout Fund', value: 'PHP 1.0290', change: '2.90%', tone: 'up', chart: 'strategic' },
];

const investmentPolicies = [
  {
    id: '810000085627', title: "Elizabeth's Policy", product: 'FUTURE ASSURE', payout: 'Cash Payout', asOf: 'Sep 03, 2026', value: 350000,
    funds: [
      { id: 'balanced', name: 'Peso Balanced Fund', navpu: 'PHP 1.1023', units: '190,526.379', allocation: '60%', value: 210000, accent: 'balanced' },
      { id: 'bond', name: 'Peso Bond Fund', navpu: 'PHP 1.1102', units: '126,103.016', allocation: '40%', value: 140000, accent: 'bond' },
    ],
  },
  {
    id: '810000086143', title: "Elizabeth's Policy", product: 'FUTURE ASSURE MAX (US DOLLAR)', currency: 'USD', payout: 'Reinvestment', asOf: 'Sep 03, 2026', value: 10500,
    funds: [
      { id: 'dollar-esg', name: 'Dollar Global ESG Equity Fund', navpu: 'USD 1.0749', units: '9,768.351', allocation: '100%', value: 10500, accent: 'balanced' },
    ],
  },
];

const rpqQuestions = [
  { id: 'horizon', question: 'How long do you plan to keep this investment?', options: ['Less than 3 years', '3 to 7 years', 'More than 7 years'] },
  { id: 'objective', question: 'What is your primary investment objective?', options: ['Preserve my capital', 'Balance income and growth', 'Maximize long-term growth'] },
  { id: 'experience', question: 'How familiar are you with investment products?', options: ['Limited experience', 'Some experience', 'Experienced and confident'] },
  { id: 'loss', question: 'How would you respond if your investment fell by 20%?', options: ['Switch to a safer fund', 'Wait and monitor', 'Stay invested or invest more'] },
  { id: 'income', question: 'How stable is your current income?', options: ['Variable or uncertain', 'Generally stable', 'Very stable with sufficient reserves'] },
  { id: 'portion', question: 'How much of your available assets will this investment represent?', options: ['More than half', 'About one-quarter to one-half', 'Less than one-quarter'] },
  { id: 'return', question: 'Which risk-and-return trade-off are you most comfortable with?', options: ['Lower return with minimal fluctuation', 'Moderate return with some fluctuation', 'Higher return with significant fluctuation'] },
];

const initialState = () => ({
  screen: 'login',
  activeNav: '',
  loggedIn: false,
  loginUsername: '',
  loginPassword: '',
  loginError: '',
  passwordVisible: false,
  onboardingSeen: false,
  dashboardLoading: false,
  investmentPeriod: '1 Year',
  investmentExpandedPolicyId: '',
  requestExpanded: false,
  prototypeScenarioId: '',
  scenarioPolicyId: '',
  policyId: '',
  sourceId: '',
  additionalSourceIds: [],
  targetId: '',
  documentUploads: { rpq: { status: 'empty', name: '' }, ips: { status: 'empty', name: '' } },
  documentError: '',
  currentRiskProfile: 'Moderate',
  rpqAnswers: {},
  rpqSubmitting: false,
  rpqComplete: false,
  rpqResult: '',
  ipsAcknowledged: false,
  ipsAccepted: false,
  waiverAcknowledged: false,
  waiverAccepted: false,
  fundCheck: 'idle',
  acknowledged: false,
  submitting: false,
  requestNumber: '#23457640001',
  requestStatus: '',
  requestPolicyId: '',
  draftResumeScreen: 'funds',
  vulConsultationRequested: false,
});

let state = initialState();
let toastTimer;
let fundCheckTimer;
let submissionTimer;
let rpqTimer;
let dashboardLoadingTimer;
const documentUploadTimers = {};

const prototypeScenarios = [
  {
    id: 'standard-peso',
    category: 'Fund switching',
    title: 'Standard Peso Fund Switch',
    description: 'Eligible Peso policy, above minimum, with downloadable RPQ and IPS sample forms.',
    state: { screen: 'funds', policyId: '810000085627', sourceId: 'balanced', targetId: 'bond', fundCheck: 'complete' },
  },
  {
    id: 'higher-risk-peso',
    category: 'Fund switching',
    title: 'Higher-Risk Peso Target',
    description: 'Higher-risk target using the downloadable document and upload journey.',
    state: { screen: 'funds', policyId: '810000085627', sourceId: 'balanced', targetId: 'high-dividend', fundCheck: 'complete' },
  },
  {
    id: 'risk-mismatch-waiver',
    category: 'Fund switching',
    title: 'Higher-Risk Target — Documents',
    description: 'Higher-risk target follows the same document download and upload journey; there is no in-app waiver.',
    state: { screen: 'funds', policyId: '810000085627', sourceId: 'balanced', targetId: 'active-equity', fundCheck: 'complete' },
  },
  {
    id: 'exact-minimum-peso',
    category: 'Fund switching',
    title: 'Peso Fund at Exact Minimum',
    description: 'A ₱10,000 source fund passes the minimum rule and enables the target-fund selection.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090304', sourceId: 'bond', fundCheck: 'complete' },
  },
  {
    id: 'below-minimum-peso',
    category: 'Fund switching',
    title: 'Peso Fund Below Minimum',
    description: 'A ₱9,999.99 source fund is blocked and its target-fund selection stays unavailable.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090303', sourceId: 'bond', fundCheck: 'complete' },
  },
  {
    id: 'dollar-same-risk',
    category: 'Fund switching',
    title: 'Dollar-to-Dollar, Same Risk',
    description: 'Both funds are Aggressive; the same document download and upload steps still apply.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090305', sourceId: 'dollar-income', targetId: 'dollar-esg', fundCheck: 'complete' },
  },
  {
    id: 'below-minimum-dollar',
    category: 'Fund switching',
    title: 'Dollar Fund Below Minimum',
    description: 'A US$499.99 source fund is blocked by the US$500 minimum rule.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090306', sourceId: 'dollar-income', fundCheck: 'complete' },
  },
  {
    id: 'product-specific-funds',
    category: 'Fund switching',
    title: 'Product-Specific Fund Availability',
    description: 'The 3-Pay Peso policy exposes its own allowed target list, including Global Strategic Payout Fund.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090302', sourceId: 'bond', fundCheck: 'complete' },
  },
  {
    id: 'pending-request',
    category: 'Policy eligibility',
    title: 'Existing Fund Switch Request',
    description: 'Shows duplicate-request handling only for a policy with an active Fund Switch request.',
    requiresPolicySelection: true,
    state: { screen: 'policy', policyId: '810000090307' },
  },
  {
    id: 'income-paying-multi-source',
    category: 'Fund switching',
    title: 'Income Paying Fund — Full Allocation',
    description: 'Shows four illustrative Dollar holdings moving automatically and in full into one Income Paying Fund.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090308', sourceId: 'dollar-esg', targetId: 'dollar-income', additionalSourceIds: [], fundCheck: 'complete' },
  },
  {
    id: 'income-paying-insufficient',
    category: 'Fund switching',
    title: 'Income Paying Fund — Insufficient Allocation',
    description: 'Shows the blocking action banner when only part of the policy’s 100% Dollar holding is currently eligible to switch.',
    requiresPolicySelection: true,
    state: { screen: 'funds', policyId: '810000090309', sourceId: 'dollar-esg', targetId: 'dollar-income', additionalSourceIds: [], fundCheck: 'complete' },
  },
  {
    id: 'traditional-policy',
    category: 'Policy eligibility',
    title: 'Traditional Policy Not Eligible',
    description: 'Explains why a traditional life policy has no investment funds available to switch.',
    requiresPolicySelection: true,
    state: { screen: 'policy', policyId: '810000089312' },
  },
  {
    id: 'completed-fund-switch',
    category: 'Post-submission',
    title: 'Completed Fund Switch — Dashboard',
    description: 'Shows the customer notification on Dashboard and a concise completion status in Policy Details.',
    state: { screen: 'dashboard', activeNav: 'Dashboard', loggedIn: true, policyId: '810000085627', sourceId: 'balanced', targetId: 'bond', requestPolicyId: '810000085627', requestStatus: 'Completed', requestExpanded: true, fundCheck: 'complete' },
  },
];

function money(value, currency = selectedPolicy()?.currency || 'PHP') {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency, currencyDisplay: currency === 'USD' ? 'code' : 'symbol', maximumFractionDigits: 2 }).format(value || 0);
}

function selectedPolicy() { return policies.find((policy) => policy.id === state.policyId); }
function policyFunds(policyId = state.policyId) {
  return (policyHoldings[policyId] || []).map((holding) => ({ ...funds.find((fund) => fund.id === holding.id), ...holding }));
}
function availablePolicyFunds() {
  const policy = selectedPolicy();
  const currency = policy?.currency;
  const allowedFundIds = productFundMatrix[policy?.productKey] || [];
  const holdings = policyFunds();
  return funds
    .filter((fund) => fund.currency === currency && allowedFundIds.includes(fund.id))
    .map((fund) => ({ ...fund, ...(holdings.find((holding) => holding.id === fund.id) || { allocation: 0, value: 0 }) }));
}
function selectedSource() { return policyFunds().find((fund) => fund.id === state.sourceId); }
function selectedTarget() { return availablePolicyFunds().find((fund) => fund.id === state.targetId); }
function selectedSources() {
  if (requiresFullAllocationSwitch()) return policyFunds().filter((fund) => fund.value > 0 && fund.id !== state.targetId && switchableAllocation(fund) > 0);
  const ids = [state.sourceId, ...(state.additionalSourceIds || [])].filter(Boolean);
  return policyFunds().filter((fund) => ids.includes(fund.id));
}
function switchableAllocation(fund) { return fund?.switchableAllocation ?? fund?.allocation ?? 0; }
function switchableValue(fund) { return fund?.switchableValue ?? fund?.value ?? 0; }
function selectedSourceAllocation() { return selectedSources().reduce((sum, fund) => sum + switchableAllocation(fund), 0); }
function requiresFullAllocationSwitch() { return selectedTarget()?.id === 'dollar-income'; }
function maximumSelectableAllocation() {
  return policyFunds().filter((fund) => fund.value > 0 && fund.id !== state.targetId).reduce((sum, fund) => sum + switchableAllocation(fund), 0);
}
function canReachFullAllocation() { return maximumSelectableAllocation() >= 100; }
function fullAllocationReady() { return !requiresFullAllocationSwitch() || (canReachFullAllocation() && selectedSourceAllocation() === 100); }
function requiresRiskAssessment() {
  const source = selectedSource();
  const target = selectedTarget();
  return Boolean(source && target && target.riskScore > source.riskScore);
}
// Prototype routing rule only; Business and Compliance must confirm production document criteria.
function requiresSupportingDocuments() { return requiresRiskAssessment(); }
function riskScoreForProfile(profile) {
  return ({ 'Moderately Conservative': 3, Moderate: 6, 'Moderately Aggressive': 7, Aggressive: 9 })[profile] || 0;
}
function resultAligned() { return Boolean(selectedTarget() && riskScoreForProfile(state.rpqResult) >= selectedTarget().riskScore); }
function riskGateComplete() { return !requiresRiskAssessment() || (resultAligned() ? state.ipsAccepted : state.waiverAccepted); }
function switchAmount() {
  return selectedSources().reduce((sum, source) => sum + switchableValue(source), 0);
}
function minimumSwitchAmount(currency = selectedPolicy()?.currency) { return currency === 'USD' ? 500 : 10000; }
function meetsMinimumSwitch() { return Boolean(selectedSource() && switchAmount() >= minimumSwitchAmount()); }
function hasPendingRequest(policy) {
  return Boolean(policy.pendingRequest || (state.requestPolicyId === policy.id && ['Draft', 'Submitted', 'In Progress', 'Additional Documents Required'].includes(state.requestStatus)));
}
function resetSuitability() {
  clearTimeout(fundCheckTimer);
  state.rpqAnswers = {};
  state.rpqComplete = false;
  state.rpqResult = '';
  state.ipsAcknowledged = false;
  state.ipsAccepted = false;
  state.waiverAcknowledged = false;
  state.waiverAccepted = false;
  state.fundCheck = 'idle';
  resetDocuments();
}

function resetDocuments() {
  Object.values(documentUploadTimers).forEach(clearTimeout);
  state.documentUploads = { rpq: { status: 'empty', name: '' }, ips: { status: 'empty', name: '' } };
  state.documentError = '';
  state.acknowledged = false;
}

function documentsUploaded() { return state.documentUploads.rpq.status === 'uploaded' && state.documentUploads.ips.status === 'uploaded'; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]); }

function resetTargetSuitability() {
  clearTimeout(fundCheckTimer);
  state.ipsAcknowledged = false;
  state.ipsAccepted = false;
  state.waiverAcknowledged = false;
  state.waiverAccepted = false;
  state.fundCheck = 'idle';
  resetDocuments();
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function focusPage() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  requestAnimationFrame(() => app.focus({ preventScroll: true }));
}

function icon(name) { return `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`; }
function sharpIcon(name) { return `<span class="material-symbols-sharp" aria-hidden="true">${name}</span>`; }

function selectField({ id, label, value, placeholder, options, disabled = false }) {
  const selected = options.find((option) => option.value === value);
  return `
    <div class="field ds-select ${disabled ? 'disabled' : ''}" data-select="${id}">
      <span class="ds-field-label" id="${id}-label">${label}</span>
      <button class="ds-select-control" type="button" data-action="toggle-select" data-select-id="${id}" aria-labelledby="${id}-label" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
        <span class="${selected ? '' : 'placeholder'}">${selected ? selected.label : placeholder}</span>${icon('keyboard_arrow_down')}
      </button>
      <div class="ds-select-menu" id="${id}-listbox" role="listbox" aria-labelledby="${id}-label" hidden>
        ${options.map((option) => `<button type="button" role="option" aria-selected="${option.value === value}" data-action="select-option" data-select-id="${id}" data-value="${option.value}"><strong>${option.label}</strong>${option.description ? `<small>${option.description}</small>` : ''}</button>`).join('')}
      </div>
    </div>`;
}

function sectionMessage({ type = 'info', iconName = 'info', title = '', text, className = '' }) {
  return `<div class="section-message section-message-${type} ${className}">${icon(iconName)}<div>${title ? `<strong>${title}</strong>` : ''}<span>${text}</span></div></div>`;
}

function statusTag(label) {
  const className = label.toLowerCase().replace(/\s+/g, '-');
  return `<span class="status-tag status-${className}">${label}</span>`;
}

function fundRiskTag(fund) {
  const danger = fund.riskScore >= 7;
  return `<span class="fund-risk-tag ${danger ? 'danger' : 'standard'}"><span>${fund.risk}</span></span>`;
}

function summaryRiskTag(fund) {
  const tone = fund.riskScore <= 3 ? 'low' : fund.riskScore <= 6 ? 'medium' : 'high';
  return `<span class="summary-risk-tag ${tone}">${fund.risk}</span>`;
}

function setScenarioUrl(scenarioId = '') {
  const url = new URL(window.location.href);
  if (scenarioId) url.searchParams.set('scenario', scenarioId);
  else url.searchParams.delete('scenario');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function scenarioListMarkup() {
  return prototypeScenarios.map((scenario) => `<button class="scenario-link" type="button" data-action="load-prototype-scenario" data-scenario-id="${scenario.id}" data-search-text="${scenario.title.toLowerCase()}"><strong>${scenario.title}</strong>${icon('arrow_outward')}</button>`).join('');
}

function closeScenarioGuide({ restoreFocus = true } = {}) {
  dialogRoot.querySelector('.scenario-guide-popover')?.remove();
  scenarioGuideButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) scenarioGuideButton.focus({ preventScroll: true });
}

function openScenarioGuide() {
  dialogRoot.innerHTML = `
    <section id="scenario-guide-popover" class="scenario-guide-popover" role="dialog" aria-labelledby="scenario-guide-title" tabindex="-1">
      <header class="scenario-guide-header">
        <h2 id="scenario-guide-title">Prototype Scenario Guide</h2>
        <button class="icon-button" type="button" data-action="close-scenario-guide" aria-label="Close prototype scenario guide">${icon('close')}</button>
      </header>
      <p class="scenario-guide-intro">Choose a scenario to jump directly to its test state. This guide is not part of the customer experience.</p>
      <label class="scenario-search" for="scenario-search">
        <span class="visually-hidden">Search prototype scenarios</span>
        <span class="scenario-search-control">${icon('search')}<input id="scenario-search" type="search" placeholder="Search scenarios..." autocomplete="off" /></span>
      </label>
      <div class="scenario-list" aria-label="Prototype scenarios">
        ${scenarioListMarkup()}
        <p class="scenario-empty" role="status" hidden>No scenarios match your search.</p>
      </div>
    </section>`;
  scenarioGuideButton.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => dialogRoot.querySelector('.scenario-guide-popover')?.focus({ preventScroll: true }));
}

function launchPrototypeScenario(scenarioId, { updateUrl = true } = {}) {
  const scenario = prototypeScenarios.find((item) => item.id === scenarioId);
  if (!scenario) return false;
  clearTimeout(fundCheckTimer);
  clearTimeout(rpqTimer);
  clearTimeout(submissionTimer);
  const scenarioState = { ...scenario.state };
  if (scenario.requiresPolicySelection) {
    scenarioState.scenarioPolicyId = scenario.state.policyId;
    scenarioState.screen = 'policy';
    scenarioState.policyId = '';
    scenarioState.sourceId = '';
    scenarioState.additionalSourceIds = [];
    scenarioState.targetId = '';
    scenarioState.fundCheck = 'idle';
  }
  state = { ...initialState(), loggedIn: true, activeNav: 'Services', prototypeScenarioId: scenario.id, ...scenarioState };
  closeModal();
  if (updateUrl) setScenarioUrl(scenario.id);
  render();
  return true;
}

function accountSidebar() {
  return `
    <aside class="portal-sidebar">
      <section class="portal-profile-card">
        <span class="portal-avatar" aria-hidden="true">E</span>
        <h2>Welcome Elizabeth!</h2>
        <p>${icon('call')} +63 917 132 3456</p>
        <p>${icon('mail')} elizabethdelacruz@domain.com</p>
      </section>
      <section class="portal-toolkit" aria-labelledby="portal-toolkit-title">
        <h2 id="portal-toolkit-title">Toolkit</h2>
        ${['Policy Change and Payment Forms', 'Policy Fund Value Management', 'Policy Cancellation and Reinstatement', 'Policy Claim Forms'].map((item) => `<button type="button" data-action="toolkit-info">${item}${icon('arrow_forward')}</button>`).join('')}
      </section>
      <section class="portal-care-card" aria-labelledby="portal-care-title">
        <h2 id="portal-care-title">Customer Care</h2>
        <p>Need help? Feel free to contact us:</p>
        <span>${icon('language')} EastWest Ageas Insurance</span>
        <span>${icon('call')} (+632) 8939-3924</span>
        <span>${icon('mail')} AskMe@ewageas.com.ph</span>
      </section>
    </aside>`;
}

function loginView() {
  return `
    <section class="login-page" aria-labelledby="login-title">
      <div class="login-hero" aria-label="A happy couple enjoying time together"><span class="login-ring ring-one"></span><span class="login-ring ring-two"></span></div>
      <div class="login-panel">
        <form class="login-form" data-action="login-submit">
          <h1 id="login-title">Welcome to EWAOnline</h1>
          <p class="login-intro">${icon('info')} <span>No account yet? Click Sign Up to create an account. To view your policy, please login below.</span></p>
          <label>Username<input id="login-username" name="username" type="text" autocomplete="username" placeholder="Enter your username" value="${state.loginUsername}" /></label>
          <label>Password<span class="password-field"><input id="login-password" name="password" type="${state.passwordVisible ? 'text' : 'password'}" autocomplete="current-password" placeholder="Enter your password" value="${state.loginPassword}" /><button type="button" data-action="toggle-password" aria-label="${state.passwordVisible ? 'Hide' : 'Show'} password">${icon(state.passwordVisible ? 'visibility' : 'visibility_off')}</button></span></label>
          ${state.loginError ? `<p class="login-error" role="alert">${icon('error')} ${state.loginError}</p>` : ''}
          <button class="login-continue" type="submit">Continue</button>
          <p class="login-links">Don’t have an account? <button type="button" data-action="public-info">Sign up</button></p>
          <p class="login-links"><button type="button" data-action="public-info">Forgot password</button><span aria-hidden="true">|</span><button type="button" data-action="public-info">Forgot username</button></p>
          <div class="login-support"><p>Having trouble logging in?</p><span>${icon('mail')} AskMe@ewageas.com.ph</span><span>${icon('call')} +63 2 8939 3924</span></div>
          <footer><p>Copyright © 2026. East West Ageas Life Insurance Corporation.</p><p>Legal <span>·</span> Privacy <span>·</span> Security</p></footer>
        </form>
      </div>
    </section>`;
}

function requestNotice() {
  if (state.requestStatus !== 'Completed') return '';
  return `<section class="portal-request-notice complete" aria-labelledby="request-notice-title">
    <span class="portal-request-icon">${icon('check_circle')}</span>
    <div><span class="portal-notice-kicker">Fund Switch · ${state.requestNumber}</span><h2 id="request-notice-title">Your fund switch is complete</h2><p>For Elizabeth’s Policy. View the completion details in Policy Details.</p></div>
    <button class="btn btn-primary" type="button" data-action="view-updated-policy">View Policy Details</button>
  </section>`;
}

function dashboardPolicyCard({ product, id, status = 'Inforce', active = false }) {
  return `<article class="dashboard-policy-card">
    <header><div><h2>Elizabeth’s Policy ${icon('edit')}</h2><p>${product} #${id}</p></div>${statusTag(status)}</header>
    <div class="dashboard-policy-details"><span><small>Insured</small><strong>Elizabeth Garcia Dela Cruz</strong></span><span><small>Total Sum Insured ${icon('help')}</small><strong>PHP 1,125,000.00</strong></span><span><small>Due Date ${icon('help')}</small><strong>December 14, 2032</strong></span><span class="policy-downloads"><button type="button" data-action="toolkit-info">${icon('download')} Policy Pack</button><button type="button" data-action="toolkit-info">${icon('download')} Fund Transaction Notice</button></span></div>
  </article>`;
}

function dashboardSkeletonView() {
  const line = (width = '100%') => `<span class="skeleton-line" style="width:${width}"></span>`;
  const card = () => `<article class="dashboard-policy-card skeleton-card" aria-hidden="true">${line('34%')}${line('24%')}<div class="skeleton-detail-grid">${line()}${line()}${line()}${line()}</div></article>`;
  return `<section class="portal-layout dashboard-skeleton" aria-label="Loading dashboard" aria-busy="true">
    <aside class="portal-sidebar" aria-hidden="true">
      <section class="portal-profile-card skeleton-card"><span class="skeleton-avatar"></span>${line('58%')}${line('46%')}${line('70%')}</section>
      <section class="portal-toolkit skeleton-card">${line('32%')}${line()}${line()}${line()}${line()}</section>
      <section class="portal-care-card skeleton-card">${line('38%')}${line('72%')}${line('60%')}</section>
    </aside>
    <div class="portal-content dashboard-content" aria-hidden="true">
      <section class="financial-journey-banner skeleton-card">${line('48%')}</section>
      <section class="add-policy-card skeleton-card">${line('52%')}<span class="skeleton-button"></span></section>
      <div class="dashboard-policy-list">${card()}${card()}${card()}</div>
    </div>
  </section>`;
}

function dashboardView() {
  if (state.dashboardLoading) return dashboardSkeletonView();
  return `<section class="portal-layout" aria-labelledby="dashboard-title">
    ${accountSidebar()}
    <div class="portal-content dashboard-content">
      <section class="financial-journey-banner" aria-label="Welcome message">
        <img src="assets/dashboard-financial-journey-banner.svg" alt="" aria-hidden="true" />
        <p>We’re glad you chose EastWest Ageas Insurance<br />to be your partner on your financial journey.</p>
      </section>
      ${requestNotice()}
      <section class="add-policy-card"><h1 id="dashboard-title">Policy not showing? Add your policy easily here</h1><button class="btn add-policy-button" type="button" data-action="toolkit-info">${icon('add')} Add Policy</button></section>
      <div class="dashboard-policy-list">
        ${dashboardPolicyCard({ product: 'FUTURE ASSURE', id: '810000085627', status: 'Inforce', active: true })}
        ${dashboardPolicyCard({ product: 'DREAM BUILDER', id: '810000089312', status: 'Lapsed' })}
        ${dashboardPolicyCard({ product: 'FUTURE ASSURE MAX', id: '810000088405', status: 'Lapsed' })}
      </div>
    </div>
  </section>`;
}

function policyDetailsView() {
  const complete = state.requestStatus === 'Completed' && state.requestPolicyId === '810000085627';
  return `<section class="portal-layout" aria-labelledby="policy-details-title">
    ${accountSidebar()}
    <div class="portal-content policy-details-content">
      ${complete ? `<section class="policy-status-banner complete">${icon('check_circle')}<div><strong>Fund switch completed</strong><span>Completed September 3, 2026 · Request ${state.requestNumber}</span></div><button type="button" data-action="open-policy-requests">View request</button></section>` : ''}
      <header class="policy-details-heading"><div><h1 id="policy-details-title">Elizabeth’s Policy ${icon('expand_more')}</h1><p>FUTURE ASSURE <span>#810000085627</span></p></div></header>
      <section class="policy-summary-card"><div><span>Total Sum Insured ${icon('help')}</span><strong>PHP 1,950,000.00</strong></div><div><span>Basic Sum Insured ${icon('help')}</span><strong>PHP 1,950,000.00</strong></div><div><span>Portfolio Value</span><strong>PHP 350,000.00</strong></div><dl><div><dt>Policy Number</dt><dd>810000085627</dd></div><div><dt>Life Insured ${icon('help')}</dt><dd>Elizabeth Garcia Dela Cruz</dd></div><div><dt>Years Payable ${icon('help')}</dt><dd>Pay up to 100 years old</dd></div><div><dt>Coverage Period ${icon('help')}</dt><dd>74 years</dd></div><div><dt>Coverage End Date ${icon('help')}</dt><dd>October 18, 2100</dd></div></dl></section>
      <section class="policy-section-card"><header><h2>Riders ${icon('help')}</h2></header>${['Accidental Death Rider', 'Accidental Disablement Rider'].map((name) => `<article class="rider-row"><div><h3>${name}</h3><span class="rider-status">LAPSED</span></div><dl><div><dt>Benefit Amount ${icon('help')}</dt><dd>1,950,000.00</dd></div><div><dt>Years Payable ${icon('help')}</dt><dd>Pay up to 65 years old</dd></div><div><dt>Coverage Period ${icon('help')}</dt><dd>39 years</dd></div><div><dt>Coverage End Date ${icon('help')}</dt><dd>October 18, 2065</dd></div></dl></article>`).join('')}</section>
      <section class="policy-section-card beneficiaries-card"><header><h2>Beneficiaries ${icon('help')}</h2></header><article><span class="beneficiary-avatar">E</span><span><strong>Elizabeth Garcia Dela Cruz</strong><small>PRIMARY - SELF</small></span><strong>100.00%</strong></article></section>
    </div>
  </section>`;
}

function openOnboardingModal() {
  dialogRoot.innerHTML = `<div class="modal-backdrop onboarding-backdrop"><section class="onboarding-modal" role="dialog" aria-modal="true" aria-labelledby="onboarding-title" tabindex="-1"><img src="assets/figma-fund-switch-onboarding.png" alt="" /><h2 id="onboarding-title">Introducing Fund Switch</h2><p>A simpler way to move your investment<br />to another fund that fits your goals.</p><footer><button class="btn btn-tertiary" type="button" data-action="skip-onboarding">Skip</button><button class="btn btn-primary" type="button" data-action="explore-fund-switch">See What’s New</button></footer></section></div>`;
  state.onboardingSeen = true;
  requestAnimationFrame(() => dialogRoot.querySelector('.onboarding-modal')?.focus({ preventScroll: true }));
}

function steps(active) {
  const labels = ['Select Policy', 'Switch Your Fund', 'Review & Submit'];
  const completed = Math.max(0, active - 1);
  return `
    <aside class="stepper" aria-label="Fund Switch progress">
      <div class="step-progress">
        <div class="step-progress-label"><span>Steps Completed</span><span>${completed}/3</span></div>
        <div class="progress-track" role="progressbar" aria-label="Steps completed" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${completed}"><span style="width:${completed / 3 * 100}%"></span></div>
      </div>
      <div class="stepper-body">
        <h2>Fund Switch</h2>
        <ol class="step-list">
          ${labels.map((label, index) => {
            const n = index + 1;
            const status = n < active ? 'complete' : n === active ? 'current' : 'upcoming';
            const indicator = status === 'complete'
              ? `<span class="step-dot complete-icon">${icon('check_circle')}</span>`
              : `<span class="step-dot ${status}">${status === 'current' ? `<span class="step-halo">${icon('circle')}</span>` : ''}<span class="step-base">${icon('circle')}</span><span class="step-number">${n}</span></span>`;
            return `<li class="step-item ${status}" ${n === active ? 'aria-current="step"' : ''}>${indicator}<span class="step-label">${label}</span></li>`;
          }).join('')}
        </ol>
      </div>
    </aside>`;
}

function serviceCard({ iconName, title, copy, action, featured = false, label = 'Click to start request' }) {
  return `
    <article class="service-card ${featured ? 'featured' : ''}" role="button" tabindex="0" data-service="${action}" aria-label="${title}: ${label}">
      <div><h2>${icon(iconName)}${title}</h2><p>${copy}</p></div>
      <span class="service-card-action" aria-hidden="true">${label}${icon('keyboard_arrow_right')}</span>
    </article>`;
}

function servicesView() {
  const requestPolicy = policies.find((policy) => policy.id === state.requestPolicyId);
  const requestContent = state.requestStatus ? `
    <button class="request-policy-row" type="button" data-action="open-policy-requests" aria-label="View requests for policy ${requestPolicy?.id || ''}">
      <span><strong>Policy Number</strong><small>${requestPolicy?.id || ''}</small></span>${icon('keyboard_arrow_right')}
    </button>` : `<p class="empty-state">${icon('inventory_2')}<span>No requests yet. To submit a request, choose a service above and complete the required steps.</span></p>`;
  return `
    <section class="services-panel" aria-labelledby="page-title">
      <header class="intro"><h1 id="page-title">Manage your policy online</h1><p>Submit requests, update your details, and track progress in one place.</p></header>
      <div class="service-grid">
        ${serviceCard({ iconName: 'restart_alt', title: 'Reinstatement', copy: 'Restore your lapsed policy by submitting a reinstatement request and completing the required steps online.', action: 'Reinstatement' })}
        ${serviceCard({ iconName: 'person_edit', title: 'Change of Beneficiary', copy: 'Update your policy beneficiary details online by submitting a change in beneficiary request.', action: 'Change of Beneficiary' })}
        ${serviceCard({ iconName: 'swap_horiz', title: 'Fund Switch', copy: 'Move your investment between available funds to better match your financial goals and risk preference.', action: 'Fund Switch', featured: true })}
        ${serviceCard({ iconName: 'list_alt', title: 'Other Services', copy: 'More self-service requests will be available soon. Check back for future updates.', action: 'Other Services', label: 'Click here to view more' })}
      </div>
      <section class="requests" aria-labelledby="requests-title">
        <header><h2 id="requests-title">MY REQUESTS</h2></header>
        ${requestContent}
      </section>
    </section>`;
}

function investmentView() {
  const periods = ['6 Months', '1 Year', '3 Years', '5 Years', 'Date Range'];
  const profileDescription = 'You would like to make your investment earn more than the deposit products and would be open to some medium-term market fluctuations to achieve this. You do not have an immediate need for your invested money. You are not ready to commit a large percentage of your money to heavy market value fluctuations as with equities or shares of stocks of public companies.';
  const policyCard = (policy) => {
    const expanded = state.investmentExpandedPolicyId === policy.id;
    return `<article class="investment-policy-card ${expanded ? 'expanded' : ''}">
      <header><div><h2>${policy.title}</h2><p>${policy.product} <span>#${policy.id}</span></p></div><div class="investment-policy-actions"><button class="text-action" type="button" data-action="toggle-policy-breakdown" data-policy-id="${policy.id}" aria-expanded="${expanded}">${expanded ? 'Hide' : 'Show'} Fund Breakdown ${icon(expanded ? 'expand_less' : 'expand_more')}</button></div></header>
      <div class="policy-overview"><div><span>Income Payout Option ${icon('help')}</span><strong>${policy.payout}</strong><small>AS OF ${policy.asOf.toUpperCase()}</small></div><div><span>Fund Value ${icon('help')}</span><strong>${money(policy.value, policy.currency || 'PHP')}</strong></div></div>
      ${expanded ? `<div class="investment-breakdown" role="table" aria-label="${policy.title} fund breakdown"><div class="investment-fund-table-head" role="row"><span role="columnheader">Fund Name ${icon('help')} ${icon('north')}</span><span role="columnheader">NAVPU ${icon('help')}</span><span role="columnheader">Units ${icon('help')}</span><span role="columnheader">Allocation ${icon('help')}</span><span role="columnheader">Fund Value ${icon('help')}</span><span role="columnheader" class="visually-hidden">Action</span></div>${policy.funds.map((fund) => `<div class="investment-fund-table-row ${fund.accent}" role="row"><span role="cell" class="investment-held-fund">${fund.name}</span><span role="cell" data-label="NAVPU">${fund.navpu}</span><span role="cell" data-label="Units">${fund.units}</span><span role="cell" data-label="Allocation">${fund.allocation}</span><span role="cell" data-label="Fund Value" class="investment-fund-value"><strong>${money(fund.value, policy.currency || 'PHP')}</strong></span><span role="cell" class="investment-fund-action"><button class="fund-switch-action" type="button" data-action="start-policy-fund-switch" data-policy-id="${policy.id}" data-source-id="${fund.id}">Switch Fund</button></span></div>`).join('')}</div>` : ''}
    </article>`;
  };
  return `
    <section class="investments-layout" aria-labelledby="investments-title">
      <aside class="investments-sidebar">
        <section class="investor-card">
          <div class="investor-avatar" aria-hidden="true">E</div>
          <h2>Welcome Elizabeth!</h2>
          <p>${icon('call')} +63 908 655 5256</p>
          <p>${icon('mail')} elizabeth.garcia@email.com</p>
        </section>
        <section class="investment-toolkit" aria-labelledby="toolkit-title">
          <h2 id="toolkit-title">Toolkit</h2>
          ${['Policy Change and Payment Forms', 'Policy Fund Value Management', 'Policy Cancellation and Reinstatement', 'Policy Claim Forms'].map((item) => `<button type="button" data-action="toolkit-info">${item}${icon('keyboard_arrow_right')}</button>`).join('')}
        </section>
        <section class="sidebar-risk-profile" aria-labelledby="sidebar-risk-title"><h2 id="sidebar-risk-title">Risk Profile</h2><p><span class="risk-dot" aria-hidden="true"></span><strong>Moderate</strong><button type="button" data-action="risk-profile-info">Learn more</button></p></section>
        <section class="care-card" aria-labelledby="care-title"><h2 id="care-title">Customer Care</h2><p>Need help? Feel free to contact us:</p><span>${icon('call')} +63 2 8939 3924</span><span>${icon('mail')} AskMe@ewageas.com.ph</span></section>
      </aside>
      <div class="investments-content">
        <section class="investment-policy-section" aria-labelledby="investments-title">
          <h1 id="investments-title">My Investment Policies</h1>
          <div class="investment-policy-list">${investmentPolicies.map(policyCard).join('')}</div>
        </section>
        <section class="investment-risk-profile" aria-labelledby="investment-risk-title"><h2 id="investment-risk-title">Risk Profile</h2><p class="risk-level"><span class="risk-dot" aria-hidden="true"></span><strong>Moderate</strong></p><p class="risk-description">${profileDescription}</p></section>
        <section class="available-funds-section" aria-labelledby="available-funds-title">
          <header class="available-funds-header"><h2 id="available-funds-title">Available Funds</h2><div class="period-tabs" role="tablist" aria-label="Fund performance period">${periods.map((period) => `<button type="button" data-period="${period}" class="${state.investmentPeriod === period ? 'active' : ''}" role="tab" aria-selected="${state.investmentPeriod === period}">${period}</button>`).join('')}</div></header>
          <div class="investment-fund-grid">${investmentFunds.map((fund) => `<article class="investment-fund-card"><h3>${fund.name}</h3><p><strong>${fund.value}</strong><span class="fund-change ${fund.tone}">${fund.change} ${icon(fund.tone === 'down' ? 'south' : 'north')}</span></p><canvas class="fund-performance-chart" data-chart="${fund.chart}" aria-label="${fund.name} performance chart"></canvas></article>`).join('')}</div>
        </section>
      </div>
    </section>`;
}

function requestsView() {
  const policy = policies.find((item) => item.id === state.requestPolicyId) || policies[0];
  const isDraft = state.requestStatus === 'Draft';
  const expanded = !isDraft && state.requestExpanded;
  const isComplete = state.requestStatus === 'Completed';
  return `
    <section class="policy-requests-panel" aria-labelledby="policy-requests-title">
      <header class="policy-requests-header">
        <h1 id="policy-requests-title">Requests for Policy <span>#${policy.id}</span></h1>
        <p>See all service requests linked to this policy. You can check progress, review details, or continue ongoing requests.</p>
      </header>
      <div class="policy-requests-body">
        <div class="request-date">As of September 3, 2026</div>
        <article class="request-card ${expanded ? 'expanded' : ''}">
          <button class="request-card-toggle" type="button" data-action="${isDraft ? 'resume-request' : 'toggle-request-details'}" ${isDraft ? '' : `aria-expanded="${expanded}"`}>
            <span class="request-card-copy"><span class="request-card-title">Fund Switch Request ${statusTag(state.requestStatus)}</span><small>${policy.product} #${policy.id}</small></span>
            ${icon(isDraft ? 'keyboard_arrow_right' : expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down')}
          </button>
          ${expanded ? `<div class="request-progress" aria-label="Fund switch request progress">
            <div class="request-progress-step complete"><span class="request-progress-indicator">${icon('check_circle')}</span><span><strong>Submitted</strong><small>Your fund switch request was received.</small></span></div>
            <div class="request-progress-step ${isComplete ? 'complete' : 'upcoming'}"><span class="request-progress-indicator">${icon(isComplete ? 'check_circle' : 'circle')}</span><span><strong>In Progress</strong>${isComplete ? '<small>Your request passed validation and was processed.</small>' : ''}</span></div>
            <div class="request-progress-step ${isComplete ? 'complete' : 'upcoming'}"><span class="request-progress-indicator">${icon(isComplete ? 'check_circle' : 'circle')}</span><span><strong>Completed</strong>${isComplete ? '<small>Your policy allocation has been updated successfully.</small>' : ''}</span></div>
          </div>` : ''}
        </article>
      </div>
      <footer class="policy-requests-footer"><button class="btn btn-tertiary" type="button" data-action="back-services">Back</button></footer>
    </section>`;
}

function loadingIndicator(label) {
  return `<span class="button-loading"><img src="assets/button-loading.svg" alt="" /><span class="visually-hidden">${label}</span></span>`;
}

function flowLayout({ active, title, description, body, backAction, nextAction, nextLabel = 'Next', nextDisabled = false, nextBusy = false, extraFooter = '', focusMode = false, headerExtra = '', allowOverflow = false }) {
  const saveDraft = state.policyId && active >= 1 ? '<button class="btn btn-secondary btn-draft" type="button" data-action="save-draft">Save as Draft</button>' : '';
  return `
    <section class="flow-shell ${focusMode ? 'focus-mode' : ''}">
      ${focusMode ? '' : steps(active)}
      <section class="flow-panel ${allowOverflow ? 'allow-overflow' : ''}" aria-labelledby="flow-title">
        <header class="flow-header">${headerExtra}<h1 id="flow-title">${title}</h1><p>${description}</p></header>
        <div class="flow-body">${body}</div>
        <footer class="flow-footer">
          <button class="btn btn-tertiary" type="button" data-action="${backAction}">Back</button>
          <div class="footer-actions">${extraFooter}${saveDraft}<button class="btn btn-primary ${nextBusy ? 'is-loading' : ''}" type="button" data-action="${nextAction}" ${nextDisabled ? 'disabled' : ''} ${nextBusy ? 'aria-busy="true"' : ''}>${nextLabel}</button></div>
        </footer>
      </section>
    </section>`;
}

function policyOption(policy) {
  const pending = hasPendingRequest(policy);
  if (pending) {
    return `
      <button class="policy-option pending-policy" type="button" data-action="pending-policy-info" data-policy-id="${policy.id}" aria-label="${policy.owner}, ${policy.status}, ${policy.product}, policy ${policy.id}. Fund switch request pending">
        <span class="policy-card">
          <span class="policy-card-head"><span class="policy-name">${policy.owner}</span><span class="policy-badges">${statusTag(policy.status)}</span></span>
          <span class="policy-meta">${policy.product} #${policy.id}</span>
        </span>
      </button>`;
  }
  const selectable = policy.selectable !== false && !pending;
  const notEligible = !policy.fundSwitchEligible;
  return `
    <label class="policy-option ${notEligible ? 'ineligible' : ''} ${selectable ? '' : 'disabled'}">
      <input type="radio" name="policy" value="${policy.id}" ${state.policyId === policy.id ? 'checked' : ''} ${selectable ? '' : 'disabled'} />
      <span class="policy-card">
        <span class="policy-card-head"><span class="policy-name">${policy.owner}</span><span class="policy-badges">${statusTag(policy.status)}${pending ? statusTag('Request pending') : ''}</span></span>
        <span class="policy-meta">${policy.product} #${policy.id}</span>
      </span>
    </label>`;
}

function policyView() {
  const mainPolicyIds = ['810000085627', '810000086143', '810000087920', '810000088405'];
  let visiblePolicies = policies.filter((policy) => mainPolicyIds.includes(policy.id));
  if (state.scenarioPolicyId) visiblePolicies = policies.filter((policy) => policy.id === state.scenarioPolicyId);
  const availablePolicies = visiblePolicies.filter((policy) => policy.selectable !== false || policy.pendingRequest);
  const otherPolicies = visiblePolicies.filter((policy) => policy.selectable === false && !policy.pendingRequest);
  const body = `
    <div class="policy-list">
      ${availablePolicies.map(policyOption).join('')}
      ${otherPolicies.length ? `<p class="policy-group-title">Other Policies</p>${otherPolicies.map(policyOption).join('')}` : ''}
    </div>`;
  return flowLayout({ active: 1, title: 'Select Policy', description: 'Choose the policy you want to make fund switch for.', body, backAction: 'back-services', nextAction: 'to-funds', nextDisabled: !state.policyId });
}

function vulExploreView() {
  const requested = state.vulConsultationRequested;
  return `
    <section class="services-panel vul-explore" aria-labelledby="vul-title">
      <header class="vul-explore-hero">
        <span class="vul-explore-icon">${icon('trending_up')}</span>
        <div><p class="eyebrow">Investment-linked policies</p><h1 id="vul-title">Explore investment-linked policies</h1><p>Investment-linked policies can combine life protection with access to professionally managed investment funds.</p></div>
      </header>
      <div class="vul-explore-grid">
        <article><h2>Understand the option</h2><p>Learn how investment-linked policies work, including investment risk, policy charges, and the difference from a traditional protection-only policy.</p></article>
        <article><h2>Get tailored guidance</h2><p>A financial advisor can discuss whether an investment-linked policy may suit your goals, needs, and risk appetite.</p></article>
      </div>
      <div class="section-message ${requested ? 'section-message-success' : ''}">${icon(requested ? 'check_circle' : 'info')}<div><strong>${requested ? 'Consultation request recorded in this prototype' : 'No application has been started'}</strong><span>${requested ? 'A production journey would confirm the preferred contact details and obtain consent before an advisor follows up.' : 'Exploring this option does not change your policy or begin an application.'}</span></div></div>
      <footer class="vul-explore-actions"><button class="btn btn-tertiary" type="button" data-action="back-to-policy-selection">Choose another policy</button><button class="btn btn-primary" type="button" data-action="request-vul-consultation" ${requested ? 'disabled' : ''}>${requested ? 'Consultation requested' : 'Talk to a financial advisor'}</button></footer>
    </section>`;
}

function fundOptions(kind) {
  const otherId = kind === 'source' ? state.targetId : state.sourceId;
  const eligibleFunds = kind === 'source' ? policyFunds() : availablePolicyFunds();
  return eligibleFunds
    .filter((fund) => fund.id !== otherId && !(state.additionalSourceIds || []).includes(fund.id) && (kind === 'source' ? fund.value > 0 : true))
    .map((fund) => ({ value: fund.id, label: fund.name }));
}

function additionalSourceOptions() {
  return policyFunds()
    .filter((fund) => fund.value > 0 && fund.id !== state.targetId && fund.id !== state.sourceId && !(state.additionalSourceIds || []).includes(fund.id))
    .map((fund) => ({ value: fund.id, label: `${fund.name} — ${switchableAllocation(fund)}%` }));
}

function incomePayingPanel() {
  if (!requiresFullAllocationSwitch()) return '';
  const allocation = selectedSourceAllocation();
  const available = maximumSelectableAllocation();
  if (!canReachFullAllocation()) {
    return `<section class="income-allocation-blocked section-message section-message-warning" role="alert" aria-labelledby="income-paying-blocked-title">
      ${icon('warning')}
      <div><strong id="income-paying-blocked-title">Full switch unavailable</strong><span>Only ${available}% of this policy is eligible to switch. An Income Paying Fund requires all 100% to move together, so this request cannot continue online.</span><button class="link-button" type="button" data-action="choose-different-target">Choose another target</button></div>
    </section>`;
  }
  return sectionMessage({ type: 'success', iconName: 'check_circle', title: 'Your Eligible Funds Will Switch Together', text: `${allocation}% of your eligible policy allocation will move to ${selectedTarget().name}.`, className: 'income-paying-message' });
}

function incomeSourceNotice() {
  if (selectedSource()?.id !== 'dollar-income' || requiresFullAllocationSwitch()) return '';
  return sectionMessage({ type: 'info', iconName: 'info', title: 'Switching out of an Income Paying Fund', text: 'The full 100% holding can move to one target fund. Splitting it across multiple target funds is not available online.', className: 'income-source-notice' });
}

function sourceCard() {
  const source = selectedSource();
  const belowMinimum = source && !meetsMinimumSwitch();
  const minimum = minimumSwitchAmount();
  return `
    <section class="fund-card">
      <div class="fund-step-heading">
        <span class="fund-step-number" aria-hidden="true">1</span>
        <span><strong>Choose fund to switch from</strong><small>Select the fund you want to move money from.</small></span>
      </div>
      <div class="fund-card-copy"><div class="eyebrow">SWITCH FROM</div><h2>${source ? source.name : 'Select a source fund'}</h2>
      ${source ? `<p>Current allocation: ${source.allocation}%</p><div class="fund-value">${money(source.value)}</div><p>Current fund value</p>` : '<p>Choose where your current fund will be switched from.</p>'}</div>
      ${selectField({ id: 'source-fund', label: 'Source fund', value: state.sourceId, placeholder: 'Choose a fund', options: fundOptions('source') })}
      ${belowMinimum ? `<div class="fund-card-action"><div class="field-error" role="alert">${icon('error')}<span>This fund is below the ${money(minimum)} minimum switch amount.</span></div></div>` : ''}
    </section>`;
}

function targetCard() {
  const target = selectedTarget();
  const disabled = !state.sourceId || !meetsMinimumSwitch();
  return `
    <section class="fund-card ${disabled ? 'disabled' : ''}">
      <div class="fund-step-heading">
        <span class="fund-step-number" aria-hidden="true">2</span>
        <span><strong>Choose destination fund</strong><small>Select the fund you want to move your money to.</small></span>
      </div>
      <div class="fund-card-copy"><div class="eyebrow">SWITCH TO</div><h2>${target ? target.name : 'Select a target fund'}</h2>
      ${target ? `<p class="fund-risk-row">${fundRiskTag(target)}</p><div class="fund-value">${money(target.value)}</div><p>Current fund value</p>` : '<p>Choose where your current fund will be switched.</p>'}</div>
      ${selectField({ id: 'target-fund', label: 'Target fund', value: state.targetId, placeholder: 'Choose a fund', options: fundOptions('target'), disabled })}
      ${requiresSupportingDocuments() ? documentDownloadsPanel() : ''}
    </section>`;
}

function currentPortfolio() {
  const policy = selectedPolicy();
  const currentFunds = policyFunds();
  const total = currentFunds.reduce((sum, fund) => sum + fund.value, 0);
  return `
    <details class="investment-policy-card flow-portfolio-card">
      <summary class="flow-portfolio-summary">
        <span><strong>Elizabeth's Policy</strong><small>${policy.product} <span>#${policy.id}</span></small></span>
        <span class="portfolio-toggle"><span class="visually-hidden">Show or hide fund breakdown</span>${icon('expand_more')}</span>
      </summary>
      <div class="policy-overview flow-policy-overview"><div><span>Fund Value ${icon('help')}</span><strong>${money(total, policy.currency)}</strong></div></div>
      <div class="investment-breakdown flow-investment-breakdown" role="table" aria-label="Current fund holdings">
        <div class="investment-fund-table-head" role="row"><span role="columnheader">Fund Name ${icon('help')} ${icon('north')}</span><span role="columnheader">NAVPU ${icon('help')}</span><span role="columnheader">Units ${icon('help')}</span><span role="columnheader">Allocation ${icon('help')}</span><span role="columnheader">Fund Value ${icon('help')}</span></div>
        ${currentFunds.map((fund) => `<div class="investment-fund-table-row ${fund.accent}" role="row"><span role="cell" class="investment-held-fund">${fund.name}</span><span role="cell" data-label="NAVPU">${fund.navpu}</span><span role="cell" data-label="Units">${fund.units}</span><span role="cell" data-label="Allocation">${fund.allocation}%</span><span role="cell" data-label="Fund Value" class="investment-fund-value"><strong>${money(fund.value, policy.currency)}</strong></span></div>`).join('')}
      </div>
    </details>`;
}

function sizePortfolioOverlay() {
  const portfolio = app.querySelector('.flow-portfolio-card[open]');
  if (!portfolio) return;
  const panel = portfolio.querySelector('.flow-investment-breakdown');
  const footerTop = app.querySelector('.flow-footer')?.getBoundingClientRect().top ?? window.innerHeight;
  const available = Math.max(64, footerTop - panel.getBoundingClientRect().top - 8);
  panel.style.maxHeight = `${Math.min(window.innerWidth <= 760 ? 303 : 330, available)}px`;
}

function riskTriggerBanner() {
  if (!requiresRiskAssessment() || state.fundCheck === 'checking') return '';
  if (state.waiverAccepted) return '';
  if (state.ipsAccepted) return '';
  if (state.rpqComplete && !resultAligned()) {
    return sectionMessage({ type: 'warning', iconName: 'warning', title: 'Selected fund is not aligned', text: `${selectedTarget().name} has a higher risk level than your ${state.rpqResult} result. Review your answers or choose another fund.`, className: 'flow-message' });
  }
  return sectionMessage({ type: 'warning', iconName: 'warning', title: 'Risk profile update required', text: `${selectedTarget().name} (${selectedTarget().risk}) is more aggressive than ${selectedSource().name} (${selectedSource().risk}). Complete the RPQ and review your IPS before continuing.`, className: 'flow-message' });
}

function riskRequirementsPanel() {
  if (!requiresRiskAssessment() || state.fundCheck === 'checking') return '';
  const rpqDone = state.rpqComplete;
  const ipsDone = state.ipsAccepted;
  const higherRiskChoice = rpqDone && !resultAligned();
  const allDone = rpqDone && (ipsDone || state.waiverAccepted);
  return `
    <section class="requirements-card requirements-picker ${allDone ? 'complete-picker' : ''}" aria-label="${allDone ? 'Completed suitability checks' : 'Required suitability checks'}">
      <div class="requirements-grid">
        <article class="requirement-item ${rpqDone ? 'complete' : ''}">
          <div class="requirement-status"><span>${rpqDone ? 'Completed' : 'Required'}</span></div>
          <h3>Risk Profile Questionnaire</h3>
          <p>Assess your current investment profile for the selected target fund.</p>
          <button class="btn btn-secondary" type="button" data-action="${rpqDone ? 'to-assessment' : 'to-rpq'}">${rpqDone ? (allDone ? 'View Result' : 'Review result') : 'Start Questionnaire'}</button>
        </article>
        ${higherRiskChoice ? '' : `
        <article class="requirement-item ${ipsDone ? 'complete' : ''} ${rpqDone ? '' : 'locked'}">
          <div class="requirement-status"><span>${ipsDone ? 'Completed' : 'Required'}</span></div>
          <h3>Investment Policy Statement</h3>
          <p>Review and acknowledge the investment policy information associated with your target fund.</p>
          <button class="btn btn-secondary" type="button" data-action="to-assessment" ${rpqDone ? '' : 'disabled'}>${ipsDone ? 'Review completed IPS' : 'Review IPS'}</button>
        </article>`}
      </div>
    </section>`;
}

function switchSummary(forReview = false) {
  if (!forReview && (!state.sourceId || !state.targetId || !meetsMinimumSwitch() || !fullAllocationReady())) return '';
  const sources = selectedSources();
  const allocation = selectedSourceAllocation();
  return `
    <section class="switch-summary" aria-labelledby="switch-summary-title">
      ${requiresFullAllocationSwitch() ? incomePayingPanel() : ''}
      <h2 id="switch-summary-title">Fund Switch Summary</h2>
      <p class="summary-intro">Please review your switch details.</p>
      <table class="summary-comparison-table">
        <thead><tr><th scope="col"><strong>From</strong><span>Current Funds · ${allocation}%</span></th><th scope="col"><strong>To</strong><span>Target Fund · 100%</span></th></tr></thead>
        <tbody>${sources.map((source, index) => `<tr><td>${source.name} (${switchableAllocation(source)}%)</td>${index === 0 ? `<td rowspan="${sources.length}">${selectedTarget().name} (100%)</td>` : ''}</tr>`).join('')}</tbody>
      </table>
      <div class="summary-amount"><span>Total Amount to Switch</span><strong>${money(switchAmount())}</strong></div>
    </section>`;
}

const documentDefinitions = {
  rpq: { label: 'Risk Profile Questionnaire (RPQ)', file: 'output/pdf/risk-profile-questionnaire-20250411.pdf' },
  ips: { label: 'Investment Policy Statement (IPS)', file: 'output/pdf/investment-policy-statement-20250401.pdf' },
};

function documentDownloadsPanel() {
  return `<section class="document-downloads" aria-labelledby="document-downloads-title">
    <h2 id="document-downloads-title">Download forms</h2>
    <p>Download and complete the RPQ and IPS. You’ll upload both on the next screen.</p>
    <div class="document-download-list">${Object.entries(documentDefinitions).map(([kind, document]) => `
      <div class="document-download-row"><span class="document-file-icon">${icon('picture_as_pdf')}</span><span><strong>${document.label}</strong><small>PDF</small></span><a class="document-download-action" href="${document.file}" download aria-label="Download ${document.label}" title="Download ${document.label}">${icon('download')}</a></div>`).join('')}</div>
  </section>`;
}

function uploadDocumentCard(kind, document) {
  const upload = state.documentUploads[kind];
  const uploaded = upload.status === 'uploaded';
  const selected = upload.status === 'selected';
  const uploading = upload.status === 'uploading';
  return `<section class="document-upload-card ${uploaded ? 'is-uploaded' : ''}" aria-labelledby="upload-${kind}-title">
    <h2 id="upload-${kind}-title">${document.label}</h2>
    <input class="visually-hidden document-file-input" type="file" id="upload-${kind}" data-document-kind="${kind}" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" aria-label="Select ${document.label} file" />
    <div class="document-upload-box" role="status">
      <span class="document-upload-icon">${icon(uploaded ? 'check_circle' : 'draft')}</span>
      <span class="document-upload-info">${selected || uploading || uploaded ? `<strong>${escapeHtml(upload.name)}</strong>` : '<span>JPG, PDF or PNG (Maximum of 5MB)</span>'}${uploading ? '<small>Uploading…</small>' : uploaded ? '<small>File uploaded</small>' : ''}</span>
      ${selected ? `<button class="icon-button" type="button" data-action="remove-upload" data-document-kind="${kind}" aria-label="Remove selected ${document.label}">${icon('delete')}</button>` : ''}
      ${uploading ? '<span class="document-upload-spinner" aria-hidden="true"></span>' : ''}
      ${!uploading ? `<button class="document-upload-button" type="button" data-action="${selected ? 'confirm-upload' : 'select-upload'}" data-document-kind="${kind}" aria-label="${uploaded ? `Replace ${document.label}` : selected ? `Upload ${document.label}` : `Select ${document.label} file`}">${icon(selected ? 'upload' : 'upload')}${uploaded ? 'Replace File' : selected ? 'Upload' : 'Select File'}</button>` : ''}
    </div>
    ${uploading ? '<div class="document-upload-progress"><span></span></div>' : ''}
  </section>`;
}

function documentsView() {
  const body = `<div class="documents-content">
    <section class="document-upload-section" aria-label="Required document uploads">
    <div class="document-upload-list">${Object.entries(documentDefinitions).map(([kind, document]) => uploadDocumentCard(kind, document)).join('')}</div></section>
    ${state.documentError ? `<p class="document-upload-error" role="alert">${escapeHtml(state.documentError)}</p>` : ''}</div>`;
  return flowLayout({ active: 2, title: 'Upload Documents', description: 'Upload the completed RPQ and IPS before continuing.', body, backAction: 'back-funds', nextAction: 'to-review', nextDisabled: !documentsUploaded(), focusMode: true, headerExtra: '<nav class="flow-breadcrumb" aria-label="Breadcrumb"><span>Fund Switch</span><span aria-hidden="true">/</span><span>Switch Your Fund</span><span aria-hidden="true">/</span><strong aria-current="page">Upload Documents</strong></nav>' });
}

function fundsView() {
  const requirements = sectionMessage({ type: 'info', iconName: 'info', title: 'Fund Switch Requirements', text: 'Move all selected funds to one fund in the same currency. No partial switches or reallocations. Minimum: ₱10,000 or US$500.', className: 'fund-requirements-banner' });
  const incomeBlockedNotice = requiresFullAllocationSwitch() && !canReachFullAllocation() ? incomePayingPanel() : '';
  const body = `${requirements}${currentPortfolio()}<div class="switch-grid">${sourceCard()}<div class="switch-arrow" aria-hidden="true">${sharpIcon('arrow_forward')}</div>${targetCard()}</div>${incomeBlockedNotice}${incomeSourceNotice()}${switchSummary()}`;
  const ready = state.sourceId && state.targetId && meetsMinimumSwitch() && fullAllocationReady();
  return flowLayout({
    active: 2,
    title: 'Switch your fund',
    description: 'Choose the fund you want to switch from and the fund you want to switch to.',
    body,
    backAction: 'back-policy',
    nextAction: 'continue-fund-switch',
    nextLabel: 'Next',
    nextDisabled: !ready,
    allowOverflow: true,
  });
}

function rpqView() {
  const answered = Object.keys(state.rpqAnswers).length;
  const body = `
    <div class="rpq-list">
      ${rpqQuestions.map((item) => `
        <fieldset class="question-card">
          <legend>${item.question}</legend>
          <div class="question-options">
            ${item.options.map((option, optionIndex) => `
              <label class="question-option">
                <input type="radio" name="rpq-${item.id}" value="${optionIndex + 1}" ${state.rpqAnswers[item.id] === String(optionIndex + 1) ? 'checked' : ''}/>
                <strong aria-hidden="true">${String.fromCharCode(65 + optionIndex)}</strong><span>${option}</span>
              </label>`).join('')}
          </div>
        </fieldset>`).join('')}
    </div>`;
  return flowLayout({
    active: 2,
    title: 'Risk Profile Questionnaire',
    description: `Complete the questionnaire before switching to ${selectedTarget().name}.`,
    body,
    backAction: 'back-funds',
    nextAction: 'complete-rpq',
    nextLabel: state.rpqSubmitting ? loadingIndicator('Processing your answers') : 'Next',
    nextDisabled: answered !== rpqQuestions.length || state.rpqSubmitting,
    nextBusy: state.rpqSubmitting,
    focusMode: true,
    headerExtra: '<nav class="flow-breadcrumb" aria-label="Breadcrumb"><span>Fund Switch</span><span aria-hidden="true">/</span><span>Suitability check</span><span aria-hidden="true">/</span><strong aria-current="page">Questionnaire</strong></nav>',
  });
}

function assessmentView() {
  const aligned = resultAligned();
  const target = selectedTarget();
  const profile = state.rpqResult;
  const investmentObjective = ({ '1': 'Capital Preservation', '2': 'Balanced Income and Growth', '3': 'Long-term Capital Growth' })[state.rpqAnswers.objective] || 'Long-term Capital Growth';
  const illustration = profile === 'Aggressive' ? 'assets/risk-result-aggressive.svg' : 'assets/risk-result-conservative-figma.svg';
  return `
    <section class="assessment-page" aria-labelledby="assessment-title">
      <div class="assessment-page-content">
        <header class="assessment-page-header">
          <h1 id="assessment-title">Risk Profile Result</h1>
          <img src="${illustration}" alt="" class="assessment-page-illustration" />
          <h2>${profile}</h2>
          <p>${riskResultCopy(profile)}</p>
        </header>
        <section class="assessment-summary" aria-labelledby="assessment-summary-title">
          <h2 id="assessment-summary-title">Summary</h2>
          <dl>
            <div><dt>Risk Profile</dt><dd>${profile}</dd></div>
            <div><dt>Investment Objective</dt><dd>${investmentObjective}</dd></div>
            <div><dt>Target Fund</dt><dd>${target.name}</dd></div>
            <div><dt>Suitability</dt><dd><span class="alignment-status ${aligned ? '' : 'not-aligned'}">${aligned ? 'Aligned' : 'Not aligned'}</span></dd></div>
          </dl>
        </section>
        <div class="assessment-page-bottom">
          ${aligned
            ? sectionMessage({ type: 'warning', iconName: 'warning', text: `${profile === 'Aggressive' ? 'An' : 'A'} ${profile.toLowerCase()} investment profile may experience significant fluctuations and potential capital losses.`, className: 'assessment-page-warning' })
            : sectionMessage({ type: 'warning', iconName: 'warning', title: 'Your target fund has a higher risk level', text: `${target.name} is above your ${profile} risk profile. A lower-risk fund is the recommended choice; you can also review this higher-risk choice.`, className: 'assessment-page-warning' })}
          ${aligned ? `<label class="ack-row assessment-page-ack"><input id="ips-ack" type="checkbox" ${state.ipsAcknowledged ? 'checked' : ''}/><span>I've reviewed my Investment Policy Statement and understand the risks of the selected target fund.</span></label>` : ''}
        </div>
      </div>
      <footer class="assessment-page-footer">
        <button class="btn btn-primary" type="button" data-action="${aligned ? 'accept-ips' : 'choose-another-fund'}" ${aligned && !state.ipsAcknowledged ? 'disabled' : ''}>${aligned ? 'Next' : 'Choose Another Fund'}</button>
        ${aligned ? '' : '<button class="btn btn-secondary" type="button" data-action="to-waiver">Continue to Switch</button>'}
        <button class="btn btn-tertiary" type="button" data-action="back-rpq">Back</button>
      </footer>
    </section>`;
}

function openWaiverModal() {
  const target = selectedTarget();
  if (!target || resultAligned()) return;
  waiverReturnFocus = document.activeElement;
  dialogRoot.innerHTML = `
    <div class="modal-backdrop waiver-backdrop">
      <section class="modal waiver-modal" role="dialog" aria-modal="true" aria-labelledby="waiver-title" aria-describedby="waiver-intro" tabindex="-1">
        <header class="modal-header"><div><h2 id="waiver-title">Continue with a higher-risk fund?</h2><p id="waiver-intro">${target.name} is above your ${state.rpqResult} risk profile.</p></div><button class="icon-button" type="button" data-action="close-waiver" aria-label="Close higher-risk confirmation">${icon('close')}</button></header>
        <div class="waiver-modal-body">
          <div class="waiver-risk-comparison"><div><span>Your risk profile</span><strong>${state.rpqResult}</strong></div><div><span>Target fund risk</span><strong>${target.risk}</strong></div></div>
          ${sectionMessage({ type: 'warning', iconName: 'warning', title: 'Please consider the risk', text: 'This fund may fluctuate more than your stated preference. You could lose part of your investment; returns are not guaranteed.', className: 'waiver-risk-note' })}
          <div class="waiver-acknowledgments">
            <label class="ack-row"><input id="waiver-ack" type="checkbox" ${state.waiverAcknowledged ? 'checked' : ''}/><span>I understand this fund exceeds my risk profile and may lose value. I still want to continue with this choice for review.</span></label>
          </div>
        </div>
        <footer class="waiver-modal-actions"><button class="btn btn-primary" type="button" data-action="continue-waiver" ${state.waiverAcknowledged ? '' : 'disabled'}>Continue to Switch</button><button class="btn btn-tertiary" type="button" data-action="close-waiver">Back</button></footer>
      </section>
    </div>`;
  dialogRoot.querySelector('.waiver-modal')?.focus({ preventScroll: true });
}

function closeWaiverModal() {
  state.waiverAcknowledged = state.waiverAccepted;
  closeModal();
  if (waiverReturnFocus instanceof HTMLElement && waiverReturnFocus.isConnected) waiverReturnFocus.focus({ preventScroll: true });
  waiverReturnFocus = null;
}

function reviewView() {
  const body = `
    ${switchSummary(true)}
    ${requiresSupportingDocuments() ? `<p class="review-documents-note">${icon('check_circle')} RPQ and IPS uploaded.</p>` : ''}
    <label class="ack-row"><input id="review-ack" type="checkbox" ${state.acknowledged ? 'checked' : ''}/><span>I confirm that I have reviewed the details above and understood that fund values may fluctuate.</span></label>`;
  return flowLayout({
    active: 3,
    title: 'Review your fund switch',
    description: 'Before submitting, please review and confirm the details below.',
    body,
    backAction: requiresSupportingDocuments() ? 'back-documents' : 'back-funds',
    nextAction: 'submit-request',
    nextLabel: state.submitting ? loadingIndicator('Submitting your request') : 'Submit',
    nextDisabled: !state.acknowledged || (requiresSupportingDocuments() && !documentsUploaded()) || state.submitting,
    nextBusy: state.submitting,
  });
}

function successView() {
  const policy = selectedPolicy();
  const submitted = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date());
  return `
    <section class="success-card" aria-labelledby="success-title">
      <div class="success-main">
        <div class="success-heading"><img class="success-animation" src="${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'assets/figma-request-sent-static.png' : 'assets/figma-request-sent.gif'}" alt="" /><h1 id="success-title">Fund Switch Request Submitted</h1></div>
        <p class="success-copy">Your request has been successfully submitted.<br />Our team will review it and let you know if anything else is needed.</p>
        <section class="request-summary"><h2>Request Summary</h2><dl class="summary-table">
          <dt>Request Number</dt><dd>${state.requestNumber}</dd>
          <dt>Policy Details</dt><dd>${policy.product} #${policy.id}</dd>
          <dt>Request Type</dt><dd>Fund Switch</dd>
          <dt>Submitted</dt><dd>${submitted}</dd>
          <dt>Status</dt><dd>${statusTag('Submitted')}</dd>
        </dl></section>
      </div>
      <footer class="success-actions"><button class="btn btn-tertiary" type="button" data-action="back-services">Back to Services</button></footer>
    </section>`;
}

function render({ focus = true } = {}) {
  const views = { login: loginView, dashboard: dashboardView, 'policy-details': policyDetailsView, services: servicesView, investments: investmentView, requests: requestsView, policy: policyView, funds: fundsView, documents: documentsView, upload: documentsView, rpq: rpqView, assessment: assessmentView, review: reviewView, success: successView, 'vul-explore': vulExploreView };
  app.innerHTML = views[state.screen]();
  const publicMode = state.screen === 'login';
  document.body.classList.toggle('public-mode', publicMode);
  document.body.classList.toggle('account-mode', !publicMode);
  scenarioGuideButton.hidden = publicMode;
  document.querySelectorAll('.main-nav [data-nav]').forEach((button) => {
    const current = button.dataset.nav === state.activeNav;
    button.classList.toggle('active', current);
    button.toggleAttribute('aria-current', current);
  });
  document.querySelectorAll('.mobile-nav-list [data-nav]').forEach((button) => {
    const current = button.dataset.nav === state.activeNav;
    button.classList.toggle('active', current);
    button.toggleAttribute('aria-current', current);
  });
  document.title = `${state.screen === 'login' ? 'Log In' : state.screen === 'dashboard' ? 'Dashboard' : state.screen === 'policy-details' ? 'Policy Details' : state.screen === 'investments' ? 'Investments' : state.screen === 'services' ? 'Services' : state.screen === 'requests' ? 'My Requests' : state.screen === 'success' ? 'Request Submitted' : state.screen === 'vul-explore' ? 'Investment-linked policies' : 'Fund Switch'} — EastWest Ageas`;
  if (state.screen === 'investments') drawInvestmentCharts();
  if (focus) focusPage();
}

function drawInvestmentCharts() {
  const palette = { income: '#b31972', asian: '#0b9677', bond: '#21cbe1', balanced: '#ff9900', active: '#ff5c24', dividend: '#23458f', esg: '#7740a4', global: '#3f4852', reit: '#fa2b55', strategic: '#6683ff' };
  document.querySelectorAll('.fund-performance-chart').forEach((canvas, index) => {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    ctx.scale(ratio, ratio);
    const width = rect.width;
    const height = rect.height;
    const seed = (index + 1) * 1.83;
    ctx.strokeStyle = palette[canvas.dataset.chart] || '#3a1971';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let step = 0; step <= 56; step += 1) {
      const x = (step / 56) * width;
      const movement = Math.sin(step * (.19 + (index % 3) * .02) + seed) * 13 + Math.sin(step * .61 + seed) * 5;
      const trend = (index % 4 === 0 ? step * .10 : -step * .23) + (index % 3 === 1 ? step * .38 : 0);
      const y = Math.min(height - 3, Math.max(3, height * .62 + movement - trend));
      if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
}

function calculateRiskResult() {
  const values = Object.values(state.rpqAnswers).map(Number);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (average <= 1.35) return 'Moderately Conservative';
  if (average <= 2.05) return 'Moderate';
  if (average <= 2.65) return 'Moderately Aggressive';
  return 'Aggressive';
}

function riskResultCopy(profile) {
  if (profile === 'Moderately Conservative') return 'Your answers indicate a preference for capital stability and limited market fluctuation.';
  if (profile === 'Moderate') return 'Your answers indicate comfort with some market fluctuation while balancing stability and growth.';
  if (profile === 'Moderately Aggressive') return 'Your answers indicate comfort with meaningful market fluctuation in pursuit of long-term growth.';
  return 'Your answers suggest you’re comfortable with significant market fluctuations in pursuit of long-term growth.';
}

function openSaveDraftModal() {
  if (!state.policyId) return;
  dialogRoot.innerHTML = `
    <div class="modal-backdrop draft-backdrop">
      <section class="modal draft-modal" role="dialog" aria-modal="true" aria-labelledby="draft-modal-title">
        <div class="draft-modal-header"><h2 id="draft-modal-title">Save your request as draft?</h2><button class="icon-button" type="button" data-action="cancel-save-draft" aria-label="Close save draft confirmation">${icon('close')}</button></div>
        <p>Your progress will be saved so you can continue your request later. You can access your draft anytime from the Services section.</p>
        <footer class="draft-modal-actions"><button class="btn btn-tertiary" type="button" data-action="cancel-save-draft">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-save-draft">Confirm</button></footer>
      </section>
    </div>`;
  dialogRoot.querySelector('.draft-modal').focus?.();
}

function restoreDraftReturnContext() {
  closeModal();
}

function confirmSaveDraft() {
  state.requestStatus = 'Draft';
  state.requestPolicyId = state.policyId;
  state.draftResumeScreen = state.screen;
  state.screen = 'services';
  closeModal();
  render();
  showToast('Your Fund Switch request was saved as a draft.');
}

function resumeSavedRequest() {
  if (state.requestStatus !== 'Draft') {
    showToast('This request has already been submitted.');
    return;
  }
  state.screen = state.draftResumeScreen || 'funds';
  render();
}

function submitRequest() {
  if (!state.acknowledged || (requiresSupportingDocuments() && !documentsUploaded()) || state.submitting) return;
  state.submitting = true;
  render({ focus: false });
  clearTimeout(submissionTimer);
  submissionTimer = window.setTimeout(() => {
    state.submitting = false;
    state.requestStatus = 'Submitted';
    state.requestPolicyId = state.policyId;
    closeModal();
    state.screen = 'success';
    render();
  }, 2000);
}

function openDocumentPreview() {
  const sourceInstruction = selectedSources().map((source) => `${source.name} (${switchableAllocation(source)}%)`).join(', ');
  dialogRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="document-title">
        <div class="modal-header"><div><h2 id="document-title">Fund Switch Application Form</h2><p>Prototype document preview</p></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Close preview">${icon('close')}</button></div>
        <div class="mock-document"><h3>FUND SWITCH APPLICATION FORM</h3><p><strong>Policy owner:</strong> Elizabeth Garcia<br /><strong>Policy:</strong> ${selectedPolicy().product} #${selectedPolicy().id}</p><p><strong>Instruction:</strong> Switch ${money(switchAmount())} from ${sourceInstruction} to ${selectedTarget().name}.</p><p>I acknowledge that fund values may fluctuate and that this request will be processed subject to policy provisions and the applicable cut-off time.</p><p><strong>Customer verification:</strong> Authenticated portal session</p></div>
        <button class="btn btn-primary" type="button" data-action="close-modal">Done</button>
      </section>
    </div>`;
  dialogRoot.querySelector('.icon-button').focus();
}

function openFundDetails() {
  const fund = selectedTarget();
  const details = fundDetails[fund.id] || {
    objective: `${fund.name} is an available ${fund.currency} fund for this policy product, subject to its stated risk classification.`,
    horizon: fund.riskScore >= 9 ? '5 years or more' : '3 - 5 years or more',
  };
  dialogRoot.innerHTML = `
    <div class="drawer-backdrop">
      <aside class="fund-drawer" role="dialog" aria-modal="true" aria-labelledby="fund-drawer-title" tabindex="-1">
        <header class="drawer-header">
          <button class="icon-button drawer-close" type="button" data-action="close-drawer" aria-label="Close fund details">${icon('close')}</button>
          <h2 id="fund-drawer-title">${fund.name}</h2>
          <div class="drawer-tags"><span>${fund.risk}</span></div>
          <p class="drawer-summary">${details.objective}</p>
        </header>
        <div class="drawer-content">
          <p class="drawer-disclaimer">Fund values may rise or fall. Past performance does not guarantee future results.</p>
          <a class="drawer-all-funds" href="investments.html" target="_blank" rel="noopener noreferrer">Explore all investment funds ${icon('open_in_new')}</a>
        </div>
        <footer class="drawer-footer"><button class="btn btn-primary" type="button" data-action="fund-factsheet">View fund factsheet</button></footer>
      </aside>
    </div>`;
  document.body.classList.add('drawer-open');
  dialogRoot.querySelector('.fund-drawer').focus({ preventScroll: true });
}

function factsheetFile(fund) {
  return {
    balanced: 'output/pdf/peso-balanced-fund-factsheet.pdf',
    bond: 'output/pdf/peso-bond-fund-factsheet.pdf',
    equity: 'output/pdf/peso-equity-fund-factsheet.pdf',
  }[fund.id];
}

function openFundFactsheet() {
  const fund = selectedTarget();
  const source = factsheetFile(fund);
  if (!source) return showToast('A factsheet is not available for this fund yet.');
  dialogRoot.insertAdjacentHTML('beforeend', `
    <div class="factsheet-backdrop" role="presentation">
      <section class="factsheet-modal" role="dialog" aria-modal="true" aria-labelledby="factsheet-title" tabindex="-1">
        <header class="factsheet-toolbar">
          <h2 id="factsheet-title">${fund.name} fact sheet</h2>
          <div class="factsheet-toolbar-actions">
            <span class="factsheet-page-count" aria-label="Page 1 of 1">Page <strong>1</strong> / 1</span>
            <a class="icon-button" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="Open ${fund.name} fact sheet in a new tab">${icon('open_in_new')}</a>
            <button class="icon-button factsheet-close" type="button" data-action="close-factsheet" aria-label="Close fact sheet">${icon('close')}</button>
          </div>
        </header>
        <div class="factsheet-document"><iframe src="${source}#toolbar=0&navpanes=0" title="${fund.name} Fund Fact Sheet"></iframe></div>
      </section>
    </div>`);
  document.body.classList.add('factsheet-open');
  dialogRoot.querySelector('.factsheet-modal').focus({ preventScroll: true });
}

function closeFundFactsheet() {
  dialogRoot.querySelector('.factsheet-backdrop')?.remove();
  document.body.classList.remove('factsheet-open');
  dialogRoot.querySelector('.fund-drawer')?.focus({ preventScroll: true });
}

function closeModal() {
  dialogRoot.innerHTML = '';
  document.body.classList.remove('drawer-open', 'factsheet-open');
  scenarioGuideButton.setAttribute('aria-expanded', 'false');
}

function openNonVulPolicyModal() {
  const policy = selectedPolicy();
  if (!policy || policy.fundSwitchEligible) return;
  dialogRoot.innerHTML = `
    <div class="modal-backdrop">
      <section class="modal eligibility-modal" role="dialog" aria-modal="true" aria-labelledby="eligibility-title" tabindex="-1">
        <div class="modal-header"><div class="eligibility-title"><span class="eligibility-icon">${icon('policy')}</span><h2 id="eligibility-title">Fund Switch isn’t available for this policy</h2></div><button class="icon-button" type="button" data-action="choose-another-policy" aria-label="Close and choose another policy">${icon('close')}</button></div>
        <p><strong>Dream Builder</strong> is a traditional life policy, so it doesn’t have investment funds to switch.</p>
        <div class="section-message eligibility-guidance"><span>${icon('lightbulb')}</span><div><span>You can explore VUL products without changing your current policy or starting an application.</span></div></div>
        <footer class="modal-actions"><button class="btn btn-tertiary" type="button" data-action="close-non-vul-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="explore-vul-policies">Explore VUL products</button></footer>
      </section>
    </div>`;
  dialogRoot.querySelector('.eligibility-modal').focus({ preventScroll: true });
}

function openPendingRequestModal(policyId) {
  const policy = policies.find((item) => item.id === policyId);
  if (!policy || !hasPendingRequest(policy)) return;
  dialogRoot.innerHTML = `
    <div class="modal-backdrop">
      <section class="modal eligibility-modal" role="dialog" aria-modal="true" aria-labelledby="pending-request-title" tabindex="-1">
        <div class="modal-header"><div class="eligibility-title"><span class="eligibility-icon pending-request-icon">${icon('hourglass_bottom')}</span><h2 id="pending-request-title">Fund Switch Request Already Submitted</h2></div><button class="icon-button" type="button" data-action="close-pending-request" aria-label="Close pending request notice">${icon('close')}</button></div>
        <p>A Fund Switch request for <strong>${policy.product} #${policy.id}</strong> has already been submitted and is currently under review. You can track its status in My Requests and submit a new request after this one is completed.</p>
        <footer class="modal-actions"><button class="btn btn-tertiary" type="button" data-action="close-pending-request">Close</button><button class="btn btn-primary" type="button" data-action="view-pending-request" data-policy-id="${policy.id}">View My Requests</button></footer>
      </section>
    </div>`;
  dialogRoot.querySelector('.eligibility-modal').focus({ preventScroll: true });
}

function closeFundDrawer() {
  const backdrop = dialogRoot.querySelector('.drawer-backdrop');
  if (!backdrop) return closeModal();
  backdrop.classList.add('closing');
  window.setTimeout(closeModal, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
}

function setSourceFund(value) {
  const changed = state.sourceId !== value;
  state.sourceId = value;
  state.additionalSourceIds = [];
  if (changed) {
    state.targetId = '';
    resetSuitability();
  }
  render({ focus: false });
}

function setTargetFund(value) {
  const changed = state.targetId !== value;
  state.targetId = value;
  if (value !== 'dollar-income') state.additionalSourceIds = [];
  if (changed) {
    resetTargetSuitability();
  }
  state.fundCheck = 'complete';
  render({ focus: false });
}

document.addEventListener('change', (event) => {
  const target = event.target;
  if (target.name === 'policy') {
    state.policyId = target.value;
    state.sourceId = '';
    state.additionalSourceIds = [];
    state.targetId = '';
    resetDocuments();
    render({ focus: false });
  }
  if (target.matches?.('.document-file-input')) {
    const kind = target.dataset.documentKind;
    const file = target.files?.[0];
    if (!file || !documentDefinitions[kind]) return;
    const validType = /\.(pdf|png|jpe?g)$/i.test(file.name) && (!file.type || ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type));
    if (!validType || file.size > 5 * 1024 * 1024) {
      state.documentError = validType ? 'Choose a file under 5 MB.' : 'Choose a PDF, JPG, or PNG file.';
      render({ focus: false });
      return;
    }
    clearTimeout(documentUploadTimers[kind]);
    state.documentError = '';
    state.documentUploads[kind] = { status: 'selected', name: file.name };
    render({ focus: false });
  }
  if (target.name && target.name.startsWith('rpq-')) {
    state.rpqAnswers[target.name.replace('rpq-', '')] = target.value;
    render({ focus: false });
  }
  if (target.id === 'ips-ack') {
    state.ipsAcknowledged = target.checked;
    const next = app.querySelector('[data-action="accept-ips"]');
    if (next) next.disabled = !target.checked;
  }
  if (target.id === 'waiver-ack') {
    state.waiverAcknowledged = target.checked;
    const continueButton = dialogRoot.querySelector('[data-action="continue-waiver"]');
    if (continueButton) continueButton.disabled = !state.waiverAcknowledged;
  }
  if (target.id === 'review-ack') { state.acknowledged = target.checked; render({ focus: false }); }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'login-username') { state.loginUsername = event.target.value; state.loginError = ''; return; }
  if (event.target.id === 'login-password') { state.loginPassword = event.target.value; state.loginError = ''; return; }
  if (event.target.id !== 'scenario-search') return;
  const query = event.target.value.trim().toLowerCase();
  const links = [...dialogRoot.querySelectorAll('.scenario-link')];
  links.forEach((link) => { link.hidden = !link.dataset.searchText.includes(query); });
  const empty = dialogRoot.querySelector('.scenario-empty');
  if (empty) empty.hidden = links.some((link) => !link.hidden);
});

document.addEventListener('submit', (event) => {
  if (!event.target.matches('.login-form')) return;
  event.preventDefault();
  if (!state.loginUsername.trim() || !state.loginPassword.trim()) {
    state.loginError = 'Enter your username and password to continue.';
    render({ focus: false });
    document.querySelector(!state.loginUsername.trim() ? '#login-username' : '#login-password')?.focus();
    return;
  }
  state.loggedIn = true;
  state.screen = 'dashboard';
  state.activeNav = 'Dashboard';
  state.dashboardLoading = true;
  render();
  clearTimeout(dashboardLoadingTimer);
  dashboardLoadingTimer = window.setTimeout(() => {
    state.dashboardLoading = false;
    if (state.screen !== 'dashboard') return;
    render({ focus: false });
    openOnboardingModal();
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 2000);
});

document.addEventListener('click', (event) => {
  const openPortfolio = app.querySelector('.flow-portfolio-card[open]');
  if (openPortfolio && !openPortfolio.contains(event.target)) openPortfolio.open = false;
  const service = event.target.closest('[data-service]');
  if (service) {
    if (service.dataset.service === 'Fund Switch') {
      state.prototypeScenarioId = '';
      state.policyId = '';
      state.sourceId = '';
      state.targetId = '';
      state.screen = 'policy';
      setScenarioUrl();
      render();
    }
    else showToast(`${service.dataset.service} is outside this Fund Switch demo.`);
    return;
  }

  const nav = event.target.closest('[data-nav]');
  if (nav) {
    state.activeNav = nav.dataset.nav;
    closeMobileNav({ restoreFocus: false });
    if (nav.dataset.nav === 'Dashboard') { state.screen = 'dashboard'; render(); return; }
    if (nav.dataset.nav === 'Policy Details') { state.screen = 'policy-details'; render(); return; }
    if (nav.dataset.nav === 'Investments') { state.screen = 'investments'; render(); return; }
    if (nav.dataset.nav === 'Services') { state.screen = 'services'; render(); return; }
    render({ focus: false });
    showToast(`${nav.dataset.nav} is outside this prototype.`);
    return;
  }

  const period = event.target.closest('[data-period]');
  if (period) { state.investmentPeriod = period.dataset.period; render({ focus: false }); return; }

  const control = event.target.closest('[data-action]');
  if (!control) {
    if (event.target.matches?.('.waiver-backdrop')) closeWaiverModal();
    if (dialogRoot.querySelector('.scenario-guide-popover') && !event.target.closest('.scenario-guide-popover')) closeScenarioGuide({ restoreFocus: false });
    document.querySelectorAll('.ds-select-menu:not([hidden])').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.ds-select-control[aria-expanded="true"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    return;
  }
  if (control.disabled) return;
  const action = control.dataset.action;
  if (action === 'brand-home') {
    closeModal();
    if (state.loggedIn) { state.screen = 'dashboard'; state.activeNav = 'Dashboard'; }
    else { state.screen = 'login'; state.activeNav = ''; }
    render();
    return;
  }
  if (action === 'focus-login') { document.querySelector('#login-username')?.focus(); return; }
  if (action === 'toggle-password') { state.passwordVisible = !state.passwordVisible; render({ focus: false }); document.querySelector('#login-password')?.focus(); return; }
  if (action === 'public-info') { showToast('This link is outside the Fund Switch prototype.'); return; }
  if (action === 'skip-onboarding') { closeModal(); return; }
  if (action === 'explore-fund-switch') { closeModal(); state.screen = 'services'; state.activeNav = 'Services'; render(); showToast('Fund Switch is ready under Services.'); return; }
  if (action === 'go-services') { state.screen = 'services'; state.activeNav = 'Services'; render(); return; }
  if (action === 'view-updated-policy') { state.screen = 'policy-details'; state.activeNav = 'Policy Details'; render(); return; }
  if (action === 'back-dashboard') { state.screen = 'dashboard'; state.activeNav = 'Dashboard'; render(); return; }
  if (action === 'open-scenario-guide') {
    if (dialogRoot.querySelector('.scenario-guide-popover')) closeScenarioGuide();
    else openScenarioGuide();
    return;
  }
  if (action === 'close-scenario-guide') { closeScenarioGuide(); return; }
  if (action === 'load-prototype-scenario') { launchPrototypeScenario(control.dataset.scenarioId); return; }
  if (action === 'open-mobile-nav') { openMobileNav(); return; }
  if (action === 'close-mobile-nav') { closeMobileNav(); return; }
  if (action === 'dismiss-mobile-nav' && event.target === mobileNav) { closeMobileNav(); return; }
  if (action === 'toggle-select') {
    const menu = document.querySelector(`#${control.dataset.selectId}-listbox`);
    const willOpen = menu.hidden;
    document.querySelectorAll('.ds-select-menu:not([hidden])').forEach((item) => { item.hidden = true; });
    document.querySelectorAll('.ds-select-control[aria-expanded="true"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    menu.hidden = !willOpen;
    control.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) menu.querySelector('[aria-selected="true"]')?.focus();
    return;
  }
  if (action === 'select-option') {
    const id = control.dataset.selectId;
    const value = control.dataset.value;
    if (id === 'source-fund') return setSourceFund(value);
    if (id === 'target-fund') return setTargetFund(value);
    if (id === 'additional-source-fund') { state.additionalSourceIds = [...(state.additionalSourceIds || []), value]; render({ focus: false }); return; }
    return;
  }
  if (action === 'choose-different-target') { state.targetId = ''; state.additionalSourceIds = []; resetTargetSuitability(); render({ focus: false }); return; }
  if (action === 'select-upload') { app.querySelector(`#upload-${control.dataset.documentKind}`)?.click(); return; }
  if (action === 'remove-upload') {
    const kind = control.dataset.documentKind;
    clearTimeout(documentUploadTimers[kind]);
    state.documentUploads[kind] = { status: 'empty', name: '' };
    render({ focus: false });
    return;
  }
  if (action === 'confirm-upload') {
    const kind = control.dataset.documentKind;
    if (state.documentUploads[kind]?.status !== 'selected') return;
    state.documentUploads[kind].status = 'uploading';
    render({ focus: false });
    documentUploadTimers[kind] = window.setTimeout(() => {
      if (state.documentUploads[kind]?.status !== 'uploading') return;
      state.documentUploads[kind].status = 'uploaded';
      render({ focus: false });
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 900);
    return;
  }
  if (action === 'remove-additional-source') { state.additionalSourceIds = (state.additionalSourceIds || []).filter((id) => id !== control.dataset.sourceId); render({ focus: false }); return; }
  if (action === 'restart') { clearTimeout(submissionTimer); clearTimeout(rpqTimer); state.prototypeScenarioId = ''; state.screen = 'services'; state.activeNav = 'Services'; state.additionalSourceIds = []; setScenarioUrl(); closeModal(); render(); }
  if (action === 'start-policy-fund-switch') {
    state.policyId = control.dataset.policyId;
    state.sourceId = control.dataset.sourceId;
    state.additionalSourceIds = [];
    state.targetId = '';
    resetSuitability();
    state.screen = 'funds';
    render();
  }
  if (action === 'toggle-policy-breakdown') { state.investmentExpandedPolicyId = state.investmentExpandedPolicyId === control.dataset.policyId ? '' : control.dataset.policyId; render({ focus: false }); }
  if (action === 'toolkit-info') showToast('This toolkit item is outside this Fund Switch demo.');
  if (action === 'risk-profile-info') showToast('Your current risk profile is Moderate.');
  if (action === 'back-services') { state.screen = 'services'; state.activeNav = 'Services'; render(); }
  if (action === 'open-policy-requests') { state.screen = 'requests'; render(); }
  if (action === 'toggle-request-details') { state.requestExpanded = !state.requestExpanded; render({ focus: false }); }
  if (action === 'resume-request') resumeSavedRequest();
  if (action === 'pending-policy-info') openPendingRequestModal(control.dataset.policyId);
  if (action === 'to-funds') {
    if (!selectedPolicy()?.fundSwitchEligible) return openNonVulPolicyModal();
    const scenario = prototypeScenarios.find((item) => item.id === state.prototypeScenarioId);
    if (scenario?.requiresPolicySelection && scenario.state.policyId === state.policyId) {
      const { screen, policyId, ...fundPreset } = scenario.state;
      Object.assign(state, fundPreset);
    }
    state.screen = 'funds';
    render();
  }
  if (action === 'close-pending-request') closeModal();
  if (action === 'view-pending-request') {
    state.requestPolicyId = control.dataset.policyId;
    state.requestStatus = 'Submitted';
    state.requestExpanded = true;
    state.screen = 'requests';
    closeModal();
    render();
  }
  if (action === 'choose-another-policy' || action === 'back-to-policy-selection') { state.policyId = ''; closeModal(); state.screen = 'policy'; state.activeNav = 'Services'; render(); }
  if (action === 'close-non-vul-modal') { closeModal(); }
  if (action === 'explore-vul-policies') { closeModal(); showToast('Destination to be confirmed.'); }
  if (action === 'request-vul-consultation') { state.vulConsultationRequested = true; render(); }
  if (action === 'back-policy') { state.screen = 'policy'; render(); }
  if (action === 'to-rpq') { state.screen = 'rpq'; render(); }
  if (action === 'to-assessment') { state.screen = 'assessment'; render(); }
  if (action === 'complete-rpq') {
    if (Object.keys(state.rpqAnswers).length !== rpqQuestions.length || state.rpqSubmitting) return;
    state.rpqSubmitting = true;
    render({ focus: false });
    clearTimeout(rpqTimer);
    rpqTimer = window.setTimeout(() => {
      state.rpqSubmitting = false;
      state.rpqComplete = true;
      state.rpqResult = calculateRiskResult();
      state.ipsAccepted = false;
      state.ipsAcknowledged = false;
      state.waiverAcknowledged = false;
      state.waiverAccepted = false;
      state.screen = 'assessment';
      render();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 250 : 900);
  }
  if (action === 'back-rpq') { state.screen = 'rpq'; render(); }
  if (action === 'choose-another-fund') { state.screen = 'funds'; render(); }
  if (action === 'to-waiver') openWaiverModal();
  if (action === 'close-waiver') { closeWaiverModal(); return; }
  if (action === 'continue-waiver') {
    if (!state.waiverAcknowledged || resultAligned()) return;
    state.waiverAccepted = true;
    closeWaiverModal();
    state.screen = 'funds';
    render();
  }
  if (action === 'accept-ips') {
    if (!resultAligned() || !state.ipsAcknowledged) return;
    state.ipsAccepted = true;
    state.screen = 'funds';
    render();
  }
  if (action === 'continue-fund-switch') {
    if (!state.sourceId || !state.targetId || !meetsMinimumSwitch() || !fullAllocationReady()) return;
    state.screen = requiresSupportingDocuments() ? 'documents' : 'review';
    render();
  }
  if (action === 'to-review') { if (requiresSupportingDocuments() && !documentsUploaded()) return; state.screen = 'review'; render(); }
  if (action === 'edit-funds' || action === 'back-funds') { state.screen = 'funds'; render(); }
  if (action === 'back-documents' || action === 'back-upload') { state.screen = 'documents'; render(); }
  if (action === 'submit-request') submitRequest();
  if (action === 'back-review') { state.screen = 'review'; render(); }
  if (action === 'preview-document') openDocumentPreview();
  if (action === 'save-draft') openSaveDraftModal();
  if (action === 'cancel-save-draft') restoreDraftReturnContext();
  if (action === 'confirm-save-draft') confirmSaveDraft();
  if (action === 'close-modal') closeModal();
  if (action === 'fund-details') openFundDetails();
  if (action === 'close-drawer') closeFundDrawer();
  if (action === 'fund-factsheet') openFundFactsheet();
  if (action === 'close-factsheet') closeFundFactsheet();
  if (action === 'my-requests') { state.screen = 'requests'; render(); }
});

document.addEventListener('toggle', (event) => {
  if (event.target.matches?.('.flow-portfolio-card') && event.target.open) sizePortfolioOverlay();
}, true);
window.addEventListener('resize', sizePortfolioOverlay);
window.addEventListener('scroll', sizePortfolioOverlay, { passive: true });

document.addEventListener('keydown', (event) => {
  const serviceCard = event.target.closest?.('.service-card[data-service]');
  if (serviceCard && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    serviceCard.click();
    return;
  }
  if (event.key === 'Escape' && !mobileNav.hidden) closeMobileNav();
  else if (event.key === 'Escape' && dialogRoot.querySelector('.scenario-guide-popover')) closeScenarioGuide();
  else if (event.key === 'Escape' && dialogRoot.querySelector('.waiver-modal')) closeWaiverModal();
  else if (event.key === 'Escape' && dialogRoot.querySelector('.draft-modal')) restoreDraftReturnContext();
  else if (event.key === 'Escape' && dialogRoot.querySelector('.factsheet-backdrop')) closeFundFactsheet();
  else if (event.key === 'Escape' && dialogRoot.querySelector('.drawer-backdrop')) closeFundDrawer();
  else if (event.key === 'Escape' && dialogRoot.innerHTML) closeModal();
  else if (event.key === 'Escape' && app.querySelector('.flow-portfolio-card[open]')) {
    const portfolio = app.querySelector('.flow-portfolio-card[open]');
    portfolio.open = false;
    portfolio.querySelector('summary')?.focus({ preventScroll: true });
  }
});

const initialScenarioId = new URLSearchParams(window.location.search).get('scenario');
if (!launchPrototypeScenario(initialScenarioId, { updateUrl: false })) render();
