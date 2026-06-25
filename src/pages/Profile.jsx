import { useState, useEffect, useRef } from "react";
import "../styling/Profile.css";
import { updateProfile, changePassword } from "../api/Auth";
import api from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import { Ara, Eng } from "../i18n";

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
            <button onClick={onRetry} style={{ marginTop: 16, padding: "8px 20px", border: "1px solid var(--ac)", color: "var(--ac)", background: "transparent", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                {L("إعادة المحاولة", "Retry")}
            </button>
        </div>
    );
}

/* ══ INLINE EDIT FIELD ══ */
function EditField({ label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, letterSpacing: "0.05em" }}>{label}</label>
            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    style={{
                        background: "var(--surf2)",
                        border: "1px solid var(--bdr)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        color: "var(--tx1)",
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 0.2s",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--ac)"}
                    onBlur={e => e.target.style.borderColor = "var(--bdr)"}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        background: "var(--surf2)",
                        border: "1px solid var(--bdr)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        color: "var(--tx1)",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "border-color 0.2s",
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--ac)"}
                    onBlur={e => e.target.style.borderColor = "var(--bdr)"}
                />
            )}
        </div>
    );
}

/* ══ CHANGE PASSWORD MODAL ══ */
function ChangePasswordModal({ onClose, L }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError(L("يرجى تعبئة جميع الحقول", "Please fill in all fields"));
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(L("كلمتا المرور الجديدتان غير متطابقتين", "New passwords do not match"));
            return;
        }
        if (newPassword.length < 8) {
            setError(L("يجب أن تكون كلمة المرور 8 أحرف على الأقل", "Password must be at least 8 characters"));
            return;
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword, confirmPassword);
            setSuccess(true);
            setTimeout(() => onClose(), 1200);
        } catch (err) {
            const errData = err?.response?.data;
            setError(
                errData
                    ? Object.values(errData).flat().join(" ")
                    : L("فشل تغيير كلمة المرور. حاول مرة أخرى.", "Failed to change password. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1000, padding: 20,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "var(--surf1)", borderRadius: 12, padding: 28,
                    width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ fontSize: 17, fontWeight: 700, color: "var(--tx1)", marginBottom: 20 }}>
                    {L("تغيير كلمة المرور", "Change Password")}
                </div>

                <EditField
                    label={L("كلمة المرور الحالية", "Current Password")}
                    type="password"
                    value={oldPassword}
                    onChange={setOldPassword}
                    placeholder={L("أدخل كلمة المرور الحالية", "Enter current password")}
                />
                <EditField
                    label={L("كلمة المرور الجديدة", "New Password")}
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder={L("أدخل كلمة المرور الجديدة", "Enter new password")}
                />
                <EditField
                    label={L("تأكيد كلمة المرور الجديدة", "Confirm New Password")}
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder={L("أعد إدخال كلمة المرور الجديدة", "Re-enter new password")}
                />

                {error && (
                    <div style={{ fontSize: 12, color: "#C0542A", marginBottom: 10, padding: "8px 12px", background: "rgba(192,84,42,0.08)", borderRadius: 6 }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ fontSize: 12, color: "#2A8A5A", marginBottom: 10, padding: "8px 12px", background: "rgba(42,138,90,0.08)", borderRadius: 6 }}>
                        {L("✓ تم تغيير كلمة المرور بنجاح", "✓ Password changed successfully")}
                    </div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            padding: "9px 22px", background: "var(--ac)", color: "#fff",
                            border: "none", borderRadius: 8,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: 13, fontFamily: "inherit", fontWeight: 600,
                            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
                        }}
                    >
                        {loading ? L("جارٍ الحفظ...", "Saving...") : L("تغيير كلمة المرور", "Change Password")}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        style={{
                            padding: "9px 22px", background: "transparent", color: "var(--tx2)",
                            border: "1px solid var(--bdr)", borderRadius: 8,
                            cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                            transition: "border-color 0.2s",
                        }}
                    >
                        {L("إلغاء", "Cancel")}
                    </button>
                </div>
            </div>
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

    // ← Guard يمنع الاستدعاء المزدوج في React StrictMode
    const hasFetched = useRef(false);

    // ══ EDIT STATE ══
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "",
        institution: "",
        orcid_id: "",
        bio: "",
        preferred_language: "ar",
        profile_picture_url: "",
        role: "author",
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const avatarInputRef = useRef(null);

    // ══ CHANGE PASSWORD MODAL STATE ══
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // ══ FETCH PROFILE — مرة واحدة فقط ══
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/api/auth/ASPU-2004/profile/');
            setProfile(data);
        } catch (err) {
            setError(err?.response?.data?.detail || err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ← هذا الـ guard هو الحل لمشكلة الـ 4 calls
        // React StrictMode بيشغّل كل effect مرتين في dev، والـ ref بيمنع التكرار
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchProfile();
    }, []);

    // ══ عند فتح وضع التعديل ══
    const handleStartEdit = () => {
        setEditForm({
            full_name: profile.full_name || "",
            institution: profile.institution || "",
            orcid_id: profile.orcid_id || "",
            bio: profile.bio || "",
            preferred_language: profile.preferred_language || "ar",
            profile_picture_url: profile.profile_picture_url || "",
            role: profile.role || "author",
        });
        setAvatarPreview(null);
        setAvatarFile(null);
        setSaveError("");
        setSaveSuccess(false);
        setIsEditing(true);
    };

    // ══ إلغاء التعديل ══
    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaveError("");
        setSaveSuccess(false);
        setAvatarPreview(null);
        setAvatarFile(null);
    };

    // ══ حفظ التعديلات — مُصلَح للصور ══
    const handleSave = async () => {
        setSaveLoading(true);
        setSaveError("");
        setSaveSuccess(false);

        try {
            // احسب الحقول المتغيرة فقط
            const changed = {};
            Object.keys(editForm).forEach(key => {
                if (editForm[key] !== (profile[key] || "")) {
                    changed[key] = editForm[key];
                }
            });

            const hasChanges = Object.keys(changed).length > 0;
            const hasNewAvatar = !!avatarFile;

            // لو ما في شي اتغير، اغلق وضع التعديل بس
            if (!hasChanges && !hasNewAvatar) {
                setIsEditing(false);
                return;
            }

            let updated;

            if (hasNewAvatar) {
                // ← الإصلاح الأساسي: استخدام FormData بدل JSON لإرسال الصورة
                const formData = new FormData();

                // أضف كل الحقول المتغيرة
                Object.keys(changed).forEach(key => {
                    formData.append(key, changed[key]);
                });

                // أضف ملف الصورة — اسم الحقل "profile_picture" حسب ما يتوقع الباك
                formData.append("profile_picture", avatarFile, avatarFile.name);

                updated = await updateProfile(formData);
            } else {
                // لا يوجد صورة جديدة — أبعت JSON عادي
                updated = await updateProfile(changed);
            }

            setProfile(prev => ({ ...prev, ...updated }));
            setSaveSuccess(true);

            setTimeout(() => {
                setIsEditing(false);
                setSaveSuccess(false);
                setAvatarPreview(null);
                setAvatarFile(null);
            }, 1200);

        } catch (err) {
            const errData = err?.response?.data;
            setSaveError(
                errData
                    ? Object.values(errData).flat().join(" ")
                    : L("فشل الحفظ. حاول مرة أخرى.", "Save failed. Please try again.")
            );
        } finally {
            setSaveLoading(false);
        }
    };

    // ══ معالجة اختيار الصورة ══
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSaveError(L("الملف يجب أن يكون صورة", "File must be an image"));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setSaveError(L("الصورة يجب أن تكون أقل من 5MB", "Image must be less than 5MB"));
            return;
        }

        setAvatarFile(file);
        // أنشئ preview URL مؤقت للعرض فقط، ما بينعكس على الباك
        setAvatarPreview(URL.createObjectURL(file));
        setSaveError("");
    };

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

    const texts = isAr ? Ara : Eng;
    const navT = texts.nav;
    const menuT = texts.menu;
    const footer = texts.footer;

    // ══ MAP API → UI ══
    const student = profile ? {
        nameAr: profile.full_name || "",
        nameEn: profile.full_name || "",
        avatarInitial: (profile.full_name || "؟")[0].toUpperCase(),
        avatarUrl: profile.profile_picture_url || null,
        roleAr: profile.role === "محرر" ? "طالب" : profile.role,
        roleEn: profile.role === "author" ? "Student" : profile.role,
        universityAr: profile.institution || "جامعة الشام الخاصة",
        universityEn: profile.institution || "ASPU University",
        email: profile.email || "",
        bio: profile.bio || "",
        institution: profile.institution || "",
        orcid_id: profile.orcid_id || "",
    } : null;

    const stats = profile ? [
        { value: profile.publications_count ?? "—", labelAr: "بحث منشور", labelEn: "Published", deltaAr: null, deltaEn: null },
        { value: profile.total_reads?.toLocaleString() ?? "—", labelAr: "مرة قُرئت الأبحاث", labelEn: "Total Reads", deltaAr: null, deltaEn: null },
        { value: profile.citations_count ?? "—", labelAr: "اقتباس علمي", labelEn: "Citations", deltaAr: null, deltaEn: null },
        { value: profile.reputation_score ?? "—", labelAr: "نقطة تقييم", labelEn: "Reputation Score", deltaAr: null, deltaEn: null },
    ] : [];

    const researchItems = profile?.research || profile?.publications || [];
    const level = null;
    const skills = profile?.skills || profile?.research_areas || [];
    const socialLinks = profile ? [
        profile.email && { icon: "✉", label: profile.email, href: `mailto:${profile.email}` },
    ].filter(Boolean) : [];

    /* ── RENDER ── */
    return (
        <>
            <div className="cursor-glow" ref={cursorRef} />

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

            {loading && <ProfileSkeleton />}
            {!loading && error && <ProfileError message={error} onRetry={fetchProfile} L={L} />}

            {!loading && !error && profile && (
                <>
                    {/* PROFILE HERO */}
                    <div className="profile-hero">
                        <div className="hero-glow-1" />
                        <div className="hero-glow-2" />
                        <div className="hero-inner">
                            <div className="ph-breadcrumb">
                                <a href="/">{L("الرئيسية", "Home")}</a>
                                <span className="ph-sep">›</span>
                                <span>{L("بروفايل الطالب", "Student Profile")}</span>
                            </div>

                            <div className="profile-card-top">
                                {/* Avatar */}
                                <div
                                    className="avatar-wrap"
                                    style={{ cursor: isEditing ? "pointer" : "default" }}
                                    onClick={() => isEditing && avatarInputRef.current?.click()}
                                >
                                    <div className="avatar">
                                        {avatarPreview
                                            ? <img src={avatarPreview} alt="preview" />
                                            : student.avatarUrl
                                                ? <img src={student.avatarUrl} alt={student.nameAr} />
                                                : student.avatarInitial}
                                    </div>
                                    <div className="avatar-ring" />
                                    <div className="avatar-ring-spin" />
                                    <div className="avatar-badge">{isEditing ? "📷" : "🎓"}</div>
                                    {isEditing && (
                                        <div style={{
                                            position: "absolute", inset: 0, borderRadius: "50%",
                                            background: "rgba(0,0,0,0.35)", display: "flex",
                                            alignItems: "center", justifyContent: "center",
                                            fontSize: 22, opacity: 0.85,
                                        }}>📷</div>
                                    )}
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                {/* Info */}
                                <div className="profile-info">
                                    {isEditing ? (
                                        /* ══ وضع التعديل ══ */
                                        <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 280 }}>
                                            <EditField
                                                label={L("الاسم الكامل", "Full Name")}
                                                value={editForm.full_name}
                                                onChange={v => setEditForm(f => ({ ...f, full_name: v }))}
                                                placeholder={L("أدخل اسمك الكامل", "Enter your full name")}
                                            />
                                            <EditField
                                                label={L("المؤسسة / الجامعة", "Institution")}
                                                value={editForm.institution}
                                                onChange={v => setEditForm(f => ({ ...f, institution: v }))}
                                                placeholder={L("جامعة الشام الخاصة", "Al-Sham Private University")}
                                            />
                                            <EditField
                                                label="ORCID ID"
                                                value={editForm.orcid_id}
                                                onChange={v => setEditForm(f => ({ ...f, orcid_id: v }))}
                                                placeholder="0000-0000-0000-0000"
                                            />

                                            {/* الدور */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                <label style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, letterSpacing: "0.05em" }}>
                                                    {L("الدور", "Role")}
                                                </label>
                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                    {[
                                                        { val: "author", arLabel: "مؤلف / باحث" },
                                                        { val: "reviewer", arLabel: "مراجع" },
                                                        { val: "editor", arLabel: "محرر" },
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.val}
                                                            onClick={() => setEditForm(f => ({ ...f, role: opt.val }))}
                                                            style={{
                                                                padding: "7px 18px",
                                                                borderRadius: 6,
                                                                border: "1px solid",
                                                                borderColor: editForm.role === opt.val ? "var(--ac)" : "var(--bdr)",
                                                                background: editForm.role === opt.val ? "var(--ac)" : "transparent",
                                                                color: editForm.role === opt.val ? "#fff" : "var(--tx2)",
                                                                cursor: "pointer",
                                                                fontSize: 13,
                                                                fontFamily: "inherit",
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            {L(opt.arLabel, opt.val.charAt(0).toUpperCase() + opt.val.slice(1))}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <EditField
                                                label={L("نبذة شخصية", "Bio")}
                                                value={editForm.bio}
                                                onChange={v => setEditForm(f => ({ ...f, bio: v }))}
                                                type="textarea"
                                                placeholder={L("اكتب نبذة مختصرة عنك...", "Write a short bio...")}
                                            />

                                            {/* اللغة المفضلة */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                <label style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, letterSpacing: "0.05em" }}>
                                                    {L("اللغة المفضلة", "Preferred Language")}
                                                </label>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    {[{ val: "ar", label: "العربية" }, { val: "en", label: "English" }].map(opt => (
                                                        <button
                                                            key={opt.val}
                                                            onClick={() => setEditForm(f => ({ ...f, preferred_language: opt.val }))}
                                                            style={{
                                                                padding: "7px 18px",
                                                                borderRadius: 6,
                                                                border: "1px solid",
                                                                borderColor: editForm.preferred_language === opt.val ? "var(--ac)" : "var(--bdr)",
                                                                background: editForm.preferred_language === opt.val ? "var(--ac)" : "transparent",
                                                                color: editForm.preferred_language === opt.val ? "#fff" : "var(--tx2)",
                                                                cursor: "pointer",
                                                                fontSize: 13,
                                                                fontFamily: "inherit",
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* رسائل الخطأ / النجاح */}
                                            {saveError && (
                                                <div style={{ fontSize: 12, color: "#C0542A", marginBottom: 10, padding: "8px 12px", background: "rgba(192,84,42,0.08)", borderRadius: 6 }}>
                                                    {saveError}
                                                </div>
                                            )}
                                            {saveSuccess && (
                                                <div style={{ fontSize: 12, color: "#2A8A5A", marginBottom: 10, padding: "8px 12px", background: "rgba(42,138,90,0.08)", borderRadius: 6 }}>
                                                    {L("✓ تم الحفظ بنجاح", "✓ Saved successfully")}
                                                </div>
                                            )}

                                            {/* أزرار الحفظ والإلغاء */}
                                            <div style={{ display: "flex", gap: 10 }}>
                                                <button
                                                    onClick={handleSave}
                                                    disabled={saveLoading}
                                                    style={{
                                                        padding: "9px 22px",
                                                        background: "var(--ac)",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: 8,
                                                        cursor: saveLoading ? "not-allowed" : "pointer",
                                                        fontSize: 13,
                                                        fontFamily: "inherit",
                                                        fontWeight: 600,
                                                        opacity: saveLoading ? 0.7 : 1,
                                                        transition: "opacity 0.2s",
                                                    }}
                                                >
                                                    {saveLoading ? L("جارٍ الحفظ...", "Saving...") : L("حفظ التغييرات", "Save Changes")}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={saveLoading}
                                                    style={{
                                                        padding: "9px 22px",
                                                        background: "transparent",
                                                        color: "var(--tx2)",
                                                        border: "1px solid var(--bdr)",
                                                        borderRadius: 8,
                                                        cursor: "pointer",
                                                        fontSize: 13,
                                                        fontFamily: "inherit",
                                                        transition: "border-color 0.2s",
                                                    }}
                                                >
                                                    {L("إلغاء", "Cancel")}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ══ وضع العرض ══ */
                                        <>
                                            <div className="profile-role-tag">
                                                <span>●</span>
                                                <span>{L(student.roleAr, student.roleEn)}</span>
                                            </div>
                                            <div className="profile-name">{student.nameAr}</div>
                                            {student.bio && (
                                                <div style={{ fontSize: 13, color: "var(--tx2)", marginTop: 4, maxWidth: 420, lineHeight: 1.6 }}>
                                                    {student.bio}
                                                </div>
                                            )}
                                            <div className="profile-meta">
                                                {student.institution && (
                                                    <div className="profile-meta-item">🏛️ {student.institution}</div>
                                                )}
                                                {student.institution && <div className="profile-meta-dot" />}
                                                <div className="profile-meta-item">📍 {L(student.universityAr, student.universityEn)}</div>
                                                {student.orcid_id && (
                                                    <>
                                                        <div className="profile-meta-dot" />
                                                        <div className="profile-meta-item">🔬 ORCID: {student.orcid_id}</div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* أزرار التعديل */}
                                {!isEditing && (
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                        <button className="edit-btn" onClick={handleStartEdit}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            {L("تعديل البروفايل", "Edit Profile")}
                                        </button>
                                        <button className="edit-btn" onClick={() => setShowPasswordModal(true)}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            {L("تغيير كلمة المرور", "Change Password")}
                                        </button>
                                    </div>
                                )}
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
                                        <div className="info-card-title">👤 {L("معلومات الحساب", "Account Info")}</div>
                                        <div className="info-grid">
                                            {[
                                                { labelAr: "الاسم الكامل", labelEn: "Full Name", value: profile.full_name || "—", accent: true },
                                                { labelAr: "البريد الإلكتروني", labelEn: "Email", value: profile.email || "—", accent: false },
                                                { labelAr: "المؤسسة", labelEn: "Institution", value: profile.institution || "—", accent: false },
                                                { labelAr: "ORCID ID", labelEn: "ORCID ID", value: profile.orcid_id || "—", accent: false },
                                                { labelAr: "اللغة المفضلة", labelEn: "Preferred Language", value: profile.preferred_language === "ar" ? "العربية" : "English", accent: false },
                                                { labelAr: "الدور", labelEn: "Role", value: profile.role || "—", accent: true },
                                                { labelAr: "تاريخ الانضمام", labelEn: "Joined", value: profile.created_at ? new Date(profile.created_at).toLocaleDateString(isAr ? "ar-SY" : "en-GB") : "—", accent: false },
                                                { labelAr: "تأكيد البريد", labelEn: "Email Verified", value: profile.email_verified ? L("مؤكد ✓", "Verified ✓") : L("غير مؤكد", "Not verified"), accent: false },
                                            ].map((item, i) => (
                                                <div className="info-item" key={i}>
                                                    <div className="info-item-label">{L(item.labelAr, item.labelEn)}</div>
                                                    <div className={`info-item-val${item.accent ? " ac" : ""}`}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {profile.bio && (
                                            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--bdr)" }}>
                                                <div style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, marginBottom: 8 }}>{L("النبذة الشخصية", "Bio")}</div>
                                                <div style={{ fontSize: 14, color: "var(--tx2)", lineHeight: 1.7 }}>{profile.bio}</div>
                                            </div>
                                        )}
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
                            {level && (
                                <div className="level-section">
                                    <div className="section-label">{L("المستوى الأكاديمي", "Academic Level")}</div>
                                    <div className="level-card">
                                        <div className="level-header">
                                            <div className="level-name">{L(level.nameAr, level.nameEn)}</div>
                                            <div className="level-badge">{level.badge}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                    <Footer isAr={isAr} footer={footer} Logo={Logo} />
                </>
            )}

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} L={L} />
            )}
        </>
    );
}