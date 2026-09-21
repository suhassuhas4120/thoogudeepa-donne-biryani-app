// Perfected Real-World Customer Dining App Controller
// Dual Language Engine: English & Kannada (Zero Hindi)
(function() {
  'use strict';

  let currentLang = 'en'; // 'en' or 'kn'
  let currentTableId = 'A4';
  let fullState = null;
  let menuList = [];
  let cart = []; // [{ id, name, kannadaName, price, unitPrice, qty, customNote, khata }]
  let activeDietFilter = 'ALL';
  let activeCategory = 'ALL';
  let searchQuery = '';
  let selectedTip = 0;
  let customizingDish = null;
  let customSelectedBasePrice = 0;
  let customAddOnsTotal = 0;
  let ratingStars = 5;

  // Localized Dictionary (English & Kannada ONLY - Strict Zero Hindi)
  const i18n = {
    en: {
      brandTitle: 'ROYAL DINING & TANDOOR',
      brandSub: 'Authentic Indian Clay Oven & Curries',
      callWaiter: 'Call Waiter',
      waterRefill: 'Water Refill',
      bill: 'Bill',
      searchPlaceholder: 'Search dishes, curries, breads...',
      filterAll: 'All Items',
      filterVeg: 'Veg Only',
      filterJain: 'Jain Friendly',
      filterFast: 'Fast Serving (<10m)',
      filterBestseller: 'Bestsellers',
      add: 'ADD',
      customize: 'Customizable',
      expressRoti: 'Order Hot Roti (3m)',
      viewCart: 'View Cart',
      cartTitle: 'Your Table Order',
      cookingNotes: 'Special Cooking Request:',
      tipStaff: 'Say Thanks with a Staff Tip:',
      subtotal: 'Item Total',
      grandTotal: 'To Pay',
      placeOrder: 'Send Order to Kitchen',
      rotiPrompt: 'Select hot tandoor breads for immediate delivery to your table:',
      fireRotiBtn: 'Fire Roti to Tandoor Now',
      billHeader: 'Digital Tax Invoice',
      simulatePayment: 'Confirm Payment Completed',
      feedbackTitle: 'How was your Dining Experience?',
      feedbackSub: 'We hope you relished the royal flavors!',
      feedbackTags: 'What delighted you most?',
      submitFeedback: 'Submit Rating',
      step1: 'Placed',
      step1Sub: 'Received',
      step2: 'Cooking',
      step2Sub: 'In Kitchen',
      step3: 'Plated',
      step3Sub: 'At Pass',
      step4: 'Served',
      step4Sub: 'At Table'
    },
    kn: {
      brandTitle: 'ರಾಜಮನೆತನದ ಊಟ ಮತ್ತು ತಂದೂರ್',
      brandSub: 'ಅಧಿಕೃತ ಭಾರತೀಯ ತಂದೂರ್ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕರ್ರಿಗಳು',
      callWaiter: 'ವೈಟರ್ ಕರೆ',
      waterRefill: 'ನೀರು ಬೇಕು',
      bill: 'ಬಿಲ್',
      searchPlaceholder: 'ಖಾದ್ಯಗಳು, ರೊಟ್ಟಿ, ಕರ್ರಿಗಳನ್ನು ಹುಡುಕಿ...',
      filterAll: 'ಎಲ್ಲವೂ',
      filterVeg: 'ಸಸ್ಯಾಹಾರಿ',
      filterJain: 'ಜೈನ ಆಹಾರ',
      filterFast: 'ಶೀಘ್ರ ಸೇವೆ (<10ನಿ)',
      filterBestseller: 'ಜನಪ್ರಿಯ',
      add: 'ಸೇರಿಸಿ',
      customize: 'ಬದಲಾವಣೆ ಸಾಧ್ಯ',
      expressRoti: 'ಬಿಸಿ ರೊಟ್ಟಿ (3 ನಿಮಿಷ)',
      viewCart: 'ಕಾರ್ಟ್ ವೀಕ್ಷಿಸಿ',
      cartTitle: 'ನಿಮ್ಮ ಮೇಜಿನ ಆದೇಶ',
      cookingNotes: 'ವಿಶೇಷ ಅಡುಗೆ ಸೂಚನೆ:',
      tipStaff: 'ಸಿಬ್ಬಂದಿಗೆ ಧನ್ಯವಾದ ಪೂರ್ವಕ ಟಿಪ್:',
      subtotal: 'ಒಟ್ಟು ಮೊತ್ತ',
      grandTotal: 'ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ',
      placeOrder: 'ಅಡುಗೆ ಮನೆಗೆ ಆದೇಶ ಕಳುಹಿಸಿ',
      rotiPrompt: 'ನಿಮ್ಮ ಮೇಜಿಗೆ ತಕ್ಷಣ ಬಿಸಿ ರೊಟ್ಟಿಗಳನ್ನು ತರಿಸಿಕೊಳ್ಳಿ:',
      fireRotiBtn: 'ತಂದೂರ್‌ಗೆ ತಕ್ಷಣ ಕಳುಹಿಸಿ',
      billHeader: 'ಡಿಜಿಟಲ್ ತೆರಿಗೆ ಇನ್‌ವಾಯ್ಸ್',
      simulatePayment: 'ಪಾವತಿ ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ದೃಢೀಕರಿಸಿ',
      feedbackTitle: 'ನಿಮ್ಮ ಭೋಜನದ ಅನುಭವ ಹೇಗಿತ್ತು?',
      feedbackSub: 'ರಾಜಮನೆತನದ ಊಟ ನಿಮಗೆ ಇಷ್ಟವಾಯಿತೆಂದು ಭಾವಿಸುತ್ತೇವೆ!',
      feedbackTags: 'ನಿಮಗೆ ಹೆಚ್ಚು ಇಷ್ಟವಾದದ್ದು ಏನು?',
      submitFeedback: 'ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ',
      step1: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      step1Sub: 'ದಾಖಲಾಗಿದೆ',
      step2: 'ತಯಾರಾಗುತ್ತಿದೆ',
      step2Sub: 'ಅಡುಗೆ ಮನೆಯಲ್ಲಿ',
      step3: 'ಪ್ಲೇಟಿಂಗ್',
      step3Sub: 'ಪಾಸ್‌ನಲ್ಲಿ ಸಿದ್ಧ',
      step4: 'ತಲುಪಿಸಲಾಗಿದೆ',
      step4Sub: 'ನಿಮ್ಮ ಮೇಜಿಗೆ'
    }
  };

  // Sound Synthesizer via Web Audio API
  function playChime(freq = 587.33, type = 'sine', duration = 0.25) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Toast Notification
  function showToast(msg, icon = '🔔') {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;
    document.getElementById('toastIcon').innerText = icon;
    document.getElementById('toastMessage').innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Cart Persistence Helpers
  function saveCartToStorage() {
    try {
      localStorage.setItem('royal_cart_' + currentTableId, JSON.stringify(cart));
    } catch (e) {}
  }

  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('royal_cart_' + currentTableId);
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      cart = [];
    }
  }

  // Dual Dispatcher (WebSocket + Guaranteed REST Fallback)
  let ws = null;
  function connectWebSocket() {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = protocol + '//' + location.host + '/ws';
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Customer WS Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'INIT_STATE' || data.type === 'STATE_UPDATE') {
          handleStateUpdate(data.state);
        }
      } catch (err) {
        console.error('WS Parse Error:', err);
      }
    };

    ws.onclose = () => {
      setTimeout(connectWebSocket, 2000);
    };
  }

  async function dispatchAction(actionType, payload) {
    const actionObj = { type: actionType, payload };
    // Send over WebSocket in BOTH standard formats for maximum compatibility
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: actionObj, type: actionType, payload }));
    }
    // Also dispatch to REST endpoint to guarantee state persistence
    try {
      await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionObj)
      });
    } catch (e) {
      console.warn('REST dispatch error:', e);
    }
  }

  function handleStateUpdate(state) {
    fullState = state;
    if (state.menu && state.menu.length) {
      menuList = state.menu;
    }
    renderCategoryTabs();
    renderMenu();
    updateTableStatusTracker();
  }

  async function fetchInitialData() {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      handleStateUpdate(data);
    } catch (err) {
      console.error('Fetch state error:', err);
    }
  }

  function initTableFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const tbl = params.get('table');
    if (tbl) {
      currentTableId = tbl.toUpperCase();
    }
    loadCartFromStorage();
    updateTableUI();
  }

  function updateTableUI() {
    const tblObj = fullState ? fullState.tables.find(t => t.id === currentTableId) : null;
    const displayName = tblObj ? tblObj.name : 'Table ' + currentTableId;
    document.getElementById('headerTableLabel').innerText = displayName;
    document.getElementById('billTableAndDate').innerText = displayName + ' | ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Language Toggle
  window.toggleLanguage = function() {
    currentLang = currentLang === 'en' ? 'kn' : 'en';
    const flag = currentLang === 'en' ? '🇬🇧' : '🇮🇳';
    const targetName = currentLang === 'en' ? 'ಕನ್ನಡ' : 'English';
    document.getElementById('langFlag').innerText = flag;
    document.getElementById('langName').innerText = targetName;
    
    applyTranslations();
    renderCategoryTabs();
    renderMenu();
    updateCartUI();
    updateTableStatusTracker();
  };

  function applyTranslations() {
    const t = i18n[currentLang];
    document.getElementById('lblCallWaiter').innerText = currentLang === 'en' ? 'Call Waiter' : 'ವೈಟರ್ ಕರೆ';
    document.getElementById('lblWater').innerText = currentLang === 'en' ? 'Water Refill' : 'ನೀರು ಬೇಕು';
    document.getElementById('lblBill').innerText = currentLang === 'en' ? 'Bill' : 'ಬಿಲ್';
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('lblFilterAll').innerText = t.filterAll;
    document.getElementById('lblFilterVeg').innerText = t.filterVeg;
    document.getElementById('lblFilterJain').innerText = t.filterJain;
    document.getElementById('lblFilterFast').innerText = t.filterFast;
    document.getElementById('lblFilterBestseller').innerText = t.filterBestseller;
    document.getElementById('lblExpressRoti').innerText = t.expressRoti;
    document.getElementById('lblViewCart').innerText = t.viewCart;
    document.getElementById('lblCartTitle').innerText = t.cartTitle;
    document.getElementById('lblCookingNotes').innerText = t.cookingNotes;
    document.getElementById('lblTipStaff').innerText = t.tipStaff;
    document.getElementById('lblSubtotal').innerText = t.subtotal;
    document.getElementById('lblGrandTotal').innerText = t.grandTotal;
    document.getElementById('lblPlaceOrder').innerText = t.placeOrder;
    document.getElementById('lblRotiPrompt').innerText = t.rotiPrompt;
    document.getElementById('lblFireRotiBtn').innerText = t.fireRotiBtn;
    document.getElementById('lblBillHeader').innerText = t.billHeader;
    document.getElementById('lblSimulatePayment').innerText = t.simulatePayment;
    document.getElementById('lblFeedbackTitle').innerText = t.feedbackTitle;
    document.getElementById('lblFeedbackSub').innerText = t.feedbackSub;
    document.getElementById('lblFeedbackTags').innerText = t.feedbackTags;
    document.getElementById('lblSubmitFeedback').innerText = t.submitFeedback;
    
    document.getElementById('lblStep1').innerHTML = t.step1 + '<br><small>' + t.step1Sub + '</small>';
    document.getElementById('lblStep2').innerHTML = t.step2 + '<br><small>' + t.step2Sub + '</small>';
    document.getElementById('lblStep3').innerHTML = t.step3 + '<br><small>' + t.step3Sub + '</small>';
    document.getElementById('lblStep4').innerHTML = t.step4 + '<br><small>' + t.step4Sub + '</small>';
  }

  // Table Service Call
  window.callService = function(type) {
    playChime(660);
    const msg = type === 'WATER' 
      ? (currentLang === 'en' ? 'Water refill requested for ' + currentTableId + '!' : currentTableId + ' ಗೆ ನೀರು ವಿನಂತಿಸಲಾಗಿದೆ!')
      : (currentLang === 'en' ? 'Captain notified to attend Table ' + currentTableId + '!' : currentTableId + ' ಗೆ ಕ್ಯಾಪ್ಟನ್‌ಗೆ ಸೂಚನೆ ಕಳುಹಿಸಲಾಗಿದೆ!');
    
    dispatchAction('CALL_SERVICE', {
      tableId: currentTableId,
      serviceType: type
    });

    showToast(msg, type === 'WATER' ? '💧' : '🔔');
  };

  // Category Tabs
  function renderCategoryTabs() {
    const bar = document.getElementById('categoryTabsBar');
    if (!bar || !menuList.length) return;

    const cats = ['ALL'];
    menuList.forEach(m => {
      const catName = currentLang === 'en' ? m.category : (m.kannadaCategory || m.category);
      if (!cats.includes(catName)) cats.push(catName);
    });

    bar.innerHTML = cats.map(c => {
      const isActive = activeCategory === c;
      const label = c === 'ALL' ? (currentLang === 'en' ? 'All Dishes' : 'ಎಲ್ಲ ಖಾದ್ಯಗಳು') : c;
      return `<button class="cat-chip ${isActive ? 'active' : ''}" onclick="selectCategory('${c}', this)">
        ${getCategoryIcon(c)} ${label}
      </button>`;
    }).join('');
  }

  function getCategoryIcon(cat) {
    if (cat.includes('Starter') || cat.includes('ಸ್ಟಾರ್ಟರ್')) return '🍢';
    if (cat.includes('Handi') || cat.includes('Curry') || cat.includes('ಕರ್ರಿ')) return '🍲';
    if (cat.includes('Bread') || cat.includes('Roti') || cat.includes('ರೊಟ್ಟಿ')) return '🫓';
    if (cat.includes('Biryani') || cat.includes('Rice') || cat.includes('ಬಿರಿಯಾನಿ')) return '🍚';
    if (cat.includes('Dessert') || cat.includes('Sweet') || cat.includes('ಸಿಹಿ')) return '🍨';
    if (cat.includes('Beverage') || cat.includes('Drink') || cat.includes('ಪಾನೀಯ')) return '🍹';
    return '🍽️';
  }

  window.selectCategory = function(cat, btn) {
    activeCategory = cat;
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMenu();
  };

  // Search & Filters
  window.handleSearch = function(val) {
    searchQuery = val.trim().toLowerCase();
    document.getElementById('clearSearchBtn').style.display = searchQuery ? 'block' : 'none';
    renderMenu();
  };

  window.clearSearch = function() {
    searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearchBtn').style.display = 'none';
    renderMenu();
  };

  window.setDietFilter = function(filter, btn) {
    activeDietFilter = filter;
    document.querySelectorAll('.diet-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderMenu();
  };

  // Render Menu
  function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    if (!menuList.length) {
      container.innerHTML = '<div style="text-align:center; padding:40px; color:#71717a;">Loading gourmet menu...</div>';
      return;
    }

    const filtered = menuList.filter(item => {
      if (activeDietFilter === 'VEG' && !item.veg) return false;
      if (activeDietFilter === 'JAIN' && !item.jain) return false;
      if (activeDietFilter === 'FAST' && item.prepTime > 10) return false;
      if (activeDietFilter === 'BESTSELLER' && !item.isBestseller) return false;

      if (activeCategory !== 'ALL') {
        const itemCat = currentLang === 'en' ? item.category : (item.kannadaCategory || item.category);
        if (itemCat !== activeCategory) return false;
      }

      if (searchQuery) {
        const matchName = item.name.toLowerCase().includes(searchQuery);
        const matchKn = (item.kannadaName || '').toLowerCase().includes(searchQuery);
        const matchDesc = (item.desc || '').toLowerCase().includes(searchQuery);
        const matchKnDesc = (item.kannadaDesc || '').toLowerCase().includes(searchQuery);
        const matchCat = (item.category || '').toLowerCase().includes(searchQuery);
        if (!matchName && !matchKn && !matchDesc && !matchKnDesc && !matchCat) return false;
      }

      return true;
    });

    if (!filtered.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:50px 20px;">
          <div style="font-size:40px;">🔍</div>
          <div style="font-size:16px; font-weight:700; color:#cbd5e1; margin-top:8px;">No matching dishes found</div>
          <div style="font-size:12px; color:#71717a; margin-top:4px;">Try selecting another category or clearing filters</div>
        </div>
      `;
      return;
    }

    const groups = {};
    filtered.forEach(item => {
      const catKey = currentLang === 'en' ? item.category : (item.kannadaCategory || item.category);
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(item);
    });

    let html = '';
    for (const [catName, items] of Object.entries(groups)) {
      html += `
        <div class="category-header">
          <h2>${getCategoryIcon(catName)} ${catName}</h2>
          <span class="category-item-count">${items.length} items</span>
        </div>
      `;

      items.forEach(dish => {
        // Calculate total count of this dish in cart
        const dishCartItems = cart.filter(c => c.id === dish.id);
        const totalDishQty = dishCartItems.reduce((s, it) => s + it.qty, 0);

        const title = currentLang === 'en' ? dish.name : (dish.kannadaName || dish.name);
        const subTitle = currentLang === 'en' ? (dish.kannadaName || '') : dish.name;
        const desc = currentLang === 'en' ? dish.desc : (dish.kannadaDesc || dish.desc);
        const hasCustom = dish.customizations && (dish.customizations.spiceLevels || dish.customizations.prepStyle || dish.customizations.addOns);

        html += `
          <div class="dish-card" id="dish_card_${dish.id}">
            <div class="dish-info-col">
              <div class="dish-badges-row">
                <span class="${dish.veg ? 'food-icon-veg' : 'food-icon-nonveg'}"></span>
                ${dish.isBestseller ? '<span class="bestseller-tag">★ Bestseller</span>' : ''}
                ${dish.jain ? '<span class="jain-tag">Jain</span>' : ''}
              </div>
              <div class="dish-title">${title}</div>
              ${subTitle ? `<div class="dish-title-kn">${subTitle}</div>` : ''}
              <div class="dish-desc">${desc}</div>
              <div class="dish-meta-row">
                <span class="dish-price">₹${dish.price}</span>
                <span>•</span>
                <span>${dish.portion || 'Serves 1-2'}</span>
                <span>•</span>
                <span>⭐ ${dish.rating || 4.8}</span>
              </div>
            </div>

            <div class="dish-action-col">
              <div class="dish-img-wrap">
                <img src="${dish.image}" alt="${dish.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400';">
                <div class="prep-time-badge">⏱️ ${dish.prepTime}m</div>
              </div>

              <div class="add-action-wrap">
                ${totalDishQty === 0 ? `
                  <button class="add-btn" onclick="onAddDishClicked('${dish.id}')">
                    + ${currentLang === 'en' ? 'ADD' : 'ಸೇರಿಸಿ'}
                  </button>
                  ${hasCustom ? `<div class="custom-tag-label">${currentLang === 'en' ? 'Customizable' : 'ಬದಲಾವಣೆ ಸಾಧ್ಯ'}</div>` : ''}
                ` : `
                  <div class="qty-stepper">
                    <button class="stepper-btn" onclick="handleMenuCardQtyChange('${dish.id}', -1)">-</button>
                    <span>${totalDishQty}</span>
                    <button class="stepper-btn" onclick="handleMenuCardQtyChange('${dish.id}', 1)">+</button>
                  </div>
                `}
              </div>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  }

  // Add Dish Flow
  window.onAddDishClicked = function(dishId) {
    const dish = menuList.find(m => m.id === dishId);
    if (!dish) return;

    if (dish.customizations && (dish.customizations.spiceLevels || dish.customizations.prepStyle || dish.customizations.addOns)) {
      openCustomizer(dish);
    } else {
      addToCart(dish, 1, '', dish.price);
    }
  };

  window.handleMenuCardQtyChange = function(dishId, delta) {
    const dish = menuList.find(m => m.id === dishId);
    if (!dish) return;

    // If customizable and clicking +, open customizer to allow customized repeats
    if (delta > 0 && dish.customizations && (dish.customizations.spiceLevels || dish.customizations.addOns)) {
      openCustomizer(dish);
      return;
    }

    // Otherwise find existing item in cart
    const items = cart.filter(c => c.id === dishId);
    if (items.length > 0) {
      const target = items[items.length - 1];
      target.qty += delta;
      if (target.qty <= 0) {
        const idx = cart.indexOf(target);
        if (idx !== -1) cart.splice(idx, 1);
      }
      playChime(440);
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  };

  // Customizer Sheet Logic
  function openCustomizer(dish) {
    customizingDish = dish;
    customSelectedBasePrice = dish.price;
    customAddOnsTotal = 0;

    const overlay = document.getElementById('customizerOverlay');
    const title = currentLang === 'en' ? dish.name : (dish.kannadaName || dish.name);
    const knTitle = currentLang === 'en' ? (dish.kannadaName || '') : dish.name;
    document.getElementById('customizerDishTitle').innerText = title;
    document.getElementById('customizerDishKnTitle').innerText = knTitle;

    const body = document.getElementById('customizerBody');
    let html = '';

    // Spice Levels
    if (dish.customizations.spiceLevels) {
      html += `
        <div class="custom-option-group">
          <div class="option-group-title">
            <span>${currentLang === 'en' ? 'Spice Level' : 'ಖಾರದ ಪ್ರಮಾಣ'}</span>
            <span style="font-size:11px; color:#a1a1aa;">Required</span>
          </div>
          ${dish.customizations.spiceLevels.map((sp, idx) => `
            <div class="option-choice-box ${idx === 0 ? 'selected' : ''}" data-extra="${sp.extra || 0}" onclick="selectCustomOption(this, 'spice')">
              <span style="font-size:13px; font-weight:600;">${sp.name}</span>
              <span style="color:#10b981; font-weight:700;">${sp.extra ? '+₹' + sp.extra : 'Free'}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Prep Style
    if (dish.customizations.prepStyle) {
      html += `
        <div class="custom-option-group">
          <div class="option-group-title">
            <span>${currentLang === 'en' ? 'Preparation Style' : 'ತಯಾರಿಕೆಯ ಶೈಲಿ'}</span>
          </div>
          ${dish.customizations.prepStyle.map((ps, idx) => `
            <div class="option-choice-box ${idx === 0 ? 'selected' : ''}" data-extra="${ps.extra || 0}" onclick="selectCustomOption(this, 'prep')">
              <span style="font-size:13px; font-weight:600;">${ps.name}</span>
              <span style="color:#10b981; font-weight:700;">${ps.extra ? '+₹' + ps.extra : 'Free'}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Add-Ons
    if (dish.customizations.addOns) {
      html += `
        <div class="custom-option-group">
          <div class="option-group-title">
            <span>${currentLang === 'en' ? 'Add-Ons & Extras' : 'ಹೆಚ್ಚುವರಿ ಸೇರ್ಪಡೆಗಳು'}</span>
            <span style="font-size:11px; color:#a1a1aa;">Optional</span>
          </div>
          ${dish.customizations.addOns.map(ao => `
            <div class="option-choice-box add-on-choice" data-price="${ao.price}" onclick="toggleAddOnOption(this)">
              <span style="font-size:13px; font-weight:600;">${ao.name}</span>
              <span style="color:#fbbf24; font-weight:700;">+₹${ao.price}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    body.innerHTML = html;
    updateCustomizerTotalDisplay();
    overlay.style.display = 'flex';
  }

  window.selectCustomOption = function(box, groupType) {
    const parent = box.parentElement;
    parent.querySelectorAll('.option-choice-box').forEach(b => b.classList.remove('selected'));
    box.classList.add('selected');
    updateCustomizerTotalDisplay();
  };

  window.toggleAddOnOption = function(box) {
    box.classList.toggle('selected');
    updateCustomizerTotalDisplay();
  };

  function updateCustomizerTotalDisplay() {
    if (!customizingDish) return;
    let total = customizingDish.price;
    const selectedAddOns = document.querySelectorAll('#customizerBody .add-on-choice.selected');
    selectedAddOns.forEach(ao => {
      total += parseInt(ao.getAttribute('data-price')) || 0;
    });
    document.getElementById('customizerTotalBtnPrice').innerText = '₹' + total;
  }

  window.closeCustomizer = function() {
    document.getElementById('customizerOverlay').style.display = 'none';
    customizingDish = null;
  };

  window.confirmCustomization = function() {
    if (!customizingDish) return;
    
    // Calculate final unit price including add-ons
    let unitPrice = customizingDish.price;
    const selectedAddOns = document.querySelectorAll('#customizerBody .add-on-choice.selected');
    selectedAddOns.forEach(ao => {
      unitPrice += parseInt(ao.getAttribute('data-price')) || 0;
    });

    const selectedBoxes = document.querySelectorAll('#customizerBody .option-choice-box.selected');
    const notes = Array.from(selectedBoxes).map(b => b.querySelector('span').innerText).join(', ');

    addToCart(customizingDish, 1, notes, unitPrice);
    closeCustomizer();
  };

  // Cart Operations
  function addToCart(dish, qty = 1, customNote = '', unitPrice = null) {
    playChime(523.25);
    const finalPrice = unitPrice !== null ? unitPrice : dish.price;
    const existing = cart.find(c => c.id === dish.id && c.customNote === customNote && c.price === finalPrice);
    
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        kannadaName: dish.kannadaName || dish.name,
        price: finalPrice,
        qty: qty,
        customNote: customNote,
        khata: dish.khata || 'Tandoor'
      });
    }

    saveCartToStorage();
    updateCartUI();
    renderMenu();
  }

  window.changeCartItemQty = function(idx, delta) {
    if (cart[idx]) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      playChime(440);
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  };

  window.removeCartItem = function(idx) {
    if (cart[idx]) {
      cart.splice(idx, 1);
      playChime(350);
      saveCartToStorage();
      updateCartUI();
      renderMenu();
    }
  };

  function updateCartUI() {
    const cartBar = document.getElementById('floatingCartBar');
    const totalQty = cart.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);

    if (totalQty > 0) {
      cartBar.style.display = 'flex';
      document.getElementById('cartCountLabel').innerText = totalQty + (currentLang === 'en' ? ' Items' : ' ಖಾದ್ಯಗಳು');
      document.getElementById('cartTotalLabel').innerText = '₹' + subtotal;
    } else {
      cartBar.style.display = 'none';
      closeCartDrawer();
    }

    renderCartDrawerList();
  }

  window.openCartDrawer = function() {
    renderCartDrawerList();
    document.getElementById('cartDrawerOverlay').style.display = 'flex';
  };

  window.closeCartDrawer = function() {
    document.getElementById('cartDrawerOverlay').style.display = 'none';
  };

  function renderCartDrawerList() {
    const container = document.getElementById('cartItemsList');
    if (!container) return;

    if (!cart.length) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:#71717a;">Your dining cart is empty</div>';
      return;
    }

    let html = '';
    cart.forEach((it, idx) => {
      const displayName = currentLang === 'en' ? it.name : (it.kannadaName || it.name);
      html += `
        <div class="cart-item-row">
          <div class="cart-item-details">
            <div class="cart-item-name">${displayName}</div>
            ${it.customNote ? `<div class="cart-item-custom-notes">${it.customNote}</div>` : ''}
            <div class="cart-item-price">₹${it.price} × ${it.qty} = ₹${it.price * it.qty}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="qty-stepper" style="width: 75px;">
              <button class="stepper-btn" onclick="changeCartItemQty(${idx}, -1)">-</button>
              <span>${it.qty}</span>
              <button class="stepper-btn" onclick="changeCartItemQty(${idx}, 1)">+</button>
            </div>
            <button style="background:none; border:none; color:#ef4444; font-size:16px; cursor:pointer;" onclick="removeCartItem(${idx})">🗑️</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const cgst = +(subtotal * 0.025).toFixed(2);
    const sgst = +(subtotal * 0.025).toFixed(2);
    const grand = Math.round(subtotal + cgst + sgst + selectedTip);

    document.getElementById('cartSubtotalAmount').innerText = '₹' + subtotal;
    document.getElementById('cartCgstAmount').innerText = '₹' + cgst;
    document.getElementById('cartSgstAmount').innerText = '₹' + sgst;
    document.getElementById('cartTipAmount').innerText = '₹' + selectedTip;
    document.getElementById('tipRow').style.display = selectedTip > 0 ? 'flex' : 'none';
    document.getElementById('cartGrandTotalAmount').innerText = '₹' + grand;
  }

  window.selectTip = function(amount, btn) {
    selectedTip = amount;
    document.querySelectorAll('.tip-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCartDrawerList();
  };

  // Place Order
  window.placeOrder = async function() {
    if (!cart.length) return;

    playChime(784, 'triangle', 0.4);
    const notes = document.getElementById('cookingNoteInput').value;

    const orderPayload = {
      tableId: currentTableId,
      items: cart.map(c => ({
        id: c.id,
        name: c.name,
        kannadaName: c.kannadaName,
        price: c.price,
        qty: c.qty,
        khata: c.khata,
        notes: c.customNote || null
      })),
      voiceMemo: notes ? 'Note: ' + notes : null
    };

    await dispatchAction('FIRE_KOT', orderPayload);

    cart = [];
    saveCartToStorage();
    updateCartUI();
    closeCartDrawer();
    showToast(currentLang === 'en' ? '🔥 Order fired to kitchen successfully!' : '🔥 ಆದೇಶವನ್ನು ಅಡುಗೆ ಮನೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!', '🔥');
    
    // Fetch refreshed state
    setTimeout(fetchInitialData, 300);
  };

  // Express Garam Roti Action
  window.openGaramRotiModal = function() {
    document.getElementById('garamRotiOverlay').style.display = 'flex';
  };

  window.closeGaramRotiModal = function() {
    document.getElementById('garamRotiOverlay').style.display = 'none';
  };

  let fastRotiItem = { id: 'dish_butter_naan', name: 'Butter Naan / ಬೆಣ್ಣೆ ನಾನ್', price: 70, qty: 2 };

  window.selectRotiItem = function(id, name, price, card) {
    fastRotiItem = { id, name, price, qty: parseInt(document.getElementById('fastRotiQty').innerText) || 2 };
    document.querySelectorAll('.roti-card').forEach(c => c.classList.remove('active'));
    if (card) card.classList.add('active');
  };

  window.adjustRotiQty = function(delta) {
    let q = parseInt(document.getElementById('fastRotiQty').innerText) || 2;
    q = Math.max(1, Math.min(10, q + delta));
    document.getElementById('fastRotiQty').innerText = q;
    fastRotiItem.qty = q;
  };

  window.fireFastRoti = async function() {
    playChime(880, 'square', 0.3);
    const rotiPayload = {
      tableId: currentTableId,
      isGaramRoti: true,
      items: [{
        id: fastRotiItem.id,
        name: fastRotiItem.name,
        price: fastRotiItem.price,
        qty: fastRotiItem.qty,
        khata: 'Tandoor'
      }]
    };

    await dispatchAction('FIRE_KOT', rotiPayload);
    closeGaramRotiModal();
    showToast(currentLang === 'en' ? '⚡ 3-Min Garam Roti fired to Bhatti!' : '⚡ 3-ನಿಮಿಷದ ಬಿಸಿ ರೊಟ್ಟಿ ತಂದೂರ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!', '⚡');
    setTimeout(fetchInitialData, 300);
  };

  // ==========================================
  // Real-Time Live Cooking Stepper & Items List
  // ==========================================
  function updateTableStatusTracker() {
    if (!fullState) return;
    const tbl = fullState.tables.find(t => t.id === currentTableId);
    const tracker = document.getElementById('orderTrackerCard');
    if (!tracker) return;

    // Check if table has any KOTs
    const tableKots = fullState.activeKots ? fullState.activeKots.filter(k => k.tableId === currentTableId) : [];

    if (!tbl || (!tbl.kots.length && !tableKots.length && tbl.status === 'VACANT')) {
      tracker.style.display = 'none';
      return;
    }

    tracker.style.display = 'block';

    const latestKot = tableKots.length > 0 ? tableKots[0] : null;
    const kotIdDisplay = latestKot ? '#' + latestKot.id : (tbl.kots.length ? '#' + tbl.kots[tbl.kots.length - 1] : '#ORDER-ACTIVE');
    document.getElementById('trackerKotNumber').innerText = kotIdDisplay + ' ' + (latestKot && latestKot.priority === 'HIGH_PRIORITY' ? '⚡ EXPRESS' : 'ACTIVE');

    const pBar = document.getElementById('stepperProgressBar');
    const s1 = document.getElementById('step1Node');
    const s2 = document.getElementById('step2Node');
    const s3 = document.getElementById('step3Node');
    const s4 = document.getElementById('step4Node');

    [s1, s2, s3, s4].forEach(s => s.className = 'step-node');

    if (tbl.status === 'SERVED') {
      pBar.style.width = '100%';
      s1.classList.add('completed');
      s2.classList.add('completed');
      s3.classList.add('completed');
      s4.classList.add('active');
      document.getElementById('trackerTimeEst').innerText = currentLang === 'en' ? 'Served! Enjoy Feast 🍽️' : 'ತಲುಪಿಸಲಾಗಿದೆ! ಸವಿಯಿರಿ 🍽️';
      document.getElementById('trackerItemSummary').innerText = currentLang === 'en' ? 'All dishes served at table' : 'ಎಲ್ಲ ಖಾದ್ಯಗಳು ಮೇಜಿಗೆ ತಲುಪಿವೆ';
    } else if (tbl.status === 'READY') {
      pBar.style.width = '66%';
      s1.classList.add('completed');
      s2.classList.add('completed');
      s3.classList.add('active');
      document.getElementById('trackerTimeEst').innerText = currentLang === 'en' ? 'Plated & Ready at Pass' : 'ಪ್ಲೇಟಿಂಗ್ ಮುಗಿದಿದೆ (ರವಾನೆಗೆ ಸಿದ್ಧ)';
      document.getElementById('trackerItemSummary').innerText = currentLang === 'en' ? 'Runner on the way to table' : 'ಸರ್ವರ್ ಮೇಜಿನತ್ತ ಬರುತ್ತಿದ್ದಾರೆ';
    } else {
      pBar.style.width = '33%';
      s1.classList.add('completed');
      s2.classList.add('active');
      document.getElementById('trackerTimeEst').innerText = tbl.status === 'GARAM_ROTI' 
        ? (currentLang === 'en' ? '⚡ 3-Min Hot Roti SLA' : '⚡ 3-ನಿಮಿಷದ ಬಿಸಿ ರೊಟ್ಟಿ')
        : (currentLang === 'en' ? 'Cooking in Kitchen' : 'ಅಡುಗೆ ಮನೆಯಲ್ಲಿ ತಯಾರಾಗುತ್ತಿದೆ');
      document.getElementById('trackerItemSummary').innerText = currentLang === 'en' ? 'Clay bhatti & handi simmering' : 'ಬಾಣಸಿಗರು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದಾರೆ';
    }

    // Render Real Item-Level Status Breakdown
    let liveItemsHtml = '';
    tableKots.forEach(k => {
      k.items.forEach(it => {
        let badgeColor = '#0284c7';
        let badgeText = 'Placed';
        if (it.status === 'COOKING') { badgeColor = '#d97706'; badgeText = 'Cooking 🔥'; }
        else if (it.status === 'PLATED') { badgeColor = '#10b981'; badgeText = 'Plated 🍽️'; }

        if (currentLang === 'kn') {
          if (it.status === 'COOKING') badgeText = 'ತಯಾರಾಗುತ್ತಿದೆ 🔥';
          else if (it.status === 'PLATED') badgeText = 'ಪ್ಲೇಟಿಂಗ್ ಮುಗಿದಿದೆ 🍽️';
          else badgeText = 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ';
        }

        const dishName = currentLang === 'en' ? it.name : (it.kannadaName || it.name);
        liveItemsHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0; border-bottom:1px dashed rgba(255,255,255,0.06); font-size:11.5px;">
            <span>${it.qty}x ${dishName}</span>
            <span style="color:${badgeColor}; font-weight:700;">${badgeText}</span>
          </div>
        `;
      });
    });

    const itemsContainer = document.getElementById('trackerLiveItemsBox');
    if (itemsContainer) {
      itemsContainer.innerHTML = liveItemsHtml || '<div style="color:#a1a1aa; font-size:11px;">Preparing dishes...</div>';
    }
  }

  // Digital GST Bill Modal
  window.openBillModal = async function() {
    if (!fullState) return;

    // Fetch fresh state to ensure all items are included
    await fetchInitialData();

    const tableKots = fullState.activeKots ? fullState.activeKots.filter(k => k.tableId === currentTableId) : [];
    let allItems = [];
    tableKots.forEach(k => {
      k.items.forEach(it => {
        const exist = allItems.find(x => x.name === it.name && x.price === it.price);
        if (exist) exist.qty += it.qty;
        else allItems.push({ name: it.name, kannadaName: it.kannadaName, price: it.price || 150, qty: it.qty });
      });
    });

    if (!allItems.length && cart.length) {
      allItems = cart.map(c => ({ name: c.name, kannadaName: c.kannadaName, price: c.price, qty: c.qty }));
    }

    const itemsContainer = document.getElementById('billItemsContainer');
    if (!allItems.length) {
      itemsContainer.innerHTML = '<div style="text-align:center; padding:20px; color:#71717a;">No items ordered yet for this table</div>';
      document.getElementById('billSubtotal').innerText = '₹0';
      document.getElementById('billCgst').innerText = '₹0';
      document.getElementById('billSgst').innerText = '₹0';
      document.getElementById('billGrandTotal').innerText = '₹0';
      document.getElementById('billModalOverlay').style.display = 'flex';
      return;
    }

    let subtotal = 0;
    let html = '';
    allItems.forEach(it => {
      const lineTotal = it.price * it.qty;
      subtotal += lineTotal;
      const title = currentLang === 'en' ? it.name : (it.kannadaName || it.name);
      html += `
        <div class="bill-row" style="color:#ffffff;">
          <span>${title} × ${it.qty}</span>
          <span style="font-weight:700;">₹${lineTotal}</span>
        </div>
      `;
    });
    itemsContainer.innerHTML = html;

    const cgst = +(subtotal * 0.025).toFixed(2);
    const sgst = +(subtotal * 0.025).toFixed(2);
    const totalWithTax = subtotal + cgst + sgst + selectedTip;
    const grand = Math.round(totalWithTax);
    const roundOff = +(grand - totalWithTax).toFixed(2);

    document.getElementById('billSubtotal').innerText = '₹' + subtotal;
    document.getElementById('billCgst').innerText = '₹' + cgst;
    document.getElementById('billSgst').innerText = '₹' + sgst;
    document.getElementById('billTip').innerText = '₹' + selectedTip;
    document.getElementById('billTipRow').style.display = selectedTip > 0 ? 'flex' : 'none';
    document.getElementById('billRoundOff').innerText = (roundOff >= 0 ? '+' : '') + roundOff;
    document.getElementById('billGrandTotal').innerText = '₹' + grand;

    // Dynamic UPI QR
    const upiLink = `upi://pay?pa=royal.dining@hdfcbank&pn=RoyalDining&am=${grand}&cu=INR&tn=Table_${currentTableId}_Bill`;
    document.getElementById('billUpiQrImg').src = '/api/qr?text=' + encodeURIComponent(upiLink);

    document.getElementById('billModalOverlay').style.display = 'flex';
  };

  window.closeBillModal = function() {
    document.getElementById('billModalOverlay').style.display = 'none';
  };

  // UPI Payment Settlement
  window.simulateUpiPayment = async function(appName) {
    playChime(1046.5, 'sine', 0.5);
    closeBillModal();

    const grandText = document.getElementById('billGrandTotal').innerText.replace('₹', '');
    const amount = parseInt(grandText) || 750;

    await dispatchAction('SETTLE_PAYMENT', {
      tableId: currentTableId,
      mode: 'UPI (' + appName + ')',
      amount: amount
    });

    showToast(currentLang === 'en' ? `✅ UPI Payment of ₹${amount} Approved via ${appName}!` : `✅ ${appName} ಮೂಲಕ ₹${amount} UPI ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!`, '✅');

    // Prompt 5-star feedback after 1.5s
    setTimeout(() => {
      openFeedbackModal();
    }, 1500);

    fetchInitialData();
  };

  // 5-Star Feedback
  function openFeedbackModal() {
    document.getElementById('feedbackModalOverlay').style.display = 'flex';
  }

  window.rateExperience = function(stars) {
    ratingStars = stars;
    const starIcons = document.querySelectorAll('#starRatingRow .star-icon');
    starIcons.forEach((s, idx) => {
      if (idx < stars) s.classList.add('filled');
      else s.classList.remove('filled');
    });

    const sentiments = {
      5: currentLang === 'en' ? 'Outstanding! / ಅತ್ಯುತ್ತಮ!' : 'ಅತ್ಯುತ್ತಮ ಊಟ!',
      4: currentLang === 'en' ? 'Very Good / ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ' : 'ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ',
      3: currentLang === 'en' ? 'Average / ಸಾಧಾರಣ' : 'ಸಾಧಾರಣ',
      2: currentLang === 'en' ? 'Needs Improvement' : 'ಸುಧಾರಣೆ ಅಗತ್ಯವಿದೆ',
      1: currentLang === 'en' ? 'Disappointed' : 'ನಿರಾಶಾದಾಯಕ'
    };
    document.getElementById('ratingSentimentText').innerText = sentiments[stars] || '';
  };

  window.toggleTag = function(chip) {
    chip.classList.toggle('active');
  };

  window.submitRating = async function() {
    playChime(880);
    const activeTags = Array.from(document.querySelectorAll('#feedbackTagsContainer .rating-tag-chip.active')).map(c => c.innerText);
    const comments = document.getElementById('feedbackComments').value;

    await dispatchAction('SUBMIT_RATING', {
      tableId: currentTableId,
      rating: ratingStars,
      tags: activeTags,
      comments: comments
    });

    document.getElementById('feedbackModalOverlay').style.display = 'none';
    showToast(currentLang === 'en' ? '❤️ Thank you! Visit us again soon.' : '❤️ ಧನ್ಯವಾದಗಳು! ಮತ್ತೆ ಭೇಟಿ ನೀಡಿ.', '❤️');
  };

  // Table Picker
  window.openTablePickerModal = function() {
    if (!fullState) return;
    const grid = document.getElementById('tablesListGrid');
    grid.innerHTML = fullState.tables.map(t => {
      const isCur = t.id === currentTableId;
      return `
        <div style="background:${isCur ? 'rgba(217, 119, 6, 0.2)' : '#27272a'}; border:1px solid ${isCur ? '#f59e0b' : 'rgba(255,255,255,0.1)'}; border-radius:12px; padding:12px; cursor:pointer; text-align:center;" onclick="switchTable('${t.id}')">
          <div style="font-size:20px;">🍽️</div>
          <div style="font-weight:700; color:#ffffff; font-size:13px; margin-top:4px;">${t.name}</div>
          <div style="font-size:11px; color:#10b981;">${t.section || t.zone} • ${t.capacity || t.seats} seats</div>
        </div>
      `;
    }).join('');

    document.getElementById('tablePickerOverlay').style.display = 'flex';
  };

  window.closeTablePickerModal = function() {
    document.getElementById('tablePickerOverlay').style.display = 'none';
  };

  window.switchTable = function(tableId) {
    currentTableId = tableId;
    loadCartFromStorage();
    updateTableUI();
    closeTablePickerModal();
    updateCartUI();
    updateTableStatusTracker();
    showToast(currentLang === 'en' ? 'Switched to ' + tableId : tableId + ' ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ', '🍽️');
  };

  window.closeModalOnBackdrop = function(event, modalId) {
    if (event.target.id === modalId) {
      document.getElementById(modalId).style.display = 'none';
    }
  };

  // Auto Init
  window.addEventListener('DOMContentLoaded', () => {
    initTableFromUrl();
    fetchInitialData();
    connectWebSocket();
    applyTranslations();
  });

})();
