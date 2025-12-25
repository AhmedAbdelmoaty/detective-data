import { useState } from "react";
import { Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(175_80%_50%_/_0.05)_0%,_transparent_70%)]" />
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-float opacity-50" />
      <div className="absolute top-40 right-32 w-3 h-3 bg-accent rounded-full animate-float opacity-30" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-40 w-2 h-2 bg-primary rounded-full animate-float opacity-40" style={{ animationDelay: "2s" }} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in">
        {/* Logo Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/50 flex items-center justify-center glow-primary">
            <Search className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-accent-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 tracking-tight">
          Data <span className="text-primary text-glow">Detective</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-accent mb-2 font-display" dir="rtl">
          وكالة التحقيق بالبيانات
        </p>
        
        {/* Tagline */}
        <p className="text-muted-foreground text-lg mb-12 max-w-md">
          Solve mysteries with data. Think like an analyst.
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative px-12 py-4 rounded-xl font-semibold text-lg",
            "bg-primary text-primary-foreground",
            "border-2 border-primary",
            "transition-all duration-300",
            "hover:shadow-[0_0_30px_hsl(175_80%_50%_/_0.4)]",
            "hover:scale-105",
            "active:scale-95",
            isHovered && "shadow-[0_0_30px_hsl(175_80%_50%_/_0.4)]"
          )}
        >
          <span className="relative z-10 flex items-center gap-3">
            🔍 Start Investigation
          </span>
        </button>

        {/* Case Preview */}
        <div className="mt-16 glass rounded-xl p-6 max-w-lg animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📁</span>
            <div>
              <p className="text-xs text-primary font-mono">CASE #001</p>
              <h3 className="text-foreground font-semibold">الأموال المفقودة</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground" dir="rtl">
            شركة صغيرة اكتشفت اختفاء أموال من حساباتها. مهمتك: اكتشف المختلس باستخدام البيانات.
          </p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">👥 3 Suspects</span>
            <span className="text-xs text-muted-foreground">📊 5 Evidence Files</span>
            <span className="text-xs text-muted-foreground">⏱️ ~15 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
