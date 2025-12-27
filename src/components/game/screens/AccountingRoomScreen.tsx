import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, User, ArrowRight } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { GameCard } from "../GameCard";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS, CHARACTERS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import accountingRoomBg from "@/assets/rooms/accounting-room.png";

interface AccountingRoomScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots للمحاسبة: Evidence 02, 03, 06 + سارة
const hotspots = [
  { id: "evidence-02", x: 10, y: 30, width: 20, height: 35, label: "📑 ملف الفواتير", icon: "📑" },
  { id: "evidence-03", x: 35, y: 25, width: 18, height: 30, label: "💳 ملف المدفوعات", icon: "💳" },
  { id: "evidence-06", x: 60, y: 35, width: 15, height: 25, label: "📝 فاتورة معدلة", icon: "📝" },
  { id: "sara", x: 78, y: 30, width: 18, height: 50, label: "سارة - المحاسبة", icon: "👩‍💼" },
];

export const AccountingRoomScreen = ({ onNavigate }: AccountingRoomScreenProps) => {
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
  const [showSaraDialogue, setShowSaraDialogue] = useState(false);
  const [currentDialogueResponse, setCurrentDialogueResponse] = useState<string | null>(null);

  const sara = CHARACTERS.find(c => c.id === "sara")!;
  const trust = getOverallTrust();

  const handleHotspotClick = (id: string) => {
    if (id === "sara") {
      setShowSaraDialogue(true);
      setCurrentDialogueResponse(sara.initialStatement);
      playSound("click");
      return;
    }

    const evidence = EVIDENCE_ITEMS.find(e => e.id === id);
    if (evidence) {
      if (!isEvidenceUnlocked(evidence.id)) {
        if (evidence.id === "evidence-03") {
          toast.error("تحتاج موافقة معتز أولاً!");
        } else if (evidence.id === "evidence-06") {
          toast.error("اكتشف المزيد من الأدلة أولاً!");
        }
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

  const handleSaraChoice = (choice: any, dialogueId: string) => {
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
            source: "accounting",
            characterId: "sara",
          });
          toast.success("تم تسجيل معلومة!");
        }
        break;
      case "trust_up":
      case "trust_down":
        if (choice.trustChange) {
          modifyTrust(choice.trustChange.entity, choice.trustChange.amount);
        }
        break;
    }
    
    if (choice.followUp) {
      setCurrentDialogueResponse(choice.followUp);
    }
    playSound("reveal");
  };

  const getAvailableSaraDialogues = () => {
    return sara.dialogues.filter(d => {
      if (hasCompletedDialogue(d.id)) return false;
      if (d.trigger === "first_visit") return true;
      if (d.trigger === "has_insight" && d.requiredInsight) {
        return hasInsight(d.requiredInsight);
      }
      return false;
    });
  };

  const availableSaraDialogues = getAvailableSaraDialogues();

  const renderEvidenceData = (data: any) => {
    if (!data) return <p className="text-muted-foreground">لا توجد بيانات</p>;

    switch (data.type) {
      case "invoices":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">المورد</th>
                  <th className="text-right p-2">المنتج</th>
                  <th className="text-right p-2">الكمية</th>
                  <th className="text-right p-2">الإجمالي</th>
                  <th className="text-right p-2">إيصال</th>
                </tr>
              </thead>
              <tbody>
                {data.invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{inv.date}</td>
                    <td className="p-2 text-foreground">{inv.supplier}</td>
                    <td className="p-2 text-foreground">{inv.item}</td>
                    <td className="p-2 text-foreground">{inv.qty}</td>
                    <td className="p-2 text-destructive font-mono">{inv.total.toLocaleString()}</td>
                    <td className="p-2 text-center">{inv.hasReceipt ? <CheckCircle className="w-4 h-4 text-green-400 inline" /> : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "payments":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">المورد</th>
                  <th className="text-right p-2">المبلغ</th>
                  <th className="text-right p-2">الطريقة</th>
                  <th className="text-right p-2">بعد الفاتورة</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{p.date}</td>
                    <td className="p-2 text-foreground">{p.supplier}</td>
                    <td className="p-2 text-destructive font-mono">{p.amount.toLocaleString()}</td>
                    <td className="p-2 text-foreground">{p.method}</td>
                    <td className={cn("p-2", p.daysAfterInvoice <= 1 ? "text-amber-400 font-bold" : "text-foreground")}>
                      {p.daysAfterInvoice} يوم
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "modified_invoice":
        return (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <h4 className="font-bold text-destructive mb-4">⚠️ فاتورة معدلة!</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">الكمية الأصلية:</span> <span className="text-foreground">{data.originalQty}</span></p>
              <p><span className="text-muted-foreground">الكمية المعدلة:</span> <span className="text-destructive font-bold">{data.modifiedQty}</span></p>
              <p><span className="text-muted-foreground">المجموع الأصلي:</span> <span className="text-foreground">{data.originalTotal.toLocaleString()}</span></p>
              <p><span className="text-muted-foreground">المجموع المعدل:</span> <span className="text-destructive font-bold">{data.modifiedTotal.toLocaleString()}</span></p>
              <p className="text-amber-400 mt-4 p-2 bg-amber-500/10 rounded">{data.modifiedBy}</p>
            </div>
          </div>
        );

      default:
        return <p className="text-muted-foreground">نوع بيانات غير معروف</p>;
    }
  };

  const renderContent = () => {
    if (showSaraDialogue) {
      return (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl">👩‍💼</div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{sara.name}</h3>
              <p className="text-muted-foreground">{sara.role}</p>
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

          {availableSaraDialogues.length > 0 ? (
            <div className="space-y-4">
              {availableSaraDialogues.map((dialogue) => (
                <div key={dialogue.id} className="p-4 rounded-xl bg-card/50 border border-border">
                  <p className="text-foreground mb-4">{dialogue.text}</p>
                  <div className="space-y-2">
                    {dialogue.choices.map((choice) => (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleSaraChoice(choice, dialogue.id)}
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
            onClick={() => setShowSaraDialogue(false)}
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
      backgroundImage={accountingRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activePanel || (showSaraDialogue ? "sara" : null)}
      overlayContent={renderContent()}
      onCloseOverlay={() => { setActivePanel(null); setShowSaraDialogue(false); setSelectedEvidence(null); }}
    >
      {/* Trust bar */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-6 py-3 rounded-full backdrop-blur-xl border",
          trust > 70 ? "bg-green-500/20 border-green-500/30" :
          trust > 40 ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="font-bold text-foreground">📊 المحاسبة</span>
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
