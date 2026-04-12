/**
 * lorem.test.js — Tests for lorem.js core logic.
 * Run with: node --test tests/lorem.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SOURCES_LIST,
  getSourceParagraphs,
  splitSentences,
  getAllSentences,
  generateParagraphs,
  generateSentences,
  generateCharacters,
} from '../src/lorem.js';

// ── SOURCES_LIST ──────────────────────────────────────────────────────────

describe('SOURCES_LIST', () => {
  it('has exactly 5 sources', () => {
    assert.strictEqual(SOURCES_LIST.length, 5);
  });

  it('every source has id, title, author', () => {
    for (const src of SOURCES_LIST) {
      assert.ok(src.id,     `missing id: ${JSON.stringify(src)}`);
      assert.ok(src.title,  `missing title for ${src.id}`);
      assert.ok(src.author, `missing author for ${src.id}`);
    }
  });

  it('contains the five expected source ids', () => {
    const ids = SOURCES_LIST.map((s) => s.id);
    for (const expected of ['neko', 'ginga', 'melos', 'rashomon', 'daraku']) {
      assert.ok(ids.includes(expected), `missing source: ${expected}`);
    }
  });
});

// ── getSourceParagraphs ───────────────────────────────────────────────────

describe('getSourceParagraphs', () => {
  it('returns an array for every source', () => {
    for (const { id } of SOURCES_LIST) {
      const paras = getSourceParagraphs(id);
      assert.ok(Array.isArray(paras), `${id}: not an array`);
    }
  });

  it('every source has at least 8 paragraphs', () => {
    for (const { id } of SOURCES_LIST) {
      const paras = getSourceParagraphs(id);
      assert.ok(paras.length >= 8, `${id}: only ${paras.length} paragraphs`);
    }
  });

  it('every paragraph is a non-empty string', () => {
    for (const { id } of SOURCES_LIST) {
      const paras = getSourceParagraphs(id);
      for (const p of paras) {
        assert.ok(typeof p === 'string' && p.length > 0, `${id}: empty paragraph`);
      }
    }
  });

  it('throws for unknown source id', () => {
    assert.throws(() => getSourceParagraphs('unknown_xyz'), /Unknown source/);
  });
});

// ── splitSentences ────────────────────────────────────────────────────────

describe('splitSentences', () => {
  it('splits on 。', () => {
    const result = splitSentences('吾輩は猫である。名前はまだ無い。');
    assert.strictEqual(result.length, 2);
  });

  it('each returned sentence ends with 。', () => {
    const result = splitSentences('吾輩は猫である。名前はまだ無い。');
    for (const s of result) {
      assert.ok(s.endsWith('。'), `sentence missing 。: "${s}"`);
    }
  });

  it('filters empty strings', () => {
    const result = splitSentences('。。。吾輩は猫である。。');
    for (const s of result) {
      assert.ok(s.trim().length > 0);
    }
  });

  it('returns single sentence string intact', () => {
    const result = splitSentences('走れメロス。');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0], '走れメロス。');
  });

  it('returns empty array for empty string', () => {
    const result = splitSentences('');
    assert.strictEqual(result.length, 0);
  });
});

// ── getAllSentences ────────────────────────────────────────────────────────

describe('getAllSentences', () => {
  it('returns a non-empty array for every source', () => {
    for (const { id } of SOURCES_LIST) {
      const sentences = getAllSentences(id);
      assert.ok(sentences.length > 0, `${id}: no sentences`);
    }
  });

  it('all sentences are non-empty strings ending with 。', () => {
    const sentences = getAllSentences('neko');
    for (const s of sentences) {
      assert.ok(typeof s === 'string' && s.length > 0);
      assert.ok(s.endsWith('。'), `neko sentence missing 。: "${s.slice(0, 20)}"`);
    }
  });
});

// ── generateParagraphs ────────────────────────────────────────────────────

describe('generateParagraphs', () => {
  it('returns correct count of 1', () => {
    const result = generateParagraphs('neko', 1);
    assert.strictEqual(result.length, 1);
  });

  it('returns correct count of 5', () => {
    const result = generateParagraphs('neko', 5);
    assert.strictEqual(result.length, 5);
  });

  it('returns empty array for count 0', () => {
    const result = generateParagraphs('neko', 0);
    assert.deepStrictEqual(result, []);
  });

  it('wraps around when count exceeds paragraph count', () => {
    const total = getSourceParagraphs('neko').length;
    const result = generateParagraphs('neko', total + 3);
    assert.strictEqual(result.length, total + 3);
    // first wrapped paragraph = paragraph at index 0
    assert.strictEqual(result[total], result[0]);
  });

  it('handles large counts via wrapping', () => {
    const result = generateParagraphs('ginga', 50);
    assert.strictEqual(result.length, 50);
  });

  it('returns strings', () => {
    for (const p of generateParagraphs('melos', 3)) {
      assert.ok(typeof p === 'string');
    }
  });

  it('works for all sources', () => {
    for (const { id } of SOURCES_LIST) {
      assert.strictEqual(generateParagraphs(id, 2).length, 2);
    }
  });
});

// ── generateSentences ─────────────────────────────────────────────────────

describe('generateSentences', () => {
  it('returns correct count of 1', () => {
    assert.strictEqual(generateSentences('neko', 1).length, 1);
  });

  it('returns correct count of 10', () => {
    assert.strictEqual(generateSentences('neko', 10).length, 10);
  });

  it('returns empty array for count 0', () => {
    assert.deepStrictEqual(generateSentences('neko', 0), []);
  });

  it('wraps around when count exceeds available sentences', () => {
    const allSentences = getAllSentences('neko');
    const n = allSentences.length;
    const result = generateSentences('neko', n + 2);
    assert.strictEqual(result.length, n + 2);
    assert.strictEqual(result[n], result[0]);
  });

  it('all returned sentences are non-empty strings', () => {
    for (const s of generateSentences('rashomon', 5)) {
      assert.ok(typeof s === 'string' && s.length > 0);
    }
  });

  it('works for all sources', () => {
    for (const { id } of SOURCES_LIST) {
      assert.strictEqual(generateSentences(id, 3).length, 3);
    }
  });
});

// ── generateCharacters ────────────────────────────────────────────────────

describe('generateCharacters', () => {
  it('returns exactly 10 characters', () => {
    const result = generateCharacters('neko', 10);
    assert.strictEqual([...result].length, 10);
  });

  it('returns exactly 100 characters', () => {
    const result = generateCharacters('neko', 100);
    assert.strictEqual([...result].length, 100);
  });

  it('returns exactly 5000 characters', () => {
    const result = generateCharacters('neko', 5000);
    assert.strictEqual([...result].length, 5000);
  });

  it('returns empty string for count 0', () => {
    assert.strictEqual(generateCharacters('neko', 0), '');
  });

  it('wraps source text for large counts', () => {
    // Each source has far fewer than 10000 chars; this must wrap
    const result = generateCharacters('ginga', 10000);
    assert.strictEqual([...result].length, 10000);
  });

  it('returns a string', () => {
    assert.ok(typeof generateCharacters('melos', 50) === 'string');
  });

  it('works for all sources', () => {
    for (const { id } of SOURCES_LIST) {
      assert.strictEqual([...generateCharacters(id, 20)].length, 20);
    }
  });
});
