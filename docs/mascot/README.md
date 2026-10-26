# خليل: شخصية التطبيق

خليل هو اسم التطبيق واسم شخصيته أيضًا: شاب كرتوني وسيم، ملامحه هادئة مريحة للعين، ولباسه أنيق
من الطراز الفاخر الهادئ (ألوان الأوف وايت والعنابي والقهوة). يظهر للزائر في أول مرة فيشرح له كل قسم،
ويستطيع الزائر أن يتخطى جزءًا من الشرح أو الشرح كله.

العمل على مرحلتين:

1. **نختار الشكل**: جرّب البرومتات الأربعة في القسم الأول، واختر صورة واحدة.
2. **نرسم الأوضاع**: من الصورة المختارة نصنع «ورقة الشخصية»، ثم الصور الأربع عشرة في القسم الثالث.

البرومتات بالإنجليزية لأن أدوات الصور تفهمها أدق. أفضل الأدوات لثبات الشخصية بين الصور: ChatGPT
(إنشاء الصور) أو Gemini، لأنهما يأخذان صورة مرجعية ويحافظان على الوجه واللبس. وفي Midjourney استخدم
`--oref` (أو `--cref`) بصورة الشخصية المختارة.

---

## 1. اختيار الشكل (أربعة اتجاهات)

كل برومت كامل، انسخه كما هو. الاتجاهان (أ) و(ج) مجسّمان مثل أفلام الرسوم الحديثة، و(ب) و(د) رسم مسطح
يناسب واجهة التطبيق أكثر ويسهل تثبيته بين الصور. **اقتراحي: (ب) أو (د)**، لأن الرسم المسطح يبقى متطابقًا
في 14 صورة أكثر من المجسّم، ويندمج مع ألوان خليل الدافئة.

### (أ) الفخامة الهادئة، مجسّم

```text
A friendly 3D cartoon mascot named Khalil: a handsome young Egyptian man, about 28, with a calm, kind face and a gentle, confident smile. Warm light-brown skin, short neatly styled dark-brown hair with a soft wave, a neatly trimmed short beard, warm brown eyes, soft rounded features, slightly stylized proportions (head a little larger than real, not chibi).
Quiet-luxury "old money" outfit: an off-white (cream) fine cable-knit sweater over a crisp white collared shirt, tailored camel coffee-brown trousers, burgundy suede loafers, a slim brown leather watch.
Strict color palette: off-white #F4EFE6, burgundy #6E1F2B, camel #B08560, dark brown #3B2A20.
Full body, standing, three-quarter front view, relaxed welcoming pose, both hands visible.
Stylized 3D render like a modern animated film, soft studio light, smooth matte materials, clean silhouette.
Plain warm off-white background, centered, square 1:1. No text, no logo, no brand marks.
```

### (ب) أنيق عملي، رسم مسطح

```text
Flat 2D vector illustration of a mascot character named Khalil: a handsome young Arab man in his late 20s with a calm, warm smile and kind eyes. Light-brown skin, short tidy dark hair swept to the side, a light, neat stubble beard, soft rounded shapes.
Smart-casual premium outfit: a burgundy fine-knit quarter-zip pullover over an off-white oxford shirt collar, slim camel chinos, clean white leather sneakers, a thin brown leather watch.
Limited palette only: off-white #F4EFE6, burgundy #6E1F2B, camel #B08560, coffee brown #6B4A35, dark brown #3B2A20.
Full body, standing, three-quarter front view, one hand raised in a friendly open-palm gesture.
Clean modern app-mascot style: flat colors with soft subtle shading, smooth rounded outlines, simple readable shapes that work small and large.
Plain solid off-white background, centered, square 1:1. No text, no logo.
```

### (ج) المعطف الكلاسيكي، مجسّم

