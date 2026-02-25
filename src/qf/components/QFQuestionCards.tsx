import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQF } from "@/qf/context/QFContext";
import type { QFChoice } from "@/qf/data/qf-tree";

export const QFQuestionCards = () => {
  const { availableChoices, selectChoice, state } = useQF();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Shuffle once per node
  const shuffled = useMemo(() => {
    const arr = [...availableChoices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [state.currentNodeId, availableChoices.length]);

  useEffect(() => { setSelectedId(null); }, [state.currentNodeId]);

  if (state.phase !== "playing" || shuffled.length === 0) return null;

  const handleSelect = (choice: QFChoice) => {
    setSelectedId(choice.id);
    // Small delay for animation
    setTimeout(() => selectChoice(choice.id), 400);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto" dir="rtl">
      <AnimatePresence mode="popLayout">
        {shuffled.map((choice, i) => {
          const isSelected = selectedId === choice.id;
          const isOther = selectedId !== null && !isSelected;
          return (
            <motion.button
              key={choice.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isOther ? 0 : 1,
                y: 0,
                scale: isSelected ? 1.02 : 1,
                x: isOther ? (i % 2 === 0 ? -200 : 200) : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, delay: isOther ? 0 : i * 0.08 }}
              onClick={() => !selectedId && handleSelect(choice)}
              disabled={!!selectedId}
              className={`
                w-full text-right p-5 rounded-xl border transition-all duration-300
                ${isSelected
                  ? "border-primary/70 bg-primary/10 glow-primary"
                  : "border-border/50 bg-card/60 hover:border-primary/30 hover:bg-card/80"
                }
                ${selectedId && !isSelected ? "pointer-events-none" : "cursor-pointer"}
              `}
            >
              <p className="text-foreground leading-relaxed text-base font-medium">{choice.text}</p>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
