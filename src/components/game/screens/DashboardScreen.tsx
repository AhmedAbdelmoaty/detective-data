import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Check, BarChart3, X } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { GameOverlay } from "../GameOverlay";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { DASHBOARD_DATA, EVIDENCE_ITEMS } from "@/data/case1";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import analysisRoomBg from "@/assets/rooms/analysis-room.png";

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const { state, addToNotebook, isInNotebook, viewDashboardItem, viewEvidence, isEvidenceViewed } = useGame();
  const { playSound } = useSound();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Combine dashboard items + K2 (which shows in data room)
  const k2Evidence = EVIDENCE_ITEMS.find(e => e.id === "K2");
  const allItems = [...DASHBOARD_DATA.map(d => ({ ...d, isK2: false }))];
  if (k2Evidence && state.unlockedDashboard.includes("K2")) {
    allItems.push({ id: "K2", name: k2Evidence.name, description: k2Evidence.description, saveId: k2Evidence.saveId, saveText: k2Evidence.saveText, type: "table" as any, data: k2Evidence.data, isK2: true } as any);
  }

  const unlockedItems = allItems.filter(item => state.unlockedDashboard.includes(item.id));

  const hotspots = unlockedItems.map((item, i) => {
    const positions = [
      { x: 15, y: 15 }, { x: 47, y: 15 }, { x: 80, y: 15 }, { x: 47, y: 50 },
    ];
    const pos = positions[i] || { x: 50, y: 50 };
    return { id: item.id, x: pos.x, y: pos.y, width: 16, height: 14, label: `📊 ${item.name}`, icon: "📊" };
  });

  const handleHotspotClick = (hotspotId: string) => {
    setActiveItem(hotspotId);
    if (hotspotId === "K2") {
      if (!isEvidenceViewed("K2")) viewEvidence("K2");
    } else {
      viewDashboardItem(hotspotId);
    }
    playSound("click");
  };

  const handleSave = (saveId: string, saveText: string) => {
    if (!isInNotebook(saveId)) {
      const source = saveId.startsWith("K") ? "evidence" : "dashboard";
      addToNotebook({ text: saveText, source: source as any, sourceId: saveId });
      toast.success("تم الحفظ في الدفتر!");
      playSound("collect");
    }
  };

  const currentItem = unlockedItems.find(item => item.id === activeItem);

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
            <button onClick={() => handleSave(currentItem.saveId, currentItem.saveText)} disabled={saved}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${saved ? "bg-neon-green/20 text-neon-green" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              {saved ? "محفوظ" : "احفظ"}
            </button>
            <button onClick={() => setActiveItem(null)} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{currentItem.description}</p>

        {currentItem.id === "D1" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.labels.map((label: string, i: number) => ({ name: label, value: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="value" name="صافي المبيعات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "D2" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentItem.data.labels.map((label: string, i: number) => ({ day: label, count: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[75, 95]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Line type="monotone" dataKey="count" name="عدد الفواتير" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "D3" && (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentItem.data.labels.map((label: string, i: number) => ({ time: label, count: currentItem.data.values[i] }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                <Bar dataKey="count" name="فواتير" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentItem.id === "K2" && (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm"><thead className="bg-secondary/50"><tr>
              <th className="text-right p-3 text-foreground">الصنف</th>
              <th className="text-right p-3 text-foreground">7–13 فبراير</th>
              <th className="text-right p-3 text-foreground">14–20 فبراير</th>
            </tr></thead><tbody>
              {currentItem.data.rows.map((row: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.item}</td>
                  <td className="p-3 text-foreground">{row.prev}</td>
                  <td className="p-3 text-foreground">{row.current}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <InteractiveRoom backgroundImage={analysisRoomBg} hotspots={hotspots} onHotspotClick={handleHotspotClick} activeHotspot={activeItem} overlayContent={activeItem ? renderOverlay() : undefined} onCloseOverlay={() => setActiveItem(null)}>
        <motion.div className="absolute top-12 right-4 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-muted-foreground text-sm">بيانات: {unlockedItems.length}</span>
          </div>
        </motion.div>
      </InteractiveRoom>
      <GameOverlay currentScreen="dashboard" onNavigate={onNavigate} />
    </>
  );
};
