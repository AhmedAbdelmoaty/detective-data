
# اضافة الصور الجديدة للشخصيات والغرف

---

## تحديد الصور

### الشخصيات (5 صور)
| الصورة المرفوعة | الشخصية | المسار الجديد |
|----------------|---------|--------------|
| analyst.png | المحلل (detective) | src/assets/characters/analyst.png |
| abu-saeed.png | أبو سعيد (abuSaeed) | src/assets/characters/abu-saeed.png |
| Khaled.png | خالد (khaled) | src/assets/characters/khaled.png |
| Noura.png | نورة (noura) | src/assets/characters/noura.png |
| Amira.png | أميرة (umFahd) | src/assets/characters/amira.png |

### الغرف (5 صور)
| الصورة المرفوعة | الغرفة | المسار الجديد |
|----------------|--------|--------------|
| Abu_Saeed_s_Office.png | مكتب أبو سعيد (OfficeScreen) | src/assets/rooms/detective-office.png (استبدال) |
| Evidence_Room.png | غرفة الأدلة (EvidenceScreen) | src/assets/rooms/evidence-room.png (استبدال) |
| Meeting_Room.png | غرفة الاجتماعات (InterrogationScreen) | src/assets/rooms/interrogation-room.png (استبدال) |
| Data_Dashboard_Room.png | غرفة البيانات (DashboardScreen) | src/assets/rooms/analysis-room.png (استبدال) |
| Analysis_Room.png | غرفة التحليل (AnalysisScreen) | src/assets/rooms/analysis-lab.png (جديد) |

---

## التعديلات المطلوبة

### 1. نسخ الصور للمسارات الصحيحة
- نسخ 5 صور شخصيات لـ `src/assets/characters/`
- استبدال 4 صور غرف في `src/assets/rooms/`
- اضافة صورة غرفة التحليل الجديدة

### 2. تعديل `AnimatedCharacter.tsx`
- اضافة imports للصور الجديدة (analystImg, abuSaeedImg, khaledImg, nouraImg, amiraImg)
- تحديث characterData: كل شخصية تستخدم صورتها الخاصة بدل الصور المشتركة القديمة

### 3. تعديل `AnalysisScreen.tsx`
- اضافة import لصورة غرفة التحليل الجديدة واستخدامها كخلفية (حاليا مفيش خلفية)

---

## التفاصيل التقنية

| # | الملف | التغيير |
|---|-------|---------|
| 1 | src/assets/characters/ | نسخ 5 صور جديدة (analyst, abu-saeed, khaled, noura, amira) |
| 2 | src/assets/rooms/ | استبدال 4 صور + اضافة analysis-lab.png |
| 3 | AnimatedCharacter.tsx | تحديث imports و characterData لاستخدام الصور الجديدة |
| 4 | AnalysisScreen.tsx | اضافة خلفية غرفة التحليل |

ملاحظة: صور الغرف القديمة (ahmed.png, sara.png, karim.png, detective.png) هتفضل موجودة بس مش هنستخدمها - ممكن نشيلها لاحقا. الصور الجديدة هتكون في ملفات منفصلة بأسماء واضحة.
