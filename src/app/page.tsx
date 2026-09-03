import Link from "next/link";
import { redirect } from "next/navigation";
import { House, Library, UserSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeWeekActivity } from "@/lib/streak";
import { computeDDayLabel } from "@/lib/tripCountdown";

// Figma wireframe: "① 홈" (01_Home)
// DB reads: profiles.destination/trip_date (countdown banner),
// learning_sessions (streak dots, computed from consecutive session_date rows)
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("destination, trip_date")
    .eq("id", user.id)
    .maybeSingle();

  const dDayLabel = computeDDayLabel(profile?.trip_date);

  const { data: sessionRows } = await supabase
    .from("learning_sessions")
    .select("session_date")
    .eq("user_id", user.id);
  const sessionDates = (sessionRows ?? []).map((s) => s.session_date);
  const streak = computeStreak(sessionDates);
  const weekActivity = computeWeekActivity(sessionDates);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-between px-5 pt-6">
      <div className="flex flex-1 flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">PicaPico</h1>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              streak > 0
                ? "bg-rosa-50 text-rosa-600"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {streak > 0 ? `🔥 ${streak}일 연속 공부 중` : "오늘부터 시작해봐요"}
          </span>
        </div>

        {profile?.destination && dDayLabel && (
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600">
            <span>{profile.destination} 여행까지</span>
            <span className="font-bold text-neutral-900">{dDayLabel}</span>
          </div>
        )}

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

        <Link
          href="/session"
          className="w-full rounded-2xl bg-neutral-900 py-4 text-center font-bold text-white transition-transform active:scale-95"
        >
          오늘의 학습 시작 (20분)
        </Link>

        <div className="flex gap-2.5">
          {weekActivity.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <span
                className={`h-7 w-7 rounded-full transition-colors ${
                  day.active
                    ? "bg-rosa"
                    : "border border-neutral-300 bg-neutral-100"
                } ${day.isFuture ? "opacity-40" : ""}`}
              />
              <span className="text-[11px] text-neutral-500">{day.label}</span>
            </div>
          ))}
        </div>

        <Link href="/archive" className="text-[13px] font-medium text-neutral-600">
          지난 학습 아카이브 보기 →
        </Link>
      </div>

      <nav className="flex items-center justify-between border-t border-neutral-100 pb-6 pt-3.5">
        {[
          { label: "홈", href: "/", Icon: House, active: true },
          { label: "아카이브", href: "/archive", Icon: Library, active: false },
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
