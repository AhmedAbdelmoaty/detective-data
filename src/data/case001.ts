// Case 1: فواتير تحت الترابيزة - Invoices Under the Table
// لعبة تحقيق تفاعلية في اختلاس تدريجي

// ============================================
// معلومات القضية
// ============================================

export const CASE_INFO = {
  id: "case-1",
  title: "فواتير تحت الترابيزة",
  titleEn: "Invoices Under the Table",
  difficulty: "beginner",
  estimatedTime: "30-45 دقيقة",
  description: "شركة صيانة وتجهيز مكاتب صغيرة لاحظت زيادة كبيرة في مصاريف الخامات آخر شهرين.",
  briefing: `
    شركة صيانة وتجهيز مكاتب صغيرة لاحظت زيادة كبيرة في مصاريف الخامات آخر شهرين...
    بس الشغل ما زادش بنفس النسبة، والمخزن مش باين فيه الزيادة دي.
    المستثمر داخل يراجع قريب.
    
    مهمتك: تعرف مين بيسحب فلوس الشركة وإزاي… بدليل يخلي الإدارة تاخد قرار.
  `,
};

// ============================================
// الغرف الخمس
// ============================================

export interface Room {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  evidenceIds: string[];
  characterId?: string;
}

export const ROOMS: Room[] = [
  {
    id: "manager-office",
    name: "مكتب الرئيس التنفيذي",
    nameEn: "CEO Office",
    description: "مكتب الرئيس التنفيذي - البداية والنهاية",
    icon: "🏢",
    evidenceIds: ["evidence-01"],
    characterId: "ahmed",
  },
  {
    id: "accounting",
    name: "المحاسبة",
    nameEn: "Accounting",
    description: "غرفة المحاسبة - الفواتير والمدفوعات",
    icon: "📊",
    evidenceIds: ["evidence-02", "evidence-03", "evidence-06"],
    characterId: "sara",
  },
  {
    id: "warehouse",
    name: "المخزن",
    nameEn: "Warehouse",
    description: "المخزن - دفاتر الاستلام والصرف",
    icon: "📦",
    evidenceIds: ["evidence-04", "evidence-05"],
    characterId: "mahmoud",
  },
  {
    id: "projects",
    name: "إدارة المشاريع",
    nameEn: "Projects",
    description: "إدارة المشاريع - قوائم الاستهلاك",
    icon: "📋",
    evidenceIds: ["evidence-07"],
    characterId: "fadi",
  },
  {
    id: "analysis-lab",
    name: "غرفة التحليل",
    nameEn: "Analysis Lab",
    description: "غرفة التحليل - أدوات الفلترة والربط",
    icon: "🔬",
    evidenceIds: [],
  },
];

// ============================================
// الشخصيات الأربع
// ============================================

export interface DialogueChoice {
  id: string;
  text: string;
  result: "unlock" | "refuse" | "clue" | "trust_up" | "trust_down" | "close";
  unlockEvidence?: string;
  clue?: string;
  trustChange?: {
    entity: "manager" | "accounting" | "warehouse" | "projects";
    amount: number;
  };
  followUp?: string;
  requiresInsight?: string;
}

export interface Dialogue {
  id: string;
  trigger: "first_visit" | "has_insight" | "after_analysis" | "accusation";
  requiredInsight?: string;
  text: string;
  choices: DialogueChoice[];
}

export interface Character {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  room: string;
  avatar: string;
  personality: string;
  isGuilty: boolean;
  initialStatement: string;
  dialogues: Dialogue[];
}

