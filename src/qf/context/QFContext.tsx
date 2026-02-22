import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from "react";
import {
  QFBoardUpdate,
  qfScenes,
  qfEndings,
  type QFEndingDef,
} from "../data/qfCaseData";

// ── State shape ──────────────────────────────────────────────
interface FramingBoard {
  context: string[];
  unknowns: string[];
  structure: {
    visits: string[];
    conversion: string[];
    basket: string[];
    availability: string[];
  };
  decision: string[];
}

interface StateSnapshot {
  currentScene: number;
  timeRemaining: number;
  trust: number;
  clarity: number;
  board: FramingBoard;
  choices: Record<string, string>;
  jumpedToSolution: boolean;
}

export interface QFState {
  currentScene: number;
  timeRemaining: number; // seconds (starts 720 = 12min)
  trust: number; // 0-100
  clarity: number; // 0-100
  board: FramingBoard;
  history: StateSnapshot[];
  choices: Record<string, string>; // sceneId -> choiceId
  jumpedToSolution: boolean;
  finalChoices: {
    problemStatement: string | null;
    goldenQuestions: string[];
    decisionMappings: string[];
  };
  gamePhase: "intro" | "playing" | "closing" | "ending";
  ending: QFEndingDef | null;
  boardGlow: boolean; // for animation
}

const emptyBoard: FramingBoard = {
  context: [],
  unknowns: [],
  structure: { visits: [], conversion: [], basket: [], availability: [] },
  decision: [],
};

const initialState: QFState = {
  currentScene: 0,
  timeRemaining: 720,
  trust: 60,
  clarity: 10,
  board: emptyBoard,
  history: [],
  choices: {},
  jumpedToSolution: false,
  finalChoices: { problemStatement: null, goldenQuestions: [], decisionMappings: [] },
  gamePhase: "intro",
  ending: null,
  boardGlow: false,
};

// ── Actions ──────────────────────────────────────────────────
type QFAction =
  | { type: "START_GAME" }
  | { type: "MAKE_CHOICE"; sceneId: string; choiceId: string; timeCost: number; trustChange: number; clarityChange: number; boardUpdates: QFBoardUpdate[]; flagJump?: boolean }
  | { type: "ADVANCE_SCENE" }
  | { type: "BACKTRACK" }
  | { type: "SET_CLOSING" }
  | { type: "SET_FINAL_CHOICES"; problemStatement: string; goldenQuestions: string[]; decisionMappings: string[] }
  | { type: "EVALUATE" }
  | { type: "RESET" }
  | { type: "CLEAR_GLOW" }
  | { type: "LOAD_STATE"; state: QFState };

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function applyBoardUpdates(board: FramingBoard, updates: QFBoardUpdate[]): FramingBoard {
  const b: FramingBoard = {
    context: [...board.context],
    unknowns: [...board.unknowns],
    structure: {
      visits: [...board.structure.visits],
      conversion: [...board.structure.conversion],
      basket: [...board.structure.basket],
      availability: [...board.structure.availability],
    },
    decision: [...board.decision],
  };
  for (const u of updates) {
    if (u.tab === "structure" && u.structureBranch) {
      if (!b.structure[u.structureBranch].includes(u.content)) {
        b.structure[u.structureBranch].push(u.content);
      }
    } else {
      const arr = b[u.tab] as string[];
      if (!arr.includes(u.content)) {
        arr.push(u.content);
      }
    }
  }
  return b;
}

function evaluateEnding(state: QFState): QFEndingDef {
  if (state.timeRemaining <= 0) return qfEndings.find(e => e.rank === "D")!;
  if (state.jumpedToSolution && state.clarity < 50) return qfEndings.find(e => e.rank === "C")!;

  // Score final choices
  let finalScore = 0;
  const ps = state.finalChoices.problemStatement;
  if (ps === "ps-1") finalScore += 30;
  else if (ps === "ps-3") finalScore += 10;

  for (const gq of state.finalChoices.goldenQuestions) {
    if (["gq-1", "gq-2", "gq-3"].includes(gq)) finalScore += 15;
    else if (gq === "gq-6") finalScore += 5;
  }

  for (const dm of state.finalChoices.decisionMappings) {
    if (["dm-1", "dm-2"].includes(dm)) finalScore += 10;
    else if (dm === "dm-5") finalScore += 3;
  }

  const totalScore = state.clarity + (state.trust * 0.3) + finalScore;

  if (totalScore >= 120) return qfEndings.find(e => e.rank === "S")!;
  if (totalScore >= 85) return qfEndings.find(e => e.rank === "A")!;
  if (state.jumpedToSolution) return qfEndings.find(e => e.rank === "C")!;
  return qfEndings.find(e => e.rank === "B")!;
}

