# 👥 Team Operating Guide & Repository Workflow
## Thoogudeepa Donne Biryani Mane — Full Restaurant Suite

This guide outlines the complete development setup, module ownership, and GitFlow process tailored specifically for our **7 core team roles / developers**:

---

## 🎖️ 1. Team Developer Roster & Module Ownership

Every team member has a dedicated module and directory boundary. Because each portal has its own dedicated directory in `customer-next/components/` and `customer-next/app/`, all 7 team members can code simultaneously without stepping on each other's code or encountering merge conflicts!

| Role / Node | Assigned Developer(s) | GitHub Username | Module Responsibility | Dedicated Files & Folders | Assigned Git Branch |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PERSON 1** | **Vishal** | `@vishalvc-lab` | **Customer Self-Ordering Experience (12 Screens)**<br/>Menu, portions, add-ons (Egg/Salna), cart, UPI QR payment, bill breakdown, live order tracking, loyalty & reviews. | `customer-next/components/screens/`<br/>`customer-next/app/page.tsx`<br/>`customer-next/store/useCustomerStore.ts`<br/>`customer-next/store/useCartStore.ts` | `feature/vishal-customer-app` |
| **PERSON 2** | **Vennela** | `@tvennelavennelat-ship-it` | **Kitchen Display System (KDS - 3 Tablet Screens)**<br/>Chef station login, 70/30 table matrix with 4-stage prep steppers (`1.REC`, `2.PREP`, `3.READY`, `4.SERVED`), bulk dish cooking bar, 86 inventory toggle. | `customer-next/components/kitchen/`<br/>`customer-next/app/kitchen/page.tsx`<br/>`customer-next/store/useKitchenStore.ts` | `feature/vennela-kitchen-kds` |
| **PERSON 3** | **Nayana & Shivakumar** | `@Nayanabai`<br/>`@skram03` | **Waiter / Captain Suite (10 Screens - Mobile & Tablet)**<br/>Handheld mobile & tablet table feed, live customer call bell alerts, tableside POS order puncher, Bluetooth ESC/POS thermal bill print, table merge/split & vacate. | `customer-next/components/waiter/`<br/>`customer-next/app/waiter/page.tsx`<br/>`customer-next/store/useWaiterStore.ts` | `feature/nayana-shivakumar-waiter-suite` |
| **PERSON 4** | **Prajwal** | `@Prajwal-Praju01` | **Manager HQ & Cashier POS (16 Screens)**<br/>Executive dashboard, interactive floor map, direct counter order menu punch, staff attendance, sales analytics, petty expenses & Day-Close Z-Report. | `customer-next/components/manager/`<br/>`customer-next/app/manager/page.tsx`<br/>`customer-next/store/useManagerStore.ts` | `feature/prajwal-manager-pos` |
| **PERSON 5** | **Suhas M** | `@suhassuhas4120` | **Real-Time State & Backend Architect**<br/>Central reactive bridge (`useSharedBridge.ts`), data models, WebSocket server (`server.js`), and database/API synchronization connecting all 4 portals. | `customer-next/store/useSharedBridge.ts`<br/>`customer-next/types/*.ts`<br/>`server.js`<br/>`data/*.json` | `feature/suhas-m-backend-bridge` |
| **PERSON 6** | **Suhas M & Bharath** | `@suhassuhas4120`<br/>`@Bharath200404` | **UI/UX & Design Systems Leads**<br/>Restaurant visual tokens, amber/emerald Donne Biryani theme, component library (`components/ui/`), animations, touch accessibility & wireframes sync. | `customer-next/app/globals.css`<br/>`customer-next/tailwind.config.js`<br/>`customer-next/components/ui/`<br/>`deploy_skeletons/` | `feature/suhas-bharath-ui-ux` |
| **PERSON 7** | **Manjunath** | `@manju2512` | **QA, Testing & DevOps Lead**<br/>Build validation (`npm run type-check` & `npm run build`), CI/CD GitHub Actions (`.github/workflows/ci.yml`), 1-click launch scripts (`RUN_PROJECT.bat`) & cloud deployment. | `.github/workflows/`<br/>`customer-next/next.config.ts`<br/>Build scripts & deployment configs | `feature/manjunath-qa-devops` |

---

## 🌿 2. Git Branching Strategy (GitFlow)

We follow a clean, collaborative GitFlow model:

```
main (Production Ready — Deployed Live)
  ▲
  │ (Merged via Pull Request after review)
develop (Team Integration Branch — Where all 7 developers merge)
  ▲
  ├── feature/vishal-customer-app
  ├── feature/vennela-kitchen-kds
  ├── feature/nayana-shivakumar-waiter-suite
  ├── feature/prajwal-manager-pos
  ├── feature/suhas-m-backend-bridge
  ├── feature/suhas-bharath-ui-ux
  └── feature/manjunath-qa-devops
```

- **`main` branch**: Production code only. Always stable, tested, and live.
- **`develop` branch**: The central team integration branch. All developers merge their feature branches here.
- **`feature/*` branches**: Dedicated branches where each developer writes and tests their code.

