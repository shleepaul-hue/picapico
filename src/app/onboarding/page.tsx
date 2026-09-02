"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Figma wireframe: "⓪-2 목표 설정" (00b_Onboarding)
// DB: writes to public.profiles.destination / trip_date / reminder_enabled / reminder_time
export default function OnboardingPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("08:00");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = destination.trim() !== "" && tripDate !== "" && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인 정보를 확인할 수 없어요. 다시 로그인해주세요.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        destination: destination.trim(),
        trip_date: tripDate,
        reminder_enabled: reminderEnabled,
        reminder_time: reminderTime,
        terms_agreed_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-between px-6 py-10">
      <div className="flex w-full flex-col gap-7">
        <div className="flex gap-1.5">
          <span className="h-1 w-6 rounded-full bg-neutral-200" />
          <span className="h-1 w-6 rounded-full bg-neutral-900" />
        </div>

        <h1 className="text-lg font-bold">
          마지막이에요! 학습 계획을 정해볼까요?
        </h1>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">
            어디로 여행 가나요?
          </span>
          <input
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium"
            placeholder="발리, 인도네시아"
            name="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">
            여행 날짜가 언제인가요?
          </span>
          <input
            type="date"
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium"
            name="tripDate"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
          />
          <span className="text-xs text-neutral-500">
            D-day는 선택한 날짜로 자동 계산돼요
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">
              아침 학습 알림을 받을까요?
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={reminderEnabled}
              onClick={() => setReminderEnabled((v) => !v)}
              className={`relative h-[22px] w-10 rounded-full transition-colors ${
                reminderEnabled ? "bg-neutral-900" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-transform ${
                  reminderEnabled ? "translate-x-[20px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            disabled={!reminderEnabled}
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium disabled:opacity-40"
          />
        </div>

        {error && (
          <p className="text-center text-xs text-red-500">
            저장에 실패했어요: {error}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white disabled:opacity-40"
      >
        {saving ? "저장 중..." : "시작하기"}
      </button>
    </main>
  );
}
