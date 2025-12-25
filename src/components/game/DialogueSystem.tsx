import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSoundEffects";

interface DialogueLine {
  speaker: string;
  text: string;
  speakerImage?: string;
  speakerEmoji?: string;
  position: "left" | "right";
  color?: "cyan" | "gold" | "purple" | "green" | "red";
}

interface DialogueSystemProps {
  dialogues: DialogueLine[];
  isActive: boolean;
  onComplete?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

const colorClasses = {
  cyan: {
    bg: "from-cyan-900/90 to-cyan-950/90",
    border: "border-cyan-500/50",
    name: "text-cyan-400",
  },
  gold: {
    bg: "from-amber-900/90 to-amber-950/90",
    border: "border-amber-500/50",
    name: "text-amber-400",
  },
  purple: {
    bg: "from-purple-900/90 to-purple-950/90",
    border: "border-purple-500/50",
    name: "text-purple-400",
  },
  green: {
    bg: "from-emerald-900/90 to-emerald-950/90",
    border: "border-emerald-500/50",
    name: "text-emerald-400",
  },
  red: {
    bg: "from-red-900/90 to-red-950/90",
    border: "border-red-500/50",
    name: "text-red-400",
  },
};

export const DialogueSystem = ({
  dialogues,
  isActive,
  onComplete,
  autoAdvance = false,
  autoAdvanceDelay = 3000,
}: DialogueSystemProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const { playSound, playDialogueTyping } = useSound();
  const typingSoundRef = useRef<NodeJS.Timeout | null>(null);

  const currentDialogue = dialogues[currentIndex];
  const colors = colorClasses[currentDialogue?.color || "cyan"];

  // Typing effect with sound
  useEffect(() => {
    if (!isActive || !currentDialogue) return;

    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const text = currentDialogue.text;
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        
        // Play typing sound every 3 characters
        if (charIndex % 3 === 0) {
          playDialogueTyping();
        }
        
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => {
      clearInterval(typingInterval);
      if (typingSoundRef.current) {
        clearInterval(typingSoundRef.current);
      }
    };
  }, [currentIndex, isActive, currentDialogue, playDialogueTyping]);

  // Auto advance
  useEffect(() => {
    if (!autoAdvance || isTyping || !isActive) return;

    const timeout = setTimeout(() => {
      handleNext();
    }, autoAdvanceDelay);

    return () => clearTimeout(timeout);
  }, [isTyping, autoAdvance, autoAdvanceDelay, isActive]);

  const handleNext = () => {
    playSound("click");
    
    if (isTyping) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      playSound("reveal");
    } else {
      playSound("success");
      onComplete?.();
    }
  };

  if (!isActive || !currentDialogue) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        <motion.div
          className={`
            relative max-w-4xl mx-auto rounded-xl border backdrop-blur-md
            bg-gradient-to-r ${colors.bg} ${colors.border}
            p-4 cursor-pointer
          `}
          onClick={handleNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          layoutId="dialogue-box"
        >
          <div className="flex items-start gap-4">
            {/* Speaker Avatar */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              key={currentDialogue.speaker}
            >
              {currentDialogue.speakerImage ? (
                <img
                  src={currentDialogue.speakerImage}
                  alt={currentDialogue.speaker}
                  className="w-16 h-16 rounded-full border-2 border-primary/50 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-3xl">
                  {currentDialogue.speakerEmoji || "🕵️"}
                </div>
              )}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Speaker name */}
              <motion.h4
                className={`font-bold mb-1 ${colors.name}`}
                key={currentDialogue.speaker}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                {currentDialogue.speaker}
              </motion.h4>

              {/* Dialogue text */}
              <p className="text-foreground leading-relaxed">
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-primary ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
            </div>
          </div>

          {/* Continue indicator */}
          {!isTyping && (
            <motion.div
              className="absolute bottom-2 right-4 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              اضغط للاستمرار ▶
            </motion.div>
          )}

          {/* Progress dots */}
          <div className="absolute top-2 right-4 flex gap-1">
            {dialogues.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex
                    ? "bg-primary"
                    : i < currentIndex
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
