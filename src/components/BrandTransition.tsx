// Branded loading/transition screen — shown whenever the app needs a beat
// to move between screens (chunk load, session save). Doubles as a small
// motivation nudge by surfacing the trip D-day instead of a bare spinner.
type Props = {
  label?: string;
  destination?: string | null;
  dDayLabel?: string | null;
};

export default function BrandTransition({
  label = "불러오는 중...",
  destination,
  dDayLabel,
}: Props) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-5 px-5 py-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">PicaPico</span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-900" />
        </span>
      </div>

      <p className="text-[13px] font-medium text-neutral-500">{label}</p>

      {destination && dDayLabel && (
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600">
          <span>{destination} 여행까지</span>
          <span className="font-bold text-neutral-900">{dDayLabel}</span>
        </div>
      )}
    </main>
  );
}
