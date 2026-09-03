import Image from "next/image";
import { getDestinationFlag } from "@/lib/destinationFlag";

// Branded loading/transition screen — shown whenever the app needs a beat
// to move between screens (chunk load, session save). A slim rosa loading
// bar replaces the old bouncing dots so every "화면 전환" feels like one
// consistent, on-brand moment instead of a bare spinner. Doubles as a small
// motivation nudge by surfacing the trip D-day (with its flag) alongside it.
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
  const destinationFlag = getDestinationFlag(destination);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-5 px-5 py-6">
      <Image
        src="/bird-face.png"
        alt=""
        aria-hidden
        width={110}
        height={86}
        className="animate-gentle-pulse h-[64px] w-auto"
      />

      <span className="text-xl font-bold tracking-tight text-rosa-600">PICAPICO</span>

      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-rosa-50">
        <div className="animate-loading-bar h-full w-2/5 rounded-full bg-rosa" />
      </div>

      <p className="text-[13px] font-medium text-neutral-500">{label}</p>

      {destination && dDayLabel && (
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-600">
          {destinationFlag && <span aria-hidden>{destinationFlag}</span>}
          <span>{destination} 여행까지</span>
          <span className="font-bold text-ink">{dDayLabel}</span>
        </div>
      )}
    </main>
  );
}
