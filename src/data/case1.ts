// Case 001: قضية Fashion House - لغز المبيعات
// لعبة تحليل بيانات تفاعلية - سيناريو جديد

// ============================================
// معلومات القضية
// ============================================

export const CASE_INFO = {
  id: "case-001",
  title: "قضية Fashion House",
  titleEn: "Fashion House Mystery",
  difficulty: "beginner",
  description: "أسبوع غريب…المتجر شكله شغال… بس الأرقام بتقول حكاية تانية.",
  date: "السبت 21 فبراير 2026",
  problemWeek: "14–20 فبراير 2026",
  previousWeek: "7–13 فبراير 2026",
  briefing: `هتبدأ بمقابلة صاحب المتجر علشان تسمع الصورة كاملة منه.
بعد كده هتجمع معلوماتك من التقارير والمستندات،
ومن كلام الموظفين والزبائن جوّه المتجر.
رتّب كل اللي قدامك وبعدها اختبر الفرضيات لحد ما توصل للسبب الحقيقي. `,
  summary: "فيه انخفاض في صافي المبيعات رغم حركة موجودة في المتجر. المشكلة بدأت من السبت 14 فبراير.",
};

// ============================================
// الفرضيات الثمانية
// ============================================

export interface Hypothesis {
  id: string;
  text: string;
  description: string;
  isCorrect: boolean;
  category: "primary" | "secondary";
}

export const HYPOTHESES: Hypothesis[] = [
  {
    id: "H1",
    text: "الزباين بقت تشتري أقل",
    description: "سلة الشراء / عدد القطع في الفاتورة أقل",
    isCorrect: false,
    category: "primary",
  },
  {
    id: "H2",
    text: "منافس قريب بيسحب جزء من الشراء",
    description: "عروض وإعلانات مغرية من محل مجاور",
    isCorrect: false,
    category: "primary",
  },
  {
    id: "H3",
    text: "مرتجعات/خصومات بعد البيع",
    description: "مرتجعات وخصومات بتخلي الصافي أقل",
    isCorrect: true,
    category: "primary",
  },
  {
    id: "H4",
    text: "أخطاء تسجيل وقت الذروة",
    description: "وقت الزحمة بيحصل لخبطة: حاجة ما بتتسجلش أو بتتلغى بالغلط",
    isCorrect: false,
    category: "primary",
  },
  {
    id: "H5",
    text: "الموسم هادي والطلب أضعف",
    description: "الطلب أقل طبيعياً في الفترة دي",
    isCorrect: false,
    category: "secondary",
  },
  {
    id: "H6",
    text: "نقص مقاسات/مخزون",
    description: "الزبون عايز بس مش لاقي مقاسه",
    isCorrect: false,
    category: "secondary",
  },
  {
    id: "H7",
    text: "الأسعار مش مناسبة",
    description: "الناس بتتراجع بسبب السعر",
    isCorrect: false,
    category: "secondary",
  },
  {
    id: "H8",
    text: "سرقة/تلف ملحوظ",
    description: "حاجة بتقلل الإيراد من غير ما حد يحس",
    isCorrect: false,
    category: "secondary",
  },
];

// ============================================
// مشاهد أبو سعيد (4 مشاهد افتتاحية)
// ============================================

export interface SceneDialogue {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
}

export interface IntroScene {
  id: string;
  backgroundImage: string; // placeholder for now
  dialogues: SceneDialogue[];
}

export const INTRO_SCENES: IntroScene[] = [
  {
    id: "scene-1",
    backgroundImage: "scene-1",
    dialogues: [
      { characterId: "abuSaeed", text: "أهلًا يا أستاذ… نورت. اتفضل اقعد.", mood: "neutral" },
      { characterId: "abuSaeed", text: "تحب تشرب شاي ولا قهوة؟… خلّينا نقعد دقيقتين.", mood: "neutral" },
      {
        characterId: "abuSaeed",
        text: "أنا عندي اجتماع بعد شوية… بس الموضوع ده مقلقني ومش عايز أسيبه للظن.",
        mood: "neutral",
      },
      {
        characterId: "abuSaeed",
        text: "بقالي فترة ألاحظ حاجة غريبة: المحل زحمة والناس داخلة… بس لما أقفل اليوم بلاقي فلوس اليوم أقل من الطبيعي.",
        mood: "neutral",
      },
      {
        characterId: "abuSaeed",
        text: "اتكررت أكتر من مرة… فقلت أكلمك قبل ما أفسّرها على مزاجي.",
        mood: "neutral",
      },
    ],
  },
  {
    id: "scene-2",
    backgroundImage: "scene-2",
    dialogues: [
      {
        characterId: "abuSaeed",
        text: "أنا مش عايز اتهامات ولا حلول سريعة… عايز نفهم بهدوء. اللي يثبت بالأرقام نمشي بيه.",
        mood: "neutral",
      },
      {
        characterId: "abuSaeed",
        text: "اسأل اللي محتاجه… وأنا هجاوب على قد اللي أعرفه.",
        mood: "neutral",
      },
    ],
  },
];

