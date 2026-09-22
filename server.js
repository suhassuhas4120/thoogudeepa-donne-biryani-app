const QRCode = require('qrcode');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Load Data
let menuData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'menu.json'), 'utf8'));
let tablesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tables.json'), 'utf8'));
let inventoryData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'inventory.json'), 'utf8'));

// In-Memory State
let state = {
  property: "Thoogudeepa Donne Biryani Mane",
  shift: "Dinner Rush (18:00 - 23:59 IST)",
  fssaiLic: "10019011002341",
  gstin: "07AAAAA0000A1Z5",
  sacCode: "996331",
  tables: tablesData,
  menu: menuData,
  inventory: inventoryData,
  activeKots: [
    {
      id: "KOT-9801",
      tableId: "A3",
      tableName: "Table A-03",
      time: "20:45",
      status: "COOKING",
      priority: "NORMAL",
      items: [
        { id: "dish_paneer_tikka", name: "Tandoori Paneer Tikka", qty: 1, khata: "Tandoor", status: "COOKING", isJain: false },
        { id: "dish_dal_makhani", name: "Dal Makhani", qty: 1, khata: "Handi", status: "COOKING", isJain: false }
      ]
    }
  ],
  spoilageLogs: [],
  notifications: [
    { id: "n1", time: "21:05", text: "Table A-04 seated (4 covers)", type: "info" }
  ],
  metrics: {
    netSales: 284350,
    grossSales: 298567,
    activeCovers: 184,
    totalSeats: 220,
    revPash: 323.12,
    todayOrders: 142,
    systemCash: 42250,
    physicalCash: 42230,
    spoilageCost: 468
  },
  lastEvent: null
};

// State Snapshot Helper
function getFullState() {
  return state;
}

