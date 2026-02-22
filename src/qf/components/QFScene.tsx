import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp } from "lucide-react";
import { useQF } from "../context/QFContext";
import { qfScenes, shuffleArray, type QFChoice } from "../data/qfCaseData";

export const QFScene = () => {
  const { state, makeChoice, advanceScene } = useQF();
  const scene = qfScenes[state.currentScene];
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionText, setReactionText] = useState("");

  // Shuffle choices once per scene
  const shuffledChoices = useMemo(
    () => shuffleArray(scene?.choices || []),
    [scene?.id],
  );

  // Reset on scene change
  useEffect(() => {
    setDialogueIndex(0);
    setDisplayedText("");
    setIsTyping(true);
    setShowChoices(false);
    setSelectedChoice(null);
    setShowReaction(false);
  }, [state.currentScene]);

  // Typing effect
  useEffect(() => {
    if (!scene) return;
    const dialogue = scene.dialogues[dialogueIndex];
    if (!dialogue) return;

    setDisplayedText("");
    setIsTyping(true);

    let idx = 0;
    const text = dialogue.text;
    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayedText(text.slice(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [dialogueIndex, state.currentScene, scene]);

  if (!scene) return null;

  const currentDialogue = scene.dialogues[dialogueIndex];
  const isDetective = currentDialogue?.characterId === "detective";

  const handleDialogueClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }
    if (dialogueIndex < scene.dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // If scene 6 (closing), handled by parent
      if (scene.index === 6) {
        advanceScene();
      } else {
        setShowChoices(true);
      }
    }
  };

  const handleChoiceSelect = (choice: QFChoice) => {
    if (selectedChoice) return;
    setSelectedChoice(choice.id);
    makeChoice(
      scene.id,
      choice.id,
      choice.timeCost,
      choice.trustChange,
      choice.clarityChange,
      choice.boardUpdates,
      choice.flagJumpedToSolution,
    );
    setReactionText(choice.reaction);
    setTimeout(() => setShowReaction(true), 400);
  };

  const handleReactionDone = () => {
    setShowReaction(false);
    setTimeout(() => advanceScene(), 300);
  };

  const characterNames: Record<string, string> = {
    abuSaeed: "أبو سعيد",
    detective: "أنت (المحلل)",
    noura: "نورة",
    khaled: "خالد",
  };

  return (
    <div className="fixed inset-0 z-10">
      {/* Background */}
      <motion.div
        key={scene.id}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${scene.backgroundImage})` }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Location title */}
      <motion.div
        className="absolute top-16 right-4 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        dir="rtl"
      >
        <div className="glass rounded-xl px-4 py-2">
          <p className="text-xs text-muted-foreground">{scene.title}</p>
          <p className="text-sm font-bold text-foreground">{scene.locationTitle}</p>
        </div>
      </motion.div>

      {/* Dialogue box */}
      <AnimatePresence>
        {!showChoices && !showReaction && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 z-20 cursor-pointer"
            onClick={handleDialogueClick}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            dir="rtl"
          >
            <div className={`rounded-xl border backdrop-blur-md p-5 ${
              isDetective
                ? "bg-gradient-to-r from-amber-900/80 to-amber-950/80 border-amber-500/40"
                : "bg-gradient-to-r from-teal-900/80 to-teal-950/80 border-teal-500/40"
            }`}>
              <p className={`text-sm font-bold mb-2 ${isDetective ? "text-amber-400" : "text-teal-400"}`}>
                {characterNames[currentDialogue?.characterId || "detective"] || currentDialogue?.characterId}
              </p>
              <p className="text-foreground text-base leading-relaxed">
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-primary mr-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
              {!isTyping && (
                <motion.p
                  className="text-xs text-primary mt-3 flex items-center gap-1"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  اضغط للاستمرار ◀
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choices */}
      <AnimatePresence>
        {showChoices && !showReaction && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 z-20 space-y-2"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            dir="rtl"
          >
            <p className="text-sm text-primary font-bold mb-3 text-center">اختر سؤالك:</p>
            {shuffledChoices.map((choice, i) => (
              <motion.button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                className={`w-full text-right rounded-xl border backdrop-blur-md p-4 transition-all
                  ${selectedChoice === choice.id
                    ? "bg-primary/20 border-primary glow-primary"
                    : selectedChoice
                      ? "opacity-40 bg-card/60 border-border/30"
                      : "bg-card/80 border-border/50 hover:border-primary/50 hover:bg-card"
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                disabled={!!selectedChoice}
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm text-foreground leading-relaxed flex-1">{choice.text}</span>
                  <AnimatePresence>
                    {selectedChoice === choice.id && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex-shrink-0"
                      >
                        <Stamp className="w-6 h-6 text-primary" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reaction */}
      <AnimatePresence>
        {showReaction && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 z-20 cursor-pointer"
            onClick={handleReactionDone}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            dir="rtl"
          >
            <div className="rounded-xl border bg-gradient-to-r from-teal-900/80 to-teal-950/80 border-teal-500/40 backdrop-blur-md p-5">
              <p className="text-sm font-bold mb-2 text-teal-400">أبو سعيد</p>
              <p className="text-foreground text-base leading-relaxed">{reactionText}</p>
              <motion.p
                className="text-xs text-primary mt-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                اضغط للمتابعة ◀
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
