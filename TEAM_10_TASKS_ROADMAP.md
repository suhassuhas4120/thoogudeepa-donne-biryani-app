# 📋 Thoogudeepa Donne Biryani Mane - 7-Developer 10-Task Execution Roadmap

This document provides a prioritized, actionable **10-task implementation roadmap** for every developer on the team. Each task specifies the target files, step-by-step instructions, and verification steps.

---

## 🧭 Developer Index & Branches

| Role | Developer | GitHub Handle | Dedicated Branch | Core Module |
| :--- | :--- | :--- | :--- | :--- |
| **Person 1** | **Vishal** | `@vishalvc-lab` | `feature/vishal-customer-app` | Customer Experience (12 Mobile Screens) |
| **Person 2** | **Vennela** | `@tvennelavennelat-ship-it` | `feature/vennela-kitchen-kds` | Kitchen KDS Tablet Suite (3 Tablet Screens) |
| **Person 3** | **Nayana & Shivakumar** | `@Nayanabai`<br/>`@skram03` | `feature/nayana-shivakumar-waiter-suite` | Waiter / Floor Captain Suite (10 Screens, Mobile & Tablet) |
| **Person 4** | **Prajwal** | `@Prajwal-Praju01` | `feature/prajwal-manager-pos` | Manager Command Center & POS (16 Screens) |
| **Person 5** | **Suhas M** | `@suhassuhas4120` | `feature/suhas-m-backend-bridge` | Real-Time State, Bridge & Node.js WebSocket Architecture |
| **Person 6** | **Bharath & Suhas M** | `@Bharath200404`<br/>`@suhassuhas4120` | `feature/suhas-bharath-ui-ux` | UI/UX Design System, 48px Tap Targets & Responsive Polish |
| **Person 7** | **Manjunath** | `@manju2512` | `feature/manjunath-qa-devops` | QA Automation, TypeScript Integrity & DevOps Tooling |

---

## 📱 1. Vishal (`@vishalvc-lab`) — Customer Experience Lead
**Branch:** `feature/vishal-customer-app`  
**Working Directory:** `customer-next/components/screens/`, `customer-next/app/page.tsx`, `customer-next/store/useCustomerStore.ts`

### Task 1.1: URL Query Table Number Recognition `[P1]`
- **Target File:** `customer-next/components/screens/Screen1Welcome.tsx`
- **Instruction:** Use Next.js `useSearchParams()` or native `window.location.search` to detect `?table=A-04`. If present, auto-set `tableNumber` in `useCustomerStore` so diners scanning table QR codes land directly with their table assigned.
- **Verification:** Navigate to `http://localhost:3001/?table=B-02` and ensure Table B-02 displays automatically.

### Task 1.2: Menu Category & Dietary Filter Filtering `[P1]`
- **Target File:** `customer-next/components/screens/Screen2Menu.tsx`
- **Instruction:** Implement smooth category filtering (`Dum Biryani`, `Starters`, `Kebabs`, `Desserts`, `Beverages`) combined with dietary pills (`Non-Veg`, `Veg`, `Halal`). Filter dishes cleanly using array `.filter()`.
- **Verification:** Click "Veg" filter and verify only vegetarian dishes (e.g., Paneer Donne Biryani, Gobi 65) appear.

### Task 1.3: Sold-Out (86) Item Visual Disabling `[P1]`
- **Target File:** `customer-next/components/screens/Screen2Menu.tsx`, `Screen3ItemDetail.tsx`
- **Instruction:** Check `inventory86` from `useSharedBridge()`. If a dish has `is86: true`, overlay a semi-transparent slate banner `[SOLD OUT TODAY]`, gray out the image, and disable the "ADD TO CART" button.
- **Verification:** When Kitchen marks Mutton Biryani 86'd, ensure it cannot be added to the cart from Customer Menu.

### Task 1.4: Portion Sizing & Add-on Price Calculation `[P1]`
- **Target File:** `customer-next/components/screens/Screen3ItemDetail.tsx`
- **Instruction:** Allow diners to pick portions (Regular ₹290, Large ₹420, Family Pack ₹850) and select optional add-ons (Extra Boiled Egg +₹25, Extra Donne Salna +₹30). Compute total item price reactively.
- **Verification:** Select Large portion + Extra Egg; verify item price updates dynamically before adding to cart.

