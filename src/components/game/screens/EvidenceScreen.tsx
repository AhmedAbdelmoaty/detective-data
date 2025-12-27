import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Mail, Lock, CheckCircle, Clock, Receipt, Shield, X, Package } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { 
  EVIDENCE_ITEMS, 
  BANK_SUMMARY, 
  SYSTEM_LOG_BRIEF, 
  EMAIL_PACK1, 
  BANK_TRANSACTIONS, 
  PURCHASE_INVOICES, 
  ACTIVITY_LOG, 
  EMAIL_PACK3 
} from "@/data/case1";
import { cn } from "@/lib/utils";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

type PackType = "pack1" | "pack2" | "pack3";

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, collectEvidence, getTrustLevel, getCollectedFromPack, canCollectFromPack, setPhase } = useGame();
  const { playSound } = useSound();
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const trustLevel = getTrustLevel();

  const packs = [
    { 
      id: "pack1" as const, 
      name: "Pack 1", 
      description: "الأدلة الأولية",
      maxCollect: 2,
      totalItems: 3,
      unlocked: state.unlockedPacks.includes("pack1"),
      unlockCondition: "متاح من البداية",
    },
    { 
      id: "pack2" as const, 
      name: "Pack 2", 
      description: "أدلة إضافية",
      maxCollect: 2,
      totalItems: 2,
      unlocked: state.unlockedPacks.includes("pack2"),
      unlockCondition: "يفتح بعد اكتشاف أول Insight",
    },
    { 
      id: "pack3" as const, 
      name: "Pack 3", 
      description: "الأدلة النهائية",
      maxCollect: 2,
      totalItems: 2,
      unlocked: state.unlockedPacks.includes("pack3"),
      unlockCondition: "يفتح بعد أول استجواب",
    },
  ];

  const handlePackClick = (pack: PackType) => {
    if (!state.unlockedPacks.includes(pack)) {
      playSound("error");
      return;
    }
    setSelectedPack(pack);
    setShowOverlay(true);
    playSound("click");
  };

  const handleEvidenceClick = (evidence: typeof EVIDENCE_ITEMS[0]) => {
    setSelectedEvidence(evidence);
    playSound("click");
  };

  const handleCollect = () => {
    if (!selectedEvidence) return;
    
    const pack = selectedEvidence.pack;
    if (!canCollectFromPack(pack)) {
      playSound("error");
      return;
    }
    
    collectEvidence(selectedEvidence.id);
    playSound("collect");
    
    // Check if we should advance phase
    if (pack === "pack1" && getCollectedFromPack("pack1") >= 1) {
      // Will be 2 after this collection
      setPhase("analysis1");
    }
  };

  const isCollected = selectedEvidence ? state.collectedEvidence.includes(selectedEvidence.id) : false;
  const packEvidence = selectedPack ? EVIDENCE_ITEMS.filter(e => e.pack === selectedPack) : [];
  const collectedFromPack = selectedPack ? getCollectedFromPack(selectedPack) : 0;
  const packInfo = selectedPack ? packs.find(p => p.id === selectedPack) : null;

  const renderEvidenceContent = () => {
    if (!selectedEvidence) return null;

    switch (selectedEvidence.id) {
      case "bank-summary":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              ملخص الحساب البنكي
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {BANK_SUMMARY.map((month, i) => (
                <motion.div
                  key={month.month}
                  className="p-4 rounded-xl border bg-secondary/30 border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="font-bold text-foreground text-lg">{month.month}</span>
                  <div className="space-y-2 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الإيرادات:</span>
                      <span className="text-green-400 font-mono">{month.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المصروفات:</span>
                      <span className="text-destructive font-mono">{month.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">الصافي:</span>
                      <span className={cn("font-mono font-bold", month.netProfit >= 0 ? "text-green-400" : "text-destructive")}>
                        {month.netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "system-log-brief":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              سجل النظام المختصر
            </h4>
            <div className="max-h-64 overflow-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 sticky top-0">
                  <tr>
                    <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                    <th className="text-right p-2 text-muted-foreground">الوقت</th>
                    <th className="text-right p-2 text-muted-foreground">المستخدم</th>
                    <th className="text-right p-2 text-muted-foreground">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {SYSTEM_LOG_BRIEF.map((log) => (
                    <tr key={log.id} className="border-b border-border/50">
                      <td className="p-2 font-mono text-xs text-foreground">{log.date}</td>
                      <td className="p-2 font-mono text-xs text-foreground">{log.time}</td>
                      <td className="p-2 text-foreground font-bold">{log.user}</td>
                      <td className="p-2 text-foreground">{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "email-inquiry":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              إيميل الاستفسار
            </h4>
            <div className="p-4 rounded-xl border bg-secondary/30 border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-foreground">{EMAIL_PACK1.subject}</span>
                <span className="text-xs text-muted-foreground">{EMAIL_PACK1.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                من: {EMAIL_PACK1.from} → إلى: {EMAIL_PACK1.to}
              </p>
              <p className="text-foreground leading-relaxed">{EMAIL_PACK1.body}</p>
            </div>
          </div>
        );

      case "bank-transactions":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              كشف الحساب التفصيلي
            </h4>
            <div className="max-h-64 overflow-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 sticky top-0">
                  <tr>
                    <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                    <th className="text-right p-2 text-muted-foreground">الوصف</th>
                    <th className="text-right p-2 text-muted-foreground">المبلغ</th>
                    <th className="text-right p-2 text-muted-foreground">المسؤول</th>
                  </tr>
                </thead>
                <tbody>
                  {BANK_TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="border-b border-border/50">
                      <td className="p-2 font-mono text-xs text-foreground">{t.date}</td>
                      <td className="p-2 text-foreground">{t.description}</td>
                      <td className={cn("p-2 font-mono", t.amount >= 0 ? "text-green-400" : "text-destructive")}>
                        {t.amount.toLocaleString()}
                      </td>
                      <td className="p-2 text-foreground">{t.enteredBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "invoices":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              جدول الفواتير
            </h4>
            <div className="max-h-64 overflow-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 sticky top-0">
                  <tr>
                    <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                    <th className="text-right p-2 text-muted-foreground">المورد</th>
                    <th className="text-right p-2 text-muted-foreground">المبلغ</th>
                    <th className="text-right p-2 text-muted-foreground">الطالب</th>
                    <th className="text-right p-2 text-muted-foreground">إيصال</th>
                  </tr>
                </thead>
                <tbody>
                  {PURCHASE_INVOICES.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/50">
                      <td className="p-2 font-mono text-xs text-foreground">{inv.date}</td>
                      <td className="p-2 text-foreground">{inv.vendor}</td>
                      <td className="p-2 font-mono text-foreground">{inv.amount.toLocaleString()}</td>
                      <td className="p-2 text-foreground">{inv.requestedBy}</td>
                      <td className="p-2 text-center">
                        {inv.hasReceipt ? <CheckCircle className="w-4 h-4 text-green-400 inline" /> : <span className="text-muted-foreground">-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "activity-log":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              سجل النشاط التفصيلي
            </h4>
            <div className="max-h-64 overflow-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 sticky top-0">
                  <tr>
                    <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                    <th className="text-right p-2 text-muted-foreground">الوقت</th>
                    <th className="text-right p-2 text-muted-foreground">المستخدم</th>
                    <th className="text-right p-2 text-muted-foreground">الإجراء</th>
                    <th className="text-right p-2 text-muted-foreground">التفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_LOG.map((log) => (
                    <tr key={log.id} className="border-b border-border/50">
                      <td className="p-2 font-mono text-xs text-foreground">{log.date}</td>
                      <td className="p-2 font-mono text-xs text-foreground">{log.time}</td>
                      <td className="p-2 text-foreground font-bold">{log.user}</td>
                      <td className="p-2 text-foreground">{log.action}</td>
                      <td className="p-2 text-muted-foreground text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "email-urgent":
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              إيميل الطلب العاجل
            </h4>
            <div className="p-4 rounded-xl border bg-secondary/30 border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-foreground">{EMAIL_PACK3.subject}</span>
                <span className="text-xs text-muted-foreground">{EMAIL_PACK3.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                من: {EMAIL_PACK3.from} → إلى: {EMAIL_PACK3.to}
              </p>
              <p className="text-foreground leading-relaxed">{EMAIL_PACK3.body}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <InteractiveRoom
      backgroundImage={evidenceRoomBg}
      hotspots={[]}
      onHotspotClick={() => {}}
      activeHotspot={null}
      overlayContent={showOverlay ? (
        <motion.div 
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-bold text-foreground">{packInfo?.name}</h3>
                <p className="text-sm text-muted-foreground">{packInfo?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {selectedPack === "pack1" && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                  {collectedFromPack}/2 مجموع
                </span>
              )}
              <button onClick={() => { setShowOverlay(false); setSelectedEvidence(null); setSelectedPack(null); }} className="p-2 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Evidence List or Detail */}
          {selectedEvidence ? (
            <div>
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="mb-4 text-primary hover:underline flex items-center gap-1"
              >
                ← العودة للقائمة
              </button>
              
              {renderEvidenceContent()}
              
              {!isCollected && canCollectFromPack(selectedEvidence.pack) && (
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
              {!isCollected && !canCollectFromPack(selectedEvidence.pack) && selectedEvidence.pack === "pack1" && (
                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-amber-400">
                  ⚠️ وصلت للحد الأقصى (2 من 3) من هذا الـ Pack
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {packEvidence.map((evidence, i) => {
                const collected = state.collectedEvidence.includes(evidence.id);
                return (
                  <motion.button
                    key={evidence.id}
                    onClick={() => handleEvidenceClick(evidence)}
                    className={cn(
                      "p-4 rounded-xl border text-right transition-all flex items-center gap-4",
                      collected 
                        ? "bg-green-500/10 border-green-500/30" 
                        : "bg-secondary/30 border-border hover:border-primary"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-3xl">{evidence.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{evidence.name}</h4>
                      <p className="text-sm text-muted-foreground">{evidence.description}</p>
                    </div>
                    {collected && <CheckCircle className="w-6 h-6 text-green-400" />}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      ) : null}
      onCloseOverlay={() => { setShowOverlay(false); setSelectedEvidence(null); setSelectedPack(null); }}
    >
      {/* Objective Bar */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <span className="text-muted-foreground text-sm ml-2">📋 الهدف:</span>
          <span className="font-bold text-foreground">{state.currentObjective}</span>
        </div>
      </motion.div>

      {/* Trust & Time */}
      <motion.div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-6 py-2 rounded-full backdrop-blur-xl border flex items-center gap-4",
          trustLevel === "high" ? "bg-green-500/20 border-green-500/30" :
          trustLevel === "medium" ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            الثقة: {state.trust}%
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            الوقت: {state.timeRemaining}/{state.maxTime}
          </span>
        </div>
      </motion.div>

      {/* Packs Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="flex gap-8 pointer-events-auto">
          {packs.map((pack, i) => {
            const collected = getCollectedFromPack(pack.id);
            return (
              <motion.button
                key={pack.id}
                onClick={() => handlePackClick(pack.id)}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all w-48",
                  pack.unlocked 
                    ? "bg-background/80 backdrop-blur-xl border-primary/50 hover:border-primary cursor-pointer" 
                    : "bg-background/50 backdrop-blur-xl border-border/50 cursor-not-allowed opacity-60"
                )}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={pack.unlocked ? { scale: 1.05, y: -5 } : {}}
              >
                <div className="text-center">
                  {pack.unlocked ? (
                    <Package className="w-12 h-12 mx-auto text-primary mb-3" />
                  ) : (
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  )}
                  <h3 className="font-bold text-lg text-foreground">{pack.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{pack.description}</p>
                  
                  {pack.unlocked ? (
                    <div className="mt-3 flex items-center justify-center gap-1">
                      {Array.from({ length: pack.totalItems }).map((_, j) => (
                        <div
                          key={j}
                          className={cn(
                            "w-3 h-3 rounded-full",
                            j < collected ? "bg-green-400" : "bg-secondary"
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-3">{pack.unlockCondition}</p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

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
