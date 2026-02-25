import { useQF } from "@/qf/context/QFContext";
import { motion } from "framer-motion";

export const QFHud = () => {
  const { state, isTimeCritical } = useQF();
  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-2xl glass border transition-all duration-500 ${
        isTimeCritical ? "border-destructive/70 shadow-[0_0_30px_hsl(0,70%,50%,0.3)]" : "border-border/50"
      }`}
      dir="rtl"
    >
      {/* Timer */}
      <div className={`flex items-center gap-2 font-mono text-xl font-bold ${
        isTimeCritical ? "text-destructive animate-pulse" : "text-foreground"
      }`}>
        <span>⏱</span>
        <span>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border/50" />

      {/* Notes counter */}
      <div className="flex items-center gap-2 text-foreground">
        <span>📝</span>
        <span className="font-medium">ملاحظات: {state.notes.length}</span>
      </div>
    </motion.div>
  );
};
