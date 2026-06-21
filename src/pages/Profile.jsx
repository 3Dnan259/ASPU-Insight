import { useState, useEffect, useRef } from "react";
import "../styling/Profile.css";
import { getProfile } from "../api/auth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

/* ══ SVG LOGO ══ */
const Logo = ({ size = 38 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: "block" }}
    >
        <rect width="40" height="40" rx="8" fill="#0D0F12" />
        <circle cx="20" cy="19" r="14" fill="none" stroke="#C4A55A" strokeWidth="0.6" opacity="0.5" />
        <path d="M14,22 Q14,14 20,12 Q26,14 26,22 Q26,28 20,29 Q14,28 14,22 Z" fill="#141820" stroke="#C4A55A" strokeWidth="0.9" />
        <line x1="20" y1="12" x2="20" y2="29" stroke="#C4A55A" strokeWidth="1" />
        <polygon points="20,13 16.5,20 23.5,20" fill="#C4A55A" />
        <line x1="16.4" y1="20" x2="13" y2="24" stroke="#5A8FA0" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="20" x2="20" y2="26" stroke="#C4A55A" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="23.6" y1="20" x2="27" y2="24" stroke="#7A5A30" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="20" cy="13" r="1.5" fill="#E8D090" />
    </svg>
);

/* ══ ACTIVITY GRID ══ */
function generateActivityGrid() {
    const cols = [];
    for (let col = 0; col < 12; col++) {
        const cells = [];
        for (let row = 0; row < 5; row++) {
            const r = Math.random();
            const cls = r < 0.4 ? "" : r < 0.65 ? "l1" : r < 0.8 ? "l2" : r < 0.92 ? "l3" : "l4";
            cells.push(cls);
        }
        cols.push(cells);
    }
    return cols;
}

