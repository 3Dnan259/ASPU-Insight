// SetupTwoFA.jsx
// صفحة اسكان الـ QR — أول مرة فقط
// بعد الاسكان المستخدم يضغط "متابعة" وبيروح ع صفحة OTP
// ✏️ تعديل: تخطيط عمودين (QR يمين / تعليمات + زر يسار) — راجع setup-2fa-split.css

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";
import { enable2FA } from "../api/auth";
import Logo from "../components/Logo";
import { Ara, Eng } from "../i18n";

export default function SetupTwoFA() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const lang      = location.state?.lang || "ar";
  const isAr      = lang === "ar";
  const texts     = isAr ? Ara : Eng;

  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secret,    setSecret]    = useState("");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    async function loadQR() {
      try {
        const res = await enable2FA();
        // res.qr_code_url = "otpauth://totp/..."
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, res.qr_code_url, { width: 200, margin: 2 });
        setQrDataUrl(canvas.toDataURL());
        setSecret(res.secret);
      } catch (err) {
        setError(
          isAr
            ? "فشل تحميل رمز QR. حاول مرة أخرى."
            : "Failed to load QR code. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
    loadQR();
  }, []);

  function handleContinue() {
    navigate("/verify-otp", { state: { lang } });
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
      </header>

      <main className="page">
        {/* maxWidth الأصلي (480) شيلناه من هون، صار يتحكم فيه split-layout بالـ CSS */}
        <div className="container" style={{ justifyContent: "center" }}>
          <div className="form-panel split-layout">

            <div className="panel split-panel">

              {/* الهيدر يمتد فوق العمودين */}
              <div className="fh split-header">
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "linear-gradient(135deg,#C4A55A22,#C4A55A44)",
                  border: "1.5px solid #C4A55A55",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, marginBottom: 14,
                  ...(isAr ? { marginRight: "auto" } : { marginLeft: "auto" }),
                }}>🔐</div>
                <h2 className="ftitle ar">إعداد التحقق الثنائي</h2>
                <h2 className="ftitle en">Set Up Two-Factor Auth</h2>
                <p className="fsub ar">افتح تطبيق Google Authenticator واسكن الرمز أدناه لربط حسابك.</p>
                <p className="fsub en">Open Google Authenticator and scan the code below to link your account.</p>
              </div>

              {error && (
                <div className="split-error-wrap">
                  <div className="ferr-box">{error}</div>
                </div>
              )}

              {/* العمود الأول (يمين في RTL): QR */}
              <div className="split-col-qr">
                {loading ? (
                  <div style={{
                    width: 180, height: 180, borderRadius: 12,
                    background: "var(--s1, #fff)", border: "1.5px solid var(--br)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--tx3)", fontSize: 13,
                  }}>
                    <span className="ar">جارٍ التحميل...</span>
                    <span className="en">Loading...</span>
                  </div>
                ) : qrDataUrl ? (
                  <>
                    <div className="qr-box">
                      <img src={qrDataUrl} alt="QR Code" width={180} height={180} />
                    </div>

                    {/* المفتاح اليدوي */}
                    <div className="secret-box">
                      <div style={{ fontSize: 10, color: "var(--tx3)", marginBottom: 4 }}>
                        <span className="ar">أو أدخل هذا المفتاح يدوياً</span>
                        <span className="en">Or enter this key manually</span>
                      </div>
                      <code>{secret}</code>
                    </div>
                  </>
                ) : null}
              </div>

              {/* العمود الثاني (يسار في RTL): التعليمات + الزر */}
              <div className="split-col-info">
                <div className="steps-box">
                  <div className="ar" style={{ lineHeight: 2 }}>
                    <div>١. افتح تطبيق <strong>Google Authenticator</strong></div>
                    <div>٢. اضغط على <strong>＋</strong> ثم "سكان رمز QR"</div>
                    <div>٣. سكن الرمز المجاور</div>
                    <div>٤. اضغط "متابعة" أدناه وأدخل الرمز المؤقت</div>
                  </div>
                  <div className="en" style={{ lineHeight: 2 }}>
                    <div>1. Open <strong>Google Authenticator</strong></div>
                    <div>2. Tap <strong>＋</strong> then "Scan a QR code"</div>
                    <div>3. Scan the code shown beside</div>
                    <div>4. Tap "Continue" below and enter the 6-digit code</div>
                  </div>
                </div>

                <button
                  className="btn"
                  onClick={handleContinue}
                  disabled={loading || !!error}
                >
                  <span className="ar">متابعة لإدخال الرمز</span>
                  <span className="en">Continue to Enter Code</span>
                  <span className="barr">→</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}