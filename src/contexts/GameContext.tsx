import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export type GamePhase = 
  | "intro"
  | "briefing"
  | "evidence_pack1"
  | "analysis1"
  | "hypothesis_selection"
  | "evidence_pack2"
  | "interrogation"
  | "evidence_pack3"
  | "analysis2"
  | "accusation"
  | "result";

export interface Evidence {
  id: string;
  name: string;
  type: "spreadsheet" | "email" | "document" | "log";
  collected: boolean;
  analyzed: boolean;
}

export interface InvestigationNote {
  id: string;
  type: "discovery" | "clue" | "suspicion" | "insight" | "pattern";
  text: string;
  source: string;
  timestamp: number;
  suspectId?: string;
}

export interface Insight {
  id: string;
  name: string;
  description: string;
  discoveredAt: number;
}

export interface SuspectInterrogation {
  suspectId: string;
  questionsAsked: string[];
  cluesRevealed: string[];
}

export interface GameState {
  // الـ Phase الحالي
  gamePhase: GamePhase;
  
  // نظام الوقت (6 أيام)
  timeRemaining: number;
  maxTime: number;
  
  // نظام الثقة
  trust: number;
  maxTrust: number;
  
  // الأدلة
  collectedEvidence: string[];
  viewedEvidence: string[];
  
  // الـ Packs المفتوحة
  unlockedPacks: ("pack1" | "pack2" | "pack3")[];
  
  // الـ Insights المكتشفة
  discoveredInsights: Insight[];
  
  // دفتر التحقيق
  investigationNotes: InvestigationNote[];
  
  // الفرضيات
  activeHypothesis: string | null;
  
  // الاستجواب
  interrogations: SuspectInterrogation[];
  totalQuestionsAsked: number;
  
  // نظام الاتهام
  accusation: string | null;
  accusationAttempts: number;
  maxAccusationAttempts: number;
  caseCompleted: boolean;
  score: number;
  
  // حالة الحوار
  hasSeenIntroDialogue: boolean;
  
  // الهدف الحالي
  currentObjective: string;
}

interface GameContextType {
  state: GameState;
  
  // Phase actions
  advancePhase: () => void;
  setPhase: (phase: GamePhase) => void;
  
  // Evidence actions
  collectEvidence: (id: string) => void;
  viewEvidence: (id: string) => void;
  getCollectedFromPack: (pack: "pack1" | "pack2" | "pack3") => number;
  canCollectFromPack: (pack: "pack1" | "pack2" | "pack3") => boolean;
  
  // Insight actions
  discoverInsight: (id: string, name: string, description: string) => void;
  hasInsight: (id: string) => boolean;
  
  // Investigation notes
  addNote: (note: Omit<InvestigationNote, "id" | "timestamp">) => void;
  
  // Hypothesis actions
  setActiveHypothesis: (id: string) => void;
  
  // Trust/Time actions
  addTrust: (amount: number) => void;
  removeTrust: (amount: number) => void;
  useTime: (days: number) => void;
  
  // Interrogation actions
  askQuestion: (suspectId: string, questionId: string, clue?: string) => void;
  getQuestionsAskedForSuspect: (suspectId: string) => string[];
  canAskMoreQuestions: (suspectId: string) => boolean;
  hasInterrogatedAnyone: () => boolean;
  
  // Game actions
  makeAccusation: (suspectId: string) => { correct: boolean; attemptsLeft: number; gameOver: boolean };
  resetGame: () => void;
  markIntroSeen: () => void;
  
  // Helpers
  canAccuse: () => boolean;
  getProgress: () => number;
  getTrustLevel: () => "critical" | "low" | "medium" | "high";
  getInterrogationProgress: () => { asked: number; total: number };
  getRemainingAttempts: () => number;
  getPhaseInfo: () => { current: string; unlocked: string[]; next: string };
}

