import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface SceneTransitionProps {
  isVisible: boolean;
  type: "success" | "failure" | "intro";
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onComplete?: () => void;
}

export const SceneTransition = ({
  isVisible,
  type,
  backgroundImage,
  title,
  subtitle,
  children,
  onComplete,
}: SceneTransitionProps) => {
  const colorSchemes = {
    success: {
      gradient: "from-emerald-900/90 via-emerald-800/80 to-black/90",
      textColor: "text-emerald-400",
      glowColor: "shadow-emerald-500/50",
    },
    failure: {
      gradient: "from-red-900/90 via-red-800/80 to-black/90",
      textColor: "text-red-400",
      glowColor: "shadow-red-500/50",
    },
    intro: {
      gradient: "from-primary/20 via-background/80 to-black/90",
      textColor: "text-primary",
      glowColor: "shadow-primary/50",
    },
  };

  const scheme = colorSchemes[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Image */}
          {backgroundImage && (
            <motion.img
              src={backgroundImage}
              alt="Scene"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}

          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${scheme.gradient}`} />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* Title */}
            <motion.h1
              className={`text-5xl md:text-7xl font-bold ${scheme.textColor} mb-4`}
              style={{
                textShadow: `0 0 40px currentColor, 0 0 80px currentColor`,
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 10 }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                className="text-xl md:text-2xl text-foreground/80 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Children (buttons, etc.) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {children}
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          {type === "success" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Confetti-like particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                  }}
                  animate={{
                    y: ["0vh", "110vh"],
                    rotate: [0, 360],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </motion.div>
          )}

          {type === "failure" && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                backgroundColor: ["rgba(239,68,68,0)", "rgba(239,68,68,0.1)", "rgba(239,68,68,0)"],
              }}
              transition={{
                duration: 1,
                repeat: 3,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
