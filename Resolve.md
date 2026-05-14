# Centrix Dashboard — Master Improvement Prompt
## (Windsurf / Kimi 2.6 ke liye)

---

## CONTEXT (Project Background)

You are working on **Centrix** — an Educational Therapy Management System (React-based web dashboard).  
The app manages **Examinees, Therapists, Assessment Tools, Forms, Templates, and Reports**.  
The tech stack is **React + JavaScript**. Use the following libraries where needed:
- Animations: **Framer Motion**
- Icons: **Lucide React**
- Tables: **TanStack Table**
- Charts: **Recharts**
- Drag & Drop: **dnd-kit**
- Toast notifications: **Sonner**
- List virtualization: **react-window**

---

## ROLE

You are a senior frontend engineer. Your job is to implement the following improvements to the Centrix dashboard **one phase at a time**, starting with the most critical (Safety), then Quick Wins, then Medium, then Big features.

**Before writing any code:**
1. Read the existing component file relevant to the task.
2. Understand the current data flow and props.
3. Make the minimal change needed — do not refactor unrelated code.
4. After each change, confirm what was done and what file was modified.

---

## PHASE 1 — 🔴 SAFETY (Do these FIRST — deploy immediately)

### Task 1.1 — Examinee Edit: Move Delete button away from Save
- The Delete button is currently sitting ~8px from the Save button on the Examinee edit form.
- This is a clinical data-loss risk (therapists can accidentally delete a child's record).
- **Fix:** Move the Delete button to the **top-right corner** of the form (or a separate "Danger Zone" section at the bottom with red border).
- Add a **confirmation dialog** before deletion: "Are you sure you want to delete [Examinee Name]? This cannot be undone." with Cancel and Delete buttons.

### Task 1.2 — Examinee Edit: Unsaved changes warning
- When a therapist has made changes to the form and tries to navigate away (back button, sidebar link, tab change), show a browser-native `beforeunload` warning OR a custom modal: "You have unsaved changes. Leave anyway?"
- Implement using React state to track `isDirty` (true when any field changes, false after save).

---

## PHASE 2 — ⚡ QUICK WINS (1–2 hours each)

### Task 2.1 — Forms & Templates: Collapse action buttons into ⋯ menu
- Each form/template card currently shows 4 stacked buttons: New Report / Rename / Copy / Delete.
- **Fix:** Keep "New Report" as a primary CTA button. Move Rename / Copy / Delete into a `⋯` overflow dropdown menu (appears on card hover or on ⋯ click).
- Use Lucide `MoreVertical` icon for the trigger.

### Task 2.2 — Therapists page: Remove manual Refresh button
- Replace the manual Refresh button with **auto-refresh every 60 seconds**.
- Show a small grey timestamp: "Last updated: 2 min ago" (use a relative time function).

### Task 2.3 — Global: Table row hover states
- All tables currently have no hover state, making them feel like static spreadsheets.
- **Fix:** Add `hover:bg-gray-50 cursor-pointer transition-colors duration-150` (or equivalent CSS) to every `<tr>` element across all tables in the app.

### Task 2.4 — Global: CSS micro-animations
- Add `transition: all 0.2s ease` to all cards, buttons, and sidebar items.
- Add `transform: translateY(-2px) box-shadow: 0 4px 12px rgba(0,0,0,0.1)` on card hover for a subtle lift.

### Task 2.5 — Global: Replace alert() with toast notifications
- Find every `alert()`, `confirm()`, and page-refresh-based success/error message in the codebase.
- Replace with **Sonner** toast notifications:
  - Success: `toast.success("Assessment saved ✓")`
  - Error: `toast.error("Something went wrong")`
  - Add `<Toaster />` to the root layout.

### Task 2.6 — Global: Empty state screens
- Every list/table page that can be empty (Examinees, Forms, Therapists, Reports) should show a friendly empty state instead of a blank area.
- Design: Centered icon (Lucide) + heading + subtext + CTA button.
- Example: "No Examinees yet — Add your first examinee →"

### Task 2.7 — Global: Consistent spacing scale
- Audit all padding/margin values in the app.
- Enforce a strict spacing scale: `4px, 8px, 16px, 24px, 32px, 48px, 64px`.
- Fix any inconsistent values (e.g., 10px, 15px, 22px).

### Task 2.8 — Global: Skeleton loaders
- Replace all loading spinners with **skeleton screen placeholders** that match the shape of the content being loaded.
- For tables: skeleton rows with grey shimmer bars.
- For cards: skeleton card shapes.
- Use CSS animation: `@keyframes shimmer` with a gradient sweep.

### Task 2.9 — Global: Consistent icon set
- Replace all mixed icons with **Lucide React** icons consistently.
- Ensure icon size is always `16px` inline, `20px` for buttons, `24px` for headings.

### Task 2.10 — Global: Spacing system enforcement
- Create a `spacing.js` or `theme.js` constants file with the spacing scale.
- Replace all hardcoded pixel values in component files with these constants.

---

## PHASE 3 — 🟡 MEDIUM TASKS (Half day to full day each)

### Task 3.1 — Examinees: Slide-out drawer for quick view
- Clicking a row in the Examinees table should open a **slide-out drawer from the right** (not navigate to a new page).
- Drawer shows: Name, Age, DOB, Therapist assigned, last assessment date, and action buttons (Edit, Delete, New Report).
- Clicking "Edit" inside the drawer navigates to the full edit form.
- Drawer closes on Escape key or clicking outside.

### Task 3.2 — Examinee Edit: View/Edit mode split
- By default, opening an examinee shows a **read-only view** (clean, card-style layout of all their info).
- An "Edit" button in the top-right switches to the editable form.
- A "Cancel" button exits edit mode and restores the original values.
- This prevents accidental edits during routine lookups.

### Task 3.3 — Examinees: Inline editing
- In the Examinees table, allow clicking a name or score cell to edit it inline.
- Show a small input field in place of the text. On Enter or blur, auto-save and show a toast.

### Task 3.4 — Examinees: Tag-based filters
- Add a filter bar above the Examinees table with tag chips: Grade, Subject, Status, Therapist.
- Filters apply **instantly client-side** — no API call, no page reload.
- Multiple tags can be active at once (AND logic).
- "Clear all" button resets filters.

### Task 3.5 — Examinees: List virtualization
- If the Examinees list can have more than 100 rows, implement **react-window** `FixedSizeList` or `VariableSizeList`.
- This ensures the DOM doesn't render 1000+ rows at once, preventing scroll lag.

### Task 3.6 — Assessment Tools: Accordion sections
- Group assessment tools by category.
- Each category is a collapsible **accordion** using `max-height` CSS transition (not JS toggle).
- Expanded by default on first load; remembers open/closed state in localStorage.

### Task 3.7 — Assessment Tools: Animated progress bar
- For any assessment that has a `status: "in-progress"` and a `completionPercent` field, show an animated progress bar.
- Use a CSS `@keyframes` width animation. Do NOT just show a static number.

### Task 3.8 — Assessment Tools: Debounce search input
- If there is a search bar on the Assessment Tools page, debounce the input with a **300ms delay** before firing the API call or filtering.
- Use a `useDebounce` custom hook.

### Task 3.9 — Forms & Templates: Drag-and-drop reordering
- Allow therapists to reorder form/template cards via drag-and-drop.
- Use **dnd-kit** (`@dnd-kit/core` + `@dnd-kit/sortable`).
- Persist the order to the backend (or localStorage as fallback).

### Task 3.10 — Global: TanStack Table
- Replace any custom table implementations with **TanStack Table (react-table v8)**.
- Enable: column sorting (click header), client-side pagination (10/25/50 rows per page), and global text search.

### Task 3.11 — Global: Recharts data visualization
- On pages that show numeric data (assessment scores, completion rates), add a **Recharts** chart.
- Suggested: BarChart for score comparisons, LineChart for progress over time.

### Task 3.12 — Global: Lazy loading
- Wrap all heavy page components in `React.lazy()` and `Suspense`.
- This reduces initial bundle size and speeds up first paint.

### Task 3.13 — Global: Framer Motion transitions
- Add `framer-motion` `AnimatePresence` and `motion.div` wrappers for:
  - Page transitions (fade + slide)
  - Modal/drawer open-close
  - Toast pop-ins
- Keep animations subtle: duration 0.2–0.3s, ease: "easeOut".

### Task 3.14 — Global: Mobile responsiveness
- Audit every screen at 375px, 768px, and 1280px viewport widths.
- Fix: tables should scroll horizontally on mobile, sidebar should collapse to a hamburger menu, cards should stack vertically.

---

## PHASE 4 — 🔵 BIG FEATURES (Multi-day)

### Task 4.1 — Examinees: Full slide-out drawer component
- Build a reusable `<ExamineeDrawer />` component.
- Tabs inside drawer: Summary | Evaluations | Documents | Reports.
- Actions: Edit, Delete (with confirm), New Report, Print.
- Animate with Framer Motion slide-in from right.

### Task 4.2 — Examinee Edit: Full tabbed view/edit layout
- Rebuild the Examinee edit page with proper tabs: **Personal Info | Evaluation | History | Documents | Report**.
- Each tab has its own read-only view and edit mode.
- Tab switching uses smooth Framer Motion transitions.
- Unsaved changes badge appears on the tab that has changes.

### Task 4.3 — Examinee Edit: Smooth tab navigation
- Ensure tab switching is animated (slide left/right depending on direction).
- Active tab is highlighted. Inactive tabs are greyed out but accessible.

### Task 4.4 — Reports: Real-time generation progress
- When a report is being generated, show a multi-step progress UI:
  Step 1: Fetching data → Step 2: Generating content → Step 3: Finalising PDF
- Use a step indicator + animated progress bar.
- Do NOT show a generic spinner.

### Task 4.5 — Dashboard: Analytics summary panel
- Add a summary row at the top of the dashboard with 4 stat cards:
  Total Examinees | Active Assessments | Pending Reports | Therapists Active
- Each card shows the number, a trend indicator (up/down vs last week), and a Lucide icon.

### Task 4.6 — Global: Role-based UI
- Show different navigation items and action buttons based on user role: `admin` vs `therapist`.
- Admin sees: all examinees, all therapists, system settings.
- Therapist sees: only their assigned examinees.
- Implement using a `useRole()` context hook.

### Task 4.7 — Global: Global search
- Add a global search bar in the top navigation (keyboard shortcut: Cmd/Ctrl + K).
- Searches across: Examinees (by name), Forms (by title), Reports (by examinee name).
- Shows results grouped by category in a dropdown. Clicking navigates to the item.

### Task 4.8 — Global: Persist filter/sort state
- Save active filters, sort column, sort direction, and page number to the URL as query params.
- On page refresh or back-navigation, restore the previous state from the URL.

### Task 4.9 — Global: Keyboard shortcuts
- Implement keyboard shortcuts:
  - `N` → New Examinee (on Examinees page)
  - `S` → Save (on any edit form, when focused inside a field)
  - `Esc` → Close modal/drawer/cancel edit
  - `Cmd/Ctrl + K` → Open global search
- Show a shortcut hint tooltip on relevant buttons.

### Task 4.10 — Global: E2E test suite
- Set up **Playwright** (or Cypress) for E2E testing.
- Write tests for:
  1. Login flow
  2. Create new Examinee
  3. Edit Examinee and save
  4. Generate a Report
  5. Delete Examinee (with confirmation cancel + confirm)

---

## EXECUTION RULES

1. **Always work one task at a time.** Tell me which task you are starting before writing code.
2. **Show me the file path** of every file you modify.
3. **Do not break existing functionality.** If a change risks breaking something, ask first.
4. **After each task**, summarize: what changed, what file, and what to test manually.
5. **If you are unsure** about the current data structure or API, ask me before assuming.
6. **Commit message format:** `fix: [task number] - [short description]` (e.g., `fix: 1.1 - move delete button away from save`)

---

## START COMMAND

Start with **Phase 1, Task 1.1** — move the Delete button on the Examinee edit form.  
First, show me the current code of the Examinee edit component, then propose your change.