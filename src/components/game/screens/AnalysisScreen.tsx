import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lightbulb, Grid3X3, CheckCircle, Lock, Trash2 } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

type TabType = "notebook" | "hypotheses" | "matrix";

const ratingOptions = [
  { value: "++", label: "متسق جداً", color: "bg-emerald-600", textColor: "text-emerald-100", icon: "✓✓", description: "الدليل بيدعم الفرضية بقوة" },
  { value: "+", label: "متسق", color: "bg-emerald-400/50", textColor: "text-emerald-200", icon: "✓", description: "الدليل مش بينفي الفرضية" },
  { value: "-", label: "غير متسق", color: "bg-red-400/50", textColor: "text-red-200", icon: "✗", description: "الدليل بيشكك في الفرضية" },
  { value: "--", label: "يناقض", color: "bg-red-600", textColor: "text-red-100", icon: "✗✗", description: "الدليل بينفي الفرضية تماماً" },
];

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const {
    state, toggleHypothesis, isHypothesisSelected, canSelectHypotheses,
    setMatrixCell, getMatrixCell, canUseMatrix, setFinalHypothesis,
    removeFromNotebook,
  } = useGame();

  const [activeTab, setActiveTab] = useState<TabType>("notebook");

  const tabs = [
    { id: "notebook" as const, label: "📓 دفتر الملاحظات", icon: BookOpen, count: state.notebook.length },
    { id: "hypotheses" as const, label: "💡 الفرضيات", icon: Lightbulb, locked: !canSelectHypotheses() },
    { id: "matrix" as const, label: "🔬 المصفوفة", icon: Grid3X3, locked: !canUseMatrix() },
  ];

  const handleSelectFinal = (hypothesisId: string) => {
    setFinalHypothesis(hypothesisId);
    toast.success("تم اختيار الفرضية النهائية! اذهب لمكتب أبو سعيد لتقديم التقرير.");
  };

  // Count contradictions per hypothesis
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

  const renderNotebook = () => (
    <div className="space-y-4">
      {state.notebook.length === 0 ? (
        <div className="text-center p-8 bg-card/30 rounded-xl">
          <p className="text-4xl mb-4">📓</p>
          <p className="text-muted-foreground text-lg">الدفتر فاضي!</p>
          <p className="text-muted-foreground text-sm mt-2">اجمع أدلة من غرفة الأدلة والبيانات والاجتماعات واحفظها هنا.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );

  const renderHypotheses = () => {
    if (!canSelectHypotheses()) {
      return (
        <div className="text-center p-8 bg-card/30 rounded-xl">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">محتاج تحفظ 3 أدلة على الأقل في الدفتر!</p>
          <p className="text-muted-foreground text-sm mt-2">عندك {state.notebook.length} حالياً.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">اختر 4 فرضيات تعتقد إنها ممكن تكون السبب:</p>
          <span className={cn("text-sm font-bold px-3 py-1 rounded-full",
            state.selectedHypotheses.length === 4 ? "bg-neon-green/20 text-neon-green" : "bg-primary/20 text-primary"
          )}>
            {state.selectedHypotheses.length}/4
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HYPOTHESES.map((h) => {
            const isSelected = isHypothesisSelected(h.id);
            const isFull = state.selectedHypotheses.length >= 4 && !isSelected;
            return (
              <motion.button key={h.id}
                onClick={() => { if (!isFull) toggleHypothesis(h.id); }}
                disabled={isFull}
                className={cn(
                  "p-4 rounded-xl border text-right transition-all",
                  isSelected ? "bg-primary/20 border-primary ring-2 ring-primary/30" :
                  isFull ? "bg-muted/30 border-border opacity-50 cursor-not-allowed" :
                  "bg-card/50 border-border hover:border-primary/50"
                )}
                whileHover={!isFull ? { scale: 1.02 } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    {isSelected ? "✓" : h.id}
                  </div>
                  <div>
                    <p className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>{h.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        {state.selectedHypotheses.length === 4 && (
          <motion.div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neon-green font-bold">✓ ممتاز! دلوقتي تقدر تفتح المصفوفة وتبدأ التحليل.</p>
          </motion.div>
        )}
      </div>
    );
  };

  const renderMatrix = () => {
    if (!canUseMatrix()) {
      return (
        <div className="text-center p-8 bg-card/30 rounded-xl">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">محتاج تختار 4 فرضيات الأول!</p>
        </div>
      );
    }

    const selectedH = HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id));
    const notebookItems = state.notebook;

    // Check if all cells are filled
    const totalCells = notebookItems.length * selectedH.length;
    let filledCells = 0;
    notebookItems.forEach(note => {
      selectedH.forEach(h => {
        if (getMatrixCell(note.sourceId, h.id)) filledCells++;
      });
    });
    const allFilled = filledCells === totalCells && totalCells > 0;

    return (
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          قيّم كل دليل مع كل فرضية: لو الفرضية دي صح، هل الدليل ده منطقي؟
        </p>

        {/* Matrix grid */}
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
            {/* Summary row */}
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
          <motion.div className="space-y-4 p-6 bg-accent/10 border border-accent/30 rounded-xl"
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
          <motion.div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <CheckCircle className="w-8 h-8 text-neon-green mx-auto mb-2" />
            <p className="text-neon-green font-bold">
              تم اختيار: {HYPOTHESES.find(h => h.id === state.finalHypothesis)?.text}
            </p>
            <p className="text-sm text-muted-foreground mt-2">اذهب لمكتب أبو سعيد لتقديم التقرير النهائي!</p>
            <motion.button
              onClick={() => onNavigate("office")}
              className="mt-3 px-6 py-3 rounded-lg font-bold"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.05 }}
            >
              🏢 اذهب لمكتب أبو سعيد
            </motion.button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-foreground">🔬 غرفة التحليل</h2>
          <span className="text-primary font-bold text-sm">📓 {state.notebook.length} | ⭐ {state.score}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button key={tab.id}
              onClick={() => { if (!tab.locked) setActiveTab(tab.id); }}
              className={cn("px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-primary text-primary-foreground" :
                tab.locked ? "bg-muted/30 text-muted-foreground cursor-not-allowed" :
                "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              {tab.locked && <Lock className="w-3 h-3" />}
              {tab.label}
              {tab.count !== undefined && <span className="text-xs opacity-70">({tab.count})</span>}
            </button>
          ))}
        </div>

        {activeTab === "notebook" && renderNotebook()}
        {activeTab === "hypotheses" && renderHypotheses()}
        {activeTab === "matrix" && renderMatrix()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
        <NavigationButton iconEmoji="👥" label="الاجتماعات" onClick={() => onNavigate("interrogation")} />
        <NavigationButton iconEmoji="📊" label="البيانات" onClick={() => onNavigate("dashboard")} />
      </div>

      {/* Guidance notification */}
      {state.notebook.length >= 3 && !canSelectHypotheses() === false && state.selectedHypotheses.length === 0 && activeTab === "notebook" && (
        <motion.div className="fixed top-20 right-6 z-40 p-4 rounded-xl bg-accent/20 border border-accent/30 max-w-xs"
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
        >
          <p className="text-accent font-bold text-sm">💡 عندك أدلة كافية!</p>
          <p className="text-xs text-muted-foreground mt-1">تقدر دلوقتي تروح تاب الفرضيات وتبدأ تحدد الاحتمالات.</p>
        </motion.div>
      )}
    </div>
  );
};