export const CHARACTERS: Character[] = [
  {
    id: "sara",
    name: "سارة",
    nameEn: "Sara",
    role: "مديرة التسويق",
    roleEn: "Marketing Manager",
    room: "accounting",
    avatar: "/characters/sara.png",
    personality: "تدافع عن الحملة بشدة وتؤكد أن الليدز تأتي بكميات ضخمة",
    isGuilty: true,
    initialStatement: "الورق كله موقّع ومختوم. المشكلة عند المخزن - محمود فوضوي ومبيسجلش كويس.",
    dialogues: [
      {
        id: "sara-first",
        trigger: "first_visit",
        text: "الورق كله موقّع ومختوم. المشكلة عند المخزن - محمود فوضوي ومبيسجلش كويس.",
        choices: [
          {
            id: "ask-invoices",
            text: "عايز أشوف ملف الفواتير",
            result: "unlock",
            unlockEvidence: "evidence-02",
            followUp: "اتفضل، كل الفواتير موثقة. هتلاقي كل حاجة سليمة.",
          },
          {
            id: "ask-payments",
            text: "عايز ملف المدفوعات",
            result: "refuse",
            followUp: "المدفوعات؟ دي محتاج موافقة من محمد الأول. الفواتير أهم دلوقتي.",
          },
        ],
      },
      {
        id: "sara-supplier-question",
        trigger: "has_insight",
        requiredInsight: "insight-supplier-anomaly",
        text: "رجعت تاني؟",
        choices: [
          {
            id: "why-nour-expensive",
            text: "ليه أسعار النور للتوريدات أعلى من غيره؟",
            result: "clue",
            clue: "سارة بررت الأسعار العالية بـ'الجودة والسرعة' - تبرير ضعيف",
            followUp: "الجودة أحسن... وبيوصلوا بسرعة... وبيشتغلوا في الطوارئ. الفرق في السعر منطقي.",
          },
          {
            id: "who-enters-invoices",
            text: "مين بيدخل فواتير النور في النظام؟",
            result: "clue",
            clue: "سارة هي اللي بتدخل معظم فواتير النور للتوريدات",
            followUp: "أنا بدخلها عشان هي شغلي... إيه المشكلة؟",
          },
        ],
      },
      {
        id: "sara-pressure",
        trigger: "has_insight",
        requiredInsight: "insight-gap",
        text: "إيه الجديد؟",
        choices: [
          {
            id: "show-gap",
            text: "في فرق كبير بين المشتري والمستخدم",
            result: "unlock",
            unlockEvidence: "evidence-06",
            followUp: "أنا... أنا مش فاهمة؟ يمكن في خطأ في التسجيل... (تبدو مرتبكة)",
          },
        ],
      },
    ],
  },
  {
    id: "ahmed",
    name: "أحمد",
    nameEn: "Ahmed",
    role: "مدير المبيعات",
    roleEn: "Sales Manager",
    room: "manager-office",
    avatar: "/characters/ahmed.png",
    personality: "يركز على إغلاق الصفقات ويضغط على الفريق لتحقيق الأرقام",
    isGuilty: false,
    initialStatement: "انخفاض المبيعات بهذا الشكل غير منطقي. إحنا بنسلم ليدز كتير للمبيعات، لكن التحويل شبه متوقف.",
    dialogues: [
      {
        id: "ahmed-first",
        trigger: "first_visit",
        text: "الحملة الأخيرة جابت تدفق عملاء، لكن فريق المبيعات مش قادر يحولهم. في حاجة غلط في جودة الليدز أو في المتابعة.",
        choices: [
          {
            id: "focus-quality",
            text: "يمكن الليدز مش مناسبة للعقار",
            result: "trust_down",
            trustChange: { entity: "warehouse", amount: -30 },
            followUp: "ده إحساسنا برضه. لازم نعرف مصدر الليدز وليه الجودة ضعيفة.",
          },
          {
            id: "focus-process",
            text: "محتاج أشوف مسار المتابعة",
            result: "trust_up",
            trustChange: { entity: "manager", amount: 10 },
            followUp: "تمام، هشاركك تفاصيل المتابعة والمكالمات.",
          },
        ],
      },
      {
        id: "ahmed-update",
        trigger: "after_analysis",
        text: "أي جديد في التحقيق؟ لازم نعرف ليه العملاء بيفلتوا منا.",
        choices: [
          {
            id: "suspect-warehouse",
            text: "المخزن مشكوك فيه",
            result: "trust_down",
            trustChange: { entity: "warehouse", amount: -15 },
            followUp: "هنتابع مع المخزن لكن لازم نفهم مصدر الليدز الأول.",
          },
          {
            id: "suspect-accounting",
            text: "في حاجة غلط في المحاسبة",
            result: "clue",
            clue: "أحمد هيسمحلك تشوف ملفات أكتر في المحاسبة",
            followUp: "تمام، خد صلاحية كاملة على ملفات المحاسبة والمبيعات.",
          },
          {
            id: "suspect-supplier",
            text: "مورد واحد بيظهر كتير",
            result: "unlock",
            unlockEvidence: "evidence-03",
            followUp: "ممكن يكون فيه اتفاقية غير واضحة. اتفضل شوف ملف المدفوعات.",
          },
          {
            id: "still-investigating",
            text: "لسه بدور",
            result: "close",
            followUp: "ماشي، بس الوقت يهمنا قبل ما الأرقام تسوء أكتر.",
          },
        ],
      },
    ],
  },
  {
    id: "mohammed",
    name: "محمد",
    nameEn: "Mohammed",
    role: "الرئيس التنفيذي",
    roleEn: "CEO",
    room: "manager-office",
    avatar: "/characters/karim.png",
    personality: "يحافظ على هدوئه لكن يضغط للوصول لنتيجة سريعة وواضحة",
    isGuilty: false,
    initialStatement: "أحتاج تقريراً واضحاً خلال ساعات. ضاعفنا ميزانية التسويق والمبيعات توقفت، هذا غير مقبول.",
    dialogues: [
      {
        id: "ceo-brief",
        trigger: "first_visit",
        text: "المشكلة تؤثر على سمعة الشركة. أريد خطة واضحة: أين الخلل؟",
        choices: [
          {
            id: "ceo-acknowledge",
            text: "سأراجع الأدلة وأعود بتقرير واضح",
            result: "close",
            followUp: "حسناً، أنتظر منك تحديثاً قبل أن أتخذ أي قرارات جذرية.",
          },
        ],
      },
    ],
  },
  {
    id: "mahmoud",
    name: "محمود",
    nameEn: "Mahmoud",
    role: "أمين المخزن",
    roleEn: "Warehouse Manager",
    room: "warehouse",
    avatar: "/characters/mahmoud.png",
    personality: "فوضوي لكنه صادق - كبش الفداء المثالي",
    isGuilty: false,
    initialStatement: "أنا ماليش دعوة بالفلوس... المحاسبة هي اللي بتشتري وأنا بستلم بس.",
    dialogues: [
      {
        id: "mahmoud-first-aggressive",
        trigger: "first_visit",
        text: "أنا ماليش دعوة بالفلوس... المحاسبة هي اللي بتشتري وأنا بستلم بس.",
        choices: [
          {
            id: "accuse-directly",
            text: "أنت المسؤول عن الفوضى دي!",
            result: "trust_down",
            trustChange: { entity: "warehouse", amount: -25 },
            followUp: "أنا مش حرامي! روح شوف اللي بيمضي على الفلوس مش اللي بيستلم بضاعة!",
          },
          {
            id: "ask-nicely",
            text: "محتاج أفهم منك إيه بيحصل",
            result: "unlock",
            unlockEvidence: "evidence-04",
            followUp: "خد دفتر الاستلام... هتلاقي كل حاجة مسجلة. بس في شحنات اتسجلت ومجتش!",
          },
        ],
      },
      {
        id: "mahmoud-clue",
        trigger: "first_visit",
        text: "في حاجة تانية؟",
        choices: [
          {
            id: "ask-more",
            text: "إيه اللي قصدك عليه؟",
            result: "clue",
            clue: "محمود: 'في شحنات اتسجلت في الورق بس أنا مش فاكر شفتها بعيني' - دليل على فواتير وهمية",
            followUp: "في شحنات اتسجلت في الورق من النور للتوريدات... بس أنا مش فاكر شفتها بعيني!",
          },
          {
            id: "get-dispatch",
            text: "عايز دفتر الصرف للمشاريع",
            result: "unlock",
            unlockEvidence: "evidence-05",
            followUp: "اتفضل... هتشوف إننا بنصرف أقل مما بيتشترى!",
          },
        ],
      },
    ],
  },
  {
    id: "fadi",
    name: "فادي",
    nameEn: "Fadi",
    role: "مدير المشاريع",
    roleEn: "Projects Manager",
    room: "projects",
    avatar: "/characters/fadi.png",
    personality: "مشغول ومتوتر - توقيعاته مضللة",
    isGuilty: false,
    initialStatement: "أنا بوقّع على المواد اللي بتيجي للمشاريع. مش بدقق في الأسعار - ده شغل المحاسبة.",
    dialogues: [
      {
        id: "fadi-first",
        trigger: "first_visit",
        text: "أنا بوقّع على المواد اللي بتيجي للمشاريع. مش بدقق في الأسعار - ده شغل المحاسبة.",
        choices: [
          {
            id: "ask-projects-list",
            text: "عايز قائمة المشاريع والاستهلاك المتوقع",
            result: "unlock",
            unlockEvidence: "evidence-07",
            followUp: "اتفضل... هتلاقي إن استهلاكنا الفعلي أقل من اللي بيتشترى.",
          },
          {
            id: "accuse-fadi",
            text: "توقيعاتك على كل الفواتير!",
            result: "trust_down",
            trustChange: { entity: "projects", amount: -30 },
            followUp: "أنا بوقع عشان الشغل يمشي مش عشان بسرق! روح دور في مكان تاني!",
          },
        ],
      },
      {
        id: "fadi-defensive",
        trigger: "has_insight",
        requiredInsight: "insight-fadi-signatures",
        text: "رجعت تتهمني تاني؟",
        choices: [
          {
            id: "apologize",
            text: "مش باتهمك، بفهم بس",
            result: "trust_up",
            trustChange: { entity: "projects", amount: 10 },
            clue: "فادي: 'اللي بيحضّر الفواتير هو اللي يتسأل مش اللي بيمضي'",
            followUp: "اللي بيحضّر الفواتير هو اللي يتسأل... مش اللي بيمضي وهو مشغول!",
          },
        ],
      },
    ],
  },
];

