import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { login, register, enable2FA, confirm2FA } from "../api/auth";
import "../styling/Auth.css";

// ─── Top Bar ──────────────────────────────────────────────────────────────────
// Only language switcher — no theme toggle (light is the default per design)
function TopBar({ lang, setLang }) {
  return (
    <header className="auth-topbar">
      {/* Logo — right side in RTL */}
      <a href="/" className="auth-tb-logo">
        <svg style={{ width: 34, height: 34, flexShrink: 0 }} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#0D0F12"/>
          <circle cx="20" cy="19" r="14" fill="none" stroke="#C4A55A" strokeWidth="0.6" opacity="0.5"/>
          <path d="M14,22 Q14,14 20,12 Q26,14 26,22 Q26,28 20,29 Q14,28 14,22 Z" fill="#141820" stroke="#C4A55A" strokeWidth="0.9"/>
          <line x1="20" y1="12" x2="20" y2="29" stroke="#C4A55A" strokeWidth="1"/>
          <polygon points="20,13 16.5,20 23.5,20" fill="#C4A55A"/>
          <line x1="16.4" y1="20" x2="13" y2="24" stroke="#5A8FA0" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="20" y1="20" x2="20" y2="26" stroke="#C4A55A" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="23.6" y1="20" x2="27" y2="24" stroke="#7A5A30" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="20" cy="13" r="1.5" fill="#E8D090"/>
        </svg>
        <div>
          <div className="auth-tb-name">ASPU Insight</div>
          <div className="auth-tb-sub">{lang === "ar" ? "المجلة الأكاديمية" : "Academic Journal"}</div>
        </div>
      </a>

      {/* Language pill only */}
      <div className="auth-pill">
        <button className={`auth-pill-btn ${lang === "ar" ? "on" : ""}`} onClick={() => setLang("ar")}>ع</button>
        <button className={`auth-pill-btn ${lang === "en" ? "on" : ""}`} onClick={() => setLang("en")}>EN</button>
      </div>
    </header>
  );
}

