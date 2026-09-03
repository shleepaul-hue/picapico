import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityCalendar } from "react-activity-calendar";
import { House, Library, Star, UserSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ArchiveTabs, { type ArchiveTab } from "@/components/ArchiveTabs";

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

  // Heatmap needs a value for every day in a contiguous range — fill in the
  // last ~5 weeks so react-activity-calendar always has a full grid, even
  // before any sessions exist.
  const heatmapDays = 35;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sessionDateSet = new Set(allSessions.map((s) => s.session_date));
  const heatmapData = Array.from({ length: heatmapDays }).map((_, i) => {
    const d = new Date(
      today.getTime() - (heatmapDays - 1 - i) * 24 * 60 * 60 * 1000,
    );
    const dateStr = d.toISOString().slice(0, 10);
    const hasSession = sessionDateSet.has(dateStr);
    return {
      date: dateStr,
      count: hasSession ? 1 : 0,
      level: hasSession ? 4 : 0,
    };
  });

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-between px-5 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-ink">아카이브</h1>
          <span className="h-6 w-6 rounded-full border border-neutral-400" />
        </div>

        <ArchiveTabs tabs={tabs} activeTab={activeTab} />

        <div className="rounded-2xl bg-neutral-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-neutral-600">
              최근 5주 학습 현황
            </p>
            <span className="text-[11px] font-medium text-neutral-400">
              총 {allSessions.length}회 학습
            </span>
          </div>
          <ActivityCalendar
            data={heatmapData}
            showColorLegend={false}
            showMonthLabels={false}
            showTotalCount={false}
            showWeekdayLabels={false}
            blockSize={12}
            blockMargin={4}
            theme={{
              light: ["#ebebeb", "#262626"],
              dark: ["#ebebeb", "#262626"],
            }}
          />
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

            return (
              <div
                key={s.id}
                className={`flex flex-col gap-1.5 rounded-2xl border border-l-[3px] bg-white px-4 py-3.5 ${
                  isToday ? "border-neutral-100 border-l-rosa" : "border-neutral-100 border-l-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
                    {dateLabel}
                    {hasFavorite && (
                      <Star size={12} className="fill-rosa text-rosa" strokeWidth={0} />
                    )}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
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

      <nav className="flex items-center justify-center gap-14 border-t border-neutral-100 pb-6 pt-3.5">
        {[
          { label: "홈", href: "/", Icon: House, active: false },
          { label: "아카이브", href: "/archive", Icon: Library, active: true },
          { label: "프로필", href: "/profile", Icon: UserSquare, active: false },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-1 transition-transform active:scale-90"
          >
            <tab.Icon
              className={`transition-transform ${tab.active ? "scale-110" : ""}`}
              size={22}
              strokeWidth={tab.active ? 2.4 : 1.8}
              color={tab.active ? "var(--rosa)" : "#a3a3a3"}
            />
            <span
              className={`text-[11px] ${
                tab.active ? "font-bold text-rosa" : "text-neutral-500"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
