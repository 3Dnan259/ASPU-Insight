import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "i18next";

// ══ i18n INIT ══
const resources = {
  ar: {
    translation: {
      nav: { menu: "القائمة", close: "إغلاق" },
      menu: {
        home: "الرئيسية", research: "الأبحاث", researchers: "الباحثون",
        integrity: "النزاهة", contact: "تواصل معنا",
        explore: "استعرض", appearance: "المظهر", login: "تسجيل الدخول →",
      },
      hero: {
        badge: "العدد الأول · 2025 · جامعة الشام الخاصة",
        titleLine1: "المجلة الأكاديمية",
        titleLine2: "الرقمية",
        titleHighlight: "لأبحاث",
        rotate: ["الطلبة", "العلوم", "المستقبل", "المعرفة"],
        sub: "منصة رقمية أكاديمية تتيح نشر ومتابعة ومراجعة أبحاث الطلبة، مع نظام ذكاء اصطناعي متقدم للتحقق من الأصالة العلمية.",
        cta1: "استعرض الأبحاث", cta2: "قدّم بحثك", scroll: "مرّر",
        watermark: "بصيرة",
      },
      stats: [
        { n: 1240, s: "", l: "بحث منشور" },
        { n: 380,  s: "", l: "طالب باحث" },
        { n: 42,   s: "", l: "أستاذ محكّم" },
        { n: 96,   s: "%", l: "نزاهة علمية" },
        { n: 8,    s: "", l: "تخصصات" },
      ],
      search: {
        eyebrow: "بحث في الأرشيف الأكاديمي",
        placeholder: "ابحث عن موضوع، باحث، أو كلمة مفتاحية...",
        btn: "بحث", trendLabel: "الأكثر بحثاً:",
        chips: ["ذكاء اصطناعي", "تعلم الآلة", "أمن معلومات", "تطبيقات الويب"],
      },
      sections: [
        {
          num: "01", label: "رسالتنا",
          lines: ["المعرفة التي", "لا تُشارَك", "تبقى ناقصة."],
          accent: 1,
          body: "منصة رقمية أكاديمية تجمع أبحاث ومشاريع طلبة كلية الهندسة المعلوماتية — مكان واحد لكل ما ينتجه العقل الأكاديمي في جامعة الشام الخاصة.",
        },
        {
          num: "02", label: "الهدف",
          lines: ["بحثٌ واحد", "يُغيّر", "مساراً كاملاً."],
          accent: 2,
          body: "كل مشروع تخرج هو إضافة حقيقية للمعرفة الإنسانية. منصتنا تضمن أن لا يضيع أي جهد أكاديمي في الأدراج — بل يُرى، يُقرأ، ويُبنى عليه.",
        },
        {
          num: "03", label: "النزاهة",
          lines: ["النزاهة العلمية", "ليست", "خياراً."],
          accent: 0,
          body: "نظام ذكاء اصطناعي متقدم يحلل التشابه الدلالي لكل بحث، ويتحقق من المراجع، ويضمن أصالة كل عمل منشور على المنصة.",
        },
      ],
      research: {
        eyebrow: "أبرز الأبحاث", title: "الأبحاث المميزة هذا الفصل",
        scrollHint: "↓ مرّر للأسفل للانتقال بين الأبحاث",
        viewAll: "عرض الكل",
        simLabel: "تشابه:", approved: "✓ معتمد", pending: "⏳ مراجعة",
      },
      gallery: {
        eyebrow: "الطلبة والأبحاث",
        title: "صُمِّمت للطالب\nقبل كل شيء",
        desc: "منصة تجمع طلبة الهندسة المعلوماتية بأبحاثهم — من التقديم إلى النشر، كل خطوة واضحة ومنظمة.",
        bullets: [
          { icon: "✓", strong: "تقديم بحث بخطوات واضحة", text: "رفع الملف، البيانات، الإرسال." },
          { icon: "✓", strong: "متابعة حالة البحث لحظياً", text: "من الانتظار إلى الاعتماد." },
          { icon: "✓", strong: "تقرير النزاهة المرئي", text: "نتيجة الفحص بلمحة." },
        ],
        cta: "ابدأ الآن",
        badges: ["طلبة جامعة الشام", "أبحاث متقدمة", "مشاريع التخرج"],
      },
      features: {
        eyebrow: "مميزات المنصة", title: "منصة أكاديمية متكاملة",
        items: [
          { icon: "🧠", num: "01", h: "كشف التشابه بالذكاء الاصطناعي", d: "نماذج BERT العربية تحلل محتوى كل بحث دلالياً.", tag: "NLP · BERT ↗" },
          { icon: "📋", num: "02", h: "سير عمل المراجعة الأكاديمية", d: "من تقديم البحث إلى الموافقة — كل خطوة مرئية لكل الأطراف.", tag: "Multi-role ↗" },
          { icon: "📚", num: "03", h: "أرشيف بحثي منظم", d: "جميع الأبحاث قابلة للبحث والتصفية حسب التخصص والسنة.", tag: "Full-text Search ↗" },
          { icon: "✅", num: "04", h: "تدقيق المراجع IEEE", d: "نظام آلي يرصد أخطاء التوثيق قبل التسليم النهائي.", tag: "Auto-validate ↗" },
          { icon: "📊", num: "05", h: "لوحة النزاهة العلمية", d: "إحصائيات شفافة عن معدلات التشابه ونسب القبول والرفض.", tag: "Analytics ↗" },
          { icon: "🌐", num: "06", h: "ثنائي اللغة بالكامل", d: "واجهة كاملة بالعربية والإنجليزية مع دعم RTL احترافي.", tag: "AR · EN · RTL ↗" },
        ],
      },
      footer: {
        brand: "مجلة رقمية أكاديمية تسلط الضوء على أبحاث الطلبة وإنجازاتهم في جامعة الشام الخاصة.",
        cols: [
          { title: "الأبحاث", links: ["آخر الإضافات","الأكثر تقييماً","حسب التخصص","الأرشيف"] },
          { title: "للطلبة",  links: ["تقديم بحث","إرشادات النشر","فحص التشابه"] },
          { title: "للأساتذة",links: ["لوحة المراجعة","تقارير النزاهة","إدارة اللجنة"] },
        ],
        copy: "© 2025 ASPU Insight — جامعة الشام الخاصة",
        sub: "مشروع تخرج · 2025–2026",
      },
    },
  },
  en: {
    translation: {
      nav: { menu: "Menu", close: "Close" },
      menu: {
        home: "HOME", research: "RESEARCH", researchers: "RESEARCHERS",
        integrity: "INTEGRITY", contact: "CONTACT",
        explore: "EXPLORE", appearance: "Appearance", login: "Login →",
      },
      hero: {
        badge: "Vol. 1 · 2025 · Al-Sham Private University",
        titleLine1: "The Digital",
        titleLine2: "Academic",
        titleHighlight: "Journal for",
        rotate: ["Research", "Science", "Innovation", "Excellence"],
        sub: "A digital academic platform for publishing, tracking and peer-reviewing student research, with an advanced AI system for scientific originality verification.",
        cta1: "Browse Research", cta2: "Submit Your Paper", scroll: "Scroll",
        watermark: "Insight",
      },
      stats: [
        { n: 1240, s: "", l: "Published" },
        { n: 380,  s: "", l: "Researchers" },
        { n: 42,   s: "", l: "Reviewers" },
        { n: 96,   s: "%", l: "Integrity avg." },
        { n: 8,    s: "", l: "Disciplines" },
      ],
      search: {
        eyebrow: "Search the Academic Archive",
        placeholder: "Search by topic, researcher, or keyword...",
        btn: "Search", trendLabel: "Trending:",
        chips: ["AI", "Machine Learning", "Cybersecurity", "Web Apps"],
      },
      sections: [
        {
          num: "01", label: "Our Mission",
          lines: ["Knowledge that", "is not shared", "remains incomplete."],
          accent: 1,
          body: "A digital academic platform bringing together research and projects of the Informatics Engineering faculty — one place for everything the academic mind produces at Al-Sham Private University.",
        },
        {
          num: "02", label: "The Goal",
          lines: ["One paper", "can change", "everything."],
          accent: 2,
          body: "Every graduation project is a genuine contribution to human knowledge. Our platform ensures no academic effort is lost — it is seen, read, and built upon.",
        },
        {
          num: "03", label: "Integrity",
          lines: ["Scientific integrity", "is not", "optional."],
          accent: 0,
          body: "An advanced AI system analyzes semantic similarity for every paper, verifies references, and guarantees the originality of every published work.",
        },
      ],
      research: {
        eyebrow: "Featured Research", title: "This Semester's Highlights",
        scrollHint: "↓ Scroll down to browse papers",
        viewAll: "View All",
        simLabel: "Sim.:", approved: "✓ Approved", pending: "⏳ Pending",
      },
      gallery: {
        eyebrow: "Students & Research",
        title: "Designed for\nthe Student First",
        desc: "A platform connecting informatics students with their research — from submission to publication, every step clear and organised.",
        bullets: [
          { icon: "✓", strong: "Clear submission steps", text: "upload, metadata, submit." },
          { icon: "✓", strong: "Real-time status tracking", text: "from pending to approved." },
          { icon: "✓", strong: "Visual integrity report", text: "check result at a glance." },
        ],
        cta: "Get Started",
        badges: ["ASPU Students", "Advanced Research", "Graduation Projects"],
      },
      features: {
        eyebrow: "Platform Features", title: "A Complete Academic Platform",
        items: [
          { icon: "🧠", num: "01", h: "AI Similarity Detection", d: "Arabic BERT models semantically analyze every submitted paper.", tag: "NLP · BERT ↗" },
          { icon: "📋", num: "02", h: "Academic Review Workflow", d: "From submission to approval — every step visible to all parties.", tag: "Multi-role ↗" },
          { icon: "📚", num: "03", h: "Organised Research Archive", d: "All research searchable and filterable by discipline and year.", tag: "Full-text Search ↗" },
          { icon: "✅", num: "04", h: "IEEE Reference Validation", d: "An automated system flags referencing errors before final submission.", tag: "Auto-validate ↗" },
          { icon: "📊", num: "05", h: "Integrity Dashboard", d: "Transparent statistics on similarity rates and approval ratios.", tag: "Analytics ↗" },
          { icon: "🌐", num: "06", h: "Fully Bilingual", d: "Full Arabic and English interface with professional RTL support.", tag: "AR · EN · RTL ↗" },
        ],
      },
      footer: {
        brand: "A digital academic journal spotlighting student research at Al-Sham Private University.",
        cols: [
          { title: "Research", links: ["Latest","Top Rated","By Discipline","Archive"] },
          { title: "Students", links: ["Submit Paper","Guidelines","Similarity Check"] },
          { title: "Faculty",  links: ["Review Panel","Integrity Reports","Committee"] },
        ],
        copy: "© 2025 ASPU Insight — Al-Sham Private University",
        sub: "Graduation Project · 2025–2026",
      },
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "ar",
    fallbackLng: "ar",
    interpolation: { escapeValue: false },
  });
}

