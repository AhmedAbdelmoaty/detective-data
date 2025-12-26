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
  type: "discovery" | "clue" | "suspicion" | "key";
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
  
  // دفتر التحقيق - يسجل الاكتشافات تلقائياً
  investigationNotes: InvestigationNote[];
  
  // الفرضيات
  activeHypothesis: string | null;
  testedHypotheses: string[];
  
  // الاستجواب
  interrogations: SuspectInterrogation[];
  totalQuestionsAsked: number;
  
  // النتيجة
  accusation: string | null;
  caseCompleted: boolean;
  score: number;
  
  // تتبع المفاتيح المكتشفة (لحل الأدلة المضللة)
  keysDiscovered: string[];
}

interface GameContextType {
  state: GameState;
  
  // Evidence actions
  collectEvidence: (id: string) => void;
  viewEvidence: (id: string) => void;
  
  // Investigation notes (دفتر التحقيق)
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
  
  // Key discovery (لفهم الأدلة المضللة)
  discoverKey: (keyId: string) => void;
  hasDiscoveredKey: (keyId: string) => boolean;
  
  // Game actions
  setPhase: (phase: GameState["currentPhase"]) => void;
  makeAccusation: (suspectId: string) => boolean;
  resetGame: () => void;
  
  // Helpers
  canAccuse: () => boolean;
  getProgress: () => number;
  getTrustLevel: () => "critical" | "low" | "medium" | "high";
  getInterrogationProgress: () => { asked: number; total: number };
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
  caseCompleted: false,
  score: 0,
  keysDiscovered: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const collectEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(id)) return prev;
      
      const newCollected = [...prev.collectedEvidence, id];
      const trustBonus = 5;
      
      // إضافة ملاحظة تلقائية
      const newNote: InvestigationNote = {
        id: `note-${Date.now()}`,
        type: "discovery",
        text: `تم جمع دليل جديد`,
        source: id,
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        collectedEvidence: newCollected,
        investigationNotes: [...prev.investigationNotes, newNote],
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
      
      // مكافأة للاكتشافات المهمة
      const trustBonus = note.type === "key" ? 10 : note.type === "clue" ? 5 : 0;
      
      return {
        ...prev,
        investigationNotes: [...prev.investigationNotes, newNote],
        trust: Math.min(prev.maxTrust, prev.trust + trustBonus),
        score: prev.score + (note.type === "key" ? 50 : note.type === "clue" ? 20 : 5),
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
        // تحقق من أن السؤال لم يُطرح من قبل
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
      
      // إضافة ملاحظة للدفتر إذا كان هناك دليل
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
    return questionsAsked.length < 3; // 3 أسئلة لكل مشتبه
  }, [getQuestionsAskedForSuspect]);

  const discoverKey = useCallback((keyId: string) => {
    setState(prev => {
      if (prev.keysDiscovered.includes(keyId)) return prev;
      
      const newNote: InvestigationNote = {
        id: `note-${Date.now()}`,
        type: "key",
        text: `اكتشاف مهم: تم العثور على تفسير جديد`,
        source: keyId,
        timestamp: Date.now(),
      };
      
      return {
        ...prev,
        keysDiscovered: [...prev.keysDiscovered, keyId],
        investigationNotes: [...prev.investigationNotes, newNote],
        trust: Math.min(prev.maxTrust, prev.trust + 10),
        score: prev.score + 75,
      };
    });
  }, []);

  const hasDiscoveredKey = useCallback((keyId: string): boolean => {
    return state.keysDiscovered.includes(keyId);
  }, [state.keysDiscovered]);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const makeAccusation = useCallback((suspectId: string): boolean => {
    const isCorrect = suspectId === "karim";
    
    setState(prev => {
      const evidenceBonus = prev.collectedEvidence.length * 50;
      const notesBonus = prev.investigationNotes.filter(n => n.type === "key").length * 100;
      const trustBonus = Math.floor(prev.trust / 10) * 20;
      const questionsBonus = prev.totalQuestionsAsked * 10;
      
      const finalScore = isCorrect 
        ? prev.score + 500 + evidenceBonus + notesBonus + trustBonus + questionsBonus
        : Math.max(0, prev.score - 200);
      
      return {
        ...prev,
        accusation: suspectId,
        caseCompleted: true,
        score: Math.max(0, finalScore),
        trust: isCorrect ? prev.trust : Math.max(0, prev.trust - 30),
      };
    });
    
    return isCorrect;
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const canAccuse = useCallback(() => {
    // يمكن الاتهام بعد جمع 3 أدلة على الأقل واستجواب 2 مشتبهين
    const suspectsInterrogated = state.interrogations.filter(i => i.questionsAsked.length > 0).length;
    return state.collectedEvidence.length >= 3 && 
           suspectsInterrogated >= 2 &&
           state.trust > 20;
  }, [state]);

  const getProgress = useCallback(() => {
    const evidenceProgress = (state.collectedEvidence.length / 5) * 40;
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
    const total = 9; // 3 أسئلة × 3 مشتبهين
    return { asked, total };
  }, [state.totalQuestionsAsked]);

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
      setPhase,
      makeAccusation,
      resetGame,
      canAccuse,
      getProgress,
      getTrustLevel,
      getInterrogationProgress,
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
