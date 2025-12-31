// ============================================
// قضية: هبوط الأرباح المفاجئ
// شركة: نواة كابيتال للتطوير العقاري
// ============================================

export const CASE_INFO = {
  id: "profit-decline",
  title: "هبوط الأرباح المفاجئ",
  titleEn: "The Sudden Profit Decline",
  company: "نواة كابيتال للتطوير العقاري",
  companyEn: "Nuwa Capital Real Estate",
  location: "القاهرة الجديدة - مصر",
  description: "خلال آخر 6 أسابيع حدث هبوط واضح في الأرباح رغم استقرار عدد العقود الموقعة",
  playerRole: "محقق بيانات",
  playerRoleEn: "Data Investigator",
  objective: "اكتشف سبب هبوط الأرباح وحدد أين يحدث النزيف بالضبط",
};

// ============================================
// دليل 1: ملخص الأرباح الأسبوعي (12 أسبوع)
// الموقع: مكتب CFO
// الوظيفة: يظهر المشكلة - هبوط واضح آخر 6 أسابيع
// ============================================
export const WEEKLY_PROFITS = [
  { week: 1, revenue: 4200000, costs: 3750000, profit: 450000 },
  { week: 2, revenue: 3900000, costs: 3480000, profit: 420000 },
  { week: 3, revenue: 4500000, costs: 4020000, profit: 480000 },
  { week: 4, revenue: 3800000, costs: 3390000, profit: 410000 },
  { week: 5, revenue: 4100000, costs: 3660000, profit: 440000 },
  { week: 6, revenue: 4300000, costs: 3840000, profit: 460000 },
  // --- بداية الهبوط (أسبوع 7) ---
  { week: 7, revenue: 4400000, costs: 4120000, profit: 280000 },
  { week: 8, revenue: 4600000, costs: 4350000, profit: 250000 },
  { week: 9, revenue: 4200000, costs: 3980000, profit: 220000 },
  { week: 10, revenue: 4800000, costs: 4560000, profit: 240000 },
  { week: 11, revenue: 4500000, costs: 4290000, profit: 210000 },
  { week: 12, revenue: 4700000, costs: 4510000, profit: 190000 },
];

// ============================================
// دليل 2: تقرير عدد العقود الأسبوعي (مضلل!)
// الموقع: مكتب CFO
// الوظيفة: يبدو أن كل شيء بخير - العقود مستقرة
// ============================================
export const WEEKLY_CONTRACTS = [
  { week: 1, contracts: 8, project_afaq: 5, project_riva: 3 },
  { week: 2, contracts: 7, project_afaq: 4, project_riva: 3 },
  { week: 3, contracts: 9, project_afaq: 6, project_riva: 3 },
  { week: 4, contracts: 7, project_afaq: 4, project_riva: 3 },
  { week: 5, contracts: 8, project_afaq: 5, project_riva: 3 },
  { week: 6, contracts: 8, project_afaq: 5, project_riva: 3 },
  { week: 7, contracts: 9, project_afaq: 6, project_riva: 3 },
  { week: 8, contracts: 10, project_afaq: 7, project_riva: 3 },
  { week: 9, contracts: 8, project_afaq: 5, project_riva: 3 },
  { week: 10, contracts: 11, project_afaq: 8, project_riva: 3 },
  { week: 11, contracts: 9, project_afaq: 6, project_riva: 3 },
  { week: 12, contracts: 10, project_afaq: 7, project_riva: 3 },
];

