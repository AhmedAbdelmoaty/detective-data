import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, AlertCircle, Lightbulb, TableIcon, LineChartIcon } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { DATA_SETS, INSIGHTS, EVIDENCE_ITEMS, SOLUTION_OPTIONS, REQUIRED_EVIDENCE_IDS } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "charts" | "tables" | "insights" | "solution";

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { 
    state, 
    discoverInsight, 
    hasInsight,
    submitSolution,
    canSubmitSolution,
    getRemainingAttempts,
    isEvidencePinned,
  } = useGame();
  
  const [activeTab, setActiveTab] = useState<TabType>("charts");
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [solutionResult, setSolutionResult] = useState<{ correct: boolean; feedback: string } | null>(null);

  const tabs = [
    { id: "charts" as const, label: "📈 الرسوم البيانية", icon: LineChartIcon },
    { id: "tables" as const, label: "📊 الجداول", icon: TableIcon },
    { id: "insights" as const, label: "💡 الاكتشافات", icon: Lightbulb },
    { id: "solution" as const, label: "🎯 التقرير النهائي", icon: BarChart3 },
  ];

  // Get datasets
  const salesData = DATA_SETS.find(d => d.name.includes("المبيعات"))?.rows || [];
  const marketingData = DATA_SETS.find(d => d.name.includes("التسويق"))?.rows || [];

  // Handle chart analysis
  const handleAnalyzeChart = () => {
    if (!hasInsight("insight-leads-vs-sales")) {
      discoverInsight("insight-leads-vs-sales");
      toast.success("اكتشاف جديد! انفصال العملاء عن المبيعات");
    }
  };

  const handleAnalyzeMarketing = () => {
    if (!hasInsight("insight-tiktok-dominant")) {
      discoverInsight("insight-tiktok-dominant");
      toast.success("اكتشاف! تيك توك يستهلك معظم الميزانية");
    }
  };

  const handleSubmitSolution = () => {
    if (!selectedSolution) return;
    
    const result = submitSolution(selectedSolution);
    setSolutionResult({ correct: result.correct, feedback: result.feedback });
    
    if (result.correct) {
      toast.success("تحليل صحيح!");
      setTimeout(() => onNavigate("result"), 2000);
    } else if (result.attemptsLeft <= 0) {
      toast.error("انتهت المحاولات!");
      setTimeout(() => onNavigate("result"), 2000);
    } else {
      toast.error(`خطأ! تبقى ${result.attemptsLeft} محاولات`);
    }
  };

  const pinnedCount = state.pinnedEvidenceIds.length;
  const hasRequiredEvidence = REQUIRED_EVIDENCE_IDS.every(id => state.pinnedEvidenceIds.includes(id));

  const renderCharts = () => (
    <div className="space-y-8">
      {/* Sales vs Leads Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-card/50 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-accent" />
            تحليل العملاء المحتملين مقابل المبيعات
          </h3>
          <button
            onClick={handleAnalyzeChart}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
          >
            تحليل النمط
          </button>
        </div>
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(str) => str.slice(5)} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="leads" name="العملاء (Leads)" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="sales" name="المبيعات (Sales)" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            ملاحظة: لاحظ الانفصال الحاد بين منحنى العملاء ومنحنى المبيعات بدءاً من 1 أكتوبر.
          </p>
        </div>
      </motion.div>

      {/* Marketing Spend Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-card/50 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
            <BarChart3 className="w-5 h-5 text-primary" />
            توزيع الميزانية والنقرات
          </h3>
          <button
            onClick={handleAnalyzeMarketing}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
          >
            تحليل التوزيع
          </button>
        </div>
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                cursor={{fill: 'hsl(var(--muted) / 0.2)'}}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              />
              <Legend />
              <Bar dataKey="cost" name="التكلفة ($)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" name="النقرات" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      {DATA_SETS.map((ds) => (
        <motion.div 
          key={ds.name}
          className="p-6 rounded-xl bg-card/50 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-bold text-lg mb-2 text-foreground">{ds.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{ds.description}</p>
          
          <div className="overflow-auto max-h-64 rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 sticky top-0">
                <tr>
                  {Object.keys(ds.rows[0]).filter(k => k !== 'id').map(key => (
                    <th key={key} className="text-right p-3 text-foreground font-bold">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ds.rows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    {Object.entries(row).filter(([k]) => k !== 'id').map(([key, value]) => (
                      <td key={key} className={cn(
                        "p-3",
                        key === 'sales' && Number(value) <= 2 ? "text-destructive font-bold" : "text-foreground"
                      )}>
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
          <p className="text-3xl font-bold text-primary">{state.visitedEvidenceIds.length}</p>
          <p className="text-sm text-muted-foreground">أدلة مفتوحة</p>
        </div>
        <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
          <p className="text-3xl font-bold text-accent">{state.pinnedEvidenceIds.length}/5</p>
          <p className="text-sm text-muted-foreground">أدلة مثبتة</p>
        </div>
        <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
          <p className="text-3xl font-bold text-green-400">{state.discoveredInsights.length}</p>
          <p className="text-sm text-muted-foreground">اكتشافات</p>
        </div>
        <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
          <p className="text-3xl font-bold text-amber-400">{state.score}</p>
          <p className="text-sm text-muted-foreground">النقاط</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-foreground mb-3">الاكتشافات ({state.discoveredInsights.length}/{INSIGHTS.length})</h4>
        {state.discoveredInsights.length === 0 ? (
          <p className="text-muted-foreground p-4 bg-card/30 rounded-xl text-center">
            لم تكتشف أي أنماط بعد. حلل الرسوم البيانية واستجوب الموظفين!
          </p>
        ) : (
          <div className="space-y-2">
            {state.investigationNotes
              .filter(n => n.type === "insight")
              .map((note, i) => (
                <motion.div
                  key={note.id}
                  className="p-3 rounded-lg bg-accent/10 border border-accent/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-foreground">{note.text}</p>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSolution = () => (
    <div className="space-y-6">
      {/* Pinned Evidence */}
      <div className="p-4 rounded-xl bg-card/50 border border-border">
        <h4 className="font-bold text-foreground mb-3">الأدلة المثبتة ({pinnedCount}/5)</h4>
        {pinnedCount === 0 ? (
          <p className="text-muted-foreground text-sm">
            لم تثبت أي أدلة بعد. اذهب لغرفة الأدلة وثبت الأدلة المهمة!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {state.pinnedEvidenceIds.map(id => {
              const ev = EVIDENCE_ITEMS.find(e => e.id === id);
              return (
                <span key={id} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
                  {ev?.icon} {ev?.name}
                </span>
              );
            })}
          </div>
        )}
        
        {!hasRequiredEvidence && pinnedCount > 0 && (
          <p className="text-amber-400 text-sm mt-3">
            ⚠️ تأكد من تثبيت الأدلة الصحيحة لدعم استنتاجك
          </p>
        )}
      </div>

      {/* Solution Options */}
      <div>
        <h4 className="font-bold text-foreground mb-3">ما هو السبب الحقيقي لانخفاض المبيعات؟</h4>
        <div className="space-y-3">
          {SOLUTION_OPTIONS.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => setSelectedSolution(option.id)}
              className={cn(
                "w-full p-4 rounded-xl border text-right transition-all",
                selectedSolution === option.id
                  ? "bg-primary/20 border-primary"
                  : "bg-card/50 border-border hover:border-primary/50"
              )}
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-foreground">{option.text}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-4">
        <motion.button
          onClick={handleSubmitSolution}
          disabled={!selectedSolution || !canSubmitSolution()}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-lg transition-all",
            selectedSolution && canSubmitSolution()
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          whileHover={selectedSolution && canSubmitSolution() ? { scale: 1.02 } : {}}
        >
          📤 تقديم التقرير النهائي
        </motion.button>
        
        <p className="text-center text-muted-foreground text-sm">
          المحاولات المتبقية: {getRemainingAttempts()}/3
        </p>
      </div>

      {/* Result */}
      {solutionResult && (
        <motion.div
          className={cn(
            "p-4 rounded-xl border",
            solutionResult.correct 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-destructive/10 border-destructive/30"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={solutionResult.correct ? "text-green-400" : "text-destructive"}>
            {solutionResult.feedback}
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <NavigationButton
          iconEmoji="🏢"
          label="رجوع"
          onClick={() => onNavigate("office")}
        />
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">الوقت: {state.time}</span>
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
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === "charts" && renderCharts()}
        {activeTab === "tables" && renderTables()}
        {activeTab === "insights" && renderInsights()}
        {activeTab === "solution" && renderSolution()}
      </div>
    </div>
  );
};
