

# Plan: اسم الشركة + إصلاح flash الـ Setup + شخصية المحلل الديناميكية

## التعديلات

### 1. اسم شركة الاستشارات → "Pinnacle Consulting | بيناكل للاستشارات"
**الملفات:** `CompanyBriefingScreen.tsx`, `PlayerSettingsPanel.tsx`
- تغيير كل ذكر لـ "IMP" كاسم شركة إلى "Pinnacle Consulting"
- العنوان الفرعي: "بيناكل للاستشارات"
- ملاحظة: "IMP" هيفضل موجود بس كاسم الدبلومة في النص التحفيزي ("دبلومة IMP")

### 2. إصلاح flash شاشة Setup
**الملف:** `Setup.tsx`
- المشكلة: `loading` من AuthContext بيكون `true` الأول → `isProfileComplete` = `false` → الفورم بيظهر → لما `loading` يخلص `isProfileComplete` = `true` → redirect
- الحل: إضافة check على `loading` — لو `loading` يرجع `null` أو spinner بدل الفورم

```
if (loading || isProfileComplete) return null;
```

### 3. شخصية المحلل ديناميكية في كل الحوارات

**`EnhancedDialogue.tsx`** — تعديل رئيسي:
- إضافة props جديدة: `playerName?: string`, `playerGender?: "male" | "female"`
- لما `characterId === "detective"`:
  - الاسم يكون `playerName` بدل "المحلل"
  - الصورة تكون `sara.png` لو female، `analyst.png` لو male (عبر prop جديد `imageOverride` في AnimatedCharacter)

**`AnimatedCharacter.tsx`**:
- إضافة prop اختياري `imageOverride?: string`
- لو موجود يستخدمه بدل `character.image`

**كل الشاشات اللي فيها EnhancedDialogue** — تمرير `playerName` و `playerGender`:
| الشاشة | التعديل |
|--------|---------|
| `CompanyBriefingScreen.tsx` | تمرير `playerName={name}` و `playerGender={g}` + تغيير اسم الشركة |
| `ScenesScreen.tsx` | إضافة `useAuth()` + تمرير `playerName` و `playerGender` |
| `InterrogationScreen.tsx` | إضافة `useAuth()` + تمرير `playerName` و `playerGender` |
| `FloorScreen.tsx` | إضافة `useAuth()` + تمرير `playerName` و `playerGender` |
| `OfficeScreen.tsx` | إضافة `useAuth()` + تمرير `playerName` و `playerGender` |

### الملفات المتأثرة
| الملف | التعديل |
|-------|---------|
| `src/pages/Setup.tsx` | إضافة `loading` check لمنع الـ flash |
| `src/components/game/AnimatedCharacter.tsx` | إضافة `imageOverride` prop |
| `src/components/game/EnhancedDialogue.tsx` | إضافة `playerName` + `playerGender` props + تغيير الاسم والصورة للـ detective |
| `src/components/game/screens/CompanyBriefingScreen.tsx` | اسم الشركة الجديد + تمرير props |
| `src/components/game/screens/ScenesScreen.tsx` | تمرير `playerName`/`playerGender` |
| `src/components/game/screens/InterrogationScreen.tsx` | تمرير `playerName`/`playerGender` |
| `src/components/game/screens/FloorScreen.tsx` | تمرير `playerName`/`playerGender` |
| `src/components/game/screens/OfficeScreen.tsx` | تمرير `playerName`/`playerGender` |

