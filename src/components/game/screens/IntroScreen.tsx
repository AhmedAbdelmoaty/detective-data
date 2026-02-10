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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Title + character in a glass box */}
        <motion.div
          className="flex flex-col items-center px-8 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 drop-shadow-lg">
            Data Analyst
          </h1>
          <h2 className="text-base md:text-lg text-amber-400 font-bold mb-1">محلل البيانات</h2>
          <p className="text-white/70 text-xs mb-3">اكتشف القصة ورا البيانات</p>

          {/* Hero character - small & circular */}
          <motion.img
            src={introCharImg}
            alt="Data Analyst"
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 12 }}
          />
        </motion.div>

        {/* Start button */}
        <motion.button
          className="relative px-8 py-3 rounded-xl text-base font-bold overflow-hidden group mb-4"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          onClick={handleStart}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center gap-2 text-white">🚀 ابدأ المهمة</span>
        </motion.button>

        {/* Case info card - centered */}
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
            <h3 className="text-amber-400 font-bold text-sm mb-1">📁 {CASE_INFO.title}</h3>
            <p className="text-xs text-white/70 mb-3">{CASE_INFO.description}</p>
            <div className="flex justify-center gap-3">
              {gameCharacters.map((char, i) => (
                <motion.div
                  key={char.id}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <AnimatedCharacter characterId={char.avatarCharacterId} size="sm" showName={false} />
                  <p className="text-xs text-white/70 mt-0.5">{char.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
