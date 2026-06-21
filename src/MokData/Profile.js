// ══ ASPU Insight — Mock Data ══

export const student = {
  nameAr: "أحمد محمد الحسن",
  nameEn: "Ahmed Mohammed Al-Hassan",
  avatarInitial: "أ",
  roleAr: "طالب دكتوراه",
  roleEn: "PhD Student",
  facultyAr: "كلية الهندسة المعلوماتية",
  facultyEn: "Faculty of IT Engineering",
  universityAr: "جامعة ASPU",
  universityEn: "ASPU University",
  memberSinceAr: "منتسب منذ 2021",
  memberSinceEn: "Member since 2021",
  email: "a.hassan@aspu.edu.sy",
};

export const stats = [
  {
    value: "12",
    labelAr: "بحث منشور",
    labelEn: "Published",
    deltaAr: "3 هذا العام",
    deltaEn: "3 this year",
  },
  {
    value: "4,821",
    labelAr: "مرة قُرئت الأبحاث",
    labelEn: "Total Reads",
    deltaAr: "+18%",
    deltaEn: "+18%",
  },
  {
    value: "37",
    labelAr: "اقتباس علمي",
    labelEn: "Citations",
    delta: null,
  },
  {
    value: "94",
    labelAr: "نقطة تقييم",
    labelEn: "Reputation Score",
    deltaAr: "مرتبة ممتاز",
    deltaEn: "Excellent rank",
  },
];

export const researchItems = [
  {
    id: 1,
    typeAr: "بحث علمي / تقني",
    typeEn: "Scientific / Technical",
    titleAr: "نموذج تنبؤي لاكتشاف الاحتيال المالي باستخدام خوارزميات التعلم العميق",
    titleEn: "Predictive Model for Financial Fraud Detection Using Deep Learning",
    dateAr: "مارس 2025",
    dateEn: "March 2025",
    reads: "1,240",
    citations: 14,
    status: "published", // "published" | "review" | "draft"
    trending: true,
  },
  {
    id: 2,
    typeAr: "رسالة دكتوراه",
    typeEn: "PhD Dissertation",
    titleAr: "تحليل الأنماط السلوكية في شبكات التواصل الاجتماعي باستخدام معالجة اللغة الطبيعية",
    titleEn: "Behavioural Pattern Analysis in Social Networks Using NLP",
    dateAr: "يناير 2025",
    dateEn: "Jan 2025",
    reads: "980",
    citations: 9,
    status: "published",
    trending: false,
  },
  {
    id: 3,
    typeAr: "بحث علمي",
    typeEn: "Scientific Paper",
    titleAr: "تحسين أداء خوارزميات التجميع في قواعد البيانات الضخمة",
    titleEn: "Optimising Clustering Algorithms in Large-Scale Databases",
    dateAr: "سبتمبر 2024",
    dateEn: "Sep 2024",
    reads: "430",
    citations: 6,
    status: "review",
    trending: false,
  },
  {
    id: 4,
    typeAr: "مشروع تخرج",
    typeEn: "Graduation Project",
    titleAr: "نظام ذكي لإدارة المختبرات الجامعية",
    titleEn: "Smart University Lab Management System",
    dateAr: "يونيو 2024",
    dateEn: "Jun 2024",
    reads: "2,171",
    citations: null,
    status: "draft",
    trending: false,
  },
];

export const academicInfo = [
  {
    labelAr: "المرحلة الدراسية",
    labelEn: "Academic Level",
    valueAr: "طالب دكتوراه — السنة الثالثة",
    valueEn: "PhD — Year 3",
    accent: true,
  },
  {
    labelAr: "التخصص",
    labelEn: "Specialisation",
    valueAr: "الذكاء الاصطناعي وعلم البيانات",
    valueEn: "AI & Data Science",
    accent: false,
  },
  {
    labelAr: "الكلية",
    labelEn: "Faculty",
    valueAr: "الهندسة المعلوماتية",
    valueEn: "IT Engineering",
    accent: false,
  },
  {
    labelAr: "المشرف الأكاديمي",
    labelEn: "Academic Supervisor",
    valueAr: "د. سامر العلي",
    valueEn: "Dr. Samer Al-Ali",
    accent: true,
  },
  {
    labelAr: "المعدل التراكمي",
    labelEn: "GPA",
    valueAr: "3.87 / 4.00",
    valueEn: "3.87 / 4.00",
    accent: false,
  },
  {
    labelAr: "اللغات",
    labelEn: "Languages",
    valueAr: "العربية، الإنجليزية، الفرنسية",
    valueEn: "Arabic, English, French",
    accent: false,
  },
];

export const level = {
  nameAr: "مستوى: باحث متقدم",
  nameEn: "Advanced Researcher",
  badge: "LV. 4",
  currentPoints: 94,
  nextLevel: 150,
  progressPercent: 63,
  milestones: [
    { labelAr: "أول نشر", labelEn: "First Publish", done: true },
    { labelAr: "5 أبحاث", labelEn: "5 Papers", done: true },
    { labelAr: "100 قراءة", labelEn: "100 Reads", done: true },
    { labelAr: "20 اقتباس", labelEn: "20 Citations", done: false },
  ],
};

export const skills = [
  "Machine Learning",
  "NLP",
  "Deep Learning",
  { ar: "أمن المعلومات", en: "InfoSec" },
  "Data Mining",
  "Python",
  "TensorFlow",
];

export const socialLinks = [
  { icon: "✉", label: "a.hassan@aspu.edu.sy", href: "#" },
  { icon: "🔬", label: "ResearchGate", href: "#" },
  { icon: "📚", label: "Google Scholar", href: "#" },
  { icon: "💼", label: "LinkedIn", href: "#" },
];

export const navLinks = [
  { nameAr: "الرئيسية", nameEn: "HOME", subAr: "استعرض", subEn: "EXPLORE", num: "01" },
  { nameAr: "الأبحاث", nameEn: "RESEARCH", subAr: "استعرض", subEn: "EXPLORE", num: "02" },
  { nameAr: "الباحثون", nameEn: "RESEARCHERS", subAr: "استعرض", subEn: "EXPLORE", num: "03" },
  { nameAr: "النزاهة", nameEn: "INTEGRITY", subAr: "استعرض", subEn: "EXPLORE", num: "04" },
  { nameAr: "تواصل معنا", nameEn: "CONTACT", subAr: "استعرض", subEn: "EXPLORE", num: "05" },
];