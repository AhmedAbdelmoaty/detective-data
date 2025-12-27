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
import warehouseRoomBg from "@/assets/rooms/warehouse-room.png";

interface WarehouseRoomScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots للمخزن: Evidence 04, 05 + محمود
const hotspots = [
  { id: "evidence-04", x: 10, y: 35, width: 22, height: 35, label: "📓 دفتر الاستلام", icon: "📓" },
  { id: "evidence-05", x: 38, y: 30, width: 20, height: 30, label: "📋 دفتر الصرف", icon: "📋" },
  { id: "mahmoud", x: 70, y: 25, width: 25, height: 55, label: "محمود - أمين المخزن", icon: "👷" },
];

export const WarehouseRoomScreen = ({ onNavigate }: WarehouseRoomScreenProps) => {
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
    getOverallTrust,
  } = useGame();
  const { playSound } = useSound();
  
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);
  const [showMahmoudDialogue, setShowMahmoudDialogue] = useState(false);
  const [currentDialogueResponse, setCurrentDialogueResponse] = useState<string | null>(null);

  const mahmoud = CHARACTERS.find(c => c.id === "mahmoud")!;
  const trust = getOverallTrust();

  const handleHotspotClick = (id: string) => {
    if (id === "mahmoud") {
      setShowMahmoudDialogue(true);
      setCurrentDialogueResponse(mahmoud.initialStatement);
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

  const handleMahmoudChoice = (choice: any, dialogueId: string) => {
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
            source: "warehouse",
            characterId: "mahmoud",
          });
          toast.success("تم تسجيل معلومة مهمة!");
        }
        break;
      case "trust_up":
      case "trust_down":
        if (choice.trustChange) {
          modifyTrust(choice.trustChange.entity, choice.trustChange.amount);
          if (choice.trustChange.amount < 0) {
            toast.error("انخفضت الثقة في المخزن!");
          }
        }
        break;
    }
    
    if (choice.followUp) {
      setCurrentDialogueResponse(choice.followUp);
    }
    playSound("reveal");
  };

  const getAvailableMahmoudDialogues = () => {
    return mahmoud.dialogues.filter(d => {
      if (hasCompletedDialogue(d.id)) return false;
      if (d.trigger === "first_visit") return true;
      return false;
    });
  };

  const availableMahmoudDialogues = getAvailableMahmoudDialogues();

  const renderEvidenceData = (data: any) => {
    if (!data) return <p className="text-muted-foreground">لا توجد بيانات</p>;

    switch (data.type) {
      case "receipts":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">المنتج</th>
                  <th className="text-right p-2">الكمية</th>
                  <th className="text-right p-2">التوقيع</th>
                  <th className="text-right p-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{e.date}</td>
                    <td className="p-2 text-foreground">{e.item}</td>
                    <td className="p-2 text-foreground">{e.qty}</td>
                    <td className={cn("p-2", e.signature === "?" || e.signature === "؟" ? "text-amber-400" : "text-foreground")}>
                      {e.signature}
                    </td>
                    <td className={cn("p-2 text-xs", e.notes ? "text-amber-400 font-bold" : "text-muted-foreground")}>
                      {e.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "dispatch":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">المشروع</th>
                  <th className="text-right p-2">المنتج</th>
                  <th className="text-right p-2">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{e.date}</td>
                    <td className="p-2 text-foreground">{e.project}</td>
                    <td className="p-2 text-foreground">{e.item}</td>
                    <td className="p-2 text-foreground">{e.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <p className="text-muted-foreground">نوع بيانات غير معروف</p>;
    }
  };

  const renderContent = () => {
    if (showMahmoudDialogue) {
      return (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 max-w-3xl w-full">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-3xl">👷</div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{mahmoud.name}</h3>
              <p className="text-muted-foreground">{mahmoud.role}</p>
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

          {availableMahmoudDialogues.length > 0 ? (
            <div className="space-y-4">
              {availableMahmoudDialogues.map((dialogue) => (
                <div key={dialogue.id} className="p-4 rounded-xl bg-card/50 border border-border">
                  <p className="text-foreground mb-4">{dialogue.text}</p>
                  <div className="space-y-2">
                    {dialogue.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleMahmoudChoice(choice, dialogue.id)}
                        className="w-full p-3 rounded-lg bg-secondary/50 border border-border hover:border-amber-500 text-right text-foreground"
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
            onClick={() => setShowMahmoudDialogue(false)}
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
      backgroundImage={warehouseRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activePanel || (showMahmoudDialogue ? "mahmoud" : null)}
      overlayContent={renderContent()}
      onCloseOverlay={() => { setActivePanel(null); setShowMahmoudDialogue(false); setSelectedEvidence(null); }}
    >
      {/* Room label */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-6 py-3 rounded-full backdrop-blur-xl border",
          trust > 70 ? "bg-green-500/20 border-green-500/30" :
          trust > 40 ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="font-bold text-foreground">📦 المخزن</span>
          <span className="mr-4 text-muted-foreground">الثقة: {trust}%</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="مكتب معتز" onClick={() => onNavigate("manager-office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="📊" label="المحاسبة" onClick={() => onNavigate("accounting")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis-lab")} />
      </div>
    </InteractiveRoom>
  );
};
