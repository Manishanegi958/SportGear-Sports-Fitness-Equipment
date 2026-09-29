/* SportGear - all data lives in JS arrays; localStorage keeps it between visits */

// ---------- Product data ----------
const SHOE = ["7", "8", "9", "10", "11"], CLOTH = ["S", "M", "L", "XL"], NOSIZE = ["One size"];
const products = [
  { id: 1, name: "Pro Running Shoes", brand: "Nike", category: "footwear", sub: "Running Shoes", sport: "Running", price: 129.99, sizes: SHOE, rating: 4.9, icon: "👟", desc: "Lightweight running shoes with maximum cushioning for long road miles." },
  { id: 2, name: "Studded Football Cleats", brand: "Adidas", category: "footwear", sub: "Football Cleats", sport: "Football", price: 99.99, sizes: SHOE, rating: 4.6, icon: "⚽", desc: "Firm-ground cleats with a snug sock fit and sharp traction." },
  { id: 3, name: "Court High Basketball Shoes", brand: "Puma", category: "footwear", sub: "Basketball Shoes", sport: "Basketball", price: 119.99, sizes: SHOE, rating: 4.5, icon: "🏀", desc: "High-top support and grippy outsole for fast cuts on indoor courts." },
  { id: 4, name: "Flex Training Shoes", brand: "Reebok", category: "footwear", sub: "Training Shoes", sport: "Gym", price: 84.5, sizes: SHOE, rating: 4.4, icon: "👟", desc: "Stable heel and flexible forefoot for lifts, circuits and jumps." },
  { id: 5, name: "Club Football Jersey", brand: "Adidas", category: "apparel", sub: "Jerseys & Kits", sport: "Football", price: 79.99, sizes: CLOTH, rating: 4.7, icon: "👕", desc: "Breathable football jersey with moisture-wicking technology." },
  { id: 6, name: "Dry-Fit Training Top", brand: "Nike", category: "apparel", sub: "Training Tops", sport: "Gym", price: 34.99, sizes: CLOTH, rating: 4.3, icon: "🎽", desc: "Soft, quick-drying top that stays light through hard sessions." },
  { id: 7, name: "Windproof Running Jacket", brand: "Puma", category: "apparel", sub: "Jackets & Hoodies", sport: "Running", price: 89, sizes: CLOTH, rating: 4.5, icon: "🧥", desc: "Packable jacket that blocks wind and light rain on cold mornings." },
  { id: 8, name: "Compression Tights", brand: "Reebok", category: "apparel", sub: "Compression Wear", sport: "Gym", price: 44.99, sizes: CLOTH, rating: 4.2, icon: "🩳", desc: "Supportive compression fit that reduces muscle fatigue." },
  { id: 9, name: "Adjustable Dumbbell Set", brand: "Decathlon", category: "gym", sub: "Dumbbells & Kettlebells", sport: "Gym", price: 149, sizes: NOSIZE, rating: 4.8, icon: "🏋️", desc: "Change from 2 kg to 20 kg per hand with a quick-lock dial." },
  { id: 10, name: "Cast Iron Kettlebell 12kg", brand: "Decathlon", category: "gym", sub: "Dumbbells & Kettlebells", sport: "Gym", price: 39.99, sizes: NOSIZE, rating: 4.6, icon: "🔔", desc: "Wide handle, flat base and smooth finish for swings and presses." },
  { id: 11, name: "Non-Slip Yoga Mat", brand: "Reebok", category: "gym", sub: "Yoga Mats", sport: "Yoga", price: 24.99, sizes: NOSIZE, rating: 4.4, icon: "🧘", desc: "6 mm cushioned mat with a textured non-slip surface." },
  { id: 12, name: "Resistance Band Set", brand: "Nike", category: "gym", sub: "Resistance Bands", sport: "Gym", price: 19.99, sizes: NOSIZE, rating: 4.3, icon: "🎗️", desc: "Five bands from light to heavy, with a carry pouch." },
  { id: 13, name: "Match Football", brand: "Adidas", category: "team", sub: "Footballs & Basketballs", sport: "Football", price: 29.99, sizes: NOSIZE, rating: 4.6, icon: "⚽", desc: "Thermally bonded match ball, size 5, holds shape and air." },
  { id: 14, name: "English Willow Cricket Bat", brand: "Puma", category: "team", sub: "Cricket Bats & Balls", sport: "Cricket", price: 139, sizes: NOSIZE, rating: 4.7, icon: "🏏", desc: "Grade 1 willow with a full sweet spot and comfortable pickup." },
  { id: 15, name: "Graphite Tennis Racket", brand: "Decathlon", category: "team", sub: "Tennis Rackets", sport: "Tennis", price: 74.99, sizes: NOSIZE, rating: 4.4, icon: "🎾", desc: "Light graphite frame for power and control at every level." },
  { id: 16, name: "Team Duffel Bag", brand: "Nike", category: "team", sub: "Sports Bags", sport: "Football", price: 49.99, sizes: NOSIZE, rating: 4.5, icon: "🎒", desc: "Large duffel with a ventilated shoe compartment." }
];
const catInfo = {
  footwear: { label: "Footwear", icon: "👟" }, apparel: { label: "Apparel", icon: "👕" },
  gym: { label: "Gym Equipment", icon: "🏋️" }, team: { label: "Team Sports & Accessories", icon: "⚽" }
};
const reviewPool = [
  ["Sanjay", 5, "Great quality, exactly as described."], ["Meera", 4, "Good value. Delivery was quick."],
  ["Kabir", 5, "Used it for a month of daily training. No complaints."], ["Divya", 4, "Solid product, would buy again."]
];

