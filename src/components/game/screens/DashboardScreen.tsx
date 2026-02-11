import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, BarChart3, X } from "lucide-react";
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

// Hotspots placed on the room image
const hotspots = [
  { id: "item-0", x: 30, y: 3, width: 45, height: 38, label: "عداد الباب - حركة الزباين", icon: "📊" },
  { id: "item-1", x: 3, y: 8, width: 22, height: 42, label: "ملخص الفواتير", icon: "🧾" },
  { id: "item-2", x: 80, y: 38, width: 18, height: 28, label: "فواتير vs حركة الزباين", icon: "📈" },
];

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const { state, addToNotebook, isInNotebook, viewDashboardItem } = useGame();
  const { playSound } = useSound();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleHotspotClick = (hotspotId: string) => {
    const index = parseInt(hotspotId.replace("item-", ""));
    setActiveItem(hotspotId);
    viewDashboardItem(DASHBOARD_DATA[index]?.id || "");
    playSound("click");
  };

  const handleSave = (item: typeof DASHBOARD_DATA[0]) => {
    if (!isInNotebook(item.saveId)) {
      addToNotebook({ text: item.saveText, source: "dashboard", sourceId: item.saveId });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const activeIndex = activeItem ? parseInt(activeItem.replace("item-", "")) : -1;
  const currentItem = activeIndex >= 0 ? DASHBOARD_DATA[activeIndex] : null;

  const renderOverlay = () => {
    if (!currentItem) return undefined;
    const saved = isInNotebook(currentItem.saveId);

    return (
      <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {currentItem.name}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(currentItem)}
              disabled={saved}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
                saved ? "bg-neon-green/20 text-neon-green" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              {saved ? "محفوظ" : "احفظ"}
            </button>
            <button onClick={() => setActiveItem(null)} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{currentItem.description}</p>

        {currentItem.type === "bar" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.labels.map((label: string, i: number) => ({
                day: label,
                thisWeek: currentItem.data.thisWeek[i],
                lastWeek: currentItem.data.lastWeek[i],
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

        {currentItem.type === "table" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{currentItem.data.totalInvoices}</p>
              <p className="text-sm text-muted-foreground">فاتورة مسجلة</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{currentItem.data.totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">ر.س إجمالي</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{currentItem.data.avgPerInvoice}</p>
              <p className="text-sm text-muted-foreground">ر.س متوسط الفاتورة</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{currentItem.data.cashPercentage}%</p>
              <p className="text-sm text-muted-foreground">نسبة الكاش</p>
            </div>
          </div>
        )}

        {currentItem.type === "grouped-bar" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.periods}>
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
      </div>
    );
  };

  return (
    <InteractiveRoom
      backgroundImage={analysisRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activeItem}
      overlayContent={activeItem ? renderOverlay() : undefined}
      onCloseOverlay={() => setActiveItem(null)}
    >
      {/* Score */}
      <motion.div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-muted-foreground text-sm">بيانات: {state.viewedDashboard.length}/3</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-primary font-bold">📓 {state.notebook.length}</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
        <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
        <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis")} />
      </div>
    </InteractiveRoom>
  );
};
