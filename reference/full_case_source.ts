/**
 * ✅ CASE MASTER SOURCE (REFERENCE ONLY)
 *
 * This file contains the full original Case Source from the Data-Scraper project.
 * It is NOT part of the detective-data (Scenes) app build.
 *
 * ❌ DO NOT IMPORT THIS FILE IN THE APP.
 * ✅ Used only as reference for Codex agent to migrate the case mechanics exactly.
 */
export {};
// ==============================
// 1) CASE CONTENT - case001.ts
// ==============================

import { Case } from "@shared/schema";

export const case001: Case = {
  id: "case001",
  title: "لغز شركة الأمل العقارية",
  briefing: {
    sender: "الرئيس التنفيذي",
    text: "أهلاً بك أيها المحقق. نحن في وضع حرج. انخفضت مبيعاتنا بنسبة 40% في آخر 10 أيام بشكل مفاجئ، رغم أننا ضاعفنا ميزانية التسويق! نحتاج منك أن تكشف السبب الحقيقي وراء هذا الانهيار قبل فوات الأوان. كل الأقسام تلوم بعضها البعض.",
  },
  resources: {
    initialTime: 100,
    initialTrust: 100,
  },
  evidence: [
    {
      id: "ev1",
      title: "بريد إلكتروني من التسويق",
      description: "تم إطلاق حملة 'تيك توك' الجديدة في الأول من أكتوبر.",
      type: "email",
      cost: 5,
      isKey: true,
    },
    {
      id: "ev2",
      title: "سجل الخادم التقني",
      description: "صيانة روتينية للخادم يوم 3 أكتوبر. توقف لمدة 15 دقيقة.",
      type: "report",
      cost: 10,
      isKey: false,
    },
    {
      id: "ev3",
      title: "تقرير المبيعات الأسبوعي",
      description: "عدد العملاء المحتملين (Leads) ارتفع بنسبة 300%، لكن نسبة التحويل (Conversion) انخفضت بنسبة 90%.",
      type: "report",
      cost: 15,
      isKey: true,
    },
    {
      id: "ev4",
      title: "شكوى عميل",
      description: "العميل يشتكي من تأخر الرد على الهاتف.",
      type: "document",
      cost: 5,
      isKey: false,
    },
    {
      id: "ev5",
      title: "نص الإعلان الترويجي",
      description: "فيلات فاخرة - خصم 50% لفترة محدودة! (أسلوب نقر مخادع)",
      type: "document",
      cost: 10,
      isKey: true,
    },
    {
      id: "ev6",
      title: "عينة من قائمة العملاء",
      description: "الأسماء والوظائف: طالب، طالب جامعي، عاطل عن العمل، حديث التخرج.",
      type: "document",
      cost: 15,
      isKey: true,
    },
    {
      id: "ev7",
      title: "أخبار المنافسين",
      description: "السوق العقاري يشهد ركوداً طفيفاً بنسبة 5%.",
      type: "report",
      cost: 5,
      isKey: false,
    },
    {
      id: "ev8",
      title: "مذكرة من الرئيس التنفيذي",
      description: "يجب تحقيق أهداف الربع الرابع بأي ثمن.",
      type: "document",
      cost: 0,
      isKey: false,
    },
  ],
  dataSets: [
    {
      name: "سجل المبيعات اليومي",
      description: "يظهر عدد العملاء المحتملين والمبيعات الفعلية خلال أسبوعين.",
      rows: [
        { id: 1, date: "2023-09-25", leads: 50, sales: 5 },
        { id: 2, date: "2023-09-26", leads: 45, sales: 4 },
        { id: 3, date: "2023-09-27", leads: 55, sales: 6 },
        { id: 4, date: "2023-09-28", leads: 48, sales: 5 },
        { id: 5, date: "2023-09-29", leads: 52, sales: 5 },
        { id: 6, date: "2023-09-30", leads: 50, sales: 5 },
        { id: 7, date: "2023-10-01", leads: 150, sales: 2 },
        { id: 8, date: "2023-10-02", leads: 300, sales: 1 },
        { id: 9, date: "2023-10-03", leads: 450, sales: 0 },
        { id: 10, date: "2023-10-04", leads: 400, sales: 1 },
        { id: 11, date: "2023-10-05", leads: 380, sales: 0 },
      ],
    },
    {
      name: "إنفاق قنوات التسويق",
      description: "توزيع الميزانية على المنصات المختلفة.",
      rows: [
        { id: 1, channel: "Google Ads", cost: 5000, clicks: 200 },
        { id: 2, channel: "Facebook", cost: 3000, clicks: 150 },
        { id: 3, channel: "TikTok", cost: 15000, clicks: 5000 },
        { id: 4, channel: "LinkedIn", cost: 2000, clicks: 50 },
      ],
    },
  ],
  stakeholders: [
    {
      id: "s1",
      name: "سارة (مديرة التسويق)",
      role: "مدير التسويق",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop", // Business woman
      questions: [
        {
          id: "q1_1",
          text: "كيف تصفين أداء الحملة الأخيرة؟",
          response: "إنها حملة رائعة! لقد حققنا انتشاراً فيروسياً (Viral). الجميع يتحدث عنا!",
          cost: 10,
        },
        {
          id: "q1_2",
          text: "من هو الجمهور المستهدف في هذه الحملة؟",
          response: "استهدفنا الجميع! أردنا أقصى قدر من الانتشار والوعي بالعلامة التجارية.",
          cost: 15,
        },
        {
          id: "q1_3",
          text: "لماذا اخترتم تيك توك تحديداً؟",
          response: "لأنه المنصة الأسرع نمواً، والتكلفة لكل نقرة رخيصة جداً.",
          cost: 10,
        },
      ],
    },
    {
      id: "s2",
      name: "أحمد (مدير المبيعات)",
      role: "مدير المبيعات",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop", // Business man
      questions: [
        {
          id: "q2_1",
          text: "لماذا انخفضت المبيعات؟",
          response: "لا أعرف! الفريق يعمل بجد، لكن الهواتف لا تتوقف عن الرنين لأشخاص غير جادين.",
          cost: 10,
        },
        {
          id: "q2_2",
          text: "ما هي جودة العملاء القادمين من الحملة؟",
          response: "سيئة جداً. معظمهم يسألون إن كنا نوزع فيلات مجانية! إنهم أطفال.",
          cost: 15,
        },
        {
          id: "q2_3",
          text: "هل هناك مشكلة في فريق المبيعات؟",
          response: "إطلاقاً. فريقي هو الأفضل، لكننا نضيع وقتنا مع عملاء لا يملكون المال.",
          cost: 10,
        },
      ],
    },
  ],
  solution: {
    options: [
      { id: "opt1", text: "فريق المبيعات غير مدرب للتعامل مع الضغط.", isCorrect: false },
      { id: "opt2", text: "خلل تقني في الموقع يمنع إتمام الصفقات.", isCorrect: false },
      { id: "opt3", text: "استهداف خاطئ في التسويق (الكمية مقابل الجودة).", isCorrect: true },
      { id: "opt4", text: "الركود الاقتصادي العام في السوق.", isCorrect: false },
    ],
    requiredEvidenceIds: ["ev3", "ev5", "ev6"],
    feedbackCorrect: "أحسنت! التحليل دقيق. التسويق ركز على جلب عدد ضخم من الزيارات الرخيصة من فئة عمرية لا تملك القدرة الشرائية (طلاب)، مما أغرق فريق المبيعات وأضاع وقتهم.",
    feedbackIncorrect: "تحليل غير دقيق. راجع الأدلة مرة أخرى. هل المشكلة في الموظفين أم في نوعية العملاء؟",
  },
};

