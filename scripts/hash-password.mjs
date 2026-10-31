// Usage: node scripts/hash-password.mjs "<password>"
// Prints a PBKDF2 hash for the USERS secret. The password is never stored.
import { webcrypto as crypto } from 'node:crypto';

const pw = process.argv[2];
if (!pw) { console.error('usage: node scripts/hash-password.mjs "<password>"'); process.exit(1); }
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
const b = (u) => Buffer.from(u).toString('base64');
console.log(`pbkdf2$100000$${b(salt)}$${b(new Uint8Array(bits))}`);