// ============================================
// الشخصيات
// ============================================

export interface InterviewDialogue {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
}

export interface GameCharacter {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  avatarCharacterId: "detective" | "ahmed" | "sara" | "karim" | "abuSaeed" | "khaled" | "noura" | "umFahd";
  dialogues: InterviewDialogue[];
  interviewId: string; // evidence ID for notebook
}

export const CHARACTERS: GameCharacter[] = [
  {
    id: "abuSaeed",
    name: "أبو سعيد",
    nameEn: "Abu Saeed",
    role: "صاحب المحل",
    roleEn: "Shop Owner",
    avatarCharacterId: "abuSaeed",
    dialogues: [],
    interviewId: "",
  },
  {
    id: "khaled",
    name: "خالد",
    nameEn: "Khaled",
    role: "مدير الصالة",
    roleEn: "Floor Manager",
    avatarCharacterId: "khaled",
    interviewId: "I1",
    dialogues: [
      {
        characterId: "detective",
        text: "خالد، أبو سعيد قال لي إنك ماسك الصالة. إيه ملاحظاتك الفترة دي؟",
        mood: "neutral",
      },
      {
        characterId: "khaled",
        text: "أهلاً… أنا خالد، ماسك الصالة. الحركة موجودة والحمد لله.",
        mood: "happy",
      },
      {
        characterId: "khaled",
        text: "بصراحة… فيه أيام بحس الناس بتقيس قطع وموديلات كتير… بس لما ييجوا يدفعوا… بيطلعوا بحاجة أقل من المعتاد.",
        mood: "suspicious",
        isSaveable: true,
        saveId: "I1",
        saveText: "خالد: الناس بتقيس كتير بس بتطلع بحاجة أقل من المعتاد",
      },
      { characterId: "detective", text: "يعني إيه بالظبط 'أقل'؟", mood: "neutral" },
      {
        characterId: "khaled",
        text: "يعني… تقيس كذا موديل… وبالآخر تمشي بقطعة أو اتنين. ده اللي بيبانلي.",
        mood: "neutral",
      },
    ],
  },
  {
    id: "noura",
    name: "نورة",
    nameEn: "Noura",
    role: "الكاشير",
    roleEn: "Cashier",
    avatarCharacterId: "noura",
    interviewId: "I2",
    dialogues: [
      { characterId: "detective", text: "نورة، أبو سعيد قال إنك على الكاشير. إزاي الشغل معاكي؟", mood: "neutral" },
      {
        characterId: "noura",
        text: "أهلاً… أنا نورة. لو عايز أي أرقام أو ورق من الجهاز قول لي.",
        mood: "happy",
      },
      {
        characterId: "noura",
        text: "الضغط بيزيد آخر اليوم… ساعات الجهاز بيبطّأ… وساعات بنعيد المحاولة… بس بنكمل.",
        mood: "nervous",
        isSaveable: true,
        saveId: "I2",
        saveText: "نورة: الضغط بيزيد آخر اليوم، ساعات الجهاز بيبطأ وبتعيد المحاولة",
      },
      { characterId: "detective", text: "يعني بيضيع تسجيل؟", mood: "neutral" },
      {
        characterId: "noura",
        text: "مش بقول بيضيع… بس بقول السرعة بتخلّي الواحد يبقى لازم يركز.",
        mood: "nervous",
      },
    ],
  },
  {
    id: "amira",
    name: "أميرة",
    nameEn: "Amira",
    role: "زبونة",
    roleEn: "Customer",
    avatarCharacterId: "umFahd",
    interviewId: "I3",
    dialogues: [
      { characterId: "detective", text: "أهلاً، ممكن أسألك عن المحل اللي جنب؟ اللي عاملين عروض؟", mood: "neutral" },
      {
        characterId: "umFahd",
        text: "أنا كنت لسه معدّية على المحل اللي جنبكم… اللي عاملين عليه لافتة عروض. قلت أجرب… بس بصراحة مش زي ما كنت متخيلة.",
        mood: "neutral",
      },
      { characterId: "detective", text: "يعني إيه؟", mood: "neutral" },
      {
        characterId: "umFahd",
        text: "العرض طلع على موديلات محددة… ومقاسات محددة كمان. وفيه شرط شراء حد أدنى… يعني مش أي حد داخل هيستفيد.",
        mood: "neutral",
        isSaveable: true,
        saveId: "I3",
        saveText: "زبونة: عروض المنافس محدودة على موديلات معينة وفيها شرط حد أدنى",
      },
    ],
  },
];