// ============================================
// الأدلة السبع
// ============================================

export interface Evidence {
  id: string;
  name: string;
  nameEn: string;
  type: "spreadsheet" | "document" | "notebook" | "modified";
  icon: string;
  room: string;
  description: string;
  isLocked: boolean;
  unlockCondition?: string;
  data?: any;
}

export const EVIDENCE_ITEMS: Evidence[] = [
  {
    id: "evidence-01",
    name: "ملخص مصاريف الخامات",
    nameEn: "Materials Expense Summary",
    type: "spreadsheet",
    icon: "📊",
    room: "manager-office",
    description: "جدول يوضح زيادة المصاريف +35% آخر شهرين",
    isLocked: false,
    data: {
      type: "summary",
      months: [
        { month: "يناير", expenses: 45000, projects: 8 },
        { month: "فبراير", expenses: 61000, projects: 9 },
        { month: "مارس", expenses: 72000, projects: 8 },
      ],
      note: "زيادة 35% في المصاريف بدون زيادة مقابلة في المشاريع",
    },
  },
  {
    id: "evidence-02",
    name: "ملف فواتير الموردين",
    nameEn: "Supplier Invoices File",
    type: "spreadsheet",
    icon: "📑",
    room: "accounting",
    description: "كل الفواتير مع تفاصيل الموردين والأسعار",
    isLocked: false,
    data: {
      type: "invoices",
      invoices: [
        { id: "INV-001", date: "2024-01-15", supplier: "مواد البناء المتحدة", item: "أسمنت", qty: 50, unitPrice: 120, total: 6000, enteredBy: "sara", approvedBy: "fadi", hasReceipt: true },
        { id: "INV-002", date: "2024-01-22", supplier: "النور للتوريدات", item: "دهانات", qty: 30, unitPrice: 180, total: 5400, enteredBy: "sara", approvedBy: "fadi", hasReceipt: true },
        { id: "INV-003", date: "2024-02-05", supplier: "مواد البناء المتحدة", item: "أسمنت", qty: 40, unitPrice: 125, total: 5000, enteredBy: "sara", approvedBy: "fadi", hasReceipt: true },
        { id: "INV-004", date: "2024-02-12", supplier: "النور للتوريدات", item: "دهانات", qty: 50, unitPrice: 220, total: 11000, enteredBy: "sara", approvedBy: "fadi", hasReceipt: false },
        { id: "INV-005", date: "2024-02-18", supplier: "النور للتوريدات", item: "مواد عزل", qty: 25, unitPrice: 350, total: 8750, enteredBy: "sara", approvedBy: "fadi", hasReceipt: false },
        { id: "INV-006", date: "2024-02-25", supplier: "الصفا للتجارة", item: "أدوات صحية", qty: 15, unitPrice: 200, total: 3000, enteredBy: "sara", approvedBy: "fadi", hasReceipt: true },
        { id: "INV-007", date: "2024-03-03", supplier: "النور للتوريدات", item: "دهانات فاخرة", qty: 40, unitPrice: 280, total: 11200, enteredBy: "sara", approvedBy: "fadi", hasReceipt: false },
        { id: "INV-008", date: "2024-03-10", supplier: "النور للتوريدات", item: "مواد عزل خاصة", qty: 30, unitPrice: 420, total: 12600, enteredBy: "sara", approvedBy: "fadi", hasReceipt: false },
        { id: "INV-009", date: "2024-03-15", supplier: "مواد البناء المتحدة", item: "أسمنت", qty: 45, unitPrice: 125, total: 5625, enteredBy: "sara", approvedBy: "fadi", hasReceipt: true },
        { id: "INV-010", date: "2024-03-22", supplier: "النور للتوريدات", item: "خامات متنوعة", qty: 20, unitPrice: 550, total: 11000, enteredBy: "sara", approvedBy: "fadi", hasReceipt: false },
      ],
    },
  },
  {
    id: "evidence-03",
    name: "ملف المدفوعات للموردين",
    nameEn: "Supplier Payments File",
    type: "spreadsheet",
    icon: "💳",
    room: "accounting",
    description: "سجل المدفوعات وتواريخها",
    isLocked: true,
    unlockCondition: "طلب من محمد أو insight عن المورد",
    data: {
      type: "payments",
      payments: [
        { id: "PAY-001", date: "2024-01-20", supplier: "مواد البناء المتحدة", amount: 6000, method: "تحويل", daysAfterInvoice: 5 },
        { id: "PAY-002", date: "2024-01-25", supplier: "النور للتوريدات", amount: 5400, method: "كاش", daysAfterInvoice: 3 },
        { id: "PAY-003", date: "2024-02-10", supplier: "مواد البناء المتحدة", amount: 5000, method: "تحويل", daysAfterInvoice: 5 },
        { id: "PAY-004", date: "2024-02-13", supplier: "النور للتوريدات", amount: 11000, method: "كاش", daysAfterInvoice: 1 },
        { id: "PAY-005", date: "2024-02-19", supplier: "النور للتوريدات", amount: 8750, method: "كاش", daysAfterInvoice: 1 },
        { id: "PAY-006", date: "2024-03-01", supplier: "الصفا للتجارة", amount: 3000, method: "تحويل", daysAfterInvoice: 4 },
        { id: "PAY-007", date: "2024-03-04", supplier: "النور للتوريدات", amount: 11200, method: "كاش", daysAfterInvoice: 1 },
        { id: "PAY-008", date: "2024-03-11", supplier: "النور للتوريدات", amount: 12600, method: "كاش", daysAfterInvoice: 1 },
        { id: "PAY-009", date: "2024-03-20", supplier: "مواد البناء المتحدة", amount: 5625, method: "تحويل", daysAfterInvoice: 5 },
        { id: "PAY-010", date: "2024-03-23", supplier: "النور للتوريدات", amount: 11000, method: "كاش", daysAfterInvoice: 1 },
      ],
    },
  },
  {
    id: "evidence-04",
    name: "دفتر استلام المخزن",
    nameEn: "Warehouse Receipt Book",
    type: "notebook",
    icon: "📓",
    room: "warehouse",
    description: "دفتر مكتوب بخط اليد - فوضوي لكنه صادق",
    isLocked: false,
    data: {
      type: "receipts",
      entries: [
        { date: "2024-01-15", item: "أسمنت", qty: 50, supplier: "مواد البناء", signature: "محمود", notes: "" },
        { date: "2024-01-22", item: "دهانات", qty: 30, supplier: "النور", signature: "محمود", notes: "" },
        { date: "2024-02-05", item: "أسمنت", qty: 40, supplier: "مواد البناء", signature: "محمود", notes: "" },
        { date: "2024-02-12", item: "دهانات", qty: 25, supplier: "النور", signature: "محمود", notes: "الكمية أقل من الفاتورة؟" },
        { date: "2024-02-18", item: "مواد عزل", qty: 15, supplier: "النور", signature: "محمود", notes: "مفيش حد استلم معايا" },
        { date: "2024-02-25", item: "أدوات صحية", qty: 15, supplier: "الصفا", signature: "محمود", notes: "" },
        { date: "2024-03-03", item: "دهانات", qty: 20, supplier: "النور", signature: "?", notes: "مش فاكر الشحنة دي!" },
        { date: "2024-03-10", item: "مواد عزل", qty: 18, supplier: "النور", signature: "؟", notes: "برضو مش فاكر" },
        { date: "2024-03-15", item: "أسمنت", qty: 45, supplier: "مواد البناء", signature: "محمود", notes: "" },
        { date: "2024-03-22", item: "خامات", qty: 10, supplier: "النور", signature: "؟", notes: "مين استلم؟" },
      ],
    },
  },
  {
    id: "evidence-05",
    name: "دفتر صرف المواد للمشاريع",
    nameEn: "Materials Dispatch Book",
    type: "notebook",
    icon: "📋",
    room: "warehouse",
    description: "سجل صرف المواد الفعلي للمشاريع",
    isLocked: false,
    data: {
      type: "dispatch",
      entries: [
        { date: "2024-01-17", project: "مشروع أ", item: "أسمنت", qty: 45 },
        { date: "2024-01-24", project: "مشروع ب", item: "دهانات", qty: 28 },
        { date: "2024-02-08", project: "مشروع ج", item: "أسمنت", qty: 38 },
        { date: "2024-02-15", project: "مشروع د", item: "دهانات", qty: 22 },
        { date: "2024-02-20", project: "مشروع د", item: "مواد عزل", qty: 12 },
        { date: "2024-02-28", project: "مشروع هـ", item: "أدوات صحية", qty: 14 },
        { date: "2024-03-06", project: "مشروع و", item: "دهانات", qty: 18 },
        { date: "2024-03-12", project: "مشروع ز", item: "مواد عزل", qty: 15 },
        { date: "2024-03-18", project: "مشروع ح", item: "أسمنت", qty: 42 },
        { date: "2024-03-25", project: "مشروع ط", item: "خامات", qty: 8 },
      ],
    },
  },
  {
    id: "evidence-06",
    name: "فاتورة عليها تعديل بالقلم",
    nameEn: "Modified Invoice",
    type: "modified",
    icon: "📝",
    room: "accounting",
    description: "فاتورة من النور للتوريدات عليها تعديل يدوي",
    isLocked: true,
    unlockCondition: "بعد إثبات فجوة أو سؤال ذكي لسارة",
    data: {
      type: "modified_invoice",
      invoiceId: "INV-008",
      originalQty: 20,
      modifiedQty: 30,
      originalTotal: 8400,
      modifiedTotal: 12600,
      modifiedBy: "قلم أزرق - نفس خط سارة",
      notes: "الكمية والمجموع متغيرين بخط اليد",
    },
  },
  {
    id: "evidence-07",
    name: "قائمة المشاريع واستهلاكها المتوقع",
    nameEn: "Projects Consumption List",
    type: "spreadsheet",
    icon: "📊",
    room: "projects",
    description: "تقدير الاستهلاك المتوقع لكل مشروع",
    isLocked: false,
    data: {
      type: "projects",
      projects: [
        { id: "P-001", name: "مشروع أ", period: "يناير", expectedUsage: "40-50", actualBought: 50 },
        { id: "P-002", name: "مشروع ب", period: "يناير", expectedUsage: "25-30", actualBought: 30 },
        { id: "P-003", name: "مشروع ج", period: "فبراير", expectedUsage: "35-45", actualBought: 40 },
        { id: "P-004", name: "مشروع د", period: "فبراير", expectedUsage: "40-50", actualBought: 75 },
        { id: "P-005", name: "مشروع هـ", period: "فبراير", expectedUsage: "12-18", actualBought: 15 },
        { id: "P-006", name: "مشروع و", period: "مارس", expectedUsage: "35-45", actualBought: 40 },
        { id: "P-007", name: "مشروع ز", period: "مارس", expectedUsage: "25-35", actualBought: 48 },
        { id: "P-008", name: "مشروع ح", period: "مارس", expectedUsage: "40-50", actualBought: 45 },
        { id: "P-009", name: "مشروع ط", period: "مارس", expectedUsage: "15-20", actualBought: 31 },
      ],
    },
  },
];

