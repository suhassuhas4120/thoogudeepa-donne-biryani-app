# 🍗 Thoogudeepa Donne Biryani Mane - All-in-One Restaurant Suite

A production-ready, full-stack digital restaurant operating system built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand**. 

This system powers a modern dine-in restaurant with **4 interconnected, synchronized real-time applications** across mobile, tablet, and desktop viewports, along with an interactive wireframes design system.

---

## 🌟 Live Deployed Demonstrations

| Section | Portal Description | Live Deployed URL |
| :--- | :--- | :--- |
| **Customer App** | 12-Screen Self-Ordering, Live Tracking, UPI Bill Pay | [Open Customer App](https://thoogudeepa-donne-biryani.surge.sh/) |
| **Kitchen Display (KDS)** | 3-Screen Tablet Station, 70/30 Matrix, 4-Stage Steppers, 86 Sync | [Open Kitchen KDS](https://thoogudeepa-donne-biryani.surge.sh/kitchen/) |
| **Waiter / Captain** | 10-Screen Table Management, Mobile & Tablet Modes, POS Punch | [Open Waiter Suite](https://thoogudeepa-donne-biryani.surge.sh/waiter/) |
| **Manager Portal** | 16-Screen Executive HQ, Floor Map, POS, CRM, Day-Close Z-Report | [Open Manager HQ](https://thoogudeepa-donne-biryani.surge.sh/manager/) |
| **Wireframes Suite** | Complete Interactive Wireframe Skeletons for All 4 Roles | [Open Wireframes](https://customer-journey-wireframes.surge.sh/) |
| **Manager Wireframes** | 16 Manager Wireframes with Stage View & 16-Grid Gallery | [Open Manager Wireframes](https://customer-journey-wireframes.surge.sh/manager-skeletons.html) |

---

## 🚀 Quick Start (Running Locally in 2 Minutes)

### Prerequisites
- **Node.js**: v18.0.0 or higher installed on your computer.
- **Terminal / Command Prompt** (Windows PowerShell, CMD, macOS Terminal, or Linux Bash).

### 1. Run the Full Next.js 15 Application (Recommended)
The full modern web application is located inside the `customer-next` directory.

```bash
# 1. Navigate to customer-next directory
cd customer-next

# 2. Install dependencies (safe, clean install)
npm install

# 3. Start development server
npm run dev
```

Now open your browser to:
- 📱 **Customer Portal**: `http://localhost:3001/`
- 🍳 **Kitchen Display (KDS)**: `http://localhost:3001/kitchen/`
- 🤵 **Waiter / Captain Suite**: `http://localhost:3001/waiter/`
- 💼 **Manager Command Center**: `http://localhost:3001/manager/`

> **Note on Port**: The project defaults to port `3001` to prevent conflicts with other services. You can also run `npm run build` to verify the TypeScript compilation and export static HTML if needed.

### 2. Run with One-Click Scripts (Zero Configuration)
- **Windows Users**: Simply double-click `RUN_PROJECT.bat` in the root folder!
- **macOS / Linux Users**: Run `bash RUN_PROJECT.sh` in the root folder!

### 3. Open Standalone Wireframes (Zero Installation Required)
All wireframes are pure static HTML/CSS/JS with zero external dependencies!
Simply open any of the following files directly in any web browser (Chrome, Safari, Edge, Firefox):
- `deploy_skeletons/index.html` (Customer Journey wireframes)
- `deploy_skeletons/kitchen-skeletons.html` (Kitchen KDS wireframes)
- `deploy_skeletons/waiter-skeletons.html` (Waiter Mobile & Tablet wireframes)
- `deploy_skeletons/manager-skeletons.html` (Manager 16-Screen wireframes)

### 4. Run the Lightweight Node/WebSocket Server
For real-time WebSocket multi-client synchronization testing:
```bash
npm install
node server.js
```
Visit `http://localhost:3000` in your browser.

---

## ⚡ The 4 Interconnected Portals & Screen Matrix

All 4 portals are **logically interconnected in real time** through a shared reactive state store (`useSharedBridge.ts`). Changes made in one portal instantly reflect across the other three!

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHARED REAL-TIME BRIDGE                         │
│                           (useSharedBridge.ts)                         │
└──────┬──────────────────┬────────────────────┬──────────────────┬──────┘
       │                  │                    │                  │
       ▼                  ▼                    ▼                  ▼
┌──────────────┐   ┌──────────────┐     ┌──────────────┐   ┌──────────────┐
│   CUSTOMER   │   │   KITCHEN    │     │    WAITER    │   │   MANAGER    │
│  (12 Screens)│   │  (3 Screens) │     │  (10 Screens)│   │  (16 Screens)│
└──────────────┘   └──────────────┘     └──────────────┘   └──────────────┘
```

### 1. 📱 Customer Self-Ordering App (12 Screens)
*Route: `/app/page.tsx` | Components: `components/screens/`*
1. **Screen 1 - Splash & Table Welcome**: Table QR recognition (Table 4, Hall Section), language switcher (English, Kannada), party size selection.
2. **Screen 2 - Dynamic Menu**: Category tabs (Donne Biryani, Starters, Kebabs, Desserts, Beverages), dietary filters (Non-Veg, Halal, Veg), live search, spice level indicators.
3. **Screen 3 - Dish Customization**: Portion sizing (Regular, Large, Family Pack), spice level tuning, addon selection (Extra Salna, Boiled Egg, Raita, Ghee Roast), special kitchen instructions.
4. **Screen 4 - Smart Cart & Review**: Order summary, dynamic GST (5%) calculation, packaging fee toggle, applied coupon discounts, order confirmation modal.
5. **Screen 5 - Live KDS Order Tracking**: Step-by-step progress bar (Order Placed ➔ Kitchen Preparing ➔ Plated ➔ Served), live prep timer countdown, chef note banner.
6. **Screen 6 - Bill Summary & Split Bill**: Itemized breakdown, split bill calculator (Equal split or custom itemized split by diner), tipping options.
7. **Screen 7 - Instant UPI & Card Payment**: Dynamic QR code for PhonePe/GooglePay/Paytm, UPI Intent button, card and cash settlement options.
8. **Screen 8 - Digital Bill Receipt**: Official GST-compliant tax receipt, downloadable PDF/print layout, order reference number, transaction timestamp.
9. **Screen 9 - Table Order History**: Complete timeline of all rounds of orders punched for Table 4 during the current dining session.
10. **Screen 10 - Waiter Call Bell**: One-tap service triggers (Call Waiter, Water Refill, Extra Cutlery, Clean Table, Bill Request) that push real-time audio pings to Captain devices.
11. **Screen 11 - Loyalty & Rewards**: Thoogudeepa Biryani Club points balance, redeemable coupon scratch cards, tier progression.
12. **Screen 12 - Dish & Experience Rating**: Star ratings for food taste, delivery speed, hygiene, and custom feedback comments.

### 2. 🍳 Kitchen Display System - KDS (3 Tablet Screens)
*Route: `/app/kitchen/page.tsx` | Components: `components/kitchen/`*
1. **Screen K1 - Station & PIN Authentication**: Head Chef & station PIN login, station selector (Biryani Station, Tandoor & Grill, Fryer/Curry, Beverage Bar).
2. **Screen K2 - Live 70/30 Table Matrix & Prep Steppers**:
   - **Top 4-Item Bulk Cooking Bar**: Real-time aggregated item counts across all active tables (e.g., "12x Donne Mutton Biryani Cooking").
   - **70% Active Table Grid**: 6 table cards with 4-stage preparation steppers (`1.REC`, `2.PREP`, `3.READY`, `4.SERVED`), elapsed timers, and 1-tap table detail management.
   - **30% Chronological Time Queue**: Orders sequenced by elapsed wait time with color-coded urgency thresholds (<10m green, 10-15m amber, >15m pulsing red).
3. **Screen K3 - Individual Table Order Deep Dive & 86 Item Master**: Detailed dish modifications, ingredient notes, prep delay warnings, and instant 86 sold-out toggles synced across all terminals.

### 3. 🤵 Waiter / Captain Suite (10 Screens - Mobile & Tablet Views)
*Route: `/app/waiter/page.tsx` | Components: `components/waiter/`*
- **Toggle Viewports**: Features a live switch between **Mobile Handheld (390px)** and **Tablet Terminal (768px)** views!
1. **Screen W1 - Captain PIN Login**: Waiter authentication with shift assignment.
2. **Screen W2 - Live Table Floor & Call Feed**: Real-time floor status (Available, Occupied, Billing, Needs Attention) + incoming customer call bell notifications with 1-tap accept/resolve.
3. **Screen W3 - Table Order Details**: Active table bill preview, running orders, kitchen prep status, customer details.
4. **Screen W4 - POS Order Puncher**: High-speed touch menu for captains to punch orders tableside, with instant validation against 86 sold-out items.
5. **Screen W5 - Item Modifiers**: Custom kitchen notes (e.g., "Less spicy", "No coriander", "Serve piping hot").
6. **Screen W6 - Table Merge & Split**: Merge multiple adjacent tables for large family banquets or split orders.
7. **Screen W7 - Table Payment Settlement**: Record cash payments, trigger UPI QR on customer mobile, apply captain discount overrides.
8. **Screen W8 - Bluetooth Thermal Bill Print**: 80mm ESC/POS thermal receipt formatting preview with 1-tap print dispatch.
9. **Screen W9 - Vacate & Table Turn**: Mark dining session complete, release table to Available state, alert housekeeping staff.
10. **Screen W10 - Shift Performance Stats**: Waiter shift analytics (tables served, total revenue collected, tips earned, avg table turn time).

### 4. 💼 Manager Command Center & POS (16 Screens)
*Route: `/app/manager/page.tsx` | Components: `components/manager/`*
- **Two Viewing Modes**:
  - **Stage View**: Focused interactive screen with top navigation bar and live status badges.
  - **16-Screen Gallery Grid**: Simultaneously displays all 16 manager screens side-by-side on desktop displays!
1. **Screen M1 - Manager PIN Login**: Biometric / PIN login with administrative privilege enforcement.
2. **Screen M2 - Executive Live Dashboard**: Top-level KPIs (Today's Gross Sales, Active Tables, Average Order Value, Table Turn Rate, Live KDS Queue, Waiter Status).
3. **Screen M3 - Live Interactive Floor Map**: Visual floor layout (AC Hall, Family Section, Terrace, Garden) with color-coded table occupancy and live bill totals.
4. **Screen M4 - High-Speed Billing POS**: Counter billing terminal, instant table lookup, dynamic item punch, quick tender (Cash, UPI, Card), split payments.
5. **Screen M5 - Menu Master & 86 Sync**: Manage dish prices, toggle availability, edit categories. **Live-synced to Customer & Waiter!**
6. **Screen M6 - Staff Roster & Attendance**: Live clock-in tracking for Captains, Chefs, Helpers, shift assignments, and performance logs.
7. **Screen M7 - Real-time Sales Analytics**: Hourly sales velocity chart, top-selling biryani rankings, revenue breakdown by payment mode.
8. **Screen M8 - Inventory & Raw Stock Control**: Track raw ingredients (Mutton, Country Chicken, Seeraga Samba Rice, Pure Ghee, Spices) with low-stock warnings and reorder levels.
9. **Screen M9 - Customer CRM & Feedback Hub**: Customer profiles, lifetime visit counts, dining feedback sentiments, VIP customer flags.
10. **Screen M10 - Kitchen Efficiency & KOT Analytics**: KDS speed metrics, prep bottlenecks, average preparation time by station.
11. **Screen M11 - Discounts & Promotional Engine**: Manage promo codes (DONNE10, FESTIVE15), happy hour rules, manager discount authorizations.
12. **Screen M12 - Expense & Petty Cash Tracker**: Log daily operational expenses (Dairy delivery, vegetables, ice bags, gas cylinder refills).
13. **Screen M13 - Audit Log & Compliance**: Security trail of critical actions (bill cancellations, item voids, price modifications, drawer openings).
14. **Screen M14 - Hardware & Printer Configuration**: Setup KOT thermal printers, cashier receipt printers, Bluetooth and LAN network status.
15. **Screen M15 - Tax, GST & System Settings**: Configure CGST (2.5%), SGST (2.5%), restaurant name, FSSAI license number, address, currency symbol (₹).
16. **Screen M16 - Day-End Close & Z-Report**: Official end-of-day register closure, physical cash vs POS variance check, one-click PDF/print Z-Report.

---

## 🔗 Real-Time Synchronization Logic

The application uses Zustand (`customer-next/store/useSharedBridge.ts`) for seamless state communication:
- **86 / Sold Out**: When Manager or Kitchen toggles an item (e.g. *Mutton Biryani*) to SOLD OUT, it instantly greys out in Customer Menu and blocks Waiter POS from punching it.
- **Order Placement**: Placing an order from Customer App or Waiter Captain instantly pushes a ticket into Kitchen KDS and updates the Manager Floor Map.
- **Cooking Progress**: When Kitchen Chef marks an order *READY*, Customer Live Tracking updates to "Plated & Ready", and Waiter gets a pickup notification.
- **Service Bells**: Customer tapping "Call Waiter" sends an audible ding and notification badge to Waiter Table Feed.
- **Payment & Vacate**: Settling bill in Waiter or Manager marks the table available and increments Manager Day-End revenue.

---

## 📁 Repository & Folder Structure

```
hospitality-saas-app/
├── customer-next/                # Complete Next.js 15 App
│   ├── app/                      # App Router Pages
│   │   ├── page.tsx              # Customer Self-Ordering App (12 Screens)
│   │   ├── kitchen/page.tsx      # Kitchen Display System (10 Screens)
│   │   ├── waiter/page.tsx       # Waiter/Captain Suite (10 Screens)
│   │   ├── manager/page.tsx      # Manager Command Center (16 Screens)
│   │   ├── globals.css           # Tailwind styles & custom animations
│   │   └── layout.tsx            # Global Root Layout
│   ├── components/               # UI & Screen Components
│   │   ├── screens/              # Customer Screens (Screen1 to Screen12)
│   │   ├── kitchen/              # Kitchen Screens (ScreenK1 to ScreenK10)
│   │   ├── waiter/               # Waiter Screens (Mobile & Tablet W1 to W10)
│   │   ├── manager/              # Manager Screens (ScreenM1 to ScreenM16)
│   │   └── ui/                   # Reusable UI primitives (Buttons, Badges, Sheets)
│   ├── store/                    # State Stores
│   │   ├── useSharedBridge.ts    # Central Reactive Synchronizer
│   │   ├── useCustomerStore.ts   # Customer state
│   │   ├── useCartStore.ts       # Cart & item selection
│   │   ├── useKdsStore.ts        # KDS ticket queue
│   │   ├── useWaiterStore.ts     # Waiter state
│   │   └── useManagerStore.ts    # Manager state
│   ├── types/                    # TypeScript Data Models
│   │   ├── customer.ts
│   │   ├── kitchen.ts
│   │   ├── waiter.ts
│   │   ├── manager.ts
│   │   └── bridge.ts
│   ├── package.json              # Next.js dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── tailwind.config.js        # Restaurant color palette & styling
├── deploy_skeletons/             # Standalone Wireframe Suite (Zero dependencies)
│   ├── index.html                # Customer 12-Screen wireframes
│   ├── kitchen-skeletons.html    # Kitchen 10-Screen wireframes
│   ├── waiter-skeletons.html     # Waiter 10-Screen wireframes
│   └── manager-skeletons.html    # Manager 16-Screen wireframes
├── public/                       # WebSocket Prototype & Assets
│   ├── customer.html
│   ├── kds.html
│   ├── captain.html
│   └── manager.html
├── data/                         # Master Restaurant Data
│   ├── menu.json                 # Authentic Donne Biryani menu items & pricing
│   ├── tables.json               # Restaurant floor tables & layout
│   └── inventory.json            # Ingredient stock levels & thresholds
├── server.js                     # Optional Node.js WebSocket backend
├── RUN_PROJECT.bat               # 1-Click Windows Launcher
├── RUN_PROJECT.sh                # 1-Click Mac/Linux Launcher
├── ARCHITECTURE.md               # Technical Deep Dive & System Design
└── README.md                     # This Guide
```

---

## 🛠️ How to Customize & Extend the Code

### 1. Modifying Menu Items & Prices
Edit `customer-next/data/menu.json` or update the initial state inside `customer-next/store/useSharedBridge.ts`. All prices are configured in INR (₹).

### 2. Changing Restaurant Branding & Theme
- **Restaurant Name**: Update `customer-next/app/layout.tsx` and `customer-next/components/screens/Screen1Splash.tsx`.
- **Colors**: Edit `customer-next/tailwind.config.js` or `customer-next/app/globals.css` (default theme: Amber/Golden biryani hues with Emerald green accents).

### 3. Deploying to Production
You can deploy this project to any host in seconds:
- **Vercel**: Run `npx vercel` inside `customer-next/`.
- **Netlify**: Connect your GitHub repository and set publish directory to `customer-next/.next`.
- **Surge / Static Hosting**: Run `npm run build` inside `customer-next` to generate the static export in `out/`, then run `npx surge out/`.

---

## 📄 License & Credits
Built for **Thoogudeepa Donne Biryani Mane**. Clean, extensible, and modular code architecture ready for production deployment or client handoff.
