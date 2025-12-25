import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { SceneTransition } from "../SceneTransition";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { GameCard } from "../GameCard";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";
import suspectArrested from "@/assets/scenes/suspect-arrested.png";
import suspectEscaped from "@/assets/scenes/suspect-escaped.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

type SuspectId = "ahmed" | "sara" | "karim";

interface Suspect {
  id: SuspectId;
  dialogues: Array<{
    characterId: SuspectId;
    text: string;
    mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  }>;
  suspicious: boolean;
}

const suspects: Suspect[] = [
  {
    id: "ahmed",
    dialogues: [
      {
        characterId: "ahmed",
        text: "أنا مسؤول فقط عن التوقيعات النهائية. لا أقوم بإدخال أي معاملات بنفسي.",
        mood: "neutral",
      },
      {
        characterId: "ahmed",
        text: "كل المعاملات تمر عبر سارة للمراجعة وكريم للمشتريات. أنا فقط أوقع.",
        mood: "neutral",
      },
      {
        characterId: "ahmed",
        text: "إذا كان هناك تلاعب، فأنا لم ألاحظه لأن الأوراق كانت تبدو سليمة.",
        mood: "neutral",
      },
    ],
    suspicious: false,
  },
  {
    id: "sara",
    dialogues: [
      {
        characterId: "sara",
        text: "أنا أعمل ساعات إضافية كل يوم! لدي الكثير من التقارير لمراجعتها.",
        mood: "neutral",
      },
      {
        characterId: "sara",
        text: "لاحظت بعض المعاملات الغريبة من قسم المشتريات، لكنها كانت موقعة من أحمد.",
        mood: "suspicious",
      },
      {
        characterId: "sara",
        text: "كريم كان يقدم فواتير كثيرة جداً في الأشهر الأخيرة. أكثر من المعتاد بكثير.",
        mood: "suspicious",
      },
    ],
    suspicious: false,
  },
  {
    id: "karim",
    dialogues: [
      {
        characterId: "karim",
        text: "المشتريات كلها موثقة! عندي فواتير لكل شيء... تقريباً.",
        mood: "nervous",
      },
      {
        characterId: "karim",
        text: "الشركة تحتاج معدات كثيرة. أنا بس بنفذ طلبات الإدارة!",
        mood: "angry",
      },
      {
        characterId: "karim",
        text: "لماذا تنظر إلي هكذا؟ أنا... أنا مش فاكر التفاصيل دلوقتي.",
        mood: "nervous",
      },
    ],
    suspicious: true,
  },
];