// Action Dispatcher
function dispatchAction(action) {
  state.lastEvent = action;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });

  switch (action.type) {
    case 'SEAT_TABLE': {
      const { tableId, covers, dietary } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      if (tbl) {
        tbl.status = 'SEATED';
        tbl.covers = covers || 4;
        tbl.dietary = dietary || 'Veg & Jain';
        tbl.dwellMin = 1;
        state.notifications.unshift({
          id: 'n_' + Date.now(),
          time: timeStr,
          text: `Table ${tbl.name} seated with ${tbl.covers} guests (${tbl.dietary})`,
          type: 'info'
        });
      }
      break;
    }

    case 'UPDATE_CART': {
      const { tableId, cartItems } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      if (tbl) {
        tbl.draftCart = cartItems;
      }
      break;
    }

    case 'FIRE_KOT': {
      const { tableId, items, voiceMemo, isGaramRoti } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      const kotId = 'KOT-' + Math.floor(1000 + Math.random() * 9000);
      
      const newKot = {
        id: kotId,
        tableId: tableId,
        tableName: tbl ? tbl.name : tableId,
        time: timeStr,
        status: 'COOKING',
        priority: isGaramRoti ? 'HIGH_PRIORITY' : 'NORMAL',
        voiceMemo: voiceMemo || null,
        items: items.map(it => ({
          ...it,
          status: 'PREPARING',
          jainCertified: !it.jain
        }))
      };

      if (isGaramRoti) {
        state.activeKots.unshift(newKot); // Top of queue
      } else {
        state.activeKots.push(newKot);
      }

      if (tbl) {
        tbl.status = isGaramRoti ? 'GARAM_ROTI' : 'COOKING';
        tbl.kots.push(kotId);
        tbl.draftCart = [];
      }

      // Decrement BOM inventory
      items.forEach(it => {
        const menuItem = state.menu.find(m => m.id === it.id);
        if (menuItem && menuItem.bom) {
          Object.keys(menuItem.bom).forEach(k => {
            if (state.inventory[k]) {
              state.inventory[k].current = Math.max(0, +(state.inventory[k].current - menuItem.bom[k] * it.qty).toFixed(2));
            }
          });
        }
      });

      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: isGaramRoti 
          ? `⚡ GARAM ROTI fired for ${tbl ? tbl.name : tableId} (3-Min SLA)`
          : `KOT ${kotId} fired for ${tbl ? tbl.name : tableId} (${items.length} items)`,
        type: isGaramRoti ? 'purple' : 'success'
      });
      break;
    }

    case 'CERTIFY_JAIN': {
      const { kotId, itemId } = action.payload;
      const kot = state.activeKots.find(k => k.id === kotId);
      if (kot) {
        const it = kot.items.find(i => i.id === itemId);
        if (it) it.jainCertified = true;
      }
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: `✓ Strict Jain certified by Bhatti Ustad for ${kotId}`,
        type: 'success'
      });
      break;
    }

    case 'BUMP_ITEM': {
      const { kotId, itemId } = action.payload;
      const kot = state.activeKots.find(k => k.id === kotId);
      if (kot) {
        const it = kot.items.find(i => i.id === itemId);
        if (it) {
          if (it.status === 'PREPARING') it.status = 'COOKING';
          else if (it.status === 'COOKING') it.status = 'PLATED';
          else it.status = 'PLATED';
        }
        const tbl = state.tables.find(t => t.id === kot.tableId);
        if (kot.items.every(i => i.status === 'PLATED')) {
          kot.status = 'READY_AT_PASS';
          if (tbl) tbl.status = 'READY';
        } else {
          kot.status = 'COOKING';
          if (tbl && tbl.status !== 'GARAM_ROTI') tbl.status = 'COOKING';
        }
      }
      break;
    }

    case 'EXPO_DISPATCH': {
      const { kotId, shelfSlot, runnerName } = action.payload;
      const kot = state.activeKots.find(k => k.id === kotId);
      if (kot) {
        kot.status = 'SERVED';
        kot.shelfSlot = shelfSlot || 'H-2';
        kot.runner = runnerName || 'Rahul';
        kot.items.forEach(i => i.status = 'PLATED');
      }
      const tbl = state.tables.find(t => t.id === (kot ? kot.tableId : null));
      if (tbl) {
        tbl.status = 'SERVED';
      }
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: `Runner ${runnerName || 'Rahul'} served table ${tbl ? tbl.name : 'Table'} from Shelf ${shelfSlot || 'H-2'}`,
        type: 'success'
      });
      break;
    }

    case 'TRIGGER_86': {
      const { ingredientKey, is86 } = action.payload;
      if (state.inventory[ingredientKey]) {
        state.inventory[ingredientKey].is86 = is86;
        if (is86) state.inventory[ingredientKey].current = 0;
      }
      // Cascade to all menu items depending on this ingredient
      state.menu.forEach(m => {
        if (m.bom && m.bom[ingredientKey] !== undefined) {
          m.is86 = is86;
        }
      });
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: is86 
          ? `⚠ CASCADE 86 TRIGGERED: ${ingredientKey} depleted! Dependent menu dishes disabled in 32ms.`
          : `✓ Inventory restored for ${ingredientKey}.`,
        type: 'danger'
      });
      break;
    }

    case 'VOID_ITEM': {
      const { tableId, item, reason, managerPin } = action.payload;
      state.spoilageLogs.unshift({
        id: 'spoil_' + Date.now(),
        time: timeStr,
        tableId,
        itemName: item.name,
        cost: +(item.price * 0.35).toFixed(2),
        reason: reason || 'Quality complaint',
        authorizedBy: 'Manager #M-102 (PIN Authenticated)'
      });
      state.metrics.spoilageCost += +(item.price * 0.35).toFixed(2);
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: `Post-cook void approved: ${item.name} on Table ${tableId}. Charged to Spoilage Khata.`,
        type: 'danger'
      });
      break;
    }

    case 'CALL_SERVICE': {
      const { tableId, serviceType, notes } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      const tableName = tbl ? tbl.name : tableId;
      const serviceName = serviceType === 'WATER' ? 'Water Refill / ನೀರು ಬೇಕು' : 'Captain Assistance / ವೈಟರ್ ಕರೆ';
      
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: `🔔 ${serviceName} requested at ${tableName}${notes ? ' (' + notes + ')' : ''}`,
        type: 'warning'
      });
      break;
    }

    case 'REQUEST_BILL': {
      const { tableId, includeServiceCharge, tip } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      if (tbl) {
        tbl.status = 'BILLED';
        // Compute real consolidated bill from all KOTs for this table
        const tableKots = state.activeKots.filter(k => k.tableId === tableId);
        let subtotal = 0;
        const itemSummary = [];
        tableKots.forEach(k => {
          k.items.forEach(it => {
            const itemTotal = (it.price || 0) * (it.qty || 1);
            subtotal += itemTotal;
            const exist = itemSummary.find(x => x.name === it.name && x.price === it.price);
            if (exist) exist.qty += it.qty;
            else itemSummary.push({ name: it.name, price: it.price, qty: it.qty });
          });
        });
        if (subtotal === 0 && tbl.draftCart && tbl.draftCart.length) {
          tbl.draftCart.forEach(it => {
            subtotal += (it.price || 0) * (it.qty || 1);
            itemSummary.push({ name: it.name, price: it.price, qty: it.qty });
          });
        }
        if (subtotal === 0) subtotal = 750; // Fallback baseline
        let sc = includeServiceCharge ? +(subtotal * 0.05).toFixed(2) : 0;
        let taxable = subtotal + sc;
        let cgst = +(taxable * 0.025).toFixed(2);
        let sgst = +(taxable * 0.025).toFixed(2);
        let tipAmount = tip || 0;
        let gross = taxable + cgst + sgst + tipAmount;
        let roundOff = +(Math.round(gross) - gross).toFixed(2);
        let payable = Math.round(gross);

        tbl.bill = {
          invNo: 'INV/2026/09/' + Math.floor(8000 + Math.random() * 1000),
          items: itemSummary,
          subtotal,
          serviceCharge: sc,
          cgst,
          sgst,
          tip: tipAmount,
          roundOff,
          payable,
          settled: false
        };

        state.notifications.unshift({
          id: 'n_' + Date.now(),
          time: timeStr,
          text: `Bill requested for ${tbl.name}: ₹${payable} (Tax Invoice Generated)`,
          type: 'info'
        });
      }
      break;
    }

    case 'SETTLE_PAYMENT': {
      const { tableId, mode, method, amount } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      if (tbl) {
        const payMode = mode || method || 'UPI';
        if (!tbl.bill) {
          const tableKots = state.activeKots.filter(k => k.tableId === tableId);
          let subtotal = 0;
          tableKots.forEach(k => {
            k.items.forEach(it => { subtotal += (it.price || 0) * (it.qty || 1); });
          });
          const cgst = +(subtotal * 0.025).toFixed(2);
          const sgst = +(subtotal * 0.025).toFixed(2);
          const payable = Math.round(subtotal + cgst + sgst) || 750;
          tbl.bill = {
            invNo: 'INV/2026/09/' + Math.floor(8000 + Math.random() * 1000),
            subtotal: subtotal || 714,
            cgst: cgst || 18,
            sgst: sgst || 18,
            roundOff: 0,
            payable: amount || payable,
            settled: true,
            mode: payMode
          };
        } else {
          tbl.bill.settled = true;
          tbl.bill.mode = payMode;
        }

        tbl.status = 'BILLED'; // Display billed / settled state
        const paidAmount = amount || tbl.bill.payable;
        state.metrics.netSales += paidAmount;
        state.metrics.todayOrders += 1;
        state.metrics.revPash = +(state.metrics.netSales / (state.metrics.totalSeats * 4)).toFixed(2);

        state.notifications.unshift({
          id: 'n_' + Date.now(),
          time: timeStr,
          text: `✓ ${tbl.name} Paid ₹${paidAmount} via ${payMode}. Settlement complete.`,
          type: 'success'
        });
      }
      break;
    }

    case 'CLEAN_TABLE': {
      const { tableId } = action.payload;
      const tbl = state.tables.find(t => t.id === tableId);
      if (tbl) {
        tbl.status = 'VACANT';
        tbl.covers = 0;
        tbl.dwellMin = 0;
        tbl.kots = [];
        tbl.bill = null;
        tbl.draftCart = [];
        state.notifications.unshift({
          id: 'n_' + Date.now(),
          time: timeStr,
          text: `Table ${tbl.name} sanitized & ready for seating.`,
          type: 'info'
        });
      }
      break;
    }

    case 'SUBMIT_RATING': {
      const { tableId, rating, comment } = action.payload;
      state.notifications.unshift({
        id: 'n_' + Date.now(),
        time: timeStr,
        text: rating <= 2 
          ? `🚨 EMERGENCY SENTIMENT ALERT: Table ${tableId} rated ${rating}★ ("${comment}") - Manager paged!`
          : `★ Feedback received for Table ${tableId}: ${rating} Stars ("${comment}")`,
        type: rating <= 2 ? 'danger' : 'success'
      });
      break;
    }

    case 'RESET_DEMO': {
      state.tables = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tables.json'), 'utf8'));
      state.menu = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'menu.json'), 'utf8'));
      state.inventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'inventory.json'), 'utf8'));
      state.activeKots = [];
      state.notifications = [{ id: 'n0', time: timeStr, text: 'Demo environment reset to baseline.', type: 'info' }];
      break;
    }
  }

  broadcastState();
}

// HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // REST API Endpoints
  if (pathname === '/api/qr') {
    const text = parsedUrl.query.text || parsedUrl.query.url || 'http://localhost:3000';
    QRCode.toString(text, { type: 'svg', margin: 1, color: { dark: '#0f172a', light: '#ffffff' } }, (err, svg) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('QR Generation Error: ' + err.message);
      } else {
        res.writeHead(200, { 
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        });
        res.end(svg);
      }
    });
    return;
  }

  if (pathname === '/js/qrcode.min.js') {
    const qrClientPath = path.join(__dirname, 'node_modules/qrcode/build/qrcode.min.js');
    fs.readFile(qrClientPath, (err, data) => {
      if (!err) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('qrcode.min.js not found');
      }
    });
    return;
  }

  if (pathname === '/api/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getFullState()));
    return;
  }

  if (pathname === '/api/action' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const action = JSON.parse(body);
        dispatchAction(action);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, action: action.type }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(PUBLIC_DIR, pathname);

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.ico': 'image/x-icon'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  // Send initial state snapshot
  ws.send(JSON.stringify({ type: 'INIT_STATE', state: getFullState() }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const act = (data && data.action) ? data.action : data;
      if (act && act.type) {
        dispatchAction(act);
      }
    } catch (e) {
      console.error('Invalid WS message:', e.message);
    }
  });
});

function broadcastState() {
  const payload = JSON.stringify({
    type: 'STATE_UPDATE',
    action: state.lastEvent,
    state: getFullState()
  });
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  });
}

server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(` Hospitality SaaS Unified 4-Tier Server Active!`);
  console.log(` Local URL:       http://localhost:${PORT}`);
  console.log(` Customer Mobile: http://localhost:${PORT}/customer.html?table=A4`);
  console.log(` Captain Tablet:  http://localhost:${PORT}/captain.html`);
  console.log(` Kitchen KDS:     http://localhost:${PORT}/kds.html`);
  console.log(` Manager POS:     http://localhost:${PORT}/manager.html`);
  console.log(` Omnichannel:     http://localhost:${PORT}/index.html`);
  console.log(`======================================================`);
});
