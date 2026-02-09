import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { CASE_INFO } from "@/data/case1";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    title: "مرحباً بك في مهمة التحقيق",
    content: `أنت محقق بيانات تم استدعاؤك لحل لغز في محل ملابس.

${CASE_INFO.briefing}`,
    icon: "🔍",
    mood: "happy" as const,
  },
  {
    id: 2,
    title: "الشخصيات",
    content: `ستقابل 3 شخصيات في غرفة الاجتماعات:

• خالد - مدير الصالة (يعرف حركة المحل)
• نورة - الكاشير (تتعامل مع النظام يومياً)
• أم فهد - زبونة دائمة (شاهدة من الخارج)

تكلم معاهم واحفظ المعلومات المهمة في دفتر الملاحظات!`,
    icon: "👥",
    mood: "suspicious" as const,
  },
  {
    id: 3,
    title: "الغرف الخمس",
    content: `ستتنقل بين 5 غرف بحرية كاملة:

🏢 مكتب أبو سعيد - سماع القصة وتقديم التقرير النهائي
📁 غرفة الأدلة - تقارير ومستندات مادية
👥 غرفة الاجتماعات - حوارات مع الشخصيات
📊 غرفة البيانات - داشبورد وإحصائيات
🔬 غرفة التحليل - الفرضيات والمصفوفة والدفتر`,
    icon: "🗺️",
    mood: "neutral" as const,
  },
  {
    id: 4,
    title: "طريقة اللعب",
    content: `1️⃣ اجمع الأدلة واحفظ المهم في دفتر الملاحظات
2️⃣ بعد جمع 3 أدلة على الأقل: اختر 4 فرضيات من 8
3️⃣ ابنِ مصفوفة التحليل (ACH) - قيّم كل دليل مع كل فرضية
4️⃣ الفرضية اللي ما عندهاش تناقض هي الأرجح
5️⃣ اختر فرضيتك النهائية وقدم تقريرك لأبو سعيد

💡 المفتاح: الاستبعاد مش التأكيد!`,
    icon: "🎯",
    mood: "nervous" as const,
    isWarning: true,
  },
];

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <motion.div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? "bg-primary" : "bg-muted"}`} animate={{ scale: i === currentSlide ? 1.2 : 1 }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={slide.id}
            className={`max-w-2xl w-full p-8 rounded-2xl border backdrop-blur-xl ${slide.isWarning ? "bg-amber-950/50 border-amber-500/30" : "bg-card/50 border-primary/20"}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${slide.isWarning ? "bg-amber-500/20" : "bg-primary/20"}`}
                animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}
              >
                {slide.icon}
              </motion.div>
              <h2 className={`text-2xl font-bold ${slide.isWarning ? "text-amber-400" : "text-foreground"}`}>{slide.title}</h2>
            </div>
            <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-8">{slide.content}</div>
            <div className="flex justify-center mb-8">
              <AnimatedCharacter characterId="detective" size="lg" isActive mood={slide.mood} showName={false} />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-6 mt-8">
          <motion.button onClick={() => setCurrentSlide(p => Math.max(0, p - 1))} disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentSlide === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
            whileHover={currentSlide > 0 ? { scale: 1.05 } : {}} whileTap={currentSlide > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-5 h-5" /> السابق
          </motion.button>
          {isLastSlide ? (
            <motion.button onClick={onComplete}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" /> ابدأ التحقيق!
            </motion.button>
          ) : (
            <motion.button onClick={() => setCurrentSlide(p => p + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              التالي <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {!isLastSlide && (
          <motion.button onClick={onComplete} className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          >
            تخطي المقدمة →
          </motion.button>
        )}
      </div>
    </div>
  );
};
