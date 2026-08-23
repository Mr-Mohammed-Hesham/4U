export type Language = 'ar' | 'en';

export const COUNTRY_NAMES_EN: Record<string, string> = {
  UAE: 'United Arab Emirates',
  Saudi: 'Kingdom of Saudi Arabia',
  Kuwait: 'State of Kuwait',
  Egypt: 'Arab Republic of Egypt',
  Oman: 'Sultanate of Oman',
  Qatar: 'State of Qatar',
  Bahrain: 'Kingdom of Bahrain',
};

export const getEnglishCountryName = (countryKey: string): string => {
  return COUNTRY_NAMES_EN[countryKey] || countryKey;
};

export const getEnglishSubjectName = (subjectName: string, subjectId?: string): string => {
  if (!subjectName) return '';
  const id = subjectId?.toLowerCase() || '';
  if (id.includes('math') || subjectName.includes('رياضيات')) return 'Mathematics';
  if (id.includes('phy') || subjectName.includes('فيزياء')) return 'Physics';
  if (id.includes('chem') || subjectName.includes('كيمياء')) return 'Chemistry';
  if (id.includes('bio') || subjectName.includes('أحياء') || subjectName.includes('احياء')) return 'Biology';
  if (id.includes('comp') || subjectName.includes('حاسوب') || subjectName.includes('برمجة')) return 'Computer Science';
  if (id.includes('eng') || subjectName.includes('إنجليزية') || subjectName.includes('انجليزية')) return 'English';
  if (id.includes('arb') || subjectName.includes('عربية') || subjectName.includes('لغة عربية')) return 'Arabic';
  if (id.includes('islam') || subjectName.includes('إسلامية') || subjectName.includes('تربية إسلامية')) return 'Islamic Studies';
  if (id.includes('social') || subjectName.includes('اجتماعيات') || subjectName.includes('دراسات اجتماعية')) return 'Social Studies';
  if (id.includes('geom') || subjectName.includes('هندسة')) return 'Geometry';
  if (id.includes('sci') || subjectName.includes('علوم')) return 'General Science';
  return subjectName;
};

export const getEnglishGradeName = (gradeName: string, gradeId?: number): string => {
  if (!gradeName) return '';
  if (gradeId) return `Grade ${gradeId}`;
  if (gradeName.includes('خامس') || gradeName.includes('5')) return 'Grade 5';
  if (gradeName.includes('سابع') || gradeName.includes('7')) return 'Grade 7';
  if (gradeName.includes('ثامن') || gradeName.includes('8')) return 'Grade 8';
  if (gradeName.includes('تاسع') || gradeName.includes('9')) return 'Grade 9';
  if (gradeName.includes('عاشر') || gradeName.includes('10')) return 'Grade 10';
  if (gradeName.includes('حادي') || gradeName.includes('11')) return 'Grade 11';
  if (gradeName.includes('ثاني') || gradeName.includes('12')) return 'Grade 12';
  return gradeName;
};

export const getEnglishTermName = (termName: string, termId?: number): string => {
  if (termId) return `Term ${termId}`;
  if (termName.includes('أول') || termName.includes('1')) return 'Term 1 (First Term)';
  if (termName.includes('ثاني') || termName.includes('2')) return 'Term 2 (Second Term)';
  if (termName.includes('ثالث') || termName.includes('3')) return 'Term 3 (Third Term)';
  return termName;
};

export const getEnglishStreamName = (streamName: string, streamId?: string): string => {
  if (streamId === 'advanced' || streamName.includes('متقدم')) return 'Advanced Stream';
  if (streamId === 'general' || streamName.includes('عام')) return 'General Stream';
  if (streamId === 'elite' || streamName.includes('نخبة')) return 'Elite Stream';
  return streamName;
};

export const getEnglishProgramName = (programName: string, programId?: string): string => {
  if (programId === 'inspire' || programName.includes('Inspire') || programName.includes('أمريكي')) return 'American Inspire Science & Math';
  if (programId === 'ministry' || programName.includes('وزاري')) return 'National Curriculum';
  return programName;
};

