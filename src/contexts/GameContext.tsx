import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { EVIDENCE_ITEMS, INSIGHTS, ENDINGS, CHARACTERS, SOLUTION_OPTIONS, REQUIRED_EVIDENCE_IDS, CASE_INFO } from "@/data/case1";

// ============================================
// Types
// ============================================

export interface InvestigationNote {
  id: string;
  type: "discovery" | "clue" | "suspicion" | "insight" | "dialogue";
  text: string;
  source: string;
  timestamp: number;
  characterId?: string;
}

export interface GameState {
  // Resources
  time: number;
  trust: number;
  
  // Evidence
  visitedEvidenceIds: string[];
  pinnedEvidenceIds: string[]; // Max 5
  
  // Interviews
  interviewedIds: string[]; // Question IDs that have been asked
  
  // Discoveries
  discoveredInsights: string[];
  
  // Navigation
  currentRoom: string;
  currentPhase: "intro" | "onboarding" | "investigation" | "conclusion";
  
  // Dialogue
  hasSeenIntroDialogue: boolean;
  
  // Notes
  investigationNotes: InvestigationNote[];
  
  // Solution
  selectedSolution: string | null;
  solutionAttempts: number;
  maxSolutionAttempts: number;
  gameStatus: "briefing" | "playing" | "solved" | "failed";
  
  // Score
  score: number;
}

interface GameContextType {
  state: GameState;
  
  // Room navigation
  setCurrentRoom: (roomId: string) => void;
  setPhase: (phase: GameState["currentPhase"]) => void;
  
  // Evidence
  visitEvidence: (evidenceId: string, cost: number) => void;
  togglePinEvidence: (evidenceId: string) => void;
  isEvidenceVisited: (evidenceId: string) => boolean;
  isEvidencePinned: (evidenceId: string) => boolean;
  
  // Interviews
  askQuestion: (questionId: string, cost: number) => void;
  hasAskedQuestion: (questionId: string) => boolean;
  
  // Insights
  discoverInsight: (insightId: string) => void;
  hasInsight: (insightId: string) => boolean;
  
  // Dialogues
  markIntroSeen: () => void;
  
  // Notes
  addNote: (note: Omit<InvestigationNote, "id" | "timestamp">) => void;
  
  // Solution
  submitSolution: (optionId: string) => { correct: boolean; feedback: string; attemptsLeft: number };
  canSubmitSolution: () => boolean;
  getRemainingAttempts: () => number;
  
  // Game helpers
  getProgress: () => number;
  getEnding: () => typeof ENDINGS[0] | null;
  resetGame: () => void;
}

// ============================================
// Initial State
// ============================================

const initialState: GameState = {
  time: CASE_INFO.resources.initialTime,
  trust: CASE_INFO.resources.initialTrust,
  visitedEvidenceIds: [],
  pinnedEvidenceIds: [],
  interviewedIds: [],
  discoveredInsights: [],
  currentRoom: "ceo-office",
  currentPhase: "intro",
  hasSeenIntroDialogue: false,
  investigationNotes: [],
  selectedSolution: null,
  solutionAttempts: 0,
  maxSolutionAttempts: 3,
  gameStatus: "briefing",
  score: 0,
};

