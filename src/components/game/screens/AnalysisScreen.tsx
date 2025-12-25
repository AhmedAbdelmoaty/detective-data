import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, BarChart2, Calculator, GitCompare, StickyNote, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Microscope } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { cn } from "@/lib/utils";
import analysisRoomBg from "@/assets/rooms/analysis-room.png";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

const mockData = [
  { month: "يناير", expenses: 45000, revenue: 62000, variance: 17000 },
  { month: "فبراير", expenses: 52000, revenue: 58000, variance: 6000 },
  { month: "مارس", expenses: 78000, revenue: 61000, variance: -17000, anomaly: true },
  { month: "أبريل", expenses: 41000, revenue: 65000, variance: 24000 },
];

const tools = [
  { id: "filter", name: "فلترة", nameEn: "Filter", icon: Filter, description: "تصفية البيانات" },
  { id: "chart", name: "رسم بياني", nameEn: "Chart", icon: BarChart2, description: "عرض مرئي" },
  { id: "sum", name: "حاسبة", nameEn: "Calculate", icon: Calculator, description: "حساب المجاميع" },
  { id: "compare", name: "مقارنة", nameEn: "Compare", icon: GitCompare, description: "مقارنة الفترات" },
  { id: "note", name: "ملاحظات", nameEn: "Note", icon: StickyNote, description: "تدوين ملاحظة" },
];

const hotspots = [
  { id: "whiteboard", x: 5, y: 15, width: 30, height: 45, label: "📊 لوحة التحليل", icon: "📊" },
  { id: "computer", x: 40, y: 35, width: 25, height: 35, label: "💻 الحاسوب", icon: "💻" },
  { id: "board", x: 70, y: 20, width: 25, height: 40, label: "📋 لوحة الخيوط", icon: "🔗" },
  { id: "tools", x: 15, y: 70, width: 20, height: 20, label: "🔧 الأدوات", icon: "🔧" },
];

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const addInsight = (insight: string) => {
    if (!insights.includes(insight)) {
      setInsights([...insights, insight]);
    }
  };

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(hotspotId);
    setShowOverlay(true);
    
    // Map hotspot to tool
    const toolMap: Record<string, string> = {
      "whiteboard": "chart",
      "computer": "compare",
      "board": "note",
      "tools": "filter",
    };
    
    if (toolMap[hotspotId]) {
      setSelectedTool(toolMap[hotspotId]);
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setActiveHotspot(null);
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case "chart":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <BarChart2 className="w-6 h-6 text-primary" />
              التحليل البياني
            </h3>
            
            {/* Chart */}
            <div className="h-56 flex items-end gap-3 p-4 bg-background/50 rounded-xl border border-border">
              {mockData.map((row, i) => (
                <motion.div
                  key={row.month}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-full flex gap-1 h-40 items-end">
                    <motion.div
                      className={cn(
                        "flex-1 rounded-t",
                        row.anomaly ? "bg-destructive" : "bg-destructive/60"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${(row.expenses / 80000) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                    />
                    <motion.div
                      className="flex-1 bg-green-500/60 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${(row.revenue / 80000) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-mono",
                    row.anomaly ? "text-destructive font-bold" : "text-muted-foreground"
                  )}>
                    {row.month}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded bg-destructive/60" />
                المصروفات
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded bg-green-500/60" />
                الإيرادات
              </span>
            </div>
            
            {/* Anomaly Alert */}
            <motion.div
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 cursor-pointer hover:bg-destructive/20 transition-colors"
              onClick={() => addInsight("مارس يظهر ارتفاع غير طبيعي في المصروفات بنسبة 50%")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </motion.div>
                <div>
                  <p className="font-bold text-destructive">تم اكتشاف شذوذ!</p>
                  <p className="text-sm text-muted-foreground">مصروفات مارس أعلى بـ 50% من المتوسط</p>
                </div>
              </div>
              <p className="text-xs text-primary mt-3 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                اضغط لإضافة للاستنتاجات
              </p>
            </motion.div>
          </div>
        );
        
      case "compare":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <GitCompare className="w-6 h-6 text-primary" />
              مقارنة الفترات
            </h3>
            
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-right p-3 text-muted-foreground">الشهر</th>
                    <th className="text-right p-3 text-muted-foreground">المصروفات</th>
                    <th className="text-right p-3 text-muted-foreground">الإيرادات</th>
                    <th className="text-right p-3 text-muted-foreground">الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row, i) => (
                    <motion.tr
                      key={row.month}
                      className={cn("border-t border-border", row.anomaly && "bg-destructive/10")}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <td className="p-3 font-bold text-foreground">{row.month}</td>
                      <td className="p-3 text-destructive font-mono">${row.expenses.toLocaleString()}</td>
                      <td className="p-3 text-green-400 font-mono">${row.revenue.toLocaleString()}</td>
                      <td className={cn("p-3 font-mono flex items-center justify-end gap-2", row.variance >= 0 ? "text-green-400" : "text-destructive")}>
                        {row.variance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        ${Math.abs(row.variance).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <motion.div
              className="p-4 rounded-xl bg-accent/10 border border-accent/30 cursor-pointer hover:bg-accent/20"
              onClick={() => addInsight("شهر مارس الوحيد الذي تجاوزت فيه المصروفات الإيرادات")}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-accent flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                مارس هو الشهر الوحيد بخسارة - اضغط للإضافة
              </p>
            </motion.div>
          </div>
        );
        
      case "filter":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Filter className="w-6 h-6 text-primary" />
              فلترة البيانات
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {["معاملات كبيرة", "مصروفات فقط", "إيرادات فقط", "معاملات مريبة"].map((filter, i) => (
                <motion.button
                  key={filter}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 transition-colors text-foreground"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => addInsight(`تم تطبيق فلتر: ${filter}`)}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <Microscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">اختر أداة للبدء في التحليل</p>
          </div>
        );
    }
  };

  return (
    <InteractiveRoom
      backgroundImage={analysisRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activeHotspot}
      overlayContent={showOverlay ? (
        <motion.div
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full"
          style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.2)" }}
        >
          {/* Tools Bar */}
          <div className="flex gap-2 mb-6 pb-4 border-b border-border overflow-x-auto">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap",
                    selectedTool === tool.id
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/50"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tool.name}</span>
                </motion.button>
              );
            })}
          </div>
          
          {/* Tool Content */}
          {renderToolContent()}
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
          <Microscope className="w-5 h-5 text-primary" />
          <span className="text-foreground font-bold">غرفة التحليل</span>
          <div className="w-px h-6 bg-border" />
          <span className="text-accent font-mono">
            الاستنتاجات: {insights.length}
          </span>
        </div>
      </motion.div>

      {/* Insights Panel */}
      <AnimatePresence>
        {insights.length > 0 && (
          <motion.div
            className="absolute top-24 right-6 z-20 w-72"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-4 rounded-xl bg-background/90 backdrop-blur-xl border border-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent">الاستنتاجات</span>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-auto">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    className="p-3 rounded-lg bg-accent/10 border border-accent/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="text-sm text-foreground">{insight}</p>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                onClick={() => onNavigate("interrogation")}
                className="w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                مواجهة المشتبهين ←
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton
          iconEmoji="🏢"
          label="مكتب المحقق"
          onClick={() => onNavigate("office")}
        />
      </div>
      
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton
          iconEmoji="📁"
          label="غرفة الأدلة"
          onClick={() => onNavigate("evidence")}
        />
      </div>
    </InteractiveRoom>
  );
};
