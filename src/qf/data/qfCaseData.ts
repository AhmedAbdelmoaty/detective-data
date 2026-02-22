// ============================================================
// Question Framing Mini-Game — Complete Case Data
// "لعبة الأسئلة: قبل الالتزام"
// ============================================================

// --- Images (reuse existing assets) ---
import abuSaeed1 from "@/assets/scenes/abu-saeed-1.png";
import abuSaeed2 from "@/assets/scenes/abu-saeed-2.png";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";
import dataRoom from "@/assets/rooms/data-room.png";
import nouraInterview from "@/assets/scenes/noura-interview.png";
import floorImg from "@/assets/rooms/floor.png";
import storeFront from "@/assets/scenes/store-front.png";

// --- Types ---
export interface QFBoardUpdate {
  tab: "context" | "unknowns" | "structure" | "decision";
  content: string;
  structureBranch?: "visits" | "conversion" | "basket" | "availability";
}

export interface QFChoice {
  id: string;
  text: string;
  quality: "best" | "ok" | "misleading";
  timeCost: number; // seconds deducted
  trustChange: number;
  clarityChange: number;
  boardUpdates: QFBoardUpdate[];
  reaction: string; // Abu Saeed's reaction
  flagJumpedToSolution?: boolean;
}

export interface QFDialogueLine {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
}

export interface QFScene {
  id: string;
  index: number;
  title: string;
  locationTitle: string;
  backgroundImage: string;
  dialogues: QFDialogueLine[];
  choices: QFChoice[];
  supportingCharacter?: string;
}

// --- Problem Statements for Scene 6 ---
export interface QFProblemStatement {
  id: string;
  text: string;
  quality: "best" | "ok" | "misleading";
}

export interface QFGoldenQuestion {
  id: string;
  text: string;
  quality: "good" | "ok" | "weak";
}

export interface QFDecisionMapping {
  id: string;
  condition: string;
  action: string;
  quality: "good" | "ok" | "weak";
}

// --- Endings ---
export interface QFEndingDef {
  rank: "S" | "A" | "B" | "C" | "D";
  title: string;
  titleEn: string;
  abuSaeedReaction: string;
  abuSaeedMood: "happy" | "neutral" | "nervous" | "angry" | "suspicious";
  description: string;
}

// ============================================================
// SCENES DATA
// ============================================================

