// shop.js — Premium Catalog with Cinematic Book Reveal & Decision Feedback

(function () {
  const user = requireAuth('customer');
  if (!user) return;

  const navbarUser = document.getElementById('navbarUser');
  const shopInterface = document.getElementById('shopInterface');
  const productGrid = document.getElementById('productGrid');
  const categoryNav = document.getElementById('categoryNav');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartItemsContainer = document.getElementById('cartItems');
  const historyItemsContainer = document.getElementById('historyItems');
  const processedItemsContainer = document.getElementById('processedItems');
  const cartDrawer = document.getElementById('cartDrawer');

  let cart = JSON.parse(localStorage.getItem('nexbazaar_cart') || '[]');

  // ── Initialization ────────────────────────────────────────────
  renderNavUser(user, navbarUser);
  updateCartUI();
  initGSAP();
  initGroceryGalaxy();

  if (user.status === 'approved') {
    fetchCategories();
    fetchProducts();
    fetchOrderHistory(); 
  } else if (user.status === 'pending') {
    document.getElementById('pendingState').classList.remove('hidden');
    document.getElementById('revealGroup').classList.add('hidden');
  }

  // ── GSAP Cinematic Reveal ──────────────────────────────────────
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".shop-hero", start: "top top", end: "bottom center", scrub: true } });
    tl.to(".shop-hero h1", { scale: 0.8, opacity: 0, y: -50 }).to(".shop-hero p", { opacity: 0, y: -30 }, 0).to(".scroll-hint", { opacity: 0 }, 0);
    gsap.to("#shopInterface", { opacity: 1, rotateX: 0, translateY: 0, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: "#revealGroup", start: "top 80%", end: "top 20%", scrub: 1 } });
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50, y = (e.clientY / window.innerHeight - 0.5) * 50;
      gsap.to(".bg-mesh", { x, y, duration: 2, ease: "power2.out" });
    });
  }

  // ── Grocery Galaxy Background ──────────────────────────────────
  function initGroceryGalaxy() {
    const canvas = document.getElementById('bgCanvas'), ctx = canvas.getContext('2d');
    let items = [], dots = [], mouse = { x: null, y: null };
    const icons = ['🍎', '🥦', '🥛', '🍞', '🧀', '🍌', '🌽', '🥑', '🍩', '🍫', '🍷', '🍕'];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    resize();
    class Dot {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2; this.color = Math.random() > 0.5 ? '#0071e3' : '#ffd60a'; this.alpha = Math.random() * 0.3; this.speed = Math.random() * 0.2 + 0.05; }
      update() { this.y -= this.speed; if (this.y < -10) this.y = canvas.height + 10; }
      draw() { ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
    }
    class FloatingItem {
      constructor() { this.reset(); }
      reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.icon = icons[Math.floor(Math.random() * icons.length)]; this.size = Math.random() * 20 + 20; this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = (Math.random() - 0.5) * 0.3; this.rotation = Math.random() * Math.PI * 2; this.rotationSpeed = (Math.random() - 0.5) * 0.01; this.alpha = Math.random() * 0.15 + 0.05; }
      update() {
        this.x += this.speedX; this.y += this.speedY; this.rotation += this.rotationSpeed;
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) { const force = (200 - dist) / 200; this.x -= dx * force * 0.02; this.y -= dy * force * 0.02; }
        }
        if (this.x < -50) this.x = canvas.width + 50; if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50; if (this.y > canvas.height + 50) this.y = -50;
      }
      draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation); ctx.globalAlpha = this.alpha; ctx.font = `${this.size}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(this.icon, 0, 0); ctx.restore(); }
    }
    for (let i = 0; i < 150; i++) dots.push(new Dot());
    for (let i = 0; i < 25; i++) items.push(new FloatingItem());
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); dots.forEach(d => { d.update(); d.draw(); }); items.forEach(it => { it.update(); it.draw(); }); requestAnimationFrame(animate); }
    animate();
  }

  // ── Data Fetching ─────────────────────────────────────────────
  async function fetchCategories() {
    const res = await fetch(`${BACKEND_URL}/api/products/categories`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` } });
    const cats = await res.json();
    cats.forEach(cat => {
      const b = document.createElement('button'); b.className = 'cat-pill'; b.innerText = cat;
      b.onclick = () => filterCategory(cat, b); categoryNav.appendChild(b);
    });
  }

  async function fetchProducts(category = null) {
    productGrid.innerHTML = Array(8).fill('<div class="skeleton-card"></div>').join('');
    let url = `${BACKEND_URL}/api/products${category ? `?category=${encodeURIComponent(category)}` : ''}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` } });
    renderProducts(await res.json());
  }

  async function fetchOrderHistory() {
    if (!historyItemsContainer) return;
    historyItemsContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>';
    if (processedItemsContainer) processedItemsContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>';
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders?cb=${Date.now()}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` } });
      const orders = await res.json();
      
      const pending = orders.filter(o => o.status === 'pending');
      const processed = orders.filter(o => o.status !== 'pending');
      
      renderHistory(pending, historyItemsContainer, '#ff9500', 'Awaiting Approval');
      renderHistory(processed, processedItemsContainer, '#0071e3', 'Decision Received');
    } catch (err) { console.error('History load failed'); }
  }

  // ── Rendering ─────────────────────────────────────────────────
  function renderProducts(products) {
    productGrid.innerHTML = '';
    products.forEach((p, index) => {
      const cardWrap = document.createElement('div'); cardWrap.className = 'card-perspective';
      cardWrap.innerHTML = `
        <div class="premium-card" id="p-${p._id}">
          <div class="card-img-container">
            <img src="${p.image}" class="card-img" onload="this.style.opacity=1" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div class="img-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-size:40px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.2);">📦</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${p.name}</h3>
            <div class="card-footer"><span class="card-price">₹${p.price}</span><button class="add-btn" onclick="addToCart('${p._id}', '${p.name}', ${p.price}, '${p.image}')">+</button></div>
          </div>
        </div>
      `;
      productGrid.appendChild(cardWrap);
      const card = cardWrap.querySelector('.premium-card');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (e.clientY - rect.top - rect.height / 2) / 30, rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 30;
        gsap.to(card, { rotateX, rotateY, duration: 0.6, ease: "power2.out" });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power2.out" }));
    });
  }

  function renderHistory(orders, container, color, emptyMsg) {
    if (!container) return;
    if (orders.length === 0) {
      container.innerHTML = `<p style="font-size: 11px; color: rgba(0,0,0,0.4); text-align: center; margin-top: 10px;">No ${emptyMsg.toLowerCase()}.</p>`;
      return;
    }
    container.innerHTML = orders.map(o => {
      const statusColor = o.status === 'approved' ? '#28a745' : (o.status === 'rejected' ? '#dc3545' : '#0071e3');
      const message = o.adminMessage || '';
      const hasMessage = message.trim().length > 0;
      
      return `
        <div style="background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; margin-bottom: 10px; color: ${statusColor}; text-transform: uppercase; letter-spacing: 0.05em;">
            <span>${o.status} — ${new Date(o.createdAt).toLocaleDateString()}</span>
            <span>₹${o.totalAmount}</span>
          </div>
          <div style="font-size: 13px; color: #333; margin-bottom: 12px; line-height: 1.5; font-weight: 500;">
            ${o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
          </div>
          ${hasMessage ? `
            <div style="background: #fff9c4; padding: 14px; border-radius: 12px; font-size: 12px; color: #000; border-left: 4px solid ${statusColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <span style="font-weight: 800; font-size: 10px; display: block; margin-bottom: 6px; color: ${statusColor}; text-transform: uppercase;">Admin Feedback</span>
              <p style="margin: 0; line-height: 1.5; font-weight: 400;">${message}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // ── Logic ─────────────────────────────────────────────────────
  window.filterCategory = (cat, btn) => {
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    gsap.to(window, { scrollTo: { y: "#categoryNav", offsetY: 100 }, duration: 0.8 }); fetchProducts(cat);
  };

  window.toggleCart = (open) => {
    if (open) { cartDrawer.classList.add('open'); fetchOrderHistory(); }
    else cartDrawer.classList.remove('open');
  };

  window.addToCart = (id, name, price, image) => {
    const existing = cart.find(item => item.product === id);
    if (existing) existing.quantity += 1; else cart.push({ product: id, name, price, image, quantity: 1 });
    saveCart(); updateCartUI();
    gsap.fromTo(".cart-float", { scale: 1 }, { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });
  };

  window.updateQty = (id, delta) => {
    const item = cart.find(i => i.product === id); if (!item) return;
    item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(i => i.product !== id);
    saveCart(); updateCartUI();
  };

  function saveCart() { localStorage.setItem('nexbazaar_cart', JSON.stringify(cart)); }
  function updateCartUI() {
    if (!cartCountEl || !cartItemsContainer) return;
    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cart.length === 0) { cartItemsContainer.innerHTML = '<p style="text-align:center; color:#6e6e73; margin-top:20px; font-size: 12px;">Selection is empty.</p>'; cartTotalEl.innerText = '₹0'; return; }
    cartTotalEl.innerText = `₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`;
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/50'">
        <div class="cart-item-info"><p class="cart-item-name">${item.name}</p><p class="cart-item-price">₹${item.price} x ${item.quantity}</p></div>
        <div class="cart-qty-controls"><div class="qty-btn" onclick="updateQty('${item.product}', -1)">-</div><div class="qty-btn" onclick="updateQty('${item.product}', 1)">+</div></div>
      </div>
    `).join('');
  }

  window.submitOrder = async () => {
    const btn = document.getElementById('checkoutBtn'); btn.disabled = true; btn.innerText = 'Transmitting...';
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` },
        body: JSON.stringify({ items: cart.map(i => ({ product: i.product, name: i.name, price: i.price, quantity: i.quantity })), totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) })
      });
      if (res.ok) { alert('Order submitted for approval.'); cart = []; saveCart(); updateCartUI(); fetchOrderHistory(); }
    } catch (err) { alert('Submission failed'); }
    finally { btn.disabled = false; btn.innerText = 'Submit Request'; }
  };
})();