// ============================================
// الـ Insights - اكتشافات من التحليل
// ============================================

export interface Insight {
  id: string;
  name: string;
  description: string;
  source: "pivot" | "compare" | "filter" | "link";
  conditions: string[];
  points: number;
}

export const INSIGHTS: Insight[] = [
  {
    id: "insight-supplier-anomaly",
    name: "النور للتوريدات مورد شاذ",
    description: "النور للتوريدات أغلى من المتوسط بـ 40% ومعظم فواتيره بدون إيصالات",
    source: "pivot",
    conditions: ["evidence-02"],
    points: 50,
  },
  {
    id: "insight-gap",
    name: "فجوة شراء/استخدام",
    description: "في فرق كبير بين الكميات المشتراة والمستخدمة فعلياً",
    source: "compare",
    conditions: ["evidence-04", "evidence-05"],
    points: 50,
  },
  {
    id: "insight-fast-payments",
    name: "مدفوعات متسارعة",
    description: "النور للتوريدات بياخد فلوسه في يوم واحد - أسرع من أي مورد تاني",
    source: "filter",
    conditions: ["evidence-03"],
    points: 40,
  },
  {
    id: "insight-sara-enters",
    name: "سارة تدخل كل فواتير النور",
    description: "سارة هي الوحيدة اللي بتدخل فواتير النور للتوريدات",
    source: "filter",
    conditions: ["evidence-02"],
    points: 50,
  },
  {
    id: "insight-no-receipts",
    name: "فواتير بدون إيصالات",
    description: "معظم فواتير النور للتوريدات مفيهاش إيصالات",
    source: "filter",
    conditions: ["evidence-02"],
    points: 30,
  },
  {
    id: "insight-fadi-signatures",
    name: "توقيعات فادي على كل الفواتير",
    description: "فادي موقع على كل الفواتير - مضلل لأنه بيوقع بدون تدقيق",
    source: "filter",
    conditions: ["evidence-02"],
    points: 20,
  },
  {
    id: "insight-modified-invoice",
    name: "فاتورة معدلة بخط اليد",
    description: "فاتورة من النور عليها تعديل في الكمية والمبلغ بخط سارة",
    source: "link",
    conditions: ["evidence-06"],
    points: 60,
  },
];

