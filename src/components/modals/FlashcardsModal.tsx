import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, RotateCw, CheckCircle2, AlertCircle, Trophy, 
  Layers, ArrowLeft, ArrowRight, Zap, RefreshCw, BookOpen, Brain,
  ChevronRight, ChevronLeft, Search
} from 'lucide-react';
import { fetchGeneratedFlashcards } from '../../services/ai';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  subject?: string;
  formula?: string;
}

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
  onRewardPoints?: (pts: number) => void;
}

const PRESET_DECKS: Record<string, { label: string; icon: string; cards: Flashcard[] }> = {
  physics: {
    label: 'الفيزياء والقوانين',
    icon: '⚛️',
    cards: [
      {
        id: 'p1',
        subject: 'الفيزياء',
        category: 'قوانين الحركة والقوة',
        front: 'ما هو قانون نيوتن الثاني للحركة، وكيف يُعبر عنه رياضياً؟',
        back: 'تسارع الجسم يتناسب طردياً مع القوة المحصلة المؤثرة عليه وعكسياً مع كتلته.\nالصيغة: القوة المحصلة = الكتلة × التسارع (F = m · a).\nالوحدة: نيوتن (N = kg · m/s²).',
        formula: 'F_{net} = m \\cdot a'
      },
      {
        id: 'p2',
        subject: 'الفيزياء',
        category: 'الميكانيكا والطاقة',
        front: 'كيف تُحسب طاقة الحركة (Kinetic Energy) وما علاقتها بمضاعفة السرعة؟',
        back: 'KE = ½ m v²\nطاقة الحركة تتناسب طردياً مع مربع السرعة؛ لذا إذا تضاعفت السرعة مرتين (2x)، تزداد طاقة الحركة أربع مرات (4x).',
        formula: 'KE = \\frac{1}{2} m v^2'
      },
      {
        id: 'p3',
        subject: 'الفيزياء',
        category: 'الميكانيكا والطاقة',
        front: 'ما هي صيغة طاقة الوضع التثاقلية (Gravitational Potential Energy)؟',
        back: 'PE = m · g · h\nحيث m هي الكتلة (kg)، و g تسارع الجاذبية (≈ 9.8 m/s²)، و h الارتفاع الرأسي عن مستوى الإسناد (m).',
        formula: 'PE = m \\cdot g \\cdot h'
      },
      {
        id: 'p4',
        subject: 'الفيزياء',
        category: 'الكهرباء والمغناطيسية',
        front: 'ما هو قانون أوم (Ohm\'s Law) وما هي وحدات قياس أطرافه؟',
        back: 'فرق الجهد بين طرفي موصل يتناسب طردياً مع شدة التيار المار فيه عند ثبوت درجة الحرارة.\nV = I · R\nحيث V فرق الجهد (فولت V)، I شدة التيار (أمبير A)، R المقاومة (أوم Ω).',
        formula: 'V = I \\cdot R'
      },
      {
        id: 'p5',
        subject: 'الفيزياء',
        category: 'الكهرباء الساكنة',
        front: 'ما هو قانون كولوم (Coulomb\'s Law) لقوة التجاذب والتنافر بين شحنتين؟',
        back: 'القوة الكهربائية بين شحنتين نقطيتين تتناسب طردياً مع حاصل ضرب الشحنتين وعكسياً مع مربع المسافة بينهما:\nF = k · (|q₁ · q₂|) / r²\nحيث k = 8.99 × 10⁹ N·m²/C².',
        formula: 'F = k \\frac{|q_1 q_2|}{r^2}'
      },
      {
        id: 'p6',
        subject: 'الفيزياء',
        category: 'البصريات والموجات',
        front: 'ما هو قانون سنيل (Snell\'s Law) في انكسار الضوء؟',
        back: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)\nحيث n₁ و n₂ معاملا الانكسار للوسطين، و θ₁ زاوية السقوط، و θ₂ زاوية الانكسار.',
        formula: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)'
      },
      {
        id: 'p7',
        subject: 'الفيزياء',
        category: 'الديناميكا الحرارية',
        front: 'ما هو نص القانون الأول للديناميكا الحرارية (حفظ الطاقة الحرارية)؟',
        back: 'التغير في الطاقة الداخلية لنظام (ΔU) يساوي كمية الحرارة المضافة للنظام (Q) مطروحاً منها الشغل الذي يبذله النظام (W).\nΔU = Q - W',
        formula: '\\Delta U = Q - W'
      },
      {
        id: 'p8',
        subject: 'الفيزياء',
        category: 'حركة دورانية وتوافقية',
        front: 'ما هو قانون التردد والزمن الدوري في الحركة الموجية؟',
        back: 'التردد (f) هو مقلوب الزمن الدوري (T):\nf = 1 / T\nوسرعة الموجة: v = f · λ (التردد × الطول الموجي).',
        formula: 'v = f \\cdot \\lambda \\quad , \\quad f = \\frac{1}{T}'
      }
    ]
  },
  math: {
    label: 'الرياضيات والتفاضل',
    icon: '📐',
    cards: [
      {
        id: 'm1',
        subject: 'الرياضيات',
        category: 'الجبر والمعادلات',
        front: 'ما هو القانون العام لحل المعادلة التربيعية ax² + bx + c = 0 وما دلالة المميز؟',
        back: 'x = [-b ± √(b² - 4ac)] / (2a)\nالمميز Δ = b² - 4ac:\n- إذا Δ > 0: جذران حقيقيان مختلفان.\n- إذا Δ = 0: جذر حقيقي واحد مكرر.\n- إذا Δ < 0: جذران مركبان غير حقيقيين.',
        formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
      },
      {
        id: 'm2',
        subject: 'الرياضيات',
        category: 'حساب المثلثات',
        front: 'ما هي متطابقة فيثاغورس المثلثية الأساسية والمتطابقات المشتقة منها؟',
        back: '1. sin²(θ) + cos²(θ) = 1\n2. بالقسمة على cos²(θ): tan²(θ) + 1 = sec²(θ)\n3. بالقسمة على sin²(θ): 1 + cot²(θ) = csc²(θ)',
        formula: '\\sin^2(\\theta) + \\cos^2(\\theta) = 1'
      },
      {
        id: 'm3',
        subject: 'الرياضيات',
        category: 'التفاضل وقواعد الاشتقاق',
        front: 'ما هي قاعدة اشتقاق حاصل ضرب دالتين (Product Rule)؟',
        back: 'مشتقة ضرب دالتين = (مشتقة الأولى × الثانية) + (الأولى × مشتقة الثانية).\n[f(x) · g(x)]\' = f\'(x)g(x) + f(x)g\'(x)',
        formula: '(u \\cdot v)\' = u\'v + uv\''
      },
      {
        id: 'm4',
        subject: 'الرياضيات',
        category: 'التفاضل وقواعد الاشتقاق',
        front: 'ما هي قاعدة اشتقاق قسمة دالتين (Quotient Rule)؟',
        back: 'مشتقة القسمة = [(مشتقة البسط × المقام) - (البسط × مشتقة المقام)] ÷ (المقام)².\n[f/g]\' = [f\'g - fg\'] / g²',
        formula: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}'
      },
      {
        id: 'm5',
        subject: 'الرياضيات',
        category: 'التفاضل وقاعدة السلسلة',
        front: 'ما هي قاعدة السلسلة (Chain Rule) لتفاضل الدوال المركبة f(g(x))؟',
        back: 'd/dx [f(g(x))] = f\'(g(x)) · g\'(x)\nأي: مشتقة الدالة الخارجية بالنسبة للداخلية × مشتقة الدالة الداخلية.',
        formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)'
      },
      {
        id: 'm6',
        subject: 'الرياضيات',
        category: 'الهندسة التحليلية',
        front: 'ما هي معادلة الدائرة التي مركزها (h, k) ونصف قطرها r على المستوى الإحداثي؟',
        back: '(x - h)² + (y - k)² = r²\nإذا كان المركز نقطة الأصل (0, 0): x² + y² = r².',
        formula: '(x - h)^2 + (y - k)^2 = r^2'
      },
      {
        id: 'm7',
        subject: 'الرياضيات',
        category: 'اللوغاريتمات والأسس',
        front: 'ما هي الخواص الأساسية للوغاريتمات (الضرب، القسمة، والرفع لقوة)؟',
        back: '1. log(A · B) = log(A) + log(B)\n2. log(A / B) = log(A) - log(B)\n3. log(A^k) = k · log(A)\n4. log_b(b) = 1  و  log_b(1) = 0',
        formula: '\\log_b(A^k) = k \\log_b(A)'
      },
      {
        id: 'm8',
        subject: 'الرياضيات',
        category: 'التكامل الأساسي',
        front: 'ما هي قاعدة تكامل قوى المتغير ∫ xⁿ dx لجميع n ≠ -1؟',
        back: '∫ xⁿ dx = (x^(n+1)) / (n + 1) + C\nحيث C هو ثابت التكامل غير المحدود.\nأما إذا n = -1: ∫ (1/x) dx = ln|x| + C.',
        formula: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C'
      }
    ]
  },
  chemistry: {
    label: 'الكيمياء والمفاهيم',
    icon: '🧪',
    cards: [
      {
        id: 'c1',
        subject: 'الكيمياء',
        category: 'قوانين الغازات',
        front: 'ما هو قانون الغاز المثالي (Ideal Gas Law) وما مدلول كل رمز؟',
        back: 'P · V = n · R · T\n- P: الضغط (atm أو Pa)\n- V: الحجم (L أو m³)\n- n: عدد المولات (mol)\n- R: ثابت الغاز العام (0.0821 L·atm/mol·K)\n- T: درجة الحرارة المطلقة بالكلفن (K = °C + 273).',
        formula: 'P \\cdot V = n \\cdot R \\cdot T'
      },
      {
        id: 'c2',
        subject: 'الكيمياء',
        category: 'المحاليل والتركيز',
        front: 'كيف يُحسب التركيز المولاري (المولارية Molarity) وما وحدته؟',
        back: 'المولارية (M) = عدد مولات المذاب (n) ÷ حجم المحلول باللتر (V).\nM = n / V\nالوحدة: mol/L أو Molar (M).',
        formula: 'M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}}'
      },
      {
        id: 'c3',
        subject: 'الكيمياء',
        category: 'الأحماض والقواعد',
        front: 'كيف يُحسب الرقم الهيدروجيني (pH) وما علاقته بتركيز أيونات الهيدرونيوم [H⁺]؟',
        back: 'pH = -log₁₀[H⁺]\npOH = -log₁₀[OH⁻]\nعند درجة حرارة 25°C: pH + pOH = 14.\n- المحلول حمضي إذا pH < 7\n- متعادل إذا pH = 7\n- قاعدي إذا pH > 7.',
        formula: '\\text{pH} = -\\log_{10}[H^+]'
      },
      {
        id: 'c4',
        subject: 'الكيمياء',
        category: 'الروابط الكيميائية',
        front: 'ما الفرق الجوهري بين الرابطة الأيونية والرابطة التساهمية؟',
        back: '1. الرابطة الأيونية: تنشأ نتيجة انتقال إلكترونات من فلز (يفقد ويصبح كاتيون موجب) إلى لافلز (يكتسب ويصبح أنيون سالب).\n2. الرابطة التساهمية: تنشأ نتيجة مشاركة أزواج من الإلكترونات بين ذرات اللافلزات للوصول للتركيب الثماني المستقر.',
        formula: '\\Delta \\text{EN} > 1.7 \\rightarrow \\text{Ionic}'
      },
      {
        id: 'c5',
        subject: 'الكيمياء',
        category: 'الاتزان الكيميائي',
        front: 'ما هو مبدأ لوشاتيليه (Le Chatelier\'s Principle)؟',
        back: 'إذا خضع نظام في حالة اتزان كيميائي لتغير في أحد العوامل (التركيز، الضغط، درجة الحرارة)، فإن النظام يزيح موضع الاتزان في الاتجاه الذي يقلل من تأثير ذلك التغير ويعيد الاتزان.',
        formula: 'K_{eq} = \\frac{[\\text{Products}]^x}{[\\text{Reactants}]^y}'
      },
      {
        id: 'c6',
        subject: 'الكيمياء',
        category: 'الأكسدة والاختزال',
        front: 'ما هو الفرق بين عملية الأكسدة وعملية الاختزال؟',
        back: '1. الأكسدة: فقدان إلكترونات يصاحبه زيادة في عدد التأكسد (العامل المختزل هو المادة التي تتأكسد).\n2. الاختزال: اكتساب إلكترونات يصاحبه نقصان في عدد التأكسد (العامل المؤكسد هو المادة التي تُختزل).',
        formula: '\\text{OIL RIG: Oxidation Is Loss, Reduction Is Gain}'
      }
    ]
  },
  biology: {
    label: 'الأحياء والعلوم الحياتية',
    icon: '🧬',
    cards: [
      {
        id: 'b1',
        subject: 'الأحياء',
        category: 'الانقسام الخلوي',
        front: 'ما الفرق الأساسي بين الانقسام المتساوي (Mitosis) والانقسام المنصف (Meiosis)؟',
        back: '1. الانقسام المتساوي: يحدث في الخلايا الجسدية وينتج خليتين متطابقتين جينياً تحتوي كل منهما على العدد الكامل للكروموسومات (2n) لأغراض النمو والتعويض.\n2. الانقسام المنصف: يحدث في الخلايا التناسلية وينتج 4 خلايا أحادية المجموعة الكروموسومية (1n) لتكوين الجاميتات.',
        formula: '\\text{Mitosis: } 2n \\rightarrow 2 \\times 2n \\quad | \\quad \\text{Meiosis: } 2n \\rightarrow 4 \\times 1n'
      },
      {
        id: 'b2',
        subject: 'الأحياء',
        category: 'الطاقة الحيوية',
        front: 'ما هي المعادلة الإجمالية لعملية البناء الضوئي (Photosynthesis)؟',
        back: '6CO₂ + 6H₂O + طاقة ضوئية → C₆H₁₂O₆ (غلوكوز) + 6O₂\nتحدث التفاعلات الضوئية في الثايلاكويد، وحلقة كالفن في الستروما داخل البلاستيدات الخضراء.',
        formula: '6CO_2 + 6H_2O + \\text{Light} \\rightarrow C_6H_{12}O_6 + 6O_2'
      },
      {
        id: 'b3',
        subject: 'الأحياء',
        category: 'الوراثة والجينات',
        front: 'ما هو تركيب الـ DNA وقاعدة تكامل القواعد النيتروجينية (Chargaff\'s Rule)؟',
        back: 'يتكون DNA من شريطين لولبيين مزدوجين من النيوكليوتيدات. ترتبط القواعد النيتروجينية بروابط هيدروجينية:\n- الأدينين (A) يرتبط دائماً مع الثايمين (T) برابطتين هيدروجينيتين (A = T).\n- الجوانين (G) يرتبط دائماً مع السيتوسين (C) بثلاث روابط هيدروجينية (G ≡ C).',
        formula: 'A = T \\quad , \\quad G \\equiv C'
      },
      {
        id: 'b4',
        subject: 'الأحياء',
        category: 'الإنزيمات والتمثيل الغذائي',
        front: 'كيف تعمل الإنزيمات الحيوية وما أثر درجة الحرارة و pH عليها؟',
        back: 'الإنزيمات هي عوامل حفازة بروتينية تخفض طاقة التنشيط (Activation Energy) للتفاعل الحيوي. تعمل بنموذج القفل والمفتاح، ولكل إنزيم درجة حرارة و pH مثلى، وإذا تغيرت بشدة يفقد الإنزيم بنيته ثلاثية الأبعاد (Denaturation) ويتوقف عمله.',
        formula: 'E + S \\rightleftharpoons ES \\rightarrow E + P'
      }
    ]
  },
  satMath: {
    label: 'اختبارات SAT Math',
    icon: '🎯',
    cards: [
      {
        id: 's1',
        subject: 'SAT Math',
        category: 'Heart of Algebra',
        front: 'When does a system of linear equations have NO solution vs. INFINITELY many solutions?',
        back: 'Given lines: y = m₁x + b₁ and y = m₂x + b₂\n1. No Solution (Parallel): Same slope (m₁ = m₂) but different y-intercepts (b₁ ≠ b₂).\n2. Infinitely Many Solutions: Identical equations with same slope (m₁ = m₂) and same y-intercept (b₁ = b₂).\n3. Exactly One Solution: Different slopes (m₁ ≠ m₂).',
        formula: 'm_1 = m_2 \\;\\&\\; b_1 \\neq b_2 \\implies \\text{No Solution}'
      },
      {
        id: 's2',
        subject: 'SAT Math',
        category: 'Passport to Advanced Math',
        front: 'How do you find the vertex of a parabola given in standard form y = ax² + bx + c?',
        back: '1. The x-coordinate of the vertex is: h = -b / (2a)\n2. The y-coordinate is: k = f(-b / (2a))\n3. If a > 0, the parabola opens upward (minimum at vertex). If a < 0, it opens downward (maximum at vertex).',
        formula: 'x_{vertex} = -\\frac{b}{2a}'
      },
      {
        id: 's3',
        subject: 'SAT Math',
        category: 'Trigonometry Rule',
        front: 'What is the complementary angle trigonometric identity tested heavily on the SAT?',
        back: 'If two angles are complementary (sum to 90° or π/2 radians), then:\nsin(x) = cos(90° - x)\ncos(x) = sin(90° - x)\nExample: If sin(40°) = cos(k), then k = 90° - 40° = 50°.',
        formula: '\\sin(x) = \\cos(90^\\circ - x)'
      },
      {
        id: 's4',
        subject: 'SAT Math',
        category: 'Problem Solving & Data',
        front: 'What is the formula for Percentage Change (Increase or Decrease)?',
        back: 'Percentage Change = [(New Value - Old Value) / Old Value] × 100%\n- If the result is positive: Percentage Increase.\n- If negative: Percentage Decrease.\nAlways divide by the original (Old) base value!',
        formula: '\\% \\text{ Change} = \\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100\\%'
      }
    ]
  },
  satEnglish: {
    label: 'مفردات وقواعد SAT',
    icon: '📖',
    cards: [
      {
        id: 'se1',
        subject: 'SAT English',
        category: 'High-Yield Vocabulary',
        front: 'What is the precise meaning and context of the word "Pragmatic"?',
        back: 'Meaning: Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.\nSynonyms: Practical, realistic, rational, utilitarian.\nAntonyms: Idealistic, impractical, visionary.',
        formula: 'Pragmatic \\approx Practical / Realistic'
      },
      {
        id: 'se2',
        subject: 'SAT English',
        category: 'High-Yield Vocabulary',
        front: 'What does "Substantiate" mean in SAT reading and writing passages?',
        back: 'Meaning: To provide evidence to support or prove the truth of a claim or hypothesis.\nSynonyms: Verify, corroborate, validate, authenticate.\nExample: "The researcher found fossils that substantiate the evolutionary theory."',
        formula: 'Substantiate = Validate with Evidence'
      },
      {
        id: 'se3',
        subject: 'SAT English',
        category: 'Grammar & Conventions',
        front: 'What is a "Dangling Modifier" and how do you correctly fix it on the SAT?',
        back: 'A dangling modifier occurs when an introductory descriptive phrase is not immediately followed by the noun it actually modifies.\nIncorrect: "Walking through the park, the flowers bloomed." (The flowers were not walking!)\nCorrect: "Walking through the park, Sarah admired the blooming flowers."',
        formula: '[Modifier phrase], [Subject doing the action] ...'
      }
    ]
  },
  cs: {
    label: 'الحاسوب وتكنولوجيا المعلومات',
    icon: '💻',
    cards: [
      {
        id: 'cs1',
        subject: 'علوم الحاسوب',
        category: 'هياكل البيانات والخوارزميات',
        front: 'ما الفرق الأساسي بين المكدس (Stack) والطابور (Queue) في بنية البيانات؟',
        back: '1. المكدس (Stack): يعمل بمبدأ LIFO (Last In, First Out) - آخر عنصر يدخل هو أول عنصر يخرج (مثل عمليات Push و Pop).\n2. الطابور (Queue): يعمل بمبدأ FIFO (First In, First Out) - أول عنصر يدخل هو أول عنصر يخرج (مثل طابور الانتظار Enqueue و Dequeue).',
        formula: '\\text{Stack: LIFO} \\quad | \\quad \\text{Queue: FIFO}'
      },
      {
        id: 'cs2',
        subject: 'علوم الحاسوب',
        category: 'قواعد البيانات',
        front: 'ما الفرق بين المفتاح الأساسي (Primary Key) والمفتاح الأجنبي (Foreign Key) في SQL؟',
        back: '1. المفتاح الأساسي (Primary Key): عمود أو مجموعة أعمدة تميز كل صف في الجدول بشكل فريد، ولا يمكن أن يحتوي على قيم مكررة أو NULL.\n2. المفتاح الأجنبي (Foreign Key): عمود في جدول يشير إلى المفتاح الأساسي في جدول آخر لربط الجداول وضمان التكامل المرجعي (Referential Integrity).',
        formula: '\\text{FK in Table A} \\rightarrow \\text{PK in Table B}'
      },
      {
        id: 'cs3',
        subject: 'علوم الحاسوب',
        category: 'الشبكات والإنترنت',
        front: 'ما الفرق بين بروتوكول TCP وبروتوكول UDP في نقل البيانات؟',
        back: '1. بروتوكول TCP: اتصال موثوق وموجه، يضمن وصول جميع الحزم بالترتيب دون فقدان عبر المصافحة الثلاثية (مناسب للمواقع والملفات).\n2. بروتوكول UDP: اتصال سريع وغير موجه، لا يضمن إعادة إرسال الحزم المفقودة (مناسب للبث المباشر والألعاب ومكالمات الصوت).',
        formula: '\\text{TCP: Reliable & Ordered} \\quad | \\quad \\text{UDP: Fast & Low Latency}'
      }
    ]
  }
};

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'physics',
  onRewardPoints
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [cards, setCards] = useState<Flashcard[]>(PRESET_DECKS['physics'].cards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [showFinished, setShowFinished] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const validKey = PRESET_DECKS[defaultSubject] ? defaultSubject : 'physics';
    setSelectedSubject(validKey);
    setCards(PRESET_DECKS[validKey].cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setShowFinished(false);
    setSearchQuery('');
  }, [isOpen, defaultSubject]);

  const handleSelectSubject = (subjKey: string) => {
    setSelectedSubject(subjKey);
    if (PRESET_DECKS[subjKey]) {
      setCards(PRESET_DECKS[subjKey].cards);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setShowFinished(false);
    setSearchQuery('');
  };

  const currentCard = cards[currentIndex];

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const nextMastered = new Set(masteredIds).add(currentCard.id);
    setMasteredIds(nextMastered);

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowFinished(true);
      if (onRewardPoints) onRewardPoints(30);
    }
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    const nextReview = new Set(reviewIds).add(currentCard.id);
    setReviewIds(nextReview);

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowFinished(true);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleGenerateAiDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsAiLoading(true);

    try {
      const currentLabel = PRESET_DECKS[selectedSubject]?.label || selectedSubject;
      const generatedCards = await fetchGeneratedFlashcards({
        topic: customTopic.trim(),
        subject: currentLabel
      });

      if (generatedCards && generatedCards.length > 0) {
        setCards(generatedCards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setMasteredIds(new Set());
        setReviewIds(new Set());
        setShowFinished(false);
      } else {
        alert('تعذر إنشاء بطاقات بهذا الموضوع، يرجى كتابة عنوان درس دقيق ومحدد.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التواصل مع الذكاء الاصطناعي لتوليد البطاقات.');
    } finally {
      setIsAiLoading(false);
      setCustomTopic('');
    }
  };

  const restartDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setReviewIds(new Set());
    setShowFinished(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl max-w-2xl w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 text-right overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white p-3.5 sm:p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between flex-row-reverse mb-2.5 sm:mb-3 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-row-reverse min-w-0 flex-1">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 shrink-0">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg md:text-xl font-extrabold text-white flex items-center gap-1.5 truncate">
                  <span>🎴 بطاقات الاستذكار (Flashcards)</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-purple-200/80 font-medium truncate">
                  أسئلة حقيقية ومفاهيم دقيقة وقوانين علمية مؤكدة 100%
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white bg-red-500/80 hover:bg-red-600 p-2 sm:p-2.5 rounded-xl transition cursor-pointer shrink-0 border border-red-400/40 shadow"
              title="إغلاق البطاقات"
              aria-label="إغلاق البطاقات"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* DECK SELECTOR TABS */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 touch-pan-x">
            {Object.entries(PRESET_DECKS).map(([key, deck]) => (
              <button
                key={key}
                onClick={() => handleSelectSubject(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedSubject === key
                    ? 'bg-purple-600 text-white shadow-lg border border-purple-400/40'
                    : 'bg-slate-900/80 text-purple-200 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                <span>{deck.icon}</span>
                <span>{deck.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* BODY AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between space-y-4">
          {/* AI GENERATOR FORM INPUT */}
          <form onSubmit={handleGenerateAiDeck} className="flex gap-2">
            <input 
              type="text"
              placeholder="اكتب عنوان أي درس لإنشاء بطاقات مراجعة ذكية له..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isAiLoading || !customTopic.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0 shadow"
            >
              {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>توليد بالذكاء الاصطناعي 🤖</span>
            </button>
          </form>

          {/* FINISHED STATE RESULT */}
          {showFinished ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl">
                🏆
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  أحسنت يا بطل! أكملت مراجعة هذه المجموعة 🎉
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  تم حفظ تقدمك وكسبت <strong className="text-amber-500 font-bold">+30 نقطة تفوق</strong> لتعزيز رصيدك!
                </p>
              </div>

              <div className="flex justify-center gap-4 text-xs font-bold pt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>متقن: {masteredIds.size} بطاقات</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
                  <RotateCw className="w-4 h-4 text-amber-500" />
                  <span>يحتاج مراجعة: {reviewIds.size} بطاقات</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={restartDeck}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>إعادة مراجعة المجموعة</span>
                </button>
              </div>
            </div>
          ) : currentCard ? (
            <>
              {/* PROGRESS BAR & COUNTER */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25 px-3 py-1 rounded-full text-[11px] font-black">
                    {currentCard.category || 'مفهوم دراسي'}
                  </span>
                  {currentCard.subject && (
                    <span className="text-[11px] text-slate-400">
                      {currentCard.subject}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <span>البطاقة</span>
                  <span className="text-purple-600 dark:text-purple-400 font-black">{currentIndex + 1}</span>
                  <span>من</span>
                  <span>{cards.length}</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300 rounded-full" 
                  style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
              </div>

              {/* FLIP CARD CANVAS */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer group relative min-h-[250px] sm:min-h-[280px] w-full perspective-1000 my-2 select-none"
              >
                <motion.div 
                  className="w-full h-full rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 text-white shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden transition-all duration-300 hover:border-purple-400"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Card Front (Logical Question / Challenge) */}
                  {!isFlipped ? (
                    <div className="my-auto space-y-3 w-full">
                      <span className="text-[11px] text-purple-300 font-bold bg-purple-900/60 border border-purple-500/30 px-3.5 py-1 rounded-full inline-block">
                        السؤال أو المفهوم المطلوب ❓ (انقر لقلب البطاقة)
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-white leading-relaxed px-2 text-center">
                        {currentCard.front}
                      </h4>
                    </div>
                  ) : (
                    /* Card Back (Accurate Answer / Formula / Explanation) */
                    <div 
                      className="my-auto space-y-3 w-full"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-1 rounded-full inline-block">
                        الإجابة والتوضيح العلمي الدقيق ✅
                      </span>
                      <p className="text-sm sm:text-base font-bold text-slate-100 leading-relaxed whitespace-pre-line px-2 text-right">
                        {currentCard.back}
                      </p>
                      {currentCard.formula && (
                        <div className="mt-3 p-2.5 bg-slate-950/90 border border-purple-500/40 rounded-2xl text-amber-300 font-mono text-xs font-black dir-ltr inline-block shadow-inner">
                          {currentCard.formula}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5 opacity-80 pt-2 border-t border-slate-800/80 w-full">
                    <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                    <span>انقر في أي مكان داخل البطاقة للقلب بين السؤال والحل</span>
                  </div>
                </motion.div>
              </div>

              {/* CARD NAVIGATION & RATING */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleMarkReview}
                    className="px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>يحتاج مراجعة لاحقاً 🔁</span>
                  </button>

                  <button
                    onClick={handleMarkMastered}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>أتقنت المفهوم والإجابة ✅</span>
                  </button>
                </div>

                {/* Quick Prev / Next Arrows */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                  <button
                    onClick={handlePrevCard}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                  <button
                    onClick={handleNextCard}
                    disabled={currentIndex === cards.length - 1}
                    className="flex items-center gap-1 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              لا توجد بطاقات متاحة في هذه المجموعة حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