// ── Reducer ──────────────────────────────────────────────────
function qfReducer(state: QFState, action: QFAction): QFState {
  switch (action.type) {
    case "START_GAME":
      return { ...initialState, gamePhase: "playing" };

    case "MAKE_CHOICE": {
      // snapshot for backtrack
      const snapshot: StateSnapshot = {
        currentScene: state.currentScene,
        timeRemaining: state.timeRemaining,
        trust: state.trust,
        clarity: state.clarity,
        board: state.board,
        choices: { ...state.choices },
        jumpedToSolution: state.jumpedToSolution,
      };
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - action.timeCost),
        trust: clamp(state.trust + action.trustChange, 0, 100),
        clarity: clamp(state.clarity + action.clarityChange, 0, 100),
        board: applyBoardUpdates(state.board, action.boardUpdates),
        history: [...state.history, snapshot],
        choices: { ...state.choices, [action.sceneId]: action.choiceId },
        jumpedToSolution: state.jumpedToSolution || !!action.flagJump,
        boardGlow: action.boardUpdates.length > 0,
      };
    }

    case "ADVANCE_SCENE": {
      const next = state.currentScene + 1;
      if (next >= qfScenes.length) {
        return { ...state, gamePhase: "closing", currentScene: next - 1 };
      }
      // Check time
      if (state.timeRemaining <= 0) {
        return { ...state, gamePhase: "ending", ending: qfEndings.find(e => e.rank === "D")! };
      }
      return { ...state, currentScene: next };
    }

    case "BACKTRACK": {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        ...state,
        currentScene: prev.currentScene,
        timeRemaining: Math.max(0, prev.timeRemaining - 45),
        trust: clamp(prev.trust - 3, 0, 100),
        clarity: prev.clarity,
        board: prev.board,
        choices: prev.choices,
        jumpedToSolution: prev.jumpedToSolution,
        history: state.history.slice(0, -1),
      };
    }

    case "SET_CLOSING":
      return { ...state, gamePhase: "closing" };

    case "SET_FINAL_CHOICES":
      return {
        ...state,
        finalChoices: {
          problemStatement: action.problemStatement,
          goldenQuestions: action.goldenQuestions,
          decisionMappings: action.decisionMappings,
        },
      };

    case "EVALUATE":
      return { ...state, gamePhase: "ending", ending: evaluateEnding(state) };

    case "RESET":
      return initialState;

    case "CLEAR_GLOW":
      return { ...state, boardGlow: false };

    case "LOAD_STATE":
      return action.state;

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
interface QFContextType {
  state: QFState;
  dispatch: React.Dispatch<QFAction>;
  startGame: () => void;
  makeChoice: (sceneId: string, choiceId: string, timeCost: number, trustChange: number, clarityChange: number, boardUpdates: QFBoardUpdate[], flagJump?: boolean) => void;
  advanceScene: () => void;
  backtrack: () => void;
  submitFinal: (ps: string, gqs: string[], dms: string[]) => void;
  resetGame: () => void;
}

const QFContext = createContext<QFContextType | null>(null);

const STORAGE_KEY = "QF_V1_STATE";

export const QFProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(qfReducer, initialState, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as QFState;
    } catch {}
    return initialState;
  });

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const startGame = useCallback(() => dispatch({ type: "START_GAME" }), []);
  const makeChoice = useCallback(
    (sceneId: string, choiceId: string, timeCost: number, trustChange: number, clarityChange: number, boardUpdates: QFBoardUpdate[], flagJump?: boolean) =>
      dispatch({ type: "MAKE_CHOICE", sceneId, choiceId, timeCost, trustChange, clarityChange, boardUpdates, flagJump }),
    [],
  );
  const advanceScene = useCallback(() => dispatch({ type: "ADVANCE_SCENE" }), []);
  const backtrack = useCallback(() => dispatch({ type: "BACKTRACK" }), []);
  const submitFinal = useCallback(
    (ps: string, gqs: string[], dms: string[]) => {
      dispatch({ type: "SET_FINAL_CHOICES", problemStatement: ps, goldenQuestions: gqs, decisionMappings: dms });
      setTimeout(() => dispatch({ type: "EVALUATE" }), 100);
    },
    [],
  );
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }, []);

  return (
    <QFContext.Provider value={{ state, dispatch, startGame, makeChoice, advanceScene, backtrack, submitFinal, resetGame }}>
      {children}
    </QFContext.Provider>
  );
};

export const useQF = () => {
  const ctx = useContext(QFContext);
  if (!ctx) throw new Error("useQF must be used within QFProvider");
  return ctx;
};
