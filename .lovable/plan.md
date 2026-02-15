
# نظام المشاهد المخصصة + الصور التراكمية للغرف

## الفكرة باختصار

كل غرفة ليها نوعين من الخلفيات:

1. **مشهد المرحلة (Phase Scene)**: صورة مخصصة تظهر فقط عند الدخول من زر "تابع التحليل" - فيها الادلة/الشخصيات الجديدة فقط
2. **الصورة التراكمية (Cumulative Room)**: صورة ثابتة للغرفة تظهر عند الدخول من زر الغرفة نفسه - فيها كل اللي اتشاف لحد دلوقتي

---

## اعادة هيكلة المراحل (11 مرحلة بدل 10)

تقسيم مرحلة خالد ونورة لمرحلتين منفصلتين:

```text
المرحلة 0: scenes
المرحلة 1: hypothesis-select
المرحلة 2: data-1      → [CTA] → dashboard     → مشهد: D1 + D2
المرحلة 3: evidence-1   → [CTA] → evidence      → مشهد: K6 + N1 (+ swap)
المرحلة 4: floor-khaled → [CTA] → floor         → مشهد: خالد فقط
المرحلة 5: floor-noura  → [CTA] → floor         → مشهد: نورة فقط
المرحلة 6: evidence-2   → [CTA] → evidence      → مشهد: K1 + K3 + N2
المرحلة 7: data-2       → [CTA] → dashboard     → مشهد: K2 + D3
المرحلة 8: evidence-3   → [CTA] → evidence      → مشهد: K5 + K4 + N3
المرحلة 9: floor-amira  → [CTA] → floor         → مشهد: اميرة فقط
المرحلة 10: matrix       → غرفة التحليل
```

---

## المشاهد المطلوبة (صور placeholder مؤقتا)

### مشاهد CTA (9 صور):
| المرحلة | المشهد | وصف الصورة |
|---|---|---|
| 2 → dashboard | scene-data-1 | شاشة كمبيوتر عليها charts/dashboard |
| 3 → evidence | scene-evidence-1 | مكتب عليه ملفين (K6 + N1) |
| 4 → floor (خالد) | scene-khaled | خالد واقف في صالة المحل |
| 5 → floor (نورة) | scene-noura | نورة عند الكاشير |
| 6 → evidence | scene-evidence-2 | مكتب عليه 3 ملفات (K1 + K3 + N2) |
| 7 → dashboard | scene-data-2 | شاشة كمبيوتر بجداول وشارتات |
| 8 → evidence | scene-evidence-3 | مكتب عليه 3 ملفات (K5 + K4 + N3) |
| 9 → floor (اميرة) | scene-amira | اميرة/الزبونة في الصالة |
| 10 → analysis | scene-final | المحلل يستعد للتحليل |

### صور تراكمية للغرف (3 صور ثابتة):
| الغرفة | وصف الصورة |
|---|---|
| evidence-room-cumulative | غرفة ادلة واسعة فيها اماكن للملفات |
| dashboard-room-cumulative | غرفة بيانات فيها شاشات |
| floor-room-cumulative | صالة المحل كاملة |

**مؤقتا**: هنستخدم الصور الموجودة حاليا كـ placeholders مع overlay مختلف لحين تصميم الصور.

---

## التفاصيل التقنية

### 1. `src/data/case1.ts` - تعديل PHASES

اضافة حقول جديدة لكل مرحلة:
```text
Phase {
  ...
  sceneImage: string          // صورة المشهد الخاص بالمرحلة
  sceneItems: string[]        // الـ IDs اللي تظهر في المشهد ده بس
  targetRoom: string          // الغرفة اللي المشهد بتاعها
}
```

تقسيم floor-1 لمرحلتين:
- المرحلة 4: `floor-khaled` → unlocks: khaled فقط، requiredViews: khaled فقط
- المرحلة 5: `floor-noura` → unlocks: noura فقط، requiredViews: noura فقط

### 2. `src/contexts/GameContext.tsx` - تتبع طريقة الدخول

اضافة حقل جديد في GameState:
```text
+ entryMethod: "cta" | "direct"   // ازاي دخل الغرفة
+ lastCTAPhase: number            // اخر مرحلة دخل منها بـ CTA
```

تعديل منطق الدخول:
- لما يضغط CTA: `entryMethod = "cta"` + `lastCTAPhase = currentPhaseIndex`
- لما يضغط زر الغرفة: `entryMethod = "direct"`

### 3. `src/components/game/GameOverlay.tsx` - تعديل التنقل

