import { motion } from "framer-motion";
import { Trophy, Star, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, CASE_SOLUTION } from "@/data/newCase";
import { cn } from "@/lib/utils";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame } = useGame();

  const isWin = state.isCorrect === true;
  const totalPossibleScore = 1000;
  const scorePercentage = Math.round((state.score / totalPossibleScore) * 100);
  
  const getRank = () => {
    if (scorePercentage >= 90) return { title: "محلل أسطوري", icon: "🏆", color: "text-yellow-400" };
    if (scorePercentage >= 75) return { title: "محلل خبير", icon: "🥇", color: "text-gold" };
    if (scorePercentage >= 50) return { title: "محلل متقدم", icon: "🥈", color: "text-slate-300" };
    return { title: "محلل مبتدئ", icon: "🥉", color: "text-amber-600" };
  };
  
  const rank = getRank();

  const handleReplay = () => {
    resetGame();
    onNavigate("intro");
  };

  const stats = [
    { label: "الأدلة المجمعة", value: state.collectedEvidence.length, max: 5, icon: "📁" },
    { label: "الأنماط المكتشفة", value: state.patternsDiscovered.length, max: 3, icon: "🔍" },
    { label: "الملاحظات", value: state.notes.length, max: 10, icon: "📝" },
    { label: "محاولات الاستنتاج", value: state.conclusionAttempts, max: 3, icon: "📋" },
  ];

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isWin 
        ? "bg-gradient-to-b from-green-950 via-green-900/50 to-background" 
        : "bg-gradient-to-b from-red-950 via-red-900/50 to-background"
    )}>
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            {isWin ? "🎉" : "📉"}
          </motion.div>
          
          <h1 className={cn("text-4xl font-bold mb-2", isWin ? "text-green-400" : "text-red-400")}>
            {isWin ? "تحليل صحيح!" : "تحليل غير دقيق"}
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {isWin 
              ? "أحسنت! لقد حددت سبب هبوط الأرباح بدقة."
              : "للأسف، لم تتمكن من تحديد السبب الحقيقي."}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          className={cn("p-6 rounded-2xl border mb-6", isWin ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30")}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm mb-1">النقاط النهائية</p>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-gold" />
                <span className="text-5xl font-bold text-gold">{state.score}</span>
              </div>
            </div>
            <div className="text-center">
              <motion.div className="text-6xl mb-2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                {rank.icon}
              </motion.div>
              <p className={cn("text-2xl font-bold", rank.color)}>{rank.title}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-1">القضية</p>
              <p className="text-xl font-bold text-foreground">{CASE_INFO.title}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-card/50 border border-border text-center">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-foreground">{stat.value}<span className="text-muted-foreground text-sm">/{stat.max}</span></p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Solution Summary */}
        {isWin && (
          <motion.div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" /> ملخص التحقيق
            </h3>
            <p className="text-foreground mb-4">{CASE_SOLUTION.explanation}</p>
            <div className="space-y-2">
              {CASE_SOLUTION.keyInsights.map((insight, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> {insight}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {!isWin && (
          <motion.div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h3 className="text-xl font-bold text-destructive mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" /> الحل الصحيح
            </h3>
            <p className="text-foreground">{CASE_SOLUTION.explanation}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.button
            onClick={handleReplay}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-6 h-6" />
            العب مرة أخرى
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
