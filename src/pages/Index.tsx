import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CaseSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 dark" dir="rtl">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-3">
          🕵️ وكالة المحقق
        </h1>
        <p className="text-muted-foreground text-lg">اختر التحدي</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Case 1 - Original */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/case1")}
          className="glass rounded-2xl p-8 text-right hover:border-primary/50 transition-all duration-300 hover:glow-primary group"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">
            القضية الأولى
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            حلل البيانات، استجوب المشتبه بهم، واكشف الحقيقة في قضية غامضة باستخدام مصفوفة التحليل.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-primary/70">
            <span>⏱ 30-45 دقيقة</span>
            <span className="text-border">|</span>
            <span>📊 تحليل بيانات</span>
          </div>
        </motion.button>

        {/* QF Mini-Game */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/qf")}
          className="glass rounded-2xl p-8 text-right hover:border-accent/50 transition-all duration-300 hover:glow-accent group"
        >
          <div className="text-5xl mb-4">❓</div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-2 group-hover:text-accent transition-colors">
            اسأل صح
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            محل أبو سعيد مبيعاته نزلت 25%. عندك 10 دقايق تسأل الأسئلة الصح وتلاقي السبب الحقيقي.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-accent/70">
            <span>⏱ 10 دقايق</span>
            <span className="text-border">|</span>
            <span>🧠 تفكير منهجي</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default CaseSelector;
