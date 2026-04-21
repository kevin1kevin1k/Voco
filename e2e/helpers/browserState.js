export async function prepareFreshApp(page) {
  await page.addInitScript(() => {
    localStorage.clear();

    try {
      indexedDB.deleteDatabase('voco-assets');
    } catch {
      // Tests can still run if IndexedDB cleanup is unavailable in the browser.
    }

    window.__vocoSpeechCalls = [];

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: class MockSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = '';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
        this.voice = null;
      }
      },
    });

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
      onvoiceschanged: null,
      cancel() {},
      speak(utterance) {
        window.__vocoSpeechCalls.push({
          text: utterance.text,
          lang: utterance.lang,
          voice: utterance.voice?.name || null,
        });
      },
      getVoices() {
        return [{ name: 'Playwright zh-TW voice', lang: 'zh-TW' }];
      },
      addEventListener() {},
      removeEventListener() {},
      },
    });
  });
}

export async function expectSpeechCall(page, text) {
  await page.waitForFunction(
    (expectedText) =>
      window.__vocoSpeechCalls?.some((call) => call.text === expectedText),
    text
  );
}