// ============================================
// الأدلة (Evidence Room)
// ============================================

export interface Evidence {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: "table" | "report" | "document" | "review" | "brochure" | "note";
  saveText: string;
  saveId: string;
  room: "evidence" | "dashboard";
  data: any;
  isNoise?: boolean;
}

export const EVIDENCE_ITEMS: Evidence[] = [
  // K1 - سجل الأسعار
  {
    id: "K1",
    name: "سجل تحديثات الأسعار",
    icon: "💰",
    description: "سجل آخر تعديل أسعار (3 شهور)",
    type: "table",
    saveId: "K1",
    saveText: "سجل الأسعار: لا توجد تعديلات أسعار منذ 3 شهور",
    room: "evidence",
    data: {
      rows: [
        { item: "بنطلون جينز (موديل A)", price: 450, lastUpdate: "2025-11-22" },
        { item: "بلوزة قطن", price: 220, lastUpdate: "2025-12-05" },
        { item: "جاكيت جينز", price: 850, lastUpdate: "2025-11-18" },
        { item: "ترنج أطفال", price: 400, lastUpdate: "2025-12-01" },
        { item: "قميص", price: 300, lastUpdate: "2025-11-30" },
        { item: "تيشرت قطن", price: 250, lastUpdate: "2025-11-30" },
      ],
      note: "لا توجد تعديلات أسعار منذ 3 شهور.",
    },
  },
  // K2 - القطع المباعة حسب الصنف (يظهر في Data Room)
  {
    id: "K2",
    name: "القطع المباعة حسب الصنف",
    icon: "📊",
    description: "مقارنة القطع المباعة حسب الصنف بين أسبوعين",
    type: "table",
    saveId: "K2",
    saveText: "القطع المباعة حسب الصنف: الأرقام شبه ثابتة بين الأسبوعين (120→116, 74→73...)",
    room: "dashboard",
    data: {
      rows: [
        { item: "تيشيرتات قطن", prev: 120, current: 116 },
        { item: "جينز", prev: 74, current: 73 },
        { item: "عبايات", prev: 52, current: 50 },
        { item: "ترينجات", prev: 63, current: 61 },
        { item: "جاكيتات", prev: 28, current: 30 },
        { item: "بلوزة قطن", prev: 35, current: 34 },
      ],
    },
  },
  // K3 - بروشور المنافس
  {
    id: "K3",
    name: "بروشور عروض المنافس",
    icon: "🏪",
    description: "إعلان المحل المجاور عن عروض",
    type: "brochure",
    saveId: "K3",
    saveText: "بروشور المنافس: خصومات شتوية لحد 40% على مختارات + عروض أسبوعية",
    room: "evidence",
    data: {
      title: "خصومات شتوية 🎉",
      subtitle: "خصم لحد 40% على مختارات",
      details: "عروض أسبوعية",
      note: "اسأل داخل المحل عن التفاصيل",
    },
  },
  // K4 - ملخص بعد البيع
  {
    id: "K4",
    name: "ملخص بعد البيع",
    icon: "📋",
    description: "ملخص المرتجعات والخصومات لأسبوعين",
    type: "table",
    saveId: "K4",
    saveText: "ملخص بعد البيع: المرتجعات زادت من 14 إلى 27 (قيمة من 2,900 إلى 6,500)، الخصومات زادت من 3,600 إلى 4,200",
    room: "evidence",
    data: {
      headers: ["المؤشر", "7–13 فبراير", "14–20 فبراير"],
      rows: [
        { label: "عدد المرتجعات", prev: 14, current: 27 },
        { label: "قيمة المرتجعات", prev: 2900, current: 6500 },
        { label: "إجمالي الخصومات المسجلة", prev: 3600, current: 4200 },
        { label: "الاستبدالات", prev: 9, current: 11 },
      ],
    },
  },
  // K5 - تسوية المدفوعات POS
  {
    id: "K5",
    name: "تسوية المدفوعات - POS",
    icon: "🧾",
    description: "تقرير تسوية من جهاز الكاشير (3 أيام عينة)",
    type: "table",
    saveId: "K5",
    saveText: "تسوية المدفوعات POS: 3 أيام عينة — الفرق بين الفواتير وعمليات الدفع: 0، 1، 0",
    room: "evidence",
    data: {
      title: "تسوية المدفوعات — POS",
      subtitle: "المحل: Fashion House",
      rows: [
        { date: "2026-02-16", day: "الإثنين", invoices: 82, payments: 82, diff: 0 },
        { date: "2026-02-18", day: "الأربعاء", invoices: 84, payments: 83, diff: 1 },
        { date: "2026-02-19", day: "الخميس", invoices: 86, payments: 86, diff: 0 },
      ],
    },
  },
  // K6 - ملف المخزون + الجرد
  {
    id: "K6",
    name: "ملف المخزون + الجرد",
    icon: "📦",
    description: "محضر استلام شحنة + ملخص جرد",
    type: "document",
    saveId: "K6",
    saveText: "المخزون: شحنة استُلمت 12 فبراير كاملة بدون نواقص + جرد 20 فبراير: نقص=0، تالف=2 فقط",
    room: "evidence",
    data: {
      page1: {
        title: "محضر استلام شحنة — الخميس 12 فبراير 2026",
        rows: [
          { label: "تاريخ الاستلام", value: "الخميس 12 فبراير 2026" },
          { label: "رقم الفاتورة", value: "INV-0212-778" },
          { label: "محتوى الشحنة", value: "تجديد مخزون + مقاسات أساسية (M / L / XL)" },
          { label: "تم التفريغ والعرض", value: "تم تفريغ الشحنة وترتيبها على الرفوف في نفس اليوم" },
          { label: "ملاحظات", value: "تم استلام الشحنة كاملة بدون نواقص مُسجلة" },
        ],
      },
      page2: {
        title: "ملخص جرد — الجمعة 20 فبراير 2026",
        rows: [
          { label: "عدد الأصناف المفحوصة", value: "18" },
          { label: "إجمالي القطع المفحوصة", value: "126" },
          { label: "قطع ناقصة", value: "0" },
          { label: "قطع تالفة", value: "2" },
          { label: "قيمة التالف (تقريبية)", value: "180 جنيه" },
        ],
        note: "لا يوجد نقص ملحوظ… والتالف محدود.",
      },
    },
  },
  // N1 - بوست سوشيال (ضوضاء)
  {
    id: "N1",
    name: "بوست سوشيال — المرايات",
    icon: "📱",
    description: "بوست فيسبوك/تيك توك عن مرايات المحل",
    type: "note",
    saveId: "N1",
    saveText: "بوست سوشيال: تفاعل عالي على مرايات المحل — ناس بتدخل تقيس موديلات",
    room: "evidence",
    isNoise: true,
    data: {
      content: '"المحل ده مراياته حلوة 😄"\n"دخلنا قسنا شوية موديلات…"',
      engagement: "تفاعل عالي — لايكات وتعليقات",
    },
  },
  // N2 - دفتر شكاوى (ضوضاء)
  {
    id: "N2",
    name: "دفتر شكاوى/ملاحظات",
    icon: "📝",
    description: "كشكول مفتوح فيه ملاحظات متفرقة",
    type: "note",
    saveId: "N2",
    saveText: "دفتر ملاحظات: زحمة العصر، قياس كتير، موديل مقاس L ناقص يوم الخميس، زبونة سألت عن خصم",
    room: "evidence",
    isNoise: true,
    data: {
      content: '"زحمة العصر"\n"قياس كتير"\n"موديل X مقاس L ناقص يوم الخميس"\n"زبونة سألت عن خصم"',
    },
  },
  // N3 - إيصال طلب خاص (ضوضاء)
  {
    id: "N3",
    name: "إيصال طلب خاص",
    icon: "🧾",
    description: "إيصال مطبوع لطلب خاص",
    type: "note",
    saveId: "N3",
    saveText: "إيصال طلب خاص بتاريخ 10 فبراير بقيمة 8,500 جنيه (حدث استثنائي خارج اتجاه المشكلة)",
    room: "evidence",
    isNoise: true,
    data: {
      date: "2026-02-10",
      value: "8,500 جنيه",
      type: "طلب خاص",
    },
  },
];