// ─── Accent Panel ─────────────────────────────────────────────────────────────
function AccentPanel({ lang }) {
  return (
    <div className="auth-accent">
      <div className="auth-ac-grid" />
      <div className="auth-ac-ring" style={{ width: 380, height: 380, top: -120, right: -100 }} />
      <div className="auth-ac-ring" style={{ width: 180, height: 180, bottom: 70, left: -50 }} />
      <div className="auth-ac-ring" style={{ width: 80, height: 80, bottom: 30, right: 50, borderColor: "rgba(0,0,0,.06)" }} />

      <div className="auth-ac-top">
        <div className="auth-ac-eyebrow">
          <div className="auth-ac-dot" />
          {lang === "ar" ? "جامعة الشام الخاصة" : "Al-Sham Private University"}
        </div>
        <div className="auth-ac-big">
          ASPU<br /><span className="dim">INSIGHT</span>
        </div>
        <p className="auth-ac-sub">
          {lang === "ar"
            ? "المجلة الأكاديمية الرقمية لأبحاث ومشاريع طلبة كلية الهندسة المعلوماتية."
            : "The digital academic journal for research and projects of the Informatics Engineering faculty."}
        </p>
      </div>

      <div className="auth-ac-stats">
        <div className="auth-ac-stat">
          <div className="auth-ac-n">1,240</div>
          <div className="auth-ac-l">{lang === "ar" ? "بحث" : "Papers"}</div>
        </div>
        <div className="auth-ac-stat">
          <div className="auth-ac-n">380</div>
          <div className="auth-ac-l">{lang === "ar" ? "باحث" : "Researchers"}</div>
        </div>
        <div className="auth-ac-stat">
          <div className="auth-ac-n">96%</div>
          <div className="auth-ac-l">{lang === "ar" ? "نزاهة" : "Integrity"}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function ErrorBox({ message }) {
  if (!message) return null;
  return <div className="auth-error">{message}</div>;
}

function SuccessBox({ message }) {
  if (!message) return null;
  return <div className="auth-success">{message}</div>;
}

function Button({ children, onClick, loading, variant = "primary" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`auth-btn${variant === "ghost" ? " auth-btn-ghost" : ""}`}
    >
      {loading ? "جاري التحميل..." : children}
      {!loading && <span className="barr">←</span>}
    </button>
  );
}

// Input with icon on the left (visual left = inner-end in RTL)
function InputBox({ icon, label, type = "text", value, onChange, placeholder, autoComplete, extra }) {
  return (
    <div className="auth-field">
      {label && <label className="auth-label">{label}</label>}
      <div className="auth-input-box">
        {icon && <span className="auth-input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="auth-input"
        />
        {extra}
      </div>
    </div>
  );
}

// ─── Layout wrapper shared by all steps ───────────────────────────────────────
function AuthLayout({ lang, setLang, children, step, activeTab, onTabChange, onBack }) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Titles per step
  const titles = {
    login:    lang === "ar" ? "مرحباً بعودتك"         : "Welcome back",
    register: lang === "ar" ? "تسجيل طالب جديد"       : "Student Registration",
    qr:       lang === "ar" ? "إعداد المصادقة الثنائية" : "Set up 2FA",
    otp:      lang === "ar" ? "رمز التحقق"             : "Verification Code",
    done:     lang === "ar" ? "تم تسجيل الدخول"        : "Signed In",
  };

  const subs = {
    login:    lang === "ar" ? "أدخل بياناتك للوصول إلى حسابك." : "Enter your credentials to access your account.",
    register: lang === "ar" ? "أدخل بياناتك الجامعية للانضمام إلى ASPU Insight." : "Enter your university details to join ASPU Insight.",
    qr:       lang === "ar" ? "امسح رمز QR باستخدام Google Authenticator أو أي تطبيق TOTP" : "Scan the QR code using Google Authenticator or any TOTP app.",
    otp:      lang === "ar" ? "أدخل الرمز المكوّن من 6 أرقام من تطبيق المصادقة" : "Enter the 6-digit code from your authenticator app.",
    done:     "",
  };

  const showTabs = step === "login" || step === "register";

  return (
    <div className="auth-root" dir={dir}>
      <TopBar lang={lang} setLang={setLang} />

      <main className="auth-page">
        <div className="auth-container">

          {/* Form panel — LEFT in RTL layout (first in DOM = right side visually because of RTL grid) */}
          {/* Actually: in RTL, first column renders on the right. We want form on the left visually.
              So we put AccentPanel first in DOM (renders right) and form second (renders left). */}
          <AccentPanel lang={lang} />

          <div className="auth-form-panel">
            {/* Back to home */}
            <a href="/" className="auth-back">
              {lang === "ar" ? "› العودة للرئيسية" : "› Back to Home"}
            </a>

            {/* Tabs */}
            {showTabs && (
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => onTabChange("login")}
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Log In"}
                </button>
                <button
                  className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
                  onClick={() => onTabChange("register")}
                >
                  {lang === "ar" ? "حساب جديد" : "Register"}
                </button>
              </div>
            )}

            {/* Heading */}
            <div className="auth-fh auth-panel">
              <h2 className="auth-ftitle">{titles[step]}</h2>
              {subs[step] && <p className="auth-fsub">{subs[step]}</p>}
            </div>

            {/* Page content */}
            <div className="auth-panel">
              {children}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// ─── Step: Register ───────────────────────────────────────────────────────────
function RegisterPage({ lang, onGoToLogin }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
    role: "author",
    institution: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const t = {
    fullName:     lang === "ar" ? "الاسم الكامل *"         : "Full Name *",
    email:        lang === "ar" ? "البريد الإلكتروني *"     : "Email *",
    role:         lang === "ar" ? "الدور"                   : "Role",
    institution:  lang === "ar" ? "المؤسسة / الجامعة"       : "Institution / University",
    bio:          lang === "ar" ? "نبذة شخصية"              : "Short Bio",
    password:     lang === "ar" ? "كلمة المرور *"           : "Password *",
    confirm:      lang === "ar" ? "تأكيد كلمة المرور *"     : "Confirm Password *",
    create:       lang === "ar" ? "إنشاء الحساب"            : "Create Account",
    haveAccount:  lang === "ar" ? "لديك حساب بالفعل؟"       : "Already have an account?",
    signIn:       lang === "ar" ? "تسجيل الدخول"            : "Sign in",
    namePh:       lang === "ar" ? "أدخل اسمك الكامل"        : "Enter your full name",
    emailPh:      lang === "ar" ? "example@email.com"       : "example@email.com",
    instPh:       lang === "ar" ? "مثال: جامعة ASPU"        : "e.g. ASPU University",
    bioPh:        lang === "ar" ? "اكتب نبذة مختصرة عنك..." : "Write a short bio...",
    pwPh:         lang === "ar" ? "أدخل كلمة المرور"        : "Enter password",
    pw2Ph:        lang === "ar" ? "أعد إدخال كلمة المرور"   : "Re-enter password",
    authorOpt:    lang === "ar" ? "كاتب (Author)"           : "Author",
    reviewerOpt:  lang === "ar" ? "مراجع (Reviewer)"        : "Reviewer",
    editorOpt:    lang === "ar" ? "محرر (Editor)"           : "Editor",
    errFields:    lang === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Please fill all required fields.",
    errMatch:     lang === "ar" ? "كلمتا المرور غير متطابقتين."      : "Passwords do not match.",
    errGeneral:   lang === "ar" ? "حدث خطأ أثناء إنشاء الحساب."     : "An error occurred.",
    successMsg:   lang === "ar" ? "تم إنشاء الحساب بنجاح! سيتم توجيهك لتسجيل الدخول..." : "Account created! Redirecting to login...",
  };

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError("");
    if (!form.full_name || !form.email || !form.password) { setError(t.errFields); return; }
    if (form.password !== form.password2) { setError(t.errMatch); return; }
    try {
      setLoading(true);
      const data = await register({
        full_name: form.full_name, email: form.email,
        password: form.password, password2: form.password2,
        role: form.role, institution: form.institution, bio: form.bio,
      });
      setSuccess(data.message || t.successMsg);
      setTimeout(() => onGoToLogin(form.email), 2000);
    } catch (e) {
      const msg = e?.response?.data;
      if (typeof msg === "object") {
        const firstKey = Object.keys(msg)[0];
        const firstVal = Array.isArray(msg[firstKey]) ? msg[firstKey][0] : msg[firstKey];
        setError(typeof firstVal === "string" ? `${firstKey}: ${firstVal}` : t.errGeneral);
      } else {
        setError(t.errGeneral);
      }
    } finally { setLoading(false); }
  };

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" className="auth-input-icon" onClick={onToggle}
      style={{ cursor: "pointer", background: "none", border: "none", padding: "0 12px" }}>
      {show
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div className="auth-fields">
      <ErrorBox message={error} />
      <SuccessBox message={success} />

      <InputBox icon="👤" label={t.fullName} value={form.full_name} onChange={set("full_name")} placeholder={t.namePh} />
      <InputBox icon="✉" label={t.email} type="email" value={form.email} onChange={set("email")} placeholder={t.emailPh} autoComplete="email" />

      <div className="auth-field">
        <label className="auth-label">{t.role}</label>
        <select value={form.role} onChange={(e) => set("role")(e.target.value)} className="auth-select">
          <option value="author">{t.authorOpt}</option>
          <option value="reviewer">{t.reviewerOpt}</option>
          <option value="editor">{t.editorOpt}</option>
        </select>
      </div>

      <InputBox icon="🏛" label={t.institution} value={form.institution} onChange={set("institution")} placeholder={t.instPh} />

      <div className="auth-field">
        <label className="auth-label">{t.bio}</label>
        <textarea value={form.bio} onChange={(e) => set("bio")(e.target.value)}
          placeholder={t.bioPh} rows={3} className="auth-textarea" />
      </div>

      <InputBox icon="🔑" label={t.password} type={showPw ? "text" : "password"}
        value={form.password} onChange={set("password")} placeholder={t.pwPh}
        autoComplete="new-password"
        extra={<EyeBtn show={showPw} onToggle={() => setShowPw(p => !p)} />} />

      <InputBox icon="🔑" label={t.confirm} type={showPw2 ? "text" : "password"}
        value={form.password2} onChange={set("password2")} placeholder={t.pw2Ph}
        autoComplete="new-password"
        extra={<EyeBtn show={showPw2} onToggle={() => setShowPw2(p => !p)} />} />

      <Button onClick={handleSubmit} loading={loading}>{t.create}</Button>

      <p className="auth-switch">
        {t.haveAccount}{" "}
        <span className="auth-switch-link" onClick={() => onGoToLogin("")}>{t.signIn}</span>
      </p>
    </div>
  );
}

// ─── Step: Login ──────────────────────────────────────────────────────────────
function LoginPage({ lang, prefillEmail, onQRRequired, onOTPRequired, onGoToRegister }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const t = {
    email:      lang === "ar" ? "البريد الإلكتروني" : "Email Address",
    password:   lang === "ar" ? "كلمة المرور"        : "Password",
    forgot:     lang === "ar" ? "نسيت كلمة المرور؟"  : "Forgot password?",
    submit:     lang === "ar" ? "دخول"               : "Sign In",
    noAccount:  lang === "ar" ? "طالب جديد؟"         : "New student?",
    createAcc:  lang === "ar" ? "أنشئ حسابك"         : "Create account",
    errEmpty:   lang === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور." : "Please enter your email and password.",
    errCreds:   lang === "ar" ? "بيانات الدخول غير صحيحة." : "Invalid credentials.",
    emailPh:    "example@email.com",
    pwPh:       lang === "ar" ? "كلمة المرور" : "Password",
  };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError(t.errEmpty); return; }
    try {
      setLoading(true);
      const data = await login(email, password);
      if (data.requires_2fa === false) { onQRRequired(); }
      else { onOTPRequired(); }
    } catch (e) {
      const msg = e?.response?.data;
      if (typeof msg === "object") {
        const first = Object.values(msg).flat()[0];
        setError(typeof first === "string" ? first : t.errCreds);
      } else { setError(t.errCreds); }
    } finally { setLoading(false); }
  };

  const EyeBtn = () => (
    <button type="button" className="auth-input-icon" onClick={() => setShowPw(p => !p)}
      style={{ cursor: "pointer", background: "none", border: "none", padding: "0 12px" }}>
      {showPw
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  return (
    <div className="auth-fields">
      <ErrorBox message={error} />
      <InputBox icon="✉" label={t.email} type="email" value={email} onChange={setEmail}
        placeholder={t.emailPh} autoComplete="email" />
      <div className="auth-field">
        <label className="auth-label">{t.password}</label>
        <div className="auth-input-box">
          <span className="auth-input-icon">🔑</span>
          <input type={showPw ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.pwPh} autoComplete="current-password" className="auth-input" />
          <EyeBtn />
        </div>
        <button className="auth-forgot">{t.forgot}</button>
      </div>
      <Button onClick={handleSubmit} loading={loading}>{t.submit}</Button>
      <p className="auth-switch">
        {t.noAccount}{" "}
        <span className="auth-switch-link" onClick={onGoToRegister}>{t.createAcc}</span>
      </p>
    </div>
  );
}

// ─── Step: QR ─────────────────────────────────────────────────────────────────
function QRPage({ lang, onNext }) {
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    enable2FA()
      .then((data) => setQrUrl(data.qr_code_url))
      .catch(() => setError(lang === "ar" ? "تعذّر تحميل رمز QR." : "Failed to load QR code."))
      .finally(() => setLoading(false));
  }, []);

  const steps = lang === "ar"
    ? ["افتح تطبيق Google Authenticator", "اضغط على (+) لإضافة حساب جديد", "امسح رمز QR أعلاه"]
    : ["Open Google Authenticator", "Tap (+) to add a new account", "Scan the QR code above"];

  return (
    <>
      <ErrorBox message={error} />
      <div className="auth-qr-wrapper">
        {loading
          ? <div className="auth-qr-placeholder">⏳ {lang === "ar" ? "جاري تحميل رمز QR..." : "Loading QR..."}</div>
          : qrUrl ? <div className="auth-qr-box"><QRCodeSVG value={qrUrl} size={200} /></div> : null}
        <div className="auth-qr-steps">
          {steps.map((s, i) => (
            <div key={i} className="auth-qr-step">
              <span className="auth-qr-step-num">{i + 1}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={onNext}>
        {lang === "ar" ? "تم المسح ← أدخل رمز التحقق" : "Scanned → Enter Code"}
      </Button>
    </>
  );
}

// ─── Step: OTP ────────────────────────────────────────────────────────────────
function OTPPage({ lang, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError(lang === "ar" ? "يرجى إدخال رمز التحقق المكوّن من 6 أرقام." : "Please enter the 6-digit code."); return; }
    setError("");
    try {
      setLoading(true);
      const data = await confirm2FA(code);
      onSuccess(data);
    } catch (e) {
      const msg = e?.response?.data;
      if (typeof msg === "object") {
        const first = Object.values(msg).flat()[0];
        setError(typeof first === "string" ? first : (lang === "ar" ? "رمز التحقق غير صحيح." : "Invalid code."));
      } else { setError(lang === "ar" ? "رمز التحقق غير صحيح أو منتهي الصلاحية." : "Invalid or expired code."); }
    } finally { setLoading(false); }
  };

  return (
    <>
      <ErrorBox message={error} />
      <div className="auth-otp-row" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`auth-otp-box${digit ? " filled" : ""}`} />
        ))}
      </div>
      <p className="auth-otp-hint">
        {lang === "ar" ? "الرمز يتجدد كل 30 ثانية من تطبيق المصادقة" : "Code refreshes every 30 seconds."}
      </p>
      <Button onClick={handleVerify} loading={loading}>
        {lang === "ar" ? "تحقق والدخول" : "Verify & Sign In"}
      </Button>
    </>
  );
}

