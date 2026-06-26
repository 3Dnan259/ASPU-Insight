import { useTranslation } from 'react-i18next';

export default function AccentPanel({ lang }) {
  const { t } = useTranslation();
  const acc = t('auth.accent', { returnObjects: true });

  return (
    <div className="auth-accent">
      <div className="auth-ac-grid" />
      <div className="auth-ac-ring" style={{ width: 380, height: 380, top: -120, right: -100 }} />
      <div className="auth-ac-ring" style={{ width: 180, height: 180, bottom: 70, left: -50 }} />
      <div className="auth-ac-ring" style={{ width: 80, height: 80, bottom: 30, right: 50, borderColor: "rgba(0,0,0,.06)" }} />
      <div className="auth-ac-top">
        <div className="auth-ac-eyebrow">
          <div className="auth-ac-dot" />
          {acc.uni}
        </div>
        <div className="auth-ac-big">ASPU<br /><span className="dim">INSIGHT</span></div>
        <p className="auth-ac-sub">{acc.sub}</p>
      </div>
      <div className="auth-ac-stats">
        <div className="auth-ac-stat"><div className="auth-ac-n">1,240</div><div className="auth-ac-l">{acc.stats.papers}</div></div>
        <div className="auth-ac-stat"><div className="auth-ac-n">380</div><div className="auth-ac-l">{acc.stats.researchers}</div></div>
        <div className="auth-ac-stat"><div className="auth-ac-n">96%</div><div className="auth-ac-l">{acc.stats.integrity}</div></div>
      </div>
    </div>
  );
}