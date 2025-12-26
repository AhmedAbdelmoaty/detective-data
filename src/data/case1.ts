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

// ============================================
// البيانات المالية - منفصلة ومختلفة لكل نوع دليل
// ============================================

// كشف الحساب البنكي - المعاملات الفعلية
export const BANK_TRANSACTIONS = [
  // يناير - شهر عادي
  { id: "t1", date: "2024-01-03", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t2", date: "2024-01-05", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara", verified: true },
  { id: "t3", date: "2024-01-08", description: "دفعة من عميل - شركة الأمل", amount: 45000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t4", date: "2024-01-12", description: "مستلزمات مكتبية", amount: -1200, category: "supplies", enteredBy: "karim", verified: true },
  { id: "t5", date: "2024-01-15", description: "دفعة من عميل - مؤسسة النور", amount: 32000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t6", date: "2024-01-18", description: "صيانة معدات", amount: -2500, category: "maintenance", enteredBy: "karim", verified: true },
  { id: "t7", date: "2024-01-22", description: "فاتورة كهرباء", amount: -1800, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t8", date: "2024-01-25", description: "معدات حاسوب", amount: -4500, category: "equipment", enteredBy: "karim", verified: true },
  
  // فبراير - بداية الشذوذ
  { id: "t9", date: "2024-02-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t10", date: "2024-02-03", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara", verified: true },
  { id: "t11", date: "2024-02-06", description: "دفعة من عميل - شركة الأمل", amount: 38000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t12", date: "2024-02-08", description: "معدات مكتبية خاصة", amount: -12000, category: "equipment", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t13", date: "2024-02-12", description: "دفعة من عميل - مؤسسة البناء", amount: 28000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t14", date: "2024-02-15", description: "خدمات استشارية", amount: -8500, category: "consulting", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t15", date: "2024-02-18", description: "فاتورة كهرباء", amount: -1900, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t16", date: "2024-02-22", description: "مستلزمات طباعة", amount: -3200, category: "supplies", enteredBy: "karim", verified: true },
  { id: "t17", date: "2024-02-25", description: "صيانة طارئة", amount: -5000, category: "maintenance", enteredBy: "karim", suspicious: true, verified: false },
  
  // مارس - الشهر الأسوأ
  { id: "t18", date: "2024-03-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t19", date: "2024-03-04", description: "إيجار المكتب", amount: -8000, category: "rent", enteredBy: "sara", verified: true },
  { id: "t20", date: "2024-03-07", description: "دفعة من عميل - شركة التقنية", amount: 35000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t21", date: "2024-03-10", description: "معدات تقنية متخصصة", amount: -18000, category: "equipment", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t22", date: "2024-03-12", description: "خدمات تدريب خارجي", amount: -9500, category: "training", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t23", date: "2024-03-15", description: "دفعة من عميل - مؤسسة النور", amount: 26000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t24", date: "2024-03-18", description: "فاتورة كهرباء", amount: -2100, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t25", date: "2024-03-20", description: "برمجيات وتراخيص", amount: -7500, category: "software", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t26", date: "2024-03-25", description: "صيانة شاملة", amount: -6000, category: "maintenance", enteredBy: "karim", suspicious: true, verified: false },
  { id: "t27", date: "2024-03-28", description: "مستلزمات إضافية", amount: -4000, category: "supplies", enteredBy: "karim", suspicious: true, verified: false },
];

// سجل المشتريات - الفواتير التفصيلية (مختلف عن كشف البنك!)
export const PURCHASE_INVOICES = [
  // فواتير يناير - كلها موثقة
  { id: "inv-1", date: "2024-01-12", vendor: "مكتبة الرياض", items: "أقلام، ورق، ملفات", amount: 1200, poNumber: "PO-2024-001", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-2", date: "2024-01-18", vendor: "شركة الصيانة المتحدة", items: "صيانة طابعات", amount: 2500, poNumber: "PO-2024-002", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-3", date: "2024-01-25", vendor: "متجر الإلكترونيات", items: "3 لابتوب Dell", amount: 4500, poNumber: "PO-2024-003", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  
  // فواتير فبراير - بداية المشاكل
  { id: "inv-4", date: "2024-02-08", vendor: "مورد غير معروف", items: "معدات مكتبية متنوعة", amount: 12000, poNumber: "PO-2024-004", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد تفاصيل للأصناف!" },
  { id: "inv-5", date: "2024-02-15", vendor: "شركة الاستشارات", items: "استشارات تقنية", amount: 8500, poNumber: "PO-2024-005", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد عقد أو تقرير!" },
  { id: "inv-6", date: "2024-02-22", vendor: "مكتبة الرياض", items: "مستلزمات طباعة", amount: 3200, poNumber: "PO-2024-006", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-7", date: "2024-02-25", vendor: "مقاول خاص", items: "صيانة طارئة", amount: 5000, poNumber: "PO-2024-007", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد تقرير صيانة!" },
  
  // فواتير مارس - الاحتيال الواضح
  { id: "inv-8", date: "2024-03-10", vendor: "تقنيات المستقبل", items: "أجهزة متخصصة", amount: 18000, poNumber: "PO-2024-008", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "الشركة غير مسجلة!" },
  { id: "inv-9", date: "2024-03-12", vendor: "معهد التدريب الدولي", items: "دورة تدريبية", amount: 9500, poNumber: "PO-2024-009", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد حضور مسجل!" },
  { id: "inv-10", date: "2024-03-20", vendor: "برمجيات متقدمة", items: "تراخيص برمجيات", amount: 7500, poNumber: "PO-2024-010", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لم يتم تثبيت أي برنامج!" },
  { id: "inv-11", date: "2024-03-25", vendor: "شركة الصيانة", items: "صيانة شاملة", amount: 6000, poNumber: "PO-2024-011", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "رقم تجاري مختلف عن المعتاد!" },
  { id: "inv-12", date: "2024-03-28", vendor: "متجر المكتبيات", items: "مستلزمات إضافية", amount: 4000, poNumber: "PO-2024-012", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "كمية غير منطقية!" },
];

// سجلات الدخول للنظام - دليل جديد مختلف
export const SYSTEM_ACCESS_LOGS = [
  { id: "log-1", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة معاملة", details: "PO-2024-004", ip: "192.168.1.105", afterHours: true },
  { id: "log-2", date: "2024-02-14", time: "21:30", user: "karim", action: "تعديل فاتورة", details: "PO-2024-005", ip: "192.168.1.105", afterHours: true },
  { id: "log-3", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد جديد", details: "مقاول خاص", ip: "192.168.1.105", afterHours: true },
  { id: "log-4", date: "2024-03-09", time: "20:00", user: "karim", action: "إضافة معاملة", details: "PO-2024-008", ip: "192.168.1.105", afterHours: true },
  { id: "log-5", date: "2024-03-11", time: "22:30", user: "karim", action: "تعديل سجل", details: "PO-2024-009", ip: "192.168.1.105", afterHours: true },
  { id: "log-6", date: "2024-03-19", time: "21:45", user: "karim", action: "إضافة فاتورة", details: "PO-2024-010", ip: "192.168.1.105", afterHours: true },
  { id: "log-7", date: "2024-03-24", time: "23:00", user: "karim", action: "تعديل مورد", details: "شركة الصيانة", ip: "192.168.1.105", afterHours: true },
  // سجلات عادية للمقارنة
  { id: "log-8", date: "2024-01-10", time: "09:30", user: "sara", action: "إضافة إيراد", details: "شركة الأمل", ip: "192.168.1.102", afterHours: false },
  { id: "log-9", date: "2024-02-05", time: "10:15", user: "sara", action: "إضافة إيراد", details: "شركة الأمل", ip: "192.168.1.102", afterHours: false },
  { id: "log-10", date: "2024-03-06", time: "11:00", user: "sara", action: "إضافة إيراد", details: "شركة التقنية", ip: "192.168.1.102", afterHours: false },
];

// ملخص شهري للتحليل السريع
export const MONTHLY_SUMMARY = [
  { 
    month: "يناير", 
    monthEn: "January",
    revenue: 77000, 
    expenses: 46000, 
    netProfit: 31000,
    karimExpenses: 8200,
    saraExpenses: 37800,
    transactionCount: 8,
    suspiciousCount: 0,
    verifiedExpenses: 8200,
    unverifiedExpenses: 0,
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
    suspiciousCount: 3,
    verifiedExpenses: 3200,
    unverifiedExpenses: 25500,
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
    suspiciousCount: 5,
    verifiedExpenses: 0,
    unverifiedExpenses: 45000,
    anomaly: true,
  },
];

// للتوافق مع الكود القديم
export const FINANCIAL_DATA = {
  bankTransactions: BANK_TRANSACTIONS,
  monthlySummary: MONTHLY_SUMMARY,
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
    isRedHerring: true, // دليل مضلل!
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
    isRedHerring: true, // دليل مضلل!
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
    isRedHerring: false,
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
  {
    id: "data-validation",
    title: "التحقق من البيانات",
    titleEn: "Data Validation",
    description: "التأكد من صحة ودقة البيانات المدخلة",
    icon: "✅",
    exampleInCase: "مقارنة الفواتير بالمعاملات البنكية للتأكد من التطابق",
    unlockCondition: "validate-data",
  },
  {
    id: "cross-referencing",
    title: "الربط المتبادل",
    titleEn: "Cross-Referencing",
    description: "ربط البيانات من مصادر مختلفة لاكتشاف التناقضات",
    icon: "🔗",
    exampleInCase: "ربط سجلات الدخول بالفواتير المشبوهة",
    unlockCondition: "cross-reference",
  },
];

// تحديات التحليل المحسنة - تحديات حقيقية!
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
    tolerance: 500,
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
    description: "كم عدد الفواتير بدون إيصال في سجل المشتريات؟",
    type: "counting",
    correctAnswer: 8,
    hint: "راجع سجل المشتريات وعد الفواتير التي hasReceipt = false",
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
    correctAnswer: 5.5,
    tolerance: 0.5,
    hint: "اقسم مصروفات مارس على مصروفات يناير",
    explanation: "45,000 ÷ 8,200 ≈ 5.5 مرات! هذه زيادة ضخمة ومريبة جداً",
    conceptUnlocked: "comparison",
    points: 200,
  },
  // تحديات جديدة متقدمة
  {
    id: "challenge-6",
    title: "التحقق من الفواتير",
    description: "كم يبلغ إجمالي المبالغ في الفواتير بدون إيصالات؟",
    type: "calculation",
    correctAnswer: 70500,
    tolerance: 500,
    hint: "اجمع مبالغ الفواتير التي hasReceipt = false",
    explanation: "12000 + 8500 + 5000 + 18000 + 9500 + 7500 + 6000 + 4000 = 70,500 ريال",
    conceptUnlocked: "data-validation",
    points: 200,
  },
  {
    id: "challenge-7",
    title: "تحليل سجلات الدخول",
    description: "كم مرة دخل كريم النظام بعد ساعات العمل؟",
    type: "counting",
    correctAnswer: 7,
    hint: "راجع سجلات الدخول وعد الإدخالات التي afterHours = true و user = karim",
    conceptUnlocked: "cross-referencing",
    points: 150,
  },
  {
    id: "challenge-8",
    title: "صحح الخطأ في الجدول",
    description: "في جدول الملخص الشهري، ما الفرق بين إجمالي مصروفات كريم المسجلة والمبلغ المفقود؟",
    type: "calculation",
    correctAnswer: 36800,
    tolerance: 100,
    hint: "اجمع مصروفات كريم في 3 أشهر (8200 + 28700 + 45000) واطرح المبلغ المفقود (45000)",
    explanation: "مصروفات كريم الإجمالية = 81,900 ريال، المبلغ المفقود = 45,000 ريال، الفرق = 36,900 ريال (المصروفات المشروعة)",
    conceptUnlocked: "data-validation",
    points: 250,
  },
];

// الأدلة القابلة للجمع - مختلفة تماماً!
export const EVIDENCE_ITEMS = [
  {
    id: "bank-statement",
    name: "كشف الحساب البنكي",
    nameEn: "Bank Statement",
    type: "spreadsheet" as const,
    icon: "🏦",
    description: "جميع المعاملات المالية للـ 3 أشهر الماضية من البنك",
    location: "cabinet-1",
    dataKey: "bankTransactions",
    analysis: "يظهر الكشف 27 معاملة، منها 8 مشبوهة. جميع المعاملات المشبوهة مرتبطة بكريم.",
    clue: "المعاملات المشبوهة كلها من كريم",
    trustValue: 15,
    isEssential: true,
  },
  {
    id: "purchase-log",
    name: "سجل المشتريات والفواتير",
    nameEn: "Purchase Invoices",
    type: "spreadsheet" as const,
    icon: "📑",
    description: "الفواتير وأوامر الشراء التفصيلية مع حالة التوثيق",
    location: "cabinet-2",
    dataKey: "purchaseInvoices",
    analysis: "8 فواتير بدون إيصالات من أصل 12. جميعها مرتبطة بكريم!",
    clue: "فواتير وهمية بدون إيصالات",
    trustValue: 20,
    isEssential: true,
  },
  {
    id: "emails",
    name: "إيميلات المدير المالي",
    nameEn: "CFO Emails",
    type: "email" as const,
    icon: "📧",
    description: "المراسلات الداخلية المتعلقة بالموافقات المالية",
    location: "desk",
    dataKey: "emails",
    analysis: "أحمد وافق على طلبات كريم بناءً على ثقته به دون تدقيق كافي.",
    clue: "أحمد يثق بكريم بشكل مفرط",
    trustValue: 10,
    isEssential: false,
    isRedHerring: true, // قد يوجه لأحمد خطأً!
  },
  {
    id: "audit-report",
    name: "تقرير المراجعة",
    nameEn: "Audit Report",
    type: "document" as const,
    icon: "📋",
    description: "تقرير المراجعة الداخلية - يظهر الفجوة المالية",
    location: "safe",
    locked: true,
    unlockRequirement: 2,
    dataKey: "auditReport",
    analysis: "التقرير يؤكد وجود فجوة 45,000 ريال لا يمكن تفسيرها.",
    clue: "المبلغ المفقود = 45,000 ريال بالضبط",
    trustValue: 25,
    isEssential: true,
  },
  {
    id: "access-logs",
    name: "سجلات الدخول للنظام",
    nameEn: "System Access Logs",
    type: "log" as const,
    icon: "🔐",
    description: "من دخل النظام ومتى وماذا فعل",
    location: "computer",
    locked: true,
    unlockRequirement: 3,
    dataKey: "accessLogs",
    analysis: "كريم كان يدخل النظام في أوقات غير رسمية لإدخال معاملات مشبوهة.",
    clue: "كريم يعمل في أوقات غير رسمية",
    trustValue: 25,
    isEssential: true,
  },
];

// الفرضيات الممكنة للاعب
export const HYPOTHESES = [
  {
    id: "hypothesis-ahmed",
    suspectId: "ahmed",
    title: "أحمد هو المختلس",
    description: "المدير المالي يستغل منصبه للتوقيع على معاملات وهمية",
    supportingEvidence: ["emails"],
    contradictingEvidence: ["bank-statement", "purchase-log", "access-logs"],
    isCorrect: false,
    trustCost: 20, // خسارة ثقة عند اختيارها خطأً
  },
  {
    id: "hypothesis-sara",
    suspectId: "sara",
    title: "سارة هي المختلسة",
    description: "المحاسبة تتلاعب بالأرقام لتخفي اختلاسها",
    supportingEvidence: [],
    contradictingEvidence: ["bank-statement", "purchase-log", "access-logs", "audit-report"],
    isCorrect: false,
    trustCost: 25,
  },
  {
    id: "hypothesis-karim",
    suspectId: "karim",
    title: "كريم هو المختلس",
    description: "مدير المشتريات يصدر فواتير وهمية لشركات غير موجودة",
    supportingEvidence: ["bank-statement", "purchase-log", "access-logs", "audit-report"],
    contradictingEvidence: [],
    isCorrect: true,
    trustBonus: 30, // مكافأة ثقة عند اختيارها صح
  },
];

// النتيجة النهائية
export const CASE_SOLUTION = {
  culprit: "karim",
  method: "تزوير فواتير مشتريات وهمية وإدخالها في النظام المحاسبي",
  totalAmount: 45000,
  monthlyBreakdown: {
    january: 0,
    february: 25500, // 12000 + 8500 + 5000
    march: 45000, // 18000 + 9500 + 7500 + 6000 + 4000
  },
  evidence: [
    "جميع المعاملات المشبوهة مسجلة باسم كريم",
    "8 فواتير بدون إيصالات - كلها من كريم",
    "سجلات الدخول تظهر نشاطاً في أوقات غير رسمية",
    "الموردون غير مسجلين أو بأرقام تجارية مشكوك فيها",
  ],
  redHerrings: [
    "إيميلات أحمد - تظهر ثقة مفرطة لكنه ليس المختلس",
    "موقف أحمد كموقع - قد يبدو متواطئاً لكنه فقط مهمل",
  ],
  minEvidenceRequired: 3,
  minInterrogationsRequired: 2,
};
