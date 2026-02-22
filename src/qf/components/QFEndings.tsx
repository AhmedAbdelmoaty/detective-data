import { motion } from "framer-motion";
import { Trophy, Star, FileText, AlertTriangle, Clock, RotateCcw, Home } from "lucide-react";
import { useQF } from "../context/QFContext";
import { qfProblemStatements, qfGoldenQuestions, qfDecisionMappings } from "../data/qfCaseData";
import { useNavigate } from "react-router-dom";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";

const rankIcons = { S: Trophy, A: Star, B: FileText, C: AlertTriangle, D: Clock };
const rankColors = {
  S: "from-amber-500 to-yellow-400",
  A: "from-green-500 to-emerald-400",
  B: "from-blue-500 to-cyan-400",
  C: "from-red-500 to-orange-400",
  D: "from-gray-500 to-gray-400",
};

export const QFEndings = () => {
  const { state, resetGame } = useQF();
  const navigate = useNavigate();
  const ending = state.ending;

  if (!ending) return null;

  const RankIcon = rankIcons[ending.rank];
  const gradient = rankColors[ending.rank];
  const ps = qfProblemStatements.find(p => p.id === state.finalChoices.problemStatement);
  const gqs = state.finalChoices.goldenQuestions.map(id => qfGoldenQuestions.find(q => q.id === id)).filter(Boolean);
  const dms = state.finalChoices.decisionMappings.map(id => qfDecisionMappings.find(d => d.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-10">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${abuSaeed4})` }}>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-20 h-full overflow-y-auto pt-8 pb-8 px-4" dir="rtl">
        <div className="max-w-lg mx-auto">
          {/* Rank badge */}
          <motion.div
            className="flex flex-col items-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
          >
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
              <RankIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {ending.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">{ending.titleEn}</p>
          </motion.div>

          {/* Abu Saeed Reaction */}
          <motion.div
            className="glass rounded-xl p-5 mb-4 border border-teal-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-bold text-teal-400 mb-2">أبو سعيد:</p>
            <p className="text-foreground leading-relaxed">{ending.abuSaeedReaction}</p>
          </motion.div>

          {/* Description */}
          <motion.div
            className="glass rounded-xl p-4 mb-4 border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">{ending.description}</p>
          </motion.div>

          {/* Recap */}
          {ending.rank !== "D" && (
            <motion.div
              className="glass rounded-xl p-4 mb-4 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-sm font-bold text-primary mb-3">📋 ما قدّمته:</h3>

              {ps && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">المشكلة:</p>
                  <p className="text-sm text-foreground">{ps.text}</p>
                </div>
              )}

              {gqs.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">الأسئلة الذهبية:</p>
                  {gqs.map((gq, i) => (
                    <p key={i} className="text-sm text-foreground">
                      {i + 1}. {gq?.text}
                    </p>
                  ))}
                </div>
              )}

              {dms.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">خريطة القرار:</p>
                  {dms.map((dm, i) => (
                    <p key={i} className="text-sm text-foreground">
                      • {dm?.condition} ← {dm?.action}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            className="flex gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex-1 glass rounded-xl p-3 border border-border/50 text-center">
              <p className="text-lg font-bold text-foreground">{Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, "0")}</p>
              <p className="text-xs text-muted-foreground">الوقت المتبقي</p>
            </div>
            <div className="flex-1 glass rounded-xl p-3 border border-border/50 text-center">
              <p className="text-lg font-bold text-foreground">{state.trust}</p>
              <p className="text-xs text-muted-foreground">الثقة</p>
            </div>
            <div className="flex-1 glass rounded-xl p-3 border border-border/50 text-center">
              <p className="text-lg font-bold text-foreground">{state.clarity}</p>
              <p className="text-xs text-muted-foreground">الوضوح</p>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <button
              onClick={() => { resetGame(); }}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> العب تاني
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl border border-border bg-secondary text-foreground font-bold flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> القائمة الرئيسية
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
