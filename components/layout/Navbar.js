import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth, useSearchDisplay } from '../../lib/hooks';
import SearchPopup from '../search/SearchPopup';

export default function Navbar({ hideSearch = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locLabel, dateLabel, guestLabel } = useSearchDisplay();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef(null);
  const isHome = router.pathname === '/';

  useEffect(() => {
    const fn = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <>
      <nav style={NAV}>
        {/* Logo */}
        <Link href="/" style={LOGO}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="together" width={36} height={36}
            style={{ borderRadius: 8, objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'} />
          <span className="logo-text" style={{ fontWeight: 700, fontSize: 20, color: 'var(--green-dark)' }}>
            together
          </span>
        </Link>

        {/* Compact search bar (hidden on home) */}
        {!isHome && !hideSearch && (
          <button onClick={() => setSearchOpen(true)} style={COMPACT_BAR}>
            <span style={COMPACT_FIELD}>
              <small style={FIELD_LABEL}>地點</small>
              <span style={FIELD_VAL}>{locLabel}</span>
            </span>
            <span style={{ ...COMPACT_FIELD, borderRight: 'none' }} className="hide-sm">
              <small style={FIELD_LABEL}>日期</small>
              <span style={FIELD_VAL}>{dateLabel}</span>
            </span>
            <span style={{ ...COMPACT_FIELD, borderRight: 'none' }} className="hide-sm">
              <small style={FIELD_LABEL}>旅客</small>
              <span style={FIELD_VAL}>{guestLabel}</span>
            </span>
            <span style={SEARCH_BTN}>
              <SearchIcon />
            </span>
          </button>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {!user && (
            <Link href="/account" style={LOGIN_BTN}>登入</Link>
          )}
          <div ref={userRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(v => !v)}
              style={AVATAR_BTN}
              aria-label="User menu"
            >
              {user?.avatar
                ? <img src={user.avatar} alt="" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 18 }}>🐕</span>
              }
            </button>
            {userMenuOpen && (
              <div style={USER_MENU}>
                {user ? (
                  <>
                    <div style={MENU_NAME}>{user.name}</div>
                    <Link href="/account" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>個人資料</Link>
                    <Link href="/account/favourites" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>我的收藏</Link>
                    <Link href="/account/reviews" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>我的評論</Link>
                    <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                    <button style={{ ...MENU_ITEM, width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: 'none' }}
                      onClick={() => { logout(); setUserMenuOpen(false); }}>登出</button>
                  </>
                ) : (
                  <>
                    <Link href="/account" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>登入</Link>
                    <Link href="/account?tab=signup" style={MENU_ITEM} onClick={() => setUserMenuOpen(false)}>註冊</Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Hamburger />
        </div>
      </nav>

      {/* Search modal overlay */}
      {searchOpen && <SearchPopup onClose={() => setSearchOpen(false)} onSearch={() => { setSearchOpen(false); router.push('/stays'); }} />}

      <style>{`
        @media(max-width:600px){.hide-sm{display:none!important}}
        @media(max-width:480px){.logo-text{display:none}}
      `}</style>
    </>
  );
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

function Hamburger() {
  return (
    <button style={{ cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 4, background: 'none', border: 'none' }}>
      <span style={{ width: 20, height: 2, background: 'var(--text-dark)', display: 'block', borderRadius: 2 }} />
      <span style={{ width: 20, height: 2, background: 'var(--text-dark)', display: 'block', borderRadius: 2 }} />
      <span style={{ width: 20, height: 2, background: 'var(--text-dark)', display: 'block', borderRadius: 2 }} />
    </button>
  );
}

const NAV = { background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, position: 'sticky', top: 0, zIndex: 200, gap: 16 };
const LOGO = { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 };
const COMPACT_BAR = { display: 'flex', alignItems: 'center', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 40, boxShadow: '0 2px 12px rgba(0,0,0,.08)', flex: 1, maxWidth: 520, cursor: 'pointer', overflow: 'visible', padding: 0 };
const COMPACT_FIELD = { padding: '8px 14px', flex: 1, minWidth: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', textAlign: 'left' };
const FIELD_LABEL = { fontSize: 10, color: 'var(--text-light)', display: 'block', marginBottom: 1 };
const FIELD_VAL = { fontSize: 12, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const SEARCH_BTN = { background: 'var(--green-dark)', padding: '8px 14px', borderRadius: '0 40px 40px 0', display: 'flex', alignItems: 'center' };
const LOGIN_BTN = { fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', padding: '6px 14px', border: '1.5px solid var(--green-dark)', borderRadius: 20 };
const AVATAR_BTN = { width: 36, height: 36, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', overflow: 'hidden' };
const USER_MENU = { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 180, padding: '8px 0', zIndex: 400 };
const MENU_NAME = { padding: '8px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text-mid)', borderBottom: '1px solid var(--border)', marginBottom: 4 };
const MENU_ITEM = { display: 'block', padding: '10px 16px', fontSize: 13, color: 'var(--text-dark)', transition: 'background .15s' };
