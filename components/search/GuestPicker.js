const DOG_SIZES = [
  { key: '小', label: '小型犬 <10kg' },
  { key: '中', label: '中型犬 10-25kg' },
  { key: '大', label: '大型犬 >25kg' },
];

function Counter({ label, sub, value, min, max, onMinus, onPlus }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize:14,fontWeight:600 }}>{label}</div>
        {sub && <div style={{ fontSize:11,color:'var(--text-light)',marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:12 }}>
        <button disabled={value<=min} onClick={onMinus} style={BTN(value<=min)}>−</button>
        <span style={{ fontSize:14,fontWeight:700,minWidth:20,textAlign:'center' }}>{value}</span>
        <button disabled={value>=max} onClick={onPlus} style={BTN(value>=max)}>+</button>
      </div>
    </div>
  );
}

export default function GuestPicker({ adults, dogs, dogSizes, onChange }) {
  function toggleSize(key) {
    const next = dogSizes.includes(key) ? dogSizes.filter(s=>s!==key) : [...dogSizes, key];
    onChange({ dogSizes: next });
  }

  return (
    <div>
      <Counter label="🧑 人數" sub="成人" value={adults} min={1} max={12}
        onMinus={() => onChange({ adults: adults - 1 })}
        onPlus={()  => onChange({ adults: adults + 1 })} />
      <Counter label="🐶 狗狗數量" sub="最多 5 隻" value={dogs} min={1} max={5}
        onMinus={() => onChange({ dogs: dogs - 1 })}
        onPlus={()  => onChange({ dogs: dogs + 1 })} />
      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:11,fontWeight:700,color:'var(--text-light)',marginBottom:10 }}>狗狗大小（可複選）</div>
        <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
          {DOG_SIZES.map(({ key, label }) => (
            <button key={key}
              onClick={() => toggleSize(key)}
              style={{ padding:'7px 14px',border:`1.5px solid ${dogSizes.includes(key)?'var(--green-dark)':'var(--border)'}`,borderRadius:20,background:dogSizes.includes(key)?'var(--green-dark)':'var(--white)',color:dogSizes.includes(key)?'white':'var(--text-mid)',fontSize:12,cursor:'pointer',transition:'all .15s',fontFamily:'Noto Sans TC,sans-serif' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const BTN = (disabled) => ({
  width:30,height:30,borderRadius:'50%',border:'1.5px solid var(--border)',background:'none',
  cursor:disabled?'default':'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',
  opacity:disabled?.3:1,fontWeight:700,transition:'all .15s',
});
