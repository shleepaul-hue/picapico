// Figma wireframe: "⓪-2 목표 설정" (00b_Onboarding)
// DB: writes to public.profiles.destination / trip_date / reminder_enabled / reminder_time
export default function OnboardingPage() {
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
          {/* TODO: controlled input -> profiles.destination */}
          <input
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium"
            placeholder="발리, 인도네시아"
            name="destination"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">
            여행 날짜가 언제인가요?
          </span>
          {/* TODO: controlled date input -> profiles.trip_date */}
          <input
            type="date"
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium"
            name="tripDate"
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
            {/* TODO: controlled toggle -> profiles.reminder_enabled */}
            <button
              role="switch"
              aria-checked="true"
              className="h-[22px] w-10 rounded-full bg-neutral-900"
            />
          </div>
          {/* TODO: controlled time input -> profiles.reminder_time */}
          <input
            type="time"
            defaultValue="08:00"
            className="rounded-xl border border-neutral-300 px-4 py-3.5 text-[15px] font-medium"
            name="reminderTime"
          />
        </div>
      </div>

      <button className="w-full rounded-2xl bg-neutral-900 py-4 font-bold text-white">
        시작하기
      </button>
    </main>
  );
}
