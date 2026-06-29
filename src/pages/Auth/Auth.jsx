import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import AuthLayout from "../../components/AuthLayout";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import QRPage from "./Auth/QRPage";
import OTPPage from "./Auth/OTPPage";
import "../../styling/auth.css";
export default function Auth() {
  const [step, setStep] = useState("login");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [preAuthToken, setPreAuthToken] = useState(null);
  const [lang, setLang] = useState("ar");
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const goToLogin = (email) => { setPrefillEmail(email); setStep("login"); };
  const onSuccess = (data) => {
    setStep("done");
    setTimeout(() => window.location.href = "/", 2000);
  };

  const sharedLayout = (content) => (
    <AuthLayout
      lang={lang} setLang={setLang}
      step={step}
      activeTab={step === "register" ? "register" : "login"}
      onTabChange={(tab) => setStep(tab)}
    >
      {content}
    </AuthLayout>
  );

  if (step === "login") return sharedLayout(
    <LoginPage lang={lang} prefillEmail={prefillEmail}
      onQRRequired={() => setStep("qr")}
      onOTPRequired={(token) => { setPreAuthToken(token); setStep("otp"); }}
      onGoToRegister={() => setStep("register")} />
  );

  if (step === "register") return sharedLayout(
    <RegisterPage lang={lang} onGoToLogin={goToLogin} />
  );

  if (step === "qr") return sharedLayout(
    <QRPage lang={lang} onNext={() => setStep("otp")} />
  );

  if (step === "otp") return sharedLayout(
    <OTPPage lang={lang} preAuthToken={preAuthToken} onSuccess={onSuccess} />
  );

  if (step === "done") return sharedLayout(
    <div className="auth-done">
      <div className="auth-done-ring">✓</div>
      <p className="auth-done-title">{t('auth.done.title')}</p>
      <p className="auth-done-desc">{t('auth.done.desc')}</p>
    </div>
  );

  return null;
}