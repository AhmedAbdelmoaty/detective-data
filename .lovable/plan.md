

# Auto Save + Reset Button

## What Changes

### 1. GameContext.tsx - Add localStorage persistence
- On initialization: load saved state from `localStorage` (key: `detective-game-save`) instead of using `initialState`
- On every state change: save the updated state to `localStorage` using a `useEffect`
- Add a `resetGame` update: clear `localStorage` when resetting
- The `currentScreen` from `Index.tsx` also needs to be persisted (either inside GameState or separately)

### 2. Index.tsx - Persist current screen
- Save `currentScreen` to `localStorage` whenever it changes
- Load it on mount to restore the correct screen

### 3. SoundToggle.tsx - Add "Start Over" button
- Add a red button at the bottom of the existing settings panel labeled "ابدأ من جديد" with a `RotateCcw` icon
- On click: show a confirmation prompt (simple `window.confirm` in Arabic), then call `resetGame()` from GameContext and reload the page

---

## Technical Details

**localStorage key**: `detective-game-save`
**Screen key**: `detective-game-screen`

**GameContext changes**:
```
// Load
const loadState = (): GameState => {
  const saved = localStorage.getItem("detective-game-save");
  return saved ? JSON.parse(saved) : initialState;
};

// Save on every change via useEffect
useEffect(() => {
  localStorage.setItem("detective-game-save", JSON.stringify(state));
}, [state]);

// Reset clears storage
const resetGame = () => {
  localStorage.removeItem("detective-game-save");
  localStorage.removeItem("detective-game-screen");
  setState(initialState);
};
```

**Index.tsx changes**:
```
// Load screen
const [currentScreen, setCurrentScreen] = useState<Screen>(
  () => (localStorage.getItem("detective-game-screen") as Screen) || "intro"
);

// Save screen
useEffect(() => {
  localStorage.setItem("detective-game-screen", currentScreen);
}, [currentScreen]);
```

**SoundToggle.tsx changes**:
- Import `useGame` and `RotateCcw` icon
- Add button below volume slider with confirmation dialog
- On confirm: call `resetGame()`, remove screen key, reload page