// ══ SVG LOGO ══
const Logo = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: "block" }}>
    <rect width="40" height="40" rx="8" fill="#0D0F12" />
    <circle cx="20" cy="19" r="14" fill="none" stroke="#C4A55A" strokeWidth="0.6" opacity="0.5" />
    <path d="M14,22 Q14,14 20,12 Q26,14 26,22 Q26,28 20,29 Q14,28 14,22 Z"
      fill="#141820" stroke="#C4A55A" strokeWidth="0.9" />
    <line x1="20" y1="12" x2="20" y2="29" stroke="#C4A55A" strokeWidth="1" />
    <polygon points="20,13 16.5,20 23.5,20" fill="#C4A55A" />
    <line x1="16.4" y1="20" x2="13" y2="24" stroke="#5A8FA0" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="20"   y1="20" x2="20"  y2="26" stroke="#C4A55A" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="23.6" y1="20" x2="27"  y2="24" stroke="#7A5A30" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="20" cy="13" r="1.5" fill="#E8D090" />
  </svg>
);

// ══ ANIMATED COUNTER ══
function useCounter(target, suffix, inView) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!inView || ran.current) return;
    ran.current = true;
    const dur = 1800, start = performance.now();
    const ease = (p) => 1 - Math.pow(1 - p, 3);
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);
  return val.toLocaleString() + suffix;
}

