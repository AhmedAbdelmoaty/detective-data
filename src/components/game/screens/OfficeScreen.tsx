import { useState } from "react";
import { FileText, BarChart3, Users, Lightbulb, Clock, Target } from "lucide-react";
import { GameCard } from "../GameCard";
import { ProgressBar } from "../ProgressBar";
import { NavigationButton } from "../NavigationButton";
import { ChatBubble } from "../ChatBubble";

interface OfficeScreenProps {
  onNavigate: (screen: string) => void;
}

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175,80%,50%,0.03)_0%,_transparent_50%)]" />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-8 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-2xl">🕵️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Detective's Office</h1>
            <p className="text-sm text-muted-foreground">مكتب المحقق</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Day 1</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono">Rank: Rookie</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-6">
        {/* Left Column - Case Board */}
        <div className="col-span-8 space-y-6">
          {/* Welcome Message */}
          {showWelcome && (
            <div className="animate-slide-up">
              <ChatBubble
                message="أهلاً بك في أول قضية لك! شركة صغيرة بتشتكي إن فيه فلوس بتختفي كل شهر. 3 موظفين تحت الشبهة. مهمتك تحلل البيانات وتكتشف المختلس."
                sender="Chief Detective"
                senderEmoji="👨‍✈️"
                color="gold"
                isTyping
              />
            </div>
          )}

          {/* Case Board */}
          <GameCard
            title="Case Board"
            iconEmoji="📋"
            variant="glass"
            className="animate-slide-up"
            style={{ animationDelay: "0.1s" } as React.CSSProperties}
          >
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Case Info */}
              <div className="col-span-2 p-4 rounded-lg bg-background/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded bg-destructive/20 text-destructive text-xs font-mono">
                    ACTIVE
                  </span>
                  <span className="text-xs text-muted-foreground">Case #001</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2" dir="rtl">
                  🔴 الأموال المفقودة
                </h3>
                <p className="text-sm text-muted-foreground" dir="rtl">
                  شركة "نكسورا" للتقنية اكتشفت اختفاء مبالغ من حساباتها. التحويلات تبدو طبيعية لكن الأرقام مش راكبة.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Evidence Found</p>
                  <p className="text-2xl font-bold text-primary">0/5</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Suspects</p>
                  <p className="text-2xl font-bold text-accent">3</p>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                Current Objectives
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded border border-border flex items-center justify-center text-xs">
                    ○
                  </span>
                  <span className="text-muted-foreground">Review financial records in Evidence Room</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded border border-border flex items-center justify-center text-xs">
                    ○
                  </span>
                  <span className="text-muted-foreground">Analyze transaction patterns</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded border border-border flex items-center justify-center text-xs">
                    ○
                  </span>
                  <span className="text-muted-foreground">Interview all suspects</span>
                </li>
              </ul>
            </div>
          </GameCard>

          {/* Progress */}
          <GameCard
            title="Investigation Progress"
            iconEmoji="📊"
            variant="glass"
            className="animate-slide-up"
            style={{ animationDelay: "0.2s" } as React.CSSProperties}
          >
            <div className="space-y-4 mt-4">
              <ProgressBar
                label="Evidence Collection"
                value={0}
                max={100}
                showValue
                color="primary"
              />
              <ProgressBar
                label="Data Analysis"
                value={0}
                max={100}
                showValue
                color="accent"
              />
              <ProgressBar
                label="Suspect Interviews"
                value={0}
                max={100}
                showValue
                color="success"
              />
            </div>
          </GameCard>
        </div>

        {/* Right Column - Navigation & Notebook */}
        <div className="col-span-4 space-y-6">
          {/* Room Navigation */}
          <GameCard
            title="Navigate"
            variant="glass"
            className="animate-slide-up"
            style={{ animationDelay: "0.3s" } as React.CSSProperties}
          >
            <div className="grid grid-cols-2 gap-3 mt-4">
              <NavigationButton
                label="Evidence Room"
                iconEmoji="📁"
                onClick={() => onNavigate("evidence")}
              />
              <NavigationButton
                label="Analysis Lab"
                iconEmoji="📊"
                onClick={() => onNavigate("analysis")}
              />
              <NavigationButton
                label="Interrogation"
                iconEmoji="👥"
                onClick={() => onNavigate("interrogation")}
              />
              <NavigationButton
                label="Make Accusation"
                iconEmoji="⚖️"
                disabled
              />
            </div>
          </GameCard>

          {/* Notebook */}
          <GameCard
            title="Detective's Notebook"
            iconEmoji="📓"
            variant="outlined"
            color="accent"
            className="animate-slide-up"
            style={{ animationDelay: "0.4s" } as React.CSSProperties}
          >
            <div className="mt-4 space-y-3">
              <p className="text-sm text-muted-foreground italic" dir="rtl">
                لسه ما اكتشفت أي ملاحظات...
              </p>
              <p className="text-xs text-muted-foreground">
                Notes will appear here as you find clues.
              </p>
            </div>
          </GameCard>

          {/* Hint */}
          <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-primary flex items-center gap-2">
              <span>💡</span>
              <span>Tip: Start by reviewing evidence in the Evidence Room</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
