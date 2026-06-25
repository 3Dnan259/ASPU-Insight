import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPapers } from '../api/research';
import '../styling/ResearchReview.css';

/* ── Status config ── */
const STATUS_CONFIG = {
  pending:  { ar: 'قيد المراجعة', cls: 'rr-sb-pending'  },
  approved: { ar: 'منشور',        cls: 'rr-sb-approved' },
  rejected: { ar: 'مرفوض',        cls: 'rr-sb-rejected' },
};

/* ── Stars helper ── */
function Stars({ rating }) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return (
    <span className="rr-stars">
      {'★'.repeat(full)}
      <span className="rr-stars-muted">{'★'.repeat(empty)}</span>
    </span>
  );
}

/* ── Single paper card ── */
function PaperCard({ paper, onClick }) {
  const st = STATUS_CONFIG[paper.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="rc-paper" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>

      {/* Top row */}
      <div className="rcp-top">
        <div className="rcp-tags">
          <span className={`rr-status-badge ${st.cls}`}>
            <span className="rr-badge-dot" />
            {st.ar}
          </span>
          {paper.is_paid_open_access && (
            <span className="rr-oa-badge">🔓 مفتوح</span>
          )}
        </div>
        <span className="rr-paper-id">#{paper.id}</span>
      </div>

      {/* Title */}
      <h3 className="rcp-title">{paper.title}</h3>

      {/* Abstract excerpt */}
      <p className="rcp-excerpt">{paper.abstract}</p>

      {/* Meta */}
      <div className="rcp-meta">
        <span className="rcp-author">{paper.author_name}</span>
        <span className="rcp-sep">•</span>
        <span>ASPU</span>
      </div>

      {/* Footer row */}
      <div className="rr-card-footer">
        <span className="rr-pdf-indicator">
          {paper.pdf_file ? '📄 PDF متوفر' : '📂 لا يوجد PDF'}
        </span>
        <span className="rr-view-more">عرض التفاصيل ←</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function ResearchReview() {
  const navigate = useNavigate();

  const [papers,   setPapers]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('all');   // all | pending | approved | rejected
  const [oaOnly,   setOaOnly]   = useState(false);
  const [view,     setView]     = useState('list');   // list | grid
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  /* ── Fetch from API ── */
  const fetchPapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search)          params.search = search;
      if (status !== 'all') params.status = status;
      if (oaOnly)          params.is_paid_open_access = true;

      const data = await getPapers(params);
      // handle both paginated { results: [] } and plain array
      setPapers(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      setError(err.message || 'خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, [search, status, oaOnly]);

  useEffect(() => {
    const t = setTimeout(fetchPapers, 300); // debounce search
    return () => clearTimeout(t);
  }, [fetchPapers]);

  /* ── Navbar scroll ── */
  useEffect(() => {
    const nav = document.getElementById('rr-navbar');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Cursor glow ── */
  useEffect(() => {
    const el = document.getElementById('rr-cg');
    if (!el || window.matchMedia('(pointer:coarse)').matches) {
      if (el) el.style.display = 'none';
      return;
    }
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });
    let raf;
    const loop = () => {
      cx += (mx - cx) * .1; cy += (my - cy) * .1;
      el.style.left = cx + 'px'; el.style.top = cy + 'px';
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  /* ── Logo SVG ── */
  const LogoSVG = () => (
    <svg style={{ width: 38, height: 38, flexShrink: 0 }} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div dir="rtl" lang="ar">
      <div id="rr-cg" />

      {/* ── MENU OVERLAY ── */}
      <div className={`aspu-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-top">
          <div className="menu-logo-row">
            <LogoSVG />
            <div>
              <div className="menu-ln">ASPU Insight</div>
              <div className="menu-ls">المجلة الأكاديمية الرقمية</div>
            </div>
          </div>
          <button className="menu-close-btn" onClick={() => setMenuOpen(false)}>
            إغلاق
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="menu-links">
          {[
            { label: 'الرئيسية',    path: '/',                num: '01' },
            { label: 'الأبحاث',     path: '/research_review', num: '02' },
            { label: 'البروفايل',   path: '/Profile',         num: '03' },
            { label: 'نشر بحث',     path: '/submit',          num: '04' },
          ].map((item) => (
            <div key={item.num} className="menu-link"
              onClick={() => { setMenuOpen(false); navigate(item.path); }}>
              <div className="ml-row">
                <span className="ml-name">{item.label}</span>
                <span className="ml-num">{item.num}</span>
              </div>
              <span className="ml-sub">استعرض</span>
            </div>
          ))}
        </div>
        <div className="menu-foot">
          <span className="mf-label">© ASPU Insight 2025</span>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav id="rr-navbar" className="aspu-nav">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <LogoSVG />
          <div>
            <div className="logo-n">ASPU Insight</div>
            <div className="logo-s">المجلة الأكاديمية</div>
          </div>
        </a>
        <div style={{ flex: 1 }} />
        <button className="nav-menu-btn" onClick={() => setMenuOpen(true)}>
          <span className="nmb-label">القائمة</span>
          <div className="nmb-lines">
            <div className="nmb-line" />
            <div className="nmb-line short" />
            <div className="nmb-line" />
          </div>
        </button>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="ph-inner">
          <div className="ph-breadcrumb">
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--ac)' }}>الرئيسية</span>
            <span className="ph-sep">›</span>
            <span>مراجعة الأبحاث</span>
          </div>
          <h1 className="ph-title">مراجعة الأبحاث<br />المنشورة</h1>
          <p className="ph-sub">
            استعراض شامل لجميع الأبحاث الأكاديمية — مرتّبة وقابلة للتصفية حسب الحالة والوصول.
          </p>
          {!loading && (
            <div className="ph-stats-row">
              <div className="ph-stat">
                <div className="ph-stat-n">{papers.length}</div>
                <div className="ph-stat-l">بحث</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{papers.filter(p => p.status === 'approved').length}</div>
                <div className="ph-stat-l">منشور</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{papers.filter(p => p.status === 'pending').length}</div>
                <div className="ph-stat-l">قيد المراجعة</div>
              </div>
              <div className="ph-stat">
                <div className="ph-stat-n">{papers.filter(p => p.is_paid_open_access).length}</div>
                <div className="ph-stat-l">وصول مفتوح</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="page-body">

        {/* Mobile filter toggle */}
        <button className="filter-toggle" onClick={() => setSideOpen(o => !o)}>
          <span>🔍 الفلاتر والتصفية</span>
          <span className={`ft-arrow ${sideOpen ? 'open' : ''}`}>▾</span>
        </button>

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar ${sideOpen ? 'mobile-open' : ''}`}>

          {/* Search */}
          <div>
            <div className="filter-label">بحث</div>
            <div className="sf-search">
              <span className="sf-ico">⌕</span>
              <input
                type="text"
                placeholder="عنوان، باحث، كلمة مفتاحية..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <div className="filter-label">الحالة</div>
            <div className="cb-group">
              {[
                { value: 'all',      label: 'الكل'          },
                { value: 'approved', label: 'منشور'         },
                { value: 'pending',  label: 'قيد المراجعة'  },
                { value: 'rejected', label: 'مرفوض'         },
              ].map((opt) => (
                <label className="cb-item" key={opt.value}>
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* OA filter */}
          <div>
            <div className="filter-label">نوع الوصول</div>
            <label className="cb-item">
              <input
                type="checkbox"
                checked={oaOnly}
                onChange={(e) => setOaOnly(e.target.checked)}
              />
              <span>وصول مفتوح مدفوع فقط</span>
            </label>
          </div>

          {/* Reset */}
          <button className="reset-btn" onClick={() => { setSearch(''); setStatus('all'); setOaOnly(false); }}>
            إعادة تعيين الفلاتر
          </button>
        </aside>

        {/* ── CONTENT ── */}
        <div className="content-area">

          {/* Results bar */}
          <div className="results-bar">
            <div className="results-count">
              عرض <strong>{papers.length}</strong> بحث
            </div>
            <div className="view-btns">
              <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
                title="قائمة"
              >☰</button>
              <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
                title="شبكة"
              >⊞</button>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="rr-state-center">
              <div className="rr-spinner" />
              <span>جاري التحميل…</span>
            </div>
          )}

          {error && !loading && (
            <div className="rr-state-center">
              <span className="rr-error-ico">⚠️</span>
              <span className="rr-error-msg">{error}</span>
              <button className="reset-btn" style={{ width: 'auto', padding: '8px 20px' }}
                onClick={fetchPapers}>
                إعادة المحاولة
              </button>
            </div>
          )}

          {!loading && !error && papers.length === 0 && (
            <div className="rr-state-center">
              <span style={{ fontSize: 32 }}>🔍</span>
              <span style={{ color: 'var(--tx3)' }}>لا توجد أبحاث تطابق معايير البحث</span>
            </div>
          )}

          {/* Papers grid */}
          {!loading && !error && papers.length > 0 && (
            <div className={`research-grid ${view === 'grid' ? 'grid-2col' : ''}`}>
              {papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onClick={() => navigate(`/papers/${paper.id}`)}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="aspu-footer">
        <div className="ft-bottom">
          <span>© 2025 ASPU Insight — جميع الحقوق محفوظة</span>
        </div>
      </footer>
    </div>
  );
}