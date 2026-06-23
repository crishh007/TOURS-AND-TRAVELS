import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cp from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dotenvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(dotenvPath)) {
  console.log(`Loading env variables from ${dotenvPath}`);
  fs.readFileSync(dotenvPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

process.env.NODE_ENV = 'development';

try {
  cp.execSync('pnpm run build && pnpm run start', { stdio: 'inherit', env: process.env });
} catch (err) {
  process.exit(err.status || 1);
}
