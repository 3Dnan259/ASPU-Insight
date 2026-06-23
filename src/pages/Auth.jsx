import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as apiRegister, requestPasswordReset, verifyEmail } from "../api/auth";
import "../styling/Auth.css";
import Logo from "../components/Logo";
import { Ara, Eng } from "../i18n";

const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const BackArrow = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function calcStrength(v) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Za-z\u0600-\u06FF]/.test(v) && /[0-9]/.test(v)) s++;
  if (v.length >= 12) s++;
  if (/[^A-Za-z0-9\u0600-\u06FF]/.test(v)) s++;
  return s;
}
const STR_LABELS = {
  ar: ["أدخل كلمة مرور", "ضعيفة", "ضعيفة", "مقبولة", "قوية"],
  en: ["Enter a password", "Weak", "Weak", "Fair", "Strong"],
};

export default function Auth() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, error: authError, clearError } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const [lang, setLang]       = useState("ar");
  const isAr = lang === "ar";
  const texts = isAr ? Ara : Eng;

  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail,   setLoginEmail]   = useState("");
  const [loginPw,      setLoginPw]      = useState("");
  const [showLoginPw,  setShowLoginPw]  = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError,   setLoginError]   = useState("");

  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [regEmail,    setRegEmail]    = useState("");
  const [regPw,       setRegPw]       = useState("");
  const [regPw2,      setRegPw2]      = useState("");
  const [showRegPw,   setShowRegPw]   = useState(false);
  const [showRegPw2,  setShowRegPw2]  = useState(false);
  const [pwStrength,  setPwStrength]  = useState(0);
  const [pwMismatch,  setPwMismatch]  = useState(false);
  const [regLoading,  setRegLoading]  = useState(false);
  const [regError,    setRegError]    = useState("");
  const [regSuccess,  setRegSuccess]  = useState(false);

  const [showForgot,      setShowForgot]      = useState(false);
  const [forgotEmail,     setForgotEmail]     = useState("");
  const [forgotLoading,   setForgotLoading]   = useState(false);
  const [forgotSuccess,   setForgotSuccess]   = useState(false);
  const [forgotError,     setForgotError]     = useState("");

  function handlePwChange(v) {
    setRegPw(v);
    setPwStrength(calcStrength(v));
  }

  function handlePw2Change(v) {
    setRegPw2(v);
    setPwMismatch(v.length > 0 && v !== regPw);
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setLoginError("");
    setRegError("");
    clearError();
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const data = await login(loginEmail, loginPw);

      if (data.requires_2fa === false) {
        navigate("/setup-2fa", {
          state: { lang, from },
          replace: true,
        });
      } else {
        navigate("/verify-otp", {
          state: { lang, from },
          replace: true,
        });
      }
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.values(data).flat().join(" ")
        : (isAr ? "فشل تسجيل الدخول. تحقق من بياناتك." : "Login failed. Check your credentials.");
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (regPw !== regPw2) { setPwMismatch(true); return; }
    setRegError("");
    setRegLoading(true);
    try {
      await apiRegister({
        full_name: `${firstName} ${lastName}`.trim(),
        email: regEmail,
        password: regPw,
        password2: regPw2,
        role: "author",
      });
      setRegSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      const msg = data
        ? Object.values(data).flat().join(" ")
        : (isAr ? "فشل إنشاء الحساب. حاول مرة أخرى." : "Registration failed. Please try again.");
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      await requestPasswordReset(forgotEmail);
      setForgotSuccess(true);
    } catch {
      setForgotError(isAr ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  const barCls = ["", "w", "w", "f", "s"];
  function pwBarClass(idx) {
    const cls = "pwb";
    if (pwStrength === 0 || idx >= pwStrength) return cls;
    return cls + " " + barCls[pwStrength];
  }

  return (
    <div data-lang={lang} dir={isAr ? "rtl" : "ltr"}>
      <div className="bc bc1" />
      <div className="bc bc2" />

      <header className="topbar">
        <a href="/" className="tb-logo">
          <Logo />
          <div>
            <div className="tb-ln">ASPU Insight</div>
            <div className="tb-ls">{texts.shared.secondaryLogoTagline}</div>
          </div>
        </a>
        <div className="tb-r">
          <div className="pill">
            <button className={"pb" + (lang === "ar" ? " on" : "")} onClick={() => setLang("ar")}>ع</button>
            <button className={"pb" + (lang === "en" ? " on" : "")} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="container">

          <div className="accent">
            <div className="ac-grid" />
            <div className="ac-ring" style={{ width: 380, height: 380, top: -120, right: -100 }} />
            <div className="ac-ring" style={{ width: 180, height: 180, bottom: 70, left: -50 }} />
            <div className="ac-ring" style={{ width: 80, height: 80, bottom: 30, right: 50, borderColor: "rgba(0,0,0,.06)" }} />
            <div className="ac-top">
              <div className="ac-eyebrow">
                <div className="ac-dot" />
                <span className="ar">جامعة الشام الخاصة</span>
                <span className="en">Al-Sham Private University</span>
              </div>
              <div className="ac-big">ASPU<br /><span className="dim">INSIGHT</span></div>
              <p className="ac-sub ar">المجلة الأكاديمية الرقمية لأبحاث ومشاريع طلبة كلية الهندسة المعلوماتية.</p>
              <p className="ac-sub en">The digital academic journal for research and projects of the Informatics Engineering faculty.</p>
            </div>
            <div className="ac-stats">
              <div className="ac-stat"><div className="ac-n">1,240</div><div className="ac-l ar">بحث</div><div className="ac-l en">Papers</div></div>
              <div className="ac-stat"><div className="ac-n">380</div><div className="ac-l ar">باحث</div><div className="ac-l en">Researchers</div></div>
              <div className="ac-stat"><div className="ac-n">96%</div><div className="ac-l ar">نزاهة</div><div className="ac-l en">Integrity</div></div>
            </div>
          </div>

          <div className="form-panel">
            <a href="/" className="back"><BackArrow /><span className="ar">العودة للرئيسية</span><span className="en">Back to Home</span></a>

            <div className="tabs">
              <button className={"tab" + (activeTab === "login" ? " on" : "")} onClick={() => switchTab("login")}>
                <span className="ar">تسجيل الدخول</span><span className="en">Log In</span>
              </button>
              <button className={"tab" + (activeTab === "register" ? " on" : "")} onClick={() => switchTab("register")}>
                <span className="ar">حساب جديد</span><span className="en">Register</span>
              </button>
            </div>

            {activeTab === "login" && !showForgot && (
              <div className="panel">
                <div className="fh">
                  <h2 className="ftitle ar">مرحباً بعودتك</h2>
                  <h2 className="ftitle en">Welcome back</h2>
                  <p className="fsub ar">أدخل بياناتك للوصول إلى حسابك.</p>
                  <p className="fsub en">Enter your credentials to access your account.</p>
                </div>

                {(loginError || authError) && (
                  <div className="ferr-box">{loginError || authError}</div>
                )}

                <form className="fields" onSubmit={handleLogin}>
                  <div className="field">
                    <label className="flabel ar">البريد الإلكتروني</label>
                    <label className="flabel en">Email Address</label>
                    <div className="fbox">
                      <span className="fico">✉</span>
                      <input className="finp" type="email" required
                        placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                        value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="flabel ar">كلمة المرور</label>
                    <label className="flabel en">Password</label>
                    <div className="fbox">
                      <span className="fico">🔑</span>
                      <input className="finp" type={showLoginPw ? "text" : "password"} required
                        placeholder={isAr ? "كلمة المرور" : "Password"}
                        value={loginPw} onChange={e => setLoginPw(e.target.value)} />
                      <button type="button" className="feye" tabIndex={-1} onClick={() => setShowLoginPw(v => !v)}>
                        {showLoginPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    <a href="#" style={{ fontSize: 11, color: "var(--tx3)", textDecoration: "none", alignSelf: "flex-end" }}
                      onClick={e => { e.preventDefault(); setShowForgot(true); setForgotSuccess(false); setForgotError(""); }}>
                      <span className="ar">نسيت كلمة المرور؟</span>
                      <span className="en">Forgot password?</span>
                    </a>
                  </div>

                  <button type="submit" className="btn" disabled={loginLoading}>
                    {loginLoading
                      ? <><span className="ar">جارٍ التحقق...</span><span className="en">Verifying...</span></>
                      : <><span className="ar">دخول</span><span className="en">Sign In</span><span className="barr">→</span></>}
                  </button>
                </form>

                <div className="fswitch">
                  <span className="ar">طالب جديد؟ <a href="#" onClick={e => { e.preventDefault(); switchTab("register"); }}>أنشئ حسابك</a></span>
                  <span className="en">New student? <a href="#" onClick={e => { e.preventDefault(); switchTab("register"); }}>Create account</a></span>
                </div>
              </div>
            )}

            {activeTab === "login" && showForgot && (
              <div className="panel">
                <div className="fh">
                  <h2 className="ftitle ar">إعادة تعيين كلمة المرور</h2>
                  <h2 className="ftitle en">Reset Password</h2>
                  <p className="fsub ar">أدخل بريدك وسنرسل لك رابط الاسترداد.</p>
                  <p className="fsub en">Enter your email and we'll send a reset link.</p>
                </div>

                {forgotError && <div className="ferr-box">{forgotError}</div>}

                {forgotSuccess ? (
                  <div className="success show" style={{ padding: "20px 0" }}>
                    <div className="sring">✓</div>
                    <p className="ar" style={{ textAlign: "center", color: "var(--tx2)" }}>تم الإرسال! تحقق من بريدك الإلكتروني.</p>
                    <p className="en" style={{ textAlign: "center", color: "var(--tx2)" }}>Sent! Check your inbox.</p>
                  </div>
                ) : (
                  <form className="fields" onSubmit={handleForgot}>
                    <div className="field">
                      <label className="flabel ar">البريد الإلكتروني</label>
                      <label className="flabel en">Email Address</label>
                      <div className="fbox">
                        <span className="fico">✉</span>
                        <input className="finp" type="email" required
                          placeholder={isAr ? "بريدك الإلكتروني" : "Your email"}
                          value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="btn" disabled={forgotLoading}>
                      {forgotLoading
                        ? <><span className="ar">جارٍ الإرسال...</span><span className="en">Sending...</span></>
                        : <><span className="ar">إرسال رابط الاسترداد</span><span className="en">Send Reset Link</span><span className="barr">→</span></>}
                    </button>
                  </form>
                )}

                <div className="fswitch">
                  <a href="#" onClick={e => { e.preventDefault(); setShowForgot(false); }}>
                    <span className="ar">← العودة لتسجيل الدخول</span>
                    <span className="en">← Back to login</span>
                  </a>
                </div>
              </div>
            )}

            {activeTab === "register" && !regSuccess && (
              <div className="panel">
                <div className="fh">
                  <h2 className="ftitle ar">تسجيل مستخدم جديد</h2>
                  <h2 className="ftitle en">Create Account</h2>
                  <p className="fsub ar">أدخل بياناتك للانضمام إلى ASPU Insight.</p>
                  <p className="fsub en">Enter your details to join ASPU Insight.</p>
                </div>

                {regError && <div className="ferr-box">{regError}</div>}

                <form className="fields" onSubmit={handleRegister}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                      <label className="flabel ar">الاسم الأول</label>
                      <label className="flabel en">First Name</label>
                      <div className="fbox">
                        <input className="finp" type="text" required style={{ paddingInlineStart: 13 }}
                          placeholder={isAr ? "سارة" : "Sara"}
                          value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                    </div>
                    <div className="field">
                      <label className="flabel ar">الاسم الأخير</label>
                      <label className="flabel en">Last Name</label>
                      <div className="fbox">
                        <input className="finp" type="text" required style={{ paddingInlineStart: 13 }}
                          placeholder={isAr ? "الأحمد" : "Ahmad"}
                          value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="flabel ar">البريد الإلكتروني</label>
                    <label className="flabel en">Email Address</label>
                    <div className="fbox">
                      <span className="fico">✉</span>
                      <input className="finp" type="email" required
                        placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                        value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="flabel ar">كلمة المرور</label>
                    <label className="flabel en">Password</label>
                    <div className="fbox">
                      <span className="fico">🔑</span>
                      <input className="finp" type={showRegPw ? "text" : "password"} required
                        placeholder={isAr ? "8 أحرف على الأقل" : "At least 8 characters"}
                        value={regPw} onChange={e => handlePwChange(e.target.value)} />
                      <button type="button" className="feye" tabIndex={-1} onClick={() => setShowRegPw(v => !v)}>
                        {showRegPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    <div className="pwbars">{[0,1,2,3].map(i => <div key={i} className={pwBarClass(i)} />)}</div>
                    <div className="pwhint">
                      <span className="ar">{STR_LABELS.ar[pwStrength]}</span>
                      <span className="en">{STR_LABELS.en[pwStrength]}</span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="flabel ar">تأكيد كلمة المرور</label>
                    <label className="flabel en">Confirm Password</label>
                    <div className="fbox" style={pwMismatch ? { borderColor: "#C0542A" } : {}}>
                      <span className="fico">🔑</span>
                      <input className="finp" type={showRegPw2 ? "text" : "password"} required
                        placeholder={isAr ? "أعد كلمة المرور" : "Re-enter password"}
                        value={regPw2} onChange={e => handlePw2Change(e.target.value)} />
                      <button type="button" className="feye" tabIndex={-1} onClick={() => setShowRegPw2(v => !v)}>
                        {showRegPw2 ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    {pwMismatch && (
                      <span className="ferr" style={{ display: "block" }}>
                        <span className="ar">كلمتا المرور غير متطابقتين</span>
                        <span className="en">Passwords do not match</span>
                      </span>
                    )}
                  </div>

                  <button type="submit" className="btn" disabled={regLoading}>
                    {regLoading
                      ? <><span className="ar">جارٍ إنشاء الحساب...</span><span className="en">Creating account...</span></>
                      : <><span className="ar">إنشاء الحساب</span><span className="en">Create Account</span><span className="barr">→</span></>}
                  </button>
                </form>

                <div className="fswitch">
                  <span className="ar">لديك حساب؟ <a href="#" onClick={e => { e.preventDefault(); switchTab("login"); }}>سجّل دخولك</a></span>
                  <span className="en">Have an account? <a href="#" onClick={e => { e.preventDefault(); switchTab("login"); }}>Sign in</a></span>
                </div>
              </div>
            )}

            {activeTab === "register" && regSuccess && (
              <div className="success show">
                <div className="sring">✓</div>
                <div className="stitle ar">تم إنشاء الحساب!</div>
                <div className="stitle en">Account Created!</div>
                <p className="sdesc ar">تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى تأكيد بريدك قبل تسجيل الدخول.</p>
                <p className="sdesc en">A confirmation link was sent to your email. Please verify before signing in.</p>
                {/* ✅ التعديل هون: بدل navigate(from) صار يروح لتبويب تسجيل الدخول */}
                <button className="btn" style={{ maxWidth: 260, marginTop: 6 }}
                  onClick={() => { setRegSuccess(false); switchTab("login"); }}>
                  <span className="ar">الذهاب لتسجيل الدخول</span>
                  <span className="en">Go to Login</span>
                  <span className="barr">→</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}