// ==============================
// 2) GAME STORE - gameStore.ts
// ==============================

import { create } from 'zustand';
import { Case, Evidence, Stakeholder } from '@shared/schema';
import { case001 } from '../content/cases/case001';

interface GameState {
  currentCase: Case;
  time: number;
  trust: number;
  visitedEvidenceIds: string[];
  pinnedEvidenceIds: string[];
  interviewedIds: string[]; // combination of stakeholderId_questionId
  gameStatus: 'briefing' | 'playing' | 'solved' | 'failed';
  
  // Actions
  startGame: () => void;
  visitEvidence: (id: string, cost: number) => void;
  togglePinEvidence: (id: string) => void;
  askQuestion: (questionId: string, cost: number) => void;
  submitSolution: (optionId: string) => { correct: boolean; feedback: string };
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentCase: case001,
  time: case001.resources.initialTime,
  trust: case001.resources.initialTrust,
  visitedEvidenceIds: [],
  pinnedEvidenceIds: [],
  interviewedIds: [],
  gameStatus: 'briefing',

  startGame: () => set({ gameStatus: 'playing' }),

  visitEvidence: (id, cost) => {
    const state = get();
    if (state.visitedEvidenceIds.includes(id)) return;
    
    set((state) => ({
      visitedEvidenceIds: [...state.visitedEvidenceIds, id],
      time: Math.max(0, state.time - cost),
    }));
  },

