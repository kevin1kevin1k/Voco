import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectSpeechSettings } from './speechSlice';
import { FALLBACK_VOICE_DELAY_MS, normalizeSpeechText, selectSpeechVoice } from './speechUtils';

/**
 * Web Speech API hook，預設使用 zh-TW 語音
 */
export function useSpeech() {
  const { rate, pitch, volume, preferredLang } = useSelector(selectSpeechSettings);
  const speechSynthesisRef = useRef(null);
  const voicesRef = useRef([]);
  const pendingRequestRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const speakRequest = useCallback((request, voices = voicesRef.current) => {
    const speechSynthesis = speechSynthesisRef.current;
    if (!speechSynthesis || !request) return;

    const utterance = new SpeechSynthesisUtterance(request.text);
    utterance.rate = request.rate;
    utterance.pitch = request.pitch;
    utterance.volume = request.volume;
    utterance.lang = request.preferredLang;

    const selectedVoice = selectSpeechVoice(voices, request.preferredLang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return undefined;
    }

    const speechSynthesis = window.speechSynthesis;
    speechSynthesisRef.current = speechSynthesis;

    const syncVoices = () => {
      voicesRef.current = speechSynthesis.getVoices() || [];

      if (voicesRef.current.length === 0 || !pendingRequestRef.current) {
        return;
      }

      clearFallbackTimer();
      speechSynthesis.cancel();
      const pendingRequest = pendingRequestRef.current;
      pendingRequestRef.current = null;
      speakRequest(pendingRequest, voicesRef.current);
    };

    syncVoices();

    if (typeof speechSynthesis.addEventListener === 'function') {
      speechSynthesis.addEventListener('voiceschanged', syncVoices);
      return () => {
        clearFallbackTimer();
        speechSynthesis.removeEventListener('voiceschanged', syncVoices);
      };
    }

    const previousHandler = speechSynthesis.onvoiceschanged;
    speechSynthesis.onvoiceschanged = syncVoices;

    return () => {
      clearFallbackTimer();
      speechSynthesis.onvoiceschanged = previousHandler || null;
    };
  }, [clearFallbackTimer, speakRequest]);

  const speak = useCallback(
    (text) => {
      const speechSynthesis =
        speechSynthesisRef.current ?? (typeof window === 'undefined' ? null : window.speechSynthesis);
      if (!speechSynthesis) return;

      const normalizedText = normalizeSpeechText(text);
      if (!normalizedText) return;

      speechSynthesisRef.current = speechSynthesis;
      speechSynthesis.cancel();
      clearFallbackTimer();

      const request = {
        text: normalizedText,
        rate,
        pitch,
        volume,
        preferredLang,
      };

      const voices = speechSynthesis.getVoices() || [];
      voicesRef.current = voices;

      if (voices.length > 0) {
        pendingRequestRef.current = null;
        speakRequest(request, voices);
        return;
      }

      pendingRequestRef.current = request;
      fallbackTimerRef.current = setTimeout(() => {
        if (!pendingRequestRef.current) return;

        const latestRequest = pendingRequestRef.current;
        pendingRequestRef.current = null;
        speakRequest(latestRequest, []);
      }, FALLBACK_VOICE_DELAY_MS);
    },
    [clearFallbackTimer, pitch, preferredLang, rate, speakRequest, volume]
  );

  const stop = useCallback(() => {
    const speechSynthesis =
      speechSynthesisRef.current ?? (typeof window === 'undefined' ? null : window.speechSynthesis);
    clearFallbackTimer();
    pendingRequestRef.current = null;

    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  }, [clearFallbackTimer]);

  return { speak, stop };
}
