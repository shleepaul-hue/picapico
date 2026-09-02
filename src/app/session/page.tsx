import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeDDayLabel } from "@/lib/tripCountdown";
import StudySessionLoader from "@/components/StudySessionLoader";

// Server Component wrapper: fetches destination/D-day once so the client
// quiz (and its branded transition screens) can show "여행까지 D-N" without
// a second round-trip.
export default async function StudySessionPage() {
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

  return (
    <StudySessionLoader
      destination={profile?.destination ?? null}
      dDayLabel={dDayLabel}
    />
  );
}
