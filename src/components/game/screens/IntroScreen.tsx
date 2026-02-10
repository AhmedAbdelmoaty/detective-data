import { motion } from "framer-motion";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { CASE_INFO, CHARACTERS } from "@/data/case1";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface IntroScreenProps {
  onStart?: () => void;
  onNavigate?: (screen: string) => void;
}

export const IntroScreen = ({ onStart, onNavigate }: IntroScreenProps) => {
  const handleStart = () => {
    if (onNavigate) onNavigate("onboarding");
    else if (onStart) onStart();
  };

  const gameCharacters = CHARACTERS.filter((c) => c.id !== "abuSaeed");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Store front background */}
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
      </div>


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            📊
          </motion.div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--neon-gold)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Data Analyst
          </h1>
          <h2 className="text-2xl md:text-3xl text-accent font-bold mb-2">محلل البيانات</h2>
          <p className="text-muted-foreground text-lg">اكتشف القصة ورا البيانات</p>
        </motion.div>


        <motion.button
          className="relative px-12 py-5 rounded-xl text-xl font-bold overflow-hidden group"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          onClick={handleStart}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center gap-3">🚀 ابدأ المهمة</span>
        </motion.button>

        <motion.div
          className="mt-12 max-w-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/30">
            <h3 className="text-primary font-bold mb-2">📁 {CASE_INFO.title}</h3>
            <p className="text-sm text-muted-foreground">{CASE_INFO.description}</p>
            <div className="flex justify-center gap-4 mt-4">
              {gameCharacters.map((char, i) => (
                <motion.div
                  key={char.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.15 }}
                >
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
