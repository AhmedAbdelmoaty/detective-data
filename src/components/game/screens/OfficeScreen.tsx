import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star, Trophy, FileText, Shield, Users } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, SUSPECTS } from "@/data/case1";
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
  { characterId: "detective" as const, text: "شركة صغيرة اكتشفت أن 45,000 ريال اختفت من حساباتها. ثلاثة موظفين تحت الشبهة.", mood: "suspicious" as const },
  { characterId: "detective" as const, text: "مهمتك: تحليل البيانات المالية، اكتشاف الأنماط المشبوهة، وكشف المختلس!", mood: "happy" as const },
];

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const { state, getProgress, getTrustLevel, getInterrogationProgress } = useGame();
  const { playSound } = useSound();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueComplete, setDialogueComplete] = useState(false);

  const handleHotspotClick = (id: string) => {
    if (!dialogueComplete) return;
    setActivePanel(id);
    playSound("click");
  };

  const progress = getProgress();
  const trustLevel = getTrustLevel();
  const interrogationProgress = getInterrogationProgress();
  const suspectsInterrogated = state.interrogations.filter(i => i.questionsAsked.length > 0).length;

  const getTrustColor = () => {
    switch (trustLevel) {
      case "critical": return "text-destructive";
      case "low": return "text-orange-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-green-400";
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
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs">
                    الصعوبة: {CASE_INFO.difficulty === "beginner" ? "مبتدئ" : "متوسط"}
                  </span>
                  <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                    الوقت: {CASE_INFO.estimatedTime}
                  </span>
                </div>
              </motion.div>

              {/* Briefing */}
              <motion.div
                className="p-4 rounded-lg bg-secondary/50 border border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="font-bold text-foreground flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  ملخص القضية
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {CASE_INFO.briefing}
                </p>
              </motion.div>

              {/* Suspects Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  المشتبه بهم
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {(["ahmed", "sara", "karim"] as const).map((id, i) => {
                    const suspect = SUSPECTS.find(s => s.id === id);
                    const interrogation = state.interrogations.find(int => int.suspectId === id);
                    const isInterrogated = interrogation && interrogation.questionsAsked.length > 0;
                    return (
                      <motion.div
                        key={id}
                        className={cn(
                          "text-center p-2 rounded-lg border",
                          isInterrogated ? "border-primary/50 bg-primary/10" : "border-border"
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                      >
                        <AnimatedCharacter
                          characterId={id}
                          size="md"
                          showName={false}
                          mood={id === "karim" ? "nervous" : "neutral"}
                          entrance="bounce"
                        />
                        <p className="text-sm font-bold mt-2">{suspect?.name}</p>
                        <p className="text-xs text-muted-foreground">{suspect?.role}</p>
                        {isInterrogated && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs">
                            تم الاستجواب ✓
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
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
                  trustLevel === "critical" ? "bg-destructive/10 border-destructive/30" :
                  trustLevel === "low" ? "bg-orange-500/10 border-orange-500/30" :
                  trustLevel === "medium" ? "bg-yellow-500/10 border-yellow-500/30" :
                  "bg-green-500/10 border-green-500/30"
                )}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-6 h-6" />
                  <span className={cn("text-3xl font-bold", getTrustColor())}>{state.trust}%</span>
                </div>
                <p className="text-sm text-muted-foreground">مستوى الثقة</p>
                {trustLevel === "critical" && (
                  <p className="text-xs text-destructive mt-1">تحذير: الثقة منخفضة جداً!</p>
                )}
              </motion.div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <ProgressBar 
                  label="التقدم الإجمالي" 
                  value={progress} 
                  max={100} 
                  color="primary" 
                />
                <ProgressBar 
                  label="الأدلة المجمعة" 
                  value={state.collectedEvidence.length} 
                  max={5} 
                  color="accent" 
                />
                <ProgressBar
                  label="الاستجوابات" 
                  value={suspectsInterrogated} 
                  max={3} 
                  color="success" 
                />
              </div>

              {/* Score */}
              <motion.div
                className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-6 h-6 text-gold" />
                  <span className="text-3xl font-bold text-gold">{state.score}</span>
                </div>
                <p className="text-sm text-muted-foreground">النقاط المكتسبة</p>
              </motion.div>

              {/* Investigation Notes Summary */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  دفتر التحقيق ({state.investigationNotes.length} ملاحظات)
                </h4>
                {state.investigationNotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لم تسجل أي ملاحظات بعد. ابدأ التحقيق!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-auto">
                    {state.investigationNotes.slice(-3).map((note, i) => (
                      <div key={note.id} className="p-2 rounded bg-secondary/50 text-sm text-muted-foreground">
                        <span className={cn(
                          "inline-block w-2 h-2 rounded-full mr-2",
                          note.type === "key" ? "bg-green-400" :
                          note.type === "clue" ? "bg-primary" :
                          "bg-muted-foreground"
                        )} />
                        {note.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-primary/20 border border-primary/50 text-primary font-bold hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("evidence")}
                >
                  📁 غرفة الأدلة
                  {state.collectedEvidence.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-primary/30 text-xs">
                      {state.collectedEvidence.length} أدلة
                    </span>
                  )}
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-accent/20 border border-accent/50 text-accent font-bold hover:bg-accent/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("analysis")}
                >
                  📊 دفتر التحقيق
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("interrogation")}
                >
                  🧑‍💼 غرفة الاستجواب
                  {suspectsInterrogated > 0 && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/30 text-xs">
                      {suspectsInterrogated}/3
                    </span>
                  )}
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
              <motion.div
                className="p-4 rounded-lg bg-gold/10 border border-gold/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-gold" />
                  <div>
                    <h4 className="font-bold text-foreground">رتبتك الحالية</h4>
                    <p className="text-2xl font-bold text-gold">
                      {state.score >= 500 ? "محقق خبير" : state.score >= 200 ? "محقق متقدم" : "محقق مبتدئ"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Keys Discovered */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  المفاتيح المكتشفة ({state.keysDiscovered.length})
                </h4>
                
                {state.keysDiscovered.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <motion.p
                      className="text-4xl mb-2"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔍
                    </motion.p>
                    <p>لم تكتشف أي مفاتيح بعد</p>
                    <p className="text-sm">افحص الأدلة واستجوب المشتبهين!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {state.keysDiscovered.map((key, i) => (
                      <motion.div
                        key={key}
                        className="p-3 rounded-lg bg-accent/10 border border-accent/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🔑</span>
                          <p className="font-bold text-foreground text-sm">{key}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats Summary */}
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
                  <p className="text-2xl font-bold text-purple-400">{suspectsInterrogated}</p>
                  <p className="text-xs text-muted-foreground">استجوابات</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-2xl font-bold text-green-400">{interrogationProgress.asked}</p>
                  <p className="text-xs text-muted-foreground">أسئلة مطروحة</p>
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">رجوع</span>
        </motion.button>

        {/* Room title and score */}
        <motion.div
          className="absolute top-4 right-4 z-20 flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <Shield className={cn("w-5 h-5", getTrustColor())} />
            <span className={cn("font-bold", getTrustColor())}>{state.trust}%</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <Star className="w-5 h-5 text-gold" />
            <span className="font-bold text-gold">{state.score}</span>
          </div>
        </motion.div>

        {/* Navigation buttons at bottom */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="px-4 py-3 rounded-lg bg-primary/90 text-primary-foreground font-bold flex items-center gap-2 border border-primary/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("evidence")}
          >
            📁 الأدلة
          </motion.button>
          <motion.button
            className="px-4 py-3 rounded-lg bg-accent/90 text-accent-foreground font-bold flex items-center gap-2 border border-accent/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("analysis")}
          >
            📊 الدفتر
          </motion.button>
          <motion.button
            className="px-4 py-3 rounded-lg bg-purple-600/90 text-white font-bold flex items-center gap-2 border border-purple-500/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("interrogation")}
          >
            🧑‍💼 الاستجواب
          </motion.button>
        </motion.div>
      </InteractiveRoom>

      {/* Initial dialogue */}
      <AnimatePresence>
        {showDialogue && !dialogueComplete && (
          <EnhancedDialogue
            dialogues={introDialogues}
            isActive={showDialogue && !dialogueComplete}
            onComplete={() => {
              setDialogueComplete(true);
              setShowDialogue(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