export const qfScenes: QFScene[] = [
  // ── Scene 0: الاستدعاء ─────────────────────────────────────
  {
    id: "scene-0",
    index: 0,
    title: "الاستدعاء",
    locationTitle: "عند الكاشير — أول لقاء",
    backgroundImage: abuSaeed1,
    dialogues: [
      { characterId: "abuSaeed", text: "أهلاً… الحمد لله إنك جيت بسرعة.", mood: "nervous" },
      { characterId: "abuSaeed", text: "أنا مضغوط اليوم… عندي التزام مهم بعد شوية ومش هقدر أقعد كتير.", mood: "nervous" },
      { characterId: "abuSaeed", text: "اللي مخوّفني إن آخر أسبوعين الصورة مش راكبة…", mood: "suspicious" },
      { characterId: "abuSaeed", text: "بحس إن المحل فيه حركة، ناس بتدخل وتقيس وتجرب…", mood: "neutral" },
      { characterId: "abuSaeed", text: "لكن في نهاية اليوم الرقم بيطلع أقل من الطبيعي.", mood: "angry" },
      { characterId: "abuSaeed", text: "وأنا مش عايز أتصرف برد فعل سريع أو ألوم حد من غير ما أفهم.", mood: "nervous" },
      { characterId: "detective", text: "أبو سعيد واضح إنه قلقان. لازم أبدأ صح… سؤال يوضّح الصورة من غير ما أضيع وقته.", mood: "neutral" },
    ],
    choices: [
      {
        id: "s0-c1",
        text: "إيه اللي اتغيّر بالظبط في آخر أسبوعين عن قبل كده؟",
        quality: "best",
        timeCost: 60,
        trustChange: 5,
        clarityChange: 15,
        boardUpdates: [
          { tab: "context", content: "تغيير ملحوظ في آخر أسبوعين — الحركة موجودة لكن الأرقام أقل" },
        ],
        reaction: "سؤال كويس… خليني أفكر. الحقيقة إن الناس لسه بتيجي، بس الرقم اللي بيطلع آخر اليوم مش زي الأول. الحركة فيها لكن الكيس مش بيمتلي.",
      },
      {
        id: "s0-c2",
        text: "هل في مشكلة مع الموظفين؟ حد مقصّر ولا فيه خلاف؟",
        quality: "misleading",
        timeCost: 90,
        trustChange: -8,
        clarityChange: 3,
        boardUpdates: [
          { tab: "context", content: "تساؤل عن أداء الموظفين (مبكر وبدون سياق)" },
        ],
        reaction: "يعني… أنا مش عايز ألوم حد. ده بالظبط اللي قلت عليه — مش عايز أتسرع. الموظفين شغّالين عادي على حسب ما أنا شايف.",
        flagJumpedToSolution: false,
      },
      {
        id: "s0-c3",
        text: "هل جربت تعمل عروض أو تخفيضات عشان تنافس؟",
        quality: "ok",
        timeCost: 75,
        trustChange: -3,
        clarityChange: 5,
        boardUpdates: [
          { tab: "context", content: "اقتراح عروض قبل فهم المشكلة" },
        ],
        reaction: "يعني ممكن… بس أنا مش متأكد إن ده الحل. عايز أفهم إيه المشكلة الأول قبل ما أصرف فلوس.",
      },
    ],
  },

  // ── Scene 1: مراية الانطباع ─────────────────────────────────
  {
    id: "scene-1",
    index: 1,
    title: "مراية الانطباع",
    locationTitle: "عند الكاشير — فهم الهيكل",
    backgroundImage: abuSaeed2,
    dialogues: [
      { characterId: "abuSaeed", text: "يعني أنا لما بقعد أحسب… بحس إن في حاجة ناقصة بس مش عارف فين.", mood: "nervous" },
      { characterId: "abuSaeed", text: "الناس بتيجي… بتقيس… بتتفرج… بس مش كلهم بيشتروا.", mood: "suspicious" },
      { characterId: "detective", text: "لازم أفكّك الموضوع. المشكلة ممكن تكون في أكتر من حتة: الزيارات، التحويل، متوسط الفاتورة، أو توفر المنتجات.", mood: "neutral" },
    ],
    choices: [
      {
        id: "s1-c1",
        text: "خلينا نقسّم الموضوع: المشكلة في عدد الناس اللي بتدخل، ولا في نسبة اللي بتشتري، ولا في حجم الفاتورة، ولا في توفر المقاسات؟",
        quality: "best",
        timeCost: 45,
        trustChange: 8,
        clarityChange: 20,
        boardUpdates: [
          { tab: "structure", content: "عدد الزيارات", structureBranch: "visits" },
          { tab: "structure", content: "معدل التحويل (نسبة اللي بتشتري)", structureBranch: "conversion" },
          { tab: "structure", content: "متوسط حجم الفاتورة", structureBranch: "basket" },
          { tab: "structure", content: "توفر المنتجات والمقاسات", structureBranch: "availability" },
        ],
        reaction: "ده تفكير مرتّب… الحقيقة أنا حاسس إن الناس لسه بتيجي — يعني الزيارات مش المشكلة. بس الباقي… مش متأكد.",
      },
      {
        id: "s1-c2",
        text: "المبيعات قلّت بكام بالظبط؟ محتاج أرقام دقيقة.",
        quality: "ok",
        timeCost: 60,
        trustChange: 2,
        clarityChange: 10,
        boardUpdates: [
          { tab: "unknowns", content: "حجم الانخفاض الدقيق في المبيعات" },
        ],
        reaction: "تقريبًا 15 لـ 20% أقل من المعتاد… بس مش الأرقام لوحدها اللي هتحل الموضوع. عايز أفهم ليه.",
      },
      {
        id: "s1-c3",
        text: "أكيد المنافس الجديد هو السبب. شفت العروض بتاعته؟",
        quality: "misleading",
        timeCost: 90,
        trustChange: -10,
        clarityChange: 2,
        boardUpdates: [
          { tab: "context", content: "افتراض مبكر: المنافس هو السبب الرئيسي" },
        ],
        reaction: "*بيتنهد* يمكن… بس أنا مش متأكد. الموضوع بدأ قبل ما هو يعمل عروضه حتى. ياريت متستعجلش.",
        flagJumpedToSolution: true,
      },
    ],
  },

  // ── Scene 2: غرفة الأرقام ─────────────────────────────────
  {
    id: "scene-2",
    index: 2,
    title: "غرفة الأرقام",
    locationTitle: "المكتب الخلفي — الأرقام والبيانات",
    backgroundImage: dataRoom,
    dialogues: [
      { characterId: "detective", text: "أبو سعيد ودّاني المكتب الخلفي. على المكتب تقارير الأسبوعين اللي فاتوا والدفتر الشخصي بتاعه.", mood: "neutral" },
      { characterId: "abuSaeed", text: "دي التقارير… شوف بنفسك. الأرقام مش مريحة.", mood: "nervous" },
      { characterId: "detective", text: "لازم أحدد نطاق البحث. هل أطلب كل حاجة ولا أركّز على نقطة معيّنة؟", mood: "neutral" },
    ],
    choices: [
      {
        id: "s2-c1",
        text: "عايز أشوف المبيعات اليومية لآخر أسبوعين مقسّمة على الأيام — خصوصًا أيام الذروة.",
        quality: "best",
        timeCost: 50,
        trustChange: 5,
        clarityChange: 18,
        boardUpdates: [
          { tab: "context", content: "طلب بيانات يومية مع تركيز على أيام الذروة (الجمعة/السبت)" },
          { tab: "unknowns", content: "هل الانخفاض في أيام معيّنة أو عام؟" },
        ],
        reaction: "أيوه، الجمعة والسبت هم أكتر أيام. خليني أطلّعلك الأرقام… فعلاً الجمعة بالذات الرقم بيبان أقل من المتوقع.",
      },
      {
        id: "s2-c2",
        text: "طلّعلي كل التقارير بتاعة الشهر ده — المبيعات والمصاريف والمخزون وكل حاجة.",
        quality: "misleading",
        timeCost: 120,
        trustChange: -5,
        clarityChange: 5,
        boardUpdates: [
          { tab: "context", content: "طلب بيانات شاملة (data dump) — وقت كبير بدون تركيز" },
        ],
        reaction: "طيب… هيّا نطلّع كل حاجة. بس ده هياخد وقت كبير وأنا عندي التزام… *بيبان عليه التوتر*",
      },
      {
        id: "s2-c3",
        text: "هل في أيام معيّنة المشكلة بتظهر فيها أكتر من غيرها؟",
        quality: "ok",
        timeCost: 55,
        trustChange: 3,
        clarityChange: 12,
        boardUpdates: [
          { tab: "unknowns", content: "تساؤل عن الأيام — بدون تحديد ذروة" },
        ],
        reaction: "يعني… أنا حاسس إن الجمعة فيها مشكلة أكتر. بس مش متأكد 100%.",
      },
      {
        id: "s2-c4",
        text: "إيه أكتر المنتجات اللي بتتباع؟ عايز أعرف التصنيف.",
        quality: "ok",
        timeCost: 60,
        trustChange: 1,
        clarityChange: 8,
        boardUpdates: [
          { tab: "unknowns", content: "تساؤل عن المنتجات الأكثر مبيعًا" },
        ],
        reaction: "الفساتين والبلوزات هم الأساس… بس مش شايف إن المنتج نفسه هو المشكلة.",
      },
    ],
  },

  // ── Scene 3: الكاشير (with نورة) ─────────────────────────
  {
    id: "scene-3",
    index: 3,
    title: "الكاشير",
    locationTitle: "عند الكاشير — نورة",
    backgroundImage: nouraInterview,
    supportingCharacter: "noura",
    dialogues: [
      { characterId: "abuSaeed", text: "تعال أعرّفك على نورة… هي اللي عالكاشير.", mood: "neutral" },
      { characterId: "noura", text: "أهلاً… أنا هنا من سنتين، الحمد لله.", mood: "neutral" },
      { characterId: "detective", text: "نورة ممكن تكون عندها معلومات مهمة عن حركة الشراء عند نقطة الدفع.", mood: "neutral" },
      { characterId: "abuSaeed", text: "اسألها اللي عايزه… بس الوقت ماشي.", mood: "nervous" },
    ],
    choices: [
      {
        id: "s3-c1",
        text: "يا نورة، يوم الجمعة من 9 لـ 10 بالليل — هل بيحصل زحمة عند الكاشير والناس بتستنى؟",
        quality: "best",
        timeCost: 40,
        trustChange: 6,
        clarityChange: 22,
        boardUpdates: [
          { tab: "structure", content: "زحمة الكاشير وقت الذروة (الجمعة 9-10م) — سبب محتمل لانخفاض التحويل", structureBranch: "conversion" },
          { tab: "unknowns", content: "هل وقت الانتظار بيخلّي الناس تمشي؟" },
        ],
        reaction: "آه والله! يوم الجمعة بالذات بيكون في طابور… وأنا لوحدي. في ناس بتسيب البضاعة وتمشي.",
      },
      {
        id: "s3-c2",
        text: "إيه رأيك في شغلك هنا؟ مبسوطة؟",
        quality: "misleading",
        timeCost: 70,
        trustChange: -4,
        clarityChange: 2,
        boardUpdates: [
          { tab: "context", content: "سؤال عام عن رضا الموظفة (غير مركّز)" },
        ],
        reaction: "يعني الحمد لله… الشغل كويس. بس مش فاهمة إيه علاقة ده بالموضوع؟",
      },
      {
        id: "s3-c3",
        text: "هل بتلاحظي ناس بتمشي من المحل من غير ما تشتري؟",
        quality: "ok",
        timeCost: 50,
        trustChange: 2,
        clarityChange: 10,
        boardUpdates: [
          { tab: "unknowns", content: "ملاحظة: ناس بتمشي من غير شراء (بدون تحديد سبب)" },
        ],
        reaction: "أيوه… بيحصل كتير. بس أنا مش عارفة ليه بالظبط. يمكن مش لاقيين مقاسهم أو مش عايزين يستنوا.",
      },
    ],
  },

  // ── Scene 4: غرفة المقاسات (with خالد) ─────────────────────
  {
    id: "scene-4",
    index: 4,
    title: "غرفة المقاسات",
    locationTitle: "في الصالة — خالد مدير الصالة",
    backgroundImage: floorImg,
    supportingCharacter: "khaled",
    dialogues: [
      { characterId: "abuSaeed", text: "ده خالد… مدير الصالة. هو اللي بيتابع المعروضات والمقاسات.", mood: "neutral" },
      { characterId: "khaled", text: "أهلاً. أنا بحاول أخلّي كل حاجة مرتبة بس ساعات الضغط بيكون كبير.", mood: "nervous" },
      { characterId: "detective", text: "خالد ممكن يكون عنده معلومة مهمة عن المخزون والمقاسات.", mood: "neutral" },
    ],
    choices: [
      {
        id: "s4-c1",
        text: "يا خالد، هل في مقاسات معيّنة زي M أو L بتخلص بسرعة في المنتجات اللي عليها طلب؟",
        quality: "best",
        timeCost: 40,
        trustChange: 7,
        clarityChange: 22,
        boardUpdates: [
          { tab: "structure", content: "نقص مقاسات M/L في 3 منتجات رائجة — سبب محتمل لعدم الشراء", structureBranch: "availability" },
          { tab: "unknowns", content: "هل النقص بيحصل في نص الأسبوع ولا في الذروة؟" },
        ],
        reaction: "آه طبعًا! الفساتين المُنقّطة وبلوزة الساتان — المقاس M و L بيخلصوا من يوم الأربعاء وبنفضل من غيرهم لآخر الأسبوع!",
      },
      {
        id: "s4-c2",
        text: "المخزون كويس ولا في مشاكل؟",
        quality: "ok",
        timeCost: 55,
        trustChange: 1,
        clarityChange: 8,
        boardUpdates: [
          { tab: "unknowns", content: "سؤال عام عن المخزون — بدون تخصيص" },
        ],
        reaction: "يعني عمومًا كويس… بس ساعات بنحس إن حاجات معيّنة بتخلص بسرعة.",
      },
      {
        id: "s4-c3",
        text: "الزبائن بيشتكوا من حاجة معيّنة؟",
        quality: "ok",
        timeCost: 60,
        trustChange: 0,
        clarityChange: 6,
        boardUpdates: [
          { tab: "context", content: "سؤال عن شكاوى الزبائن (غير محدد)" },
        ],
        reaction: "مش كتير… بس ساعات حد بيسأل على مقاس ومش بنلاقيه. ده بيحصل.",
      },
    ],
  },

  // ── Scene 5: الشارع والمنافس ──────────────────────────────
  {
    id: "scene-5",
    index: 5,
    title: "الشارع والمنافس",
    locationTitle: "من شباك المحل — نظرة على الشارع",
    backgroundImage: storeFront,
    dialogues: [
      { characterId: "abuSaeed", text: "شوف من الشباك… المحل اللي قدامنا عامل بنرات وعروض ضخمة.", mood: "suspicious" },
      { characterId: "abuSaeed", text: "ناس كتير بتروح هناك. أنا خايف يكون هو السبب.", mood: "nervous" },
      { characterId: "detective", text: "السؤال المهم: هل الانخفاض بدأ قبل عروض المنافس ولا بعدها؟ لازم أفصل بين الافتراض والحقيقة.", mood: "neutral" },
    ],
    choices: [
      {
        id: "s5-c1",
        text: "هل الانخفاض في مبيعاتك بدأ قبل ما المنافس يعمل العروض دي ولا بعدها؟",
        quality: "best",
        timeCost: 45,
        trustChange: 8,
        clarityChange: 18,
        boardUpdates: [
          { tab: "context", content: "الانخفاض بدأ قبل عروض المنافس بأسبوع — المنافس مش السبب الرئيسي" },
          { tab: "structure", content: "المنافس = ضوضاء وليس السبب الجذري", structureBranch: "visits" },
        ],
        reaction: "لما بفكر فيها… الحقيقة الأرقام بدأت تقل من قبل ما هو يفتح العروض. يعني أسبوع قبله تقريبًا. غريبة…",
      },
      {
        id: "s5-c2",
        text: "لازم نعمل عروض أحسن من المنافس فورًا!",
        quality: "misleading",
        timeCost: 80,
        trustChange: -8,
        clarityChange: 0,
        boardUpdates: [
          { tab: "decision", content: "قفز للحل: عروض مضادة (بدون فهم السبب الحقيقي)" },
        ],
        reaction: "يعني ممكن… بس أنا قلتلك مش عايز أتصرف من غير ما أفهم. ده بالظبط اللي بحاول أتجنبه.",
        flagJumpedToSolution: true,
      },
      {
        id: "s5-c3",
        text: "هل سمعت زبائنك بيقولوا إنهم رايحين المنافس بدالك؟",
        quality: "ok",
        timeCost: 55,
        trustChange: 0,
        clarityChange: 8,
        boardUpdates: [
          { tab: "unknowns", content: "شكاوى الزبائن عن المنافس — معلومة قصصية غير مؤكدة" },
        ],
        reaction: "مش كتير الحقيقة… واحدة بس قالت إنها شافت عروض هناك. بس ما اشترتش منه برضو.",
      },
    ],
  },

  // ── Scene 6: الإغلاق (handled by QFClosingScene) ──────────
  {
    id: "scene-6",
    index: 6,
    title: "الإغلاق قبل الالتزام",
    locationTitle: "المكتب الخلفي — اللحظة الأخيرة",
    backgroundImage: abuSaeed4,
    dialogues: [
      { characterId: "abuSaeed", text: "خلاص… وقتي خلص تقريبًا. قبل ما أمشي عايز أفهم: إنت فهمت إيه؟", mood: "nervous" },
      { characterId: "abuSaeed", text: "عايزك تقولي المشكلة إيه بالظبط… وإيه الأسئلة اللي لازم نتحقق منها… ولو الإجابة طلعت كذا نعمل إيه.", mood: "neutral" },
      { characterId: "detective", text: "ده وقت التأطير النهائي. لازم أجمّع كل اللي اتعلمته وأقدّم صورة واضحة.", mood: "neutral" },
    ],
    choices: [], // Scene 6 uses the Closing component instead of regular choices
  },
];

