import { useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Mail, Lock, CheckCircle, AlertTriangle, Clock, Receipt, Shield, X } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS, BANK_TRANSACTIONS, PURCHASE_INVOICES, SYSTEM_ACCESS_LOGS, INTERNAL_EMAILS, MONTHLY_SUMMARY } from "@/data/case1";
import { cn } from "@/lib/utils";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "cabinet-1", x: 10, y: 30, width: 18, height: 35, label: "🏦 كشف البنك", icon: "🏦" },
  { id: "cabinet-2", x: 32, y: 25, width: 18, height: 40, label: "📑 الفواتير", icon: "📑" },
  { id: "desk", x: 55, y: 45, width: 22, height: 30, label: "📧 الإيميلات", icon: "📧" },
  { id: "computer", x: 75, y: 35, width: 15, height: 25, label: "🔐 سجلات الدخول", icon: "🔐" },
];

const locationToEvidence: Record<string, string> = {
  "cabinet-1": "bank-statement",
  "cabinet-2": "purchase-log",
  "desk": "emails",
  "computer": "access-logs",
};

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const { state, collectEvidence, getTrustLevel } = useGame();
  const { playSound } = useSound();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<typeof EVIDENCE_ITEMS[0] | null>(null);
  const [filterBy, setFilterBy] = useState<string>("all");

  const handleHotspotClick = (hotspotId: string) => {
    const evidenceId = locationToEvidence[hotspotId];
    const evidence = EVIDENCE_ITEMS.find(e => e.id === evidenceId);
    if (evidence) {
      setSelectedEvidence(evidence);
      setShowOverlay(true);
      setFilterBy("all");
      playSound("click");
    }
  };

  const handleCollect = () => {
    if (selectedEvidence) {
      collectEvidence(selectedEvidence.id);
      playSound("collect");
    }
  };

  const isCollected = selectedEvidence ? state.collectedEvidence.includes(selectedEvidence.id) : false;
  const trustLevel = getTrustLevel();

  const renderBankStatement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-foreground flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
          المعاملات البنكية
        </h4>
        <select 
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="px-3 py-1 rounded-lg bg-secondary/50 border border-border text-sm text-foreground"
        >
          <option value="all">الكل</option>
          <option value="karim">كريم فقط</option>
          <option value="sara">سارة فقط</option>
          <option value="ahmed">أحمد فقط</option>
        </select>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {MONTHLY_SUMMARY.map((month, i) => (
          <motion.div
            key={month.month}
            className="p-4 rounded-xl border bg-secondary/30 border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground">{month.month}</span>
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

      {/* Transactions Table */}
      <div className="max-h-48 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 sticky top-0">
            <tr>
              <th className="text-right p-2 text-muted-foreground w-24">التاريخ</th>
              <th className="text-right p-2 text-muted-foreground">الوصف</th>
              <th className="text-right p-2 text-muted-foreground w-24">المبلغ</th>
              <th className="text-right p-2 text-muted-foreground w-20">المسؤول</th>
              <th className="text-right p-2 text-muted-foreground w-16">موثق</th>
            </tr>
          </thead>
          <tbody>
            {BANK_TRANSACTIONS
              .filter(t => filterBy === "all" || t.enteredBy === filterBy)
              .map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="p-2 font-mono text-foreground text-xs">{t.date}</td>
                  <td className="p-2 text-foreground">{t.description}</td>
                  <td className={cn("p-2 font-mono", t.amount >= 0 ? "text-green-400" : "text-destructive")}>
                    {t.amount.toLocaleString()}
                  </td>
                  <td className="p-2 text-foreground">
                    {t.enteredBy === "karim" ? "كريم" : t.enteredBy === "sara" ? "سارة" : "أحمد"}
                  </td>
                  <td className="p-2 text-center">
                    {t.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-400 inline" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPurchaseInvoices = () => (
    <div className="space-y-4">
      <h4 className="font-bold text-foreground flex items-center gap-2">
        <Receipt className="w-5 h-5 text-primary" />
        سجل الفواتير
      </h4>

      <div className="space-y-3 max-h-64 overflow-auto">
        {PURCHASE_INVOICES.map((inv) => (
          <div key={inv.id} className="p-3 rounded-xl border bg-secondary/30 border-border">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-foreground">{inv.vendor}</span>
                <p className="text-xs text-muted-foreground">{inv.date} • طلب من: {inv.requestedBy === "karim" ? "كريم" : inv.requestedBy === "sara" ? "سارة" : "أحمد"}</p>
                <p className="text-sm text-muted-foreground mt-1">{inv.items}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-foreground">{inv.amount.toLocaleString()} ريال</p>
                {inv.hasReceipt ? (
                  <span className="text-xs text-green-400 flex items-center gap-1 justify-end"><CheckCircle className="w-3 h-3" /> إيصال</span>
                ) : (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 justify-end">بدون إيصال</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmails = () => (
    <div className="space-y-4">
      <h4 className="font-bold text-foreground flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        الإيميلات الداخلية
      </h4>

      <div className="space-y-3 max-h-64 overflow-auto">
        {INTERNAL_EMAILS.map((email) => (
          <motion.div 
            key={email.id} 
            className="p-4 rounded-xl border bg-secondary/30 border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-foreground">{email.subject}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">من: {email.from} → إلى: {email.to} • {email.date}</p>
            <p className="text-sm text-foreground">{email.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAccessLogs = () => (
    <div className="space-y-4">
      <h4 className="font-bold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        سجلات الدخول للنظام
      </h4>

      <div className="max-h-64 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-secondary/30 sticky top-0">
            <tr>
              <th className="text-right p-2 text-muted-foreground w-24">التاريخ</th>
              <th className="text-right p-2 text-muted-foreground w-16">الوقت</th>
              <th className="text-right p-2 text-muted-foreground w-16">المستخدم</th>
              <th className="text-right p-2 text-muted-foreground">الإجراء</th>
              <th className="text-right p-2 text-muted-foreground w-20">خارج الدوام</th>
            </tr>
          </thead>
          <tbody>
            {SYSTEM_ACCESS_LOGS.map((log) => (
              <tr key={log.id} className="border-b border-border/50">
                <td className="p-2 font-mono text-xs text-foreground">{log.date}</td>
                <td className="p-2 font-mono text-xs text-foreground">{log.time}</td>
                <td className="p-2 text-foreground font-bold">{log.user}</td>
                <td className="p-2 text-foreground text-xs">{log.action}</td>
                <td className="p-2 text-center">
                  {log.afterHours ? (
                    <Clock className="w-4 h-4 text-amber-400 inline" />
                  ) : (
                    <span className="text-green-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <InteractiveRoom
      backgroundImage={evidenceRoomBg}
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

          {selectedEvidence.id === "bank-statement" && renderBankStatement()}
          {selectedEvidence.id === "purchase-log" && renderPurchaseInvoices()}
          {selectedEvidence.id === "emails" && renderEmails()}
          {selectedEvidence.id === "access-logs" && renderAccessLogs()}

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
          trustLevel === "high" ? "bg-green-500/20 border-green-500/30" :
          trustLevel === "medium" ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="font-bold">الثقة: {state.trust}%</span>
          <span className="mr-4 text-muted-foreground">أدلة: {state.collectedEvidence.length}/4</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20"><NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} /></div>
      <div className="absolute bottom-8 right-8 z-20"><NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} /></div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"><NavigationButton iconEmoji="📊" label="التحليل" onClick={() => onNavigate("analysis")} /></div>
    </InteractiveRoom>
  );
};
