import { motion } from "framer-motion";
import { 
  Trophy, Star, Award, Target, RotateCcw, 
  CheckCircle, XCircle, Shield, FileText, BarChart3
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, CASE_SOLUTION } from "@/data/case1";
import { cn } from "@/lib/utils";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame, getInterrogationProgress, getUserNotes } = useGame();

  const isWin = state.accusation === CASE_SOLUTION.culprit;
  const totalPossibleScore = 1000;
  const scorePercentage = Math.round((state.score / totalPossibleScore) * 100);
  const userNotes = getUserNotes();
  
  const getRank = () => {
    if (scorePercentage >= 90) return { title: "محقق أسطوري", titleEn: "Legendary Detective", icon: "🏆", color: "text-yellow-400" };
    if (scorePercentage >= 75) return { title: "محقق خبير", titleEn: "Expert Detective", icon: "🥇", color: "text-gold" };
    if (scorePercentage >= 50) return { title: "محقق متقدم", titleEn: "Advanced Detective", icon: "🥈", color: "text-slate-300" };
    if (scorePercentage >= 25) return { title: "محقق مبتدئ", titleEn: "Junior Detective", icon: "🥉", color: "text-amber-600" };
    return { title: "متدرب", titleEn: "Trainee", icon: "📚", color: "text-muted-foreground" };
  };
  
  const rank = getRank();
  const interrogationProgress = getInterrogationProgress();
  const suspectsInterrogated = state.interrogations.filter(i => i.questionsAsked.length > 0).length;

  const handleReplay = () => {
    resetGame();
    onNavigate("intro");
  };

  const stats = [
    { label: "الأدلة المجمعة", value: state.collectedEvidence.length, max: 4, icon: "📁" },
    { label: "الاستجوابات", value: suspectsInterrogated, max: 3, icon: "🗣️" },
    { label: "الأسئلة المطروحة", value: interrogationProgress.asked, max: interrogationProgress.total, icon: "❓" },
    { label: "الفلاتر المستخدمة", value: state.filtersApplied, max: null, icon: "🔍" },
    { label: "الرسوم البيانية", value: state.chartsBuilt, max: null, icon: "📊" },
    { label: "المقارنات", value: state.comparisonsRun, max: null, icon: "🔗" },
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
              ? `أحسنت! لقد كشفت أن كريم هو المختلس.`
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

            {/* Trust & Attempts */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold">{state.trust}% ثقة</span>
              </div>
              <p className="text-muted-foreground text-sm">
                محاولات الاتهام: {state.accusationAttempts}/3
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-3 rounded-xl bg-card/50 border border-border text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
            >
              <span className="text-xl mb-1 block">{stat.icon}</span>
              <p className="text-xl font-bold text-foreground">
                {stat.value}{stat.max !== null && <span className="text-muted-foreground text-sm">/{stat.max}</span>}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* User Notes Review - مقارنة ذاتية */}
        {userNotes.length > 0 && (
          <motion.div
            className="p-6 rounded-2xl bg-accent/10 border border-accent/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              ملاحظاتك أثناء التحقيق ({userNotes.length})
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              راجع ملاحظاتك وقارنها بالحل الحقيقي. هل كان تحليلك في المسار الصحيح؟
            </p>
            
            <div className="space-y-2 max-h-48 overflow-auto">
              {userNotes.map((note, i) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg border flex items-start gap-3",
                    note.category === "observation" ? "bg-blue-500/10 border-blue-500/30" :
                    note.category === "suspicion" ? "bg-amber-500/10 border-amber-500/30" :
                    note.category === "pattern" ? "bg-purple-500/10 border-purple-500/30" :
                    "bg-green-500/10 border-green-500/30"
                  )}
                >
                  <span className="text-lg">
                    {note.category === "observation" ? "👁️" :
                     note.category === "suspicion" ? "🤔" :
                     note.category === "pattern" ? "🔍" : "❓"}
                  </span>
                  <p className="text-foreground text-sm">{note.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Case Summary (if won) */}
        {isWin && (
          <motion.div
            className="p-6 rounded-2xl bg-primary/10 border border-primary/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
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
                <p className="text-sm text-muted-foreground mb-2">الأدلة الرئيسية التي كان يجب اكتشافها</p>
                <ul className="space-y-1">
                  {CASE_SOLUTION.keyEvidence.map((e, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analysis Required */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-primary font-bold mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  التحليل المطلوب
                </p>
                <p className="text-sm text-foreground">{CASE_SOLUTION.analysisRequired}</p>
              </div>

              {/* Misleading Clues */}
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <p className="text-sm text-orange-400 mb-2 font-bold">الأدلة المضللة:</p>
                <ul className="space-y-2">
                  {CASE_SOLUTION.misleadingClues.map((mc, i) => (
                    <li key={i} className="text-sm">
                      <p className="text-foreground font-medium">{mc.clue}</p>
                      <p className="text-muted-foreground text-xs">{mc.explanation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* What you missed (if lost) */}
        {!isWin && (
          <motion.div
            className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-destructive mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              ما الذي فاتك؟
            </h3>
            
            <div className="space-y-3">
              <p className="text-foreground">
                المختلس الحقيقي كان <span className="font-bold text-destructive">كريم الحسن</span>
              </p>
              
              <div className="p-4 rounded-lg bg-background/50">
                <p className="text-sm text-muted-foreground mb-2">التحليل الذي كان يجب إجراؤه:</p>
                <p className="text-foreground">{CASE_SOLUTION.analysisRequired}</p>
              </div>
              
              <p className="text-muted-foreground text-sm">
                الأدلة الرئيسية التي فاتتك:
              </p>
              <ul className="space-y-1">
                {CASE_SOLUTION.keyEvidence.slice(0, 3).map((e, i) => (
                  <li key={i} className="text-sm text-foreground flex items-center gap-2">
                    <span className="text-destructive">•</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleReplay}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-6 h-6" />
            🔄 العب مرة أخرى
          </motion.button>
          
          <motion.button
            onClick={() => { resetGame(); onNavigate("intro"); }}
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
          transition={{ delay: 1 }}
        >
          🎮 Data Detective - تعلم تحليل البيانات بطريقة ممتعة
        </motion.p>
      </div>
    </div>
  );
};
