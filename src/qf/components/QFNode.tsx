import { motion, AnimatePresence } from "framer-motion";
import { useQF } from "@/qf/context/QFContext";
import { QFQuestionCards } from "./QFQuestionCards";
import { QFBacktrackBtn } from "./QFBacktrackBtn";

const CHARACTER_EMOJI: Record<string, string> = {
  "abu-saeed": "👨‍🦳",
  noura: "👩",
  khaled: "👨",
};

const CHARACTER_NAME: Record<string, string> = {
  "abu-saeed": "أبو سعيد",
  noura: "نورة",
  khaled: "خالد",
};

export const QFNode = () => {
  const { currentNode, state, dismissResponse } = useQF();

  if (!currentNode || currentNode.isFraming) return null;

  const isResponding = state.phase === "responding";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4" dir="rtl">
      {/* Location badge */}
      <motion.div
        key={currentNode.id + "-loc"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full"
      >
        📍 {currentNode.location}
      </motion.div>

      {/* Character + Dialogue */}
      <motion.div
        key={currentNode.id + "-dialogue"}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full glass rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl shrink-0">
            {CHARACTER_EMOJI[currentNode.character]}
          </div>
          <div>
            <p className="text-primary font-bold text-lg mb-2">
              {CHARACTER_NAME[currentNode.character]}
            </p>
            <p className="text-foreground leading-relaxed text-base">
              {currentNode.dialogue}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Response overlay */}
      <AnimatePresence>
        {isResponding && state.lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full glass rounded-2xl p-6 border-primary/30"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl shrink-0">
                {CHARACTER_EMOJI[state.lastResponseCharacter || currentNode.character]}
              </div>
              <div className="flex-1">
                <p className="text-foreground leading-relaxed text-base mb-4">
                  {state.lastResponse}
                </p>
                <button
                  onClick={dismissResponse}
                  className="bg-primary/20 hover:bg-primary/30 text-primary px-5 py-2 rounded-lg transition-colors font-medium"
                >
                  متابعة ←
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto note notification */}
      <AnimatePresence>
        {currentNode.autoNote && state.notes.some(n => n.id === currentNode.autoNote?.id) && !isResponding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              currentNode.autoNote.isGolden
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            📝 ملاحظة جديدة: {currentNode.autoNote.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question cards */}
      {!isResponding && <QFQuestionCards />}

      {/* Backtrack */}
      {!isResponding && <QFBacktrackBtn />}
    </div>
  );
};
