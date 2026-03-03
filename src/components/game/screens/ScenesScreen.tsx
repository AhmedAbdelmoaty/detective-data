import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { QuestionPicker } from "../QuestionPicker";
import { useGame } from "@/contexts/GameContext";
import { INTRO_SCENES, QUESTION_POINTS, TRUST_LOST_ENDING } from "@/data/case1";
import type { QuestionOption, SceneDialogue } from "@/data/case1";
import abuSaeed1 from "@/assets/scenes/abu-saeed-1.png";
import abuSaeed2 from "@/assets/scenes/abu-saeed-2.png";
import abuSaeed3 from "@/assets/scenes/abu-saeed-3.png";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";

interface ScenesScreenProps {
  onComplete: () => void;
}

const sceneBgs = [abuSaeed1, abuSaeed2, abuSaeed3, abuSaeed4];

type ScenePhase = "dialogue-before" | "question" | "dialogue-after";

export const ScenesScreen = ({ onComplete }: ScenesScreenProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [scenePhase, setScenePhase] = useState<ScenePhase>("dialogue-before");
  const [responseDialogues, setResponseDialogues] = useState<SceneDialogue[]>([]);
  const [trustLostScreen, setTrustLostScreen] = useState(false);
  const { addToNotebook, isInNotebook, recordQuestionChoice, state } = useGame();

  const scene = INTRO_SCENES[currentScene];
  const questionPoint = QUESTION_POINTS.find(qp => qp.sceneIndex === currentScene);
  const savedNoteIds = [...Array(100)].map((_, i) => `S${i}`).filter(id => isInNotebook(id));

  // Split dialogues: before question point and after
  const getBeforeDialogues = useCallback(() => {
    if (!scene || !questionPoint) return scene?.dialogues || [];
    return scene.dialogues.slice(0, questionPoint.afterDialogueIndex + 1);
  }, [scene, questionPoint]);

  const getAfterDialogues = useCallback(() => {
    if (!scene || !questionPoint) return [];
    return scene.dialogues.slice(questionPoint.afterDialogueIndex + 1);
  }, [scene, questionPoint]);

  const handleBeforeComplete = () => {
    if (questionPoint && !state.questionChoices[currentScene]) {
      setScenePhase("question");
    } else {
      // No question point for this scene or already answered
      handleSceneComplete();
    }
  };

  const handleQuestionSelect = (option: QuestionOption) => {
    recordQuestionChoice(currentScene, option.id, option.insight, option.trustCost);

    // Save insight to notebook if exists
    if (option.insight) {
      addToNotebook({ text: option.insight, source: "story", sourceId: `QI-${currentScene}` });
    }

    // Check trust after recording
    const newTrust = state.trustBudget + option.trustCost;
    if (newTrust <= 0) {
      setTrustLostScreen(true);
      return;
    }

    // Build response dialogues: Abu Saeed's response + remaining scene dialogues
    const afterDialogues = getAfterDialogues();
    setResponseDialogues([...option.response, ...afterDialogues]);
    setScenePhase("dialogue-after");
  };

  const handleAfterComplete = () => {
    handleSceneComplete();
  };

  const handleSceneComplete = () => {
    if (currentScene < INTRO_SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setScenePhase("dialogue-before");
      setResponseDialogues([]);
    } else {
      onComplete();
    }
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "story", sourceId: saveId });
  };

  // Trust lost screen
  if (trustLostScreen) {
    return (
      <div className="relative h-screen overflow-hidden">
        <img src={sceneBgs[currentScene] || abuSaeed1} alt="Scene" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            🚪
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-3">{TRUST_LOST_ENDING.title}</h2>
          <p className="text-muted-foreground mb-6 max-w-md">{TRUST_LOST_ENDING.description}</p>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-6 max-w-md text-right">
            <p className="text-sm font-bold text-primary mb-2">💡 الدرس المستفاد</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{TRUST_LOST_ENDING.lesson}</p>
          </div>

          <motion.button
            onClick={() => {
              // Reset and restart from scenes
              setCurrentScene(0);
              setScenePhase("dialogue-before");
              setResponseDialogues([]);
              setTrustLostScreen(false);
            }}
            className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 حاول تاني
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Determine which dialogues to show based on phase
  const currentDialogues = scenePhase === "dialogue-after" ? responseDialogues : getBeforeDialogues();
  const currentOnComplete = scenePhase === "dialogue-after" ? handleAfterComplete : handleBeforeComplete;

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={sceneBgs[currentScene] || abuSaeed1} alt="Scene" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {INTRO_SCENES.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentScene ? "bg-primary" : i < currentScene ? "bg-primary/50" : "bg-muted"}`} />
        ))}
      </div>

      {/* Scene counter */}
      <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
        <span className="text-sm text-muted-foreground">المشهد {currentScene + 1}/{INTRO_SCENES.length}</span>
      </div>

      {/* Trust indicator */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
        <span className="text-sm text-muted-foreground">ثقة أبو سعيد:</span>
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`text-lg ${i < state.trustBudget ? "opacity-100" : "opacity-20"}`}>
            {i < state.trustBudget ? "🟢" : "⚫"}
          </span>
        ))}
      </div>

      {/* Question picker */}
      <AnimatePresence>
        {scenePhase === "question" && questionPoint && (
          <QuestionPicker
            options={questionPoint.options}
            onSelect={handleQuestionSelect}
          />
        )}
      </AnimatePresence>

      {/* Dialogue */}
      {scenePhase !== "question" && scene && currentDialogues.length > 0 && (
        <motion.div className="fixed inset-0 z-20" key={`dialogue-${currentScene}-${scenePhase}`}>
          <EnhancedDialogue
            dialogues={currentDialogues}
            isActive={true}
            onComplete={currentOnComplete}
            allowClickOutside={false}
            onSaveNote={handleSaveNote}
            savedNoteIds={savedNoteIds}
          />
        </motion.div>
      )}
    </div>
  );
};
