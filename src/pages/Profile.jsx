import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styling/Profile.css";
import { updateProfile, changePassword } from "../api/auth";
import api from "../api/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

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
function ProfileError({ message, onRetry, t }) {
    return (
        <div className="empty-state" style={{ marginTop: 120 }}>
            <div className="empty-state-ico">⚠️</div>
            <div className="empty-state-t">{t("profile.error.loadFailed")}</div>
            <div className="empty-state-s">{message}</div>
            <button onClick={onRetry} style={{ marginTop: 16, padding: "8px 20px", border: "1px solid var(--ac)", color: "var(--ac)", background: "transparent", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                {t("profile.action.retry")}
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
function ChangePasswordModal({ onClose, t }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError("");

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError(t("profile.modal.error.emptyFields"));
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t("profile.modal.error.mismatch"));
            return;
        }
        if (newPassword.length < 8) {
            setError(t("profile.modal.error.shortPassword"));
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
                    : t("profile.modal.error.submitFailed")
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
                    {t("profile.modal.title")}
                </div>

                <EditField
                    label={t("profile.modal.oldPassword")}
                    type="password"
                    value={oldPassword}
                    onChange={setOldPassword}
                    placeholder={t("profile.modal.oldPasswordPlaceholder")}
                />
                <EditField
                    label={t("profile.modal.newPassword")}
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder={t("profile.modal.newPasswordPlaceholder")}
                />
                <EditField
                    label={t("profile.modal.confirmPassword")}
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder={t("profile.modal.confirmPasswordPlaceholder")}
                />

                {error && (
                    <div style={{ fontSize: 12, color: "#C0542A", marginBottom: 10, padding: "8px 12px", background: "rgba(192,84,42,0.08)", borderRadius: 6 }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ fontSize: 12, color: "#2A8A5A", marginBottom: 10, padding: "8px 12px", background: "rgba(42,138,90,0.08)", borderRadius: 6 }}>
                        {t("profile.modal.success")}
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
                        {loading ? t("profile.action.saving") : t("profile.modal.title")}
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
                        {t("profile.action.cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══ MAIN COMPONENT ══ */
export default function StudentProfile() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || "ar";
    const setLang = (l) => {
        i18n.changeLanguage(l);
        document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", l);
    };
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

    // Guard يمنع الاستدعاء المزدوج في React StrictMode
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

    // ══ FETCH PROFILE ══
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

    // ══ حفظ التعديلات ══
    const handleSave = async () => {
        setSaveLoading(true);
        setSaveError("");
        setSaveSuccess(false);

        try {
            const changed = {};
            Object.keys(editForm).forEach(key => {
                if (editForm[key] !== (profile[key] || "")) {
                    changed[key] = editForm[key];
                }
            });

            const hasChanges = Object.keys(changed).length > 0;
            const hasNewAvatar = !!avatarFile;

            if (!hasChanges && !hasNewAvatar) {
                setIsEditing(false);
                return;
            }

            let updated;

            if (hasNewAvatar) {
                const formData = new FormData();
                Object.keys(changed).forEach(key => {
                    formData.append(key, changed[key]);
                });
                formData.append("profile_picture", avatarFile, avatarFile.name);
                updated = await updateProfile(formData);
            } else {
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
                    : t("profile.error.saveFailed")
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
            setSaveError(t("profile.error.imageType"));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setSaveError(t("profile.error.imageSize"));
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setSaveError("");
    };

    // ══ SIDE EFFECTS ══
    useEffect(() => {
        document.documentElement.setAttribute("data-lang", lang);
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }, [lang]);

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

    const isAr = lang === "ar";
    const tProfile = t("profile", { returnObjects: true });
    const navT = t("nav", { returnObjects: true });
    const menuT = t("menu", { returnObjects: true });
    const footer = t("footer", { returnObjects: true });

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

    return (
        <>
            <div className="cursor-glow" ref={cursorRef} />

            <Navbar
                menuOpen={menuOpen} setMenuOpen={setMenuOpen}
                lang={lang} setLang={setLang}
                hoveredMenu={hoveredMenu} setHoveredMenu={setHoveredMenu}
                scrolled={scrolled}
                isAr={isAr}
                menuT={menuT} navT={navT}
                Logo={Logo}
            />

            {loading && <ProfileSkeleton />}
            {!loading && error && <ProfileError message={error} onRetry={fetchProfile} t={t} />}

            {!loading && !error && profile && (
                <>
                    {/* PROFILE HERO */}
                    <div className="profile-hero">
                        <div className="hero-glow-1" />
                        <div className="hero-glow-2" />
                        <div className="hero-inner">
                            <div className="ph-breadcrumb">
                                <a href="/">{tProfile.breadcrumb.home}</a>
                                <span className="ph-sep">›</span>
                                <span>{tProfile.breadcrumb.profile}</span>
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
                                                label={tProfile.field.fullName}
                                                value={editForm.full_name}
                                                onChange={v => setEditForm(f => ({ ...f, full_name: v }))}
                                                placeholder={tProfile.placeholder.fullName}
                                            />
                                            <EditField
                                                label={tProfile.field.institution}
                                                value={editForm.institution}
                                                onChange={v => setEditForm(f => ({ ...f, institution: v }))}
                                                placeholder={tProfile.placeholder.institution}
                                            />
                                            <EditField
                                                label={tProfile.field.orcid}
                                                value={editForm.orcid_id}
                                                onChange={v => setEditForm(f => ({ ...f, orcid_id: v }))}
                                                placeholder={tProfile.placeholder.orcid}
                                            />

                                            {/* الدور */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                <label style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, letterSpacing: "0.05em" }}>
                                                    {tProfile.field.role}
                                                </label>
                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                    {[
                                                        { val: "author", label: tProfile.roleOptions.author },
                                                        { val: "reviewer", label: tProfile.roleOptions.reviewer },
                                                        { val: "editor", label: tProfile.roleOptions.editor },
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
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <EditField
                                                label={tProfile.field.bio}
                                                value={editForm.bio}
                                                onChange={v => setEditForm(f => ({ ...f, bio: v }))}
                                                type="textarea"
                                                placeholder={tProfile.placeholder.bio}
                                            />

                                            {/* اللغة المفضلة */}
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                                                <label style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600, letterSpacing: "0.05em" }}>
                                                    {tProfile.field.preferredLanguage}
                                                </label>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    {[{ val: "ar", label: tProfile.languageOptions.ar }, { val: "en", label: tProfile.languageOptions.en }].map(opt => (
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
                                                    {tProfile.action.saved}
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
                                                    {saveLoading ? tProfile.action.saving : tProfile.action.save}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={saveLoading}
                                                    style={{
                                                        padding: "9px 22px", background: "transparent", color: "var(--tx2)",
                                                        border: "1px solid var(--bdr)", borderRadius: 8,
                                                        cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                                                        transition: "border-color 0.2s",
                                                    }}
                                                >
                                                    {tProfile.action.cancel}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ══ الوضع الطبيعي (عرض البيانات) ══ */
                                        <div>
                                            <h2>{isAr ? student.nameAr : student.nameEn}</h2>
                                            <p>{isAr ? student.roleAr : student.roleEn} - {isAr ? student.universityAr : student.universityEn}</p>
                                            <p style={{ marginTop: 8, color: "var(--tx2)" }}>{student.bio}</p>
                                            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                                                <button 
                                                    onClick={handleStartEdit}
                                                    style={{ padding: "8px 16px", background: "var(--ac)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
                                                >
                                                    {tProfile.action.edit}
                                                </button>
                                                <button 
                                                    onClick={() => setShowPasswordModal(true)}
                                                    style={{ padding: "8px 16px", background: "transparent", color: "var(--tx2)", border: "1px solid var(--bdr)", borderRadius: 6, cursor: "pointer" }}
                                                >
                                                    {t("profile.modal.title")}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Footer footerT={footer} />
        </>
    );
}