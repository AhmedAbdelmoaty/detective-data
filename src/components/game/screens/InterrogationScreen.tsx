import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Scale, Users, AlertTriangle } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { SceneTransition } from "../SceneTransition";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { SUSPECTS, CASE_SOLUTION } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";
import suspectArrested from "@/assets/scenes/suspect-arrested.png";
import suspectEscaped from "@/assets/scenes/suspect-escaped.png";
import ahmedImg from "@/assets/characters/ahmed.png";
import saraImg from "@/assets/characters/sara.png";
import karimImg from "@/assets/characters/karim.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

const suspectImages: Record<string, string> = { ahmed: ahmedImg, sara: saraImg, karim: karimImg };

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const { state, askQuestion, getQuestionsAskedForSuspect, canAskMoreQuestions, makeAccusation, canAccuse, addNote, getRemainingAttempts } = useGame();
  const { playSound } = useSound();
  const [selectedSuspect, setSelectedSuspect] = useState<typeof SUSPECTS[0] | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [showAccusePanel, setShowAccusePanel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAccusation, setIsCorrectAccusation] = useState(false);

  const remainingAttempts = getRemainingAttempts();

  const handleSelectSuspect = (suspect: typeof SUSPECTS[0]) => {
    setSelectedSuspect(suspect);
    setShowQuestions(true);
    setCurrentResponse(suspect.initialStatement);
    playSound("click");
  };

  const handleAskQuestion = (question: typeof SUSPECTS[0]["questions"][0]) => {
    if (!selectedSuspect || !canAskMoreQuestions(selectedSuspect.id)) return;
    
    askQuestion(selectedSuspect.id, question.id);
    setCurrentResponse(question.response);
    
    playSound("reveal");
  };

  const handleAccuse = (suspectId: string) => {
    playSound("click");
    const result = makeAccusation(suspectId);
    
    if (result.correct) {
      // نجاح!
      setIsCorrectAccusation(true);
      setShowAccusePanel(false);
      setTimeout(() => {
        setShowResult(true);
        playSound("success");
      }, 500);
    } else if (result.gameOver) {
      // فشل نهائي - استنفذ كل المحاولات
      setIsCorrectAccusation(false);
      setShowAccusePanel(false);
      setTimeout(() => {
        setShowResult(true);
        playSound("error");
      }, 500);
    } else {
      // محاولة خاطئة - لكن لا يزال لديه محاولات
      setShowAccusePanel(false);
      toast.error(`اتهام خاطئ! تبقى لك ${result.attemptsLeft} محاولة`, {
        description: "فكر جيداً قبل الاتهام التالي. الثقة انخفضت 25%.",
        duration: 5000,
      });
      playSound("error");
    }
  };

  const questionsAsked = selectedSuspect ? getQuestionsAskedForSuspect(selectedSuspect.id) : [];

  return (
    <>
      <InteractiveRoom
        backgroundImage={interrogationRoom}
        hotspots={[]}
        onHotspotClick={() => {}}
        activeHotspot={selectedSuspect?.id || null}
        overlayContent={showQuestions && selectedSuspect ? (
          <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            {/* Suspect header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <img src={suspectImages[selectedSuspect.id]} alt={selectedSuspect.name} className="w-20 h-20 object-contain" />
              <div>
                <h3 className="text-2xl font-bold">{selectedSuspect.name}</h3>
                <p className="text-muted-foreground">{selectedSuspect.role}</p>
                <p className="text-sm text-primary">{questionsAsked.length}/3 أسئلة</p>
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

            {/* Questions */}
            {canAskMoreQuestions(selectedSuspect.id) ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-2">اختر سؤالاً:</p>
                {selectedSuspect.questions
                  .filter(q => !questionsAsked.includes(q.id))
                  .map((q, i) => (
                    <motion.button
                      key={q.id}
                      onClick={() => handleAskQuestion(q)}
                      className="w-full p-4 rounded-xl bg-card/50 border border-border hover:border-primary text-right transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <MessageSquare className="w-4 h-4 inline-block ml-2 text-primary" />
                      {q.text}
                    </motion.button>
                  ))}
              </div>
            ) : (
              <p className="text-center text-amber-400">استنفدت جميع الأسئلة لهذا المشتبه</p>
            )}

            <button
              onClick={() => { setShowQuestions(false); setSelectedSuspect(null); }}
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
                <h3 className="text-2xl font-bold">اتخذ قرارك النهائي</h3>
                <p className="text-muted-foreground">من هو المختلس؟</p>
              </div>
            </div>

            {/* Attempts Warning */}
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
                    كل اتهام خاطئ يقلل الثقة 25%. إذا استنفدت المحاولات أو وصلت الثقة للصفر، تفشل القضية.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
              {SUSPECTS.map((suspect, i) => (
                <motion.button
                  key={suspect.id}
                  onClick={() => handleAccuse(suspect.id)}
                  className="p-4 rounded-xl bg-card/50 border-2 border-destructive/30 hover:border-destructive transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={suspectImages[suspect.id]} alt={suspect.name} className="w-full h-32 object-contain mb-4" />
                  <h4 className="font-bold">{suspect.name}</h4>
                  <p className="text-sm text-muted-foreground">{suspect.role}</p>
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
            <span className="font-bold">غرفة الاستجواب</span>
            <span className="text-primary font-mono">{state.totalQuestionsAsked}/9</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-destructive font-bold">محاولات: {remainingAttempts}/3</span>
          </div>
        </motion.div>

        {/* Suspects */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {SUSPECTS.map((suspect, i) => {
            const pos = [{ left: "12%", bottom: "25%" }, { left: "45%", bottom: "20%" }, { left: "78%", bottom: "25%" }][i];
            const asked = getQuestionsAskedForSuspect(suspect.id).length;
            return (
              <motion.div 
                key={suspect.id} 
                className="absolute pointer-events-auto cursor-pointer" 
                style={pos}
                onClick={() => handleSelectSuspect(suspect)}
                whileHover={{ scale: 1.1 }}
              >
                <motion.img src={suspectImages[suspect.id]} alt={suspect.name} className="w-24 h-24 object-contain drop-shadow-2xl" />
                <div className={cn(
                  "absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                  asked > 0 ? "bg-primary/80 text-primary-foreground" : "bg-background/90"
                )}>
                  {suspect.name} {asked > 0 && `(${asked}/3)`}
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
        <div className="absolute bottom-8 left-8 z-20"><NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} /></div>
        <div className="absolute bottom-8 right-8 z-20"><NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} /></div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"><NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} /></div>
      </InteractiveRoom>

      {/* Result */}
      <SceneTransition 
        isVisible={showResult} 
        type={isCorrectAccusation ? "success" : "failure"} 
        backgroundImage={isCorrectAccusation ? suspectArrested : suspectEscaped} 
        title={isCorrectAccusation ? "🎉 القضية محلولة!" : "💨 المجرم هرب!"} 
        subtitle={isCorrectAccusation ? `أحسنت! كريم كان المختلس.` : "اتهمت الشخص الخطأ."}
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
