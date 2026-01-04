import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star, Trophy, FileText, Shield, Scale, Users, Lightbulb } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { SceneTransition } from "../SceneTransition";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, CHARACTERS, EVIDENCE_ITEMS, ROOMS, INSIGHTS, HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import managerOffice from "@/assets/rooms/manager-office.png";

interface ManagerOfficeScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots داخل مكتب معتز
const hotspots = [
  { id: "case-board", x: 15, y: 10, width: 35, height: 40, label: "لوحة القضية", icon: "📋" },
  { id: "evidence-01", x: 55, y: 25, width: 20, height: 30, label: "ملخص المصاريف", icon: "📊" },
  { id: "moataz", x: 75, y: 40, width: 20, height: 45, label: "معتز - المدير", icon: "👔" },
];

// حوار المقدمة
const introDialogues = [
  { characterId: "detective" as const, text: "أهلاً... أنت المحقق الجديد؟ تعال اقعد.", mood: "neutral" as const },
  { characterId: "detective" as const, text: "عندنا مشكلة كبيرة... المصاريف زادت 35% آخر شهرين.", mood: "suspicious" as const },
  { characterId: "detective" as const, text: "والمخزن مش باين فيه الزيادة دي. في حد بيسرقنا!", mood: "suspicious" as const },
  { characterId: "detective" as const, text: "مهمتك: تكتشف مين وإزاي... بدليل!", mood: "neutral" as const },
];