// ============================================
// بيانات الداشبورد (Data Room)
// ============================================

export interface DashboardItem {
  id: string;
  name: string;
  description: string;
  saveId: string;
  saveText: string;
  type: "bar" | "line" | "grouped-bar" | "table";
  data: any;
}

export const DASHBOARD_DATA: DashboardItem[] = [
  // D1 - صافي المبيعات
  {
    id: "D1",
    name: "صافي المبيعات: أسبوعين",
    description: "مقارنة صافي المبيعات بين أسبوع المشكلة والأسبوع السابق",
    saveId: "D1",
    saveText: "صافي المبيعات: 7–13 فبراير: 92,400 جنيه → 14–20 فبراير: 78,600 جنيه (انخفاض واضح)",
    type: "bar",
    data: {
      labels: ["7–13 فبراير", "14–20 فبراير"],
      values: [92400, 78600],
    },
  },
  // D2 - عدد الفواتير يومياً
  {
    id: "D2",
    name: "عدد الفواتير يومياً: آخر 15 يوم",
    description: "خط بياني لعدد الفواتير اليومية — تذبذب بسيط بدون انهيار",
    saveId: "D2",
    saveText: "عدد الفواتير يومياً: شبه ثابت (82–90) — لا انهيار واضح في الحركة",
    type: "line",
    data: {
      labels: [
        "6/2",
        "7/2",
        "8/2",
        "9/2",
        "10/2",
        "11/2",
        "12/2",
        "13/2",
        "14/2",
        "15/2",
        "16/2",
        "17/2",
        "18/2",
        "19/2",
        "20/2",
      ],
      values: [86, 88, 84, 90, 87, 85, 89, 83, 86, 87, 82, 88, 84, 86, 83],
    },
  },
  // D3 - توزيع الفواتير بالساعة
  {
    id: "D3",
    name: "توزيع الفواتير حسب الساعة",
    description: "متوسط يومي خلال أسبوع المشكلة — ذروة واضحة بين 6 و10 مساءً",
    saveId: "D3",
    saveText: "توزيع الفواتير بالساعة: ذروة بين 6–8م (22 فاتورة) و8–10م (20 فاتورة)",
    type: "bar",
    data: {
      labels: ["12–2م", "2–4م", "4–6م", "6–8م", "8–10م", "باقي اليوم"],
      values: [8, 10, 14, 22, 20, 9],
    },
  },
];

