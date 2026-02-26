import { motion } from "framer-motion";
import { useQF } from "../context/QFContext";
import { QF_ENDINGS, GOLDEN_PATH, DECOMPOSITION_TREE, QF_FRAMINGS } from "../data/qf-tree";
import { CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EnhancedDialogue } from "@/components/game/EnhancedDialogue";

export const QFResultScreen = () => {
  const { state, resetGame } = useQF();
  const navigate = useNavigate();
  const [dialogueDone, setDialogueDone] = useState(false);

  const isWin = state.resultType === "win";
  const ending = state.resultType === "win"
    ? QF_ENDINGS.win
    : state.resultType === "loseTime"
      ? QF_ENDINGS.loseTime
      : QF_ENDINGS.loseFraming;

  const chosenFramingText = QF_FRAMINGS.find((f) => f.id === state.chosenFraming)?.text;

  if (!dialogueDone) {
    return (
      <div className="min-h-screen bg-background">
        <EnhancedDialogue
          dialogues={ending.abuSaeedReply}
          isActive={true}
          onComplete={() => setDialogueDone(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen relative overflow-auto")} dir="rtl">
      <div className={cn(
        "absolute inset-0",
        isWin
          ? "bg-gradient-to-b from-green-950/60 to-background"
          : "bg-gradient-to-b from-red-950/60 to-background"
      )} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="text-6xl mb-3">{isWin ? "🏆" : "📉"}</div>
          <h1 className={cn("text-3xl font-bold mb-2", isWin ? "text-green-400" : "text-red-400")}>
            {isWin ? "أحسنت! تحليل ممتاز" : state.resultType === "loseTime" ? "الوقت خلص" : "تأطير غلط"}
          </h1>
        </motion.div>

        {/* What you chose */}
        {state.chosenFraming && (
          <motion.div
            className="p-4 rounded-xl bg-card/50 border border-border mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-1">اختيارك:</p>
            <p className="text-foreground">{chosenFramingText}</p>
          </motion.div>
        )}

        {/* Your path recap */}
        <motion.div
          className="p-5 rounded-xl bg-card/50 border border-border mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-foreground mb-3">طريقك:</h3>
          <div className="space-y-2">
            {state.history.map((h, i) => (
              <motion.div
                key={h.questionId}
                className="flex items-start gap-3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {h.type === "correct" ? (
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="text-foreground text-sm">{h.recapLabel || h.questionText}</span>
                  <span className="text-xs text-muted-foreground mr-2">
                    {h.recapIcon} {h.type === "correct" ? "سؤال منهجي" : h.type === "less-wrong" ? "سؤال مقبول" : "قفز لاستنتاج"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Golden path */}
        <motion.div
          className="p-5 rounded-xl bg-accent/10 border border-accent/30 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-accent mb-3">الطريق الذهبي:</h3>
          <div className="space-y-2">
            {GOLDEN_PATH.map((g, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{g.icon}</span>
                <div>
                  <span className="text-foreground text-sm font-bold">{g.label}</span>
                  <span className="text-xs text-muted-foreground mr-2">← {g.step}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decomposition tree */}
        <motion.div
          className="p-5 rounded-xl bg-card/50 border border-border mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-bold text-foreground mb-3">شجرة التكسير:</h3>
          <div className="font-mono text-sm space-y-1 text-muted-foreground">
            <p className="text-foreground font-bold">"{DECOMPOSITION_TREE.root}"</p>
            {DECOMPOSITION_TREE.branches.map((b, i) => (
              <div key={i} className="mr-4">
                <p className={b.isCorrectPath ? "text-primary" : ""}>
                  ├── {b.label} → {b.result}
                </p>
                {b.children?.map((c, j) => (
                  <div key={j} className="mr-8">
                    <p className="text-primary">└── {c.label}</p>
                    {c.children?.map((d, k) => (
                      <div key={k} className="mr-12">
                        <p className="text-primary">└── {d.label}</p>
                        {d.children?.map((e, l) => (
                          <p key={l} className="mr-16 text-accent font-bold">└── {e.label}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={() => { resetGame(); }}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw className="w-5 h-5" />
            العب تاني
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-secondary text-foreground font-bold border border-border"
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-5 h-5" />
            القائمة الرئيسية
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
