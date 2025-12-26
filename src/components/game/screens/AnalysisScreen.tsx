import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, BarChart2, Calculator, GitCompare, Lightbulb, Microscope, 
  AlertTriangle, TrendingUp, TrendingDown, CheckCircle, XCircle, Star,
  Clock, Shield, FileWarning, Receipt, Database
} from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { 
  FINANCIAL_DATA, ANALYSIS_CHALLENGES, LEARNING_CONCEPTS, 
  PURCHASE_INVOICES, SYSTEM_ACCESS_LOGS 
} from "@/data/case1";
import { cn } from "@/lib/utils";
import analysisRoomBg from "@/assets/rooms/analysis-room.png";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  { id: "whiteboard", x: 5, y: 15, width: 30, height: 45, label: "📊 لوحة التحليل", icon: "📊" },
  { id: "computer", x: 40, y: 35, width: 25, height: 35, label: "💻 التحديات", icon: "💻" },
  { id: "board", x: 70, y: 20, width: 25, height: 40, label: "🧠 المفاهيم", icon: "📚" },
];

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { state, addInsight, unlockConcept, solvePuzzle, completeTask } = useGame();
  const { playSound } = useSound();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<typeof ANALYSIS_CHALLENGES[0] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [calculationInput, setCalculationInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(hotspotId);
    setShowOverlay(true);
    playSound("click");
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setActiveHotspot(null);
    setCurrentChallenge(null);
    setSelectedAnswer(null);
    setCalculationInput("");
    setShowResult(false);
  };

  const handleChallengeSelect = (challenge: typeof ANALYSIS_CHALLENGES[0]) => {
    setCurrentChallenge(challenge);
    setSelectedAnswer(null);
    setCalculationInput("");
    setShowResult(false);
  };

  const handleSubmitAnswer = () => {
    if (!currentChallenge) return;

    let correct = false;

    if (currentChallenge.type === "multiple-choice") {
      const correctOption = currentChallenge.options?.find(o => o.isCorrect);
      correct = selectedAnswer === correctOption?.id;
    } else if (currentChallenge.type === "calculation") {
      const answer = parseFloat(calculationInput);
      const tolerance = currentChallenge.tolerance || 0;
      correct = Math.abs(answer - currentChallenge.correctAnswer!) <= tolerance;
    } else if (currentChallenge.type === "counting") {
      correct = parseInt(calculationInput) === currentChallenge.correctAnswer;
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playSound("success");
      solvePuzzle(currentChallenge.id);
      
      if (currentChallenge.conceptUnlocked) {
        unlockConcept(currentChallenge.conceptUnlocked);
      }

      addInsight({
        text: currentChallenge.explanation || "",
        source: currentChallenge.id,
        isCorrect: true,
        concept: currentChallenge.conceptUnlocked,
      });

      // تحديث المهام
      if (currentChallenge.id === "challenge-1") {
        completeTask("find-anomaly");
      }
      if (currentChallenge.id === "challenge-2") {
        completeTask("calculate-stats");
      }
      if (currentChallenge.id === "challenge-4") {
        completeTask("analyze-pattern");
      }
    } else {
      playSound("error");
    }
  };

  // Render data tables for advanced challenges
  const renderChallengeDataTable = () => {
    if (!currentChallenge) return null;

    // Challenge 6: Invoice verification - show purchase invoices
    if (currentChallenge.id === "challenge-6") {
      return (
        <div className="p-4 rounded-xl bg-secondary/20 border border-border overflow-auto max-h-64">
          <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            سجل الفواتير
          </h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                <th className="text-right p-2 text-muted-foreground">المورد</th>
                <th className="text-right p-2 text-muted-foreground">المبلغ</th>
                <th className="text-right p-2 text-muted-foreground">إيصال</th>
              </tr>
            </thead>
            <tbody>
              {PURCHASE_INVOICES.map((inv) => (
                <tr 
                  key={inv.id} 
                  className={cn(
                    "border-b border-border/50",
                    !inv.hasReceipt && "bg-destructive/10"
                  )}
                >
                  <td className="p-2 font-mono text-xs">{inv.date}</td>
                  <td className="p-2">{inv.vendor}</td>
                  <td className="p-2 font-mono">{inv.amount.toLocaleString()}</td>
                  <td className="p-2">
                    {inv.hasReceipt ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 p-2 rounded-lg bg-accent/10 text-sm text-accent">
            💡 اجمع مبالغ الفواتير التي بدون إيصال (❌)
          </div>
        </div>
      );
    }

    // Challenge 7: Access logs analysis
    if (currentChallenge.id === "challenge-7") {
      return (
        <div className="p-4 rounded-xl bg-secondary/20 border border-border overflow-auto max-h-64">
          <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            سجلات الدخول للنظام
          </h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right p-2 text-muted-foreground">التاريخ</th>
                <th className="text-right p-2 text-muted-foreground">الوقت</th>
                <th className="text-right p-2 text-muted-foreground">المستخدم</th>
                <th className="text-right p-2 text-muted-foreground">الإجراء</th>
                <th className="text-right p-2 text-muted-foreground">خارج الدوام</th>
              </tr>
            </thead>
            <tbody>
              {SYSTEM_ACCESS_LOGS.map((log) => (
                <tr 
                  key={log.id} 
                  className={cn(
                    "border-b border-border/50",
                    log.afterHours && log.user === "karim" && "bg-destructive/10"
                  )}
                >
                  <td className="p-2 font-mono text-xs">{log.date}</td>
                  <td className="p-2 font-mono text-xs">{log.time}</td>
                  <td className={cn(
                    "p-2 font-bold",
                    log.user === "karim" ? "text-purple-400" : "text-blue-400"
                  )}>
                    {log.user}
                  </td>
                  <td className="p-2 text-xs">{log.action}</td>
                  <td className="p-2">
                    {log.afterHours ? (
                      <span className="flex items-center gap-1 text-destructive">
                        <AlertTriangle className="w-3 h-3" />
                        نعم
                      </span>
                    ) : (
                      <span className="text-green-400">لا</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 p-2 rounded-lg bg-accent/10 text-sm text-accent">
            💡 عد سجلات كريم التي تمت بعد ساعات العمل (afterHours = نعم)
          </div>
        </div>
      );
    }

    // Challenge 3: Counting invoices without receipts
    if (currentChallenge.id === "challenge-3") {
      return (
        <div className="p-4 rounded-xl bg-secondary/20 border border-border overflow-auto max-h-64">
          <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
            <FileWarning className="w-4 h-4" />
            سجل الفواتير - حالة التوثيق
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {PURCHASE_INVOICES.map((inv) => (
              <div 
                key={inv.id} 
                className={cn(
                  "p-2 rounded-lg border text-sm flex items-center justify-between",
                  inv.hasReceipt 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-destructive/10 border-destructive/30"
                )}
              >
                <span>{inv.vendor.slice(0, 15)}...</span>
                {inv.hasReceipt ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 rounded-lg bg-accent/10 text-sm text-accent">
            💡 عد الفواتير التي تظهر بعلامة ❌ (بدون إيصال)
          </div>
        </div>
      );
    }

    // Challenge 8: Cross-reference calculation
    if (currentChallenge.id === "challenge-8") {
      return (
        <div className="p-4 rounded-xl bg-secondary/20 border border-border">
          <h4 className="font-bold text-accent mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" />
            ملخص مصروفات كريم
          </h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {FINANCIAL_DATA.monthlySummary.map((month) => (
              <div 
                key={month.month} 
                className={cn(
                  "p-3 rounded-lg border text-center",
                  month.anomaly 
                    ? "bg-destructive/10 border-destructive/30" 
                    : "bg-secondary/30 border-border"
                )}
              >
                <div className="text-sm text-muted-foreground">{month.month}</div>
                <div className="text-lg font-mono font-bold text-foreground">
                  {month.karimExpenses.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
            <div className="text-sm text-muted-foreground">المبلغ المفقود</div>
            <div className="text-2xl font-mono font-bold text-primary">45,000 ريال</div>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-accent/10 text-sm text-accent">
            💡 اجمع مصروفات كريم الثلاثة واطرح منها المبلغ المفقود
          </div>
        </div>
      );
    }

    return null;
  };

  const renderChallengeContent = () => {
    if (!currentChallenge) return null;

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* عنوان التحدي */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{currentChallenge.title}</h3>
            <p className="text-sm text-muted-foreground">{currentChallenge.points} نقطة</p>
          </div>
        </div>

        {/* السؤال */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-foreground text-lg">{currentChallenge.description}</p>
        </div>

        {/* بيانات تفاعلية للتحديات المتقدمة */}
        {renderChallengeDataTable()}

        {/* بيانات مساعدة للتحديات الحسابية البسيطة */}
        {currentChallenge.data && !["challenge-6", "challenge-7", "challenge-3", "challenge-8"].includes(currentChallenge.id) && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
            <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              بيانات مساعدة
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {Object.entries(currentChallenge.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-mono text-foreground">{(value as number).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* خيارات الإجابة */}
        {!showResult && (
          <>
            {currentChallenge.type === "multiple-choice" && currentChallenge.options && (
              <div className="grid grid-cols-1 gap-3">
                {currentChallenge.options.map((option, i) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={cn(
                      "p-4 rounded-xl border text-right transition-all",
                      selectedAnswer === option.id
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-secondary/30 border-border text-foreground hover:border-primary/50"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            )}

            {(currentChallenge.type === "calculation" || currentChallenge.type === "counting") && (
              <div className="space-y-4">
                <input
                  type="number"
                  value={calculationInput}
                  onChange={(e) => setCalculationInput(e.target.value)}
                  placeholder="أدخل إجابتك هنا..."
                  className="w-full p-4 rounded-xl bg-secondary/30 border border-border text-foreground text-center text-2xl font-mono focus:outline-none focus:border-primary"
                />
                {currentChallenge.hint && (
                  <p className="text-sm text-muted-foreground text-center">
                    💡 {currentChallenge.hint}
                  </p>
                )}
              </div>
            )}

            <motion.button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer && !calculationInput}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-lg transition-all",
                (selectedAnswer || calculationInput)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              whileHover={(selectedAnswer || calculationInput) ? { scale: 1.02 } : {}}
              whileTap={(selectedAnswer || calculationInput) ? { scale: 0.98 } : {}}
            >
              تحقق من الإجابة
            </motion.button>
          </>
        )}

        {/* نتيجة الإجابة */}
        {showResult && (
          <motion.div
            className={cn(
              "p-6 rounded-xl border",
              isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-destructive/10 border-destructive/30"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-xl font-bold text-green-400">إجابة صحيحة! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-destructive" />
                  <span className="text-xl font-bold text-destructive">إجابة خاطئة</span>
                </>
              )}
            </div>
            
            <p className="text-foreground">{currentChallenge.explanation}</p>
            
            {isCorrect && currentChallenge.conceptUnlocked && (
              <motion.div
                className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-primary flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>مفهوم جديد: {LEARNING_CONCEPTS.find(c => c.id === currentChallenge.conceptUnlocked)?.title}</span>
                </p>
              </motion.div>
            )}

            <motion.button
              onClick={() => {
                setCurrentChallenge(null);
                setShowResult(false);
              }}
              className="mt-4 w-full py-3 rounded-xl bg-secondary text-foreground font-medium"
              whileHover={{ scale: 1.02 }}
            >
              متابعة
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderOverlayContent = () => {
    if (currentChallenge) return renderChallengeContent();

    switch (activeHotspot) {
      case "whiteboard":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <BarChart2 className="w-6 h-6 text-primary" />
              تحليل البيانات المالية
            </h3>

            {/* الرسم البياني */}
            <div className="h-64 flex items-end gap-4 p-6 bg-background/50 rounded-xl border border-border">
              {FINANCIAL_DATA.monthlySummary.map((month, i) => (
                <motion.div
                  key={month.month}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-full flex gap-2 h-48 items-end">
                    <motion.div
                      className={cn(
                        "flex-1 rounded-t-lg relative group cursor-pointer",
                        month.anomaly ? "bg-destructive" : "bg-destructive/60"
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.expenses / 90000) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {month.expenses.toLocaleString()}
                      </span>
                    </motion.div>
                    <motion.div
                      className="flex-1 bg-green-500/70 rounded-t-lg relative group cursor-pointer"
                      initial={{ height: 0 }}
                      animate={{ height: `${(month.revenue / 90000) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {month.revenue.toLocaleString()}
                      </span>
                    </motion.div>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    month.anomaly ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {month.month}
                    {month.anomaly && " ⚠️"}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded bg-destructive/60" />
                المصروفات
              </span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded bg-green-500/70" />
                الإيرادات
              </span>
            </div>

            {/* تحليل كريم vs سارة */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <h4 className="font-bold text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                مقارنة المصروفات حسب الموظف
              </h4>
              <div className="space-y-3">
                {FINANCIAL_DATA.monthlySummary.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <span className="w-16 text-sm font-bold">{month.month}</span>
                    <div className="flex-1 flex gap-2 h-6">
                      <motion.div
                        className="bg-purple-500 rounded-r"
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.karimExpenses / month.expenses) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="bg-blue-500 rounded-l"
                        initial={{ width: 0 }}
                        animate={{ width: `${(month.saraExpenses / month.expenses) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-32">
                      كريم: {month.karimExpenses.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500" /> كريم</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> سارة</span>
              </div>
            </div>
          </div>
        );

      case "computer":
        const basicChallenges = ANALYSIS_CHALLENGES.filter(c => 
          ["challenge-1", "challenge-2", "challenge-4", "challenge-5"].includes(c.id)
        );
        const advancedChallenges = ANALYSIS_CHALLENGES.filter(c => 
          ["challenge-3", "challenge-6", "challenge-7", "challenge-8"].includes(c.id)
        );

        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Calculator className="w-6 h-6 text-primary" />
              تحديات التحليل
            </h3>
            <p className="text-muted-foreground">حل التحديات لكسب النقاط وفتح مفاهيم جديدة!</p>

            {/* شريط الثقة */}
            <div className="p-3 rounded-xl bg-secondary/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  مستوى الثقة
                </span>
                <span className={cn(
                  "font-mono font-bold",
                  state.trust > 70 ? "text-green-400" :
                  state.trust > 40 ? "text-yellow-400" : "text-destructive"
                )}>
                  {state.trust}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    state.trust > 70 ? "bg-green-500" :
                    state.trust > 40 ? "bg-yellow-500" : "bg-destructive"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${state.trust}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* التحديات الأساسية */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                التحديات الأساسية
              </h4>
              <div className="grid gap-3">
                {basicChallenges.map((challenge, i) => {
                  const isSolved = state.puzzlesSolved.includes(challenge.id);
                  return (
                    <motion.button
                      key={challenge.id}
                      onClick={() => !isSolved && handleChallengeSelect(challenge)}
                      className={cn(
                        "p-3 rounded-xl border text-right transition-all",
                        isSolved
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-secondary/30 border-border hover:border-primary/50"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={!isSolved ? { scale: 1.01, x: 3 } : {}}
                      disabled={isSolved}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isSolved ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-primary/50" />
                          )}
                          <div>
                            <h4 className="font-bold text-foreground text-sm">{challenge.title}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gold" />
                          <span className="font-mono text-gold text-sm">{challenge.points}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* التحديات المتقدمة */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-accent flex items-center gap-2">
                <Database className="w-4 h-4" />
                التحديات المتقدمة (تحليل البيانات)
              </h4>
              <div className="grid gap-3">
                {advancedChallenges.map((challenge, i) => {
                  const isSolved = state.puzzlesSolved.includes(challenge.id);
                  return (
                    <motion.button
                      key={challenge.id}
                      onClick={() => !isSolved && handleChallengeSelect(challenge)}
                      className={cn(
                        "p-3 rounded-xl border text-right transition-all",
                        isSolved
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-accent/10 border-accent/30 hover:border-accent"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      whileHover={!isSolved ? { scale: 1.01, x: 3 } : {}}
                      disabled={isSolved}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isSolved ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-accent/50" />
                          )}
                          <div>
                            <h4 className="font-bold text-foreground text-sm">{challenge.title}</h4>
                            <p className="text-xs text-accent">{
                              challenge.id === "challenge-3" ? "تحليل الفواتير" :
                              challenge.id === "challenge-6" ? "حساب مالي" :
                              challenge.id === "challenge-7" ? "تحليل سجلات الدخول" :
                              "ربط البيانات"
                            }</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-accent" />
                          <span className="font-mono text-accent text-sm">{challenge.points}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
              <p className="text-primary font-bold">
                النقاط: {state.score} | التحديات المحلولة: {state.puzzlesSolved.length}/{ANALYSIS_CHALLENGES.length}
              </p>
            </div>
          </div>
        );

      case "board":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-accent" />
              المفاهيم التعليمية
            </h3>
            <p className="text-muted-foreground">المفاهيم التي تعلمتها أثناء التحقيق</p>

            <div className="grid gap-4">
              {LEARNING_CONCEPTS.map((concept, i) => {
                const isUnlocked = state.unlockedConcepts.includes(concept.id);
                return (
                  <motion.div
                    key={concept.id}
                    className={cn(
                      "p-4 rounded-xl border",
                      isUnlocked
                        ? "bg-accent/10 border-accent/30"
                        : "bg-muted/30 border-border opacity-50"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                        isUnlocked ? "bg-accent/20" : "bg-muted"
                      )}>
                        {isUnlocked ? concept.icon : "🔒"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground">{concept.title}</h4>
                        <p className="text-sm text-muted-foreground">{concept.titleEn}</p>
                        {isUnlocked && (
                          <p className="text-sm text-accent mt-2">{concept.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-center">
              <p className="text-accent font-bold">
                المفاهيم المكتسبة: {state.unlockedConcepts.length}/{LEARNING_CONCEPTS.length}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Microscope className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">اختر منطقة للبدء</p>
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
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
          style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.2)" }}
        >
          {renderOverlayContent()}
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
          <span className="text-gold font-mono flex items-center gap-1">
            <Star className="w-4 h-4" />
            {state.score}
          </span>
          <div className="w-px h-6 bg-border" />
          <span className="text-accent font-mono">
            {state.puzzlesSolved.length}/{ANALYSIS_CHALLENGES.length} تحديات
          </span>
        </div>
      </motion.div>

      {/* Insights Panel */}
      <AnimatePresence>
        {state.insights.length > 0 && (
          <motion.div
            className="absolute top-24 right-6 z-20 w-72"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-4 rounded-xl bg-background/90 backdrop-blur-xl border border-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent">الاستنتاجات ({state.insights.length})</span>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-auto">
                {state.insights.slice(-3).map((insight) => (
                  <motion.div
                    key={insight.id}
                    className="p-3 rounded-lg bg-accent/10 border border-accent/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="text-sm text-foreground">{insight.text}</p>
                  </motion.div>
                ))}
              </div>
              
              {state.collectedEvidence.length >= 2 && state.puzzlesSolved.length >= 2 && (
                <motion.button
                  onClick={() => onNavigate("interrogation")}
                  className="w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  مواجهة المشتبهين ←
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
      </div>
      <div className="absolute bottom-8 right-8 z-20">
        <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
      </div>
    </InteractiveRoom>
  );
};