// ============================================
// المراحل (Phases)
// ============================================

export interface Phase {
  index: number;
  id: string;
  label: string;
  ctaLabel: string;
  ctaTarget: string;
  unlocks: {
    dashboard?: string[];
    evidence?: string[];
    interviews?: string[];
  };
  toastMessage?: string;
  ctaMessage?: string;
  requiredViews?: {
    dashboard?: string[];
    evidence?: string[];
    interviews?: string[];
  };
  isSwapPhase?: boolean;
  // Scene system: items that belong to this phase's scene
  sceneItems?: string[];
  // The room this phase targets (for scene matching)
  targetRoom?: string;
}

export const PHASES: Phase[] = [
  // 0: مشاهد أبو سعيد
  { index: 0, id: "scenes", label: "مشاهد البداية", ctaLabel: "", ctaTarget: "scenes", unlocks: {} },
  // 1: اختيار الفرضيات
  {
    index: 1,
    id: "hypothesis-select",
    label: "اختيار الفرضيات",
    ctaLabel: "",
    ctaTarget: "hypothesis-select",
    unlocks: {},
  },
  // 2: البيانات الأولى (D1+D2) → بعدها للأدلة
  {
    index: 2,
    id: "data-1",
    label: "البيانات الأولى",
    ctaLabel: "تابع التحليل",
    ctaTarget: "evidence",
    unlocks: { dashboard: ["D1", "D2"] },
    ctaMessage: "اتفتحت ملفات في غرفة الأدلة",
    requiredViews: { dashboard: ["D1", "D2"] },
    sceneItems: ["D1", "D2"],
    targetRoom: "dashboard",
  },
  // 3: أدلة أولى (K6+N1) + تبديل فرضية إجباري → بعدها لخالد
  {
    index: 3,
    id: "evidence-1",
    label: "أدلة أولى",
    ctaLabel: "تابع التحليل",
    ctaTarget: "floor",
    unlocks: { evidence: ["K6", "N1"] },
    ctaMessage: "خالد موجود في الصالة",
    requiredViews: { evidence: ["K6"] },
    isSwapPhase: true,
    sceneItems: ["K6", "N1"],
    targetRoom: "evidence",
  },
  // 4: مقابلة خالد فقط → بعدها لنورة
  {
    index: 4,
    id: "floor-khaled",
    label: "مقابلة خالد",
    ctaLabel: "تابع التحليل",
    ctaTarget: "floor",
    unlocks: { interviews: ["khaled"] },
    ctaMessage: "نورة كمان موجودة في الصالة",
    requiredViews: { interviews: ["khaled"] },
    sceneItems: ["khaled"],
    targetRoom: "floor",
  },
  // 5: مقابلة نورة فقط → بعدها للأدلة
  {
    index: 5,
    id: "floor-noura",
    label: "مقابلة نورة",
    ctaLabel: "تابع التحليل",
    ctaTarget: "evidence",
    unlocks: { interviews: ["noura"] },
    ctaMessage: "مستندات جديدة ظهرت في غرفة الأدلة",
    requiredViews: { interviews: ["noura"] },
    sceneItems: ["noura"],
    targetRoom: "floor",
  },
  // 6: أدلة ثانية (K1+K3+N2) → بعدها للبيانات
  {
    index: 6,
    id: "evidence-2",
    label: "أدلة ثانية",
    ctaLabel: "تابع التحليل",
    ctaTarget: "dashboard",
    unlocks: { evidence: ["K1", "K3", "N2"] },
    ctaMessage: "بيانات جديدة ظهرت في غرفة البيانات",
    requiredViews: { evidence: ["K1", "K3"] },
    sceneItems: ["K1", "K3", "N2"],
    targetRoom: "evidence",
  },
  // 7: بيانات ثانية (K2+D3) → بعدها للأدلة
  {
    index: 7,
    id: "data-2",
    label: "بيانات ثانية",
    ctaLabel: "تابع التحليل",
    ctaTarget: "evidence",
    unlocks: { dashboard: ["K2", "D3"] },
    ctaMessage: "ملفات جديدة ظهرت في غرفة الأدلة",
    requiredViews: { dashboard: ["D3"], evidence: ["K2"] },
    sceneItems: ["K2", "D3"],
    targetRoom: "dashboard",
  },
  // 8: أدلة ثالثة (K5+K4+N3) → بعدها لأميرة
  {
    index: 8,
    id: "evidence-3",
    label: "أدلة ثالثة",
    ctaLabel: "تابع التحليل",
    ctaTarget: "floor",
    unlocks: { evidence: ["K5", "K4", "N3"] },
    ctaMessage: "فيه حد في الصالة عايز يقولك حاجة",
    requiredViews: { evidence: ["K5", "K4"] },
    sceneItems: ["K5", "K4", "N3"],
    targetRoom: "evidence",
  },
  // 9: مقابلة أميرة → بعدها لغرفة التحليل
  {
    index: 9,
    id: "floor-amira",
    label: "مقابلة الزبونة",
    ctaLabel: "روح غرفة التحليل",
    ctaTarget: "analysis",
    unlocks: { interviews: ["amira"] },
    ctaMessage: "خلصت جمع الأدلة… روح غرفة التحليل وابدأ المصفوفة",
    requiredViews: { interviews: ["amira"] },
    sceneItems: ["amira"],
    targetRoom: "floor",
  },
  // 10: المصفوفة والتحليل النهائي
  {
    index: 10,
    id: "matrix",
    label: "المصفوفة",
    ctaLabel: "",
    ctaTarget: "analysis",
    unlocks: {},
    targetRoom: "analysis",
  },
];

