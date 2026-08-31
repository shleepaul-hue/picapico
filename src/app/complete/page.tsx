import Link from "next/link";

// Figma wireframe: "③ 완료" (03_Complete)
// DB reads: today's learning_sessions row (duration, phrase count) + its phrases;
// current streak = consecutive session_date count ending today
export default function CompletePage() {
  const phrases = [
    ["¿De dónde eres?", "어디 출신이세요?"],
    ["Mucho gusto", "만나서 반가워요"],
    ["¿A dónde vas?", "어디 가세요?"],
  ];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center gap-6 px-5 pb-8 pt-12">
      <div className="flex h-40 w-[200px] items-center justify-center rounded-full border border-dashed border-neutral-300 bg-neutral-100 text-center text-xs font-medium text-neutral-500">
        [콜리브리 축하 모션]
      </div>

      <h1 className="text-center text-xl font-bold">오늘의 학습 완료!</h1>
      <p className="text-center text-[13px] text-neutral-500">
        5일 연속 학습 중이에요 — 이대로만 가면 발리에서 술술!
      </p>

      <div className="grid w-full grid-cols-3 gap-3">
        {[
          ["4개", "새 표현"],
          ["18분", "학습 시간"],
          ["5일", "연속 학습"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-xl bg-neutral-100 py-4"
          >
            <span className="text-lg font-bold">{value}</span>
            <span className="text-[11px] text-neutral-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2">
        <h2 className="text-sm font-bold">오늘 배운 표현</h2>
        {phrases.map(([es, ko]) => (
          <div
            key={es}
            className="flex items-center justify-between rounded-xl border border-neutral-100 px-3.5 py-3"
          >
            <span className="text-[13px] font-medium">{es}</span>
            <span className="text-xs text-neutral-500">{ko}</span>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <Link
          href="/"
          className="w-full rounded-2xl bg-neutral-900 py-4 text-center font-bold text-white"
        >
          홈으로
        </Link>
        <Link
          href="/complete/share"
          className="w-full rounded-2xl border border-neutral-300 py-4 text-center font-bold"
        >
          인스타 스토리로 공유하기
        </Link>
        <Link
          href="/archive"
          className="py-1 text-center text-[13px] font-medium text-neutral-500"
        >
          아카이브에서 보기
        </Link>
      </div>
    </main>
  );
}
