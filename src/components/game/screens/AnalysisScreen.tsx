import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Table, Filter, BarChart3, GitMerge, FileText, ArrowLeft,
  ArrowUpDown, ChevronDown, Plus, Trash2, X
} from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { 
  BANK_TRANSACTIONS, 
  PURCHASE_INVOICES, 
  SYSTEM_ACCESS_LOGS,
  SUSPECTS 
} from "@/data/case1";
import { cn } from "@/lib/utils";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "data" | "chart" | "compare" | "notebook";
type DataSource = "transactions" | "invoices" | "logs";
type SortDirection = "asc" | "desc" | null;

interface UserNote {
  id: string;
  text: string;
  category: "observation" | "suspicion" | "pattern" | "question";
  timestamp: number;
}

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { state, getTrustLevel, addUserNote, getUserNotes, deleteUserNote } = useGame();
  const trustLevel = getTrustLevel();
  
  const [activeTab, setActiveTab] = useState<TabType>("data");
  
  // Data Table State
  const [selectedSource, setSelectedSource] = useState<DataSource>("transactions");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  // Chart Builder State
  const [chartType, setChartType] = useState<"bar" | "comparison">("bar");
  const [chartXAxis, setChartXAxis] = useState<string>("month");
  const [chartYAxis, setChartYAxis] = useState<string>("amount");
  const [chartGroupBy, setChartGroupBy] = useState<string>("person");
  const [chartBuilt, setChartBuilt] = useState(false);
  
  // Data Comparator State
  const [compareSource1, setCompareSource1] = useState<DataSource>("transactions");
  const [compareSource2, setCompareSource2] = useState<DataSource>("invoices");
  const [compareField, setCompareField] = useState<string>("date");
  const [comparisonResult, setComparisonResult] = useState<any[] | null>(null);
  
  // Notebook State
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<UserNote["category"]>("observation");

  const tabs = [
    { id: "data" as const, label: "📊 جدول البيانات", icon: Table },
    { id: "chart" as const, label: "📈 بناء رسم بياني", icon: BarChart3 },
    { id: "compare" as const, label: "🔗 مقارنة البيانات", icon: GitMerge },
    { id: "notebook" as const, label: "📝 دفتر الملاحظات", icon: FileText },
  ];

  // Get data based on source
  const getDataSource = (source: DataSource) => {
    switch (source) {
      case "transactions":
        return BANK_TRANSACTIONS.map(t => ({
          ...t,
          person: t.enteredBy === "karim" ? "كريم" : t.enteredBy === "sara" ? "سارة" : "أحمد",
          month: t.date.substring(0, 7),
          verified: t.verified ? "نعم" : "لا"
        }));
      case "invoices":
        return PURCHASE_INVOICES.map(inv => ({
          ...inv,
          requestedByName: inv.requestedBy === "karim" ? "كريم" : inv.requestedBy === "sara" ? "سارة" : "أحمد",
          hasReceiptText: inv.hasReceipt ? "نعم" : "لا",
          month: inv.date.substring(0, 7)
        }));
      case "logs":
        return SYSTEM_ACCESS_LOGS.map(log => ({
          ...log,
          userName: log.user === "karim" ? "كريم" : log.user === "sara" ? "سارة" : "أحمد",
          afterHoursText: log.afterHours ? "نعم" : "لا",
          month: log.date.substring(0, 7)
        }));
    }
  };

  const getColumns = (source: DataSource): { key: string; label: string; type: "text" | "number" | "boolean" }[] => {
    switch (source) {
      case "transactions":
        return [
          { key: "date", label: "التاريخ", type: "text" },
          { key: "description", label: "الوصف", type: "text" },
          { key: "amount", label: "المبلغ", type: "number" },
          { key: "category", label: "التصنيف", type: "text" },
          { key: "person", label: "أدخله", type: "text" },
          { key: "verified", label: "موثق", type: "text" },
        ];
      case "invoices":
        return [
          { key: "date", label: "التاريخ", type: "text" },
          { key: "vendor", label: "المورد", type: "text" },
          { key: "items", label: "البنود", type: "text" },
          { key: "amount", label: "المبلغ", type: "number" },
          { key: "requestedByName", label: "طالب الشراء", type: "text" },
          { key: "hasReceiptText", label: "إيصال", type: "text" },
        ];
      case "logs":
        return [
          { key: "date", label: "التاريخ", type: "text" },
          { key: "time", label: "الوقت", type: "text" },
          { key: "userName", label: "المستخدم", type: "text" },
          { key: "action", label: "الإجراء", type: "text" },
          { key: "details", label: "التفاصيل", type: "text" },
          { key: "afterHoursText", label: "بعد الدوام", type: "text" },
        ];
    }
  };

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let data: Record<string, any>[] = getDataSource(selectedSource) as Record<string, any>[];
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        data = data.filter(item => String(item[key]).includes(value));
      }
    });
    
    // Apply sorting
    if (sortColumn && sortDirection) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    
    return data;
  }, [selectedSource, filters, sortColumn, sortDirection]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const data = processedData;
    const numericColumns = getColumns(selectedSource).filter(c => c.type === "number");
    
    const stats: Record<string, { count: number; sum: number; avg: number; min: number; max: number }> = {};
    
    numericColumns.forEach(col => {
      const values = data.map(d => (d as any)[col.key]).filter(v => typeof v === "number");
      if (values.length > 0) {
        stats[col.key] = {
          count: values.length,
          sum: values.reduce((a, b) => a + b, 0),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });
    
    return stats;
  }, [processedData, selectedSource]);

  // Column statistics for selected column
  const columnStats = useMemo(() => {
    if (!selectedColumn) return null;
    
    const data = processedData;
    const values = data.map(d => (d as any)[selectedColumn]);
    
    // Group by value
    const grouped: Record<string, number> = {};
    values.forEach(v => {
      const key = String(v);
      grouped[key] = (grouped[key] || 0) + 1;
    });
    
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [processedData, selectedColumn]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortColumn(null); setSortDirection(null); }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    addUserNote(newNoteText.trim(), newNoteCategory);
    setNewNoteText("");
  };

  // Build comparison
  const handleCompare = () => {
    const data1 = getDataSource(compareSource1);
    const data2 = getDataSource(compareSource2);
    
    // Simple date-based comparison
    const result: any[] = [];
    
    data1.forEach(item1 => {
      const date = (item1 as any).date;
      const matches = data2.filter(item2 => (item2 as any).date === date);
      
      if (matches.length > 0) {
        matches.forEach(match => {
          result.push({
            date,
            source1: compareSource1 === "transactions" ? (item1 as any).description : 
                     compareSource1 === "invoices" ? (item1 as any).vendor : (item1 as any).action,
            amount1: (item1 as any).amount || "-",
            source2: compareSource2 === "transactions" ? (match as any).description :
                     compareSource2 === "invoices" ? (match as any).vendor : (match as any).action,
            amount2: (match as any).amount || "-",
            person1: (item1 as any).person || (item1 as any).requestedByName || (item1 as any).userName,
            person2: (match as any).person || (match as any).requestedByName || (match as any).userName,
          });
        });
      }
    });
    
    setComparisonResult(result);
  };

  // Chart data
  const chartData = useMemo(() => {
    if (!chartBuilt) return null;
    
    const data = getDataSource("transactions");
    
    // Group by person and month
    const grouped: Record<string, Record<string, number>> = {};
    
    data.forEach(item => {
      const person = (item as any).person;
      const month = (item as any).month;
      const amount = Math.abs((item as any).amount || 0);
      
      if ((item as any).amount < 0) { // Only expenses
        if (!grouped[person]) grouped[person] = {};
        grouped[person][month] = (grouped[person][month] || 0) + amount;
      }
    });
    
    return grouped;
  }, [chartBuilt]);

  const renderDataTable = () => (
    <div className="space-y-4">
      {/* Source Selection */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "transactions" as const, label: "المعاملات البنكية" },
          { id: "invoices" as const, label: "الفواتير" },
          { id: "logs" as const, label: "سجلات الدخول" },
        ].map(source => (
          <button
            key={source.id}
            onClick={() => { setSelectedSource(source.id); setFilters({}); setSortColumn(null); setSortDirection(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedSource === source.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-foreground hover:bg-secondary"
            )}
          >
            {source.label}
          </button>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-muted-foreground">فلترة:</span>
        {getColumns(selectedSource).slice(0, 4).map(col => (
          <div key={col.key} className="relative">
            <select
              value={filters[col.key] || "all"}
              onChange={(e) => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
              className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm appearance-none pr-8"
            >
              <option value="all">{col.label}: الكل</option>
              {[...new Set(getDataSource(selectedSource).map(d => String((d as any)[col.key])))].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        ))}
        {Object.keys(filters).filter(k => filters[k] && filters[k] !== "all").length > 0 && (
          <button
            onClick={() => setFilters({})}
            className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-sm flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-auto max-h-[350px] rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 sticky top-0">
            <tr>
              {getColumns(selectedSource).map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-right p-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className={cn(
                      "w-3 h-3 transition-colors",
                      sortColumn === col.key ? "text-primary" : "text-muted-foreground/50"
                    )} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                {getColumns(selectedSource).map(col => (
                  <td 
                    key={col.key} 
                    className={cn(
                      "p-3",
                      col.type === "number" && "font-mono",
                      col.key === "amount" && (item as any).amount < 0 && "text-destructive",
                      col.key === "amount" && (item as any).amount > 0 && "text-green-400"
                    )}
                  >
                    {col.key === "amount" ? ((item as any)[col.key] as number).toLocaleString() : String((item as any)[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Row */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-sm text-muted-foreground">عدد الصفوف:</span>
            <span className="font-bold text-foreground mr-2">{processedData.length}</span>
          </div>
          {Object.entries(summaryStats).map(([key, stats]) => (
            <div key={key} className="flex gap-4">
              <div>
                <span className="text-sm text-muted-foreground">المجموع:</span>
                <span className="font-bold text-foreground mr-2">{stats.sum.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">المتوسط:</span>
                <span className="font-bold text-foreground mr-2">{Math.round(stats.avg).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column Analysis */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-muted-foreground">تحليل عمود:</span>
          <select
            value={selectedColumn || ""}
            onChange={(e) => setSelectedColumn(e.target.value || null)}
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-sm"
          >
            <option value="">اختر عمود...</option>
            {getColumns(selectedSource).map(col => (
              <option key={col.key} value={col.key}>{col.label}</option>
            ))}
          </select>
        </div>
        
        {columnStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {columnStats.map(([value, count]) => (
              <div key={value} className="p-2 rounded-lg bg-background/50 text-center">
                <p className="text-sm font-medium text-foreground truncate">{value}</p>
                <p className="text-xs text-muted-foreground">{count} مرة</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChartBuilder = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">اختر إعدادات الرسم البياني ثم اضغط "إنشاء"</p>
      
      {/* Chart Settings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">نوع الرسم</label>
          <select
            value={chartType}
            onChange={(e) => { setChartType(e.target.value as any); setChartBuilt(false); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="bar">أعمدة</option>
            <option value="comparison">مقارنة</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">المحور X</label>
          <select
            value={chartXAxis}
            onChange={(e) => { setChartXAxis(e.target.value); setChartBuilt(false); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="month">الشهر</option>
            <option value="category">التصنيف</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">المحور Y</label>
          <select
            value={chartYAxis}
            onChange={(e) => { setChartYAxis(e.target.value); setChartBuilt(false); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="amount">المبلغ</option>
            <option value="count">العدد</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">تجميع حسب</label>
          <select
            value={chartGroupBy}
            onChange={(e) => { setChartGroupBy(e.target.value); setChartBuilt(false); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="person">الشخص</option>
            <option value="verified">التوثيق</option>
          </select>
        </div>
      </div>

      <motion.button
        onClick={() => setChartBuilt(true)}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        📊 إنشاء الرسم البياني
      </motion.button>

      {/* Chart Display */}
      {chartBuilt && chartData && (
        <motion.div
          className="p-6 rounded-xl bg-card/50 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-bold text-foreground mb-4">مصروفات كل شخص حسب الشهر</h4>
          
          <div className="space-y-4">
            {Object.entries(chartData).map(([person, months]) => {
              const total = Object.values(months).reduce((a, b) => a + b, 0);
              const maxTotal = Math.max(...Object.values(chartData).map(m => Object.values(m).reduce((a, b) => a + b, 0)));
              
              return (
                <div key={person} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">{person}</span>
                    <span className="text-muted-foreground text-sm">{total.toLocaleString()} ريال</span>
                  </div>
                  
                  {/* Monthly breakdown */}
                  <div className="flex gap-1 h-8">
                    {["2024-01", "2024-02", "2024-03"].map(month => {
                      const value = months[month] || 0;
                      const height = maxTotal > 0 ? (value / maxTotal) * 100 : 0;
                      return (
                        <motion.div
                          key={month}
                          className="flex-1 bg-secondary/30 rounded relative overflow-hidden"
                          title={`${month}: ${value.toLocaleString()} ريال`}
                        >
                          <motion.div
                            className={cn(
                              "absolute bottom-0 left-0 right-0 rounded",
                              person === "كريم" ? "bg-amber-500" :
                              person === "سارة" ? "bg-blue-500" : "bg-green-500"
                            )}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Month labels */}
                  <div className="flex gap-1 text-xs text-muted-foreground">
                    <span className="flex-1 text-center">يناير</span>
                    <span className="flex-1 text-center">فبراير</span>
                    <span className="flex-1 text-center">مارس</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500" />
              <span className="text-sm text-muted-foreground">كريم</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm text-muted-foreground">سارة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm text-muted-foreground">أحمد</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderDataComparator = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">اختر مصدرين للبيانات لدمجهما ومقارنتهما</p>
      
      {/* Comparison Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">المصدر الأول</label>
          <select
            value={compareSource1}
            onChange={(e) => { setCompareSource1(e.target.value as DataSource); setComparisonResult(null); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="transactions">المعاملات البنكية</option>
            <option value="invoices">الفواتير</option>
            <option value="logs">سجلات الدخول</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">المصدر الثاني</label>
          <select
            value={compareSource2}
            onChange={(e) => { setCompareSource2(e.target.value as DataSource); setComparisonResult(null); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="transactions">المعاملات البنكية</option>
            <option value="invoices">الفواتير</option>
            <option value="logs">سجلات الدخول</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">الربط عن طريق</label>
          <select
            value={compareField}
            onChange={(e) => { setCompareField(e.target.value); setComparisonResult(null); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="date">التاريخ</option>
          </select>
        </div>
      </div>

      <motion.button
        onClick={handleCompare}
        disabled={compareSource1 === compareSource2}
        className={cn(
          "w-full py-3 rounded-xl font-bold transition-all",
          compareSource1 !== compareSource2
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        )}
        whileHover={compareSource1 !== compareSource2 ? { scale: 1.02 } : {}}
      >
        🔗 دمج ومقارنة البيانات
      </motion.button>

      {/* Comparison Result */}
      {comparisonResult && (
        <motion.div
          className="rounded-xl border border-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-3 bg-secondary/50 border-b border-border">
            <p className="font-bold text-foreground">نتيجة المقارنة ({comparisonResult.length} تطابق)</p>
          </div>
          
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 sticky top-0">
                <tr>
                  <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                  <th className="text-right p-2 text-muted-foreground">المصدر 1</th>
                  <th className="text-right p-2 text-muted-foreground">المبلغ 1</th>
                  <th className="text-right p-2 text-muted-foreground">المصدر 2</th>
                  <th className="text-right p-2 text-muted-foreground">المبلغ 2</th>
                  <th className="text-right p-2 text-muted-foreground">الشخص</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResult.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 font-mono text-xs">{row.date}</td>
                    <td className="p-2 text-foreground">{row.source1}</td>
                    <td className="p-2 font-mono">{typeof row.amount1 === "number" ? row.amount1.toLocaleString() : row.amount1}</td>
                    <td className="p-2 text-foreground">{row.source2}</td>
                    <td className="p-2 font-mono">{typeof row.amount2 === "number" ? row.amount2.toLocaleString() : row.amount2}</td>
                    <td className="p-2">{row.person1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {comparisonResult.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              لا توجد تطابقات في التواريخ بين المصدرين
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  const renderNotebook = () => {
    const userNotes = getUserNotes();
    
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
          <p className="text-accent font-medium">📝 دفتر ملاحظاتك الشخصي</p>
          <p className="text-sm text-muted-foreground mt-1">
            سجّل ملاحظاتك وأفكارك هنا. هذه الملاحظات لك وحدك - السيستم لن يصحح أو يقيّم ما تكتبه.
          </p>
        </div>

        {/* Add Note Form */}
        <div className="p-4 rounded-xl bg-card/50 border border-border space-y-4">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="اكتب ملاحظتك هنا..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir="rtl"
          />
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {[
                { id: "observation" as const, label: "👁️ ملاحظة", color: "bg-blue-500/20 text-blue-400" },
                { id: "suspicion" as const, label: "🤔 شك", color: "bg-amber-500/20 text-amber-400" },
                { id: "pattern" as const, label: "🔍 نمط", color: "bg-purple-500/20 text-purple-400" },
                { id: "question" as const, label: "❓ سؤال", color: "bg-green-500/20 text-green-400" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setNewNoteCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    newNoteCategory === cat.id ? cat.color : "bg-secondary/50 text-muted-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <motion.button
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className={cn(
                "px-6 py-2 rounded-lg font-bold flex items-center gap-2",
                newNoteText.trim()
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
              whileHover={newNoteText.trim() ? { scale: 1.05 } : {}}
            >
              <Plus className="w-4 h-4" />
              إضافة
            </motion.button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          <h4 className="font-bold text-foreground">ملاحظاتي ({userNotes.length})</h4>
          
          {userNotes.length === 0 ? (
            <div className="p-8 rounded-xl bg-card/30 border border-border text-center">
              <p className="text-muted-foreground">لم تسجل أي ملاحظات بعد.</p>
              <p className="text-sm text-muted-foreground mt-2">
                ابدأ بتسجيل ما تلاحظه أثناء تحليل البيانات.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-auto">
              <AnimatePresence>
                {userNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    className={cn(
                      "p-4 rounded-xl border flex items-start gap-3",
                      note.category === "observation" ? "bg-blue-500/10 border-blue-500/30" :
                      note.category === "suspicion" ? "bg-amber-500/10 border-amber-500/30" :
                      note.category === "pattern" ? "bg-purple-500/10 border-purple-500/30" :
                      "bg-green-500/10 border-green-500/30"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <span className="text-xl">
                      {note.category === "observation" ? "👁️" :
                       note.category === "suspicion" ? "🤔" :
                       note.category === "pattern" ? "🔍" : "❓"}
                    </span>
                    <div className="flex-1">
                      <p className="text-foreground">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.timestamp).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteUserNote(note.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => onNavigate("office")}
              className="p-2 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">غرفة التحليل</h1>
              <p className="text-sm text-muted-foreground">حلل البيانات واكتشف الأنماط بنفسك</p>
            </div>
          </div>
          
          {/* Trust Indicator */}
          <div className={cn(
            "px-4 py-2 rounded-xl border",
            trustLevel === "critical" ? "bg-destructive/20 border-destructive/50 text-destructive" :
            trustLevel === "low" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" :
            trustLevel === "medium" ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" :
            "bg-green-500/20 border-green-500/50 text-green-400"
          )}>
            <span className="font-bold">{state.trust}%</span>
            <span className="text-sm mr-2">ثقة</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {activeTab === "data" && renderDataTable()}
              {activeTab === "chart" && renderChartBuilder()}
              {activeTab === "compare" && renderDataComparator()}
              {activeTab === "notebook" && renderNotebook()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <NavigationButton
            onClick={() => onNavigate("office")}
            iconEmoji="🏠"
            label="المكتب"
          />
          <NavigationButton
            onClick={() => onNavigate("evidence")}
            iconEmoji="📁"
            label="الأدلة"
          />
          <NavigationButton
            onClick={() => onNavigate("interrogation")}
            iconEmoji="🗣️"
            label="الاستجواب"
          />
        </div>
      </div>
    </div>
  );
};
