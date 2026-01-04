import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Mail, CheckCircle, Clock, Receipt, Shield, X, Eye, ArrowLeft } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS } from "@/data/case1";
import { cn } from "@/lib/utils";
import accountingRoomBg from "@/assets/rooms/accounting-room.png";
import warehouseRoomBg from "@/assets/rooms/warehouse-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "cabinet-1", x: 10, y: 30, width: 18, height: 35, label: "📊 ملخص المصاريف", icon: "📊" },
  { id: "cabinet-2", x: 32, y: 25, width: 18, height: 40, label: "📑 الفواتير", icon: "📑" },
  { id: "desk", x: 55, y: 45, width: 22, height: 30, label: "📓 دفاتر المخزن", icon: "📓" },
  { id: "computer", x: 75, y: 35, width: 15, height: 25, label: "📋 المشاريع", icon: "📋" },
];

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, collectEvidence, isEvidenceUnlocked, isEvidenceCollected, getOverallTrust } = useGame();
  const { playSound } = useSound();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);

  const handleHotspotClick = (hotspotId: string) => {
    // Map hotspots to evidence
    const hotspotToEvidence: Record<string, string> = {
      "cabinet-1": "evidence-01",
      "cabinet-2": "evidence-02",
      "desk": "evidence-04",
      "computer": "evidence-07",
    };
    
    const evidenceId = hotspotToEvidence[hotspotId];
    const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
    
    if (evidence && isEvidenceUnlocked(evidence.id)) {
      setSelectedEvidence(evidence);
      setShowOverlay(true);
      playSound("click");
    }
  };

  const handleCollect = () => {
    if (selectedEvidence) {
      collectEvidence(selectedEvidence.id);
      playSound("collect");
    }
  };

  const isCollected = selectedEvidence ? isEvidenceCollected(selectedEvidence.id) : false;
  const trust = getOverallTrust();

  const renderEvidenceData = (data: any) => {
    if (!data) return <p className="text-muted-foreground">لا توجد بيانات</p>;

    switch (data.type) {
      case "summary":
        return (
          <div className="space-y-4">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-right p-2">الشهر</th>
                  <th className="text-right p-2">المصاريف</th>
                  <th className="text-right p-2">المشاريع</th>
                </tr>
              </thead>
              <tbody>
                {data.months.map((m: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{m.month}</td>
                    <td className="p-2 text-destructive font-mono">{m.expenses.toLocaleString()} ر.س</td>
                    <td className="p-2 text-foreground">{m.projects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-amber-400 text-sm p-3 bg-amber-500/10 rounded-lg">⚠️ {data.note}</p>
          </div>
        );

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
                  <th className="text-right p-2">السعر</th>
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
                    <td className="p-2 text-foreground">{inv.unitPrice}</td>
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

      case "receipts":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">التاريخ</th>
                  <th className="text-right p-2">المنتج</th>
                  <th className="text-right p-2">الكمية</th>
                  <th className="text-right p-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 text-foreground">{e.date}</td>
                    <td className="p-2 text-foreground">{e.item}</td>
                    <td className="p-2 text-foreground">{e.qty}</td>
                    <td className={cn("p-2 text-xs", e.notes ? "text-amber-400" : "text-muted-foreground")}>
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

      case "modified_invoice":
        return (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <h4 className="font-bold text-destructive mb-4">⚠️ فاتورة معدلة!</h4>
            <div className="space-y-2 text-sm">
              <p className="text-foreground"><span className="text-muted-foreground">الكمية الأصلية:</span> {data.originalQty}</p>
              <p className="text-foreground"><span className="text-muted-foreground">الكمية المعدلة:</span> <span className="text-destructive font-bold">{data.modifiedQty}</span></p>
              <p className="text-foreground"><span className="text-muted-foreground">المجموع الأصلي:</span> {data.originalTotal.toLocaleString()}</p>
              <p className="text-foreground"><span className="text-muted-foreground">المجموع المعدل:</span> <span className="text-destructive font-bold">{data.modifiedTotal.toLocaleString()}</span></p>
              <p className="text-amber-400 mt-4 p-2 bg-amber-500/10 rounded">{data.modifiedBy}</p>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">المشروع</th>
                  <th className="text-right p-2">الفترة</th>
                  <th className="text-right p-2">المتوقع</th>
                  <th className="text-right p-2">المشترى</th>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      default:
        return <p className="text-muted-foreground">نوع بيانات غير معروف</p>;
    }
  };

  return (
    <InteractiveRoom
      backgroundImage={accountingRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={selectedEvidence?.id || null}
      overlayContent={showOverlay && selectedEvidence ? (
        <motion.div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedEvidence.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedEvidence.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEvidence.description}</p>
              </div>
            </div>
            <button onClick={() => setShowOverlay(false)} className="p-2 rounded-lg hover:bg-secondary">
              <X className="w-5 h-5" />
            </button>
          </div>

          {renderEvidenceData(selectedEvidence.data)}

          {!isCollected && (
            <motion.button
              onClick={handleCollect}
              className="mt-6 w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold"
              whileHover={{ scale: 1.02 }}
            >
              📥 جمع هذا الدليل
            </motion.button>
          )}
          {isCollected && (
            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center text-green-400">
              ✓ تم جمع هذا الدليل
            </div>
          )}
        </motion.div>
      ) : null}
      onCloseOverlay={() => setShowOverlay(false)}
    >
      {/* Trust bar */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-6 py-3 rounded-full backdrop-blur-xl border",
          trust > 70 ? "bg-green-500/20 border-green-500/30" :
          trust > 40 ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="font-bold text-foreground">الثقة: {trust}%</span>
          <span className="mr-4 text-muted-foreground">أدلة: {state.collectedEvidence.length}/{EVIDENCE_ITEMS.length}</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </InteractiveRoom>
  );
};
