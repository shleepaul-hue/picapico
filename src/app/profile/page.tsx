import Link from "next/link";
import { redirect } from "next/navigation";
import { House, Library, UserSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

// Bottom nav "프로필" 탭 — 계정 정보 확인 + 로그아웃.
// (전용 와이어프레임은 아직 없어서, 필요한 정보 위주로 최소 구성)
export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, destination, trip_date, reminder_enabled, reminder_time")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-between px-5 pt-6">
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-xl font-bold">프로필</h1>

        <div className="flex flex-col gap-1 rounded-2xl bg-neutral-100 p-4">
          <span className="text-[15px] font-bold">
            {profile?.display_name ?? user.email}
          </span>
          <span className="text-xs text-neutral-500">{user.email}</span>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">여행지</span>
            <span className="font-medium">{profile?.destination ?? "미설정"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">여행 날짜</span>
            <span className="font-medium">{profile?.trip_date ?? "미설정"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">아침 알림</span>
            <span className="font-medium">
              {profile?.reminder_enabled
                ? `${profile.reminder_time?.slice(0, 5) ?? "08:00"} 켜짐`
                : "꺼짐"}
            </span>
          </div>
        </div>

        <Link
          href="/onboarding"
          className="text-center text-[13px] font-medium text-neutral-600"
        >
          여행 정보 다시 설정하기 →
        </Link>
      </div>

      <div className="flex flex-col gap-4 pb-6">
        <SignOutButton />

        <nav className="flex items-center justify-between border-t border-neutral-100 pb-2 pt-3.5">
          {[
            { label: "홈", href: "/", Icon: House, active: false },
            { label: "아카이브", href: "/archive", Icon: Library, active: false },
            { label: "프로필", href: "/profile", Icon: UserSquare, active: true },
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
      </div>
    </main>
  );
}
