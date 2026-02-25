import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQF } from "@/qf/context/QFContext";
import { FRAMING_OPTIONS } from "@/qf/data/qf-tree";

export const QFFramingScreen = () => {
  const { state, selectFraming } = useQF();
  const [selected, setSelected] = useState<string | null>(null);

  // Shuffle framing options once
  const shuffled = useMemo(() => {
    const arr = [...FRAMING_OPTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  if (state.phase !== "framing") return null;

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => selectFraming(id), 600);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto px-4 pb-12" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold font-display text-foreground mb-2">شاشة التأطير</h2>
        <p className="text-muted-foreground">بناءً على كل اللي شفته وسمعته — إيه تشخيصك للمشكلة؟</p>
      </motion.div>

      {/* Notes collected */}
      {state.notes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full glass rounded-xl p-4"
        >
          <p className="text-sm text-muted-foreground mb-3 font-medium">📝 ملاحظاتك:</p>
          <div className="flex flex-col gap-2">
            {state.notes.map(note => (
              <div
                key={note.id}
                className={`text-sm px-3 py-2 rounded-lg ${
                  note.isGolden
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "bg-secondary/50 text-foreground/80"
                }`}
              >
                {note.isGolden ? "🥇 " : "• "}{note.text}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Framing options */}
      <div className="flex flex-col gap-4 w-full">
        {shuffled.map((option, i) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            onClick={() => !selected && handleSelect(option.id)}
            disabled={!!selected}
            className={`
              w-full text-right p-6 rounded-xl border transition-all duration-300
              ${selected === option.id
                ? "border-primary/70 bg-primary/10 glow-primary scale-[1.01]"
                : selected
                  ? "opacity-40 pointer-events-none border-border/30 bg-card/40"
                  : "border-border/50 bg-card/60 hover:border-primary/30 hover:bg-card/80 cursor-pointer"
              }
            `}
          >
            <p className="text-foreground leading-relaxed">{option.text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