// ---------- State ----------
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
let cart = load("sg_cart", []);        // {id, size, qty}
let wishlist = load("sg_wish", []);    // product ids
let orders = load("sg_orders", []);
let user = load("sg_user", null);      // {name, email}
let addresses = load("sg_addr", []);
let selectedSize = null;
let coupon = false;

const $ = s => document.querySelector(s);
const money = n => "$" + n.toFixed(2);
const find = id => products.find(p => p.id === +id);
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 2200); }
function persist() { save("sg_cart", cart); save("sg_wish", wishlist); save("sg_orders", orders); save("sg_user", user); save("sg_addr", addresses); updateCount(); }
function updateCount() { $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0); $("#accLink").textContent = user ? user.name.split(" ")[0] : "Login"; }

// ---------- Product card ----------
function card(p) {
  return `<article class="pcard">
    <div class="pimg" onclick="location.hash='product/${p.id}'">${p.icon}
      <button class="wish ${wishlist.includes(p.id) ? "on" : ""}" aria-label="Toggle wishlist" onclick="event.stopPropagation();toggleWish(${p.id})">♥</button></div>
    <div class="pbody"><span class="brand">${p.brand} · ${p.sport}</span>
      <a class="pname" href="#product/${p.id}">${p.name}</a>
      <span class="stars">${stars(p.rating)} ${p.rating}</span>
      <span class="price">${money(p.price)}</span>
      <button class="btn small" onclick="quickAdd(${p.id})">Add to cart</button></div></article>`;
}
function toggleWish(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
  persist(); toast(wishlist.includes(id) ? "Added to wishlist" : "Removed from wishlist"); route();
}
function quickAdd(id) { const p = find(id); addToCart(id, p.sizes.length > 1 ? p.sizes[Math.floor(p.sizes.length / 2)] : p.sizes[0]); }
function addToCart(id, size) {
  const line = cart.find(i => i.id === id && i.size === size);
  line ? line.qty++ : cart.push({ id, size, qty: 1 });
  persist(); toast("Added to cart");
}

// ---------- Router ----------
function route() {
  const [page, arg] = (location.hash.slice(1) || "home").split("/");
  const views = { home: 1, shop: 1, product: 1, cart: 1, checkout: 1, account: 1, login: 1, about: 1, contact: 1 };
  const name = views[page] ? page : "home";
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $("#v-" + name).classList.add("active");
  $("#menu").classList.remove("open");
  window.scrollTo(0, 0);
  ({ home: renderHome, shop: () => renderShop(arg), product: () => renderProduct(arg), cart: renderCart,
     checkout: renderCheckout, account: renderAccount, login: () => {}, about: () => {}, contact: () => {} })[name]();
}

// ---------- Home ----------
function renderHome() {
  $("#homeCats").innerHTML = Object.entries(catInfo).map(([k, c]) =>
    `<a class="cat" href="#shop/${k}"><span class="ic">${c.icon}</span><b>${c.label}</b></a>`).join("");
  $("#featured").innerHTML = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4).map(card).join("");
}

