// ══ MOCK DATA — RESEARCH CARDS & GALLERY ══
// Extracted from Home.jsx so the component stays focused on UI logic.
// Replace this with a real API/fetch layer once the backend is ready.

export const RESEARCH_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=75&fit=crop",
    tags: [{ cls: "rt-t", ar: "ذكاء اصطناعي", en: "AI" }, { cls: "rt-b", ar: "معالجة اللغة", en: "NLP" }],
    titleAr: "نظام تلقائي لكشف التشابه الدلالي في مشاريع التخرج باستخدام نماذج اللغة الكبيرة",
    titleEn: "Automated Semantic Similarity Detection in Graduation Projects Using LLMs",
    bodyAr: "يقترح هذا البحث منهجية متكاملة لمعالجة مشكلة تكرار مواضيع مشاريع التخرج، من خلال توظيف نماذج BERT العربية لتحليل التشابه الدلالي العميق.",
    bodyEn: "This research proposes a comprehensive methodology using Arabic BERT models for deep semantic similarity analysis rather than surface-level keyword matching.",
    authorAr: "سارة الأحمد", authorEn: "Sara Al-Ahmad",
    discAr: "هندسة معلوماتية", discEn: "Informatics Eng.", year: 2024,
    sim: 18, approved: true, stars: 5,
  },
  {
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=75&fit=crop",
    tags: [{ cls: "rt-a", ar: "أمن معلومات", en: "Cybersecurity" }],
    titleAr: "اكتشاف التهديدات السيبرانية في الوقت الحقيقي باستخدام التعلم العميق",
    titleEn: "Real-Time Cyber Threat Detection Using Deep Learning",
    bodyAr: "نموذج هجين يجمع LSTM وشبكات الانتباه لتصنيف حركة الشبكة وكشف الاختراقات فورياً.",
    bodyEn: "A hybrid LSTM + attention model for real-time network traffic classification and intrusion detection.",
    authorAr: "محمد العلي", authorEn: "Mohammad Al-Ali",
    discAr: "أمن معلومات", discEn: "Cybersecurity", year: 2024,
    sim: 22, approved: true, stars: 4,
  },
  {
    img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=75&fit=crop",
    tags: [{ cls: "rt-t", ar: "تعليم إلكتروني", en: "E-Learning" }],
    titleAr: "منصة تعليمية تفاعلية مدعومة بالذكاء الاصطناعي للتعلم الشخصي",
    titleEn: "AI-Powered Interactive Platform for Personalised Learning",
    bodyAr: "نظام توصية يكيّف المحتوى التعليمي حسب مستوى الطالب وأسلوب تعلمه المُستنتج تلقائياً.",
    bodyEn: "A recommendation system adapting educational content based on inferred student level and learning style.",
    authorAr: "لمى البكري", authorEn: "Lama Al-Bakri",
    discAr: "تطوير تطبيقات", discEn: "App Dev.", year: 2024,
    sim: 34, approved: false, stars: 4,
  },
  {
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75&fit=crop",
    tags: [{ cls: "rt-b", ar: "شبكات", en: "Networks" }],
    titleAr: "تحسين أداء شبكات 5G في البيئات المزدحمة باستخدام خوارزميات تكيفية",
    titleEn: "5G Performance Optimisation in Dense Environments via Adaptive Algorithms",
    bodyAr: "محاكاة وتحليل لتقنيات تخصيص الطيف الديناميكي في شبكات الجيل الخامس.",
    bodyEn: "Simulation and analysis of dynamic spectrum allocation for fifth-generation networks.",
    authorAr: "أحمد سالم", authorEn: "Ahmad Salem",
    discAr: "شبكات", discEn: "Networks", year: 2024,
    sim: 15, approved: true, stars: 4,
  },
  {
    img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=75&fit=crop",
    tags: [{ cls: "rt-a", ar: "علم البيانات", en: "Data Science" }],
    titleAr: "تحليل مشاعر التغريدات العربية باستخدام نماذج المحولات",
    titleEn: "Arabic Tweet Sentiment Analysis Using Transformer Models",
    bodyAr: "دراسة مقارنة لأداء CAMeLBERT وAraBERT في تصنيف المشاعر على مجموعة بيانات سورية.",
    bodyEn: "A comparative study of CAMeLBERT vs AraBERT on Syrian dialect sentiment classification.",
    authorAr: "نور الحسن", authorEn: "Nour Al-Hassan",
    discAr: "علم البيانات", discEn: "Data Science", year: 2024,
    sim: 20, approved: true, stars: 5,
  },
];

export const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80&fit=crop&crop=faces", tall: true },
  { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80&fit=crop", tall: false },
  { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80&fit=crop", tall: false },
];