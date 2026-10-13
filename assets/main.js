const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const format = value => new Intl.NumberFormat('en-US').format(Math.round(value));
const research = {
  contract: {
    title: 'Contract filings', baseline: 762000, latest: 1300000,
    baselineText: '≈762,000', latestText: '>1.3M', marker: '≈',
    insight: 'Reported contract filings rose from about 762,000 in 2021 to more than 1.3 million in preliminary 2025 data. The displayed growth is an comparison calculated from rounded figures, not a national growth rate.',
    scope: 'Figure 3 reporting jurisdictions: AK, AZ, CT, DE, KY, ME, MA, MN, NE, NH, MP, ND, PR, RI, TX, VT, WI.',
  },
  small: {
    title: 'Small claims filings', baseline: 671000, latest: 1000000,
    baselineText: '≈671,000', latestText: '≈1.0M', marker: '≈',
    insight: 'Reported small-claims filings increased from about 671,000 in 2021 to nearly one million in preliminary 2025 data. The website uses one million as an approximate display value, not an exact observed count.',
    scope: 'Figure 3 reporting jurisdictions: AK, AZ, CT, DE, KY, ME, MA, MN, NE, NH, MP, ND, PR, RI, TX, VT, WI.',
  },
};
const state = { category: 'contract', unit: 'volume', point: '2025', capacity: 10 };
function readParams() {
  const p = new URLSearchParams(location.search);
  if (Object.hasOwn(research, p.get('category'))) state.category = p.get('category');
  if (['volume', 'growth'].includes(p.get('unit'))) state.unit = p.get('unit');
  if (['2021', '2025'].includes(p.get('point'))) state.point = p.get('point');
  const capacity = Number(p.get('capacity'));
  if (p.has('capacity') && Number.isFinite(capacity)) state.capacity = Math.max(0, Math.min(30, Math.round(capacity)));
}
function persist() {
  const p = new URLSearchParams();
  if (state.category !== 'contract') p.set('category', state.category);
  if (state.unit !== 'volume') p.set('unit', state.unit);
  if (state.point !== '2025') p.set('point', state.point);
  if (state.capacity !== 10) p.set('capacity', String(state.capacity));
  history.replaceState({}, '', location.pathname + (p.size ? `?${p}` : '') + location.hash);
}
function button(text, label, callback) {
  const el = document.createElement('button');
  el.type = 'button';
  el.textContent = text;
  el.setAttribute('aria-label', label);
  el.addEventListener('click', callback);
  return el;
}
function renderResearch() {
  const data = research[state.category];
  const ratio = data.latest / data.baseline;
  $('#growth-title').textContent = data.title;
  $('#growth-value').textContent = `${data.marker}${((ratio - 1) * 100).toFixed(1)}%`;
  $('#growth-insight').textContent = data.insight;
  $('#growth-detail').textContent = state.point === '2021'
    ? `${data.baselineText} filings · 2021 baseline. ${data.scope}`
    : `${data.latestText} filings · preliminary 2025. ${data.scope}`;
  $$('[data-category]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.category === state.category)));
  $$('[data-unit]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.unit === state.unit)));
  const columns = document.createElement('div');
  columns.className = 'growth-columns';
  const points = [
    { year: '2021', value: data.baseline, text: data.baselineText, index: 100 },
    { year: '2025', value: data.latest, text: data.latestText, index: ratio * 100 },
  ];
  for (const point of points) {
    const column = button('', `${point.year}: ${point.text} ${data.title.toLowerCase()}. Select this reporting point.`, () => {
      state.point = point.year;
      renderResearch();
      persist();
      $(`[data-point='${point.year}']`).focus({ preventScroll: true });
    });
    column.className = `growth-column${state.point === point.year ? ' selected' : ''}`;
    column.dataset.point = point.year;
    column.setAttribute('aria-pressed', String(state.point === point.year));
    column.style.setProperty('--height', `${(point.value / data.latest) * 80}%`);
    const value = document.createElement('strong');
    value.textContent = state.unit === 'volume' ? point.text : `${point.index.toFixed(point.year === '2021' ? 0 : 1)}`;
    const bar = document.createElement('span');
    bar.className = 'bar-visual';
    bar.setAttribute('aria-hidden', 'true');
    const year = document.createElement('small');
    year.textContent = point.year === '2021' ? '2021 baseline' : '2025 preliminary';
    column.append(value, bar, year);
    columns.append(column);
  }
  $('#growth-chart').replaceChildren(columns);
}
function renderCapacity() {
  const received = 100000;
  const disposed = Math.round(92000 * (1 + state.capacity / 100));
  const net = disposed - received;
  $('#capacity').value = String(state.capacity);
  $('#capacity-label').textContent = `${state.capacity}%`;
  $('#clearance-value').textContent = `${(disposed / received * 100).toFixed(1)}%`;
  $('#balance-label').textContent = net >= 0 ? 'DISPOSITIONS ABOVE FILINGS' : 'FILINGS ABOVE DISPOSITIONS';
  $('#balance-value').textContent = format(Math.abs(net));
  $('#capacity-insight').textContent = net >= 0
    ? `Under these assumptions, modeled dispositions exceed incoming filings by ${format(net)}. This is a flow balance, not a calculation of the remaining backlog.`
    : `Under these assumptions, incoming filings exceed modeled dispositions by ${format(-net)}. Existing pending cases and other adjustments are not included.`;
  const fragment = document.createDocumentFragment();
  for (const row of [{ label: 'Incoming filings', value: received }, { label: 'Modeled dispositions', value: disposed }]) {
    const holder = document.createElement('div');
    holder.className = 'capacity-bar';
    const labels = document.createElement('div');
    const name = document.createElement('span');
    name.textContent = row.label;
    const value = document.createElement('strong');
    value.textContent = format(row.value);
    labels.append(name, value);
    const track = document.createElement('i');
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('b');
    fill.style.setProperty('--capacity-width', `${row.value / 120000 * 100}%`);
    track.append(fill);
    holder.append(labels, track);
    fragment.append(holder);
  }
  $('#capacity-chart').replaceChildren(fragment);
}
readParams();
renderResearch();
renderCapacity();
$$('[data-category]').forEach(el => el.addEventListener('click', () => {
  state.category = el.dataset.category;
  renderResearch();
  persist();
}));
$$('[data-unit]').forEach(el => el.addEventListener('click', () => {
  state.unit = el.dataset.unit;
  renderResearch();
  persist();
}));
$('#capacity').addEventListener('input', event => {
  state.capacity = Number(event.target.value);
  renderCapacity();
  persist();
});
$$('[data-reach]').forEach(el => el.addEventListener('click', () => {
  $$('[data-reach]').forEach(button => button.setAttribute('aria-pressed', String(button === el)));
  $('#reach-insight').textContent = el.dataset.reach === 'state'
    ? 'NCSC estimates that state courts handle 98% of US cases. This is a broad national estimate, not a measure of an individual state.'
    : 'The remaining approximately 2% is the complement of NCSC’s state-court estimate. CourtAtlas does not present a separate measured count for other courts.';
}));
$$('[data-index]').forEach(el => el.addEventListener('click', () => {
  $$('[data-index]').forEach(button => button.setAttribute('aria-pressed', String(button === el)));
  $('#index-insight').textContent = el.dataset.index === '2012'
    ? '2012 is the reference year, set to an index of 100. The 2024 index of 73 is derived from the reported 27% reduction in filings.'
    : '2024 filings were up 4% from 2023, but 27% below 2012. A short-term increase and a long-term decline can coexist.';
}));
let statusTimeout;
function notify(message) {
  clearTimeout(statusTimeout);
  $('#status-message').textContent = message;
  $('#status-message').classList.add('visible');
  statusTimeout = setTimeout(() => $('#status-message').classList.remove('visible'), 4500);
}
$('#export-research').addEventListener('click', () => {
  const data = research[state.category];
  const rows = [
    'Category,Period,Display approximation,Numeric chart value,Scope,Source',
    `${data.title},2021,${data.baselineText.replace(',', '')},${data.baseline},Figure 3 reporting jurisdictions,https://www.ncsc.org/resources-courts/early-data-signals-increased-civil-filings-decreased-clearance-rates-2025`,
    `${data.title},Preliminary 2025,${data.latestText},${data.latest},Figure 3 reporting jurisdictions,https://www.ncsc.org/resources-courts/early-data-signals-increased-civil-filings-decreased-clearance-rates-2025`,
  ];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `courtatlas-${state.category}-reported-approximations.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  notify('Research CSV downloaded with source and coverage notes.');
});
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('#navigation').classList.toggle('open', open);
});
$$('#navigation a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  $('#navigation').classList.remove('open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    $('#navigation').classList.remove('open');
    menu.focus();
  }
});
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-enabled');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(el => observer.observe(el));
  const counters = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / 1200, 1);
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counters.unobserve(el);
    });
  }, { threshold: 0.7 });
  $$('[data-count]').forEach(el => counters.observe(el));
}
let ticking = false;
function updateProgress() {
  const height = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress').style.width = `${height > 0 ? scrollY / height * 100 : 0}%`;
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
updateProgress();
$$('img').forEach(img => img.addEventListener('error', () => {
  img.style.opacity = '0';
  img.parentElement.classList.add('image-unavailable');
}));