// ============================================
// الفرضيات الأربع
// ============================================

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  suspectId?: string;
  requiredEvidence: string[];
  requiredInsights: string[];
  isCorrect: boolean;
  points: number;
}

export const HYPOTHESES: Hypothesis[] = [
  {
    id: "h1-mahmoud",
    title: "محمود بيسرق خامات",
    description: "أمين المخزن بيسجل استلام وهمي وبياخد الخامات",
    suspectId: "mahmoud",
    requiredEvidence: ["evidence-04", "evidence-01"],
    requiredInsights: [],
    isCorrect: false,
    points: -50,
  },
  {
    id: "h2-fadi",
    title: "فادي متورط في التوقيعات",
    description: "مدير المشاريع بيمضي على فواتير مزورة عمداً",
    suspectId: "fadi",
    requiredEvidence: ["evidence-07", "evidence-02"],
    requiredInsights: ["insight-fadi-signatures"],
    isCorrect: false,
    points: -30,
  },
  {
    id: "h3-supplier",
    title: "المورد النور هو المشكلة",
    description: "المورد بيرفع الأسعار ويبعت كميات أقل",
    suspectId: undefined,
    requiredEvidence: ["evidence-02"],
    requiredInsights: ["insight-supplier-anomaly"],
    isCorrect: false,
    points: 30,
  },
  {
    id: "h4-sara",
    title: "تضخيم فواتير بتواطؤ داخلي",
    description: "سارة بتعدي فواتير مضخمة من مورد واحد وبتاخد عمولة",
    suspectId: "sara",
    requiredEvidence: ["evidence-02", "evidence-04", "evidence-06"],
    requiredInsights: ["insight-supplier-anomaly", "insight-gap", "insight-sara-enters"],
    isCorrect: true,
    points: 200,
  },
];

