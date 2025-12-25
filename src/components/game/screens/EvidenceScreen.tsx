import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Mail, FileText, Download, X, FolderOpen, Archive, Lock } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { NavigationButton } from "../NavigationButton";
import { cn } from "@/lib/utils";
import evidenceRoomBg from "@/assets/rooms/evidence-room.png";

interface EvidenceScreenProps {
  onNavigate: (screen: string) => void;
}

const evidenceFiles = [
  {
    id: 1,
    name: "كشف الحساب البنكي",
    nameEn: "Bank Statement",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    status: "new",
    description: "3 months of company transactions",
    preview: [
      { date: "2024-01-15", desc: "Office Supplies", amount: -2500 },
      { date: "2024-01-18", desc: "Client Payment", amount: 15000 },
      { date: "2024-01-20", desc: "Misc. Expense", amount: -8750, suspicious: true },
    ],
  },
  {
    id: 2,
    name: "سجل المشتريات",
    nameEn: "Purchase Log",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    status: "new",
    description: "All purchases made this quarter",
    preview: [
      { date: "2024-02-01", desc: "Equipment", amount: -12000 },
      { date: "2024-02-05", desc: "Contractor Fee", amount: -25000, suspicious: true },
      { date: "2024-02-10", desc: "Software License", amount: -3500 },
    ],
  },
  {
    id: 3,
    name: "إيميلات المدير المالي",
    nameEn: "CFO Emails",
    type: "email",
    icon: Mail,
    status: "new",
    description: "Internal communications",
    preview: [
      { date: "2024-01-25", desc: "RE: Urgent Transfer", amount: 0 },
      { date: "2024-02-02", desc: "FWD: Payment Request", amount: 0, suspicious: true },
    ],
  },
  {
    id: 4,
    name: "تقرير المراجعة",
    nameEn: "Audit Report",
    type: "document",
    icon: FileText,
    status: "locked",
    description: "Requires 2 evidence pieces",
    preview: [],
  },
  {
    id: 5,
    name: "سجلات الدخول",
    nameEn: "Access Logs",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    status: "locked",
    description: "System access records",
    preview: [],
  },
];

const hotspots = [
  { id: "cabinet-1", x: 10, y: 30, width: 18, height: 35, label: "📁 ملفات البنك", icon: "🏦" },
  { id: "cabinet-2", x: 32, y: 25, width: 18, height: 40, label: "📊 سجلات المشتريات", icon: "📊" },
  { id: "desk", x: 55, y: 45, width: 22, height: 30, label: "📧 الإيميلات", icon: "💻" },
  { id: "safe", x: 80, y: 35, width: 15, height: 25, label: "🔒 الخزنة", icon: "🔐" },
];

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [collectedEvidence, setCollectedEvidence] = useState<number[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCollect = (id: number) => {
    if (!collectedEvidence.includes(id)) {
      setCollectedEvidence([...collectedEvidence, id]);
    }
  };

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(hotspotId);
    setShowOverlay(true);
    
    // Map hotspot to file
    const fileMap: Record<string, number> = {
      "cabinet-1": 1,
      "cabinet-2": 2,
      "desk": 3,
      "safe": 4,
    };
    
    if (fileMap[hotspotId]) {
      setSelectedFile(fileMap[hotspotId]);
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setActiveHotspot(null);
  };

  const currentFile = evidenceFiles.find(f => f.id === selectedFile);
  const isFileLocked = currentFile?.status === "locked";
  const isFileCollected = selectedFile ? collectedEvidence.includes(selectedFile) : false;

  return (
    <InteractiveRoom
      backgroundImage={evidenceRoomBg}
      hotspots={hotspots}
      onHotspotClick={handleHotspotClick}
      activeHotspot={activeHotspot}
      overlayContent={showOverlay && currentFile ? (
        <motion.div
          className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full"
          style={{ boxShadow: "0 0 60px hsl(var(--primary) / 0.2)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center",
                  isFileLocked ? "bg-muted" : "bg-primary/20"
                )}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {isFileLocked ? (
                  <Lock className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <currentFile.icon className="w-8 h-8 text-primary" />
                )}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{currentFile.nameEn}</h3>
                <p className="text-sm text-muted-foreground" dir="rtl">{currentFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{currentFile.description}</p>
              </div>
            </div>
            
            {!isFileLocked && !isFileCollected && (
              <motion.button
                onClick={() => handleCollect(currentFile.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(var(--primary) / 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                جمع الدليل
              </motion.button>
            )}
            
            {isFileCollected && (
              <span className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium border border-green-500/30">
                ✓ تم الجمع
              </span>
            )}
          </div>

          {/* Preview */}
          {isFileLocked ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <p className="text-muted-foreground">هذا الملف مقفل</p>
              <p className="text-sm text-muted-foreground mt-2">اجمع المزيد من الأدلة لفتحه</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-mono">معاينة الملف</span>
              </div>
              <div className="p-4 bg-background/50 max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-mono">التاريخ</th>
                      <th className="text-left py-2 text-muted-foreground font-mono">الوصف</th>
                      {currentFile.type !== "email" && (
                        <th className="text-right py-2 text-muted-foreground font-mono">المبلغ</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentFile.preview.map((row, i) => (
                      <motion.tr
                        key={i}
                        className={cn(
                          "border-b border-border/50",
                          row.suspicious && "bg-destructive/10"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <td className="py-2 text-foreground font-mono">{row.date}</td>
                        <td className="py-2 text-foreground flex items-center gap-2">
                          {row.desc}
                          {row.suspicious && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-destructive/20 text-destructive font-mono animate-pulse">
                              مريب!
                            </span>
                          )}
                        </td>
                        {currentFile.type !== "email" && (
                          <td className={cn(
                            "py-2 text-right font-mono",
                            row.amount >= 0 ? "text-green-400" : "text-destructive"
                          )}>
                            {row.amount >= 0 ? "+" : ""}{row.amount.toLocaleString()}$
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hint */}
          {!isFileLocked && (
            <motion.div
              className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-accent flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span>لاحظ أي شيء غريب؟ خذ هذا إلى غرفة التحليل!</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      ) : null}
      onCloseOverlay={closeOverlay}
    >
      {/* Status Bar */}
      <motion.div
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
          <Archive className="w-5 h-5 text-primary" />
          <span className="text-foreground font-bold">غرفة الأدلة</span>
          <div className="w-px h-6 bg-border" />
          <span className="text-primary font-mono">
            الأدلة المجمعة: {collectedEvidence.length}/{evidenceFiles.length}
          </span>
        </div>
      </motion.div>

      {/* Collected Evidence Mini Display */}
      <AnimatePresence>
        {collectedEvidence.length > 0 && (
          <motion.div
            className="absolute top-24 right-6 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-background/90 backdrop-blur-xl border border-green-500/30">
              <span className="text-xs text-green-400 font-bold mb-1">✓ الأدلة المجمعة</span>
              {collectedEvidence.map(id => {
                const file = evidenceFiles.find(f => f.id === id);
                if (!file) return null;
                return (
                  <motion.div
                    key={id}
                    className="flex items-center gap-2 text-sm text-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <file.icon className="w-4 h-4 text-green-400" />
                    <span>{file.nameEn}</span>
                  </motion.div>
                );
              })}
              
              {collectedEvidence.length >= 2 && (
                <motion.button
                  onClick={() => onNavigate("analysis")}
                  className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  انتقل للتحليل →
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-8 z-20">
        <NavigationButton
          iconEmoji="🏢"
          label="مكتب المحقق"
          onClick={() => onNavigate("office")}
        />
      </div>
    </InteractiveRoom>
  );
};
