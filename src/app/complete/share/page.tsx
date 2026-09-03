import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/streak";
import { getDestinationFlag } from "@/lib/destinationFlag";
import ShareCard from "@/components/ShareCard";

// Figma wireframe: "⑤ 인스타 스토리 공유" (05_IGStoryShare), 9:16
// This is now real data end to end (previously a static mock): the flag,
// trip date and streak all come from the same profiles/learning_sessions
// rows the Home screen reads, via the same getDestinationFlag() helper —
// so whatever country the user actually set as their destination is what
// shows here, not a hardcoded example.
export default async function SharePage() {
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

  const { data: sessionRows } = await supabase
    .from("learning_sessions")
    .select("session_date")
    .eq("user_id", user.id);
  const streak = computeStreak((sessionRows ?? []).map((s) => s.session_date));

  const today = new Date();
  const todayLabel = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  const tripDateLabel = profile?.trip_date
    ? formatUtcDateLabel(profile.trip_date)
    : null;

  return (
    <ShareCard
      todayLabel={todayLabel}
      streak={streak}
      destination={profile?.destination ?? null}
      destinationFlag={getDestinationFlag(profile?.destination)}
      tripDateLabel={tripDateLabel}
    />
  );
}

// profiles.trip_date is a Postgres date ("YYYY-MM-DD") — parse it as UTC
// midnight so the displayed month/day never shifts a day off depending on
// the server's local timezone (same convention as the Archive page).
function formatUtcDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}
