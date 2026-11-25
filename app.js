// Menu page: offers, category tabs, diet filter, card grid.
let cat = 'Breakfast', diet = '', day = TODAY; // diet: '' | 'veg' | 'non'

function card(m) {
  return `<article class="card ${m.stock ? '' : 'out'}">
    <div class="pic"><img src="${m.img}" alt="${m.name}" loading="lazy">
      <i class="vn ${m.veg ? 'veg' : 'non'}" title="${m.veg ? 'Vegetarian' : 'Non-vegetarian'}"></i>
      ${m.off ? `<span class="off">${m.off}% OFF</span>` : ''}
      <span class="badge ${m.stock ? 'in' : 'so'}">${m.stock ? (m.stock <= 5 ? 'Only ' + m.stock + ' left' : 'In stock') : 'Sold out'}</span></div>
    <div class="info"><h3>${m.name}</h3><p>${m.desc}</p>
      <div class="row"><span class="price"><b>${rs(m.price)}</b>${m.off ? `<s>${rs(m.mrp)}</s>` : ''}</span>${day === TODAY ? ctl(m) : `<div class="cc"><button class="btn" disabled>Not today</button></div>`}</div></div></article>`;
}

function render() {
  $('#tabs').innerHTML = CATS.map(c => `<button role="tab" class="${c === cat ? 'on' : ''}" data-act="cat" data-v="${c}">${c}</button>`).join('');
  $('#diet').innerHTML = [['veg', 'Veg', 'veg'], ['non', 'Non-veg', 'non']].map(d => `<button class="${d[0] === diet ? 'on' : ''}" data-act="diet" data-v="${d[0]}"><i class="vn ${d[2]}"></i>${d[1]}</button>`).join('');
  $('#hours').textContent = `${day === TODAY ? 'Today' : DAYS[day]}: ${CUISINE[DAY_CUISINE[day]]} day · ${cat} served ${HOURS[cat]}` + (cat === 'Dinner' ? ' · Dinner pickup slots: ' + DINNER.join(', ') : '');
  $('#week').innerHTML = DAYS.map((_, i) => (i + TODAY) % 7).map(i => `<button class="${i === day ? 'on' : ''}" data-act="day" data-v="${i}"><small>${i === TODAY ? 'Today' : DAYS[i].slice(0, 3)}</small><b>${CUISINE[DAY_CUISINE[i]]}</b></button>`).join('');
  const list = MENU.filter(m => m.cat === cat && onDay(m, day) && (!diet || (diet === 'veg') === m.veg)).sort((x, y) => (x.cu === '*') - (y.cu === '*')); // today's cuisine first, everyday dishes after
  $('#menu').innerHTML = list.length ? list.map(card).join('') : '<p class="empty">Nothing matches this filter.</p>';
}

function onCartChange() {
  const b = bill(), bar = $('#bar');
  bar.classList.toggle('hidden', !b.count);
  bar.textContent = `${b.count} item${b.count > 1 ? 's' : ''} · ${rs(b.sub)} — View cart`;
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'day') { day = +t.dataset.v; render(); }
  else if (t.dataset.act === 'cat') { cat = t.dataset.v; render(); }
  else if (t.dataset.act === 'diet') { diet = diet === t.dataset.v ? '' : t.dataset.v; render(); }
  else if (t.dataset.act === 'copy') {
    try { navigator.clipboard.writeText(t.dataset.v); } catch (err) { /* ignore */ }
    t.textContent = 'Copied ✔'; setTimeout(() => t.textContent = t.dataset.v, 1200);
  }
});

$('#offers').innerHTML = OFFERS.map(o => `<div class="offer"><b>${o.txt}</b><span>Code <button data-act="copy" data-v="${o.code}">${o.code}</button></span></div>`).join('')
  + `<div class="offer alt"><b>Up to 20% off on marked items</b><span>Prices already reduced</span></div>`;
$('#today').textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
render(); onCartChange();

// Quotes (rotate), virtues and student views
const QUOTES = [
  ['One cannot think well, love well, sleep well, if one has not dined well.', 'Virginia Woolf'],
  ['Food is our common ground, a universal experience.', 'James Beard'],
  ['People who love to eat are always the best people.', 'Julia Child']
];
let qi = 0;
function showQuote() { $('#qtext').textContent = '“' + QUOTES[qi][0] + '”'; $('#qby').textContent = '— ' + QUOTES[qi][1]; qi = (qi + 1) % QUOTES.length; }
showQuote(); setInterval(showQuote, 6000);

$('#virtues').innerHTML = [
  ['Fresh every day', 'Cooked in small batches, served the same day.'],
  ['Hygiene first', 'Clean kitchen, gloves and covered serving.'],
  ['Student-friendly prices', 'Daily offers and coupons on every order.'],
  ['No queues', 'Order ahead and pick up at your break.']
].map(v => `<div class="vcard"><b>${v[0]}</b><p>${v[1]}</p></div>`).join('');

$('#views').innerHTML = [
  ['The dosa is crisp and the pickup slot saved me ten minutes between classes.', 'Sample review · 1st year'],
  ['Love the daily cuisine change. Thursday North Indian lunch is my favourite.', 'Sample review · 2nd year'],
  ['Coupons make the dinner combos really affordable on a student budget.', 'Sample review · 3rd year']
].map(v => `<figure class="vcard"><blockquote>${v[0]}</blockquote><figcaption>${v[1]}</figcaption></figure>`).join('');
