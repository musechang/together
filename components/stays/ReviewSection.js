import { useState } from 'react';
import { useReviews } from '../../lib/hooks';
import { useAuth } from '../../lib/hooks';

export default function ReviewSection({ hotelId }) {
  const { reviews, addReview } = useReviews(hotelId);
  const { user } = useAuth();
  const [form, setForm] = useState({ rating: 5, comment: '', dogName: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setSubmitting(true);
    addReview({ hotelId, ...form, userName: user?.name || '匿名旅人', userDog: form.dogName });
    setForm({ rating: 5, comment: '', dogName: '' });
    setSubmitting(false);
  }

  return (
    <div>
      <div style={{ fontFamily:'Noto Serif TC,serif', fontSize:18, fontWeight:700, margin:'28px 0 16px' }}>
        旅客評論 {reviews.length > 0 && <span style={{ fontSize:14, fontWeight:400, color:'var(--text-light)' }}>（{reviews.length}則）</span>}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div style={{ padding:'24px', background:'var(--green-light)', borderRadius:12, fontSize:13, color:'var(--text-mid)', textAlign:'center' }}>
          還沒有評論，成為第一位分享的旅人 🐾
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:24 }}>
          {reviews.map(r => (
            <div key={r.id} style={REVIEW_CARD}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div>
                  <span style={{ fontWeight:700, fontSize:13 }}>{r.userName}</span>
                  {r.userDog && <span style={{ fontSize:12, color:'var(--text-light)', marginLeft:8 }}>與 {r.userDog} 同行</span>}
                </div>
                <div style={{ fontSize:13 }}>{'🐾'.repeat(r.rating)}</div>
              </div>
              <p style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.7 }}>{r.comment}</p>
              <div style={{ fontSize:11, color:'var(--text-light)', marginTop:8 }}>
                {new Date(r.createdAt).toLocaleDateString('zh-TW')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write a review */}
      <div style={FORM_WRAP}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>留下你的評論</div>
        <form onSubmit={handleSubmit}>
          <div style={FIELD}>
            <label style={LABEL}>評分</label>
            <div style={{ display:'flex', gap:6 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button"
                  style={{ fontSize:22, background:'none', border:'none', cursor:'pointer', opacity: form.rating>=n ? 1 : .3 }}
                  onClick={() => setForm(f => ({ ...f, rating: n }))}>🐾</button>
              ))}
            </div>
          </div>
          <div style={FIELD}>
            <label style={LABEL}>狗狗名字（選填）</label>
            <input style={INPUT} value={form.dogName} placeholder="例：小黑"
              onChange={e => setForm(f => ({ ...f, dogName: e.target.value }))} />
          </div>
          <div style={FIELD}>
            <label style={LABEL}>評論內容</label>
            <textarea style={{ ...INPUT, height:88, resize:'vertical' }}
              value={form.comment} placeholder="分享你和毛孩的入住體驗..."
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
          </div>
          <button type="submit" disabled={submitting || !form.comment.trim()} style={SUBMIT_BTN}>
            {submitting ? '送出中...' : '送出評論'}
          </button>
        </form>
      </div>
    </div>
  );
}

const REVIEW_CARD= { background:'var(--white)', border:'1px solid var(--border)', borderRadius:12, padding:16 };
const FORM_WRAP  = { background:'var(--cream)', border:'1px solid var(--border)', borderRadius:14, padding:20 };
const FIELD      = { marginBottom:14 };
const LABEL      = { display:'block', fontSize:12, fontWeight:600, color:'var(--text-light)', marginBottom:6 };
const INPUT      = { width:'100%', padding:'10px 12px', border:'1.5px solid var(--border)', borderRadius:10, fontSize:13, fontFamily:'Noto Sans TC,sans-serif', outline:'none', background:'var(--white)' };
const SUBMIT_BTN = { padding:'11px 24px', background:'var(--green-dark)', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Noto Sans TC,sans-serif' };
