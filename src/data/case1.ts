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
// البيانات المالية
// ============================================

// كشف الحساب البنكي
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

// سجل المشتريات - الفواتير التفصيلية
export const PURCHASE_INVOICES = [
  // فواتير يناير - كلها موثقة
  { id: "inv-1", date: "2024-01-12", vendor: "مكتبة الرياض", items: "أقلام، ورق، ملفات", amount: 1200, poNumber: "PO-2024-001", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-2", date: "2024-01-18", vendor: "شركة الصيانة المتحدة", items: "صيانة طابعات", amount: 2500, poNumber: "PO-2024-002", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-3", date: "2024-01-25", vendor: "متجر الإلكترونيات", items: "3 لابتوب Dell", amount: 4500, poNumber: "PO-2024-003", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  
  // فواتير فبراير - بداية المشاكل
  { id: "inv-4", date: "2024-02-08", vendor: "مورد غير معروف", items: "معدات مكتبية متنوعة", amount: 12000, poNumber: "PO-2024-004", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد تفاصيل للأصناف" },
  { id: "inv-5", date: "2024-02-15", vendor: "شركة الاستشارات", items: "استشارات تقنية", amount: 8500, poNumber: "PO-2024-005", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد عقد أو تقرير" },
  { id: "inv-6", date: "2024-02-22", vendor: "مكتبة الرياض", items: "مستلزمات طباعة", amount: 3200, poNumber: "PO-2024-006", hasReceipt: true, approvedBy: "ahmed", requestedBy: "karim" },
  { id: "inv-7", date: "2024-02-25", vendor: "مقاول خاص", items: "صيانة طارئة", amount: 5000, poNumber: "PO-2024-007", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد تقرير صيانة" },
  
  // فواتير مارس - الاحتيال الواضح
  { id: "inv-8", date: "2024-03-10", vendor: "تقنيات المستقبل", items: "أجهزة متخصصة", amount: 18000, poNumber: "PO-2024-008", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "الشركة غير مسجلة" },
  { id: "inv-9", date: "2024-03-12", vendor: "معهد التدريب الدولي", items: "دورة تدريبية", amount: 9500, poNumber: "PO-2024-009", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لا يوجد حضور مسجل" },
  { id: "inv-10", date: "2024-03-20", vendor: "برمجيات متقدمة", items: "تراخيص برمجيات", amount: 7500, poNumber: "PO-2024-010", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "لم يتم تثبيت أي برنامج" },
  { id: "inv-11", date: "2024-03-25", vendor: "شركة الصيانة", items: "صيانة شاملة", amount: 6000, poNumber: "PO-2024-011", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "رقم تجاري مختلف عن المعتاد" },
  { id: "inv-12", date: "2024-03-28", vendor: "متجر المكتبيات", items: "مستلزمات إضافية", amount: 4000, poNumber: "PO-2024-012", hasReceipt: false, approvedBy: "ahmed", requestedBy: "karim", suspicious: true, note: "كمية غير منطقية" },
];

// سجلات الدخول للنظام
export const SYSTEM_ACCESS_LOGS = [
  // سجلات كريم المشبوهة
  { id: "log-1", date: "2024-02-07", time: "22:45", user: "karim", action: "إضافة معاملة", details: "PO-2024-004", ip: "192.168.1.105", afterHours: true },
  { id: "log-2", date: "2024-02-14", time: "21:30", user: "karim", action: "تعديل فاتورة", details: "PO-2024-005", ip: "192.168.1.105", afterHours: true },
  { id: "log-3", date: "2024-02-24", time: "23:15", user: "karim", action: "إضافة مورد جديد", details: "مقاول خاص", ip: "192.168.1.105", afterHours: true },
  { id: "log-4", date: "2024-03-09", time: "20:00", user: "karim", action: "إضافة معاملة", details: "PO-2024-008", ip: "192.168.1.105", afterHours: true },
  { id: "log-5", date: "2024-03-11", time: "22:30", user: "karim", action: "تعديل سجل", details: "PO-2024-009", ip: "192.168.1.105", afterHours: true },
  { id: "log-6", date: "2024-03-19", time: "21:45", user: "karim", action: "إضافة فاتورة", details: "PO-2024-010", ip: "192.168.1.105", afterHours: true },
  { id: "log-7", date: "2024-03-24", time: "23:00", user: "karim", action: "تعديل مورد", details: "شركة الصيانة", ip: "192.168.1.105", afterHours: true },
  
  // سجلات أحمد المضللة - دخل متأخراً مرة واحدة
  { id: "log-8", date: "2024-02-20", time: "20:30", user: "ahmed", action: "مراجعة تقارير", details: "تقرير شهري", ip: "192.168.1.100", afterHours: true },
  
  // سجلات سارة العادية
  { id: "log-9", date: "2024-01-10", time: "09:30", user: "sara", action: "إضافة إيراد", details: "شركة الأمل", ip: "192.168.1.102", afterHours: false },
  { id: "log-10", date: "2024-02-05", time: "10:15", user: "sara", action: "إضافة إيراد", details: "شركة الأمل", ip: "192.168.1.102", afterHours: false },
  { id: "log-11", date: "2024-03-06", time: "11:00", user: "sara", action: "إضافة إيراد", details: "شركة التقنية", ip: "192.168.1.102", afterHours: false },
];

// الإيميلات الداخلية - تحتوي على مفاتيح مهمة
export const INTERNAL_EMAILS = [
  // إيميل يفسر دخول أحمد المتأخر (مفتاح للدليل المضلل)
  {
    id: "email-1",
    date: "2024-02-20",
    from: "المدير العام",
    to: "أحمد المنصور",
    subject: "طلب تقرير عاجل",
    body: "أحمد، أحتاج تقرير المصروفات الشهري الليلة. لدينا اجتماع مجلس الإدارة غداً صباحاً.",
    isKey: true, // هذا يفسر لماذا أحمد دخل متأخراً
  },
  // إيميل من سارة يوضح شكوكها
  {
    id: "email-2", 
    date: "2024-03-01",
    from: "سارة الخالد",
    to: "أحمد المنصور",
    subject: "استفسار عن الفواتير",
    body: "أستاذ أحمد، لاحظت زيادة كبيرة في فواتير المشتريات هذا الشهر. هل يمكنك التأكد من صحتها؟",
    isKey: false,
  },
  // رد أحمد
  {
    id: "email-3",
    date: "2024-03-01", 
    from: "أحمد المنصور",
    to: "سارة الخالد",
    subject: "رد: استفسار عن الفواتير",
    body: "سارة، راجعت مع كريم وأكد أنها مشتريات ضرورية للمشاريع الجديدة. لا تقلقي.",
    isKey: true, // يوضح أن أحمد وثق بكريم بدون تدقيق
  },
  // إيميل من كريم للتغطية
  {
    id: "email-4",
    date: "2024-02-09",
    from: "كريم الحسن",
    to: "أحمد المنصور",
    subject: "طلب موافقة عاجلة",
    body: "أستاذ أحمد، نحتاج معدات جديدة عاجلة للمشروع. أرجو التوقيع على أمر الشراء المرفق.",
    isKey: false,
  },
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

// ============================================
// المشتبه بهم - مع نظام الاستجواب الذكي
// ============================================

export interface InterrogationQuestion {
  id: string;
  text: string;
  response: string;
  revealsClue: boolean;
  clue?: string;
  affectsTrust: number; // +/- trust
}

export interface Suspect {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  yearsInCompany: number;
  personality: string;
  suspicious: boolean;
  isRedHerring: boolean;
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
    suspicious: false,
    isRedHerring: true,
    isGuilty: false,
    initialStatement: "أنا مسؤول عن التوقيعات النهائية فقط. كل معاملة تمر عبر المراجعة أولاً.",
    questions: [
      {
        id: "ahmed-q1",
        text: "لماذا دخلت النظام في الساعة 8:30 مساءً يوم 20 فبراير؟",
        response: "كان لدي اجتماع مجلس إدارة في اليوم التالي، والمدير العام طلب مني تجهيز تقرير المصروفات الشهري بشكل عاجل. يمكنك التحقق من الإيميل الذي أرسله لي.",
        revealsClue: true,
        clue: "أحمد لديه تفسير منطقي لدخوله المتأخر - تحقق من الإيميلات",
        affectsTrust: 5,
      },
      {
        id: "ahmed-q2",
        text: "لماذا وقعت على فواتير بدون إيصالات؟",
        response: "للأسف، كنت أثق بكريم كثيراً. كان يقول دائماً أن الموردين الجدد لا يعطون إيصالات فورية. كان يجب أن أدقق أكثر.",
        revealsClue: true,
        clue: "أحمد اعترف بثقته المفرطة في كريم",
        affectsTrust: 3,
      },
      {
        id: "ahmed-q3",
        text: "هل لاحظت أي شيء غريب في الأشهر الأخيرة؟",
        response: "الآن بعد أن فكرت... لاحظت أن كريم كان يطلب موافقات عاجلة كثيراً مؤخراً. كان يقول دائماً 'المشروع متأخر' أو 'نحتاجها فوراً'.",
        revealsClue: true,
        clue: "كريم كان يضغط للحصول على موافقات سريعة",
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
    suspicious: false,
    isRedHerring: true,
    isGuilty: false,
    initialStatement: "أنا أسجل الإيرادات والمصروفات الثابتة فقط. المشتريات ليست من اختصاصي.",
    questions: [
      {
        id: "sara-q1",
        text: "لماذا توقيعك موجود على بعض الفواتير المشبوهة؟",
        response: "توقيعي؟! لا، هذا خطأ. أنا لا أوقع على فواتير المشتريات إطلاقاً. راجع السجلات - توقيعي فقط على إدخالات الإيرادات والمصروفات الثابتة.",
        revealsClue: true,
        clue: "سارة تنفي توقيعها على الفواتير - تحقق من سجلات الدخول",
        affectsTrust: 3,
      },
      {
        id: "sara-q2",
        text: "هل لاحظتِ شيئاً غريباً في حسابات الشركة؟",
        response: "نعم! أرسلت إيميل لأحمد الشهر الماضي أسأله عن الزيادة الكبيرة في فواتير المشتريات. قال لي إن كريم أكد أنها ضرورية.",
        revealsClue: true,
        clue: "سارة نبهت أحمد لكنه وثق بكريم",
        affectsTrust: 5,
      },
      {
        id: "sara-q3",
        text: "متى تدخلين النظام عادةً؟",
        response: "من الساعة 8 صباحاً حتى 5 مساءً فقط. لا أحتاج للعمل بعد الدوام - كل مهامي أنجزها خلال ساعات العمل الرسمية.",
        revealsClue: true,
        clue: "سارة لا تعمل بعد ساعات الدوام - تحقق من سجلات الدخول",
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
    suspicious: true,
    isRedHerring: false,
    isGuilty: true,
    initialStatement: "المشتريات كلها موثقة! الشركة تتوسع ونحتاج معدات جديدة.",
    questions: [
      {
        id: "karim-q1",
        text: "لماذا كل الفواتير بدون إيصالات من موردين أنت اخترتهم؟",
        response: "هذا... هذا صدفة! الموردون الجدد لا يعطون إيصالات فورية. سأحضر الإيصالات لاحقاً... إن شاء الله.",
        revealsClue: true,
        clue: "كريم متردد ويتهرب من الإجابة عن الإيصالات",
        affectsTrust: -5,
      },
      {
        id: "karim-q2",
        text: "لماذا تدخل النظام بعد ساعات العمل؟",
        response: "أنا... أحب أعمل في هدوء! الصباح فيه إزعاج كتير. بس مش كل مرة... يعني أحياناً...",
        revealsClue: true,
        clue: "كريم لا يستطيع تبرير عمله بعد الدوام بشكل مقنع",
        affectsTrust: -5,
      },
      {
        id: "karim-q3",
        text: "شركة 'تقنيات المستقبل' غير مسجلة في السجل التجاري. كيف تفسر ذلك؟",
        response: "غير مسجلة؟! لا... لا ممكن! ربما... ربما هم جدد في السوق. أنا... أنا محتاج أتأكد من الموضوع.",
        revealsClue: true,
        clue: "كريم صدم عندما ذكرت أن الشركة غير مسجلة",
        affectsTrust: -10,
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
    analysis: "يظهر الكشف معاملات مشبوهة غير موثقة",
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
    analysis: "فواتير متعددة بدون إيصالات",
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
    analysis: "تحتوي على معلومات مهمة تفسر بعض الأحداث",
    trustValue: 15,
    isEssential: true, // مهمة لفهم الأدلة المضللة
  },
  {
    id: "access-logs",
    name: "سجلات الدخول",
    nameEn: "System Access Logs",
    type: "log" as const,
    icon: "🔐",
    description: "من دخل النظام ومتى",
    location: "computer",
    analysis: "توضح أنماط الدخول للنظام",
    trustValue: 20,
    isEssential: true,
  },
  {
    id: "audit-report",
    name: "تقرير المراجعة",
    nameEn: "Audit Report",
    type: "document" as const,
    icon: "📋",
    description: "تقرير المراجعة الداخلية",
    location: "safe",
    locked: true,
    unlockRequirement: 3,
    analysis: "يؤكد وجود فجوة مالية بقيمة 45,000 ريال",
    trustValue: 25,
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
    title: "أحمد هو المختلس",
    description: "المدير المالي يستغل منصبه للتوقيع على معاملات وهمية",
    isCorrect: false,
    trustCost: 25,
  },
  {
    id: "hypothesis-sara",
    suspectId: "sara",
    title: "سارة هي المختلسة",
    description: "المحاسبة تتلاعب بالأرقام",
    isCorrect: false,
    trustCost: 25,
  },
  {
    id: "hypothesis-karim",
    suspectId: "karim",
    title: "كريم هو المختلس",
    description: "مدير المشتريات يصدر فواتير وهمية",
    isCorrect: true,
    trustBonus: 30,
  },
];

// ============================================
// النتيجة النهائية
// ============================================

export const CASE_SOLUTION = {
  culprit: "karim",
  method: "تزوير فواتير مشتريات وهمية وإدخالها في النظام",
  totalAmount: 45000,
  keyEvidence: [
    "جميع المعاملات المشبوهة مسجلة باسم كريم",
    "8 فواتير بدون إيصالات - كلها من كريم",
    "سجلات الدخول تظهر نشاطاً في أوقات غير رسمية",
    "الموردون غير مسجلين",
  ],
  misleadingClues: [
    {
      clue: "أحمد دخل النظام متأخراً",
      explanation: "طلب المدير العام تقريراً عاجلاً - تحقق من الإيميلات",
    },
    {
      clue: "سارة وقعت على بعض الفواتير",
      explanation: "توقيعها فقط على الإيرادات والمصروفات الثابتة - ليس المشتريات",
    },
  ],
  minEvidenceRequired: 3,
  minInterrogationsRequired: 2,
};

// للتوافق مع الكود القديم - حذف العناصر التعليمية
export const LEARNING_CONCEPTS: never[] = [];
export const ANALYSIS_CHALLENGES: never[] = [];
