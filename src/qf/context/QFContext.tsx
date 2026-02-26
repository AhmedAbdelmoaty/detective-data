import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import { QF_NODES, QF_FRAMINGS, type QFQuestion } from "../data/qf-tree";

export interface QFHistoryEntry {
  questionId: string;
  questionText: string;
  type: "correct" | "less-wrong" | "wrong";
  timeCost: number;
  recapLabel?: string;
  recapIcon?: string;
}

interface QFState {
  currentNodeId: string;
  phase: "intro" | "questioning" | "framing" | "result";
  timeBudget: number; // starts at 600
  notes: string[];
  history: QFHistoryEntry[];
  chosenFraming: "F1" | "F2" | "F3" | null;
  resultType: "win" | "loseFraming" | "loseTime" | null;
  /** While showing response dialogue before moving to next node */
  pendingNextNode: string | null;
  pendingQuestion: QFQuestion | null;
}

type QFAction =
  | { type: "FINISH_INTRO" }
  | { type: "CHOOSE_QUESTION"; question: QFQuestion }
  | { type: "FINISH_RESPONSE" }
  | { type: "CHOOSE_FRAMING"; framingId: "F1" | "F2" | "F3" }
  | { type: "RESET" };

const initialState: QFState = {
  currentNodeId: "intro",
  phase: "intro",
  timeBudget: 600,
  notes: [],
  history: [],
  chosenFraming: null,
  resultType: null,
  pendingNextNode: null,
  pendingQuestion: null,
};

function reducer(state: QFState, action: QFAction): QFState {
  switch (action.type) {
    case "FINISH_INTRO":
      return { ...state, currentNodeId: "r1", phase: "questioning" };

    case "CHOOSE_QUESTION": {
      const q = action.question;
      const newBudget = state.timeBudget - q.timeCost;
      const newNotes = q.note ? [...state.notes, q.note] : state.notes;
      const newHistory: QFHistoryEntry[] = [
        ...state.history,
        {
          questionId: q.id,
          questionText: q.text,
          type: q.type,
          timeCost: q.timeCost,
          recapLabel: q.recapLabel,
          recapIcon: q.recapIcon,
        },
      ];

      // Check if time ran out
      if (newBudget <= 0) {
        return {
          ...state,
          timeBudget: 0,
          notes: newNotes,
          history: newHistory,
          phase: "result",
          resultType: "loseTime",
          pendingNextNode: null,
          pendingQuestion: null,
        };
      }

      return {
        ...state,
        timeBudget: newBudget,
        notes: newNotes,
        history: newHistory,
        pendingNextNode: q.nextNode,
        pendingQuestion: q,
      };
    }

    case "FINISH_RESPONSE": {
      const nextId = state.pendingNextNode;
      if (!nextId) return state;

      const isFraming = nextId === "framing";
      return {
        ...state,
        currentNodeId: nextId,
        phase: isFraming ? "framing" : "questioning",
        pendingNextNode: null,
        pendingQuestion: null,
      };
    }

    case "CHOOSE_FRAMING": {
      const framing = QF_FRAMINGS.find((f) => f.id === action.framingId);
      return {
        ...state,
        chosenFraming: action.framingId,
        phase: "result",
        resultType: framing?.isCorrect ? "win" : "loseFraming",
      };
    }

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

interface QFContextValue {
  state: QFState;
  finishIntro: () => void;
  chooseQuestion: (q: QFQuestion) => void;
  finishResponse: () => void;
  chooseFraming: (id: "F1" | "F2" | "F3") => void;
  resetGame: () => void;
  currentNode: ReturnType<typeof getNode>;
}

function getNode(id: string) {
  return QF_NODES[id] || null;
}

const QFContext = createContext<QFContextValue | null>(null);

export function QFProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const finishIntro = useCallback(() => dispatch({ type: "FINISH_INTRO" }), []);
  const chooseQuestion = useCallback((q: QFQuestion) => dispatch({ type: "CHOOSE_QUESTION", question: q }), []);
  const finishResponse = useCallback(() => dispatch({ type: "FINISH_RESPONSE" }), []);
  const chooseFraming = useCallback((id: "F1" | "F2" | "F3") => dispatch({ type: "CHOOSE_FRAMING", framingId: id }), []);
  const resetGame = useCallback(() => dispatch({ type: "RESET" }), []);

  const currentNode = getNode(state.currentNodeId);

  return (
    <QFContext.Provider value={{ state, finishIntro, chooseQuestion, finishResponse, chooseFraming, resetGame, currentNode }}>
      {children}
    </QFContext.Provider>
  );
}

export function useQF() {
  const ctx = useContext(QFContext);
  if (!ctx) throw new Error("useQF must be inside QFProvider");
  return ctx;
}
