"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Info } from "lucide-react";
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
  onspeechend: (() => void) | null;
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

type Status = "idle" | "listening" | "scoring" | "scored" | "error";

type Props = {
  target: string;
  // Fired once the user has either finished an attempt or explicitly
  // skipped — the parent uses this to unlock the "퀴즈로" button.
  onAttempt: () => void;
};

// One combined "따라 말해보기 → 자동 채점" 흐름: 녹음이 곧 음성 인식(Web Speech
// API) 시도라 별도의 웨이브폼 녹음기 + 별도의 "채점하기" 버튼이 필요 없다.
// 말이 끝나면(onspeechend) "채점 중..."을 잠깐 보여주고, 인식 결과가 오면
// (onresult) 자동으로 점수를 공개한다 — 사용자가 누를 버튼이 없다.
// 점수는 근사치(Web Speech API는 실제 음소 단위 채점을 제공하지 않음) — 카드
// 안에 긴 안내 문구를 두는 대신 "안내" 아이콘으로 /pronunciation-guide 해설
// 페이지를 연결해 필요한 사람만 자세히 보게 한다. 아이폰 사파리는 대부분
// 미지원 — "건너뛰기"로 흐름 유지.
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

    // 말이 끝난 시점에 바로 "채점 중" 상태로 전환 — 결과가 오기까지 약간의
    // 처리 시간이 있으므로 그 사이를 빈 화면 대신 로딩으로 채운다.
    recognition.onspeechend = () => setStatus((s) => (s === "listening" ? "scoring" : s));

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
      setResult(scorePronunciation(target, transcript));
      setStatus("scored");
      onAttempt();
    };
    recognition.onerror = () => setStatus("error");
    // 결과 없이 인식이 끝났다면(무음 등) 처음 상태로 — 채점 중이던 건은 곧
    // onresult가 뒤따라오거나 에러로 처리되므로 여기서 되돌리지 않는다.
    recognition.onend = () => setStatus((s) => (s === "listening" ? "idle" : s));

    setStatus("listening");
    setResult(null);
    setHeard(null);
    recognition.start();
  };

  const handleSkip = () => {
    setStatus("scored");
    onAttempt();
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-neutral-50 p-4">
      <div className="flex items-center justify-between">
        <Link
          href="/pronunciation-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium text-neutral-400"
        >
          <Info size={13} strokeWidth={2} />
          발음 체크 안내
        </Link>
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
            className={`flex h-16 w-16 items-center justify-center rounded-full text-white transition-colors ${
              status === "listening" ? "animate-pulse bg-red-500" : "bg-rosa"
            }`}
            aria-label="따라 말해보기"
          >
            <Mic size={26} strokeWidth={2} />
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

      {status === "scoring" && (
        <div className="flex flex-col items-center gap-2 py-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rosa text-2xl">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
            </span>
          </span>
          <p className="text-[13px] font-medium text-neutral-600">채점 중...</p>
        </div>
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
                className={w.matched ? "text-ink" : "text-red-500 underline"}
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
