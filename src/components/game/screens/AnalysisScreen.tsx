import { useState } from "react";
import { ArrowLeft, Filter, BarChart2, Calculator, GitCompare, StickyNote, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { GameCard } from "../GameCard";
import { cn } from "@/lib/utils";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

const mockData = [
  { month: "Jan", expenses: 45000, revenue: 62000, variance: 17000 },
  { month: "Feb", expenses: 52000, revenue: 58000, variance: 6000 },
  { month: "Mar", expenses: 78000, revenue: 61000, variance: -17000 },
  { month: "Apr", expenses: 41000, revenue: 65000, variance: 24000 },
];

const tools = [
  { id: "filter", name: "Filter", icon: Filter },
  { id: "chart", name: "Chart", icon: BarChart2 },
  { id: "sum", name: "Calculate", icon: Calculator },
  { id: "compare", name: "Compare", icon: GitCompare },
  { id: "note", name: "Note", icon: StickyNote },
];

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const [selectedTool, setSelectedTool] = useState<string | null>("chart");
  const [insights, setInsights] = useState<string[]>([]);

  const addInsight = (insight: string) => {
    if (!insights.includes(insight)) {
      setInsights([...insights, insight]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(175_80%_50%_/_0.03)_0%,_transparent_50%)]" />

      <header className="relative z-10 flex items-center gap-4 mb-6 animate-slide-up">
        <button onClick={() => onNavigate("office")} className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">📊</span>Analysis Lab
          </h1>
          <p className="text-sm text-muted-foreground">غرفة التحليل</p>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-6">
        <div className="col-span-2 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Tools</p>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => setSelectedTool(tool.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-lg border transition-all", selectedTool === tool.id ? "bg-primary/10 border-primary/50" : "bg-secondary/30 border-border hover:border-primary/30")}>
                <Icon className={cn("w-5 h-5", selectedTool === tool.id ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm", selectedTool === tool.id ? "text-primary" : "text-muted-foreground")}>{tool.name}</span>
              </button>
            );
          })}
        </div>

        <div className="col-span-7 space-y-6">
          <GameCard title="Financial Overview - Q1" variant="glass">
            <div className="mt-4 rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-3 text-muted-foreground font-mono">Month</th>
                    <th className="text-right p-3 text-muted-foreground font-mono">Expenses</th>
                    <th className="text-right p-3 text-muted-foreground font-mono">Revenue</th>
                    <th className="text-right p-3 text-muted-foreground font-mono">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row) => (
                    <tr key={row.month} className={cn("border-t border-border", row.variance < 0 && "bg-destructive/10")}>
                      <td className="p-3 font-mono text-foreground">{row.month}</td>
                      <td className="p-3 text-right font-mono text-destructive">${row.expenses.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-success">${row.revenue.toLocaleString()}</td>
                      <td className={cn("p-3 text-right font-mono flex items-center justify-end gap-2", row.variance >= 0 ? "text-success" : "text-destructive")}>
                        {row.variance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        ${Math.abs(row.variance).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GameCard>

          {selectedTool === "chart" && (
            <GameCard title="Visual Analysis" variant="glass">
              <div className="mt-4 h-48 flex items-end gap-4 p-4 bg-background/50 rounded-lg border border-border">
                {mockData.map((row) => (
                  <div key={row.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex gap-1 h-32 items-end">
                      <div className="flex-1 bg-destructive/60 rounded-t" style={{ height: `${(row.expenses / 80000) * 100}%` }} />
                      <div className="flex-1 bg-success/60 rounded-t" style={{ height: `${(row.revenue / 80000) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{row.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <span className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded bg-destructive/60" />Expenses</span>
                <span className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded bg-success/60" />Revenue</span>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 cursor-pointer hover:bg-destructive/20 transition-colors" onClick={() => addInsight("March shows unusual expense spike")}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Anomaly Detected!</p>
                    <p className="text-xs text-muted-foreground">March expenses are 50% higher than average</p>
                  </div>
                </div>
                <p className="text-xs text-primary mt-2">Click to add to insights →</p>
              </div>
            </GameCard>
          )}
        </div>

        <div className="col-span-3">
          <GameCard title="Insights Found" iconEmoji="💡" variant="outlined" color="accent" className="sticky top-6">
            <div className="mt-4 space-y-3">
              {insights.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Use tools to discover patterns.</p>
              ) : (
                insights.map((insight, i) => (
                  <div key={i} className="p-3 rounded-lg bg-accent/10 border border-accent/30 animate-scale-in">
                    <p className="text-sm text-foreground">{insight}</p>
                  </div>
                ))
              )}
              {insights.length > 0 && (
                <button onClick={() => onNavigate("interrogation")} className="w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-[0_0_20px_hsl(175_80%_50%_/_0.3)] transition-all">
                  Confront Suspects →
                </button>
              )}
            </div>
          </GameCard>
        </div>
      </div>
    </div>
  );
};
