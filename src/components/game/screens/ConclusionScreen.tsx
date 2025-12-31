import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Send, RotateCcw
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, CONCLUSION_OPTIONS, CASE_SOLUTION } from "@/data/newCase";

interface ConclusionScreenProps {
  onNavigate: (screen: string) => void;
}

export const ConclusionScreen = ({ onNavigate }: ConclusionScreenProps) => {
  const { state, submitConclusion, addNote } = useGame();
  
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; feedback: string } | null>(null);

  const canSubmit = selectedCause && selectedProject && selectedSalesperson;

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const conclusion = {
      cause: selectedCause,
      project: selectedProject,
      salesperson: selectedSalesperson
    };
    
    const submissionResult = submitConclusion(conclusion);
    setResult(submissionResult);
    setSubmitted(true);
    
    addNote(`تم تقديم الاستنتاج: ${submissionResult.correct ? "صحيح" : "خاطئ"}`);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setResult(null);
    setSelectedCause(null);
    setSelectedProject(null);
    setSelectedSalesperson(null);
  };

  // If already submitted with correct answer, go to result
  if (submitted && result?.correct) {
    setTimeout(() => onNavigate("result"), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border/30">
        <motion.button
          onClick={() => onNavigate("my-desk")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 border border-border text-foreground"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          رجوع للتحليل
        </motion.button>

        <div className="text-center">
          <p className="text-primary font-bold">{CASE_INFO.title}</p>
          <p className="text-xs text-muted-foreground">تقديم الاستنتاج النهائي</p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/30">
          <p className="text-sm text-foreground">
            المحاولات المتبقية: <span className="font-bold text-primary">{3 - state.conclusionAttempts}</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">📋 تقرير الاستنتاج</h1>
                <p className="text-muted-foreground">
                  بناءً على تحليلك للأدلة، ما هو استنتاجك؟
                </p>
              </div>

              {/* Evidence Summary */}
              <div className="p-4 rounded-xl bg-card/50 border border-border">
                <h3 className="font-bold text-foreground mb-3">📁 ملخص الأدلة المجمعة</h3>
                <div className="flex flex-wrap gap-2">
                  {state.collectedEvidence.map(e => (
                    <span key={e} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      {e}
                    </span>
                  ))}
                  {state.patternsDiscovered.map(p => (
                    <span key={p} className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                      🔍 {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Question 1: Cause */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-bold text-foreground mb-4">
                  1. ما هو السبب الرئيسي لهبوط الأرباح؟
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {CONCLUSION_OPTIONS.causes.map(option => (
                    <motion.button
                      key={option.id}
                      onClick={() => setSelectedCause(option.id)}
                      className={`p-4 rounded-xl border text-right transition-colors ${
                        selectedCause === option.id
                          ? "bg-primary/20 border-primary text-foreground"
                          : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Question 2: Project */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-bold text-foreground mb-4">
                  2. في أي مشروع تتركز المشكلة؟
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {CONCLUSION_OPTIONS.projects.map(option => (
                    <motion.button
                      key={option.id}
                      onClick={() => setSelectedProject(option.id)}
                      className={`p-4 rounded-xl border text-center transition-colors ${
                        selectedProject === option.id
                          ? "bg-primary/20 border-primary text-foreground"
                          : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Question 3: Salesperson */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-bold text-foreground mb-4">
                  3. من المندوب الأكثر مساهمة في هذه المشكلة؟
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {CONCLUSION_OPTIONS.salespeople.map(option => (
                    <motion.button
                      key={option.id}
                      onClick={() => setSelectedSalesperson(option.id)}
                      className={`p-4 rounded-xl border text-center transition-colors ${
                        selectedSalesperson === option.id
                          ? "bg-primary/20 border-primary text-foreground"
                          : "bg-muted/30 border-border text-muted-foreground hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 ${
                  canSubmit
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
              >
                <Send className="w-5 h-5" />
                تقديم الاستنتاج للإدارة
              </motion.button>

              {state.conclusionAttempts > 0 && (
                <p className="text-center text-amber-400 text-sm">
                  ⚠️ لديك {3 - state.conclusionAttempts} محاولات متبقية
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              {result?.correct ? (
                <>
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-green-400 mb-4">استنتاج صحيح!</h2>
                  <p className="text-muted-foreground mb-8">{result.feedback}</p>
                  <p className="text-foreground">جاري الانتقال لشاشة النتائج...</p>
                </>
              ) : (
                <>
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle className="w-12 h-12 text-destructive" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-destructive mb-4">استنتاج غير دقيق</h2>
                  <p className="text-muted-foreground mb-8">{result?.feedback}</p>
                  
                  {state.conclusionAttempts < 3 ? (
                    <motion.button
                      onClick={handleRetry}
                      className="flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="w-5 h-5" />
                      حاول مرة أخرى ({3 - state.conclusionAttempts} متبقية)
                    </motion.button>
                  ) : (
                    <>
                      <p className="text-destructive mb-4">نفدت المحاولات!</p>
                      <motion.button
                        onClick={() => onNavigate("result")}
                        className="px-8 py-4 rounded-xl bg-secondary text-foreground font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        عرض النتيجة النهائية
                      </motion.button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
