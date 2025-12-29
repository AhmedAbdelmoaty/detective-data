// Case 1: الأموال المفقودة - The Missing Money
// لعبة تحقيق تفاعلية - بيانات محايدة للتحليل الحقيقي

export const CASE_INFO = {
  id: "case-1",
  title: "الأموال المفقودة",
  titleEn: "The Missing Money",
  difficulty: "beginner",
  estimatedTime: "20-30 دقيقة",
  description: "شركة تجارية صغيرة اكتشفت اختفاء مبلغ من حساباتها على مدى 3 أشهر.",
  briefing: `
    مرحباً أيها المحقق،
    
    تلقينا بلاغاً من شركة "النور التجارية" عن اختفاء مبلغ من حساباتهم.
    المدير العام يشك في أحد الموظفين الثلاثة الذين لديهم صلاحية الوصول للنظام المالي.
    
    مهمتك: افحص البيانات، حلل الأنماط، واكتشف من المسؤول.
    
    تحذير: البيانات تحتاج تحليل دقيق. لا تعتمد على الانطباعات الأولى.
  `,
};

// ============================================
// البيانات المالية - محايدة تماماً
// كل شخص لديه معاملات طبيعية وبعضها يحتاج تدقيق
// ============================================

export const BANK_TRANSACTIONS = [
  // يناير
  { id: "t1", date: "2024-01-03", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t2", date: "2024-01-08", description: "دفعة من عميل - شركة الأمل", amount: 45000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t3", date: "2024-01-15", description: "مستلزمات مكتبية", amount: -2800, category: "supplies", enteredBy: "karim", verified: true },
  { id: "t4", date: "2024-01-18", description: "صيانة معدات", amount: -1500, category: "maintenance", enteredBy: "ahmed", verified: true },
  { id: "t5", date: "2024-01-22", description: "فاتورة كهرباء", amount: -1800, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t6", date: "2024-01-28", description: "معدات حاسوب", amount: -4500, category: "equipment", enteredBy: "karim", verified: true },
  
  // فبراير - هنا تبدأ الأنماط المخفية
  { id: "t7", date: "2024-02-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t8", date: "2024-02-05", description: "خدمات استشارية - تطوير", amount: -3500, category: "consulting", enteredBy: "ahmed", verified: false },
  { id: "t9", date: "2024-02-10", description: "دفعة من عميل - مؤسسة البناء", amount: 38000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t10", date: "2024-02-12", description: "معدات مكتبية متخصصة", amount: -12000, category: "equipment", enteredBy: "karim", verified: false },
  { id: "t11", date: "2024-02-18", description: "تدريب موظفين", amount: -2500, category: "training", enteredBy: "ahmed", verified: true },
  { id: "t12", date: "2024-02-22", description: "فاتورة إنترنت", amount: -800, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t13", date: "2024-02-25", description: "خدمات تقنية خارجية", amount: -8500, category: "consulting", enteredBy: "karim", verified: false },
  
  // مارس
  { id: "t14", date: "2024-03-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t15", date: "2024-03-05", description: "مراجعة حسابات خارجية", amount: -4000, category: "consulting", enteredBy: "ahmed", verified: false },
  { id: "t16", date: "2024-03-08", description: "دفعة من عميل - شركة التقنية", amount: 35000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t17", date: "2024-03-12", description: "معدات تقنية متخصصة", amount: -18000, category: "equipment", enteredBy: "karim", verified: false },
  { id: "t18", date: "2024-03-15", description: "فاتورة مياه", amount: -600, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t19", date: "2024-03-20", description: "صيانة مكيفات", amount: -1200, category: "maintenance", enteredBy: "ahmed", verified: true },
  { id: "t20", date: "2024-03-25", description: "برمجيات وتراخيص", amount: -7500, category: "software", enteredBy: "karim", verified: false },
];

// سجل المشتريات - كل الموظفين لديهم فواتير
export const PURCHASE_INVOICES = [
  // يناير - كلها موثقة
  { id: "inv-1", date: "2024-01-15", vendor: "مكتبة الرياض", items: "أقلام، ورق، ملفات", amount: 2800, poNumber: "PO-2024-001", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-2", date: "2024-01-18", vendor: "شركة الصيانة المتحدة", items: "صيانة طابعات", amount: 1500, poNumber: "PO-2024-002", hasReceipt: true, approvedBy: "ahmed", requestedBy: "ahmed" },
  { id: "inv-3", date: "2024-01-28", vendor: "متجر الإلكترونيات", items: "3 لابتوب Dell", amount: 4500, poNumber: "PO-2024-003", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  
  // فبراير - مختلطة لكل الأشخاص
  { id: "inv-4", date: "2024-02-05", vendor: "مكتب استشارات التطوير", items: "استشارات إدارية", amount: 3500, poNumber: "PO-2024-004", hasReceipt: false, approvedBy: "ahmed", requestedBy: "ahmed" },
  { id: "inv-5", date: "2024-02-12", vendor: "مورد تجهيزات مكتبية", items: "معدات مكتبية متنوعة", amount: 12000, poNumber: "PO-2024-005", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-6", date: "2024-02-18", vendor: "مركز التدريب المتقدم", items: "دورة تدريبية", amount: 2500, poNumber: "PO-2024-006", hasReceipt: true, approvedBy: "ahmed", requestedBy: "ahmed" },
  { id: "inv-7", date: "2024-02-25", vendor: "شركة حلول تقنية", items: "خدمات تقنية", amount: 8500, poNumber: "PO-2024-007", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  
  // مارس
  { id: "inv-8", date: "2024-03-05", vendor: "مكتب المحاسبين القانونيين", items: "مراجعة مالية", amount: 4000, poNumber: "PO-2024-008", hasReceipt: false, approvedBy: "ahmed", requestedBy: "ahmed" },
  { id: "inv-9", date: "2024-03-12", vendor: "تقنيات المستقبل", items: "أجهزة متخصصة", amount: 18000, poNumber: "PO-2024-009", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-10", date: "2024-03-20", vendor: "شركة التكييف والتبريد", items: "صيانة سنوية", amount: 1200, poNumber: "PO-2024-010", hasReceipt: true, approvedBy: "ahmed", requestedBy: "ahmed" },
  { id: "inv-11", date: "2024-03-25", vendor: "برمجيات متقدمة", items: "تراخيص سنوية", amount: 7500, poNumber: "PO-2024-011", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
];

// سجلات الدخول - كل الموظفين لديهم دخول بعد الدوام أحياناً
export const SYSTEM_ACCESS_LOGS = [
  // يناير - أنماط طبيعية
  { id: "log-1", date: "2024-01-10", time: "09:15", user: "sara", action: "تحديث سجل", details: "تقرير يناير", ip: "192.168.1.102", afterHours: false },
  { id: "log-2", date: "2024-01-15", time: "14:30", user: "karim", action: "إضافة فاتورة", details: "PO-2024-001", ip: "192.168.1.105", afterHours: false },
  { id: "log-3", date: "2024-01-28", time: "10:00", user: "karim", action: "إضافة فاتورة", details: "PO-2024-003", ip: "192.168.1.105", afterHours: false },
  
  // فبراير - بداية الأنماط
  { id: "log-4", date: "2024-02-05", time: "20:30", user: "ahmed", action: "مراجعة تقارير", details: "تقرير المصروفات", ip: "192.168.1.100", afterHours: true },
  { id: "log-5", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة معاملة", details: "PO-2024-005", ip: "192.168.1.105", afterHours: true },
  { id: "log-6", date: "2024-02-14", time: "09:30", user: "sara", action: "تحديث سجل", details: "تقرير فبراير", ip: "192.168.1.102", afterHours: false },
  { id: "log-7", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد جديد", details: "شركة حلول تقنية", ip: "192.168.1.105", afterHours: true },
  { id: "log-8", date: "2024-02-26", time: "19:45", user: "ahmed", action: "تحضير تقرير", details: "اجتماع مجلس الإدارة", ip: "192.168.1.100", afterHours: true },
  
  // مارس
  { id: "log-9", date: "2024-03-05", time: "16:00", user: "ahmed", action: "إضافة فاتورة", details: "PO-2024-008", ip: "192.168.1.100", afterHours: false },
  { id: "log-10", date: "2024-03-09", time: "10:00", user: "sara", action: "إضافة إيراد", details: "شركة التقنية", ip: "192.168.1.102", afterHours: false },
  { id: "log-11", date: "2024-03-11", time: "21:00", user: "karim", action: "تعديل فاتورة", details: "PO-2024-009", ip: "192.168.1.105", afterHours: true },
  { id: "log-12", date: "2024-03-15", time: "14:30", user: "ahmed", action: "مراجعة موافقات", details: "فواتير مارس", ip: "192.168.1.100", afterHours: false },
  { id: "log-13", date: "2024-03-24", time: "22:00", user: "karim", action: "إضافة فاتورة", details: "PO-2024-011", ip: "192.168.1.105", afterHours: true },
  { id: "log-14", date: "2024-03-28", time: "18:30", user: "sara", action: "تحديث سجل", details: "إغلاق الشهر", ip: "192.168.1.102", afterHours: false },
];

// الإيميلات الداخلية
export const INTERNAL_EMAILS = [
  {
    id: "email-1",
    date: "2024-02-05",
    from: "المدير العام",
    to: "أحمد المنصور",
    subject: "طلب تقرير عاجل",
    body: "أحمد، أحتاج تقرير المصروفات الشهري الليلة. لدينا اجتماع مجلس الإدارة غداً صباحاً.",
  },
  {
    id: "email-2", 
    date: "2024-03-01",
    from: "سارة الخالد",
    to: "أحمد المنصور",
    subject: "استفسار عن الفواتير",
    body: "أستاذ أحمد، لاحظت زيادة كبيرة في فواتير المشتريات هذا الشهر مقارنة بالأشهر السابقة. هل يمكنك التأكد من صحتها؟",
  },
  {
    id: "email-3",
    date: "2024-03-01", 
    from: "أحمد المنصور",
    to: "سارة الخالد",
    subject: "رد: استفسار عن الفواتير",
    body: "سارة، راجعت مع كريم وأكد أنها مشتريات ضرورية للمشاريع الجديدة. لا تقلقي.",
  },
  {
    id: "email-4",
    date: "2024-02-09",
    from: "كريم الحسن",
    to: "أحمد المنصور",
    subject: "طلب موافقة عاجلة",
    body: "أستاذ أحمد، نحتاج معدات جديدة عاجلة للمشروع. أرجو التوقيع على أمر الشراء المرفق.",
  },
  {
    id: "email-5",
    date: "2024-03-10",
    from: "سارة الخالد",
    to: "كريم الحسن",
    subject: "طلب إيصالات",
    body: "كريم، أحتاج إيصالات الفواتير الأخيرة لإتمام السجلات المحاسبية. بعض الفواتير ناقصة التوثيق.",
  },
  {
    id: "email-6",
    date: "2024-03-12",
    from: "كريم الحسن",
    to: "سارة الخالد",
    subject: "رد: طلب إيصالات",
    body: "سارة، الموردون الجدد لا يعطون إيصالات فورية. سأتابع معهم وأرسل لك عندما تصل.",
  },
];

// ملخص شهري للتحليل
export const MONTHLY_SUMMARY = [
  { 
    month: "يناير", 
    monthEn: "January",
    revenue: 45000, 
    expenses: 38600, 
    netProfit: 6400,
    karimExpenses: 7300,
    saraExpenses: 29800,
    ahmedExpenses: 1500,
    transactionCount: 6,
    unverifiedCount: 0,
    unverifiedAmount: 0,
  },
  { 
    month: "فبراير", 
    monthEn: "February",
    revenue: 38000, 
    expenses: 55300, 
    netProfit: -17300,
    karimExpenses: 20500,
    saraExpenses: 28800,
    ahmedExpenses: 6000,
    transactionCount: 7,
    unverifiedCount: 3,
    unverifiedAmount: 24000,
  },
  { 
    month: "مارس", 
    monthEn: "March",
    revenue: 35000, 
    expenses: 59300, 
    netProfit: -24300,
    karimExpenses: 25500,
    saraExpenses: 28600,
    ahmedExpenses: 5200,
    transactionCount: 7,
    unverifiedCount: 3,
    unverifiedAmount: 29500,
  },
];

// للتوافق مع الكود القديم
export const FINANCIAL_DATA = {
  bankTransactions: BANK_TRANSACTIONS,
  monthlySummary: MONTHLY_SUMMARY,
};

// ============================================
// المشتبه بهم - ردود محايدة
// ============================================

export interface InterrogationQuestion {
  id: string;
  text: string;
  response: string;
  revealsClue: boolean;
  affectsTrust: number;
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
        text: "لماذا دخلت النظام مساءً في بعض الأيام؟",
        response: "عندي مسؤوليات إضافية كمدير مالي. أحياناً أحتاج تحضير تقارير عاجلة لاجتماعات مجلس الإدارة. المدير العام يطلب مني ذلك أحياناً.",
        revealsClue: true,
        affectsTrust: 3,
      },
      {
        id: "ahmed-q2",
        text: "لماذا وقعت على فواتير بدون إيصالات؟",
        response: "أثق في فريقي. عندما يقدم أحدهم طلب شراء ويؤكد صحته، أوافق عليه. ربما كان يجب أن أدقق أكثر في التفاصيل.",
        revealsClue: true,
        affectsTrust: 2,
      },
      {
        id: "ahmed-q3",
        text: "هل لاحظت أي شيء غريب في الفواتير مؤخراً؟",
        response: "لاحظت زيادة في طلبات الشراء، لكن كريم أكد دائماً أنها للمشاريع الجديدة. سارة سألتني مرة عن هذا الموضوع.",
        revealsClue: true,
        affectsTrust: 3,
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
    initialStatement: "أنا أسجل الإيرادات والمصروفات وأتابع الأرقام. لاحظت بعض الأمور الغريبة وأبلغت عنها.",
    questions: [
      {
        id: "sara-q1",
        text: "ماذا لاحظتِ من أمور غريبة؟",
        response: "لاحظت أن فواتير المشتريات زادت كثيراً في الشهرين الأخيرين. أرسلت إيميل لأحمد أسأله عن هذا، وطلبت من كريم الإيصالات لكنه تأخر في إرسالها.",
        revealsClue: true,
        affectsTrust: 3,
      },
      {
        id: "sara-q2",
        text: "من المسؤول عن إدخال فواتير المشتريات؟",
        response: "كل قسم يدخل فواتيره. المشتريات مسؤولية مدير المشتريات، وأنا أتعامل مع الإيرادات والمصروفات الثابتة مثل الرواتب والفواتير الدورية.",
        revealsClue: true,
        affectsTrust: 2,
      },
      {
        id: "sara-q3",
        text: "متى تدخلين النظام عادةً؟",
        response: "من الساعة 8 صباحاً حتى 5 مساءً تقريباً. أحياناً أتأخر قليلاً لإغلاق الشهر، لكن نادراً جداً. يمكنك التحقق من سجلات الدخول.",
        revealsClue: true,
        affectsTrust: 2,
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
    initialStatement: "المشتريات كلها موثقة وضرورية. الشركة تتوسع ونحتاج معدات جديدة للمشاريع.",
    questions: [
      {
        id: "karim-q1",
        text: "لماذا بعض الفواتير بدون إيصالات؟",
        response: "بعض الموردين الجدد لا يعطون إيصالات فورية، خاصة الموردين الصغار. الإيصالات ستصل لاحقاً إن شاء الله.",
        revealsClue: true,
        affectsTrust: -2,
      },
      {
        id: "karim-q2",
        text: "لماذا تدخل النظام بعد ساعات العمل؟",
        response: "العمل مزدحم في الصباح بسبب الاجتماعات ومتابعة الموردين. أفضل إنجاز الأعمال الورقية في المساء بهدوء.",
        revealsClue: true,
        affectsTrust: -2,
      },
      {
        id: "karim-q3",
        text: "هل يمكنك تقديم معلومات عن الموردين الجدد؟",
        response: "نعم، هم موردون وجدتهم في السوق يقدمون أسعار تنافسية. لم أتعامل معهم كثيراً سابقاً لكنهم يبدون موثوقين.",
        revealsClue: true,
        affectsTrust: -3,
      },
    ],
  },
];

// ============================================
// الأدلة القابلة للجمع
// ============================================

export const EVIDENCE_ITEMS = [
  {
    id: "bank-statement",
    name: "كشف الحساب البنكي",
    nameEn: "Bank Statement",
    type: "spreadsheet" as const,
    icon: "🏦",
    description: "جميع المعاملات المالية للـ 3 أشهر الماضية",
    location: "cabinet-1",
    analysis: "يظهر الكشف جميع المعاملات المالية للشركة",
    trustValue: 15,
    isEssential: true,
  },
  {
    id: "purchase-log",
    name: "سجل الفواتير",
    nameEn: "Purchase Invoices",
    type: "spreadsheet" as const,
    icon: "📑",
    description: "الفواتير وأوامر الشراء التفصيلية",
    location: "cabinet-2",
    analysis: "تفاصيل جميع الفواتير وحالة التوثيق",
    trustValue: 20,
    isEssential: true,
  },
  {
    id: "emails",
    name: "الإيميلات الداخلية",
    nameEn: "Internal Emails",
    type: "email" as const,
    icon: "📧",
    description: "المراسلات بين الموظفين",
    location: "desk",
    analysis: "المراسلات الداخلية قد تحتوي معلومات مفيدة",
    trustValue: 15,
    isEssential: true,
  },
  {
    id: "access-logs",
    name: "سجلات الدخول",
    nameEn: "System Access Logs",
    type: "log" as const,
    icon: "🔐",
    description: "من دخل النظام ومتى",
    location: "computer",
    analysis: "توضح أنماط استخدام النظام",
    trustValue: 20,
    isEssential: true,
  },
];

// ============================================
// الفرضيات الممكنة
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
    title: "سارة تتلاعب بالأرقام",
    description: "المحاسبة تغير الأرقام في السجلات لإخفاء اختلاس",
    isCorrect: false,
  },
  {
    id: "hypothesis-karim",
    suspectId: "karim",
    title: "كريم يزور الفواتير",
    description: "مدير المشتريات يصدر فواتير لموردين وهميين",
    isCorrect: true,
  },
];

// ============================================
// النتيجة النهائية
// ============================================

export const CASE_SOLUTION = {
  culprit: "karim",
  method: "إنشاء فواتير مشتريات وهمية لموردين غير حقيقيين وإدخالها في النظام المالي بعد ساعات العمل",
  totalAmount: 46000,
  keyEvidence: [
    "الفواتير بدون إيصالات كلها طُلبت من قسم المشتريات فقط",
    "سجلات دخول متكررة بعد ساعات العمل مرتبطة بفواتير كبيرة",
    "موردون جدد بدون سجل واضح أو تفاصيل كافية",
    "تركز المبالغ الكبيرة غير الموثقة في شخص واحد",
  ],
  misleadingClues: [
    {
      clue: "أحمد دخل النظام متأخراً",
      explanation: "دخوله كان لتحضير تقارير طلبها المدير العام - الإيميلات تؤكد ذلك",
    },
    {
      clue: "أحمد وافق على فواتير بدون إيصالات",
      explanation: "هذا إهمال وليس تواطؤ - لم يستفد شخصياً",
    },
    {
      clue: "سارة سألت عن الفواتير",
      explanation: "هذا دليل على يقظتها ومحاولتها كشف المشكلة",
    },
  ],
  analysisRequired: "يجب مقارنة من طلب الفواتير + من دخل النظام ليلاً + أي فواتير بدون إيصالات",
  minEvidenceRequired: 3,
  minInterrogationsRequired: 2,
};

// للتوافق
export const LEARNING_CONCEPTS: never[] = [];
export const ANALYSIS_CHALLENGES: never[] = [];
