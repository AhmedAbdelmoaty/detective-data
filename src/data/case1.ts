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
    
    تحذير: بعض الأدلة قد تكون مضللة. فكر جيداً قبل أن تتهم أحداً.
  `,
};

// ============================================
// البيانات المالية - مبسطة بدون hints
// ============================================

// كشف الحساب البنكي - 15 معاملة فقط
export const BANK_TRANSACTIONS = [
  // يناير - شهر عادي
  { id: "t1", date: "2024-01-03", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t2", date: "2024-01-08", description: "دفعة من عميل - شركة الأمل", amount: 45000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t3", date: "2024-01-15", description: "مستلزمات مكتبية", amount: -1200, category: "supplies", enteredBy: "karim", verified: true },
  { id: "t4", date: "2024-01-22", description: "فاتورة كهرباء", amount: -1800, category: "utilities", enteredBy: "sara", verified: true },
  { id: "t5", date: "2024-01-28", description: "معدات حاسوب", amount: -4500, category: "equipment", enteredBy: "karim", verified: true },
  
  // فبراير
  { id: "t6", date: "2024-02-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t7", date: "2024-02-10", description: "دفعة من عميل - مؤسسة البناء", amount: 38000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t8", date: "2024-02-12", description: "معدات مكتبية خاصة", amount: -12000, category: "equipment", enteredBy: "karim", verified: false },
  { id: "t9", date: "2024-02-20", description: "مكافأة أداء استثنائي", amount: -8000, category: "bonus", enteredBy: "ahmed", verified: true },
  { id: "t10", date: "2024-02-25", description: "خدمات استشارية", amount: -8500, category: "consulting", enteredBy: "karim", verified: false },
  
  // مارس
  { id: "t11", date: "2024-03-01", description: "رواتب الموظفين", amount: -28000, category: "salaries", enteredBy: "sara", verified: true },
  { id: "t12", date: "2024-03-08", description: "دفعة من عميل - شركة التقنية", amount: 35000, category: "revenue", enteredBy: "sara", verified: true },
  { id: "t13", date: "2024-03-12", description: "معدات تقنية متخصصة", amount: -18000, category: "equipment", enteredBy: "karim", verified: false },
  { id: "t14", date: "2024-03-18", description: "سلفة موظف", amount: -5000, category: "advance", enteredBy: "sara", verified: true },
  { id: "t15", date: "2024-03-25", description: "برمجيات وتراخيص", amount: -7500, category: "software", enteredBy: "karim", verified: false },
];

// سجل المشتريات - بدون hints
export const PURCHASE_INVOICES = [
  // فواتير يناير - موثقة
  { id: "inv-1", date: "2024-01-15", vendor: "مكتبة الرياض", items: "أقلام، ورق، ملفات", amount: 1200, poNumber: "PO-2024-001", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-2", date: "2024-01-28", vendor: "متجر الإلكترونيات", items: "3 لابتوب Dell", amount: 4500, poNumber: "PO-2024-002", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  
  // فواتير فبراير - مختلطة
  { id: "inv-3", date: "2024-02-12", vendor: "مورد تجهيزات", items: "معدات مكتبية متنوعة", amount: 12000, poNumber: "PO-2024-003", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-4", date: "2024-02-20", vendor: "شركة التوريدات العامة", items: "مستلزمات إدارية", amount: 3500, poNumber: "PO-2024-004", hasReceipt: true, approvedBy: "ahmed", requestedBy: "sara" },
  { id: "inv-5", date: "2024-02-25", vendor: "شركة الاستشارات", items: "استشارات تقنية", amount: 8500, poNumber: "PO-2024-005", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  
  // فواتير مارس
  { id: "inv-6", date: "2024-03-12", vendor: "تقنيات المستقبل", items: "أجهزة متخصصة", amount: 18000, poNumber: "PO-2024-006", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-7", date: "2024-03-14", vendor: "مؤسسة الخدمات", items: "صيانة شاملة", amount: 4200, poNumber: "PO-2024-007", hasReceipt: true, approvedBy: "ahmed", requestedBy: "sara" },
  { id: "inv-8", date: "2024-03-25", vendor: "برمجيات متقدمة", items: "تراخيص برمجيات", amount: 7500, poNumber: "PO-2024-008", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim" },
];

// سجلات الدخول للنظام
export const SYSTEM_ACCESS_LOGS = [
  // سجلات متنوعة - بدون تمييز واضح
  { id: "log-1", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة معاملة", details: "PO-2024-003", ip: "192.168.1.105", afterHours: true },
  { id: "log-2", date: "2024-02-14", time: "09:30", user: "sara", action: "تحديث سجل", details: "تقرير شهري", ip: "192.168.1.102", afterHours: false },
  { id: "log-3", date: "2024-02-20", time: "20:30", user: "ahmed", action: "مراجعة تقارير", details: "تقرير المصروفات", ip: "192.168.1.100", afterHours: true },
  { id: "log-4", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد جديد", details: "شركة الاستشارات", ip: "192.168.1.105", afterHours: true },
  { id: "log-5", date: "2024-03-09", time: "10:00", user: "sara", action: "إضافة إيراد", details: "شركة التقنية", ip: "192.168.1.102", afterHours: false },
  { id: "log-6", date: "2024-03-11", time: "21:00", user: "karim", action: "تعديل فاتورة", details: "PO-2024-006", ip: "192.168.1.105", afterHours: true },
  { id: "log-7", date: "2024-03-15", time: "14:30", user: "ahmed", action: "مراجعة موافقات", details: "فواتير مارس", ip: "192.168.1.100", afterHours: false },
  { id: "log-8", date: "2024-03-24", time: "22:00", user: "karim", action: "إضافة فاتورة", details: "PO-2024-008", ip: "192.168.1.105", afterHours: true },
];

// الإيميلات الداخلية - بدون علامات مفتاح
export const INTERNAL_EMAILS = [
  {
    id: "email-1",
    date: "2024-02-20",
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
    body: "أستاذ أحمد، لاحظت زيادة كبيرة في فواتير المشتريات هذا الشهر. هل يمكنك التأكد من صحتها؟",
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
    body: "كريم، أحتاج إيصالات الفواتير الأخيرة لإتمام السجلات المحاسبية.",
  },
];

// ملخص شهري للتحليل
export const MONTHLY_SUMMARY = [
  { 
    month: "يناير", 
    monthEn: "January",
    revenue: 45000, 
    expenses: 35500, 
    netProfit: 9500,
    karimExpenses: 5700,
    saraExpenses: 29800,
    ahmedExpenses: 0,
    transactionCount: 5,
    unverifiedCount: 0,
  },
  { 
    month: "فبراير", 
    monthEn: "February",
    revenue: 38000, 
    expenses: 56500, 
    netProfit: -18500,
    karimExpenses: 20500,
    saraExpenses: 28000,
    ahmedExpenses: 8000,
    transactionCount: 5,
    unverifiedCount: 2,
  },
  { 
    month: "مارس", 
    monthEn: "March",
    revenue: 35000, 
    expenses: 58500, 
    netProfit: -23500,
    karimExpenses: 25500,
    saraExpenses: 33000,
    ahmedExpenses: 0,
    transactionCount: 5,
    unverifiedCount: 2,
  },
];

// للتوافق مع الكود القديم
export const FINANCIAL_DATA = {
  bankTransactions: BANK_TRANSACTIONS,
  monthlySummary: MONTHLY_SUMMARY,
};

// ============================================
// المشتبه بهم - ردود محايدة أكثر
// ============================================

export interface InterrogationQuestion {
  id: string;
  text: string;
  response: string;
  revealsClue: boolean;
  clue?: string;
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
        text: "لماذا دخلت النظام في الساعة 8:30 مساءً يوم 20 فبراير؟",
        response: "كان لدي اجتماع مجلس إدارة في اليوم التالي، والمدير العام طلب مني تجهيز تقرير المصروفات الشهري. يمكنك التحقق من الإيميلات.",
        revealsClue: true,
        clue: "أحمد لديه تفسير لدخوله المتأخر - راجع الإيميلات",
        affectsTrust: 5,
      },
      {
        id: "ahmed-q2",
        text: "لماذا وقعت على فواتير بدون إيصالات؟",
        response: "أثق في فريقي. عندما يقدم أحدهم طلب شراء، أفترض أنه تم التأكد منه. ربما كان يجب أن أدقق أكثر.",
        revealsClue: true,
        clue: "أحمد اعترف بثقته في الفريق دون تدقيق كافٍ",
        affectsTrust: 3,
      },
      {
        id: "ahmed-q3",
        text: "هل لاحظت أي شيء غريب في الأشهر الأخيرة؟",
        response: "لاحظت زيادة في طلبات الشراء العاجلة. كان يُقال دائماً إنها للمشاريع الجديدة.",
        revealsClue: true,
        clue: "زيادة في طلبات الشراء العاجلة مؤخراً",
        affectsTrust: 5,
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
        text: "هل لاحظتِ شيئاً غريباً في حسابات الشركة؟",
        response: "نعم، أرسلت إيميل لأحمد أسأله عن الزيادة الكبيرة في الفواتير. لكن لم أتلقَ متابعة كافية.",
        revealsClue: true,
        clue: "سارة نبهت الإدارة للمشكلة مسبقاً",
        affectsTrust: 5,
      },
      {
        id: "sara-q2",
        text: "من المسؤول عن إدخال فواتير المشتريات؟",
        response: "كل قسم يدخل فواتيره. المشتريات مسؤولية مدير المشتريات، وأنا أراجع الإيرادات والمصروفات الثابتة فقط.",
        revealsClue: true,
        clue: "سارة ليست مسؤولة عن فواتير المشتريات",
        affectsTrust: 3,
      },
      {
        id: "sara-q3",
        text: "متى تدخلين النظام عادةً؟",
        response: "من الساعة 8 صباحاً حتى 5 مساءً. لا أحتاج للعمل بعد الدوام، كل مهامي أنجزها خلال ساعات العمل.",
        revealsClue: true,
        clue: "سارة تعمل خلال ساعات الدوام الرسمية فقط",
        affectsTrust: 3,
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
        clue: "كريم يبرر غياب الإيصالات بأنها ستصل لاحقاً",
        affectsTrust: -3,
      },
      {
        id: "karim-q2",
        text: "لماذا تدخل النظام بعد ساعات العمل أحياناً؟",
        response: "أفضل العمل في هدوء لإنجاز المهام المتراكمة. الصباح مزدحم بالاجتماعات.",
        revealsClue: true,
        clue: "كريم يعمل بعد الدوام بانتظام",
        affectsTrust: -3,
      },
      {
        id: "karim-q3",
        text: "هل يمكنك تقديم تفاصيل عن شركة 'تقنيات المستقبل'؟",
        response: "هي شركة جديدة في السوق تقدم أسعاراً تنافسية. تعاملت معهم للمرة الأولى هذا العام.",
        revealsClue: true,
        clue: "كريم لم يقدم تفاصيل واضحة عن المورد الجديد",
        affectsTrust: -5,
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
    analysis: "المراسلات الداخلية قد تكشف معلومات مهمة",
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
  method: "إنشاء فواتير مشتريات وهمية لموردين غير حقيقيين وإدخالها في النظام المالي",
  totalAmount: 46000,
  keyEvidence: [
    "فواتير بدون إيصالات كلها من قسم المشتريات",
    "سجلات دخول متكررة بعد ساعات العمل",
    "موردون جدد بدون سجل تجاري واضح",
    "زيادة مفاجئة في المصروفات دون زيادة في الإنتاجية",
  ],
  misleadingClues: [
    {
      clue: "أحمد دخل النظام متأخراً",
      explanation: "كان يحضر تقريراً طلبه المدير العام - راجع الإيميلات",
    },
    {
      clue: "سارة أرسلت إيميل تستفسر عن الفواتير",
      explanation: "هذا دليل على يقظتها وليس تورطها",
    },
  ],
  minEvidenceRequired: 3,
  minInterrogationsRequired: 2,
};

// للتوافق
export const LEARNING_CONCEPTS: never[] = [];
export const ANALYSIS_CHALLENGES: never[] = [];
