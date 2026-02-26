import { motion } from "framer-motion";
import { useQF } from "../context/QFContext";
import { QF_FRAMINGS } from "../data/qf-tree";

export const QFFramingScreen = () => {
  const { state, chooseFraming } = useQF();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" dir="rtl">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-foreground text-center mb-2">التأطير النهائي</h2>
        <p className="text-muted-foreground text-center mb-4">بناءً على اللي جمعته — إيه السبب الحقيقي؟</p>

        {/* Notes recap */}
        {state.notes.length > 0 && (
          <motion.div
            className="mb-6 p-4 rounded-xl border border-border bg-card/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-bold text-primary mb-2">📓 ملاحظاتك:</p>
            <ul className="space-y-1">
              {state.notes.map((n, i) => (
                <li key={i} className="text-sm text-muted-foreground">• {n}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Framing choices */}
        <div className="space-y-4">
          {QF_FRAMINGS.map((f, i) => (
            <motion.button
              key={f.id}
              onClick={() => chooseFraming(f.id)}
              className="w-full p-5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-right hover:border-accent/50 hover:bg-card/80 transition-all"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <p className="text-foreground leading-relaxed">{f.text}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
