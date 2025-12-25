import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { GameCard } from "../GameCard";
import { CharacterAvatar } from "../CharacterAvatar";
import { ChatBubble } from "../ChatBubble";
import { cn } from "@/lib/utils";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

const suspects = [
  {
    id: 1,
    name: "أحمد",
    nameEn: "Ahmed",
    role: "المدير المالي",
    roleEn: "CFO",
    emoji: "👨‍💼",
    color: "cyan" as const,
    dialogue: [
      "أنا مسؤول عن التوقيعات فقط، لكن مش أنا اللي بأعمل التحويلات.",
      "كل حاجة موثقة عندي. ممكن تراجع السجلات.",
      "لو فيه تلاعب، أكيد حد تاني عمله.",
    ],
    suspicious: false,
  },
  {
    id: 2,
    name: "سارة",
    nameEn: "Sara",
    role: "محاسبة",
    roleEn: "Accountant",
    emoji: "👩‍💻",
    color: "purple" as const,
    dialogue: [
      "أنا بشتغل ساعات إضافية عشان الشغل كتير، مش عشان حاجة تانية!",
      "أنا اللي اكتشفت إن الأرقام مش راكبة من الأول.",
      "شوف سجلات المشتريات... فيها حاجات غريبة.",
    ],
    suspicious: false,
  },
  {
    id: 3,
    name: "كريم",
    nameEn: "Karim",
    role: "مسؤول المشتريات",
    roleEn: "Procurement",
    emoji: "👨‍🔧",
    color: "gold" as const,
    dialogue: [
      "المشتريات كلها موثقة... تقريباً.",
      "في شهر مارس كان فيه طلبات كتير مستعجلة.",
      "أنا... أنا مش فاكر التفاصيل دلوقتي.",
    ],
    suspicious: true,
  },
];

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [accusation, setAccusation] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentSuspect = suspects.find(s => s.id === selectedSuspect);

  const handleNextDialogue = () => {
    if (currentSuspect && dialogueIndex < currentSuspect.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    }
  };

  const handleAccuse = (suspectId: number) => {
    setAccusation(suspectId);
    setShowResult(true);
  };

  const isCorrect = accusation === 3; // Karim is the culprit

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(270,80%,60%,0.03)_0%,_transparent_50%)]" />

      {/* Result Overlay */}
      {showResult && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className={cn(
            "max-w-md p-8 rounded-2xl border-2 text-center animate-scale-in",
            isCorrect 
              ? "bg-success/10 border-success/50" 
              : "bg-destructive/10 border-destructive/50"
          )}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-success mb-2">Case Solved!</h2>
                <p className="text-foreground mb-4" dir="rtl">
                  أحسنت! كريم هو المختلس. تم اكتشاف تلاعبه في سجلات المشتريات.
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  You correctly identified the embezzler based on the evidence.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="px-4 py-2 rounded-lg bg-accent/20 text-accent font-mono">
                    +100 XP
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-mono">
                    Rank: Junior Detective
                  </span>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-destructive mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-destructive mb-2">Wrong Accusation</h2>
                <p className="text-foreground mb-4" dir="rtl">
                  للأسف اتهمت الشخص الغلط. راجع الأدلة تاني.
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  Hint: Look at who had direct access to purchase records in March.
                </p>
              </>
            )}
            <button
              onClick={() => {
                setShowResult(false);
                setAccusation(null);
                if (!isCorrect) {
                  setSelectedSuspect(null);
                  setDialogueIndex(0);
                }
              }}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all",
                isCorrect
                  ? "bg-success text-success-foreground hover:shadow-[0_0_20px_hsl(145,70%,45%,0.3)]"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {isCorrect ? "Continue to Next Case →" : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 mb-8 animate-slide-up">
        <button
          onClick={() => onNavigate("office")}
          className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">👥</span>
            Interrogation Room
          </h1>
          <p className="text-sm text-muted-foreground">غرفة الاستجواب - Question the suspects</p>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-6">
        {/* Suspects Grid */}
        <div className="col-span-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <GameCard title="Suspects" variant="glass">
            <div className="mt-4 space-y-4">
              {suspects.map((suspect) => (
                <div
                  key={suspect.id}
                  onClick={() => {
                    setSelectedSuspect(suspect.id);
                    setDialogueIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer",
                    selectedSuspect === suspect.id
                      ? "bg-primary/10 border-primary/50"
                      : "bg-background/50 border-border hover:border-primary/30"
                  )}
                >
                  <CharacterAvatar
                    name={suspect.name}
                    role={suspect.roleEn}
                    emoji={suspect.emoji}
                    color={suspect.color}
                    size="sm"
                    isActive={selectedSuspect === suspect.id}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">{suspect.nameEn}</p>
                    <p className="text-xs text-muted-foreground">{suspect.role}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccuse(suspect.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                  >
                    Accuse
                  </button>
                </div>
              ))}
            </div>
          </GameCard>
        </div>

        {/* Dialogue Area */}
        <div className="col-span-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <GameCard title="Interview" variant="glass" className="min-h-[500px]">
            {selectedSuspect && currentSuspect ? (
              <div className="mt-4">
                {/* Character Display */}
                <div className="flex justify-center mb-8">
                  <CharacterAvatar
                    name={currentSuspect.name}
                    role={currentSuspect.roleEn}
                    emoji={currentSuspect.emoji}
                    color={currentSuspect.color}
                    size="lg"
                    isActive
                  />
                </div>

                {/* Dialogue */}
                <div className="space-y-4">
                  {currentSuspect.dialogue.slice(0, dialogueIndex + 1).map((text, i) => (
                    <ChatBubble
                      key={i}
                      message={text}
                      sender={currentSuspect.nameEn}
                      senderEmoji={currentSuspect.emoji}
                      color={currentSuspect.color === "cyan" ? "cyan" : currentSuspect.color === "purple" ? "purple" : "gold"}
                      delay={i === dialogueIndex ? 200 : 0}
                      isTyping={i === dialogueIndex}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={handleNextDialogue}
                    disabled={dialogueIndex >= currentSuspect.dialogue.length - 1}
                    className={cn(
                      "px-6 py-3 rounded-lg font-medium transition-all",
                      dialogueIndex < currentSuspect.dialogue.length - 1
                        ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(175,80%,50%,0.3)]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {dialogueIndex < currentSuspect.dialogue.length - 1 ? "Continue →" : "End of Interview"}
                  </button>

                  {dialogueIndex >= currentSuspect.dialogue.length - 1 && (
                    <button
                      onClick={() => handleAccuse(currentSuspect.id)}
                      className="px-6 py-3 rounded-lg bg-destructive text-destructive-foreground font-medium hover:shadow-[0_0_20px_hsl(0,70%,50%,0.3)] transition-all animate-pulse"
                    >
                      ⚖️ Accuse {currentSuspect.nameEn}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-12 text-center">
                <span className="text-6xl mb-6 block">🕵️</span>
                <h3 className="text-xl font-bold text-foreground mb-2">Select a Suspect</h3>
                <p className="text-muted-foreground" dir="rtl">
                  اختر أحد المشتبهين للاستجواب
                </p>
              </div>
            )}
          </GameCard>
        </div>
      </div>
    </div>
  );
};
