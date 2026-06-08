import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import HotelCard from '../components/stays/HotelCard';
import SearchPopup from '../components/search/SearchPopup';
import { useSearch, useSearchDisplay } from '../lib/hooks';
import { FALLBACK_HOTELS } from '../lib/notion';

export default function HomePage({ hotels }) {
  const router = useRouter();
  const [, setSearch] = useSearch();
  const { locLabel, dateLabel, guestLabel } = useSearchDisplay();
  const [searchOpen, setSearchOpen] = useState(false);

  const nearby = hotels.slice(0, 4);
  const largeDog = hotels.filter(h => h.dogSize?.includes('大')).slice(0, 4);

  function handleSearch() {
    setSearchOpen(false);
    router.push('/stays');
  }

  return (
    <div>
      {/* ── HERO ── */}
      <div style={HERO}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/hero.png" alt="" style={HERO_BG} onError={e => e.target.style.display='none'} />
        <div style={HERO_OVERLAY} />
        <h1 style={HERO_TITLE}>要去，一起去</h1>

        {/* Search bar */}
        <div style={SEARCH_WRAP}>
          <div style={SEARCH_BAR}>
            <button style={FIELD} onClick={() => { setSearchOpen(true); }}>
              <span style={FIELD_LABEL}>地點</span>
              <span style={FIELD_VAL}>{locLabel}</span>
            </button>
            <div style={DIVIDER} />
            <button style={FIELD} onClick={() => setSearchOpen(true)}>
              <span style={FIELD_LABEL}>日期</span>
              <span style={FIELD_VAL}>{dateLabel}</span>
            </button>
            <div style={DIVIDER} />
            <button style={FIELD} onClick={() => setSearchOpen(true)}>
              <span style={FIELD_LABEL}>旅客與毛孩</span>
              <span style={FIELD_VAL}>{guestLabel}</span>
            </button>
            <button style={SEARCH_BTN} onClick={() => router.push('/stays')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <section style={SECTION}>
        <div style={SECTION_HDR}>
          <h2 style={SECTION_TITLE}>台北近郊</h2>
          <a href="/stays" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div style={GRID}>
          {nearby.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
      </section>

      <section style={{ ...SECTION, paddingBottom: 60 }}>
        <div style={SECTION_HDR}>
          <h2 style={SECTION_TITLE}>大型狗友善</h2>
          <a href="/stays?dogSize=大" style={SEE_ALL}>查看全部 →</a>
        </div>
        <div style={GRID}>
          {(largeDog.length ? largeDog : nearby).map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
        </div>
      </section>

      {/* Search popup */}
      {searchOpen && <SearchPopup onClose={() => setSearchOpen(false)} onSearch={handleSearch} />}
    </div>
  );
}

HomePage.getLayout = (page) => <Layout hideSearch>{page}</Layout>;

export async function getStaticProps() {
  try {
    const { fetchHotels } = await import('../lib/notion');
    const hotels = await fetchHotels();
    return { props: { hotels }, revalidate: 3600 };
  } catch {
    return { props: { hotels: FALLBACK_HOTELS }, revalidate: 60 };
  }
}

/* ── Styles ── */
const HERO        = { position:'relative', minHeight:600, overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 24px 0' };
const HERO_BG     = { position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' };
const HERO_OVERLAY= { position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(28,60,42,.30) 0%,rgba(28,60,42,.10) 50%,rgba(250,248,244,.95) 100%)' };
const HERO_TITLE  = { fontFamily:'Noto Serif TC,serif', fontSize:64, fontWeight:700, color:'white', textAlign:'center', position:'relative', zIndex:2, lineHeight:1.15, textShadow:'0 2px 20px rgba(0,0,0,.25)', marginBottom:0 };
const SEARCH_WRAP = { position:'relative', zIndex:2, width:'100%', maxWidth:720, marginTop:56 };
const SEARCH_BAR  = { background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:60, display:'flex', alignItems:'stretch', boxShadow:'0 8px 40px rgba(0,0,0,.18)', width:'100%' };
const FIELD       = { flex:1, padding:'18px 20px', cursor:'pointer', minWidth:0, borderRight:'1px solid var(--border)', background:'none', border:'none', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', alignItems:'flex-start', fontFamily:'Noto Sans TC,sans-serif' };
const FIELD_LABEL = { fontSize:10, color:'var(--text-light)', display:'block', marginBottom:3, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase' };
const FIELD_VAL   = { fontSize:14, color:'var(--text-dark)', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' };
const DIVIDER     = { display:'none' };
const SEARCH_BTN  = { background:'var(--green-dark)', border:'none', width:60, flexShrink:0, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'0 56px 56px 0', margin:'6px 6px 6px 0', transition:'background .2s' };
const SECTION     = { padding:'48px 48px 0' };
const SECTION_HDR = { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 };
const SECTION_TITLE={ fontFamily:'Noto Serif TC,serif', fontSize:22, fontWeight:700 };
const SEE_ALL     = { fontSize:13, color:'var(--green-dark)', fontWeight:600, textDecoration:'none' };
const GRID        = { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 };
