import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, X } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { GameOverlay } from "../GameOverlay";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS } from "@/data/case1";
import { toast } from "sonner";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, viewEvidence, isEvidenceViewed, addToNotebook, isInNotebook } = useGame();
  const { playSound } = useSound();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);

  const roomEvidence = EVIDENCE_ITEMS.filter(e => e.room === "evidence");
  
  const hotspots = roomEvidence.map((e, i) => {
    const positions = [
      { x: 5, y: 15 }, { x: 20, y: 15 }, { x: 40, y: 15 },
      { x: 60, y: 15 }, { x: 78, y: 15 }, { x: 5, y: 45 },
      { x: 25, y: 50 }, { x: 55, y: 50 }, { x: 80, y: 50 },
    ];
    const pos = positions[i] || { x: 50, y: 50 };
    const isUnlocked = state.unlockedEvidence.includes(e.id);
    return { id: e.id, x: pos.x, y: pos.y, width: 14, height: 14, label: isUnlocked ? `${e.icon} ${e.name}` : "🔒 مقفول", icon: isUnlocked ? e.icon : "🔒" };
  });

  const handleHotspotClick = (hotspotId: string) => {
    if (!state.unlockedEvidence.includes(hotspotId)) {
      toast.info("الدليل ده مش متاح لسه");
      return;
    }
    const evidence = EVIDENCE_ITEMS.find(e => e.id === hotspotId);
    if (evidence) {
      setSelectedEvidence(evidence);
      setShowOverlay(true);
      if (!isEvidenceViewed(evidence.id)) viewEvidence(evidence.id);
      playSound("click");
    }
  };

  const handleSaveToNotebook = () => {
    if (selectedEvidence && !isInNotebook(selectedEvidence.saveId)) {
      addToNotebook({ text: selectedEvidence.saveText, source: "evidence", sourceId: selectedEvidence.saveId });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const isSaved = selectedEvidence ? isInNotebook(selectedEvidence.saveId) : false;

  const renderEvidenceContent = (evidence: typeof EVIDENCE_ITEMS[0]) => {
    const { data, type, id } = evidence;
    if (type === "table") {
      if (id === "K1") {
        return (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm"><thead className="bg-secondary/50"><tr>
              <th className="text-right p-3 text-foreground">الصنف</th>
              <th className="text-right p-3 text-foreground">السعر</th>
              <th className="text-right p-3 text-foreground">آخر تعديل</th>
            </tr></thead><tbody>
              {data.rows.map((row: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.item}</td>
                  <td className="p-3 text-foreground">{row.price}</td>
                  <td className="p-3 text-muted-foreground">{row.lastUpdate}</td>
                </tr>
              ))}
            </tbody></table>
            <p className="p-3 text-sm text-muted-foreground">{data.note}</p>
          </div>
        );
      }
      if (id === "K4") {
        return (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm"><thead className="bg-secondary/50"><tr>
              {data.headers.map((h: string, i: number) => <th key={i} className="text-right p-3 text-foreground">{h}</th>)}
            </tr></thead><tbody>
              {data.rows.map((row: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.label}</td>
                  <td className="p-3 text-foreground">{typeof row.prev === 'number' ? row.prev.toLocaleString() : row.prev}</td>
                  <td className="p-3 text-primary font-bold">{typeof row.current === 'number' ? row.current.toLocaleString() : row.current}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        );
      }
      if (id === "K5") {
        return (
          <div className="space-y-2">
            <p className="text-sm font-bold text-foreground">{data.title}</p>
            <p className="text-xs text-muted-foreground">{data.subtitle}</p>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm"><thead className="bg-secondary/50"><tr>
                <th className="text-right p-2 text-foreground">التاريخ</th>
                <th className="text-right p-2 text-foreground">اليوم</th>
                <th className="text-right p-2 text-foreground">فواتير</th>
                <th className="text-right p-2 text-foreground">مدفوعات</th>
                <th className="text-right p-2 text-foreground">فرق</th>
              </tr></thead><tbody>
                {data.rows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{row.date}</td>
                    <td className="p-2 text-foreground">{row.day}</td>
                    <td className="p-2 text-foreground">{row.invoices}</td>
                    <td className="p-2 text-foreground">{row.payments}</td>
                    <td className="p-2 text-neon-green font-bold">{row.diff}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
        );
      }
    }
    if (type === "document" && id === "K6") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h4 className="font-bold text-foreground text-sm mb-2">{data.page1.title}</h4>
            {data.page1.rows.map((row: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-border/30">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h4 className="font-bold text-foreground text-sm mb-2">{data.page2.title}</h4>
            {data.page2.rows.map((row: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-border/30">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="text-foreground">{row.value}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">{data.page2.note}</p>
          </div>
        </div>
      );
    }
    if (type === "brochure") {
      return (
        <div className="p-6 bg-card/50 rounded-xl border-2 border-dashed border-accent/30 text-center space-y-3">
          <p className="text-3xl">🏪</p>
          <h4 className="text-xl font-bold text-accent">{data.title}</h4>
          <p className="text-foreground">{data.subtitle}</p>
          <p className="text-muted-foreground text-sm">{data.details}</p>
          <p className="text-xs text-muted-foreground">{data.note}</p>
        </div>
      );
    }
    if (type === "note") {
      return (
        <div className="p-6 bg-amber-950/30 rounded-xl border border-amber-500/20">
          <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{data.content}</p>
          {data.engagement && <p className="text-muted-foreground text-xs mt-3">{data.engagement}</p>}
          {data.date && <p className="text-muted-foreground text-xs mt-2">📅 {data.date}</p>}
          {data.value && <p className="text-foreground text-sm mt-1">💰 {data.value}</p>}
        </div>
      );
    }
    return <p className="text-muted-foreground">محتوى غير متاح</p>;
  };

  return (
    <>
      <InteractiveRoom backgroundImage={evidenceRoomBg} hotspots={hotspots} onHotspotClick={handleHotspotClick} activeHotspot={null} overlayContent={undefined}>
        <motion.div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
            <span className="font-bold text-foreground">📁 غرفة الأدلة</span>
          </div>
        </motion.div>
      </InteractiveRoom>
      <GameOverlay currentScreen="evidence" onNavigate={onNavigate} />

      {showOverlay && selectedEvidence && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowOverlay(false)} />
          <motion.div className="relative z-10 bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedEvidence.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedEvidence.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEvidence.description}</p>
                </div>
              </div>
              <button onClick={() => setShowOverlay(false)} className="p-2 rounded-lg hover:bg-secondary"><X className="w-5 h-5 text-foreground" /></button>
            </div>
            {renderEvidenceContent(selectedEvidence)}
            <motion.button onClick={handleSaveToNotebook} disabled={isSaved}
              className={`mt-4 w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${isSaved ? "bg-neon-green/20 border border-neon-green/50 text-neon-green" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {isSaved ? <Check className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
              {isSaved ? "✓ محفوظ في الدفتر" : "📓 احفظ في الدفتر"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