// ══ INTERSECTION HOOK ══
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ══ STAT ITEM ══
function StatItem({ stat }) {
  const [ref, inView] = useInView(0.3);
  const display = useCounter(stat.n, stat.s, inView);
  return (
    <div ref={ref} className="aspu-stat-c">
      <div className="aspu-stat-n">{display}</div>
      <div className="aspu-stat-l">{stat.l}</div>
    </div>
  );
}

// ══ REVEAL TEXT SECTION ══
function RevealSection({ sec, isAr }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className="aspu-ht-section">
      <div className={`aspu-ht-meta ${inView ? "visible" : ""}`}>
        <div className="aspu-ht-dot" />
        <span className="aspu-ht-num">{sec.num}</span>
        <div className={`aspu-ht-rule ${inView ? "visible" : ""}`} />
        <span className={`aspu-ht-tag ${inView ? "visible" : ""}`}>
          {isAr ? "استعرض" : "EXPLORE"}
        </span>
      </div>
      <div className="aspu-ht-wm">{sec.num}</div>
      <div className="aspu-ht-headline">
        {sec.lines.map((line, i) => (
          <div className="aspu-ht-lw" key={i}>
            <span
              className={`aspu-ht-line${i === sec.accent ? " accent" : ""}${inView ? " visible" : ""}`}
              style={{ transitionDelay: inView ? `${0.1 + i * 0.1}s` : "0s" }}
            >
              {line}
            </span>
          </div>
        ))}
      </div>
      <p className={`aspu-ht-body ${inView ? "visible" : ""}`}>{sec.body}</p>
    </div>
  );
}

