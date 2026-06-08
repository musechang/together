import Layout from '../../components/layout/Layout';
import Link from 'next/link';

const MOCK_POSTS = [
  { slug:'dog-travel-guide-taiwan', title:'帶狗旅行全攻略：台灣狗狗友善景點精選', date:'2024-03-15', tag:'旅遊指南', cover:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop', excerpt:'帶著毛孩出門旅行前，你需要知道的一切準備事項...' },
  { slug:'large-dog-friendly-hotels', title:'大型犬友善住宿推薦：不用再擔心拒絕入住', date:'2024-03-08', tag:'住宿推薦', cover:'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop', excerpt:'體型較大的狗狗在找住宿時常常碰壁，這篇整理了...' },
  { slug:'sensitive-dog-travel-tips', title:'高敏感狗狗的旅行指南：讓毛孩也能放鬆出遊', date:'2024-02-28', tag:'狗狗健康', cover:'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop', excerpt:'高敏感的狗狗在陌生環境容易緊張，以下幾個訣竅...' },
  { slug:'yilan-dog-friendly-spots', title:'宜蘭狗狗友善一日遊：從住宿到景點完整規劃', date:'2024-02-20', tag:'目的地', cover:'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?w=600&h=400&fit=crop', excerpt:'宜蘭是台灣最適合帶狗旅行的縣市之一...' },
  { slug:'dog-packing-checklist', title:'帶狗出門必備清單：別讓這些小細節壞了旅程', date:'2024-02-10', tag:'旅遊指南', cover:'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop', excerpt:'每次帶狗出門旅行，打包都是一門學問...' },
  { slug:'dog-restaurant-etiquette', title:'帶狗去餐廳：你需要知道的禮儀與規定', date:'2024-01-30', tag:'生活知識', cover:'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&h=400&fit=crop', excerpt:'越來越多餐廳歡迎攜帶狗狗入座，但仍有一些需要注意...' },
];

const TAG_COLORS = {
  '旅遊指南': { bg:'#E8F4FD', color:'#1A6FA0' },
  '住宿推薦': { bg:'var(--green-light)', color:'var(--green-dark)' },
  '狗狗健康': { bg:'#FFF3E0', color:'#E65100' },
  '目的地':   { bg:'#F3E5F5', color:'#7B1FA2' },
  '生活知識': { bg:'#E8F5E9', color:'#2E7D32' },
};

export default function BlogPage() {
  const featured = MOCK_POSTS[0];
  const rest = MOCK_POSTS.slice(1);

  return (
    <div style={PAGE}>
      <div style={HEADER}>
        <h1 style={TITLE}>狗狗旅行誌</h1>
        <p style={SUB}>帶著毛孩探索台灣，每一段旅程都是故事</p>
      </div>

      {/* Featured post */}
      <Link href={`/blog/${featured.slug}`} style={FEATURED}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={featured.cover} alt={featured.title} style={FEATURED_IMG} />
        <div style={FEATURED_BODY}>
          <span style={{ ...TAG_CHIP, ...TAG_COLORS[featured.tag] }}>{featured.tag}</span>
          <h2 style={FEATURED_TITLE}>{featured.title}</h2>
          <p style={FEATURED_EXCERPT}>{featured.excerpt}</p>
          <span style={READ_MORE}>閱讀更多 →</span>
        </div>
      </Link>

      {/* Post grid */}
      <div style={GRID}>
        {rest.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={POST_CARD}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt={post.title} style={POST_IMG} />
            <div style={POST_BODY}>
              <span style={{ ...TAG_CHIP, ...(TAG_COLORS[post.tag]||{bg:'var(--green-light)',color:'var(--green-dark)'}) }}>{post.tag}</span>
              <h3 style={POST_TITLE}>{post.title}</h3>
              <p style={POST_EXCERPT}>{post.excerpt}</p>
              <div style={POST_DATE}>{new Date(post.date).toLocaleDateString('zh-TW')}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

BlogPage.getLayout = (page) => <Layout>{page}</Layout>;

const PAGE           = { maxWidth:1100, margin:'0 auto', padding:'48px 48px 60px' };
const HEADER         = { textAlign:'center', marginBottom:48 };
const TITLE          = { fontFamily:'Noto Serif TC,serif', fontSize:36, fontWeight:700, marginBottom:8 };
const SUB            = { fontSize:15, color:'var(--text-light)' };
const FEATURED       = { display:'grid', gridTemplateColumns:'1.2fr 1fr', borderRadius:20, overflow:'hidden', background:'var(--white)', border:'1px solid var(--border)', marginBottom:40, textDecoration:'none', color:'inherit', boxShadow:'var(--shadow-sm)' };
const FEATURED_IMG   = { width:'100%', height:320, objectFit:'cover', display:'block' };
const FEATURED_BODY  = { padding:32, display:'flex', flexDirection:'column', gap:12 };
const FEATURED_TITLE = { fontFamily:'Noto Serif TC,serif', fontSize:22, fontWeight:700, lineHeight:1.4 };
const FEATURED_EXCERPT={ fontSize:14, color:'var(--text-mid)', lineHeight:1.7, flex:1 };
const READ_MORE      = { fontSize:13, color:'var(--green-dark)', fontWeight:700 };
const GRID           = { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 };
const POST_CARD      = { background:'var(--white)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', textDecoration:'none', color:'inherit', transition:'transform .2s, box-shadow .2s', display:'flex', flexDirection:'column' };
const POST_IMG       = { width:'100%', height:180, objectFit:'cover', display:'block' };
const POST_BODY      = { padding:16, display:'flex', flexDirection:'column', gap:8, flex:1 };
const POST_TITLE     = { fontFamily:'Noto Serif TC,serif', fontSize:15, fontWeight:700, lineHeight:1.4 };
const POST_EXCERPT   = { fontSize:12, color:'var(--text-mid)', lineHeight:1.6, flex:1 };
const POST_DATE      = { fontSize:11, color:'var(--text-light)' };
const TAG_CHIP       = { display:'inline-block', fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:600 };
