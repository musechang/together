import Link from 'next/link';

const COLS = [
  { title: '關於我們', links: [['我們的理念','/#'],['房源政策','/#'],['狗狗旅行守則','/#'],['聯絡我們','/#']] },
  { title: '合作夥伴', links: [['申請成為狗狗友善房源','/partner'],['申請成為評鑑員','/#'],['狗狗保姆','/#'],['狗狗友善計程車','/#']] },
  { title: '探索', links: [['住宿指南','/blog'],['熱門目的地','/stays'],['大型犬友善','/stays?dogSize=大'],['Blog','/blog']] },
];

export default function Footer() {
  return (
    <footer style={WRAP}>
      <div style={INNER}>
        <div style={BRAND_COL}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="together" width={32} height={32}
            style={{ borderRadius: 6, opacity: .9, marginRight: 10 }}
            onError={e => e.target.style.display = 'none'} />
          <span style={{ fontWeight: 700, fontSize: 18 }}>together</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.7, marginTop: 8 }}>
            收錄全台歡迎寵物的店家，<br />找到適合你家狗狗的友善住宿。
          </p>
        </div>
        {COLS.map(col => (
          <div key={col.title}>
            <div style={COL_TITLE}>{col.title}</div>
            <ul style={COL_LIST}>
              {col.links.map(([label, href]) => (
                <li key={label}><Link href={href} style={LINK}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={BOTTOM}>© 2024 together · 讓毛孩也能一起旅行</div>
    </footer>
  );
}

const WRAP  = { background: 'var(--green-dark)', color: 'white', padding: '52px 48px 36px' };
const INNER = { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 36 };
const BRAND_COL = { display: 'flex', flexDirection: 'column' };
const COL_TITLE = { fontSize: 13, fontWeight: 700, marginBottom: 14, color: '#A8C8B4' };
const COL_LIST  = { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 };
const LINK  = { fontSize: 12, color: 'rgba(255,255,255,.65)' };
const BOTTOM= { borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20, fontSize: 11, color: 'rgba(255,255,255,.35)' };
