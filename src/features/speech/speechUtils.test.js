import test from 'node:test';
import assert from 'node:assert/strict';

import { selectSpeechVoice } from './speechUtils.js';

test('selectSpeechVoice prioritizes an exact preferred language match', () => {
  const voices = [
    { name: 'Generic Chinese', lang: 'zh-CN', default: false },
    { name: 'Taiwan Voice', lang: 'zh-TW', default: false },
    { name: 'System Default', lang: 'en-US', default: true },
  ];

  const selected = selectSpeechVoice(voices, 'zh-TW');

  assert.equal(selected?.name, 'Taiwan Voice');
});

test('selectSpeechVoice falls back to traditional Chinese variants before other Chinese voices', () => {
  const voices = [
    { name: 'Simplified Chinese', lang: 'zh-CN', default: false },
    { name: 'Traditional Chinese', lang: 'zh-HK', default: false },
    { name: 'System Default', lang: 'en-US', default: true },
  ];

  const selected = selectSpeechVoice(voices, 'zh-TW');

  assert.equal(selected?.name, 'Traditional Chinese');
});

test('selectSpeechVoice falls back to any Chinese voice before browser default', () => {
  const voices = [
    { name: 'US English', lang: 'en-US', default: true },
    { name: 'Simplified Chinese', lang: 'zh-CN', default: false },
  ];

  const selected = selectSpeechVoice(voices, 'zh-TW');

  assert.equal(selected?.name, 'Simplified Chinese');
});

test('selectSpeechVoice returns null when no voices are available yet', () => {
  const selected = selectSpeechVoice([], 'zh-TW');

  assert.equal(selected, null);
});

test('selectSpeechVoice returns null when no Chinese voice exists so caller can use browser default behavior', () => {
  const voices = [
    { name: 'US English', lang: 'en-US', default: true },
    { name: 'Japanese', lang: 'ja-JP', default: false },
  ];

  const selected = selectSpeechVoice(voices, 'zh-TW');

  assert.equal(selected, null);
});
