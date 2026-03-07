import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, Grid3X3, CheckCircle, Lock, Trash2, X } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { GameOverlay } from "../GameOverlay";
import { useGame } from "@/contexts/GameContext";
import { HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import analysisLabImg from "@/assets/rooms/analysis-room-2.png";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

const ratingOptions = [
  { value: "++", label: "متسق جداً", color: "bg-emerald-600", textColor: "text-emerald-100", icon: "✓✓", description: "الدليل بيدعم الفرضية بقوة" },
  { value: "+", label: "متسق", color: "bg-emerald-400/50", textColor: "text-emerald-200", icon: "✓", description: "الدليل مش بينفي الفرضية" },
  { value: "-", label: "غير متسق", color: "bg-red-400/50", textColor: "text-red-200", icon: "✗", description: "الدليل بيشكك في الفرضية" },
  { value: "--", label: "يناقض", color: "bg-red-600", textColor: "text-red-100", icon: "✗✗", description: "الدليل بينفي الفرضية تماماً" },
];

// Hotspots positioned on the analysis lab image
// Hotspot positions mapped to analysis-room-2 image:
// Cork board (left wall), Matrix whiteboard (center), Desk notebook (bottom center), Monitor (right)
const hotspots = [
  { id: "notebook", x: 32, y: 65, width: 16, height: 16, label: "📓 دفتر الملاحظات", icon: "📓" },
  { id: "hypotheses", x: 2, y: 25, width: 16, height: 30, label: "💡 الفرضيات", icon: "💡" },
  { id: "matrix", x: 25, y: 10, width: 50, height: 40, label: "🔬 المصفوفة", icon: "🔬" },
];

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const {
    state, canSelectHypotheses,
    setMatrixCell, getMatrixCell, canUseMatrix, setFinalHypothesis,
    removeFromNotebook,
  } = useGame();

  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleHotspotClick = (id: string) => {
    // Check locks
    if (id === "hypotheses" && !canSelectHypotheses()) {
      toast.error("محتاج تحفظ 3 أدلة على الأقل في الدفتر الأول!");
      return;
    }
    if (id === "matrix" && !canUseMatrix()) {
      toast.error("محتاج يكون عندك 3 فرضيات على الأقل عشان تفتح المصفوفة!");
      return;
    }
    setActivePanel(id);
  };

  const handleSelectFinal = (hypothesisId: string) => {
    setFinalHypothesis(hypothesisId);
    toast.success("تم اختيار الفرضية النهائية! اذهب لمكتب أبو سعيد لتقديم التقرير.");
  };

  const getHypothesisScore = (hId: string) => {
    let reds = 0;
    let greens = 0;
    state.notebook.forEach(note => {
      const val = getMatrixCell(note.sourceId, hId);
      if (val === "--" || val === "-") reds++;
      if (val === "++" || val === "+") greens++;
    });
    return { reds, greens };
  };

  const renderOverlay = () => {
    if (!activePanel) return undefined;

    const closeBtn = (
      <button onClick={() => setActivePanel(null)} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground">
        <X className="w-5 h-5" />
      </button>
    );

    if (activePanel === "notebook") {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              📓 دفتر الملاحظات ({state.notebook.length})
            </h3>
            {closeBtn}
          </div>
          {state.notebook.length === 0 ? (
            <div className="text-center p-8 bg-card/30 rounded-xl">
              <p className="text-4xl mb-4">📓</p>
              <p className="text-muted-foreground text-lg">الدفتر فاضي!</p>
              <p className="text-muted-foreground text-sm mt-2">اجمع أدلة من غرفة الأدلة والبيانات والاجتماعات واحفظها هنا.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {state.notebook.length} ملاحظة محفوظة
                {!canSelectHypotheses() && ` (محتاج ${3 - state.notebook.length} كمان عشان تفتح الفرضيات)`}
              </p>
              {state.notebook.map((note, i) => (
                <motion.div key={note.id}
                  className="p-4 rounded-xl bg-card/50 border border-border flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <span className="text-lg mt-0.5">
                    {note.source === "evidence" ? "📁" : note.source === "interview" ? "👤" : "📊"}
                  </span>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      المصدر: {note.source === "evidence" ? "غرفة الأدلة" : note.source === "interview" ? "مقابلة" : "داشبورد"} ({note.sourceId})
                    </p>
                  </div>
                  <button onClick={() => { removeFromNotebook(note.sourceId); toast.info("تم الحذف"); }}
                    className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activePanel === "hypotheses") {
      const selectedH = HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id));
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              💡 الفرضيات
            </h3>
            {closeBtn}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">دي الفرضيات اللي لسه واقفة بعد المقابلة:</p>
              <span className={cn("text-sm font-bold px-3 py-1 rounded-full",
                state.selectedHypotheses.length >= 3 ? "bg-neon-green/20 text-neon-green" : "bg-primary/20 text-primary"
              )}>
                {state.selectedHypotheses.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedH.map((h) => (
                <motion.div key={h.id}
                  className="p-4 rounded-xl border text-right bg-card/50 border-border"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-primary text-primary-foreground">
                      {h.id}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{h.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activePanel === "matrix") {
      const selectedH = HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id));
      const notebookItems = state.notebook;
      const totalCells = notebookItems.length * selectedH.length;
      let filledCells = 0;
      notebookItems.forEach(note => {
        selectedH.forEach(h => {
          if (getMatrixCell(note.sourceId, h.id)) filledCells++;
        });
      });
      const allFilled = filledCells === totalCells && totalCells > 0;

      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-5xl w-full max-h-[85vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-primary" />
              🔬 المصفوفة
            </h3>
            {closeBtn}
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            قيّم كل دليل مع كل فرضية: لو الفرضية دي صح، هل الدليل ده منطقي؟
          </p>

          <div className="overflow-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 sticky top-0 z-10">
                <tr>
                  <th className="text-right p-3 text-foreground min-w-[180px]">الدليل</th>
                  {selectedH.map(h => (
                    <th key={h.id} className="text-center p-3 text-foreground min-w-[120px]">
                      <span className="text-xs">{h.id}</span><br/>
                      <span className="text-xs">{h.text}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notebookItems.map((note) => (
                  <tr key={note.id} className="border-b border-border/50">
                    <td className="p-3 text-foreground text-xs min-w-[220px] max-w-[300px]">
                      <span className="mr-1">{note.source === "evidence" ? "📁" : note.source === "interview" ? "👤" : "📊"}</span>
                      {note.text}
                    </td>
                    {selectedH.map(h => {
                      const cellValue = getMatrixCell(note.sourceId, h.id);
                      const rating = ratingOptions.find(r => r.value === cellValue);
                      return (
                        <td key={h.id} className="p-2 text-center">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className={cn(
                                "w-full h-10 rounded-lg border transition-all flex items-center justify-center text-sm font-bold",
                                rating ? `${rating.color} ${rating.textColor} border-transparent` : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
                              )}>
                                {rating ? rating.icon : "?"}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="center">
                              <div className="space-y-1">
                                {ratingOptions.map(opt => (
                                  <button key={opt.value}
                                    onClick={() => setMatrixCell(note.sourceId, h.id, opt.value)}
                                    className={cn("w-full flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-secondary/50 transition-all",
                                      cellValue === opt.value && "ring-2 ring-primary"
                                    )}
                                  >
                                    <span className={cn("w-8 h-8 rounded flex items-center justify-center font-bold", opt.color, opt.textColor)}>
                                      {opt.icon}
                                    </span>
                                    <div className="text-right">
                                      <p className="font-bold text-foreground">{opt.label}</p>
                                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-card/50">
                <tr>
                  <td className="p-3 font-bold text-foreground">التناقضات ⬇️</td>
                  {selectedH.map(h => {
                    const score = getHypothesisScore(h.id);
                    const isLowest = selectedH.every(other => {
                      const otherScore = getHypothesisScore(other.id);
                      return score.reds <= otherScore.reds;
                    });
                    return (
                      <td key={h.id} className={cn("p-3 text-center font-bold",
                        isLowest && allFilled ? "text-neon-green" : "text-foreground"
                      )}>
                        <span className="text-destructive">{score.reds}</span>
                        {isLowest && allFilled && <span className="ml-1">👑</span>}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Final selection */}
          {allFilled && state.finalHypothesis === null && (
            <motion.div className="space-y-4 p-6 bg-accent/10 border border-accent/30 rounded-xl mt-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-bold text-accent text-lg">🎯 اختر فرضيتك النهائية:</h4>
              <p className="text-sm text-muted-foreground">بناءً على التحليل، اختر الفرضية اللي تعتقد إنها السبب الحقيقي:</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedH.map(h => {
                  const score = getHypothesisScore(h.id);
                  return (
                    <motion.button key={h.id}
                      onClick={() => handleSelectFinal(h.id)}
                      className="p-4 rounded-xl bg-card/50 border border-border hover:border-accent text-right transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="font-bold text-foreground">{h.id}: {h.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">تناقضات: {score.reds}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {state.finalHypothesis && (
            <motion.div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl text-center mt-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <CheckCircle className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <p className="text-neon-green font-bold">
                تم اختيار: {HYPOTHESES.find(h => h.id === state.finalHypothesis)?.text}
              </p>
              <p className="text-sm text-muted-foreground mt-2">اذهب لمكتب أبو سعيد لتقديم التقرير النهائي!</p>
              <motion.button
                onClick={() => onNavigate("office")}
                className="mt-3 px-6 py-3 rounded-lg font-bold text-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                whileHover={{ scale: 1.05 }}
              >
                🏢 اذهب لمكتب أبو سعيد
              </motion.button>
            </motion.div>
          )}
        </div>
      );
    }

    return undefined;
  };

  return (
    <>
    <InteractiveRoom
      backgroundImage={analysisLabImg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activePanel}
      overlayContent={renderOverlay()}
      onCloseOverlay={() => setActivePanel(null)}
    >
      {/* Score */}
      <motion.div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-primary font-bold">📓 {state.notebook.length}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
          <span className="text-amber-400 font-bold">⭐ {state.score}</span>
        </div>
      </motion.div>

      {/* Lock indicators on hotspots */}
      {!canSelectHypotheses() && (
        <div className="absolute z-10" style={{ left: "46%", top: "6%" }}>
          <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" /> محتاج 3 أدلة
          </div>
        </div>
      )}
      {!canUseMatrix() && (
        <div className="absolute z-10" style={{ left: "84%", top: "46%" }}>
          <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" /> محتاج 3 فرضيات
          </div>
        </div>
      )}

    </InteractiveRoom>
    <GameOverlay currentScreen="analysis" onNavigate={onNavigate} />
    </>
  );
};