// ============================================
// المصفوفة المرجعية (Reference ACH Matrix)
// ============================================

export const REFERENCE_MATRIX: Record<string, Record<string, string>> = {
  D1: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  D2: { H1: "-", H2: "+", H3: "+", H4: "+", H5: "-", H6: "+", H7: "+", H8: "+" },
  D3: { H1: "+", H2: "+", H3: "+", H4: "++", H5: "-", H6: "+", H7: "+", H8: "+" },
  K1: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "--", H8: "+" },
  K2: { H1: "--", H2: "+", H3: "+", H4: "+", H5: "-", H6: "+", H7: "+", H8: "+" },
  K3: { H1: "+", H2: "++", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  K4: { H1: "-", H2: "-", H3: "++", H4: "-", H5: "+", H6: "+", H7: "+", H8: "+" },
  K5: { H1: "+", H2: "+", H3: "+", H4: "--", H5: "+", H6: "+", H7: "+", H8: "+" },
  K6: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "--", H7: "+", H8: "--" },
  I1: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  I2: { H1: "+", H2: "+", H3: "+", H4: "++", H5: "+", H6: "+", H7: "+", H8: "+" },
  I3: { H1: "+", H2: "-", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  N1: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  N2: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
  N3: { H1: "+", H2: "+", H3: "+", H4: "+", H5: "+", H6: "+", H7: "+", H8: "+" },
};

