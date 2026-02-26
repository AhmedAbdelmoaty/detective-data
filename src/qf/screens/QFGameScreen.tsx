import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQF } from "../context/QFContext";
import { QFHud } from "../components/QFHud";
import { QFQuestionCards } from "../components/QFQuestionCards";
import { QFFramingScreen } from "../components/QFFramingScreen";
import { QFResultScreen } from "../components/QFResultScreen";
import { EnhancedDialogue } from "@/components/game/EnhancedDialogue";
import type { QFQuestion } from "../data/qf-tree";

export const QFGameScreen = () => {
  const { state, finishIntro, chooseQuestion, finishResponse, currentNode } = useQF();
  const [introDialogueActive, setIntroDialogueActive] = useState(true);
  const [responseDialogueActive, setResponseDialogueActive] = useState(false);
  const [responseDialogue, setResponseDialogue] = useState<any[]>([]);

  // Result screen
  if (state.phase === "result") {
    return <QFResultScreen />;
  }

  // Framing screen
  if (state.phase === "framing") {
    return (
      <>
        <QFHud />
        <QFFramingScreen />
      </>
    );
  }

  // Intro phase
  if (state.phase === "intro" && currentNode) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedDialogue
          dialogues={currentNode.introDialogue}
          isActive={introDialogueActive}
          onComplete={() => {
            setIntroDialogueActive(false);
            finishIntro();
            setIntroDialogueActive(true);
          }}
        />
      </div>
    );
  }

  // Questioning phase
  if (state.phase === "questioning" && currentNode) {
    const handleChooseQuestion = (q: QFQuestion) => {
      chooseQuestion(q);
      setResponseDialogue(q.responseDialogue);
      setResponseDialogueActive(true);
    };

    const handleResponseComplete = () => {
      setResponseDialogueActive(false);
      setIntroDialogueActive(true); // Reset for next node's intro
      finishResponse();
    };

    // Show response dialogue
    if (responseDialogueActive && state.pendingQuestion) {
      return (
        <div className="min-h-screen bg-background">
          <QFHud />
          <EnhancedDialogue
            dialogues={responseDialogue}
            isActive={true}
            onComplete={handleResponseComplete}
          />
        </div>
      );
    }

    // Show intro dialogue for new node, then questions
    if (currentNode.introDialogue.length > 0 && introDialogueActive) {
      return (
        <div className="min-h-screen bg-background">
          <QFHud />
          <EnhancedDialogue
            dialogues={currentNode.introDialogue}
            isActive={true}
            onComplete={() => setIntroDialogueActive(false)}
          />
        </div>
      );
    }

    // Show question cards
    return (
      <div className="min-h-screen bg-background flex flex-col justify-end pb-8">
        <QFHud />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentNode.questions && (
              <QFQuestionCards questions={currentNode.questions} onChoose={handleChooseQuestion} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return null;
};
