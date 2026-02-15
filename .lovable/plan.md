
# خطة إعادة هيكلة المراحل والـ Flow بالكامل

## المشاكل الحالية (فهمتها كلها)

1. **رسالة "ابدأ بالبيانات" تظهر جوا غرفة البيانات** - المفروض تظهر قبلها كشاشة انتقالية
2. **ترتيب المراحل غلط تماما** - الترتيب الحالي مش مطابق لللي انت عايزه
3. **Swap و CTA بيظهروا مع بعض** - المفروض الـ Swap يكون إجباري (لازم تجاوب) قبل ما CTA يظهر
4. **توزيع الأدلة على المراحل غلط** - N1+N2 بتظهر بدري مع D1+D2 والمفروض لا
5. **`canAdvance()` مش بيتحقق من حاجة** - بيرجع `true` دايما طالما مش آخر مرحلة

---

## الـ Flow الجديد الكامل (10 مراحل: 0-9)

```text
المرحلة 0: scenes (مشاهد أبو سعيد)
المرحلة 1: hypothesis-select (اختيار 4 فرضيات)
   |
   v  [ضغط "ابدأ التحليل" → advancePhase مرتين → شاشة briefing]
   |
المرحلة 2: briefing → شاشة انتقالية فيها رسالة + CTA → dashboard
   |  [في الداشبورد: D1+D2 مفتوحين، بعد مشاهدتهم يظهر CTA]
   |
المرحلة 3: evidence-1 (K6 + N1 يتفتحوا)
   |  [في الأدلة: بعد مشاهدة K6 → يظهر سؤال التبديل إجباري]
   |  [بعد الإجابة على التبديل → يظهر CTA للصالة]
   |
المرحلة 4: floor-1 (خالد + نورة يتفتحوا)
   |  [في الصالة: بعد مقابلتهم → يظهر CTA للأدلة]
   |
المرحلة 5: evidence-2 (K1 + K3 + N2 يتفتحوا)
   |  [في الأدلة: بعد مشاهدة K1+K3 → يظهر CTA للبيانات]
   |
المرحلة 6: data-2 (K2 + D3 يتفتحوا في الداشبورد)
   |  [في البيانات: بعد مشاهدتهم → يظهر CTA للأدلة]
   |
المرحلة 7: evidence-3 (K5 + K4 + N3 يتفتحوا)
   |  [في الأدلة: بعد مشاهدة K5+K4 → يظهر CTA للصالة]
   |
المرحلة 8: floor-2 (أميرة/الزبونة تتفتح)
   |  [بعد مقابلتها → يظهر CTA لغرفة التحليل]
   |
المرحلة 9: matrix (غرفة التحليل - المصفوفة + الاختيار النهائي)
```

---

## التفاصيل التقنية - ملف بملف

### 1. `src/data/case1.ts` - إعادة كتابة PHASES بالكامل

**الـ PHASES الجديد (10 مراحل بدل 12):**

| Index | ID | unlocks | ctaMessage | ctaLabel | ctaTarget | requiredViews | swapPhase |
|---|---|---|---|---|---|---|---|
| 0 | scenes | -- | -- | -- | -- | -- | -- |
| 1 | hypothesis-select | -- | -- | -- | -- | -- | -- |
| 2 | data-1 | D1, D2 | "اتفتحت ملفات في غرفة الأدلة" | "تابع التحليل" | evidence | D1, D2 (dashboard) | false |
| 3 | evidence-1 | K6, N1 | "خالد ونورة موجودين في الصالة" | "تابع التحليل" | floor | K6 (evidence) | **true** |
| 4 | floor-1 | khaled, noura | "مستندات جديدة ظهرت في غرفة الأدلة" | "تابع التحليل" | evidence | khaled, noura (interviews) | false |
| 5 | evidence-2 | K1, K3, N2 | "بيانات جديدة ظهرت في غرفة البيانات" | "تابع التحليل" | dashboard | K1, K3 (evidence) | false |
| 6 | data-2 | K2, D3 | "ملفات جديدة ظهرت في غرفة الأدلة" | "تابع التحليل" | evidence | K2, D3 (dashboard) | false |
| 7 | evidence-3 | K5, K4, N3 | "فيه حد في الصالة عايز يقولك حاجة" | "تابع التحليل" | floor | K5, K4 (evidence) | false |
| 8 | floor-2 | amira | "خلصت جمع الأدلة... روح غرفة التحليل وابدأ المصفوفة" | "روح غرفة التحليل" | analysis | amira (interview) | false |
| 9 | matrix | -- | -- | -- | -- | -- | false |

**تعديلات على الـ Phase interface:**
```text
+ requiredViews: { dashboard?: string[], evidence?: string[], interviews?: string[] }
+ isSwapPhase: boolean  // true فقط في المرحلة 3
```

**الرسائل المناسبة لشاشة الـ briefing:**
- الرسالة: "ابدأ بالبيانات، خد فكرة عامة عن اللي اتغير الأسبوع ده. دور في الأدلة والبيانات وقابل فريق العمل... وحاول توصل للسبب الحقيقي."
- الزر: "تابع التحليل"

---

### 2. `src/components/game/screens/BriefingScreen.tsx` - ملف جديد

شاشة انتقالية بين اختيار الفرضيات وغرفة البيانات:
- خلفية: نفس صورة store-front مع overlay
- فيها: عنوان "هيا نبدأ" + فقرة شرح قصيرة ("ابدأ بالبيانات، خد فكرة عامة عن اللي اتغير الأسبوع ده...")
- زر CTA: "تابع التحليل" → يوّدي لغرفة البيانات
- الشاشة دي تظهر مرة واحدة بس

---

### 3. `src/contexts/GameContext.tsx` - تعديل `canAdvance()`

