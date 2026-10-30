const products = [
  { id: 1, name: "Krem Latte", cat: "keramika", price: 129000, old: 159000, badge: "Hit", img: "cup-1.jpg", desc: "Dog'li krem keramika cup va likopcha. Latte va kapuchino uchun ideal, 300 ml." },
  { id: 2, name: "Kristall Ice", cat: "shisha", price: 99000, old: null, badge: "Yangi", img: "cup-2.jpg", desc: "Ikki qavatli shisha cup. Muzli qahva ham, issiq choy ham qo'lni kuydirmaydi, 350 ml." },
  { id: 3, name: "Terrakota Espresso", cat: "keramika", price: 79000, old: null, badge: null, img: "cup-3.jpg", desc: "Yaltiroq terrakota rangli kichik espresso cup. Kremani mukammal saqlaydi, 90 ml." },
  { id: 4, name: "Jade Matcha", cat: "keramika", price: 149000, old: 179000, badge: "-17%", img: "cup-4.jpg", desc: "Yashil sirli qo'lda yasalgan matcha kosasi. Har biri noyob naqshga ega, 250 ml." },
  { id: 5, name: "Oltin Chinni", cat: "chinni", price: 189000, old: null, badge: "Premium", img: "cup-5.jpg", desc: "Oltin hoshiyali nozik oq chinni cup va likopcha. Bayramona choy marosimi uchun, 220 ml." },
  { id: 6, name: "Tungi Kakao", cat: "keramika", price: 119000, old: null, badge: null, img: "cup-6.jpg", desc: "Chuqur ko'k rangli katta mug. Qishki kakao va uzun suhbatlar uchun, 450 ml." }
];

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const money = n => n.toLocaleString("ru-RU").replace(/,/g, " ") + " so'm";

let cart = JSON.parse(localStorage.getItem("cupora-cart") || "[]");
let likes = JSON.parse(localStorage.getItem("cupora-likes") || "[]");

window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").classList.add("hide");
    document.body.classList.add("loaded");
    setTimeout(() => $$(".hero-stats [data-count]").forEach(countUp), 900);
  }, 1700);
});

const header = $("#header");
const progress = $("#progress");
const toTop = $("#toTop");
const sections = $$("section[id]");
const navLinks = $$(".nav-link");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (y / max) * 100 + "%";
  header.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 700);
  $(".hero-bg").style.translate = `0 ${y * 0.3}px`;

  let current = "home";
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + current));
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const burger = $("#burger");
const nav = $("#nav");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  nav.classList.toggle("open");
});

navLinks.forEach(link =>
  link.addEventListener("click", () => {
    burger.classList.remove("open");
    nav.classList.remove("open");
  })
);

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = +el.dataset.count;
  const duration = 1800;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased).toLocaleString("ru-RU").replace(/,/g, " ") + (p === 1 && target > 100 ? "+" : "");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      $$("[data-count]", entry.target).forEach(countUp);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

function observeReveals() {
  $$(".reveal:not(.visible)").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + "s";
    revealObserver.observe(el);
  });
}

const productsEl = $("#products");

function renderProducts(filter = "all") {
  const list = filter === "all" ? products : products.filter(p => p.cat === filter);
  productsEl.innerHTML = list
    .map(
      (p, i) => `
    <article class="product" style="animation-delay:${i * 0.08}s">
      <div class="product-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="like ${likes.includes(p.id) ? "liked" : ""}" data-like="${p.id}" aria-label="Yoqtirish">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>
        </button>
        <button class="quick-btn" data-quick="${p.id}">Tez ko'rish</button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p>${p.desc.split(".")[0]}.</p>
        <div class="product-foot">
          <span class="price">${p.old ? `<del>${money(p.old)}</del>` : ""}${money(p.price)}</span>
          <button class="add-btn" data-add="${p.id}" aria-label="Savatga qo'shish">+</button>
        </div>
      </div>
    </article>`
    )
    .join("");
}

function setFilter(filter) {
  $$(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === filter));
  renderProducts(filter);
}

$$(".filter").forEach(btn => btn.addEventListener("click", () => setFilter(btn.dataset.filter)));
$$(".footer-filter").forEach(a => a.addEventListener("click", () => setFilter(a.dataset.filter)));

productsEl.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const like = e.target.closest("[data-like]");
  const quick = e.target.closest("[data-quick]");
  if (add) addToCart(+add.dataset.add, 1);
  if (like) toggleLike(+like.dataset.like, like);
  if (quick) openQuick(+quick.dataset.quick);
});

function toggleLike(id, btn) {
  if (likes.includes(id)) {
    likes = likes.filter(x => x !== id);
    showToast("Sevimlilardan olib tashlandi");
  } else {
    likes.push(id);
    showToast("♥ Sevimlilarga qo'shildi");
  }
  btn.classList.toggle("liked");
  localStorage.setItem("cupora-likes", JSON.stringify(likes));
}

