import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, BarChart3, Link2, Lightbulb, Notebook } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { EVIDENCE_ITEMS, INSIGHTS, HYPOTHESES, CHARACTERS } from "@/data/case001";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import analysisLabBg from "@/assets/rooms/analysis-lab.png";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "summary" | "filter" | "pivot" | "compare" | "hypothesis";

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const {
    state,
    discoverInsight,
    hasInsight,
    setActiveHypothesis,
    canUnlockHypothesis,
    getAvailableHypotheses,
    getOverallTrust,
  } = useGame();

  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [compareResult, setCompareResult] = useState<string | null>(null);

  const tabs = [
    { id: "summary" as const, label: "📊 ملخص", icon: Notebook },
    { id: "filter" as const, label: "🔍 فلترة", icon: Filter },
    { id: "pivot" as const, label: "📈 تجميع", icon: BarChart3 },
    { id: "compare" as const, label: "⚖️ مقارنة", icon: Link2 },
    { id: "hypothesis" as const, label: "💡 الفرضيات", icon: Lightbulb },
  ];

  // Get invoice data if collected
  const invoiceData = useMemo(() => {
    if (!state.collectedEvidence.includes("evidence-02")) return null;
    const evidence = EVIDENCE_ITEMS.find((e) => e.id === "evidence-02");
    return evidence?.data?.invoices || [];
  }, [state.collectedEvidence]);

  // Supplier analysis for pivot
  const supplierAnalysis = useMemo(() => {
    if (!invoiceData) return [];

    const suppliers: Record<string, { total: number; count: number; noReceipt: number; avgPrice: number }> = {};

    invoiceData.forEach((inv: any) => {
      if (!suppliers[inv.supplier]) {
        suppliers[inv.supplier] = { total: 0, count: 0, noReceipt: 0, avgPrice: 0 };
      }
      suppliers[inv.supplier].total += inv.total;
      suppliers[inv.supplier].count += 1;
      if (!inv.hasReceipt) suppliers[inv.supplier].noReceipt += 1;
    });

    return Object.entries(suppliers)
      .map(([name, data]) => ({
        name,
        ...data,
        avgPrice: Math.round(data.total / data.count),
        noReceiptPercent: Math.round((data.noReceipt / data.count) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, [invoiceData]);

  // Handle pivot discovery
  const handlePivotAnalysis = () => {
    if (supplierAnalysis.length > 0) {
      const nour = supplierAnalysis.find((s) => s.name.includes("النور"));
      if (nour && nour.total > 40000 && nour.noReceiptPercent > 70) {
        if (!hasInsight("insight-supplier-anomaly")) {
          discoverInsight("insight-supplier-anomaly");
          toast.success("اكتشاف جديد! النور للتوريدات مورد شاذ");
        }
        if (!hasInsight("insight-no-receipts")) {
          discoverInsight("insight-no-receipts");
        }
      }
    }
  };

  // Handle compare analysis
  const handleCompareAnalysis = () => {
    if (!state.collectedEvidence.includes("evidence-04") || !state.collectedEvidence.includes("evidence-05")) {
      setCompareResult("تحتاج جمع دفتر الاستلام ودفتر الصرف للمقارنة");
      return;
    }

    // Calculate gap
    const receiptData = EVIDENCE_ITEMS.find((e) => e.id === "evidence-04")?.data?.entries || [];
    const dispatchData = EVIDENCE_ITEMS.find((e) => e.id === "evidence-05")?.data?.entries || [];

    const totalReceived = receiptData.reduce((sum: number, e: any) => sum + e.qty, 0);
    const totalDispatched = dispatchData.reduce((sum: number, e: any) => sum + e.qty, 0);
    const gap = totalReceived - totalDispatched;

    if (gap > 30) {
      setCompareResult(`فجوة كبيرة! الاستلام: ${totalReceived} - الصرف: ${totalDispatched} = فرق ${gap} وحدة`);
      if (!hasInsight("insight-gap")) {
        discoverInsight("insight-gap");
        toast.success("اكتشاف جديد! فجوة بين الشراء والاستخدام");
      }
    } else {
      setCompareResult(`الفرق طبيعي: ${gap} وحدة`);
    }
  };

  // Handle hypothesis selection
  const handleSelectHypothesis = (hypothesisId: string) => {
    setActiveHypothesis(hypothesisId);
    toast.success("تم اختيار الفرضية");
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-primary">{state.collectedEvidence.length}</p>
          <p className="text-sm text-muted-foreground">أدلة مجمعة</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-accent">{state.discoveredInsights.length}</p>
          <p className="text-sm text-muted-foreground">اكتشافات</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-green-400">{state.dialoguesCompleted.length}</p>
          <p className="text-sm text-muted-foreground">حوارات</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-amber-400">{state.score}</p>
          <p className="text-sm text-muted-foreground">النقاط</p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h4 className="font-bold text-foreground mb-3">دفتر التحقيق ({state.investigationNotes.length})</h4>
        {state.investigationNotes.length === 0 ? (
          <p className="text-muted-foreground p-4 bg-card/30 rounded-xl">لا توجد ملاحظات بعد</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto">
            {state.investigationNotes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "p-3 rounded-xl border",
                  note.type === "insight"
                    ? "bg-accent/10 border-accent/30"
                    : note.type === "clue"
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card/30 border-border",
                )}
              >
                <p className="text-foreground text-sm">{note.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{note.source}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFilter = () => (
    <div className="space-y-6">
      {!invoiceData ? (
        <p className="text-muted-foreground p-8 bg-card/30 rounded-xl text-center">
          تحتاج جمع ملف الفواتير أولاً من غرفة المحاسبة
        </p>
      ) : (
        <>
          <div className="flex gap-4">
            <select
              value={filterSupplier}
              onChange={(e) => setFilterSupplier(e.target.value)}
              className="px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
            >
              <option value="all">كل الموردين</option>
              <option value="النور للتوريدات">النور للتوريدات</option>
              <option value="مواد البناء المتحدة">مواد البناء المتحدة</option>
              <option value="الصفا للتجارة">الصفا للتجارة</option>
            </select>

            <button
              onClick={() => {
                if (filterSupplier === "النور للتوريدات" && !hasInsight("insight-sara-enters")) {
                  discoverInsight("insight-sara-enters");
                  toast.success("اكتشاف! سارة تدخل كل فواتير النور");
                }
              }}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
            >
              تحليل المدخل
            </button>
          </div>

          <div className="max-h-64 overflow-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2">المورد</th>
                  <th className="text-right p-2">المنتج</th>
                  <th className="text-right p-2">المبلغ</th>
                  <th className="text-right p-2">المدخل</th>
                  <th className="text-right p-2">إيصال</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData
                  .filter((inv: any) => filterSupplier === "all" || inv.supplier === filterSupplier)
                  .map((inv: any) => (
                    <tr key={inv.id} className="border-b border-border/50">
                      <td className="p-2">{inv.supplier}</td>
                      <td className="p-2">{inv.item}</td>
                      <td className="p-2 text-destructive">{inv.total.toLocaleString()}</td>
                      <td className="p-2">{inv.enteredBy}</td>
                      <td className="p-2">{inv.hasReceipt ? "✓" : "✗"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderPivot = () => (
    <div className="space-y-6">
      {!invoiceData ? (
        <p className="text-muted-foreground p-8 bg-card/30 rounded-xl text-center">تحتاج جمع ملف الفواتير أولاً</p>
      ) : (
        <>
          <button
            onClick={handlePivotAnalysis}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
          >
            تحليل الموردين (Pivot)
          </button>

          <div className="space-y-4">
            {supplierAnalysis.map((supplier) => (
              <div key={supplier.name} className="p-4 rounded-xl bg-card/30 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-foreground">{supplier.name}</h4>
                  <span className="text-destructive font-bold">{supplier.total.toLocaleString()} ر.س</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{supplier.count} فواتير</span>
                  <span>متوسط: {supplier.avgPrice.toLocaleString()}</span>
                  <span className={supplier.noReceiptPercent > 50 ? "text-amber-400" : ""}>
                    بدون إيصال: {supplier.noReceiptPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCompare = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">قارن بين كمية المواد المستلمة والمصروفة للمشاريع</p>

      <button
        onClick={handleCompareAnalysis}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
      >
        ⚖️ قارن الاستلام والصرف
      </button>

      {compareResult && (
        <motion.div
          className={cn(
            "p-4 rounded-xl border",
            compareResult.includes("فجوة") ? "bg-destructive/10 border-destructive/30" : "bg-card/30 border-border",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-foreground">{compareResult}</p>
        </motion.div>
      )}
    </div>
  );

  const renderHypothesis = () => {
    const available = getAvailableHypotheses();

    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">اختر فرضية بناءً على الأدلة والاكتشافات</p>

        <div className="space-y-4">
          {HYPOTHESES.map((h) => {
            const canUnlock = canUnlockHypothesis(h.id);
            const isActive = state.activeHypothesis === h.id;

            return (
              <motion.button
                key={h.id}
                onClick={() => canUnlock && handleSelectHypothesis(h.id)}
                disabled={!canUnlock}
                className={cn(
                  "w-full p-4 rounded-xl border text-right transition-all",
                  isActive
                    ? "bg-primary/20 border-primary"
                    : canUnlock
                      ? "bg-card/50 border-border hover:border-primary/50"
                      : "bg-muted/30 border-border/30 cursor-not-allowed opacity-50",
                )}
                whileHover={canUnlock ? { scale: 1.01 } : {}}
              >
                <h4 className="font-bold text-foreground mb-1">{h.title}</h4>
                <p className="text-sm text-muted-foreground">{h.description}</p>
                {isActive && <span className="text-xs text-primary mt-2 block">✓ الفرضية الحالية</span>}
                {!canUnlock && <span className="text-xs text-muted-foreground mt-2 block">🔒 تحتاج أدلة أكثر</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <NavigationButton iconEmoji="🏢" label="رجوع" onClick={() => onNavigate("office")} />
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">الثقة: {getOverallTrust()}%</span>
          <span className="text-primary font-bold">{state.score} نقطة</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "summary" && renderSummary()}
        {activeTab === "filter" && renderFilter()}
        {activeTab === "pivot" && renderPivot()}
        {activeTab === "compare" && renderCompare()}
        {activeTab === "hypothesis" && renderHypothesis()}
      </div>
    </div>
  );
};
