const TRADITIONAL_CHINESE_LOCALES = new Set(['zh-tw', 'zh-hk', 'zh-mo']);
const FALLBACK_VOICE_DELAY_MS = 300;

function normalizeLangTag(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, '-');
}

function normalizeVoiceName(value) {
  return String(value || '').trim().toLowerCase();
}

function isTraditionalChineseVoice(voice) {
  const lang = normalizeLangTag(voice?.lang);
  const name = normalizeVoiceName(voice?.name);

  return (
    lang.startsWith('zh-hant') ||
    TRADITIONAL_CHINESE_LOCALES.has(lang) ||
    name.includes('traditional') ||
    name.includes('taiwan')
  );
}

function isChineseVoice(voice) {
  return normalizeLangTag(voice?.lang).startsWith('zh');
}

export function selectSpeechVoice(voices, preferredLang) {
  const availableVoices = Array.isArray(voices) ? voices.filter(Boolean) : [];
  if (availableVoices.length === 0) {
    return null;
  }

  const normalizedPreferredLang = normalizeLangTag(preferredLang);

  const exactMatch = availableVoices.find(
    (voice) => normalizeLangTag(voice.lang) === normalizedPreferredLang
  );
  if (exactMatch) {
    return exactMatch;
  }

  const traditionalChineseMatch = availableVoices.find(isTraditionalChineseVoice);
  if (traditionalChineseMatch) {
    return traditionalChineseMatch;
  }

  const anyChineseMatch = availableVoices.find(isChineseVoice);
  if (anyChineseMatch) {
    return anyChineseMatch;
  }

  return null;
}

export function normalizeSpeechText(text) {
  return String(text ?? '').trim();
}

export { FALLBACK_VOICE_DELAY_MS };
