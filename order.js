// Order page: cart lines, coupon, live bill, pickup slot, place order.
let slot = '', code = store.get('cafeCoupon', ''), placed = null, msg = '';

// Which slots can this cart use? Dinner items -> dinner slots, breakfast/lunch -> break slots, else any.
function slotRule() {
  const cats = Object.keys(cart).map(id => byId(id).cat);
  const dinner = cats.includes('Dinner'), day = cats.some(c => c === 'Breakfast' || c === 'Lunch');
  return { dinner, day, clash: dinner && day, ok: s => !FULL.includes(s) && (dinner ? DINNER.includes(s) : day ? BREAKS.includes(s) : true) };
}

function view() {
  if (placed) {
    $('#order').innerHTML = `<div class="panel done"><h2>Order placed ✔</h2><p class="token">Token <b>#${placed.token}</b></p>
      <p>Pick up at <b>${placed.slot}</b> from the Campus Bites counter.</p>
      <ul class="lines">${placed.items.map(i => `<li><span>${i.q} × ${i.name}</span><b>${rs(i.price * i.q)}</b></li>`).join('')}</ul>
      <div class="sum total"><span>Total paid at counter</span><b>${rs(placed.total)}</b></div>
      <a class="btn big" href="index.html">Order something else</a></div>`;
    return;
  }
  const b = bill(code), r = slotRule();
  if (!b.count) { $('#order').innerHTML = '<div class="panel"><p class="empty">Your cart is empty.</p><a class="btn big" href="index.html">Browse the menu</a></div>'; return; }
  if (slot && !r.ok(slot)) slot = '';
  const chip = s => `<button class="${s === slot ? 'on' : ''}" ${r.ok(s) ? '' : 'disabled'} data-act="slot" data-v="${s}">${s}${FULL.includes(s) ? '<small>Full</small>' : ''}</button>`;
  $('#order').innerHTML = `<div class="two">
    <div>
      <div class="panel"><h2>Items</h2><ul class="lines">${b.items.map(i => `<li><span>${i.m.name}<small>${rs(i.m.price)} each</small></span>${ctl(i.m)}<b>${rs(i.m.price * i.q)}</b></li>`).join('')}</ul></div>
      <div class="panel"><h2>Offers</h2>
        <form class="coupon" id="cform"><input id="ccode" placeholder="Coupon code" value="${code}" autocomplete="off"><button class="btn">Apply</button></form>
        <p class="cmsg ${b.coupon ? 'ok' : ''}" id="cmsg">${msg}</p>
        <div class="chips">${OFFERS.map(o => `<button data-act="coupon" data-v="${o.code}" title="${o.txt}">${o.code}</button>`).join('')}</div></div>
      <div class="panel"><h2>Pickup time</h2>
        ${r.clash ? '<p class="err">Dinner items and breakfast/lunch items need different pickup times. Please order them separately.</p>' : ''}
        <h3>Break timings</h3><div class="slots">${BREAKS.map(chip).join('')}</div>
        <h3>Dinner timings</h3><div class="slots">${DINNER.map(chip).join('')}</div></div>
    </div>
    <aside class="panel bill"><h2>Bill</h2>
      <div class="sum"><span>Item total (MRP)</span><span>${rs(b.mrp)}</span></div>
      ${b.itemSave ? `<div class="sum save"><span>Item offers</span><span>− ${rs(b.itemSave)}</span></div>` : ''}
      ${b.coupon ? `<div class="sum save"><span>Coupon ${b.offer.code}</span><span>− ${rs(b.coupon)}</span></div>` : ''}
      <div class="sum"><span>Subtotal</span><span>${rs(b.sub - b.coupon)}</span></div>
      <div class="sum"><span>GST (5%)</span><span>${rs(b.tax)}</span></div>
      <div class="sum total"><span>Final bill</span><b>${rs(b.total)}</b></div>
      ${b.mrp - b.sub + b.coupon ? `<p class="saved">You save ${rs(b.itemSave + b.coupon)} on this order</p>` : ''}
      <p class="err" id="err"></p>
      <button class="btn big" data-act="place">${me ? 'Place order' : 'Login to place order'} · ${rs(b.total)}</button></aside></div>`;
}

function applyCode(c) {
  c = c.trim().toUpperCase(); const o = OFFERS.find(x => x.code === c), sub = bill().sub;
  if (!c) { code = ''; msg = ''; }
  else if (!o) { code = ''; msg = 'Invalid coupon code.'; }
  else if (sub < o.min) { code = ''; msg = `${c} needs an order of at least ${rs(o.min)}.`; }
  else { code = c; msg = `${c} applied: ${o.txt}.`; }
  store.set('cafeCoupon', code); view();
}
function onCartChange() { if (code) { const o = OFFERS.find(x => x.code === code); if (bill().sub < o.min) { msg = `${code} removed: order is below ${rs(o.min)}.`; code = ''; store.set('cafeCoupon', ''); } } view(); }

function history() {
  const mine = me ? store.get('cafeOrders', []).filter(o => o.email === me.email).slice(-5).reverse() : [];
  $('#history').innerHTML = mine.length ? `<div class="panel"><h2>Your recent orders</h2><ul class="lines">${mine.map(o => `<li><span>#${o.token} · ${o.slot}<small>${o.items.map(i => i.q + '× ' + i.name).join(', ')}</small></span><b>${rs(o.total)}</b></li>`).join('')}</ul></div>` : '';
}

// Pop-up shown when someone tries to check out without logging in
function popup() {
  const el = document.createElement('div');
  el.className = 'pop'; el.setAttribute('role', 'alertdialog');
  el.innerHTML = '<div class="popbox"><h2>Login is required!</h2><p>Please log in to place your order. Your cart will be kept.</p><div class="popbtns"><button class="btn" data-act="popclose">Cancel</button><button class="btn go" data-act="poplogin">Login</button></div></div>';
  document.body.appendChild(el); el.querySelector('.go').focus();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act;
  if (a === 'popclose') document.querySelector('.pop').remove();
  else if (a === 'poplogin') location.href = 'login.html?next=order.html';
  else if (a === 'slot') { slot = t.dataset.v; view(); }
  else if (a === 'coupon') applyCode(t.dataset.v);
  else if (a === 'place') {
    if (!me) { popup(); return; }  // cart is saved, so it survives login
    const r = slotRule(), err = m => { $('#err').textContent = m; };
    if (r.clash) return err('Order dinner items separately.');
    if (!slot) return err('Please choose a pickup time.');
    const b = bill(code);
    placed = { token: 100 + Math.floor(Math.random() * 900), slot, total: b.total, items: b.items.map(i => ({ name: i.m.name, q: i.q, price: i.m.price })) };
    b.items.forEach(i => i.m.stock -= i.q); saveStock();
    store.set('cafeOrders', [...store.get('cafeOrders', []), { ...placed, email: me.email }]);
    cart = {}; store.set('cafeCart2', cart); store.set('cafeCoupon', ''); renderTop(); view(); history(); window.scrollTo(0, 0);
  }
});
document.addEventListener('submit', e => { if (e.target.id === 'cform') { e.preventDefault(); applyCode($('#ccode').value); } });

view(); history();
