import { motion } from "framer-motion";
import { Clock, FileText, Home, RotateCcw } from "lucide-react";
import { useQF } from "../context/QFContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const QFHud = () => {
  const { state, resetGame } = useQF();
  const navigate = useNavigate();

  const minutes = Math.floor(state.timeBudget / 60);
  const seconds = state.timeBudget % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isLow = state.timeBudget <= 120;

  const handleReset = () => {
    if (window.confirm("متأكد إنك عايز تبدأ من الأول؟")) {
      resetGame();
    }
  };

  const handleBackToCases = () => {
    if (window.confirm("هترجع لاختيار القضايا وهتسيب التقدم الحالي. تكمل؟")) {
      navigate("/");
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex items-start justify-between gap-2" dir="rtl">
      <motion.div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md",
          isLow
            ? "bg-destructive/20 border-destructive/50 text-destructive"
            : "bg-card/75 border-border text-foreground"
        )}
        animate={isLow ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <Clock className="w-4 h-4" />
        <span className="font-mono font-bold text-lg">{timeStr}</span>
      </motion.div>

      <div className="flex items-center gap-2">
        <motion.button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/75 backdrop-blur-md text-foreground text-sm font-semibold hover:border-primary/50 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          إعادة
        </motion.button>

        <motion.button
          onClick={handleBackToCases}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card/75 backdrop-blur-md text-foreground text-sm font-semibold hover:border-primary/50 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home className="w-4 h-4" />
          القضايا
        </motion.button>

        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/75 backdrop-blur-md"
          key={state.notes.length}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.25 }}
        >
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">{state.notes.length}</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">ملاحظات</span>
        </motion.div>
      </div>
    </div>
  );
};
