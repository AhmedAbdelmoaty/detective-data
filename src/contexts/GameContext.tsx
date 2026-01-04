import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { EVIDENCE_ITEMS, INSIGHTS, HYPOTHESES, ENDINGS, CHARACTERS } from "@/data/case001";

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

export interface TrustLevels {
  manager: number;
  accounting: number;
  warehouse: number;
  projects: number;
}

export interface GameState {
  // التنقل
  currentRoom: string;
  currentPhase: "intro" | "onboarding" | "investigation" | "conclusion";
  
  // الأدلة
  collectedEvidence: string[];
  unlockedEvidence: string[];
  viewedEvidence: string[];
  
  // الاكتشافات
  discoveredInsights: string[];
  
  // الفرضيات
  activeHypothesis: string | null;
  testedHypotheses: string[];
  
  // الثقة (4 جهات)
  trust: TrustLevels;
  
  // الحوارات
  dialoguesCompleted: string[];
  hasSeenIntroDialogue: boolean;
  
  // دفتر الملاحظات
  investigationNotes: InvestigationNote[];
  
  // الاتهام والنهاية
  accusation: string | null;
  accusationAttempts: number;
  maxAccusationAttempts: number;
  ending: string | null;
  caseCompleted: boolean;
  
  // النقاط
  score: number;
  progress: number;
}

interface GameContextType {
  state: GameState;
  
  // Room navigation
  setCurrentRoom: (roomId: string) => void;
  setPhase: (phase: GameState["currentPhase"]) => void;
  
  // Evidence
  collectEvidence: (evidenceId: string) => void;
  unlockEvidence: (evidenceId: string) => void;
  viewEvidence: (evidenceId: string) => void;
  isEvidenceUnlocked: (evidenceId: string) => boolean;
  isEvidenceCollected: (evidenceId: string) => boolean;
  
  // Insights
  discoverInsight: (insightId: string) => void;
  hasInsight: (insightId: string) => boolean;
  
  // Hypotheses
  setActiveHypothesis: (hypothesisId: string) => void;
  canUnlockHypothesis: (hypothesisId: string) => boolean;
  getAvailableHypotheses: () => typeof HYPOTHESES;
  
  // Trust
  modifyTrust: (entity: keyof TrustLevels, amount: number) => void;
  getTrustLevel: (entity: keyof TrustLevels) => "critical" | "low" | "medium" | "high";
  getOverallTrust: () => number;
  
  // Dialogues
  completeDialogue: (dialogueId: string) => void;
  hasCompletedDialogue: (dialogueId: string) => boolean;
  markIntroSeen: () => void;
  
  // Notes
  addNote: (note: Omit<InvestigationNote, "id" | "timestamp">) => void;
  
  // Accusation
  makeAccusation: (characterId: string) => { correct: boolean; ending: string; attemptsLeft: number };
  canAccuse: () => boolean;
  getRemainingAttempts: () => number;
  
  // Game
  getProgress: () => number;
  getEnding: () => typeof ENDINGS[0] | null;
  resetGame: () => void;
}

// ============================================
// Initial State
// ============================================