  togglePinEvidence: (id) => {
    set((state) => {
      const isPinned = state.pinnedEvidenceIds.includes(id);
      if (isPinned) {
        return { pinnedEvidenceIds: state.pinnedEvidenceIds.filter((eid) => eid !== id) };
      } else {
        if (state.pinnedEvidenceIds.length >= 5) return state; // Max 5 pins
        return { pinnedEvidenceIds: [...state.pinnedEvidenceIds, id] };
      }
    });
  },

  askQuestion: (questionId, cost) => {
    const state = get();
    if (state.interviewedIds.includes(questionId)) return;

    set((state) => ({
      interviewedIds: [...state.interviewedIds, questionId],
      time: Math.max(0, state.time - cost),
    }));
  },

  submitSolution: (optionId) => {
    const state = get();
    const solution = state.currentCase.solution;
    const selectedOption = solution.options.find((o) => o.id === optionId);
    
    // Check if required evidence is pinned
    const hasRequiredEvidence = solution.requiredEvidenceIds.every((reqId) => 
      state.pinnedEvidenceIds.includes(reqId)
    );

    const isCorrect = selectedOption?.isCorrect && hasRequiredEvidence;

    set({ gameStatus: isCorrect ? 'solved' : 'failed' });

    return {
      correct: !!isCorrect,
      feedback: isCorrect ? solution.feedbackCorrect : solution.feedbackIncorrect
    };
  },

  resetGame: () => {
    set({
      currentCase: case001,
      time: case001.resources.initialTime,
      trust: case001.resources.initialTrust,
      visitedEvidenceIds: [],
      pinnedEvidenceIds: [],
      interviewedIds: [],
      gameStatus: 'briefing',
    });
  },
}));

// ==============================
// 3) PAGES
// ==============================

// --- Intro.tsx ---
import { useGameStore } from "@/store/gameStore";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Play, ShieldAlert } from "lucide-react";

export default function Intro() {
  const { startGame } = useGameStore();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-[0.03] pointer-events-none">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="h-full border-l border-white/20" />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl relative z-10"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-2xl mb-8 border border-primary/30 shadow-2xl shadow-primary/20">
          <ShieldAlert className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          محقق <span className="text-primary">البيانات</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
          لعبة تحقيق تعتمد على البيانات. حلل الأرقام، استجوب الشهود، واكشف الحقيقة المخفية خلف الرسوم البيانية.
        </p>

        <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl mb-12 text-right">
          <h3 className="font-bold text-lg mb-4 text-accent">القضية 001: لغز شركة الأمل العقارية</h3>
          <p className="text-sm text-slate-300 leading-7">
            شركة عقارية كبرى تعاني من انهيار مفاجئ في المبيعات رغم نجاح حملتها التسويقية "الفيروسي". بصفتك محقق بيانات، مهمتك هي الغوص في الأرقام ورسائل البريد الإلكتروني لتحديد السبب الحقيقي قبل إفلاس الشركة.
          </p>
        </div>

        <Link href="/office" onClick={startGame}>
          <button className="
            group relative px-10 py-5 bg-primary text-primary-foreground text-xl font-bold rounded-xl 
            shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.7)]
            transition-all duration-300 hover:scale-105 active:scale-95
          ">
            <span className="flex items-center gap-3">
              قبول المهمة
              <Play className="w-6 h-6 fill-current" />
            </span>
          </button>
        </Link>
      </motion.div>

      <footer className="absolute bottom-8 text-xs text-muted-foreground opacity-50">
        محاكي تدريب تحليل البيانات - الإصدار التجريبي
      </footer>
    </div>
  );
}

