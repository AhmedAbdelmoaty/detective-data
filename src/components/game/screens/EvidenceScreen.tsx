import { useState } from "react";
import { ArrowLeft, FileSpreadsheet, Mail, FileText, Download } from "lucide-react";
import { GameCard } from "../GameCard";
import { cn } from "@/lib/utils";

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
  },
  {
    id: 2,
    name: "سجل المشتريات",
    nameEn: "Purchase Log",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    status: "new",
    description: "All purchases made this quarter",
  },
  {
    id: 3,
    name: "إيميلات المدير المالي",
    nameEn: "CFO Emails",
    type: "email",
    icon: Mail,
    status: "new",
    description: "Internal communications",
  },
  {
    id: 4,
    name: "تقرير المراجعة",
    nameEn: "Audit Report",
    type: "document",
    icon: FileText,
    status: "locked",
    description: "Requires 2 evidence pieces",
  },
  {
    id: 5,
    name: "سجلات الدخول",
    nameEn: "Access Logs",
    type: "spreadsheet",
    icon: FileSpreadsheet,
    status: "locked",
    description: "System access records",
  },
];

export const EvidenceScreen = ({ onNavigate }: EvidenceScreenProps) => {
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [collectedEvidence, setCollectedEvidence] = useState<number[]>([]);

  const handleCollect = (id: number) => {
    if (!collectedEvidence.includes(id)) {
      setCollectedEvidence([...collectedEvidence, id]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(45,90%,55%,0.03)_0%,_transparent_50%)]" />

      {/* Header */}
      <header className="relative z-10 flex items-center gap-4 mb-8 animate-slide-up">
        <button
          onClick={() => onNavigate("office")}
          className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">📁</span>
            Evidence Room
          </h1>
          <p className="text-sm text-muted-foreground">غرفة الأدلة - Browse and collect evidence files</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <span className="text-sm text-primary font-mono">
            Collected: {collectedEvidence.length}/5
          </span>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-6">
        {/* File Browser */}
        <div className="col-span-7 space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <GameCard title="Evidence Files" variant="glass">
            <div className="mt-4 space-y-3">
              {evidenceFiles.map((file, index) => {
                const Icon = file.icon;
                const isCollected = collectedEvidence.includes(file.id);
                const isLocked = file.status === "locked";
                const isSelected = selectedFile === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={() => !isLocked && setSelectedFile(file.id)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer",
                      "animate-slide-up",
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_hsl(175,80%,50%,0.1)]"
                        : "bg-background/50 border-border hover:border-primary/30",
                      isLocked && "opacity-50 cursor-not-allowed",
                      isCollected && "border-success/50"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isLocked ? "bg-muted" : "bg-accent/10"
                    )}>
                      {isLocked ? (
                        <span className="text-xl">🔒</span>
                      ) : (
                        <Icon className={cn(
                          "w-6 h-6",
                          isCollected ? "text-success" : "text-accent"
                        )} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{file.nameEn}</h4>
                        {file.status === "new" && !isCollected && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-destructive/20 text-destructive font-mono">
                            NEW
                          </span>
                        )}
                        {isCollected && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-success/20 text-success font-mono">
                            ✓ COLLECTED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground" dir="rtl">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                    </div>

                    {/* Action */}
                    {!isLocked && !isCollected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollect(file.id);
                        }}
                        className="p-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
                      >
                        <Download className="w-4 h-4 text-primary" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </GameCard>
        </div>

        {/* File Preview */}
        <div className="col-span-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <GameCard title="File Preview" variant="glass" className="sticky top-6">
            {selectedFile ? (
              <div className="mt-4">
                {/* Preview Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                  <FileSpreadsheet className="w-8 h-8 text-accent" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {evidenceFiles.find(f => f.id === selectedFile)?.nameEn}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {evidenceFiles.find(f => f.id === selectedFile)?.description}
                    </p>
                  </div>
                </div>

                {/* Mock Spreadsheet Preview */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-secondary/50 px-3 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground font-mono">Preview</p>
                  </div>
                  <div className="p-4 bg-background/50">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-muted-foreground font-mono">Date</th>
                          <th className="text-left py-2 text-muted-foreground font-mono">Description</th>
                          <th className="text-right py-2 text-muted-foreground font-mono">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 text-foreground font-mono">2024-01-15</td>
                          <td className="py-2 text-foreground">Office Supplies</td>
                          <td className="py-2 text-right text-destructive font-mono">-$2,500</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 text-foreground font-mono">2024-01-18</td>
                          <td className="py-2 text-foreground">Client Payment</td>
                          <td className="py-2 text-right text-success font-mono">+$15,000</td>
                        </tr>
                        <tr className="border-b border-border/50 bg-destructive/10">
                          <td className="py-2 text-foreground font-mono">2024-01-20</td>
                          <td className="py-2 text-foreground">Misc. Expense</td>
                          <td className="py-2 text-right text-destructive font-mono">-$8,750</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground" colSpan={3}>
                            ... more rows
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hint */}
                <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm text-accent flex items-center gap-2">
                    <span>💡</span>
                    <span>Notice anything unusual? Take this to Analysis Lab.</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-8 text-center">
                <span className="text-4xl mb-4 block">📂</span>
                <p className="text-muted-foreground">Select a file to preview</p>
                <p className="text-sm text-muted-foreground mt-2" dir="rtl">
                  اختر ملف لعرضه
                </p>
              </div>
            )}
          </GameCard>
        </div>
      </div>
    </div>
  );
};