const initialState: GameState = {
  currentRoom: "manager-office",
  currentPhase: "intro",
  collectedEvidence: [],
  unlockedEvidence: ["evidence-01"], // ملخص المصاريف متاح من البداية
  viewedEvidence: [],
  discoveredInsights: [],
  activeHypothesis: null,
  testedHypotheses: [],
  trust: {
    manager: 100,
    accounting: 100,
    warehouse: 100,
    projects: 100,
  },
  dialoguesCompleted: [],
  hasSeenIntroDialogue: false,
  investigationNotes: [],
  accusation: null,
  accusationAttempts: 0,
  maxAccusationAttempts: 3,
  ending: null,
  caseCompleted: false,
  score: 0,
  progress: 0,
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
  const collectEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(evidenceId)) return prev;
      
      const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
      const points = evidence ? 25 : 0;
      
      return {
        ...prev,
        collectedEvidence: [...prev.collectedEvidence, evidenceId],
        score: prev.score + points,
        progress: Math.min(prev.progress + 8, 100),
      };
    });
  }, []);

  const unlockEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.unlockedEvidence.includes(evidenceId)) return prev;
      return {
        ...prev,
        unlockedEvidence: [...prev.unlockedEvidence, evidenceId],
      };
    });
  }, []);

  const viewEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(evidenceId)) return prev;
      return {
        ...prev,
        viewedEvidence: [...prev.viewedEvidence, evidenceId],
      };
    });
  }, []);

  const isEvidenceUnlocked = useCallback((evidenceId: string): boolean => {
    const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
    if (!evidence) return false;
    if (!evidence.isLocked) return true;
    return state.unlockedEvidence.includes(evidenceId);
  }, [state.unlockedEvidence]);

  const isEvidenceCollected = useCallback((evidenceId: string): boolean => {
    return state.collectedEvidence.includes(evidenceId);
  }, [state.collectedEvidence]);

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
        progress: Math.min(prev.progress + 10, 100),
      };
    });
  }, []);

  const hasInsight = useCallback((insightId: string): boolean => {
    return state.discoveredInsights.includes(insightId);
  }, [state.discoveredInsights]);

  // Hypotheses
  const setActiveHypothesis = useCallback((hypothesisId: string) => {
    setState(prev => {
      const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
      
      const newNote: InvestigationNote = {
        id: `hypothesis-${Date.now()}`,
        type: "suspicion",
        text: `فرضية جديدة: ${hypothesis?.title}`,
        source: "analysis",
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        activeHypothesis: hypothesisId,
        testedHypotheses: prev.testedHypotheses.includes(hypothesisId) 
          ? prev.testedHypotheses 
          : [...prev.testedHypotheses, hypothesisId],
        investigationNotes: [...prev.investigationNotes, newNote],
        score: prev.score + 15,
      };
    });
  }, []);

  const canUnlockHypothesis = useCallback((hypothesisId: string): boolean => {
    const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
    if (!hypothesis) return false;
    
    const hasRequiredEvidence = hypothesis.requiredEvidence.every(e => 
      state.collectedEvidence.includes(e)
    );
    const hasRequiredInsights = hypothesis.requiredInsights.every(i => 
      state.discoveredInsights.includes(i)
    );
    
    return hasRequiredEvidence && hasRequiredInsights;
  }, [state.collectedEvidence, state.discoveredInsights]);

  const getAvailableHypotheses = useCallback(() => {
    return HYPOTHESES.filter(h => canUnlockHypothesis(h.id));
  }, [canUnlockHypothesis]);

  // Trust
  const modifyTrust = useCallback((entity: keyof TrustLevels, amount: number) => {
    setState(prev => ({
      ...prev,
      trust: {
        ...prev.trust,
        [entity]: Math.max(0, Math.min(100, prev.trust[entity] + amount)),
      },
    }));
  }, []);

  const getTrustLevel = useCallback((entity: keyof TrustLevels): "critical" | "low" | "medium" | "high" => {
    const trust = state.trust[entity];
    if (trust <= 20) return "critical";
    if (trust <= 40) return "low";
    if (trust <= 70) return "medium";
    return "high";
  }, [state.trust]);

  const getOverallTrust = useCallback((): number => {
    const { manager, accounting, warehouse, projects } = state.trust;
    return Math.round((manager + accounting + warehouse + projects) / 4);
  }, [state.trust]);

  // Dialogues
  const completeDialogue = useCallback((dialogueId: string) => {
    setState(prev => {
      if (prev.dialoguesCompleted.includes(dialogueId)) return prev;
      return {
        ...prev,
        dialoguesCompleted: [...prev.dialoguesCompleted, dialogueId],
      };
    });
  }, []);

  const hasCompletedDialogue = useCallback((dialogueId: string): boolean => {
    return state.dialoguesCompleted.includes(dialogueId);
  }, [state.dialoguesCompleted]);

  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntroDialogue: true }));
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

  // Accusation
  const makeAccusation = useCallback((characterId: string): { correct: boolean; ending: string; attemptsLeft: number } => {
    const character = CHARACTERS.find(c => c.id === characterId);
    const isCorrect = character?.isGuilty || false;
    
    let endingId = "";
    let result = { correct: isCorrect, ending: "", attemptsLeft: 0 };
    
    setState(prev => {
      const newAttempts = prev.accusationAttempts + 1;
      const attemptsLeft = prev.maxAccusationAttempts - newAttempts;
      
      if (isCorrect) {
        // Check which ending based on insights
        const hasAllInsights = ["insight-supplier-anomaly", "insight-gap", "insight-fast-payments", "insight-sara-enters"]
          .every(i => prev.discoveredInsights.includes(i));
        
        endingId = hasAllInsights ? "ending-best" : "ending-partial";
      } else {
        endingId = "ending-wrong";
      }
      
      const ending = ENDINGS.find(e => e.id === endingId);
      
      result = { correct: isCorrect, ending: endingId, attemptsLeft };
      
      return {
        ...prev,
        accusation: characterId,
        accusationAttempts: newAttempts,
        ending: endingId,
        caseCompleted: isCorrect || newAttempts >= prev.maxAccusationAttempts,
        score: prev.score + (ending?.score || 0),
      };
    });
    
    return result;
  }, []);

  const canAccuse = useCallback((): boolean => {
    return (
      state.collectedEvidence.length >= 3 &&
      state.discoveredInsights.length >= 2 &&
      state.accusationAttempts < state.maxAccusationAttempts &&
      !state.caseCompleted
    );
  }, [state]);

  const getRemainingAttempts = useCallback((): number => {
    return state.maxAccusationAttempts - state.accusationAttempts;
  }, [state.maxAccusationAttempts, state.accusationAttempts]);

  // Game
  const getProgress = useCallback((): number => {
    const evidenceProgress = (state.collectedEvidence.length / EVIDENCE_ITEMS.length) * 40;
    const insightProgress = (state.discoveredInsights.length / INSIGHTS.length) * 40;
    const hypothesisProgress = state.activeHypothesis ? 20 : 0;
    return Math.round(evidenceProgress + insightProgress + hypothesisProgress);
  }, [state]);

  const getEnding = useCallback(() => {
    if (!state.ending) return null;
    return ENDINGS.find(e => e.id === state.ending) || null;
  }, [state.ending]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      setCurrentRoom,
      setPhase,
      collectEvidence,
      unlockEvidence,
      viewEvidence,
      isEvidenceUnlocked,
      isEvidenceCollected,
      discoverInsight,
      hasInsight,
      setActiveHypothesis,
      canUnlockHypothesis,
      getAvailableHypotheses,
      modifyTrust,
      getTrustLevel,
      getOverallTrust,
      completeDialogue,
      hasCompletedDialogue,
      markIntroSeen,
      addNote,
      makeAccusation,
      canAccuse,
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