function saveCart() {
  localStorage.setItem("cupora-cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id, qty, custom) {
  if (custom) {
    cart.push({ key: "c" + Date.now(), qty: 1, custom });
    saveCart();
    showToast("Shaxsiy cup savatga qo'shildi");
    bumpCount();
    return;
  }
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ key: "p" + id, id, qty });
  saveCart();
  const p = products.find(x => x.id === id);
  showToast(`${p.name} savatga qo'shildi`);
  bumpCount();
}

function bumpCount() {
  const c = $("#cartCount");
  c.classList.remove("bump");
  void c.offsetWidth;
  c.classList.add("bump");
}

function itemData(item) {
  if (item.custom) return { name: "Shaxsiy cup", price: item.custom.price, sub: `${item.custom.colorName} · ${item.custom.sizeName}${item.custom.text ? " · “" + item.custom.text + "”" : ""}` };
  const p = products.find(x => x.id === item.id);
  return { name: p.name, price: p.price, img: p.img, sub: money(p.price) };
}

function renderCart() {
  const box = $("#drawerItems");
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + itemData(i).price * i.qty, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);

  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty"><b>☕</b>Savatingiz hozircha bo'sh</div>`;
    return;
  }

  box.innerHTML = cart
    .map(item => {
      const d = itemData(item);
      const media = d.img
        ? `<img src="${d.img}" alt="${d.name}">`
        : `<div class="cart-swatch" style="--c:${item.custom.color}">✦</div>`;
      return `
      <div class="cart-item">
        ${media}
        <div>
          <h4>${d.name}</h4>
          <small>${d.sub}</small>
          <div class="mini-qty">
            <button data-dec="${item.key}">−</button>
            <span>${item.qty}</span>
            <button data-inc="${item.key}">+</button>
          </div>
        </div>
        <button class="remove" data-remove="${item.key}" aria-label="O'chirish">&times;</button>
      </div>`;
    })
    .join("");
}

$("#drawerItems").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-remove]");
  if (inc) cart.find(i => i.key === inc.dataset.inc).qty++;
  if (dec) {
    const it = cart.find(i => i.key === dec.dataset.dec);
    it.qty--;
    if (it.qty < 1) cart = cart.filter(i => i !== it);
  }
  if (rem) cart = cart.filter(i => i.key !== rem.dataset.remove);
  if (inc || dec || rem) saveCart();
});

const drawer = $("#drawer");
const backdrop = $("#backdrop");

function openDrawer() {
  drawer.classList.add("open");
  backdrop.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeDrawer() {
  drawer.classList.remove("open");
  backdrop.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);

$("#clearCart").addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  saveCart();
  showToast("Savat tozalandi");
});

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Avval savatga cup qo'shing");
    return;
  }
  cart = [];
  saveCart();
  closeDrawer();
  openModal($("#successModal"));
});

let quickId = null;
let quickQty = 1;

function openQuick(id) {
  const p = products.find(x => x.id === id);
  quickId = id;
  quickQty = 1;
  $("#qImg").src = p.img;
  $("#qImg").alt = p.name;
  $("#qCat").textContent = p.cat;
  $("#qName").textContent = p.name;
  $("#qDesc").textContent = p.desc;
  $("#qPrice").textContent = money(p.price);
  $("#qQty").textContent = 1;
  openModal($("#quickModal"));
}

$("#qPlus").addEventListener("click", () => ($("#qQty").textContent = ++quickQty));
$("#qMinus").addEventListener("click", () => {
  if (quickQty > 1) $("#qQty").textContent = --quickQty;
});
$("#qAdd").addEventListener("click", () => {
  addToCart(quickId, quickQty);
  closeModal($("#quickModal"));
});

