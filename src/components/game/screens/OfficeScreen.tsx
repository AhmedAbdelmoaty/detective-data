import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star, Trophy, FileText, Clock, User, MessageSquare } from "lucide-react";
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
  { id: "ceo", x: 0, y: 30, width: 18, height: 50, label: "محمد - المدير التنفيذي", icon: "👔" },
];

const introDialogues = [
  { characterId: "detective" as const, text: "أهلاً بك في مكتب الرئيس التنفيذي...", mood: "neutral" as const },
  { characterId: "detective" as const, text: "محمد قلق جداً. المبيعات انخفضت 40% فجأة رغم مضاعفة ميزانية التسويق!", mood: "suspicious" as const },
  { characterId: "detective" as const, text: "مهمتك: حلل البيانات، استجوب الموظفين، واكشف السبب الحقيقي!", mood: "happy" as const },
];

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const { 
    state, 
    getProgress, 
    getRemainingAttempts, 
    markIntroSeen,
    askQuestion,
    hasAskedQuestion,
    addNote,
  } = useGame();
  const { playSound } = useSound();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(!state.hasSeenIntroDialogue);
  const [dialogueComplete, setDialogueComplete] = useState(state.hasSeenIntroDialogue);
  const [ceoResponse, setCeoResponse] = useState<string | null>(null);

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

  const handleAskCEO = (question: typeof CHARACTERS[0]["questions"][0]) => {
    if (hasAskedQuestion(question.id)) return;
    
    askQuestion(question.id, question.cost);
    setCeoResponse(question.response);
    
    addNote({
      type: "dialogue",
      text: `محمد (CEO): "${question.response}"`,
      source: "ceo-office",
      characterId: "ceo",
    });
    
    playSound("reveal");
  };

  const progress = getProgress();
  const remainingAttempts = getRemainingAttempts();
  const ceo = CHARACTERS.find(c => c.id === "ceo");

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
                  الشخصيات ({CHARACTERS.length})
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {CHARACTERS.map((char, i) => (
                    <motion.div
                      key={char.id}
                      className="text-center p-3 rounded-lg border border-border"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                        <User className="w-5 h-5 text-primary" />
                      </div>
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
              {/* Time */}
              <motion.div
                className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">{state.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">الوقت المتبقي</p>
              </motion.div>

              {/* Attempts */}
              <motion.div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                <p className="text-sm text-muted-foreground mb-1">محاولات التقرير المتبقية</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        i <= remainingAttempts ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {i <= remainingAttempts ? "✓" : "✗"}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Progress */}
              <div className="space-y-4">
                <ProgressBar label="التقدم الإجمالي" value={progress} max={100} color="primary" />
                <ProgressBar label="الأدلة المفتوحة" value={state.visitedEvidenceIds.length} max={EVIDENCE_ITEMS.length} color="accent" />
                <ProgressBar label="الأدلة المثبتة" value={state.pinnedEvidenceIds.length} max={5} color="success" />
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
                  👥 غرفة الاجتماعات
                </motion.button>
              </div>
            </div>
          </GameCard>
        );

      case "ceo":
        return (
          <GameCard title="محمد - الرئيس التنفيذي" iconEmoji="👔" className="w-full">
            <div className="space-y-6 p-2">
              {/* CEO Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{ceo?.name}</h3>
                  <p className="text-muted-foreground">{ceo?.role}</p>
                </div>
              </div>

              {/* Response */}
              <motion.div 
                className="p-4 rounded-xl bg-secondary/30 border border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-foreground text-lg">
                  "{ceoResponse || ceo?.initialStatement}"
                </p>
              </motion.div>

              {/* Questions */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  الأسئلة المتاحة:
                </h4>
                {ceo?.questions.map((question) => {
                  const isAsked = hasAskedQuestion(question.id);
                  return (
                    <motion.button
                      key={question.id}
                      onClick={() => !isAsked && handleAskCEO(question)}
                      disabled={isAsked}
                      className={cn(
                        "w-full p-3 rounded-lg border text-right transition-all",
                        isAsked 
                          ? "bg-secondary/50 border-border opacity-60" 
                          : "bg-card/50 border-border hover:border-primary"
                      )}
                      whileHover={!isAsked ? { x: -5 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm", isAsked ? "text-muted-foreground" : "text-foreground")}>
                          {question.text}
                        </span>
                        {!isAsked && (
                          <span className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                            -{question.cost} وقت
                          </span>
                        )}
                        {isAsked && (
                          <span className="text-xs text-green-400">✓</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
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
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-primary font-bold">الوقت: {state.time}</span>
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
