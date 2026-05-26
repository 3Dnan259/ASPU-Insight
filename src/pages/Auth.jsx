import { useState, useRef } from "react";
import "../styling/Auth.css";

/* ── Logo SVG ── */
function Logo() {
  return (
    <svg style={{ width: 34, height: 34, flexShrink: 0 }} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#E8E0D0"/>
      <circle cx="20" cy="19" r="14" fill="none" stroke="#C4A55A" strokeWidth="0.6" opacity="0.5"/>
      <path d="M14,22 Q14,14 20,12 Q26,14 26,22 Q26,28 20,29 Q14,28 14,22 Z" fill="#F5F0E8" stroke="#C4A55A" strokeWidth="0.9"/>
      <line x1="20" y1="12" x2="20" y2="29" stroke="#C4A55A" strokeWidth="1"/>
      <polygon points="20,13 16.5,20 23.5,20" fill="#C4A55A"/>
      <line x1="16.4" y1="20" x2="13" y2="24" stroke="#5A8FA0" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="20" y1="20" x2="20" y2="26" stroke="#C4A55A" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="23.6" y1="20" x2="27" y2="24" stroke="#7A5A30" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="20" cy="13" r="1.5" fill="#B89040"/>
    </svg>
  );
}

/* ── Eye icon ── */
const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const BackArrow = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* ── PW strength ── */
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

