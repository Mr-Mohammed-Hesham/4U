import { Curriculum } from '../../types';

// منهج الصف العاشر متقدم رياضيات - بريدج (Bridge) - الفصل الأول - الإمارات
// 4 وحدات كاملة:
// 1. وحدة الأنظمة الخطية (Linear Systems)
// 2. وحدة العلاقات والدوال التربيعية (Quadratic Relations and Functions)
// 3. وحدة كثيرات الحدود والدوال كثيرات الحدود (Polynomials and Polynomial Functions)
// 4. وحدة الدوال والعلاقات العكسية والجذرية (Inverses and Radical Functions and Relations)

export const math10AdvBridge1: Curriculum = {
  isEnglish: false,
  studentBookUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-0/',
  units: [
    {
      id: 1,
      name: 'الوحدة الأولى: الأنظمة الخطية',
      icon: '📐',
      color: 'from-blue-600 to-indigo-700',
      description: 'دراسة أنظمة المعادلات والمتباينات الخطية بيانياً وجبرياً، البرمجة الخطية وإيجاد الحلول المثلى، والأنظمة في ثلاثة متغيرات والمصفوفات.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 1-1: تمثيل أنظمة المعادلات الخطية بيانياً',
          focusQuestion: 'كيف نحدد عدد حلول نظام خطي من خلال التمثيل البياني؟',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.1/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'النظام الخطي يتكون من معادلتين خطيتين أو أكثر في المتغيرين نفسهما، وحله بيانياً هو نقطة تقاطع المستقيمين.',
            sections: [
              {
                title: 'تصنيف أنظمة المعادلات الخطية',
                type: 'bullets',
                content: [
                  'متسق ومستقل (Consistent & Independent): للمستقيمين نقطة تقاطع واحدة فقط (حل وحيد)، ولهما ميلان مختلفان.',
                  'متسق وغير مستقل (Consistent & Dependent): المستقيمان منطبقان (له عدد لا نهائي من الحلول)، والميل والمقطع الصادي متماثلان.',
                  'غير متسق (Inconsistent): المستقيمان متوازيان ولا يتقاطعان أبداً (لا يوجد حل)، لهما نفس الميل ومقاطع صادية مختلفة.'
                ]
              },
              {
                title: 'خطوات الحل البياني',
                type: 'bullets',
                content: [
                  '1. نكتب المعادلتين بصيغة الميل والمقطع y = mx + b.',
                  '2. نمثل المستقيمين بدقة على المستوى الإحداثي.',
                  '3. نحدد نقطة التقاطع (x, y) ونتحقق من صحة الحل بتعويضه في كلتا المعادلتين.'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 1-2: حل أنظمة المعادلات الخطية جبرياً بالتعويض والحذف',
          focusQuestion: 'متى نفضل استخدام طريقة التعويض ومتى نفضل طريقة الحذف لحل نظام خطي؟',
          icon: '⚖️',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.2/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الحل الجبري يعطي حلولاً دقيقة للأنظمة الخطية دون الاعتماد على دقة الرسم البياني.',
            sections: [
              {
                title: 'طريقة التعويض (Substitution Method)',
                type: 'bullets',
                content: [
                  'عزل أحد المتغيرين ذي المعامل 1 أو -1 في إحدى المعادلتين.',
                  'التعويض بالتعبير الناتج في المعادلة الأخرى للحصول على معادلة بمتغير واحد.',
                  'حل المعادلة وإيجاد قيمة المتغير الأول، ثم إيجاد المتغير الثاني.'
                ]
              },
              {
                title: 'طريقة الحذف بالجمع أو الطرح أو الضرب (Elimination Method)',
                type: 'bullets',
                content: [
                  'ترتيب الحدود المتشابهة رأسياً: Ax + By = C.',
                  'إذا كانت المعاملات متطابقة نطرح، وإذا كانت متعاكسة في الإشارة نجمع.',
                  'إذا لم تكن المعاملات متطابقة، نضرب إحدى المعادلتين أو كلتيهما في عدد مناسب لجعل المعاملات متعاكسة.'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 1-3: تمثيل أنظمة المتباينات الخطية بيانياً',
          focusQuestion: 'كيف نحدد منطقة الحل المشترك لنظام متباينات خطية؟',
          icon: '📊',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.3/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'حل نظام المتباينات الخطية هو منطقة المستوى الإحداثي التي تحقق جميع متباينات النظام معاً (منطقة التقاطع).',
            sections: [
              {
                title: 'قواعد التظليل والمستقيم الحدودي',
                type: 'bullets',
                content: [
                  'المستقيم الحدودي يكون متصلاً (Solid) إذا احتوت المتباينة على المساواة (≤ أو ≥).',
                  'المستقيم الحدودي يكون متقطعاً (Dashed) إذا لم تحتوِ المتباينة على المساواة (< أو >).',
                  'نقطة الاختبار (Test Point): نختبر نقطة سهلة مثل (0, 0)؛ إذا حققت المتباينة نظلل جهتها، وإلا نظلل الجهة المعاكسة.'
                ]
              },
              {
                title: 'منطقة الحل',
                type: 'bullets',
                content: [
                  'منطقة الحل المشترك هي المنطقة المظللة لجميع المتباينات معاً.',
                  'إذا لم تتقاطع مناطق التظليل، فإن النظام ليس له حل.'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 1-4: البرمجة الخطية وإيجاد الحلول المثلى',
          focusQuestion: 'كيف نطبق البرمجة الخطية لاتخاذ قرارات أمثل في الأعمال والصناعة؟',
          icon: '🎯',
          duration: '60 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.4/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'البرمجة الخطية هي أسلوب رياضي لإيجاد القيمة العظمى أو الصغرى لدالة الهدف وفق مجموعة من القيود (المتباينات).',
            sections: [
              {
                title: 'مكونات نموذج البرمجة الخطية',
                type: 'bullets',
                content: [
                  'القيود (Constraints): نظام متباينات يحدد منطقة الحل الممكنة (Feasible Region).',
                  'منطقة الحل الممكنة: قد تكون محدودة (Bounded) وتكون مضلعاً مغلقاً، أو غير محدودة (Unbounded).',
                  'دالة الهدف (Objective Function): دالة خطية f(x, y) = ax + by نريد تعظيمها أو تصغيرها.'
                ]
              },
              {
                title: 'نظرية الرؤوس (Vertex Theorem)',
                type: 'formula',
                content: 'تحدث القيمة العظمى أو الصغرى لدالة الهدف دائماً عند أحد رؤوس (Vertices) منطقة الحل الممكنة.'
              }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 1-5: حل أنظمة المعادلات الخطية في ثلاثة متغيرات',
          focusQuestion: 'كيف نختزل نظاماً من 3 معادلات بـ 3 متغيرات إلى نظام بمعادلتين؟',
          icon: '🧊',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.5/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تمثل كل معادلة خطية في ثلاثة متغيرات Ax + By + Cz = D مستوى في الفضاء ثلاثي الأبعاد.',
            sections: [
              {
                title: 'خطوات الحل بالحذف المتتالي',
                type: 'bullets',
                content: [
                  '1. نختار متغيرين للتخلص من أحد المتغيرات بحذفها من معادلتين لتكوين معادلة (4).',
                  '2. نختار زوجاً آخر من المعادلات ونحذف نفس المتغير لتكوين معادلة (5).',
                  '3. نحل النظام المكون من المعادلتين (4) و(5) لإيجاد قيمتي المتغيرين.',
                  '4. نعوض في إحدى المعادلات الأصلية لإيجاد المتغير الثالث: ثلاثي مرتب (x, y, z).'
                ]
              }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 1-6: حل الأنظمة الخطية باستخدام المصفوفات وقاعدة كرامر',
          focusQuestion: 'كيف تسهل المصفوفات والمحددات حل الأنظمة الخطية الكبيرة؟',
          icon: '🔢',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.6/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-1.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المصفوفات هي تنظيم مستطيل للأعداد في صفوف وأعمدة، والمحددات توفر طريقة مباشرة لحل الأنظمة.',
            sections: [
              {
                title: 'قاعدة كرامر (Cramer\'s Rule)',
                type: 'formula',
                content: 'x = Dx / D,  y = Dy / D  (بشرط أن المحدد العام D ≠ 0)'
              },
              {
                title: 'معكوس المصفوفة وحل المعادلة المصفوفية',
                type: 'bullets',
                content: [
                  'المعادلة المصفوفية: A · X = B  ⇒  X = A⁻¹ · B',
                  'المصفوفة A لها معكوس ضربي فقط إذا كان محددها |A| ≠ 0.'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 2,
      name: 'الوحدة الثانية: العلاقات والدوال التربيعية',
      icon: '📈',
      color: 'from-amber-500 to-orange-600',
      description: 'تحليل الدوال والقطوع المكافئة، حل المعادلات التربيعية بالتحليل وإكمال المربع والقانون العام والمميز، ودراسة الأعداد المركبة والعمليات عليها ومتباينات الدرجة الثانية.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 2-1: تمثيل الدوال التربيعية بيانياً',
          focusQuestion: 'كيف نستنتج الرأس ومحور التماثل والفتحة من معادلة الدالة التربيعية؟',
          icon: '📉',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.1/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الدالة التربيعية هي دالة غير خطية تمثيلها البياني قطع مكافئ (Parabola) على شكل حرف U.',
            sections: [
              {
                title: 'الصيغة القياسية للدالة التربيعية',
                type: 'formula',
                content: 'f(x) = ax² + bx + c  حيث  a ≠ 0'
              },
              {
                title: 'خصائص القطع المكافئ',
                type: 'bullets',
                content: [
                  'إذا كانت a > 0، القطع مفتوح لأعلى وله قيمة صغرى (Minimum).',
                  'إذا كانت a < 0، القطع مفتوح لأسفل وله قيمة عظمى (Maximum).',
                  'معادلة محور التماثل (Axis of Symmetry): x = -b / (2a)',
                  'نقطة الرأس (Vertex): (-b / 2a, f(-b / 2a))',
                  'المقطع الصادي y-intercept هو (0, c).'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 2-2: حل المعادلات التربيعية بالتحليل إلى العوامل',
          focusQuestion: 'كيف نستخدم خاصية الضرب الصفري لحل المعادلات التربيعية بالتحليل؟',
          icon: '🧩',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.2/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'جذور المعادلة التربيعية هي قيم x التي تجعل f(x) = 0، وتسمى أيضاً أصفار الدالة أو مقاطع المحور x.',
            sections: [
              {
                title: 'خاصية الضرب الصفري (Zero Product Property)',
                type: 'formula',
                content: 'إذا كان a · b = 0 فإن a = 0 أو b = 0'
              },
              {
                title: 'طرق التحليل الرئيسية',
                type: 'bullets',
                content: [
                  'إخراج العامل المشترك الأكبر (GCF).',
                  'تحليل الفرق بين مربعين: a² - b² = (a - b)(a + b).',
                  'تحليل المقدار الثلاثي البسيط: x² + bx + c = (x + p)(x + q).',
                  'تحليل المقدار الثلاثي العام: ax² + bx + c باستخدام التجميع (Grouping).'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 2-3: حل المعادلات التربيعية بإكمال المربع',
          focusQuestion: 'كيف نكون ثلاثي حدود مربعاً كاملاً لحل أي معادلة تربيعية؟',
          icon: '🔲',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.3/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'إكمال المربع هو أسلوب جبري لتحويل المقدار x² + bx إلى مربع كامل بإضافة (b/2)².',
            sections: [
              {
                title: 'خطوات إكمال المربع',
                type: 'bullets',
                content: [
                  '1. نجعل معامل x² يساوي 1 (بقسمة جميع الحدود على a إذا لزم الأمر).',
                  '2. ننقل الثابت c إلى الطرف الأيمن: x² + bx = d.',
                  '3. نضيف (b/2)² إلى طرفي المعادلة.',
                  '4. نكتب الطرف الأيسر كمربع كامل: (x + b/2)².',
                  '5. نأخذ الجذر التربيعي للطرفين: x + b/2 = ±√k.'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 2-4: القانون العام والمميز',
          focusQuestion: 'كيف يحدد المميز نوع وعدد حلول المعادلة التربيعية دون حلها؟',
          icon: '⚡',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.4/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'القانون العام يحل أي معادلة تربيعية ax² + bx + c = 0 مباشرة باستخدام المعاملات.',
            sections: [
              {
                title: 'صيغة القانون العام',
                type: 'formula',
                content: 'x = (-b ± √(b² - 4ac)) / (2a)'
              },
              {
                title: 'المميز (Discriminant: Δ = b² - 4ac)',
                type: 'bullets',
                content: [
                  'Δ > 0 ومربع كامل: حلان حقيقيان نسبيان مختلفان.',
                  'Δ > 0 وليس مربعاً كاملاً: حلان حقيقيان غير نسبيين مختلفان (جذور صماء).',
                  'Δ = 0: حل حقيقي واحد مكرر (جذر مكرر مرتين).',
                  'Δ < 0: حلان مركبان مترافقان (لا توجد جذور حقيقية).'
                ]
              }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 2-5: الأعداد المركبة والعمليات عليها',
          focusQuestion: 'ما هي الوحدة التخيلية وكيف نجري العمليات الحسابية على الأعداد المركبة؟',
          icon: '🌀',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.5/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الوحدة التخيلية i تتيح حل المعادلات التي يكون مميزها سالباً حيث i² = -1 و i = √(-1).',
            sections: [
              {
                title: 'الصيغة القياسية للعدد المركب',
                type: 'formula',
                content: 'z = a + bi  (حيث a هو الجزء الحقيقي و b هو الجزء التخيلي)'
              },
              {
                title: 'قوى الوحدة التخيلية i',
                type: 'bullets',
                content: [
                  'i¹ = i',
                  'i² = -1',
                  'i³ = -i',
                  'i⁴ = 1  (دورية كل 4 قوى)'
                ]
              },
              {
                title: 'العمليات والمرافق المركب',
                type: 'bullets',
                content: [
                  'جمع وطرح: نجمع الحدود الحقيقية معاً والحدود التخيلية معاً.',
                  'مرافق العدد المركب a + bi هو a - bi.',
                  'ضرب عددين مترافقين يعطي عدداً حقيقياً: (a + bi)(a - bi) = a² + b².'
                ]
              }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 2-6: تحويلات الدوال التربيعية وصيغة الرأس',
          focusQuestion: 'كيف تؤثر المعاملات a و h و k في صيغة الرأس على شكل وموقع القطع المكافئ؟',
          icon: '🔄',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.6/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'صيغة الرأس تظهر مباشرة نقطة رأس القطع المكافئ والتحويلات الهندسية للدالة الأم f(x) = x².',
            sections: [
              {
                title: 'صيغة الرأس (Vertex Form)',
                type: 'formula',
                content: 'f(x) = a(x - h)² + k  حيث الرأس هو النقطة (h, k)'
              },
              {
                title: 'تأثير المعاملات',
                type: 'bullets',
                content: [
                  'h: إزاحة أفقية (يمين إذا h > 0، يسار إذا h < 0).',
                  'k: إزاحة رأسية (أعلى إذا k > 0، أسفل إذا k < 0).',
                  'a > 0 فتحة لأعلى، a < 0 انعكاس حول محور x.',
                  '|a| > 1 تمدد رأسي (تضيق)، |a| < 1 تضييق رأسي (اتساع).'
                ]
              }
            ]
          }
        },
        {
          id: 7,
          title: 'الدرس 2-7: حل متباينات الدرجة الثانية',
          focusQuestion: 'كيف نحدد فترات الحل لمتباينة تربيعية بيانياً وجبرياً؟',
          icon: '🎯',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.7/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-2.7-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'حل المتباينة التربيعية هو مجموعة قيم x التي تجعل المقدار التربيعي موجباً أو سالباً.',
            sections: [
              {
                title: 'خطوات الحل الجبري باستخدام خط الأعداد',
                type: 'bullets',
                content: [
                  '1. نكتب المتباينة في الصورة القياسية: ax² + bx + c > 0 أو < 0.',
                  '2. نحل المعادلة المرتبطة ax² + bx + c = 0 لإيجاد النقاط الحرجة (الجذور).',
                  '3. نحدد النقاط الحرجة على خط الأعداد لتقسيمه إلى فترات.',
                  '4. نختبر نقطة من كل فترة لتحديد إشارة المقدار وكتابة فترة الحل.'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 3,
      name: 'الوحدة الثالثة: كثيرات الحدود ودوال كثيرات الحدود',
      icon: '🔢',
      color: 'from-purple-600 to-pink-600',
      description: 'العمليات الحسابية على كثيرات الحدود، قسمة كثيرات الحدود المطولة والتركيبية، دوال كثيرات الحدود وسلوك الطرفين، نظريتا الباقي والعوامل، والجذور الحقيقية والمركبة وفق النظرية الأساسية في الجبر.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 3-1: العمليات على كثيرات الحدود',
          focusQuestion: 'كيف نجمع ونطرح ونضرب كثيرات الحدود ونبسط التعابير الجبرية؟',
          icon: '➕',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.1/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'كثيرة الحدود هي تعبير جبري يتكون من وحيدات حد متصلة بعمليات جمع وطرح بأسس صحيحة غير سالبة.',
            sections: [
              {
                title: 'قوانين الأسس الأساسية',
                type: 'bullets',
                content: [
                  'ضرب القوى: xᵐ · xⁿ = xᵐ⁺ⁿ',
                  'قسمة القوى: xᵐ / xⁿ = xᵐ⁻ⁿ',
                  'قوة القوة: (xᵐ)ⁿ = xᵐⁿ',
                  'الأس الصفري: x⁰ = 1  (x ≠ 0)'
                ]
              },
              {
                title: 'العمليات على كثيرات الحدود',
                type: 'bullets',
                content: [
                  'الجمع والطرح: دمج الحدود المتشابهة (نفس المتغير ونفس الأس).',
                  'الضرب: تطبيق خاصية التوزيع (Distributive Property) وضرب كل حد في كل حد.'
                ]
              }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 3-2: قسمة كثيرات الحدود (القسمة المطولة والتركيبية)',
          focusQuestion: 'ما شروط استخدام القسمة التركيبية كبديل سريع للقسمة المطولة؟',
          icon: '➗',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.2/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تستخدم القسمة المطولة والتركيبية لتبسيط كسور كثيرات الحدود وتحليل المعادلات ذات الدرجات العليا.',
            sections: [
              {
                title: 'القسمة المطولة (Long Division)',
                type: 'bullets',
                content: [
                  'ترتيب حدود المقسوم والمقسوم عليه تنازلياً حسب درجة الأس.',
                  'وضع أصفار للحدود المفقودة.',
                  'الخطوات: قسمة ⬅️ ضرب ⬅️ طرح ⬅️ إنزال الحد التالي.'
                ]
              },
              {
                title: 'القسمة التركيبية (Synthetic Division)',
                type: 'bullets',
                content: [
                  'تستخدم فقط عندما يكون المقسوم عليه بصيغة خطية x - c.',
                  'نستخدم معاملات المقسوم فقط وقيمة c في الصندوق.',
                  'إنزال المعامل الأول ⬅️ الضرب في c ⬅️ الجمع رأسياً وتكرار الخطوات حتى الباقي.'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 3-3: دوال كثيرات الحدود وسلوك طرفي التمثيل البياني',
          focusQuestion: 'كيف نحدد سلوك طرفي التمثيل البياني من المعامل الرئيس ودرجة الدالة؟',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.3/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'سلوك طرفي التمثيل البياني يصف اتجاه الدالة عندما تقترب x من اللانهاية الموجبة أو السالبة.',
            sections: [
              {
                title: 'اختبار الحد الرئيس (Leading Term Test)',
                type: 'bullets',
                content: [
                  'درجة فردية ومعامل موجب: الطرف الأيسر لأسفل ↙️ والطرف الأيمن لأعلى ↗️.',
                  'درجة فردية ومعامل سالب: الطرف الأيسر لأعلى ↖️ والطرف الأيمن لأسفل ↘️.',
                  'درجة زوجية ومعامل موجب: الطرفان كلاهما لأعلى ↖️ ↗️.',
                  'درجة زوجية ومعامل سالب: الطرفان كلاهما لأسفل ↙️ ↘️.'
                ]
              },
              {
                title: 'نقاط التحول والأصفار',
                type: 'bullets',
                content: [
                  'دالة من الدرجة n لها على الأكثر n أصفار حقيقية.',
                  'لها على الأكثر n - 1 من نقاط التحول (Turning Points).'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 3-4: تحليل معادلات كثيرات الحدود وحلها',
          focusQuestion: 'كيف نستخدم التحليل بالتجميع ومجموع وفرق مكعبين لحل معادلات الدرجات العليا؟',
          icon: '🧩',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.4/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تحليل كثيرات الحدود هو تفكيكها إلى عوامل أولية خطية أو تربيعية لحل المعادلات f(x) = 0.',
            sections: [
              {
                title: 'صيغ تحليل المكعبين',
                type: 'formula',
                content: 'a³ + b³ = (a + b)(a² - ab + b²)\na³ - b³ = (a - b)(a² + ab + b²)'
              },
              {
                title: 'التحليل بالتجميع والصورة التربيعية',
                type: 'bullets',
                content: [
                  'التحليل بالتجميع (Factoring by Grouping): مناسب للتعابير ذات 4 حدود.',
                  'الصورة التربيعية (Quadratic Form): معادلات مثل au² + bu + c = 0 حيث u = x².'
                ]
              }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 3-5: نظريتا الباقي والعوامل',
          focusQuestion: 'كيف يثبت تعويض x = c أن (x - c) عامل من عوامل كثيرة الحدود؟',
          icon: '📜',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.5/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'توفر نظريتا الباقي والعوامل طريقة سريعة لحساب قيمة الدالة وتحديد عواملها دون الحاجة لإجراء القسمة المطولة.',
            sections: [
              {
                title: 'نظرية الباقي (Remainder Theorem)',
                type: 'formula',
                content: 'عند قسمة كثيرة الحدود f(x) على (x - c)، فإن الباقي هو f(c).'
              },
              {
                title: 'نظرية العوامل (Factor Theorem)',
                type: 'formula',
                content: '(x - c) عامل لكثيرة الحدود f(x) إذا وفقط إذا كان f(c) = 0 (أي الباقي = 0).'
              }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 3-6: الجذور والأصفار والنظرية الأساسية في الجبر',
          focusQuestion: 'ما هي النظرية الأساسية في الجبر وكيف نجد جميع الجذور الحقيقية والمركبة؟',
          icon: '✨',
          duration: '60 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.6/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-3.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تربط النظرية الأساسية في الجبر بين درجة كثيرة الحدود والعدد الكلي لجذورها في مجموعة الأعداد المركبة.',
            sections: [
              {
                title: 'النظرية الأساسية في الجبر (Fundamental Theorem of Algebra)',
                type: 'formula',
                content: 'كل دالة كثيرة حدود من الدرجة n (حيث n ≥ 1) لها بالضبط n من الجذور المركبة (مع احتساب التكرار).'
              },
              {
                title: 'نظرية الصفر النسبي ومرافق الجذور المركبة',
                type: 'bullets',
                content: [
                  'الأصفار النسبية الممكنة: p/q حيث p عوامل الحد الثابت و q عوامل المعامل الرئيس.',
                  'نظرية الجذور المركبة المترافقة: إذا كان a + bi جذراً للدالة فإن مرافقه a - bi جذر أيضاً.',
                  'قاعدة ديكارت للإشارات لتحديد عدد الأصفار الموجبة والسالبة الممكنة.'
                ]
              }
            ]
          }
        }
      ]
    },
    {
      id: 4,
      name: 'الوحدة الرابعة: الدوال والعلاقات العكسية والجذرية',
      icon: '⚡',
      color: 'from-emerald-600 to-teal-700',
      description: 'العمليات على الدوال وتركيب الدوال، العلاقات والدوال العكسية، دوال الجذر التربيعي وتمثيلها، الجذور النونية، الأسس النسبية، وحل المعادلات والمتباينات الجذرية.',
      lessons: [
        {
          id: 1,
          title: 'الدرس 4-1: العمليات على الدوال وتركيب الدوال',
          focusQuestion: 'كيف نجد ناتج تركيب دالتين [f ∘ g](x) ونحدد مجاله؟',
          icon: '⚙️',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.1/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.1-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'يمكن دمج الدوال باستخدام العمليات الجبرية الأربع (الجمع والطرح والضرب والقسمة) وكذلك عملية تركيب الدوال.',
            sections: [
              {
                title: 'العمليات الجبرية ومجالها',
                type: 'bullets',
                content: [
                  '(f + g)(x) = f(x) + g(x)',
                  '(f - g)(x) = f(x) - g(x)',
                  '(f · g)(x) = f(x) · g(x)',
                  '(f / g)(x) = f(x) / g(x)  حيث g(x) ≠ 0'
                ]
              },
              {
                title: 'تركيب الدوال (Composition of Functions)',
                type: 'formula',
                content: '[f ∘ g](x) = f(g(x))\nالمجال يتكون من جميع قيم x في مجال g التي تجعل g(x) في مجال f.'
              }
            ]
          }
        },
        {
          id: 2,
          title: 'الدرس 4-2: العلاقات والدوال العكسية',
          focusQuestion: 'كيف نحدد إذا كانت الدالة العكسية f⁻¹ دالة باستخدام اختبار الخط الأفقي؟',
          icon: '🔄',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.2/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.2-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'العلاقة العكسية تبدل المجال والمدى، ويكون التمثيل البياني للدالة العكسية انعكاساً للتمثيل الأصلي حول المستقيم y = x.',
            sections: [
              {
                title: 'اختبار الخط الأفقي والدوال واحد لواحد (One-to-One)',
                type: 'bullets',
                content: [
                  'تكون للدالة دالة عكسية إذا وفقط إذا قطعت أي خط أفقي في نقطة واحدة على الأكثر.',
                  'شرط الدالتين العكسيتين: f(g(x)) = x  و  g(f(x)) = x.'
                ]
              },
              {
                title: 'خطوات إيجاد الدالة العكسية جبرياً',
                type: 'bullets',
                content: [
                  '1. نكتب y = f(x).',
                  '2. نبدل موضعي x و y في المعادلة.',
                  '3. نحل المعادلة الجديدة بالنسبة لـ y.',
                  '4. نكتب y كـ f⁻¹(x).'
                ]
              }
            ]
          }
        },
        {
          id: 3,
          title: 'الدرس 4-3: دوال ومتباينات الجذر التربيعي',
          focusQuestion: 'كيف نحدد مجال ومدى دالة الجذر التربيعي ونمثلها بيانياً؟',
          icon: '📈',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.3/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.3-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'دالة الجذر التربيعي هي دالة تحتوي على المتغير تحت علامة الجذر، وتعتبر معكوساً مقيداً للدالة التربيعية.',
            sections: [
              {
                title: 'الدالة الأم للجذر التربيعي',
                type: 'formula',
                content: 'f(x) = √x  (المجال: x ≥ 0 ، المدى: y ≥ 0)'
              },
              {
                title: 'التحويلات الهندسية لدالة الجذر',
                type: 'bullets',
                content: [
                  'الصيغة العامة: f(x) = a√(x - h) + k',
                  'نقطة البداية (Starting Point): (h, k)',
                  'المجال: ما تحت الجذر ≥ 0 أي x - h ≥ 0 ⇒ x ≥ h.',
                  'المدى: إذا a > 0 فإن y ≥ k ، وإذا a < 0 فإن y ≤ k.'
                ]
              }
            ]
          }
        },
        {
          id: 4,
          title: 'الدرس 4-4: الجذور النونية وتبسيط التعابير الجذرية',
          focusQuestion: 'متى نستخدم رمز القيمة المطلقة عند إيجاد الجذر النوني؟',
          icon: '√',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.4/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.4-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الجذر النوني لعدد a هو العدد b بحيث bⁿ = a، وتسمى n بدليل الجذر (Index).',
            sections: [
              {
                title: 'قاعدة القيمة المطلقة للجذور',
                type: 'formula',
                content: 'ⁿ√(xⁿ) = |x|  عندما يكون الدليل n زوجياً والناتج ذا أس فردي'
              },
              {
                title: 'حالات دليل الجذر',
                type: 'bullets',
                content: [
                  'الدليل فردي: يوجد جذر حقيقي واحد دائماً، ويكون سالباً للعدد السالب وموجباً للموجب.',
                  'الدليل زوجي: يوجد جذران حقيقيان للعدد الموجب (الجذر الرئيس موجب)، ولا يوجد جذر حقيقي للعدد السالب.'
                ]
              }
            ]
          }
        },
        {
          id: 5,
          title: 'الدرس 4-5: العمليات على التعابير الجذرية وإنطاق المقام',
          focusQuestion: 'كيف نجري عمليات الجمع والضرب وننطق مقام كسر يحتوي على جذور؟',
          icon: '✖️',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.5/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.5-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'تبسيط التعابير الجذرية يتطلب التخلص من الجذور في المقامات وخروج جميع العوامل المربعة الكاملة من تحت الجذر.',
            sections: [
              {
                title: 'خواص ضرب وقسمة الجذور',
                type: 'formula',
                content: 'ⁿ√(a · b) = ⁿ√a · ⁿ√b\nⁿ√(a / b) = ⁿ√a / ⁿ√b'
              },
              {
                title: 'إنطاق المقام (Rationalizing the Denominator)',
                type: 'bullets',
                content: [
                  'إذا كان المقام وحيدة حد جذرية: نضرب البسط والمقام في جذر مناسب لحذف الجذر.',
                  'إذا كان المقام ثنائية حد بها جذر: نضرب البسط والمقام في مرافق المقام (Conjugate): مرافق (a + √b) هو (a - √b).'
                ]
              }
            ]
          }
        },
        {
          id: 6,
          title: 'الدرس 4-6: الأسس النسبية والكسرية',
          focusQuestion: 'كيف نحول بين الصورة الجذرية والصورة الأسية النسبية؟',
          icon: '½',
          duration: '50 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.6/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.6-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'الأسس الكسرية تمثل طريقة أخرى لكتابة الجذور وتخضع لنفس قوانين الأسس الصحيحة.',
            sections: [
              {
                title: 'تعريف الأس النسبي',
                type: 'formula',
                content: 'b^(m/n) = ⁿ√(bᵐ) = (ⁿ√b)ᵐ   (حيث n هو دليل الجذر و m هو قوة الأس)'
              },
              {
                title: 'الأسس السالبة',
                type: 'formula',
                content: 'b^(-m/n) = 1 / b^(m/n) = 1 / ⁿ√(bᵐ)'
              }
            ]
          }
        },
        {
          id: 7,
          title: 'الدرس 4-7: حل المعادلات والمتباينات الجذرية والحلول الدخيلة',
          focusQuestion: 'لماذا تظهر الحلول الدخيلة (Extraneous Solutions) عند رفع طرفي المعادلة لقوة؟',
          icon: '🎯',
          duration: '55 min',
          lessonUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.7/',
          examUrl: 'https://hesham-afandi.github.io/10Adv-Bri-math-T1-4.7-exam/',
          lessonTitle: '📖 شرح الدرس',
          examTitle: '📝 اختبر نفسك',
          content: {
            intro: 'المعادلة الجذرية تحتوي على متغير تحت علامة الجذر، والتحقق من صحة الحل خطوة أساسية لاستبعاد الحلول الدخيلة.',
            sections: [
              {
                title: 'خطوات حل المعادلات الجذرية',
                type: 'bullets',
                content: [
                  '1. عزل الجذر في أحد طرفي المعادلة بمفرده.',
                  '2. رفع طرفي المعادلة لقوة تساوي دليل الجذر للتخلص منه.',
                  '3. حل المعادلة الناتجة (خطية أو تربيعية).',
                  '4. التحقق الإلزامي من الحلول بالتعويض في المعادلة الأصلية لحذف أي حل دخيل (Extraneous Solution).'
                ]
              },
              {
                title: 'حل المتباينات الجذرية',
                type: 'bullets',
                content: [
                  'شرط التعريف: ما تحت الجذر التربيعي يجب أن يكون ≥ 0.',
                  'حل المتباينة بعد رفع الطرفين للقوة.',
                  'فترة الحل النهائية هي تقاطع شرط التعريف مع حل المتباينة.'
                ]
              }
            ]
          }
        }
      ]
    }
  ]
};