// --- Office.tsx ---
import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Office() {
  const { currentCase, time } = useGameStore();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">المكتب الرئيسي</h1>
        <p className="text-muted-foreground">ملخص المهمة الحالية ورسائل الإدارة العليا</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-white/10 shadow-xl">
            <span className="text-2xl font-bold">CEO</span>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{currentCase.briefing.sender}</h2>
                <p className="text-sm text-primary">مهمة عاجلة: {currentCase.title}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                <span>قبل 10 دقائق</span>
              </div>
            </div>

            <div className="bg-secondary/30 p-6 rounded-xl border border-white/5">
              <Mail className="w-5 h-5 text-muted-foreground mb-3" />
              <p className="text-lg leading-relaxed text-slate-200">
                {currentCase.briefing.text}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Link href="/desk" className="
                px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold 
                hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 
                active:scale-95 transition-all flex items-center gap-2
              ">
                <span>البدء في التحليل</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <h3 className="font-bold text-lg mb-4 text-accent">تلميحات هامة</h3>
          <ul className="space-y-3 text-sm text-muted-foreground list-disc list-inside">
            <li>الوقت هو أهم مورد لديك. لا تضيعه في أدلة تافهة.</li>
            <li>استخدم البيانات للتحقق من أقوال الموظفين.</li>
            <li>ابحث عن التناقضات بين "ما يقال" و "ما تظهره الأرقام".</li>
          </ul>
        </div>
        
        <div className="glass-card p-6 rounded-xl border border-border/50">
          <h3 className="font-bold text-lg mb-4 text-primary">حالة النظام</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>اتصال قاعدة البيانات</span>
              <span className="text-green-500 font-mono">متصل</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>تشفير البيانات</span>
              <span className="text-green-500 font-mono">نشط</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الوقت المتبقي للتحقيق</span>
              <span className="text-foreground font-mono">{time} وحدة زمنية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- EvidenceRoom.tsx ---
import { useGameStore } from "@/store/gameStore";
import { EvidenceCard } from "@/components/EvidenceCard";
import { Search } from "lucide-react";

export default function EvidenceRoom() {
  const { currentCase, visitedEvidenceIds, pinnedEvidenceIds, visitEvidence, togglePinEvidence } = useGameStore();

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            غرفة الأدلة
          </h1>
          <p className="text-muted-foreground mt-2">
            اجمع الأدلة، ادرسها، وقم بتثبيت (Pin) الأدلة المهمة لبناء قضيتك.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">الأدلة المثبتة</div>
          <div className="font-mono text-2xl font-bold text-accent">
            {pinnedEvidenceIds.length} / 5
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
        {currentCase.evidence.map((ev) => (
          <EvidenceCard
            key={ev.id}
            evidence={ev}
            isVisited={visitedEvidenceIds.includes(ev.id)}
            isPinned={pinnedEvidenceIds.includes(ev.id)}
            onVisit={() => visitEvidence(ev.id, ev.cost)}
            onPin={() => togglePinEvidence(ev.id)}
          />
        ))}
      </div>
    </div>
  );
}