// ============================================
// النهايات الثلاث
// ============================================

export interface Ending {
  id: string;
  type: "best" | "partial" | "wrong";
  title: string;
  description: string;
  requirements: {
    insights: string[];
    evidence: string[];
    accusation?: string;
  };
  consequences: string[];
  score: number;
}

export const ENDINGS: Ending[] = [
  {
    id: "ending-best",
    type: "best",
    title: "🏆 تحقيق ناجح",
    description: "كشفت المخطط الكامل وقدمت أدلة قاطعة",
    requirements: {
      insights: ["insight-supplier-anomaly", "insight-gap", "insight-fast-payments", "insight-sara-enters"],
      evidence: ["evidence-02", "evidence-04", "evidence-06"],
      accusation: "sara",
    },
    consequences: [
      "محمد يوقف سارة للتحقيق الرسمي",
      "يتم إيقاف التعامل مع النور للتوريدات",
      "تغيير نظام الموافقات لمنع تكرار المشكلة",
      "محمد يشكرك: 'ما ظلمتش حد بريء'",
    ],
    score: 500,
  },
  {
    id: "ending-partial",
    type: "partial",
    title: "⚠️ تحقيق ناقص",
    description: "اتهمت المورد بس من غير دليل على التواطؤ الداخلي",
    requirements: {
      insights: ["insight-supplier-anomaly"],
      evidence: ["evidence-02"],
      accusation: undefined,
    },
    consequences: [
      "توقف الشركة التعامل مع النور للتوريدات",
      "المستثمر: 'مين كان بيمرر الفواتير دي؟'",
      "محمد يفقد ثقته فيك جزئياً",
      "المشكلة ممكن تتكرر مع مورد تاني",
    ],
    score: 150,
  },
  {
    id: "ending-wrong",
    type: "wrong",
    title: "❌ اتهام خاطئ",
    description: "اتهمت شخص بريء والمشكلة استمرت",
    requirements: {
      insights: [],
      evidence: [],
      accusation: "mahmoud",
    },
    consequences: [
      "تم فصل محمود ظلماً",
      "المصاريف استمرت في الزيادة",
      "بعد شهر: اكتشفوا إنك غلطت",
      "خسرت سمعتك كمحقق",
    ],
    score: -100,
  },
];

