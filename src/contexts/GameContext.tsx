import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CONCLUSION_OPTIONS } from "@/data/newCase";

// Types
export interface Evidence {
  id: string;
  name: string;
  type: string;
  collected: boolean;
}

export interface InvestigationNote {
  id: string;
  content: string;
  timestamp: Date;
}

export interface GameState {
  phase: "intro" | "investigation" | "conclusion" | "result";
  collectedEvidence: string[];
  viewedEvidence: string[];
  notes: InvestigationNote[];
  patternsDiscovered: string[];
  score: number;
  trust: number;
  
  // New case specific
  hasSeenCFOIntro: boolean;
  hasRequestedDataset: boolean;
  conclusionAttempts: number;
  conclusion: {
    cause: string;
    project: string;
    salesperson: string;
  } | null;
  isCorrect: boolean | null;
}

export interface GameContextType {
  state: GameState;
  collectEvidence: (evidenceId: string) => void;
  hasCollectedEvidence: (evidenceId: string) => boolean;
  viewEvidence: (evidenceId: string) => void;
  addNote: (content: string) => void;
  discoverPattern: (pattern: string) => void;
  hasDiscoveredPattern: (pattern: string) => boolean;
  requestDataset: () => void;
  markCFOIntroSeen: () => void;
  submitConclusion: (conclusion: { cause: string; project: string; salesperson: string }) => { correct: boolean; feedback: string };
  resetGame: () => void;
  getProgress: () => number;
}

const initialState: GameState = {
  phase: "intro",
  collectedEvidence: [],
  viewedEvidence: [],
  notes: [],
  patternsDiscovered: [],
  score: 0,
  trust: 100,
  hasSeenCFOIntro: false,
  hasRequestedDataset: false,
  conclusionAttempts: 0,
  conclusion: null,
  isCorrect: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(initialState);

  const collectEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.collectedEvidence.includes(evidenceId)) return prev;
      return {
        ...prev,
        collectedEvidence: [...prev.collectedEvidence, evidenceId],
        score: prev.score + 50,
      };
    });
  }, []);

  const hasCollectedEvidence = useCallback((evidenceId: string) => {
    return state.collectedEvidence.includes(evidenceId);
  }, [state.collectedEvidence]);

  const viewEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(evidenceId)) return prev;
      return {
        ...prev,
        viewedEvidence: [...prev.viewedEvidence, evidenceId],
      };
    });
  }, []);

  const addNote = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      notes: [
        ...prev.notes,
        { id: `note-${Date.now()}`, content, timestamp: new Date() }
      ],
    }));
  }, []);

  const discoverPattern = useCallback((pattern: string) => {
    setState(prev => {
      if (prev.patternsDiscovered.includes(pattern)) return prev;
      return {
        ...prev,
        patternsDiscovered: [...prev.patternsDiscovered, pattern],
        score: prev.score + 100,
      };
    });
  }, []);

  const hasDiscoveredPattern = useCallback((pattern: string) => {
    return state.patternsDiscovered.includes(pattern);
  }, [state.patternsDiscovered]);

  const requestDataset = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasRequestedDataset: true,
      score: prev.score + 25,
    }));
  }, []);

  const markCFOIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenCFOIntro: true }));
  }, []);

  const submitConclusion = useCallback((conclusion: { cause: string; project: string; salesperson: string }) => {
    const causeCorrect = CONCLUSION_OPTIONS.causes.find(c => c.id === conclusion.cause)?.correct;
    const projectCorrect = CONCLUSION_OPTIONS.projects.find(p => p.id === conclusion.project)?.correct;
    const salespersonCorrect = CONCLUSION_OPTIONS.salespeople.find(s => s.id === conclusion.salesperson)?.correct;
    
    const allCorrect = causeCorrect && projectCorrect && salespersonCorrect;
    
    setState(prev => ({
      ...prev,
      conclusionAttempts: prev.conclusionAttempts + 1,
      conclusion,
      isCorrect: allCorrect ?? false,
      trust: allCorrect ? prev.trust : Math.max(0, prev.trust - 25),
      score: allCorrect ? prev.score + 500 : prev.score,
    }));

    if (allCorrect) {
      return { correct: true, feedback: "أحسنت! استنتاجك صحيح تماماً. لقد حددت المشكلة بدقة." };
    }
    
    let feedback = "استنتاجك غير دقيق. ";
    if (!causeCorrect) feedback += "السبب الرئيسي غير صحيح. ";
    if (!projectCorrect) feedback += "المشروع المحدد غير صحيح. ";
    if (!salespersonCorrect) feedback += "المندوب المحدد غير صحيح. ";
    feedback += "راجع تحليلك وحاول مرة أخرى.";
    
    return { correct: false, feedback };
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const getProgress = useCallback(() => {
    const evidenceProgress = (state.collectedEvidence.length / 5) * 40;
    const patternProgress = (state.patternsDiscovered.length / 3) * 40;
    const datasetProgress = state.hasRequestedDataset ? 20 : 0;
    return Math.min(100, evidenceProgress + patternProgress + datasetProgress);
  }, [state.collectedEvidence.length, state.patternsDiscovered.length, state.hasRequestedDataset]);

  return (
    <GameContext.Provider value={{
      state,
      collectEvidence,
      hasCollectedEvidence,
      viewEvidence,
      addNote,
      discoverPattern,
      hasDiscoveredPattern,
      requestDataset,
      markCFOIntroSeen,
      submitConclusion,
      resetGame,
      getProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};
