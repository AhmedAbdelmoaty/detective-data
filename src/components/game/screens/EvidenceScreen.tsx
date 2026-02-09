import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, X, Eye } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS } from "@/data/case1";
import { toast } from "sonner";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots for 7 evidence items
const hotspots = EVIDENCE_ITEMS.map((ev, i) => ({
  id: ev.id,
  x: 5 + i * 13,
  y: 20,
  width: 12,
  height: 25,
  label: `${ev.icon} ${ev.name}`,
  icon: ev.icon,
}));

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, viewEvidence, isEvidenceViewed, addToNotebook, isInNotebook } = useGame();
  const { playSound } = useSound();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);

  const handleHotspotClick = (hotspotId: string) => {
    const evidence = EVIDENCE_ITEMS.find(e => e.id === hotspotId);
    if (evidence) {
      setSelectedEvidence(evidence);
      setShowOverlay(true);
      if (!isEvidenceViewed(evidence.id)) {
        viewEvidence(evidence.id);
      }
      playSound("click");
    }
  };

  const handleSaveToNotebook = () => {
    if (selectedEvidence && !isInNotebook(selectedEvidence.id)) {
      addToNotebook({
        text: selectedEvidence.saveText,
        source: "evidence",
        sourceId: selectedEvidence.id,
      });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const isSaved = selectedEvidence ? isInNotebook(selectedEvidence.id) : false;

  const renderEvidenceContent = (evidence: typeof EVIDENCE_ITEMS[0]) => {
    const { data, type } = evidence;

    switch (type) {
      case "table":
        if (evidence.id === "E1") {
          return (
            <div className="space-y-4">
              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-right p-3 text-foreground">الفئة</th>
                      <th className="text-right p-3 text-foreground">خرج من المخزون</th>
                      <th className="text-right p-3 text-foreground">مسجّل في الفواتير</th>
                      <th className="text-right p-3 text-destructive">الفرق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-3 text-foreground">{row.category}</td>
                        <td className="p-3 text-foreground">{row.stockOut}</td>
                        <td className="p-3 text-foreground">{row.invoiced}</td>
                        <td className="p-3 text-destructive font-bold">-{row.diff}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-destructive/10">
                    <tr>
                      <td className="p-3 font-bold text-foreground">المجموع</td>
                      <td className="p-3 font-bold text-foreground">{data.totalStockOut}</td>
                      <td className="p-3 font-bold text-foreground">{data.totalInvoiced}</td>
                      <td className="p-3 font-bold text-destructive">-{data.totalDiff}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="text-destructive text-sm p-3 bg-destructive/10 rounded-lg">⚠️ فرق {data.totalDiff} قطعة بين المخزون والفواتير!</p>
            </div>
          );
        }
        // E4 - season comparison
        return (
          <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
            <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
              <span className="text-muted-foreground">{data.lastYear.period}</span>
              <span className="text-neon-green font-bold text-xl">{data.lastYear.sales.toLocaleString()} ر.س</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-card/50 rounded-lg">
              <span className="text-muted-foreground">{data.thisYear.period}</span>
              <span className="text-destructive font-bold text-xl">{data.thisYear.sales.toLocaleString()} ر.س</span>
            </div>
            <p className="text-center text-destructive font-bold text-lg">الفرق: {data.difference}</p>
            <p className="text-sm text-muted-foreground">{data.note}</p>
          </div>
        );

      case "report":
        if (evidence.id === "E3") {
          return (
            <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl space-y-3 font-mono text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">الحالة:</span><span className="text-neon-green font-bold">{data.status}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">آخر عطل:</span><span className="text-foreground">{data.lastError}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">رسائل خطأ:</span><span className="text-foreground">{data.errorCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">وقت التشغيل:</span><span className="text-neon-green">{data.uptime}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">آخر صيانة:</span><span className="text-foreground">{data.lastMaintenance}</span></div>
            </div>
          );
        }
        // E2 - cameras
        return (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <p className="text-3xl font-bold text-foreground">{data.bagsOut}</p>
                <p className="text-sm text-muted-foreground">أكياس خارجة</p>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg">
                <p className="text-3xl font-bold text-foreground">{data.invoicesRecorded}</p>
                <p className="text-sm text-muted-foreground">فواتير مسجلة</p>
              </div>
            </div>
            <div className="text-center p-3 bg-destructive/20 rounded-lg">
              <p className="text-destructive font-bold text-xl">الفرق: {data.difference} عملية بدون فاتورة!</p>
            </div>
            <p className="text-sm text-muted-foreground">الفترة: {data.period}</p>
          </div>
        );

      case "review":
        return (
          <div className="space-y-3">
            <div className="text-center p-3 bg-accent/10 rounded-lg mb-4">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold text-accent ml-2">{data.average}/5</span>
              <span className="text-muted-foreground text-sm ml-2">متوسط التقييم</span>
            </div>
            {data.reviews.map((review: any, i: number) => (
              <div key={i} className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground text-sm">{review.name}</span>
                  <span className="text-accent">{"⭐".repeat(review.rating)}</span>
                </div>
                <p className="text-foreground text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        );

      case "brochure":
        return (
          <div className="p-6 bg-card/50 rounded-xl border-2 border-dashed border-accent/30 text-center space-y-4">
            <p className="text-3xl">🏪</p>
            <h4 className="text-xl font-bold text-accent">{data.name}</h4>
            <p className="text-foreground font-bold">{data.specialty}</p>
            <p className="text-muted-foreground text-sm">{data.type}</p>
            <p className="text-muted-foreground text-sm">المسافة: {data.distance}</p>
          </div>
        );

      case "note":
        return (
          <div className="p-6 bg-amber-950/30 rounded-xl border border-amber-500/20" style={{ fontFamily: "cursive" }}>
            <p className="text-foreground text-lg leading-relaxed italic">"{data.content}"</p>
            <p className="text-muted-foreground text-sm mt-4 text-left">📅 {data.date}</p>
            <p className="text-amber-400 text-sm mt-2">💡 {data.note}</p>
          </div>
        );

      default:
        return <p className="text-muted-foreground">محتوى غير متاح</p>;
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

          {renderEvidenceContent(selectedEvidence)}

          <motion.button
            onClick={handleSaveToNotebook}
            disabled={isSaved}
            className={`mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
              isSaved
                ? "bg-neon-green/20 border border-neon-green/50 text-neon-green"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            whileHover={!isSaved ? { scale: 1.02 } : {}}
          >
            {isSaved ? <Check className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
            {isSaved ? "✓ محفوظ في الدفتر" : "📓 احفظ في الدفتر"}
          </motion.button>
        </motion.div>
      ) : null}
      onCloseOverlay={() => setShowOverlay(false)}
    >
      {/* Status bar */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <span className="font-bold text-foreground">📁 غرفة الأدلة</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">{state.viewedEvidence.length}/{EVIDENCE_ITEMS.length} مشاهدة</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-primary font-bold">📓 {state.notebook.length}</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
        <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
        <NavigationButton iconEmoji="📊" label="البيانات" onClick={() => onNavigate("dashboard")} />
        <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </InteractiveRoom>
  );
};
