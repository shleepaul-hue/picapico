"use client";

import { useState } from "react";
import { scorePronunciation, type PronunciationResult } from "@/lib/pronunciation";

// Browser Speech Recognition (Web Speech API) isn't in the default TS lib —
// this is the minimal shape we actually use from it.
type SpeechRecognitionResultLike = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Props = {
  target: string;
  // Fired once the user has either gotten a result or explicitly skipped —
  // the parent uses this to unlock the "퀴즈로" button.
  onAttempt: () => void;
};

// Rough pronunciation feedback: record via the browser's speech recognition,
// compare the transcript to the target phrase word-by-word. This is an
// approximation (Web Speech API doesn't expose real phonetic scoring) —
// framed as "참고용" in the copy so it isn't mistaken for the real thing.
// Not supported on iOS Safari in most versions — a "건너뛰기" link keeps
// the flow moving there.
export default function PronunciationCheck({ target, onAttempt }: Props) {
  const [status, setStatus] = useState<"idle" | "listening" | "done" | "error">("idle");
  const [heard, setHeard] = useState<string | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);

  const supported = getSpeechRecognitionCtor() !== null;

  const handleStart = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
      setResult(scorePronunciation(target, transcript));
      setStatus("done");
      onAttempt();
    };
    recognition.onerror = () => setStatus("error");
    recognition.onend = () => setStatus((s) => (s === "listening" ? "idle" : s));

    setStatus("listening");
    recognition.start();
  };

  const handleSkip = () => {
    setStatus("done");
    onAttempt();
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-neutral-50 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-600">발음 정확도 확인 (참고용)</span>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[11px] font-medium text-neutral-400 underline"
        >
          건너뛰기
        </button>
      </div>

      {supported ? (
        <button
          type="button"
          onClick={handleStart}
          disabled={status === "listening"}
          className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-neutral-700 disabled:opacity-50"
        >
          {status === "listening" ? "듣는 중... 지금 말해보세요" : "🎤 따라 말하고 채점하기"}
        </button>
      ) : (
        <p className="text-[11px] text-neutral-400">
          이 브라우저는 음성 인식을 지원하지 않아요 (아이폰 사파리는 대부분 미지원) — 건너뛰기를 눌러주세요.
        </p>
      )}

      {status === "error" && (
        <p className="text-[11px] text-red-500">
          마이크 인식에 실패했어요. 권한을 확인하거나 건너뛰어주세요.
        </p>
      )}

      {result && heard !== null && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                result.score >= 80
                  ? "text-emerald-600"
                  : result.score >= 50
                    ? "text-amber-600"
                    : "text-red-500"
              }`}
            >
              {result.score}%
            </span>
            <span className="text-[11px] text-neutral-500">
              {result.score >= 80
                ? "발음이 아주 좋아요!"
                : result.score >= 50
                  ? "괜찮아요, 조금 더 또박또박!"
                  : "다시 한 번 천천히 말해볼까요?"}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed">
            {result.words.map((w, i) => (
              <span
                key={`${w.word}-${i}`}
                className={w.matched ? "text-neutral-900" : "text-red-500 underline"}
              >
                {w.word}
                {i < result.words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <p className="text-[11px] text-neutral-400">인식된 발음: &ldquo;{heard}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