// ============================================
// Context
// ============================================

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  // Room navigation
  const setCurrentRoom = useCallback((roomId: string) => {
    setState(prev => ({ ...prev, currentRoom: roomId }));
  }, []);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  // Evidence
  const visitEvidence = useCallback((evidenceId: string, cost: number) => {
    setState(prev => {
      if (prev.visitedEvidenceIds.includes(evidenceId)) return prev;
      
      const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
      const points = evidence?.isKey ? 25 : 10;
      
      return {
        ...prev,
        visitedEvidenceIds: [...prev.visitedEvidenceIds, evidenceId],
        time: Math.max(0, prev.time - cost),
        score: prev.score + points,
      };
    });
  }, []);

  const togglePinEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      const isPinned = prev.pinnedEvidenceIds.includes(evidenceId);
      if (isPinned) {
        return { 
          ...prev, 
          pinnedEvidenceIds: prev.pinnedEvidenceIds.filter(id => id !== evidenceId) 
        };
      } else {
        if (prev.pinnedEvidenceIds.length >= 5) return prev; // Max 5 pins
        return { 
          ...prev, 
          pinnedEvidenceIds: [...prev.pinnedEvidenceIds, evidenceId] 
        };
      }
    });
  }, []);

  const isEvidenceVisited = useCallback((evidenceId: string): boolean => {
    return state.visitedEvidenceIds.includes(evidenceId);
  }, [state.visitedEvidenceIds]);

  const isEvidencePinned = useCallback((evidenceId: string): boolean => {
    return state.pinnedEvidenceIds.includes(evidenceId);
  }, [state.pinnedEvidenceIds]);

  // Interviews
  const askQuestion = useCallback((questionId: string, cost: number) => {
    setState(prev => {
      if (prev.interviewedIds.includes(questionId)) return prev;
      
      return {
        ...prev,
        interviewedIds: [...prev.interviewedIds, questionId],
        time: Math.max(0, prev.time - cost),
        score: prev.score + 15,
      };
    });
  }, []);

  const hasAskedQuestion = useCallback((questionId: string): boolean => {
    return state.interviewedIds.includes(questionId);
  }, [state.interviewedIds]);

  // Insights
  const discoverInsight = useCallback((insightId: string) => {
    setState(prev => {
      if (prev.discoveredInsights.includes(insightId)) return prev;
      
      const insight = INSIGHTS.find(i => i.id === insightId);
      const points = insight?.points || 0;
      
      const newNote: InvestigationNote = {
        id: `insight-${Date.now()}`,
        type: "insight",
        text: insight?.description || insightId,
        source: "analysis",
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        discoveredInsights: [...prev.discoveredInsights, insightId],
        investigationNotes: [...prev.investigationNotes, newNote],
        score: prev.score + points,
      };
    });
  }, []);

  const hasInsight = useCallback((insightId: string): boolean => {
    return state.discoveredInsights.includes(insightId);
  }, [state.discoveredInsights]);

  // Dialogues
  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntroDialogue: true, gameStatus: "playing" }));
  }, []);

  // Notes
  const addNote = useCallback((note: Omit<InvestigationNote, "id" | "timestamp">) => {
    setState(prev => {
      const newNote: InvestigationNote = {
        ...note,
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        investigationNotes: [...prev.investigationNotes, newNote],
        score: prev.score + (note.type === "insight" ? 30 : note.type === "clue" ? 15 : 5),
      };
    });
  }, []);

  // Solution
  const submitSolution = useCallback((optionId: string): { correct: boolean; feedback: string; attemptsLeft: number } => {
    const option = SOLUTION_OPTIONS.find(o => o.id === optionId);
    
    // Check if required evidence is pinned
    const hasRequiredEvidence = REQUIRED_EVIDENCE_IDS.every(reqId => 
      state.pinnedEvidenceIds.includes(reqId)
    );
    
    const isCorrect = option?.isCorrect && hasRequiredEvidence;
    const feedback = option?.feedback || "خطأ غير محدد";
    
    let endingId = "";
    if (isCorrect) {
      endingId = "ending-best";
    } else if (option?.isCorrect && !hasRequiredEvidence) {
      endingId = "ending-partial";
    } else {
      endingId = "ending-wrong";
    }
    
    const ending = ENDINGS.find(e => e.id === endingId);
    
    setState(prev => {
      const newAttempts = prev.solutionAttempts + 1;
      const attemptsLeft = prev.maxSolutionAttempts - newAttempts;
      
      return {
        ...prev,
        selectedSolution: optionId,
        solutionAttempts: newAttempts,
        gameStatus: isCorrect ? "solved" : (attemptsLeft <= 0 ? "failed" : prev.gameStatus),
        score: prev.score + (ending?.score || 0),
      };
    });
    
    const attemptsLeft = state.maxSolutionAttempts - state.solutionAttempts - 1;
    
    return {
      correct: !!isCorrect,
      feedback: isCorrect ? feedback : (attemptsLeft > 0 ? `${feedback} (تبقى ${attemptsLeft} محاولات)` : feedback),
      attemptsLeft: Math.max(0, attemptsLeft),
    };
  }, [state.pinnedEvidenceIds, state.maxSolutionAttempts, state.solutionAttempts]);

  const canSubmitSolution = useCallback((): boolean => {
    return (
      state.visitedEvidenceIds.length >= 3 &&
      state.solutionAttempts < state.maxSolutionAttempts &&
      state.gameStatus === "playing"
    );
  }, [state]);

  const getRemainingAttempts = useCallback((): number => {
    return state.maxSolutionAttempts - state.solutionAttempts;
  }, [state.maxSolutionAttempts, state.solutionAttempts]);

  // Game helpers
  const getProgress = useCallback((): number => {
    const evidenceProgress = (state.visitedEvidenceIds.length / EVIDENCE_ITEMS.length) * 40;
    const insightProgress = (state.discoveredInsights.length / INSIGHTS.length) * 40;
    const interviewProgress = (state.interviewedIds.length / 9) * 20; // 9 total questions
    return Math.round(evidenceProgress + insightProgress + interviewProgress);
  }, [state]);

  const getEnding = useCallback(() => {
    if (state.gameStatus === "solved") {
      const hasAllRequired = REQUIRED_EVIDENCE_IDS.every(id => state.pinnedEvidenceIds.includes(id));
      return ENDINGS.find(e => e.id === (hasAllRequired ? "ending-best" : "ending-partial")) || null;
    }
    if (state.gameStatus === "failed") {
      return ENDINGS.find(e => e.id === "ending-wrong") || null;
    }
    return null;
  }, [state.gameStatus, state.pinnedEvidenceIds]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      setCurrentRoom,
      setPhase,
      visitEvidence,
      togglePinEvidence,
      isEvidenceVisited,
      isEvidencePinned,
      askQuestion,
      hasAskedQuestion,
      discoverInsight,
      hasInsight,
      markIntroSeen,
      addNote,
      submitSolution,
      canSubmitSolution,
      getRemainingAttempts,
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
