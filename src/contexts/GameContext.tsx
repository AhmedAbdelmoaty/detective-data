import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { HYPOTHESES, EVIDENCE_ITEMS, ENDINGS, DIAGNOSTIC_EVIDENCE_IDS } from "@/data/case1";

// ============================================
// Types
// ============================================

export interface NotebookEntry {
  id: string;
  text: string;
  source: "evidence" | "interview" | "dashboard";
  sourceId: string;
  timestamp: number;
}

export interface GameState {
  // Navigation
  currentPhase: "intro" | "onboarding" | "investigation" | "conclusion";
  hasSeenIntroDialogue: boolean;
  gameStatus: "briefing" | "playing" | "solved" | "failed";

  // Notebook
  notebook: NotebookEntry[];

  // Interviews
  completedInterviews: string[]; // character IDs that finished all dialogue

  // Evidence
  viewedEvidence: string[]; // evidence IDs that were opened

  // Dashboard
  viewedDashboard: string[]; // dashboard item IDs

  // Hypotheses
  selectedHypotheses: string[]; // max 4 hypothesis IDs

  // ACH Matrix
  achMatrix: Record<string, Record<string, string>>; // [evidenceId][hypothesisId] = "++"|"+"|"-"|"--"

  // Final answer
  finalHypothesis: string | null;

  // Score
  score: number;

  // Room tracking
  currentRoom: string;
  visitedRooms: string[];
}

interface GameContextType {
  state: GameState;

  // Room navigation
  setCurrentRoom: (roomId: string) => void;
  setPhase: (phase: GameState["currentPhase"]) => void;

  // Intro
  markIntroSeen: () => void;

  // Notebook
  addToNotebook: (entry: Omit<NotebookEntry, "id" | "timestamp">) => void;
  isInNotebook: (sourceId: string) => boolean;
  removeFromNotebook: (sourceId: string) => void;

  // Evidence
  viewEvidence: (evidenceId: string) => void;
  isEvidenceViewed: (evidenceId: string) => boolean;

  // Dashboard
  viewDashboardItem: (itemId: string) => void;

  // Interviews
  markInterviewComplete: (characterId: string) => void;
  isInterviewComplete: (characterId: string) => boolean;

  // Hypotheses
  toggleHypothesis: (hypothesisId: string) => void;
  isHypothesisSelected: (hypothesisId: string) => boolean;
  canSelectHypotheses: () => boolean;

  // ACH Matrix
  setMatrixCell: (evidenceId: string, hypothesisId: string, value: string) => void;
  getMatrixCell: (evidenceId: string, hypothesisId: string) => string | null;
  canUseMatrix: () => boolean;

  // Final answer
  setFinalHypothesis: (hypothesisId: string) => void;
  canSubmitFinal: () => boolean;

  // Game helpers
  getProgress: () => number;
  getEnding: () => typeof ENDINGS[0] | null;
  resetGame: () => void;
}

// ============================================
// Initial State
// ============================================

const initialState: GameState = {
  currentPhase: "intro",
  hasSeenIntroDialogue: false,
  gameStatus: "briefing",
  notebook: [],
  completedInterviews: [],
  viewedEvidence: [],
  viewedDashboard: [],
  selectedHypotheses: [],
  achMatrix: {},
  finalHypothesis: null,
  score: 0,
  currentRoom: "office",
  visitedRooms: [],
};