const initialState: GameState = {
  gamePhase: "intro",
  timeRemaining: 6,
  maxTime: 6,
  trust: 100,
  maxTrust: 100,
  collectedEvidence: [],
  viewedEvidence: [],
  unlockedPacks: ["pack1"],
  discoveredInsights: [],
  investigationNotes: [],
  activeHypothesis: null,
  interrogations: [],
  totalQuestionsAsked: 0,
  accusation: null,
  accusationAttempts: 0,
  maxAccusationAttempts: 3,
  caseCompleted: false,
  score: 0,
  hasSeenIntroDialogue: false,
  currentObjective: "اقرأ ملخص القضية في مكتب المحقق",
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  // Helper to count collected evidence from a pack
  const getCollectedFromPackInternal = (pack: "pack1" | "pack2" | "pack3", collectedEvidence: string[]): number => {
    const packItems: Record<string, string[]> = {
      pack1: ["bank-summary", "system-log-brief", "email-inquiry"],
      pack2: ["bank-transactions", "invoices"],
      pack3: ["activity-log", "email-urgent"],
    };
    return collectedEvidence.filter(id => packItems[pack].includes(id)).length;
  };

  const getCollectedFromPack = useCallback((pack: "pack1" | "pack2" | "pack3") => {
    return getCollectedFromPackInternal(pack, state.collectedEvidence);
  }, [state.collectedEvidence]);

  const canCollectFromPack = useCallback((pack: "pack1" | "pack2" | "pack3") => {
    if (!state.unlockedPacks.includes(pack)) return false;
    
    // Pack 1: يمكن جمع 2 فقط من 3
    if (pack === "pack1") {
      return getCollectedFromPackInternal("pack1", state.collectedEvidence) < 2;
    }
    
    // Pack 2 & 3: يمكن جمع الكل
    return true;
  }, [state.unlockedPacks, state.collectedEvidence]);

  const collectEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(id)) return prev;
      
      // Check pack limits
      const packItems: Record<string, string[]> = {
        pack1: ["bank-summary", "system-log-brief", "email-inquiry"],
        pack2: ["bank-transactions", "invoices"],
        pack3: ["activity-log", "email-urgent"],
      };
      
      let pack: "pack1" | "pack2" | "pack3" | null = null;
      for (const [p, items] of Object.entries(packItems)) {
        if (items.includes(id)) {
          pack = p as "pack1" | "pack2" | "pack3";
          break;
        }
      }
      
      if (pack === "pack1" && getCollectedFromPackInternal("pack1", prev.collectedEvidence) >= 2) {
        return prev; // Can't collect more from pack1
      }
      
      const newCollected = [...prev.collectedEvidence, id];
      
      // Check phase progression
      let newPhase = prev.gamePhase;
      let newObjective = prev.currentObjective;
      
      // After collecting 2 from pack1, move to analysis1
      if (pack === "pack1" && getCollectedFromPackInternal("pack1", newCollected) >= 2 && prev.gamePhase === "evidence_pack1") {
        newPhase = "analysis1";
        newObjective = "اذهب إلى غرفة التحليل واكتشف نمطاً";
      }
      
      return {
        ...prev,
        collectedEvidence: newCollected,
        score: prev.score + 25,
        gamePhase: newPhase,
        currentObjective: newObjective,
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

  const discoverInsight = useCallback((id: string, name: string, description: string) => {
    setState(prev => {
      if (prev.discoveredInsights.some(i => i.id === id)) return prev;
      
      const newInsight: Insight = {
        id,
        name,
        description,
        discoveredAt: Date.now(),
      };
      
      const newInsights = [...prev.discoveredInsights, newInsight];
      
      // Add to notes
      const newNote: InvestigationNote = {
        id: `insight-${Date.now()}`,
        type: "insight",
        text: `🔍 ${name}: ${description}`,
        source: "analysis",
        timestamp: Date.now(),
      };
      
      // Check phase progression
      let newPhase = prev.gamePhase;
      let newObjective = prev.currentObjective;
      let newUnlockedPacks = [...prev.unlockedPacks];
      
      // After first insight, unlock pack2 and hypothesis selection
      if (newInsights.length === 1 && prev.gamePhase === "analysis1") {
        newPhase = "hypothesis_selection";
        newObjective = "اختر فرضية للتحقيق فيها";
        if (!newUnlockedPacks.includes("pack2")) {
          newUnlockedPacks.push("pack2");
        }
      }
      
      // After 3 insights, can accuse
      if (newInsights.length >= 3 && prev.gamePhase === "analysis2") {
        newPhase = "accusation";
        newObjective = "اتخذ قرارك النهائي في غرفة الاستجواب";
      }
      
      return {
        ...prev,
        discoveredInsights: newInsights,
        investigationNotes: [...prev.investigationNotes, newNote],
        score: prev.score + 100,
        gamePhase: newPhase,
        currentObjective: newObjective,
        unlockedPacks: newUnlockedPacks,
      };
    });
  }, []);

  const hasInsight = useCallback((id: string): boolean => {
    return state.discoveredInsights.some(i => i.id === id);
  }, [state.discoveredInsights]);

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
        score: prev.score + 10,
      };
    });
  }, []);

  const setActiveHypothesis = useCallback((id: string) => {
    setState(prev => {
      let newPhase = prev.gamePhase;
      let newObjective = prev.currentObjective;
      
      if (prev.gamePhase === "hypothesis_selection") {
        newPhase = "evidence_pack2";
        newObjective = "اجمع الأدلة الجديدة من Pack 2";
      }
      
      return {
        ...prev,
        activeHypothesis: id,
        score: prev.score + 30,
        gamePhase: newPhase,
        currentObjective: newObjective,
      };
    });
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

  const useTime = useCallback((days: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: Math.max(0, prev.timeRemaining - days),
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
      
      // Add clue to notes
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
      
      // Check phase progression - after first interrogation, unlock pack3
      let newPhase = prev.gamePhase;
      let newObjective = prev.currentObjective;
      let newUnlockedPacks = [...prev.unlockedPacks];
      
      const totalQuestionsNow = prev.totalQuestionsAsked + 1;
      const suspectsInterrogated = newInterrogations.filter(i => i.questionsAsked.length > 0).length;
      
      if (suspectsInterrogated >= 1 && !prev.unlockedPacks.includes("pack3") && prev.gamePhase === "interrogation") {
        newUnlockedPacks.push("pack3");
        newPhase = "evidence_pack3";
        newObjective = "اجمع الأدلة الأخيرة من Pack 3";
      }
      
      return {
        ...prev,
        interrogations: newInterrogations,
        totalQuestionsAsked: totalQuestionsNow,
        investigationNotes: newNotes,
        score: prev.score + 15,
        gamePhase: newPhase,
        currentObjective: newObjective,
        unlockedPacks: newUnlockedPacks,
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

  const hasInterrogatedAnyone = useCallback(() => {
    return state.interrogations.some(i => i.questionsAsked.length > 0);
  }, [state.interrogations]);

  const advancePhase = useCallback(() => {
    setState(prev => {
      const phaseOrder: GamePhase[] = [
        "intro", "briefing", "evidence_pack1", "analysis1", "hypothesis_selection",
        "evidence_pack2", "interrogation", "evidence_pack3", "analysis2", "accusation", "result"
      ];
      const currentIndex = phaseOrder.indexOf(prev.gamePhase);
      if (currentIndex < phaseOrder.length - 1) {
        return {
          ...prev,
          gamePhase: phaseOrder[currentIndex + 1],
        };
      }
      return prev;
    });
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState(prev => {
      let newObjective = prev.currentObjective;
      
      switch (phase) {
        case "briefing":
          newObjective = "اقرأ ملخص القضية في مكتب المحقق";
          break;
        case "evidence_pack1":
          newObjective = "اجمع دليلين من غرفة الأدلة";
          break;
        case "analysis1":
          newObjective = "اذهب إلى غرفة التحليل واكتشف نمطاً";
          break;
        case "hypothesis_selection":
          newObjective = "اختر فرضية للتحقيق فيها";
          break;
        case "evidence_pack2":
          newObjective = "اجمع الأدلة الجديدة من Pack 2";
          break;
        case "interrogation":
          newObjective = "استجوب المشتبهين";
          break;
        case "evidence_pack3":
          newObjective = "اجمع الأدلة الأخيرة من Pack 3";
          break;
        case "analysis2":
          newObjective = "اكتشف أنماطاً إضافية للوصول للحل";
          break;
        case "accusation":
          newObjective = "اتخذ قرارك النهائي في غرفة الاستجواب";
          break;
      }
      
      return { ...prev, gamePhase: phase, currentObjective: newObjective };
    });
  }, []);

  const makeAccusation = useCallback((suspectId: string): { correct: boolean; attemptsLeft: number; gameOver: boolean } => {
    const isCorrect = suspectId === "karim";
    
    let result = { correct: isCorrect, attemptsLeft: 0, gameOver: false };
    
    setState(prev => {
      const newAttempts = prev.accusationAttempts + 1;
      const attemptsLeft = prev.maxAccusationAttempts - newAttempts;
      
      if (isCorrect) {
        const evidenceBonus = prev.collectedEvidence.length * 50;
        const insightBonus = prev.discoveredInsights.length * 100;
        const trustBonus = Math.floor(prev.trust / 10) * 20;
        const timeBonus = prev.timeRemaining * 50;
        
        const finalScore = prev.score + 500 + evidenceBonus + insightBonus + trustBonus + timeBonus;
        
        result = { correct: true, attemptsLeft, gameOver: true };
        
        return {
          ...prev,
          accusation: suspectId,
          accusationAttempts: newAttempts,
          caseCompleted: true,
          score: finalScore,
          gamePhase: "result",
          currentObjective: "القضية محلولة!",
        };
      } else {
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
          gamePhase: isGameOver ? "result" : prev.gamePhase,
          currentObjective: isGameOver ? "فشلت في حل القضية" : prev.currentObjective,
        };
      }
    });
    
    return result;
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const markIntroSeen = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      hasSeenIntroDialogue: true,
      gamePhase: "briefing",
      currentObjective: "اقرأ ملخص القضية في مكتب المحقق",
    }));
  }, []);

  const canAccuse = useCallback(() => {
    return state.discoveredInsights.length >= 2 && 
           state.trust > 20 &&
           state.accusationAttempts < state.maxAccusationAttempts &&
           state.gamePhase === "accusation";
  }, [state]);

  const getProgress = useCallback(() => {
    const evidenceProgress = (state.collectedEvidence.length / 7) * 30;
    const insightProgress = (state.discoveredInsights.length / 3) * 40;
    const interrogationProgress = (state.interrogations.filter(i => i.questionsAsked.length > 0).length / 3) * 30;
    return Math.round(evidenceProgress + insightProgress + interrogationProgress);
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

  const getPhaseInfo = useCallback(() => {
    const phaseNames: Record<GamePhase, string> = {
      intro: "المقدمة",
      briefing: "ملخص القضية",
      evidence_pack1: "جمع الأدلة (1)",
      analysis1: "التحليل الأولي",
      hypothesis_selection: "اختيار الفرضية",
      evidence_pack2: "جمع الأدلة (2)",
      interrogation: "الاستجواب",
      evidence_pack3: "جمع الأدلة (3)",
      analysis2: "التحليل النهائي",
      accusation: "الاتهام",
      result: "النتيجة",
    };
    
    const unlockedRooms: string[] = ["المكتب"];
    
    if (state.gamePhase !== "intro" && state.gamePhase !== "briefing") {
      unlockedRooms.push("غرفة الأدلة");
    }
    if (state.collectedEvidence.length >= 2) {
      unlockedRooms.push("غرفة التحليل");
    }
    if (state.discoveredInsights.length >= 1 && state.activeHypothesis) {
      unlockedRooms.push("غرفة الاستجواب");
    }
    
    let next = "";
    switch (state.gamePhase) {
      case "evidence_pack1": next = "غرفة التحليل"; break;
      case "analysis1": next = "اختيار الفرضية"; break;
      case "hypothesis_selection": next = "أدلة جديدة"; break;
      case "evidence_pack2": next = "الاستجواب"; break;
      case "interrogation": next = "أدلة أخيرة"; break;
      case "evidence_pack3": next = "التحليل النهائي"; break;
      case "analysis2": next = "الاتهام"; break;
    }
    
    return {
      current: phaseNames[state.gamePhase],
      unlocked: unlockedRooms,
      next,
    };
  }, [state.gamePhase, state.collectedEvidence.length, state.discoveredInsights.length, state.activeHypothesis]);

  return (
    <GameContext.Provider value={{
      state,
      advancePhase,
      setPhase,
      collectEvidence,
      viewEvidence,
      getCollectedFromPack,
      canCollectFromPack,
      discoverInsight,
      hasInsight,
      addNote,
      setActiveHypothesis,
      addTrust,
      removeTrust,
      useTime,
      askQuestion,
      getQuestionsAskedForSuspect,
      canAskMoreQuestions,
      hasInterrogatedAnyone,
      makeAccusation,
      resetGame,
      markIntroSeen,
      canAccuse,
      getProgress,
      getTrustLevel,
      getInterrogationProgress,
      getRemainingAttempts,
      getPhaseInfo,
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