export const ManagerOfficeScreen = ({ onNavigate }: ManagerOfficeScreenProps) => {
  const { 
    state, 
    getProgress, 
    getOverallTrust, 
    getTrustLevel,
    getRemainingAttempts, 
    markIntroSeen,
    isEvidenceCollected,
    isEvidenceUnlocked,
    collectEvidence,
    viewEvidence,
    unlockEvidence,
    modifyTrust,
    addNote,
    completeDialogue,
    hasCompletedDialogue,
    hasInsight,
    makeAccusation,
    canAccuse,
    canUnlockHypothesis,
    setActiveHypothesis,
  } = useGame();
  const { playSound } = useSound();
  
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(!state.hasSeenIntroDialogue);
  const [dialogueComplete, setDialogueComplete] = useState(state.hasSeenIntroDialogue);
  const [showMoatazDialogue, setShowMoatazDialogue] = useState(false);
  const [currentDialogueResponse, setCurrentDialogueResponse] = useState<string | null>(null);
  const [showAccusePanel, setShowAccusePanel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAccusation, setIsCorrectAccusation] = useState(false);

  const moataz = CHARACTERS.find(c => c.id === "moataz")!;
  const evidence01 = EVIDENCE_ITEMS.find(e => e.id === "evidence-01")!;

  const handleHotspotClick = (id: string) => {
    if (!dialogueComplete) return;
    
    if (id === "moataz") {
      setShowMoatazDialogue(true);
      setCurrentDialogueResponse(moataz.initialStatement);
      playSound("click");
    } else if (id === "evidence-01") {
      setActivePanel("evidence");
      viewEvidence("evidence-01");
      playSound("click");
    } else {
      setActivePanel(id);
      playSound("click");
    }
  };

  const handleDialogueComplete = () => {
    setDialogueComplete(true);
    setShowDialogue(false);
    markIntroSeen();
  };

  const handleMoatazChoice = (choice: any, dialogueId: string) => {
    completeDialogue(dialogueId);
    
    switch (choice.result) {
      case "unlock":
        if (choice.unlockEvidence) {
          unlockEvidence(choice.unlockEvidence);
          toast.success("تم فتح دليل جديد!");
        }
        break;
      case "clue":
        if (choice.clue) {
          addNote({
            type: "clue",
            text: choice.clue,
            source: "manager-office",
            characterId: "moataz",
          });
          toast.success("تم تسجيل معلومة!");
        }
        break;
      case "trust_up":
      case "trust_down":
        if (choice.trustChange) {
          modifyTrust(choice.trustChange.entity, choice.trustChange.amount);
          if (choice.trustChange.amount < 0) {
            toast.error("انخفضت الثقة!");
          }
        }
        break;
    }
    
    if (choice.followUp) {
      setCurrentDialogueResponse(choice.followUp);
    }
    playSound("reveal");
  };

  const getAvailableMoatazDialogues = () => {
    return moataz.dialogues.filter(d => {
      if (hasCompletedDialogue(d.id)) return false;
      if (d.trigger === "first_visit") return true;
      if (d.trigger === "after_analysis") {
        return state.discoveredInsights.length >= 1;
      }
      return false;
    });
  };

  const handleAccuse = (characterId: string) => {
    playSound("click");
    const result = makeAccusation(characterId);
    
    if (result.correct) {
      setIsCorrectAccusation(true);
      setShowAccusePanel(false);
      setTimeout(() => {
        setShowResult(true);
        playSound("success");
      }, 500);
    } else if (result.attemptsLeft <= 0) {
      setIsCorrectAccusation(false);
      setShowAccusePanel(false);
      setTimeout(() => {
        setShowResult(true);
        playSound("error");
      }, 500);
    } else {
      setShowAccusePanel(false);
      toast.error(`اتهام خاطئ! تبقى ${result.attemptsLeft} محاولات`);
      playSound("error");
    }
  };

  const progress = getProgress();
  const trust = getOverallTrust();
  const remainingAttempts = getRemainingAttempts();
  const availableMoatazDialogues = getAvailableMoatazDialogues();

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

              {/* Evidence Collected */}
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  الأدلة المجمعة ({state.collectedEvidence.length}/{EVIDENCE_ITEMS.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {EVIDENCE_ITEMS.map((ev) => {
                    const collected = isEvidenceCollected(ev.id);
                    const unlocked = isEvidenceUnlocked(ev.id);
                    const room = ROOMS.find(r => r.id === ev.room);
                    return (
                      <div
                        key={ev.id}
                        className={cn(
                          "p-2 rounded-lg border text-xs",
                          collected ? "bg-green-500/10 border-green-500/30" :
                          unlocked ? "bg-amber-500/10 border-amber-500/30" :
                          "bg-muted/30 border-border/30"
                        )}
                      >
                        <span className="mr-1">{ev.icon}</span>
                        <span className={collected ? "text-green-400" : unlocked ? "text-amber-400" : "text-muted-foreground"}>
                          {ev.name}
                        </span>
                        <p className="text-muted-foreground text-[10px] mt-1">
                          {room?.name || ev.room}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  الاكتشافات ({state.discoveredInsights.length}/{INSIGHTS.length})
                </h4>
                {state.discoveredInsights.length === 0 ? (
                  <p className="text-muted-foreground text-sm p-3 bg-muted/20 rounded-lg">
                    استخدم غرفة التحليل لاكتشاف الأنماط
                  </p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-auto">
                    {INSIGHTS.filter(i => hasInsight(i.id)).map((insight) => (
                      <div key={insight.id} className="p-2 rounded-lg bg-accent/10 border border-accent/30 text-xs">
                        <p className="text-accent font-bold">{insight.name}</p>
                        <p className="text-muted-foreground">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hypotheses */}
              <div>
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" />
                  الفرضيات
                </h4>
                <div className="space-y-2">
                  {HYPOTHESES.map((h) => {
                    const canUnlock = canUnlockHypothesis(h.id);
                    const isActive = state.activeHypothesis === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => canUnlock && setActiveHypothesis(h.id)}
                        disabled={!canUnlock}
                        className={cn(
                          "w-full p-2 rounded-lg border text-right text-xs transition-all",
                          isActive ? "bg-primary/20 border-primary" :
                          canUnlock ? "bg-card/50 border-border hover:border-primary/50" :
                          "bg-muted/20 border-border/30 opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className={canUnlock ? "text-foreground" : "text-muted-foreground"}>
                          {canUnlock ? "" : "🔒 "}{h.title}
                        </span>
                        {isActive && <span className="text-primary mr-2">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation to rooms */}
              <div className="pt-4 border-t border-border">
                <h4 className="font-bold text-foreground mb-3">انتقل إلى:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => onNavigate("accounting")} className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-bold hover:bg-primary/20">
                    📊 المحاسبة
                  </button>
                  <button onClick={() => onNavigate("warehouse")} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20">
                    📦 المخزن
                  </button>
                  <button onClick={() => onNavigate("projects")} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold hover:bg-purple-500/20">
                    📋 المشاريع
                  </button>
                  <button onClick={() => onNavigate("analysis-lab")} className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-bold hover:bg-accent/20">
                    🔬 التحليل
                  </button>
                </div>
              </div>

              {/* Accuse Button */}
              {canAccuse() && !state.caseCompleted && (
                <motion.button
                  onClick={() => { setActivePanel(null); setShowAccusePanel(true); }}
                  className="w-full py-4 rounded-xl bg-destructive text-destructive-foreground font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Scale className="w-5 h-5" />
                  عرض القضية - اتخذ قرارك
                </motion.button>
              )}
            </div>
          </GameCard>
        );

      case "evidence":
        return (
          <GameCard title={evidence01.name} iconEmoji={evidence01.icon} className="w-full">
            <div className="space-y-4 p-2">
              <p className="text-muted-foreground">{evidence01.description}</p>
              
              {evidence01.data?.type === "summary" && (
                <div className="space-y-4">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/30">
                      <tr>
                        <th className="text-right p-2">الشهر</th>
                        <th className="text-right p-2">المصاريف</th>
                        <th className="text-right p-2">المشاريع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evidence01.data.months.map((m: any, i: number) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2 text-foreground">{m.month}</td>
                          <td className="p-2 text-destructive font-mono">{m.expenses.toLocaleString()} ر.س</td>
                          <td className="p-2 text-foreground">{m.projects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-amber-400 text-sm p-3 bg-amber-500/10 rounded-lg">⚠️ {evidence01.data.note}</p>
                </div>
              )}

              {!isEvidenceCollected("evidence-01") ? (
                <motion.button
                  onClick={() => { collectEvidence("evidence-01"); playSound("collect"); }}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                  whileHover={{ scale: 1.02 }}
                >
                  📥 جمع هذا الدليل
                </motion.button>
              ) : (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-center text-green-400">
                  ✓ تم جمع هذا الدليل
                </div>
              )}
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
        backgroundImage={managerOffice}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activePanel}
        overlayContent={activePanel ? renderPanelContent() : showMoatazDialogue ? (
          <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">👔</div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{moataz.name}</h3>
                <p className="text-muted-foreground">{moataz.role}</p>
              </div>
            </div>

            {currentDialogueResponse && (
              <motion.div 
                className="p-4 rounded-xl bg-secondary/30 border border-border mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-foreground text-lg">"{currentDialogueResponse}"</p>
              </motion.div>
            )}

            {availableMoatazDialogues.length > 0 ? (
              <div className="space-y-4">
                {availableMoatazDialogues.map((dialogue) => (
                  <div key={dialogue.id} className="p-4 rounded-xl bg-card/50 border border-border">
                    <p className="text-foreground mb-4">{dialogue.text}</p>
                    <div className="space-y-2">
                      {dialogue.choices.map((choice) => (
                        <motion.button
                          key={choice.id}
                          onClick={() => handleMoatazChoice(choice, dialogue.id)}
                          className="w-full p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary text-right text-foreground"
                          whileHover={{ x: -5 }}
                        >
                          💬 {choice.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                اجمع أدلة أكثر أو حلل البيانات لفتح حوارات جديدة.
              </p>
            )}

            <button
              onClick={() => setShowMoatazDialogue(false)}
              className="mt-6 w-full py-3 rounded-xl bg-secondary text-foreground"
            >
              إغلاق
            </button>
          </motion.div>
        ) : showAccusePanel ? (
          <motion.div className="bg-background/95 backdrop-blur-xl border border-destructive/30 rounded-2xl p-6 max-w-4xl w-full">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <Scale className="w-8 h-8 text-destructive" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">عرض القضية - من المذنب؟</h3>
                <p className="text-muted-foreground">المحاولات المتبقية: {remainingAttempts}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CHARACTERS.map((char) => (
                <motion.button
                  key={char.id}
                  onClick={() => handleAccuse(char.id)}
                  className="p-4 rounded-xl bg-card/50 border-2 border-destructive/30 hover:border-destructive text-right"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-bold text-foreground">{char.name}</h4>
                  <p className="text-sm text-muted-foreground">{char.role}</p>
                </motion.button>
              ))}
            </div>
            
            <button
              onClick={() => setShowAccusePanel(false)}
              className="mt-6 w-full py-3 rounded-xl bg-secondary text-foreground"
            >
              إلغاء
            </button>
          </motion.div>
        ) : null}
        onCloseOverlay={() => { setActivePanel(null); setShowMoatazDialogue(false); setShowAccusePanel(false); }}
      >
        {/* Back button */}
        <motion.button
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background"
          onClick={() => onNavigate("intro")}
          whileHover={{ scale: 1.05 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-foreground">رجوع</span>
        </motion.button>

        {/* Stats */}
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

        {/* Room name */}
        <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30">
            <span className="text-primary font-bold">🏢 مكتب معتز</span>
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

      {/* Result */}
      <SceneTransition 
        isVisible={showResult} 
        type={isCorrectAccusation ? "success" : "failure"} 
        title={isCorrectAccusation ? "🎉 القضية محلولة!" : "💨 المجرم هرب!"} 
        subtitle={isCorrectAccusation ? "أحسنت! كشفت المذنب الحقيقي." : "اتهمت الشخص الخطأ."}
      >
        <motion.button 
          className={cn("px-8 py-4 rounded-xl font-bold text-lg", isCorrectAccusation ? "bg-green-500 text-white" : "bg-destructive text-white")} 
          onClick={() => { setShowResult(false); onNavigate("result"); }} 
          whileHover={{ scale: 1.05 }}
        >
          عرض النتائج
        </motion.button>
      </SceneTransition>
    </>
  );
};