function openModal(m) {
  m.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeModal(m) {
  m.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$$(".modal").forEach(m => {
  m.addEventListener("click", e => {
    if (e.target === m || e.target.closest("[data-close]")) closeModal(m);
  });
});

const searchOverlay = $("#searchOverlay");
const searchInput = $("#searchInput");
const searchResults = $("#searchResults");

function renderSearch(q = "") {
  const term = q.trim().toLowerCase();
  const list = products.filter(p => (p.name + p.cat).toLowerCase().includes(term));
  searchResults.innerHTML = list.length
    ? list
        .map(p => `<button class="search-item" data-quick="${p.id}"><img src="${p.img}" alt="${p.name}"><div><strong>${p.name}</strong><br><span>${money(p.price)}</span></div></button>`)
        .join("")
    : `<p class="search-empty">Hech narsa topilmadi</p>`;
}

$("#searchBtn").addEventListener("click", () => {
  searchOverlay.classList.add("open");
  renderSearch();
  setTimeout(() => searchInput.focus(), 300);
});

$("#searchClose").addEventListener("click", () => searchOverlay.classList.remove("open"));
searchInput.addEventListener("input", () => renderSearch(searchInput.value));
searchResults.addEventListener("click", e => {
  const item = e.target.closest("[data-quick]");
  if (!item) return;
  searchOverlay.classList.remove("open");
  openQuick(+item.dataset.quick);
});

const builder = { color: "#1c1a19", colorName: "Ko'mir", size: 1, sizeName: "M · 300 ml", extra: 20000, text: "" };
const BASE = 89000;

function updateBuilder() {
  const cup = $("#previewCup");
  cup.style.setProperty("--cup", builder.color);
  cup.style.transform = `scale(${builder.size})`;
  $("#previewText").textContent = builder.text || "CUPORA";
  const price = BASE + builder.extra + (builder.text ? 15000 : 0);
  $("#builderPrice").textContent = money(price);
  return price;
}

$$(".color").forEach(btn =>
  btn.addEventListener("click", () => {
    $$(".color").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    builder.color = btn.dataset.color;
    builder.colorName = btn.dataset.name;
    updateBuilder();
  })
);

$$(".size").forEach(btn =>
  btn.addEventListener("click", () => {
    $$(".size").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    builder.size = +btn.dataset.size;
    builder.sizeName = btn.dataset.name;
    builder.extra = +btn.dataset.price;
    updateBuilder();
  })
);

$("#engrave").addEventListener("input", e => {
  builder.text = e.target.value.trim();
  updateBuilder();
});

$("#builderAdd").addEventListener("click", () => {
  const price = updateBuilder();
  addToCart(null, 1, { ...builder, price });
});

const galleryItems = $$(".g-item");
const lightbox = $("#lightbox");
let lbIndex = 0;

function showLightbox(i) {
  lbIndex = (i + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lbIndex];
  $("#lbImg").src = $("img", item).src;
  $("#lbImg").alt = $("img", item).alt;
  $("#lbCaption").textContent = $("span", item).textContent;
}

galleryItems.forEach((item, i) =>
  item.addEventListener("click", () => {
    showLightbox(i);
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  })
);

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => showLightbox(lbIndex - 1));
$("#lbNext").addEventListener("click", () => showLightbox(lbIndex + 1));
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

const slides = $("#slides");
const slideCount = slides.children.length;
const dotsEl = $("#dots");
let slideIndex = 0;
let slideTimer;

dotsEl.innerHTML = Array.from({ length: slideCount }, (_, i) => `<button class="dot" data-dot="${i}" aria-label="Slayd ${i + 1}"></button>`).join("");

function goSlide(i) {
  slideIndex = (i + slideCount) % slideCount;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
  $$(".dot").forEach((d, k) => d.classList.toggle("active", k === slideIndex));
  clearInterval(slideTimer);
  slideTimer = setInterval(() => goSlide(slideIndex + 1), 5000);
}

$("#prevSlide").addEventListener("click", () => goSlide(slideIndex - 1));
$("#nextSlide").addEventListener("click", () => goSlide(slideIndex + 1));
dotsEl.addEventListener("click", e => {
  const d = e.target.closest("[data-dot]");
  if (d) goSlide(+d.dataset.dot);
});

$$(".acc-head").forEach(head =>
  head.addEventListener("click", () => {
    const item = head.parentElement;
    const wasOpen = item.classList.contains("open");
    $$(".acc-item").forEach(i => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  })
);

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const rules = [
    { el: $("#cName"), ok: v => v.length >= 2, msg: "Ismingizni kiriting" },
    { el: $("#cPhone"), ok: v => /^[+\d\s()-]{9,}$/.test(v), msg: "To'g'ri telefon raqam kiriting" },
    { el: $("#cMsg"), ok: v => v.length >= 5, msg: "Xabar kamida 5 ta belgidan iborat bo'lsin" }
  ];
  let valid = true;
  rules.forEach(r => {
    const field = r.el.parentElement;
    const good = r.ok(r.el.value.trim());
    field.classList.toggle("error", !good);
    $("small", field).textContent = good ? "" : r.msg;
    if (!good) valid = false;
  });
  if (!valid) return;
  e.target.reset();
  showToast("✓ Xabaringiz yuborildi! Tez orada bog'lanamiz");
});

$("#newsForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("#newsEmail").value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showToast("To'g'ri email manzil kiriting");
    return;
  }
  e.target.reset();
  showToast("🎉 Obuna bo'ldingiz! Promokod: CUP10");
});

let toastTimer;

function showToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  closeDrawer();
  closeLightbox();
  searchOverlay.classList.remove("open");
  $$(".modal.open").forEach(closeModal);
});

document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
updateBuilder();
goSlide(0);
observeReveals();
