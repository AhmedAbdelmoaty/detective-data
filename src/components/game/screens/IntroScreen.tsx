import { motion } from "framer-motion";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { CASE_INFO, CHARACTERS } from "@/data/case1";

interface IntroScreenProps {
  onStart?: () => void;
  onNavigate?: (screen: string) => void;
}

export const IntroScreen = ({ onStart, onNavigate }: IntroScreenProps) => {
  const handleStart = () => {
    if (onNavigate) onNavigate("onboarding");
    else if (onStart) onStart();
  };

  const gameCharacters = CHARACTERS.filter(c => c.id !== "abuSaeed");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div className="text-center mb-8" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <motion.div className="text-8xl mb-6" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            📊
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--neon-gold)))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Data Analyst
          </h1>
          <h2 className="text-2xl md:text-3xl text-accent font-bold mb-2">محلل البيانات</h2>
          <p className="text-muted-foreground text-lg">اكتشف القصة ورا الأرقام</p>
        </motion.div>

        <motion.div className="relative mb-8" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", damping: 10 }}>
          <AnimatedCharacter characterId="detective" size="xl" isActive mood="happy" showName={false} entrance="bounce" />
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30" style={{ background: "radial-gradient(circle, hsl(var(--neon-gold)), transparent)" }} />
        </motion.div>

        <motion.button className="relative px-12 py-5 rounded-xl text-xl font-bold overflow-hidden group"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          onClick={handleStart} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center gap-3">🚀 ابدأ المهمة</span>
        </motion.button>

        <motion.div className="mt-12 max-w-lg text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/30">
            <h3 className="text-primary font-bold mb-2">📁 {CASE_INFO.title}</h3>
            <p className="text-sm text-muted-foreground">{CASE_INFO.description}</p>
            <div className="flex justify-center gap-4 mt-4">
              {gameCharacters.map((char, i) => (
                <motion.div key={char.id} className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 + i * 0.15 }}>
                  <AnimatedCharacter characterId={char.avatarCharacterId} size="sm" showName={false} />
                  <p className="text-xs text-muted-foreground mt-1">{char.name}</p>
                  <p className="text-xs text-muted-foreground/60">{char.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
