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
1. **Screen 1 - Splash & Table Welcome**: Table QR recognition (Table A-04), language switcher (English, Kannada), party size selection.
2. **Screen 2 - Dynamic Menu**: Category tabs (Dum Biryani, Starters, Kebabs, Desserts, Beverages), dietary filters (Non-Veg, Halal, Veg), live search, spice level indicators, automatic 86 sold-out badges.
3. **Screen 3 - Dish Customization**: Portion sizing (Regular, Large, Family Pack), spice level tuning, addon selection (Extra Salna, Boiled Egg, Raita, Ghee Roast), special kitchen instructions.
4. **Screen 4 - Smart Cart & Review**: Order summary, item quantity stepper, order separately option, confirmation drawer.
5. **Screen 5 - Live KDS Order Tracking**: Step-by-step progress bar (Order Placed ➔ Kitchen Preparing ➔ Plated ➔ Served), live prep status synchronized directly with Kitchen KDS tickets.
6. **Screen 6 - Bill Summary & Split Bill**: Itemized breakdown, split bill calculator (Equal split or custom diner split), tipping options.
7. **Screen 7 - Instant UPI & Card Payment**: Dynamic QR code for PhonePe/GooglePay/Paytm, UPI Intent button, card and cash settlement options.
8. **Screen 8 - Order Confirmation & Reference**: Success status, estimated prep countdown, token number, and transaction receipt ID.
9. **Screen 9 - Digital Tax Bill**: Official GST-compliant tax receipt (2.5% CGST + 2.5% SGST), itemized breakdown, printable 80mm format.
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
2. **Screen W2 - Live Table Floor & Call Feed**: Real-time floor status (Vacant, Occupied, Billing, Cleaning) + incoming customer call bell notifications with 1-tap accept/resolve + Kitchen Ready alerts.
3. **Screen W3 - Table Order Details**: Active table bill preview, running orders, kitchen prep status, customer details.
4. **Screen W4 - POS Order Puncher**: High-speed touch menu for captains to punch orders tableside, with instant validation against 86 sold-out items.
5. **Screen W5 - Item Modifiers & KOT Submit**: Custom kitchen notes, dietary instructions, and 1-tap KOT firing to Kitchen KDS.
6. **Screen W6 - Table Merge & Split**: Merge multiple adjacent tables for large family banquets or split orders.
7. **Screen W7 - Table Payment Settlement**: Record cash payments, trigger UPI QR on customer mobile, apply captain discount overrides.
8. **Screen W8 - Bluetooth Thermal Bill Print**: 80mm ESC/POS thermal receipt formatting preview with 1-tap print dispatch.
9. **Screen W9 - Vacate & Table Turn**: Mark dining session complete, release table to Vacant state, alert housekeeping staff.
10. **Screen W10 - Shift Performance Stats**: Waiter shift analytics (tables served, total revenue collected, tips earned, avg table turn time).

### 4. 💼 Manager Command Center & POS (16 Screens)
*Route: `/app/manager/page.tsx` | Components: `components/manager/`*
- **Two Viewing Modes**:
  - **Stage View**: Focused interactive screen with top navigation bar and live status badges.
  - **16-Screen Gallery Grid**: Simultaneously displays all 16 manager screens side-by-side on desktop displays!
