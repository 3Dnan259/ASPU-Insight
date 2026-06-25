import '../styling/Navbar.css'; 
import { isAuthenticated, logout } from '../api/auth'; 
import { useNavigate } from 'react-router-dom'; 
import { Ara, Eng } from '../i18n';

// ══ MENU ITEMS — ثابتة وتظهر دائماً بالترتيب الكامل ══
const MENU_ITEMS = [
  { key: "home",         num: "01", href: "/" },
  { key: "research",     num: "02", href: "/research_review" },
  { key: "researchers",  num: "03", href: "#" },
  { key: "integrity",    num: "04", href: "#" },
  { key: "contact",      num: "05", href: "#" },
  { key: "profile",      num: "06", href: "/Profile" },
  { key: "submit",       num: "07", href: "/submit" }, 
];

export default function Navbar({ 
  menuOpen, 
  setMenuOpen, 
  theme, 
  setTheme, 
  lang, 
  setLang, 
  hoveredMenu, 
  setHoveredMenu, 
  scrolled, 
  isAr, 
  menuT, 
  navT, 
  Logo, 
}) { 
  const loggedIn = isAuthenticated(); 
  const navigate = useNavigate(); 

  // القائمة كاملة دائماً بدون حذف أي عنصر
  const visibleMenuItems = MENU_ITEMS;

  const handleLogout = async () => { 
    await logout(); 
    setMenuOpen(false); 
    navigate('/'); 
  }; 

  // دالة حماية الروابط عند الضغط
  const handleLinkClick = (e, href, key) => {
    // إذا كبس على البروفايل أو النشر وماله مسجل دخول، منمنع الانتقال الافتراضي ومنشحطه عالـ auth
    if ((key === "profile" || key === "submit") && !loggedIn) {
      e.preventDefault(); // منع الرابط الأصلي
      setMenuOpen(false); // تسكير المنيو
      navigate('/auth');  // توجيه لصفحة تسجيل الدخول
    } else {
      // إذا أموره تمام أو عم يكبس على روابط تانية، بس بسكر المنيو وبيكمل طريقه
      setMenuOpen(false);
    }
  };

  return ( 
    <> 
      <div className={`aspu-menu${menuOpen ? " open" : ""}`}> 
        <div className={`aspu-menu-top${menuOpen ? " visible" : ""}`}> 
          <div className="aspu-menu-logo-row"> 
            <Logo size={36} /> 
            <div> 
              <div className="aspu-menu-ln">ASPU Insight</div> 
              <div className="aspu-menu-ls"> 
                {(isAr ? Ara : Eng).shared.logoTagline} 
              </div> 
            </div> 
          </div> 
          <button className="aspu-menu-close-btn" onClick={() => setMenuOpen(false)}> 
            {navT.close} 
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"> 
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /> 
            </svg> 
          </button> 
        </div> 

        <div className="aspu-menu-body"> 
          <div className={`aspu-menu-links${hoveredMenu !== null ? " has-hover" : ""}`}> 
            {visibleMenuItems.map((item, i) => ( 
              <div key={item.key} className="aspu-ml-wrap"> 
                <a 
                  className={[ 
                    "aspu-menu-link", 
                    menuOpen ? "entering" : "", 
                    hoveredMenu === i ? "hov" : "", 
                  ].filter(Boolean).join(" ")} 
                  style={{ transitionDelay: menuOpen ? `${i * 0.07}s` : "0s" }} 
                  href={item.href} 
                  onMouseEnter={() => setHoveredMenu(i)} 
                  onMouseLeave={() => setHoveredMenu(null)} 
                  onClick={(e) => handleLinkClick(e, item.href, item.key)} // ربط الدالة هون لحماية الرابط
                > 
                  <div className="aspu-ml-row"> 
                    <span className="aspu-ml-name">{menuT[item.key]}</span> 
                    <span className="aspu-ml-num">{item.num}</span> 
                  </div> 
                  <span className="aspu-ml-sub">{menuT.explore}</span> 
                </a> 
              </div> 
            ))} 
          </div> 

          <div className="aspu-menu-preview"> 
            <div className={`aspu-preview-inner${hoveredMenu !== null ? " show" : ""}`}> 
              <div className="aspu-preview-ring"> 
                <div className="aspu-preview-ring-spin" /> 
                <Logo size={52} /> 
              </div> 
              <div className="aspu-preview-divider" /> 
              <div className="aspu-preview-name"> 
                {hoveredMenu !== null ? menuT[visibleMenuItems[hoveredMenu].key] : "ASPU"} 
              </div> 
              <div className="aspu-preview-tag">ASPU Insight</div> 
            </div> 
          </div> 
        </div> 

        <div className={`aspu-menu-foot${menuOpen ? " visible" : ""}`}> 
          <span className="aspu-mf-label">{menuT.appearance}</span> 
          <div className="aspu-menu-tpill"> 
            <button className={`aspu-mtp-btn${theme === "dark" ? " on" : ""}`} onClick={() => setTheme("dark")} > 🌙 </button> 
            <button className={`aspu-mtp-btn${theme === "light" ? " on" : ""}`} onClick={() => setTheme("light")} > ☀️ </button> 
          </div> 
          <div className="aspu-menu-tpill"> 
            <button className={`aspu-mtp-btn${lang === "ar" ? " on" : ""}`} onClick={() => setLang("ar")} > ع </button> 
            <button className={`aspu-mtp-btn${lang === "en" ? " on" : ""}`} onClick={() => setLang("en")} > EN </button> 
          </div> 
          {loggedIn ? ( 
            <button className="aspu-menu-login-btn" onClick={handleLogout}> 
              {isAr ? "تسجيل الخروج" : "Sign Out"} 
            </button> 
          ) : ( 
            <a href="/Auth" className="aspu-menu-login-btn" onClick={() => setMenuOpen(false)}> 
              {menuT.login} 
            </a> 
          )} 
        </div> 
      </div> 

      <nav className={`aspu-nav${scrolled ? " scrolled" : ""}`}> 
        <a href="#" className="aspu-nav-logo"> 
          <Logo size={38} /> 
          <div> 
            <div className="aspu-logo-n">ASPU Insight</div> 
            <div className="aspu-logo-s"> 
              {(isAr ? Ara : Eng).shared.secondaryLogoTagline} 
            </div> 
          </div> 
        </a> 
        <div className="aspu-nav-space" /> 
        <button className={`aspu-nav-menu-btn${menuOpen ? " is-open" : ""}`} onClick={() => setMenuOpen(true)} > 
          <span className="aspu-nmb-label">{navT.menu}</span> 
          <div className="aspu-nmb-lines"> 
            <div className="aspu-nmb-line l1" /> 
            <div className="aspu-nmb-line l2" /> 
            <div className="aspu-nmb-line l3" /> 
          </div> 
        </button> 
      </nav> 
    </> 
  ); 
}