/* ══ LOADING SKELETON ══ */
function ProfileSkeleton() {
    return (
        <div className="profile-hero" style={{ minHeight: 320 }}>
            <div className="hero-inner" style={{ paddingTop: 40 }}>
                <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32 }}>
                    <div style={{ width: 108, height: 108, borderRadius: "50%", background: "var(--surf2)", animation: "pulse 1.4s ease-in-out infinite" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ height: 16, width: "40%", borderRadius: 4, background: "var(--surf2)", animation: "pulse 1.4s ease-in-out infinite" }} />
                        <div style={{ height: 32, width: "60%", borderRadius: 4, background: "var(--surf2)", animation: "pulse 1.4s ease-in-out infinite" }} />
                        <div style={{ height: 14, width: "50%", borderRadius: 4, background: "var(--surf2)", animation: "pulse 1.4s ease-in-out infinite" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══ ERROR STATE ══ */
function ProfileError({ message, onRetry, L }) {
    return (
        <div className="empty-state" style={{ marginTop: 120 }}>
            <div className="empty-state-ico">⚠️</div>
            <div className="empty-state-t">{L("حدث خطأ أثناء تحميل البروفايل", "Failed to load profile")}</div>
            <div className="empty-state-s">{message}</div>
            <button
                onClick={onRetry}
                style={{ marginTop: 16, padding: "8px 20px", border: "1px solid var(--ac)", color: "var(--ac)", background: "transparent", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
            >
                {L("إعادة المحاولة", "Retry")}
            </button>
        </div>
    );
}

/* ══ MAIN COMPONENT ══ */
export default function StudentProfile() {
    const [theme, setTheme] = useState("light");
    const [lang, setLang] = useState("ar");
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [activeTab, setActiveTab] = useState("research");
    const [activityGrid] = useState(generateActivityGrid);
    const cursorRef = useRef(null);

    // ══ API STATE ══
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ══ FETCH PROFILE ══
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            setError(err?.response?.data?.detail || err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ══ SIDE EFFECTS ══
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-lang", lang);
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }, [theme, lang]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const el = cursorRef.current;
        if (!el || window.matchMedia("(pointer:coarse)").matches) {
            if (el) el.style.display = "none";
            return;
        }
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let cx = mx, cy = my;
        const onMove = (e) => { mx = e.clientX; my = e.clientY; };
        window.addEventListener("mousemove", onMove, { passive: true });
        let raf;
        const loop = () => {
            cx += (mx - cx) * 0.1;
            cy += (my - cy) * 0.1;
            el.style.left = cx + "px";
            el.style.top = cy + "px";
            raf = requestAnimationFrame(loop);
        };
        loop();
        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    const L = (ar, en) => (lang === "ar" ? ar : en);
    const isAr = lang === "ar";

    // ══ Shared Navbar/Footer text — معرّفة محلياً (مش موحّدة بملف خارجي) ══
    const navT = {
        menu: L("القائمة", "Menu"),
        close: L("إغلاق", "Close"),
    };

    const menuT = {
        home: L("الرئيسية", "HOME"),
        research: L("الأبحاث", "RESEARCH"),
        researchers: L("الباحثون", "RESEARCHERS"),
        integrity: L("النزاهة", "INTEGRITY"),
        contact: L("تواصل معنا", "CONTACT"),
        Profile: L("الملف الشخصي", "PROFILE"),
        explore: L("استعرض", "EXPLORE"),
        appearance: L("المظهر", "Appearance"),
        login: L("تسجيل الدخول →", "Login →"),
    };

    const footer = {
        brand: L(
            "مجلة رقمية أكاديمية تسلط الضوء على أبحاث الطلبة وإنجازاتهم في جامعة الشام الخاصة.",
            "A digital academic journal spotlighting student research at Al-Sham Private University."
        ),
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
        copy: `© 2025 ASPU Insight — ${L("جامعة الشام الخاصة", "Al-Sham Private University")}`,
        sub: L("مشروع تخرج · 2025–2026", "Graduation Project · 2025–2026"),
    };

    // ══ MAP API → UI ══
    const student = profile ? {
        nameAr: profile.full_name || profile.name || "",
        nameEn: profile.full_name_en || profile.full_name || profile.name || "",
        avatarInitial: (profile.full_name || profile.name || "؟")[0],
        avatarUrl: profile.avatar || profile.profile_picture || null,
        roleAr: profile.academic_level || "طالب",
        roleEn: profile.academic_level_en || profile.academic_level || "Student",
        facultyAr: profile.faculty || profile.college || "",
        facultyEn: profile.faculty_en || profile.faculty || profile.college || "",
        universityAr: profile.university || "جامعة ASPU",
        universityEn: profile.university_en || profile.university || "ASPU University",
        memberSinceAr: profile.date_joined ? `منتسب منذ ${new Date(profile.date_joined).getFullYear()}` : "",
        memberSinceEn: profile.date_joined ? `Member since ${new Date(profile.date_joined).getFullYear()}` : "",
        email: profile.email || "",
    } : null;

    const stats = profile ? [
        {
            value: profile.publications_count ?? profile.research_count ?? "—",
            labelAr: "بحث منشور",
            labelEn: "Published",
            deltaAr: profile.publications_this_year ? `${profile.publications_this_year} هذا العام` : null,
            deltaEn: profile.publications_this_year ? `${profile.publications_this_year} this year` : null,
        },
        {
            value: profile.total_reads?.toLocaleString() ?? "—",
            labelAr: "مرة قُرئت الأبحاث",
            labelEn: "Total Reads",
            deltaAr: profile.reads_growth ? `+${profile.reads_growth}%` : null,
            deltaEn: profile.reads_growth ? `+${profile.reads_growth}%` : null,
        },
        {
            value: profile.citations_count ?? profile.citations ?? "—",
            labelAr: "اقتباس علمي",
            labelEn: "Citations",
            deltaAr: null,
            deltaEn: null,
        },
        {
            value: profile.reputation_score ?? profile.score ?? "—",
            labelAr: "نقطة تقييم",
            labelEn: "Reputation Score",
            deltaAr: profile.rank_label || null,
            deltaEn: profile.rank_label_en || profile.rank_label || null,
        },
    ] : [];

    const researchItems = profile?.research || profile?.publications || [];

    const academicInfo = profile ? [
        { labelAr: "المرحلة الدراسية", labelEn: "Academic Level", value: profile.academic_level || "—", accent: true },
        { labelAr: "التخصص", labelEn: "Specialisation", value: profile.specialization || profile.major || "—", accent: false },
        { labelAr: "الكلية", labelEn: "Faculty", value: profile.faculty || profile.college || "—", accent: false },
        { labelAr: "المشرف الأكاديمي", labelEn: "Academic Supervisor", value: profile.supervisor || "—", accent: true },
        { labelAr: "المعدل التراكمي", labelEn: "GPA", value: profile.gpa ? `${profile.gpa} / 4.00` : "—", accent: false },
        { labelAr: "اللغات", labelEn: "Languages", value: profile.languages || "—", accent: false },
    ] : [];

    const level = profile?.level ? {
        nameAr: profile.level.name_ar || profile.level.name || "",
        nameEn: profile.level.name_en || profile.level.name || "",
        badge: `LV. ${profile.level.number ?? ""}`,
        currentPoints: profile.level.current_points ?? 0,
        nextLevel: profile.level.next_level_points ?? 100,
        progressPercent: profile.level.progress_percent ?? 0,
        milestones: profile.level.milestones || [],
    } : null;

    const skills = profile?.skills || profile?.research_areas || [];

    const socialLinks = profile ? [
        profile.email && { icon: "✉", label: profile.email, href: `mailto:${profile.email}` },
        profile.researchgate && { icon: "🔬", label: "ResearchGate", href: profile.researchgate },
        profile.google_scholar && { icon: "📚", label: "Google Scholar", href: profile.google_scholar },
        profile.linkedin && { icon: "💼", label: "LinkedIn", href: profile.linkedin },
    ].filter(Boolean) : [];

    /* ── RENDER ── */
    return (
        <>
            <div className="cursor-glow" ref={cursorRef} />

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

            {/* ══ LOADING / ERROR ══ */}
            {loading && <ProfileSkeleton />}
            {!loading && error && <ProfileError message={error} onRetry={fetchProfile} L={L} />}

            {/* ══ PROFILE CONTENT ══ */}
            {!loading && !error && profile && (
                <>
                    {/* PROFILE HERO */}
                    <div className="profile-hero">
                        <div className="hero-glow-1" />
                        <div className="hero-glow-2" />
                        <div className="hero-inner">
                            <div className="ph-breadcrumb">
                                <a href="#">{L("الرئيسية", "Home")}</a>
                                <span className="ph-sep">›</span>
                                <a href="#">{L("الباحثون", "Researchers")}</a>
                                <span className="ph-sep">›</span>
                                <span>{L("بروفايل الطالب", "Student Profile")}</span>
                            </div>

                            <div className="profile-card-top">
                                {/* Avatar */}
                                <div className="avatar-wrap">
                                    <div className="avatar">
                                        {student.avatarUrl
                                            ? <img src={student.avatarUrl} alt={student.nameAr} />
                                            : student.avatarInitial}
                                    </div>
                                    <div className="avatar-ring" />
                                    <div className="avatar-ring-spin" />
                                    <div className="avatar-badge">🎓</div>
                                </div>

                                {/* Info */}
                                <div className="profile-info">
                                    <div className="profile-role-tag">
                                        <span>●</span>
                                        <span>{L(student.roleAr, student.roleEn)}</span>
                                    </div>
                                    <div className="profile-name">{L(student.nameAr, student.nameEn)}</div>
                                    <div className="profile-meta">
                                        {student.facultyAr && <div className="profile-meta-item">🏛️ {L(student.facultyAr, student.facultyEn)}</div>}
                                        {student.facultyAr && <div className="profile-meta-dot" />}
                                        <div className="profile-meta-item">📍 {L(student.universityAr, student.universityEn)}</div>
                                        {student.memberSinceAr && <><div className="profile-meta-dot" /><div className="profile-meta-item">📅 {L(student.memberSinceAr, student.memberSinceEn)}</div></>}
                                    </div>
                                </div>

                                {/* Edit */}
                                <button className="edit-btn">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    {L("تعديل البروفايل", "Edit Profile")}
                                </button>
                            </div>
                        </div>

                        {/* Stats strip */}
                        <div className="stats-strip">
                            {stats.map((s, i) => (
                                <div className="stat-cell" key={i}>
                                    <div className="stat-n">{s.value}</div>
                                    <div className="stat-l">{L(s.labelAr, s.labelEn)}</div>
                                    {s.deltaAr && <div className="stat-delta">▲ {L(s.deltaAr, s.deltaEn)}</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="profile-tabs">
                        {[
                            { key: "research", ar: "الأبحاث", en: "Research" },
                            { key: "info", ar: "المعلومات الأساسية", en: "Basic Info" },
                            { key: "activity", ar: "النشاط", en: "Activity" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                className={`ptab${activeTab === tab.key ? " on" : ""}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {L(tab.ar, tab.en)}
                            </button>
                        ))}
                    </div>

                    {/* PAGE BODY */}
                    <div className="page-body">
                        <div>

                            {/* TAB: RESEARCH */}
                            {activeTab === "research" && (
                                <div>
                                    <div className="section-label">{L("الأبحاث المنشورة", "Published Research")}</div>
                                    {researchItems.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-state-ico">📄</div>
                                            <div className="empty-state-t">{L("لا توجد أبحاث بعد", "No research yet")}</div>
                                        </div>
                                    ) : (
                                        <div className="research-list">
                                            {researchItems.map((item, i) => (
                                                <div className="research-item" key={item.id || i}>
                                                    <div>
                                                        <div className="ri-type">{item.type || item.category || ""}</div>
                                                        <div className="ri-title">{item.title || item.title_ar || ""}</div>
                                                        <div className="ri-meta">
                                                            {item.date && <div className="ri-meta-item">📅 {item.date}</div>}
                                                            {item.reads != null && <div className="ri-meta-item">👁 {item.reads?.toLocaleString()} {L("قراءة", "reads")}</div>}
                                                            {item.citations != null && <div className="ri-meta-item">🔗 {item.citations} {L("اقتباس", "citations")}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="ri-status">
                                                        <div className={`ri-badge ${item.status || "draft"}`}>
                                                            {item.status === "published" && L("منشور", "Published")}
                                                            {item.status === "review" && L("قيد المراجعة", "Under Review")}
                                                            {item.status === "draft" && L("مسودة", "Draft")}
                                                        </div>
                                                        {item.trending && <div className="ri-reads">⬆ {L("رائج هذا الأسبوع", "Trending")}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: INFO */}
                            {activeTab === "info" && (
                                <div>
                                    <div className="section-label">{L("المعلومات الأساسية", "Basic Information")}</div>
                                    <div className="info-card">
                                        <div className="info-card-title">🎓 {L("المعلومات الأكاديمية", "Academic Info")}</div>
                                        <div className="info-grid">
                                            {academicInfo.map((item, i) => (
                                                <div className="info-item" key={i}>
                                                    <div className="info-item-label">{L(item.labelAr, item.labelEn)}</div>
                                                    <div className={`info-item-val${item.accent ? " ac" : ""}`}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: ACTIVITY */}
                            {activeTab === "activity" && (
                                <div>
                                    <div className="section-label">{L("النشاط خلال 12 شهراً", "Activity — Last 12 Months")}</div>
                                    <div className="info-card">
                                        <div className="activity-grid">
                                            {activityGrid.map((col, ci) => (
                                                <div className="act-col" key={ci}>
                                                    {col.map((cls, ri) => (
                                                        <div className={`act-cell${cls ? " " + cls : ""}`} key={ri} />
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="act-labels">
                                            {[["يناير", "Jan"], ["أبريل", "Apr"], ["يوليو", "Jul"], ["أكتوبر", "Oct"], ["الآن", "Now"]].map(([ar, en]) => (
                                                <span key={ar}>{L(ar, en)}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SIDEBAR */}
                        <div>
                            {/* Level */}
                            {level && (
                                <div className="level-section">
                                    <div className="section-label">{L("المستوى الأكاديمي", "Academic Level")}</div>
                                    <div className="level-card">
                                        <div className="level-header">
                                            <div className="level-name">{L(level.nameAr, level.nameEn)}</div>
                                            <div className="level-badge">{level.badge}</div>
                                        </div>
                                        <div className="level-bar-wrap">
                                            <div className="level-bar-labels">
                                                <span>{L(`${level.currentPoints} نقطة`, `${level.currentPoints} pts`)}</span>
                                                <span>{L(`${level.nextLevel} للترقي`, `${level.nextLevel} to next`)}</span>
                                            </div>
                                            <div className="level-bar-bg">
                                                <div className="level-bar-fill" style={{ width: `${level.progressPercent}%` }} />
                                            </div>
                                        </div>
                                        {level.milestones.length > 0 && (
                                            <div className="level-milestones">
                                                {level.milestones.map((m, i) => (
                                                    <div className={`milestone${m.done ? " done" : ""}`} key={i}>
                                                        {m.done ? "✓" : "⬡"} {L(m.name_ar || m.name, m.name_en || m.name)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div className="side-card">
                                    <div className="side-card-title">{L("مجالات البحث", "Research Areas")}</div>
                                    <div className="skills-list">
                                        {skills.map((s, i) => (
                                            <span className="skill-tag" key={i}>
                                                {typeof s === "string" ? s : (s.name || s.label || "")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social */}
                            {socialLinks.length > 0 && (
                                <div className="side-card">
                                    <div className="side-card-title">{L("التواصل", "Contact")}</div>
                                    <div className="social-links">
                                        {socialLinks.map((link, i) => (
                                            <a href={link.href} className="social-link" key={i} target="_blank" rel="noreferrer">
                                                <span className="social-ico">{link.icon}</span>
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <Footer isAr={isAr} footer={footer} Logo={Logo} />
                </>
            )}
        </>
    );
}