// ============================================
// أدوات التحليل
// ============================================

export interface AnalysisTool {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  requiredEvidence: string[];
  possibleInsights: string[];
}

export const ANALYSIS_TOOLS: AnalysisTool[] = [
  {
    id: "tool-filter",
    name: "فلترة وترتيب",
    nameEn: "Filter & Sort",
    icon: "🔍",
    description: "فلتر البيانات حسب المورد أو الشهر أو الشخص",
    requiredEvidence: ["evidence-02"],
    possibleInsights: ["insight-supplier-anomaly", "insight-sara-enters", "insight-no-receipts", "insight-fadi-signatures"],
  },
  {
    id: "tool-pivot",
    name: "تجميع وتحليل",
    nameEn: "Pivot Analysis",
    icon: "📊",
    description: "اجمع البيانات حسب المورد لرؤية الأنماط",
    requiredEvidence: ["evidence-02", "evidence-03"],
    possibleInsights: ["insight-supplier-anomaly", "insight-fast-payments"],
  },
  {
    id: "tool-compare",
    name: "مقارنة",
    nameEn: "Compare",
    icon: "⚖️",
    description: "قارن بين الشراء والاستخدام الفعلي",
    requiredEvidence: ["evidence-04", "evidence-05"],
    possibleInsights: ["insight-gap"],
  },
  {
    id: "tool-highlight",
    name: "إبراز الشاذ",
    nameEn: "Highlight Outliers",
    icon: "⚡",
    description: "ابحث عن القيم الغريبة في البيانات",
    requiredEvidence: ["evidence-02", "evidence-03"],
    possibleInsights: ["insight-supplier-anomaly", "insight-fast-payments"],
  },
];

// ============================================
// حالة البداية
// ============================================

export const INITIAL_GAME_STATE = {
  currentRoom: "manager-office",
  collectedEvidence: ["evidence-01"],
  unlockedEvidence: ["evidence-01"],
  discoveredInsights: [],
  activeHypothesis: null,
  trust: {
    manager: 100,
    accounting: 100,
    warehouse: 100,
    projects: 100,
  },
  dialoguesCompleted: [],
  accusation: null,
  ending: null,
};
