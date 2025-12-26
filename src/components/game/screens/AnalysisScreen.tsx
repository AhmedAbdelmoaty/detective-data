import { motion } from "framer-motion";
import { Notebook, ArrowLeft } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

interface AnalysisScreenProps {
  onNavigate: (screen: string) => void;
}

export const AnalysisScreen = ({ onNavigate }: AnalysisScreenProps) => {
  const { state, getTrustLevel } = useGame();
  const trustLevel = getTrustLevel();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Notebook className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">دفتر التحقيق</h1>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-full font-bold",
            trustLevel === "high" ? "bg-green-500/20 text-green-400" :
            trustLevel === "medium" ? "bg-amber-500/20 text-amber-400" :
            "bg-destructive/20 text-destructive"
          )}>
            الثقة: {state.trust}%
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4 mb-8">
          {state.investigationNotes.length === 0 ? (
            <div className="p-8 rounded-xl bg-card/30 border border-border text-center">
              <p className="text-muted-foreground">لم يتم تسجيل أي ملاحظات بعد.</p>
              <p className="text-sm text-muted-foreground mt-2">اجمع الأدلة واستجوب المشتبهين لتظهر الملاحظات هنا.</p>
            </div>
          ) : (
            state.investigationNotes.map((note, i) => (
              <motion.div
                key={note.id}
                className={cn(
                  "p-4 rounded-xl border",
                  note.type === "key" ? "bg-primary/10 border-primary/30" :
                  note.type === "clue" ? "bg-accent/10 border-accent/30" :
                  "bg-secondary/30 border-border"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {note.type === "key" ? "🔑" : note.type === "clue" ? "🔍" : "📝"}
                  </span>
                  <div>
                    <p className="text-foreground">{note.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      المصدر: {note.source}
                      {note.suspectId && ` • ${note.suspectId}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
            <p className="text-3xl font-bold text-primary">{state.collectedEvidence.length}</p>
            <p className="text-sm text-muted-foreground">أدلة مجمعة</p>
          </div>
          <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
            <p className="text-3xl font-bold text-accent">{state.totalQuestionsAsked}</p>
            <p className="text-sm text-muted-foreground">أسئلة طُرحت</p>
          </div>
          <div className="p-4 rounded-xl bg-card/30 border border-border text-center">
            <p className="text-3xl font-bold text-gold">{state.score}</p>
            <p className="text-sm text-muted-foreground">النقاط</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
          <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
          <NavigationButton iconEmoji="👥" label="الاستجواب" onClick={() => onNavigate("interrogation")} />
        </div>
      </div>
    </div>
  );
};
