import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Filter, BarChart3, Link2, FileText, 
  ArrowLeft, ChevronDown, Calculator, StickyNote,
  CheckCircle2
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, DEALS_DATASET, EVIDENCE_CATALOG } from "@/data/newCase";
import { InteractiveRoom } from "../InteractiveRoom";
import analysisBackground from "@/assets/rooms/analysis-room.png";

interface MyDeskScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "evidence" | "filter" | "calculate" | "notes";

export const MyDeskScreen = ({ onNavigate }: MyDeskScreenProps) => {
  const { state, addNote, discoverPattern, hasDiscoveredPattern } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>("evidence");
  
  // Filter state
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [salespersonFilter, setSalespersonFilter] = useState<string>("all");
  const [weekFilter, setWeekFilter] = useState<string>("all");
  
  // Notes state
  const [noteInput, setNoteInput] = useState("");

  const hotspots = [
    { id: "computer", x: 50, y: 50, label: "شاشة التحليل", icon: "🖥️" },
  ];

  // Get unique values for filters
  const projects = [...new Set(DEALS_DATASET.map(d => d.project))];
  const salespeople = [...new Set(DEALS_DATASET.map(d => d.salesperson))];
  const weeks = [...new Set(DEALS_DATASET.map(d => d.week))].sort((a, b) => a - b);

  // Filtered data
  const filteredDeals = useMemo(() => {
    return DEALS_DATASET.filter(deal => {
      if (projectFilter !== "all" && deal.project !== projectFilter) return false;
      if (salespersonFilter !== "all" && deal.salesperson !== salespersonFilter) return false;
      if (weekFilter !== "all" && deal.week !== parseInt(weekFilter)) return false;
      return true;
    });
  }, [projectFilter, salespersonFilter, weekFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalListPrice = filteredDeals.reduce((sum, d) => sum + d.list_price, 0);
    const totalFinalPrice = filteredDeals.reduce((sum, d) => sum + d.final_price, 0);
    const totalDifference = totalListPrice - totalFinalPrice;
    const avgDifferencePercent = filteredDeals.length > 0 
      ? (totalDifference / totalListPrice) * 100 
      : 0;
    
    return {
      dealCount: filteredDeals.length,
      totalListPrice,
      totalFinalPrice,
      totalDifference,
      avgDifferencePercent
    };
  }, [filteredDeals]);

  // Check for pattern discovery
  const checkPatternDiscovery = () => {
    // Pattern 1: Project Afaq has higher price differences
    if (projectFilter === "أفق" && stats.avgDifferencePercent > 10) {
      if (!hasDiscoveredPattern("afaq-high-discount")) {
        discoverPattern("afaq-high-discount");
        addNote("اكتشاف: مشروع أفق يحتوي على فروقات سعرية أعلى من المعتاد");
      }
    }
    
    // Pattern 2: Mohamed Ali has highest discounts
    if (salespersonFilter === "محمد علي" && stats.avgDifferencePercent > 12) {
      if (!hasDiscoveredPattern("mohamed-high-discount")) {
        discoverPattern("mohamed-high-discount");
        addNote("اكتشاف: صفقات محمد علي تحتوي على فروقات سعرية كبيرة");
      }
    }
    
    // Pattern 3: Combined - Afaq + Mohamed
    if (projectFilter === "أفق" && salespersonFilter === "محمد علي") {
      if (!hasDiscoveredPattern("afaq-mohamed-pattern")) {
        discoverPattern("afaq-mohamed-pattern");
        addNote("اكتشاف مهم: النمط يتركز في صفقات محمد علي بمشروع أفق");
      }
    }
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      addNote(noteInput.trim());
      setNoteInput("");
    }
  };

  const tabs = [
    { id: "evidence" as TabType, label: "الأدلة المجمعة", icon: FileText },
    { id: "filter" as TabType, label: "فلترة البيانات", icon: Filter },
    { id: "calculate" as TabType, label: "حسابات", icon: Calculator },
    { id: "notes" as TabType, label: "ملاحظاتي", icon: StickyNote },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "evidence":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">الأدلة التي جمعتها</h3>
            
            {state.collectedEvidence.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لم تجمع أي أدلة بعد</p>
                <p className="text-sm">زر مكتب CFO للحصول على التقارير</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {state.collectedEvidence.map(evidenceId => {
                  const evidence = EVIDENCE_CATALOG.find(e => e.id === evidenceId);
                  if (!evidence) return null;
                  return (
                    <div 
                      key={evidenceId}
                      className="p-4 rounded-lg bg-primary/10 border border-primary/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{evidence.icon}</span>
                        <div>
                          <p className="font-bold text-foreground">{evidence.name}</p>
                          <p className="text-sm text-muted-foreground">{evidence.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dataset availability */}
            {state.hasRequestedDataset && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="font-bold text-foreground">📊 بيانات الصفقات التفصيلية</p>
                    <p className="text-sm text-muted-foreground">متاحة للتحليل - استخدم تبويب "فلترة البيانات"</p>
                  </div>
                </div>
              </div>
            )}

            {!state.hasRequestedDataset && state.collectedEvidence.length > 0 && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-200">
                  💡 لتحليل أعمق، اطلب بيانات الصفقات التفصيلية من مكتب CFO
                </p>
              </div>
            )}
          </div>
        );

      case "filter":
        if (!state.hasRequestedDataset) {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">لا توجد بيانات للفلترة</p>
              <p className="text-sm">اطلب بيانات الصفقات من مكتب CFO أولاً</p>
              <motion.button
                onClick={() => onNavigate("cfo-office")}
                className="mt-4 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                الذهاب لمكتب CFO
              </motion.button>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">المشروع</label>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
                >
                  <option value="all">الكل</option>
                  {projects.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">المندوب</label>
                <select
                  value={salespersonFilter}
                  onChange={(e) => setSalespersonFilter(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
                >
                  <option value="all">الكل</option>
                  {salespeople.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">الأسبوع</label>
                <select
                  value={weekFilter}
                  onChange={(e) => setWeekFilter(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border text-foreground"
                >
                  <option value="all">الكل</option>
                  {weeks.map(w => (
                    <option key={w} value={w}>أسبوع {w}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apply and check patterns */}
            <motion.button
              onClick={checkPatternDiscovery}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              تطبيق الفلترة
            </motion.button>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 text-right text-muted-foreground">الكود</th>
                    <th className="py-3 text-right text-muted-foreground">الأسبوع</th>
                    <th className="py-3 text-right text-muted-foreground">المشروع</th>
                    <th className="py-3 text-right text-muted-foreground">المندوب</th>
                    <th className="py-3 text-right text-muted-foreground">السعر القياسي</th>
                    <th className="py-3 text-right text-muted-foreground">السعر النهائي</th>
                    <th className="py-3 text-right text-muted-foreground">الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeals.map((deal) => {
                    const diff = deal.list_price - deal.final_price;
                    const diffPercent = (diff / deal.list_price) * 100;
                    return (
                      <tr key={deal.deal_id} className="border-b border-border/50">
                        <td className="py-2 text-foreground">{deal.deal_id}</td>
                        <td className="py-2 text-foreground">{deal.week}</td>
                        <td className="py-2 text-foreground">{deal.project}</td>
                        <td className="py-2 text-foreground">{deal.salesperson}</td>
                        <td className="py-2 text-foreground">{(deal.list_price / 1000000).toFixed(2)}M</td>
                        <td className="py-2 text-foreground">{(deal.final_price / 1000000).toFixed(2)}M</td>
                        <td className={`py-2 font-bold ${diffPercent > 10 ? "text-destructive" : "text-muted-foreground"}`}>
                          {(diff / 1000).toFixed(0)}K ({diffPercent.toFixed(1)}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.dealCount}</p>
                <p className="text-xs text-muted-foreground">عدد الصفقات</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{(stats.totalListPrice / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">إجمالي السعر القياسي</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{(stats.totalFinalPrice / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">إجمالي السعر النهائي</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${stats.avgDifferencePercent > 8 ? "text-destructive" : "text-foreground"}`}>
                  {stats.avgDifferencePercent.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">متوسط الفرق</p>
              </div>
            </div>
          </div>
        );

      case "calculate":
        if (!state.hasRequestedDataset) {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>احصل على بيانات الصفقات أولاً لإجراء الحسابات</p>
            </div>
          );
        }

        // Group by project
        const byProject = projects.map(project => {
          const deals = DEALS_DATASET.filter(d => d.project === project);
          const totalDiff = deals.reduce((sum, d) => sum + (d.list_price - d.final_price), 0);
          const avgDiff = totalDiff / deals.length;
          return { project, deals: deals.length, totalDiff, avgDiff };
        });

        // Group by salesperson
        const bySalesperson = salespeople.map(sp => {
          const deals = DEALS_DATASET.filter(d => d.salesperson === sp);
          const totalDiff = deals.reduce((sum, d) => sum + (d.list_price - d.final_price), 0);
          const avgDiff = totalDiff / deals.length;
          const avgPercent = deals.reduce((sum, d) => sum + ((d.list_price - d.final_price) / d.list_price * 100), 0) / deals.length;
          return { salesperson: sp, deals: deals.length, totalDiff, avgDiff, avgPercent };
        });

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">تحليل الفروقات السعرية</h3>
            
            {/* By Project */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="font-bold text-foreground mb-4">حسب المشروع</h4>
              <div className="space-y-3">
                {byProject.map(item => (
                  <div key={item.project} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="font-bold text-foreground">{item.project}</span>
                    <div className="text-left">
                      <p className="text-foreground">{item.deals} صفقة</p>
                      <p className={`text-sm ${item.avgDiff > 300000 ? "text-destructive" : "text-muted-foreground"}`}>
                        متوسط الفرق: {(item.avgDiff / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* By Salesperson */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <h4 className="font-bold text-foreground mb-4">حسب المندوب</h4>
              <div className="space-y-3">
                {bySalesperson.sort((a, b) => b.avgPercent - a.avgPercent).map(item => (
                  <div key={item.salesperson} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="font-bold text-foreground">{item.salesperson}</span>
                    <div className="text-left">
                      <p className="text-foreground">{item.deals} صفقة</p>
                      <p className={`text-sm font-bold ${item.avgPercent > 12 ? "text-destructive" : "text-muted-foreground"}`}>
                        متوسط الفرق: {item.avgPercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">ملاحظاتي</h3>
            
            {/* Add note input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="أضف ملاحظة..."
                className="flex-1 p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <motion.button
                onClick={handleAddNote}
                className="px-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إضافة
              </motion.button>
            </div>

            {/* Patterns discovered */}
            {state.patternsDiscovered.length > 0 && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <h4 className="font-bold text-green-400 mb-2">🔍 أنماط مكتشفة</h4>
                <ul className="space-y-1">
                  {state.patternsDiscovered.map((pattern, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes list */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {state.notes.slice().reverse().map((note, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-sm text-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.timestamp).toLocaleTimeString("ar-EG")}
                  </p>
                </div>
              ))}
              {state.notes.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لا توجد ملاحظات بعد</p>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      <InteractiveRoom
        backgroundImage={analysisBackground}
        hotspots={hotspots}
        onHotspotClick={() => {}}
        roomName="مكتبي"
      >
        {/* Navigation */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <motion.button
            onClick={() => onNavigate("intro")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            الرئيسية
          </motion.button>
        </div>

        {/* Case Info */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-2 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30">
            <p className="text-sm text-primary font-bold">{CASE_INFO.title}</p>
            <p className="text-xs text-muted-foreground">{CASE_INFO.company}</p>
          </div>
        </div>

        {/* Room Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <motion.button
            onClick={() => onNavigate("cfo-office")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>👔</span>
            مكتب CFO
          </motion.button>
          <motion.button
            onClick={() => onNavigate("sales")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📊</span>
            قسم المبيعات
          </motion.button>
          <motion.button
            onClick={() => onNavigate("contracts")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📁</span>
            أرشيف العقود
          </motion.button>
          {state.patternsDiscovered.length >= 2 && (
            <motion.button
              onClick={() => onNavigate("conclusion")}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span>📋</span>
              تقديم الاستنتاج
            </motion.button>
          )}
        </div>
      </InteractiveRoom>

      {/* Analysis Panel - Always visible overlay */}
      <div className="fixed inset-x-4 top-20 bottom-24 z-30 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-full max-w-5xl h-full bg-card/95 backdrop-blur-xl rounded-2xl border border-border p-6 overflow-hidden pointer-events-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border pb-4">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Content */}
          <div className="h-[calc(100%-80px)] overflow-y-auto">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
