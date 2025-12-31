import { motion } from "framer-motion";
import { AnimatedCharacter } from "../AnimatedCharacter";

interface IntroScreenProps {
  onStart?: () => void;
  onNavigate?: (screen: string) => void;
}

export const IntroScreen = ({ onStart, onNavigate }: IntroScreenProps) => {
  const handleStart = () => {
    if (onNavigate) {
      onNavigate("onboarding");
    } else if (onStart) {
      onStart();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Spotlight effect */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Building icon for real estate */}
          <motion.div
            className="text-8xl mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🏢
          </motion.div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--gold)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 40px hsl(var(--primary) / 0.5)",
            }}
          >
            نواة كابيتال
          </h1>
          <h2 className="text-2xl md:text-3xl text-gold font-bold mb-2">للتطوير العقاري</h2>
          <p className="text-muted-foreground text-lg">محقق البيانات</p>
        </motion.div>

        {/* Data Analyst character */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", damping: 10 }}
        >
          <AnimatedCharacter
            characterId="detective"
            size="xl"
            isActive
            mood="happy"
            showName={false}
            entrance="bounce"
          />
          {/* Glow effect */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle, hsl(var(--gold)), transparent)" }}
          />
        </motion.div>

        {/* Start button */}
        <motion.button
          className="relative px-12 py-5 rounded-xl text-xl font-bold overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
          }}
          onClick={handleStart}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-200%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center gap-3">📊 ابدأ التحقيق</span>
        </motion.button>

        {/* Case teaser */}
        <motion.div
          className="mt-12 max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-primary/30">
            <h3 className="text-primary font-bold mb-2">📁 القضية الجديدة</h3>
            <p className="text-sm text-muted-foreground">
              "هبوط الأرباح المفاجئ" - شركة نواة كابيتال للتطوير العقاري تواجه انخفاضاً في الأرباح رغم استقرار عدد العقود.
              مهمتك: اكتشاف السبب الحقيقي.
            </p>

            {/* Key characters preview */}
            <div className="flex justify-center gap-4 mt-4">
              {(["cfo", "salesManager"] as const).map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.2 }}
                >
                  <AnimatedCharacter
                    characterId={id}
                    size="sm"
                    showName={false}
                    mood="neutral"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="absolute bottom-8 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          تعلم تحليل البيانات بطريقة ممتعة 📊
        </motion.p>
      </div>
    </div>
  );
};
