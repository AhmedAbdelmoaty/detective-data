import { useState } from "react";
import { motion } from "framer-motion";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { GameCard } from "../GameCard";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS, CHARACTERS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import projectsRoomBg from "@/assets/rooms/projects-room.png";

interface ProjectsRoomScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots للمشاريع: Evidence 07 + فادي
const hotspots = [
  { id: "evidence-07", x: 15, y: 30, width: 25, height: 40, label: "📊 قائمة المشاريع", icon: "📊" },
  { id: "fadi", x: 60, y: 25, width: 30, height: 55, label: "فادي - مدير المشاريع", icon: "👨‍💼" },
];

export const ProjectsRoomScreen = ({ onNavigate }: ProjectsRoomScreenProps) => {
  const { 
    state, 
    collectEvidence, 
    isEvidenceUnlocked, 
    isEvidenceCollected,
    viewEvidence,
    unlockEvidence,
    modifyTrust,
    addNote,
    completeDialogue,
    hasCompletedDialogue,
    hasInsight,
    getOverallTrust,
  } = useGame();
  const { playSound } = useSound();
  
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);
  const [showFadiDialogue, setShowFadiDialogue] = useState(false);
  const [currentDialogueResponse, setCurrentDialogueResponse] = useState<string | null>(null);

  const fadi = CHARACTERS.find(c => c.id === "fadi")!;
  const trust = getOverallTrust();

  const handleHotspotClick = (id: string) => {
    if (id === "fadi") {
      setShowFadiDialogue(true);
      setCurrentDialogueResponse(fadi.initialStatement);
      playSound("click");
      return;
    }

    const evidence = EVIDENCE_ITEMS.find(e => e.id === id);
    if (evidence) {
      if (!isEvidenceUnlocked(evidence.id)) {
        toast.error("هذا الدليل مقفل!");
        playSound("error");
        return;
      }
      setSelectedEvidence(evidence);
      setActivePanel("evidence");
      viewEvidence(evidence.id);
      playSound("click");
    }
  };

  const handleCollect = () => {
    if (selectedEvidence) {
      collectEvidence(selectedEvidence.id);
      playSound("collect");
      toast.success("تم جمع الدليل!");
    }
  };

  const handleFadiChoice = (choice: any, dialogueId: string) => {
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
            source: "projects",
            characterId: "fadi",
          });
          toast.success("تم تسجيل معلومة!");
        }
        break;
      case "trust_up":
      case "trust_down":
        if (choice.trustChange) {
          modifyTrust(choice.trustChange.entity, choice.trustChange.amount);
          if (choice.trustChange.amount < 0) {
            toast.error("انخفضت الثقة في إدارة المشاريع!");
          }
        }
        break;
    }
    
    if (choice.followUp) {
      setCurrentDialogueResponse(choice.followUp);
    }
    playSound("reveal");
  };

  const getAvailableFadiDialogues = () => {
    return fadi.dialogues.filter(d => {
      if (hasCompletedDialogue(d.id)) return false;
      if (d.trigger === "first_visit") return true;
      if (d.trigger === "has_insight" && d.requiredInsight) {
        return hasInsight(d.requiredInsight);
      }
      return false;
    });
  };

  const availableFadiDialogues = getAvailableFadiDialogues();

  const renderEvidenceData = (data: any) => {
    if (!data) return <p className="text-muted-foreground">لا توجد بيانات</p>;

    if (data.type === "projects") {
      return (
        <div className="max-h-64 overflow-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary/30 sticky top-0">
              <tr>
                <th className="text-right p-2">المشروع</th>
                <th className="text-right p-2">الفترة</th>
                <th className="text-right p-2">الاستهلاك المتوقع</th>
                <th className="text-right p-2">المشترى فعلياً</th>
              </tr>
            </thead>
            <tbody>
              {data.projects.map((p: any) => {
                const expected = p.expectedUsage.split("-").map(Number);
                const overBudget = p.actualBought > expected[1];
                return (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{p.name}</td>
                    <td className="p-2 text-foreground">{p.period}</td>
                    <td className="p-2 text-foreground">{p.expectedUsage}</td>
                    <td className={cn("p-2 font-mono", overBudget ? "text-destructive font-bold" : "text-foreground")}>
                      {p.actualBought}
                      {overBudget && " ⚠️"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    return <p className="text-muted-foreground">نوع بيانات غير معروف</p>;
  };

  const renderContent = () => {
    if (showFadiDialogue) {
      return (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 max-w-3xl w-full">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl">👨‍💼</div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{fadi.name}</h3>
              <p className="text-muted-foreground">{fadi.role}</p>
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

          {availableFadiDialogues.length > 0 ? (
            <div className="space-y-4">
              {availableFadiDialogues.map((dialogue) => (
                <div key={dialogue.id} className="p-4 rounded-xl bg-card/50 border border-border">
                  <p className="text-foreground mb-4">{dialogue.text}</p>
                  <div className="space-y-2">
                    {dialogue.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleFadiChoice(choice, dialogue.id)}
                        className="w-full p-3 rounded-lg bg-secondary/50 border border-border hover:border-purple-500 text-right text-foreground"
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
            onClick={() => setShowFadiDialogue(false)}
            className="mt-6 w-full py-3 rounded-xl bg-secondary text-foreground"
          >
            إغلاق
          </button>
        </motion.div>
      );
    }

    if (activePanel === "evidence" && selectedEvidence) {
      const isCollected = isEvidenceCollected(selectedEvidence.id);
      return (
        <GameCard title={selectedEvidence.name} iconEmoji={selectedEvidence.icon} className="w-full max-w-4xl">
          <div className="space-y-4 p-2">
            <p className="text-muted-foreground">{selectedEvidence.description}</p>
            {renderEvidenceData(selectedEvidence.data)}
            
            {!isCollected ? (
              <motion.button
                onClick={handleCollect}
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
    }

    return null;
  };

  return (
    <InteractiveRoom
      backgroundImage={projectsRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activePanel || (showFadiDialogue ? "fadi" : null)}
      overlayContent={renderContent()}
      onCloseOverlay={() => { setActivePanel(null); setShowFadiDialogue(false); setSelectedEvidence(null); }}
    >
      {/* Room label */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-6 py-3 rounded-full backdrop-blur-xl border",
          trust > 70 ? "bg-green-500/20 border-green-500/30" :
          trust > 40 ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="font-bold text-foreground">📋 إدارة المشاريع</span>
          <span className="mr-4 text-muted-foreground">الثقة: {trust}%</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="مكتب معتز" onClick={() => onNavigate("manager-office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="📦" label="المخزن" onClick={() => onNavigate("warehouse")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis-lab")} />
      </div>
    </InteractiveRoom>
  );
};
