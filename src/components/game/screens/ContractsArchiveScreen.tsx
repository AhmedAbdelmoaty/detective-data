import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, FileText, Building, User, Calendar, DollarSign } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, SAMPLE_CONTRACTS } from "@/data/newCase";
import { InteractiveRoom } from "../InteractiveRoom";
import evidenceBackground from "@/assets/rooms/evidence-room.png";

interface ContractsArchiveScreenProps {
  onNavigate: (screen: string) => void;
}

export const ContractsArchiveScreen = ({ onNavigate }: ContractsArchiveScreenProps) => {
  const { state, collectEvidence, hasCollectedEvidence, addNote, hasDiscoveredPattern } = useGame();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<typeof SAMPLE_CONTRACTS[0] | null>(null);

  const hotspots = [
    { id: "cabinet", x: 50, y: 50, label: "خزانة العقود", icon: "📁" },
  ];

  const handleHotspotClick = (id: string) => {
    if (id === "cabinet") {
      setActivePanel("contracts");
    }
  };

  const handleViewContract = (contract: typeof SAMPLE_CONTRACTS[0]) => {
    setSelectedContract(contract);
  };

  const handleCollectContracts = () => {
    collectEvidence("sample-contracts");
    addNote("تم جمع: عقود مختارة تحتوي على تفاصيل الأسعار والتعديلات");
  };

  // Check if player has done enough analysis to understand contracts
  const hasAnalyzed = state.hasRequestedDataset && state.patternsDiscovered.length > 0;

  return (
    <div className="relative min-h-screen">
      <InteractiveRoom
        backgroundImage={evidenceBackground}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        roomName="أرشيف العقود"
      >
        {/* Navigation */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <motion.button
            onClick={() => onNavigate("intro")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            الرئيسية
          </motion.button>
        </div>

        {/* Case Info */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-2 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30">
            <p className="text-sm text-primary font-bold">{CASE_INFO.title}</p>
            <p className="text-xs text-muted-foreground">{CASE_INFO.company}</p>
          </div>
        </div>

        {/* Room Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          <motion.button
            onClick={() => onNavigate("cfo-office")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>👔</span>
            مكتب CFO
          </motion.button>
          <motion.button
            onClick={() => onNavigate("my-desk")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🖥️</span>
            مكتبي
          </motion.button>
          <motion.button
            onClick={() => onNavigate("sales")}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border text-foreground"
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📊</span>
            قسم المبيعات
          </motion.button>
        </div>
      </InteractiveRoom>

      {/* Contracts Panel */}
      <AnimatePresence>
        {activePanel === "contracts" && !selectedContract && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card rounded-2xl border border-border p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">أرشيف العقود</h2>
                </div>
                <button onClick={() => setActivePanel(null)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!hasAnalyzed && (
                <div className="p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-amber-200">
                    💡 العقود كثيرة... قد يكون من الأفضل تحليل البيانات أولاً لمعرفة أي العقود تستحق الفحص
                  </p>
                </div>
              )}

              <p className="text-muted-foreground mb-6">
                عقود الصفقات المنتقاة - اضغط لعرض التفاصيل
              </p>

              <div className="space-y-3">
                {SAMPLE_CONTRACTS.map((contract, index) => {
                  const priceDiff = contract.list_price - contract.final_price;
                  const diffPercent = (priceDiff / contract.list_price) * 100;
                  
                  return (
                    <motion.div
                      key={contract.contract_id}
                      className="p-4 rounded-xl bg-background border border-border hover:border-primary/50 cursor-pointer transition-colors"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleViewContract(contract)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{contract.contract_id}</p>
                            <p className="text-sm text-muted-foreground">
                              {contract.project} - {contract.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground">{contract.salesperson}</p>
                          <p className="text-xs text-muted-foreground">{contract.date}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                onClick={handleCollectContracts}
                disabled={hasCollectedEvidence("sample-contracts")}
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-colors ${
                  hasCollectedEvidence("sample-contracts")
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                whileHover={!hasCollectedEvidence("sample-contracts") ? { scale: 1.02 } : {}}
                whileTap={!hasCollectedEvidence("sample-contracts") ? { scale: 0.98 } : {}}
              >
                {hasCollectedEvidence("sample-contracts") ? "✓ تم جمع الدليل" : "جمع العقود المهمة"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Single Contract View */}
        {selectedContract && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedContract(null)}
          >
            <motion.div
              className="w-full max-w-xl bg-card rounded-2xl border border-border p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">📄 {selectedContract.contract_id}</h2>
                <button onClick={() => setSelectedContract(null)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <Building className="w-4 h-4" />
                      المشروع
                    </div>
                    <p className="font-bold text-foreground">{selectedContract.project}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <User className="w-4 h-4" />
                      المندوب
                    </div>
                    <p className="font-bold text-foreground">{selectedContract.salesperson}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    التاريخ والوحدة
                  </div>
                  <p className="font-bold text-foreground">{selectedContract.date}</p>
                  <p className="text-sm text-muted-foreground">{selectedContract.unit}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">السعر القياسي</p>
                    <p className="text-xl font-bold text-foreground">
                      {(selectedContract.list_price / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">السعر النهائي</p>
                    <p className="text-xl font-bold text-foreground">
                      {(selectedContract.final_price / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-sm text-muted-foreground mb-2">شروط التعاقد</p>
                  <p className="text-foreground">{selectedContract.terms}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    خطة الدفع: {selectedContract.payment_plan}
                  </p>
                  {selectedContract.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      ملاحظات: {selectedContract.notes}
                    </p>
                  )}
                </div>
              </div>

              <motion.button
                onClick={() => setSelectedContract(null)}
                className="w-full mt-6 py-3 rounded-xl bg-secondary text-foreground font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                رجوع للقائمة
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
