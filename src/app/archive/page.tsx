import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/streak";
import ArchiveTabs, { type ArchiveTab } from "@/components/ArchiveTabs";
import BottomNav, { NAV_CLEARANCE_CLASS } from "@/components/BottomNav";

const CATEGORY_TABS = ["스몰토크", "인사"] as const;

// Figma wireframe: "④ 아카이브" (04_Archive)
// DB reads: learning_sessions (list + heatmap) joined with their phrases
// (now including is_favorite, so the "즐겨찾기" tab is real data rather than
// decorative). Tabs are driven by ?tab= in the URL so filtering works as a
// plain server-rendered link — see ArchiveTabs for the disabled/tooltip UI.
export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const activeTab = rawTab && rawTab !== "" ? rawTab : "전체";

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
  const allSessions = sessionRows ?? [];

  const sessionIds = allSessions.map((s) => s.id);
  const { data: phraseRows } =
    sessionIds.length > 0
      ? await supabase
          .from("phrases")
          .select("session_id, spanish_text, korean_translation, is_favorite")
          .in("session_id", sessionIds)
      : {
          data: [] as {
            session_id: string;
            spanish_text: string;
            korean_translation: string;
            is_favorite: boolean;
          }[],
        };

  const phrasesBySession = new Map<
    string,
    { spanish_text: string; korean_translation: string; is_favorite: boolean }[]
  >();
  for (const p of phraseRows ?? []) {
    const list = phrasesBySession.get(p.session_id) ?? [];
    list.push(p);
    phrasesBySession.set(p.session_id, list);
  }

  const sessionHasFavorite = (sessionId: string) =>
    (phrasesBySession.get(sessionId) ?? []).some((p) => p.is_favorite);

  // Availability is computed from the FULL fetched set, independent of the
  // currently selected tab, so a tab's enabled/disabled state doesn't shift
  // depending on what's currently filtered.
  const tabs: ArchiveTab[] = [
    { key: "전체", label: "전체", enabled: allSessions.length > 0 },
    ...CATEGORY_TABS.map((cat) => ({
      key: cat,
      label: cat,
      enabled: allSessions.some((s) => s.category === cat),
    })),
    {
      key: "즐겨찾기",
      label: "즐겨찾기",
      enabled: allSessions.some((s) => sessionHasFavorite(s.id)),
    },
  ];

  const sessions =
    activeTab === "전체"
      ? allSessions
      : activeTab === "즐겨찾기"
        ? allSessions.filter((s) => sessionHasFavorite(s.id))
        : allSessions.filter((s) => s.category === activeTab);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Text-based monthly stat instead of the old heatmap widget — how many of
  // this month's days have a session, plus the running streak.
  const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const studiedThisMonth = new Set(
    allSessions
      .map((s) => s.session_date)
      .filter((d) => d.startsWith(monthPrefix)),
  ).size;
  const streak = computeStreak(allSessions.map((s) => s.session_date));

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-sm flex-col px-5 pt-6 ${NAV_CLEARANCE_CLASS}`}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold text-ink">아카이브</h1>

        <ArchiveTabs tabs={tabs} activeTab={activeTab} />

        <div className="rounded-3xl bg-gradient-to-br from-rosa-50 via-white to-arena p-[3px]">
          <div className="flex items-stretch overflow-hidden rounded-[21px] bg-white">
            <div className="flex flex-1 flex-col items-center gap-0.5 py-5">
              <span className="text-[26px] font-extrabold leading-none text-rosa-600">
                {studiedThisMonth}
                <span className="text-sm font-bold text-neutral-400">/{daysInMonth}일</span>
              </span>
              <span className="text-[11px] font-medium text-neutral-500">
                {today.getMonth() + 1}월 학습일
              </span>
            </div>
            <div className="w-px bg-neutral-100" />
            <div className="flex flex-1 flex-col items-center gap-0.5 py-5">
              <span className="text-[26px] font-extrabold leading-none text-rosa-600">
                🔥 {streak}
              </span>
              <span className="text-[11px] font-medium text-neutral-500">일 연속</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-ink">지난 학습 세션</h2>
          {sessions.length === 0 && (
            <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-8 text-center text-xs text-neutral-400">
              {activeTab === "전체" ? (
                <>
                  아직 학습 기록이 없어요.
                  <br />
                  오늘의 학습을 시작해보세요!
                </>
              ) : (
                <>
                  이 카테고리엔 아직 기록이 없어요.
                  <br />
                  공부가 더 필요해요!
                </>
              )}
            </p>
          )}
          {sessions.map((s) => {
            const phrases = phrasesBySession.get(s.id) ?? [];
            const hasFavorite = phrases.some((p) => p.is_favorite);
            const d = new Date(`${s.session_date}T00:00:00Z`);
            const isToday = s.session_date === today.toISOString().slice(0, 10);
            const isYesterday =
              s.session_date ===
              new Date(today.getTime() - 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10);
            const dateLabel = isToday
              ? "오늘"
              : isYesterday
                ? "어제"
                : `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${
                    weekdayLabels[d.getUTCDay()]
                  })`;
            const firstPhrase = phrases[0];
            const categoryColor =
              s.category === "인사"
                ? "bg-mango/40 text-amber-800"
                : "bg-turquesa/40 text-teal-800";

            return (
              <div
                key={s.id}
                className={`flex flex-col gap-1.5 rounded-2xl border-l-4 px-4 py-3.5 ${
                  isToday ? "border-l-rosa bg-rosa-50/50" : "border-l-neutral-200 bg-neutral-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
                    {dateLabel}
                    {hasFavorite && (
                      <Star size={12} className="fill-rosa text-rosa" strokeWidth={0} />
                    )}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${categoryColor}`}>
                    {s.category ?? "스몰토크"} · {phrases.length}개
                  </span>
                </div>
                {firstPhrase ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-neutral-700">
                      &ldquo;{firstPhrase.spanish_text}&rdquo;
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {firstPhrase.korean_translation}
                      {phrases.length > 1 ? ` 외 ${phrases.length - 1}개` : ""}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-400">
                    저장된 표현이 없어요
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav active="archive" />
    </main>
  );
}
