// Streak + weekly-activity math shared by the Home and Complete screens.
// Input is a user's public.learning_sessions.session_date values, as the
// "YYYY-MM-DD" strings Postgres date columns come back as.

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDate(dateStr: string): Date {
  // Parse as UTC midnight so day-diff math isn't thrown off by local tz.
  return new Date(`${dateStr}T00:00:00Z`);
}

function todayUtc(today: Date): Date {
  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
}

// Consecutive days of study ending today (or yesterday, so a streak isn't
// considered broken until a full day has passed without a session).
export function computeStreak(sessionDates: string[], today: Date = new Date()): number {
  const uniqueDates = Array.from(new Set(sessionDates)).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const gapFromToday = Math.round(
    (todayUtc(today).getTime() - toUtcDate(uniqueDates[0]).getTime()) / DAY_MS
  );
  if (gapFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = Math.round(
      (toUtcDate(uniqueDates[i - 1]).getTime() - toUtcDate(uniqueDates[i]).getTime()) / DAY_MS
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export type WeekDay = { label: string; date: string; active: boolean; isFuture: boolean };

// Mon..Sun of the current week, each flagged whether a session happened
// that day (used for the home screen's 7 streak dots).
export function computeWeekActivity(
  sessionDates: string[],
  today: Date = new Date()
): WeekDay[] {
  const dateSet = new Set(sessionDates);
  const labels = ["월", "화", "수", "목", "금", "토", "일"];
  const t = todayUtc(today);
  const dayOfWeek = t.getUTCDay(); // 0=Sun..6=Sat
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(t.getTime() + mondayOffset * DAY_MS);

  return labels.map((label, i) => {
    const d = new Date(monday.getTime() + i * DAY_MS);
    const dateStr = d.toISOString().slice(0, 10);
    return {
      label,
      date: dateStr,
      active: dateSet.has(dateStr),
      isFuture: d.getTime() > t.getTime(),
    };
  });
}
