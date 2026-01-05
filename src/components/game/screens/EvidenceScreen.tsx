import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Pin, X, Eye } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "ev1", x: 5, y: 20, width: 12, height: 25, label: "📧 بريد التسويق", icon: "📧" },
  { id: "ev2", x: 18, y: 20, width: 12, height: 25, label: "🖥️ سجل الخادم", icon: "🖥️" },
  { id: "ev3", x: 31, y: 20, width: 12, height: 25, label: "📊 تقرير المبيعات", icon: "📊" },
  { id: "ev4", x: 44, y: 20, width: 12, height: 25, label: "📝 شكوى عميل", icon: "📝" },
  { id: "ev5", x: 57, y: 20, width: 12, height: 25, label: "📢 نص الإعلان", icon: "📢" },
  { id: "ev6", x: 70, y: 20, width: 12, height: 25, label: "👥 قائمة العملاء", icon: "👥" },
  { id: "ev7", x: 83, y: 20, width: 12, height: 25, label: "📰 أخبار المنافسين", icon: "📰" },
];

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { 
    state, 
    visitEvidence, 
    togglePinEvidence, 
    isEvidenceVisited, 
    isEvidencePinned,
    discoverInsight,
    hasInsight,
  } = useGame();
  const { playSound } = useSound();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);

  const handleHotspotClick = (hotspotId: string) => {
    const evidence = EVIDENCE_ITEMS.find(e => e.id === hotspotId);
    if (evidence) {
      setSelectedEvidence(evidence);
      setShowOverlay(true);
      
      // Visit evidence if not already visited
      if (!isEvidenceVisited(evidence.id)) {
        visitEvidence(evidence.id, evidence.cost);
        
        // Check for insight discoveries
        if (evidence.id === "ev5" && isEvidenceVisited("ev6") && !hasInsight("insight-wrong-audience")) {
          discoverInsight("insight-wrong-audience");
          toast.success("اكتشاف! الجمهور المستهدف خاطئ");
        }
        if (evidence.id === "ev6" && isEvidenceVisited("ev5") && !hasInsight("insight-wrong-audience")) {
          discoverInsight("insight-wrong-audience");
          toast.success("اكتشاف! الجمهور المستهدف خاطئ");
        }
      }
      
      playSound("click");
    }
  };

  const handleTogglePin = () => {
    if (selectedEvidence) {
      if (!isEvidencePinned(selectedEvidence.id) && state.pinnedEvidenceIds.length >= 5) {
        toast.error("لا يمكن تثبيت أكثر من 5 أدلة!");
        return;
      }
      togglePinEvidence(selectedEvidence.id);
      playSound("collect");
      
      if (!isEvidencePinned(selectedEvidence.id)) {
        toast.success("تم تثبيت الدليل");
      } else {
        toast.info("تم إلغاء التثبيت");
      }
    }
  };

  const isVisited = selectedEvidence ? isEvidenceVisited(selectedEvidence.id) : false;
  const isPinned = selectedEvidence ? isEvidencePinned(selectedEvidence.id) : false;

  const renderEvidenceData = (data: any) => {
    if (!data) return <p className="text-muted-foreground">لا توجد بيانات</p>;

    switch (data.type) {
      case "email":
        return (
          <div className="space-y-3 p-4 bg-secondary/30 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">من:</span>
              <span className="text-foreground">{data.from}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">إلى:</span>
              <span className="text-foreground">{data.to}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">التاريخ:</span>
              <span className="text-foreground">{data.date}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="font-bold text-foreground mb-2">{data.subject}</p>
              <p className="text-foreground">{data.body}</p>
            </div>
          </div>
        );

      case "log":
        return (
          <div className="space-y-2 p-4 bg-secondary/30 rounded-xl font-mono text-sm">
            <p className="text-foreground">📅 التاريخ: {data.date}</p>
            <p className="text-foreground">⏱️ المدة: {data.duration}</p>
            <p className="text-foreground">📊 التأثير: {data.impact}</p>
            <p className="text-muted-foreground mt-2">💡 {data.note}</p>
          </div>
        );

      case "sales_report":
        return (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <p className="font-bold text-destructive mb-3">⚠️ {data.highlight}</p>
            <div className="space-y-2">
              <p className="text-foreground">العملاء المحتملين: <span className="text-green-400 font-bold">{data.leads_change}</span></p>
              <p className="text-foreground">نسبة التحويل: <span className="text-destructive font-bold">{data.conversion_change}</span></p>
            </div>
            <p className="text-amber-400 mt-3 text-sm">{data.note}</p>
          </div>
        );

      case "complaint":
        return (
          <div className="p-4 bg-secondary/30 rounded-xl">
            <p className="text-foreground mb-2">👤 العميل: {data.customer}</p>
            <p className="text-foreground mb-2">❗ المشكلة: {data.issue}</p>
            <p className="text-muted-foreground text-sm">💡 {data.note}</p>
          </div>
        );

      case "ad":
        return (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-2xl font-bold text-foreground mb-3">{data.headline}</p>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">📱 المنصة: {data.platform}</p>
              <p className="text-foreground">🎨 الأسلوب: <span className="text-amber-400">{data.style}</span></p>
              <p className="text-destructive mt-3">⚠️ {data.issue}</p>
            </div>
          </div>
        );

      case "customer_list":
        return (
          <div className="space-y-4">
            <div className="max-h-48 overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 sticky top-0">
                  <tr>
                    <th className="text-right p-2 text-foreground">الاسم</th>
                    <th className="text-right p-2 text-foreground">العمر</th>
                    <th className="text-right p-2 text-foreground">الوظيفة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.samples.map((c: any, i: number) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-2 text-foreground">{c.name}</td>
                      <td className="p-2 text-foreground">{c.age}</td>
                      <td className="p-2 text-amber-400">{c.occupation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-destructive p-3 bg-destructive/10 rounded-lg">⚠️ {data.conclusion}</p>
          </div>
        );

      case "news":
        return (
          <div className="p-4 bg-secondary/30 rounded-xl">
            <p className="font-bold text-foreground mb-2">📰 {data.headline}</p>
            <p className="text-foreground">التأثير: {data.impact}</p>
            <p className="text-muted-foreground mt-2 text-sm">💡 {data.note}</p>
          </div>
        );

      case "memo":
        return (
          <div className="p-4 bg-secondary/30 rounded-xl">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground">من:</span>
              <span className="text-foreground">{data.from}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-muted-foreground">التاريخ:</span>
              <span className="text-foreground">{data.date}</span>
            </div>
            <p className="text-foreground font-bold p-3 bg-primary/10 rounded-lg">{data.message}</p>
            <p className="text-muted-foreground mt-3 text-sm">💡 {data.note}</p>
          </div>
        );

      default:
        return <p className="text-muted-foreground">نوع بيانات غير معروف</p>;
    }
  };

  return (
    <InteractiveRoom
      backgroundImage={evidenceRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={selectedEvidence?.id || null}
      overlayContent={showOverlay && selectedEvidence ? (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedEvidence.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedEvidence.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEvidence.description}</p>
              </div>
            </div>
            <button onClick={() => setShowOverlay(false)} className="p-2 rounded-lg hover:bg-secondary">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Key evidence badge */}
          {selectedEvidence.isKey && (
            <div className="mb-4 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-amber-400 text-sm font-bold">⭐ دليل مهم</span>
            </div>
          )}

          {renderEvidenceData(selectedEvidence.data)}

          {/* Pin button */}
          <motion.button
            onClick={handleTogglePin}
            className={cn(
              "mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2",
              isPinned 
                ? "bg-green-500/20 border border-green-500/50 text-green-400" 
                : "bg-primary text-primary-foreground"
            )}
            whileHover={{ scale: 1.02 }}
          >
            <Pin className="w-5 h-5" />
            {isPinned ? "✓ دليل مثبت - اضغط لإلغاء التثبيت" : "📌 تثبيت هذا الدليل"}
          </motion.button>
        </motion.div>
      ) : null}
      onCloseOverlay={() => setShowOverlay(false)}
    >
      {/* Status bar */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <span className="font-bold text-foreground">غرفة الأدلة</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">أدلة مفتوحة: {state.visitedEvidenceIds.length}/{EVIDENCE_ITEMS.length}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-primary font-bold">مثبتة: {state.pinnedEvidenceIds.length}/5</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </InteractiveRoom>
  );
};
