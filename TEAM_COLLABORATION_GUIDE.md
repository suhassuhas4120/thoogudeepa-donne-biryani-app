# 👥 Team Collaboration & Git Workflow Guide
## Thoogudeepa Donne Biryani Mane - Full Restaurant Suite

This repository is structured so that **6 to 7 team members** can work in parallel on different modules of the restaurant platform without stepping on each other's code or encountering merge conflicts.

---

## 🎯 1. Team Role & Module Ownership Matrix

Every team member has a dedicated module and folder boundary. Because each portal has its own dedicated directory in `customer-next/components/` and `customer-next/app/`, team members can code simultaneously with zero interference!

| Member | Assigned Role | Primary Focus Area | Dedicated Folders & Files | Assigned Git Branch |
| :--- | :--- | :--- | :--- | :--- |
| **Member 1** | **Customer App Lead** | Customer ordering, menu browsing, smart cart, UPI payment, loyalty club & feedback rating. | `customer-next/components/screens/`<br/>`customer-next/app/page.tsx`<br/>`customer-next/store/useCustomerStore.ts`<br/>`customer-next/store/useCartStore.ts` | `feature/member-1-customer-portal` |
| **Member 2** | **Kitchen KDS Lead** | Kitchen Display System, station filters, KOT timer aging, 86 item sold-out toggle, recipe yield scaler. | `customer-next/components/kitchen/`<br/>`customer-next/app/kitchen/page.tsx`<br/>`customer-next/store/useKdsStore.ts` | `feature/member-2-kitchen-kds` |
| **Member 3** | **Waiter / Captain Lead** | Waiter handheld & tablet interfaces, table floor feed, tableside POS puncher, Bluetooth thermal bill print. | `customer-next/components/waiter/`<br/>`customer-next/app/waiter/page.tsx`<br/>`customer-next/store/useWaiterStore.ts` | `feature/member-3-waiter-portal` |
| **Member 4** | **Manager HQ Lead** | Manager Command Center, executive dashboard, interactive floor map, staff attendance, sales analytics & Z-Report. | `customer-next/components/manager/`<br/>`customer-next/app/manager/page.tsx`<br/>`customer-next/store/useManagerStore.ts` | `feature/member-4-manager-portal` |
| **Member 5** | **Real-Time Backend Lead** | Shared reactive bridge synchronizer, Node/WebSocket real-time events, API endpoints & database integration. | `customer-next/store/useSharedBridge.ts`<br/>`server.js`<br/>`data/*.json`<br/>`customer-next/types/` | `feature/member-5-backend-bridge` |
| **Member 6** | **UI/UX & Design Lead** | Visual styling, Tailwind tokens, Biryani amber/emerald theme, animations, icons, wireframe updates. | `customer-next/app/globals.css`<br/>`customer-next/tailwind.config.js`<br/>`customer-next/components/ui/`<br/>`deploy_skeletons/` | `feature/member-6-ui-design-tokens` |
| **Member 7** | **QA, Testing & DevOps** | Unit tests, integration tests, CI/CD pipelines, Docker containerization, cloud hosting & performance audits. | `.github/workflows/`<br/>`customer-next/next.config.ts`<br/>Documentation & Test suites | `feature/member-7-qa-devops` |

---

## 🌿 2. Git Branching Strategy (GitFlow)

We follow a clean, structured GitFlow model:

```
main (Production Ready - Deployed to Live)
  ▲
  │ (Merge via Pull Request after testing)
develop (Integration Branch - All 7 members merge here)
  ▲
  ├── feature/member-1-customer-portal
  ├── feature/member-2-kitchen-kds
  ├── feature/member-3-waiter-portal
  ├── feature/member-4-manager-portal
  ├── feature/member-5-backend-bridge
  ├── feature/member-6-ui-design-tokens
  └── feature/member-7-qa-devops
```

1. **`main` branch**: Production branch. Always stable, clean, and deployable.
2. **`develop` branch**: Team integration branch. All feature branches merge into `develop`.
3. **`feature/*` branches**: Where daily development occurs.

---

## 🚀 3. Step-by-Step Setup Guide for Team Lead

### Step A: Push This Local Repository to GitHub / GitLab
1. Go to [GitHub.com](https://github.com/) and click **"New repository"**.
2. Name the repository: `thoogudeepa-biryani-app` (choose Private or Public).
3. **Do NOT** check "Add a README" or ".gitignore" (we already have created them!).
4. Run these terminal commands in this folder:

```bash
# 1. Add your remote GitHub URL (replace with your actual URL)
git remote add origin https://github.com/YOUR_ORGANIZATION_OR_USERNAME/thoogudeepa-biryani-app.git

# 2. Push main and develop branches
git push -u origin main
git push -u origin develop

# 3. Push all pre-configured feature branches for your team
git push --all origin
```

5. In GitHub settings, add your 6-7 team members as **Collaborators**.

---

## 💻 4. Daily Workflow Guide for Every Team Member

When a team member begins work, they should follow these simple steps:

### 1. Clone the Repository (First Time Only)
```bash
git clone https://github.com/YOUR_ORGANIZATION_OR_USERNAME/thoogudeepa-biryani-app.git
cd thoogudeepa-biryani-app/customer-next
npm install
```

### 2. Switch to Your Assigned Feature Branch
For example, if you are **Member 2 (Kitchen KDS)**:
```bash
git checkout feature/member-2-kitchen-kds
```

### 3. Sync with Latest Team Changes from `develop`
Before coding each day, pull updates merged by teammates:
```bash
git pull origin develop
```

### 4. Code and Test Locally
Launch the application:
```bash
npm run dev
```
Visit your portal (e.g. `http://localhost:3001/kitchen/`) and make your changes.

### 5. Commit and Push Your Work
```bash
git status
git add .
git commit -m "feat(kitchen): add acoustic chime alert for high-priority KOT tickets"
git push origin feature/member-2-kitchen-kds
```

### 6. Create a Pull Request (PR) on GitHub
1. Open GitHub and navigate to the repository.
2. Click **"Compare & pull request"**.
3. Set base branch: **`develop`** ⬅️ compare branch: **`feature/your-branch`**.
4. Request review from another team member or the Team Lead.
5. Once approved, click **"Merge pull request"**.

---

## 🛡️ 5. Rules for Preventing Conflicts

1. **Do NOT commit to `main` directly**: All changes must go through `develop` via Pull Requests.
2. **Stay inside your module boundary**: If you are working on Kitchen, do not edit Customer files unless aligned with Member 1.
3. **Shared Bridge Changes**: If you need to add a new shared state property to `useSharedBridge.ts`, notify **Member 5 (Backend Lead)** so everyone stays in sync.
4. **Clean Builds**: Before submitting a PR, always run:
   ```bash
   cd customer-next
   npm run type-check
   npm run build
   ```
   Ensure there are zero TypeScript errors.

---

## 📞 Portal Direct URLs for Testing
- 📱 Customer App: `http://localhost:3001/`
- 🍳 Kitchen KDS: `http://localhost:3001/kitchen/`
- 🤵 Waiter Suite: `http://localhost:3001/waiter/`
- 💼 Manager HQ: `http://localhost:3001/manager/`
