import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSound } from "@/hooks/useSoundEffects";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  icon?: string;
  glowColor?: string;
}

interface InteractiveRoomProps {
  backgroundImage: string;
  hotspots: Hotspot[];
  onHotspotClick: (hotspotId: string) => void;
  activeHotspot: string | null;
  children?: ReactNode;
  overlayContent?: ReactNode;
  onCloseOverlay?: () => void;
}

export const InteractiveRoom = ({
  backgroundImage,
  hotspots,
  onHotspotClick,
  activeHotspot,
  children,
  overlayContent,
  onCloseOverlay,
}: InteractiveRoomProps) => {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const { playSound } = useSound();

  const handleHotspotClick = (hotspotId: string) => {
    playSound("click");
    onHotspotClick(hotspotId);
  };

  const handleHover = (hotspotId: string) => {
    setHoveredHotspot(hotspotId);
    playSound("hover");
  };

  const handleCloseOverlay = () => {
    playSound("click");
    onCloseOverlay?.();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={backgroundImage}
        alt="Room"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <motion.button
          key={hotspot.id}
          className="absolute cursor-pointer group"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          onClick={() => handleHotspotClick(hotspot.id)}
          onMouseEnter={() => handleHover(hotspot.id)}
          onMouseLeave={() => setHoveredHotspot(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Hotspot glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary/50"
            animate={{
              boxShadow:
                hoveredHotspot === hotspot.id
                  ? `0 0 30px 10px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.3)`
                  : `0 0 15px 5px hsl(var(--primary) / 0.2)`,
              borderColor:
                hoveredHotspot === hotspot.id
                  ? "hsl(var(--primary))"
                  : "hsl(var(--primary) / 0.3)",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Pulsing indicator */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/80"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Icon */}
          {hotspot.icon && (
            <motion.span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl z-10"
              animate={{
                y: hoveredHotspot === hotspot.id ? -5 : 0,
              }}
            >
              {hotspot.icon}
            </motion.span>
          )}

          {/* Label tooltip */}
          <AnimatePresence>
            {hoveredHotspot === hotspot.id && (
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/95 border border-primary/50 rounded-lg whitespace-nowrap z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
              >
                <span className="text-primary font-bold text-sm">
                  {hotspot.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}

      {/* Additional children (like navigation buttons) */}
      {children}

      {/* Content Overlay */}
      <AnimatePresence>
        {overlayContent && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseOverlay}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-auto mx-4"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Close button */}
              {onCloseOverlay && (
                <button
                  onClick={handleCloseOverlay}
                  className="absolute -top-2 -right-2 z-20 w-10 h-10 rounded-full bg-destructive/90 flex items-center justify-center text-destructive-foreground hover:bg-destructive transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {overlayContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
