const publicFunds = {
  conservative: [
    ['Peso Bond Fund', '₱1.1102', 'Fixed Income', 'Aims to provide regular income and capital stability through high-quality peso-denominated fixed income securities.'],
    ['Dollar Income Paying Fund', '$1.0320', 'Fixed Income', 'Seeks steady dollar income through a diversified portfolio of global fixed income investments.'],
  ],
  moderate: [
    ['Peso Balanced Fund', '₱0.9990', 'Balanced', 'Balances long-term capital growth and regular income through a diversified mix of bonds and equities.'],
    ['Peso Global Strategic Payout Fund', '₱1.0478', 'Multi-asset', 'Offers global diversification and potential regular payouts for medium- to long-term investors.'],
  ],
  aggressive: [
    ['Asian Equity Fund', '₱1.5560', 'Equity', 'Provides access to long-term growth opportunities from a diversified portfolio of Asian equities.'],
    ['Equity Fund', '₱0.7617', 'Equity', 'Invests mainly in Philippine equities for investors seeking long-term capital appreciation.'],
    ['Peso Active Equity Fund', '₱1.0493', 'Equity', 'Actively invests in select Philippine companies with strong growth potential.'],
    ['Peso Global ESG Equity Fund', '₱1.2367', 'Global Equity', 'Invests in global companies with strong environmental, social, and governance practices.'],
    ['Peso Global REIT Payout Fund', '₱0.9325', 'Global REIT', 'Offers exposure to a diversified portfolio of global real estate investment trusts.'],
    ['Peso High Dividend Equity Fund', '₱1.3017', 'Equity', 'Focuses on Philippine companies with attractive and sustainable dividend potential.'],
    ['Dollar Global ESG Equity Fund', '$1.2013', 'Global Equity', 'Provides dollar-denominated access to global companies with leading ESG practices.'],
    ['Dollar Income Paying Fund', '$1.0320', 'Fixed Income', 'Seeks income and diversification from a global portfolio of fixed income investments.'],
  ],
};

const performanceFunds = [
  ['Bond Fund', '₱1.1102', '+0.08%', '+3.42%', '+8.15%', '+11.02%'],
  ['Balanced Fund', '₱0.9990', '+0.14%', '+4.08%', '+10.34%', '-0.10%'],
  ['Equity Fund', '₱1.2409', '+0.31%', '+6.22%', '+13.48%', '+24.09%'],
  ['Peso High Dividend Equity Fund', '₱0.7617', '-0.12%', '+2.11%', '+7.86%', '-23.83%'],
  ['Peso Active Equity Fund', '₱1.0493', '+0.25%', '+5.17%', '+12.63%', '+4.93%'],
  ['Asian Equity Fund', '₱1.5560', '+0.42%', '+7.90%', '+18.24%', '+55.60%'],
  ['Peso Global ESG Equity Fund', '₱1.2367', '+0.38%', '+6.71%', '+15.04%', '+23.67%'],
  ['Peso Global REIT Payout Fund', '₱0.9325', '-0.09%', '+1.82%', '+5.93%', '-6.75%'],
  ['Dollar Income Paying Fund', '$1.2013', '+0.04%', '+2.95%', '+7.22%', '+20.13%'],
  ['Dollar Global ESG Equity Fund', '$1.0320', '+0.29%', '+5.86%', '+13.37%', '+3.20%'],
];

const riskCopy = {
  conservative: ['Conservative Investor', 'You prioritize preserving your capital and prefer stable returns with minimal market fluctuations.'],
  moderate: ['Moderate Investor', 'You seek a balance between steady income and long-term growth and can accept some market fluctuations.'],
  aggressive: ['Aggressive Investor', 'You seek higher potential returns over the long term and are comfortable with significant market fluctuations.'],
};

const publicMenuButton = document.querySelector('.public-header > .menu-button');
const publicMenu = document.querySelector('#mobile-nav');
let publicMenuReturnFocus = null;

function setPublicMenu(open, { restoreFocus = true } = {}) {
  if (open) publicMenuReturnFocus = document.activeElement;
  publicMenu.hidden = !open;
  document.body.classList.toggle('public-menu-open', open);
  publicMenuButton.setAttribute('aria-expanded', String(open));
  if (open) publicMenu.querySelector('.mobile-nav-panel').focus({ preventScroll: true });
  else if (restoreFocus && publicMenuReturnFocus instanceof HTMLElement) publicMenuReturnFocus.focus({ preventScroll: true });
}

