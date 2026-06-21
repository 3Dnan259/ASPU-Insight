import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation, initReactI18next } from "react-i18next";
import i18n from "i18next";
import '../styling/Home.css'
import { RESEARCH_CARDS, GALLERY_IMAGES } from '../MokData/Data.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx'

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
          { num: "01", icon: "🤖", h: "كشف التشابه بالذكاء الاصطناعي", d: "نماذج BERT العربية تحلل محتوى كل بحث دلالياً.", tag: "NLP · BERT ↗" },
          { num: "02", icon: "🔄", h: "سير عمل المراجعة الأكاديمية", d: "من تقديم البحث إلى الموافقة — كل خطوة مرئية لكل الأطراف.", tag: "Multi-role ↗" },
          { num: "03", icon: "🗂️", h: "أرشيف بحثي منظم", d: "جميع الأبحاث قابلة للبحث والتصفية حسب التخصص والسنة.", tag: "Full-text Search ↗" },
          { num: "04", icon: "📎", h: "تدقيق المراجع IEEE", d: "نظام آلي يرصد أخطاء التوثيق قبل التسليم النهائي.", tag: "Auto-validate ↗" },
          { num: "05", icon: "📊", h: "لوحة النزاهة العلمية", d: "إحصائيات شفافة عن معدلات التشابه ونسب القبول والرفض.", tag: "Analytics ↗" },
          { num: "06", icon: "🌐", h: "ثنائي اللغة بالكامل", d: "واجهة كاملة بالعربية والإنجليزية مع دعم RTL احترافي.", tag: "AR · EN · RTL ↗" },
        ],
      },
      footer: {
        brand: "مجلة رقمية أكاديمية تسلط الضوء على أبحاث الطلبة وإنجازاتهم في جامعة الشام الخاصة.",
        cols: [
          { title: "الأبحاث", links: ["آخر الإضافات", "الأكثر تقييماً", "حسب التخصص", "الأرشيف"] },
          { title: "للطلبة",  links: ["تقديم بحث", "إرشادات النشر", "فحص التشابه"] },
          { title: "للأساتذة", links: ["لوحة المراجعة", "تقارير النزاهة", "إدارة اللجنة"] },
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
          { num: "01", icon: "🤖", h: "AI Similarity Detection", d: "Arabic BERT models semantically analyze every submitted paper.", tag: "NLP · BERT ↗" },
          { num: "02", icon: "🔄", h: "Academic Review Workflow", d: "From submission to approval — every step visible to all parties.", tag: "Multi-role ↗" },
          { num: "03", icon: "🗂️", h: "Organised Research Archive", d: "All research searchable and filterable by discipline and year.", tag: "Full-text Search ↗" },
          { num: "04", icon: "📎", h: "IEEE Reference Validation", d: "An automated system flags referencing errors before final submission.", tag: "Auto-validate ↗" },
          { num: "05", icon: "📊", h: "Integrity Dashboard", d: "Transparent statistics on similarity rates and approval ratios.", tag: "Analytics ↗" },
          { num: "06", icon: "🌐", h: "Fully Bilingual", d: "Full Arabic and English interface with professional RTL support.", tag: "AR · EN · RTL ↗" },
        ],
      },
      footer: {
        brand: "A digital academic journal spotlighting student research at Al-Sham Private University.",
        cols: [
          { title: "Research", links: ["Latest", "Top Rated", "By Discipline", "Archive"] },
          { title: "Students", links: ["Submit Paper", "Guidelines", "Similarity Check"] },
          { title: "Faculty",  links: ["Review Panel", "Integrity Reports", "Committee"] },
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
            <div
              className={`aspu-int-f ${ok ? "if-ok" : "if-wn"}`}
              style={{ width: card.sim + "%" }}
            />
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

// ══ SCROLL HIJACK — منطق مطابق 100% للـ HTML الشغال ══
function ScrollHijack({ isAr, t }) {
  const wrapRef  = useRef(null);
  const stripRef = useRef(null);

  const N   = RESEARCH_CARDS.length;
  const SPC = 420;               // مسافة سكرول ثابتة per card — نفس الـ HTML
  const TOT = SPC * (N - 1);    // إجمالي مسافة السكرول

  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const wrapper = wrapRef.current;
    const strip   = stripRef.current;
    if (!wrapper || !strip) return;

    // ← نفس الـ HTML: height = 100vh + TOT (مش 100vh × N)
    wrapper.style.height = `calc(100vh + ${TOT}px)`;

    function setSizes() {
      const w = strip.parentElement.offsetWidth;
      strip.style.width = `${N * w}px`;
      strip.querySelectorAll(".aspu-sh-slide").forEach((s) => {
        s.style.width = w + "px";
      });
    }

    setSizes();
    window.addEventListener("resize", setSizes);

    let off = 0;
    let rafId;

    function tick() {
      const rect     = wrapper.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const clamped  = Math.min(TOT, scrolled);
      const trackW   = strip.parentElement.offsetWidth;

      // ← نفس الـ HTML: target = (clamped / SPC) * trackW
      const target = (clamped / SPC) * trackW;

      // lerp ناعم
      off += (target - off) * 0.1;

      // ← RTL/LTR awareness — نفس الـ HTML
      const isRtl = document.documentElement.getAttribute("dir") === "rtl";
      strip.style.transform = `translateX(${(isRtl ? 1 : -1) * off}px)`;

      const cf     = clamped / SPC;
      const newIdx = Math.min(N - 1, Math.round(cf));
      const newPct = Math.min(1, N > 1 ? cf / (N - 1) : 0) * 100;

      setIdx(newIdx);
      setPct(newPct);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", setSizes);
      cancelAnimationFrame(rafId);
    };
  }, [N, TOT]);

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
          {/* لا dir="ltr" — الـ translateX يتحكم بالاتجاه مباشرة */}
          <div ref={stripRef} className="aspu-sh-strip">
            {RESEARCH_CARDS.map((card, i) => (
              <div key={i} className="aspu-sh-slide">
                <ResearchCard card={card} isAr={isAr} tr={tr} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="aspu-sh-foot">
          <p className="aspu-sh-hint">{tr.scrollHint}</p>
          <button
            className="aspu-btn-gold sm"
            onClick={() => { window.location.href = "/research_review"; }}
          >
            {tr.viewAll} <span className="arr">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}

// ══ MAIN COMPONENT ══
export default function ASPUInsight() {
  const [theme, setThemeState]        = useState("light");
  const [lang,  setLangState]         = useState("ar");
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [rotateIdx, setRotateIdx]     = useState(0);
  const [rotateVisible, setRotateVisible] = useState(true);

  const { t, i18n: i18nInst } = useTranslation();
  const cursorRef = useRef(null);
  const isAr = lang === "ar";

  const setTheme = useCallback((th) => {
    setThemeState(th);
    document.documentElement.setAttribute("data-theme", th);
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    i18nInst.changeLanguage(l);
    document.documentElement.setAttribute("dir",  l === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  }, [i18nInst]);

  useEffect(() => {
    setTheme("light");
    setLang("ar");
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

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

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

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
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      el.style.left = cx + "px";
      el.style.top  = cy + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

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

      {/* ══ NAVBAR (nav + fullscreen menu) ══ */}
      <Navbar
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        theme={theme} setTheme={setTheme}
        lang={lang} setLang={setLang}
        hoveredMenu={hoveredMenu} setHoveredMenu={setHoveredMenu}
        scrolled={scrolled}
        isAr={isAr}
        menuT={menuT} navT={navT}
        Logo={Logo}
      />

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
            {GALLERY_IMAGES.map((img, i) => (
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
      <Footer isAr={isAr} footer={footer} Logo={Logo} />
    </div>
  );
}