import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export interface Evidence {
  id: string;
  name: string;
  type: "spreadsheet" | "email" | "document" | "log";
  collected: boolean;
  analyzed: boolean;
  clueFound?: string;
}

export interface Insight {
  id: string;
  text: string;
  source: string;
  isCorrect: boolean;
  concept?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  requiredFor?: string;
}

export interface LearningConcept {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  unlocked: boolean;
  mastered: boolean;
}

export interface Hypothesis {
  id: string;
  suspectId: string;
  isActive: boolean;
  supportingEvidence: string[];
  contradictingEvidence: string[];
}

export interface GameState {
  // التقدم
  currentPhase: "intro" | "investigation" | "analysis" | "confrontation" | "conclusion";
  progress: number;
  
  // نظام الثقة - جديد!
  trust: number; // 0-100
  maxTrust: number;
  
  // الأدلة
  collectedEvidence: string[];
  analyzedEvidence: string[];
  
  // الاستنتاجات
  insights: Insight[];
  correctInsights: number;
  
  // الفرضيات - جديد!
  activeHypothesis: string | null;
  testedHypotheses: string[];
  
  // المهام
  tasks: Task[];
  
  // التعلم
  unlockedConcepts: string[];
  masteredConcepts: string[];
  
  // الاستجواب
  interrogatedSuspects: string[];
  suspectNotes: Record<string, string[]>;
  
  // الألغاز المحلولة
  puzzlesSolved: string[];
  
  // الأخطاء
  mistakes: number;
  hints: number;
  
  // النتيجة
  accusation: string | null;
  caseCompleted: boolean;
  score: number;
}

interface GameContextType {
  state: GameState;
  
  // Evidence actions
  collectEvidence: (id: string) => void;
  analyzeEvidence: (id: string, clueFound?: string) => void;
  
  // Insight actions
  addInsight: (insight: Omit<Insight, "id">) => void;
  removeInsight: (id: string) => void;
  
  // Hypothesis actions - جديد!
  setActiveHypothesis: (id: string) => void;
  testHypothesis: (id: string, isCorrect: boolean) => void;
  
  // Trust actions - جديد!
  addTrust: (amount: number) => void;
  removeTrust: (amount: number) => void;
  
  // Task actions
  completeTask: (id: string) => void;
  
  // Learning actions
  unlockConcept: (id: string) => void;
  masterConcept: (id: string) => void;
  
  // Interrogation actions
  interrogateSuspect: (id: string) => void;
  addSuspectNote: (suspectId: string, note: string) => void;
  
  // Puzzle actions
  solvePuzzle: (id: string) => void;
  addScore: (points: number) => void;
  
  // Game actions
  setPhase: (phase: GameState["currentPhase"]) => void;
  makeAccusation: (suspectId: string) => boolean;
  useHint: () => void;
  addMistake: () => void;
  resetGame: () => void;
  
  // Helpers
  canAccuse: () => boolean;
  getProgress: () => number;
  getTrustLevel: () => "critical" | "low" | "medium" | "high";
  getEvidenceImpact: () => { collected: number; total: number; essential: number };
}

const initialTasks: Task[] = [
  { id: "collect-bank", text: "فحص كشف الحساب البنكي", completed: false },
  { id: "collect-purchases", text: "مراجعة سجل المشتريات", completed: false },
  { id: "find-anomaly", text: "اكتشاف الشذوذ في البيانات", completed: false, requiredFor: "analysis" },
  { id: "analyze-pattern", text: "تحليل نمط المصروفات", completed: false },
  { id: "calculate-stats", text: "حساب الإحصائيات الأساسية", completed: false },
  { id: "cross-reference", text: "ربط الأدلة ببعضها", completed: false },
  { id: "interrogate-2", text: "استجواب مشتبهين على الأقل", completed: false, requiredFor: "accuse" },
  { id: "build-hypothesis", text: "بناء فرضية عن المتهم", completed: false },
  { id: "find-culprit", text: "تحديد المختلس", completed: false },
];

