import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star, CheckCircle, Circle, Trophy, Lightbulb } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, SUSPECTS, LEARNING_CONCEPTS, ANALYSIS_CHALLENGES } from "@/data/case1";
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
  const { state, getProgress } = useGame();
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
  const completedTasks = state.tasks.filter(t => t.completed).length;

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

              {/* Learning Objectives */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  ما ستتعلمه
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {CASE_INFO.learningObjectives.map((obj, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded bg-accent/5 border border-accent/20"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <span className="text-accent">📚</span>
                      <span className="text-sm text-foreground">{obj}</span>
                    </motion.div>
                  ))}
                </div>
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
                    const isInterrogated = state.interrogatedSuspects.includes(id);
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
                  label="التحديات المحلولة" 
                  value={state.puzzlesSolved.length} 
                  max={ANALYSIS_CHALLENGES.length} 
                  color="warning" 
                />
                <ProgressBar
                  label="الاستجوابات" 
                  value={state.interrogatedSuspects.length} 
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

              {/* Tasks Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  المهام ({completedTasks}/{state.tasks.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {state.tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        task.completed 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-muted/30 border-border"
                      )}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm",
                        task.completed ? "text-green-400 line-through" : "text-foreground"
                      )}>
                        {task.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
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
                  📊 غرفة التحليل
                  {state.puzzlesSolved.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-accent/30 text-xs">
                      {state.puzzlesSolved.length} تحديات
                    </span>
                  )}
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("interrogation")}
                >
                  🧑‍💼 غرفة الاستجواب
                  {state.interrogatedSuspects.length > 0 && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/30 text-xs">
                      {state.interrogatedSuspects.length}/3
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

              {/* Unlocked Concepts */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  المفاهيم المكتسبة ({state.unlockedConcepts.length}/{LEARNING_CONCEPTS.length})
                </h4>
                
                {state.unlockedConcepts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <motion.p
                      className="text-4xl mb-2"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📚
                    </motion.p>
                    <p>لم تكتسب أي مفاهيم بعد</p>
                    <p className="text-sm">حل التحديات في غرفة التحليل!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {state.unlockedConcepts.map((id, i) => {
                      const concept = LEARNING_CONCEPTS.find(c => c.id === id);
                      if (!concept) return null;
                      return (
                        <motion.div
                          key={id}
                          className="p-3 rounded-lg bg-accent/10 border border-accent/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{concept.icon}</span>
                            <div>
                              <p className="font-bold text-foreground">{concept.title}</p>
                              <p className="text-xs text-muted-foreground">{concept.titleEn}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
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
                  <p className="text-2xl font-bold text-accent">{state.puzzlesSolved.length}</p>
                  <p className="text-xs text-muted-foreground">تحديات محلولة</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                  <p className="text-2xl font-bold text-purple-400">{state.interrogatedSuspects.length}</p>
                  <p className="text-xs text-muted-foreground">استجوابات</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-2xl font-bold text-green-400">{state.insights.length}</p>
                  <p className="text-xs text-muted-foreground">استنتاجات</p>
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
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </motion.button>

        {/* Room title with score */}
        <motion.div
          className="absolute top-4 right-4 z-20 flex items-center gap-3"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-4 py-2 rounded-lg bg-gold/20 backdrop-blur-sm border border-gold/50 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            <span className="font-bold text-gold">{state.score}</span>
          </div>
          <div className="px-6 py-3 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/50">
            <h2 className="text-xl font-bold text-primary">🕵️ مكتب المحقق</h2>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <AnimatePresence>
          {dialogueComplete && !activePanel && (
            <motion.div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <p className="text-primary text-center">
                  ✨ انقر على الأماكن المضيئة لاستكشاف المكتب
                </p>
                <span className="text-sm text-muted-foreground">
                  التقدم: {progress}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </InteractiveRoom>

      {/* Enhanced Dialogue System */}
      <EnhancedDialogue
        dialogues={introDialogues}
        isActive={showDialogue && !dialogueComplete}
        onComplete={() => {
          setDialogueComplete(true);
          setShowDialogue(false);
        }}
      />
    </>
  );
};
