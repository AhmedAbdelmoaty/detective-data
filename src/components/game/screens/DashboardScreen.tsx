import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, BarChart3 } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { DASHBOARD_DATA } from "@/data/case1";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import analysisRoomBg from "@/assets/rooms/analysis-room.png";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const { state, addToNotebook, isInNotebook, viewDashboardItem } = useGame();
  const { playSound } = useSound();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleSelectItem = (itemId: string) => {
    setSelectedItem(itemId);
    viewDashboardItem(itemId);
    playSound("click");
  };

  const handleSave = (item: typeof DASHBOARD_DATA[0]) => {
    if (!isInNotebook(item.saveId)) {
      addToNotebook({ text: item.saveText, source: "dashboard", sourceId: item.saveId });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const renderDashboardItem = (item: typeof DASHBOARD_DATA[0]) => {
    const saved = isInNotebook(item.saveId);

    return (
      <motion.div key={item.id} className="p-6 rounded-xl bg-card/50 border border-border"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {item.name}
          </h3>
          <button
            onClick={() => handleSave(item)}
            disabled={saved}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
              saved ? "bg-neon-green/20 text-neon-green" : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            {saved ? "محفوظ" : "احفظ"}
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

        {item.type === "bar" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={item.data.labels.map((label: string, i: number) => ({
                day: label,
                thisWeek: item.data.thisWeek[i],
                lastWeek: item.data.lastWeek[i],
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="thisWeek" name="هذا الأسبوع" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lastWeek" name="الأسبوع الماضي" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {item.type === "table" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{item.data.totalInvoices}</p>
              <p className="text-sm text-muted-foreground">فاتورة مسجلة</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{item.data.totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">ر.س إجمالي</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{item.data.avgPerInvoice}</p>
              <p className="text-sm text-muted-foreground">ر.س متوسط الفاتورة</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{item.data.cashPercentage}%</p>
              <p className="text-sm text-muted-foreground">نسبة الكاش</p>
            </div>
          </div>
        )}

        {item.type === "grouped-bar" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={item.data.periods}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="invoices" name="فواتير مسجلة" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="footTraffic" name="حركة الزباين" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            📊 غرفة البيانات
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">بيانات: {state.viewedDashboard.length}/3</span>
            <span className="text-primary font-bold text-sm">📓 {state.notebook.length}</span>
          </div>
        </div>
      </div>

      {/* Dashboard items */}
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {DASHBOARD_DATA.map(item => renderDashboardItem(item))}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
        <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
        <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </div>
  );
};
