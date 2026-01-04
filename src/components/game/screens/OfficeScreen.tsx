import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star, Trophy, FileText, Shield } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, CHARACTERS, EVIDENCE_ITEMS } from "@/data/case1";
import { cn } from "@/lib/utils";
import detectiveOffice from "@/assets/rooms/detective-office.png";

interface OfficeScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "case-board", x: 20, y: 10, width: 55, height: 45, label: "لوحة القضية", icon: "📋" },
  { id: "desk", x: 25, y: 60, width: 50, height: 30, label: "مكتب المحقق", icon: "📝" },
  { id: "filing-cabinet", x: 0, y: 30, width: 18, height: 50, label: "الأرشيف", icon: "🗄️" },
];

const introDialogues = [
  { characterId: "detective" as const, text: "أهلاً بك في مكتبي. لدينا قضية جديدة تحتاج لحلها...", mood: "neutral" as const },
  { characterId: "detective" as const, text: "شركة صغيرة لاحظت زيادة كبيرة في مصاريف الخامات... والمخزن مش باين فيه الزيادة.", mood: "suspicious" as const },
  { characterId: "detective" as const, text: "مهمتك: اكتشف مين بيسحب فلوس الشركة وإزاي... بدليل!", mood: "happy" as const },
];

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const { 
    state, 
    getProgress, 
    getOverallTrust, 
    getTrustLevel,
    getRemainingAttempts, 
    markIntroSeen,
    isEvidenceCollected,
  } = useGame();
  const { playSound } = useSound();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(!state.hasSeenIntroDialogue);
  const [dialogueComplete, setDialogueComplete] = useState(state.hasSeenIntroDialogue);

  const handleHotspotClick = (id: string) => {
    if (!dialogueComplete) return;
    setActivePanel(id);
    playSound("click");
  };

  const handleDialogueComplete = () => {
    setDialogueComplete(true);
    setShowDialogue(false);
    markIntroSeen();
  };

  const progress = getProgress();
  const trust = getOverallTrust();
  const remainingAttempts = getRemainingAttempts();

  const getTrustColor = (level: string) => {
    switch (level) {
      case "critical": return "text-destructive";
      case "low": return "text-orange-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-green-400";
      default: return "text-foreground";
    }
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case "case-board":
        return (
          <GameCard title="لوحة القضية" iconEmoji="📋" className="w-full">
            <div className="space-y-6 p-2">
              {/* Case Info */}
              <motion.div
                className="p-4 rounded-lg bg-primary/10 border border-primary/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {CASE_INFO.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{CASE_INFO.description}</p>
              </motion.div>

              {/* Briefing */}
              <motion.div
                className="p-4 rounded-lg bg-secondary/50 border border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="font-bold text-foreground flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  ملخص القضية
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {CASE_INFO.briefing}
                </p>
              </motion.div>

              {/* Characters */}
              <div>
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  الشخصيات
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {CHARACTERS.map((char, i) => (
                    <motion.div
                      key={char.id}
                      className="text-center p-3 rounded-lg border border-border"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <p className="text-sm font-bold text-foreground">{char.name}</p>
                      <p className="text-xs text-muted-foreground">{char.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GameCard>
        );

      case "desk":
        return (
          <GameCard title="تقدم التحقيق" iconEmoji="📊" className="w-full">
            <div className="space-y-6 p-2">
              {/* Trust Level */}
              <motion.div
                className={cn(
                  "p-4 rounded-xl border text-center",
                  trust > 70 ? "bg-green-500/10 border-green-500/30" :
                  trust > 40 ? "bg-yellow-500/10 border-yellow-500/30" :
                  "bg-destructive/10 border-destructive/30"
                )}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-6 h-6" />
                  <span className={cn("text-3xl font-bold", getTrustColor(getTrustLevel("manager")))}>{trust}%</span>
                </div>
                <p className="text-sm text-muted-foreground">مستوى الثقة الإجمالي</p>
              </motion.div>

              {/* Trust by Entity */}
              <div className="space-y-2">
                {Object.entries(state.trust).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {key === "manager" ? "المدير" : key === "accounting" ? "المحاسبة" : key === "warehouse" ? "المخزن" : "المشاريع"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            value > 70 ? "bg-green-500" : value > 40 ? "bg-amber-500" : "bg-destructive"
                          )}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground w-8">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attempts */}
              <motion.div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                <p className="text-sm text-muted-foreground mb-1">محاولات الاتهام المتبقية</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        i <= remainingAttempts ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {i <= remainingAttempts ? "⚖️" : "✗"}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Progress */}
              <div className="space-y-4">
                <ProgressBar label="التقدم الإجمالي" value={progress} max={100} color="primary" />
                <ProgressBar label="الأدلة المجمعة" value={state.collectedEvidence.length} max={EVIDENCE_ITEMS.length} color="accent" />
                <ProgressBar label="الاكتشافات" value={state.discoveredInsights.length} max={7} color="success" />
              </div>

              {/* Score */}
              <motion.div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-amber-400" />
                  <span className="text-3xl font-bold text-amber-400">{state.score}</span>
                </div>
                <p className="text-sm text-muted-foreground">النقاط المكتسبة</p>
              </motion.div>

              {/* Navigation */}
              <div className="flex flex-col gap-3 mt-6">
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-primary/20 border border-primary/50 text-primary font-bold hover:bg-primary/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate("evidence")}
                >
                  📁 غرفة الأدلة
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-accent/20 border border-accent/50 text-accent font-bold hover:bg-accent/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate("analysis")}
                >
                  📊 غرفة التحليل
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onNavigate("interrogation")}
                >
                  🧑‍💼 غرفة الاستجواب
                </motion.button>
              </div>
            </div>
          </GameCard>
        );

      case "filing-cabinet":
        return (
          <GameCard title="إنجازاتك" iconEmoji="🏆" className="w-full">
            <div className="space-y-6 p-2">
              {/* Rank */}
              <motion.div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-foreground">رتبتك الحالية</h4>
                    <p className="text-2xl font-bold text-amber-400">
                      {state.score >= 500 ? "محقق خبير" : state.score >= 200 ? "محقق متقدم" : "محقق مبتدئ"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Insights Discovered */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  الاكتشافات ({state.discoveredInsights.length})
                </h4>
                
                {state.discoveredInsights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-4xl mb-2">🔍</p>
                    <p>لم تكتشف أي أنماط بعد</p>
                    <p className="text-sm">استخدم غرفة التحليل!</p>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-32 overflow-auto">
                    {state.investigationNotes
                      .filter(n => n.type === "insight")
                      .map((note, i) => (
                        <motion.div
                          key={note.id}
                          className="p-3 rounded-lg bg-accent/10 border border-accent/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <p className="text-foreground text-sm">{note.text}</p>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <p className="text-2xl font-bold text-primary">{state.collectedEvidence.length}</p>
                  <p className="text-xs text-muted-foreground">أدلة مجمعة</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
                  <p className="text-2xl font-bold text-accent">{state.investigationNotes.length}</p>
                  <p className="text-xs text-muted-foreground">ملاحظات</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                  <p className="text-2xl font-bold text-purple-400">{state.dialoguesCompleted.length}</p>
                  <p className="text-xs text-muted-foreground">حوارات</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-2xl font-bold text-green-400">{state.testedHypotheses.length}</p>
                  <p className="text-xs text-muted-foreground">فرضيات</p>
                </div>
              </div>
            </div>
          </GameCard>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <InteractiveRoom
        backgroundImage={detectiveOffice}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activePanel}
        overlayContent={activePanel ? renderPanelContent() : undefined}
        onCloseOverlay={() => setActivePanel(null)}
      >
        {/* Back button */}
        <motion.button
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          onClick={() => onNavigate("intro")}
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-foreground">رجوع</span>
        </motion.button>

        {/* Stats in top right */}
        <motion.div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-amber-400 font-bold">{state.score} نقطة</span>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-lg backdrop-blur-sm border",
            trust > 70 ? "bg-green-500/20 border-green-500/30" :
            trust > 40 ? "bg-amber-500/20 border-amber-500/30" :
            "bg-destructive/20 border-destructive/30"
          )}>
            <span className="font-bold text-foreground">{trust}% ثقة</span>
          </div>
        </motion.div>
      </InteractiveRoom>

      {/* Intro dialogue */}
      <AnimatePresence>
        {showDialogue && !dialogueComplete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center pb-8 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedDialogue
              dialogues={introDialogues}
              isActive={true}
              onComplete={handleDialogueComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