### Task 1.5: Smart Cart Stepper & Quantity Controls `[P1]`
- **Target File:** `customer-next/components/screens/Screen4Cart.tsx`
- **Instruction:** In the cart list, wire the `+` and `-` quantity steppers. If quantity reaches 0, prompt with a micro-toast or confirmation before removing. Update running cart total instantly.
- **Verification:** Increase quantity to 3; check that the subtotal multiplies accurately.

### Task 1.6: Separate Order Firing `[P2]`
- **Target File:** `customer-next/components/screens/Screen4Cart.tsx`
- **Instruction:** Wire the "Fire Separately" button per dish. When tapped, send only that specific item to the kitchen immediately (for fast starters or appetizers while others review mains).
- **Verification:** Click "Fire Separately" on Chicken Wings; verify starter ticket dispatches to KDS while rest of cart remains.

### Task 1.7: Real-Time Live Order Tracking Progress `[P1]`
- **Target File:** `customer-next/components/screens/Screen5LiveTracking.tsx`
- **Instruction:** Ensure the 4-stage tracking bar (`PLACED` ➔ `PREP` ➔ `PLATED` ➔ `SERVED`) responds to the live KDS ticket status in `useSharedBridge()`. Display estimated prep countdown timer.
- **Verification:** When Kitchen bumps order to `READY`, Customer tracking bar must highlight "PLATED & READY" in real time.

### Task 1.8: Bill Splitting Calculator `[P2]`
- **Target File:** `customer-next/components/screens/Screen6PaymentBreakdown.tsx`
- **Instruction:** Implement the 2-way split selector: "Split Equally (2 to 6 diners)" vs "Full Bill". Calculate per-person share rounded to whole rupees.
- **Verification:** On a ₹1,200 bill, select 3 diners; verify each share displays ₹400.00.

### Task 1.9: Dynamic UPI QR Code Generation `[P1]`
- **Target File:** `customer-next/components/screens/Screen7PaymentGateway.tsx`
- **Instruction:** Generate dynamic UPI payment payload (`upi://pay?pa=thoogudeepa@icici&pn=ThoogudeepaBiryani&am={amount}&cu=INR`). Render QR using native SVG/canvas and wire the "Pay via UPI App" intent link.
- **Verification:** Click "Pay via UPI App" on a mobile device and ensure it triggers PhonePe/GPay intent.

### Task 1.10: Service Call Bell Pings `[P1]`
- **Target File:** `customer-next/components/screens/Screen10WaiterCall.tsx`
- **Instruction:** Wire the quick-action call buttons ("Request Water", "Call Captain", "Extra Cutlery", "Bill Please"). When tapped, dispatch `bridge.customerPingsWaiter(tableNumber, type, guestName)` with debounce.
- **Verification:** Tap "Request Water"; verify amber notification appears on Waiter `/waiter` feed within 0 seconds.

---

## 🍳 2. Vennela (`@tvennelavennelat-ship-it`) — Kitchen KDS Suite Lead
**Branch:** `feature/vennela-kitchen-kds`  
**Working Directory:** `customer-next/components/kitchen/`, `customer-next/app/kitchen/page.tsx`, `customer-next/store/useKitchenStore.ts`

### Task 2.1: Chef Station PIN Login `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK1Login.tsx`
- **Instruction:** Implement keypad PIN verification (Chef PIN: `1234`). Allow station selection: `Main Biryani Handi`, `Tandoor & Starters`, or `All Stations (Executive Chef)`. Save session in `useKitchenStore`.
- **Verification:** Enter `1234`; ensure screen navigates to Screen K2 with selected station filter active.

### Task 2.2: Live 6-Table Matrix Integration `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Ensure incoming orders from `useSharedBridge().kdsTickets` populate the active table grid dynamically, showing table number, KOT number, elapsed time, and item list.
- **Verification:** Place an order on Table A-04 in Customer app; verify Table A-04 appears in KDS grid.

### Task 2.3: 4-Stage Item Preparation Steppers `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Wire the 4-stage stepper buttons on each dish (`1.REC`, `2.PREP`, `3.READY`, `4.SERVED`). When a button is tapped, call `kitchenSetItemStage` in `useSharedBridge` to update the dish status.
- **Verification:** Tap `2.PREP` on Biryani; verify badge updates to amber "PREPARING" on KDS and Customer tracking.