- زر CTA يضبط `entryMethod = "cta"` قبل الانتقال
- ازرار الغرف تضبط `entryMethod = "direct"` قبل الانتقال

### 4. شاشات الغرف - نظام الخلفيات المزدوج

**الفكرة العامة لكل غرفة:**
```text
if (entryMethod === "cta" && currentPhase.targetRoom === thisRoom):
  backgroundImage = currentPhase.sceneImage   // صورة المشهد الخاص
  visibleItems = currentPhase.sceneItems      // الادلة الجديدة بس
else:
  backgroundImage = cumulativeRoomImage       // الصورة التراكمية
  visibleItems = allViewedItemsInThisRoom     // كل اللي اتشاف
```

### 5. `EvidenceScreen.tsx` - اخفاء الادلة المستقبلية

- بدل ما نعرض قفل للادلة اللي لسه مظهرتش → منعرضهاش خالص
- فقط الادلة المفتوحة (unlocked) هي اللي تظهر كـ hotspots
- في وضع CTA: فقط ادلة المرحلة الحالية
- في وضع direct: كل الادلة اللي اتفتحت لحد دلوقتي

### 6. `DashboardScreen.tsx` - نفس المنطق

- في وضع CTA: البيانات الجديدة بس
- في وضع direct: كل البيانات اللي اتفتحت

### 7. `FloorScreen.tsx` - الشخصيات المرئية فقط

- ازالة القفل من الشخصيات اللي لسه مظهرتش (مش موجودين اصلا)
- في وضع CTA: الشخصية الجديدة بس
- في وضع direct: كل الشخصيات اللي اتقابلوا/اتفتحوا

---

## سيناريو كامل بعد التعديل

1. اختيار الفرضيات → ضغط "ابدا التحليل"
2. شاشة briefing → "ابدا بالبيانات..." → ضغط "تابع التحليل"
3. **dashboard (CTA)**: مشهد خاص بـ D1+D2 → شاشة فيها الشارتين بس → افتحهم → CTA "اتفتحت ملفات في الادلة"
4. **evidence (CTA)**: مشهد خاص بـ K6+N1 → الملفين بس → افتح K6 → سؤال التبديل → جاوب → CTA "خالد موجود في الصالة"
5. **floor (CTA - خالد)**: مشهد خالد واقف في الصالة → ايكون خالد بس → قابله → CTA "نورة كمان موجودة"
6. **floor (CTA - نورة)**: مشهد نورة عند الكاشير → ايكون نورة بس → قابلها → CTA "مستندات جديدة في الادلة"
7. **evidence (CTA)**: مشهد خاص بـ K1+K3+N2 → 3 ملفات جداد بس → افتح K1+K3 → CTA "بيانات جديدة في البيانات"
8. **dashboard (CTA)**: مشهد خاص بـ K2+D3 → الاتنين الجداد بس → افتحهم → CTA "ملفات جديدة في الادلة"
9. **evidence (CTA)**: مشهد خاص بـ K5+K4+N3 → 3 ملفات جداد بس → افتح K5+K4 → CTA "فيه حد في الصالة"
10. **floor (CTA - اميرة)**: مشهد اميرة في الصالة → ايكون اميرة بس → قابلها → CTA "روح غرفة التحليل"
11. **analysis**: غرفة التحليل → المصفوفة → الحل النهائي

**في اي وقت** لو دخلت غرفة من زر الغرفة:
- evidence: الصورة التراكمية + كل الادلة اللي اتفتحت
- dashboard: الصورة التراكمية + كل البيانات اللي اتفتحت
- floor: الصورة التراكمية + كل الشخصيات اللي اتقابلوا

---

## ملخص الملفات

| الملف | التعديل |
|---|---|
| `src/data/case1.ts` | تعديل PHASES (11 مرحلة) + اضافة sceneImage/sceneItems |
| `src/contexts/GameContext.tsx` | اضافة entryMethod + setEntryMethod |
| `src/components/game/GameOverlay.tsx` | ضبط entryMethod عند التنقل |
| `src/components/game/screens/EvidenceScreen.tsx` | نظام خلفيات مزدوج + اخفاء ادلة مستقبلية |
| `src/components/game/screens/DashboardScreen.tsx` | نظام خلفيات مزدوج |
| `src/components/game/screens/FloorScreen.tsx` | نظام خلفيات مزدوج + اخفاء شخصيات مستقبلية |
| `src/pages/Index.tsx` | تعديل ترقيم المراحل |

**ملحوظة**: الصور هتكون placeholder مؤقتا (نفس صور الغرف الحالية) لحين تصميم الصور المخصصة.
