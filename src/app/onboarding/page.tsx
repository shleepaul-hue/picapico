import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "@/components/OnboardingForm";

// Server wrapper: fetches any already-saved profile fields so the form can
// tell first-time onboarding (blank, no back link) apart from the "여행 정보
// 다시 설정하기" edit flow from /profile (prefilled, back link to /profile).
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");

  const { data: profile } = await supabase
    .from("profiles")
    .select("destination, trip_date, reminder_enabled, reminder_time")
    .eq("id", user.id)
    .maybeSingle();

  const isEditing = Boolean(profile?.destination && profile?.trip_date);

  return (
    <OnboardingForm
      isEditing={isEditing}
      initialDestination={profile?.destination ?? ""}
      initialTripDate={profile?.trip_date ?? ""}
      initialReminderEnabled={profile?.reminder_enabled ?? true}
      initialReminderTime={profile?.reminder_time?.slice(0, 5) ?? "08:00"}
    />
  );
}
