/* ══════════════════════════════════════════
   lib/notion.js
   Server-side Notion data fetching.
   Called from Next.js API routes only —
   never imported on the client directly.
══════════════════════════════════════════ */

const FALLBACK_HOTELS = [
  { id:'hotel1', name:'Hotel1', type:'獨棟民宿', dogSize:'小', rating:4, price:'100',
    furniture:'可', lawn:'無', park:'是', dogpark:'否', restaurant:'是', bowl:'是',
    dogBed:'否', dogBath:'否', sitter:'否', sensitive:'否', dogArea:'否',
    address:'台北市', bookingUrl:'https://www.booking.com/hotel/tw/xi-yuan-lu-dian-tai-bei-shi.html',
    website:'', photos:[] },
  { id:'hotel2', name:'Hotel2', type:'營區', dogSize:'大、中、小', rating:5, price:'免費',
    furniture:'否', lawn:'有', park:'是', dogpark:'是', restaurant:'是', bowl:'是',
    dogBed:'否', dogBath:'否', sitter:'否', sensitive:'否', dogArea:'是',
    address:'台北市', bookingUrl:'https://www.booking.com/hotel/tw/episode-daan-taipei.html',
    website:'', photos:[] },
];

/**
 * Fetch all hotels from Notion via Anthropic API + Notion MCP.
 * Returns normalised hotel array.
 */
export async function fetchHotels() {
  const SYSTEM = `You are a data assistant. Use the provided Notion MCP tools.
1. Call notion-fetch with id="collection://3765d300-73ed-8005-89aa-000b6e97328a".
2. For each page UUID, call notion-fetch with that UUID to get full properties.
3. The 物件相片 field contains file:// encoded URLs — decode each and extract the "source" field (a booking.com URL).
4. Return ONLY a valid JSON array with this exact schema per hotel (no markdown):
{"id":"uuid","name":"旅宿業者","type":"物件類型","dogSize":"接受狗狗大小","rating":5,"price":"狗狗費用",
"furniture":"可以上家具(沙發、床)","lawn":"園內有狗狗草地區","park":"附近有公園","dogpark":"附近有狗狗公園",
"restaurant":"可以到餐廳區","bowl":"提供水碗","dogBed":"提供狗狗床鋪","dogBath":"狗狗淋浴設施",
"sitter":"附設狗狗保姆服務","sensitive":"高敏狗狗首選","dogArea":"狗狗在是否能在全區落地",
"address":"地址","bookingUrl":"decoded booking.com URL","website":"網頁","photos":[]}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM,
        messages: [{ role: 'user', content: 'Fetch all hotels and return the JSON array.' }],
        mcp_servers: [{ type: 'url', url: 'https://mcp.notion.com/mcp', name: 'notion' }],
      }),
    });
    const data = await res.json();
    let text = '';
    for (let i = data.content.length - 1; i >= 0; i--) {
      const blk = data.content[i];
      if (blk.type === 'text' && blk.text?.includes('[')) { text = blk.text; break; }
    }
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const s = text.indexOf('['), e = text.lastIndexOf(']');
    if (s >= 0 && e > s) text = text.slice(s, e + 1);
    return JSON.parse(text);
  } catch (err) {
    console.error('[notion] fetchHotels failed:', err);
    return FALLBACK_HOTELS;
  }
}

/**
 * Fetch a single hotel by id (from pre-fetched list or individual Notion call).
 */
export async function fetchHotelById(id) {
  const hotels = await fetchHotels();
  return hotels.find(h => h.id === id) || null;
}

export { FALLBACK_HOTELS };
