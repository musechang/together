import Link from 'next/link';
import { useFavourites } from '../../lib/hooks';

const FALLBACK = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=420&fit=crop';

const AMENITY_ICONS = {
  dogArea:    { label:'全區落地',   icon:'🐾' },
  lawn:       { label:'附設草皮',   icon:'🌿', check:'有' },
  dogpark:    { label:'狗狗公園',   icon:'🏃' },
  restaurant: { label:'可至餐廳',   icon:'🍽️' },
  bowl:       { label:'提供水碗',   icon:'🥣' },
};

export default function HotelCardRow({ hotel }) {
  const { has, toggle } = useFavourites();
  const isFav = has(hotel.id);
  const img = hotel.photos?.[0] || FALLBACK;

  const shownAmenities = Object.entries(AMENITY_ICONS)
    .filter(([key, { check }]) => hotel[key] === (check || '是'))
    .slice(0, 4);

  return (
    <Link href={`/stays/${hotel.id}`} style={CARD}>
      {/* Image */}
      <div style={IMG_WRAP}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={hotel.name} loading="lazy"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.src = FALLBACK; }} />
        <button
          style={{ ...FAV_BTN, color: isFav ? '#e53e3e' : 'rgba(255,255,255,.8)' }}
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(hotel.id); }}
        >{isFav ? '♥' : '♡'}</button>
      </div>

      {/* Info */}
      <div style={INFO}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
          <div>
            <div style={NAME}>{hotel.name}</div>
            <div style={SUB}>{hotel.address} · {hotel.type}</div>
          </div>
          <div style={RATING}>🐾 {hotel.rating}</div>
        </div>

        <div style={AMENITIES}>
          {shownAmenities.map(([key, { label, icon }]) => (
            <span key={key} style={AMENITY_CHIP}>{icon} {label}</span>
          ))}
        </div>

        <div style={BOTTOM}>
          <div style={TAGS_ROW}>
            {hotel.dogArea==='是' && <span className="tag tag-green">全區落地</span>}
            {hotel.lawn==='有'    && <span className="tag tag-green">有草地</span>}
            {hotel.park==='是'    && <span className="tag tag-green">近公園</span>}
          </div>
          <div style={PRICE_COL}>
            {hotel.price && hotel.price!=='無' && hotel.price!=='免費' && hotel.price!==''
              ? <><strong style={{ fontSize:16, color:'var(--green-dark)' }}>${hotel.price}</strong><span style={{ fontSize:11,color:'var(--text-light)' }}>/晚</span></>
              : <span style={{ fontSize:12,color:'var(--text-light)' }}>無額外寵物費</span>
            }
          </div>
        </div>
      </div>
    </Link>
  );
}

const CARD       = { display:'grid', gridTemplateColumns:'190px 1fr', borderBottom:'1px solid var(--border)', padding:'20px 0', gap:16, textDecoration:'none', color:'inherit', transition:'background .15s', borderRadius:8 };
const IMG_WRAP   = { position:'relative', height:140, borderRadius:12, overflow:'hidden', background:'var(--green-light)', flexShrink:0 };
const FAV_BTN    = { position:'absolute', top:8, right:8, background:'rgba(0,0,0,.3)', border:'none', borderRadius:'50%', width:28, height:28, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' };
const INFO       = { display:'flex', flexDirection:'column', gap:8, minWidth:0 };
const NAME       = { fontSize:16, fontWeight:700, lineHeight:1.3 };
const SUB        = { fontSize:12, color:'var(--text-light)', marginTop:2 };
const RATING     = { fontSize:13, fontWeight:700, flexShrink:0 };
const AMENITIES  = { display:'flex', flexWrap:'wrap', gap:6 };
const AMENITY_CHIP={ fontSize:12, color:'var(--text-mid)', display:'flex', alignItems:'center', gap:3 };
const BOTTOM     = { display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, marginTop:'auto' };
const TAGS_ROW   = { display:'flex', gap:4, flexWrap:'wrap' };
const PRICE_COL  = { textAlign:'right' };
