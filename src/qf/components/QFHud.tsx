import { motion } from "framer-motion";
import { Clock, Heart, Eye, Undo2 } from "lucide-react";
import { useQF } from "../context/QFContext";

export const QFHud = () => {
  const { state, backtrack } = useQF();
  const { timeRemaining, trust, clarity } = state;

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  const timeColor = timeRemaining <= 120 ? "text-destructive" : timeRemaining <= 300 ? "text-warning" : "text-primary";

  // Clarity visual state
  const clarityLabel = clarity >= 70 ? "مرتّب" : clarity >= 40 ? "متوسط" : "مبعثر";
  const clarityColor = clarity >= 70 ? "bg-[hsl(var(--success))]" : clarity >= 40 ? "bg-[hsl(var(--warning))]" : "bg-[hsl(var(--destructive))]";

  const canBacktrack = state.history.length > 0 && timeRemaining > 45;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50 px-4 py-2"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      dir="rtl"
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto gap-3">
        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${timeColor}`} />
          <span className={`font-mono font-bold text-sm ${timeColor}`}>{timeStr}</span>
        </div>

        {/* Trust */}
        <div className="flex items-center gap-2 flex-1 max-w-[140px]">
          <Heart className="w-4 h-4 text-[hsl(var(--destructive))]" />
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[hsl(var(--destructive))]"
              animate={{ width: `${trust}%` }}
              transition={{ type: "spring", damping: 15 }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{trust}</span>
        </div>

        {/* Clarity */}
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${clarityColor}`} />
            <span className="text-xs text-muted-foreground">{clarityLabel}</span>
          </div>
        </div>

        {/* Backtrack */}
        <button
          onClick={backtrack}
          disabled={!canBacktrack}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs border border-border/50 bg-secondary/50 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>ارجع خطوة</span>
        </button>
      </div>
    </motion.div>
  );
};
