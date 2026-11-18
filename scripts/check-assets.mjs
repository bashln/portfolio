#!/usr/bin/env node
// Verifies that every local asset referenced by the site actually exists.
// Catches broken asset paths, which a static site cannot recover from at runtime.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const HTML_FILES = ['index.html', 'assets/og-card.html'];
const CSS_FILES = ['assets/style/style.css'];

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

function references(source, pattern) {
  const found = [];
  for (const match of source.matchAll(pattern)) {
    found.push(match[1].trim());
  }
  return found;
}

const checks = [];

for (const file of HTML_FILES) {
  const refs = references(readFileSync(resolve(root, file), 'utf8'), /\b(?:href|src)="([^"]+)"/g);
  for (const ref of refs) checks.push({ file, ref });
}

// Quoted url() values may contain parentheses (data URIs), so capture by quote.
const CSS_URL = /url\(\s*(?:'([^']*)'|"([^"]*)"|([^)'"\s]+))\s*\)/g;

for (const file of CSS_FILES) {
  const source = readFileSync(resolve(root, file), 'utf8');
  for (const match of source.matchAll(CSS_URL)) {
    const ref = match[1] ?? match[2] ?? match[3] ?? '';
    checks.push({ file, ref: ref.trim() });
  }
}

const missing = [];
let local = 0;

for (const { file, ref } of checks) {
  if (!ref || EXTERNAL.test(ref)) continue;
  local += 1;
  const path = resolve(root, dirname(file), ref.split(/[?#]/)[0]);
  if (!existsSync(path)) missing.push({ file, ref });
}

if (missing.length > 0) {
  console.error(`Broken asset references (${missing.length}):`);
  for (const { file, ref } of missing) console.error(`  ${file}: ${ref}`);
  process.exit(1);
}

console.log(`Asset references OK (${local} local path${local === 1 ? '' : 's'}).`);