---

## 🚀 3. How to Create the GitHub Repository (Team Lead Steps)

To publish this project online so all 7 developers can clone and collaborate:

### Step A: Create the Repo on GitHub
1. Go to **[GitHub.com](https://github.com/)** and click **"New repository"**.
2. Name it: `thoogudeepa-donne-biryani-app` (select **Private** or **Public**).
3. **Important**: Leave "Add a README" and ".gitignore" **unchecked** (they are already created in this project).

### Step B: Push This Local Repository to GitHub
Open your terminal in `C:\Users\HP\.gemini\antigravity\scratch\hospitality-saas-app` and run:

```bash
# 1. Link your remote GitHub repository (already configured!)
git remote add origin https://github.com/suhassuhas4120/thoogudeepa-donne-biryani-app.git

# 2. Push production main and develop branches
git push -u origin main
git push -u origin develop

# 3. Push all developer feature branches in one command!
git push --all origin
```

### Step C: Add the Developers as Collaborators
In GitHub: Go to **Settings ➔ Collaborators ➔ Add people** and invite:
- **Vishal**: `vishalvc-lab`
- **Vennela**: `tvennelavennelat-ship-it`
- **Nayana**: `Nayanabai`
- **Shivakumar**: `skram03`
- **Prajwal**: `Prajwal-Praju01`
- **Bharath**: `Bharath200404`
- **Manjunath**: `manju2512`
*(Repository Owner: `suhassuhas4120`)*

---

## 💻 4. Developer-by-Developer Guide: What Each Person Does Daily

---

### 📱 PERSON 1: Vishal (Customer App Lead)
- **Branch**: `feature/vishal-customer-app`
- **What Vishal Does**:
  - Enhances customer ordering screens (1 to 12).
  - Tunes dish customization options (spice slider, extra salna/boiled egg add-ons).
  - Tests dynamic UPI QR code generator and tip options.
  - Improves loyalty club scratch cards and star rating feedback.
- **Daily Commands for Vishal**:
  ```bash
  git checkout feature/vishal-customer-app
  git pull origin develop
  cd customer-next
  npm run dev
  # Open http://localhost:3001/ in Chrome Mobile DevTools (390px)
  # When work is done:
  git add .
  git commit -m "feat(customer): enhance biryani portion customizer and salna addons"
  git push origin feature/vishal-customer-app
  # Create Pull Request into 'develop' on GitHub
  ```

---

### 🍳 PERSON 2: Vennela (Kitchen KDS Lead)
- **Branch**: `feature/vennela-kitchen-kds`
- **What Vennela Does**:
  - Maintains the 3-screen Kitchen Display System tablet interface.
  - Screen 1: Station and chef PIN authentication.
  - Screen 2: 70/30 table matrix with interactive prep stage steppers (`1.REC`, `2.PREP`, `3.READY`, `4.SERVED`), bulk cooking consolidation bar, and time-ordered ticket queue.
  - Screen 3: Deep dive into individual table tickets, 86 item sold-out toggle, and prep delay adjustments.
- **Daily Commands for Vennela**:
  ```bash
  git checkout feature/vennela-kitchen-kds
  git pull origin develop
  cd customer-next
  npm run dev
  # Open http://localhost:3001/kitchen/ in tablet or wide landscape mode
  # When work is done:
  git add .
  git commit -m "feat(kitchen): tune stage stepper transitions and prep timers"
  git push origin feature/vennela-kitchen-kds
  # Create Pull Request into 'develop' on GitHub
  ```

---

### 🤵 PERSON 3: Nayana & Shivakumar (Waiter Suite Leads)
- **Branch**: `feature/nayana-shivakumar-waiter-suite`
- **What Nayana & Shivakumar Do**:
  - Maintain the 10 waiter screens in both **Mobile Handheld (390px)** and **Tablet (768px)** views.
  - Live floor feed showing table status (Available, Occupied, Billed) and real-time customer call bell pings.
  - Tableside high-speed POS puncher with instant 86 sold-out item protection.
  - Table merge (joining 2 tables for large families) and split bills.
  - Thermal bill print preview (80mm ESC/POS layout via window.print()).
- **Daily Commands for Nayana & Shivakumar**:
  ```bash
  git checkout feature/nayana-shivakumar-waiter-suite
  git pull origin develop
  cd customer-next
  npm run dev
  # Open http://localhost:3001/waiter/ (test both Mobile and Tablet view toggles)
  # When work is done:
  git add .
  git commit -m "feat(waiter): optimize tableside order puncher and call bell resolution"
  git push origin feature/nayana-shivakumar-waiter-suite
  # Create Pull Request into 'develop' on GitHub
  ```

---

### 💼 PERSON 4: Prajwal (Manager HQ & Cashier POS Lead)
- **Branch**: `feature/prajwal-manager-pos`
- **What Prajwal Does**:
  - Maintains the 16-screen Manager Command Center in both **Stage View** and **16-Grid Gallery View**.
  - Screen 4 (Billing POS): Direct counter ordering menu tab for walk-in takeaway orders + table invoice settlement.
  - Executive live dashboard, interactive floor map, staff attendance, sales analytics, and Day-Close Z-Report generation.
- **Daily Commands for Prajwal**:
  ```bash
  git checkout feature/prajwal-manager-pos
  git pull origin develop
  cd customer-next
  npm run dev
  # Open http://localhost:3001/manager/ on desktop
  # When work is done:
  git add .
  git commit -m "feat(manager): refine direct counter menu punch and Z-report summary"
  git push origin feature/prajwal-manager-pos
  # Create Pull Request into 'develop' on GitHub
  ```

---

### ⚡ PERSON 5: Suhas M (Real-Time State & Backend Architect)
- **Branch**: `feature/suhas-m-backend-bridge`
- **What Suhas M Does**:
  - Maintains the central nervous system: `customer-next/store/useSharedBridge.ts`.
  - Controls cross-portal triggers:
    - Customer places order ➔ pushes ticket to Kitchen KDS and updates Manager floor map.
    - Kitchen toggles 86 item ➔ instantly disables item on Customer menu and blocks Waiter POS.
    - Customer calls waiter ➔ rings call bell banner on Waiter tablets.
    - Waiter/Manager settles bill ➔ updates Z-Report sales ledger and marks table available.
  - Maintains TypeScript contracts (`customer-next/types/*.ts`), `server.js`, and master datasets (`data/*.json`).
  - Maintains server endpoints, WebSocket events in `server.js`, and data persistence.
- **Daily Commands for Suhas M**:
  ```bash
  git checkout feature/suhas-m-backend-bridge
  git pull origin develop
  cd customer-next
  npm run dev
  # When updating shared state:
  git add .
  git commit -m "feat(bridge): expand shared bridge state for multi-terminal sync"
  git push origin feature/suhas-m-backend-bridge
  # Create Pull Request into 'develop' on GitHub
  ```

---

### 🎨 PERSON 6: Suhas M & Bharath (UI/UX & Design Systems Leads)
- **Branch**: `feature/suhas-bharath-ui-ux`
- **What Suhas M & Bharath Do**:
  - Maintain the Donne Biryani visual identity (Amber Gold, Emerald Green, Dark Slate).
  - Reusable component library in `components/ui/` (ScreenHousing, buttons, sheets, modals, badges).
  - Global styles and animations in `globals.css` and `tailwind.config.js`.
  - Touch target audit: ensuring all interactive buttons are at least 44x44px for busy waiters and kitchen staff.
  - Keep standalone HTML wireframes in `deploy_skeletons/` aligned with the React components.
- **Daily Commands for Suhas M & Bharath**:
  ```bash
  git checkout feature/suhas-bharath-ui-ux
  git pull origin develop
  cd customer-next
  npm run dev
  # When polishing design:
  git add .
  git commit -m "style: polish responsive spacing, typography tokens, and button contrast"
  git push origin feature/suhas-bharath-ui-ux
  # Create Pull Request into 'develop' on GitHub
  ```

---

### 🛡️ PERSON 7: Manjunath (QA, Testing & DevOps Lead)
- **Branch**: `feature/manjunath-qa-devops`
- **What Manjunath Does**:
  - Manages GitHub Actions CI workflow (`.github/workflows/ci.yml`).
  - Validates builds before release:
    ```bash
    npm run type-check   # Must return 0 errors
    npm run build        # Must compile all static routes
    ```
  - Cloud deployment (Surge, Vercel, or local hotel LAN server).
  - Conducts cross-device testing on Android, iPad, and desktop terminals.
- **Daily Commands for Manjunath**:
  ```bash
  git checkout feature/manjunath-qa-devops
  git pull origin develop
  cd customer-next
  npm run type-check
  npm run build
  # When updating CI or configs:
  git add .
  git commit -m "ci(devops): verify production build pipeline and add test fixtures"
  git push origin feature/manjunath-qa-devops
  # Review and merge PRs from teammates into 'develop'
  ```

---

## 🛡️ 5. Golden Rules for Zero-Conflict Teamwork

1. **Pull Before Coding**: Every morning, run `git pull origin develop` on your feature branch.
2. **Respect Directory Ownership**: Work inside your assigned folder. If you need a change in another section, talk to that person!
3. **Coordinate Shared Data via Suhas M**: Any change to `useSharedBridge.ts` or `types/*.ts` must be coordinated with Suhas M.
4. **Build Check Before Opening PR**: Always run `npm run type-check` and `npm run build` before submitting a Pull Request.

---

## 🌐 Live URLs for Team Reference
- 📱 **Customer App**: https://thoogudeepa-donne-biryani.surge.sh/
- 🍳 **Kitchen KDS**: https://thoogudeepa-donne-biryani.surge.sh/kitchen/
- 🤵 **Waiter Suite**: https://thoogudeepa-donne-biryani.surge.sh/waiter/
- 💼 **Manager Command Center**: https://thoogudeepa-donne-biryani.surge.sh/manager/
