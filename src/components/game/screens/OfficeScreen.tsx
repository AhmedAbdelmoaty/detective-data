import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, BookOpen } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, INTRO_DIALOGUES, ABU_SAEED_EXTRA_DIALOGUES, ENDINGS, HYPOTHESES } from "@/data/case1";
import detectiveOffice from "@/assets/rooms/detective-office.png";

interface OfficeScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "case-board", x: 20, y: 10, width: 55, height: 45, label: "لوحة القضية", icon: "📋" },
  { id: "abuSaeed", x: 0, y: 30, width: 18, height: 50, label: "أبو سعيد", icon: "👔" },
];

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const { state, getProgress, markIntroSeen, addToNotebook, markInterviewComplete } = useGame();
  const { playSound } = useSound();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showIntroDialogue, setShowIntroDialogue] = useState(!state.hasSeenIntroDialogue);
  const [dialogueComplete, setDialogueComplete] = useState(state.hasSeenIntroDialogue);
  const [showExtraDialogue, setShowExtraDialogue] = useState(false);
  const [showConclusionDialogue, setShowConclusionDialogue] = useState(false);

  useEffect(() => {
    if (!state.hasSeenIntroDialogue) return;
    setDialogueComplete(true);
    setShowIntroDialogue(false);
  }, [state.hasSeenIntroDialogue]);

  const canCloseByOutside = (dialogueId: "intro" | "extra" | "conclusion") => {
    if (dialogueId === "intro") return state.hasSeenIntroDialogue;
    if (dialogueId === "extra") return state.completedInterviews.includes("abuSaeed-extra");
    if (dialogueId === "conclusion") return state.completedInterviews.includes("abuSaeed-conclusion");
    return false;
  };

  const handleRestartIntroDialogue = () => {
    setShowIntroDialogue(true);
    playSound("click");
  };

  const handleHotspotClick = (id: string) => {
    if (!dialogueComplete) return;
    if (id === "abuSaeed") {
      setShowExtraDialogue(true);
    } else {
      setActivePanel(id);
    }
    playSound("click");
  };

  const handleDialogueComplete = () => {
    setDialogueComplete(true);
    setShowIntroDialogue(false);
    markIntroSeen();
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "interview", sourceId: saveId });
  };

  const savedNoteIds = state.notebook.map(n => n.sourceId);
  const progress = getProgress();
  const canSubmitReport = state.finalHypothesis !== null && state.gameStatus === "solved";

  // Handle conclusion: if player has selected final hypothesis and comes back to office
  const handleStartConclusion = () => {
    setShowConclusionDialogue(true);
  };

  const ending = state.gameStatus === "solved" ? (() => {
    const { selectedHypotheses, finalHypothesis, notebook } = state;
    if (!selectedHypotheses.includes("H3")) return ENDINGS.find(e => e.type === "missing");
    const h = finalHypothesis;
    const hypothesis = h ? { isCorrect: h === "H3" } : null;
    if (!hypothesis?.isCorrect) return ENDINGS.find(e => e.type === "wrong");
    const diagCount = ["E1", "E2", "I5"].filter(id => notebook.some(n => n.sourceId === id)).length;
    return diagCount >= 2 ? ENDINGS.find(e => e.type === "excellent") : ENDINGS.find(e => e.type === "partial");
  })() : null;

  // Build dynamic dialogues for "wrong" ending - inject hypothesis name
  const getEndingDialogues = () => {
    if (!ending) return [];
    if (ending.type === "wrong" && state.finalHypothesis) {
      const chosenH = HYPOTHESES.find(h => h.id === state.finalHypothesis);
      return ending.abuSaeedDialogues.map(d => ({
        ...d,
        text: d.text.replace("{HYPOTHESIS_NAME}", chosenH?.text || ""),
      }));
    }
    return ending.abuSaeedDialogues;
  };

  const renderPanelContent = () => {
    if (activePanel === "case-board") {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-auto">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {CASE_INFO.title}
          </h3>
          <p className="text-muted-foreground mb-4">{CASE_INFO.description}</p>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              ملخص القضية
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{CASE_INFO.briefing}</p>
          </div>

          {/* Notebook preview */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              دفتر الملاحظات ({state.notebook.length} ملاحظات)
            </h4>
            {state.notebook.length === 0 ? (
              <p className="text-sm text-muted-foreground">لم تحفظ أي ملاحظات بعد. اجمع الأدلة وتكلم مع الشخصيات!</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-auto">
                {state.notebook.map(n => (
                  <div key={n.id} className="text-sm text-foreground p-2 rounded bg-card/50 border border-border">
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <span className="text-primary font-bold">التقدم: {progress}%</span>
            <div className="w-full h-2 bg-secondary rounded-full mt-2">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      );
    }
    return null;
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
        {/* Score */}
        <motion.div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-amber-400 font-bold">{state.score} نقطة</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-primary font-bold">📓 {state.notebook.length}</span>
          </div>
        </motion.div>

        {/* Submit report button (only when conclusion ready) */}
        {canSubmitReport && !showConclusionDialogue && (
          <motion.button
            className="absolute top-4 left-4 z-20 px-6 py-3 rounded-lg font-bold text-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={handleStartConclusion}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            📤 قدم التقرير لأبو سعيد
          </motion.button>
        )}

        {state.hasSeenIntroDialogue && !showIntroDialogue && (
          <motion.button
            className="absolute top-20 left-4 z-20 px-4 py-2 rounded-lg font-bold border border-primary/40 bg-background/80 backdrop-blur-sm text-primary"
            onClick={handleRestartIntroDialogue}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
          >
            🔁 إعادة المحادثة
          </motion.button>
        )}
        
        {/* Room navigation */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
          <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
          <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
          <NavigationButton iconEmoji="📊" label="البيانات" onClick={() => onNavigate("dashboard")} />
          <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis")} />
        </div>
      </InteractiveRoom>

      {/* Intro dialogue */}
      {showIntroDialogue && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            if (canCloseByOutside("intro")) {
              setShowIntroDialogue(false);
            }
          }}
        >
          <EnhancedDialogue
            dialogues={INTRO_DIALOGUES}
            isActive={true}
            onComplete={handleDialogueComplete}
            onClose={() => setShowIntroDialogue(false)}
            onSaveNote={handleSaveNote}
            savedNoteIds={savedNoteIds}
          />
        </motion.div>
      )}

      {/* Extra Abu Saeed dialogue */}
      {showExtraDialogue && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            if (canCloseByOutside("extra")) {
              setShowExtraDialogue(false);
            }
          }}
        >
          <EnhancedDialogue
            dialogues={ABU_SAEED_EXTRA_DIALOGUES}
            isActive={true}
            onComplete={() => {
              setShowExtraDialogue(false);
              if (!state.completedInterviews.includes("abuSaeed-extra")) {
                markInterviewComplete("abuSaeed-extra");
              }
            }}
            onClose={() => setShowExtraDialogue(false)}
            />
        </motion.div>
      )}

      {/* Conclusion dialogue */}
      {showConclusionDialogue && ending && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            if (canCloseByOutside("conclusion")) {
              setShowConclusionDialogue(false);
            }
          }}
        >
          <EnhancedDialogue
            dialogues={getEndingDialogues()}
            isActive={true}
            onComplete={() => {
              if (!state.completedInterviews.includes("abuSaeed-conclusion")) {
                markInterviewComplete("abuSaeed-conclusion");
              }
              setShowConclusionDialogue(false);
              onNavigate("result");
            }}
            onClose={() => setShowConclusionDialogue(false)}
          />
        </motion.div>
      )}
    </>
  );
};
