import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function walk(dir, out = []) {
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (p.endsWith('.js') || p.endsWith('.mjs')) out.push(p);
  }
  return out;
}

const roots = ['js', 'data'];
const files = roots.flatMap((r) => walk(r));
let ok = true;
for (const f of files) {
  const res = spawnSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  if (res.status !== 0) {
    ok = false;
    process.stderr.write(`\n❌ Syntax error in ${f}\n`);
    process.stderr.write(res.stderr);
  }
}

if (ok) {
  console.log(`✅ Syntax OK (${files.length} files checked)`);
  process.exit(0);
}
process.exit(1);
