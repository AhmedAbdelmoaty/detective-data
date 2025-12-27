import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, BarChart3, Scale, Zap, Lightbulb, Notebook } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { GameCard } from "../GameCard";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EVIDENCE_ITEMS, INSIGHTS, HYPOTHESES, ANALYSIS_TOOLS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import analysisLabBg from "@/assets/rooms/analysis-lab.png";

interface AnalysisLabScreenProps {
  onNavigate: (screen: string) => void;
}

// Hotspots لأدوات التحليل
const hotspots = [
  { id: "tool-filter", x: 5, y: 25, width: 20, height: 35, label: "🔍 فلترة وترتيب", icon: "🔍" },
  { id: "tool-pivot", x: 28, y: 20, width: 20, height: 35, label: "📊 تجميع وتحليل", icon: "📊" },
  { id: "tool-compare", x: 52, y: 25, width: 20, height: 35, label: "⚖️ مقارنة", icon: "⚖️" },
  { id: "tool-highlight", x: 75, y: 20, width: 20, height: 35, label: "⚡ إبراز الشاذ", icon: "⚡" },
  { id: "insights-board", x: 35, y: 65, width: 30, height: 25, label: "💡 لوحة الاكتشافات", icon: "💡" },
];

export const AnalysisLabScreen = ({ onNavigate }: AnalysisLabScreenProps) => {
  const { 
    state, 
    discoverInsight, 
    hasInsight, 
    setActiveHypothesis, 
    canUnlockHypothesis,
    getOverallTrust,
  } = useGame();
  const { playSound } = useSound();
  
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [compareResult, setCompareResult] = useState<string | null>(null);

  const trust = getOverallTrust();

  // Get invoice data if collected
  const invoiceData = useMemo(() => {
    if (!state.collectedEvidence.includes("evidence-02")) return null;
    const evidence = EVIDENCE_ITEMS.find(e => e.id === "evidence-02");
    return evidence?.data?.invoices || [];
  }, [state.collectedEvidence]);

  // Get payments data
  const paymentsData = useMemo(() => {
    if (!state.collectedEvidence.includes("evidence-03")) return null;
    const evidence = EVIDENCE_ITEMS.find(e => e.id === "evidence-03");
    return evidence?.data?.payments || [];
  }, [state.collectedEvidence]);

  // Supplier analysis for pivot
  const supplierAnalysis = useMemo(() => {
    if (!invoiceData) return [];
    
    const suppliers: Record<string, { total: number; count: number; noReceipt: number }> = {};
    
    invoiceData.forEach((inv: any) => {
      if (!suppliers[inv.supplier]) {
        suppliers[inv.supplier] = { total: 0, count: 0, noReceipt: 0 };
      }
      suppliers[inv.supplier].total += inv.total;
      suppliers[inv.supplier].count += 1;
      if (!inv.hasReceipt) suppliers[inv.supplier].noReceipt += 1;
    });
    
    return Object.entries(suppliers).map(([name, data]) => ({
      name,
      ...data,
      avgPrice: Math.round(data.total / data.count),
      noReceiptPercent: Math.round((data.noReceipt / data.count) * 100),
    })).sort((a, b) => b.total - a.total);
  }, [invoiceData]);

  const handleHotspotClick = (id: string) => {
    setActiveTool(id);
    playSound("click");
  };

  // Handle pivot discovery
  const handlePivotAnalysis = () => {
    if (supplierAnalysis.length > 0) {
      const nour = supplierAnalysis.find(s => s.name.includes("النور"));
      if (nour && nour.total > 40000 && nour.noReceiptPercent > 70) {
        if (!hasInsight("insight-supplier-anomaly")) {
          discoverInsight("insight-supplier-anomaly");
          toast.success("🔍 اكتشاف! النور للتوريدات مورد شاذ");
        }
        if (!hasInsight("insight-no-receipts")) {
          discoverInsight("insight-no-receipts");
        }
      }
    }
    playSound("reveal");
  };

  // Handle compare analysis
  const handleCompareAnalysis = () => {
    if (!state.collectedEvidence.includes("evidence-04") || !state.collectedEvidence.includes("evidence-05")) {
      setCompareResult("تحتاج جمع دفتر الاستلام ودفتر الصرف أولاً من المخزن");
      return;
    }
    
    const receiptData = EVIDENCE_ITEMS.find(e => e.id === "evidence-04")?.data?.entries || [];
    const dispatchData = EVIDENCE_ITEMS.find(e => e.id === "evidence-05")?.data?.entries || [];
    
    const totalReceived = receiptData.reduce((sum: number, e: any) => sum + e.qty, 0);
    const totalDispatched = dispatchData.reduce((sum: number, e: any) => sum + e.qty, 0);
    const gap = totalReceived - totalDispatched;
    
    if (gap > 30) {
      setCompareResult(`فجوة كبيرة! الاستلام: ${totalReceived} - الصرف: ${totalDispatched} = فرق ${gap} وحدة`);
      if (!hasInsight("insight-gap")) {
        discoverInsight("insight-gap");
        toast.success("🔍 اكتشاف! فجوة بين الشراء والاستخدام");
      }
    } else {
      setCompareResult(`الفرق طبيعي: ${gap} وحدة`);
    }
    playSound("reveal");
  };

  // Handle filter analysis
  const handleFilterAnalysis = () => {
    if (filterSupplier === "النور للتوريدات" && !hasInsight("insight-sara-enters")) {
      discoverInsight("insight-sara-enters");
      toast.success("🔍 اكتشاف! سارة تدخل كل فواتير النور");
    }
    
    // Check for fast payments
    if (paymentsData && paymentsData.length > 0 && !hasInsight("insight-fast-payments")) {
      const nourPayments = paymentsData.filter((p: any) => p.supplier.includes("النور"));
      const fastPayments = nourPayments.filter((p: any) => p.daysAfterInvoice <= 1);
      if (fastPayments.length >= 3) {
        discoverInsight("insight-fast-payments");
        toast.success("🔍 اكتشاف! مدفوعات متسارعة للنور");
      }
    }
    playSound("reveal");
  };

  // Handle highlight outliers
  const handleHighlightOutliers = () => {
    handlePivotAnalysis(); // Uses same logic
    
    if (paymentsData && !hasInsight("insight-fast-payments")) {
      const nourPayments = paymentsData.filter((p: any) => p.supplier.includes("النور"));
      const fastPayments = nourPayments.filter((p: any) => p.daysAfterInvoice <= 1);
      if (fastPayments.length >= 3) {
        discoverInsight("insight-fast-payments");
        toast.success("🔍 اكتشاف! النور بياخد فلوسه في يوم واحد");
      }
    }
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case "tool-filter":
        return (
          <GameCard title="🔍 فلترة وترتيب" iconEmoji="🔍" className="w-full max-w-4xl">
            <div className="space-y-4 p-2">
              {!invoiceData ? (
                <p className="text-muted-foreground p-8 bg-card/30 rounded-xl text-center">
                  تحتاج جمع ملف الفواتير أولاً من غرفة المحاسبة
                </p>
              ) : (
                <>
                  <div className="flex gap-4 items-center">
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
                      onClick={handleFilterAnalysis}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold"
                    >
                      تحليل المدخل (Entered_By)
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
                              <td className="p-2 text-foreground">{inv.supplier}</td>
                              <td className="p-2 text-foreground">{inv.item}</td>
                              <td className="p-2 text-destructive">{inv.total.toLocaleString()}</td>
                              <td className="p-2 text-primary font-bold">{inv.enteredBy}</td>
                              <td className="p-2">{inv.hasReceipt ? "✓" : "✗"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </GameCard>
        );

      case "tool-pivot":
        return (
          <GameCard title="📊 تجميع وتحليل (Pivot)" iconEmoji="📊" className="w-full max-w-4xl">
            <div className="space-y-4 p-2">
              {!invoiceData ? (
                <p className="text-muted-foreground p-8 bg-card/30 rounded-xl text-center">
                  تحتاج جمع ملف الفواتير أولاً
                </p>
              ) : (
                <>
                  <button
                    onClick={handlePivotAnalysis}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                  >
                    تحليل الموردين (Pivot Table)
                  </button>
                  
                  <div className="space-y-4">
                    {supplierAnalysis.map((supplier) => (
                      <div key={supplier.name} className={cn(
                        "p-4 rounded-xl border",
                        supplier.name.includes("النور") ? "bg-destructive/10 border-destructive/30" : "bg-card/30 border-border"
                      )}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-foreground">{supplier.name}</h4>
                          <span className="text-destructive font-bold">{supplier.total.toLocaleString()} ر.س</span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{supplier.count} فواتير</span>
                          <span>متوسط: {supplier.avgPrice.toLocaleString()}</span>
                          <span className={supplier.noReceiptPercent > 50 ? "text-amber-400 font-bold" : ""}>
                            بدون إيصال: {supplier.noReceiptPercent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </GameCard>
        );

      case "tool-compare":
        return (
          <GameCard title="⚖️ مقارنة الاستلام والصرف" iconEmoji="⚖️" className="w-full max-w-4xl">
            <div className="space-y-4 p-2">
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
                    compareResult.includes("فجوة") ? "bg-destructive/10 border-destructive/30" : "bg-card/30 border-border"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-foreground text-lg">{compareResult}</p>
                </motion.div>
              )}
            </div>
          </GameCard>
        );

      case "tool-highlight":
        return (
          <GameCard title="⚡ إبراز القيم الشاذة" iconEmoji="⚡" className="w-full max-w-4xl">
            <div className="space-y-4 p-2">
              <p className="text-muted-foreground">ابحث عن القيم الغريبة في البيانات</p>
              
              <button
                onClick={handleHighlightOutliers}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
              >
                ⚡ ابحث عن الشاذ (Outliers)
              </button>

              {(invoiceData || paymentsData) && (
                <div className="space-y-3">
                  {supplierAnalysis.filter(s => s.noReceiptPercent > 70).map((s) => (
                    <div key={s.name} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <p className="text-amber-400 font-bold">⚠️ {s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.noReceiptPercent}% فواتير بدون إيصالات</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GameCard>
        );

      case "insights-board":
        return (
          <GameCard title="💡 لوحة الاكتشافات" iconEmoji="💡" className="w-full max-w-4xl">
            <div className="space-y-4 p-2">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
                  <p className="text-3xl font-bold text-accent">{state.discoveredInsights.length}</p>
                  <p className="text-sm text-muted-foreground">اكتشافات</p>
                </div>
                <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
                  <p className="text-3xl font-bold text-primary">{INSIGHTS.length}</p>
                  <p className="text-sm text-muted-foreground">إجمالي</p>
                </div>
              </div>

              {state.discoveredInsights.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  استخدم أدوات التحليل لاكتشاف الأنماط!
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-auto">
                  {INSIGHTS.filter(i => hasInsight(i.id)).map((insight) => (
                    <motion.div
                      key={insight.id}
                      className="p-4 rounded-xl bg-accent/10 border border-accent/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h4 className="font-bold text-accent">{insight.name}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <p className="text-xs text-primary mt-2">+{insight.points} نقطة</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </GameCard>
        );

      default:
        return null;
    }
  };

  return (
    <InteractiveRoom
      backgroundImage={analysisLabBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activeTool}
      overlayContent={activeTool ? renderToolContent() : null}
      onCloseOverlay={() => setActiveTool(null)}
    >
      {/* Room label */}
      <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="px-6 py-3 rounded-full bg-accent/20 backdrop-blur-xl border border-accent/30">
          <span className="font-bold text-accent">🔬 غرفة التحليل</span>
          <span className="mr-4 text-muted-foreground">اكتشافات: {state.discoveredInsights.length}/{INSIGHTS.length}</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="absolute top-6 right-6 z-20">
        <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-amber-400 font-bold">{state.score} نقطة</span>
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
        <NavigationButton iconEmoji="📦" label="المخزن" onClick={() => onNavigate("warehouse")} />
      </div>
    </InteractiveRoom>
  );
};
