const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wwsgqhpxnaixahyatfqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3c2dxaHB4bmFpeGFoeWF0ZnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMzE2MTYsImV4cCI6MjA5ODYwNzYxNn0.iRhxGEWBp0YHpPzNJtHuscRoPt8ma-_yQae-5-xdRD8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PORT = 3002;
const DIR = __dirname;
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'amores2024';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const INDEX_HTML = fs.readFileSync(path.join(DIR, 'public', 'index.html'), 'utf8');

const ENKA_MAP = {
  'raiden': 'Shougun',
  'hu-tao': 'Hutao',
  'arataki-itto': 'Itto',
  'shikanoin-heizou': 'Heizo',
  'yae-miko': 'Yae',
  'kuki-shinobu': 'Shinobu',
  'yun-jin': 'Yunjin',
  'traveler-anemo': 'PlayerBoy',
  'traveler-geo': 'PlayerBoy',
  'traveler-electro': 'PlayerBoy',
  'traveler-dendro': 'PlayerBoy',
  'traveler-hydro': 'PlayerBoy',
  'traveler-pyro': 'PlayerBoy',
};

const DIRECT_URLS = {
  'sandrone': 'https://static.wikia.nocookie.net/gensin-impact/images/2/24/Sandrone_NPC_Icon.png/revision/latest/scale-to-width-down/250?cb=20251112212447',
  'ororon': 'https://genshin.ch/templates/assets/img/avatar_icons/a105_icon.webp',
  'skirk': 'https://i2.wp.com/images.genshin-builds.com/genshin/characters/skirk/image.png?strip=all&quality=100',
  'zibai': 'https://img.game8.co/4403969/bd050dd85852e4824497e34c351bef24.png/show',
};

function toTitle(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ /g, '');
}

function tryUrls(urls, index, res) {
  if (index >= urls.length) {
    res.writeHead(404);
    res.end();
    return;
  }
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  if (urls[index].includes('genshin.ch')) {
    headers['Referer'] = 'https://genshin.ch/';
    headers['Accept'] = 'image/webp,image/apng,image/*,*/*;q=0.8';
  }
  https.get(urls[index], { headers, timeout: 5000 }, (apiRes) => {
    if (apiRes.statusCode === 200) {
      const ct = apiRes.headers['content-type'] || 'image/webp';
      res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'public, max-age=86400' });
      apiRes.pipe(res);
      return;
    }
    tryUrls(urls, index + 1, res);
  }).on('error', () => {
    tryUrls(urls, index + 1, res);
  });
}

function handler(req, res) {
  const url = req.url.split('?')[0];

  if (url.startsWith('/wep-icon/')) {
    const WEP_URLS = {
      'sword': 'https://img.game8.co/3317419/008b4d15a84b24d759f6ce6d95aadbb0.png/show',
      'claymore': 'https://img.game8.co/3317393/82499d943420e8d1d73cefbaf38e6d22.png/show',
      'polearm': 'https://img.game8.co/3317391/1181cbfd83be46abbb0f343b42f591eb.png/show',
      'bow': 'https://img.game8.co/3317403/781ad4df07f5a76f1ddb27510994aa47.png/show',
      'catalyst': 'https://img.game8.co/3317396/5d06f7ac40f891bd593ea37a35e95402.png/show',
    };
    const type = url.slice(10).toLowerCase();
    if (WEP_URLS[type]) { tryUrls([WEP_URLS[type]], 0, res); return; }
    res.writeHead(404); res.end(); return;
  }

  if (url.startsWith('/icon/')) {
    const slug = url.slice(6);
    const enkaName = ENKA_MAP[slug] || toTitle(slug);
    const urls = [
      `https://genshin.jmp.blue/characters/${encodeURIComponent(slug)}/icon`,
      `https://enka.network/ui/UI_AvatarIcon_${enkaName}.png`,
    ];
    if (DIRECT_URLS[slug]) urls.push(DIRECT_URLS[slug]);
    tryUrls(urls, 0, res);
    return;
  }

  if (url.startsWith('/ele-icon/')) {
    const element = url.slice(10);
    const apiUrl = `https://genshin.jmp.blue/elements/${encodeURIComponent(element)}/icon`;
    tryUrls([apiUrl], 0, res);
    return;
  }

  if (url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body);
        if (password === ACCESS_PASSWORD) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end('{"error":"Senha incorreta"}');
        }
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  const qIdx = req.url.indexOf('?');
  const profile = qIdx !== -1 ? new URLSearchParams(req.url.slice(qIdx)).get('profile') || 'default' : 'default';

  const password = req.headers['x-access-password'];
  if ((url === '/api/ranking') && password !== ACCESS_PASSWORD) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end('{"error":"Acesso negado"}');
    return;
  }

  if (url === '/api/ranking' && req.method === 'GET') {
    supabase
      .from('rankings')
      .select('record_id, char_id, char_name, dps')
      .eq('profile', profile)
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error })); return; }
        const mapped = (data || []).map(r => ({
          id: r.record_id,
          charId: r.char_id,
          charName: r.char_name,
          dps: r.dps,
        }));
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify(mapped));
      });
    return;
  }

  if (url === '/api/ranking' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const entries = JSON.parse(body);
        const { error: delErr } = await supabase.from('rankings').delete().eq('profile', profile);
        if (delErr) { res.writeHead(500); res.end(JSON.stringify({ error: delErr })); return; }
        if (entries.length > 0) {
          const rows = entries.map(e => ({
            profile,
            char_id: e.charId,
            char_name: e.charName,
            dps: e.dps,
            record_id: e.id,
          }));
          const { error: insErr } = await supabase.from('rankings').insert(rows);
          if (insErr) { res.writeHead(500); res.end(JSON.stringify({ error: insErr })); return; }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' });
    res.end(INDEX_HTML);
    return;
  }

  let filePath = path.join(DIR, 'public', url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'public, max-age=86400' });
    res.end(data);
  });
}

const app = http.createServer(handler);

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GenshinRanking rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
