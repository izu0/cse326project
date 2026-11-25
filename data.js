// Shared data + helpers for all pages (menu, order, login). No libraries.
const TAX = 0.05; // 5% GST on the discounted amount
const img = id => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=600&q=70';
const CATS = ['Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Beverages'];
const HOURS = { Breakfast: '7:30 – 11:00 AM', Lunch: '12:00 – 3:00 PM', Snacks: '11:00 AM – 6:00 PM', Dinner: '7:00 – 10:00 PM', Beverages: 'All day' };
const BREAKS = ['10:30 AM', '11:15 AM', '12:30 PM', '1:15 PM', '2:30 PM', '3:45 PM']; // break timings
const DINNER = ['7:30 PM', '8:15 PM', '9:00 PM', '9:45 PM'];                          // dinner timings
const FULL = ['12:30 PM', '8:15 PM'];                                                  // demo: slots already full
const OFFERS = [
  { code: 'STUDENT10', txt: '10% off on orders above ₹150', type: 'pct', val: 10, min: 150 },
  { code: 'FIRST20', txt: 'Flat ₹20 off on orders above ₹80', type: 'flat', val: 20, min: 80 },
  { code: 'DINNER15', txt: '15% off on orders above ₹250', type: 'pct', val: 15, min: 250 }
];

