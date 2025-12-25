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
  concept?: string; // المفهوم التعليمي المرتبط
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  requiredFor?: string; // ما الذي يفتحه إكمال هذه المهمة
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

export interface GameState {
  // التقدم
  currentPhase: "intro" | "investigation" | "analysis" | "confrontation" | "conclusion";
  progress: number; // 0-100
  
  // الأدلة
  collectedEvidence: string[];
  analyzedEvidence: string[];
  
  // الاستنتاجات
  insights: Insight[];
  correctInsights: number;
  
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
  
  // Game actions
  setPhase: (phase: GameState["currentPhase"]) => void;
  makeAccusation: (suspectId: string) => boolean;
  useHint: () => void;
  resetGame: () => void;
  
  // Helpers
  canAccuse: () => boolean;
  getProgress: () => number;
}

const initialTasks: Task[] = [
  { id: "collect-bank", text: "فحص كشف الحساب البنكي", completed: false },
  { id: "collect-purchases", text: "مراجعة سجل المشتريات", completed: false },
  { id: "find-anomaly", text: "اكتشاف الشذوذ في البيانات", completed: false, requiredFor: "analysis" },
  { id: "analyze-pattern", text: "تحليل نمط المصروفات", completed: false },
  { id: "calculate-stats", text: "حساب الإحصائيات الأساسية", completed: false },
  { id: "interrogate-2", text: "استجواب مشتبهين على الأقل", completed: false, requiredFor: "accuse" },
  { id: "find-culprit", text: "تحديد المختلس", completed: false },
];

const initialState: GameState = {
  currentPhase: "intro",
  progress: 0,
  collectedEvidence: [],
  analyzedEvidence: [],
  insights: [],
  correctInsights: 0,
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
      
      return {
        ...prev,
        collectedEvidence: newCollected,
        tasks: newTasks,
        progress: Math.min(prev.progress + 10, 100),
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
      
      // تحديث المهام إذا كان الاستنتاج صحيحاً
      let newTasks = prev.tasks;
      if (insight.isCorrect && insight.source === "anomaly") {
        newTasks = prev.tasks.map(t => 
          t.id === "find-anomaly" ? { ...t, completed: true } : t
        );
      }
      
      return {
        ...prev,
        insights: [...prev.insights, newInsight],
        correctInsights: insight.isCorrect ? prev.correctInsights + 1 : prev.correctInsights,
        tasks: newTasks,
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
        progress: Math.min(prev.progress + 15, 100),
      };
    });
  }, []);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const makeAccusation = useCallback((suspectId: string): boolean => {
    const isCorrect = suspectId === "karim";
    
    setState(prev => {
      const finalScore = isCorrect 
        ? prev.score + 500 - (prev.mistakes * 50) + (prev.hints * 25)
        : prev.score - 100;
      
      return {
        ...prev,
        accusation: suspectId,
        caseCompleted: true,
        mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1,
        score: Math.max(0, finalScore),
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
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const canAccuse = useCallback(() => {
    return state.interrogatedSuspects.length >= 2 && 
           state.collectedEvidence.length >= 2 &&
           state.insights.length >= 1;
  }, [state]);

  const getProgress = useCallback(() => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [state.tasks]);

  return (
    <GameContext.Provider value={{
      state,
      collectEvidence,
      analyzeEvidence,
      addInsight,
      removeInsight,
      completeTask,
      unlockConcept,
      masterConcept,
      interrogateSuspect,
      addSuspectNote,
      solvePuzzle,
      setPhase,
      makeAccusation,
      useHint,
      resetGame,
      canAccuse,
      getProgress,
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
