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

// ملاحظات المستخدم الحرة
export interface UserNote {
  id: string;
  text: string;
  category: "observation" | "suspicion" | "pattern" | "question";
  timestamp: number;
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
  
  // دفتر التحقيق (ملاحظات النظام)
  investigationNotes: InvestigationNote[];
  
  // ملاحظات المستخدم الحرة
  userNotes: UserNote[];
  
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
  
  // حالة الحوار
  hasSeenIntroDialogue: boolean;
  
  // تتبع الأفعال للتقييم
  actionsPerformed: string[];
  filtersApplied: number;
  chartsBuilt: number;
  comparisonsRun: number;
}

interface GameContextType {
  state: GameState;
  
  // Evidence actions
  collectEvidence: (id: string) => void;
  viewEvidence: (id: string) => void;
  
  // Investigation notes (system)
  addNote: (note: Omit<InvestigationNote, "id" | "timestamp">) => void;
  
  // User notes (free-form)
  addUserNote: (text: string, category: UserNote["category"]) => void;
  deleteUserNote: (id: string) => void;
  getUserNotes: () => UserNote[];
  
  // Hypothesis actions
  setActiveHypothesis: (id: string) => void;
  
  // Trust actions
  addTrust: (amount: number) => void;
  removeTrust: (amount: number) => void;
  
  // Interrogation actions
  askQuestion: (suspectId: string, questionId: string, clue?: string) => void;
  getQuestionsAskedForSuspect: (suspectId: string) => string[];
  canAskMoreQuestions: (suspectId: string) => boolean;
  
  // Action tracking (للتقييم)
  trackAction: (action: string) => void;
  trackFilter: () => void;
  trackChart: () => void;
  trackComparison: () => void;
  
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
  userNotes: [],
  activeHypothesis: null,
  testedHypotheses: [],
  interrogations: [],
  totalQuestionsAsked: 0,
  accusation: null,
  accusationAttempts: 0,
  maxAccusationAttempts: 3,
  caseCompleted: false,
  score: 0,
  hasSeenIntroDialogue: false,
  actionsPerformed: [],
  filtersApplied: 0,
  chartsBuilt: 0,
  comparisonsRun: 0,
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
        actionsPerformed: [...prev.actionsPerformed, `collect-${id}`],
      };
    });
  }, []);

  const viewEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(id)) return prev;
      return {
        ...prev,
        viewedEvidence: [...prev.viewedEvidence, id],
        actionsPerformed: [...prev.actionsPerformed, `view-${id}`],
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
      
      // مكافآت بسيطة للملاحظات النظامية
      const trustBonus = note.type === "clue" ? 3 : 0;
      
      return {
        ...prev,
        investigationNotes: [...prev.investigationNotes, newNote],
        trust: Math.min(prev.maxTrust, prev.trust + trustBonus),
        score: prev.score + (note.type === "clue" ? 10 : 0),
      };
    });
  }, []);

  // ملاحظات المستخدم الحرة - بدون تصحيح أو تقييم
  const addUserNote = useCallback((text: string, category: UserNote["category"]) => {
    setState(prev => {
      const newNote: UserNote = {
        id: `user-note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        category,
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        userNotes: [...prev.userNotes, newNote],
        actionsPerformed: [...prev.actionsPerformed, `note-${category}`],
      };
    });
  }, []);

  const deleteUserNote = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      userNotes: prev.userNotes.filter(n => n.id !== id),
    }));
  }, []);

  const getUserNotes = useCallback(() => {
    return state.userNotes;
  }, [state.userNotes]);

  const setActiveHypothesis = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      activeHypothesis: id,
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
      
      return {
        ...prev,
        interrogations: newInterrogations,
        totalQuestionsAsked: prev.totalQuestionsAsked + 1,
        progress: Math.min(prev.progress + 5, 100),
        score: prev.score + 10,
        actionsPerformed: [...prev.actionsPerformed, `interrogate-${suspectId}-${questionId}`],
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

  // Action tracking للتقييم
  const trackAction = useCallback((action: string) => {
    setState(prev => ({
      ...prev,
      actionsPerformed: [...prev.actionsPerformed, action],
    }));
  }, []);

  const trackFilter = useCallback(() => {
    setState(prev => ({
      ...prev,
      filtersApplied: prev.filtersApplied + 1,
      score: prev.score + 5,
      actionsPerformed: [...prev.actionsPerformed, "filter"],
    }));
  }, []);

  const trackChart = useCallback(() => {
    setState(prev => ({
      ...prev,
      chartsBuilt: prev.chartsBuilt + 1,
      score: prev.score + 15,
      actionsPerformed: [...prev.actionsPerformed, "chart"],
    }));
  }, []);

  const trackComparison = useCallback(() => {
    setState(prev => ({
      ...prev,
      comparisonsRun: prev.comparisonsRun + 1,
      score: prev.score + 20,
      actionsPerformed: [...prev.actionsPerformed, "comparison"],
    }));
  }, []);

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
        // نجاح! - التقييم على الأفعال
        const evidenceBonus = prev.collectedEvidence.length * 30;
        const interrogationBonus = prev.totalQuestionsAsked * 15;
        const analysisBonus = (prev.filtersApplied * 5) + (prev.chartsBuilt * 15) + (prev.comparisonsRun * 20);
        const notesBonus = prev.userNotes.length * 10;
        const trustBonus = Math.floor(prev.trust / 10) * 10;
        
        const finalScore = prev.score + 300 + evidenceBonus + interrogationBonus + analysisBonus + notesBonus + trustBonus;
        
        result = { correct: true, attemptsLeft, gameOver: true };
        
        return {
          ...prev,
          accusation: suspectId,
          accusationAttempts: newAttempts,
          caseCompleted: true,
          score: finalScore,
          actionsPerformed: [...prev.actionsPerformed, `accuse-${suspectId}-correct`],
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
          score: isGameOver ? Math.max(0, prev.score - 100) : prev.score,
          actionsPerformed: [...prev.actionsPerformed, `accuse-${suspectId}-wrong`],
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
    const analysisProgress = Math.min((state.filtersApplied + state.chartsBuilt + state.comparisonsRun) / 5, 1) * 20;
    return Math.round(evidenceProgress + interrogationProgress + analysisProgress);
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
      addUserNote,
      deleteUserNote,
      getUserNotes,
      setActiveHypothesis,
      addTrust,
      removeTrust,
      askQuestion,
      getQuestionsAskedForSuspect,
      canAskMoreQuestions,
      trackAction,
      trackFilter,
      trackChart,
      trackComparison,
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