// ============================================
// دليل 3: Dataset الصفقات التفصيلي
// الموقع: مكتب اللاعب (بعد طلبه من CFO)
// الوظيفة: المصدر الرئيسي للتحليل
// النمط المخفي: مشروع "أفق" + المندوب "محمد علي" = تنازلات أكبر
// ============================================
export const DEALS_DATASET = [
  // أسبوع 7 - بداية النمط
  { deal_id: "D-701", week: 7, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 150م", list_price: 2800000, final_price: 2380000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-702", week: 7, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "شقة 120م", list_price: 2200000, final_price: 2150000, payment_plan: "كاش" },
  { deal_id: "D-703", week: 7, project: "أفق", salesperson: "أحمد حسن", unit_type: "دوبلكس 200م", list_price: 3500000, final_price: 3400000, payment_plan: "تقسيط 3 سنوات" },
  { deal_id: "D-704", week: 7, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 180م", list_price: 3200000, final_price: 2720000, payment_plan: "تقسيط 7 سنوات" },
  
  // أسبوع 8
  { deal_id: "D-801", week: 8, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 150م", list_price: 2800000, final_price: 2350000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-802", week: 8, project: "ريڤا", salesperson: "أحمد حسن", unit_type: "فيلا 300م", list_price: 5500000, final_price: 5400000, payment_plan: "كاش" },
  { deal_id: "D-803", week: 8, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 120م", list_price: 2200000, final_price: 1850000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-804", week: 8, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "شقة 150م", list_price: 2600000, final_price: 2550000, payment_plan: "تقسيط 3 سنوات" },
  { deal_id: "D-805", week: 8, project: "أفق", salesperson: "محمد علي", unit_type: "دوبلكس 200م", list_price: 3500000, final_price: 2940000, payment_plan: "تقسيط 7 سنوات" },
  
  // أسبوع 9
  { deal_id: "D-901", week: 9, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 180م", list_price: 3200000, final_price: 2680000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-902", week: 9, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "شقة 120م", list_price: 2200000, final_price: 2180000, payment_plan: "كاش" },
  { deal_id: "D-903", week: 9, project: "أفق", salesperson: "أحمد حسن", unit_type: "شقة 150م", list_price: 2800000, final_price: 2720000, payment_plan: "تقسيط 3 سنوات" },
  
  // أسبوع 10
  { deal_id: "D-1001", week: 10, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 150م", list_price: 2800000, final_price: 2310000, payment_plan: "تقسيط 7 سنوات" },
  { deal_id: "D-1002", week: 10, project: "ريڤا", salesperson: "أحمد حسن", unit_type: "شقة 180م", list_price: 3000000, final_price: 2950000, payment_plan: "كاش" },
  { deal_id: "D-1003", week: 10, project: "أفق", salesperson: "محمد علي", unit_type: "دوبلكس 200م", list_price: 3500000, final_price: 2870000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-1004", week: 10, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 120م", list_price: 2200000, final_price: 1800000, payment_plan: "تقسيط 7 سنوات" },
  { deal_id: "D-1005", week: 10, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "فيلا 250م", list_price: 4800000, final_price: 4700000, payment_plan: "تقسيط 3 سنوات" },
  
  // أسبوع 11
  { deal_id: "D-1101", week: 11, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 180م", list_price: 3200000, final_price: 2650000, payment_plan: "تقسيط 7 سنوات" },
  { deal_id: "D-1102", week: 11, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "شقة 150م", list_price: 2600000, final_price: 2560000, payment_plan: "كاش" },
  { deal_id: "D-1103", week: 11, project: "أفق", salesperson: "أحمد حسن", unit_type: "شقة 150م", list_price: 2800000, final_price: 2750000, payment_plan: "تقسيط 3 سنوات" },
  { deal_id: "D-1104", week: 11, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 150م", list_price: 2800000, final_price: 2290000, payment_plan: "تقسيط 5 سنوات" },
  
  // أسبوع 12
  { deal_id: "D-1201", week: 12, project: "أفق", salesperson: "محمد علي", unit_type: "دوبلكس 200م", list_price: 3500000, final_price: 2850000, payment_plan: "تقسيط 7 سنوات" },
  { deal_id: "D-1202", week: 12, project: "ريڤا", salesperson: "أحمد حسن", unit_type: "شقة 120م", list_price: 2200000, final_price: 2160000, payment_plan: "كاش" },
  { deal_id: "D-1203", week: 12, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 150م", list_price: 2800000, final_price: 2280000, payment_plan: "تقسيط 5 سنوات" },
  { deal_id: "D-1204", week: 12, project: "ريڤا", salesperson: "نورا سعيد", unit_type: "شقة 180م", list_price: 3000000, final_price: 2970000, payment_plan: "تقسيط 3 سنوات" },
  { deal_id: "D-1205", week: 12, project: "أفق", salesperson: "محمد علي", unit_type: "شقة 120م", list_price: 2200000, final_price: 1780000, payment_plan: "تقسيط 7 سنوات" },
];

// ============================================
// دليل 4: Leaderboard المبيعات (مضلل!)
// الموقع: قسم المبيعات
// الوظيفة: يجعل "محمد" يبدو الأفضل لأنه الأعلى عدداً
// ============================================
export const SALES_LEADERBOARD = [
  { 
    rank: 1, 
    name: "محمد علي", 
    nameEn: "Mohamed Ali",
    deals: 18, 
    title: "🏆 نجم المبيعات",
    department: "مبيعات - مشروع أفق"
  },
  { 
    rank: 2, 
    name: "أحمد حسن", 
    nameEn: "Ahmed Hassan",
    deals: 8, 
    title: "⭐ مندوب متميز",
    department: "مبيعات - عام"
  },
  { 
    rank: 3, 
    name: "نورا سعيد", 
    nameEn: "Noura Said",
    deals: 8, 
    title: "⭐ مندوب متميز",
    department: "مبيعات - مشروع ريڤا"
  },
];

// ============================================
// دليل 5: عقود مختارة (التأكيد النهائي)
// الموقع: أرشيف العقود
// الوظيفة: تأكيد النمط بعد التحليل
// ============================================
export const SAMPLE_CONTRACTS = [
  {
    contract_id: "C-2024-087",
    date: "2024-02-18",
    project: "أفق",
    unit: "شقة 150م - الدور 8",
    salesperson: "محمد علي",
    client: "عميل سري",
    list_price: 2800000,
    final_price: 2380000,
    terms: "تم تعديل السعر النهائي بناءً على التفاوض مع العميل",
    payment_plan: "تقسيط على 5 سنوات",
    notes: "اعتمد من مدير المبيعات"
  },
  {
    contract_id: "C-2024-092",
    date: "2024-02-25",
    project: "أفق",
    unit: "دوبلكس 200م - الدور 12",
    salesperson: "محمد علي",
    client: "عميل سري",
    list_price: 3500000,
    final_price: 2870000,
    terms: "سعر نهائي معدّل - موافقة إدارية",
    payment_plan: "تقسيط على 7 سنوات",
    notes: "عميل VIP - معاملة خاصة"
  },
  {
    contract_id: "C-2024-078",
    date: "2024-02-10",
    project: "ريڤا",
    unit: "شقة 150م - الدور 5",
    salesperson: "نورا سعيد",
    client: "عميل سري",
    list_price: 2600000,
    final_price: 2550000,
    terms: "سعر نهائي",
    payment_plan: "كاش",
    notes: ""
  },
  {
    contract_id: "C-2024-095",
    date: "2024-03-01",
    project: "أفق",
    unit: "شقة 120م - الدور 3",
    salesperson: "محمد علي",
    client: "عميل سري",
    list_price: 2200000,
    final_price: 1780000,
    terms: "تعديل سعري بناءً على ظروف السوق",
    payment_plan: "تقسيط على 7 سنوات",
    notes: "موافقة مدير المبيعات"
  },
];

// ============================================
// الشخصيات والحوارات
// ============================================
export const CHARACTERS = {
  cfo: {
    id: "cfo",
    name: "م. طارق عبدالله",
    nameEn: "Tarek Abdullah",
    title: "المدير المالي",
    titleEn: "CFO",
    avatar: "👔",
  },
  salesManager: {
    id: "sales-manager",
    name: "أ. سامي الشريف",
    nameEn: "Sami El-Sherif",
    title: "مدير المبيعات",
    titleEn: "Sales Manager",
    avatar: "📊",
  },
  player: {
    id: "player",
    name: "أنت",
    nameEn: "You",
    title: "محقق البيانات",
    titleEn: "Data Investigator",
    avatar: "🔍",
  }
};

export const CFO_DIALOGUES = {
  intro: [
    { speaker: "cfo", text: "أهلاً بك. أنا طارق عبدالله، المدير المالي لنواة كابيتال." },
    { speaker: "cfo", text: "لدينا مشكلة... الأرباح انخفضت بشكل ملحوظ في الأسابيع الستة الأخيرة." },
    { speaker: "cfo", text: "الغريب أن عدد العقود الموقعة لم ينخفض! بل ربما زاد قليلاً." },
    { speaker: "cfo", text: "أريدك أن تحقق في الأمر. هل هناك مصروفات زائدة؟ هل السوق يضغط علينا؟" },
    { speaker: "cfo", text: "خذ هذين التقريرين كبداية: ملخص الأرباح الأسبوعي، وتقرير العقود." },
  ],
  afterReports: [
    { speaker: "cfo", text: "إذا احتجت بيانات أكثر تفصيلاً عن الصفقات، اطلبها مني." },
    { speaker: "cfo", text: "لكن تذكر - ابحث جيداً قبل أن تقدم استنتاجك. لا أريد استنتاجات سطحية." },
  ],
  datasetRequest: [
    { speaker: "cfo", text: "حسناً، سأعطيك بيانات الصفقات التفصيلية لآخر 6 أسابيع." },
    { speaker: "cfo", text: "ستجدها في مكتبك. حللها بعناية." },
  ],
};

export const SALES_MANAGER_DIALOGUES = {
  intro: [
    { speaker: "salesManager", text: "أهلاً! سامي الشريف، مدير المبيعات." },
    { speaker: "salesManager", text: "سمعت أنك تحقق في موضوع الأرباح... أتمنى لك التوفيق." },
  ],
  defensive: [
    { speaker: "salesManager", text: "الفريق يعمل بجد! العقود ممتازة والأرقام تتكلم." },
    { speaker: "salesManager", text: "السوق صعب هذه الفترة، لكننا نحقق نتائج جيدة." },
    { speaker: "salesManager", text: "محمد علي مثلاً... 18 صفقة! نجم الفريق بلا منازع." },
  ],
  leaderboard: [
    { speaker: "salesManager", text: "خذ نظرة على لوحة الأداء. الأرقام واضحة." },
    { speaker: "salesManager", text: "محمد في المركز الأول. أحمد ونورا متقاربين." },
  ],
};

// ============================================
// الحل الصحيح (لا يظهر للاعب إلا في النهاية)
// ============================================
export const CASE_SOLUTION = {
  mainCause: "تنازلات سعرية كبيرة",
  primaryProject: "أفق",
  primarySalesperson: "محمد علي",
  explanation: "السبب الحقيقي لهبوط الأرباح ليس انخفاض عدد العقود، بل التنازلات السعرية الكبيرة في صفقات مشروع 'أفق' خاصة من المندوب محمد علي. بينما حقق أعلى عدد صفقات، كانت تنازلاته في السعر تصل إلى 15-20% من السعر القياسي.",
  keyInsights: [
    "هبوط الأرباح بدأ من الأسبوع 7 رغم استقرار العقود",
    "الفرق بين السعر القياسي والنهائي في مشروع أفق أكبر بكثير من ريڤا",
    "صفقات محمد علي تحتوي على أكبر فروقات سعرية",
    "العقود تحتوي على صياغة 'تعديل سعري' بدون ذكر خصم صريح",
  ],
  misleadingElements: [
    { element: "تقرير العقود", why: "يُظهر استقرار العدد لكن لا يُظهر قيمة الصفقات" },
    { element: "Leaderboard", why: "يُظهر محمد كالأفضل بناءً على العدد فقط" },
  ],
};

// ============================================
// أنواع الأدلة
// ============================================
export type EvidenceId = 
  | "weekly-profits" 
  | "weekly-contracts" 
  | "deals-dataset" 
  | "sales-leaderboard" 
  | "sample-contracts";

export interface Evidence {
  id: EvidenceId;
  name: string;
  nameEn: string;
  location: "cfo" | "my-desk" | "sales" | "contracts";
  icon: string;
  description: string;
  requiresRequest?: boolean;
}

export const EVIDENCE_CATALOG: Evidence[] = [
  {
    id: "weekly-profits",
    name: "ملخص الأرباح الأسبوعي",
    nameEn: "Weekly Profit Summary",
    location: "cfo",
    icon: "📉",
    description: "تقرير يوضح الإيرادات والمصروفات والأرباح لآخر 12 أسبوع",
  },
  {
    id: "weekly-contracts",
    name: "تقرير العقود الأسبوعي",
    nameEn: "Weekly Contracts Report",
    location: "cfo",
    icon: "📋",
    description: "إحصائية عدد العقود الموقعة أسبوعياً لآخر 12 أسبوع",
  },
  {
    id: "deals-dataset",
    name: "بيانات الصفقات التفصيلية",
    nameEn: "Detailed Deals Dataset",
    location: "my-desk",
    icon: "📊",
    description: "جدول تفصيلي لكل صفقة يشمل المشروع والمندوب والأسعار",
    requiresRequest: true,
  },
  {
    id: "sales-leaderboard",
    name: "لوحة أداء المبيعات",
    nameEn: "Sales Leaderboard",
    location: "sales",
    icon: "🏆",
    description: "ترتيب المندوبين حسب عدد الصفقات",
  },
  {
    id: "sample-contracts",
    name: "عقود مختارة",
    nameEn: "Sample Contracts",
    location: "contracts",
    icon: "📄",
    description: "نماذج من العقود الموقعة مع تفاصيل الأسعار والشروط",
  },
];

// ============================================
// خيارات الاستنتاج النهائي
// ============================================
export const CONCLUSION_OPTIONS = {
  causes: [
    { id: "contracts-down", label: "انخفاض عدد العقود", correct: false },
    { id: "costs-up", label: "ارتفاع المصروفات التشغيلية", correct: false },
    { id: "price-concessions", label: "تنازلات سعرية في الصفقات", correct: true },
    { id: "market-pressure", label: "ضغط السوق العام", correct: false },
  ],
  projects: [
    { id: "afaq", label: "مشروع أفق", correct: true },
    { id: "riva", label: "مشروع ريڤا", correct: false },
    { id: "both", label: "كلا المشروعين بالتساوي", correct: false },
  ],
  salespeople: [
    { id: "mohamed", label: "محمد علي", correct: true },
    { id: "ahmed", label: "أحمد حسن", correct: false },
    { id: "noura", label: "نورا سعيد", correct: false },
    { id: "all", label: "كل المندوبين بالتساوي", correct: false },
  ],
};