// UI Translations Dictionary
export const UI_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // Top Header & Branding
  platformTitle: { ar: 'المنصة التعليمية المتكاملة 4U', en: '4U Integrated Educational Platform' },
  platformSubtitle: { ar: 'منهج متكامل • تفاعلي • احترافي', en: 'Comprehensive • Interactive • Smart Curriculum' },
  searchPlaceholder: { ar: 'ابحث عن درس، وحدة أو موضوع...', en: 'Search for a lesson, unit or topic...' },
  voiceSearch: { ar: 'البحث الصوتي (Web Speech API)', en: 'Voice Search' },
  back: { ar: 'رجوع', en: 'Back' },
  favorites: { ar: 'المفضلة', en: 'Favorites' },
  studentDashboard: { ar: 'لوحة تحكم الطالب 🎓', en: 'Student Dashboard 🎓' },
  share: { ar: 'مشاركة', en: 'Share' },
  quranRadio: { ar: 'إذاعة القرآن', en: 'Quran Radio' },
  communityChat: { ar: 'شات الطلاب والمعلمين', en: 'Community Chat' },
  examCodes: { ar: 'رموز الاختبارات', en: 'Exam Codes' },
  mistakesLog: { ar: 'سجل أخطائي', en: 'Mistakes Log' },
  scientificCalc: { ar: 'آلة حاسبة', en: 'Scientific Calc' },
  myNotes: { ar: 'ملخصاتي', en: 'My Notes' },
  studyPlanner: { ar: 'الجدول', en: 'Study Planner' },
  subscribers: { ar: 'المشتركون', en: 'Subscribers' },
  signIn: { ar: 'تسجيل الدخول', en: 'Sign In' },
  signOut: { ar: 'تسجيل الخروج', en: 'Sign Out' },
  guest: { ar: 'زائر', en: 'Guest' },
  adminBadge: { ar: 'أدمن', en: 'Admin' },
  home: { ar: 'الرئيسية', en: 'Home' },
  
  // Section Switcher Tabs
  curriculumSection: { ar: 'قسم المناهج والدروس', en: 'Curriculum & Lessons' },
  eotSection: { ar: 'قسم الهياكل (EOT)', en: 'EOT Specs' },
  satSection: { ar: 'قسم اختبـارات السات (SAT)', en: 'SAT Exams' },
  igSection: { ar: 'اختبارات IG', en: 'IG Exams' },
  msSection: { ar: 'اختبارات مايكروسوفت (MS Exams)', en: 'MS Office Exams' },

  // Home Hero & Selection
  quoteOfTheDay: { ar: 'حكمة اليوم', en: 'Quote of the Day' },
  changeQuote: { ar: 'تغيير الحكمة', en: 'Change Quote' },
  welcomeHeroTitle: { ar: 'مرحباً بك في مكتبة المناهج التفاعلية 4U', en: 'Welcome to 4U Interactive Curriculum Library' },
  welcomeHeroSubtitle: { ar: 'اختر بلدك للبدء في تصفح المناهج والخطط الدراسية المناسبة لك', en: 'Choose your country to browse interactive curricula & lesson plans' },
  heroBadgeGulf: { ar: '🌍 مناهج الخليج ومصر', en: '🌍 Gulf & Egypt Curricula' },
  heroBadgeFast: { ar: '⚡ تصفح سريع وفوري', en: '⚡ Instant Fast Browsing' },
  heroBadgeAll: { ar: '📚 جميع المواد الدراسية', en: '📚 All Academic Subjects' },
  chooseCountry: { ar: 'اختر الدولة والمنهج الدراسي', en: 'Select Country & Curriculum' },
  availableNow: { ar: '✅ متاح حالياً', en: '✅ Available Now' },
  comingSoon: { ar: '🚧 قريباً', en: '🚧 Coming Soon' },
  
  // Navigation Levels
  welcomeToCountry: { ar: 'مرحباً بك في قسم', en: 'Welcome to' },
  selectTerm: { ar: 'اختر الفصل الدراسي للبدء بالتصفح', en: 'Select Academic Term to start browsing' },
  selectStream: { ar: 'اختر المسار الأكاديمي المناسب لك', en: 'Select Your Academic Stream' },
  selectProgram: { ar: 'اختر المنهاج والبرنامج التعليمي', en: 'Select Curriculum Program' },
  selectGrade: { ar: 'اختر الصف الدراسي المناسب', en: 'Select Academic Grade' },
  selectSubject: { ar: 'اختر المادة العلمية', en: 'Select Academic Subject' },
  
  // Units & Lessons
  curriculumUnits: { ar: 'الوحدات الدراسية', en: 'Curriculum Units' },
  studentBook: { ar: 'كتاب الطالب المنهجي (PDF)', en: 'Student Textbook (PDF)' },
  browseLessons: { ar: 'استعراض الدروس', en: 'Browse Lessons' },
  lessonsCountLabel: { ar: 'دروس', en: 'lessons' },
  progressLabel: { ar: 'انجاز', en: 'Progress' },
  completedLabel: { ar: '✓ مكتمل', en: '✓ Completed' },
  contentUnderPrep: { ar: 'المحتوى قيد التحضير', en: 'Content Under Preparation' },
  underPrepDesc: { ar: 'سيتم توفير الوحدات والدروس الخاصة بهذا الاختيار قريباً جداً.', en: 'Units and lessons for this selection will be available soon.' },
  
  lessonsAndTopics: { ar: 'الدروس والاجزاء العلمية', en: 'Lessons & Topics' },
  lessonIntro: { ar: 'مقدمة الدرس', en: 'Lesson Overview' },
  lessonBreakdown: { ar: 'المحتوى والتبسيط والتحليل', en: 'Content & In-Depth Analysis' },
  openLessonExplanation: { ar: 'افتح شرح الدرس', en: 'Open Lesson Explanation' },
  watchVideo: { ar: 'شاهد فيديو الشرح', en: 'Watch Video Explanation' },
  takeQuiz: { ar: 'ابدأ اختبار الحصة', en: 'Take Quiz' },
  studyCards: { ar: 'بطاقات المذاكرة (Flashcards)', en: 'Flashcards & Concepts' },
  
  // Lesson Viewer & Interactive Tools
  interactiveLesson: { ar: 'شرح الدرس التفاعلي', en: 'Interactive Lesson Explanation' },
  listenAudio: { ar: 'استمع للشرح صوتياً', en: 'Listen to Explanation' },
  pauseAudio: { ar: 'إيقاف مؤقت', en: 'Pause' },
  resumeAudio: { ar: 'استئناف القراءة', en: 'Resume' },
  stopAudio: { ar: 'إيقاف الصوت', en: 'Stop Audio' },
  aiSummarize: { ar: 'ملخص الذكاء الاصطناعي', en: 'AI Summary' },
  aiTutor: { ar: 'المساعد والمعلم الذكي', en: 'AI Smart Tutor' },
  comprehensionQuiz: { ar: 'اختبار تقييم الفهم', en: 'Comprehension Quiz' },
  fontSize: { ar: 'حجم الخط', en: 'Font Size' },
  printLesson: { ar: 'طباعة الدرس', en: 'Print Lesson' },
  copyLesson: { ar: 'نسخ الشرح', en: 'Copy Lesson Text' },
  copiedSuccess: { ar: 'تم النسخ بنجاح ✓', en: 'Copied Successfully ✓' },
  addToFavorites: { ar: 'إضافة للمفضلة', en: 'Add to Favorites' },
  removeFromFavorites: { ar: 'إزالة من المفضلة', en: 'Remove from Favorites' },

  // Search Results
  searchResultsTitle: { ar: 'نتائج البحث عن:', en: 'Search Results for:' },
  matchesFound: { ar: 'تطابق في كافة المناهج والمواد', en: 'matches found across all curricula' },
  noResults: { ar: 'لا توجد نتائج مطابقة', en: 'No matching results found' },
  searchHint: { ar: 'جرب البحث بكلمات مختلفة مثل: رياضيات، فيزياء، تفاضل، متجهات...', en: 'Try searching with keywords like Math, Physics, Vectors, Calculus...' },

  // Streak & Attendance
  streakDays: { ar: 'أيام متتالية', en: 'Days Streak' },
  streakMessageDefault: { ar: 'واصل رحلتك التعليمية يومياً لتحقيق أعلى معدل إنجاز!', en: 'Keep up your daily study streak to achieve your academic goals!' },
  attendanceRecorded: { ar: 'تم تسجيل حضورك اليوم بنجاح ✓', en: 'Daily attendance recorded successfully ✓' },
  attendancePoints: { ar: 'نقاط الحضور والنشاط', en: 'Attendance & Activity Points' },

  // Footer & Credits
  footerCopyright: { ar: 'جميع الحقوق محفوظة للمنصة التعليمية المتكاملة 4U', en: 'All rights reserved to 4U Integrated Educational Platform' },
  footerSupervisor: { ar: 'إشراف وتطوير: م. محمد هشام', en: 'Supervised & Developed by: Eng. Mohamed Hesham' }
};

export const getTranslation = (key: string, lang: Language): string => {
  if (UI_TRANSLATIONS[key]) {
    return UI_TRANSLATIONS[key][lang] || UI_TRANSLATIONS[key].ar;
  }
  return key;
};
