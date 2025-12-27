// Case 1: الأموال المفقودة - The Missing Money
// لعبة تحقيق تفاعلية

export const CASE_INFO = {
  id: "case-1",
  title: "الأموال المفقودة",
  titleEn: "The Missing Money",
  difficulty: "beginner",
  estimatedTime: "20-30 دقيقة",
  description: "شركة تجارية صغيرة اكتشفت اختفاء 45,000 ريال من حساباتها على مدى 3 أشهر.",
  briefing: `
    مرحباً أيها المحقق،
    
    تلقينا بلاغاً من شركة "النور التجارية" عن اختفاء مبلغ 45,000 ريال من حساباتهم.
    المدير العام يشك في أحد الموظفين الثلاثة الذين لديهم صلاحية الوصول للنظام المالي.
    
    مهمتك: افحص الأدلة، استجوب المشتبهين، واكتشف من هو المختلس.
  `,
};

// ============================================
// تعريف الـ Evidence Packs
// ============================================

export type EvidencePack = "pack1" | "pack2" | "pack3";

export interface EvidenceItem {
  id: string;
  name: string;
  nameEn: string;
  type: "spreadsheet" | "email" | "document" | "log";
  icon: string;
  description: string;
  pack: EvidencePack;
  trustValue: number;
}

// ============================================
// Pack 1: متاح من البداية (3 أدلة - يجمع 2 فقط)
// ============================================

// ملخص البنك (High-level) - ملخص شهري فقط
export const BANK_SUMMARY = [
  { 
    month: "يناير", 
    revenue: 45000, 
    expenses: 35500, 
    netProfit: 9500,
  },
  { 
    month: "فبراير", 
    revenue: 38000, 
    expenses: 56500, 
    netProfit: -18500,
  },
  { 
    month: "مارس", 
    revenue: 35000, 
    expenses: 58500, 
    netProfit: -23500,
  },
];

