// Case 1: الأموال المفقودة - The Missing Money
// قضية تعليمية لتعلم تحليل البيانات واكتشاف الاحتيال

export const CASE_INFO = {
  id: "case-1",
  title: "الأموال المفقودة",
  titleEn: "The Missing Money",
  difficulty: "beginner",
  estimatedTime: "20-30 دقيقة",
  description: "شركة تجارية صغيرة اكتشفت اختفاء 45,000 ريال من حساباتها على مدى 3 أشهر. مهمتك كمحقق بيانات هي تحليل السجلات المالية وكشف المختلس.",
  learningObjectives: [
    "قراءة وفهم البيانات المالية",
    "اكتشاف الشذوذ (Anomalies) في البيانات",
    "حساب الإحصائيات الأساسية (Mean, Median)",
    "مقارنة الفترات الزمنية",
    "استخدام الفلترة للتركيز على البيانات المهمة",
  ],
};

// البيانات المالية الحقيقية للتحليل
export const FINANCIAL_DATA = {
  // كشف الحساب البنكي - 3 أشهر
  bankTransactions: [
    // يناير - شهر عادي
    { id: "t1", date: "2024-01-03", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
    { id: "t2", date: "2024-01-05", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara" },
    { id: "t3", date: "2024-01-08", description: "دفعة من عميل - شركة الأمل", amount: 45000, category: "revenue", enteredBy: "sara" },
    { id: "t4", date: "2024-01-12", description: "مستلزمات مكتبية", amount: -1200, category: "supplies", enteredBy: "karim" },
    { id: "t5", date: "2024-01-15", description: "دفعة من عميل - مؤسسة النور", amount: 32000, category: "revenue", enteredBy: "sara" },
    { id: "t6", date: "2024-01-18", description: "صيانة معدات", amount: -2500, category: "maintenance", enteredBy: "karim" },
    { id: "t7", date: "2024-01-22", description: "فاتورة كهرباء", amount: -1800, category: "utilities", enteredBy: "sara" },
    { id: "t8", date: "2024-01-25", description: "معدات حاسوب", amount: -4500, category: "equipment", enteredBy: "karim" },
    
    // فبراير - بداية الشذوذ
    { id: "t9", date: "2024-02-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
    { id: "t10", date: "2024-02-03", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara" },
    { id: "t11", date: "2024-02-06", description: "دفعة من عميل - شركة الأمل", amount: 38000, category: "revenue", enteredBy: "sara" },
    { id: "t12", date: "2024-02-08", description: "معدات مكتبية خاصة", amount: -12000, category: "equipment", enteredBy: "karim", suspicious: true },
    { id: "t13", date: "2024-02-12", description: "دفعة من عميل - مؤسسة البناء", amount: 28000, category: "revenue", enteredBy: "sara" },
    { id: "t14", date: "2024-02-15", description: "خدمات استشارية", amount: -8500, category: "consulting", enteredBy: "karim", suspicious: true },
    { id: "t15", date: "2024-02-18", description: "فاتورة كهرباء", amount: -1900, category: "utilities", enteredBy: "sara" },
    { id: "t16", date: "2024-02-22", description: "مستلزمات طباعة", amount: -3200, category: "supplies", enteredBy: "karim" },
    { id: "t17", date: "2024-02-25", description: "صيانة طارئة", amount: -5000, category: "maintenance", enteredBy: "karim", suspicious: true },
    
    // مارس - الشهر الأسوأ
    { id: "t18", date: "2024-03-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara" },
    { id: "t19", date: "2024-03-04", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara" },
    { id: "t20", date: "2024-03-07", description: "دفعة من عميل - شركة التقنية", amount: 35000, category: "revenue", enteredBy: "sara" },
    { id: "t21", date: "2024-03-10", description: "معدات تقنية متخصصة", amount: -18000, category: "equipment", enteredBy: "karim", suspicious: true },
    { id: "t22", date: "2024-03-12", description: "خدمات تدريب خارجي", amount: -9500, category: "training", enteredBy: "karim", suspicious: true },
    { id: "t23", date: "2024-03-15", description: "دفعة من عميل - مؤسسة النور", amount: 26000, category: "revenue", enteredBy: "sara" },
    { id: "t24", date: "2024-03-18", description: "فاتورة كهرباء", amount: -2100, category: "utilities", enteredBy: "sara" },
    { id: "t25", date: "2024-03-20", description: "برمجيات وتراخيص", amount: -7500, category: "software", enteredBy: "karim", suspicious: true },
    { id: "t26", date: "2024-03-25", description: "صيانة شاملة", amount: -6000, category: "maintenance", enteredBy: "karim", suspicious: true },
    { id: "t27", date: "2024-03-28", description: "مستلزمات إضافية", amount: -4000, category: "supplies", enteredBy: "karim", suspicious: true },
  ],
  
  // ملخص شهري للتحليل السريع
  monthlySummary: [
    { 
      month: "يناير", 
      monthEn: "January",
      revenue: 77000, 
      expenses: 46000, 
      netProfit: 31000,
      karimExpenses: 8200,
      saraExpenses: 37800,
      transactionCount: 8,
      avgTransaction: 15375,
    },
    { 
      month: "فبراير", 
      monthEn: "February",
      revenue: 66000, 
      expenses: 66600, 
      netProfit: -600,
      karimExpenses: 28700,
      saraExpenses: 37900,
      transactionCount: 9,
      avgTransaction: 14733,
      anomaly: true,
    },
    { 
      month: "مارس", 
      monthEn: "March",
      revenue: 61000, 
      expenses: 83100, 
      netProfit: -22100,
      karimExpenses: 45000,
      saraExpenses: 38100,
      transactionCount: 10,
      avgTransaction: 14410,
      anomaly: true,
    },
  ],
};

// المشتبه بهم
export const SUSPECTS = [
  {
    id: "ahmed",
    name: "أحمد المنصور",
    nameEn: "Ahmed Al-Mansour",
    role: "المدير المالي",
    roleEn: "CFO",
    yearsInCompany: 5,
    accessLevel: "موقع على المعاملات",
    personality: "محترف وهادئ",
    alibi: "يوقع فقط على المعاملات المعتمدة من الآخرين",
    suspicious: false,
    dialogues: [
      {
        text: "أنا مسؤول فقط عن التوقيعات النهائية. كل معاملة تمر عبر سارة للمراجعة المحاسبية.",
        mood: "neutral" as const,
        clue: null,
      },
      {
        text: "لاحظت زيادة في فواتير المشتريات مؤخراً، لكن كريم أكد أنها ضرورية للمشاريع الجديدة.",
        mood: "suspicious" as const,
        clue: "أحمد لاحظ زيادة المشتريات لكنه وثق بكريم",
      },
      {
        text: "للأمانة، أنا أثق بفريقي. ربما كان يجب أن أدقق أكثر في التفاصيل.",
        mood: "neutral" as const,
        clue: null,
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
    accessLevel: "إدخال ومراجعة المعاملات",
    personality: "دقيقة ومنظمة",
    alibi: "تعمل على الإيرادات والمصروفات الثابتة فقط",
    suspicious: false,
    dialogues: [
      {
        text: "أنا أسجل الإيرادات والمصروفات الثابتة كالرواتب والإيجار. كريم يتعامل مع المشتريات.",
        mood: "neutral" as const,
        clue: "سارة تؤكد أن كريم مسؤول عن المشتريات",
      },
      {
        text: "لاحظت في الأشهر الأخيرة زيادة كبيرة في فئة المشتريات والصيانة. سألت كريم لكنه قال إنها طلبات الإدارة.",
        mood: "suspicious" as const,
        clue: "سارة لاحظت زيادة غير طبيعية في مشتريات كريم",
      },
      {
        text: "عندما راجعت الأرقام، وجدت أن مصروفات كريم في مارس وحده تساوي 45 ألف ريال! هذا غير طبيعي.",
        mood: "nervous" as const,
        clue: "45,000 ريال مصروفات كريم في مارس = المبلغ المفقود!",
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
    accessLevel: "إصدار أوامر الشراء",
    personality: "نشيط ومتحمس",
    alibi: "يدعي أن كل المشتريات مبررة",
    suspicious: true,
    dialogues: [
      {
        text: "المشتريات كلها موثقة! لدي فواتير لكل عملية... أغلبها على الأقل.",
        mood: "nervous" as const,
        clue: "كريم متردد بشأن الفواتير",
      },
      {
        text: "الشركة تتوسع! نحتاج معدات جديدة ودورات تدريبية. أنا بس بنفذ اللي مطلوب مني!",
        mood: "angry" as const,
        clue: "كريم يحاول تبرير المصروفات الزائدة",
      },
      {
        text: "ليه تسألني أنا؟ راجع الفواتير بنفسك! ... بس... بعض الموردين ما يعطوا فواتير رسمية...",
        mood: "nervous" as const,
        clue: "كريم يعترف بوجود مشتريات بدون فواتير رسمية",
      },
    ],
  },
];

// المفاهيم التعليمية
export const LEARNING_CONCEPTS = [
  {
    id: "data-reading",
    title: "قراءة البيانات",
    titleEn: "Data Reading",
    description: "القدرة على فهم وتفسير البيانات المالية في الجداول",
    icon: "📊",
    exampleInCase: "قراءة كشف الحساب البنكي وفهم أنواع المعاملات",
    unlockCondition: "collect-bank",
  },
  {
    id: "anomaly-detection",
    title: "اكتشاف الشذوذ",
    titleEn: "Anomaly Detection",
    description: "التعرف على القيم غير العادية أو المشبوهة في البيانات",
    icon: "🔍",
    exampleInCase: "ملاحظة أن مصروفات مارس أعلى بكثير من الأشهر السابقة",
    unlockCondition: "find-anomaly",
  },
  {
    id: "mean-calculation",
    title: "المتوسط الحسابي",
    titleEn: "Mean (Average)",
    description: "حساب متوسط القيم للمقارنة واكتشاف الانحرافات",
    icon: "📐",
    formula: "المجموع ÷ عدد العناصر",
    exampleInCase: "متوسط مصروفات كريم الشهرية = 27,300 ريال (مقارنة بـ 8,200 في يناير!)",
    unlockCondition: "calculate-mean",
  },
  {
    id: "filtering",
    title: "الفلترة",
    titleEn: "Filtering",
    description: "تصفية البيانات للتركيز على العناصر المهمة",
    icon: "🔎",
    exampleInCase: "فلترة المعاملات حسب الشخص المسؤول (كريم vs سارة)",
    unlockCondition: "use-filter",
  },
  {
    id: "comparison",
    title: "المقارنة الزمنية",
    titleEn: "Time Comparison",
    description: "مقارنة البيانات عبر فترات زمنية مختلفة",
    icon: "📈",
    exampleInCase: "مقارنة مصروفات يناير (عادية) بمارس (مشبوهة)",
    unlockCondition: "compare-months",
  },
  {
    id: "pattern-recognition",
    title: "التعرف على الأنماط",
    titleEn: "Pattern Recognition",
    description: "اكتشاف الأنماط المتكررة أو غير العادية في البيانات",
    icon: "🧩",
    exampleInCase: "ملاحظة أن جميع المعاملات المشبوهة مدخلة من كريم",
    unlockCondition: "find-pattern",
  },
];

// تحديات التحليل
export const ANALYSIS_CHALLENGES = [
  {
    id: "challenge-1",
    title: "اكتشف الشهر المشبوه",
    description: "أي شهر يظهر فيه أكبر فرق بين الإيرادات والمصروفات؟",
    type: "multiple-choice",
    options: [
      { id: "jan", text: "يناير", isCorrect: false },
      { id: "feb", text: "فبراير", isCorrect: false },
      { id: "mar", text: "مارس", isCorrect: true },
    ],
    explanation: "مارس هو الشهر الوحيد بخسارة كبيرة (-22,100 ريال) مقارنة بربح يناير (+31,000)",
    conceptUnlocked: "anomaly-detection",
    points: 100,
  },
  {
    id: "challenge-2",
    title: "حساب المتوسط",
    description: "ما هو متوسط مصروفات كريم الشهرية خلال الـ 3 أشهر؟",
    type: "calculation",
    correctAnswer: 27300,
    tolerance: 500, // هامش خطأ مقبول
    hint: "اجمع مصروفات كريم في كل شهر ثم اقسم على 3",
    data: {
      january: 8200,
      february: 28700,
      march: 45000,
    },
    explanation: "(8,200 + 28,700 + 45,000) ÷ 3 = 27,300 ريال",
    conceptUnlocked: "mean-calculation",
    points: 150,
  },
  {
    id: "challenge-3",
    title: "فلترة البيانات",
    description: "كم معاملة مشبوهة (suspicious) موجودة في السجلات؟",
    type: "counting",
    correctAnswer: 8,
    hint: "ابحث عن المعاملات المميزة بعلامة 'مريب'",
    conceptUnlocked: "filtering",
    points: 100,
  },
  {
    id: "challenge-4",
    title: "اكتشف النمط",
    description: "من المسؤول عن جميع المعاملات المشبوهة؟",
    type: "multiple-choice",
    options: [
      { id: "ahmed", text: "أحمد", isCorrect: false },
      { id: "sara", text: "سارة", isCorrect: false },
      { id: "karim", text: "كريم", isCorrect: true },
    ],
    explanation: "جميع المعاملات المشبوهة الـ 8 مدخلة من حساب كريم!",
    conceptUnlocked: "pattern-recognition",
    points: 150,
  },
  {
    id: "challenge-5",
    title: "المقارنة النهائية",
    description: "بكم تضاعفت مصروفات كريم من يناير إلى مارس؟",
    type: "calculation",
    correctAnswer: 5.5, // 45000 / 8200 ≈ 5.5
    tolerance: 0.5,
    hint: "اقسم مصروفات مارس على مصروفات يناير",
    explanation: "45,000 ÷ 8,200 ≈ 5.5 مرات! هذه زيادة ضخمة ومريبة جداً",
    conceptUnlocked: "comparison",
    points: 200,
  },
];

// الأدلة القابلة للجمع
export const EVIDENCE_ITEMS = [
  {
    id: "bank-statement",
    name: "كشف الحساب البنكي",
    nameEn: "Bank Statement",
    type: "spreadsheet" as const,
    icon: "🏦",
    description: "جميع المعاملات المالية للـ 3 أشهر الماضية",
    location: "cabinet-1",
    analysis: "يظهر الكشف 27 معاملة، منها 8 مشبوهة. جميع المعاملات المشبوهة مرتبطة بكريم.",
    clue: "المعاملات المشبوهة كلها من كريم",
  },
  {
    id: "purchase-log",
    name: "سجل المشتريات",
    nameEn: "Purchase Log",
    type: "spreadsheet" as const,
    icon: "📊",
    description: "تفاصيل جميع المشتريات وأوامر الشراء",
    location: "cabinet-2",
    analysis: "زيادة 450% في المشتريات بين يناير ومارس. بعض الموردين غير معروفين.",
    clue: "زيادة غير مبررة في المشتريات",
  },
  {
    id: "emails",
    name: "إيميلات المدير المالي",
    nameEn: "CFO Emails",
    type: "email" as const,
    icon: "📧",
    description: "المراسلات الداخلية المتعلقة بالموافقات المالية",
    location: "desk",
    analysis: "أحمد وافق على طلبات كريم بناءً على ثقته به دون تدقيق كافي.",
    clue: "أحمد يثق بكريم بشكل مفرط",
  },
  {
    id: "audit-report",
    name: "تقرير المراجعة",
    nameEn: "Audit Report",
    type: "document" as const,
    icon: "📋",
    description: "تقرير المراجعة الداخلية - مقفل حتى جمع أدلة كافية",
    location: "safe",
    locked: true,
    unlockRequirement: 2, // يحتاج جمع دليلين
    analysis: "التقرير يؤكد وجود فجوة 45,000 ريال لا يمكن تفسيرها.",
    clue: "المبلغ المفقود = 45,000 ريال بالضبط",
  },
  {
    id: "access-logs",
    name: "سجلات الدخول للنظام",
    nameEn: "System Access Logs",
    type: "log" as const,
    icon: "🔐",
    description: "من دخل النظام ومتى",
    location: "computer",
    locked: true,
    unlockRequirement: 3,
    analysis: "كريم كان يدخل النظام في أوقات غير رسمية لإدخال معاملات.",
    clue: "كريم يعمل في أوقات غير رسمية",
  },
];

// النتيجة النهائية
export const CASE_SOLUTION = {
  culprit: "karim",
  method: "تزوير فواتير مشتريات وهمية وإدخالها في النظام المحاسبي",
  totalAmount: 45000,
  monthlyBreakdown: {
    january: 0, // لم يبدأ بعد
    february: 20500, // 12000 + 8500
    march: 45000, // 18000 + 9500 + 7500 + 6000 + 4000
  },
  evidence: [
    "جميع المعاملات المشبوهة من حسابه",
    "زيادة 450% في مشترياته",
    "تردده وعصبيته في الاستجواب",
    "اعترافه بوجود مشتريات بدون فواتير رسمية",
  ],
  redHerrings: [
    "أحمد يوقع على المعاملات - لكنه لا يدخلها",
    "سارة لديها وصول للنظام - لكن مصروفاتها ثابتة",
  ],
};
