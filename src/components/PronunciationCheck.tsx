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

type Status = "idle" | "listening" | "ready" | "scored" | "error";

type Props = {
  target: string;
  // Fired once the user has either finished an attempt or explicitly
  // skipped — the parent uses this to unlock the "퀴즈로" button.
  onAttempt: () => void;
};

// One combined "따라 말해보기 → 채점하기" flow: recording IS the speech
// recognition pass (Web Speech API), so there's a single mic action instead
// of a separate waveform recorder + a separate scoring button. The score is
// an approximation (Web Speech API doesn't expose real phonetic scoring) —
// framed as "참고용" so it isn't mistaken for the real thing. Not supported
// on iOS Safari in most versions — "건너뛰기" keeps the flow moving there.
export default function PronunciationCheck({ target, onAttempt }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState<string | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);

  const supported = getSpeechRecognitionCtor() !== null;

  const handleRecord = () => {
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
      setStatus("ready");
      onAttempt();
    };
    recognition.onerror = () => setStatus("error");
    recognition.onend = () => setStatus((s) => (s === "listening" ? "idle" : s));

    setStatus("listening");
    recognition.start();
  };

  const handleSkip = () => {
    setStatus("scored");
    onAttempt();
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-neutral-500">
          소리 내어 따라 말해보세요 (참고용 채점)
        </p>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[11px] font-medium text-neutral-400 underline"
        >
          건너뛰기
        </button>
      </div>

      {!supported && (
        <p className="text-[11px] text-neutral-400">
          이 브라우저는 음성 인식을 지원하지 않아요 (아이폰 사파리는 대부분 미지원) — 건너뛰기를 눌러주세요.
        </p>
      )}

      {supported && (status === "idle" || status === "listening" || status === "error") && (
        <div className="flex flex-col items-center gap-2 py-3">
          <button
            type="button"
            onClick={handleRecord}
            disabled={status === "listening"}
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white transition-colors ${
              status === "listening" ? "animate-pulse bg-red-500" : "bg-neutral-900"
            }`}
            aria-label="따라 말해보기"
          >
            🎤
          </button>
          <p className="text-[13px] font-medium text-neutral-600">
            {status === "listening" ? "듣는 중... 지금 말해보세요" : "따라 말해보기"}
          </p>
          {status === "error" && (
            <p className="text-[11px] text-red-500">
              마이크 인식에 실패했어요. 다시 시도하거나 건너뛰어주세요.
            </p>
          )}
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={() => setStatus("scored")}
          className="rounded-full bg-neutral-900 px-4 py-3 text-[13px] font-bold text-white"
        >
          채점하기
        </button>
      )}

      {status === "scored" && result && heard !== null && (
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
          <button
            type="button"
            onClick={handleRecord}
            className="mt-1 self-start text-[11px] font-medium text-neutral-500 underline"
          >
            다시 시도하기
          </button>
        </div>
      )}
    </div>
  );
}
