import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/streak";

// Figma wireframe: "③ 완료" (03_Complete)
// DB reads: the just-finished learning_sessions row (?session=<id>) + its
// phrases, plus every session_date for this user to compute the streak.
export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  let session: { id: string; duration_seconds: number } | null = null;
  let phrases: { spanish_text: string; korean_translation: string }[] = [];

  if (sessionId) {
    const { data: sessionRow } = await supabase
      .from("learning_sessions")
      .select("id, duration_seconds")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();
    session = sessionRow;

    if (session) {
      const { data: phraseRows } = await supabase
        .from("phrases")
        .select("spanish_text, korean_translation")
        .eq("session_id", session.id);
      phrases = phraseRows ?? [];
    }
  }

  const { data: allSessions } = await supabase
    .from("learning_sessions")
    .select("session_date")
    .eq("user_id", user.id);
  const streak = computeStreak((allSessions ?? []).map((s) => s.session_date));

  const durationMinutes = session ? Math.max(1, Math.round(session.duration_seconds / 60)) : 0;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center gap-6 px-5 pb-8 pt-12">
      <div className="animate-pop-in flex h-40 w-[200px] items-center justify-center rounded-full border border-dashed border-rosa-200 bg-rosa-50/40 text-center text-xs font-medium text-neutral-500">
        [콜리브리 축하 모션]
      </div>

      <h1 className="animate-fade-slide-up text-center text-xl font-bold">
        오늘의 학습 완료!
      </h1>
      <p className="animate-fade-slide-up text-center text-[13px] text-neutral-500">
        {streak}일 연속 학습 중이에요 — 이대로만 가면 발리에서 술술!
      </p>

      <div className="grid w-full grid-cols-3 gap-3">
        {[
          [`${phrases.length}개`, "새 표현", false],
          [`${durationMinutes}분`, "학습 시간", false],
          [`${streak}일`, "연속 학습", true],
        ].map(([value, label, isStreak], i) => (
          <div
            key={label as string}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-pop-in flex flex-col items-center gap-1 rounded-xl bg-neutral-100 py-4"
          >
            <span
              className={`text-lg font-bold ${isStreak ? "text-rosa-600" : ""}`}
            >
              {value}
            </span>
            <span className="text-[11px] text-neutral-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2">
        <h2 className="text-sm font-bold">오늘 배운 표현</h2>
        {phrases.length === 0 && (
          <p className="text-center text-xs text-neutral-400">
            표시할 학습 기록이 없어요.
          </p>
        )}
        {phrases.map((p) => (
          <div
            key={p.spanish_text}
            className="flex items-center justify-between rounded-xl border border-neutral-100 px-3.5 py-3"
          >
            <span className="text-[13px] font-medium">{p.spanish_text}</span>
            <span className="text-xs text-neutral-500">{p.korean_translation}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <Link
          href="/"
          className="w-full rounded-2xl bg-neutral-900 py-4 text-center font-bold text-white transition-transform active:scale-95"
        >
          홈으로
        </Link>
        <Link
          href="/complete/share"
          className="w-full rounded-2xl border border-neutral-300 py-4 text-center font-bold transition-transform active:scale-95"
        >
          인스타 스토리로 공유하기
        </Link>
        <Link
          href="/archive"
          className="py-1 text-center text-[13px] font-medium text-neutral-500 transition-transform active:scale-95"
        >
          아카이브에서 보기
        </Link>
      </div>
    </main>
  );
}