### Task 2.4: Kitchen-Ready Notification Trigger `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`, `customer-next/store/useSharedBridge.ts`
- **Instruction:** When all dishes on a ticket reach stage `3.READY` (or when entire table is bumped), set ticket status to `READY`. This triggers the green "KITCHEN READY" alert in Waiter's feed.
- **Verification:** Bump all items on Table 01 to `3.READY`; check Waiter `/waiter` to verify notification arrives.

### Task 2.5: Top 4 Bulk Cooking Aggregation Bar `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Compute aggregate dish totals across all active tables (e.g., "12x Donne Mutton Biryani Cooking across 4 tables"). Update counts reactively whenever new KOTs arrive.
- **Verification:** Add 2 biryanis on Table A-01 and 3 on Table A-02; verify bulk bar displays `5x Donne Biryani`.

### Task 2.6: Chronological 30% Time Queue `[P2]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Display tickets ordered by elapsed preparation time in the right 30% column. Implement color thresholds: Green (<10 min), Amber (10–15 min), Red Pulsing (>15 min overdue).
- **Verification:** Verify overdue tickets display red highlight and urgent badge.

### Task 2.7: Web Audio API Sound Chime `[P2]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`, `useKitchenStore.ts`
- **Instruction:** Implement native browser Web Audio oscillator chime (e.g. 880Hz beep for 200ms) that plays when a new KOT arrives, controlled by the sound toggle button in the top bar.
- **Verification:** Enable sound toggle and fire a new order; verify audio ding plays without external audio assets.

### Task 2.8: Single Table Deep-Dive Management `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK3Detail.tsx`
- **Instruction:** In Screen K3, display complete customer notes (e.g. "Less spicy", "Extra gravy"), portion sizes, and individual dish bump controls for the selected table.
- **Verification:** Click "MANAGE TABLE 01" from Screen K2; verify Screen K3 opens with Table 01's details.

### Task 2.9: 86 Item Master Sold-Out Toggle `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK3Detail.tsx`
- **Instruction:** Unlock the 86 inventory panel via PIN or toggle button. Toggle any dish (e.g. Nati Koli Biryani) to `86 SOLD OUT`. Call `kitchenToggle86(itemId)` in `useSharedBridge`.
- **Verification:** Toggle dish 86; check Customer Menu and Waiter POS to confirm item immediately disables.

### Task 2.10: Expedite Call Floor Runner Button `[P2]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Wire the `[CALL FLOOR RUNNER TO PASS]` button at the bottom of the time queue to broadcast an urgent runner pickup notification to all active waiters.
- **Verification:** Click button; verify high-priority alert displays on Waiter screen.

---

## 🤵 3. Nayana & Shivakumar (`@Nayanabai` & `@skram03`) — Waiter / Captain Suite Co-Leads
**Branch:** `feature/nayana-shivakumar-waiter-suite`  
**Working Directory:** `customer-next/components/waiter/`, `customer-next/components/waiter/tablet/`, `customer-next/app/waiter/page.tsx`

### Task 3.1: Captain PIN & Shift Login `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW1Login.tsx`, `TabletScreen1Login.tsx`
- **Instruction:** Implement PIN authentication (Captain PIN: `1001` to `1004`). Allow selecting active floor zone (Section A, B, or C). Store active captain name in `useWaiterStore`.
- **Verification:** Enter `1001`; verify login transitions to Screen W2 with "Captain Ramesh" active.

