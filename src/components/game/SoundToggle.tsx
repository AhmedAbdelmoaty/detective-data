import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSoundEffects";

export const SoundToggle = () => {
  const { isSoundEnabled, setIsSoundEnabled, playSound } = useSound();

  const handleToggle = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    if (newState) {
      // Play a sound to confirm it's on
      setTimeout(() => playSound("click"), 100);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30 flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.2)" }}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-5 h-5 text-primary" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      )}
    </motion.button>
  );
};
