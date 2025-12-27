import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, BarChart3, Link2, Lightbulb, Calculator, SortAsc, Hash, Layers, CheckCircle, Clock, Shield, Lock, Table2 } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { BANK_TRANSACTIONS, PURCHASE_INVOICES, ACTIVITY_LOG, HYPOTHESES, SUSPECTS } from "@/data/case1";
import { cn } from "@/lib/utils";
import analysisRoom from "@/assets/rooms/analysis-room.png";
import { InteractiveRoom } from "../InteractiveRoom";
import { toast } from "sonner";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type ToolType = "filter" | "sort" | "sum" | "count" | "groupby" | "match";
type DataSource = "transactions" | "invoices" | "logs";

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { state, getTrustLevel, discoverInsight, hasInsight, setActiveHypothesis, addNote, setPhase } = useGame();
  const trustLevel = getTrustLevel();
  
  // Tool state
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  
  // Filter state
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // GroupBy state
  const [groupByColumn, setGroupByColumn] = useState<string>("");
  const [aggregateType, setAggregateType] = useState<"sum" | "count">("count");
  
  // Match state
  const [matchSource1, setMatchSource1] = useState<DataSource>("transactions");
  const [matchSource2, setMatchSource2] = useState<DataSource>("invoices");
  
  // Results
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState<any[]>([]);
  const [resultSummary, setResultSummary] = useState<string>("");
  
  // Hypothesis panel
  const [showHypothesis, setShowHypothesis] = useState(false);

  const tools = [
    { id: "filter" as const, name: "فلترة", icon: Filter, description: "تصفية البيانات حسب شرط" },
    { id: "sort" as const, name: "ترتيب", icon: SortAsc, description: "ترتيب البيانات" },
    { id: "sum" as const, name: "مجموع", icon: Calculator, description: "حساب المجموع" },
    { id: "count" as const, name: "عدد", icon: Hash, description: "عدد الصفوف" },
    { id: "groupby" as const, name: "تجميع", icon: Layers, description: "تجميع البيانات" },
    { id: "match" as const, name: "مطابقة", icon: Link2, description: "مقارنة جدولين" },
  ];

  // Data sources based on collected evidence
  const availableDataSources = useMemo(() => {
    const sources: { id: DataSource; name: string; locked: boolean }[] = [];
    
    // البنك يظهر لو جمعت "bank_summary" أو "bank_detailed"
    const hasBankEvidence = state.collectedEvidence.some(e => e.includes("bank"));
    sources.push({ 
      id: "transactions", 
      name: "المعاملات البنكية", 
      locked: !hasBankEvidence 
    });
    
    // السجلات تظهر لو جمعت "system_log" أو "activity_log"
    const hasLogEvidence = state.collectedEvidence.some(e => e.includes("log"));
    sources.push({ 
      id: "logs", 
      name: "سجلات النظام", 
      locked: !hasLogEvidence 
    });
    
    // الفواتير تظهر فقط في Pack 2 أو بعده
    const hasInvoiceEvidence = state.collectedEvidence.some(e => e.includes("invoice"));
    sources.push({ 
      id: "invoices", 
      name: "الفواتير", 
      locked: !hasInvoiceEvidence 
    });
    
    return sources;
  }, [state.collectedEvidence]);

  const getDataColumns = (source: DataSource) => {
    switch (source) {
      case "transactions":
        return ["date", "description", "amount", "category", "enteredBy"];
      case "invoices":
        return ["date", "vendor", "amount", "requestedBy", "hasReceipt"];
      case "logs":
        return ["date", "time", "user", "action"];
    }
  };

  const getData = (source: DataSource) => {
    switch (source) {
      case "transactions": return BANK_TRANSACTIONS;
      case "invoices": return PURCHASE_INVOICES;
      case "logs": return ACTIVITY_LOG;
    }
  };

  const columnLabels: Record<string, string> = {
    date: "التاريخ",
    description: "الوصف",
    amount: "المبلغ",
    category: "الفئة",
    enteredBy: "المسؤول",
    vendor: "المورد",
    requestedBy: "الطالب",
    hasReceipt: "إيصال",
    time: "الوقت",
    user: "المستخدم",
    action: "الإجراء",
    count: "العدد",
    sum: "المجموع",
    total: "المجموع",
  };

  // Execute tool
  const executeTool = () => {
    if (!dataSource) {
      toast.error("اختر جدول البيانات أولاً");
      return;
    }
    
    const data = getData(dataSource);
    let results: any[] = [];
    let summary = "";

    switch (activeTool) {
      case "filter":
        if (!filterColumn || !filterValue) {
          toast.error("اختر العمود والقيمة للفلترة");
          return;
        }
        results = data.filter((row: any) => {
          const val = String(row[filterColumn]).toLowerCase();
          return val.includes(filterValue.toLowerCase());
        });
        summary = `تم فلترة ${results.length} صف من ${data.length} (${columnLabels[filterColumn]} يحتوي "${filterValue}")`;
        break;

      case "sort":
        if (!sortColumn) {
          toast.error("اختر العمود للترتيب");
          return;
        }
        results = [...data].sort((a: any, b: any) => {
          if (sortDirection === "asc") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
          }
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        });
        summary = `تم ترتيب ${results.length} صف حسب ${columnLabels[sortColumn]} (${sortDirection === "asc" ? "تصاعدي" : "تنازلي"})`;
        break;

      case "sum":
        const sumTotal = data.reduce((acc: number, row: any) => {
          const val = parseFloat(row.amount) || 0;
          return acc + val;
        }, 0);
        results = [{ total: sumTotal }];
        summary = `المجموع الكلي: ${sumTotal.toLocaleString()} ريال`;
        break;

      case "count":
        results = [{ count: data.length }];
        summary = `إجمالي عدد الصفوف: ${data.length}`;
        break;

      case "groupby":
        if (!groupByColumn) {
          toast.error("اختر العمود للتجميع");
          return;
        }
        const groups: Record<string, { count: number; sum: number }> = {};
        data.forEach((row: any) => {
          const key = String(row[groupByColumn]);
          if (!groups[key]) {
            groups[key] = { count: 0, sum: 0 };
          }
          groups[key].count++;
          if (row.amount) {
            groups[key].sum += Math.abs(parseFloat(row.amount)) || 0;
          }
        });
        results = Object.entries(groups).map(([key, val]) => ({
          [groupByColumn]: key,
          count: val.count,
          sum: val.sum,
        }));
        results.sort((a, b) => b.sum - a.sum);
        summary = `تم تجميع البيانات إلى ${results.length} مجموعة حسب ${columnLabels[groupByColumn]}`;
        break;

      case "match":
        // Find invoices without receipts
        const invoicesWithoutReceipt = PURCHASE_INVOICES.filter(inv => !inv.hasReceipt);
        results = invoicesWithoutReceipt.map(inv => ({
          date: inv.date,
          vendor: inv.vendor,
          amount: inv.amount,
          requestedBy: inv.requestedBy,
          hasReceipt: "لا",
        }));
        summary = `فواتير بدون إيصال: ${results.length} من ${PURCHASE_INVOICES.length}`;
        break;
    }

    setResultData(results);
    setResultSummary(summary);
    setShowResults(true);
  };

  // Register insight
  const registerInsight = (insightId: string, name: string, description: string) => {
    if (hasInsight(insightId)) {
      toast.info("تم اكتشاف هذا النمط مسبقاً");
      return;
    }
    
    discoverInsight(insightId, name, description);
    toast.success(`🔍 تم اكتشاف: ${name}`);
    
    // Check if we should show hypothesis selection
    if (state.discoveredInsights.length === 0 && state.gamePhase === "analysis1") {
      setShowHypothesis(true);
    }
  };

  const handleSelectHypothesis = (hypothesisId: string) => {
    const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
    if (hypothesis) {
      setActiveHypothesis(hypothesisId);
      addNote({
        type: "suspicion",
        text: `تم اختيار فرضية: ${hypothesis.title}`,
        source: "analysis",
      });
      setShowHypothesis(false);
      setPhase("evidence_pack2");
      toast.success("تم اختيار الفرضية! الآن يمكنك جمع أدلة جديدة");
    }
  };

  const handleSelectDataSource = (source: DataSource) => {
    const sourceInfo = availableDataSources.find(s => s.id === source);
    if (sourceInfo?.locked) {
      toast.error("يجب جمع الأدلة المرتبطة أولاً");
      return;
    }
    setDataSource(source);
    setShowResults(false);
    // Reset filters when changing source
    setFilterColumn("");
    setFilterValue("");
    setSortColumn("");
    setGroupByColumn("");
  };

  // Current data for the grid
  const currentData = dataSource ? getData(dataSource) : [];
  const currentColumns = dataSource ? getDataColumns(dataSource) : [];

  return (
    <InteractiveRoom
      backgroundImage={analysisRoom}
      hotspots={[]}
      onHotspotClick={() => {}}
      activeHotspot={null}
      overlayContent={null}
      onCloseOverlay={() => {}}
    >
      {/* Objective Bar */}
      <motion.div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <span className="text-muted-foreground text-xs ml-2">📋</span>
          <span className="font-bold text-foreground text-sm">{state.currentObjective}</span>
        </div>
      </motion.div>

      {/* Trust & Time */}
      <motion.div className="absolute top-14 left-1/2 -translate-x-1/2 z-20">
        <div className={cn(
          "px-4 py-1 rounded-full backdrop-blur-xl border flex items-center gap-3 text-xs",
          trustLevel === "high" ? "bg-green-500/20 border-green-500/30" :
          trustLevel === "medium" ? "bg-amber-500/20 border-amber-500/30" :
          "bg-destructive/20 border-destructive/30"
        )}>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {state.trust}%
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {state.timeRemaining}/{state.maxTime}
          </span>
          <span className="flex items-center gap-1 text-accent">
            🔍 {state.discoveredInsights.length}/3
          </span>
        </div>
      </motion.div>

      {/* Main Analysis Panel - Excel-like Design */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-4 pt-24">
        <motion.div 
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 max-w-6xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            غرفة التحليل
          </h2>

          {/* Section 1: Data Source Selection */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">📊 اختر الجدول:</label>
            <div className="flex gap-2 flex-wrap">
              {availableDataSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSelectDataSource(source.id)}
                  disabled={source.locked}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    source.locked 
                      ? "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60"
                      : dataSource === source.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                  )}
                >
                  {source.locked ? <Lock className="w-3 h-3" /> : <Table2 className="w-3 h-3" />}
                  {source.name}
                  {source.locked && <span className="text-xs">(اجمع الأدلة أولاً)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Data Grid (Excel-like) */}
          {dataSource ? (
            <div className="flex-1 flex flex-col min-h-0 mb-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                📋 البيانات ({currentData.length} صف):
              </label>
              <div className="flex-1 overflow-auto border border-border rounded-lg bg-card/50">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-secondary/50 sticky top-0 z-10">
                    <tr>
                      <th className="p-2 text-right border-l border-border text-muted-foreground font-bold w-10">#</th>
                      {currentColumns.map(col => (
                        <th key={col} className="p-2 text-right border-l border-border text-muted-foreground font-bold">
                          {columnLabels[col]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row: any, i) => (
                      <tr 
                        key={i} 
                        className={cn(
                          "border-b border-border/50 hover:bg-primary/5 transition-colors",
                          i % 2 === 0 ? "bg-background" : "bg-secondary/20"
                        )}
                      >
                        <td className="p-2 text-right border-l border-border text-muted-foreground">{i + 1}</td>
                        {currentColumns.map(col => (
                          <td key={col} className="p-2 text-right border-l border-border text-foreground">
                            {col === "hasReceipt" 
                              ? (row[col] ? "✅ نعم" : "❌ لا")
                              : col === "amount" 
                                ? `${Number(row[col]).toLocaleString()} ريال`
                                : String(row[col])
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-secondary/20 rounded-lg border border-dashed border-border mb-4">
              <div className="text-center text-muted-foreground">
                <Table2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>اختر جدول من الأعلى لعرض البيانات</p>
              </div>
            </div>
          )}

          {/* Section 3: Tools */}
          {dataSource && (
            <div className="mb-4 p-3 bg-secondary/30 rounded-lg border border-border">
              <label className="text-sm text-muted-foreground mb-2 block">🔧 الأدوات:</label>
              <div className="flex gap-2 flex-wrap mb-3">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(activeTool === tool.id ? null : tool.id);
                      setShowResults(false);
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm",
                      activeTool === tool.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tool.icon className="w-4 h-4" />
                    {tool.name}
                  </motion.button>
                ))}
              </div>

              {/* Tool Options */}
              <AnimatePresence mode="wait">
                {activeTool && (
                  <motion.div
                    key={activeTool}
                    className="flex items-end gap-3 flex-wrap"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {activeTool === "filter" && (
                      <>
                        <div className="flex-1 min-w-[150px]">
                          <label className="text-xs text-muted-foreground mb-1 block">العمود</label>
                          <select
                            value={filterColumn}
                            onChange={(e) => setFilterColumn(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          >
                            <option value="">اختر...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{columnLabels[col]}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                          <label className="text-xs text-muted-foreground mb-1 block">يحتوي على</label>
                          <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="مثال: karim"
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          />
                        </div>
                      </>
                    )}

                    {activeTool === "sort" && (
                      <>
                        <div className="flex-1 min-w-[150px]">
                          <label className="text-xs text-muted-foreground mb-1 block">العمود</label>
                          <select
                            value={sortColumn}
                            onChange={(e) => setSortColumn(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          >
                            <option value="">اختر...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{columnLabels[col]}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSortDirection("asc")}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm",
                              sortDirection === "asc" ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                            )}
                          >
                            تصاعدي ↑
                          </button>
                          <button
                            onClick={() => setSortDirection("desc")}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm",
                              sortDirection === "desc" ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                            )}
                          >
                            تنازلي ↓
                          </button>
                        </div>
                      </>
                    )}

                    {activeTool === "groupby" && (
                      <>
                        <div className="flex-1 min-w-[150px]">
                          <label className="text-xs text-muted-foreground mb-1 block">تجميع حسب</label>
                          <select
                            value={groupByColumn}
                            onChange={(e) => setGroupByColumn(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          >
                            <option value="">اختر...</option>
                            {currentColumns.map(col => (
                              <option key={col} value={col}>{columnLabels[col]}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setAggregateType("count")}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm",
                              aggregateType === "count" ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                            )}
                          >
                            عدد
                          </button>
                          <button
                            onClick={() => setAggregateType("sum")}
                            className={cn(
                              "px-3 py-2 rounded-lg text-sm",
                              aggregateType === "sum" ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                            )}
                          >
                            مجموع
                          </button>
                        </div>
                      </>
                    )}

                    {activeTool === "match" && (
                      <>
                        <div className="flex-1 min-w-[120px]">
                          <label className="text-xs text-muted-foreground mb-1 block">الجدول الأول</label>
                          <select
                            value={matchSource1}
                            onChange={(e) => setMatchSource1(e.target.value as DataSource)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          >
                            <option value="transactions">المعاملات</option>
                            <option value="invoices">الفواتير</option>
                            <option value="logs">السجلات</option>
                          </select>
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <label className="text-xs text-muted-foreground mb-1 block">الجدول الثاني</label>
                          <select
                            value={matchSource2}
                            onChange={(e) => setMatchSource2(e.target.value as DataSource)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                          >
                            <option value="transactions">المعاملات</option>
                            <option value="invoices">الفواتير</option>
                            <option value="logs">السجلات</option>
                          </select>
                        </div>
                      </>
                    )}

                    {(activeTool === "sum" || activeTool === "count") && (
                      <p className="text-sm text-muted-foreground py-2">
                        {activeTool === "sum" ? "سيتم حساب مجموع عمود المبلغ" : "سيتم عد جميع الصفوف"}
                      </p>
                    )}

                    <motion.button
                      onClick={executeTool}
                      className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm"
                      whileHover={{ scale: 1.02 }}
                    >
                      ⚡ تنفيذ
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Section 4: Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="p-3 bg-accent/10 rounded-lg border border-accent/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    📊 النتيجة
                  </h4>
                  <span className="text-sm text-accent font-medium">{resultSummary}</span>
                </div>

                {resultData.length > 0 && resultData.length <= 20 && (
                  <div className="max-h-40 overflow-auto rounded-lg border border-border bg-background mb-3">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-secondary/50 sticky top-0">
                        <tr>
                          {Object.keys(resultData[0]).map(key => (
                            <th key={key} className="p-2 text-right border-l border-border text-muted-foreground font-bold">
                              {columnLabels[key] || key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {resultData.map((row, i) => (
                          <tr key={i} className={cn(
                            "border-b border-border/50",
                            i % 2 === 0 ? "bg-background" : "bg-secondary/20"
                          )}>
                            {Object.entries(row).map(([key, val], j) => (
                              <td key={j} className="p-2 text-right border-l border-border text-foreground">
                                {key === "sum" || key === "total" || key === "amount"
                                  ? `${Number(val).toLocaleString()} ريال`
                                  : String(val)
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Register Insight */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">اكتشفت نمطاً؟</span>
                  {!hasInsight("after-hours") && (
                    <button
                      onClick={() => registerInsight("after-hours", "نشاط بعد الدوام", "شخص واحد يتكرر دخوله بعد ساعات العمل")}
                      className="px-3 py-1 rounded-lg bg-accent/20 text-accent text-xs hover:bg-accent/30 transition-all"
                    >
                      🌙 نشاط بعد الدوام
                    </button>
                  )}
                  {!hasInsight("no-receipt") && (
                    <button
                      onClick={() => registerInsight("no-receipt", "فواتير بدون إيصالات", "مبالغ كبيرة بدون توثيق")}
                      className="px-3 py-1 rounded-lg bg-accent/20 text-accent text-xs hover:bg-accent/30 transition-all"
                    >
                      📄 فواتير بدون إيصال
                    </button>
                  )}
                  {!hasInsight("same-requester") && (
                    <button
                      onClick={() => registerInsight("same-requester", "طالب واحد للمشتريات", "جميع الفواتير المشبوهة من نفس الشخص")}
                      className="px-3 py-1 rounded-lg bg-accent/20 text-accent text-xs hover:bg-accent/30 transition-all"
                    >
                      👤 نفس الطالب
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discovered Insights */}
          {state.discoveredInsights.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-green-500" />
                الـ Insights المكتشفة ({state.discoveredInsights.length}/3)
              </h4>
              <div className="flex flex-wrap gap-2">
                {state.discoveredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-1 text-xs"
                  >
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-foreground">{insight.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hypothesis Panel */}
      <AnimatePresence>
        {showHypothesis && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background border border-primary/30 rounded-2xl p-6 max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">اختر فرضية للتحقيق</h3>
                  <p className="text-sm text-muted-foreground">اختيار فرضية يفتح أسئلة وأدلة جديدة</p>
                </div>
              </div>

              <div className="space-y-4">
                {HYPOTHESES.map((hypothesis) => {
                  const suspect = SUSPECTS.find(s => s.id === hypothesis.suspectId);
                  return (
                    <motion.button
                      key={hypothesis.id}
                      onClick={() => handleSelectHypothesis(hypothesis.id)}
                      className="w-full p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary text-right transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className="font-bold text-foreground">{hypothesis.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{hypothesis.description}</p>
                      <p className="text-xs text-primary mt-2">المشتبه به: {suspect?.name}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-6 left-6 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-6 right-6 z-20">
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} />
      </div>
    </InteractiveRoom>
  );
};
