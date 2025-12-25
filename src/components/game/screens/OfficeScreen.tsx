import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, Target, Star } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { AnimatedCharacter } from "../AnimatedCharacter";
import detectiveOffice from "@/assets/rooms/detective-office.png";

interface OfficeScreenProps {
  onNavigate: (screen: string) => void;
}

const hotspots = [
  {
    id: "case-board",
    x: 20,
    y: 10,
    width: 55,
    height: 45,
    label: "لوحة القضية",
    icon: "📋",
  },
  {
    id: "desk",
    x: 25,
    y: 60,
    width: 50,
    height: 30,
    label: "مكتب المحقق",
    icon: "📝",
  },
  {
    id: "filing-cabinet",
    x: 0,
    y: 30,
    width: 18,
    height: 50,
    label: "الأرشيف",
    icon: "🗄️",
  },
];

const introDialogues = [
  {
    characterId: "detective" as const,
    text: "أهلاً بك في مكتبي. لدينا قضية جديدة تحتاج لحلها...",
    mood: "neutral" as const,
  },
  {
    characterId: "detective" as const,
    text: "شركة صغيرة اكتشفت أن هناك أموال تختفي من حساباتها كل شهر. ثلاثة موظفين تحت الشبهة.",
    mood: "suspicious" as const,
  },
  {
    characterId: "detective" as const,
    text: "مهمتك هي تحليل البيانات وكشف المختلس. انقر على لوحة القضية لمعرفة التفاصيل!",
    mood: "happy" as const,
  },
];

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showDialogue, setShowDialogue] = useState(true);
  const [dialogueComplete, setDialogueComplete] = useState(false);

  const handleHotspotClick = (id: string) => {
    if (!dialogueComplete) return;
    setActivePanel(id);
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case "case-board":
        return (
          <GameCard title="لوحة القضية" iconEmoji="📋" className="w-full">
            <div className="space-y-6 p-2">
              {/* Case Info */}
              <motion.div
                className="p-4 rounded-lg bg-primary/10 border border-primary/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  القضية: الأموال المفقودة
                </h3>
                <p className="text-muted-foreground">
                  شركة تجارية صغيرة اكتشفت اختفاء مبالغ مالية من حساباتها على مدى 3 أشهر.
                  المبلغ المفقود: 45,000 ريال
                </p>
              </motion.div>

              {/* Objectives */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  المهام
                </h4>
                <ul className="space-y-2">
                  {[
                    { text: "فحص سجلات المعاملات المالية", done: false },
                    { text: "تحليل أنماط الصرف غير العادية", done: false },
                    { text: "استجواب المشتبه بهم", done: false },
                    { text: "تحديد المختلس", done: false },
                  ].map((task, i) => (
                    <motion.li
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded ${
                        task.done ? "bg-success/20" : "bg-muted/30"
                      }`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className={task.done ? "text-success" : "text-muted-foreground"}>
                        {task.done ? "✅" : "⬜"}
                      </span>
                      <span className={task.done ? "line-through text-muted-foreground" : ""}>
                        {task.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Suspects Preview with real images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-bold text-foreground mb-4">المشتبه بهم</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(["ahmed", "sara", "karim"] as const).map((id, i) => (
                    <motion.div
                      key={id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                    >
                      <AnimatedCharacter
                        characterId={id}
                        size="md"
                        showName
                        mood={id === "karim" ? "nervous" : "neutral"}
                        entrance="bounce"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </GameCard>
        );

      case "desk":
        return (
          <GameCard title="مكتب المحقق - التقدم" iconEmoji="📊" className="w-full">
            <div className="space-y-6 p-2">
              <ProgressBar label="تقدم التحقيق" value={15} max={100} color="primary" />
              <ProgressBar label="الأدلة المجمعة" value={0} max={5} color="accent" />
              <ProgressBar label="الاستجوابات" value={0} max={3} color="success" />

              <div className="flex flex-col gap-3 mt-6">
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-primary/20 border border-primary/50 text-primary font-bold hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("evidence")}
                >
                  📁 غرفة الأدلة
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-accent/20 border border-accent/50 text-accent font-bold hover:bg-accent/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("analysis")}
                >
                  📊 غرفة التحليل
                </motion.button>
                <motion.button
                  className="w-full py-3 px-4 rounded-lg bg-success/20 border border-success/50 text-success font-bold hover:bg-success/30 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate("interrogation")}
                >
                  🧑‍💼 غرفة الاستجواب
                </motion.button>
              </div>
            </div>
          </GameCard>
        );

      case "filing-cabinet":
        return (
          <GameCard title="ملفات القضايا السابقة" iconEmoji="🗄️" className="w-full">
            <div className="space-y-4 p-2">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-gold" />
                  <div>
                    <h4 className="font-bold">رتبتك الحالية</h4>
                    <p className="text-2xl font-bold text-gold">محقق مبتدئ</p>
                  </div>
                </div>
              </div>

              <div className="text-center text-muted-foreground py-8">
                <motion.p
                  className="text-4xl mb-2"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📂
                </motion.p>
                <p>لم تحل أي قضايا بعد</p>
                <p className="text-sm">ابدأ بحل القضية الحالية!</p>
              </div>
            </div>
          </GameCard>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <InteractiveRoom
        backgroundImage={detectiveOffice}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activePanel}
        overlayContent={activePanel ? renderPanelContent() : undefined}
        onCloseOverlay={() => setActivePanel(null)}
      >
        {/* Back button */}
        <motion.button
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          onClick={() => onNavigate("intro")}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>رجوع</span>
        </motion.button>

        {/* Room title */}
        <motion.div
          className="absolute top-4 right-4 z-20 px-6 py-3 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-primary">🕵️ مكتب المحقق</h2>
        </motion.div>

        {/* Hint when dialogue is complete */}
        {dialogueComplete && !activePanel && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary text-center">
              ✨ انقر على الأماكن المضيئة لاستكشاف المكتب
            </p>
          </motion.div>
        )}
      </InteractiveRoom>

      {/* Enhanced Dialogue System */}
      <EnhancedDialogue
        dialogues={introDialogues}
        isActive={showDialogue && !dialogueComplete}
        onComplete={() => {
          setDialogueComplete(true);
          setShowDialogue(false);
        }}
      />
    </>
  );
};