```text
A 3D animated-film style mascot named Khalil: a good-looking young Egyptian man around 28, serene and approachable, a soft smile, warm brown eyes, warm light-brown skin, short dark hair neatly combed back, a well-groomed short beard.
Elegant classic outfit: a long tailored camel overcoat, an off-white ribbed turtleneck, dark coffee-brown wool trousers, polished burgundy leather loafers, a small burgundy pocket square.
Palette: camel, off-white, burgundy, coffee brown. Rich fabric textures (wool, knit, leather), but a clean, simple silhouette.
Full body, standing, three-quarter view, hands relaxed, one slightly open as if welcoming someone.
Soft cinematic studio lighting, gentle shadows, high detail, appealing and calm.
Plain light cream background, centered, square 1:1. No text, no logo.
```

### (د) الرجل العربي العصري، رسم شبه مسطح

```text
Semi-flat illustration of a mascot named Khalil, a handsome modern Arab gentleman in his late 20s: calm confident smile, warm brown eyes, light-brown skin, short dark wavy hair, neatly trimmed beard.
Outfit: a cream unstructured blazer over a burgundy knit polo, coffee-brown tailored trousers, dark brown suede loafers, a slim gold-and-brown leather watch.
Palette only: cream #F4EFE6, burgundy #6E1F2B, coffee #6B4A35, camel #B08560.
Full body, standing, three-quarter front view, friendly open-hand gesture.
Premium editorial app illustration style: flat color shapes with soft gradients and gentle grain, smooth clean lines, warm and inviting.
Plain warm off-white background, centered, square 1:1. No text, no logo.
```

**إن أردت تعديلًا** فأضف إلى آخر البرومت سطرًا مثل: `Without a beard` (دون لحية)، `Slightly curlier hair`،
`A little younger, about 24`، `Darker skin tone`، أو `Make the burgundy the main color of the outfit`.

---

## 2. ورقة الشخصية (بعد الاختيار)

أرفق الصورة المختارة مع هذا البرومت. ورقة الشخصية هي المرجع لكل الصور بعدها، فلا تتغير ملامح خليل.

```text
Use the attached image as the exact reference for this character, Khalil. Create a character reference sheet of the SAME character: front view, three-quarter view, side view and back view, full body, side by side, all at the same scale; plus four head close-ups with expressions: warm smile, thinking, excited, calm.
Keep exactly the same face, hair, facial hair (or none), skin tone, outfit, colors and art style. Plain light background, even lighting, no text, no labels.
```

---

## 3. الأوضاع: 14 صورة

أرفق **ورقة الشخصية** مع كل برومت، وابدأ كل برومت بهذا السطر الثابت ثم أضف وصف الوضع:

```text
Use the attached character sheet as the exact reference for Khalil: same face, hair, facial hair (or none), skin tone, outfit, colors and art style. Full body (unless said otherwise), centered, the character filling about 85% of the height, same scale and same light direction as the sheet. Transparent background (or a plain flat background), square 1024x1024. No text, no logo.
```

