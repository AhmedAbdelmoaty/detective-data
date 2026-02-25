import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import {
  QF_TREE, QF_START_NODE, QF_TOTAL_TIME, QF_COSTS,
  GOLDEN_NOTE_IDS, GOLDEN_NOTES_REQUIRED,
  FRAMING_OPTIONS, ENDINGS, EDUCATIONAL_TIPS,
  type QFNode, type QFChoice, type QFNote, type QuestionType,
} from "@/qf/data/qf-tree";

// ============================================
// Types
// ============================================

export interface QFDecision {
  nodeId: string;
  choiceId: string;
  choiceText: string;
  type: QuestionType;
  cost: number;
  character: string;
}

export interface QFState {
  timeRemaining: number;
  currentNodeId: string;
  notes: QFNote[];
  decisions: QFDecision[];
  history: string[]; // node IDs for backtrack
  removedChoices: Record<string, string[]>; // nodeId → removed choice IDs
  backtrackUsedInRound: Record<string, boolean>;
  phase: "playing" | "responding" | "framing" | "result";
  lastResponse: string | null;
  lastResponseCharacter: string | null;
  selectedFraming: string | null;
  endingType: "success" | "wrong" | "timeout" | null;
}

interface QFContextType {
  state: QFState;
  currentNode: QFNode | null;
  availableChoices: QFChoice[];
  
  // Actions
  selectChoice: (choiceId: string) => void;
  dismissResponse: () => void;
  backtrack: () => void;
  canBacktrack: () => boolean;
  selectFraming: (framingId: string) => void;
  
  // Queries
  goldenNoteCount: number;
  isTimeCritical: boolean;
  getEndingData: () => { response: string; tip: string; type: string } | null;
  
  // Game
  resetGame: () => void;
}

// ============================================
// Initial State
// ============================================

const initialState: QFState = {
  timeRemaining: QF_TOTAL_TIME,
  currentNodeId: QF_START_NODE,
  notes: [],
  decisions: [],
  history: [],
  removedChoices: {},
  backtrackUsedInRound: {},
  phase: "playing",
  lastResponse: null,
  lastResponseCharacter: null,
  selectedFraming: null,
  endingType: null,
};

const STORAGE_KEY = "QF_V1_STATE";

const loadState = (): QFState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState, ...JSON.parse(saved) };
  } catch {}
  return initialState;
};

// ============================================
// Context
// ============================================

const QFContext = createContext<QFContextType | undefined>(undefined);

