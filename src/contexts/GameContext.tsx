import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export interface Evidence {
  id: string;
  name: string;
  type: "spreadsheet" | "email" | "document" | "log";
  collected: boolean;
  analyzed: boolean;
}

export interface InvestigationNote {
  id: string;
  type: "discovery" | "clue" | "suspicion" | "key" | "pattern";
  text: string;
  source: string;
  timestamp: number;
  suspectId?: string;
}

export interface SuspectInterrogation {
  suspectId: string;
  questionsAsked: string[];
  cluesRevealed: string[];
}

export interface GameState {
  // التقدم
  currentPhase: "intro" | "onboarding" | "investigation" | "conclusion";
  progress: number;
  
  // نظام الثقة
  trust: number;
  maxTrust: number;
  
  // الأدلة
  collectedEvidence: string[];
  viewedEvidence: string[];
  
  // دفتر التحقيق
  investigationNotes: InvestigationNote[];
  
  // الفرضيات
  activeHypothesis: string | null;
  testedHypotheses: string[];
  
  // الاستجواب
  interrogations: SuspectInterrogation[];
  totalQuestionsAsked: number;
  
  // نظام الاتهام - 3 محاولات
  accusation: string | null;
  accusationAttempts: number;
  maxAccusationAttempts: number;
  caseCompleted: boolean;
  score: number;
  
  // تتبع المفاتيح والأنماط المكتشفة
  keysDiscovered: string[];
  patternsDiscovered: string[];
  
  // حالة الحوار
  hasSeenIntroDialogue: boolean;
}

interface GameContextType {
  state: GameState;
  
  // Evidence actions
  collectEvidence: (id: string) => void;
  viewEvidence: (id: string) => void;
  
  // Investigation notes
  addNote: (note: Omit<InvestigationNote, "id" | "timestamp">) => void;
  
  // Hypothesis actions
  setActiveHypothesis: (id: string) => void;
  
  // Trust actions
  addTrust: (amount: number) => void;
  removeTrust: (amount: number) => void;
  
  // Interrogation actions
  askQuestion: (suspectId: string, questionId: string, clue?: string) => void;
  getQuestionsAskedForSuspect: (suspectId: string) => string[];
  canAskMoreQuestions: (suspectId: string) => boolean;
  
  // Key/Pattern discovery
  discoverKey: (keyId: string) => void;
  hasDiscoveredKey: (keyId: string) => boolean;
  discoverPattern: (patternId: string, description: string) => void;
  hasDiscoveredPattern: (patternId: string) => boolean;
  
  // Game actions
  setPhase: (phase: GameState["currentPhase"]) => void;
  makeAccusation: (suspectId: string) => { correct: boolean; attemptsLeft: number; gameOver: boolean };
  resetGame: () => void;
  markIntroSeen: () => void;
  
  // Helpers
  canAccuse: () => boolean;
  getProgress: () => number;
  getTrustLevel: () => "critical" | "low" | "medium" | "high";
  getInterrogationProgress: () => { asked: number; total: number };
  getRemainingAttempts: () => number;
}

