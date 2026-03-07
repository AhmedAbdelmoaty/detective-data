import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface HypothesisSelectScreenProps {
  onComplete: () => void;
}

export const HypothesisSelectScreen = ({ onComplete }: HypothesisSelectScreenProps) => {
  const { state, advancePhase } = useGame();

  const handleStart = () => {
    if (state.selectedHypotheses.length >= 3) {
      // Keep the existing phase progression (unlocks dashboards)
      advancePhase(); // 0 -> 1
      advancePhase(); // 1 -> 2 (unlocks D1+D2)
      onComplete();
    }
  };

  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div className="text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">الفرضيات المتبقية بعد المقابلة</h1>
          <p className="text-muted-foreground text-sm">دي مجموعة الفرضيات اللي لسه واقفة بعد أسئلتك. هتدخل التحليل بيها.</p>
          <div className={cn("inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold",
            state.selectedHypotheses.length >= 3 ? "bg-neon-green/20 text-neon-green" : "bg-primary/20 text-primary"
          )}>
            {state.selectedHypotheses.length || 0} فرضيات
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id)).map((h, i) => (
            <motion.div
              key={h.id}
              className="p-4 rounded-xl border text-right bg-primary/10 border-primary/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-primary text-primary-foreground">
                  {h.id}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{h.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {state.selectedHypotheses.length >= 3 && (
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl font-bold text-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 ابدأ التحليل
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
