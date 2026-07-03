const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wwsgqhpxnaixahyatfqo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3c2dxaHB4bmFpeGFoeWF0ZnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMzE2MTYsImV4cCI6MjA5ODYwNzYxNn0.iRhxGEWBp0YHpPzNJtHuscRoPt8ma-_yQae-5-xdRD8';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const files = [
  { file: 'ranking.json', profile: 'default' },
  { file: 'ranking_jussi.json', profile: 'jussi' },
  { file: 'ranking_erii.json', profile: 'erii' },
];

(async () => {
  for (const { file, profile } of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Arquivo ${file} não encontrado, pulando.`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.length) {
      console.log(`${file} vazio, pulando.`);
      continue;
    }
    const rows = data.map(e => ({
      profile,
      char_id: e.charId,
      char_name: e.charName,
      dps: e.dps,
      record_id: e.id,
    }));
    const { error } = await supabase.from('rankings').insert(rows);
    if (error) {
      console.error(`Erro ao importar ${file}:`, error);
    } else {
      console.log(`${file} → ${rows.length} registros importados para o perfil "${profile}"`);
    }
  }
  console.log('Migração concluída!');
})();
