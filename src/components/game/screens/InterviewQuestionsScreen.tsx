import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { HYPOTHESES } from "@/data/case1";
import storeOfficeImg from "@/assets/rooms/office-room.png";

type Axis = "price" | "inventory" | "competition";

type OptionKind = "strong" | "weak" | "strike";

type Option = {
  id: string;
  kind: OptionKind;
  text: string;
  // Axis to rule out when choosing this option (only for strong)
  rulesOut?: Axis;
};

type Round = {
  id: string;
  prompt: string;
  options: Option[];
  abuReply: (opt: Option) => string;
  // Optional extra line to keep conversation flowing
  bridge?: string;
};

interface Props {
  onComplete: () => void;
}

/**
 * InterviewQuestionsScreen
 * - 7 rounds: each has 3 options (strong / weak / strike)
 * - Two strikes => cut (restart)
 * - At end: generate 3/4/5 hypotheses automatically and store in GameContext
 */
export const InterviewQuestionsScreen = ({ onComplete }: Props) => {
  const { setGeneratedHypotheses, resetToInterview } = useGame();

  const rounds: Round[] = useMemo(() => {
    return [
      {
        id: "q1",
        prompt: "قبل أي حاجة… كلمة (الرقم أقل) عندك معناها إيه؟",
        options: [
          { id: "q1a", kind: "strong", text: "تقصد فلوس آخر اليوم؟" },
          { id: "q1b", kind: "weak", text: "الزحمة بتكون إمتى أكتر؟" },
          { id: "q1c", kind: "strike", text: "يعني في سرقة؟" },
        ],
        abuReply: (opt) => {
          if (opt.id === "q1a") return "أيوه… فلوس آخر اليوم اللي داخلة في الكاش.";
          if (opt.id === "q1b") return "بعد العصر والويك إند… بس أنا قصدي الفلوس في الآخر.";
          return "لا… من غير اتهامات. خلّينا نفهم الأول.";
        },
        bridge: "تمام… كمّل." ,
      },
      {
        id: "q2",
        prompt: "الفلوس أقل… مقارنة بإيه؟",
        options: [
          { id: "q2a", kind: "strong", text: "بتقارنها بآخر شهرين؟" },
          { id: "q2b", kind: "weak", text: "بتحصل كل يوم؟" },
          { id: "q2c", kind: "strike", text: "يبقى المشكلة في الموظفين." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q2a") return "آه… آخر شهرين تقريبًا. كنت ماشي على متوسط ثابت.";
          if (opt.id === "q2b") return "مش كل يوم… يوم كويس ويوم أقل… بس المتوسط نازل.";
          return "أنا مش عايز أحكم على حد قبل ما يبقى في دليل.";
        },
        bridge: "طيب." ,
      },
      {
        id: "q3",
        prompt: "وقت ما الموضوع بدأ… حصل تغيير واضح؟",
        options: [
          { id: "q3a", kind: "strong", text: "حصل تغيير كبير في الشغل؟" },
          { id: "q3b", kind: "weak", text: "ابتدت إمتى بالظبط؟" },
          { id: "q3c", kind: "strike", text: "أكيد منافس فتح." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q3a") return "مفيش انقلاب كبير… لا نقلنا ولا قفلنا ساعات. في شوية حاجات بسيطة بس.";
          if (opt.id === "q3b") return "خلّينا نقول حوالي تلات أسابيع.";
          return "ممكن… وممكن لأ. ماينفعش نحكم بدري.";
        },
        bridge: "تمام." ,
      },
      {
        id: "q4",
        prompt: "السعر… هل اتغير؟",
        options: [
          { id: "q4a", kind: "strong", text: "في زيادة أسعار/خصم كبير؟", rulesOut: "price" },
          { id: "q4b", kind: "weak", text: "الناس بتشتكي من الغلا؟" },
          { id: "q4c", kind: "strike", text: "يبقى الأسعار غليت." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q4a") return "لا… الأسعار ثابتة تقريبًا. ومفيش خصومات تقيلة.";
          if (opt.id === "q4b") return "مش شايف شكوى واضحة… زي أي وقت يعني.";
          return "مش بالبساطة دي.";
        },
        bridge: "طيب." ,
      },
      {
        id: "q5",
        prompt: "البضاعة… الناس بتلاقي اللي عايزاه؟",
        options: [
          { id: "q5a", kind: "strong", text: "في نقص مقاسات/مخزون؟", rulesOut: "inventory" },
          { id: "q5b", kind: "weak", text: "موديلات معينة بتتسأل؟" },
          { id: "q5c", kind: "strike", text: "يبقى المخزون ناقص." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q5a") return "بشكل عام المخزون كويس… ممكن مقاس يخلص يوم زحمة بس مش مشكلة عامة.";
          if (opt.id === "q5b") return "بتختلف… يوم ده ويوم ده. صعب أحدد.";
          return "ممكن… بس مش عايز أقررها كده.";
        },
        bridge: "تمام." ,
      },
      {
        id: "q6",
        prompt: "برّه المحل… هل في عامل خارجي واضح؟",
        options: [
          { id: "q6a", kind: "strong", text: "في منافس قوي/السوق هدي؟", rulesOut: "competition" },
          { id: "q6b", kind: "weak", text: "الناس بقت أقل تشتري؟" },
          { id: "q6c", kind: "strike", text: "أكيد المنافس السبب." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q6a") return "في محلات حوالينا… بس الحركة موجودة. مش شايف السوق واقع.";
          if (opt.id === "q6b") return "ممكن… بس برضه الزحمة موجودة فمش مطمّن للتفسير ده.";
          return "ماينفعش نقفلها على كده.";
        },
        bridge: "آخر سؤال." ,
      },
      {
        id: "q7",
        prompt: "الزحمة دي معناها إيه؟",
        options: [
          { id: "q7a", kind: "strong", text: "ناس بتدخل وتمشي… ولا اللي بيشتري يشتري أقل؟" },
          { id: "q7b", kind: "weak", text: "الزحمة في أيام معينة؟" },
          { id: "q7c", kind: "strike", text: "يبقى مفيش بيع." },
        ],
        abuReply: (opt) => {
          if (opt.id === "q7a") return "الاتنين موجودين… وفي نفس الوقت بقى فيه استبدالات أكتر وشفنا ضغط على الكاشير.";
          if (opt.id === "q7b") return "بعد العصر والويك إند… بس ده ما يفسرش الرقم لوحده.";
          return "لا… في بيع. بس الرقم أقل.";
        },
      },
    ];
  }, []);

  const [idx, setIdx] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [ruledOut, setRuledOut] = useState<Record<Axis, boolean>>({ price: false, inventory: false, competition: false });
  const [weakCount, setWeakCount] = useState(0);
  const [lastReply, setLastReply] = useState<string | null>(null);
  const [isCut, setIsCut] = useState(false);

  const round = rounds[idx];

  const finish = () => {
    // Base hypotheses always considered plausible after the interview
    // H1: buying less (covers basket + lower propensity)
    // H3: returns/discounts after sale (net lower)
    // H4: recording errors under pressure
    const base = ["H1", "H3", "H4"];

    const extras: string[] = [];
    if (!ruledOut.price) extras.push("H7");
    if (!ruledOut.inventory) extras.push("H6");
    if (!ruledOut.competition) extras.push("H2");

    // If player had many weak choices, keep one extra uncertainty if available.
    // Cap at 5 total.
    let target = 3;
    if (weakCount >= 2) target = 4;
    if (weakCount >= 4) target = 5;

    // Always ensure H3 is present in base already.
    const selected: string[] = [...base];
    for (const e of extras) {
      if (selected.length >= target) break;
      selected.push(e);
    }
    // Safety: if still fewer than target (unlikely), just keep base.
    const finalList = selected.slice(0, Math.min(5, selected.length));

    setGeneratedHypotheses(finalList);
    onComplete();
  };

  const onPick = (opt: Option) => {
    if (isCut) return;
    setLastReply(round.abuReply(opt));

    if (opt.kind === "strike") {
      const nextStrikes = strikes + 1;
      setStrikes(nextStrikes);
      if (nextStrikes >= 2) {
        setIsCut(true);
        return;
      }
    }
    if (opt.kind === "weak") setWeakCount(c => c + 1);
    if (opt.kind === "strong" && opt.rulesOut) {
      setRuledOut(prev => ({ ...prev, [opt.rulesOut!]: true }));
    }

    // Advance after a short beat
    window.setTimeout(() => {
      setLastReply(null);
      if (idx >= rounds.length - 1) {
        finish();
      } else {
        setIdx(i => i + 1);
      }
    }, 900);
  };

  const restart = () => {
    resetToInterview();
    setIdx(0);
    setStrikes(0);
    setWeakCount(0);
    setRuledOut({ price: false, inventory: false, competition: false });
    setLastReply(null);
    setIsCut(false);
  };

  const header = (
    <div className="text-center mb-5">
      <h1 className="text-2xl font-bold text-foreground">مقابلة أبو سعيد</h1>
      <p className="text-muted-foreground text-sm mt-1">اختار سؤال واحد في كل خطوة. اسأل صح عشان تنفي أسباب وتضيّق الدائرة.</p>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground">خطوة {idx + 1}/{rounds.length}</span>
        <span className={"px-2 py-1 rounded-full " + (strikes === 0 ? "bg-emerald-500/15 text-emerald-200" : strikes === 1 ? "bg-yellow-500/15 text-yellow-200" : "bg-red-500/15 text-red-200")}
        >
          strikes: {strikes}/2
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={storeOfficeImg} alt="Office" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {header}

        <div className="bg-background/10 border border-white/10 rounded-2xl p-5">
          <p className="text-foreground text-lg leading-relaxed text-right">{round.prompt}</p>

          <div className="mt-4 grid gap-2">
            {round.options.map((opt) => (
              <motion.button
                key={opt.id}
                onClick={() => onPick(opt)}
                disabled={!!lastReply || isCut}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-right px-4 py-3 rounded-xl border transition-all ${
                  lastReply || isCut
                    ? "bg-muted/20 border-white/10 opacity-80"
                    : "bg-card/30 border-white/10 hover:border-primary/40"
                }`}
              >
                <span className="text-foreground text-sm leading-relaxed">{opt.text}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {lastReply && (
              <motion.div
                className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 text-right"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
              >
                <p className="text-muted-foreground text-xs mb-1">أبو سعيد:</p>
                <p className="text-foreground text-sm leading-relaxed">{lastReply}</p>
                {round.bridge && <p className="text-muted-foreground text-xs mt-2">{round.bridge}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {isCut && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-right">
              <p className="text-red-200 font-bold mb-1">أبو سعيد:</p>
              <p className="text-red-100 text-sm leading-relaxed">
                معلش… بالطريقة دي مش هنوصل لحاجة. عندي اجتماع دلوقتي… هنقف هنا.
              </p>
              <div className="mt-3 flex gap-2 justify-end">
                <button onClick={restart} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold">
                  جرّب تاني
                </button>
              </div>
            </div>
          )}

          {!isCut && idx === rounds.length - 1 && !lastReply && (
            <div className="mt-4 text-center text-muted-foreground text-xs">
              جاري إنهاء المقابلة…
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-right">
          <p>ملاحظة: الفرضيات اللي هتطلع بعد المقابلة بتتحدد حسب اللي اتنفى واللي فضل مفتوح.</p>
          <p className="mt-1">مش لازم تكون متأكد… المهم إنك تسأل صح وتضيّق الدائرة.</p>
        </div>

        <div className="mt-3 text-xs text-muted-foreground text-right opacity-90">
          <p>
            <span className="font-bold">الفرضيات المحتملة:</span> {HYPOTHESES.length} (هتدخل التحليل بـ 3–5 حسب أسئلتك)
          </p>
        </div>
      </div>
    </div>
  );
};
