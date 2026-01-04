import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Scale, Users, AlertTriangle, User } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { SceneTransition } from "../SceneTransition";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CHARACTERS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";
import suspectArrested from "@/assets/scenes/suspect-arrested.png";
import suspectEscaped from "@/assets/scenes/suspect-escaped.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const { 
    state, 
    addNote,
    makeAccusation, 
    canAccuse, 
    getRemainingAttempts,
    modifyTrust,
    unlockEvidence,
    completeDialogue,
    hasCompletedDialogue,
    hasInsight,
  } = useGame();
  const { playSound } = useSound();
  
  const [selectedCharacter, setSelectedCharacter] = useState<typeof CHARACTERS[0] | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [showAccusePanel, setShowAccusePanel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAccusation, setIsCorrectAccusation] = useState(false);

  const remainingAttempts = getRemainingAttempts();

  const handleSelectCharacter = (char: typeof CHARACTERS[0]) => {
    setSelectedCharacter(char);
    setShowQuestions(true);
    setCurrentResponse(char.initialStatement);
    playSound("click");
  };

  const handleDialogueChoice = (choice: any, dialogueId: string) => {
    if (!selectedCharacter) return;
    
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
            source: "interrogation",
            characterId: selectedCharacter.id,
          });
          toast.success("تم تسجيل معلومة جديدة!");
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
      setCurrentResponse(choice.followUp);
    }
    
    playSound("reveal");
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
      toast.error(`اتهام خاطئ! تبقى لك ${result.attemptsLeft} محاولة`, {
        description: "فكر جيداً قبل الاتهام التالي.",
        duration: 5000,
      });
      playSound("error");
    }
  };

  // Get available dialogues for character
  const getAvailableDialogues = () => {
    if (!selectedCharacter) return [];
    
    return selectedCharacter.dialogues.filter(d => {
      if (hasCompletedDialogue(d.id)) return false;
      
      if (d.trigger === "first_visit") return true;
      if (d.trigger === "has_insight" && d.requiredInsight) {
        return hasInsight(d.requiredInsight);
      }
      if (d.trigger === "after_analysis") {
        return state.discoveredInsights.length >= 1;
      }
      return false;
    });
  };

  const availableDialogues = getAvailableDialogues();

  return (
    <>
      <InteractiveRoom
        backgroundImage={interrogationRoom}
        hotspots={[]}
        onHotspotClick={() => {}}
        activeHotspot={selectedCharacter?.id || null}
        overlayContent={showQuestions && selectedCharacter ? (
          <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            {/* Character header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{selectedCharacter.name}</h3>
                <p className="text-muted-foreground">{selectedCharacter.role}</p>
              </div>
            </div>

            {/* Response */}
            {currentResponse && (
              <motion.div 
                className="p-4 rounded-xl bg-secondary/30 border border-border mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-foreground text-lg">"{currentResponse}"</p>
              </motion.div>
            )}

            {/* Dialogues */}
            {availableDialogues.length > 0 ? (
              <div className="space-y-4">
                {availableDialogues.map((dialogue) => (
                  <div key={dialogue.id} className="p-4 rounded-xl bg-card/50 border border-border">
                    <p className="text-foreground mb-4">{dialogue.text}</p>
                    <div className="space-y-2">
                      {dialogue.choices.map((choice) => (
                        <motion.button
                          key={choice.id}
                          onClick={() => handleDialogueChoice(choice, dialogue.id)}
                          className="w-full p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary text-right text-foreground transition-all"
                          whileHover={{ x: -5 }}
                        >
                          <MessageSquare className="w-4 h-4 inline-block ml-2 text-primary" />
                          {choice.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                لا توجد حوارات متاحة حالياً. اجمع المزيد من الأدلة أو حلل البيانات لفتح حوارات جديدة.
              </p>
            )}

            <button
              onClick={() => { setShowQuestions(false); setSelectedCharacter(null); }}
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
                <h3 className="text-2xl font-bold text-foreground">اتخذ قرارك النهائي</h3>
                <p className="text-muted-foreground">من هو المذنب؟</p>
              </div>
            </div>

            <motion.div
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <div>
                  <p className="font-bold text-destructive">المحاولات المتبقية: {remainingAttempts}</p>
                  <p className="text-sm text-muted-foreground">
                    كل اتهام خاطئ يقلل من فرصك في حل القضية.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {CHARACTERS.map((char, i) => (
                <motion.button
                  key={char.id}
                  onClick={() => handleAccuse(char.id)}
                  className="p-4 rounded-xl bg-card/50 border-2 border-destructive/30 hover:border-destructive transition-all text-right"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{char.name}</h4>
                      <p className="text-sm text-muted-foreground">{char.role}</p>
                    </div>
                  </div>
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
        onCloseOverlay={() => { setShowQuestions(false); setShowAccusePanel(false); }}
      >
        {/* Status */}
        <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">غرفة الاستجواب</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-destructive font-bold">محاولات: {remainingAttempts}/3</span>
          </div>
        </motion.div>

        {/* Characters */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {CHARACTERS.map((char, i) => {
            const positions = [
              { left: "12%", bottom: "25%" },
              { left: "38%", bottom: "20%" },
              { left: "62%", bottom: "25%" },
              { left: "85%", bottom: "20%" },
            ];
            return (
              <motion.div 
                key={char.id} 
                className="absolute pointer-events-auto cursor-pointer" 
                style={positions[i]}
                onClick={() => handleSelectCharacter(char)}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center border-2 border-primary/50">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/90 text-xs font-bold whitespace-nowrap text-foreground">
                  {char.name}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Accuse Button */}
        <AnimatePresence>
          {canAccuse() && !state.caseCompleted && (
            <motion.div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
              <motion.button 
                onClick={() => setShowAccusePanel(true)} 
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Scale className="w-6 h-6" /> اتخذ قرارك النهائي
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-8 left-8 z-20">
          <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
        </div>
        <div className="absolute bottom-8 right-8 z-20">
          <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} />
        </div>
      </InteractiveRoom>

      {/* Result */}
      <SceneTransition 
        isVisible={showResult} 
        type={isCorrectAccusation ? "success" : "failure"} 
        backgroundImage={isCorrectAccusation ? suspectArrested : suspectEscaped} 
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
