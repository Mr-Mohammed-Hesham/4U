import { Curriculum } from '../../types';

// UAE Grade 11 General Mathematics Term 1 (2026)
// 3 Units:
// 1. التناسب والتشابه (Proportions and Similarity)
// 2. المثلثات القائمة الزاوية وحساب المثلثات (Right Triangles and Trigonometry)
// 3. الاحتمالات والقياس (Probability and Measurement)

export const math11General2026: Curriculum = {
  isEnglish: false,
  units: [
    {
      id: 1,
      name: 'الوحدة الأولى: التناسب والتشابه',
      icon: '📐',
      color: 'from-blue-600 to-indigo-700',
      description: 'دراسة النسب والتناسب، المضلعات المتشابهة، حالات تشابه المثلثات، المستقيمات المتوازية والأجزاء المتناسبة، والأجزاء الخاصة في المثلثات المتشابهة والتمدد.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 1-1: النسب والتناسب',
          icon: '🔢',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'النسبة هي مقارنة بين كميتين باستعمال القسمة. التناسب هو معادلة تبين أن نسبتين متساويتان، وخاصية حاصل الضرب التبادلي هي الأساس في حل التناسبات.',
            sections: [
              { title: 'تعريف النسبة (Ratio)', type: 'formula', content: 'a / b  أو  a : b (حيث b ≠ 0)' },
              { title: 'تعريف التناسب (Proportion)', type: 'formula', content: 'a / b = c / d' },
              { title: 'خاصية الضرب التبادلي (Cross Products Property)', type: 'formula', content: 'إذا كان a / b = c / d فإن a · d = b · c' },
              { title: 'خواص التناسب الرياضية', type: 'bullets', content: [
                'خاصية الضرب التبادلي: حاصل ضرب الطرفين يساوي حاصل ضرب الوسطين (ad = bc)',
                'خاصية المقلوب: b / a = d / c',
                'خاصية تبديل الوسطين: a / c = b / d',
                'خاصية إضافة المقام للبسط: (a + b) / b = (c + d) / d'
              ]},
              { title: 'معدل الوحدة والمقاييس', type: 'text', content: 'مقياس الرسم يقارن بين قياس في نموذج أو خريطة والقياس الحقيقي في الواقع، وتكتب نسبة المقياس بوحدات متطابقة لإيجاد معامل المقياس دون وحدات.' },
              { title: 'مثال تطبيقي', type: 'formula', content: 'حل التناسب: (x + 3) / 2 = 4x / 5  ⟹  5(x + 3) = 2(4x)  ⟹  5x + 15 = 8x  ⟹  3x = 15  ⟹  x = 5' }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 1-2: المضلعات المتشابهة',
          icon: '🔷',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يتشابه مضلعان إذا وفقط إذا كانت زواياهما المتناظرة متطابقة، وأطوال أضلاعهما المتناظرة متناسبة. يُسمى معامل التناسب نسبة التشابه أو معامل المقياس.',
            sections: [
              { title: 'رمز التشابه', type: 'formula', content: 'ABCD ~ EFGH' },
              { title: 'شروط تشابه المضلعات', type: 'bullets', content: [
                '1. تطابق الزوايا المتناظرة: ∠A ≅ ∠E, ∠B ≅ ∠F, ∠C ≅ ∠G, ∠D ≅ ∠H',
                '2. تناسب الأضلاع المتناظرة: AB / EF = BC / FG = CD / GH = DA / HE = k'
              ]},
              { title: 'معامل التشابه (Scale Factor / Similarity Ratio)', type: 'formula', content: 'k = (طول ضلع في المضلع الأول) / (طول الضلع المناظر في المضلع الثاني)' },
              { title: 'نظرية محيطي المضلعين المتشابهين', type: 'formula', content: 'إذا تشابه مضلعان فإن النسبة بين محيطيهما تساوي نسبة التشابه k: (P₁ / P₂) = k' },
              { title: 'النسبة بين مساحتي مضلعين متشابهين', type: 'formula', content: '(A₁ / A₂) = k²  (مربع نسبة التشابه)' }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 1-3: المثلثات المتشابهة',
          icon: '🔺',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يمكن إثبات تشابه المثلثات دون الحاجة إلى فحص جميع الزوايا والأضلاع باستخدام ثلاث مسلمات ونظريات أساسية: AA، SAS، و SSS.',
            sections: [
              { title: 'مسلمة التشابه بزاويتين (AA Similarity)', type: 'formula', content: 'إذا تطابقت زاويتان في مثلث مع زاويتين في مثلث آخر، فإن المثلثين متشابهان.' },
              { title: 'نظرية التشابه بثلاثة أضلاع (SSS Similarity)', type: 'formula', content: 'إذا كانت أطوال الأضلاع المتناظرة لمثلثين متناسبة، فإن المثلثين متشابهان: (a/d = b/e = c/f)' },
              { title: 'نظرية التشابه بضلعين وزاوية محصورة (SAS Similarity)', type: 'formula', content: 'إذا كان طولا ضلعين في مثلث متناسبين مع طولي الضلعين المناظرين لهما وكانت الزاويتان المحصورتان متطابقتين.' },
              { title: 'خواص تشابه المثلثات', type: 'bullets', content: [
                'خاصية الانعكاس: ∆ABC ~ ∆ABC',
                'خاصية التماثل: إذا كان ∆ABC ~ ∆DEF فإن ∆DEF ~ ∆ABC',
                'خاصية التعدي: إذا كان ∆ABC ~ ∆DEF و ∆DEF ~ ∆XYZ فإن ∆ABC ~ ∆XYZ'
              ]}
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 1-4: المستقيمات المتوازية والأجزاء المتناسبة',
          icon: '⏸️',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'إذا وازى مستقيم ضلعاً من أضلاع مثلث وقطع ضلعيه الآخرين، فإنه يقسمهما إلى قطع مستقيمة متناظرة أطوالها متناسبة (نظرية التناسب في المثلث).',
            sections: [
              { title: 'نظرية التناسب في المثلث (Triangle Proportionality Theorem)', type: 'formula', content: 'إذا كان DE ∥ BC في ∆ABC فإن: AD / DB = AE / EC' },
              { title: 'عكس نظرية التناسب في المثلث', type: 'formula', content: 'إذا كان AD / DB = AE / EC فإن المستقيم DE يوازي الضلع BC' },
              { title: 'القطعة المنصفة في المثلث (Midsegment of a Triangle)', type: 'formula', content: 'طول القطعة المنصفة الواصلة بين منتصفي ضلعين يساوي نصف طول الضلع الثالث وتوازيه: DE = ½ BC' },
              { title: 'نتيجة المستقيمات المتوازية وأجزاء القواطع', type: 'formula', content: 'إذا قطع ثلاثة مستقيمات متوازية أو أكثر قاطعين، فإنها تقسم القاطعين إلى أجزاء متناسبة: AB / BC = DE / EF' }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 1-5: الأجزاء الخاصة في المثلثات المتشابهة',
          icon: '📏',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'في المثلثين المتشابهين، النسبة بين الارتفاعين المتناظرين، والقطعتين المنصفتين للزاويتين المتناظرتين، والقطعتين المتوسطتين المتناظرتين تساوي نسبة التشابه بين الأضلاع المتناظرة.',
            sections: [
              { title: 'الارتفاعات المتناظرة (Altitudes)', type: 'formula', content: 'h₁ / h₂ = AB / DE = k' },
              { title: 'منصفات الزوايا المتناظرة (Angle Bisectors)', type: 'formula', content: 't₁ / t₂ = AB / DE = k' },
              { title: 'القطع المتوسطة المتناظرة (Medians)', type: 'formula', content: 'm₁ / m₂ = AB / DE = k' },
              { title: 'نظرية منصف زاوية في مثلث (Triangle Angle Bisector Theorem)', type: 'formula', content: 'منصف زاوية في مثلث يقسم الضلع المقابل إلى قطعتين مستقيمتين النسبة بين طوليهما تساوي النسبة بين طولي الضلعين الآخرين: AB / AC = BD / DC' }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 1-6: التمدد والتحويلات الهندسية التناسبية',
          icon: '🔍',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.6/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-1.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'التمدد هو تحويل هندسي يغير قياسات الشكل دون تغيير شكله وينتج شكلاً مشابهاً للأصل. يتحدد التمدد بمركز تمدد ومعامل مقياس k.',
            sections: [
              { title: 'معامل التمدد (Scale Factor k)', type: 'formula', content: 'k = (طول الصورة) / (طول الأصل)' },
              { title: 'أنواع التمدد', type: 'bullets', content: [
                'تمدد تكبير (Enlargement): عندما يكون |k| > 1',
                'تمدد تصغير (Reduction): عندما يكون 0 < |k| < 1',
                'تمدد تطابق: عندما يكون |k| = 1'
              ]},
              { title: 'قاعدة التمدد في المستوى الإحداثي بمركز نقطة الأصل (0,0)', type: 'formula', content: '(x, y)  ⟶  (k·x, k·y)' }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: 'الوحدة الثانية: المثلثات القائمة الزاوية وحساب المثلثات',
      icon: '📐',
      color: 'from-emerald-600 to-teal-700',
      description: 'دراسة نظرية فيثاغورس، المتوسط الهندسي، المثلثات القائمة الخاصة، حساب المثلثات والنسب المثلثية، زوايا الارتفاع والانخفاض، وقانون الجيب وجيب التمام.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 2-1: المتوسط الهندسي ونظرية فيثاغورس',
          icon: '√',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المتوسط الهندسي لعددين موجبين a و b هو العدد الموجب x الذي يحقق a/x = x/b. في المثلث القائم الزاوية، يقسم الارتفاع الساقط على الوتر المثلث إلى مثلثين متشابهين.',
            sections: [
              { title: 'صيغة المتوسط الهندسي (Geometric Mean)', type: 'formula', content: 'x = √(a · b)   حيث a/x = x/b' },
              { title: 'نظرية الارتفاع كمتوسط هندسي', type: 'formula', content: 'h² = x · y   ⟹   h = √(x · y) (حيث x, y هما جزءا الوتر)' },
              { title: 'نظرية الساق كمتوسط هندسي', type: 'formula', content: 'a = √(x · c)   و   b = √(y · c) (حيث c طول الوتر بالكامل)' },
              { title: 'نظرية فيثاغورس (Pythagorean Theorem)', type: 'formula', content: 'c² = a² + b²   (في أي مثلث قائم الزاوية)' },
              { title: 'ثلاثيات فيثاغورس الشهيرة', type: 'bullets', content: [
                '(3, 4, 5) ومضاعفاتها (6, 8, 10), (9, 12, 15)',
                '(5, 12, 13)',
                '(8, 15, 17)',
                '(7, 24, 25)'
              ]}
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 2-2: عكس نظرية فيثاغورس وتصنيف المثلثات',
          icon: '🔺',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يستخدم عكس نظرية فيثاغورس لتحديد ما إذا كان المثلث قائم الزاوية أو حاد الزوايا أو منفرج الزاوية بناءً على أطوال أضلاعه الثلاثة.',
            sections: [
              { title: 'عكس نظرية فيثاغورس (Converse of Pythagorean Theorem)', type: 'formula', content: 'إذا كان c² = a² + b² فإن المثلث قائم الزاوية' },
              { title: 'تصنيف المثلثات حسب أطوال الأضلاع (حيث c هو أطول ضلع)', type: 'bullets', content: [
                'مثلث قائم الزاوية (Right): إذا كان c² = a² + b²',
                'مثلث حاد الزوايا (Acute): إذا كان c² < a² + b²',
                'مثلث منفرج الزاوية (Obtuse): إذا كان c² > a² + b²'
              ]},
              { title: 'متباينة المثلث للتحقق من إمكانية رسم المثلث', type: 'formula', content: 'a + b > c (مجموع أي طولي ضلعين أكبر من طول الضلع الثالث)' }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 2-3: المثلثات القائمة الخاصة (45°-45°-90° و 30°-60°-90°)',
          icon: '📐',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تتميز المثلثات القائمة الخاصة بنسب ثابتة بين أضلاعها تمكّننا من إيجاد الأطوال المجهولة بدقة ودون الحاجة للحاسبة.',
            sections: [
              { title: 'المثلث متطابق الضلعين 45°-45°-90°', type: 'formula', content: 'الساقان متطابقان: a = b ، والوتر: c = a√2' },
              { title: 'المثلث الثلاثيني الستيني 30°-60°-90°', type: 'formula', content: 'الضلع الأقصر (المقابل لـ 30°) = x ، والوتر = 2x ، والضلع المقابل لـ 60° = x√3' },
              { title: 'جدول مقارنة المثلثات الخاصة', type: 'bullets', content: [
                'في مثلث 45°-45°-90°: الساق : الساق : الوتر = 1 : 1 : √2',
                'في مثلث 30°-60°-90°: الضلع الأقصر : الضلع الأطول : الوتر = 1 : √3 : 2'
              ]}
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 2-4: النسب المثلثية في المثلث القائم الزاوية',
          icon: '📊',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'النسب المثلثية الأساسية هي الجيب (sin)، وجيب التمام (cos)، والظل (tan)، وتعبر عن نسب بين أطوال أضلاع المثلث القائم الزاوية بالنسبة لزاوية حادة θ.',
            sections: [
              { title: 'جيب الزاوية (Sine)', type: 'formula', content: 'sin(θ) = المقابل / الوتر = Opposite / Hypotenuse' },
              { title: 'جيب تمام الزاوية (Cosine)', type: 'formula', content: 'cos(θ) = المجاور / الوتر = Adjacent / Hypotenuse' },
              { title: 'ظل الزاوية (Tangent)', type: 'formula', content: 'tan(θ) = المقابل / المجاور = Opposite / Adjacent' },
              { title: 'مقلوبات النسب المثلثية', type: 'bullets', content: [
                'قاطع التمام: csc(θ) = 1 / sin(θ) = الوتر / المقابل',
                'القاطع: sec(θ) = 1 / cos(θ) = الوتر / المجاور',
                'ظل التمام: cot(θ) = 1 / tan(θ) = المجاور / المقابل'
              ]},
              { title: 'معكوس النسب المثلثية لإيجاد قياس الزاوية', type: 'formula', content: 'θ = sin⁻¹(المقابل/الوتر) = cos⁻¹(المجاور/الوتر) = tan⁻¹(المقابل/المجاور)' }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 2-5: زوايا الارتفاع والانخفاض',
          icon: '🔭',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'زاوية الارتفاع هي الزاوية المحصورة بين الخط الأفقي للبصر وخط البصر إلى جسم يقع في مستوى أعلى، بينما زاوية الانخفاض هي المحصورة بين الخط الأفقي وخط البصر لجسم في مستوى أدنى.',
            sections: [
              { title: 'العلاقة بين زاويتي الارتفاع والانخفاض', type: 'formula', content: 'زاوية الارتفاع = زاوية الانخفاض (بالتبادل الداخلي بين مستقيمين أفقيين متوازيين)' },
              { title: 'خطوات حل المسائل الواقعية', type: 'bullets', content: [
                '1. ارسم شكلاً توضيحياً يبين المثلث القائم مع وضع المعطيات',
                '2. حدد الزاوية المعطاة والضلع المعلوم والضلع المطلوب',
                '3. اختر النسبة المثلثية المناسبة (غالباً tan لحساب الارتفاعات مع المسافة الأفقية)',
                '4. كوّن المعادلة وحلها بدقة باستعمال الآلة الحاسبة'
              ]}
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 2-6: قانون الجيب وقانون جيب التمام',
          icon: '🌐',
          duration: '60 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.6/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-2.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يستخدم قانون الجيب وقانون جيب التمام لحل أي مثلث عام (حتى لو لم يكن قائم الزاوية) وإيجاد أطوال الأضلاع وقياسات الزوايا المجهولة ومساحة المثلث.',
            sections: [
              { title: 'قانون الجيب (Law of Sines)', type: 'formula', content: 'sin(A) / a = sin(B) / b = sin(C) / c' },
              { title: 'حالات استخدام قانون الجيب', type: 'bullets', content: [
                'AAS (زاويتان وضلع غير محصور)',
                'ASA (زاويتان وضلع محصور بينهما)',
                'SSA (ضلعان وزاوية غير محصورة - الحالة المبهمة / الغامضة)'
              ]},
              { title: 'قانون جيب التمام (Law of Cosines)', type: 'formula', content: 'c² = a² + b² - 2ab · cos(C)' },
              { title: 'صيغ قياس الزوايا بقانون جيب التمام', type: 'formula', content: 'cos(C) = (a² + b² - c²) / (2ab)' },
              { title: 'حالات استخدام قانون جيب التمام', type: 'bullets', content: [
                'SAS (ضلعان والزاوية المحصورة بينهما)',
                'SSS (أطوال الأضلاع الثلاثة معلومة)'
              ]},
              { title: 'صيغة مساحة المثلث بمعلومية ضلعين وزاوية محصورة', type: 'formula', content: 'Area = ½ · a · b · sin(C)' }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: 'الوحدة الثالثة: الاحتمالات والقياس',
      icon: '🎲',
      color: 'from-amber-600 to-orange-700',
      description: 'دراسة تمثيل فضاء العينة، الاحتمال بالتباديل والتوافيق، الاحتمال الهندسي، محاكاة النماذج الاحتمالية، احتمالات الأحداث المستقلة وغير المستقلة، والأحداث المتنافية.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 3-1: تمثيل فضاء العينة',
          icon: '🌳',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.1/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'فضاء العينة هو مجموعة جميع النواتج الممكنة لتجربة احتمالية، ويمكن تمثيله بالقائمة المنظمة، أو الجدول، أو مخطط الشجرة البيانية.',
            sections: [
              { title: 'مبدأ العد الأساسي (Fundamental Counting Principle)', type: 'formula', content: 'النواتج الممكنة الكلية = n₁ · n₂ · n₃ · ... · nₖ' },
              { title: 'طرق تمثيل فضاء العينة', type: 'bullets', content: [
                'القائمة المنظمة (Organized List): كتابة جميع الأزواج أو المجموعات الممكنة بنظام',
                'الجدول (Table): صفوف وأعمدة لعرض النواتج ذات البعدين',
                'مخطط الشجرة (Tree Diagram): تفريع كل خطوة إلى فروع تمثل الخيارات المتاحة'
              ]}
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 3-2: الاحتمال بالتباديل والتوافيق',
          icon: '🧮',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.2/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'التباديل هي تنظيم لمجموعة من العناصر يكون فيها الترتيب مهماً. بينما التوافيق هي اختيار عناصر دون مراعاة للترتيب.',
            sections: [
              { title: 'مضروب العدد (Factorial)', type: 'formula', content: 'n! = n · (n - 1) · (n - 2) · ... · 1   (حيث 0! = 1)' },
              { title: 'قانون التباديل (Permutations - Order Matters)', type: 'formula', content: 'ⁿPᵣ = n! / (n - r)!' },
              { title: 'التباديل مع التكرار', type: 'formula', content: 'التباديل = n! / (p! · q! · r!)' },
              { title: 'التباديل الدائرية', type: 'bullets', content: [
                'بدون نقطة مرجع ثابتة: (n - 1)!',
                'مع نقطة مرجع ثابتة: n!'
              ]},
              { title: 'قانون التوافيق (Combinations - Order Does Not Matter)', type: 'formula', content: 'ⁿCᵣ = n! / [r! · (n - r)!]' },
              { title: 'حساب الاحتمال الكلاسيكي', type: 'formula', content: 'P(E) = عدد نواتج الحدث E / العدد الكلي لنواتج فضاء العينة S' }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 3-3: الاحتمال الهندسي',
          icon: '🎯',
          duration: '50 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.3/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الاحتمال الهندسي يتضمن قياسات هندسية مثل الأطوال والمساحات أو قياسات الزوايا لتحديد احتمالية وقوع حدث عشوائي.',
            sections: [
              { title: 'الاحتمال والطول', type: 'formula', content: 'P(نقطة على القطعة BC) = طول القطعة BC / طول القطعة الكلية AD' },
              { title: 'الاحتمال والمساحة', type: 'formula', content: 'P(نقطة في المنطقة B) = مساحة المنطقة B / مساحة المنطقة الكلية A' },
              { title: 'الاحتمال والقطاعات الدائرية', type: 'formula', content: 'P(استقرار المؤشر على قطاع بزاويته x) = x° / 360°' }
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 3-4: محاكاة الاحتمال',
          icon: '💻',
          duration: '45 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.4/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المحاكاة هي نموذج لموقف يتم تصميمه ليعيد إنتاج الظروف لاختبار النتائج الاحتمالية عندما يصعب إجراء التجربة الحقيقية بصورة مباشرة.',
            sections: [
              { title: 'الاحتمال النظري مقابل التجريبي', type: 'bullets', content: [
                'الاحتمال النظري (Theoretical): يعتمد على قواعد الرياضيات وفضاء العينة',
                'الاحتمال التجريبي (Experimental): يعتمد على البيانات والمشاهدات الفعلية للتجربة',
                'الاحتمال التجريبي = عدد مرات حدوث الحدث / عدد المحاولات الكلية'
              ]},
              { title: 'قانون الأعداد الكبيرة (Law of Large Numbers)', type: 'text', content: 'كلما زاد عدد المحاولات في التجربة، اقترب الاحتمال التجريبي من الاحتمال النظري بدقة أكبر.' }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 3-5: احتمالات الأحداث المستقلة وغير المستقلة',
          icon: '🔗',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.5/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يكون الحدثان مستقلين إذا كان وقوع أحدهما لا يؤثر على احتمال وقوع الآخر، وغير مستقلين إذا كان وقوع أحدهما يغير احتمال وقوع الحدث الآخر (كالارتهان بالسحب دون إرجاع).',
            sections: [
              { title: 'قاعدة ضرب الأحداث المستقلة (Independent Events)', type: 'formula', content: 'P(A ∩ B) = P(A) · P(B)' },
              { title: 'قاعدة ضرب الأحداث غير المستقلة (Dependent Events)', type: 'formula', content: 'P(A ∩ B) = P(A) · P(B | A)' },
              { title: 'الاحتمال المشروط (Conditional Probability)', type: 'formula', content: 'P(B | A) = P(A ∩ B) / P(A)   (حيث P(A) > 0)' },
              { title: 'ملاحظة جوهرية', type: 'bullets', content: [
                'السحب مع الإرجاع (With Replacement) يمثل أحداثاً مستقلة',
                'السحب دون إرجاع (Without Replacement) يمثل أحداثاً غير مستقلة تؤثر على المقام'
              ]}
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 3-6: احتمالات الأحداث المتنافية وغير المتنافية',
          icon: '⚡',
          duration: '55 min',
          lessonUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.6/',
          examUrl: 'https://mr-mohammed-hesham.github.io/11Jen-math-T1-3.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الحدثان المتنافيان هما حدثان لا يمكن أن يقعا معاً في نفس الوقت (تقاطعهما فاي)، بينما الأحداث غير المتنافية يمكن وقوعهما معاً وتوجد بينهما نواتج مشتركة.',
            sections: [
              { title: 'قاعدة جمع الأحداث المتنافية (Mutually Exclusive)', type: 'formula', content: 'P(A ∪ B) = P(A) + P(B)   (حيث P(A ∩ B) = 0)' },
              { title: 'قاعدة جمع الأحداث غير المتنافية (Not Mutually Exclusive)', type: 'formula', content: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)' },
              { title: 'احتمال الحدث المتمم (Complementary Event)', type: 'formula', content: 'P(A\') = 1 - P(A)   أو   P(A) + P(A\') = 1' },
              { title: 'مجموع احتمالات كل النواتج البسيطة', type: 'formula', content: '∑ P(Eᵢ) = 1' }
            ]
          }
        }
      ]
    }
  ]
};