// ══ RESEARCH CARDS DATA ══
const CARDS = [
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

// ══ SCROLL HIJACK — FIXED ══
// المبدأ:
// - الـ wrapper يأخذ height = 100vh * N (sticky height + scroll distance)
// - الـ sticky تبقى ثابتة (position:sticky top:0 height:100vh)
// - نحسب كم الـ wrapper اتسحب فوق الـ viewport (= -rect.top)
// - نحوّل هاد الـ scroll لـ translateX على الـ strip
// - الـ strip عرضها = N * trackWidth، وكل slide عرضها = trackWidth
// - RTL و LTR: الـ strip دايماً مرتبة LTR في الـ DOM
//   لأن flex يتبع الـ dir تلقائياً في RTL → الكروت بتظهر معكوسة
//   الحل: نحدد direction:ltr دايماً على الـ strip، ونبدأ من الكارد الأول ويسار
//   وبـ RTL نبدأ translate من 0 ويروح بالسالب (يسار)
//   وبـ LTR نبدأ translate من 0 ويروح بالسالب كمان (نفس الاتجاه)
function ScrollHijack({ isAr, t }) {
  const wrapRef  = useRef(null);
  const stripRef = useRef(null);
  const [idx, setIdx]     = useState(0);
  const [pct, setPct]     = useState(0);
  const N      = CARDS.length;
  const offRef = useRef(0);   // القيمة الحالية المـ lerp-ed بالـ px
  const tgtRef = useRef(0);   // القيمة المستهدفة بالـ px
  const rafRef = useRef(null);

  // ── حسابات الأبعاد ──
  const updateSizes = useCallback(() => {
    const wrapper = wrapRef.current;
    const strip   = stripRef.current;
    if (!wrapper || !strip) return;

    const vh = window.innerHeight;
    // الـ wrapper = vh * N:
    //   - أول vh للـ sticky section نفسها
    //   - (N-1) * vh مسافة إضافية للسكرول
    wrapper.style.height = `${vh * N}px`;

    const track = strip.parentElement;
    if (!track) return;
    const w = track.offsetWidth;

    // الـ strip تمتد أفقياً لعدد الكروت
    strip.style.width = `${N * w}px`;

    // كل slide يأخذ عرض الـ track بالضبط
    strip.querySelectorAll(".aspu-sh-slide").forEach((s) => {
      s.style.width = `${w}px`;
    });
  }, [N]);

  // ── RAF loop ──
  useEffect(() => {
    updateSizes();
    window.addEventListener("resize", updateSizes);

    const tick = () => {
      const wrapper = wrapRef.current;
      const strip   = stripRef.current;
      if (!wrapper || !strip) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // كم px اتسحب الـ wrapper فوق الـ viewport
      const rect     = wrapper.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);

      // أقصى مسافة سكرول = (N-1) * vh
      const maxScroll = window.innerHeight * (N - 1);
      const clamped   = Math.min(maxScroll, scrolled);

      // عرض الـ track (= عرض slide واحد)
      const trackW   = strip.parentElement?.offsetWidth || window.innerWidth;
      // القيمة المستهدفة: من 0 لـ (N-1)*trackW
      const progress = maxScroll > 0 ? clamped / maxScroll : 0;
      tgtRef.current = progress * trackW * (N - 1);

      // Lerp للـ smoothness
      offRef.current += (tgtRef.current - offRef.current) * 0.12;

      // دايماً translateX سالب — نحرك لليسار بغض النظر عن RTL/LTR
      // لأننا فرضنا direction:ltr على الـ strip
      strip.style.transform = `translateX(${-offRef.current}px)`;

      // تحديث الـ index والـ progress bar
      const newIdx = Math.min(N - 1, Math.round(progress * (N - 1)));
      setIdx(newIdx);
      setPct(Math.min(100, progress * 100));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", updateSizes);
      cancelAnimationFrame(rafRef.current);
    };
  }, [N, updateSizes]);

  const tr = t("research", { returnObjects: true });

  return (
    <div ref={wrapRef} className="aspu-sh-wrapper">
      <div className="aspu-sh-sticky">

        {/* Header */}
        <div className="aspu-sh-header">
          <div>
            <div className="aspu-sh-ey">{tr.eyebrow}</div>
            <h2 className="aspu-sh-h2">{tr.title}</h2>
          </div>
          <div className="aspu-sh-meta">
            <span className="aspu-sh-counter">{idx + 1} / {N}</span>
            <div className="aspu-sh-dots">
              {Array.from({ length: N }).map((_, i) => (
                <div key={i} className={`aspu-sh-dot${i === idx ? " on" : ""}`} />
              ))}
            </div>
            <div className="aspu-sh-pbar">
              <div className="aspu-sh-pfill" style={{ width: pct + "%" }} />
            </div>
          </div>
        </div>

        {/* Track + Strip */}
        <div className="aspu-sh-track">
          {/*
            dir="ltr" على الـ strip ضروري:
            بدونه في RTL، الـ flex يعكس ترتيب الكروت ويبدأ translateX بالاتجاه الغلط
          */}
          <div ref={stripRef} className="aspu-sh-strip" dir="ltr">
            {CARDS.map((card, i) => (
              <div key={i} className="aspu-sh-slide">
                <ResearchCard card={card} isAr={isAr} tr={tr} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="aspu-sh-foot">
          <p className="aspu-sh-hint">{tr.scrollHint}</p>
          <button className="aspu-btn-gold sm">
            {tr.viewAll} <span className="arr">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// ══ RESEARCH CARD ══
function ResearchCard({ card, isAr, tr }) {
  const ok = card.approved;
  return (
    <div className="aspu-r-card">
      <div className="aspu-r-thumb">
        <img src={card.img} alt="" loading="lazy" />
      </div>
      <div className="aspu-r-tags">
        {card.tags.map((tag, i) => (
          <span key={i} className={`aspu-rtag ${tag.cls}`}>
            {isAr ? tag.ar : tag.en}
          </span>
        ))}
      </div>
      <h3 className="aspu-r-h">{isAr ? card.titleAr : card.titleEn}</h3>
      <p className="aspu-r-body">{isAr ? card.bodyAr : card.bodyEn}</p>
      <div className="aspu-r-meta">
        <span className="aspu-r-au">{isAr ? card.authorAr : card.authorEn}</span>
        <span className="aspu-r-sep">•</span>
        <span>{isAr ? card.discAr : card.discEn}</span>
        <span className="aspu-r-sep">•</span>
        <span>{card.year}</span>
      </div>
      <div className="aspu-r-foot">
        <div className="aspu-int-w">
          <span className="aspu-int-lbl">{tr.simLabel}</span>
          <div className="aspu-int-tr">
            <div className={`aspu-int-f ${ok ? "if-ok" : "if-wn"}`}
              style={{ width: card.sim + "%" }} />
          </div>
          <span className={`aspu-int-pct ${ok ? "ip-ok" : "ip-wn"}`}>{card.sim}%</span>
          <span className={`aspu-r-badge ${ok ? "b-ok" : "b-pd"}`}>
            {ok ? tr.approved : tr.pending}
          </span>
        </div>
        <span className="aspu-r-stars">
          {"★".repeat(card.stars)}{"☆".repeat(5 - card.stars)}
        </span>
      </div>
    </div>
  );
}

// ══ MAIN COMPONENT ══
export default function ASPUInsight() {
  const [theme, setThemeState]   = useState("light");
  const [lang,  setLangState]    = useState("ar");
  const [menuOpen, setMenuOpen]  = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [rotateIdx, setRotateIdx]     = useState(0);
  const [rotateVisible, setRotateVisible] = useState(true);

  const { t, i18n: i18nInst } = useTranslation();
  const cursorRef = useRef(null);
  const isAr  = lang === "ar";

  // ── Theme ──
  const setTheme = useCallback((th) => {
    setThemeState(th);
    document.documentElement.setAttribute("data-theme", th);
  }, []);

  // ── Lang ──
  const setLang = useCallback((l) => {
    setLangState(l);
    i18nInst.changeLanguage(l);
    document.documentElement.setAttribute("dir",  l === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  }, [i18nInst]);

  // ── On mount ──
  useEffect(() => {
    setTheme("light");
    setLang("ar");
  }, []);

  // ── Scroll ──
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ── Rotating word ──
  const rotArr = t("hero.rotate", { returnObjects: true });
  useEffect(() => {
    const iv = setInterval(() => {
      setRotateVisible(false);
      setTimeout(() => {
        setRotateIdx((p) => (p + 1) % rotArr.length);
        setRotateVisible(true);
      }, 320);
    }, 2800);
    return () => clearInterval(iv);
  }, [rotArr.length]);

  // ── ESC to close menu ──
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Cursor glow ──
  useEffect(() => {
    const el = cursorRef.current;
    if (!el || window.matchMedia("(pointer:coarse)").matches) {
      if (el) el.style.display = "none";
      return;
    }
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    let raf;
    const loop = () => {
      cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
      el.style.left = cx + "px"; el.style.top = cy + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ── Body overflow ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const h        = t("hero",     { returnObjects: true });
  const stats    = t("stats",    { returnObjects: true });
  const search   = t("search",   { returnObjects: true });
  const sections = t("sections", { returnObjects: true });
  const gallery  = t("gallery",  { returnObjects: true });
  const features = t("features", { returnObjects: true });
  const footer   = t("footer",   { returnObjects: true });
  const menuT    = t("menu",     { returnObjects: true });
  const navT     = t("nav",      { returnObjects: true });

  const MENU_ITEMS = [
    { key: "home",        num: "01" },
    { key: "research",    num: "02" },
    { key: "researchers", num: "03" },
    { key: "integrity",   num: "04" },
    { key: "contact",     num: "05" },
  ];

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80&fit=crop&crop=faces", tall: true },
    { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80&fit=crop", tall: false },
    { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80&fit=crop", tall: false },
  ];

  return (
    <div
      className={`aspu-root${menuOpen ? " menu-is-open" : ""}`}
      data-theme={theme}
      data-lang={lang}
    >
      {/* Noise overlay */}
      <div className="aspu-noise" />

      {/* Cursor glow */}
      <div ref={cursorRef} className="aspu-cursor-glow" />

      {/* ══ FULLSCREEN MENU ══ */}
      <div className={`aspu-menu${menuOpen ? " open" : ""}`}>
        <div className={`aspu-menu-top${menuOpen ? " visible" : ""}`}>
          <div className="aspu-menu-logo-row">
            <Logo size={36} />
            <div>
              <div className="aspu-menu-ln">ASPU Insight</div>
              <div className="aspu-menu-ls">
                {isAr ? "المجلة الأكاديمية الرقمية" : "Digital Academic Journal"}
              </div>
            </div>
          </div>
          <button className="aspu-menu-close-btn" onClick={() => setMenuOpen(false)}>
            {navT.close}
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="aspu-menu-body">
          <div className={`aspu-menu-links${hoveredMenu !== null ? " has-hover" : ""}`}>
            {MENU_ITEMS.map((item, i) => (
              <div key={item.key} className="aspu-ml-wrap">
                <a
                  className={[
                    "aspu-menu-link",
                    menuOpen             ? "entering" : "",
                    hoveredMenu === i    ? "hov"      : "",
                    hoveredMenu !== null && hoveredMenu !== i ? "dim" : "",
                  ].filter(Boolean).join(" ")}
                  style={{ transitionDelay: menuOpen ? `${i * 0.07}s` : "0s" }}
                  href="#"
                  onMouseEnter={() => setHoveredMenu(i)}
                  onMouseLeave={() => setHoveredMenu(null)}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="aspu-ml-row">
                    <span className="aspu-ml-name">{menuT[item.key]}</span>
                    <span className="aspu-ml-num">{item.num}</span>
                  </div>
                  <span className="aspu-ml-sub">{menuT.explore}</span>
                </a>
              </div>
            ))}
          </div>

          {/* Preview panel */}
          <div className="aspu-menu-preview">
            <div className={`aspu-preview-inner${hoveredMenu !== null ? " show" : ""}`}>
              <div className="aspu-preview-ring">
                <div className="aspu-preview-ring-spin" />
                <Logo size={52} />
              </div>
              <div className="aspu-preview-divider" />
              <div className="aspu-preview-name">
                {hoveredMenu !== null ? menuT[MENU_ITEMS[hoveredMenu].key] : "ASPU"}
              </div>
              <div className="aspu-preview-tag">ASPU Insight</div>
            </div>
          </div>
        </div>

        <div className={`aspu-menu-foot${menuOpen ? " visible" : ""}`}>
          <span className="aspu-mf-label">{menuT.appearance}</span>
          <div className="aspu-menu-tpill">
            <button className={`aspu-mtp-btn${theme === "dark" ? " on" : ""}`}
              onClick={() => setTheme("dark")}>🌙</button>
            <button className={`aspu-mtp-btn${theme === "light" ? " on" : ""}`}
              onClick={() => setTheme("light")}>☀️</button>
          </div>
          <div className="aspu-menu-tpill">
            <button className={`aspu-mtp-btn${lang === "ar" ? " on" : ""}`}
              onClick={() => setLang("ar")}>ع</button>
            <button className={`aspu-mtp-btn${lang === "en" ? " on" : ""}`}
              onClick={() => setLang("en")}>EN</button>
          </div>
          <button className="aspu-menu-login-btn">{menuT.login}</button>
        </div>
      </div>

      {/* ══ NAVBAR ══ */}
      <nav className={`aspu-nav${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="aspu-nav-logo">
          <Logo size={38} />
          <div>
            <div className="aspu-logo-n">ASPU Insight</div>
            <div className="aspu-logo-s">
              {isAr ? "المجلة الأكاديمية" : "Academic Journal"}
            </div>
          </div>
        </a>
        <div className="aspu-nav-space" />
        <button
          className={`aspu-nav-menu-btn${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen(true)}
        >
          <span className="aspu-nmb-label">{navT.menu}</span>
          <div className="aspu-nmb-lines">
            <div className="aspu-nmb-line l1" />
            <div className="aspu-nmb-line l2" />
            <div className="aspu-nmb-line l3" />
          </div>
        </button>
      </nav>

      {/* ══ HERO ══ */}
      <section className="aspu-hero">
        <div className="aspu-hero-grid" />
        <div className="aspu-orb o1" />
        <div className="aspu-orb o2" />
        <div className={`aspu-hero-wm${!isAr ? " en" : ""}`}>{h.watermark}</div>

        <div className="aspu-hero-inner">
          <div className="aspu-issue-badge">
            <span className="aspu-badge-dot" />
            {h.badge}
          </div>

          <h1 className="aspu-hero-title">
            {h.titleLine1}<br />
            {h.titleLine2}{" "}
            <span className="ht-gold">{h.titleHighlight}</span><br />
            <span className={`aspu-ht-rotate${!rotateVisible ? " hide" : ""}`}>
              {rotArr[rotateIdx]}
            </span>
          </h1>

          <p className="aspu-hero-sub">{h.sub}</p>

          <div className="aspu-hero-btns">
            <button className="aspu-btn-gold">
              {h.cta1} <span className="arr">→</span>
            </button>
            <button className="aspu-btn-outline">{h.cta2}</button>
          </div>
        </div>

        <div className="aspu-scroll-hint">
          <span>{h.scroll}</span>
          <div className="aspu-scroll-line" />
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="aspu-stats-bar">
        {stats.map((s, i) => <StatItem key={i} stat={s} />)}
      </div>

      {/* ══ SEARCH ══ */}
      <div className="aspu-search-zone">
        <div className="aspu-s-wrap">
          <p className="aspu-s-ey">{search.eyebrow}</p>
          <div className="aspu-s-box">
            <span className="aspu-s-ico">⌕</span>
            <input
              className="aspu-s-inp"
              type="text"
              placeholder={search.placeholder}
            />
            <button className="aspu-s-btn">{search.btn}</button>
          </div>
          <div className="aspu-s-chips">
            <span className="aspu-s-clbl">{search.trendLabel}</span>
            {search.chips.map((c, i) => (
              <span key={i} className="aspu-s-chip">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CINEMATIC TEXT SECTIONS ══ */}
      <div className="aspu-herotext-wrap">
        {sections.map((sec, i) => (
          <div key={i}>
            <RevealSection sec={sec} isAr={isAr} />
            {i < sections.length - 1 && <div className="aspu-ht-sep" />}
          </div>
        ))}
      </div>

      {/* ══ SCROLL HIJACK RESEARCH ══ */}
      <ScrollHijack isAr={isAr} t={t} />

      {/* ══ GALLERY ══ */}
      <div className="aspu-gallery-sec">
        <div className="aspu-gallery-inner">
          <div className="aspu-gallery-text">
            <div className="aspu-sec-ey">{gallery.eyebrow}</div>
            <h2>
              {gallery.title.split("\n").map((l, i) => (
                <span key={i}>{l}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p>{gallery.desc}</p>
            <div className="aspu-gallery-bullets">
              {gallery.bullets.map((b, i) => (
                <div key={i} className="aspu-gb-item">
                  <div className="aspu-gb-dot">{b.icon}</div>
                  <p><strong>{b.strong}</strong> — {b.text}</p>
                </div>
              ))}
            </div>
            <button className="aspu-btn-gold">
              {gallery.cta} <span className="arr">→</span>
            </button>
          </div>
          <div className="aspu-gallery-grid">
            {galleryImages.map((img, i) => (
              <div key={i} className={`aspu-gallery-img${img.tall ? " tall" : ""}`}>
                <img src={img.src} alt="" loading="lazy" />
                <div className="aspu-gimg-badge">{gallery.badges[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <div className="aspu-feat-sec">
        <div className="aspu-feat-inner">
          <div className="aspu-feat-header">
            <div className="aspu-feat-ey">{features.eyebrow}</div>
            <h2 className="aspu-feat-title">{features.title}</h2>
          </div>
          <div className="aspu-feat-grid">
            {features.items.map((f, i) => (
              <div key={i} className="aspu-feat-card">
                <div className="aspu-feat-ico">{f.icon}</div>
                <div className="aspu-feat-num">{f.num}</div>
                <div className="aspu-feat-h">{f.h}</div>
                <div className="aspu-feat-d">{f.d}</div>
                <span className="aspu-feat-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="aspu-footer">
        <div className="aspu-ft-grid">
          <div className="aspu-ft-brand">
            <div className="aspu-ft-brand-logo">
              <Logo size={36} />
              <div>
                <div className="aspu-logo-n">ASPU Insight</div>
                <div className="aspu-logo-s">
                  {isAr ? "المجلة الأكاديمية الرقمية" : "Digital Academic Journal"}
                </div>
              </div>
            </div>
            <p>{footer.brand}</p>
          </div>
          {footer.cols.map((col, i) => (
            <div key={i} className="aspu-ft-col">
              <h5>{col.title}</h5>
              <ul>
                {col.links.map((link, j) => (
                  <li key={j}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="aspu-ft-btm">
          <span>{footer.copy}</span>
          <span>{footer.sub}</span>
        </div>
      </footer>
    </div>
  );
}