1. **Screen M1 - Manager PIN Login**: PIN authentication with administrative shift selection.
2. **Screen M2 - Executive Live Dashboard**: Top-level live KPIs (Today's Sales, Active Seated Guests, Active KDS KOTs, Floor Occupancy).
3. **Screen M3 - Live Interactive Floor Map**: Visual floor grid (Section A, B, C) with color-coded table occupancy and live bill totals.
4. **Screen M4 - High-Speed Billing POS**: Counter billing terminal, auto-loading table's active items, GST computation, discounts, tender settlement, and 80mm receipt printing.
5. **Screen M5 - Kitchen Speed & KOT Analytics**: KDS speed metrics, prep bottlenecks, average preparation time by station.
6. **Screen M6 - Waiting Queue & Reservations**: Dine-in guest waiting list, table allocation, party size tracker.
7. **Screen M7 - Staff Roster & Attendance**: Live clock-in tracking for Captains, Chefs, Helpers, shift assignments.
8. **Screen M8 - Calls & Alerts Feed**: Customer service requests (water, bill, captain call) timeline and response monitoring.
9. **Screen M9 - Waiter Cash Settlement**: End-of-shift cash drawer balance, tips reconciliation, variance logging.
10. **Screen M10 - Menu 86 Stock Control**: Instant out-of-stock (86) toggle for dishes and ingredients. **Live-synced to Customer & Waiter!**
11. **Screen M11 - Sales Analytics & Reports**: Revenue trends, top-selling biryani items, payment breakdown (UPI vs Cash vs Card).
12. **Screen M12 - Offers & Promotional Rules**: Discount promo rules, coupon validation, happy hour adjustments.
13. **Screen M13 - Petty Cash & Expenses**: Daily miscellaneous operational expenses logging (produce, dairy, ice, gas).
14. **Screen M14 - Attendance & Captain Tips**: Service staff shift hours, tip pool distribution, performance ratings.
15. **Screen M15 - Hardware & Thermal Printer Health**: Network status, paper roll indicators, ESC/POS printer diagnostics.
16. **Screen M16 - Day-End Close & Z-Report**: Official end-of-day register closure, physical cash vs POS variance check, one-click print Z-Report.

---

## 🔗 Real-Time Synchronization Logic

The application uses a centralized reactive bridge (`customer-next/store/useSharedBridge.ts`) equipped with native browser `BroadcastChannel` (`thoogudeepa_bridge_sync`):
- **Cross-Tab Real-Time Sync**: Opening `/` (Customer), `/kitchen` (Kitchen KDS), `/waiter` (Waiter), and `/manager` (Manager) in different browser tabs synchronizes state **instantly across tabs with 0ms latency**!
- **86 / Sold Out**: When Manager or Kitchen toggles an item (e.g. *Mutton Biryani*) to SOLD OUT, it instantly greys out in Customer Menu and blocks Waiter POS from punching it.
- **Order Placement**: Placing an order from Customer App or Waiter Captain instantly pushes a ticket into Kitchen KDS and updates the Manager Floor Map.
- **Cooking Progress**: When Kitchen Chef marks an order `READY` (`PLATED`), Customer Live Tracking updates to "Plated & Ready", and Waiter gets an instant green pickup notification.
- **Service Bells**: Customer tapping "Call Waiter" sends an immediate notification badge to Waiter Table Feed.
- **Payment & Vacate**: Settling bill in Waiter or Manager marks the table available and increments Manager Day-End revenue.

---

## 📁 Repository & Folder Structure

```
hospitality-saas-app/
├── customer-next/                # Complete Next.js 15 Full-Stack Web App
│   ├── app/                      # Next.js App Router Entrypoints
│   │   ├── page.tsx              # Customer Self-Ordering App (12 Screens)
│   │   ├── kitchen/page.tsx      # Kitchen Display System KDS (3 Screens)
│   │   ├── waiter/page.tsx       # Waiter/Captain Suite (10 Screens, Mobile & Tablet)
│   │   ├── manager/page.tsx      # Manager Command Center & POS (16 Screens)
│   │   ├── globals.css           # Tailwind styles & print CSS for 80mm receipts
│   │   └── layout.tsx            # Global Root Layout & Metadata
│   ├── components/               # Modular Screen & UI Components
│   │   ├── screens/              # Customer Screens (Screen1Welcome to Screen12Feedback)
│   │   ├── kitchen/              # Kitchen Screens (ScreenK1Login to ScreenK3Detail)
│   │   ├── waiter/               # Waiter Screens (ScreenW1Login to ScreenW10ShiftStats)
│   │   │   └── tablet/           # 10" Landscape Tablet Screens (TabletScreen1 to 10)
│   │   ├── manager/              # Manager Screens (ScreenM1Login to ScreenM16DayCloseZReport)
│   │   └── ui/                   # ScreenHousing, WireHeader, ItemDrawer, StickyBottomBar
│   ├── context/                  # Unified Context Layer
│   │   └── CustomerContext.tsx   # TanStack Query & Customer store bridge
│   ├── data/                     # Frontend Master Menu Data
│   │   └── menuItems.ts          # Authentic Donne Biryani dishes, pricing & addons
│   ├── hooks/                    # TanStack Query & Synchronous Hooks
│   │   ├── useMenuQuery.ts       # Cached menu query
│   │   ├── useOrderTrackingQuery.ts # Live order status polling & caching
│   │   └── useWaiterQuery.ts     # Waiter floor synchronizer
│   ├── lib/                      # Core Utilities
│   │   └── queryClient.ts        # TanStack Query Client instance
│   ├── providers/                # Client Providers
│   │   └── QueryProvider.tsx     # TanStack ReactQueryProvider
│   ├── store/                    # Reactive Zustand Stores
│   │   ├── useSharedBridge.ts    # Central Cross-Section Real-Time Bridge & BroadcastChannel
│   │   ├── useCustomerStore.ts   # Customer cart, active screen & guest session state
│   │   ├── useKitchenStore.ts    # Kitchen station login, audio alerts & station filters
│   │   ├── useWaiterStore.ts     # Waiter floor view mode (mobile/tablet) & KOT order cart
│   │   └── useManagerStore.ts    # Manager authentication, active shift & POS screen state
│   ├── types/                    # Strongly-Typed TypeScript Models
│   │   ├── customer.ts           # Customer dishes, cart items, payment & order stages
│   │   ├── kitchen.ts            # KDS stations, tickets & prep mode types
│   │   ├── waiter.ts             # Waiter captains, table pings & shift stats
│   │   └── manager.ts            # Manager permissions, metrics & Z-Report types
│   ├── package.json              # Next.js 15, React 19, Tailwind, Zustand dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── tailwind.config.js        # Thoogudeepa Donne Biryani palette (#D4AF37 Gold, #0F3A22 Green)
├── deploy_skeletons/             # Standalone Wireframe Suite (Zero dependencies)
│   ├── index.html                # Customer 12-Screen interactive wireframes
│   ├── kitchen-skeletons.html    # Kitchen 3-Screen interactive wireframes
│   ├── waiter-skeletons.html     # Waiter 10-Screen interactive wireframes (Mobile & Tablet)
│   └── manager-skeletons.html    # Manager 16-Screen interactive wireframes
├── public/                       # WebSocket Prototype & Assets
│   ├── customer.html
│   ├── kds.html
│   ├── captain.html
│   └── manager.html
├── data/                         # Master Restaurant JSON Data
│   ├── menu.json                 # Authentic Donne Biryani menu items & pricing
│   ├── tables.json               # Restaurant floor tables & layout
│   └── inventory.json            # Ingredient stock levels & thresholds
├── server.js                     # Optional Node.js WebSocket backend (Port 3000)
├── RUN_PROJECT.bat               # 1-Click Windows Launcher
├── RUN_PROJECT.sh                # 1-Click Mac/Linux Launcher
├── TEAM_COLLABORATION_GUIDE.md   # 7-Developer Parallel GitFlow Roles & Rules
├── ARCHITECTURE.md               # Technical Deep Dive & System Design
└── README.md                     # Complete Project Documentation & Guide
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
