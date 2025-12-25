import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Mail, FileText, Download, Lock, FolderOpen, Archive, CheckCircle, AlertTriangle } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS, FINANCIAL_DATA } from "@/data/case1";
import { cn } from "@/lib/utils";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "cabinet-1", x: 10, y: 30, width: 18, height: 35, label: "📁 كشف البنك", icon: "🏦" },
  { id: "cabinet-2", x: 32, y: 25, width: 18, height: 40, label: "📊 سجل المشتريات", icon: "📊" },
  { id: "desk", x: 55, y: 45, width: 22, height: 30, label: "📧 الإيميلات", icon: "💻" },
  { id: "safe", x: 80, y: 35, width: 15, height: 25, label: "🔒 الخزنة", icon: "🔐" },
];

const locationToEvidence: Record<string, string> = {
  "cabinet-1": "bank-statement",
  "cabinet-2": "purchase-log",
  "desk": "emails",
  "safe": "audit-report",
};

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, collectEvidence, unlockConcept } = useGame();
  const { playSound } = useSound();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);

  const handleHotspotClick = (hotspotId: string) => {
    const evidenceId = locationToEvidence[hotspotId];
    const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
    
    if (evidence) {
      setSelectedEvidence(evidence);
      setActiveHotspot(hotspotId);
      setShowOverlay(true);
      playSound("click");
    }
  };

  const handleCollect = () => {
    if (selectedEvidence && !selectedEvidence.locked) {
      collectEvidence(selectedEvidence.id);
      playSound("collect");
      
      // فتح مفهوم قراءة البيانات عند جمع أول دليل
      if (state.collectedEvidence.length === 0) {
        unlockConcept("data-reading");
      }
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setActiveHotspot(null);
    setShowTransactions(false);
  };

  const isLocked = selectedEvidence?.locked && state.collectedEvidence.length < (selectedEvidence.unlockRequirement || 0);
  const isCollected = selectedEvidence ? state.collectedEvidence.includes(selectedEvidence.id) : false;

  // المعاملات المالية للعرض
  const transactions = FINANCIAL_DATA.bankTransactions;

  return (
    <InteractiveRoom
      backgroundImage={evidenceRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activeHotspot}
      overlayContent={showOverlay && selectedEvidence ? (
        <motion.div
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto"
          style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.2)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center text-3xl",
                  isLocked ? "bg-muted" : "bg-primary/20"
                )}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {isLocked ? <Lock className="w-8 h-8 text-muted-foreground" /> : selectedEvidence.icon}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedEvidence.nameEn}</h3>
                <p className="text-sm text-muted-foreground" dir="rtl">{selectedEvidence.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedEvidence.description}</p>
              </div>
            </div>
            
            {!isLocked && !isCollected && (
              <motion.button
                onClick={handleCollect}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                جمع الدليل
              </motion.button>
            )}
            
            {isCollected && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium border border-green-500/30">
                <CheckCircle className="w-4 h-4" />
                تم الجمع
              </span>
            )}
          </div>

          {/* Content */}
          {isLocked ? (
            <div className="text-center py-12">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <p className="text-muted-foreground">هذا الملف مقفل</p>
              <p className="text-sm text-muted-foreground mt-2">
                اجمع {selectedEvidence.unlockRequirement} أدلة لفتحه (لديك {state.collectedEvidence.length})
              </p>
            </div>
          ) : (
            <>
              {/* عرض المعاملات المالية للبنك وسجل المشتريات */}
              {(selectedEvidence.id === "bank-statement" || selectedEvidence.id === "purchase-log") && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      معاينة البيانات
                    </h4>
                    <motion.button
                      onClick={() => setShowTransactions(!showTransactions)}
                      className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {showTransactions ? "إخفاء التفاصيل" : "عرض كل المعاملات"}
                    </motion.button>
                  </div>

                  {/* ملخص سريع */}
                  <div className="grid grid-cols-3 gap-4">
                    {FINANCIAL_DATA.monthlySummary.map((month, i) => (
                      <motion.div
                        key={month.month}
                        className={cn(
                          "p-4 rounded-xl border",
                          month.anomaly 
                            ? "bg-destructive/10 border-destructive/30" 
                            : "bg-secondary/30 border-border"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-foreground">{month.month}</span>
                          {month.anomaly && (
                            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                            </motion.div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الإيرادات:</span>
                            <span className="text-green-400 font-mono">{month.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">المصروفات:</span>
                            <span className="text-destructive font-mono">{month.expenses.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-1 mt-1">
                            <span className="text-muted-foreground">الصافي:</span>
                            <span className={cn("font-mono font-bold", month.netProfit >= 0 ? "text-green-400" : "text-destructive")}>
                              {month.netProfit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* جدول المعاملات التفصيلي */}
                  <AnimatePresence>
                    {showTransactions && (
                      <motion.div
                        className="rounded-xl border border-border overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground font-mono">27 معاملة</span>
                        </div>
                        <div className="max-h-64 overflow-auto">
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
                              {transactions.map((t, i) => (
                                <motion.tr
                                  key={t.id}
                                  className={cn(
                                    "border-b border-border/50",
                                    t.suspicious && "bg-destructive/10"
                                  )}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.02 }}
                                >
                                  <td className="p-2 font-mono text-foreground">{t.date}</td>
                                  <td className="p-2 text-foreground flex items-center gap-2">
                                    {t.description}
                                    {t.suspicious && (
                                      <span className="px-2 py-0.5 rounded text-[10px] bg-destructive/20 text-destructive font-mono animate-pulse">
                                        مريب!
                                      </span>
                                    )}
                                  </td>
                                  <td className={cn("p-2 font-mono", t.amount >= 0 ? "text-green-400" : "text-destructive")}>
                                    {t.amount.toLocaleString()}
                                  </td>
                                  <td className={cn("p-2", t.suspicious && "text-destructive font-bold")}>
                                    {t.enteredBy === "karim" ? "كريم" : "سارة"}
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* تلميح */}
                  <motion.div
                    className="p-4 rounded-xl bg-accent/10 border border-accent/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm text-accent flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>لاحظ الفرق بين الأشهر! من المسؤول عن المعاملات المريبة؟</span>
                    </p>
                  </motion.div>
                </div>
              )}

              {/* عرض الإيميلات */}
              {selectedEvidence.id === "emails" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="flex items-center gap-2 mb-3 text-primary">
                      <Mail className="w-5 h-5" />
                      <span className="font-bold">المراسلات الداخلية</span>
                    </div>
                    
                    {[
                      { from: "كريم", to: "أحمد", subject: "طلب موافقة عاجلة", date: "2024-02-07", content: "أرجو الموافقة على طلب الشراء المرفق. الموردين ينتظرون.", suspicious: true },
                      { from: "أحمد", to: "كريم", subject: "RE: طلب موافقة عاجلة", date: "2024-02-07", content: "تمت الموافقة. ثق بحكمك في هذه الأمور.", suspicious: false },
                      { from: "سارة", to: "أحمد", subject: "ملاحظة على المصروفات", date: "2024-03-15", content: "لاحظت زيادة كبيرة في فئة المشتريات هذا الشهر. هل هذا طبيعي؟", suspicious: false },
                      { from: "أحمد", to: "سارة", subject: "RE: ملاحظة على المصروفات", date: "2024-03-15", content: "كريم أكد أنها لمشاريع جديدة. لا داعي للقلق.", suspicious: false },
                    ].map((email, i) => (
                      <motion.div
                        key={i}
                        className={cn(
                          "p-3 rounded-lg border mb-2",
                          email.suspicious ? "bg-destructive/10 border-destructive/30" : "bg-background/50 border-border"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>من: {email.from} → إلى: {email.to}</span>
                          <span>{email.date}</span>
                        </div>
                        <p className="font-bold text-sm text-foreground mb-1">{email.subject}</p>
                        <p className="text-sm text-muted-foreground">{email.content}</p>
                        {email.suspicious && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-destructive/20 text-destructive">
                            طلب موافقة سريعة بدون تفاصيل!
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <p className="text-sm text-accent flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <span>أحمد يثق بكريم كثيراً ولا يدقق في التفاصيل!</span>
                    </p>
                  </motion.div>
                </div>
              )}

              {/* تقرير المراجعة */}
              {selectedEvidence.id === "audit-report" && (
                <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                  <FileText className="w-16 h-16 text-destructive mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-destructive mb-2">تقرير المراجعة الداخلية</h4>
                  <p className="text-foreground mb-4">
                    تم اكتشاف فجوة مالية بقيمة <span className="text-2xl font-bold text-destructive">45,000 ريال</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    المبلغ المفقود يتوافق تماماً مع المعاملات المشبوهة في سجل المشتريات!
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      ) : null}
      onCloseOverlay={closeOverlay}
    >
      {/* Status Bar */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <Archive className="w-5 h-5 text-primary" />
          <span className="text-foreground font-bold">غرفة الأدلة</span>
          <div className="w-px h-6 bg-border" />
          <span className="text-primary font-mono">
            {state.collectedEvidence.length}/{EVIDENCE_ITEMS.filter(e => !e.locked || state.collectedEvidence.length >= (e.unlockRequirement || 0)).length} أدلة
          </span>
        </div>
      </motion.div>

      {/* Collected Evidence Panel */}
      <AnimatePresence>
        {state.collectedEvidence.length > 0 && (
          <motion.div
            className="absolute top-24 right-6 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/90 backdrop-blur-xl border border-green-500/30">
              <span className="text-xs text-green-400 font-bold mb-1">✓ الأدلة المجمعة</span>
              {state.collectedEvidence.map(id => {
                const evidence = EVIDENCE_ITEMS.find(e => e.id === id);
                if (!evidence) return null;
                return (
                  <motion.div
                    key={id}
                    className="flex items-center gap-2 text-sm text-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span>{evidence.icon}</span>
                    <span>{evidence.nameEn}</span>
                  </motion.div>
                );
              })}
              
              {state.collectedEvidence.length >= 2 && (
                <motion.button
                  onClick={() => onNavigate("analysis")}
                  className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  انتقل للتحليل →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="مكتب المحقق" onClick={() => onNavigate("office")} />
      </div>
    </InteractiveRoom>
  );
};