const initialState: GameState = {
  currentPhase: "intro",
  progress: 0,
  trust: 100,
  maxTrust: 100,
  collectedEvidence: [],
  viewedEvidence: [],
  investigationNotes: [],
  activeHypothesis: null,
  testedHypotheses: [],
  interrogations: [],
  totalQuestionsAsked: 0,
  accusation: null,
  accusationAttempts: 0,
  maxAccusationAttempts: 3,
  caseCompleted: false,
  score: 0,
  keysDiscovered: [],
  patternsDiscovered: [],
  hasSeenIntroDialogue: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const collectEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(id)) return prev;
      
      const newCollected = [...prev.collectedEvidence, id];
      const trustBonus = 5;
      
      return {
        ...prev,
        collectedEvidence: newCollected,
        trust: Math.min(prev.maxTrust, prev.trust + trustBonus),
        progress: Math.min(prev.progress + 10, 100),
        score: prev.score + 25,
      };
    });
  }, []);

  const viewEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(id)) return prev;
      return {
        ...prev,
        viewedEvidence: [...prev.viewedEvidence, id],
      };
    });
  }, []);

  const addNote = useCallback((note: Omit<InvestigationNote, "id" | "timestamp">) => {
    setState(prev => {
      const newNote: InvestigationNote = {
        ...note,
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      
      const trustBonus = note.type === "key" ? 10 : note.type === "clue" ? 5 : note.type === "pattern" ? 15 : 0;
      
      return {
        ...prev,
        investigationNotes: [...prev.investigationNotes, newNote],
        trust: Math.min(prev.maxTrust, prev.trust + trustBonus),
        score: prev.score + (note.type === "key" ? 50 : note.type === "clue" ? 20 : note.type === "pattern" ? 40 : 5),
      };
    });
  }, []);

  const setActiveHypothesis = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      activeHypothesis: id,
      score: prev.score + 30,
    }));
  }, []);

  const addTrust = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      trust: Math.min(prev.maxTrust, prev.trust + amount),
    }));
  }, []);

  const removeTrust = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      trust: Math.max(0, prev.trust - amount),
    }));
  }, []);

  const askQuestion = useCallback((suspectId: string, questionId: string, clue?: string) => {
    setState(prev => {
      const existingInterrogation = prev.interrogations.find(i => i.suspectId === suspectId);
      
      let newInterrogations: SuspectInterrogation[];
      
      if (existingInterrogation) {
        if (existingInterrogation.questionsAsked.includes(questionId)) {
          return prev;
        }
        
        newInterrogations = prev.interrogations.map(i => 
          i.suspectId === suspectId 
            ? {
                ...i,
                questionsAsked: [...i.questionsAsked, questionId],
                cluesRevealed: clue ? [...i.cluesRevealed, clue] : i.cluesRevealed,
              }
            : i
        );
      } else {
        newInterrogations = [
          ...prev.interrogations,
          {
            suspectId,
            questionsAsked: [questionId],
            cluesRevealed: clue ? [clue] : [],
          },
        ];
      }
      
      const newNotes = clue 
        ? [
            ...prev.investigationNotes,
            {
              id: `note-${Date.now()}`,
              type: "clue" as const,
              text: clue,
              source: "interrogation",
              timestamp: Date.now(),
              suspectId,
            },
          ]
        : prev.investigationNotes;
      
      return {
        ...prev,
        interrogations: newInterrogations,
        totalQuestionsAsked: prev.totalQuestionsAsked + 1,
        investigationNotes: newNotes,
        progress: Math.min(prev.progress + 5, 100),
        score: prev.score + 15,
      };
    });
  }, []);

  const getQuestionsAskedForSuspect = useCallback((suspectId: string): string[] => {
    const interrogation = state.interrogations.find(i => i.suspectId === suspectId);
    return interrogation?.questionsAsked || [];
  }, [state.interrogations]);

  const canAskMoreQuestions = useCallback((suspectId: string): boolean => {
    const questionsAsked = getQuestionsAskedForSuspect(suspectId);
    return questionsAsked.length < 3;
  }, [getQuestionsAskedForSuspect]);

  const discoverKey = useCallback((keyId: string) => {
    setState(prev => {
      if (prev.keysDiscovered.includes(keyId)) return prev;
      
      return {
        ...prev,
        keysDiscovered: [...prev.keysDiscovered, keyId],
        trust: Math.min(prev.maxTrust, prev.trust + 10),
        score: prev.score + 75,
      };
    });
  }, []);

  const hasDiscoveredKey = useCallback((keyId: string): boolean => {
    return state.keysDiscovered.includes(keyId);
  }, [state.keysDiscovered]);

  const discoverPattern = useCallback((patternId: string, description: string) => {
    setState(prev => {
      if (prev.patternsDiscovered.includes(patternId)) return prev;
      
      const newNote: InvestigationNote = {
        id: `pattern-${Date.now()}`,
        type: "pattern",
        text: description,
        source: "analysis",
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        patternsDiscovered: [...prev.patternsDiscovered, patternId],
        investigationNotes: [...prev.investigationNotes, newNote],
        trust: Math.min(prev.maxTrust, prev.trust + 15),
        score: prev.score + 50,
      };
    });
  }, []);

  const hasDiscoveredPattern = useCallback((patternId: string): boolean => {
    return state.patternsDiscovered.includes(patternId);
  }, [state.patternsDiscovered]);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const makeAccusation = useCallback((suspectId: string): { correct: boolean; attemptsLeft: number; gameOver: boolean } => {
    const isCorrect = suspectId === "karim";
    
    let result = { correct: isCorrect, attemptsLeft: 0, gameOver: false };
    
    setState(prev => {
      const newAttempts = prev.accusationAttempts + 1;
      const attemptsLeft = prev.maxAccusationAttempts - newAttempts;
      
      if (isCorrect) {
        // نجاح!
        const evidenceBonus = prev.collectedEvidence.length * 50;
        const notesBonus = prev.investigationNotes.filter(n => n.type === "key" || n.type === "pattern").length * 100;
        const trustBonus = Math.floor(prev.trust / 10) * 20;
        const questionsBonus = prev.totalQuestionsAsked * 10;
        
        const finalScore = prev.score + 500 + evidenceBonus + notesBonus + trustBonus + questionsBonus;
        
        result = { correct: true, attemptsLeft, gameOver: true };
        
        return {
          ...prev,
          accusation: suspectId,
          accusationAttempts: newAttempts,
          caseCompleted: true,
          score: finalScore,
        };
      } else {
        // محاولة خاطئة
        const trustPenalty = 25;
        const newTrust = Math.max(0, prev.trust - trustPenalty);
        const isGameOver = newAttempts >= prev.maxAccusationAttempts || newTrust <= 0;
        
        result = { correct: false, attemptsLeft, gameOver: isGameOver };
        
        return {
          ...prev,
          accusationAttempts: newAttempts,
          trust: newTrust,
          caseCompleted: isGameOver,
          accusation: isGameOver ? suspectId : prev.accusation,
          score: isGameOver ? Math.max(0, prev.score - 200) : prev.score,
        };
      }
    });
    
    return result;
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntroDialogue: true }));
  }, []);

  const canAccuse = useCallback(() => {
    const suspectsInterrogated = state.interrogations.filter(i => i.questionsAsked.length > 0).length;
    return state.collectedEvidence.length >= 3 && 
           suspectsInterrogated >= 2 &&
           state.trust > 20 &&
           state.accusationAttempts < state.maxAccusationAttempts;
  }, [state]);

  const getProgress = useCallback(() => {
    const evidenceProgress = (state.collectedEvidence.length / 4) * 40;
    const interrogationProgress = (state.interrogations.filter(i => i.questionsAsked.length > 0).length / 3) * 40;
    const notesProgress = Math.min(state.investigationNotes.length / 10, 1) * 20;
    return Math.round(evidenceProgress + interrogationProgress + notesProgress);
  }, [state]);

  const getTrustLevel = useCallback((): "critical" | "low" | "medium" | "high" => {
    if (state.trust <= 20) return "critical";
    if (state.trust <= 40) return "low";
    if (state.trust <= 70) return "medium";
    return "high";
  }, [state.trust]);

  const getInterrogationProgress = useCallback(() => {
    const asked = state.totalQuestionsAsked;
    const total = 9;
    return { asked, total };
  }, [state.totalQuestionsAsked]);

  const getRemainingAttempts = useCallback(() => {
    return state.maxAccusationAttempts - state.accusationAttempts;
  }, [state.maxAccusationAttempts, state.accusationAttempts]);

  return (
    <GameContext.Provider value={{
      state,
      collectEvidence,
      viewEvidence,
      addNote,
      setActiveHypothesis,
      addTrust,
      removeTrust,
      askQuestion,
      getQuestionsAskedForSuspect,
      canAskMoreQuestions,
      discoverKey,
      hasDiscoveredKey,
      discoverPattern,
      hasDiscoveredPattern,
      setPhase,
      makeAccusation,
      resetGame,
      markIntroSeen,
      canAccuse,
      getProgress,
      getTrustLevel,
      getInterrogationProgress,
      getRemainingAttempts,
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
