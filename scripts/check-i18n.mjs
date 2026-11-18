#!/usr/bin/env node
// Every translated attribute needs its twin on the same element, or the language
// toggle silently leaves stale text or an empty label behind.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const HTML_FILES = ['index.html', 'assets/og-card.html'];

const PAIRS = [
  { code: 'pt', twin: 'en' },
  { code: 'en', twin: 'pt' },
];

// A quoted value may contain a raw `>`, so the tag cannot stop at the first one.
const TAG = /<[a-zA-Z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;
const ATTRIBUTE = /([^\s"'=<>/`]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

function pairOf(name) {
  if (!name.startsWith('data-')) return null;
  return PAIRS.find(({ code }) => name.endsWith(`-${code}`)) ?? null;
}

function twinOf(name, { code, twin }) {
  return `${name.slice(0, name.length - code.length)}${twin}`;
}

function attributesOf(tagText) {
  return [...tagText.matchAll(ATTRIBUTE)].map((match) => ({
    name: match[1],
    value: match[2] ?? match[3] ?? match[4] ?? '',
    offset: match.index,
  }));
}

function lineAt(source, offset) {
  return source.slice(0, offset).split('\n').length;
}

const violations = [];
let elements = 0;

for (const file of HTML_FILES) {
  const source = readFileSync(resolve(root, file), 'utf8');

  for (const tag of source.matchAll(TAG)) {
    const attributes = attributesOf(tag[0]);
    const translated = attributes
      .map((attribute) => ({ ...attribute, pair: pairOf(attribute.name) }))
      .filter(({ pair }) => pair !== null);
    if (translated.length === 0) continue;

    elements += 1;
    const values = new Map(attributes.map(({ name, value }) => [name, value]));

    for (const { name, offset, pair } of translated) {
      const twin = twinOf(name, pair);
      const twinValue = values.get(twin);
      if (twinValue !== undefined && twinValue.trim() !== '') continue;
      const line = lineAt(source, tag.index + offset);
      const detail = twinValue === undefined ? '' : ' (valor vazio)';
      violations.push(`${file}:${line}: ${name} sem ${twin}${detail}`);
    }
  }
}

if (violations.length > 0) {
  for (const violation of violations) console.error(violation);
  console.error(`Translation pair violations: ${violations.length}.`);
  process.exit(1);
}

const plural = elements === 1 ? '' : 's';
console.log(`Translation pairs OK (${elements} translatable element${plural}).`);
