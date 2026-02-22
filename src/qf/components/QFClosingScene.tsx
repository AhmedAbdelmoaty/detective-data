import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useQF } from "../context/QFContext";
import {
  qfProblemStatements,
  qfGoldenQuestions,
  qfDecisionMappings,
  shuffleArray,
} from "../data/qfCaseData";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";

type Step = "problem" | "questions" | "decisions" | "confirm";

export const QFClosingScene = () => {
  const { submitFinal } = useQF();
  const [step, setStep] = useState<Step>("problem");
  const [selectedPS, setSelectedPS] = useState<string | null>(null);
  const [selectedGQs, setSelectedGQs] = useState<string[]>([]);
  const [selectedDMs, setSelectedDMs] = useState<string[]>([]);

  const shuffledPS = useMemo(() => shuffleArray(qfProblemStatements), []);
  const shuffledGQ = useMemo(() => shuffleArray(qfGoldenQuestions), []);
  const shuffledDM = useMemo(() => shuffleArray(qfDecisionMappings), []);

  const toggleGQ = (id: string) => {
    setSelectedGQs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const toggleDM = (id: string) => {
    setSelectedDMs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev,
    );
  };

  const handleSubmit = () => {
    if (selectedPS && selectedGQs.length === 3 && selectedDMs.length >= 1) {
      submitFinal(selectedPS, selectedGQs, selectedDMs);
    }
  };

  const stepLabels = { problem: "صياغة المشكلة", questions: "الأسئلة الذهبية", decisions: "خريطة القرار", confirm: "تأكيد" };
  const steps: Step[] = ["problem", "questions", "decisions", "confirm"];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-10">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${abuSaeed4})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full pt-16 pb-4 px-4" dir="rtl">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-muted"}`} />
              <span className={`text-xs ${i === currentIdx ? "text-primary font-bold" : "text-muted-foreground"}`}>
                {stepLabels[s]}
              </span>
              {i < steps.length - 1 && <div className="w-4 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Card area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Problem Statement */}
            {step === "problem" && (
              <motion.div key="problem" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-lg font-bold text-foreground mb-2">📌 اختر صياغة المشكلة الأنسب:</h2>
                <p className="text-sm text-muted-foreground mb-4">اختر الجملة اللي بتوصف المشكلة بأوضح شكل</p>
                <div className="space-y-3">
                  {shuffledPS.map((ps) => (
                    <button
                      key={ps.id}
                      onClick={() => setSelectedPS(ps.id)}
                      className={`w-full text-right rounded-xl border backdrop-blur-md p-4 transition-all
                        ${selectedPS === ps.id ? "bg-primary/20 border-primary" : "bg-card/80 border-border/50 hover:border-primary/30"}`}
                    >
                      <div className="flex items-start gap-3">
                        {selectedPS === ps.id ? (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm text-foreground leading-relaxed">{ps.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep("questions")}
                  disabled={!selectedPS}
                  className="mt-6 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-40 transition-opacity"
                >
                  التالي: الأسئلة الذهبية
                </button>
              </motion.div>
            )}

            {/* Step 2: Golden Questions */}
            {step === "questions" && (
              <motion.div key="questions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-lg font-bold text-foreground mb-2">❓ اختر 3 أسئلة ذهبية (نعم/لا):</h2>
                <p className="text-sm text-muted-foreground mb-4">الأسئلة اللي لو اتجاوبت هتوضح الصورة ({selectedGQs.length}/3)</p>
                <div className="space-y-2">
                  {shuffledGQ.map((gq) => {
                    const isSelected = selectedGQs.includes(gq.id);
                    return (
                      <button
                        key={gq.id}
                        onClick={() => toggleGQ(gq.id)}
                        className={`w-full text-right rounded-xl border backdrop-blur-md p-3.5 transition-all
                          ${isSelected ? "bg-primary/20 border-primary" : "bg-card/80 border-border/50 hover:border-primary/30"}`}
                      >
                        <div className="flex items-start gap-3">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-sm text-foreground leading-relaxed">{gq.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={() => setStep("problem")} className="flex-1 py-3 rounded-xl border border-border bg-secondary text-foreground font-bold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> رجوع
                  </button>
                  <button
                    onClick={() => setStep("decisions")}
                    disabled={selectedGQs.length !== 3}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-40 transition-opacity"
                  >
                    التالي: خريطة القرار
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Decision Mapping */}
            {step === "decisions" && (
              <motion.div key="decisions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-lg font-bold text-foreground mb-2">🎯 خريطة القرار:</h2>
                <p className="text-sm text-muted-foreground mb-4">اختر 1-3 خطوات: "لو الإجابة كذا → نعمل كذا"</p>
                <div className="space-y-2">
                  {shuffledDM.map((dm) => {
                    const isSelected = selectedDMs.includes(dm.id);
                    return (
                      <button
                        key={dm.id}
                        onClick={() => toggleDM(dm.id)}
                        className={`w-full text-right rounded-xl border backdrop-blur-md p-3.5 transition-all
                          ${isSelected ? "bg-primary/20 border-primary" : "bg-card/80 border-border/50 hover:border-primary/30"}`}
                      >
                        <div className="flex items-start gap-3">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div className="text-sm leading-relaxed">
                            <p className="text-foreground font-medium">{dm.condition}</p>
                            <p className="text-primary text-xs mt-1">← {dm.action}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={() => setStep("questions")} className="flex-1 py-3 rounded-xl border border-border bg-secondary text-foreground font-bold flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> رجوع
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    disabled={selectedDMs.length < 1}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-40 transition-opacity"
                  >
                    مراجعة وتأكيد
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === "confirm" && (
              <motion.div key="confirm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-lg font-bold text-foreground mb-4">📋 ملخص التأطير:</h2>

                <div className="glass rounded-xl p-4 mb-3 border border-border/50">
                  <p className="text-xs text-primary font-bold mb-1">المشكلة:</p>
                  <p className="text-sm text-foreground">{qfProblemStatements.find(p => p.id === selectedPS)?.text}</p>
                </div>

                <div className="glass rounded-xl p-4 mb-3 border border-border/50">
                  <p className="text-xs text-primary font-bold mb-2">الأسئلة الذهبية:</p>
                  {selectedGQs.map((id, i) => (
                    <p key={id} className="text-sm text-foreground mb-1">
                      {i + 1}. {qfGoldenQuestions.find(q => q.id === id)?.text}
                    </p>
                  ))}
                </div>

                <div className="glass rounded-xl p-4 mb-3 border border-border/50">
                  <p className="text-xs text-primary font-bold mb-2">خريطة القرار:</p>
                  {selectedDMs.map((id) => {
                    const dm = qfDecisionMappings.find(d => d.id === id);
                    return (
                      <div key={id} className="text-sm text-foreground mb-2">
                        <p>• {dm?.condition}</p>
                        <p className="text-primary text-xs mr-3">← {dm?.action}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-6">
                  <button onClick={() => setStep("decisions")} className="flex-1 py-3 rounded-xl border border-border bg-secondary text-foreground font-bold">
                    تعديل
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-bold glow-accent"
                  >
                    قدّم لأبو سعيد ✨
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
