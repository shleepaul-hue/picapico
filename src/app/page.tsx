import Link from "next/link";

// Figma wireframe: "① 홈" (01_Home)
// DB reads: profiles.destination/trip_date (countdown banner),
// learning_sessions (streak dots, computed from consecutive session_date rows)
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-between px-5 pt-6">
      <div className="flex flex-1 flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">PicaPico</h1>
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
            스트릭 5일째
          </span>
        </div>

        {/* TODO: compute from profiles.destination / trip_date */}
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600">
          <span>발리, 인도네시아 여행까지</span>
          <span className="font-bold text-neutral-900">D-45</span>
        </div>

        <div className="flex h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-100 text-center text-sm font-medium text-neutral-500">
          [캐릭터 일러스트]
          <br />
          콜리브리(벌새) 인사 모션
        </div>

        <h2 className="text-center text-lg font-bold">
          오늘도 스몰토크 배우러 가볼까요?
        </h2>
        <p className="text-center text-[13px] text-neutral-500">
          여행지에서 바로 써먹는 스페인어 한 마디, 하루 20분
        </p>

        {/* TODO: navigate to /session and create a learning_sessions row */}
        <Link
          href="/session"
          className="w-full rounded-2xl bg-neutral-900 py-4 text-center font-bold text-white"
        >
          오늘의 학습 시작 (20분)
        </Link>

        {/* TODO: derive from the last 7 learning_sessions.session_date rows */}
        <div className="flex gap-2.5">
          {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span
                className={`h-7 w-7 rounded-full ${
                  i < 5 ? "bg-neutral-900" : "border border-neutral-300 bg-neutral-100"
                }`}
              />
              <span className="text-[11px] text-neutral-500">{d}</span>
            </div>
          ))}
        </div>

        <Link href="/archive" className="text-[13px] font-medium text-neutral-600">
          지난 학습 아카이브 보기 →
        </Link>
      </div>

      <nav className="flex items-center justify-between border-t border-neutral-100 pb-6 pt-3.5">
        {[
          { label: "홈", href: "/", active: true },
          { label: "아카이브", href: "/archive", active: false },
          { label: "프로필", href: "/profile", active: false },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`h-5 w-5 rounded-full ${
                tab.active ? "bg-neutral-900" : "bg-neutral-300"
              }`}
            />
            <span
              className={`text-[11px] ${
                tab.active ? "font-bold text-neutral-900" : "text-neutral-500"
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