// ============================================================
// CLOSING SCENE DATA (Scene 6)
// ============================================================

export const qfProblemStatements: QFProblemStatement[] = [
  {
    id: "ps-1",
    text: "المبيعات انخفضت بسبب انخفاض معدل التحويل — تحديدًا بسبب زحمة الكاشير في أوقات الذروة وعدم توفر مقاسات رئيسية في المنتجات الرائجة.",
    quality: "best",
  },
  {
    id: "ps-2",
    text: "المبيعات انخفضت بسبب المنافس الجديد واللي لازم نعمل عروض أقوى منه.",
    quality: "misleading",
  },
  {
    id: "ps-3",
    text: "المبيعات انخفضت ومحتاجين نحلل البيانات أكتر عشان نفهم.",
    quality: "ok",
  },
];

export const qfGoldenQuestions: QFGoldenQuestion[] = [
  {
    id: "gq-1",
    text: "هل معدل التحويل يوم الجمعة من 9 لـ 10 بالليل أقل بشكل ملحوظ من باقي الأوقات؟",
    quality: "good",
  },
  {
    id: "gq-2",
    text: "هل المقاسات M و L في أكتر 3 منتجات رائجة بتخلص قبل يوم الخميس؟",
    quality: "good",
  },
  {
    id: "gq-3",
    text: "هل متوسط وقت الانتظار عند الكاشير في ساعات الذروة بيزيد عن 5 دقايق؟",
    quality: "good",
  },
  {
    id: "gq-4",
    text: "هل المنافس بيسحب زبائننا ولا الزيارات لسه ثابتة؟",
    quality: "weak",
  },
  {
    id: "gq-5",
    text: "هل الموظفين مبسوطين في شغلهم؟",
    quality: "weak",
  },
  {
    id: "gq-6",
    text: "هل عدد الزيارات اليومية اتغيّر في آخر أسبوعين؟",
    quality: "ok",
  },
];

