import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeWeekActivity } from "@/lib/streak";
import { computeDDayLabel } from "@/lib/tripCountdown";
import { getDestinationFlag } from "@/lib/destinationFlag";
import SpanishGreetingRotator from "@/components/SpanishGreetingRotator";
import BottomNav, { NAV_CLEARANCE_CLASS } from "@/components/BottomNav";

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
  const destinationFlag = getDestinationFlag(profile?.destination);

  const { data: sessionRows } = await supabase
    .from("learning_sessions")
    .select("session_date")
    .eq("user_id", user.id);
  const sessionDates = (sessionRows ?? []).map((s) => s.session_date);
  const streak = computeStreak(sessionDates);
  const weekActivity = computeWeekActivity(sessionDates);

  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-sm flex-col px-5 pt-6 ${NAV_CLEARANCE_CLASS}`}
    >
      <div className="flex flex-1 flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">PicaPico</h1>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
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
            {destinationFlag && <span aria-hidden>{destinationFlag}</span>}
            <span>{profile.destination} 여행까지</span>
            <span className="font-bold text-rosa-600">{dDayLabel}</span>
          </div>
        )}

        <div className="relative flex h-[220px] w-full items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-rosa-50 to-arena">
          <SpanishGreetingRotator className="absolute top-4 left-1/2 -translate-x-1/2" />
          <Image
            src="/bird-face.png"
            alt="PicaPico 콜리브리 캐릭터가 인사하는 모습"
            width={230}
            height={180}
            className="animate-drop-in h-[190px] w-auto"
            priority
          />
        </div>

        <h2 className="text-center text-lg font-bold">
          오늘도 스몰토크 배우러 가볼까요?
        </h2>
        <p className="text-center text-[13px] text-neutral-500">
          여행지에서 바로 써먹는 스페인어 한 마디, 하루 20분
        </p>

        <Link
          href="/session"
          className="w-full rounded-2xl bg-rosa py-4 text-center font-bold text-white transition-transform active:scale-95"
        >
          오늘의 학습 시작 (20분)
        </Link>

        <div className="flex gap-2.5">
          {weekActivity.map((day) => {
            const missed = day.isPast && !day.active;
            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    day.active
                      ? "bg-rosa"
                      : "border border-neutral-300 bg-neutral-100"
                  } ${day.isFuture ? "opacity-40" : ""}`}
                >
                  {missed && <X size={13} strokeWidth={2.5} className="text-neutral-400" />}
                </span>
                <span className="text-[11px] text-neutral-500">{day.label}</span>
              </div>
            );
          })}
        </div>

        <Link href="/archive" className="text-[13px] font-medium text-neutral-600">
          지난 학습 아카이브 보기 →
        </Link>
      </div>

      <BottomNav active="home" />
    </main>
  );
}