/* ════════════════════════════════════════════ */
export default function Auth() {
  const [lang, setLang] = useState("ar");
  const isAr = lang === "ar";
  const dir  = isAr ? "rtl" : "ltr";

  /* tabs */
  const [activeTab, setActiveTab] = useState("login");

  /* login */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw,    setLoginPw]    = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  /* register */
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [uniId,     setUniId]     = useState("");
  const [regEmail,  setRegEmail]  = useState("");
  const [cardImg,   setCardImg]   = useState(null);
  const [regPw,     setRegPw]     = useState("");
  const [regPw2,    setRegPw2]    = useState("");
  const [showRegPw,  setShowRegPw]  = useState(false);
  const [showRegPw2, setShowRegPw2] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);
  const [pwMismatch, setPwMismatch] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  /* success */
  const [success, setSuccess] = useState(false);

  const fileRef = useRef();

  /* ── handlers ── */
  function handleLang(l) {
    setLang(l);
  }

  function handlePwChange(v) {
    setRegPw(v);
    setPwStrength(calcStrength(v));
  }

  function handlePw2Change(v) {
    setRegPw2(v);
    setPwMismatch(v.length > 0 && v !== regPw);
  }

  function handleCardFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCardImg(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      // navigate to home — adjust href as needed
      window.location.href = "aspu_insight_v6.html";
    }, 1400);
  }

  function handleRegister(e) {
    e.preventDefault();
    if (regPw !== regPw2) { setPwMismatch(true); return; }
    setRegLoading(true);
    setTimeout(() => {
      setRegLoading(false);
      setSuccess(true);
    }, 1600);
  }

  /* ── strength bar class ── */
  const barCls = ["", "w", "w", "f", "s"];
  function pwBarClass(idx) {
    const cls = "pwb";
    if (pwStrength === 0 || idx >= pwStrength) return cls;
    return cls + " " + barCls[pwStrength];
  }

  /* ── render ── */
  return (
    <div data-lang={lang} dir={dir}>
      {/* bg circles */}
      <div className="bc bc1" />
      <div className="bc bc2" />

      {/* ── Top bar ── */}
      <header className="topbar">
        <a href="aspu_insight_v6.html" className="tb-logo">
          <Logo />
          <div>
            <div className="tb-ln">ASPU Insight</div>
            <div className="tb-ls ar">المجلة الأكاديمية</div>
            <div className="tb-ls en">Academic Journal</div>
          </div>
        </a>

        <div className="tb-r">
          {/* Language toggle only */}
          <div className="pill">
            <button className={"pb" + (lang === "ar" ? " on" : "")} onClick={() => handleLang("ar")}>ع</button>
            <button className={"pb" + (lang === "en" ? " on" : "")} onClick={() => handleLang("en")}>EN</button>
          </div>
        </div>
      </header>

      {/* ── Page ── */}
      <main className="page">
        <div className="container">

          {/* ── Accent panel ── */}
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
              <div className="ac-big">
                ASPU<br /><span className="dim">INSIGHT</span>
              </div>
              <p className="ac-sub ar">المجلة الأكاديمية الرقمية لأبحاث ومشاريع طلبة كلية الهندسة المعلوماتية.</p>
              <p className="ac-sub en">The digital academic journal for research and projects of the Informatics Engineering faculty.</p>
            </div>

            <div className="ac-stats">
              <div className="ac-stat">
                <div className="ac-n">1,240</div>
                <div className="ac-l ar">بحث</div><div className="ac-l en">Papers</div>
              </div>
              <div className="ac-stat">
                <div className="ac-n">380</div>
                <div className="ac-l ar">باحث</div><div className="ac-l en">Researchers</div>
              </div>
              <div className="ac-stat">
                <div className="ac-n">96%</div>
                <div className="ac-l ar">نزاهة</div><div className="ac-l en">Integrity</div>
              </div>
            </div>
          </div>

          {/* ── Form panel ── */}
          <div className="form-panel">
            <a href="/" className="back">
              <BackArrow />
              <span className="ar">العودة للرئيسية</span>
              <span className="en">Back to Home</span>
            </a>

            {/* Tabs */}
            <div className="tabs">
              <button className={"tab" + (activeTab === "login" ? " on" : "")} onClick={() => setActiveTab("login")}>
                <span className="ar">تسجيل الدخول</span><span className="en">Log In</span>
              </button>
              <button className={"tab" + (activeTab === "register" ? " on" : "")} onClick={() => setActiveTab("register")}>
                <span className="ar">حساب جديد</span><span className="en">Register</span>
              </button>
            </div>

            {/* ══ LOGIN ══ */}
            {activeTab === "login" && !success && (
              <div className="panel">
                <div className="fh">
                  <h2 className="ftitle ar">مرحباً بعودتك</h2>
                  <h2 className="ftitle en">Welcome back</h2>
                  <p className="fsub ar">أدخل بياناتك للوصول إلى حسابك.</p>
                  <p className="fsub en">Enter your credentials to access your account.</p>
                </div>

                <form className="fields" onSubmit={handleLogin}>
                  {/* Email */}
                  <div className="field">
                    <label className="flabel ar">البريد الإلكتروني</label>
                    <label className="flabel en">Email Address</label>
                    <div className="fbox">
                      <span className="fico">✉</span>
                      <input
                        className="finp"
                        type="email"
                        required
                        placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field">
                    <label className="flabel ar">كلمة المرور</label>
                    <label className="flabel en">Password</label>
                    <div className="fbox">
                      <span className="fico">🔑</span>
                      <input
                        className="finp"
                        type={showLoginPw ? "text" : "password"}
                        required
                        placeholder={isAr ? "كلمة المرور" : "Password"}
                        value={loginPw}
                        onChange={e => setLoginPw(e.target.value)}
                      />
                      <button type="button" className="feye" tabIndex={-1} onClick={() => setShowLoginPw(v => !v)}>
                        {showLoginPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    <a
                      href="#"
                      style={{ fontSize: 11, color: "var(--tx3)", textDecoration: "none", alignSelf: "flex-end" }}
                      onMouseOver={e => e.target.style.color = "var(--ac)"}
                      onMouseOut={e  => e.target.style.color = "var(--tx3)"}
                    >
                      <span className="ar">نسيت كلمة المرور؟</span>
                      <span className="en">Forgot password?</span>
                    </a>
                  </div>

                  <button type="submit" className="btn" disabled={loginLoading}>
                    {loginLoading
                      ? <><span className="ar">جارٍ التحقق...</span><span className="en">Verifying...</span></>
                      : <><span className="ar">دخول</span><span className="en">Sign In</span><span className="barr">→</span></>
                    }
                  </button>
                </form>

                <div className="fswitch">
                  <span className="ar">طالب جديد؟ <a href="#" onClick={e => { e.preventDefault(); setActiveTab("register"); }}>أنشئ حسابك</a></span>
                  <span className="en">New student? <a href="#" onClick={e => { e.preventDefault(); setActiveTab("register"); }}>Create account</a></span>
                </div>
              </div>
            )}

            {/* ══ REGISTER ══ */}
            {activeTab === "register" && !success && (
              <div className="panel">
                <div className="fh">
                  <h2 className="ftitle ar">تسجيل طالب جديد</h2>
                  <h2 className="ftitle en">Student Registration</h2>
                  <p className="fsub ar">أدخل بياناتك الجامعية للانضمام إلى ASPU Insight.</p>
                  <p className="fsub en">Enter your university details to join ASPU Insight.</p>
                </div>

                <form className="fields" onSubmit={handleRegister}>

                  {/* First name */}
                  <div className="field">
                    <label className="flabel ar">الاسم الأول</label>
                    <label className="flabel en">First Name</label>
                    <div className="fbox">
                      <input
                        className="finp"
                        type="text"
                        required
                        style={{ paddingInlineStart: 13 }}
                        placeholder={isAr ? "سارة" : "Sara"}
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Last name */}
                  <div className="field">
                    <label className="flabel ar">الاسم الأخير</label>
                    <label className="flabel en">Last Name</label>
                    <div className="fbox">
                      <input
                        className="finp"
                        type="text"
                        required
                        style={{ paddingInlineStart: 13 }}
                        placeholder={isAr ? "الأحمد" : "Ahmad"}
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* University ID */}
                  <div className="field">
                    <label className="flabel ar">الرقم الجامعي</label>
                    <label className="flabel en">University ID</label>
                    <div className="fbox">
                      <span className="fico">🪪</span>
                      <input
                        className="finp"
                        type="text"
                        required
                        pattern="[0-9]{6,12}"
                        placeholder={isAr ? "مثال: 2024001234" : "e.g. 2024001234"}
                        value={uniId}
                        onChange={e => setUniId(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="field">
                    <label className="flabel ar">البريد الإلكتروني</label>
                    <label className="flabel en">Email Address</label>
                    <div className="fbox">
                      <span className="fico">✉</span>
                      <input
                        className="finp"
                        type="email"
                        required
                        placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Card photo */}
                  <div className="field">
                    <label className="flabel ar">صورة الهوية الجامعية</label>
                    <label className="flabel en">University Card Photo</label>
                    <label className="card-up">
                      <input type="file" accept="image/*" ref={fileRef} onChange={handleCardFile} required />
                      {cardImg
                        ? <img className="cu-prev" src={cardImg} alt="" style={{ display: "block" }} />
                        : <>
                            <span className="cu-ico">🪪</span>
                            <span className="cu-t ar">اسحب الصورة هنا أو اضغط للاختيار</span>
                            <span className="cu-t en">Drag & drop or click to upload</span>
                          </>
                      }
                      <span className="cu-s ar">JPG أو PNG — أقصى 5 ميغابايت</span>
                      <span className="cu-s en">JPG or PNG — Max 5 MB</span>
                    </label>
                  </div>

                  {/* Password */}
                  <div className="field">
                    <label className="flabel ar">كلمة المرور</label>
                    <label className="flabel en">Password</label>
                    <div className="fbox">
                      <span className="fico">🔑</span>
                      <input
                        className="finp"
                        type={showRegPw ? "text" : "password"}
                        required
                        placeholder={isAr ? "8 أحرف على الأقل" : "At least 8 characters"}
                        value={regPw}
                        onChange={e => handlePwChange(e.target.value)}
                      />
                      <button type="button" className="feye" tabIndex={-1} onClick={() => setShowRegPw(v => !v)}>
                        {showRegPw ? <EyeOff /> : <EyeOn />}
                      </button>
                    </div>
                    <div className="pwbars">
                      {[0,1,2,3].map(i => <div key={i} className={pwBarClass(i)} />)}
                    </div>
                    <div className="pwhint">
                      <span className="ar">{STR_LABELS.ar[pwStrength]}</span>
                      <span className="en">{STR_LABELS.en[pwStrength]}</span>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="field">
                    <label className="flabel ar">تأكيد كلمة المرور</label>
                    <label className="flabel en">Confirm Password</label>
                    <div className="fbox" style={pwMismatch ? { borderColor: "#C0542A" } : {}}>
                      <span className="fico">🔑</span>
                      <input
                        className="finp"
                        type={showRegPw2 ? "text" : "password"}
                        required
                        placeholder={isAr ? "أعد كلمة المرور" : "Re-enter password"}
                        value={regPw2}
                        onChange={e => handlePw2Change(e.target.value)}
                      />
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
                      ? <><span className="ar">جارٍ إرسال الطلب...</span><span className="en">Sending request...</span></>
                      : <><span className="ar">إنشاء الحساب</span><span className="en">Create Account</span><span className="barr">→</span></>
                    }
                  </button>
                </form>

                <div className="fswitch">
                  <span className="ar">لديك حساب؟ <a href="#" onClick={e => { e.preventDefault(); setActiveTab("login"); }}>سجّل دخولك</a></span>
                  <span className="en">Have an account? <a href="#" onClick={e => { e.preventDefault(); setActiveTab("login"); }}>Sign in</a></span>
                </div>
              </div>
            )}

            {/* ══ SUCCESS ══ */}
            {success && (
              <div className="success show">
                <div className="sring">✓</div>
                <div className="stitle ar">تم التسجيل!</div>
                <div className="stitle en">Registration Sent!</div>
                <p className="sdesc ar">سيتم مراجعة بياناتك والتحقق من هويتك الجامعية. ستتلقى إشعاراً عند تفعيل حسابك.</p>
                <p className="sdesc en">Your details will be reviewed and your university card verified. You'll be notified when your account is activated.</p>
                <a href="aspu_insight_v6.html" className="btn" style={{ textDecoration: "none", maxWidth: 260, marginTop: 6 }}>
                  <span className="ar">الرئيسية</span><span className="en">Home</span><span className="barr">→</span>
                </a>
              </div>
            )}

          </div>{/* /form-panel */}
        </div>{/* /container */}
      </main>
    </div>
  );
}