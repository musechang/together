import Layout from '../../components/layout/Layout';
import PhotoGallery from '../../components/stays/PhotoGallery';
import AmenityGrid from '../../components/stays/AmenityGrid';
import ReviewSection from '../../components/stays/ReviewSection';
import { useFavourites } from '../../lib/hooks';
import { FALLBACK_HOTELS } from '../../lib/notion';
import Link from 'next/link';

export default function StayDetailPage({ hotel }) {
  const { has, toggle } = useFavourites();
  if (!hotel) return <div style={{ padding:48, textAlign:'center' }}>找不到此住宿</div>;

  const isFav = has(hotel.id);
  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(hotel.name + ' ' + (hotel.address||''))}`;
  const priceLabel = (hotel.price && hotel.price!=='無' && hotel.price!=='免費' && hotel.price!=='')
    ? `$${hotel.price} / 晚（寵物費）`
    : '無額外寵物費';

  return (
    <div style={PAGE}>
      {/* Back */}
      <Link href="/stays" style={BACK}>← 返回列表</Link>

      <div style={GRID}>
        {/* ── LEFT ── */}
        <div>
          <PhotoGallery photos={hotel.photos || []} name={hotel.name} />

          <h2 style={SUBTITLE}>關於這個地方</h2>
          <p style={DESC}>
            {hotel.name} 是一間{hotel.type}，接受{hotel.dogSize || '各種大小'}的狗狗入住。
            {hotel.dogArea==='是' && '狗狗可在全區自由落地，享受無拘束的旅行體驗。'}
            {hotel.lawn==='有'   && '園區附設狗狗專屬草皮，讓毛孩盡情奔跑。'}
            歡迎帶著您的毛孩一起入住！
          </p>

          <h2 style={SUBTITLE}>寵物友善設施</h2>
          <AmenityGrid hotel={hotel} />

          <ReviewSection hotelId={hotel.id} />
        </div>

        {/* ── RIGHT ── */}
        <div>
          <div style={PANEL}>
            <h1 style={HOTEL_NAME}>{hotel.name}</h1>
            <div style={HOTEL_SUB}>{hotel.type} · {hotel.address}</div>

            {/* Rating */}
            <div style={RATING_ROW}>
              {'🐾'.repeat(Math.min(Math.floor(hotel.rating||0), 5))}
              <strong style={{ fontSize:15 }}>{hotel.rating}</strong>
              <span style={{ fontSize:12, color:'var(--text-light)' }}>(1000+ 評論)</span>
            </div>

            {/* Price */}
            <div style={PRICE}>{priceLabel}</div>

            {/* Dog size accepted */}
            <div style={INFO_ROW}>
              <span style={{ fontSize:13, color:'var(--text-mid)' }}>接受狗狗大小：</span>
              <strong style={{ fontSize:13 }}>{hotel.dogSize || '不限'}</strong>
            </div>

            {/* Booking.com link */}
            {hotel.bookingUrl && (
              <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" style={BOOKING_BTN}>
                🏨 在 Booking.com 查看與預訂
              </a>
            )}

            {/* Website */}
            {hotel.website?.startsWith('http') && (
              <a href={hotel.website} target="_blank" rel="noopener noreferrer" style={WEBSITE_LINK}>
                🔗 查看官方網頁
              </a>
            )}

            {/* Enquiry button */}
            <button style={ENQUIRY_BTN} onClick={() => alert('預訂功能即將上線！')}>
              立即詢問
            </button>

            {/* Favourite */}
            <button style={{ ...FAV_BTN, ...(isFav ? FAV_BTN_ON : {}) }} onClick={() => toggle(hotel.id)}>
              {isFav ? '♥ 已收藏' : '♡ 加入收藏'}
            </button>

            {/* Map */}
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" style={MAP_BOX}>
              <span style={{ fontSize:28 }}>📍</span>
              <span style={{ fontWeight:600, color:'var(--green-dark)' }}>查看地圖</span>
              <span style={{ fontSize:12, color:'var(--text-light)' }}>{hotel.address}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

StayDetailPage.getLayout = (page) => <Layout>{page}</Layout>;

export async function getStaticPaths() {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    return { paths: hotels.map(h => ({ params: { id: h.id } })), fallback: 'blocking' };
  } catch {
    return { paths: FALLBACK_HOTELS.map(h => ({ params: { id: h.id } })), fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { fetchHotels } = await import('../../lib/notion');
    const hotels = await fetchHotels();
    const hotel = hotels.find(h => h.id === params.id) || null;
    return { props: { hotel }, revalidate: 3600 };
  } catch {
    return { props: { hotel: FALLBACK_HOTELS.find(h => h.id === params.id) || null }, revalidate: 60 };
  }
}

const PAGE       = { maxWidth:1100, margin:'0 auto', padding:'28px 48px 60px' };
const BACK       = { display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--green-dark)', marginBottom:20, textDecoration:'none' };
const GRID       = { display:'grid', gridTemplateColumns:'1fr 360px', gap:40 };
const SUBTITLE   = { fontFamily:'Noto Serif TC,serif', fontSize:18, fontWeight:700, margin:'28px 0 12px' };
const DESC       = { fontSize:13, color:'var(--text-mid)', lineHeight:1.9 };
const PANEL      = { position:'sticky', top:88, display:'flex', flexDirection:'column', gap:12 };
const HOTEL_NAME = { fontFamily:'Noto Serif TC,serif', fontSize:24, fontWeight:700, lineHeight:1.3 };
const HOTEL_SUB  = { fontSize:13, color:'var(--text-mid)' };
const RATING_ROW = { display:'flex', alignItems:'center', gap:6 };
const PRICE      = { fontSize:22, fontWeight:700, color:'var(--green-dark)' };
const INFO_ROW   = { display:'flex', gap:6, alignItems:'center' };
const BOOKING_BTN= { display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', background:'#003580', color:'white', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none' };
const WEBSITE_LINK={ display:'block', textAlign:'center', fontSize:12, color:'var(--green-dark)', textDecoration:'none', padding:'6px' };
const ENQUIRY_BTN= { padding:'13px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', width:'100%' };
const FAV_BTN    = { padding:'11px', background:'var(--white)', color:'var(--text-dark)', border:'1.5px solid var(--border)', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif', width:'100%' };
const FAV_BTN_ON = { background:'#FFF0F0', borderColor:'#e53e3e', color:'#e53e3e' };
const MAP_BOX    = { display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'20px', background:'var(--green-light)', borderRadius:12, textDecoration:'none' };
