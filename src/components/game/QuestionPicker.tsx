import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, AlertTriangle, Search, CheckCircle } from "lucide-react";
import type { QuestionOption } from "@/data/case1";

interface QuestionPickerProps {
  options: QuestionOption[];
  onSelect: (option: QuestionOption) => void;
  disabled?: boolean;
}

const typeConfig = {
  decomposition: {
    icon: Search,
    label: "تكسير",
    selectedBg: "bg-emerald-500/20 border-emerald-500/60 ring-2 ring-emerald-500/30",
  },
  scope: {
    icon: HelpCircle,
    label: "نطاق",
    selectedBg: "bg-blue-500/20 border-blue-500/60 ring-2 ring-blue-500/30",
  },
  premature: {
    icon: AlertTriangle,
    label: "فرضية مبكرة",
    selectedBg: "bg-red-500/20 border-red-500/60 ring-2 ring-red-500/30",
  },
};

export const QuestionPicker = ({ options, onSelect, disabled }: QuestionPickerProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  // Shuffle options once on mount
  const shuffled = useMemo(() => {
    const arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [options]);

  const handleSelect = (option: QuestionOption) => {
    if (selected || disabled) return;
    setSelected(option.id);
    // Small delay for visual feedback before triggering response
    setTimeout(() => onSelect(option), 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center pb-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold">
            <HelpCircle className="w-4 h-4" />
            إيه السؤال اللي هتسأله؟
          </span>
        </motion.div>

        {/* Question cards */}
        <div className="flex flex-col gap-3">
          {shuffled.map((option, i) => {
            const isSelected = selected === option.id;
            const isOther = selected && !isSelected;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={!!selected || disabled}
                className={`
                  p-4 rounded-xl border text-right transition-all relative overflow-hidden
                  ${isSelected
                    ? typeConfig[option.type].selectedBg
                    : isOther
                      ? "bg-muted/20 border-border/30 opacity-40 scale-95"
                      : "bg-card/80 backdrop-blur-md border-border/50 hover:border-primary/50 hover:bg-card/90"
                  }
                `}
                initial={{ x: 50, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: isOther ? 0.4 : 1,
                  scale: isOther ? 0.95 : 1,
                }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={!selected ? { scale: 1.02, x: -4 } : {}}
                whileTap={!selected ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5
                    ${isSelected ? "bg-white/20" : "bg-secondary"}
                  `}>
                    {isSelected ? (
                      <CheckCircle className="w-4 h-4 text-foreground" />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{option.text}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