const initialState: GameState = {
  currentPhase: "intro",
  progress: 0,
  trust: 100,
  maxTrust: 100,
  collectedEvidence: [],
  analyzedEvidence: [],
  insights: [],
  correctInsights: 0,
  activeHypothesis: null,
  testedHypotheses: [],
  tasks: initialTasks,
  unlockedConcepts: [],
  masteredConcepts: [],
  interrogatedSuspects: [],
  suspectNotes: {},
  puzzlesSolved: [],
  mistakes: 0,
  hints: 3,
  accusation: null,
  caseCompleted: false,
  score: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const collectEvidence = useCallback((id: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(id)) return prev;
      
      const newCollected = [...prev.collectedEvidence, id];
      const newTasks = prev.tasks.map(t => {
        if (t.id === "collect-bank" && id === "bank-statement") return { ...t, completed: true };
        if (t.id === "collect-purchases" && id === "purchase-log") return { ...t, completed: true };
        return t;
      });
      
      // زيادة الثقة عند جمع دليل
      const trustBonus = 5;
      
      return {
        ...prev,
        collectedEvidence: newCollected,
        tasks: newTasks,
        trust: Math.min(prev.maxTrust, prev.trust + trustBonus),
        progress: Math.min(prev.progress + 10, 100),
        score: prev.score + 25,
      };
    });
  }, []);

  const analyzeEvidence = useCallback((id: string, clueFound?: string) => {
    setState(prev => {
      if (prev.analyzedEvidence.includes(id)) return prev;
      
      return {
        ...prev,
        analyzedEvidence: [...prev.analyzedEvidence, id],
        progress: Math.min(prev.progress + 5, 100),
      };
    });
  }, []);

  const addInsight = useCallback((insight: Omit<Insight, "id">) => {
    setState(prev => {
      const id = `insight-${Date.now()}`;
      const newInsight = { ...insight, id };
      
      let newTasks = prev.tasks;
      if (insight.isCorrect && insight.source === "anomaly") {
        newTasks = prev.tasks.map(t => 
          t.id === "find-anomaly" ? { ...t, completed: true } : t
        );
      }
      
      // الاستنتاج الصحيح يزيد الثقة، الخاطئ ينقصها
      const trustChange = insight.isCorrect ? 3 : -5;
      
      return {
        ...prev,
        insights: [...prev.insights, newInsight],
        correctInsights: insight.isCorrect ? prev.correctInsights + 1 : prev.correctInsights,
        tasks: newTasks,
        trust: Math.max(0, Math.min(prev.maxTrust, prev.trust + trustChange)),
        progress: Math.min(prev.progress + (insight.isCorrect ? 8 : 2), 100),
      };
    });
  }, []);

  const removeInsight = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      insights: prev.insights.filter(i => i.id !== id),
    }));
  }, []);

  const setActiveHypothesis = useCallback((id: string) => {
    setState(prev => {
      const newTasks = prev.tasks.map(t => 
        t.id === "build-hypothesis" ? { ...t, completed: true } : t
      );
      
      return {
        ...prev,
        activeHypothesis: id,
        tasks: newTasks,
        score: prev.score + 50,
      };
    });
  }, []);

  const testHypothesis = useCallback((id: string, isCorrect: boolean) => {
    setState(prev => {
      const trustChange = isCorrect ? 20 : -15;
      
      return {
        ...prev,
        testedHypotheses: [...prev.testedHypotheses, id],
        trust: Math.max(0, Math.min(prev.maxTrust, prev.trust + trustChange)),
        score: prev.score + (isCorrect ? 100 : -25),
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

  const completeTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: true } : t),
      progress: Math.min(prev.progress + 5, 100),
    }));
  }, []);

  const unlockConcept = useCallback((id: string) => {
    setState(prev => {
      if (prev.unlockedConcepts.includes(id)) return prev;
      return {
        ...prev,
        unlockedConcepts: [...prev.unlockedConcepts, id],
        score: prev.score + 50,
        trust: Math.min(prev.maxTrust, prev.trust + 3),
      };
    });
  }, []);

  const masterConcept = useCallback((id: string) => {
    setState(prev => {
      if (prev.masteredConcepts.includes(id)) return prev;
      return {
        ...prev,
        masteredConcepts: [...prev.masteredConcepts, id],
        score: prev.score + 100,
      };
    });
  }, []);

  const interrogateSuspect = useCallback((id: string) => {
    setState(prev => {
      if (prev.interrogatedSuspects.includes(id)) return prev;
      
      const newInterrogated = [...prev.interrogatedSuspects, id];
      let newTasks = prev.tasks;
      
      if (newInterrogated.length >= 2) {
        newTasks = prev.tasks.map(t => 
          t.id === "interrogate-2" ? { ...t, completed: true } : t
        );
      }
      
      return {
        ...prev,
        interrogatedSuspects: newInterrogated,
        tasks: newTasks,
        progress: Math.min(prev.progress + 10, 100),
        trust: Math.min(prev.maxTrust, prev.trust + 5),
      };
    });
  }, []);

  const addSuspectNote = useCallback((suspectId: string, note: string) => {
    setState(prev => ({
      ...prev,
      suspectNotes: {
        ...prev.suspectNotes,
        [suspectId]: [...(prev.suspectNotes[suspectId] || []), note],
      },
    }));
  }, []);

  const solvePuzzle = useCallback((id: string) => {
    setState(prev => {
      if (prev.puzzlesSolved.includes(id)) return prev;
      
      return {
        ...prev,
        puzzlesSolved: [...prev.puzzlesSolved, id],
        score: prev.score + 150,
        trust: Math.min(prev.maxTrust, prev.trust + 8),
        progress: Math.min(prev.progress + 15, 100),
      };
    });
  }, []);

  const addScore = useCallback((points: number) => {
    setState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const makeAccusation = useCallback((suspectId: string): boolean => {
    const isCorrect = suspectId === "karim";
    
    setState(prev => {
      // حساب النتيجة النهائية
      const evidenceBonus = prev.collectedEvidence.length * 50;
      const conceptsBonus = prev.unlockedConcepts.length * 30;
      const trustBonus = Math.floor(prev.trust / 10) * 20;
      const mistakePenalty = prev.mistakes * 50;
      const hintPenalty = (3 - prev.hints) * 25;
      
      const finalScore = isCorrect 
        ? prev.score + 500 + evidenceBonus + conceptsBonus + trustBonus - mistakePenalty - hintPenalty
        : Math.max(0, prev.score - 200);
      
      return {
        ...prev,
        accusation: suspectId,
        caseCompleted: true,
        mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1,
        score: Math.max(0, finalScore),
        trust: isCorrect ? prev.trust : Math.max(0, prev.trust - 30),
        tasks: prev.tasks.map(t => 
          t.id === "find-culprit" && isCorrect ? { ...t, completed: true } : t
        ),
      };
    });
    
    return isCorrect;
  }, []);

  const useHint = useCallback(() => {
    setState(prev => ({
      ...prev,
      hints: Math.max(0, prev.hints - 1),
      trust: Math.max(0, prev.trust - 5),
    }));
  }, []);

  const addMistake = useCallback(() => {
    setState(prev => ({
      ...prev,
      mistakes: prev.mistakes + 1,
      trust: Math.max(0, prev.trust - 10),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const canAccuse = useCallback(() => {
    return state.interrogatedSuspects.length >= 2 && 
           state.collectedEvidence.length >= 3 &&
           state.insights.length >= 2 &&
           state.trust > 20; // لازم الثقة أعلى من 20%
  }, [state]);

  const getProgress = useCallback(() => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [state.tasks]);

  const getTrustLevel = useCallback((): "critical" | "low" | "medium" | "high" => {
    if (state.trust <= 20) return "critical";
    if (state.trust <= 40) return "low";
    if (state.trust <= 70) return "medium";
    return "high";
  }, [state.trust]);

  const getEvidenceImpact = useCallback(() => {
    const total = 5; // عدد الأدلة الكلي
    const collected = state.collectedEvidence.length;
    const essential = state.collectedEvidence.filter(id => 
      ["bank-statement", "purchase-log", "audit-report", "access-logs"].includes(id)
    ).length;
    
    return { collected, total, essential };
  }, [state.collectedEvidence]);

  return (
    <GameContext.Provider value={{
      state,
      collectEvidence,
      analyzeEvidence,
      addInsight,
      removeInsight,
      setActiveHypothesis,
      testHypothesis,
      addTrust,
      removeTrust,
      completeTask,
      unlockConcept,
      masterConcept,
      interrogateSuspect,
      addSuspectNote,
      solvePuzzle,
      addScore,
      setPhase,
      makeAccusation,
      useHint,
      addMistake,
      resetGame,
      canAccuse,
      getProgress,
      getTrustLevel,
      getEvidenceImpact,
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