const hotspots = [
  {
    id: "chair-left",
    x: 15,
    y: 40,
    width: 25,
    height: 45,
    label: "اختر مشتبه",
    icon: "👥",
  },
  {
    id: "table",
    x: 35,
    y: 55,
    width: 30,
    height: 30,
    label: "اتخذ قرارك",
    icon: "⚖️",
  },
];

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [accusedSuspect, setAccusedSuspect] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [interrogatedSuspects, setInterrogatedSuspects] = useState<string[]>([]);

  const handleHotspotClick = (id: string) => {
    if (id === "chair-left") {
      setActivePanel("suspects");
    } else if (id === "table") {
      setActivePanel("accuse");
    }
  };

  const handleSelectSuspect = (suspect: Suspect) => {
    setSelectedSuspect(suspect);
    setActivePanel(null);
    setTimeout(() => setShowDialogue(true), 500);
    if (!interrogatedSuspects.includes(suspect.id)) {
      setInterrogatedSuspects([...interrogatedSuspects, suspect.id]);
    }
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    setSelectedSuspect(null);
  };

  const handleAccuse = (suspectId: string) => {
    setAccusedSuspect(suspectId);
    setActivePanel(null);
    setTimeout(() => setShowResult(true), 500);
  };

  const isCorrectAccusation = accusedSuspect === "karim";

  const renderPanelContent = () => {
    switch (activePanel) {
      case "suspects":
        return (
          <GameCard title="🧑‍💼 اختر من تريد استجوابه" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              {suspects.map((suspect, index) => {
                const wasInterrogated = interrogatedSuspects.includes(suspect.id);
                return (
                  <motion.div
                    key={suspect.id}
                    className={`
                      p-6 rounded-xl border-2 text-center transition-all cursor-pointer
                      ${wasInterrogated 
                        ? "bg-muted/30 border-muted" 
                        : "bg-card/50 border-border hover:border-primary hover:bg-primary/10"
                      }
                    `}
                    onClick={() => handleSelectSuspect(suspect)}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.15, type: "spring", damping: 15 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatedCharacter
                      characterId={suspect.id}
                      size="lg"
                      isActive={!wasInterrogated}
                      mood={suspect.id === "karim" ? "nervous" : "neutral"}
                      entrance="bounce"
                    />
                    {wasInterrogated && (
                      <motion.span
                        className="inline-block mt-3 px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        تم الاستجواب ✓
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </GameCard>
        );

      case "accuse":
        return (
          <GameCard title="⚖️ اتخذ قرارك النهائي" className="w-full">
            <div className="space-y-6 p-4">
              <motion.div
                className="p-4 rounded-lg bg-amber-900/20 border border-amber-500/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-amber-200">
                  ⚠️ تحذير: هذا قرار نهائي! تأكد من أنك جمعت كل الأدلة واستجوبت المشتبهين.
                </p>
              </motion.div>

              <h4 className="font-bold text-lg">من هو المختلس برأيك؟</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suspects.map((suspect, index) => (
                  <motion.button
                    key={suspect.id}
                    className="p-6 rounded-xl bg-red-900/20 border-2 border-red-500/50 hover:bg-red-900/40 hover:border-red-500 transition-all"
                    onClick={() => handleAccuse(suspect.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatedCharacter
                      characterId={suspect.id}
                      size="md"
                      showName
                      mood={suspect.id === "karim" ? "nervous" : "neutral"}
                    />
                    <motion.p
                      className="mt-4 text-red-400 font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⚖️ اتهم!
                    </motion.p>
                  </motion.button>
                ))}
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
        backgroundImage={interrogationRoom}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activePanel}
        overlayContent={activePanel ? renderPanelContent() : undefined}
        onCloseOverlay={() => setActivePanel(null)}
      >
        {/* Back button */}
        <motion.button
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          onClick={() => onNavigate("office")}
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
          <h2 className="text-xl font-bold text-primary">🧑‍💼 غرفة الاستجواب</h2>
        </motion.div>

        {/* Instructions */}
        {!activePanel && !showDialogue && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-3 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary">
              👥 انقر على المنطقة اليسرى لاختيار مشتبه • ⚖️ انقر على الطاولة لاتخاذ قرار
            </p>
          </motion.div>
        )}

        {/* Interrogation progress */}
        <motion.div
          className="absolute bottom-4 right-4 z-20 px-4 py-2 rounded-lg bg-purple-500/20 backdrop-blur-sm border border-purple-500/50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-purple-400 font-bold text-sm">
            الاستجوابات: {interrogatedSuspects.length} / {suspects.length}
          </p>
        </motion.div>
      </InteractiveRoom>

      {/* Enhanced Dialogue System */}
      {selectedSuspect && (
        <EnhancedDialogue
          dialogues={selectedSuspect.dialogues}
          isActive={showDialogue}
          onComplete={handleDialogueComplete}
        />
      )}

      {/* Result Scene */}
      <SceneTransition
        isVisible={showResult}
        type={isCorrectAccusation ? "success" : "failure"}
        backgroundImage={isCorrectAccusation ? suspectArrested : suspectEscaped}
        title={isCorrectAccusation ? "القضية محلولة!" : "المجرم هرب!"}
        subtitle={
          isCorrectAccusation
            ? "أحسنت! لقد كشفت المختلس. كريم كان يزوّر فواتير المشتريات."
            : "للأسف اتهمت الشخص الخطأ. المختلس الحقيقي (كريم) استغل الفرصة وهرب!"
        }
      >
        <motion.button
          className={`
            px-8 py-4 rounded-xl font-bold text-lg
            ${isCorrectAccusation ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}
          `}
          onClick={() => {
            setShowResult(false);
            setAccusedSuspect(null);
            if (isCorrectAccusation) {
              onNavigate("intro");
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCorrectAccusation ? "🎉 العودة للقائمة الرئيسية" : "🔄 حاول مرة أخرى"}
        </motion.button>
      </SceneTransition>
    </>
  );
};
