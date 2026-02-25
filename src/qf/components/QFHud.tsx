import { useQF } from "@/qf/context/QFContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Settings, RotateCcw, Home } from "lucide-react";

export const QFHud = () => {
  const { state, isTimeCritical, resetGame } = useQF();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const minutes = Math.floor(state.timeRemaining / 60);
  const seconds = state.timeRemaining % 60;

  const handleRestart = () => {
    if (window.confirm("هل أنت متأكد إنك عايز تبدأ من الأول؟ كل التقدم هيتمسح.")) {
      resetGame();
    }
  };

  const handleBackToSelector = () => {
    if (window.confirm("هل أنت متأكد إنك عايز ترجع لشاشة اختيار القضايا؟ التقدم الحالي هيتحفظ.")) {
      navigate("/");
    }
  };

  return (
    <>
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

        <div className="w-px h-6 bg-border/50" />

        {/* Notes counter */}
        <div className="flex items-center gap-2 text-foreground">
          <span>📝</span>
          <span className="font-medium">ملاحظات: {state.notes.length}</span>
        </div>
      </motion.div>

      {/* Settings button - top right */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-4 h-4" />
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="absolute top-12 right-0 w-52 p-3 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              dir="rtl"
            >
              <motion.button
                className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted transition-colors text-sm text-foreground"
                onClick={handleBackToSelector}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="w-4 h-4" />
                اختيار القضايا
              </motion.button>
              <motion.button
                className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm"
                onClick={handleRestart}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                ابدأ من جديد
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
