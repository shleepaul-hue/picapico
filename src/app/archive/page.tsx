import { ActivityCalendar } from "react-activity-calendar";

// Figma wireframe: "④ 아카이브" (04_Archive)
// DB reads: learning_sessions (list + heatmap), phrases.is_favorite for the filter
const heatmapData = Array.from({ length: 31 }).map((_, i) => ({
  date: `2026-08-${String(i + 1).padStart(2, "0")}`,
  count: Math.random() > 0.35 ? 1 : 0,
  level: Math.random() > 0.35 ? 4 : 0,
}));

const sessions = [
  { date: "8월 30일 (토)", meta: "스몰토크 · 표현 4개", preview: "¿De dónde eres? 외 3개" },
  { date: "8월 29일 (금)", meta: "인사 · 표현 3개", preview: "Mucho gusto 외 2개" },
  { date: "8월 28일 (목)", meta: "스몰토크 · 표현 5개", preview: "¿A dónde vas? 외 4개" },
];

export default function ArchivePage() {
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
        <p className="mb-2 text-xs font-medium text-neutral-600">8월 학습 기록</p>
        {/* TODO: feed real learning_sessions.session_date counts */}
        <ActivityCalendar
          data={heatmapData}
          showColorLegend={false}
          showMonthLabels={false}
          showTotalCount={false}
          blockSize={12}
          blockMargin={4}
          theme={{ light: ["#ebebeb", "#262626"], dark: ["#ebebeb", "#262626"] }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold">지난 학습 세션</h2>
        {sessions.map((s) => (
          <div
            key={s.date}
            className="flex flex-col gap-1 rounded-xl border border-neutral-100 px-4 py-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold">{s.date}</span>
              <span className="text-[11px] text-neutral-500">{s.meta}</span>
            </div>
            <span className="text-xs text-neutral-500">{s.preview}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