**المشكلة الحالية:** `canAdvance()` بيرجع `true` دايما:
```text
canAdvance = () => state.currentPhaseIndex < PHASES.length - 1
```

**الحل الجديد:** `canAdvance()` هيتحقق من `requiredViews` للمرحلة الحالية:
```text
canAdvance = () => {
  phase = PHASES[currentPhaseIndex]
  if no requiredViews → return true
  
  // Check dashboard requirements
  if phase.requiredViews.dashboard:
    all must be in state.viewedDashboard
  
  // Check evidence requirements  
  if phase.requiredViews.evidence:
    all must be in state.viewedEvidence
  
  // Check interview requirements
  if phase.requiredViews.interviews:
    all must be in state.completedInterviews
  
  // If swap phase, must have answered swap
  if phase.isSwapPhase && !state.hasUsedSwap:
    return false
  
  return all checks passed
}
```

---

### 4. `src/components/game/GameOverlay.tsx` - تعديل منطق الـ Swap vs CTA

**المشكلة الحالية:** الـ Swap banner والـ CTA banner بيظهروا مع بعض.

**الحل:**
- الـ Swap يظهر فقط في المرحلة اللي فيها `isSwapPhase = true` (المرحلة 3)
- الـ Swap يظهر بعد ما اللاعب يشوف الأدلة المطلوبة (K6)
- طالما الـ Swap مش متجاوب عليه، الـ CTA ما يظهرش
- بعد الإجابة (بدل أو كمل)، الـ CTA يظهر

**المنطق الجديد:**
```text
showSwapBanner = 
  currentPhase.isSwapPhase && 
  !state.hasUsedSwap && 
  requiredEvidenceViewed (K6 is viewed) &&
  !showSwapModal

shouldShowContinue = 
  canAdvance() && 
  currentPhase.ctaLabel && 
  !(currentPhase.isSwapPhase && !state.hasUsedSwap)  // لازم يجاوب على Swap أولا
```

---

### 5. `src/components/game/screens/HypothesisSelectScreen.tsx` - تعديل

بدل ما يروح direct على dashboard، يروح على briefing:
```text
handleStart:
  advancePhase() // 0 -> 1
  advancePhase() // 1 -> 2 (unlocks D1+D2)
  onComplete()   // navigate to "briefing" بدل "dashboard"
```

---

### 6. `src/pages/Index.tsx` - تعديل

- إضافة `BriefingScreen` كشاشة جديدة
- تعديل hypothesis-select → briefing → dashboard
- إضافة "briefing" لقائمة الشاشات

---

## ملخص الملفات والتعديلات

| الملف | التعديل | الحجم |
|---|---|---|
| `src/data/case1.ts` | إعادة كتابة PHASES (10 مراحل) + إضافة requiredViews + isSwapPhase | متوسط |
| `src/components/game/screens/BriefingScreen.tsx` | **جديد** - شاشة انتقالية | صغير |
| `src/contexts/GameContext.tsx` | تعديل `canAdvance()` ليتحقق من requiredViews + swap | متوسط |
| `src/components/game/GameOverlay.tsx` | تعديل منطق Swap vs CTA (ما يظهروش مع بعض) | صغير |
| `src/components/game/screens/HypothesisSelectScreen.tsx` | تغيير الوجهة من dashboard لـ briefing | صغير |
| `src/pages/Index.tsx` | إضافة BriefingScreen + تعديل flow | صغير |

---

## سيناريو كامل (خطوة بخطوة) بعد التعديل

1. **المشاهد** → 4 مشاهد أبو سعيد
2. **الفرضيات** → اختار 4 → ضغط "ابدأ التحليل"
3. **شاشة الانطلاق (briefing)** → رسالة "ابدأ بالبيانات..." → ضغط "تابع التحليل"
4. **غرفة البيانات** → D1+D2 مفتوحين → افتحهم → يظهر CTA "تابع التحليل" + "اتفتحت ملفات في غرفة الأدلة"
5. **غرفة الأدلة (أول مرة)** → K6 + N1 مفتوحين (باقي الأدلة مقفولة) → افتح K6 → يظهر سؤال التبديل → جاوب (بدل/كمل) → يظهر CTA "خالد ونورة في الصالة"
6. **الصالة (أول مرة)** → خالد + نورة → قابلهم → يظهر CTA "مستندات جديدة في غرفة الأدلة"
7. **غرفة الأدلة (تاني مرة)** → K1 + K3 + N2 اتفتحوا (المجموع 5 ملفات) → افتح K1+K3 → يظهر CTA "بيانات جديدة في غرفة البيانات"
8. **غرفة البيانات (تاني مرة)** → K2 + D3 اتفتحوا (المجموع 4 items) → افتحهم → يظهر CTA "ملفات جديدة في غرفة الأدلة"
9. **غرفة الأدلة (تالت مرة)** → K5 + K4 + N3 اتفتحوا (المجموع 8 ملفات) → افتح K5+K4 → يظهر CTA "فيه حد في الصالة"
10. **الصالة (تاني مرة)** → أميرة/الزبونة → قابلها → يظهر CTA "خلصت جمع الأدلة... روح غرفة التحليل"
11. **غرفة التحليل** → المصفوفة + الفرضيات + الدفتر → اختار الفرضية → قدم التقرير → النتيجة

**ملاحظات:**
- أدلة الضوضاء (N1, N2, N3) موجودة بس مش مطلوب تفتحها عشان تكمل
- أزرار الغرف تحت بتعرض بس الغرف اللي اتفتح فيها حاجات
- الدفتر والفرضيات ثابتين في كل الشاشات
- اللاعب يقدر يرجع لأي غرفة فتحها قبل كده بحرية
