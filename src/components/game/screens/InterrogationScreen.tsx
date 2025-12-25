import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Scale, Users, ShieldAlert, Star, Award } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { SceneTransition } from "../SceneTransition";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { SUSPECTS, CASE_SOLUTION, LEARNING_CONCEPTS } from "@/data/case1";
import { cn } from "@/lib/utils";
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

const hotspots = [
  { id: "suspect-1", x: 5, y: 30, width: 20, height: 45, label: "أحمد", icon: "👔" },
  { id: "suspect-2", x: 40, y: 25, width: 20, height: 50, label: "سارة", icon: "👩‍💼" },
  { id: "suspect-3", x: 75, y: 30, width: 20, height: 45, label: "كريم", icon: "📦" },
];

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const { state, interrogateSuspect, addSuspectNote, makeAccusation, canAccuse } = useGame();
  const { playSound } = useSound();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<typeof SUSPECTS[0] | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showAccusePanel, setShowAccusePanel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrectAccusation, setIsCorrectAccusation] = useState(false);

  const handleHotspotClick = (id: string) => {
    const suspectMap: Record<string, typeof SUSPECTS[0]> = {
      "suspect-1": SUSPECTS[0], "suspect-2": SUSPECTS[1], "suspect-3": SUSPECTS[2],
    };
    const suspect = suspectMap[id];
    if (suspect) {
      setSelectedSuspect(suspect);
      setActiveHotspot(id);
      setTimeout(() => setShowDialogue(true), 300);
      interrogateSuspect(suspect.id);
      playSound("reveal");
    }
  };

  const handleDialogueComplete = () => {
    if (selectedSuspect) {
      const clues = selectedSuspect.dialogues.filter(d => d.clue).map(d => d.clue!);
      clues.forEach(clue => addSuspectNote(selectedSuspect.id, clue));
    }
    setShowDialogue(false);
    setSelectedSuspect(null);
    setActiveHotspot(null);
  };

  const handleAccuse = (suspectId: string) => {
    playSound("accuse");
    const correct = makeAccusation(suspectId);
    setIsCorrectAccusation(correct);
    setShowAccusePanel(false);
    setTimeout(() => {
      setShowResult(true);
      playSound(correct ? "success" : "error");
    }, 500);
  };

  return (
    <>
      <InteractiveRoom
        backgroundImage={interrogationRoom}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activeHotspot}
        overlayContent={showAccusePanel ? (
          <motion.div className="bg-background/95 backdrop-blur-xl border border-destructive/30 rounded-2xl p-6 max-w-4xl w-full">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <Scale className="w-8 h-8 text-destructive" />
              <div>
                <h3 className="text-2xl font-bold">اتخذ قرارك النهائي</h3>
                <p className="text-muted-foreground">من هو المختلس؟</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
              <p className="text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>تحذير: قرار نهائي! النقاط: {state.score}</span>
              </p>
            </div>

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
                  {state.interrogatedSuspects.includes(suspect.id) && (
                    <span className="inline-block mt-2 px-2 py-1 rounded bg-primary/20 text-primary text-xs">تم الاستجواب ✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
        onCloseOverlay={() => setShowAccusePanel(false)}
      >
        {/* Status */}
        <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold">غرفة الاستجواب</span>
            <span className="text-primary font-mono">{state.interrogatedSuspects.length}/3</span>
          </div>
        </motion.div>

        {/* Suspects */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {SUSPECTS.map((suspect, i) => {
            const pos = [{ left: "12%", bottom: "25%" }, { left: "45%", bottom: "20%" }, { left: "78%", bottom: "25%" }][i];
            return (
              <motion.div key={suspect.id} className="absolute pointer-events-auto" style={pos} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 + 0.5 }}>
                <motion.img src={suspectImages[suspect.id]} alt={suspect.name} className="w-24 h-24 object-contain drop-shadow-2xl" animate={suspect.suspicious ? { y: [0, -5, 0] } : {}} transition={{ duration: 2, repeat: Infinity }} />
                <div className={cn("absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap", state.interrogatedSuspects.includes(suspect.id) ? "bg-primary/80 text-primary-foreground" : "bg-background/90")}>
                  {suspect.name} {state.interrogatedSuspects.includes(suspect.id) && "✓"}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Accuse Button */}
        <AnimatePresence>
          {canAccuse() && !state.caseCompleted && (
            <motion.div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.button onClick={() => setShowAccusePanel(true)} className="flex items-center gap-3 px-8 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg" whileHover={{ scale: 1.05 }} animate={{ boxShadow: ["0 0 20px hsl(var(--destructive) / 0.3)", "0 0 40px hsl(var(--destructive) / 0.5)", "0 0 20px hsl(var(--destructive) / 0.3)"] }} transition={{ duration: 2, repeat: Infinity }}>
                <Scale className="w-6 h-6" /> اتخذ قرارك النهائي
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-8 left-8 z-20"><NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} /></div>
        <div className="absolute bottom-8 right-8 z-20"><NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} /></div>
      </InteractiveRoom>

      {/* Dialogue */}
      {selectedSuspect && (
        <EnhancedDialogue
          dialogues={selectedSuspect.dialogues.map(d => ({ characterId: selectedSuspect.id as "ahmed" | "sara" | "karim", text: d.text, mood: d.mood }))}
          isActive={showDialogue}
          onComplete={handleDialogueComplete}
        />
      )}

      {/* Result */}
      <SceneTransition isVisible={showResult} type={isCorrectAccusation ? "success" : "failure"} backgroundImage={isCorrectAccusation ? suspectArrested : suspectEscaped} title={isCorrectAccusation ? "🎉 القضية محلولة!" : "💨 المجرم هرب!"} subtitle={isCorrectAccusation ? `أحسنت! كريم كان المختلس. النقاط: ${state.score}` : "اتهمت الشخص الخطأ. حاول مرة أخرى!"}>
        <div className="space-y-4">
          {isCorrectAccusation && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {state.unlockedConcepts.map(id => {
                const c = LEARNING_CONCEPTS.find(x => x.id === id);
                return c && <span key={id} className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">{c.icon} {c.title}</span>;
              })}
            </div>
          )}
          <motion.button className={cn("px-8 py-4 rounded-xl font-bold text-lg", isCorrectAccusation ? "bg-green-500 text-white" : "bg-destructive text-white")} onClick={() => { setShowResult(false); onNavigate("intro"); }} whileHover={{ scale: 1.05 }}>
            {isCorrectAccusation ? "🎉 العودة للقائمة" : "🔄 حاول مرة أخرى"}
          </motion.button>
        </div>
      </SceneTransition>
    </>
  );
};
