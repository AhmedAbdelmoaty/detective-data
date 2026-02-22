import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layout, HelpCircle, GitBranch, Target, ChevronLeft } from "lucide-react";
import { useQF } from "../context/QFContext";

const tabs = [
  { id: "context" as const, label: "السياق", icon: Layout },
  { id: "unknowns" as const, label: "ما نحتاجه", icon: HelpCircle },
  { id: "structure" as const, label: "هيكل المشكلة", icon: GitBranch },
  { id: "decision" as const, label: "المخرج/القرار", icon: Target },
];

const structureLabels: Record<string, string> = {
  visits: "🚶 الزيارات",
  conversion: "🛒 التحويل",
  basket: "🧾 متوسط السلة",
  availability: "📦 التوافر/المقاسات",
};

export const FramingBoard = () => {
  const { state, dispatch } = useQF();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"context" | "unknowns" | "structure" | "decision">("context");

  // Glow effect
  useEffect(() => {
    if (state.boardGlow) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_GLOW" }), 1500);
      return () => clearTimeout(t);
    }
  }, [state.boardGlow, dispatch]);

  const board = state.board;
  const totalItems = board.context.length + board.unknowns.length + board.decision.length +
    board.structure.visits.length + board.structure.conversion.length +
    board.structure.basket.length + board.structure.availability.length;

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed left-4 top-16 z-30 flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md transition-all
          ${state.boardGlow ? "border-primary glow-primary bg-primary/20" : "border-border/50 bg-card/80 hover:border-primary/50"}`}
        animate={state.boardGlow ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-foreground">لوحة التأطير</span>
        {totalItems > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[340px] max-w-[85vw] z-50 glass border-r border-border/50 flex flex-col"
              initial={{ x: -340 }}
              animate={{ x: 0 }}
              exit={{ x: -340 }}
              transition={{ type: "spring", damping: 25 }}
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h3 className="font-bold text-foreground">📋 لوحة التأطير</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/30 px-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                  {activeTab === "context" && (
                    <BoardList key="context" items={board.context} emptyText="لسه ما جمعناش سياق" />
                  )}
                  {activeTab === "unknowns" && (
                    <BoardList key="unknowns" items={board.unknowns} emptyText="لسه ما حددنا أسئلة" />
                  )}
                  {activeTab === "structure" && (
                    <motion.div key="structure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {(["visits", "conversion", "basket", "availability"] as const).map((branch) => (
                        <div key={branch} className="mb-4">
                          <h4 className="text-sm font-bold text-foreground mb-2">{structureLabels[branch]}</h4>
                          {board.structure[branch].length > 0 ? (
                            board.structure[branch].map((item, i) => (
                              <motion.div
                                key={i}
                                className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2.5 mb-1.5 border border-border/30"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                {item}
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground/50 italic">—</p>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === "decision" && (
                    <BoardList key="decision" items={board.decision} emptyText="لسه ما حددنا قرارات" />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const BoardList = ({ items, emptyText }: { items: string[]; emptyText: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {items.length > 0 ? (
      items.map((item, i) => (
        <motion.div
          key={i}
          className="text-sm text-foreground bg-secondary/50 rounded-lg p-3 mb-2 border border-border/30"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {item}
        </motion.div>
      ))
    ) : (
      <p className="text-sm text-muted-foreground/50 italic text-center mt-8">{emptyText}</p>
    )}
  </motion.div>
);
