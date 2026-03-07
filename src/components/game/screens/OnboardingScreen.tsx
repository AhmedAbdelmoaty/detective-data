import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { CASE_INFO } from "@/data/case1";
import storeFrontImg from "@/assets/scenes/store-front.png";
import introCharImg from "@/assets/scenes/intro-character.png";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "مرحباً بك في المهمة",
    content: `أنت محلل بيانات تم استدعاؤك لحل مشكلة في محل ملابس.\n\n${CASE_INFO.briefing}`,
    icon: "📊",
  },
  {
    id: 2,
    title: "الشخصيات",
    content: `ستقابل 3 شخصيات في صالة المتجر:\n\n• خالد - مدير الصالة\n• نورة - الكاشير\n• أميرة - زبونة دائمة\n\nتكلم معاهم واحفظ المعلومات المهمة!`,
    icon: "👥",
  },
  {
    id: 3,
    title: "الغرف الخمس",
    content: `🏢 مكتب أبو سعيد - القصة والتقرير النهائي\n📁 مكتب الأدلة - تقارير ومستندات\n👥 صالة المتجر - حوارات\n📊 مكتب البيانات - داشبورد وإحصائيات\n🔬 مكتب التحليل - الفرضيات والمصفوفة`,
    icon: "🗺️",
  },
  {
    id: 4,
    title: "طريقة اللعب",
    content: `1️⃣ ابدأ بمقابلة أبو سعيد واسأل الأسئلة الصح\n2️⃣ اللعبة هتطلع لك 3–5 فرضيات تلقائيًا حسب أسئلتك\n3️⃣ اجمع الأدلة واحفظ المهم في الدفتر\n4️⃣ ابنِ المصفوفة (ACH) واستبعد الفرضيات بالدحض… مش بالتأييد\n\n💡 المفتاح: الاستبعاد مش التأكيد!`,
    icon: "🎯",
    isWarning: true,
  },
];

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Progress dots */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentSlide ? "bg-primary" : "bg-muted"}`}
              animate={{ scale: i === currentSlide ? 1.2 : 1 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={`max-w-lg w-full p-5 rounded-2xl border backdrop-blur-xl ${slide.isWarning ? "bg-amber-950/50 border-amber-500/30" : "bg-card/50 border-primary/20"}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${slide.isWarning ? "bg-amber-500/20" : "bg-primary/20"}`}
              >
                {slide.icon}
              </div>
              <h2 className={`text-lg font-bold ${slide.isWarning ? "text-amber-400" : "text-foreground"}`}>
                {slide.title}
              </h2>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
              {slide.content}
            </div>
            <div className="flex justify-center">
              <img
                src={introCharImg}
                alt="Data Analyst"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mt-6">
          <motion.button
            onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentSlide === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
            whileHover={currentSlide > 0 ? { scale: 1.05 } : {}}
            whileTap={currentSlide > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-4 h-4" /> السابق
          </motion.button>
          {isLastSlide ? (
            <motion.button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4" /> ابدأ المهمة!
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setCurrentSlide((p) => p + 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              التالي <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {!isLastSlide && (
          <motion.button
            onClick={onComplete}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            تخطي المقدمة →
          </motion.button>
        )}
      </div>
    </div>
  );
};