// --- Interviews.tsx ---
import { useGameStore } from "@/store/gameStore";
import { Users, MessageSquare, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Interviews() {
  const { currentCase, interviewedIds, askQuestion } = useGameStore();
  const [selectedStakeholderId, setSelectedStakeholderId] = useState(currentCase.stakeholders[0].id);

  const activeStakeholder = currentCase.stakeholders.find(s => s.id === selectedStakeholderId)!;

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          غرفة الاستجواب
        </h1>
        <p className="text-muted-foreground mt-2">
          استجوب الموظفين الرئيسيين. كل سؤال يكلف وقتاً، اختر بحكمة.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Stakeholder List */}
        <div className="w-full lg:w-1/4 space-y-4">
          {currentCase.stakeholders.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedStakeholderId(person.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-right",
                selectedStakeholderId === person.id
                  ? "bg-primary/20 border-primary shadow-md"
                  : "bg-card border-border hover:bg-white/5"
              )}
            >
              <img 
                src={person.avatar} 
                alt={person.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
              <div>
                <div className="font-bold">{person.name}</div>
                <div className="text-xs text-muted-foreground">{person.role}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Interaction Area */}
        <div className="flex-1 glass-card rounded-2xl p-8 flex flex-col border border-border/50">
          <div className="flex items-center gap-6 mb-8 border-b border-border/50 pb-6">
            <div className="relative">
              <img 
                src={activeStakeholder.avatar} 
                alt={activeStakeholder.name} 
                className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-2 border-primary/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-background" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{activeStakeholder.name}</h2>
              <p className="text-primary">{activeStakeholder.role}</p>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {activeStakeholder.questions.map((q) => {
                const isAsked = interviewedIds.includes(q.id);
                return (
                  <motion.div 
                    key={q.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "rounded-xl border p-4 transition-all",
                      isAsked 
                        ? "bg-secondary/40 border-border" 
                        : "bg-card border-border/50 hover:border-primary/50 cursor-pointer"
                    )}
                    onClick={() => !isAsked && askQuestion(q.id, q.cost)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className={cn("w-4 h-4", isAsked ? "text-muted-foreground" : "text-primary")} />
                          <h4 className={cn("font-medium", isAsked ? "text-muted-foreground" : "text-foreground")}>
                            {q.text}
                          </h4>
                        </div>
                        
                        {isAsked && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pr-6 text-sm text-primary-foreground/90 leading-relaxed bg-primary/10 p-3 rounded-lg"
                          >
                            "{q.response}"
                          </motion.div>
                        )}
                      </div>

                      {!isAsked && (
                        <div className="flex items-center gap-1 text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded">
                          <Lock className="w-3 h-3" />
                          <span>{q.cost} دقيقة</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DataDesk.tsx ---
import { useGameStore } from "@/store/gameStore";
import { DataTable } from "@/components/DataTable";
import { Database, TrendingUp, BarChart3, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { motion } from "framer-motion";

export default function DataDesk() {
  const { currentCase } = useGameStore();

  // Find the specific datasets (Hardcoded for prototype visualization based on case001)
  const salesData = currentCase.dataSets.find(d => d.name.includes("المبيعات"))?.rows || [];
  const marketingData = currentCase.dataSets.find(d => d.name.includes("التسويق"))?.rows || [];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          مركز البيانات
        </h1>
        <p className="text-muted-foreground mt-2">
          الأرقام لا تكذب. حلل البيانات لكشف الحقيقة المخفية.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Sales vs Leads */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              تحليل العملاء المحتملين مقابل المبيعات
            </h3>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="leads" name="العملاء (Leads)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="sales" name="المبيعات (Sales)" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive-foreground">
              ملاحظة: لاحظ الانفصال الحاد بين منحنى العملاء ومنحنى المبيعات بدءاً من 1 أكتوبر.
            </p>
          </div>
        </motion.div>

        {/* Chart 2: Marketing Spend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl"
        >
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              توزيع الميزانية والنقرات
            </h3>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="channel" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  cursor={{fill: '#ffffff05'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Legend />
                <Bar dataKey="cost" name="التكلفة ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" name="النقرات" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        {currentCase.dataSets.map((ds) => (
          <DataTable 
            key={ds.name}
            title={ds.name} 
            data={ds.rows} 
            columns={Object.keys(ds.rows[0]).filter(k => k !== 'id')} 
          />
        ))}
      </div>
    </div>
  );
}
                
// --- Report.tsx ---
import { useGameStore } from "@/store/gameStore";
import { FileText, CheckCircle, AlertTriangle, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Report() {
  const { currentCase, pinnedEvidenceIds, submitSolution, gameStatus } = useGameStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; feedback: string } | null>(null);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    const res = submitSolution(selectedOptionId);
    setResult(res);
  };

  if (result) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "max-w-2xl w-full p-12 rounded-3xl border-2 text-center shadow-2xl",
            result.correct ? "bg-green-950/30 border-green-500/50" : "bg-red-950/30 border-destructive/50"
          )}
        >
          {result.correct ? (
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          ) : (
            <AlertTriangle className="w-24 h-24 text-destructive mx-auto mb-6" />
          )}
          
          <h1 className="text-4xl font-bold mb-4">
            {result.correct ? "القضية حُلّت بنجاح!" : "استنتاج خاطئ"}
          </h1>
          
          <p className="text-xl leading-relaxed opacity-90 mb-8">
            {result.feedback}
          </p>

          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
          >
            العودة للقائمة الرئيسية
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          التقرير النهائي
        </h1>
        <p className="text-muted-foreground mt-2">
          اختر الاستنتاج الصحيح بناءً على الأدلة التي قمت بتثبيتها.
        </p>
      </header>

      {/* Pinned Evidence Review */}
      <div className="bg-secondary/20 p-6 rounded-xl border border-border/50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-accent rounded-full"></span>
          الأدلة الداعمة (المثبتة)
        </h3>
        {pinnedEvidenceIds.length === 0 ? (
          <p className="text-destructive text-sm">لم تقم بتثبيت أي أدلة! عد إلى غرفة الأدلة واختر الحقائق المهمة.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {pinnedEvidenceIds.map(id => {
              const ev = currentCase.evidence.find(e => e.id === id);
              return (
                <div key={id} className="bg-card border border-accent/30 px-4 py-2 rounded-lg text-sm shadow-sm">
                  {ev?.title}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">ما هو السبب الرئيسي للمشكلة؟</h3>
        {currentCase.solution.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOptionId(option.id)}
            className={cn(
              "w-full text-right p-6 rounded-xl border-2 transition-all duration-200",
              selectedOptionId === option.id
                ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                : "bg-card border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                selectedOptionId === option.id ? "border-primary" : "border-muted-foreground"
              )}>
                {selectedOptionId === option.id && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
              <span className={cn(
                "text-lg",
                selectedOptionId === option.id ? "font-bold text-primary" : "text-foreground"
              )}>
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-8">
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId || pinnedEvidenceIds.length === 0}
          className={cn(
            "px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all",
            !selectedOptionId || pinnedEvidenceIds.length === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
          )}
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
          تقديم التقرير وإنهاء القضية
        </button>
      </div>
    </div>
  );
}
    
// --- App.tsx ---
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/Sidebar";

// Pages
import Intro from "@/pages/Intro";
import Office from "@/pages/Office";
import EvidenceRoom from "@/pages/EvidenceRoom";
import DataDesk from "@/pages/DataDesk";
import Interviews from "@/pages/Interviews";
import Report from "@/pages/Report";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-arabic" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        {/* Subtle grid background for the main area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      
      {/* Game Routes wrapped in Layout */}
      <Route path="/office">
        <Layout><Office /></Layout>
      </Route>
      <Route path="/evidence">
        <Layout><EvidenceRoom /></Layout>
      </Route>
      <Route path="/desk">
        <Layout><DataDesk /></Layout>
      </Route>
      <Route path="/interviews">
        <Layout><Interviews /></Layout>
      </Route>
      <Route path="/report">
        <Layout><Report /></Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

// ==============================
// 4) COMPONENTS
// ==============================

// --- DataTable.tsx ---
import { DataRow } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: DataRow[];
  columns: string[]; // Keys to display
  title: string;
}

export function DataTable({ data, columns, title }: DataTableProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden shadow-sm">
      <div className="bg-secondary/30 px-6 py-4 border-b border-border/50">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table dir="rtl">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              {columns.map((col) => (
                <TableHead key={col} className="text-right font-bold text-primary">
                  {col.toUpperCase()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow 
                key={row.id} 
                className={cn(
                  "border-border/50 transition-colors",
                  idx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                )}
              >
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col}`} className="font-mono text-muted-foreground">
                    {row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
    
// --- EvidenceCard.tsx ---
import { Evidence } from "@shared/schema";
import { cn } from "@/lib/utils";
import { FileText, Mail, FileBarChart, Pin, Search } from "lucide-react";
import { motion } from "framer-motion";

interface EvidenceCardProps {
  evidence: Evidence;
  isVisited: boolean;
  isPinned: boolean;
  onVisit: () => void;
  onPin: () => void;
}

const icons = {
  document: FileText,
  email: Mail,
  report: FileBarChart,
  clue: Search,
};

export function EvidenceCard({ evidence, isVisited, isPinned, onVisit, onPin }: EvidenceCardProps) {
  const Icon = icons[evidence.type] || FileText;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col h-full rounded-xl border transition-all duration-300 overflow-hidden group",
        isVisited 
          ? "bg-card border-border/50 hover:border-primary/50 shadow-lg" 
          : "bg-secondary/20 border-border/30 hover:bg-secondary/40 cursor-pointer"
      )}
      onClick={!isVisited ? onVisit : undefined}
    >
      {/* Pin Button */}
      {isVisited && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className={cn(
            "absolute top-3 left-3 z-10 p-2 rounded-full transition-all duration-200",
            isPinned 
              ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(234,179,8,0.5)]" 
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
        </button>
      )}

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-lg",
            isVisited ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          {!isVisited && (
            <span className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-1 rounded">
              -{evidence.cost} دقيقة
            </span>
          )}
        </div>

        <h3 className={cn(
          "font-bold text-lg mb-2 line-clamp-2",
          !isVisited && "blur-sm select-none"
        )}>
          {evidence.title}
        </h3>

        <div className="flex-1">
          <p className={cn(
            "text-sm text-muted-foreground leading-relaxed",
            !isVisited && "blur-sm select-none"
          )}>
            {isVisited ? evidence.description : "انقر للكشف عن هذا الدليل وتحليله. سيستهلك ذلك وقتاً من موارد التحقيق."}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      {!isVisited && (
        <div className="p-4 bg-primary/5 border-t border-primary/10 text-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          تحليل الدليل
        </div>
      )}
      
      {isPinned && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-accent shadow-[0_-2px_10px_rgba(234,179,8,0.3)]" />
      )}
    </motion.div>
  );
}
    
// --- Sidebar.tsx ---
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Search, 
  Database, 
  Users, 
  FileText, 
  LayoutDashboard 
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";

const items = [
  { name: "المكتب الرئيسي", icon: Briefcase, path: "/office" },
  { name: "غرفة الأدلة", icon: Search, path: "/evidence" },
  { name: "مركز البيانات", icon: Database, path: "/desk" },
  { name: "الاستجواب", icon: Users, path: "/interviews" },
  { name: "التحليل والاستنتاج", icon: FileText, path: "/report" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { time, trust } = useGameStore();

  return (
    <div className="h-screen w-64 bg-card border-l border-border flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary">محقق البيانات</h1>
            <p className="text-xs text-muted-foreground">الإصدار 1.0</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Resource Monitor */}
        <div className="bg-secondary/50 rounded-xl p-4 border border-white/5 space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">الوقت المتبقي</span>
              <span className={cn("font-mono font-bold", time < 20 ? "text-destructive" : "text-primary")}>
                {time}%
              </span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500", time < 20 ? "bg-destructive" : "bg-primary")} 
                style={{ width: `${time}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">الثقة</span>
              <span className="font-mono font-bold text-accent">{trust}%</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500" 
                style={{ width: `${trust}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {items.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}>
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-orange-500 flex items-center justify-center font-bold text-black text-xs">
            أنت
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">المحقق</p>
            <p className="text-xs text-muted-foreground">متصل الآن</p>
          </div>
        </div>
      </div>
    </div>
  );
}


