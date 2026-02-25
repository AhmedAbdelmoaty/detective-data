import { motion } from "framer-motion";
import { useQF } from "@/qf/context/QFContext";
import { useNavigate } from "react-router-dom";
import { GOLDEN_PATH_STEPS, DECOMPOSITION_TREE, RECAP_LABELS } from "@/qf/data/qf-tree";

const DecompBranch = ({ branch, depth = 0 }: { branch: any; depth?: number }) => (
  <div className={`${depth > 0 ? "mr-6 border-r border-border/30 pr-4" : ""}`}>
    <div className={`flex items-center gap-2 py-1 text-sm ${branch.isCorrectPath ? "text-accent" : "text-muted-foreground"}`}>
      <span>{branch.isCorrectPath ? "✅" : "—"}</span>
      <span className="font-medium">{branch.question}</span>
      <span className="text-xs opacity-70">→ {branch.answer}</span>
    </div>
    {branch.children?.map((child: any, i: number) => (
      <DecompBranch key={i} branch={child} depth={depth + 1} />
    ))}
  </div>
);

export const QFResultScreen = () => {
  const { state, getEndingData, resetGame } = useQF();
  const navigate = useNavigate();
  const ending = getEndingData();

  if (state.phase !== "result" || !ending) return null;

  const isSuccess = ending.type === "success";
  const isTimeout = ending.type === "timeout";

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto px-4 pb-16 pt-20" dir="rtl">
      {/* Result icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-7xl"
      >
        {isSuccess ? "🎉" : isTimeout ? "⏱" : "😔"}
      </motion.div>

      {/* Part 1: Abu Saeed's response */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full glass rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">👨‍🦳</span>
          <div>
            <p className="text-primary font-bold text-lg mb-2">أبو سعيد</p>
            <p className="text-foreground leading-relaxed">{ending.response}</p>
          </div>
        </div>
      </motion.div>

      {/* Part 2: Recap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">📋 طريقك</h3>
        <div className="flex flex-col gap-3">
          {state.decisions.map((d, i) => {
            const recap = RECAP_LABELS[d.type];
            return (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`${d.type === "core" ? "text-accent" : d.type === "premature" ? "text-destructive" : "text-primary"}`}>
                  {d.type === "core" ? "✓" : "✗"}
                </span>
                <span className="text-foreground/80 flex-1">"{d.choiceText}"</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {recap.icon} {recap.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Part 3: Golden Path */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">🌟 الطريق الذهبي</h3>
        <div className="flex flex-col gap-3">
          {GOLDEN_PATH_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <span className="font-bold text-accent">{step.label}</span>
                <span className="text-foreground/80 mr-2"> — {step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Part 4: Decomposition Board */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full glass rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">🌳 لوحة التكسير</h3>
        <p className="text-accent font-bold mb-3">"{DECOMPOSITION_TREE.root}"</p>
        {DECOMPOSITION_TREE.branches.map((branch, i) => (
          <DecompBranch key={i} branch={branch} />
        ))}
      </motion.div>

      {/* Educational Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className={`w-full rounded-2xl p-6 border ${
          isSuccess
            ? "bg-success/10 border-success/30"
            : isTimeout
              ? "bg-destructive/10 border-destructive/30"
              : "bg-accent/10 border-accent/30"
        }`}
      >
        <h3 className="text-lg font-bold text-foreground mb-3">💡 الدرس المستفاد</h3>
        <p className="text-foreground/90 leading-relaxed">{ending.tip}</p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="flex gap-4"
      >
        <button
          onClick={() => { resetGame(); }}
          className="bg-primary/20 hover:bg-primary/30 text-primary px-6 py-3 rounded-xl transition-colors font-medium"
        >
          🔄 العب تاني
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-xl transition-colors font-medium"
        >
          ← عودة لاختيار القضايا
        </button>
      </motion.div>
    </div>
  );
};
