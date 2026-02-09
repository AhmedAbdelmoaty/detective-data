import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Check } from "lucide-react";
import { AnimatedCharacter, type CharacterId } from "./AnimatedCharacter";

interface DialogueLine {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
}

interface EnhancedDialogueProps {
  dialogues: DialogueLine[];
  isActive: boolean;
  onComplete?: () => void;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onSaveNote?: (saveId: string, saveText: string) => void;
  savedNoteIds?: string[];
}

const characterColors: Record<string, { bg: string; border: string; name: string }> = {
  ahmed: { bg: "from-cyan-900/90 to-cyan-950/90", border: "border-cyan-500/50", name: "text-cyan-400" },
  sara: { bg: "from-purple-900/90 to-purple-950/90", border: "border-purple-500/50", name: "text-purple-400" },
  karim: { bg: "from-red-900/90 to-red-950/90", border: "border-red-500/50", name: "text-red-400" },
  detective: { bg: "from-amber-900/90 to-amber-950/90", border: "border-amber-500/50", name: "text-amber-400" },
  abuSaeed: { bg: "from-amber-900/90 to-amber-950/90", border: "border-amber-500/50", name: "text-amber-400" },
  khaled: { bg: "from-cyan-900/90 to-cyan-950/90", border: "border-cyan-500/50", name: "text-cyan-400" },
  noura: { bg: "from-purple-900/90 to-purple-950/90", border: "border-purple-500/50", name: "text-purple-400" },
  umFahd: { bg: "from-red-900/90 to-red-950/90", border: "border-red-500/50", name: "text-red-400" },
};

const characterNames: Record<string, { ar: string; en: string }> = {
  ahmed: { ar: "أحمد", en: "Ahmed" },
  sara: { ar: "سارة", en: "Sara" },
  karim: { ar: "كريم", en: "Karim" },
  detective: { ar: "المحقق", en: "Detective" },
  abuSaeed: { ar: "أبو سعيد", en: "Abu Saeed" },
  khaled: { ar: "خالد", en: "Khaled" },
  noura: { ar: "نورة", en: "Noura" },
  umFahd: { ar: "أم فهد", en: "Um Fahd" },
};

export const EnhancedDialogue = ({
  dialogues,
  isActive,
  onComplete,
  currentIndex: externalIndex,
  onIndexChange,
  onSaveNote,
  savedNoteIds = [],
}: EnhancedDialogueProps) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const currentIndex = externalIndex ?? internalIndex;
  const setCurrentIndex = onIndexChange ?? setInternalIndex;
  
  const currentDialogue = dialogues[currentIndex];
  const colors = characterColors[currentDialogue?.characterId || "detective"];
  const names = characterNames[currentDialogue?.characterId || "detective"];

  // Typing effect
  useEffect(() => {
    if (!isActive || !currentDialogue) return;

    setDisplayedText("");
    setIsTyping(true);
    setShowSaveButton(false);

    let charIndex = 0;
    const text = currentDialogue.text;

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        // Show save button after typing completes if saveable
        if (currentDialogue.isSaveable) {
          setShowSaveButton(true);
        }
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentIndex, isActive, currentDialogue]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      if (currentDialogue.isSaveable) {
        setShowSaveButton(true);
      }
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentDialogue.saveId && currentDialogue.saveText && onSaveNote) {
      onSaveNote(currentDialogue.saveId, currentDialogue.saveText);
    }
  };

  if (!isActive || !currentDialogue) return null;

  const isSaved = currentDialogue.saveId ? savedNoteIds.includes(currentDialogue.saveId) : false;
  // Map characterId to a valid CharacterId for AnimatedCharacter
  const validCharacterIds: CharacterId[] = ["ahmed", "sara", "karim", "detective", "abuSaeed", "khaled", "noura", "umFahd"];
  const animCharId = validCharacterIds.includes(currentDialogue.characterId as CharacterId)
    ? (currentDialogue.characterId as CharacterId)
    : "detective";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Character spotlight */}
        <motion.div
          className="flex justify-center mb-4"
          key={currentDialogue.characterId}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <AnimatedCharacter
            characterId={animCharId}
            size="lg"
            isActive
            isSpeaking={isTyping}
            mood={currentDialogue.mood || "neutral"}
            showName={false}
            entrance="bounce"
          />
        </motion.div>

        {/* Dialogue box */}
        <motion.div
          className={`mx-4 mb-4 rounded-xl border backdrop-blur-md cursor-pointer bg-gradient-to-r ${colors.bg} ${colors.border} p-6`}
          onClick={handleNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          layoutId="dialogue-box"
        >
          {/* Speaker name */}
          <motion.div
            className="flex items-center gap-3 mb-3"
            key={currentDialogue.characterId}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h4 className={`font-bold text-lg ${colors.name}`}>
              {names.ar}
            </h4>
            <span className="text-muted-foreground text-sm">
              ({names.en})
            </span>
          </motion.div>

          {/* Dialogue text */}
          <p className="text-foreground text-lg leading-relaxed" dir="rtl">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-3 h-5 bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>

          {/* Save to notebook button */}
          <AnimatePresence>
            {showSaveButton && onSaveNote && currentDialogue.isSaveable && (
              <motion.button
                className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isSaved
                    ? "bg-neon-green/20 border border-neon-green/50 text-neon-green cursor-default"
                    : "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
                }`}
                onClick={handleSave}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                disabled={isSaved}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                {isSaved ? "تم الحفظ في الدفتر" : "احفظ في الدفتر"}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Continue indicator */}
          <AnimatePresence>
            {!isTyping && (
              <motion.div
                className="flex items-center justify-between mt-4 pt-3 border-t border-border/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {dialogues.length}
                </span>
                <motion.span
                  className="text-sm text-primary flex items-center gap-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  اضغط للاستمرار
                  <span>▶</span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