// ============================================
// Context
// ============================================

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const setCurrentRoom = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      currentRoom: roomId,
      visitedRooms: prev.visitedRooms.includes(roomId) ? prev.visitedRooms : [...prev.visitedRooms, roomId],
    }));
  }, []);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntroDialogue: true, gameStatus: "playing" }));
  }, []);

  // Notebook
  const addToNotebook = useCallback((entry: Omit<NotebookEntry, "id" | "timestamp">) => {
    setState(prev => {
      if (prev.notebook.some(n => n.sourceId === entry.sourceId)) return prev;
      const newEntry: NotebookEntry = {
        ...entry,
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      return {
        ...prev,
        notebook: [...prev.notebook, newEntry],
        score: prev.score + 10,
      };
    });
  }, []);

  const isInNotebook = useCallback((sourceId: string): boolean => {
    return state.notebook.some(n => n.sourceId === sourceId);
  }, [state.notebook]);

  const removeFromNotebook = useCallback((sourceId: string) => {
    setState(prev => ({
      ...prev,
      notebook: prev.notebook.filter(n => n.sourceId !== sourceId),
    }));
  }, []);

  // Evidence
  const viewEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(evidenceId)) return prev;
      return {
        ...prev,
        viewedEvidence: [...prev.viewedEvidence, evidenceId],
        score: prev.score + 5,
      };
    });
  }, []);

  const isEvidenceViewed = useCallback((evidenceId: string): boolean => {
    return state.viewedEvidence.includes(evidenceId);
  }, [state.viewedEvidence]);

  // Dashboard
  const viewDashboardItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.viewedDashboard.includes(itemId)) return prev;
      return {
        ...prev,
        viewedDashboard: [...prev.viewedDashboard, itemId],
        score: prev.score + 5,
      };
    });
  }, []);

  // Interviews
  const markInterviewComplete = useCallback((characterId: string) => {
    setState(prev => {
      if (prev.completedInterviews.includes(characterId)) return prev;
      return {
        ...prev,
        completedInterviews: [...prev.completedInterviews, characterId],
        score: prev.score + 15,
      };
    });
  }, []);

  const isInterviewComplete = useCallback((characterId: string): boolean => {
    return state.completedInterviews.includes(characterId);
  }, [state.completedInterviews]);

  // Hypotheses
  const toggleHypothesis = useCallback((hypothesisId: string) => {
    setState(prev => {
      const isSelected = prev.selectedHypotheses.includes(hypothesisId);
      if (isSelected) {
        return { ...prev, selectedHypotheses: prev.selectedHypotheses.filter(id => id !== hypothesisId) };
      }
      if (prev.selectedHypotheses.length >= 4) return prev;
      return { ...prev, selectedHypotheses: [...prev.selectedHypotheses, hypothesisId] };
    });
  }, []);

  const isHypothesisSelected = useCallback((hypothesisId: string): boolean => {
    return state.selectedHypotheses.includes(hypothesisId);
  }, [state.selectedHypotheses]);

  const canSelectHypotheses = useCallback((): boolean => {
    return state.notebook.length >= 3;
  }, [state.notebook.length]);

  // ACH Matrix
  const setMatrixCell = useCallback((evidenceId: string, hypothesisId: string, value: string) => {
    setState(prev => ({
      ...prev,
      achMatrix: {
        ...prev.achMatrix,
        [evidenceId]: {
          ...(prev.achMatrix[evidenceId] || {}),
          [hypothesisId]: value,
        },
      },
    }));
  }, []);

  const getMatrixCell = useCallback((evidenceId: string, hypothesisId: string): string | null => {
    return state.achMatrix[evidenceId]?.[hypothesisId] || null;
  }, [state.achMatrix]);

  const canUseMatrix = useCallback((): boolean => {
    return state.selectedHypotheses.length === 4;
  }, [state.selectedHypotheses.length]);

  // Final answer
  const setFinalHypothesis = useCallback((hypothesisId: string) => {
    setState(prev => {
      const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
      if (!hypothesis) return prev;

      // Determine ending
      let endingType: string;
      if (!prev.selectedHypotheses.includes("H3")) {
        endingType = "missing";
      } else if (hypothesis.isCorrect) {
        const hasDiagnostic = DIAGNOSTIC_EVIDENCE_IDS.some(id =>
          prev.notebook.some(n => n.sourceId === id)
        );
        const diagnosticCount = DIAGNOSTIC_EVIDENCE_IDS.filter(id =>
          prev.notebook.some(n => n.sourceId === id)
        ).length;
        endingType = diagnosticCount >= 2 ? "excellent" : "partial";
      } else {
        endingType = "wrong";
      }

      const ending = ENDINGS.find(e => e.type === endingType);

      return {
        ...prev,
        finalHypothesis: hypothesisId,
        gameStatus: "solved",
        currentPhase: "conclusion",
        score: prev.score + (ending?.score || 0),
      };
    });
  }, []);

  const canSubmitFinal = useCallback((): boolean => {
    return state.selectedHypotheses.length === 4 && state.finalHypothesis === null;
  }, [state.selectedHypotheses.length, state.finalHypothesis]);

  // Game helpers
  const getProgress = useCallback((): number => {
    const evidenceP = (state.viewedEvidence.length / EVIDENCE_ITEMS.length) * 25;
    const dashboardP = (state.viewedDashboard.length / 3) * 15;
    const interviewP = (state.completedInterviews.length / 3) * 20;
    const notebookP = Math.min(state.notebook.length / 8, 1) * 20;
    const hypothesisP = (state.selectedHypotheses.length / 4) * 10;
    const matrixP = state.finalHypothesis ? 10 : 0;
    return Math.round(evidenceP + dashboardP + interviewP + notebookP + hypothesisP + matrixP);
  }, [state]);

  const getEnding = useCallback(() => {
    if (state.gameStatus !== "solved" || !state.finalHypothesis) return null;

    if (!state.selectedHypotheses.includes("H3")) {
      return ENDINGS.find(e => e.type === "missing") || null;
    }

    const hypothesis = HYPOTHESES.find(h => h.id === state.finalHypothesis);
    if (!hypothesis?.isCorrect) {
      return ENDINGS.find(e => e.type === "wrong") || null;
    }

    const diagnosticCount = DIAGNOSTIC_EVIDENCE_IDS.filter(id =>
      state.notebook.some(n => n.sourceId === id)
    ).length;

    if (diagnosticCount >= 2) {
      return ENDINGS.find(e => e.type === "excellent") || null;
    }
    return ENDINGS.find(e => e.type === "partial") || null;
  }, [state.gameStatus, state.finalHypothesis, state.selectedHypotheses, state.notebook]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      setCurrentRoom,
      setPhase,
      markIntroSeen,
      addToNotebook,
      isInNotebook,
      removeFromNotebook,
      viewEvidence,
      isEvidenceViewed,
      viewDashboardItem,
      markInterviewComplete,
      isInterviewComplete,
      toggleHypothesis,
      isHypothesisSelected,
      canSelectHypotheses,
      setMatrixCell,
      getMatrixCell,
      canUseMatrix,
      setFinalHypothesis,
      canSubmitFinal,
      getProgress,
      getEnding,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
