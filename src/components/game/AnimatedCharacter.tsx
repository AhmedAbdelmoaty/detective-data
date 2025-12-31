import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import character images
import ahmedImg from "@/assets/characters/ahmed.png";
import saraImg from "@/assets/characters/sara.png";
import karimImg from "@/assets/characters/karim.png";
import detectiveImg from "@/assets/characters/detective.png";

interface AnimatedCharacterProps {
  characterId: "ahmed" | "sara" | "karim" | "detective" | "cfo" | "salesManager";
  size?: "sm" | "md" | "lg" | "xl";
  isActive?: boolean;
  isSpeaking?: boolean;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  showName?: boolean;
  onClick?: () => void;
  entrance?: "slide-left" | "slide-right" | "fade" | "zoom" | "bounce";
  className?: string;
}

const characterData = {
  ahmed: {
    name: "أحمد",
    nameEn: "Ahmed",
    role: "المدير المالي",
    roleEn: "CFO",
    image: ahmedImg,
    color: "cyan",
  },
  sara: {
    name: "سارة",
    nameEn: "Sara",
    role: "محاسبة",
    roleEn: "Accountant",
    image: saraImg,
    color: "purple",
  },
  karim: {
    name: "كريم",
    nameEn: "Karim",
    role: "مسؤول المشتريات",
    roleEn: "Procurement",
    image: karimImg,
    color: "red",
  },
  detective: {
    name: "المحقق",
    nameEn: "Detective",
    role: "أنت",
    roleEn: "You",
    image: detectiveImg,
    color: "gold",
  },
  cfo: {
    name: "م. طارق",
    nameEn: "CFO Tarek",
    role: "المدير المالي",
    roleEn: "CFO",
    image: ahmedImg, // Using ahmed image temporarily
    color: "blue",
  },
  salesManager: {
    name: "أ. سامي",
    nameEn: "Sales Manager",
    role: "مدير المبيعات",
    roleEn: "Sales Manager",
    image: karimImg, // Using karim image temporarily
    color: "green",
  },
};

const sizeClasses = {
  sm: { container: "w-16 h-16", image: "w-14 h-14" },
  md: { container: "w-24 h-24", image: "w-22 h-22" },
  lg: { container: "w-32 h-32", image: "w-28 h-28" },
  xl: { container: "w-48 h-48", image: "w-44 h-44" },
};

const colorClasses = {
  cyan: {
    border: "border-cyan-500",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.5)]",
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
  },
  purple: {
    border: "border-purple-500",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
    bg: "bg-purple-500/20",
    text: "text-purple-400",
  },
  red: {
    border: "border-red-500",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.5)]",
    bg: "bg-red-500/20",
    text: "text-red-400",
  },
  gold: {
    border: "border-amber-500",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.5)]",
    bg: "bg-amber-500/20",
    text: "text-amber-400",
  },
  blue: {
    border: "border-blue-500",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.5)]",
    bg: "bg-blue-500/20",
    text: "text-blue-400",
  },
  green: {
    border: "border-green-500",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.5)]",
    bg: "bg-green-500/20",
    text: "text-green-400",
  },
};

const entranceVariants = {
  "slide-left": {
    initial: { x: -100, opacity: 0, scale: 0.8 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -100, opacity: 0, scale: 0.8 },
  },
  "slide-right": {
    initial: { x: 100, opacity: 0, scale: 0.8 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 100, opacity: 0, scale: 0.8 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  bounce: {
    initial: { y: -50, opacity: 0, scale: 0.5 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 50, opacity: 0, scale: 0.5 },
  },
};

const moodAnimations = {
  neutral: {},
  happy: {
    y: [0, -5, 0],
    transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
  },
  nervous: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1 },
  },
  angry: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 0.5 },
  },
  suspicious: {
    rotate: [-2, 2, -2],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const AnimatedCharacter = ({
  characterId,
  size = "md",
  isActive = false,
  isSpeaking = false,
  mood = "neutral",
  showName = true,
  onClick,
  entrance = "fade",
  className = "",
}: AnimatedCharacterProps) => {
  const character = characterData[characterId];
  const sizeClass = sizeClasses[size];
  const colors = colorClasses[character.color as keyof typeof colorClasses];
  const entranceAnim = entranceVariants[entrance];

  return (
    <motion.div
      className={`flex flex-col items-center ${onClick ? "cursor-pointer" : ""} ${className}`}
      variants={entranceAnim}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      {/* Character Image Container */}
      <motion.div
        className={`
          relative rounded-full overflow-hidden border-4 
          ${colors.border} ${isActive ? colors.glow : ""}
          ${sizeClass.container}
          transition-all duration-300
        `}
        animate={moodAnimations[mood]}
      >
        {/* Background glow */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 ${colors.bg}`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Character Image */}
        <motion.img
          src={character.image}
          alt={character.nameEn}
          className={`${sizeClass.image} object-cover rounded-full`}
          animate={isSpeaking ? {
            scale: [1, 1.02, 1],
            transition: { duration: 0.3, repeat: Infinity }
          } : {}}
        />

        {/* Speaking indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${colors.bg} ${colors.border} border`}
                  animate={{
                    y: [-3, 3, -3],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active ring animation */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-full border-2 ${colors.border}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Name and Role */}
      {showName && (
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`font-bold ${colors.text}`}>{character.name}</p>
          <p className="text-xs text-muted-foreground">{character.role}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

// Export character data for use elsewhere
export { characterData };
