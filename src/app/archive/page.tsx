import { redirect } from "next/navigation";
import { ActivityCalendar } from "react-activity-calendar";
import { createClient } from "@/lib/supabase/server";

// Figma wireframe: "④ 아카이브" (04_Archive)
// DB reads: learning_sessions (list + heatmap) joined with their phrases
export default async function ArchivePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: sessionRows } = await supabase
    .from("learning_sessions")
    .select("id, session_date, category")
    .eq("user_id", user.id)
    .order("session_date", { ascending: false })
    .limit(30);
  const sessions = sessionRows ?? [];

  const sessionIds = sessions.map((s) => s.id);
  const { data: phraseRows } =
    sessionIds.length > 0
      ? await supabase
          .from("phrases")
          .select("session_id, spanish_text, korean_translation")
          .in("session_id", sessionIds)
      : { data: [] as { session_id: string; spanish_text: string; korean_translation: string }[] };

  const phrasesBySession = new Map<string, { spanish_text: string; korean_translation: string }[]>();
  for (const p of phraseRows ?? []) {
    const list = phrasesBySession.get(p.session_id) ?? [];
    list.push(p);
    phrasesBySession.set(p.session_id, list);
  }

  // Heatmap needs a value for every day in a contiguous range — fill in the
  // last ~5 weeks so react-activity-calendar always has a full grid, even
  // before any sessions exist.
  const heatmapDays = 35;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDateSet = new Set(sessions.map((s) => s.session_date));
  const heatmapData = Array.from({ length: heatmapDays }).map((_, i) => {
    const d = new Date(today.getTime() - (heatmapDays - 1 - i) * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    const hasSession = sessionDateSet.has(dateStr);
    return { date: dateStr, count: hasSession ? 1 : 0, level: hasSession ? 4 : 0 };
  });

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-5 px-5 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">아카이브</h1>
        <span className="h-6 w-6 rounded-full border border-neutral-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {["전체", "스몰토크", "인사", "즐겨찾기"].map((tab, i) => (
          <button
            key={tab}
            className={`rounded-full px-3.5 py-2 text-xs font-medium ${
              i === 0 ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-neutral-100 p-4">
        <p className="mb-2 text-xs font-medium text-neutral-600">최근 학습 기록</p>
        <ActivityCalendar
          data={heatmapData}
          showColorLegend={false}
          showMonthLabels={false}
          showTotalCount={false}
          showWeekdayLabels={false}
          blockSize={12}
          blockMargin={4}
          theme={{ light: ["#ebebeb", "#262626"], dark: ["#ebebeb", "#262626"] }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold">지난 학습 세션</h2>
        {sessions.length === 0 && (
          <p className="text-center text-xs text-neutral-400">
            아직 학습 기록이 없어요. 오늘의 학습을 시작해보세요!
          </p>
        )}
        {sessions.map((s) => {
          const phrases = phrasesBySession.get(s.id) ?? [];
          const d = new Date(`${s.session_date}T00:00:00Z`);
          const dateLabel = `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${
            weekdayLabels[d.getUTCDay()]
          })`;
          const preview =
            phrases.length > 1
              ? `${phrases[0].spanish_text} 외 ${phrases.length - 1}개`
              : (phrases[0]?.spanish_text ?? "");

          return (
            <div
              key={s.id}
              className="flex flex-col gap-1 rounded-xl border border-neutral-100 px-4 py-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold">{dateLabel}</span>
                <span className="text-[11px] text-neutral-500">
                  {s.category ?? "스몰토크"} · 표현 {phrases.length}개
                </span>
              </div>
              <span className="text-xs text-neutral-500">{preview}</span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