export const QFProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<QFState>(loadState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Timer
  useEffect(() => {
    if (state.phase === "playing" || state.phase === "responding") {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(timerRef.current!);
            return { ...prev, timeRemaining: 0, phase: "result", endingType: "timeout" };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.phase]);

  // Current node
  const currentNode = QF_TREE[state.currentNodeId] || null;

  // Available choices (filter removed)
  const availableChoices = currentNode
    ? currentNode.choices.filter(c => !(state.removedChoices[state.currentNodeId] || []).includes(c.id))
    : [];

  // Auto-advance for nodes with no choices (like R4_NEWPRODUCT_KHALED)
  useEffect(() => {
    if (state.phase === "playing" && currentNode && currentNode.choices.length === 0 && !currentNode.isFraming) {
      // Auto-advance to framing after a brief delay
      const timeout = setTimeout(() => {
        setState(prev => ({ ...prev, currentNodeId: "FRAMING", phase: "playing" }));
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.currentNodeId, state.phase, currentNode]);

  // Auto-add autoNote when entering a node
  useEffect(() => {
    if (currentNode?.autoNote && state.phase === "playing") {
      setState(prev => {
        if (prev.notes.some(n => n.id === currentNode.autoNote!.id)) return prev;
        return { ...prev, notes: [...prev.notes, currentNode.autoNote!] };
      });
    }
  }, [state.currentNodeId, currentNode, state.phase]);

  // Check if framing node reached
  useEffect(() => {
    if (currentNode?.isFraming && state.phase === "playing") {
      setState(prev => ({ ...prev, phase: "framing" }));
    }
  }, [state.currentNodeId, currentNode, state.phase]);

  // Select a choice
  const selectChoice = useCallback((choiceId: string) => {
    if (state.phase !== "playing") return;
    const node = QF_TREE[state.currentNodeId];
    if (!node) return;
    const choice = node.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setState(prev => {
      const newTime = prev.timeRemaining - choice.cost;
      if (newTime <= 0) {
        return { ...prev, timeRemaining: 0, phase: "result", endingType: "timeout" };
      }

      const newNotes = choice.note && !prev.notes.some(n => n.id === choice.note!.id)
        ? [...prev.notes, choice.note!]
        : prev.notes;

      const decision: QFDecision = {
        nodeId: prev.currentNodeId,
        choiceId: choice.id,
        choiceText: choice.text,
        type: choice.type,
        cost: choice.cost,
        character: choice.character,
      };

      const newRemoved = choice.nextNodeId === null
        ? {
            ...prev.removedChoices,
            [prev.currentNodeId]: [...(prev.removedChoices[prev.currentNodeId] || []), choice.id],
          }
        : prev.removedChoices;

      return {
        ...prev,
        timeRemaining: newTime,
        notes: newNotes,
        decisions: [...prev.decisions, decision],
        history: [...prev.history, prev.currentNodeId],
        removedChoices: newRemoved,
        phase: "responding",
        lastResponse: choice.response,
        lastResponseCharacter: choice.character,
        // Don't change node yet — wait for dismissResponse
        currentNodeId: prev.currentNodeId, // keep for now
        // Store next node for after response
      };
    });

    // Store nextNodeId to use after dismiss
    const nextNode = choice.nextNodeId;
    (window as any).__qfNextNode = nextNode;
  }, [state.phase, state.currentNodeId]);

  const dismissResponse = useCallback(() => {
    const nextNodeId = (window as any).__qfNextNode;
    setState(prev => {
      if (nextNodeId) {
        return { ...prev, phase: "playing", lastResponse: null, lastResponseCharacter: null, currentNodeId: nextNodeId };
      }
      // Stay on same node (choice was removed)
      return { ...prev, phase: "playing", lastResponse: null, lastResponseCharacter: null };
    });
  }, []);

  // Backtrack
  const canBacktrack = useCallback(() => {
    if (state.phase !== "playing") return false;
    if (state.history.length === 0) return false;
    if (state.timeRemaining < 120) return false; // < 2 minutes
    if (state.backtrackUsedInRound[state.currentNodeId]) return false;
    return true;
  }, [state]);

  const backtrack = useCallback(() => {
    if (!canBacktrack()) return;
    setState(prev => {
      const newTime = prev.timeRemaining - QF_COSTS.backtrack;
      if (newTime <= 0) {
        return { ...prev, timeRemaining: 0, phase: "result", endingType: "timeout" };
      }
      const newHistory = [...prev.history];
      const previousNodeId = newHistory.pop()!;
      const lastDecision = prev.decisions[prev.decisions.length - 1];

      // Remove the last decision's choice from that node
      const newRemoved = {
        ...prev.removedChoices,
        [previousNodeId]: [...(prev.removedChoices[previousNodeId] || []), lastDecision.choiceId],
      };

      return {
        ...prev,
        timeRemaining: newTime,
        currentNodeId: previousNodeId,
        history: newHistory,
        decisions: prev.decisions.slice(0, -1),
        removedChoices: newRemoved,
        backtrackUsedInRound: { ...prev.backtrackUsedInRound, [prev.currentNodeId]: true },
      };
    });
  }, [canBacktrack]);

  // Framing
  const selectFraming = useCallback((framingId: string) => {
    if (state.phase !== "framing") return;
    const option = FRAMING_OPTIONS.find(f => f.id === framingId);
    if (!option) return;

    const goldenCount = state.notes.filter(n => n.isGolden).length;
    let endingType: QFState["endingType"];
    if (option.isCorrect && goldenCount >= GOLDEN_NOTES_REQUIRED) {
      endingType = "success";
    } else {
      endingType = "wrong";
    }

    setState(prev => ({
      ...prev,
      selectedFraming: framingId,
      phase: "result",
      endingType,
    }));
  }, [state.phase, state.notes]);

  // Queries
  const goldenNoteCount = state.notes.filter(n => n.isGolden).length;
  const isTimeCritical = state.timeRemaining <= 120;

  const getEndingData = useCallback(() => {
    if (!state.endingType) return null;
    const ending = ENDINGS.find(e => e.type === state.endingType);
    const tip = EDUCATIONAL_TIPS[state.endingType!] || "";
    return { response: ending?.response || "", tip, type: state.endingType! };
  }, [state.endingType]);

  // Reset
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    (window as any).__qfNextNode = undefined;
    setState(initialState);
  }, []);

  return (
    <QFContext.Provider value={{
      state, currentNode, availableChoices,
      selectChoice, dismissResponse, backtrack, canBacktrack, selectFraming,
      goldenNoteCount, isTimeCritical, getEndingData,
      resetGame,
    }}>
      {children}
    </QFContext.Provider>
  );
};

export const useQF = () => {
  const ctx = useContext(QFContext);
  if (!ctx) throw new Error("useQF must be inside QFProvider");
  return ctx;
};
