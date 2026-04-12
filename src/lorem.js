/**
 * lorem.js — Pure logic for Japanese lorem ipsum generation.
 * No DOM dependencies; fully testable.
 */

import { SOURCES } from './texts.js';

/** Flat list of { id, title, author } for UI population */
export const SOURCES_LIST = Object.values(SOURCES).map(({ id, title, author }) => ({
  id,
  title,
  author,
}));

/**
 * Return all paragraphs for a given source id.
 * @param {string} sourceId
 * @returns {string[]}
 */
export function getSourceParagraphs(sourceId) {
  const src = SOURCES[sourceId];
  if (!src) throw new Error(`Unknown source: ${sourceId}`);
  return src.paragraphs;
}

/**
 * Split a paragraph into sentences on 。
 * Empty strings are filtered out.
 * @param {string} paragraph
 * @returns {string[]}
 */
export function splitSentences(paragraph) {
  return paragraph
    .split('。')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s + '。');
}

/**
 * Return all sentences from all paragraphs of a source.
 * @param {string} sourceId
 * @returns {string[]}
 */
export function getAllSentences(sourceId) {
  return getSourceParagraphs(sourceId).flatMap(splitSentences);
}

/**
 * Generate `count` paragraphs from the given source.
 * Wraps around if count exceeds the number of available paragraphs.
 * @param {string} sourceId
 * @param {number} count  1–∞
 * @returns {string[]}
 */
export function generateParagraphs(sourceId, count) {
  if (count <= 0) return [];
  const paragraphs = getSourceParagraphs(sourceId);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(paragraphs[i % paragraphs.length]);
  }
  return result;
}

/**
 * Generate `count` sentences from the given source.
 * Wraps around if count exceeds available sentences.
 * @param {string} sourceId
 * @param {number} count  1–∞
 * @returns {string[]}
 */
export function generateSentences(sourceId, count) {
  if (count <= 0) return [];
  const sentences = getAllSentences(sourceId);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(sentences[i % sentences.length]);
  }
  return result;
}

/**
 * Generate a string of exactly `count` characters from the given source.
 * Wraps around the full source text as needed.
 * @param {string} sourceId
 * @param {number} count  1–∞
 * @returns {string}
 */
export function generateCharacters(sourceId, count) {
  if (count <= 0) return '';
  const full = getSourceParagraphs(sourceId).join('');
  if (full.length === 0) return '';
  let result = '';
  while (result.length < count) {
    result += full;
  }
  return result.slice(0, count);
}
