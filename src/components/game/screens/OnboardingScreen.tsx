import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { CASE_INFO, CHARACTERS, ROOMS } from "@/data/case001";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const MAIN_CHARACTER_IDS = ["sara", "ahmed", "mohammed"] as const;

const MAIN_CHARACTERS = MAIN_CHARACTER_IDS.map((id) =>
  CHARACTERS.find((character) => character.id === id)
).filter(Boolean) as typeof CHARACTERS;

const charactersSlideContent = `ستقابل ثلاث شخصيات أساسيات داخل الشركة:

${MAIN_CHARACTERS.map((character, index) => {
  if (!character) return "";

  const roleNotes = [
    "(تدافع عن قوة الحملة)",
    "(يركز على إغلاق الصفقات)",
    "(ينتظر نتيجة سريعة وواضحة)",
  ];

  return `• ${character.name} - ${character.role} ${roleNotes[index] ?? ""}`.trim();
})
  .filter(Boolean)
  .join("\n")}

كل شخص سيحاول تفسير الأزمة بطريقته… لكن الحقيقة تحتاج ربط الأدلة.`;

const slides = [
  {
    id: 1,
    title: "مرحباً بك في مهمة التحقيق",
    content: `أنت محقق بيانات تم استدعاؤك لحل أزمة داخل شركة الأمل العقارية.

${CASE_INFO.briefing}`,
    icon: "🔍",
    mood: "happy" as const,
  },
  {
    id: 2,
    title: "ملخص القضية",
    content: `انخفضت المبيعات بنسبة 40% خلال آخر 10 أيام بشكل مفاجئ.

المثير للقلق: تم مضاعفة ميزانية التسويق خلال نفس الفترة، ومع ذلك… النتائج انهارت.

مهمتك: كشف السبب الحقيقي قبل أن تبدأ الإدارة في اتخاذ قرارات خاطئة.`,
    icon: "📉",
    mood: "neutral" as const,
  },
  {
    id: 3,
    title: "الشخصيات",
    content: charactersSlideContent,
    icon: "👥",
    mood: "suspicious" as const,
  },
  {
    id: 4,
    title: "الغرف والأدلة",
    content: `ستتنقل بين غرف التحقيق داخل الشركة:

🏢 مكتب الرئيس التنفيذي - بداية القضية ونهاية التقرير
📂 غرفة الأدلة - جمع الأدلة وتثبيت 5 أدلة
🧠 مكتب المحقق - تحليل البيانات وربط المعلومات
🗣️ غرفة المقابلات - مقابلة شخصين فقط
📝 التحليل والاستنتاج - تجهيز التقرير قبل تسليمه

كل غرفة لها دور حقيقي… لا يوجد مكان بلا هدف.`,
    icon: "🗺️",
    mood: "neutral" as const,
  },
  {
    id: 5,
    title: "نظام الوقت والثقة",
    content: `⚠️ انتبه لتصرفاتك!

لديك موارد محدودة:

⏱ الوقت ينخفض عند:
• تثبيت الأدلة
• تشغيل التحليل
• طرح الأسئلة

🤝 الثقة تتغير حسب منطق اختياراتك وطريقة إدارتك للتحقيق.

الضغط موجود… والـCEO ينتظر قراراً.`,
    icon: "⏱️",
    mood: "nervous" as const,
    isWarning: true,
  },
  {
    id: 6,
    title: "قواعد التحقيق",
    content: `قبل أن تبدأ… هذه القواعد لا يمكن كسرها:

• لديك 8 أدلة فقط.
• يجب تثبيت 5 أدلة على لوحة التحقيق للتقدم.
• قراءة الأدلة مجانية… التثبيت يستهلك وقتاً.
• يمكنك مقابلة شخصين فقط.
• كل شخصية لديها 3 أسئلة… تختار سؤالاً واحداً فقط.

لا توجد إجابة جاهزة… ستصل للحقيقة عبر الصورة الكاملة.`,
    icon: "📌",
    mood: "neutral" as const,
  },
];

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Progress dots */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? "bg-primary" : "bg-muted"}`}
              animate={{ scale: i === currentSlide ? 1.2 : 1 }}
            />
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className={`max-w-2xl w-full p-8 rounded-2xl border backdrop-blur-xl ${
              slide.isWarning ? "bg-amber-950/50 border-amber-500/30" : "bg-card/50 border-primary/20"
            }`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon and title */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                  slide.isWarning ? "bg-amber-500/20" : "bg-primary/20"
                }`}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {slide.icon}
              </motion.div>
              <h2 className={`text-2xl font-bold ${slide.isWarning ? "text-amber-400" : "text-foreground"}`}>
                {slide.title}
              </h2>
            </div>

            {/* Content */}
            <div className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-8">
              {slide.content}
            </div>

            {/* Detective character */}
            <div className="flex justify-center mb-8">
              <AnimatedCharacter characterId="detective" size="lg" isActive mood={slide.mood} showName={false} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center gap-6 mt-8">
          {/* Previous button */}
          <motion.button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              currentSlide === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
            whileHover={currentSlide > 0 ? { scale: 1.05 } : {}}
            whileTap={currentSlide > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </motion.button>

          {/* Next / Start button */}
          {isLastSlide ? (
            <motion.button
              onClick={onComplete}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6" />
              ابدأ التحقيق!
            </motion.button>
          ) : (
            <motion.button
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Skip button */}
        {!isLastSlide && (
          <motion.button
            onClick={onComplete}
            className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
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
