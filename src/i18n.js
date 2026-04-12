/**
 * i18n.js — Japanese / English UI strings.
 */

export const TRANSLATIONS = {
  ja: {
    appTitle: '日本語ダミーテキスト',
    appSubtitle: '名作文学からダミーテキストを生成',
    source: '作品',
    mode: 'モード',
    modeParagraphs: '段落',
    modeSentences: '文',
    modeCharacters: '文字数',
    count: '数',
    font: 'フォント',
    fontSerif: '明朝体',
    fontSansSerif: 'ゴシック体',
    fontMono: '等幅',
    generate: '生成',
    copy: 'コピー',
    copied: 'コピー済み',
    theme: 'テーマ',
    themeDark: 'ダーク',
    themeLight: 'ライト',
    lang: 'EN',
    charCount: '文字',
    paragraphCount: '段落',
    sentenceCount: '文',
    outputPlaceholder: '「生成」ボタンを押してください',
  },
  en: {
    appTitle: 'Lorem JP',
    appSubtitle: 'Generate dummy text from classic Japanese literature',
    source: 'Source',
    mode: 'Mode',
    modeParagraphs: 'Paragraphs',
    modeSentences: 'Sentences',
    modeCharacters: 'Characters',
    count: 'Count',
    font: 'Font',
    fontSerif: 'Serif',
    fontSansSerif: 'Sans-serif',
    fontMono: 'Mono',
    generate: 'Generate',
    copy: 'Copy',
    copied: 'Copied!',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    lang: 'JA',
    charCount: 'chars',
    paragraphCount: 'paragraphs',
    sentenceCount: 'sentences',
    outputPlaceholder: 'Press "Generate" to create text',
  },
};

/**
 * Return the translation object for the given locale.
 * Falls back to English for unknown locales.
 * @param {'ja'|'en'} locale
 * @returns {Record<string, string>}
 */
export function t(locale) {
  return TRANSLATIONS[locale] ?? TRANSLATIONS.en;
}