// ---------- Shop with filters ----------
const F = { q: "", cat: "all", sport: "all", brand: "all", size: "all", max: 300, sort: "" };
function fillSelect(id, label, values) {
  $(id).innerHTML = `<option value="all">${label}</option>` + values.map(v => `<option>${v}</option>`).join("");
}
function initFilters() {
  fillSelect("#fSport", "All sports", [...new Set(products.map(p => p.sport))].sort());
  fillSelect("#fBrand", "All brands", [...new Set(products.map(p => p.brand))].sort());
  fillSelect("#fSize", "Any", [...new Set(products.flatMap(p => p.sizes).filter(s => s !== "One size"))]);
  const bind = (id, key, ev = "input") => $(id).addEventListener(ev, e => { F[key] = key === "max" ? +e.target.value : e.target.value; renderShop(F.cat === "all" ? undefined : F.cat, true); });
  bind("#fSearch", "q"); bind("#fCat", "cat", "change"); bind("#fSport", "sport", "change"); bind("#fBrand", "brand", "change");
  bind("#fSize", "size", "change"); bind("#fPrice", "max"); bind("#fSort", "sort", "change");
  $("#fReset").onclick = () => { Object.assign(F, { q: "", cat: "all", sport: "all", brand: "all", size: "all", max: 300, sort: "" }); syncControls(); renderShop(undefined, true); };
}
function syncControls() {
  $("#fSearch").value = F.q; $("#fCat").value = F.cat; $("#fSport").value = F.sport; $("#fBrand").value = F.brand;
  $("#fSize").value = F.size; $("#fPrice").value = F.max; $("#fSort").value = F.sort; $("#fPriceVal").textContent = F.max;
}
function renderShop(cat, fromControl) {
  if (!fromControl) { F.cat = catInfo[cat] ? cat : "all"; if (!cat) F.q = F.q; syncControls(); }
  $("#fPriceVal").textContent = F.max;
  const q = F.q.trim().toLowerCase();
  let list = products.filter(p =>
    (F.cat === "all" || p.category === F.cat) && (F.sport === "all" || p.sport === F.sport) &&
    (F.brand === "all" || p.brand === F.brand) && (F.size === "all" || p.sizes.includes(F.size)) &&
    p.price <= F.max && (!q || (p.name + p.brand + p.sub + p.sport).toLowerCase().includes(q)));
  if (F.sort === "low") list.sort((a, b) => a.price - b.price);
  if (F.sort === "high") list.sort((a, b) => b.price - a.price);
  if (F.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  $("#shopTitle").textContent = F.cat === "all" ? "All products" : catInfo[F.cat].label;
  $("#resultCount").textContent = list.length + " product" + (list.length === 1 ? "" : "s");
  $("#shopGrid").innerHTML = list.length ? list.map(card).join("") : `<p>No products match these filters. Try clearing them.</p>`;
}

// ---------- Product detail ----------
function renderProduct(id) {
  const p = find(id); if (!p) { location.hash = "shop"; return; }
  selectedSize = p.sizes.length > 1 ? null : p.sizes[0];
  const rel = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const revs = reviewPool.slice(0, 2 + (p.id % 3));
  $("#productBox").innerHTML = `
    <p class="muted"><a href="#shop">Shop</a> / <a href="#shop/${p.category}">${catInfo[p.category].label}</a> / ${p.name}</p>
    <div class="detail">
      <div class="big">${p.icon}</div>
      <div><span class="brand">${p.brand} · ${p.sub}</span>
        <h2 class="title" style="margin-top:4px">${p.name}</h2>
        <p class="stars">${stars(p.rating)} ${p.rating} (${revs.length * 12} reviews)</p>
        <p class="price" style="font-size:2.2rem">${money(p.price)}</p>
        <p>${p.desc}</p>
        ${p.sizes.length > 1 ? `<b>Select size</b><div class="sizes">${p.sizes.map(s => `<button class="size" onclick="pickSize(this,'${s}')">${s}</button>`).join("")}</div>` : `<div style="height:12px"></div>`}
        <button class="btn" onclick="detailAdd(${p.id})">Add to cart</button>
        <button class="btn line" onclick="toggleWish(${p.id})">${wishlist.includes(p.id) ? "♥ In wishlist" : "♡ Wishlist"}</button>
      </div></div>
    <h3>Customer reviews</h3>
    ${revs.map(r => `<div class="review"><b>${r[0]}</b> <span class="stars">${stars(r[1])}</span><p>${r[2]}</p></div>`).join("")}
    <h2 class="title">Related products</h2><div class="grid">${rel.map(card).join("")}</div>`;
}
function pickSize(btn, s) { document.querySelectorAll(".size").forEach(b => b.classList.remove("on")); btn.classList.add("on"); selectedSize = s; }
function detailAdd(id) { if (!selectedSize) return toast("Please select a size"); addToCart(id, selectedSize); }

// ---------- Cart ----------
function totals() {
  const sub = cart.reduce((s, i) => s + find(i.id).price * i.qty, 0);
  const discount = coupon ? sub * 0.2 : 0;
  const ship = sub - discount > 100 || sub === 0 ? 0 : 6.99;
  const tax = (sub - discount) * 0.05;
  return { sub, discount, ship, tax, total: sub - discount + ship + tax };
}
function totalsHTML(t) {
  return `<div class="totals"><p><span>Subtotal</span><span>${money(t.sub)}</span></p>
    ${t.discount ? `<p><span>Coupon SPORT20</span><span>-${money(t.discount)}</span></p>` : ""}
    <p><span>Shipping</span><span>${t.ship ? money(t.ship) : "Free"}</span></p>
    <p><span>Tax (5%)</span><span>${money(t.tax)}</span></p>
    <p class="grand"><span>Total</span><span>${money(t.total)}</span></p></div>`;
}
function renderCart() {
  if (!cart.length) { $("#cartBox").innerHTML = `<div class="card"><p>Your cart is empty.</p><a class="btn" href="#shop">Start shopping</a></div>`; return; }
  const t = totals();
  $("#cartBox").innerHTML = cart.map((i, idx) => { const p = find(i.id);
    return `<div class="cart-row"><div class="em">${p.icon}</div>
      <div><b>${p.name}</b><br><span class="muted">${p.sizes.length > 1 ? "Size " + i.size + " · " : ""}${money(p.price)}</span></div>
      <div class="qty"><button onclick="changeQty(${idx},-1)" aria-label="Decrease">−</button><b>${i.qty}</b><button onclick="changeQty(${idx},1)" aria-label="Increase">+</button></div>
      <b>${money(p.price * i.qty)}</b><button class="link" onclick="removeItem(${idx})">Remove</button></div>`; }).join("") +
    `<div class="card" style="max-width:420px;margin-left:auto">
      <div class="row" style="grid-template-columns:1fr auto"><input id="couponIn" placeholder="Coupon code"><button class="btn small" onclick="applyCoupon()">Apply</button></div><br>
      ${totalsHTML(t)}<br><a class="btn" href="#${user ? "checkout" : "login"}">Proceed to checkout</a></div>`;
}
function changeQty(i, d) { cart[i].qty += d; if (cart[i].qty < 1) cart.splice(i, 1); persist(); renderCart(); }
function removeItem(i) { cart.splice(i, 1); persist(); renderCart(); }
function applyCoupon() {
  if ($("#couponIn").value.trim().toUpperCase() === "SPORT20") { coupon = true; toast("20% discount applied"); renderCart(); }
  else toast("Invalid coupon code");
}

// ---------- Checkout ----------
function renderCheckout() {
  if (!cart.length) { location.hash = "cart"; return; }
  if (!user) { location.hash = "login"; return; }
  const f = $("#checkoutForm"), a = addresses[0];
  if (a && !f.name.value) { f.name.value = a.name; f.phone.value = a.phone; f.address.value = a.address; f.city.value = a.city; f.zip.value = a.zip; }
  $("#orderSummary").innerHTML = `<h3>Order summary</h3>` + cart.map(i => { const p = find(i.id);
    return `<p style="display:flex;justify-content:space-between"><span>${p.icon} ${p.name} × ${i.qty}</span><span>${money(p.price * i.qty)}</span></p>`; }).join("") + totalsHTML(totals());
}
function togglePayFields() { $("#cardFields").style.display = $("#checkoutForm").pay.value === "Card" ? "block" : "none"; }
function placeOrder(e) {
  e.preventDefault();
  const f = e.target, t = totals(), pay = f.pay.value;
  if (pay === "Card" && f.card.value.replace(/\s/g, "").length !== 16) return toast("Enter a 16-digit card number (demo)");
  const addr = { name: f.name.value, phone: f.phone.value, address: f.address.value, city: f.city.value, zip: f.zip.value };
  if (!addresses.some(x => x.address === addr.address && x.zip === addr.zip)) addresses.unshift(addr);
  const order = { id: "SG" + Date.now().toString().slice(-6), date: new Date().toLocaleDateString(), items: cart.map(i => ({ ...i })), total: t.total, pay, addr, placed: Date.now() };
  orders.unshift(order); cart = []; coupon = false; f.reset(); persist();
  $("#checkoutBox").innerHTML = `<div class="card"><h3>Order placed! 🎉</h3><p>Thanks, ${addr.name}. Your order <b>${order.id}</b> (${money(order.total)}, ${pay}) is confirmed.</p><a class="btn" href="#account">Track order</a></div>`;
  window.scrollTo(0, 0);
}

// ---------- Account ----------
function trackStage(o) { // simulated tracking: advances every 30 seconds
  return Math.min(3, Math.floor((Date.now() - o.placed) / 30000));
}
function renderAccount() {
  if (!user) { location.hash = "login"; return; }
  const steps = ["Confirmed", "Packed", "Shipped", "Delivered"];
  $("#accountBox").innerHTML = `
    <h2 class="title">Hi, ${user.name}</h2>
    <div class="two-col">
      <div>
        <h3>Order history</h3>
        ${orders.length ? orders.map(o => { const s = trackStage(o); return `<div class="card order"><b>${o.id}</b> · ${o.date} · ${money(o.total)}
          <p class="muted">${o.items.map(i => find(i.id).name + " ×" + i.qty).join(", ")}</p>
          <div class="track">${steps.map((x, n) => `<span class="${n <= s ? "done" : ""}">${x}</span>`).join("")}</div></div>`; }).join("") : `<p>No orders yet.</p>`}
        <h3>Wishlist</h3>
        ${wishlist.length ? `<div class="grid">${wishlist.map(id => card(find(id))).join("")}</div>` : `<p>Tap the heart on any product to save it here.</p>`}
      </div>
      <div>
        <div class="card"><h3 style="margin-top:0">Profile</h3><p>${user.name}<br><span class="muted">${user.email}</span></p><button class="btn small" onclick="logout()">Log out</button></div><br>
        <div class="card"><h3 style="margin-top:0">Saved addresses</h3>
          ${addresses.length ? addresses.map(a => `<p>${a.name}, ${a.address}, ${a.city} ${a.zip}</p>`).join("") : `<p class="muted">Addresses you use at checkout are saved here.</p>`}</div>
      </div>
    </div>`;
}
function logout() { user = null; persist(); toast("Logged out"); location.hash = "home"; }

// ---------- Auth (simulated) ----------
function afterLogin() { persist(); toast("Welcome, " + user.name); location.hash = cart.length ? "checkout" : "account"; }
function initAuth() {
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === b));
    $("#loginForm").hidden = b.dataset.tab !== "login"; $("#registerForm").hidden = b.dataset.tab !== "register";
  });
  $("#loginForm").onsubmit = e => { e.preventDefault(); const em = e.target.email.value; user = { name: em.split("@")[0], email: em }; afterLogin(); };
  $("#registerForm").onsubmit = e => { e.preventDefault(); user = { name: e.target.name.value, email: e.target.email.value }; afterLogin(); };
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initFilters(); initAuth(); updateCount();
  $("#burger").onclick = () => $("#menu").classList.toggle("open");
  $("#navSearch").addEventListener("keydown", e => {
    if (e.key === "Enter") { Object.assign(F, { q: e.target.value, cat: "all" }); location.hash = "shop"; renderShop(undefined, true); syncControls(); e.target.value = ""; }
  });
  $("#checkoutForm").addEventListener("submit", placeOrder);
  document.querySelectorAll("#checkoutForm [name=pay]").forEach(r => r.addEventListener("change", togglePayFields));
  $("#contactForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Message sent. We'll reply within 24 hours."); });
  window.addEventListener("hashchange", route);
  route();
});
