import { motion } from "framer-motion";
import { type QFQuestion } from "../data/qf-tree";
import { AnimatedCharacter } from "@/components/game/AnimatedCharacter";
import { cn } from "@/lib/utils";

interface QFQuestionCardsProps {
  questions: QFQuestion[];
  onChoose: (q: QFQuestion) => void;
  disabled?: boolean;
}

export const QFQuestionCards = ({ questions, onChoose, disabled = false }: QFQuestionCardsProps) => {
  return (
    <div className="px-4 pb-6 space-y-4" dir="rtl">
      <motion.div
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <AnimatedCharacter
            characterId="detective"
            size="sm"
            isActive
            isSpeaking={false}
            mood="neutral"
            showName={false}
          />
          <div>
            <p className="text-xs font-semibold text-primary mb-1">المحلل</p>
            <p className="text-sm text-foreground leading-relaxed">
              هختار السؤال اللي يوضح المشكلة خطوة خطوة — اختَر السؤال الأنسب.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-3">
        {questions.map((q, i) => (
          <motion.button
            key={q.id}
            onClick={() => {
              if (!disabled) onChoose(q);
            }}
            disabled={disabled}
            className={cn(
              "w-full p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-right transition-all",
              disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-primary/50 hover:bg-card/80"
            )}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * i, type: "spring", damping: 20 }}
            whileHover={disabled ? {} : { scale: 1.01, x: -3 }}
            whileTap={disabled ? {} : { scale: 0.99 }}
          >
            <p className="text-foreground leading-relaxed">{q.text}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
