
# Fix: Game Progression Blocked + UI Freeze After Replay

## Problem 1: No CTA Button on Analyst Hub

**Root Cause:** When the player finishes hypothesis selection and navigates to `analyst-hub`, `currentPhaseIndex` remains at `0`. In `PHASES`, index 0 and 1 have empty `ctaLabel: ""`. The CTA button renders only when `canAdvance() && ctaLabel` -- since `ctaLabel` is empty string (falsy), the button never appears.

**Fix:** Auto-advance `currentPhaseIndex` to `2` when transitioning from hypothesis selection to analyst hub. This can be done in two places:

1. **`HypothesisSelectScreen.tsx`**: Before calling `onComplete()`, call `advancePhase()` twice (0->1, 1->2) to skip the "scenes" and "hypothesis-select" phases that are already done.

2. **OR `AnalystHubScreen.tsx`**: Add a `useEffect` that auto-advances if `currentPhaseIndex < 2` (since phases 0 and 1 are pre-hub steps).

**Recommended approach:** Option 1 - advance in `HypothesisSelectScreen` before navigating. This is cleaner because the phase advancement happens at the logical transition point.

### Changes:
- **`src/components/game/screens/HypothesisSelectScreen.tsx`**:
  - Import `advancePhase` from `useGame()`
  - In `handleStart()`, call `advancePhase()` twice before `onComplete()` to move from phase 0 to phase 2
  - This ensures that when AnalystHub loads, `currentPhaseIndex` is 2, `ctaLabel` is "Start with Data", and D1+D2 are unlocked

---

## Problem 2: UI Freeze After Replaying Scenes

**Root Cause:** The `EnhancedDialogue` component uses `AnimatePresence` with a `fixed inset-0 z-40` backdrop div. When the OfficeScreen unmounts the replay dialogue (setting `showReplayScenes = false`), the parent conditional render removes the component immediately without waiting for AnimatePresence exit animations. This can leave ghost DOM elements blocking interaction.

Additionally, the OfficeScreen wraps the replay in its own `motion.div` with `fixed inset-0 z-50 bg-black/50` which also needs proper cleanup.

### Changes:
- **`src/components/game/screens/OfficeScreen.tsx`**:
  - Wrap the replay scenes conditional block in `AnimatePresence` to ensure proper exit animation cleanup
  - Same for the extra dialogue and conclusion dialogue blocks

- **`src/components/game/EnhancedDialogue.tsx`**:
  - Add a safety mechanism: reset internal state (`internalIndex`, `displayedText`) when `isActive` changes to false
  - Ensure the backdrop exit animation completes before unmounting

---

## Summary of File Changes

| File | Change |
|---|---|
| `HypothesisSelectScreen.tsx` | Call `advancePhase()` twice in `handleStart()` to set phase to 2 before navigating to hub |
| `OfficeScreen.tsx` | Wrap dialogue overlays in `AnimatePresence` for proper cleanup |
| `EnhancedDialogue.tsx` | Reset internal state when deactivated to prevent ghost renders |

## Technical Detail

The `advancePhase()` calls will:
- First call: phase 0 -> 1, unlocks nothing (hypothesis-select phase)
- Second call: phase 1 -> 2, unlocks D1, D2 (dashboard), N1, N2 (noise evidence), and sets `ctaLabel = "Start from Data"` and `ctaTarget = "dashboard"`

After this fix, the Analyst Hub will show:
- The CTA button "Start from Data" pointing to the dashboard
- Navigation buttons for data/evidence/floor will appear as items unlock
- The phase counter will show "2/11" instead of "0/11"
