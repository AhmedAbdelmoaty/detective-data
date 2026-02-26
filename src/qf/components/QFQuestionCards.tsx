import { motion } from "framer-motion";
import { type QFQuestion } from "../data/qf-tree";

interface QFQuestionCardsProps {
  questions: QFQuestion[];
  onChoose: (q: QFQuestion) => void;
}

export const QFQuestionCards = ({ questions, onChoose }: QFQuestionCardsProps) => {
  // Shuffle display order but keep the same questions
  return (
    <div className="px-4 pb-6 space-y-3" dir="rtl">
      <p className="text-sm text-muted-foreground text-center mb-4">اختر سؤالك:</p>
      {questions.map((q, i) => (
        <motion.button
          key={q.id}
          onClick={() => onChoose(q)}
          className="w-full p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-right hover:border-primary/50 hover:bg-card/80 transition-all"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 * i, type: "spring", damping: 20 }}
          whileHover={{ scale: 1.02, x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <p className="text-foreground leading-relaxed">{q.text}</p>
        </motion.button>
      ))}
    </div>
  );
};

