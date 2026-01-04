import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Notebook, Filter, BarChart3, Link2, Lightbulb, ArrowLeft } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { BANK_TRANSACTIONS, PURCHASE_INVOICES, MONTHLY_SUMMARY, HYPOTHESES, SUSPECTS } from "@/data/case1";
import { cn } from "@/lib/utils";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "summary" | "filter" | "chart" | "link" | "hypothesis";

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { state, getTrustLevel, discoverPattern, hasDiscoveredPattern, setActiveHypothesis, addNote } = useGame();
  const trustLevel = getTrustLevel();
  
  const [activeTab, setActiveTab] = useState<TabType>("summary");
  
  // Filter state
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  
  // Link state
  const [selectedEvidence1, setSelectedEvidence1] = useState<string | null>(null);
  const [selectedEvidence2, setSelectedEvidence2] = useState<string | null>(null);
  const [linkResult, setLinkResult] = useState<string | null>(null);

  const tabs = [
    { id: "summary" as const, label: "📊 ملخص", icon: Notebook },
    { id: "filter" as const, label: "🔍 فلترة", icon: Filter },
    { id: "chart" as const, label: "📈 رسم بياني", icon: BarChart3 },
    { id: "link" as const, label: "🔗 ربط الأدلة", icon: Link2 },
    { id: "hypothesis" as const, label: "💡 الفرضيات", icon: Lightbulb },
  ];

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return BANK_TRANSACTIONS.filter(t => {
      const personMatch = filterPerson === "all" || t.enteredBy === filterPerson;
      const monthMatch = filterMonth === "all" || t.date.includes(filterMonth);
      const verifiedMatch = filterVerified === "all" || 
        (filterVerified === "verified" && t.verified) ||
        (filterVerified === "unverified" && !t.verified);
      return personMatch && monthMatch && verifiedMatch;
    });
  }, [filterPerson, filterMonth, filterVerified]);

  // Calculate stats for chart
  const personStats = useMemo(() => {
    const stats: Record<string, { total: number; unverified: number; count: number }> = {
      karim: { total: 0, unverified: 0, count: 0 },
      sara: { total: 0, unverified: 0, count: 0 },
      ahmed: { total: 0, unverified: 0, count: 0 },
    };
    
    BANK_TRANSACTIONS.forEach(t => {
      if (t.amount < 0 && t.enteredBy) {
        stats[t.enteredBy].total += Math.abs(t.amount);
        stats[t.enteredBy].count += 1;
        if (!t.verified) {
          stats[t.enteredBy].unverified += Math.abs(t.amount);
        }
      }
    });
    
    return stats;
  }, []);

  const maxExpense = Math.max(...Object.values(personStats).map(s => s.total));

  // Evidence linking logic
  const handleLink = () => {
    if (!selectedEvidence1 || !selectedEvidence2) return;
    
    const combo = [selectedEvidence1, selectedEvidence2].sort().join("-");
    
    // Define discoveries based on combinations
    const discoveries: Record<string, { pattern: string; description: string }> = {
      "invoices-logs": {
        pattern: "pattern-invoice-timing",
        description: "🔍 اكتشاف: الفواتير بدون إيصال تُدخل غالباً بعد ساعات العمل الرسمية",
      },
      "invoices-transactions": {
        pattern: "pattern-unverified-amounts",
        description: "🔍 اكتشاف: المعاملات غير الموثقة تتركز في مبالغ كبيرة (أكثر من 7000 ريال)",
      },
      "logs-transactions": {
        pattern: "pattern-after-hours",
        description: "🔍 اكتشاف: هناك نمط واضح للنشاط بعد ساعات العمل مرتبط بمعاملات محددة",
      },
      "emails-logs": {
        pattern: "pattern-ahmed-excuse",
        description: "🔍 اكتشاف: دخول أحمد المتأخر كان بطلب من المدير العام لإعداد تقرير",
      },
    };
    
    const discovery = discoveries[combo];
    if (discovery && !hasDiscoveredPattern(discovery.pattern)) {
      discoverPattern(discovery.pattern, discovery.description);
      setLinkResult(discovery.description);
    } else if (discovery) {
      setLinkResult("✓ تم اكتشاف هذا النمط مسبقاً");
    } else {
      setLinkResult("لم يتم العثور على رابط واضح بين هذين الدليلين");
    }
  };

  // Handle hypothesis selection
  const handleSelectHypothesis = (hypothesisId: string) => {
    const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
    if (hypothesis) {
      setActiveHypothesis(hypothesisId);
      addNote({
        type: "suspicion",
        text: `تم اختيار فرضية: ${hypothesis.title}`,
        source: "analysis",
      });
    }
  };

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Investigation Notes */}
      <div>
        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Notebook className="w-5 h-5 text-primary" />
          دفتر التحقيق ({state.investigationNotes.length})
        </h4>
        {state.investigationNotes.length === 0 ? (
          <div className="p-8 rounded-xl bg-card/30 border border-border text-center">
            <p className="text-muted-foreground">لم يتم تسجيل أي ملاحظات بعد.</p>
            <p className="text-sm text-muted-foreground mt-2">اجمع الأدلة واستجوب المشتبهين لتظهر الملاحظات هنا.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto">
            {state.investigationNotes.map((note, i) => (
              <motion.div
                key={note.id}
                className={cn(
                  "p-3 rounded-xl border",
                  note.type === "pattern" ? "bg-accent/10 border-accent/30" :
                  note.type === "key" ? "bg-primary/10 border-primary/30" :
                  note.type === "clue" ? "bg-secondary/50 border-border" :
                  "bg-card/30 border-border"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    {note.type === "pattern" ? "🔍" : note.type === "key" ? "🔑" : note.type === "clue" ? "💬" : "📝"}
                  </span>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {note.source === "interrogation" ? "الاستجواب" : note.source === "analysis" ? "التحليل" : "الأدلة"}
                      {note.suspectId && ` • ${SUSPECTS.find(s => s.id === note.suspectId)?.name || note.suspectId}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-primary">{state.collectedEvidence.length}</p>
          <p className="text-sm text-muted-foreground">أدلة مجمعة</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-accent">{state.totalQuestionsAsked}</p>
          <p className="text-sm text-muted-foreground">أسئلة طُرحت</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-green-400">{state.patternsDiscovered.length}</p>
          <p className="text-sm text-muted-foreground">أنماط مكتشفة</p>
        </div>
        <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
          <p className="text-3xl font-bold text-gold">{state.score}</p>
          <p className="text-sm text-muted-foreground">النقاط</p>
        </div>
      </div>
    </div>
  );

  const renderFilter = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">الشخص</label>
          <select
            value={filterPerson}
            onChange={(e) => setFilterPerson(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="all">الكل</option>
            <option value="karim">كريم</option>
            <option value="sara">سارة</option>
            <option value="ahmed">أحمد</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">الشهر</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="all">الكل</option>
            <option value="2024-01">يناير</option>
            <option value="2024-02">فبراير</option>
            <option value="2024-03">مارس</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">التوثيق</label>
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="all">الكل</option>
            <option value="verified">موثقة</option>
            <option value="unverified">غير موثقة</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
        <p className="text-foreground">
          عدد النتائج: <span className="font-bold">{filteredTransactions.length}</span> معاملة
          {filterPerson !== "all" && ` • الشخص: ${filterPerson === "karim" ? "كريم" : filterPerson === "sara" ? "سارة" : "أحمد"}`}
        </p>
        {filteredTransactions.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            إجمالي المصروفات: {Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toLocaleString()} ريال
          </p>
        )}
      </div>

      {/* Filtered Results */}
      <div className="max-h-48 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 sticky top-0">
            <tr>
              <th className="text-right p-2 text-muted-foreground">التاريخ</th>
              <th className="text-right p-2 text-muted-foreground">الوصف</th>
              <th className="text-right p-2 text-muted-foreground">المبلغ</th>
              <th className="text-right p-2 text-muted-foreground">موثق</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b border-border/50">
                <td className="p-2 font-mono text-xs text-foreground">{t.date}</td>
                <td className="p-2 text-foreground">{t.description}</td>
                <td className={cn("p-2 font-mono", t.amount >= 0 ? "text-green-400" : "text-destructive")}>
                  {t.amount.toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  {t.verified ? "✓" : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderChart = () => (
    <div className="space-y-6">
      <h4 className="font-bold text-foreground">مقارنة المصروفات حسب الشخص</h4>
      
      {/* Simple Bar Chart */}
      <div className="space-y-4">
        {Object.entries(personStats).map(([person, stats]) => {
          const percentage = maxExpense > 0 ? (stats.total / maxExpense) * 100 : 0;
          const unverifiedPercentage = stats.total > 0 ? (stats.unverified / stats.total) * 100 : 0;
          
          return (
            <div key={person} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">
                  {person === "karim" ? "كريم" : person === "sara" ? "سارة" : "أحمد"}
                </span>
                <span className="text-muted-foreground text-sm">
                  {stats.total.toLocaleString()} ريال ({stats.count} معاملات)
                </span>
              </div>
              <div className="h-8 bg-secondary/30 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full bg-primary/70 rounded-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
                {stats.unverified > 0 && (
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-amber-500/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.unverified / maxExpense) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>
              {stats.unverified > 0 && (
                <p className="text-xs text-amber-400">
                  غير موثق: {stats.unverified.toLocaleString()} ريال ({unverifiedPercentage.toFixed(0)}%)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/70" />
          <span className="text-sm text-muted-foreground">إجمالي المصروفات</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/70" />
          <span className="text-sm text-muted-foreground">غير موثق</span>
        </div>
      </div>

      {/* Insight */}
      {personStats.karim.unverified > personStats.sara.unverified + personStats.ahmed.unverified && (
        <motion.div
          className="p-4 rounded-xl bg-accent/10 border border-accent/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-accent font-bold text-sm">
            💡 ملاحظة: المصروفات غير الموثقة تتركز بشكل واضح عند شخص واحد
          </p>
        </motion.div>
      )}
    </div>
  );

  const renderLink = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">اختر دليلين لمحاولة ربطهما واكتشاف أنماط جديدة</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">الدليل الأول</label>
          <select
            value={selectedEvidence1 || ""}
            onChange={(e) => { setSelectedEvidence1(e.target.value); setLinkResult(null); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="">اختر...</option>
            <option value="invoices">الفواتير</option>
            <option value="transactions">المعاملات البنكية</option>
            <option value="logs">سجلات الدخول</option>
            <option value="emails">الإيميلات</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">الدليل الثاني</label>
          <select
            value={selectedEvidence2 || ""}
            onChange={(e) => { setSelectedEvidence2(e.target.value); setLinkResult(null); }}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground"
          >
            <option value="">اختر...</option>
            <option value="invoices">الفواتير</option>
            <option value="transactions">المعاملات البنكية</option>
            <option value="logs">سجلات الدخول</option>
            <option value="emails">الإيميلات</option>
          </select>
        </div>
      </div>

      <motion.button
        onClick={handleLink}
        disabled={!selectedEvidence1 || !selectedEvidence2 || selectedEvidence1 === selectedEvidence2}
        className={cn(
          "w-full py-3 rounded-xl font-bold transition-all",
          selectedEvidence1 && selectedEvidence2 && selectedEvidence1 !== selectedEvidence2
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-muted-foreground cursor-not-allowed"
        )}
        whileHover={selectedEvidence1 && selectedEvidence2 ? { scale: 1.02 } : {}}
      >
        🔗 تحليل الرابط
      </motion.button>

      <AnimatePresence>
        {linkResult && (
          <motion.div
            className={cn(
              "p-4 rounded-xl border",
              linkResult.includes("اكتشاف") ? "bg-accent/10 border-accent/30" : "bg-secondary/30 border-border"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-foreground">{linkResult}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovered Patterns */}
      {state.patternsDiscovered.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-foreground text-sm">الأنماط المكتشفة:</h4>
          {state.investigationNotes
            .filter(n => n.type === "pattern")
            .map((note) => (
              <div key={note.id} className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm">
                {note.text}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderHypothesis = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">بناءً على الأدلة، اختر فرضية للتحقيق فيها</p>
      
      <div className="grid grid-cols-3 gap-4">
        {HYPOTHESES.map((h) => {
          const suspect = SUSPECTS.find(s => s.id === h.suspectId);
          const isActive = state.activeHypothesis === h.id;
          
          return (
            <motion.button
              key={h.id}
              onClick={() => handleSelectHypothesis(h.id)}
              className={cn(
                "p-4 rounded-xl border text-right transition-all",
                isActive 
                  ? "bg-primary/20 border-primary" 
                  : "bg-secondary/30 border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl mb-2">
                {h.suspectId === "ahmed" ? "👔" : h.suspectId === "sara" ? "👩‍💼" : "🧑‍💼"}
              </div>
              <h4 className="font-bold text-foreground mb-1">{h.title}</h4>
              <p className="text-xs text-muted-foreground">{h.description}</p>
              {isActive && (
                <span className="inline-block mt-2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs">
                  الفرضية الحالية
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {state.activeHypothesis && (
        <motion.div
          className="p-4 rounded-xl bg-primary/10 border border-primary/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-foreground text-sm">
            💡 نصيحة: استمر في جمع الأدلة واستجواب المشتبهين لتأكيد أو نفي فرضيتك.
            يمكنك تغيير الفرضية في أي وقت.
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Notebook className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">غرفة التحليل</h1>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-full font-bold",
            trustLevel === "high" ? "bg-green-500/20 text-green-400" :
            trustLevel === "medium" ? "bg-amber-500/20 text-amber-400" :
            "bg-destructive/20 text-destructive"
          )}>
            الثقة: {state.trust}%
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground hover:bg-secondary"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          className="p-6 rounded-2xl bg-card/30 border border-border min-h-[400px]"
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "summary" && renderSummary()}
          {activeTab === "filter" && renderFilter()}
          {activeTab === "chart" && renderChart()}
          {activeTab === "link" && renderLink()}
          {activeTab === "hypothesis" && renderHypothesis()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
          <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
          <NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} />
        </div>
      </div>
    </div>
  );
};
