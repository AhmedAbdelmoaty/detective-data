import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Trophy } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { 
  CASE_INFO, 
  SALES_LEADERBOARD, 
  SALES_MANAGER_DIALOGUES 
} from "@/data/newCase";
import { InteractiveRoom, Hotspot } from "../InteractiveRoom";
import { EnhancedDialogue, DialogueLine } from "../EnhancedDialogue";
import evidenceBackground from "@/assets/rooms/evidence-room.png";

interface SalesDepartmentScreenProps {
  onNavigate: (screen: string) => void;
}

export const SalesDepartmentScreen = ({ onNavigate }: SalesDepartmentScreenProps) => {
  const { state, collectEvidence, hasCollectedEvidence, addNote } = useGame();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialoguePhase, setDialoguePhase] = useState<"intro" | "defensive" | "leaderboard">("intro");
  const [hasSpokenToManager, setHasSpokenToManager] = useState(false);

  const hotspots: Hotspot[] = [
    { id: "manager", x: 35, y: 45, label: "مدير المبيعات", icon: "👔" },
    { id: "leaderboard", x: 65, y: 40, label: "لوحة الأداء", icon: "🏆" },
  ];

  const handleHotspotClick = (id: string) => {
    if (id === "manager") {
      if (!hasSpokenToManager) {
        setDialoguePhase("intro");
      } else {
        setDialoguePhase("defensive");
      }
      setShowDialogue(true);
    } else if (id === "leaderboard") {
      setActivePanel("leaderboard");
    }
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    if (dialoguePhase === "intro") {
      setHasSpokenToManager(true);
    }
  };

  const handleCollectLeaderboard = () => {
    collectEvidence("sales-leaderboard");
    addNote("تم جمع: لوحة أداء المبيعات - محمد علي في المركز الأول بـ 18 صفقة");
  };

  const getCurrentDialogues = (): DialogueLine[] => {
    let dialogues = [];
    switch (dialoguePhase) {
      case "intro":
        dialogues = SALES_MANAGER_DIALOGUES.intro;
        break;
      case "defensive":
        dialogues = SALES_MANAGER_DIALOGUES.defensive;
        break;
      case "leaderboard":
        dialogues = SALES_MANAGER_DIALOGUES.leaderboard;
        break;
    }
    return dialogues.map(d => ({
      characterId: "salesManager" as const,
      text: d.text,
      mood: "neutral" as const
    }));
  };

  return (
    <div className="relative min-h-screen">
      <InteractiveRoom
        backgroundImage={evidenceBackground}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        roomName="قسم المبيعات"
      >
        {/* Navigation */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <motion.button
            onClick={() => onNavigate("intro")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            الرئيسية
          </motion.button>
        </div>

        {/* Case Info */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-2 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30">
            <p className="text-sm text-primary font-bold">{CASE_INFO.title}</p>
            <p className="text-xs text-muted-foreground">{CASE_INFO.company}</p>
          </div>
        </div>

        {/* Room Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <motion.button
            onClick={() => onNavigate("cfo-office")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>👔</span>
            مكتب CFO
          </motion.button>
          <motion.button
            onClick={() => onNavigate("my-desk")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🖥️</span>
            مكتبي
          </motion.button>
          <motion.button
            onClick={() => onNavigate("contracts")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📁</span>
            أرشيف العقود
          </motion.button>
        </div>
      </InteractiveRoom>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {activePanel === "leaderboard" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              className="w-full max-w-lg bg-card rounded-2xl border border-border p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-gold" />
                  <h2 className="text-2xl font-bold text-foreground">لوحة أداء المبيعات</h2>
                </div>
                <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                ترتيب المندوبين حسب عدد الصفقات - آخر 6 أسابيع
              </p>

              <div className="space-y-4">
                {SALES_LEADERBOARD.map((person, index) => (
                  <motion.div
                    key={person.name}
                    className={`p-4 rounded-xl border ${
                      index === 0 
                        ? "bg-gold/10 border-gold/30" 
                        : "bg-muted/30 border-border"
                    }`}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${
                          index === 0 ? "bg-gold text-black" : "bg-muted text-foreground"
                        }`}>
                          {person.rank}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.department}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold text-foreground">{person.deals}</p>
                        <p className="text-xs text-muted-foreground">صفقة</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-sm ${index === 0 ? "text-gold" : "text-muted-foreground"}`}>
                        {person.title}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={handleCollectLeaderboard}
                disabled={hasCollectedEvidence("sales-leaderboard")}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-colors ${
                  hasCollectedEvidence("sales-leaderboard")
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                whileHover={!hasCollectedEvidence("sales-leaderboard") ? { scale: 1.02 } : {}}
                whileTap={!hasCollectedEvidence("sales-leaderboard") ? { scale: 0.98 } : {}}
              >
                {hasCollectedEvidence("sales-leaderboard") ? "✓ تم جمع الدليل" : "جمع الدليل"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue */}
      <AnimatePresence>
        {showDialogue && (
          <EnhancedDialogue
            dialogues={getCurrentDialogues()}
            isActive={showDialogue}
            onComplete={handleDialogueComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
