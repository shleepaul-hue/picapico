// Rough, browser-STT-based pronunciation check: transcribe what the user
// said (Web Speech API) and compare it word-by-word against the target
// phrase. This is an approximation for quick feedback, not true phonetic
// scoring — the Web Speech API doesn't expose that, and we said as much
// to the user before building it ("참고용" everywhere in the UI copy).

const COMBINING_DIACRITICS = /[̀-ͯ]/g;
const PUNCTUATION = /[¿?¡!.,]/g;

function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "") // strip accents so STT quirks don't sink the score
    .replace(PUNCTUATION, "");
}

export type PronunciationResult = {
  score: number; // 0-100
  words: { word: string; matched: boolean }[];
};

export function scorePronunciation(target: string, heard: string): PronunciationResult {
  const targetWords = target.split(/\s+/).filter(Boolean);
  const heardSet = new Set(heard.split(/\s+/).filter(Boolean).map(normalizeWord));

  const words = targetWords.map((word) => ({
    word,
    matched: heardSet.has(normalizeWord(word)),
  }));

  const score =
    words.length === 0
      ? 0
      : Math.round((words.filter((w) => w.matched).length / words.length) * 100);

  return { score, words };
}
