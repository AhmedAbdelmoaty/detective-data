import { motion } from "framer-motion";
import { 
  Trophy, Star, Award, Target, BookOpen, RotateCcw, 
  CheckCircle, XCircle, Clock, Brain, TrendingUp
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, LEARNING_CONCEPTS, ANALYSIS_CHALLENGES, CASE_SOLUTION } from "@/data/case1";
import { cn } from "@/lib/utils";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame } = useGame();

  const isWin = state.accusation === CASE_SOLUTION.culprit;
  const totalPossibleScore = 500 + ANALYSIS_CHALLENGES.reduce((sum, c) => sum + c.points, 0);
  const scorePercentage = Math.round((state.score / totalPossibleScore) * 100);
  
  // حساب الرتبة
  const getRank = () => {
    if (scorePercentage >= 90) return { title: "محقق أسطوري", titleEn: "Legendary Detective", icon: "🏆", color: "text-yellow-400" };
    if (scorePercentage >= 75) return { title: "محقق خبير", titleEn: "Expert Detective", icon: "🥇", color: "text-gold" };
    if (scorePercentage >= 50) return { title: "محقق متقدم", titleEn: "Advanced Detective", icon: "🥈", color: "text-slate-300" };
    if (scorePercentage >= 25) return { title: "محقق مبتدئ", titleEn: "Junior Detective", icon: "🥉", color: "text-amber-600" };
    return { title: "متدرب", titleEn: "Trainee", icon: "📚", color: "text-muted-foreground" };
  };
  
  const rank = getRank();

  const handleReplay = () => {
    resetGame();
    onNavigate("intro");
  };

  const stats = [
    { label: "الأدلة المجمعة", value: state.collectedEvidence.length, max: 5, icon: "📁" },
    { label: "التحديات المحلولة", value: state.puzzlesSolved.length, max: ANALYSIS_CHALLENGES.length, icon: "🧩" },
    { label: "الاستجوابات", value: state.interrogatedSuspects.length, max: 3, icon: "🗣️" },
    { label: "الاستنتاجات", value: state.insights.length, max: 10, icon: "💡" },
    { label: "المفاهيم المكتسبة", value: state.unlockedConcepts.length, max: LEARNING_CONCEPTS.length, icon: "📚" },
  ];

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isWin 
        ? "bg-gradient-to-b from-green-950 via-green-900/50 to-background" 
        : "bg-gradient-to-b from-red-950 via-red-900/50 to-background"
    )}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              isWin ? "bg-green-400/30" : "bg-red-400/30"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: isWin ? [0, -5, 5, 0] : [0, 0, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isWin ? "🎉" : "💨"}
          </motion.div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-2",
            isWin ? "text-green-400" : "text-red-400"
          )}>
            {isWin ? "القضية محلولة!" : "المجرم هرب!"}
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {isWin 
              ? `أحسنت! لقد كشفت أن ${CASE_SOLUTION.culprit === "karim" ? "كريم" : ""} هو المختلس.`
              : "للأسف، اتهمت الشخص الخطأ. المختلس الحقيقي استغل الفرصة وهرب!"}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          className={cn(
            "p-6 rounded-2xl border mb-6",
            isWin 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-red-500/10 border-red-500/30"
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Score */}
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm mb-1">النقاط النهائية</p>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-gold" />
                <span className="text-5xl font-bold text-gold">{state.score}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                من أصل {totalPossibleScore} نقطة ({scorePercentage}%)
              </p>
            </div>

            {/* Rank */}
            <div className="text-center">
              <motion.div
                className="text-6xl mb-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {rank.icon}
              </motion.div>
              <p className={cn("text-2xl font-bold", rank.color)}>{rank.title}</p>
              <p className="text-sm text-muted-foreground">{rank.titleEn}</p>
            </div>

            {/* Case Info */}
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm mb-1">القضية</p>
              <p className="text-xl font-bold text-foreground">{CASE_INFO.title}</p>
              <p className="text-sm text-muted-foreground">{CASE_INFO.titleEn}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl bg-card/50 border border-border text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}<span className="text-muted-foreground text-sm">/{stat.max}</span>
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Concepts Learned */}
        <motion.div
          className="p-6 rounded-2xl bg-accent/10 border border-accent/30 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            المفاهيم التي تعلمتها ({state.unlockedConcepts.length}/{LEARNING_CONCEPTS.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {LEARNING_CONCEPTS.map((concept, i) => {
              const isUnlocked = state.unlockedConcepts.includes(concept.id);
              return (
                <motion.div
                  key={concept.id}
                  className={cn(
                    "p-4 rounded-xl border flex items-center gap-4",
                    isUnlocked 
                      ? "bg-accent/10 border-accent/30" 
                      : "bg-muted/20 border-border opacity-50"
                  )}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: isUnlocked ? 1 : 0.5 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                    isUnlocked ? "bg-accent/20" : "bg-muted"
                  )}>
                    {isUnlocked ? concept.icon : "🔒"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{concept.title}</p>
                      {isUnlocked && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{concept.titleEn}</p>
                    {isUnlocked && (
                      <p className="text-sm text-accent mt-1">{concept.description}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Case Summary (if won) */}
        {isWin && (
          <motion.div
            className="p-6 rounded-2xl bg-primary/10 border border-primary/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              ملخص القضية
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">المجرم</p>
                <p className="font-bold text-foreground">كريم الحسن - مدير المشتريات</p>
              </div>
              
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">طريقة الاحتيال</p>
                <p className="text-foreground">{CASE_SOLUTION.method}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-1">المبلغ المختلس</p>
                <p className="text-2xl font-bold text-destructive">{CASE_SOLUTION.totalAmount.toLocaleString()} ريال</p>
              </div>
              
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-2">الأدلة الرئيسية</p>
                <ul className="space-y-1">
                  {CASE_SOLUTION.evidence.map((e, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={handleReplay}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-6 h-6" />
            العب مرة أخرى
          </motion.button>
          
          <motion.button
            onClick={() => onNavigate("intro")}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-foreground font-bold text-lg border border-border"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 القائمة الرئيسية
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-muted-foreground text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          🎮 Data Detective - تعلم تحليل البيانات بطريقة ممتعة
        </motion.p>
      </div>
    </div>
  );
};
