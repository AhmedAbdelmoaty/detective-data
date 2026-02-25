import { useQF } from "@/qf/context/QFContext";
import { motion } from "framer-motion";

export const QFBacktrackBtn = () => {
  const { canBacktrack, backtrack } = useQF();
  const allowed = canBacktrack();

  if (!allowed) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      whileHover={{ opacity: 1 }}
      onClick={backtrack}
      className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
      dir="rtl"
    >
      ⏪ ارجع خطوة <span className="text-xs opacity-60">(-130 ثانية)</span>
    </motion.button>
  );
};
