// Shared D-day calculation — used by the Home banner and by BrandTransition
// (loading screens shown between session steps), so both show the exact
// same countdown without duplicating the date-math.
export function computeDDayLabel(
  tripDate: string | null | undefined,
  today: Date = new Date()
): string | null {
  if (!tripDate) return null;

  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);
  const trip = new Date(tripDate);
  trip.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (trip.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
}
