import { motion } from "framer-motion";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { CASE_INFO, CHARACTERS } from "@/data/case1";
import storeFrontImg from "@/assets/scenes/store-front.png";
import introCharImg from "@/assets/scenes/intro-character.png";

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
    <div className="relative h-screen overflow-hidden">
      {/* Store front background */}
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Title section - compact */}
        <motion.div
          className="text-center mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--neon-gold)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
            }}
          >
            Data Analyst
          </h1>
          <h2 className="text-lg md:text-xl text-accent font-bold mb-1">محلل البيانات</h2>
          <p className="text-muted-foreground text-sm">اكتشف القصة ورا البيانات</p>
        </motion.div>

        {/* Hero character image - small & circular */}
        <motion.div
          className="relative mb-4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 12 }}
        >
          <img
            src={introCharImg}
            alt="Data Analyst"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
          />
        </motion.div>

        {/* Start button */}
        <motion.button
          className="relative px-8 py-3 rounded-xl text-base font-bold overflow-hidden group mb-4"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          onClick={handleStart}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center gap-2">🚀 ابدأ المهمة</span>
        </motion.button>

        {/* Case info card - compact */}
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/30">
            <h3 className="text-primary font-bold text-sm mb-1">📁 {CASE_INFO.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{CASE_INFO.description}</p>
            <div className="flex justify-center gap-3">
              {gameCharacters.map((char, i) => (
                <motion.div
                  key={char.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  <AnimatedCharacter characterId={char.avatarCharacterId} size="sm" showName={false} />
                  <p className="text-xs text-muted-foreground mt-0.5">{char.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