// ─── Main Controller ──────────────────────────────────────────────────────────
export default function Auth() {
  const [step, setStep] = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [lang, setLang] = useState("ar");

  const goToLogin = (email) => { setPrefillEmail(email); setStep("login"); };
  const onSuccess = (data) => { setStep("done"); console.log("✅ logged in:", data); };

  const sharedLayout = (content) => (
    <AuthLayout
      lang={lang} setLang={setLang}
      step={step}
      activeTab={step === "register" ? "register" : "login"}
      onTabChange={(t) => setStep(t)}
    >
      {content}
    </AuthLayout>
  );

  if (step === "login") return sharedLayout(
    <LoginPage lang={lang} prefillEmail={prefillEmail}
      onQRRequired={() => setStep("qr")}
      onOTPRequired={() => setStep("otp")}
      onGoToRegister={() => setStep("register")} />
  );

  if (step === "register") return sharedLayout(
    <RegisterPage lang={lang} onGoToLogin={goToLogin} />
  );

  if (step === "qr") return sharedLayout(
    <QRPage lang={lang} onNext={() => setStep("otp")} />
  );

  if (step === "otp") return sharedLayout(
    <OTPPage lang={lang} onSuccess={onSuccess} />
  );

  if (step === "done") return sharedLayout(
    <div className="auth-done">
      <div className="auth-done-ring">✓</div>
      <p className="auth-done-title">{lang === "ar" ? "أهلاً بك في ASPU Insight" : "Welcome to ASPU Insight"}</p>
      <p className="auth-done-desc">{lang === "ar" ? "يمكنك الآن الوصول إلى جميع ميزات المنصة." : "You can now access all platform features."}</p>
    </div>
  );

  return null;
}