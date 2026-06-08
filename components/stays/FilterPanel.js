import { useState } from 'react';

const FILTER_GROUPS = [
  { key: 'dogSize', label: '狗狗大小', options: [
    { value: '小', label: '小型犬 <10kg' },
    { value: '中', label: '中型犬 10-25kg' },
    { value: '大', label: '大型犬 >25kg' },
  ]},
  { key: 'amenity', label: '住宿需求', options: [
    { value: 'furniture', label: '可上家具' },
    { value: 'lawn',      label: '有草地區' },
    { value: 'park',      label: '附近有公園' },
    { value: 'dogpark',   label: '狗狗公園' },
    { value: 'restaurant',label: '可到餐廳' },
    { value: 'bowl',      label: '提供水碗' },
    { value: 'dogBed',    label: '狗狗床鋪' },
    { value: 'dogBath',   label: '狗狗淋浴' },
    { value: 'sitter',    label: '狗狗保姆' },
    { value: 'sensitive', label: '高敏狗首選' },
  ]},
  { key: 'type', label: '住宿類型', options: [
    { value: '獨棟民宿', label: '獨棟民宿' },
    { value: '公寓',    label: '公寓' },
    { value: '飯店',    label: '飯店' },
    { value: '渡假木屋', label: '渡假木屋' },
    { value: '營區',    label: '營區' },
  ]},
];

export default function FilterPanel({ filters, onChange }) {
  const [collapsed, setCollapsed] = useState({});

  function toggle(value, group) {
    const next = { ...filters };
    if (!next[group]) next[group] = [];
    if (next[group].includes(value)) {
      next[group] = next[group].filter(v => v !== value);
    } else {
      next[group] = [...next[group], value];
    }
    onChange(next);
  }

  function isActive(value, group) {
    return (filters[group] || []).includes(value);
  }

  return (
    <div style={PANEL}>
      <div style={TITLE}>
        條件篩選
        <button style={CLEAR} onClick={() => onChange({})}>清除</button>
      </div>

      {FILTER_GROUPS.map(group => (
        <div key={group.key} style={GROUP}>
          <button style={GROUP_HDR} onClick={() => setCollapsed(c => ({ ...c, [group.key]: !c[group.key] }))}>
            <span style={{ fontWeight:700, fontSize:13 }}>{group.label}</span>
            <span style={{ color:'var(--text-light)', fontSize:12 }}>{collapsed[group.key] ? '＋' : '－'}</span>
          </button>
          {!collapsed[group.key] && (
            <div style={CHIPS}>
              {group.options.map(opt => (
                <button
                  key={opt.value}
                  style={{ ...CHIP, ...(isActive(opt.value, group.key) ? CHIP_ON : {}) }}
                  onClick={() => toggle(opt.value, group.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function applyFilters(hotels, filters) {
  return hotels.filter(h => {
    if (filters.dogSize?.length) {
      if (!filters.dogSize.some(s => h.dogSize?.includes(s))) return false;
    }
    if (filters.amenity?.length) {
      const MAP = { furniture:'furniture', lawn:'lawn', park:'park', dogpark:'dogpark', restaurant:'restaurant', bowl:'bowl', dogBed:'dogBed', dogBath:'dogBath', sitter:'sitter', sensitive:'sensitive' };
      const CHECK = { lawn:'有' };
      for (const a of filters.amenity) {
        const field = MAP[a];
        const expected = CHECK[a] || '是';
        if (h[field] !== expected && h[field] !== '可') return false;
      }
    }
    if (filters.type?.length) {
      if (!filters.type.includes(h.type)) return false;
    }
    return true;
  });
}

const PANEL    = { background:'var(--white)', border:'1px solid var(--border)', borderRadius:14, padding:18, position:'sticky', top:88, alignSelf:'start' };
const TITLE    = { fontSize:15, fontWeight:700, marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' };
const CLEAR    = { fontSize:12, color:'var(--text-light)', background:'none', border:'none', cursor:'pointer', textDecoration:'underline', fontFamily:'Noto Sans TC,sans-serif' };
const GROUP    = { marginBottom:18, borderBottom:'1px solid var(--border)', paddingBottom:18 };
const GROUP_HDR= { display:'flex', justifyContent:'space-between', width:'100%', background:'none', border:'none', cursor:'pointer', marginBottom:10, fontFamily:'Noto Sans TC,sans-serif' };
const CHIPS    = { display:'flex', flexWrap:'wrap', gap:6 };
const CHIP     = { fontSize:11, padding:'4px 10px', border:'1px solid var(--border)', borderRadius:20, cursor:'pointer', background:'var(--white)', color:'var(--text-mid)', transition:'all .15s', fontFamily:'Noto Sans TC,sans-serif' };
const CHIP_ON  = { background:'var(--green-dark)', color:'white', borderColor:'var(--green-dark)' };
