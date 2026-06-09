/* ══════════════════════════════════════════
   MapThumbnail.js
   Uses OpenStreetMap + Nominatim (free, no API key needed):
   1. Nominatim geocodes the address → lat/lon
   2. Static tile image rendered via openstreetmap.org tiles
   Fallback: show a styled placeholder with link to Google Maps
══════════════════════════════════════════ */
import { useState, useEffect } from 'react';

const TILE_SIZE = 256;

/**
 * Build a static map image URL using OSM tile server.
 * zoom=15, single tile centred on lat/lon.
 */
function osmStaticUrl(lat, lon, zoom = 14, width = 360, height = 180) {
  // Use staticmap service from openstreetmap.de (free, no key needed)
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lon},red`;
}

/**
 * Geocode an address string using Nominatim (free, no key).
 * Returns { lat, lon } or null.
 */
async function geocode(query) {
  if (!query || query.startsWith('http')) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'zh-TW,zh,en' } });
    const data = await res.json();
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

export default function MapThumbnail({ name, address }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Try to parse lat/lon directly from a Google Maps URL stored in address
  useEffect(() => {
    async function load() {
      setLoading(true);
      setImgError(false);

      // 1. Try to extract coords from Google Maps URL
      if (address?.startsWith('http')) {
        const m = address.match(/@([-\d.]+),([-\d.]+)/);
        if (m) {
          setCoords({ lat: parseFloat(m[1]), lon: parseFloat(m[2]) });
          setLoading(false);
          return;
        }
      }

      // 2. Geocode the hotel name + address via Nominatim
      const query = [name, address].filter(Boolean).join(' ');
      const result = await geocode(query);
      setCoords(result);
      setLoading(false);
    }
    load();
  }, [name, address]);

  // Clean address for display (strip markdown links)
  const displayAddr = address?.startsWith('http') ? name : address || name;

  // Google Maps fallback link
  const mapsUrl = coords
    ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=15/${coords.lat}/${coords.lon}`
    : `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + (address || ''))}`;

  return (
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={WRAP}>
      {loading ? (
        <div style={PLACEHOLDER}>
          <div style={{ fontSize:11, color:'var(--text-light)', marginTop:6 }}>地圖載入中…</div>
        </div>
      ) : coords && !imgError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={osmStaticUrl(coords.lat, coords.lon)}
            alt={`${name} 地圖`}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:12 }}
            onError={() => setImgError(true)}
          />
          {/* Overlay pin + label */}
          <div style={OVERLAY}>
            <span style={PIN}>📍</span>
            <span style={LABEL}>在 OpenStreetMap 查看</span>
          </div>
        </>
      ) : (
        <div style={PLACEHOLDER}>
          <span style={{ fontSize:32 }}>📍</span>
          <span style={{ fontWeight:600, color:'var(--green-dark)', fontSize:13 }}>查看地圖</span>
          <span style={{ fontSize:11, color:'var(--text-light)', textAlign:'center', maxWidth:200 }}>{displayAddr}</span>
        </div>
      )}
    </a>
  );
}

const WRAP        = { display:'block', position:'relative', height:180, borderRadius:12, overflow:'hidden', background:'var(--green-light)', textDecoration:'none', flexShrink:0 };
const PLACEHOLDER = { height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:16 };
const OVERLAY     = { position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,255,255,.88)', backdropFilter:'blur(4px)', padding:'8px 12px', display:'flex', alignItems:'center', gap:6 };
const PIN         = { fontSize:16 };
const LABEL       = { fontSize:12, fontWeight:600, color:'var(--green-dark)' };
