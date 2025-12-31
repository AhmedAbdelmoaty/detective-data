import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, TrendingDown, ClipboardList, ArrowLeft, Database } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { 
  CASE_INFO, 
  WEEKLY_PROFITS, 
  WEEKLY_CONTRACTS, 
  CFO_DIALOGUES 
} from "@/data/newCase";
import { InteractiveRoom, Hotspot } from "../InteractiveRoom";
import { EnhancedDialogue, DialogueLine } from "../EnhancedDialogue";
import officeBackground from "@/assets/rooms/detective-office.png";

interface CFOOfficeScreenProps {
  onNavigate: (screen: string) => void;
}

export const CFOOfficeScreen = ({ onNavigate }: CFOOfficeScreenProps) => {
  const { state, collectEvidence, hasCollectedEvidence, requestDataset, addNote } = useGame();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(!state.hasSeenCFOIntro);
  const [dialoguePhase, setDialoguePhase] = useState<"intro" | "afterReports" | "dataset">("intro");

  const hotspots: Hotspot[] = [
    { id: "cfo", x: 50, y: 40, label: "المدير المالي", icon: "👔" },
    { id: "reports", x: 25, y: 55, label: "التقارير", icon: "📊" },
    { id: "request-data", x: 75, y: 55, label: "طلب بيانات", icon: "📁" },
  ];

  const handleHotspotClick = (id: string) => {
    if (id === "cfo") {
      setDialoguePhase("afterReports");
      setShowDialogue(true);
    } else if (id === "reports") {
      setActivePanel("reports");
    } else if (id === "request-data") {
      if (!state.hasRequestedDataset) {
        setDialoguePhase("dataset");
        setShowDialogue(true);
      } else {
        setActivePanel("dataset-info");
      }
    }
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    if (dialoguePhase === "dataset") {
      requestDataset();
      addNote("تم الحصول على بيانات الصفقات التفصيلية - متاحة الآن في مكتبي");
    }
  };

  const handleCollectEvidence = (evidenceId: string) => {
    collectEvidence(evidenceId);
    addNote(`تم جمع: ${evidenceId === "weekly-profits" ? "ملخص الأرباح" : "تقرير العقود"}`);
  };

  const getCurrentDialogues = (): DialogueLine[] => {
    switch (dialoguePhase) {
      case "intro":
        return CFO_DIALOGUES.intro.map(d => ({
          characterId: "cfo" as const,
          text: d.text,
          mood: "neutral" as const
        }));
      case "afterReports":
        return CFO_DIALOGUES.afterReports.map(d => ({
          characterId: "cfo" as const,
          text: d.text,
          mood: "neutral" as const
        }));
      case "dataset":
        return CFO_DIALOGUES.datasetRequest.map(d => ({
          characterId: "cfo" as const,
          text: d.text,
          mood: "happy" as const
        }));
      default:
        return [];
    }
  };

  return (
    <div className="relative min-h-screen">
      <InteractiveRoom
        backgroundImage={officeBackground}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        roomName="مكتب المدير المالي"
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

        {/* Case Info Banner */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-2 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30">
            <p className="text-sm text-primary font-bold">{CASE_INFO.title}</p>
            <p className="text-xs text-muted-foreground">{CASE_INFO.company}</p>
          </div>
        </div>

        {/* Room Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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
            onClick={() => onNavigate("sales")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📊</span>
            قسم المبيعات
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

      {/* Reports Panel */}
      <AnimatePresence>
        {activePanel === "reports" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-card rounded-2xl border border-border p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">📊 التقارير المالية</h2>
                <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Profits Report */}
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-6 h-6 text-destructive" />
                    <h3 className="font-bold text-foreground">ملخص الأرباح الأسبوعي</h3>
                  </div>
                  
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 text-right text-muted-foreground">الأسبوع</th>
                          <th className="py-2 text-right text-muted-foreground">الإيرادات</th>
                          <th className="py-2 text-right text-muted-foreground">الربح</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WEEKLY_PROFITS.map((row) => (
                          <tr key={row.week} className="border-b border-border/50">
                            <td className="py-2 text-foreground">أسبوع {row.week}</td>
                            <td className="py-2 text-foreground">{(row.revenue / 1000000).toFixed(1)}M</td>
                            <td className={`py-2 font-bold ${row.week >= 7 ? "text-destructive" : "text-green-400"}`}>
                              {(row.profit / 1000).toFixed(0)}K
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <motion.button
                    onClick={() => handleCollectEvidence("weekly-profits")}
                    disabled={hasCollectedEvidence("weekly-profits")}
                    className={`w-full py-2 rounded-lg font-bold transition-colors ${
                      hasCollectedEvidence("weekly-profits")
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    whileHover={!hasCollectedEvidence("weekly-profits") ? { scale: 1.02 } : {}}
                    whileTap={!hasCollectedEvidence("weekly-profits") ? { scale: 0.98 } : {}}
                  >
                    {hasCollectedEvidence("weekly-profits") ? "✓ تم الجمع" : "جمع الدليل"}
                  </motion.button>
                </div>

                {/* Weekly Contracts Report */}
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <ClipboardList className="w-6 h-6 text-primary" />
                    <h3 className="font-bold text-foreground">تقرير العقود الأسبوعي</h3>
                  </div>
                  
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 text-right text-muted-foreground">الأسبوع</th>
                          <th className="py-2 text-right text-muted-foreground">العقود</th>
                          <th className="py-2 text-right text-muted-foreground">أفق</th>
                          <th className="py-2 text-right text-muted-foreground">ريڤا</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WEEKLY_CONTRACTS.map((row) => (
                          <tr key={row.week} className="border-b border-border/50">
                            <td className="py-2 text-foreground">أسبوع {row.week}</td>
                            <td className="py-2 text-foreground font-bold">{row.contracts}</td>
                            <td className="py-2 text-foreground">{row.project_afaq}</td>
                            <td className="py-2 text-foreground">{row.project_riva}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <motion.button
                    onClick={() => handleCollectEvidence("weekly-contracts")}
                    disabled={hasCollectedEvidence("weekly-contracts")}
                    className={`w-full py-2 rounded-lg font-bold transition-colors ${
                      hasCollectedEvidence("weekly-contracts")
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    whileHover={!hasCollectedEvidence("weekly-contracts") ? { scale: 1.02 } : {}}
                    whileTap={!hasCollectedEvidence("weekly-contracts") ? { scale: 0.98 } : {}}
                  >
                    {hasCollectedEvidence("weekly-contracts") ? "✓ تم الجمع" : "جمع الدليل"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Dataset Already Requested Info */}
        {activePanel === "dataset-info" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              className="w-full max-w-md bg-card rounded-2xl border border-border p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <Database className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-foreground mb-2">البيانات جاهزة</h3>
              <p className="text-muted-foreground mb-4">
                بيانات الصفقات التفصيلية متاحة الآن في مكتبك
              </p>
              <motion.button
                onClick={() => onNavigate("my-desk")}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                الذهاب إلى مكتبي
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
