import { Curriculum } from '../../types';

// UAE Grade 9 General Mathematics Term 1 (2026)
// 3 Units:
// 1. التعابير والمعادلات والدوال (Expressions, Equations, and Functions)
// 2. المعادلات الخطية (Linear Equations)
// 3. الدوال الخطية (Linear Functions)

export const math9General1: Curriculum = {
  isEnglish: false,
  units: [
    {
      id: 1,
      name: 'الوحدة الأولى: التعابير والمعادلات والدوال',
      icon: '📐',
      color: 'from-blue-600 to-cyan-700',
      description: 'دراسة المتغيرات والتعابير الجبرية، ترتيب العمليات الحسابية، خواص الأعداد الحقيقية، خاصية التوزيع، حل المعادلات، وتمثيل العلاقات والدوال وتفسيرها.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 1-1: المتغيرات والتعابير',
          icon: '📝',
          duration: '45 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.1/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المتغير هو رمز (حرف عادة) يمثل قيمة مجهولة. التعبير الجبري يتكون من متغيرات وأعداد وعملية حسابية واحدة على الأقل.',
            sections: [
              { title: 'التعبير الجبري', type: 'formula', content: '2x + 5  أو  3a² - 4b' },
              { title: 'الترجمة من الكلمات إلى تعابير جبرية', type: 'bullets', content: [
                'الجمع (+): يزيد على، حاصل جمع، مضافاً إليه، إجمالي',
                'الطرح (-): يقل عن، مطروحاً منه، الفرق بين، ينقص بمقدار',
                'الضرب (×): أمثال، حاصل ضرب، أضعاف',
                'القسمة (÷): ناتج قسمة، مقسوماً على، نسبة'
              ]},
              { title: 'الصيغة الأسية', type: 'formula', content: 'xⁿ = x · x · ... · x (حيث n هو الأس و x هو الأساس)' }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 1-2: ترتيب العمليات الحسابية وتقييم التعابير',
          icon: '🔢',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.2/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'ترتيب العمليات الحسابية قاعدة قياسية تحدد التسلسل الدقيق لحساب قيمة أي تعبير عددي أو جبري.',
            sections: [
              { title: 'قاعدة ترتيب العمليات (PEMDAS)', type: 'bullets', content: [
                '1. الأقواس وتجميع الحدود: حساب ما بداخل الأقواس أولاً (Parentheses & Brackets)',
                '2. الأسس والجذور: حساب قيم القوى (Exponents)',
                '3. الضرب والقسمة: من اليسار إلى اليمين أيهما أسبق (Multiplication & Division)',
                '4. الجمع والطرح: من اليسار إلى اليمين أيهما أسبق (Addition & Subtraction)'
              ]},
              { title: 'تقييم التعبير الجبري بالتعويض', type: 'formula', content: 'إذا كان x = 3 و y = 4 فإن: 2x² - y = 2(3)² - 4 = 2(9) - 4 = 18 - 4 = 14' }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 1-3: خواص الأعداد وحل المسائل',
          icon: '🧮',
          duration: '45 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.3/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تساعد خواص العمليات على الأعداد الحقيقية في تبسيط التعابير الجبرية وإجراء العمليات الحسابية الذهنية بدقة.',
            sections: [
              { title: 'الخواص الجبرية الأساسية', type: 'bullets', content: [
                'الخاصية التبديلية للجمع والضرب: a + b = b + a  و  ab = ba',
                'الخاصية التجميعية: (a + b) + c = a + (b + c)  و  (ab)c = a(bc)',
                'العنصر المحايد الجمعي: a + 0 = a',
                'العنصر المحايد الضربي: a · 1 = a',
                'خاصية الضرب في صفر: a · 0 = 0',
                'خاصية النظير الجمعي: a + (-a) = 0',
                'خاصية النظير الضربي (المقلوب): a · (1/a) = 1 (حيث a ≠ 0)'
              ]}
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 1-4: خاصية التوزيع',
          icon: '↔️',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.4/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تربط خاصية التوزيع بين عمليتي الضرب والجمع أو الطرح، وتستخدم لفك الأقواس وتجميع الحدود المتشابهة.',
            sections: [
              { title: 'صيغة خاصية التوزيع (Distributive Property)', type: 'formula', content: 'a(b + c) = ab + ac   و   a(b - c) = ab - ac' },
              { title: 'الحدود المتشابهة (Like Terms)', type: 'text', content: 'الحدود التي تحتوي على نفس المتغيرات مرفوعة لنفس الأسس. نجمع معاملاتها فقط: 5x + 3x = 8x.' },
              { title: 'تبسيط التعابير الجبرية في أبسط صورة', type: 'formula', content: '3(2x - 4) + 5x = 6x - 12 + 5x = 11x - 12' }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 1-5: المعادلات',
          icon: '⚖️',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.5/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المعادلة هي جملة رياضية تتضمن علامة المساواة (=). حل المعادلة هو إيجاد قيمة المتغير التي تجعل الطرفين متساويين.',
            sections: [
              { title: 'مجموعة التعويض ومجموعة الحل', type: 'bullets', content: [
                'مجموعة التعويض: مجموعة الأعداد المتاح تعويضها بدلاً من المتغير',
                'مجموعة الحل: القيم من مجموعة التعويض التي تجعل المعادلة صحيحة',
                'المتطابقة (Identity): معادلة صحيحة لجميع قيم المتغير، ولها عدد لا نهائي من الحلول'
              ]},
              { title: 'أنواع الحلول', type: 'formula', content: 'حل وحيد (x = a)  أو  عدد لا نهائي (جميع الأعداد الحقيقية R)  أو  مستحيلة الحل (Ø)' }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 1-6: العلاقات',
          icon: '📊',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.6/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'العلاقة هي مجموعة من الأزواج المرتبة (x, y) التي تربط بين مدخلات (المجال) ومخرجات (المدى).',
            sections: [
              { title: 'طرق تمثيل العلاقات', type: 'bullets', content: [
                '1. الأزواج المرتبة: {(1, 2), (3, 4), (5, 6)}',
                '2. الجدول: جدول من عمودين يوضح قيم x وقيم y المقابلة',
                '3. التمثيل البياني: تعيين النقاط في المستوى الإحداثي',
                '4. المخطط السهمي (Mapping): يوضح أسهم من قيم المجال إلى قيم المدى'
              ]},
              { title: 'المجال والمدى (Domain & Range)', type: 'formula', content: 'المجال (Domain): قيم x  |  المدى (Range): قيم y' },
              { title: 'المتغير المستقل والتابع', type: 'bullets', content: [
                'المتغير المستقل (Independent): يحدد قيم المخرجات (x)',
                'المتغير التابع (Dependent): تتغير قيمته تبعاً للمتغير المستقل (y)'
              ]}
            ]
          }
        },
        {
          id: 7,
          title: 'الدرس 1-7: الدوال',
          icon: '⚙️',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.7/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.7-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الدالة هي علاقة يرتبط فيها كل عنصر في المجال بعنصر واحد فقط في المدى. يُستخدم اختبار الخط الرأسي للتحقق من الدوال بيانياً.',
            sections: [
              { title: 'تعريف الدالة (Function)', type: 'formula', content: 'لكل مدخل x مخرج وحيد y' },
              { title: 'اختبار الخط الرأسي (Vertical Line Test)', type: 'text', content: 'إذا قطع أي خط رأسي التمثيل البياني في نقطة واحدة فقط على الأكثر، فإن العلاقة تمثل دالة. إذا قطعه في أكثر من نقطة، فليست دالة.' },
              { title: 'رمز الدالة (Function Notation)', type: 'formula', content: 'f(x) = 2x + 1   (يُقرأ f لـ x)' },
              { title: 'الدوال غير الخطية والخطية', type: 'bullets', content: [
                'الدالة الخطية: تمثيلها البياني خط مستقيم ومعدل تغيرها ثابت',
                'الدالة غير الخطية: تمثيلها البياني منحنٍ أو غير مستقيم'
              ]}
            ]
          }
        },
        {
          id: 8,
          title: 'الدرس 1-8: تفسير التمثيلات البيانية للدوال',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.8/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-1.8-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تحليل المنحنيات البيانية من حيث المقاطع المحورية، التزايد والتناقص، والقيم العظمى والصغرى، والتماثل.',
            sections: [
              { title: 'المقاطع المحورية', type: 'bullets', content: [
                'المقطع y (y-intercept): النقطة التي يقطع فيها المنحنى المحور y (عند x = 0)',
                'المقطع x (x-intercept / الجذور): النقاط التي يقطع فيها المنحنى المحور x (عند y = 0)'
              ]},
              { title: 'سلوك الدالة (Behavior)', type: 'bullets', content: [
                'دالة متزايدة: قيم y تزداد مع زيادة x (يصعد المنحنى من اليسار لليمين)',
                'دالة متناقصة: قيم y تقل مع زيادة x (يهبط المنحنى من اليسار لليمين)',
                'القيم القصوى: قمم عظمى (Maximum) وقيعان صغرى (Minimum)'
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: 'الوحدة الثانية: المعادلات الخطية',
      icon: '📏',
      color: 'from-emerald-600 to-teal-700',
      description: 'دراسة حل المعادلات الخطية بخطوة واحدة ومتعددة الخطوات، حل المعادلات بوجود متغير في كلا الطرفين، معادلات القيمة المطلقة، النسب والتناسب، والنسبة المئوية والمعادلات الحرفية.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 2-1: كتابة المعادلات وحلها بالجمع والطرح والضرب والقسمة',
          icon: '➕',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.1/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'حل معادلة خطوة واحدة يتطلب استخدام العمليات العكسية لعزل المتغير بمفرده في أحد طرفي المعادلة.',
            sections: [
              { title: 'خاصية الجمع والطرح في المساواة', type: 'formula', content: 'إذا كان a = b فإن: a + c = b + c  و  a - c = b - c' },
              { title: 'خاصية الضرب والقسمة في المساواة', type: 'formula', content: 'إذا كان a = b فإن: ac = bc  و  a/c = b/c (حيث c ≠ 0)' },
              { title: 'العمليات العكسية (Inverse Operations)', type: 'bullets', content: [
                'عكس الجمع هو الطرح: x + 7 = 12  ⟹  x = 12 - 7 = 5',
                'عكس الطرح هو الجمع: x - 4 = 9  ⟹  x = 9 + 4 = 13',
                'عكس الضرب هو القسمة: 3x = 15  ⟹  x = 15 / 3 = 5',
                'عكس القسمة هو الضرب: x / 4 = 6  ⟹  x = 6 · 4 = 24'
              ]}
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 2-2: حل المعادلات متعددة الخطوات',
          icon: '🪜',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.2/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المعادلة متعددة الخطوات تتطلب أكثر من عملية حسابية لعزل المتغير. نتخلص أولاً من الجمع أو الطرح، ثم من الضرب أو القسمة.',
            sections: [
              { title: 'خطوات الحل المتسلسلة', type: 'bullets', content: [
                '1. فك الأقواس بخاصية التوزيع إن وجدت',
                '2. تجميع الحدود المتشابهة في كل طرف',
                '3. التخلص من الثابت بإضافة أو طرح النظير الجمعي',
                '4. التخلص من المعامل بالقسمة عليه أو الضرب في مقلوبه'
              ]},
              { title: 'الأعداد الصحيحة المتتالية', type: 'formula', content: 'الأعداد المتتالية: n, n + 1, n + 2   |   الفردية أو الزوجية المتتالية: n, n + 2, n + 4' }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 2-3: حل المعادلات التي تحتوي على متغير في كلا الطرفين',
          icon: '⚖️',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.3/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'عند وجود المتغير في طرفي المعادلة، نستخدم خاصية الجمع أو الطرح لنقل جميع الحدود التي تحتوي على المتغير إلى طرف واحد والثوابت إلى الطرف الآخر.',
            sections: [
              { title: 'الحالات الخاصة للمتغير في الطرفين', type: 'bullets', content: [
                'حل وحيد: مثل 5x - 3 = 2x + 9  ⟹  3x = 12  ⟹  x = 4',
                'عدد لا نهائي من الحلول (متطابقة): الطرفان متطابقان تماماً مثل 2x + 4 = 2x + 4 (تؤدي إلى 4 = 4 صحيحة دائماً)',
                'لا يوجد حل (تناقض): المتغيرات تلغي بعضها ويبقى تعبير كاذب مثل 3x + 1 = 3x + 5 (تؤدي إلى 1 = 5 مستحيل ومجموعة الحل Ø)'
              ]}
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 2-4: حل المعادلات التي تحتوي على القيمة المطلقة',
          icon: '📏',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.4/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تعبر القيمة المطلقة عن المسافة عن الصفر. لحل معادلة القيمة المطلقة، نعزل أولاً رمز القيمة المطلقة ثم نفصل الحل إلى حالتين.',
            sections: [
              { title: 'قاعدة فك القيمة المطلقة', type: 'formula', content: 'إذا كان |ax + b| = c  (حيث c ≥ 0) فإن: ax + b = c   أو   ax + b = -c' },
              { title: 'حالة انعدام الحل', type: 'formula', content: 'إذا كان |ax + b| = c وكانت c < 0 فإن المعادلة ليس لها حل، والحل هو Ø' },
              { title: 'الحلول الدخيلة (Extraneous Solutions)', type: 'text', content: 'حلول ناتجة عن خطوات جبرية صحيحة لكنها لا تحقق المعادلة الأصلية، لذا يلزم التحقق دائماً بالتعويض.' }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 2-5: النسب والتناسب وحل التناسبات',
          icon: '🔢',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.5/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'التناسب هو مساواة بين نسبتين. نحل التناسب بإجراء الضرب التبادلي لإنشاء معادلة خطية يسهل حلها.',
            sections: [
              { title: 'خاصية الضرب التبادلي', type: 'formula', content: 'a / b = c / d   ⟺   a · d = b · c' },
              { title: 'معدل الوحدة والمعدلات', type: 'formula', content: 'معدل الوحدة = الكمية الكلية / عدد الوحدات (بمقام يساوي 1)' }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 2-6: النسبة المئوية للتغير',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.6/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'النسبة المئوية للتغير تقيس مدى زيادة أو نقصان كمية بالنسبة إلى قيمتها الأصلية.',
            sections: [
              { title: 'قانون النسبة المئوية للتغير', type: 'formula', content: 'النسبة المئوية للتغير = (|القيمة الجديدة - القيمة الأصلية| / القيمة الأصلية) × 100%' },
              { title: 'الزيادة والنقصان والخصم', type: 'bullets', content: [
                'نسبة مئوية للزيادة (Percent of Increase): إذا كانت القيمة الجديدة أكبر من الأصلية',
                'نسبة مئوية للنقصان (Percent of Decrease / Discount): إذا كانت القيمة الجديدة أصغر من الأصلية',
                'سعر البيع بعد الخصم = السعر الأصلي × (1 - نسبة الخصم)',
                'السعر مع الضريبة = السعر الأصلي × (1 + نسبة الضريبة)'
              ]}
            ]
          }
        },
        {
          id: 7,
          title: 'الدرس 2-7: الصيغ الرياضية وحل المعادلات الحرفية',
          icon: '🧪',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.7/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-2.7-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المعادلة الحرفية تحتوي على أكثر من متغير واحد (حروف). حل المعادلة بالنسبة لمتغير محدد يعني عزله بمفرده بدلالة باقي المتغيرات.',
            sections: [
              { title: 'أمثلة شهيرة على الصيغ الهندسية والفيزيائية', type: 'bullets', content: [
                'محيط المستطيل: P = 2l + 2w  ⟹  l = (P - 2w) / 2',
                'المسافة والسرعة: d = r · t  ⟹  r = d / t',
                'درجة الحرارة: F = (9/5)C + 32  ⟹  C = (5/9)(F - 32)'
              ]}
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: 'الوحدة الثالثة: الدوال الخطية',
      icon: '📈',
      color: 'from-purple-600 to-indigo-700',
      description: 'دراسة تمثيل المعادلات الخطية بيانياً، حل المعادلات الخطية بيانياً، حساب معدل التغير وميل المستقيم، صيغ معادلة المستقيم، والمتتاليات الحسابية كدوال خطية.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 3-1: تمثيل المعادلات الخطية بيانياً والمقاطع المحورية',
          icon: '📊',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.1/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المعادلة الخطية هي معادلة يمثلها خط مستقيم في المستوى الإحداثي. الصورة القياسية للمعادلة الخطية هي Ax + By = C.',
            sections: [
              { title: 'الصورة القياسية (Standard Form)', type: 'formula', content: 'Ax + By = C   (حيث A ≥ 0 و A, B, C أعداد صحيحة)' },
              { title: 'طريقة المقاطع المحورية للتمثيل البياني', type: 'bullets', content: [
                'المقطع السيني (x-intercept): نعوض y = 0 ونحل لإيجاد x (النقطة (x, 0))',
                'المقطع الصادي (y-intercept): نعوض x = 0 ونحل لإيجاد y (النقطة (0, y))',
                'نعين النقطتين في المستوى ونصل بينهما بخط مستقيم'
              ]}
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 3-2: حل المعادلات الخطية بيانياً',
          icon: '📉',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.2/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'جذر المعادلة أو حلها هو قيمة x التي تجعل المعادلة صحيحة، ويمثل بيانياً المقطع السيني (x-intercept) للدالة المرتبطة بها (صفر الدالة).',
            sections: [
              { title: 'الدالة المرتبطة بالمعادلة', type: 'formula', content: 'حل ax + b = 0 هو صفر الدالة f(x) = ax + b' },
              { title: 'العلاقة بين المفاهيم', type: 'bullets', content: [
                'جذر المعادلة (Root) = حل المعادلة (Solution)',
                'صفر الدالة (Zero of Function) = المقطع السيني (x-intercept)'
              ]}
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 3-3: معدل التغير والميل',
          icon: '📐',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.3/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'معدل التغير يقيس نسبة التغير في الكمية التابعة y إلى التغير في الكمية المستقلة x. ميل الخط المستقيم هو النسبة بين التغير الرأسي والتغير الأفقي.',
            sections: [
              { title: 'قانون ميل الخط المستقيم (Slope m)', type: 'formula', content: 'm = (y₂ - y₁) / (x₂ - x₁) = Δy / Δx' },
              { title: 'أنواع الميل الأربعة', type: 'bullets', content: [
                'ميل موجب (Positive): المستقيم يصعد من اليسار إلى اليمين (m > 0)',
                'ميل سالب (Negative): المستقيم يهبط من اليسار إلى اليمين (m < 0)',
                'ميل صفري (Zero): مستقيم أفقي تماماً موازٍ لمحور x (m = 0)',
                'ميل غير معرّف (Undefined): مستقيم رأسي تماماً موازٍ لمحور y (المقام Δx = 0)'
              ]}
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 3-4: معادلة المستقيم بصيغة الميل والمقطع',
          icon: '📍',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.4/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'صيغة الميل والمقطع تمكّننا من كتابة وتمثيل معادلة الخط المستقيم بمجرد معرفة ميله ومقطعه الصادي y.',
            sections: [
              { title: 'صيغة الميل والمقطع (Slope-Intercept Form)', type: 'formula', content: 'y = m·x + b   (حيث m هو الميل و b هو المقطع الصادي)' },
              { title: 'التمثيل البياني', type: 'bullets', content: [
                '1. عين نقطة المقطع الصادي (0, b) على المحور y',
                '2. استعمل الميل m = التغير الرأسي / التغير الأفقي للانتقال إلى نقطة ثانية',
                '3. ارسم المستقيم المار بالنقطتين'
              ]}
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 3-5: معادلة المستقيم بصيغة الميل ونقطة',
          icon: '📌',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.5/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تُستخدم صيغة الميل ونقطة لكتابة معادلة المستقيم عندما نعلم ميله وإحداثيات أي نقطة يمر بها.',
            sections: [
              { title: 'صيغة الميل ونقطة (Point-Slope Form)', type: 'formula', content: 'y - y₁ = m(x - x₁)' },
              { title: 'كتابة المعادلة المارة بنقطتين', type: 'bullets', content: [
                '1. احسب أولاً الميل: m = (y₂ - y₁) / (x₂ - x₁)',
                '2. اختر إحدى النقطتين وعوض في صيغة الميل ونقطة',
                '3. بسط المعادلة بالصورة المطلوبة (صيغة الميل والمقطع أو الصورة القياسية)'
              ]}
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 3-6: المتتاليات الحسابية كدوال خطية',
          icon: '🔢',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.6/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المتتالية الحسابية هي نمط عددي يكون الفرق بين أي حدين متتاليين ثابتاً ويسمى الأساس d، وهي دالة خطية مجالها الأعداد الطبيعية وميلها هو الأساس d.',
            sections: [
              { title: 'الأساس d (Common Difference)', type: 'formula', content: 'd = aₙ - aₙ₋₁' },
              { title: 'صيغة الحد النوني في المتتالية الحسابية (nth Term Formula)', type: 'formula', content: 'aₙ = a₁ + (n - 1)·d' },
              { title: 'الربط بالدوال الخطية', type: 'formula', content: 'f(n) = d·n + (a₁ - d)   (حيث الميل = d والمقطع الصادي = a₁ - d)' }
            ]
          }
        },
        {
          id: 7,
          title: 'الدرس 3-7: المستقيمات المتوازية والمتعامدة',
          icon: '⚡',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.7/',
          examUrl: 'https://hesham-afandi.github.io/9Jen-math-T1-3.7-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تتميز المستقيمات المتوازية بأن لها نفس الميل، بينما المستقيمات المتعامدة حاصل ضرب ميليها يساوي -1 (الميلان معكوس مقلوب لبعضهما).',
            sections: [
              { title: 'شرط توازي مستقيمين غير رأسيين', type: 'formula', content: 'm₁ = m₂   (الميلان متساويان والمقطعان الصاديان مختلفان)' },
              { title: 'شرط تعامد مستقيمين غير رأسيين', type: 'formula', content: 'm₁ · m₂ = -1   ⟺   m₂ = -1 / m₁  (سالب المقلوب)' },
              { title: 'ملاحظة للمستقيمات الرأسية والأفقية', type: 'bullets', content: [
                'جميع المستقيمات الرأسية متوازية (ميلها غير معرّف)',
                'جميع المستقيمات الأفقية متوازية (ميلها = 0)',
                'أي مستقيم أفقي يعامد أي مستقيم رأسي'
              ]}
            ]
          }
        }
      ]
    }
  ]
};
