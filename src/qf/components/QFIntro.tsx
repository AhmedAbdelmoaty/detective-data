import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { useQF } from "../context/QFContext";
import { useNavigate } from "react-router-dom";
import storeFront from "@/assets/scenes/store-front.png";

export const QFIntro = () => {
  const { startGame } = useQF();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${storeFront})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-end h-full pb-12 px-6" dir="rtl">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-5xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, delay: 0.2 }}
          >
            🔍
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-2">لعبة الأسئلة</h1>
          <h2 className="text-lg text-primary font-medium mb-4">قبل الالتزام</h2>

          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            أبو سعيد — صاحب محل ملابس — عنده مشكلة في المبيعات ومحتاج مساعدتك.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            عندك <span className="text-primary font-bold">12 دقيقة</span> تسأل الأسئلة الصح، تفهم المشكلة، وتقدّم إطار واضح قبل ما يمشي.
          </p>

          <div className="glass rounded-xl p-4 mb-6 border border-border/50 text-right">
            <p className="text-xs text-muted-foreground mb-2 font-bold">💡 نصائح:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• كل سؤال بياخد وقت وبيأثر على ثقة أبو سعيد فيك</li>
              <li>• لوحة التأطير بتتحدث تلقائيًا من اختياراتك</li>
              <li>• ممكن ترجع خطوة بس هيكلفك وقت وثقة</li>
              <li>• مفيش سؤال "غلط" — بس في أسئلة أذكى من غيرها</li>
            </ul>
          </div>

          <motion.button
            onClick={startGame}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 glow-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            ابدأ اللعبة
          </motion.button>

          <button
            onClick={() => navigate("/")}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
          >
            <ArrowRight className="w-4 h-4" />
            عودة لاختيار القضايا
          </button>
        </motion.div>
      </div>
    </div>
  );
};
