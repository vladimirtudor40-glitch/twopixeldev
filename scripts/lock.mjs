// While login is disabled, remove the management app from the build output,
// so /app does not exist on the server at all (not just hidden in the UI).
import { rmSync, existsSync } from 'node:fs';

if (process.env.NEXT_PUBLIC_LOGIN_ENABLED === 'false') {
  for (const p of ['out/app', 'out/app.html', 'out/app.txt']) {
    if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }
  console.log('[lock] login disabled: /app removed from out/');
}
