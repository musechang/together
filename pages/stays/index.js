import { useState, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import HotelCardRow from '../../components/stays/HotelCardRow';
import FilterPanel, { applyFilters } from '../../components/stays/FilterPanel';
import { FALLBACK_HOTELS } from '../../lib/notion';

const SORT_OPTIONS = [
  { value: 'rating', label: '評分最高' },
  { value: 'price_asc', label: '寵物費用：低至高' },
  { value: 'price_desc', label: '寵物費用：高至低' },
  { value: 'name', label: '名稱排序' },
];

function sortHotels(hotels, sort) {
  const list = [...hotels];
  if (sort === 'rating')      return list.sort((a,b) => b.rating - a.rating);
  if (sort === 'price_asc')   return list.sort((a,b) => parseFloat(a.price)||0 - parseFloat(b.price)||0);
  if (sort === 'price_desc')  return list.sort((a,b) => parseFloat(b.price)||0 - parseFloat(a.price)||0);
  if (sort === 'name')        return list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

export default function StaysPage({ hotels }) {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('rating');
  const [view, setView] = useState('list'); // 'list' | 'grid'

  const results = useMemo(() => sortHotels(applyFilters(hotels, filters), sort), [hotels, filters, sort]);

  return (
    <div style={PAGE}>
      {/* Header bar */}
      <div style={TOP_BAR}>
        <div style={RESULT_COUNT}>
          找到 <strong>{results.length}</strong> 間狗狗友善住宿
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)} style={SELECT}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {/* View toggle */}
          <div style={VIEW_TOGGLE}>
            <button style={{ ...VIEW_BTN, ...(view==='list'?VIEW_BTN_ON:{}) }} onClick={()=>setView('list')}>☰ 列表</button>
            <button style={{ ...VIEW_BTN, ...(view==='grid'?VIEW_BTN_ON:{}) }} onClick={()=>setView('grid')}>⊞ 格狀</button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={BODY}>
        <aside style={ASIDE}>
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        <section style={{ minWidth:0 }}>
          {results.length === 0 ? (
            <div style={EMPTY}>
              <div style={{ fontSize:48, marginBottom:12 }}>🐕</div>
              <div style={{ fontWeight:700, marginBottom:8 }}>沒有符合的住宿</div>
              <div style={{ fontSize:13, color:'var(--text-light)' }}>試著調整篩選條件</div>
              <button style={RESET_BTN} onClick={() => setFilters({})}>清除篩選</button>
            </div>
          ) : view === 'list' ? (
            results.map(h => <HotelCardRow key={h.id} hotel={h} />)
          ) : (
            <div style={GRID}>
              {results.map((h, i) => {
                const HotelCard = require('../../components/stays/HotelCard').default;
                return <HotelCard key={h.id} hotel={h} index={i} />;
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

StaysPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticProps() {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    return { props: { hotels }, revalidate: 3600 };
  } catch {
    return { props: { hotels: FALLBACK_HOTELS }, revalidate: 60 };
  }
}

const PAGE        = { maxWidth:1200, margin:'0 auto', padding:'0 48px 60px' };
const TOP_BAR     = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 0 16px', borderBottom:'1px solid var(--border)', marginBottom:24 };
const RESULT_COUNT= { fontSize:14, color:'var(--text-mid)' };
const SELECT      = { padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:10, fontSize:13, background:'var(--white)', cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', outline:'none' };
const VIEW_TOGGLE = { display:'flex', border:'1.5px solid var(--border)', borderRadius:10, overflow:'hidden' };
const VIEW_BTN    = { padding:'7px 12px', background:'none', border:'none', fontSize:12, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', color:'var(--text-mid)', transition:'all .15s' };
const VIEW_BTN_ON = { background:'var(--green-dark)', color:'white' };
const BODY        = { display:'grid', gridTemplateColumns:'220px 1fr', gap:28 };
const ASIDE       = { position:'sticky', top:88, alignSelf:'start' };
const EMPTY       = { textAlign:'center', padding:'80px 0', display:'flex', flexDirection:'column', alignItems:'center' };
const RESET_BTN   = { marginTop:16, padding:'10px 24px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif' };
const GRID        = { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 };
