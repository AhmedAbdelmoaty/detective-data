import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Scale, Users, ShieldAlert } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { SceneTransition } from "../SceneTransition";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { NavigationButton } from "../NavigationButton";
import { useSound } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";
import suspectArrested from "@/assets/scenes/suspect-arrested.png";
import suspectEscaped from "@/assets/scenes/suspect-escaped.png";
import ahmedImg from "@/assets/characters/ahmed.png";
import saraImg from "@/assets/characters/sara.png";
import karimImg from "@/assets/characters/karim.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

type SuspectId = "ahmed" | "sara" | "karim";

interface Suspect {
  id: SuspectId;
  name: string;
  role: string;
  image: string;
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
    name: "أحمد",
    role: "المدير المالي",
    image: ahmedImg,
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
    name: "سارة",
    role: "المحاسبة",
    image: saraImg,
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
    name: "كريم",
    role: "مدير المشتريات",
    image: karimImg,
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
  { id: "suspect-1", x: 5, y: 30, width: 20, height: 45, label: "أحمد - المدير المالي", icon: "👔" },
  { id: "suspect-2", x: 40, y: 25, width: 20, height: 50, label: "سارة - المحاسبة", icon: "👩‍💼" },
  { id: "suspect-3", x: 75, y: 30, width: 20, height: 45, label: "كريم - المشتريات", icon: "📦" },
];

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showAccusePanel, setShowAccusePanel] = useState(false);
  const [accusedSuspect, setAccusedSuspect] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [interrogatedSuspects, setInterrogatedSuspects] = useState<string[]>([]);
  const { playSound } = useSound();

  const handleHotspotClick = (id: string) => {
    setActiveHotspot(id);
    playSound("reveal");
    
    const suspectMap: Record<string, Suspect> = {
      "suspect-1": suspects[0],
      "suspect-2": suspects[1],
      "suspect-3": suspects[2],
    };
    
    const suspect = suspectMap[id];
    if (suspect) {
      setSelectedSuspect(suspect);
      setTimeout(() => setShowDialogue(true), 300);
      if (!interrogatedSuspects.includes(suspect.id)) {
        setInterrogatedSuspects([...interrogatedSuspects, suspect.id]);
        playSound("collect");
      }
    }
  };

  const handleDialogueComplete = () => {
    setShowDialogue(false);
    setSelectedSuspect(null);
    setActiveHotspot(null);
  };

  const handleAccuse = (suspectId: string) => {
    playSound("accuse");
    setAccusedSuspect(suspectId);
    setShowAccusePanel(false);
    setTimeout(() => {
      setShowResult(true);
      if (suspectId === "karim") {
        playSound("success");
      } else {
        playSound("error");
      }
    }, 500);
  };

  const isCorrectAccusation = accusedSuspect === "karim";

  return (
    <>
      <InteractiveRoom
        backgroundImage={interrogationRoom}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activeHotspot}
        overlayContent={showAccusePanel ? (
          <motion.div
            className="bg-background/95 backdrop-blur-xl border border-destructive/30 rounded-2xl p-6 max-w-4xl w-full"
            style={{ boxShadow: "0 0 60px hsl(var(--destructive) / 0.3)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
              <motion.div
                className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Scale className="w-7 h-7 text-destructive" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">اتخذ قرارك النهائي</h3>
                <p className="text-sm text-muted-foreground">من هو المختلس برأيك؟</p>
              </div>
            </div>

            {/* Warning */}
            <motion.div
              className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <span>تحذير: هذا قرار نهائي! تأكد من أنك جمعت كل الأدلة.</span>
              </p>
            </motion.div>

            {/* Suspects Grid */}
            <div className="grid grid-cols-3 gap-6">
              {suspects.map((suspect, index) => (
                <motion.button
                  key={suspect.id}
                  onClick={() => handleAccuse(suspect.id)}
                  className="relative group p-4 rounded-xl bg-card/50 border-2 border-destructive/30 hover:border-destructive hover:bg-destructive/10 transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Character Image */}
                  <div className="relative mb-4">
                    <motion.img
                      src={suspect.image}
                      alt={suspect.name}
                      className="w-full h-32 object-contain rounded-lg"
                      whileHover={{ scale: 1.1 }}
                    />
                    {interrogatedSuspects.includes(suspect.id) && (
                      <motion.div
                        className="absolute top-2 right-2 px-2 py-1 rounded bg-primary/80 text-primary-foreground text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        تم الاستجواب ✓
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <h4 className="text-lg font-bold text-foreground">{suspect.name}</h4>
                  <p className="text-sm text-muted-foreground">{suspect.role}</p>
                  
                  {/* Accuse Button */}
                  <motion.div
                    className="mt-4 py-2 rounded-lg bg-destructive/20 text-destructive font-bold text-sm group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚖️ اتهم بالاختلاس
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
        onCloseOverlay={() => setShowAccusePanel(false)}
      >
        {/* Status Bar */}
        <motion.div
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-foreground font-bold">غرفة الاستجواب</span>
            <div className="w-px h-6 bg-border" />
            <span className="text-purple-400 font-mono">
              الاستجوابات: {interrogatedSuspects.length}/{suspects.length}
            </span>
          </div>
        </motion.div>

        {/* Suspects Display (showing who is where) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {suspects.map((suspect, index) => {
            const positions = [
              { left: "12%", bottom: "25%" },
              { left: "45%", bottom: "20%" },
              { left: "78%", bottom: "25%" },
            ];
            const pos = positions[index];
            const wasInterrogated = interrogatedSuspects.includes(suspect.id);
            
            return (
              <motion.div
                key={suspect.id}
                className="absolute pointer-events-auto"
                style={{ left: pos.left, bottom: pos.bottom }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.5 }}
              >
                <motion.div
                  className={cn(
                    "relative cursor-pointer",
                    wasInterrogated && "opacity-70"
                  )}
                  animate={suspect.id === "karim" ? { y: [0, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.img
                    src={suspect.image}
                    alt={suspect.name}
                    className="w-24 h-24 object-contain drop-shadow-2xl"
                    whileHover={{ scale: 1.15 }}
                  />
                  
                  {/* Name Tag */}
                  <motion.div
                    className={cn(
                      "absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                      wasInterrogated 
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-background/90 text-foreground border border-border"
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.8 }}
                  >
                    {suspect.name}
                    {wasInterrogated && " ✓"}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Accuse Button */}
        <AnimatePresence>
          {interrogatedSuspects.length >= 2 && (
            <motion.div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
            >
              <motion.button
                onClick={() => setShowAccusePanel(true)}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-destructive text-destructive-foreground font-bold text-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--destructive) / 0.5)" }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0 0 20px hsl(var(--destructive) / 0.3)", "0 0 40px hsl(var(--destructive) / 0.5)", "0 0 20px hsl(var(--destructive) / 0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scale className="w-6 h-6" />
                اتخذ قرارك النهائي
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <AnimatePresence>
          {!showDialogue && interrogatedSuspects.length < 2 && (
            <motion.div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="px-6 py-3 rounded-xl bg-background/90 backdrop-blur-xl border border-primary/30 text-center">
                <p className="text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>اضغط على أي مشتبه لاستجوابه</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-8 left-8 z-20">
          <NavigationButton
            iconEmoji="🏢"
            label="مكتب المحقق"
            onClick={() => onNavigate("office")}
          />
        </div>
        
        <div className="absolute bottom-8 right-8 z-20">
          <NavigationButton
            iconEmoji="📊"
            label="غرفة التحليل"
            onClick={() => onNavigate("analysis")}
          />
        </div>
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
        title={isCorrectAccusation ? "🎉 القضية محلولة!" : "💨 المجرم هرب!"}
        subtitle={
          isCorrectAccusation
            ? "أحسنت! لقد كشفت المختلس. كريم كان يزوّر فواتير المشتريات."
            : "للأسف اتهمت الشخص الخطأ. المختلس الحقيقي (كريم) استغل الفرصة وهرب!"
        }
      >
        <motion.button
          className={cn(
            "px-8 py-4 rounded-xl font-bold text-lg",
            isCorrectAccusation 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          )}
          onClick={() => {
            setShowResult(false);
            setAccusedSuspect(null);
            if (isCorrectAccusation) {
              onNavigate("intro");
            } else {
              setInterrogatedSuspects([]);
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