export const qfDecisionMappings: QFDecisionMapping[] = [
  {
    id: "dm-1",
    condition: "لو وقت الانتظار عند الكاشير أكتر من 5 دقايق في الذروة",
    action: "أضف كاشير ثاني أو نظام دفع سريع في ساعات الذروة",
    quality: "good",
  },
  {
    id: "dm-2",
    condition: "لو المقاسات M/L بتخلص قبل نهاية الأسبوع",
    action: "اطلب مخزون إضافي من المقاسات الرائجة ونظام تنبيه مبكر",
    quality: "good",
  },
  {
    id: "dm-3",
    condition: "لو المنافس هو السبب الرئيسي",
    action: "اعمل عروض تنافسية أقوى",
    quality: "weak",
  },
  {
    id: "dm-4",
    condition: "لو المبيعات مش بتتحسن خلال أسبوعين",
    action: "غيّر الموظفين أو قلّل المصاريف",
    quality: "weak",
  },
  {
    id: "dm-5",
    condition: "لو الزيارات قلّت فعلاً",
    action: "اعمل حملة تسويقية لجذب زبائن جدد",
    quality: "ok",
  },
];

// ============================================================
// ENDINGS
// ============================================================

export const qfEndings: QFEndingDef[] = [
  {
    rank: "S",
    title: "تأطير ذهبي",
    titleEn: "Golden Framing",
    abuSaeedReaction: "ما شاء الله… أول مرة حد يفهمني كده. أنا دلوقتي عارف بالظبط إيه اللي لازم أتحقق منه قبل ما أتصرف. شكرًا يا بطل.",
    abuSaeedMood: "happy",
    description: "قدرت تبني إطار واضح للمشكلة، وسألت الأسئلة الصح، وربطت القرار بالنتيجة. أبو سعيد ماشي مرتاح ومعاه خطة.",
  },
  {
    rank: "A",
    title: "جيد لكنه ناقص",
    titleEn: "Good but Incomplete",
    abuSaeedReaction: "كويس… أنا فهمت حاجات مهمة. بس حاسس إن لسه في جزء مش واضح. هحاول أكمّل بنفسي. شكرًا.",
    abuSaeedMood: "neutral",
    description: "الهيكل كويس لكن فاتك فرع مهم أو الأسئلة مش كلها محددة. النتيجة مقبولة بس ممكن أحسن.",
  },
  {
    rank: "B",
    title: "بيانات بلا قرار",
    titleEn: "Data Without Decision",
    abuSaeedReaction: "يعني… أنا عندي معلومات كتير دلوقتي بس مش عارف أعمل إيه بيها. كنت عايز أطلع من هنا بخطة واضحة.",
    abuSaeedMood: "nervous",
    description: "جمعت ملاحظات كتير لكن ما ربطتش بين البيانات والقرار. أبو سعيد ماشي بمعلومات بدون خطوة واضحة.",
  },
  {
    rank: "C",
    title: "قفز للحل",
    titleEn: "Jumped to Solution",
    abuSaeedReaction: "أنا كنت خايف من كده بالظبط… إنك تقولي الحل من غير ما تفهم المشكلة. أنا قلتلك مش عايز أتسرع. للأسف مش مطمّن.",
    abuSaeedMood: "angry",
    description: "افترضت السبب من البداية (المنافس أو الموظفين) وما بنيتش إطار. أبو سعيد مش مقتنع وهيتصرف لوحده.",
  },
  {
    rank: "D",
    title: "انتهى الوقت",
    titleEn: "Time's Up",
    abuSaeedReaction: "معلش… أنا لازم أمشي دلوقتي. يمكن في وقت تاني إن شاء الله. بس الحقيقة أنا لسه زي ما أنا… مش فاهم.",
    abuSaeedMood: "nervous",
    description: "الوقت خلص قبل ما توصل لنتيجة واضحة. أبو سعيد ماشي بدون إطار ولا خطة.",
  },
];

// ============================================================
// HELPER: shuffle choices
// ============================================================
export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
