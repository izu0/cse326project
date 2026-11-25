// Login / register (demo only: accounts are kept in localStorage, passwords are not encrypted).
let mode = 'login';
const next = new URLSearchParams(location.search).get('next') === 'order.html' ? 'order.html' : 'index.html';
if (me) location.replace(next);

document.addEventListener('click', e => {
  const t = e.target.closest('[data-act=mode]'); if (!t) return;
  mode = t.dataset.v;
  $('#lform').classList.toggle('reg', mode === 'reg');
  $('#lgo').textContent = mode === 'reg' ? 'Create account' : 'Login';
  document.querySelectorAll('#lmode button').forEach(b => b.classList.toggle('on', b === t));
  $('#lerr').textContent = '';
});

$('#lform').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, name = f.name.value.trim(), email = f.email.value.trim().toLowerCase(), pass = f.pass.value, list = users();
  const err = m => { $('#lerr').textContent = m; };
  if (!/^\S+@\S+\.\S+$/.test(email)) return err('Enter a valid email.');
  if (pass.length < 6) return err('Password must be at least 6 characters.');
  let user;
  if (mode === 'reg') {
    if (!name) return err('Enter your name.');
    if (list.some(u => u.email === email)) return err('Email already registered. Login instead.');
    user = { name, email, pass }; list.push(user); store.set('cafeUsers', list);
  } else {
    user = list.find(u => u.email === email && u.pass === pass);
    if (!user) return err('Wrong email or password.');
  }
  store.set('cafeMe', { name: user.name, email: user.email });
  location.href = next;
});
