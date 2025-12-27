import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, BarChart3, Link2, Lightbulb, ArrowLeft, Calculator, SortAsc, Hash, Layers, CheckCircle, Clock, Shield } from "lucide-react";
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
  const [dataSource, setDataSource] = useState<DataSource>("transactions");
  
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
  const [matchColumn, setMatchColumn] = useState<string>("");
  
  // Results
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState<any[]>([]);
  const [resultSummary, setResultSummary] = useState<string>("");
  
  // Hypothesis panel
  const [showHypothesis, setShowHypothesis] = useState(false);

  const tools = [
    { id: "filter" as const, name: "فلترة", icon: Filter, description: "تصفية البيانات حسب شرط" },
    { id: "sort" as const, name: "ترتيب", icon: SortAsc, description: "ترتيب البيانات تصاعدياً/تنازلياً" },
    { id: "sum" as const, name: "مجموع", icon: Calculator, description: "حساب مجموع عمود" },
    { id: "count" as const, name: "عدد", icon: Hash, description: "عدد الصفوف" },
    { id: "groupby" as const, name: "تجميع", icon: Layers, description: "تجميع + Sum/Count" },
    { id: "match" as const, name: "مطابقة", icon: Link2, description: "مقارنة جدولين" },
  ];

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
  };

  // Execute tool
  const executeTool = () => {
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
        summary = `تم فلترة ${results.length} صف من ${data.length}`;
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
        summary = `تم ترتيب ${results.length} صف حسب ${columnLabels[sortColumn]}`;
        break;

      case "sum":
        const sumTotal = data.reduce((acc: number, row: any) => {
          const val = parseFloat(row.amount) || 0;
          return acc + val;
        }, 0);
        results = [{ total: sumTotal }];
        summary = `المجموع: ${sumTotal.toLocaleString()} ريال`;
        break;

      case "count":
        results = [{ count: data.length }];
        summary = `العدد: ${data.length} صف`;
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
        summary = `تم تجميع ${results.length} مجموعة حسب ${columnLabels[groupByColumn]}`;
        
        // Check for insights
        checkForInsights(results, groupByColumn);
        break;

      case "match":
        // Simple match between two sources
        const data1 = getData(matchSource1);
        const data2 = getData(matchSource2);
        
        // Find items in data1 that don't have matching items in data2
        if (matchSource1 === "invoices" && matchSource2 === "transactions") {
          const invoicesWithoutReceipt = PURCHASE_INVOICES.filter(inv => !inv.hasReceipt);
          results = invoicesWithoutReceipt.map(inv => ({
            vendor: inv.vendor,
            amount: inv.amount,
            requestedBy: inv.requestedBy,
            hasReceipt: inv.hasReceipt,
          }));
          summary = `فواتير بدون إيصال: ${results.length} من ${PURCHASE_INVOICES.length}`;
          
          // Check for no-receipt insight
          if (results.length >= 4) {
            checkNoReceiptInsight(results);
          }
        } else {
          summary = "اختر الفواتير والمعاملات للمقارنة";
        }
        break;
    }

    setResultData(results);
    setResultSummary(summary);
    setShowResults(true);
  };

  const checkForInsights = (groupedData: any[], column: string) => {
    // Check for after-hours pattern in logs
    if (dataSource === "logs" && column === "user") {
      const afterHoursLogs = ACTIVITY_LOG.filter(log => {
        const hour = parseInt(log.time.split(":")[0]);
        return hour >= 18 || hour < 8;
      });
      
      const userCounts: Record<string, number> = {};
      afterHoursLogs.forEach(log => {
        userCounts[log.user] = (userCounts[log.user] || 0) + 1;
      });
      
      const maxUser = Object.entries(userCounts).sort((a, b) => b[1] - a[1])[0];
      if (maxUser && maxUser[1] >= 3) {
        // Potential insight!
      }
    }
    
    // Check for same requester pattern
    if (dataSource === "invoices" && column === "requestedBy") {
      const noReceiptInvoices = PURCHASE_INVOICES.filter(inv => !inv.hasReceipt);
      const requesterCounts: Record<string, number> = {};
      noReceiptInvoices.forEach(inv => {
        requesterCounts[inv.requestedBy] = (requesterCounts[inv.requestedBy] || 0) + 1;
      });
      
      const maxRequester = Object.entries(requesterCounts).sort((a, b) => b[1] - a[1])[0];
      if (maxRequester && maxRequester[1] >= 3) {
        // Potential insight!
      }
    }
  };

  const checkNoReceiptInsight = (invoicesWithoutReceipt: any[]) => {
    // Check if all are from same person
    const requesters = [...new Set(invoicesWithoutReceipt.map(inv => inv.requestedBy))];
    if (requesters.length === 1) {
      // Potential insight!
    }
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

  const renderToolPanel = () => {
    if (!activeTool) return null;

    return (
      <motion.div
        className="bg-card/50 rounded-xl p-4 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Data Source Selector */}
        <div className="mb-4">
          <label className="text-sm text-muted-foreground mb-2 block">مصدر البيانات</label>
          <div className="flex gap-2">
            {(["transactions", "invoices", "logs"] as DataSource[]).map(source => (
              <button
                key={source}
                onClick={() => setDataSource(source)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm transition-all",
                  dataSource === source 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {source === "transactions" ? "المعاملات" : source === "invoices" ? "الفواتير" : "السجلات"}
              </button>
            ))}
          </div>
        </div>

        {/* Tool-specific options */}
        {activeTool === "filter" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">العمود</label>
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="">اختر...</option>
                {getDataColumns(dataSource).map(col => (
                  <option key={col} value={col}>{columnLabels[col]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">القيمة</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="مثال: karim أو > 18:00"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              />
            </div>
          </div>
        )}

        {activeTool === "sort" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">العمود</label>
              <select
                value={sortColumn}
                onChange={(e) => setSortColumn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="">اختر...</option>
                {getDataColumns(dataSource).map(col => (
                  <option key={col} value={col}>{columnLabels[col]}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortDirection("asc")}
                className={cn(
                  "flex-1 py-2 rounded-lg",
                  sortDirection === "asc" ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                تصاعدي ↑
              </button>
              <button
                onClick={() => setSortDirection("desc")}
                className={cn(
                  "flex-1 py-2 rounded-lg",
                  sortDirection === "desc" ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                تنازلي ↓
              </button>
            </div>
          </div>
        )}

        {activeTool === "groupby" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">التجميع حسب</label>
              <select
                value={groupByColumn}
                onChange={(e) => setGroupByColumn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
              >
                <option value="">اختر...</option>
                {getDataColumns(dataSource).map(col => (
                  <option key={col} value={col}>{columnLabels[col]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">العملية</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAggregateType("count")}
                  className={cn(
                    "flex-1 py-2 rounded-lg",
                    aggregateType === "count" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}
                >
                  عدد (Count)
                </button>
                <button
                  onClick={() => setAggregateType("sum")}
                  className={cn(
                    "flex-1 py-2 rounded-lg",
                    aggregateType === "sum" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}
                >
                  مجموع (Sum)
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTool === "match" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">الجدول الأول</label>
                <select
                  value={matchSource1}
                  onChange={(e) => setMatchSource1(e.target.value as DataSource)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                >
                  <option value="transactions">المعاملات</option>
                  <option value="invoices">الفواتير</option>
                  <option value="logs">السجلات</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">الجدول الثاني</label>
                <select
                  value={matchSource2}
                  onChange={(e) => setMatchSource2(e.target.value as DataSource)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground"
                >
                  <option value="transactions">المعاملات</option>
                  <option value="invoices">الفواتير</option>
                  <option value="logs">السجلات</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <motion.button
          onClick={executeTool}
          className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
          whileHover={{ scale: 1.02 }}
        >
          ⚡ تنفيذ
        </motion.button>
      </motion.div>
    );
  };

  const renderResults = () => {
    if (!showResults) return null;

    return (
      <motion.div
        className="bg-card/50 rounded-xl p-4 border border-border mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-foreground">النتائج</h4>
          <span className="text-sm text-muted-foreground">{resultSummary}</span>
        </div>

        {resultData.length > 0 && (
          <div className="max-h-48 overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  {Object.keys(resultData[0]).map(key => (
                    <th key={key} className="text-right p-2 text-muted-foreground">
                      {columnLabels[key] || key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultData.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="p-2 text-foreground">
                        {typeof val === "number" ? val.toLocaleString() : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Register Insight Button */}
        <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-sm text-muted-foreground mb-2">
            هل اكتشفت نمطاً مهماً في هذه النتائج؟
          </p>
          <div className="flex flex-wrap gap-2">
            {!hasInsight("after-hours") && (
              <button
                onClick={() => registerInsight("after-hours", "نشاط بعد الدوام", "شخص واحد يتكرر دخوله بعد ساعات العمل")}
                className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-all"
              >
                🌙 نشاط بعد الدوام
              </button>
            )}
            {!hasInsight("no-receipt") && (
              <button
                onClick={() => registerInsight("no-receipt", "فواتير بدون إيصالات", "مبالغ كبيرة بدون توثيق من نفس الشخص")}
                className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-all"
              >
                📄 فواتير بدون إيصال
              </button>
            )}
            {!hasInsight("same-requester") && (
              <button
                onClick={() => registerInsight("same-requester", "طالب واحد للمشتريات", "جميع الفواتير المشبوهة من نفس الشخص")}
                className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-sm hover:bg-accent/30 transition-all"
              >
                👤 نفس الطالب
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

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
          <span className="flex items-center gap-1 text-accent">
            🔍 Insights: {state.discoveredInsights.length}/3
          </span>
        </div>
      </motion.div>

      {/* Main Analysis Panel */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
        <motion.div 
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-5xl w-full max-h-[75vh] overflow-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            غرفة التحليل
          </h2>

          {/* Tools Grid */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  setShowResults(false);
                }}
                className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/30 border-border hover:border-primary"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tool.icon className="w-6 h-6" />
                <span className="text-sm font-bold">{tool.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Tool Panel */}
          {renderToolPanel()}

          {/* Results */}
          {renderResults()}

          {/* Discovered Insights */}
          {state.discoveredInsights.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                الـ Insights المكتشفة
              </h4>
              <div className="flex flex-wrap gap-2">
                {state.discoveredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="px-3 py-2 rounded-lg bg-accent/20 border border-accent/30 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground">{insight.name}</span>
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
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} />
      </div>
    </InteractiveRoom>
  );
};