// ============================================
// النهايات الأربعة
// ============================================

export interface Ending {
  id: string;
  type: "excellent" | "partial" | "wrong" | "missing";
  title: string;
  rank: string;
  rankIcon: string;
  description: string;
  consequences: string[];
  score: number;
  abuSaeedDialogues: InterviewDialogue[];
  lesson: string;
}

export const ENDINGS: Ending[] = [
  {
    id: "ending-excellent",
    type: "excellent",
    title: "🏆 تحليل ممتاز!",
    rank: "محلل بيانات أسطوري",
    rankIcon: "🏆",
    description: "اكتشفت المشكلة الحقيقية وأثبتها بأدلة قوية!",
    consequences: [
      "أبو سعيد يراجع سياسة المرتجعات والخصومات",
      "يتم وضع حدود واضحة للمرتجعات",
      "يتم مراجعة الخصومات المسجلة يومياً",
      "المشكلة تنحل والصافي يرجع طبيعي",
    ],
    score: 500,
    abuSaeedDialogues: [
      {
        characterId: "detective",
        text: "أبو سعيد، بعد تحليل كل البيانات والأدلة، توصلت للسبب الحقيقي.",
        mood: "neutral",
      },
      {
        characterId: "detective",
        text: "المشكلة في المرتجعات والخصومات بعد البيع. الأرقام زادت بشكل واضح الأسبوع ده.",
        mood: "suspicious",
      },
      { characterId: "abuSaeed", text: "يعني… المرتجعات هي اللي بتاكل الصافي؟!", mood: "angry" },
      {
        characterId: "detective",
        text: "بالظبط. المرتجعات زادت من 14 لـ 27، وقيمتها من 2,900 لـ 6,500. ده بيفسر الفرق اللي بتحس بيه.",
        mood: "neutral",
      },
      {
        characterId: "abuSaeed",
        text: "ممتاز يا أستاذ! تحليلك دقيق ومبني على أدلة قوية. لازم أراجع سياسة المرتجعات فوراً!",
        mood: "happy",
      },
    ],
    lesson:
      "الحل الصحيح هو H3: مرتجعات/خصومات بعد البيع. القطع المباعة شبه ثابتة (K2 نفى H1)، وتسوية المدفوعات سليمة (K5 نفى H4)، والمخزون كامل (K6 نفى H6/H8)، والأسعار ثابتة (K1 نفى H7). ملخص بعد البيع (K4) أكد إن المرتجعات زادت بوضوح.",
  },
  {
    id: "ending-partial",
    type: "partial",
    title: "⚠️ تحليل جزئي",
    rank: "محلل بيانات متقدم",
    rankIcon: "🥈",
    description: "وصلت للفرضية الصحيحة لكن محتاج أدلة أقوى.",
    consequences: ["أبو سعيد مقتنع جزئياً", "يطلب أدلة إضافية قبل ما يتصرف", "يتم مراقبة المرتجعات بدون إجراء فوري"],
    score: 250,
    abuSaeedDialogues: [
      { characterId: "detective", text: "أبو سعيد، أعتقد المشكلة في المرتجعات والخصومات بعد البيع.", mood: "neutral" },
      { characterId: "abuSaeed", text: "ممكن يكون كلامك صح… بس عندك دليل قوي؟", mood: "suspicious" },
      { characterId: "detective", text: "عندي مؤشرات بس محتاج أجمع أدلة أكتر.", mood: "nervous" },
      { characterId: "abuSaeed", text: "طيب هراقب الوضع وأشوف. شكراً ليك.", mood: "neutral" },
    ],
    lesson:
      "وصلت للفرضية الصحيحة (H3) لكن كان لازم تجمع الأدلة التشخيصية: ملخص بعد البيع (K4)، القطع المباعة حسب الصنف (K2)، ورأي الزبونة (I3).",
  },
  {
    id: "ending-wrong",
    type: "wrong",
    title: "❌ تحليل خاطئ",
    rank: "محلل بيانات مبتدئ",
    rankIcon: "📚",
    description: "اخترت الفرضية الغلط والمشكلة هتستمر.",
    consequences: ["أبو سعيد مش مقتنع بتحليلك", "المشكلة الحقيقية (المرتجعات) تفضل موجودة", "خسائر المحل هتزيد"],
    score: 50,
    abuSaeedDialogues: [
      {
        characterId: "detective",
        text: "أبو سعيد، بعد تحليل البيانات، أنا شايف إن السبب هو: {HYPOTHESIS_NAME}",
        mood: "neutral",
      },
      { characterId: "abuSaeed", text: "مش حاسس إن ده السبب الحقيقي… الأرقام مش بتدعم كلامك.", mood: "angry" },
      { characterId: "abuSaeed", text: "محتاج حد يحلل الموضوع أعمق. شكراً على وقتك.", mood: "nervous" },
    ],
    lesson:
      "الحل الصحيح كان H3: مرتجعات/خصومات بعد البيع. كل فرضية غلط كان فيه دليل واحد على الأقل بينفيها بقوة (--). في تحليل ACH، الفرضية اللي ما عندهاش أي تناقض قوي هي الأرجح.",
  },
  {
    id: "ending-missing",
    type: "missing",
    title: "🔍 فرضية مفقودة",
    rank: "متدرب",
    rankIcon: "🔰",
    description: "الفرضية الصحيحة ما كانتش ضمن اختياراتك!",
    consequences: [
      "استبعدت الاحتمال الصحيح من البداية",
      "التحليل كله بُني على أساس خاطئ",
      "أبو سعيد محتاج يبدأ من الصفر",
    ],
    score: 0,
    abuSaeedDialogues: [
      { characterId: "detective", text: "أبو سعيد، حللت كل الاحتمالات و...", mood: "neutral" },
      { characterId: "abuSaeed", text: "لحظة… أنا حاسس إن فيه احتمال مهم إنت ما فكرتش فيه أصلاً!", mood: "angry" },
      {
        characterId: "abuSaeed",
        text: "يبدو إنك استبعدت حاجة مهمة من الأول. لازم نراجع كل الاحتمالات من جديد.",
        mood: "suspicious",
      },
    ],
    lesson:
      "أهم درس في تحليل ACH: لا تستبعد أي فرضية بدون دليل قوي ينفيها! الفرضية الصحيحة (H3: مرتجعات بعد البيع) كانت لازم تكون ضمن الأربعة عشان تقدر تحللها.",
  },
];

// ============================================
// أدلة تشخيصية مطلوبة للنهاية الممتازة
// ============================================

export const DIAGNOSTIC_EVIDENCE_IDS = ["K4", "K2", "I3"];

// ============================================
// حوار إضافي مع أبو سعيد (للمكتب)
// ============================================

export const ABU_SAEED_EXTRA_DIALOGUES: InterviewDialogue[] = [
  { characterId: "abuSaeed", text: "هل لقيت حاجة لحد دلوقتي؟ أنا قلقان جداً...", mood: "nervous" },
  { characterId: "detective", text: "لسه بجمع بيانات. كل معلومة مهمة.", mood: "neutral" },
  { characterId: "abuSaeed", text: "خد وقتك بس أرجوك اوصل للسبب. المحل ده حياتي.", mood: "nervous" },
];

// Legacy exports for backward compatibility
export const INTRO_DIALOGUES = INTRO_SCENES.flatMap((s) => s.dialogues);
