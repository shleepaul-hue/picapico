"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buildChoices, pickSessionPhrases, type Phrase } from "@/lib/phrasebank";
import PronunciationCheck from "@/components/PronunciationCheck";

type Question = { phrase: Phrase; choices: string[] };
type Phase = "study" | "quiz";

function buildQuestions(): Question[] {
  const phrases = pickSessionPhrases();
  return phrases.map((phrase) => ({
    phrase,
    choices: buildChoices(phrase, phrases),
  }));
}

// Figma wireframe: "② 학습 세션" (02_StudySession), extended into two
// phases per phrase — 학습(뜻+발음+섀도잉) 다음 퀴즈(뜻 맞히기) — so the
// quiz isn't a cold guess.
// DB: on finish, inserts one learning_sessions row + its phrases rows,
// then hands off to /complete?session=<id>
export default function StudySession() {
  const router = useRouter();
  const [questions] = useState<Question[]>(buildQuestions);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("study");
  const [attemptedPronunciation, setAttemptedPronunciation] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(current.phrase.spanish);
    utterance.lang = "es-ES";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const finishSession = async (finalCorrect: number) => {
    setSaving(true);
    setError(null);

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인 정보를 확인할 수 없어요. 다시 로그인해주세요.");
      setSaving(false);
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
      setSaving(false);
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
      setSaving(false);
      return;
    }

    void finalCorrect; // accuracy isn't shown yet, but kept for future use
    router.push(`/complete?session=${session.id}`);
  };

  const goToQuiz = () => {
    if (!attemptedPronunciation) return;
    setPhase("quiz");
  };

  const handleNext = async () => {
    if (selected === null || saving) return;

    const finalCorrect = correctCount + (selected === current.phrase.korean ? 1 : 0);
    setCorrectCount(finalCorrect);

    if (isLast) {
      await finishSession(finalCorrect);
      return;
    }

    setIndex((i) => i + 1);
    setPhase("study");
    setAttemptedPronunciation(false);
    setSelected(null);
  };

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
          {questions.map((q, i) => (
            <span
              key={q.phrase.spanish}
              className={`h-1.5 flex-1 rounded-full ${
                i <= index ? "bg-neutral-900" : "bg-neutral-100"
              }`}
            />
          ))}
        </div>
      </div>

      {phase === "study" ? (
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
      ) : (
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

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleNext}
            disabled={selected === null || saving}
            className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            {saving ? "저장 중..." : isLast ? "완료" : "다음"}
          </button>
        </>
      )}
    </main>
  );
}