// One cuisine per day (index 0 = Sunday). '*' on a dish means it is served every day.
const CUISINE = { SI: 'South Indian', NI: 'North Indian', CH: 'Chinese', MU: 'Mughlai', IT: 'Italian' };
const DAY_CUISINE = ['MU', 'IT', 'CH', 'SI', 'NI', 'CH', 'IT'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TODAY = new Date().getDay();
const onDay = (m, day) => m.cu.includes('*') || m.cu.includes(DAY_CUISINE[day]);

// id, name, category, MRP, veg, stock, item discount %, photo, description, cuisines
const MENU = [
  [1, 'Idli Sambar', 'Breakfast', 40, 1, 25, 0, img('1741376509166-cbd74b608f5a'), 'Soft idlis with sambar and chutney.', 'SI'],
  [2, 'Masala Dosa', 'Breakfast', 60, 1, 18, 10, img('1668236543090-82eba5ee5976'), 'Crisp dosa, potato masala, chutneys.', 'SI'],
  [3, 'Idli Vada Plate', 'Breakfast', 55, 1, 0, 0, img('1787024231387-edccb8c44700'), 'Idli and vada on a banana leaf.', 'SI'],
  [4, 'Paper Dosa', 'Breakfast', 55, 1, 14, 0, img('1743517894265-c86ab035adef'), 'Extra-thin crispy dosa with dips.', 'SI'],
  [5, 'Egg Toast', 'Breakfast', 45, 0, 12, 0, img('1465014925804-7b9ede58d0d7'), 'Sunny-side egg on toasted bread.', '*'],
  [6, 'Bread Butter Toast', 'Breakfast', 30, 1, 30, 20, 'https://plus.unsplash.com/premium_photo-1695084221474-ed36627bfaf8?auto=format&fit=crop&w=600&q=70', 'Buttered, toasted slices.', '*'],
  [7, 'South Indian Thali', 'Lunch', 100, 1, 20, 10, img('1625398407796-82650a8c135f'), 'Rice, sambar, curries, curd, papad.', 'SI'],
  [8, 'Veg Curry & Rice', 'Lunch', 80, 1, 15, 0, img('1631452180519-c014fe946bc7'), 'Home-style curry with steamed rice.', 'SI NI'],
  [9, 'Chicken Biryani', 'Lunch', 130, 0, 10, 0, img('1631515243349-e0cb75fb8d3a'), 'Fragrant rice layered with chicken.', 'MU'],
  [10, 'Chicken Curry Rice', 'Lunch', 110, 0, 0, 0, img('1742599361539-f096753d1100'), 'Chicken curry with steamed rice.', 'NI MU'],
  [11, 'Chicken Masala Bowl', 'Lunch', 120, 0, 12, 15, img('1772730064951-89b427965dbc'), 'Creamy chicken masala with mint.', 'NI MU'],
  [12, 'Cheese Pizza', 'Lunch', 110, 1, 12, 0, img('1774806189017-f4c1f2760ad2'), 'Baked pizza with cheese and basil.', 'IT'],
  [13, 'Veg Sandwich', 'Lunch', 45, 1, 20, 0, img('1768257164310-5f53c8d83a4e'), 'Tomato, lettuce, mayo on a bun.', 'IT'],
  [14, 'Veg Noodle Soup', 'Lunch', 70, 1, 15, 0, img('1653697469316-955d5ebe5994'), 'Hot noodle soup with vegetables.', 'CH'],
  [15, 'Chicken Noodles', 'Lunch', 100, 0, 12, 10, img('1706128999187-327ac1ef054e'), 'Noodles with chicken and egg.', 'CH'],
  [16, 'Samosa (2 pcs)', 'Snacks', 30, 1, 40, 0, img('1747008624832-e068ee496908'), 'Crispy samosas with chutney.', '*'],
  [17, 'Veg Burger', 'Snacks', 60, 1, 14, 15, img('1592415499556-74fcb9f18667'), 'Veg patty, tomato, lettuce.', 'IT'],
  [18, 'French Fries', 'Snacks', 50, 1, 30, 0, img('1615485290836-4ebcebf44aaf'), 'Hot, salted, crispy.', '*'],
  [19, 'Veg Momos (6 pcs)', 'Snacks', 60, 1, 3, 0, img('1694923450868-b432a8ee52aa'), 'Steamed dumplings with spicy dip.', 'CH'],
  [20, 'Choco Brownie', 'Snacks', 50, 1, 16, 20, img('1717768024023-73768e73f630'), 'Fudgy chocolate brownie.', '*'],
  [21, 'Ice Cream Cup', 'Snacks', 40, 1, 22, 0, img('1664138218128-2dcf791a9d27'), 'Cold, sweet, two scoops.', '*'],
  [22, 'Dal Makhani & Rice', 'Dinner', 110, 1, 18, 0, img('1788601988466-9f361c34c6cb'), 'Creamy dal, rice, onion salad, bread.', 'NI'],
  [23, 'Chicken Tikka Masala', 'Dinner', 150, 0, 12, 10, img('1772730064970-a7b2735c93b9'), 'Tikka masala served with naan.', 'NI MU'],
  [24, 'Tandoori Platter', 'Dinner', 170, 0, 8, 0, img('1555939594-58d7cb561ad1'), 'Grilled meat and vegetables.', 'MU'],
  [25, 'Margherita Pizza', 'Dinner', 120, 1, 10, 0, img('1762631176795-d500f0472051'), 'Cheese, basil, olive oil.', 'IT'],
  [26, 'Garlic Bread', 'Dinner', 60, 1, 20, 0, img('1625220194771-7ebdea0b70b9'), 'Toasted bread with garlic butter.', 'IT'],
  [27, 'Dosa Dinner Plate', 'Dinner', 80, 1, 14, 0, img('1751560455942-f859f1215826'), 'Dosa with chutneys.', 'SI'],
  [28, 'Set Dosa', 'Dinner', 70, 1, 16, 10, img('1694849789325-914b71ab4075'), 'Dosa, coconut chutney and sambar.', 'SI'],
  [29, 'Egg Fried Rice', 'Dinner', 90, 0, 12, 0, img('1627308595186-e6bb36712645'), 'Fried rice topped with a fried egg.', 'CH'],
  [30, 'Veg Fried Rice', 'Dinner', 80, 1, 14, 0, img('1604543519952-12b7038886c0'), 'Wok-fried rice with vegetables.', 'CH'],
  [31, 'Masala Chai', 'Beverages', 15, 1, 60, 0, img('1761483281120-4fc47bfe3e29'), 'Ginger-cardamom tea.', '*'],
  [32, 'Ginger Tea', 'Beverages', 20, 1, 40, 0, img('1555758933-42f41c02c82f'), 'Strong tea with fresh ginger.', '*'],
  [33, 'Cutting Chai', 'Beverages', 12, 1, 50, 0, img('1753719056010-314f9d2b190d'), 'Half-glass kadak tea.', '*'],
  [34, 'Filter Coffee', 'Beverages', 25, 1, 35, 0, img('1668236482744-b48b28650f12'), 'South Indian decoction coffee.', '*'],
  [35, 'Cappuccino', 'Beverages', 60, 1, 20, 10, img('1717768023941-78186ff7a5d7'), 'Espresso with steamed milk foam.', '*'],
  [36, 'Cold Coffee', 'Beverages', 50, 1, 22, 0, img('1767471716700-2b3aa77b1ab6'), 'Iced coffee with cream.', '*'],
  [37, 'Mango Shake', 'Beverages', 55, 1, 0, 0, img('1655476148304-1d1214683af4'), 'Thick mango milkshake.', '*'],
  [38, 'Orange Juice', 'Beverages', 45, 1, 16, 0, 'https://plus.unsplash.com/premium_photo-1667543228378-ec4478ab2845?auto=format&fit=crop&w=600&q=70', 'Fresh-pressed orange juice.', '*'],
  [39, 'Dal Khichdi', 'Breakfast', 50, 1, 20, 0, img('1630409349416-24884761a307'), 'Rice and lentils, soft and comforting.', 'NI'],
  [40, 'Tawa Paratha', 'Breakfast', 40, 1, 24, 10, img('1780907084874-14d202d39bf1'), 'Flatbread roasted on the tawa, with curd.', 'NI'],
  [41, 'Veg Steamed Dumplings', 'Breakfast', 60, 1, 18, 0, img('1563245372-f21724e3856d'), 'Steamed dumplings with chilli dip.', 'CH'],
  [42, 'Veg Dim Sum Bowl', 'Breakfast', 65, 1, 14, 10, img('1496116218417-1a781b1c416c'), 'Soft dim sum in a light dip.', 'CH'],
  [43, 'Pan-fried Dumplings', 'Breakfast', 65, 1, 12, 0, img('1769610712810-ec91babfccd3'), 'Crisp-bottomed dumplings.', 'CH'],
  [44, 'Butter Croissant', 'Breakfast', 55, 1, 15, 0, img('1692742249337-3bf05e2b1ed7'), 'Flaky, buttery croissants.', 'IT'],
  [45, 'Pancakes with Butter', 'Breakfast', 70, 1, 12, 15, img('1471478108131-9b2335c21611'), 'Fluffy pancake stack with butter.', 'IT'],
  [46, 'Veg Kebab Plate', 'Breakfast', 75, 1, 10, 0, img('1740591872076-ab39ee7edb4a'), 'Grilled veg kebabs with fries.', 'MU'],
  [47, 'Tawa Roti', 'Breakfast', 35, 1, 30, 0, img('1763951718802-39ebd3a4f302'), 'Fresh roti straight off the griddle.', 'MU']
].map(m => ({ id: m[0], name: m[1], cat: m[2], mrp: m[3], veg: !!m[4], stock: m[5], off: m[6], img: m[7], desc: m[8], cu: m[9], price: Math.round(m[3] * (1 - m[6] / 100)) }));

// ---- storage (cart, stock, accounts, session, orders) ----
const $ = s => document.querySelector(s);
const store = {
  get: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
};
const rs = n => '₹' + (Math.round(n * 100) / 100).toFixed(Math.round(n * 100) % 100 ? 2 : 0);
const byId = id => MENU.find(m => m.id === +id);
const stockSaved = store.get('cafeStock2', {});
MENU.forEach(m => { if (m.id in stockSaved) m.stock = stockSaved[m.id]; });
const saveStock = () => store.set('cafeStock2', Object.fromEntries(MENU.map(m => [m.id, m.stock])));

let cart = store.get('cafeCart2', {});         // {id: qty}
let me = store.get('cafeMe', null);            // {name, email} or null
const users = () => { const u = store.get('cafeUsers', null) || [{ name: 'Demo Student', email: 'student@campus.in', pass: 'student123' }]; store.set('cafeUsers', u); return u; };
const cartCount = () => Object.values(cart).reduce((s, q) => s + q, 0);

// Bill: item discounts are already in price; coupon applies on the discounted subtotal; GST on what is left.
function bill(code) {
  const items = Object.keys(cart).map(id => ({ m: byId(id), q: cart[id] }));
  const mrp = items.reduce((s, i) => s + i.m.mrp * i.q, 0);
  const sub = items.reduce((s, i) => s + i.m.price * i.q, 0);
  const o = OFFERS.find(x => x.code === code);
  const coupon = o && sub >= o.min ? (o.type === 'pct' ? sub * o.val / 100 : o.val) : 0;
  const taxable = sub - coupon, tax = taxable * TAX;
  return { items, mrp, sub, itemSave: mrp - sub, coupon, tax, total: taxable + tax, count: cartCount(), offer: o };
}

// Add / stepper control for one item; same markup on menu and order pages
function ctl(m) {
  const q = cart[m.id] || 0;
  if (!m.stock) return `<div class="cc" data-id="${m.id}"><button class="btn" disabled>Sold out</button></div>`;
  if (!q) return `<div class="cc" data-id="${m.id}"><button class="btn" data-act="add" data-id="${m.id}">Add</button></div>`;
  return `<div class="cc" data-id="${m.id}"><div class="stepper">
    <button data-act="sub" data-id="${m.id}" aria-label="Remove one ${m.name}">−</button><span>${q}</span>
    <button data-act="add" data-id="${m.id}" aria-label="Add one ${m.name}" ${q >= m.stock ? 'disabled' : ''}>+</button></div></div>`;
}
function change(id, d) {
  const m = byId(id), q = Math.max(0, Math.min(m.stock, (cart[id] || 0) + d));
  if (q) cart[id] = q; else delete cart[id];
  store.set('cafeCart2', cart);
  document.querySelectorAll(`.cc[data-id="${id}"]`).forEach(el => el.outerHTML = ctl(m));
  const n = $('#cn'); if (n) n.textContent = cartCount() || '';
  if (typeof onCartChange === 'function') onCartChange();
}

// Top bar on every page
function renderTop() {
  $('#top').innerHTML = `<div class="wrap tbar"><a class="brand" href="index.html">Campus <b>Bites</b></a>
    <nav><a href="index.html">Menu</a><a href="order.html">Cart <b id="cn" class="cn">${cartCount() || ''}</b></a>
    ${me ? `<span class="hi">Hi, ${me.name.split(' ')[0]}</span><button class="out" data-act="logout">Logout</button>` : `<a class="login-link" href="login.html">Login</a>`}</nav></div>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  if (t.dataset.act === 'logout') { me = null; store.set('cafeMe', null); location.reload(); }
  else if (t.dataset.act === 'add') change(t.dataset.id, 1);
  else if (t.dataset.act === 'sub') change(t.dataset.id, -1);
});
// Hide photos that fail to load (card keeps its tinted background)
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);
renderTop();