### Task 3.2: Mobile & Tablet Viewport Switcher `[P1]`
- **Target File:** `customer-next/app/waiter/page.tsx`
- **Instruction:** Maintain the seamless toggle between Handheld Mobile View (390px portrait) and Stationary Tablet View (10" landscape) via `viewMode === 'mobile' ? mobileComp : tabletComp`.
- **Verification:** Click the "TABLET (10)" button in the top navigation; verify layout switches to dual-pane landscape.

### Task 3.3: Live Floor Tables Matrix & Status Badges `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW2TablesFeed.tsx`, `TabletScreen2TablesFeed.tsx`
- **Instruction:** Render all restaurant tables reading from `useSharedBridge().tables`. Display status badges: `VACANT` (green), `OCCUPIED` (orange), `BILLING` (purple), `CLEANING` (amber).
- **Verification:** Change Table A-01 status; verify color badge updates instantly.

### Task 3.4: Dual Live Feed (Pings vs Kitchen Ready) `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW2TablesFeed.tsx`, `TabletScreen2TablesFeed.tsx`
- **Instruction:** In the bottom 40% feed, implement the dual tabs:
  - **Guest Calls Tab:** Customer assistance pings (Water, Bill, Call). Click "Accept" or "Resolve" to clear.
  - **Kitchen Ready Tab:** KDS tickets marked `READY`. Click "Mark Served" to clear.
- **Verification:** Send a water call from Customer app; verify ping appears and can be cleared with one tap.

### Task 3.5: Table Deep-Dive & Active Bill View `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW3TableDetail.tsx`, `TabletScreen3TableDetail.tsx`
- **Instruction:** Display running dishes, quantities, elapsed dwell time, server name, and total bill for the selected table. Provide action buttons: "Take Order", "Print Bill", "Vacate".
- **Verification:** Select Table A-04; verify running bill matches punched items.

### Task 3.6: Tableside POS Menu Order Puncher `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW4TakeOrder.tsx`, `TabletScreen4TakeOrder.tsx`
- **Instruction:** Build fast touch-grid menu for captains to punch orders tableside. Filter dishes by category, display search bar, and block dishes marked 86 in `inventory86`.
- **Verification:** Tap dishes to add to cart; verify floating cart count and total update at the bottom.

### Task 3.7: Custom Kitchen Modifiers & KOT Submission `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW5ItemCustom.tsx`, `TabletScreen5ItemCustom.tsx`
- **Instruction:** Allow adding dietary notes (e.g. "Jain", "No onion", "Extra spicy") and portion sizes. Clicking **"SUBMIT KOT"** calls `waiterFiresKOT()` in `useSharedBridge` and resets cart.
- **Verification:** Punch 2 Biryanis on Table A-03; click "SUBMIT KOT" and verify new ticket arrives in Kitchen KDS.

### Task 3.8: Table Merge & Split Actions `[P2]`
- **Target File:** `customer-next/components/waiter/ScreenW6MergeSplit.tsx`, `TabletScreen6MergeSplit.tsx`
- **Instruction:** Allow merging two adjacent tables (e.g., Table A-01 + A-02 for large parties) by combining their running bills and guest counts in `useSharedBridge.waiterMergeTables()`.
- **Verification:** Merge Table A-01 into A-02; verify Table A-01 frees up and Table A-02 bill combines both subtotals.

### Task 3.9: Payment Settlement (Cash & UPI) `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW7Payment.tsx`, `TabletScreen7Payment.tsx`
- **Instruction:** Record bill settlement (Cash, UPI, Card). Call `waiterRecordsPayment(tableNumber, method, amount)` to move table to `BILLING` and update shift revenue.
- **Verification:** Settle ₹850 via Cash; verify shift total increments by ₹850.

### Task 3.10: Vacate Table & Turnaround Reset `[P1]`
- **Target File:** `customer-next/components/waiter/ScreenW9Vacate.tsx`, `TabletScreen9Vacate.tsx`
- **Instruction:** Once guests depart, tap "VACATE TABLE". Call `waiterVacatesTable(tableNumber)` to reset table to `VACANT`, reset bill to ₹0, and clear completed tickets.
- **Verification:** Vacate Table A-04; verify table turns green/VACANT across Waiter, Manager, and Customer portals.

---

## 💼 4. Prajwal (`@Prajwal-Praju01`) — Manager POS & Cashier Desk Lead
**Branch:** `feature/prajwal-manager-pos`  
**Working Directory:** `customer-next/components/manager/`, `customer-next/app/manager/page.tsx`, `customer-next/store/useManagerStore.ts`

### Task 4.1: Manager PIN & Role Gate `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM1Login.tsx`
- **Instruction:** Implement administrator PIN verification (Manager PIN: `9999`). Select active shift (Lunch Rush, Dinner Rush). Populate manager name in `useManagerStore`.
- **Verification:** Enter `9999`; verify access to the Manager Command Center unlocks.

### Task 4.2: Real-Time Executive Live Dashboard `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM2LiveOverview.tsx`
- **Instruction:** Display top 4 executive KPI cards reading directly from `useSharedBridge()`:
  - Today's Sales (Live collected + running bill sum)
  - Active Guests Seated across all sections
  - Active Kitchen KDS Tickets pending
  - Live Floor Occupancy Rate
- **Verification:** Place an order on Customer app; verify Today's Sales and Guests Seated update immediately.

### Task 4.3: Interactive Floor Layout Map `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM3FloorPlan.tsx`
- **Instruction:** Render visual restaurant floor plan across Sections A, B, and C. Color-code tables by status (Vacant, Occupied, Billing, Cleaning). Clicking a table routes to Screen M4 POS with that table loaded.
- **Verification:** Click Table B-01 on map; verify Screen M4 opens with Table B-01 selected.

### Task 4.4: High-Speed Billing POS Counter `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM4BillingPOS.tsx`
- **Instruction:** Auto-load selected table's running dishes from `selectedTable.activeItems`. Calculate 2.5% CGST + 2.5% SGST. Support item additions, price adjustments, and quantity changes.
- **Verification:** Verify tax breakdown matches exactly: ₹1,000 subtotal ➔ ₹25 CGST + ₹25 SGST = ₹1,050 total.

### Task 4.5: Manager Discounts & Promotional Overrides `[P2]`
- **Target File:** `customer-next/components/manager/ScreenM4BillingPOS.tsx`, `ScreenM12OffersRules.tsx`
- **Instruction:** Add quick-apply discount buttons (5%, 10%, ₹100 Flat, Complimentary/NC). Recalculate bill total after discount and before GST.
- **Verification:** Apply 10% discount on ₹500 bill; verify new total reflects ₹450 + taxes.

### Task 4.6: ESC/POS 80mm Thermal Receipt Printing `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM4BillingPOS.tsx`
- **Instruction:** Ensure clicking `[PRINT 80MM BILL]` triggers native `window.print()` with `@media print` CSS rules formatted strictly for 80mm thermal rolls (no URL headers, no scrollbars).
- **Verification:** Press `Ctrl+P` on Screen M4; verify print preview shows formatted thermal receipt layout.

### Task 4.7: Tender Settlement & Drawer Balance `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM4BillingPOS.tsx`, `ScreenM9WaiterCash.tsx`
- **Instruction:** Support payment modes: Cash, Card, UPI, Swiggy/Zomato. Calculate change due for cash tendered (e.g. ₹1,500 tendered on ₹1,260 bill = ₹240 return change).
- **Verification:** Enter ₹2,000 tendered on ₹1,400 bill; verify Change Due displays `₹600.00`.

### Task 4.8: Live Kitchen Speed & KOT Analytics `[P2]`
- **Target File:** `customer-next/components/manager/ScreenM5KitchenSpeed.tsx`
- **Instruction:** Display station preparation metrics, average prep time per dish, and active bottleneck warnings reading from `kdsTickets`.
- **Verification:** Check that completed tickets contribute to the average preparation time metric.

### Task 4.9: 86 Stock Master Management `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM10Menu86Stock.tsx`
- **Instruction:** Provide one-click 86 out-of-stock toggles for all menu items and raw ingredients. Any toggle immediately updates `inventory86` in `useSharedBridge`.
- **Verification:** Toggle dish in Screen M10; verify dish immediately grays out in Customer Menu.

### Task 4.10: Day-End Close & Z-Report Generation `[P1]`
- **Target File:** `customer-next/components/manager/ScreenM16DayCloseZReport.tsx`
- **Instruction:** Summarize full day sales by payment mode (Cash, UPI, Card), compare system cash vs physical cash entered, calculate cash variance, and provide one-click Z-Report print.
- **Verification:** Click "Print Z-Report"; verify official day-end closing statement formats for print.

---

## ⚡ 5. Suhas M (`@suhassuhas4120`) — Backend State & Architecture Lead
**Branch:** `feature/suhas-m-backend-bridge`  
**Working Directory:** `customer-next/store/useSharedBridge.ts`, `server.js`, `data/`

### Task 5.1: Browser `localStorage` State Persistence `[P1]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Add automatic state serialization to `localStorage` ('thoogudeepa_state_v1') with hydration on load, so page refreshes in any portal retain active tables and KDS tickets.
- **Verification:** Punch an order on Table A-04, press `F5` to refresh the browser; verify Table A-04 remains occupied.

### Task 5.2: Cross-Tab BroadcastChannel Synchronization `[P1]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Ensure the native `BroadcastChannel('thoogudeepa_bridge_sync')` broadcasts state diffs without infinite echo loops when multiple tabs are open on the same workstation.
- **Verification:** Place an order on Tab 1 (Customer); verify Tab 2 (Kitchen) updates without refreshing.

### Task 5.3: Node.js WebSocket Server State Bridge `[P1]`
- **Target File:** `server.js`, `customer-next/store/useSharedBridge.ts`
- **Instruction:** Align WebSocket message types in `server.js` (`ACTION_DISPATCH`, `STATE_SNAPSHOT`) with client bridge, enabling physical phones on local Wi-Fi to sync with the server.
- **Verification:** Start `node server.js` on port 3000; connect two browser windows via `ws://localhost:3000` and verify real-time sync.

### Task 5.4: Shared Data Contracts & TypeScript Interfaces `[P1]`
- **Target File:** `customer-next/store/useSharedBridge.ts`, `customer-next/types/*.ts`
- **Instruction:** Validate that `SharedTable`, `SharedKDSTicket`, `SharedPing`, and `SharedMenuItem86` interfaces strictly type all actions and selectors without any `any` types.
- **Verification:** Run `npm.cmd run type-check`; ensure 0 TypeScript errors.

### Task 5.5: Master Menu Data Source Integrity `[P2]`
- **Target File:** `customer-next/data/menuItems.ts`, `data/menu.json`
- **Instruction:** Synchronize dish IDs, authentic Donne Biryani names, categories, and INR pricing between `customer-next/data/menuItems.ts` and `data/menu.json`.
- **Verification:** Verify that all dishes shown in Customer app match the master JSON dataset.

### Task 5.6: KDS Ticket Lifecycle State Machine `[P1]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Ensure ticket transitions strictly follow the state machine:
  `NEW` ➔ `PREP` ➔ `READY` ➔ `COMPLETED`. When all items are `SERVED`, auto-transition ticket to `COMPLETED`.
- **Verification:** Bump all items on a ticket to `SERVED`; verify ticket status changes to `COMPLETED`.

### Task 5.7: Customer-to-Waiter Ping Dispatcher `[P1]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** In `customerPingsWaiter()`, generate unique ping IDs, attach readable timestamps, and prevent duplicate identical pending requests from the same table within 30 seconds.
- **Verification:** Tap "Water" twice rapidly; ensure only one active ping is recorded.

### Task 5.8: Table Billing & Dwell Time Calculation `[P2]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Compute table dwell time (minutes elapsed since `seatedTime`) and update running current bill when new KOT rounds are added.
- **Verification:** Add second round of dishes to Table A-01; verify `currentBill` sums round 1 + round 2 accurately.

### Task 5.9: Soft State Reset / Demo Seed Reset `[P2]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Provide a helper action `resetToFreshDemoState()` that resets tables, tickets, and pings back to initial demo seeds for exhibition testing without dropping code.
- **Verification:** Call reset in browser console; verify tables restore to default demo layout.

### Task 5.10: WebSocket Reconnection & Offline Resilience `[P2]`
- **Target File:** `customer-next/store/useSharedBridge.ts`
- **Instruction:** Ensure the WebSocket client has automatic exponential backoff reconnection (3s, 6s, 12s) and falls back cleanly to `BroadcastChannel` if the server is offline.
- **Verification:** Terminate `node server.js`; verify browser tabs continue syncing via `BroadcastChannel` with zero UI errors.

---

## 🎨 6. Bharath & Suhas M (`@Bharath200404` & `@suhassuhas4120`) — UI/UX Co-Leads
**Branch:** `feature/suhas-bharath-ui-ux`  
**Working Directory:** `customer-next/app/globals.css`, `customer-next/tailwind.config.js`, `customer-next/components/ui/`

### Task 6.1: Thoogudeepa Donne Biryani Brand Palette Audit `[P1]`
- **Target File:** `customer-next/tailwind.config.js`, `customer-next/app/globals.css`
- **Instruction:** Enforce brand color tokens across all Tailwind classes: Gold (`#D4AF37`), Dark Amber (`#B45309`), Plantain Leaf Green (`#0F3A22`), Slate Dark (`#0F172A`).
- **Verification:** Inspect buttons and headers; verify consistent luxury restaurant color hierarchy.

### Task 6.2: 48px Minimum Touch Target Sizing `[P1]`
- **Target File:** `customer-next/components/ui/`, `customer-next/components/screens/`
- **Instruction:** Audit all interactive buttons, pills, steppers, and tab bars on mobile screens to ensure tap areas meet the **48px minimum touch height** for accessibility.
- **Verification:** Inspect primary buttons in Chrome DevTools; verify computed height is at least `48px`.

### Task 6.3: Framer Motion Micro-Interactions `[P1]`
- **Target File:** `customer-next/components/screens/`, `customer-next/components/kitchen/`
- **Instruction:** Add 60fps micro-animations: spring tap scaling (`whileTap={{ scale: 0.96 }}`), card exit transitions (`exit={{ opacity: 0, scale: 0.95 }}`), and drawer slide-ups.
- **Verification:** Tap "Add to Cart" and bump buttons; verify tactile spring response.

### Task 6.4: Customer Mobile Drawer (`Vaul Drawer`) `[P1]`
- **Target File:** `customer-next/components/ui/ItemDrawer.tsx`
- **Instruction:** Ensure bottom customization drawer slides smoothly on mobile devices with touch drag-to-dismiss behavior and backdrop blur.
- **Verification:** Tap a dish card on mobile view; swipe down on drawer header to dismiss.

### Task 6.5: Waiter Dual Viewport Responsiveness `[P1]`
- **Target File:** `customer-next/components/waiter/WaiterTabletHousing.tsx`, `tablet/WaiterTabletLandscapeHousing.tsx`
- **Instruction:** Ensure mobile view restricts cleanly to `max-w-[430px]` portrait, while tablet view expands fluidly into 10" landscape (`1024x768`) dual-pane layout.
- **Verification:** Toggle between Mobile and Tablet viewports; verify no horizontal overflow or broken containers.

### Task 6.6: Kitchen KDS 70/30 Split Wall-Mount Grid `[P1]`
- **Target File:** `customer-next/components/kitchen/ScreenK2Overview.tsx`
- **Instruction:** Ensure the 3-column table cards grid (70% width) and chronological time queue (30% width) maintain exact proportions on 1080p and 1440p landscape monitors.
- **Verification:** View KDS on full-screen monitor; verify 6-table matrix fills the screen cleanly.

### Task 6.7: Manager 16-Screen Gallery Grid Layout `[P2]`
- **Target File:** `customer-next/app/manager/page.tsx`
- **Instruction:** Ensure the "16-Screen Gallery Grid" mode renders all 16 manager screens in a responsive 4x4 matrix on desktop displays for executive presentation.
- **Verification:** Toggle "Gallery View" in Manager portal; verify all 16 screens render side-by-side.

### Task 6.8: Thermal Receipt Print CSS Stylesheet `[P1]`
- **Target File:** `customer-next/app/globals.css`
- **Instruction:** Refine `@media print` rules for 80mm receipts: monochrome high-contrast fonts, no margins, table borders collapsed, zero page headers/footers.
- **Verification:** Trigger `window.print()` from Screen M4; inspect print preview on 80mm paper size.

### Task 6.9: Typography & Font Hierarchy Alignment `[P2]`
- **Target File:** `customer-next/app/layout.tsx`, `customer-next/app/globals.css`
- **Instruction:** Apply standard readable sans-serif typography for UI text and monospace fonts (`font-mono`) for currency values (₹), order codes, and KOT timers.
- **Verification:** Check prices across all screens; verify numbers render in clean tabular monospace.

### Task 6.10: Dark Mode Contrast in Waiter Tablet `[P2]`
- **Target File:** `customer-next/components/waiter/tablet/WaiterTabletLandscapeHousing.tsx`
- **Instruction:** Verify contrast ratios on the dark navy/slate tablet housing (`#0B0F19`) to guarantee readability under low-light ambient dining room lighting.
- **Verification:** Inspect text elements against background; verify WCAG AA compliant contrast.

---

## 🧪 7. Manjunath (`@manju2512`) — QA Testing & DevOps Lead
**Branch:** `feature/manjunath-qa-devops`  
**Working Directory:** `.github/workflows/`, root launch scripts, package configurations

### Task 7.1: Continuous TypeScript Typecheck Verification `[P1]`
- **Target File:** `customer-next/package.json`
- **Instruction:** Run `npm.cmd run type-check` (`tsc --noEmit`) to verify 0 type errors across all 64 component files and stores.
- **Verification:** Terminal must output `exited with code 0`.

### Task 7.2: Next.js Static Production Build Verification `[P1]`
- **Target File:** `customer-next/package.json`, `customer-next/next.config.ts`
- **Instruction:** Run `npm.cmd run build` and ensure all 7 static routes (`/`, `/_not-found`, `/kitchen`, `/waiter`, `/manager`) compile and export in under 15 seconds.
- **Verification:** Build finishes cleanly with green checkmarks.

### Task 7.3: Windows 1-Click Launcher Script Testing `[P1]`
- **Target File:** `RUN_PROJECT.bat`
- **Instruction:** Test running `RUN_PROJECT.bat` on a clean Windows command prompt: ensure it checks Node.js, enters `customer-next/`, installs dependencies if missing, and launches `http://localhost:3001`.
- **Verification:** Double-click `RUN_PROJECT.bat`; verify browser opens to port 3001.

### Task 7.4: macOS / Linux Launcher Script Testing `[P1]`
- **Target File:** `RUN_PROJECT.sh`
- **Instruction:** Verify execute permissions (`chmod +x RUN_PROJECT.sh`) and confirm `bash RUN_PROJECT.sh` starts the development server on Unix environments.
- **Verification:** Execute `bash RUN_PROJECT.sh` in Git Bash or Terminal; verify clean startup.

### Task 7.5: GitHub Actions CI Workflow Setup `[P1]`
- **Target File:** `.github/workflows/ci.yml`
- **Instruction:** Ensure GitHub Actions runs on every Pull Request to `develop`: checks out code, sets up Node 20, runs `npm run type-check`, and executes `npm run build`.
- **Verification:** Push a commit and verify green checkmark in GitHub Actions tab.

### Task 7.6: Cross-Browser Compatibility Auditing `[P2]`
- **Target Browser Matrix:** Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari (iOS/macOS).
- **Instruction:** Test all 4 portals across all 4 major browsers to confirm layout consistency, flexbox rendering, and BroadcastChannel support.
- **Verification:** Document test findings across Chrome, Edge, and Safari.

### Task 7.7: Standalone Wireframe Suite Verification `[P2]`
- **Target File:** `deploy_skeletons/`
- **Instruction:** Open `index.html`, `kitchen-skeletons.html`, `waiter-skeletons.html`, and `manager-skeletons.html` directly in browser via file protocol (`file:///`); verify zero console errors.
- **Verification:** Ensure wireframe navigation works without any web server.

### Task 7.8: Clean Dependency & Lockfile Auditing `[P2]`
- **Target File:** `customer-next/package.json`, `customer-next/package-lock.json`
- **Instruction:** Verify that only required production dependencies are present. Ensure no phantom libraries (no Prisma, Docker, Vitest, PostgreSQL) exist in package manifests.
- **Verification:** Inspect `customer-next/package.json` dependencies; verify 100% strict alignment.

### Task 7.9: Branch Convergence & Merge Conflict Auditing `[P1]`
- **Target Branches:** All 7 `feature/*` branches targeting `develop`.
- **Instruction:** Monitor Git branches, ensure all PRs merge cleanly into `develop` without conflicts, and test integrated builds on `develop` after each merge.
- **Verification:** Perform test merge from feature branch into develop; verify 0 merge conflicts.

### Task 7.10: Production Release Packaging `[P1]`
- **Target File:** Root backup archive
- **Instruction:** Package verified production builds into standard zip archives for milestone submissions and client demonstrations.
- **Verification:** Verify archive contains full source code and documentation.
