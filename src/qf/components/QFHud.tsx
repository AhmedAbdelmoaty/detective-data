import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import { useQF } from "../context/QFContext";
import { cn } from "@/lib/utils";

export const QFHud = () => {
  const { state } = useQF();

  const minutes = Math.floor(state.timeBudget / 60);
  const seconds = state.timeBudget % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isLow = state.timeBudget <= 120;

  return (
    <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-start pointer-events-none" dir="rtl">
      {/* Timer */}
      <motion.div
        className={cn(
          "pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md",
          isLow
            ? "bg-destructive/20 border-destructive/50 text-destructive"
            : "bg-card/70 border-border text-foreground"
        )}
        animate={isLow ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Clock className="w-4 h-4" />
        <span className="font-mono font-bold text-lg">{timeStr}</span>
      </motion.div>

      {/* Notes counter */}
      <motion.div
        className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-xl border bg-card/70 border-border backdrop-blur-md"
        key={state.notes.length}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        <FileText className="w-4 h-4 text-primary" />
        <span className="font-bold">{state.notes.length}</span>
        <span className="text-sm text-muted-foreground">ملاحظات</span>
      </motion.div>
    </div>
  );
};
