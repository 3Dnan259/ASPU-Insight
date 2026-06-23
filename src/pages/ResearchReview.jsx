import { useState, useEffect, useRef, useCallback } from "react";
import {
  apiReaderPeople,
  apiPapers,
  apiTypeMeta,
  apiPubMeta,
  apiPageStats,
  apiFilterCounts,
}from "../MokData/Research_review";
import "../styling/ResearchReview.css";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Logo from "../components/Logo"
import { Ara, Eng } from '../i18n';
// ─── Mapping from API data to component state ─────────────────────────────────
// لما تبدل بالـ API، بس غير المتغيرات هون
const READER_PEOPLE = apiReaderPeople;
const PAPERS = apiPapers;
const TYPE_META = apiTypeMeta;
const PUB_META = apiPubMeta;
const PAGE_STATS = apiPageStats;
const FILTER_COUNTS = apiFilterCounts;
// ─────────────────────────────────────────────────────────────────────────────


// ─── Helpers ────────────────────────────────────────────────────────────────
function stars(n) {
  const full = Math.round(n);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

// ─── Popup Component ────────────────────────────────────────────────────────
function ReadersPopup({ paper, readerType, lang, onClose }) {
  const isEn = lang === "en";

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!paper) return null;

  const tot = paper.readersDoctors + paper.readersStudents + paper.readersAgency;
  const dP = Math.round((paper.readersDoctors / tot) * 100);
  const sP = Math.round((paper.readersStudents / tot) * 100);
  const aP = 100 - dP - sP;

  const title = isEn
    ? paper.titleEn.length > 60 ? paper.titleEn.slice(0, 60) + "…" : paper.titleEn
    : paper.titleAr.length > 40 ? paper.titleAr.slice(0, 40) + "…" : paper.titleAr;

  const lbl = {
    doctors: { ar: "الأساتذة القراء", en: "Doctor Readers" },
    students: { ar: "الطلبة القراء", en: "Student Readers" },
    agencies: { ar: "الجهات العلمية", en: "Scientific Agencies" },
    all: { ar: "جميع القراء", en: "All Readers" },
  };

  const renderPeople = (list, avCls, limit = 5) =>
    list.slice(0, limit).map((x, i) => (
      <div className="person-row" key={i}>
        <div className={`person-avatar ${avCls}`}>
          {(isEn ? x.nameEn : x.nameAr).charAt(0)}
        </div>
        <div className="person-info">
          <div className="person-name">{isEn ? x.nameEn : x.nameAr}</div>
          <div className="person-role">{isEn ? x.roleEn : x.roleAr}</div>
        </div>
        <div className="person-date">{x.date}</div>
      </div>
    ));

  const showD = readerType === "all" || readerType === "doctors";
  const showS = readerType === "all" || readerType === "students";
  const showA = readerType === "all" || readerType === "agencies";

  return (
    <div className="popup-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="popup-box">
        <div className="popup-header">
          <div>
            <div className="popup-title">{title}</div>
            <div className="popup-sub">{isEn ? lbl[readerType].en : lbl[readerType].ar}</div>
          </div>
          <button className="popup-close" onClick={onClose}>✕</button>
        </div>
        <div className="popup-body">
          {/* Summary cards */}
          <div className="popup-summary">
            <div className="ps-card ps-doctor">
              <div className="ps-card-n">{paper.readersDoctors.toLocaleString()}</div>
              <div className="ps-card-l">{isEn ? "Doctors" : "أساتذة"}</div>
            </div>
            <div className="ps-card ps-student">
              <div className="ps-card-n">{paper.readersStudents.toLocaleString()}</div>
              <div className="ps-card-l">{isEn ? "Students" : "طلبة"}</div>
            </div>
            <div className="ps-card ps-agency">
              <div className="ps-card-n">{paper.readersAgency.toLocaleString()}</div>
              <div className="ps-card-l">{isEn ? "Agencies" : "جهات"}</div>
            </div>
          </div>

          {/* Distribution bar */}
          <div>
            <div className="popup-bar-label">{isEn ? "Reader Distribution" : "نسبة توزيع القراء"}</div>
            <div className="popup-bar">
              <div className="pb-seg" style={{ width: `${dP}%`, background: "#5A8FA0" }} />
              <div className="pb-seg" style={{ width: `${sP}%`, background: "#C4A55A" }} />
              <div className="pb-seg" style={{ width: `${aP}%`, background: "#6DCFAD" }} />
            </div>
            <div className="popup-bar-legend">
              <div className="pbl-item"><div className="pbl-dot" style={{ background: "#5A8FA0" }} /><span>{isEn ? `Doctors ${dP}%` : `أساتذة ${dP}%`}</span></div>
              <div className="pbl-item"><div className="pbl-dot" style={{ background: "#C4A55A" }} /><span>{isEn ? `Students ${sP}%` : `طلبة ${sP}%`}</span></div>
              <div className="pbl-item"><div className="pbl-dot" style={{ background: "#6DCFAD" }} /><span>{isEn ? `Agencies ${aP}%` : `جهات ${aP}%`}</span></div>
            </div>
          </div>

          {/* People lists */}
          {showD && (
            <div>
              <div className="popup-section-title">{isEn ? "Faculty Readers" : "الأساتذة القراء"}</div>
              <div className="person-list">{renderPeople(READER_PEOPLE.doctors, "pa-doctor")}</div>
            </div>
          )}
          {showS && (
            <div>
              <div className="popup-section-title">{isEn ? "Student Readers" : "الطلبة القراء"}</div>
              <div className="person-list">{renderPeople(READER_PEOPLE.students, "pa-student")}</div>
            </div>
          )}
          {showA && (
            <div>
              <div className="popup-section-title">{isEn ? "Scientific Agencies" : "الجهات العلمية"}</div>
              <div className="person-list">{renderPeople(READER_PEOPLE.agencies, "pa-agency", 99)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Paper Card ─────────────────────────────────────────────────────────────
function PaperCard({ paper, lang, onOpenPopup }) {
  const isEn = lang === "en";
  const tm = TYPE_META[paper.type] || TYPE_META.scientific;
  const pm = PUB_META[paper.pub];
  const tot = paper.readersDoctors + paper.readersStudents + paper.readersAgency;
  const dP = Math.round((paper.readersDoctors / tot) * 100);
  const sP = Math.round((paper.readersStudents / tot) * 100);
  const aP = 100 - dP - sP;

  return (
    <div className="rc-paper">
      {/* Top row: badges + year */}
      <div className="rcp-top">
        <div className="rcp-tags">
          <span className={`type-badge ${tm.cls}`}>{isEn ? tm.en : tm.ar}</span>
          <span className="author-badge">
            <span className={`ab-dot ${pm.dotCls}`} />
            {isEn ? pm.en : pm.ar}
          </span>
        </div>
        <span style={{ fontSize: 11, color: "var(--tx3)", flexShrink: 0 }}>{paper.year}</span>
      </div>

      {/* Title */}
      <h3 className="rcp-title">{isEn ? paper.titleEn : paper.titleAr}</h3>

      {/* Excerpt */}
      <p className="rcp-excerpt">{isEn ? paper.excerptEn : paper.excerptAr}</p>

      {/* Meta */}
      <div className="rcp-meta">
        <span className="rcp-author">{isEn ? paper.authorEn : paper.authorAr}</span>
        <span className="rcp-sep">•</span>
        <span>{isEn ? "Informatics Eng." : "هندسة معلوماتية"}</span>
        <span className="rcp-sep">•</span>
        <span>ASPU</span>
      </div>

      {/* Stats row */}
      <div className="rcp-stats">
        {/* Rating */}
        <div className="rcp-stat">
          <span className="rcp-stat-label">{isEn ? "Rating" : "التقييم"}</span>
          <div className="rating-display">
            <span className="rating-num">{paper.rating.toFixed(1)}</span>
            <div>
              <div className="stars-display" style={{ color: "var(--ac)", fontSize: 14 }}>{stars(paper.rating)}</div>
              <div className="rating-count">({paper.ratingCount} {isEn ? "ratings" : "تقييم"})</div>
            </div>
          </div>
        </div>

        {/* Total Readers */}
        <div className="rcp-stat">
          <span className="rcp-stat-label">{isEn ? "Total Readers" : "إجمالي القراء"}</span>
          <div
            className="rcp-stat-value"
            style={{ cursor: "pointer" }}
            onClick={() => onOpenPopup(paper.id, "all")}
            title={isEn ? "Click to see all readers" : "اضغط لرؤية جميع القراء"}
          >
            {paper.readers.toLocaleString()}
          </div>
          <div className="readers-bar">
            <div className="rb-seg" style={{ width: `${dP}%`, background: "#5A8FA0" }} />
            <div className="rb-seg" style={{ width: `${sP}%`, background: "#C4A55A" }} />
            <div className="rb-seg" style={{ width: `${aP}%`, background: "#6DCFAD" }} />
          </div>
        </div>

        {/* Reader Breakdown */}
        <div className="rcp-stat">
          <span className="rcp-stat-label">{isEn ? "Reader Breakdown" : "توزيع القراء"}</span>
          <div className="readers-breakdown">
            <span className="reader-chip rc-doctor" onClick={() => onOpenPopup(paper.id, "doctors")}>
              🎓 {isEn ? "Doctors" : "أساتذة"} <strong>{paper.readersDoctors.toLocaleString()}</strong>
            </span>
            <span className="reader-chip rc-student" onClick={() => onOpenPopup(paper.id, "students")}>
              📚 {isEn ? "Students" : "طلبة"} <strong>{paper.readersStudents.toLocaleString()}</strong>
            </span>
            <span className="reader-chip rc-agency" onClick={() => onOpenPopup(paper.id, "agencies")}>
              🏛️ {isEn ? "Agencies" : "جهات"} <strong>{paper.readersAgency.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ResearchReview() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("list");

  // Filters
  const [search, setSearch] = useState("");
  const [pubFilter, setPubFilter] = useState({ student: true, professor: true });
  const [typeFilter, setTypeFilter] = useState({ scientific: true, srs: true, master: true, phd: true });
  const [discFilter, setDiscFilter] = useState({ ai: true, sec: true, app: true, data: true, net: true, se: true });
  const [minRating, setMinRating] = useState(0);
  const [minReaders, setMinReaders] = useState(0);
  const [sortBy, setSortBy] = useState("rating");

  // Popup
  const [popup, setPopup] = useState(null); // { paperId, readerType }

  const isEn = lang === "en";
  const isAr = lang === "ar";

  // ── Scroll listener ──
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Theme / lang on <html> ──
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // ── Body overflow when menu / popup open ──
  useEffect(() => {
    document.body.style.overflow = (menuOpen || popup) ? "hidden" : "";
  }, [menuOpen, popup]);

  // ── Cursor glow ──
  const cgRef = useRef(null);
  useEffect(() => {
    const el = cgRef.current;
    if (!el || window.matchMedia("(pointer:coarse)").matches) {
      if (el) el.style.display = "none";
      return;
    }
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", move, { passive: true });
    let raf;
    const loop = () => {
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  // ── Filtered + sorted papers ──
  const filtered = PAPERS.filter((p) => {
    if (!pubFilter[p.pub]) return false;
    if (!typeFilter[p.type]) return false;
    if (!discFilter[p.disc]) return false;
    if (p.rating < minRating) return false;
    if (p.readers < minReaders) return false;
    if (search) {
      const hay = (p.titleAr + p.titleEn + p.authorAr + p.authorEn).toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "readers") return b.readers - a.readers;
    if (sortBy === "newest") return b.year - a.year;
    return (isEn ? a.titleEn : a.titleAr).localeCompare(isEn ? b.titleEn : b.titleAr);
  });

  const popupPaper = popup ? PAPERS.find((p) => p.id === popup.paperId) : null;

  // ── Range slider style ──
  const rangeStyle = {
    background: `linear-gradient(to right, var(--ac) ${(minReaders / 1000) * 100}%, var(--bd2) ${(minReaders / 1000) * 100}%)`,
  };

  const togglePub = (k) => setPubFilter((p) => ({ ...p, [k]: !p[k] }));
  const toggleType = (k) => setTypeFilter((p) => ({ ...p, [k]: !p[k] }));
  const toggleDisc = (k) => setDiscFilter((p) => ({ ...p, [k]: !p[k] }));

  const resetFilters = () => {
    setSearch("");
    setPubFilter({ student: true, professor: true });
    setTypeFilter({ scientific: true, srs: true, master: true, phd: true });
    setDiscFilter({ ai: true, sec: true, app: true, data: true, net: true, se: true });
    setMinRating(0);
    setMinReaders(0);
  };

  // ── Shared Navbar/Footer text — نفس الـ keys اللي Navbar.jsx و Footer.jsx متوقعينها ──
  const navT = {
    menu: isAr ? "القائمة" : "Menu",
    close: isAr ? "إغلاق" : "Close",
  };

  const menuT = {
    home: isAr ? "الرئيسية" : "HOME",
    research: isAr ? "الأبحاث" : "RESEARCH",
    researchers: isAr ? "الباحثون" : "RESEARCHERS",
    integrity: isAr ? "النزاهة" : "INTEGRITY",
    contact: isAr ? "تواصل معنا" : "CONTACT",
    Profile: isAr ? "الملف الشخصي" : "PROFILE",
    explore: isAr ? "استعرض" : "EXPLORE",
    appearance: isAr ? "المظهر" : "Appearance",
    login: isAr ? "تسجيل الدخول →" : "Login →",
  };

  const footer = {
    brand: isAr
      ? "مجلة رقمية أكاديمية تسلط الضوء على أبحاث الطلبة وإنجازاتهم في جامعة الشام الخاصة."
      : "A digital academic journal spotlighting student research at Al-Sham Private University.",
    cols: isAr
      ? [
          { title: "الأبحاث", links: ["آخر الإضافات", "الأكثر تقييماً", "حسب التخصص", "الأرشيف"] },
          { title: "للطلبة", links: ["تقديم بحث", "إرشادات النشر", "فحص التشابه"] },
          { title: "للأساتذة", links: ["لوحة المراجعة", "تقارير النزاهة", "إدارة اللجنة"] },
        ]
      : [
          { title: "Research", links: ["Latest", "Top Rated", "By Discipline", "Archive"] },
          { title: "Students", links: ["Submit Paper", "Guidelines", "Similarity Check"] },
          { title: "Faculty", links: ["Review Panel", "Integrity Reports", "Committee"] },
        ],
    copy: `© 2025 ASPU Insight — ${isAr ? "جامعة الشام الخاصة" : "Al-Sham Private University"}`,
    sub: isAr ? "مشروع تخرج · 2025–2026" : "Graduation Project · 2025–2026",
  };

  return (
    <>
      <div id="aspu-root" data-theme={theme}>
        {/* Cursor glow */}
        <div id="cg" ref={cgRef} />

        {/* ── POPUP ── */}
        {popup && (
          <ReadersPopup
            paper={popupPaper}
            readerType={popup.readerType}
            lang={lang}
            onClose={() => setPopup(null)}
          />
        )}

        {/* ── NAVBAR (nav + fullscreen menu) ── */}
        <Navbar
          menuOpen={menuOpen} setMenuOpen={setMenuOpen}
          theme={theme} setTheme={setTheme}
          lang={lang} setLang={setLang}
          hoveredMenu={hoveredMenu} setHoveredMenu={setHoveredMenu}
          scrolled={navScrolled}
          isAr={isAr}
          menuT={menuT} navT={navT}
          Logo={Logo}
        />

        {/* ── PAGE HEADER ── */}
        <div className="page-header">
          <div className="ph-inner">
            <div className="ph-breadcrumb">
              <a href="/">{isEn ? "Home" : "الرئيسية"}</a>
              <span className="ph-sep">›</span>
              <span>{isEn ? "Review of Published Research" : "مراجعة الأبحاث المنشورة"}</span>
            </div>
            <h1 className="ph-title">
              {isEn ? <>Review of<br />Published Research</> : <>مراجعة الأبحاث<br />المنشورة</>}
            </h1>
            <p className="ph-sub">
              {isEn
                ? "A comprehensive view of all published academic research — graduation projects, master's & PhD theses, and faculty scientific publications. Sorted by rating and readership."
                : "استعراض شامل لجميع الأبحاث الأكاديمية المنشورة — مشاريع التخرج، رسائل الماجستير والدكتوراه، والأبحاث العلمية للأساتذة. مرتّبة حسب التقييم وعدد القراء."}
            </p>
            <div className="ph-stats-row">
              <div className="ph-stat">
                <div className="ph-stat-n">{PAGE_STATS.totalPublished}</div>
                <div className="ph-stat-l">{isEn ? "Published" : "بحث منشور"}</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{PAGE_STATS.totalReads}</div>
                <div className="ph-stat-l">{isEn ? "Total Reads" : "إجمالي القراءات"}</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{PAGE_STATS.avgRating}</div>
                <div className="ph-stat-l">{isEn ? "Avg. Rating" : "متوسط التقييم"}</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{PAGE_STATS.disciplines}</div>
                <div className="ph-stat-l">{isEn ? "Disciplines" : "تخصصات"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="page-body">

          {/* Mobile filter toggle */}
          <button className="filter-toggle" onClick={() => setSidebarOpen((v) => !v)}>
            <span>{isEn ? "🔍 Filters" : "🔍 الفلاتر والتصفية"}</span>
            <span className={`ft-arrow${sidebarOpen ? " open" : ""}`}>▾</span>
          </button>

          {/* ── SIDEBAR ── */}
          <aside className={`sidebar${sidebarOpen ? " mobile-open" : ""}`}>

            {/* Search */}
            <div>
              <div className="filter-label">{isEn ? "Search" : "بحث"}</div>
              <div className="sf-search">
                <span className="sf-ico">⌕</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isEn ? "Title, author, keyword..." : "عنوان، باحث، كلمة مفتاحية..."}
                />
              </div>
            </div>

            {/* Publisher Type */}
            <div>
              <div className="filter-label">{isEn ? "Publisher Type" : "نوع الناشر"}</div>
              <div className="cb-group">
                {[
                  { key: "student", ar: "طالب", en: "Student", count: FILTER_COUNTS.pub.student },
                  { key: "professor", ar: "أستاذ / دكتور", en: "Professor / Doctor", count: FILTER_COUNTS.pub.professor },
                ].map((item) => (
                  <label className="cb-item" key={item.key}>
                    <input type="checkbox" checked={pubFilter[item.key]} onChange={() => togglePub(item.key)} />
                    <label>{isEn ? item.en : item.ar}</label>
                    <span className="cb-count">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Research Type */}
            <div>
              <div className="filter-label">{isEn ? "Research Type" : "نوع البحث"}</div>
              <div className="cb-group">
                {[
                  { key: "scientific", ar: "بحث علمي تقني", en: "Scientific / Technical", count: FILTER_COUNTS.type.scientific },
                  { key: "srs", ar: "مشروع SRS (Junior/Senior)", en: "SRS Project (Junior/Senior)", count: FILTER_COUNTS.type.srs },
                  { key: "master", ar: "رسالة ماجستير", en: "Master's Thesis", count: FILTER_COUNTS.type.master },
                  { key: "phd", ar: "رسالة دكتوراه", en: "PhD Dissertation", count: FILTER_COUNTS.type.phd },
                ].map((item) => (
                  <label className="cb-item" key={item.key}>
                    <input type="checkbox" checked={typeFilter[item.key]} onChange={() => toggleType(item.key)} />
                    <label>{isEn ? item.en : item.ar}</label>
                    <span className="cb-count">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="filter-label">{isEn ? "Minimum Rating" : "التقييم الأدنى"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { val: 0, starsF: 5, starsE: 0, ar: "الكل", en: "All" },
                  { val: 4, starsF: 4, starsE: 1, ar: "٤+ نجوم", en: "4+ stars" },
                  { val: 3, starsF: 3, starsE: 2, ar: "٣+ نجوم", en: "3+ stars" },
                  { val: 2, starsF: 2, starsE: 3, ar: "٢+ نجوم", en: "2+ stars" },
                ].map((row) => (
                  <label className="star-row" key={row.val}>
                    <input type="radio" name="rating" checked={minRating === row.val} onChange={() => setMinRating(row.val)} />
                    <span className="stars-display">{"★".repeat(row.starsF)}</span>
                    <span className="stars-muted">{"★".repeat(row.starsE)}</span>
                    <span className="star-lbl">{isEn ? row.en : row.ar}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Readers range */}
            <div>
              <div className="filter-label">{isEn ? "Min. Readers" : "عدد القراء (الحد الأدنى)"}</div>
              <div className="range-wrap">
                <div className="range-labels"><span>0</span><span>500</span><span>1000+</span></div>
                <input
                  type="range" min="0" max="1000" step="50"
                  value={minReaders}
                  onChange={(e) => setMinReaders(Number(e.target.value))}
                  style={rangeStyle}
                />
                <div className="range-val">
                  {minReaders.toLocaleString()} {isEn ? "readers min." : "قارئ فأكثر"}
                </div>
              </div>
            </div>

            {/* Discipline */}
            <div>
              <div className="filter-label">{isEn ? "Discipline" : "التخصص"}</div>
              <div className="cb-group">
                {[
                  { key: "ai", ar: "ذكاء اصطناعي", en: "AI", count: FILTER_COUNTS.disc.ai },
                  { key: "sec", ar: "أمن معلومات", en: "Cybersecurity", count: FILTER_COUNTS.disc.sec },
                  { key: "app", ar: "تطوير تطبيقات", en: "App Dev.", count: FILTER_COUNTS.disc.app },
                  { key: "data", ar: "علم البيانات", en: "Data Science", count: FILTER_COUNTS.disc.data },
                  { key: "net", ar: "شبكات", en: "Networks", count: FILTER_COUNTS.disc.net },
                  { key: "se", ar: "هندسة برمجيات", en: "Software Eng.", count: FILTER_COUNTS.disc.se },
                ].map((item) => (
                  <label className="cb-item" key={item.key}>
                    <input type="checkbox" checked={discFilter[item.key]} onChange={() => toggleDisc(item.key)} />
                    <label>{isEn ? item.en : item.ar}</label>
                    <span className="cb-count">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="reset-btn" onClick={resetFilters}>
              {isEn ? "Reset Filters" : "إعادة تعيين الفلاتر"}
            </button>
          </aside>

          {/* ── CONTENT AREA ── */}
          <div className="content-area" style={{ minWidth: 0 }}>
            {/* Results bar */}
            <div className="results-bar">
              <div className="results-count">
                {isEn
                  ? <>Showing <strong>{filtered.length}</strong> of <strong>1,240</strong> papers</>
                  : <>عرض <strong>{filtered.length}</strong> من <strong>1,240</strong> بحثاً</>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div className="sort-row">
                  <span className="sort-label">{isEn ? "Sort by:" : "ترتيب حسب:"}</span>
                  <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="rating">{isEn ? "Rating" : "التقييم"}</option>
                    <option value="readers">{isEn ? "Readers" : "عدد القراء"}</option>
                    <option value="newest">{isEn ? "Newest" : "الأحدث"}</option>
                    <option value="title">{isEn ? "Title" : "العنوان"}</option>
                  </select>
                </div>
                <div className="view-btns">
                  <button className={`view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="list">☰</button>
                  <button className={`view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="grid">⊞</button>
                </div>
              </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--tx3)", fontSize: 15 }}>
                {isEn ? "No papers match your criteria" : "لا توجد أبحاث تطابق معايير البحث"}
              </div>
            ) : (
              <div className={`research-grid${view === "grid" ? " grid-2col" : ""}`}>
                {filtered.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    lang={lang}
                    onOpenPopup={(paperId, readerType) => setPopup({ paperId, readerType })}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <button className="pg-btn">‹</button>
              <button className="pg-btn active">1</button>
              <button className="pg-btn">2</button>
              <button className="pg-btn">3</button>
              <span className="pg-dots">···</span>
              <button className="pg-btn">24</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <Footer isAr={isAr} footer={footer} Logo={Logo} />

      </div>
    </>
  );
}