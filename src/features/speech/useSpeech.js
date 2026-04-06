import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectSpeechSettings } from './speechSlice';

/**
 * Web Speech API hook，預設使用 zh-TW 語音
 */
export function useSpeech() {
  const { rate, pitch, volume, preferredLang } = useSelector(selectSpeechSettings);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      utterance.lang = preferredLang;

      // 過濾出 zh-TW 語音
      const voices = window.speechSynthesis.getVoices();
      const zhTWVoice = voices.find((v) => v.lang === preferredLang);
      if (zhTWVoice) {
        utterance.voice = zhTWVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [rate, pitch, volume, preferredLang]
  );

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
