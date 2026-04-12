/**
 * main.js — DOM, events, and rendering for Lorem JP.
 */

import { SOURCES_LIST, generateParagraphs, generateSentences, generateCharacters } from './lorem.js';
import { t, TRANSLATIONS } from './i18n.js';

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  locale: 'ja',
  theme: 'light',
  source: 'neko',
  mode: 'paragraphs',
  count: 3,
  font: 'serif',
  output: '',
};

// ── DOM refs ───────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const elSourceSelect   = $('source-select');
const elModeSelect     = $('mode-select');
const elCountInput     = $('count-input');
const elCountSlider    = $('count-slider');
const elFontToggle     = $('font-toggle');
const elGenerateBtn    = $('generate-btn');
const elCopyBtn        = $('copy-btn');
const elOutput         = $('output-area');
const elOutputMeta     = $('output-meta');
const elThemeToggle    = $('theme-toggle');
const elLangToggle     = $('lang-toggle');

// ── Source selector ────────────────────────────────────────────────────────

function populateSources() {
  elSourceSelect.innerHTML = '';
  SOURCES_LIST.forEach(({ id, title, author }) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${author}「${title}」`;
    elSourceSelect.appendChild(opt);
  });
  elSourceSelect.value = state.source;
}

// ── Mode limits ────────────────────────────────────────────────────────────

const MODE_LIMITS = {
  paragraphs: { min: 1, max: 10, default: 3 },
  sentences:  { min: 1, max: 50, default: 10 },
  characters: { min: 10, max: 5000, default: 200 },
};

function applyModeLimits(mode) {
  const { min, max, default: def } = MODE_LIMITS[mode];
  elCountInput.min    = min;
  elCountInput.max    = max;
  elCountSlider.min   = min;
  elCountSlider.max   = max;
  const clamped = Math.min(max, Math.max(min, state.count || def));
  state.count = clamped;
  elCountInput.value  = clamped;
  elCountSlider.value = clamped;
}

// ── Font cycling ───────────────────────────────────────────────────────────

const FONTS = ['serif', 'sans-serif', 'mono'];
const FONT_CLASS = { serif: 'font-serif', 'sans-serif': 'font-sans', mono: 'font-mono' };

function applyFont(font) {
  elOutput.className = elOutput.className
    .split(' ')
    .filter((c) => !c.startsWith('font-'))
    .join(' ');
  elOutput.classList.add(FONT_CLASS[font]);
}

// ── i18n rendering ─────────────────────────────────────────────────────────

function applyLocale() {
  const tr = t(state.locale);
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) el.textContent = tr[key];
  });
  // mode select options
  elModeSelect.querySelector('[value="paragraphs"]').textContent = tr.modeParagraphs;
  elModeSelect.querySelector('[value="sentences"]').textContent  = tr.modeSentences;
  elModeSelect.querySelector('[value="characters"]').textContent = tr.modeCharacters;
  // font toggle options
  const fontOpts = elFontToggle.querySelectorAll('option');
  fontOpts[0].textContent = tr.fontSerif;
  fontOpts[1].textContent = tr.fontSansSerif;
  fontOpts[2].textContent = tr.fontMono;
  // output placeholder if empty
  if (!state.output) {
    elOutput.textContent = tr.outputPlaceholder;
    elOutput.classList.add('placeholder');
  }
  renderMeta();
}

// ── Theme ──────────────────────────────────────────────────────────────────

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Generate ───────────────────────────────────────────────────────────────

function generate() {
  const { source, mode, count } = state;
  let result = '';

  if (mode === 'paragraphs') {
    result = generateParagraphs(source, count).join('\n\n');
  } else if (mode === 'sentences') {
    result = generateSentences(source, count).join('');
  } else {
    result = generateCharacters(source, count);
  }

  state.output = result;
  elOutput.textContent = result;
  elOutput.classList.remove('placeholder');
  renderMeta();
}

function renderMeta() {
  if (!state.output) {
    elOutputMeta.textContent = '';
    return;
  }
  const tr = t(state.locale);
  const chars = state.output.length;
  elOutputMeta.textContent = `${chars} ${tr.charCount}`;
}

// ── Copy ───────────────────────────────────────────────────────────────────

async function copyOutput() {
  if (!state.output) return;
  try {
    await navigator.clipboard.writeText(state.output);
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = state.output;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  const tr = t(state.locale);
  elCopyBtn.textContent = tr.copied;
  elCopyBtn.disabled = true;
  setTimeout(() => {
    elCopyBtn.textContent = tr.copy;
    elCopyBtn.disabled = false;
  }, 1500);
}

// ── Event listeners ────────────────────────────────────────────────────────

elSourceSelect.addEventListener('change', () => {
  state.source = elSourceSelect.value;
});

elModeSelect.addEventListener('change', () => {
  state.mode = elModeSelect.value;
  applyModeLimits(state.mode);
});

elCountInput.addEventListener('input', () => {
  const v = parseInt(elCountInput.value, 10);
  if (!isNaN(v)) {
    state.count = v;
    elCountSlider.value = v;
  }
});

elCountSlider.addEventListener('input', () => {
  const v = parseInt(elCountSlider.value, 10);
  state.count = v;
  elCountInput.value = v;
});

elFontToggle.addEventListener('change', () => {
  state.font = elFontToggle.value;
  applyFont(state.font);
});

elGenerateBtn.addEventListener('click', generate);

elCopyBtn.addEventListener('click', copyOutput);

elThemeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  const tr = t(state.locale);
  elThemeToggle.textContent = state.theme === 'light' ? tr.themeDark : tr.themeLight;
});

elLangToggle.addEventListener('click', () => {
  state.locale = state.locale === 'ja' ? 'en' : 'ja';
  applyLocale();
  // Update lang toggle label to opposite language
  elLangToggle.textContent = t(state.locale).lang;
});

// ── Init ───────────────────────────────────────────────────────────────────

function init() {
  populateSources();
  applyModeLimits(state.mode);
  applyFont(state.font);
  applyTheme(state.theme);
  applyLocale();
  elModeSelect.value = state.mode;
  elFontToggle.value = state.font;
}

init();
