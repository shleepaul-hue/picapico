"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  buildBonusChoices,
  buildChoices,
  pickSessionPhrases,
  type Phrase,
} from "@/lib/phrasebank";
import PronunciationCheck from "@/components/PronunciationCheck";
import BrandTransition from "@/components/BrandTransition";

type Question = { phrase: Phrase; choices: string[] };
type Phase = "study" | "quiz" | "bonus-intro" | "bonus" | "finishing";

function buildQuestions(): Question[] {
  const phrases = pickSessionPhrases();
  return phrases.map((phrase) => ({
    phrase,
    choices: buildChoices(phrase, phrases),
  }));
}

function buildBonusQuestions(questions: Question[]): Question[] {
  const phrases = questions.map((q) => q.phrase);
  return phrases.map((phrase) => ({
    phrase,
    choices: buildBonusChoices(phrase, phrases),
  }));
}

type Props = {
  destination: string | null;
  dDayLabel: string | null;
};

// Figma wireframe: "② 학습 세션" (02_StudySession), extended into:
// 학습(뜻+발음+섀도잉) → 퀴즈(뜻 맞히기) × 5, then 응용문제(뜻→스페인어 역방향
// 회상, 오늘 배운 5개끼리를 오답으로 써서 헷갈리기 쉬운 오답이 자연히 나옴) × 5.
// DB: on finish, inserts one learning_sessions row + its phrases rows (main
// 5개만 — 응용문제는 복습용이라 별도 저장하지 않음), then hands off to /complete.
export default function StudySession({ destination, dDayLabel }: Props) {
  const router = useRouter();
  const [questions] = useState<Question[]>(buildQuestions);
  const [bonusQuestions] = useState<Question[]>(() => buildBonusQuestions(questions));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("study");
  const [attemptedPronunciation, setAttemptedPronunciation] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [bonusCorrectCount, setBonusCorrectCount] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const bonusCurrent = bonusQuestions[index];
  const isBonusLast = index === bonusQuestions.length - 1;

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(current.phrase.spanish);
    utterance.lang = "es-ES";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const finishSession = async () => {
    setError(null);

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인 정보를 확인할 수 없어요. 다시 로그인해주세요.");
      setPhase("bonus");
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from("learning_sessions")
      .insert({
        user_id: user.id,
        session_date: new Date().toISOString().slice(0, 10),
        duration_seconds: durationSeconds,
        category: "스몰토크",
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      setError(sessionError?.message ?? "세션 저장에 실패했어요.");
      setPhase("bonus");
      return;
    }

    const { error: phrasesError } = await supabase.from("phrases").insert(
      questions.map((q) => ({
        session_id: session.id,
        spanish_text: q.phrase.spanish,
        korean_translation: q.phrase.korean,
      }))
    );

    if (phrasesError) {
      setError(phrasesError.message);
      setPhase("bonus");
      return;
    }

    router.push(`/complete?session=${session.id}`);
  };

  const goToQuiz = () => {
    if (!attemptedPronunciation) return;
    setPhase("quiz");
  };

  const handleNext = () => {
    if (selected === null) return;

    setCorrectCount((c) => c + (selected === current.phrase.korean ? 1 : 0));

    if (isLast) {
      setPhase("bonus-intro");
      setIndex(0);
      setSelected(null);
      return;
    }

    setIndex((i) => i + 1);
    setPhase("study");
    setAttemptedPronunciation(false);
    setSelected(null);
  };

  const handleBonusNext = () => {
    if (selected === null) return;

    const finalBonusCorrect =
      bonusCorrectCount + (selected === bonusCurrent.phrase.spanish ? 1 : 0);
    setBonusCorrectCount(finalBonusCorrect);

    if (isBonusLast) {
      setSelected(null);
      setPhase("finishing");
      void finishSession();
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (phase === "finishing") {
    return (
      <BrandTransition
        label="오늘의 학습 기록을 저장하는 중..."
        destination={destination}
        dDayLabel={dDayLabel}
      />
    );
  }

  if (phase === "bonus-intro") {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-5 py-6 text-center">
        <Link
          href="/"
          aria-label="닫기"
          className="absolute left-5 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600"
        >
          X
        </Link>
        <span className="text-xs font-bold text-neutral-400">STEP 2 · 응용문제</span>
        <h2 className="text-xl font-bold">
          오늘 배운 5개 표현,
          <br />
          거꾸로도 기억하시나요?
        </h2>
        <p className="rounded-full bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-700">
          방금 퀴즈 {correctCount}/{questions.length}개 정답
        </p>
        <p className="text-[13px] text-neutral-500">
          이번엔 뜻을 보고 스페인어를 골라보세요.
          <br />
          비슷비슷한 표현들 사이에서 헷갈리지 않는지 확인해봐요.
        </p>
        <button
          type="button"
          onClick={() => setPhase("bonus")}
          className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white"
        >
          응용문제 시작하기 (5문제)
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-6 px-5 py-6">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          aria-label="닫기"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600"
        >
          X
        </Link>
        <div className="flex flex-1 gap-1.5">
          {(phase === "bonus" ? bonusQuestions : questions).map((q, i) => (
            <span
              key={`${phase === "bonus" ? "b" : "m"}-${q.phrase.spanish}`}
              className={`h-1.5 flex-1 rounded-full ${
                i <= index
                  ? phase === "bonus"
                    ? "bg-amber-500"
                    : "bg-neutral-900"
                  : "bg-neutral-100"
              }`}
            />
          ))}
        </div>
      </div>

      {phase === "study" && (
        <>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-300 px-5 py-7">
            <p className="text-xs font-medium text-neutral-600">새로운 표현</p>
            <p className="text-2xl font-bold">&ldquo;{current.phrase.spanish}&rdquo;</p>
            <p className="text-[15px] font-medium text-neutral-600">
              뜻: {current.phrase.korean}
            </p>
            <button
              type="button"
              onClick={handleSpeak}
              className="flex items-center gap-2 rounded-full bg-neutral-100 px-4.5 py-2.5 text-[13px] font-medium text-neutral-600"
            >
              🔊 발음 듣기
            </button>
          </div>

          <PronunciationCheck
            target={current.phrase.spanish}
            onAttempt={() => setAttemptedPronunciation(true)}
          />

          <button
            type="button"
            onClick={goToQuiz}
            disabled={!attemptedPronunciation}
            className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            퀴즈 풀어보기 →
          </button>
        </>
      )}

      {phase === "quiz" && (
        <>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-300 px-5 py-7">
            <p className="text-xs font-medium text-neutral-600">이 표현, 기억하시나요?</p>
            <p className="text-2xl font-bold">&ldquo;{current.phrase.spanish}&rdquo;</p>
            <p className="text-[13px] text-neutral-500">
              &ldquo;이 표현은 무슨 뜻일까요?&rdquo;
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {current.choices.map((choice) => {
              const isCorrectChoice = choice === current.phrase.korean;
              const isSelected = selected === choice;
              const showResult = selected !== null;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelected(choice)}
                  disabled={selected !== null}
                  className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                    showResult && isCorrectChoice
                      ? "border-2 border-neutral-900"
                      : showResult && isSelected
                        ? "border-red-300 bg-red-50"
                        : "border-neutral-300"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={selected === null}
            className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            {isLast ? "응용문제로 →" : "다음"}
          </button>
        </>
      )}

      {phase === "bonus" && (
        <>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50/40 px-5 py-7">
            <p className="text-xs font-bold text-amber-600">
              응용문제 {index + 1}/{bonusQuestions.length}
            </p>
            <p className="text-2xl font-bold">&ldquo;{bonusCurrent.phrase.korean}&rdquo;</p>
            <p className="text-[13px] text-neutral-500">
              &ldquo;스페인어로는 뭐라고 할까요?&rdquo;
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {bonusCurrent.choices.map((choice) => {
              const isCorrectChoice = choice === bonusCurrent.phrase.spanish;
              const isSelected = selected === choice;
              const showResult = selected !== null;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelected(choice)}
                  disabled={selected !== null}
                  className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                    showResult && isCorrectChoice
                      ? "border-2 border-neutral-900"
                      : showResult && isSelected
                        ? "border-red-300 bg-red-50"
                        : "border-neutral-300"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleBonusNext}
            disabled={selected === null}
            className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            {isBonusLast ? "완료" : "다음"}
          </button>
        </>
      )}
    </main>
  );
}