function renderFunds(risk = 'aggressive') {
  const grid = document.querySelector('#public-fund-grid');
  grid.innerHTML = publicFunds[risk].map((fund, index) => `
    <article class="public-fund-card ${index === 0 ? 'expanded' : ''}">
      <button class="fund-card-toggle" type="button" aria-expanded="${index === 0}">
        <span><small>${fund[2]}</small><strong>${fund[0]}</strong></span>
        <span class="fund-navpu"><small>NAVPU</small><strong>${fund[1]}</strong></span>
        <span class="material-symbols-rounded" aria-hidden="true">expand_more</span>
      </button>
      <div class="fund-card-body"><p>${fund[3]}</p><p class="fund-date">As of April 27, 2026</p><div><a href="https://ewageas.com.ph/investment" target="_blank" rel="noopener noreferrer">Fund Fact Sheet</a><a href="#advisor">Product Highlights</a></div></div>
    </article>`).join('');
}

function renderPerformance() {
  const table = document.querySelector('#performance-table');
  table.insertAdjacentHTML('beforeend', performanceFunds.map((fund) => `<div class="performance-row" role="row">${fund.map((value, index) => `<span role="cell" class="${index > 1 ? (value.startsWith('-') ? 'negative' : 'positive') : ''}">${value}</span>`).join('')}</div>`).join(''));
}

function drawPerformanceChart() {
  const canvas = document.querySelector('#performance-chart canvas');
  const width = canvas.parentElement.clientWidth;
  canvas.width = width * devicePixelRatio;
  canvas.height = 360 * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = '360px';
  const context = canvas.getContext('2d');
  context.scale(devicePixelRatio, devicePixelRatio);
  context.clearRect(0, 0, width, 360);
  const padding = 48;
  const values = [1.11, .999, 1.24, .762, 1.049, 1.556, 1.237, .933, 1.201, 1.032];
  const barWidth = Math.max(18, (width - padding * 2) / values.length - 18);
  values.forEach((value, index) => {
    const x = padding + index * ((width - padding * 2) / values.length) + 5;
    const height = value / 1.7 * 250;
    context.fillStyle = index % 2 ? '#c992cf' : '#5f2a8a';
    context.fillRect(x, 300 - height, barWidth, height);
    context.fillStyle = '#4b3d55';
    context.font = '11px Lato';
    context.save(); context.translate(x + 4, 318); context.rotate(-.4); context.fillText(performanceFunds[index][0].replace('Peso ', ''), 0, 0); context.restore();
  });
}

document.addEventListener('click', (event) => {
  const riskButton = event.target.closest('[data-risk]');
  if (riskButton) {
    document.querySelectorAll('[data-risk]').forEach((button) => { button.classList.toggle('active', button === riskButton); button.setAttribute('aria-selected', button === riskButton); });
    const risk = riskButton.dataset.risk;
    const [title, description] = riskCopy[risk];
    document.querySelector('#risk-description').innerHTML = `<strong>${title}</strong><span>${description}</span>`;
    renderFunds(risk);
  }
  const fundToggle = event.target.closest('.fund-card-toggle');
  if (fundToggle) {
    const card = fundToggle.closest('.public-fund-card');
    const expanded = card.classList.toggle('expanded');
    fundToggle.setAttribute('aria-expanded', expanded);
  }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    document.querySelectorAll('[data-view]').forEach((button) => { button.classList.toggle('active', button === viewButton); button.setAttribute('aria-selected', button === viewButton); });
    const chartSelected = viewButton.dataset.view === 'chart';
    document.querySelector('#performance-table').hidden = chartSelected;
    document.querySelector('#performance-chart').hidden = !chartSelected;
    if (chartSelected) drawPerformanceChart();
  }
  if (event.target.closest('.public-header > .menu-button')) setPublicMenu(true);
  if (event.target.closest('[data-action="close-public-menu"]')) setPublicMenu(false);
  if (event.target.matches('[data-action="dismiss-public-menu"]')) setPublicMenu(false);
  if (event.target.closest('.mobile-nav-links a')) setPublicMenu(false, { restoreFocus: false });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !publicMenu.hidden) setPublicMenu(false);
});

renderFunds();
renderPerformance();
