import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import AuthForm from '../../components/account/AuthForm';
import HotelCard from '../../components/stays/HotelCard';
import { useAuth, useFavourites, useReviews } from '../../lib/hooks';
import { FALLBACK_HOTELS } from '../../lib/notion';

const TABS = ['個人資料', '我的收藏', '我的評論'];

export default function AccountPage({ hotels }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { favs } = useFavourites();
  const { reviews } = useReviews();
  const tab = router.query.tab || 'profile';

  const activeIdx = tab === 'favourites' ? 1 : tab === 'reviews' ? 2 : 0;
  const favHotels = hotels.filter(h => favs.includes(h.id));

  if (!user) {
    return (
      <div style={{ maxWidth:460, margin:'60px auto', padding:'0 24px' }}>
        <AuthForm
          defaultTab={router.query.tab === 'signup' ? 'signup' : 'login'}
          onSuccess={() => router.replace('/account')}
        />
      </div>
    );
  }

  return (
    <div style={PAGE}>
      {/* Profile sidebar */}
      <aside style={SIDEBAR}>
        <div style={AVATAR}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width:80,height:80,borderRadius:'50%',objectFit:'cover' }} />
            : <span style={{ fontSize:48 }}>🐕</span>
          }
        </div>
        <div style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>{user.name}</div>
        <div style={{ fontSize:13, color:'var(--text-light)', marginBottom:20 }}>{user.email}</div>

        {TABS.map((t, i) => (
          <button key={t}
            style={{ ...TAB_BTN, ...(activeIdx===i ? TAB_BTN_ON : {}) }}
            onClick={() => router.push(`/account?tab=${['profile','favourites','reviews'][i]}`)}>
            {['👤','♥','✍️'][i]} {t}
          </button>
        ))}

        <button style={LOGOUT_BTN} onClick={() => { logout(); router.push('/'); }}>登出</button>
      </aside>

      {/* Content */}
      <main style={MAIN}>
        {activeIdx === 0 && (
          <div>
            <h2 style={SECTION_TITLE}>個人資料</h2>
            <div style={PROFILE_CARD}>
              <div style={PROFILE_ROW}><span style={PROFILE_LABEL}>暱稱</span><span>{user.name}</span></div>
              <div style={PROFILE_ROW}><span style={PROFILE_LABEL}>Email</span><span>{user.email}</span></div>
              <div style={PROFILE_ROW}><span style={PROFILE_LABEL}>收藏住宿</span><span>{favs.length} 間</span></div>
              <div style={PROFILE_ROW}><span style={PROFILE_LABEL}>發表評論</span><span>{reviews.filter(r=>r.userName===user.name).length} 則</span></div>
            </div>
            <div style={{ marginTop:16, padding:16, background:'var(--green-light)', borderRadius:12, fontSize:13, color:'var(--green-dark)' }}>
              🔒 目前為示範版，帳號資料僅存於本機瀏覽器
            </div>
          </div>
        )}

        {activeIdx === 1 && (
          <div>
            <h2 style={SECTION_TITLE}>我的收藏 ({favHotels.length})</h2>
            {favHotels.length === 0 ? (
              <div style={EMPTY}>
                <div style={{ fontSize:48, marginBottom:12 }}>♡</div>
                <div style={{ fontWeight:600 }}>還沒有收藏任何住宿</div>
                <a href="/stays" style={GO_BTN}>探索住宿</a>
              </div>
            ) : (
              <div style={FAV_GRID}>
                {favHotels.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
              </div>
            )}
          </div>
        )}

        {activeIdx === 2 && (
          <div>
            <h2 style={SECTION_TITLE}>我的評論 ({reviews.filter(r=>r.userName===user.name).length})</h2>
            {reviews.filter(r=>r.userName===user.name).length === 0 ? (
              <div style={EMPTY}>
                <div style={{ fontSize:48, marginBottom:12 }}>✍️</div>
                <div style={{ fontWeight:600 }}>還沒有發表任何評論</div>
                <a href="/stays" style={GO_BTN}>去找找住宿</a>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {reviews.filter(r=>r.userName===user.name).map(r => (
                  <div key={r.id} style={REVIEW_CARD}>
                    <div style={{ fontWeight:700, marginBottom:4 }}>
                      {'🐾'.repeat(r.rating)} <span style={{ fontSize:13 }}>關於住宿</span>
                    </div>
                    <p style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.7 }}>{r.comment}</p>
                    <div style={{ fontSize:11, color:'var(--text-light)', marginTop:8 }}>
                      {new Date(r.createdAt).toLocaleDateString('zh-TW')}
                      {r.userDog && ` · 與 ${r.userDog} 同行`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

AccountPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  return { props: { hotels: FALLBACK_HOTELS } };
}

const PAGE          = { maxWidth:1000, margin:'0 auto', padding:'40px 48px 60px', display:'grid', gridTemplateColumns:'220px 1fr', gap:40 };
const SIDEBAR       = { display:'flex', flexDirection:'column', alignItems:'center', gap:6 };
const AVATAR        = { width:80, height:80, borderRadius:'50%', background:'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, overflow:'hidden' };
const TAB_BTN       = { width:'100%', padding:'11px 14px', border:'none', borderRadius:10, background:'none', fontSize:13, cursor:'pointer', textAlign:'left', fontFamily:'Noto Sans TC,sans-serif', color:'var(--text-mid)', transition:'all .15s' };
const TAB_BTN_ON    = { background:'var(--green-light)', color:'var(--green-dark)', fontWeight:700 };
const LOGOUT_BTN    = { marginTop:8, width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'none', fontSize:13, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', color:'var(--text-light)' };
const MAIN          = { minWidth:0 };
const SECTION_TITLE = { fontFamily:'Noto Serif TC,serif', fontSize:20, fontWeight:700, marginBottom:20 };
const PROFILE_CARD  = { background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' };
const PROFILE_ROW   = { display:'flex', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid var(--border)', fontSize:14 };
const PROFILE_LABEL = { color:'var(--text-light)', fontWeight:600 };
const EMPTY         = { textAlign:'center', padding:'60px 0', display:'flex', flexDirection:'column', alignItems:'center' };
const GO_BTN        = { marginTop:16, padding:'10px 24px', background:'var(--green-dark)', color:'white', borderRadius:10, fontSize:13, textDecoration:'none' };
const FAV_GRID      = { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 };
const REVIEW_CARD   = { background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:16 };
