import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, RotateCcw } from "lucide-react";
import analystHero from "@/assets/scenes/analyst-hero.png";
import storeFront from "@/assets/scenes/store-front.png";

const CaseSelector = () => {
  const navigate = useNavigate();
  const [hasOldProgress, setHasOldProgress] = useState(false);
  const [hasQFProgress, setHasQFProgress] = useState(false);

  useEffect(() => {
    const oldScreen = localStorage.getItem("detective-game-screen");
    setHasOldProgress(!!oldScreen && oldScreen !== "intro");
    const qfState = localStorage.getItem("QF_V1_STATE");
    if (qfState) {
      try {
        const parsed = JSON.parse(qfState);
        setHasQFProgress(parsed.gamePhase !== "intro");
      } catch { setHasQFProgress(false); }
    }
  }, []);

  const cases = [
    {
      id: "old",
      title: "القضية الأصلية",
      subtitle: "محقق البيانات",
      description: "حقق في أرقام محل أبو سعيد، اجمع الأدلة، واكتشف السبب الحقيقي وراء انخفاض المبيعات.",
      image: analystHero,
      hasProgress: hasOldProgress,
      onClick: () => navigate("/case1"),
      gradient: "from-cyan-600/80 to-blue-900/80",
      borderColor: "border-cyan-500/40",
      accentColor: "text-cyan-400",
    },
    {
      id: "qf",
      title: "لعبة الأسئلة",
      subtitle: "قبل الالتزام",
      description: "أبو سعيد محتاج مساعدتك. عندك 12 دقيقة تسأل الأسئلة الصح وتأطّر المشكلة قبل ما يمشي.",
      image: storeFront,
      hasProgress: hasQFProgress,
      onClick: () => navigate("/qf"),
      gradient: "from-amber-600/80 to-orange-900/80",
      borderColor: "border-amber-500/40",
      accentColor: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" dir="rtl">
      {/* Title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">🕵️ محقق البيانات</h1>
        <p className="text-muted-foreground">اختر قضيتك وابدأ التحقيق</p>
      </motion.div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-6 max-w-3xl w-full">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            className={`flex-1 rounded-2xl border ${c.borderColor} overflow-hidden cursor-pointer group relative`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={c.onClick}
          >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.gradient}`} />
              {c.hasProgress && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> متابعة
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 bg-card">
              <h2 className="text-xl font-bold text-foreground mb-1">{c.title}</h2>
              <p className={`text-sm font-medium ${c.accentColor} mb-3`}>{c.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
              <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${c.gradient} text-white font-bold text-sm`}>
                <Play className="w-4 h-4" />
                {c.hasProgress ? "تابع اللعب" : "ابدأ"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CaseSelector;
