## Iteration 1 — Planner hat

Read all source files. Key observations:

1. **MobileOverviewHeader** should be a straightforward extraction. Most of the content already exists in MobileBottomNav's drawer (lines 273–381). The action buttons already exist in MobilePatientBanner (lines 228–323). I'm combining both into the new component.

2. **MobileBottomNav cleanup** is significant — removing the drawer eliminates ~280 lines and most imports. The component goes from 388 lines to roughly 50. The `onSearchClick` prop becomes dead after drawer removal.

3. **NavItems change**: new "Overview" at position 0 with `UserRound` icon pointing to `mobile-overview` tile. Old "Overview" renamed to "Summary" with `ClipboardList` icon, keeping `patient-summary` tile.

4. **DashboardLayout** changes are minimal: swap import + component, remove one prop from MobileBottomNav.

5. **TagPill** component exists in both MobileBottomNav and Sidebar. The new MobileOverviewHeader needs its own copy (same implementation). Could extract to a shared component, but the spec doesn't call for that — keep it local.

Plan written to `.ralph/plan.md`. Emitting plan.ready for builder hat.
