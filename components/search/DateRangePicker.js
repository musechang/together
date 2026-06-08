import { useState } from 'react';

const DAYS_OF_WEEK = ['日','一','二','三','四','五','六'];

function pad(n) { return n < 10 ? '0' + n : '' + n; }
function fmt(d) { return d ? `${d.getMonth()+1}/${d.getDate()}` : ''; }

function MonthGrid({ year, month, checkin, checkout, onPick }) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(<td key={`e${i}`} />);
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const ts = d.getTime();
    const isStart = checkin && ts === checkin.getTime();
    const isEnd = checkout && ts === checkout.getTime();
    const inRange = checkin && checkout && d > checkin && d < checkout;
    const disabled = d < today;
    let bg = 'none', color = 'var(--text-dark)', radius = 6;
    if (isStart || isEnd) { bg = 'var(--green-dark)'; color = 'white'; }
    else if (inRange) { bg = 'var(--green-light)'; radius = 0; }
    cells.push(
      <td key={day} style={{ padding: 1 }}>
        <button
          disabled={disabled}
          onClick={() => onPick(new Date(year, month, day))}
          style={{ width: '100%', padding: '7px 4px', border: 'none', background: bg, color: disabled ? 'var(--border)' : color, borderRadius: radius, cursor: disabled ? 'default' : 'pointer', fontSize: 12, fontFamily: 'Noto Sans TC,sans-serif', transition: 'background .1s' }}
        >{day}</button>
      </td>
    );
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i+7));

  return (
    <div>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
        {year} 年 {month+1} 月
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{DAYS_OF_WEEK.map(d => <th key={d} style={{ fontSize: 10, color: 'var(--text-light)', padding: '4px 0', fontWeight: 400 }}>{d}</th>)}</tr>
        </thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function DateRangePicker({ checkin, checkout, onChange, onConfirm }) {
  const now = new Date();
  const [offset, setOffset] = useState(0);
  const m1 = { year: now.getFullYear(), month: now.getMonth() + offset };
  const m2 = { year: now.getFullYear(), month: now.getMonth() + offset + 1 };
  // handle year overflow
  if (m1.month > 11) { m1.year += Math.floor(m1.month/12); m1.month %= 12; }
  if (m2.month > 11) { m2.year += Math.floor(m2.month/12); m2.month %= 12; }

  function handlePick(d) {
    if (!checkin || (checkin && checkout)) {
      onChange(d, null);
    } else if (d > checkin) {
      onChange(checkin, d);
    } else {
      onChange(d, null);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => setOffset(o => Math.max(0, o-1))} style={NAV_BTN}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' }}>選擇入住 / 退房日</span>
        <button onClick={() => setOffset(o => o+1)} style={NAV_BTN}>›</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <MonthGrid {...m1} checkin={checkin} checkout={checkout} onPick={handlePick} />
        <MonthGrid {...m2} checkin={checkin} checkout={checkout} onPick={handlePick} />
      </div>
      {checkin && (
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--green-light)', borderRadius: 10, fontSize: 12, color: 'var(--green-dark)', fontWeight: 500 }}>
          ✈️ {fmt(checkin)}{checkout ? ` → ${fmt(checkout)}` : ' · 請選擇退房日'}
          {checkin && checkout && (
            <button style={{ marginLeft: 12, background: 'var(--green-dark)', color: 'white', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'Noto Sans TC,sans-serif' }} onClick={onConfirm}>確認</button>
          )}
        </div>
      )}
    </div>
  );
}

const NAV_BTN = { background: 'none', border: '1px solid var(--border)', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 16 };