| # | اسم الملف | أين يظهر | الوضع (أضفه بعد السطر الثابت) |
| --- | --- | --- | --- |
| 1 | `welcome` | أول زيارة، بداية الجولة، نافذة تسجيل الدخول | `Pose: waving hello with one hand, warm open smile, leaning slightly forward, welcoming.` |
| 2 | `explain` | خطوات الشرح العامة (القائمة، الملاحظات، الحساب) | `Pose: presenting something to one side with an open palm, the other hand relaxed, friendly explaining face, as if saying "look here".` |
| 3 | `tasks` | المهام والعادات (الصفحة الرئيسية) | `Pose: holding a clipboard with a short checklist, ticking an item with a pen, satisfied smile.` |
| 4 | `wird` | الورد اليومي | `Pose: gently holding a wooden misbaha (prayer beads) in one hand, serene peaceful smile, soft warm dawn light on him. Calm and respectful.` |
| 5 | `focus` | التركيز (بومودورو) | `Pose: holding a small tomato-shaped kitchen timer, focused calm determined look, over-ear headphones resting around his neck.` |
| 6 | `languages` | تعلّم اللغات والإنجليزية | `Pose: holding an open book, a small round enamel pin on his chest showing the Latin letter "A" and the Arabic letter "ع", two small empty speech bubbles floating beside his head, curious happy face.` |
| 7 | `skills` | تعلّم المهارات | `Pose: holding an open laptop on one forearm, sleeves slightly pushed up, confident smile, a small gear and a lightbulb icon floating near him.` |
| 8 | `callcenter` | الاستعداد لمركز الاتصال | `Pose: wearing a sleek over-ear headset with a microphone, speaking kindly, one hand raised a little as if helping a customer.` |
| 9 | `sales` | تعلّم المبيعات | `Pose: reaching out for a confident friendly handshake, a small upward-trending bar chart icon floating beside him.` |
| 10 | `analytics` | التحليلات | `Pose: holding a tablet that shows a simple rising bar chart, proud smile, pointing at the chart.` |
| 11 | `save` | «احفظ ما فعلته» وإنشاء الحساب | `Pose: holding a golden key in one hand, a small soft cloud with a padlock floating beside him, reassuring smile.` |
| 12 | `celebrate` | نهاية الجولة، إنجاز مهام اليوم | `Pose: both arms raised in joy, big happy smile, a little confetti in burgundy, camel and off-white around him.` |
| 13 | `thinking` | المساعد «خليل» لاحقًا، والمساعدة | `Pose: hand on his chin, thoughtful kind smile, eyes looking up, a small lightbulb above his head.` |
| 14 | `avatar` | الصورة الصغيرة المستديرة (زر المساعد، الشريط العلوي) | `Head and shoulders portrait only (not full body), facing the viewer, friendly smile, centered so it fits inside a circle.` |

**إن تغيّر شيء بين صورة وأخرى** (لون، أو تفصيلة في اللبس)، فأعد الصورة نفسها وأضف:
`Match the reference exactly; keep the same outfit details and colors.`

### بعد الرسم

- أرسل الصور الأربع عشرة بهذه الأسماء نفسها (PNG بخلفية شفافة إن أمكن). سأحوّلها إلى WebP وأضعها في
  `src/assets/mascot/<الاسم>.webp`، فتظهر في مكانها تلقائيًا: كل وضع لم تُضف صورته بعد يظهر مكانه حرف «خ».
- الخلفية الشفافة تجعل الصورة تصلح للوضع الفاتح والداكن معًا، فتجنّب الحواف البيضاء حول الشخصية.
- **الجولة تنتظر الصور**: لا تفتح للزوار ولا تظهر في القائمة حتى تُضاف صور كل الأوضاع التي تستخدمها.
  ولتجربتها قبل ذلك على متصفحك وحده، افتح أدوات المطوّر (F12) ثم Console، واكتب
  `localStorage.setItem('khalil-guide-preview', '1')` وأعد تحميل الصفحة.
- صور اختيارية لاحقًا: `calendar` (التقويم)، و`rest` (جالس يشرب الشاي، للصفحات الفارغة ودون إنترنت)،
  و`oops` (حائر بلطف، عند الأخطاء).

---

## للمطورين

- الأوضاع وأسماؤها في `src/components/Guide/mascotPoses.ts`، والصورة تُعرض بـ `<Mascot pose="…" />`
  (`Mascot.tsx`). الصور تُجمع وقت البناء (`import.meta.glob`)، فالوضع الذي لا صورة له لا يطلب شيئًا من الشبكة.
- الجولة في `src/components/Guide/` (`steps.ts` الخطوات وأجزاؤها، `GuideTour.tsx` البطاقة والإضاءة)، وحالتها
  في `src/lib/guide.ts`: تفتح وحدها للضيف الجديد مرة واحدة في كل متصفح، ويعيدها أي أحد من القائمة الجانبية
  أو قائمة الحساب («جولة مع خليل»)، وذلك كله بعد إضافة صورها (`guideAvailable`). نصوصها في `guide.*` في
  `translations.ts`.
- حجم كل صورة WebP نحو 60–90 كيلوبايت، وتُحفظ على الجهاز مع ملفات التطبيق (Offline).