// سجل النظام المختصر (آخر 10 عمليات)
export const SYSTEM_LOG_BRIEF = [
  { id: "log-1", date: "2024-03-24", time: "22:00", user: "karim", action: "إضافة فاتورة" },
  { id: "log-2", date: "2024-03-15", time: "14:30", user: "ahmed", action: "مراجعة موافقات" },
  { id: "log-3", date: "2024-03-11", time: "21:00", user: "karim", action: "تعديل فاتورة" },
  { id: "log-4", date: "2024-03-09", time: "10:00", user: "sara", action: "إضافة إيراد" },
  { id: "log-5", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد جديد" },
  { id: "log-6", date: "2024-02-20", time: "20:30", user: "ahmed", action: "مراجعة تقارير" },
  { id: "log-7", date: "2024-02-14", time: "09:30", user: "sara", action: "تحديث سجل" },
  { id: "log-8", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة معاملة" },
  { id: "log-9", date: "2024-01-28", time: "11:00", user: "karim", action: "طلب شراء" },
  { id: "log-10", date: "2024-01-15", time: "09:15", user: "sara", action: "إدخال رواتب" },
];

// إيميل داخلي واحد
export const EMAIL_PACK1 = {
  id: "email-1",
  date: "2024-03-01",
  from: "سارة الخالد",
  to: "أحمد المنصور",
  subject: "استفسار عن الفواتير",
  body: "أستاذ أحمد، لاحظت زيادة كبيرة في فواتير المشتريات هذا الشهر. هل يمكنك التأكد من صحتها؟",
};

// ============================================
// Pack 2: يفتح بعد أول Insight (دليلين)
// ============================================

// كشف بنك تفصيلي - جدول التحويلات (12 معاملة)
export const BANK_TRANSACTIONS = [
  // يناير
  { id: "t1", date: "2024-01-03", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
  { id: "t2", date: "2024-01-08", description: "دفعة من عميل - شركة الأمل", amount: 45000, category: "revenue", enteredBy: "sara" },
  { id: "t3", date: "2024-01-15", description: "مستلزمات مكتبية", amount: -1200, category: "supplies", enteredBy: "karim" },
  { id: "t4", date: "2024-01-28", description: "معدات حاسوب", amount: -4500, category: "equipment", enteredBy: "karim" },
  
  // فبراير
  { id: "t5", date: "2024-02-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
  { id: "t6", date: "2024-02-10", description: "دفعة من عميل - مؤسسة البناء", amount: 38000, category: "revenue", enteredBy: "sara" },
  { id: "t7", date: "2024-02-12", description: "معدات مكتبية خاصة", amount: -12000, category: "equipment", enteredBy: "karim" },
  { id: "t8", date: "2024-02-25", description: "خدمات استشارية", amount: -8500, category: "consulting", enteredBy: "karim" },
  
  // مارس
  { id: "t9", date: "2024-03-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
  { id: "t10", date: "2024-03-08", description: "دفعة من عميل - شركة التقنية", amount: 35000, category: "revenue", enteredBy: "sara" },
  { id: "t11", date: "2024-03-12", description: "معدات تقنية متخصصة", amount: -18000, category: "equipment", enteredBy: "karim" },
  { id: "t12", date: "2024-03-25", description: "برمجيات وتراخيص", amount: -7500, category: "software", enteredBy: "karim" },
];

// جدول الفواتير (6 فواتير)
export const PURCHASE_INVOICES = [
  { id: "inv-1", date: "2024-01-15", vendor: "مكتبة الرياض", items: "أقلام، ورق، ملفات", amount: 1200, hasReceipt: true, requestedBy: "karim", approvedBy: "ahmed" },
  { id: "inv-2", date: "2024-01-28", vendor: "متجر الإلكترونيات", items: "3 لابتوب Dell", amount: 4500, hasReceipt: true, requestedBy: "karim", approvedBy: "ahmed" },
  { id: "inv-3", date: "2024-02-12", vendor: "مورد تجهيزات", items: "معدات مكتبية متنوعة", amount: 12000, hasReceipt: false, requestedBy: "karim", approvedBy: "ahmed" },
  { id: "inv-4", date: "2024-02-25", vendor: "شركة الاستشارات", items: "استشارات تقنية", amount: 8500, hasReceipt: false, requestedBy: "karim", approvedBy: "ahmed" },
  { id: "inv-5", date: "2024-03-12", vendor: "تقنيات المستقبل", items: "أجهزة متخصصة", amount: 18000, hasReceipt: false, requestedBy: "karim", approvedBy: "ahmed" },
  { id: "inv-6", date: "2024-03-25", vendor: "برمجيات متقدمة", items: "تراخيص برمجيات", amount: 7500, hasReceipt: false, requestedBy: "karim", approvedBy: "ahmed" },
];

// ============================================
// Pack 3: يفتح بعد استجواب واحد (دليلين)
// ============================================

// سجل دخول/نشاط تفصيلي
export const ACTIVITY_LOG = [
  { id: "act-1", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة فاتورة", details: "inv-3", ipAddress: "192.168.1.105" },
  { id: "act-2", date: "2024-02-14", time: "09:30", user: "sara", action: "تحديث سجل", details: "تقرير شهري", ipAddress: "192.168.1.102" },
  { id: "act-3", date: "2024-02-20", time: "20:30", user: "ahmed", action: "مراجعة تقارير", details: "تقرير المصروفات", ipAddress: "192.168.1.100" },
  { id: "act-4", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد", details: "شركة الاستشارات", ipAddress: "192.168.1.105" },
  { id: "act-5", date: "2024-03-09", time: "10:00", user: "sara", action: "إضافة إيراد", details: "شركة التقنية", ipAddress: "192.168.1.102" },
  { id: "act-6", date: "2024-03-11", time: "21:00", user: "karim", action: "تعديل فاتورة", details: "inv-5", ipAddress: "192.168.1.105" },
  { id: "act-7", date: "2024-03-15", time: "14:30", user: "ahmed", action: "مراجعة موافقات", details: "فواتير مارس", ipAddress: "192.168.1.100" },
  { id: "act-8", date: "2024-03-24", time: "22:00", user: "karim", action: "إضافة فاتورة", details: "inv-6", ipAddress: "192.168.1.105" },
];

// إيميل مهم
export const EMAIL_PACK3 = {
  id: "email-2",
  date: "2024-02-20",
  from: "المدير العام",
  to: "أحمد المنصور",
  subject: "طلب تقرير عاجل",
  body: "أحمد، أحتاج تقرير المصروفات الشهري الليلة. لدينا اجتماع مجلس الإدارة غداً صباحاً.",
};

// ============================================
// الأدلة القابلة للجمع
// ============================================

export const EVIDENCE_ITEMS: EvidenceItem[] = [
  // Pack 1
  {
    id: "bank-summary",
    name: "ملخص الحساب البنكي",
    nameEn: "Bank Summary",
    type: "spreadsheet",
    icon: "🏦",
    description: "ملخص شهري للإيرادات والمصروفات",
    pack: "pack1",
    trustValue: 10,
  },
  {
    id: "system-log-brief",
    name: "سجل النظام المختصر",
    nameEn: "System Log Brief",
    type: "log",
    icon: "📋",
    description: "آخر 10 عمليات في النظام",
    pack: "pack1",
    trustValue: 10,
  },
  {
    id: "email-inquiry",
    name: "إيميل الاستفسار",
    nameEn: "Inquiry Email",
    type: "email",
    icon: "📧",
    description: "إيميل من المحاسبة للمدير المالي",
    pack: "pack1",
    trustValue: 10,
  },
  
  // Pack 2
  {
    id: "bank-transactions",
    name: "كشف الحساب التفصيلي",
    nameEn: "Detailed Bank Statement",
    type: "spreadsheet",
    icon: "🏦",
    description: "جميع المعاملات البنكية مع التفاصيل",
    pack: "pack2",
    trustValue: 15,
  },
  {
    id: "invoices",
    name: "جدول الفواتير",
    nameEn: "Invoices Table",
    type: "spreadsheet",
    icon: "📑",
    description: "جميع الفواتير وحالة الإيصالات",
    pack: "pack2",
    trustValue: 15,
  },
  
  // Pack 3
  {
    id: "activity-log",
    name: "سجل النشاط التفصيلي",
    nameEn: "Detailed Activity Log",
    type: "log",
    icon: "🔐",
    description: "سجل كامل لجميع العمليات مع التفاصيل",
    pack: "pack3",
    trustValue: 20,
  },
  {
    id: "email-urgent",
    name: "إيميل الطلب العاجل",
    nameEn: "Urgent Request Email",
    type: "email",
    icon: "📧",
    description: "إيميل من المدير العام",
    pack: "pack3",
    trustValue: 10,
  },
];

// ============================================
// المشتبه بهم
// ============================================

export interface InterrogationQuestion {
  id: string;
  text: string;
  response: string;
  revealsClue: boolean;
  clue?: string;
  requiresInsight?: string; // يتطلب insight معين لفتح السؤال
}

export interface Suspect {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  yearsInCompany: number;
  personality: string;
  isGuilty: boolean;
  questions: InterrogationQuestion[];
  initialStatement: string;
}

export const SUSPECTS: Suspect[] = [
  {
    id: "ahmed",
    name: "أحمد المنصور",
    nameEn: "Ahmed Al-Mansour",
    role: "المدير المالي",
    roleEn: "CFO",
    yearsInCompany: 5,
    personality: "محترف وهادئ",
    isGuilty: false,
    initialStatement: "أنا مسؤول عن التوقيعات النهائية فقط. كل معاملة تمر عبر المراجعة أولاً.",
    questions: [
      {
        id: "ahmed-q1",
        text: "لماذا دخلت النظام مساءً يوم 20 فبراير؟",
        response: "كان لدي اجتماع مجلس إدارة في اليوم التالي، والمدير العام طلب مني تجهيز تقرير المصروفات. يمكنك التحقق من الإيميلات.",
        revealsClue: true,
        clue: "أحمد لديه تفسير لدخوله المتأخر",
        requiresInsight: "after-hours",
      },
      {
        id: "ahmed-q2",
        text: "كيف تعتمد الفواتير؟",
        response: "أثق في فريقي. عندما يقدم أحدهم طلب شراء، أفترض أنه تم التأكد منه. ربما كان يجب أن أدقق أكثر.",
        revealsClue: true,
        clue: "أحمد يعتمد الفواتير بدون تدقيق كافٍ",
      },
      {
        id: "ahmed-q3",
        text: "من يطلب معظم المشتريات؟",
        response: "مدير المشتريات هو المسؤول عن كل طلبات الشراء. أنا فقط أوقع على الموافقة النهائية.",
        revealsClue: true,
        clue: "كل طلبات الشراء تأتي من مدير المشتريات",
      },
    ],
  },
  {
    id: "sara",
    name: "سارة الخالد",
    nameEn: "Sara Al-Khaled",
    role: "المحاسبة",
    roleEn: "Accountant",
    yearsInCompany: 3,
    personality: "دقيقة ومنظمة",
    isGuilty: false,
    initialStatement: "أنا أسجل الإيرادات والمصروفات الثابتة فقط. المشتريات ليست من اختصاصي.",
    questions: [
      {
        id: "sara-q1",
        text: "لماذا تسجلين فواتير كثيرة؟",
        response: "أنا فقط أسجل ما يُطلب مني تسجيله. الفواتير تأتيني معتمدة ومجهزة، ودوري هو الإدخال فقط.",
        revealsClue: true,
        clue: "سارة تسجل فقط ولا تنشئ الفواتير",
      },
      {
        id: "sara-q2",
        text: "هل لاحظتِ شيئاً غريباً؟",
        response: "نعم، أرسلت إيميل لأحمد أسأله عن الزيادة الكبيرة في الفواتير. لكن لم أتلقَ متابعة كافية.",
        revealsClue: true,
        clue: "سارة نبهت الإدارة للمشكلة مسبقاً",
      },
      {
        id: "sara-q3",
        text: "متى تعملين عادةً؟",
        response: "من الساعة 8 صباحاً حتى 5 مساءً. لا أحتاج للعمل بعد الدوام، كل مهامي أنجزها خلال ساعات العمل.",
        revealsClue: true,
        clue: "سارة تعمل خلال ساعات الدوام فقط",
        requiresInsight: "after-hours",
      },
    ],
  },
  {
    id: "karim",
    name: "كريم الحسن",
    nameEn: "Karim Al-Hassan",
    role: "مدير المشتريات",
    roleEn: "Procurement Manager",
    yearsInCompany: 2,
    personality: "نشيط ومتحمس",
    isGuilty: true,
    initialStatement: "المشتريات كلها موثقة. الشركة تتوسع ونحتاج معدات جديدة للمشاريع.",
    questions: [
      {
        id: "karim-q1",
        text: "لماذا بعض الفواتير بدون إيصالات؟",
        response: "بعض الموردين الجدد لا يعطون إيصالات فورية. الإيصالات ستصل لاحقاً بعد اكتمال التوريد.",
        revealsClue: true,
        clue: "كريم يبرر غياب الإيصالات",
        requiresInsight: "no-receipt",
      },
      {
        id: "karim-q2",
        text: "لماذا تدخل النظام بعد ساعات العمل؟",
        response: "أفضل العمل في هدوء لإنجاز المهام المتراكمة. الصباح مزدحم بالاجتماعات.",
        revealsClue: true,
        clue: "كريم يعمل بعد الدوام بانتظام",
        requiresInsight: "after-hours",
      },
      {
        id: "karim-q3",
        text: "من هم الموردون الجدد؟",
        response: "شركات جديدة في السوق تقدم أسعاراً تنافسية. تعاملت معهم للمرة الأولى هذا العام.",
        revealsClue: true,
        clue: "كريم لم يقدم تفاصيل واضحة عن الموردين",
      },
    ],
  },
];

// ============================================
// الفرضيات - تظهر بعد أول Insight
// ============================================

export const HYPOTHESES = [
  {
    id: "hypothesis-ahmed",
    suspectId: "ahmed",
    title: "أحمد يستغل منصبه",
    description: "المدير المالي يوقع على معاملات وهمية لتحقيق مكاسب شخصية",
    isCorrect: false,
  },
  {
    id: "hypothesis-sara",
    suspectId: "sara",
    title: "سارة تتلاعب بالتسجيلات",
    description: "المحاسبة تضخم الأرقام أو تسجل معاملات وهمية",
    isCorrect: false,
  },
  {
    id: "hypothesis-karim",
    suspectId: "karim",
    title: "كريم يزور الفواتير",
    description: "مدير المشتريات ينشئ فواتير وهمية لموردين غير موجودين",
    isCorrect: true,
  },
];

// ============================================
// الـ Insights المطلوبة (3 فقط)
// ============================================

export const REQUIRED_INSIGHTS = {
  "after-hours": {
    id: "after-hours",
    name: "نشاط بعد الدوام",
    description: "شخص واحد يتكرر دخوله بعد ساعات العمل",
    howToDiscover: "Group By على المستخدم + Filter على الوقت > 18:00",
  },
  "no-receipt": {
    id: "no-receipt",
    name: "فواتير بدون إيصالات",
    description: "مبالغ كبيرة بدون توثيق",
    howToDiscover: "Filter على hasReceipt = false + Sum على المبالغ",
  },
  "same-requester": {
    id: "same-requester",
    name: "طالب واحد للمشتريات",
    description: "جميع الفواتير بدون إيصال من نفس الشخص",
    howToDiscover: "Match بين الفواتير بدون إيصال واسم الطالب",
  },
};

// ============================================
// حل القضية
// ============================================

export const CASE_SOLUTION = {
  culprit: "karim",
  culpritName: "كريم الحسن",
  method: "إنشاء فواتير وهمية لموردين غير موجودين",
  totalStolen: 46000,
  keyEvidence: ["invoices", "activity-log", "bank-transactions"],
  misleadingElements: [
    { suspectId: "sara", reason: "تظهر في سجلات كثيرة لأنها تسجل - لكنها لا تنشئ" },
    { suspectId: "ahmed", reason: "يوافق على كل شيء - لكن دوره اعتماد روتيني" },
  ],
};

// ============================================
// للتوافق مع الكود القديم
// ============================================

export const MONTHLY_SUMMARY = BANK_SUMMARY;
export const SYSTEM_ACCESS_LOGS = ACTIVITY_LOG;
export const INTERNAL_EMAILS = [EMAIL_PACK1, EMAIL_PACK3];
export const FINANCIAL_DATA = {
  bankTransactions: BANK_TRANSACTIONS,
  monthlySummary: BANK_SUMMARY,
};
