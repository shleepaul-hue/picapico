import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase redirects here after Google/Apple OAuth completes.
// We exchange the auth code for a session, then send the person to
// onboarding (if they haven't set a destination/trip date yet) or home.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let next = "/onboarding";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("destination")
          .eq("id", user.id)
          .maybeSingle();
        if (profile?.destination) next = "/";
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/signup?error=auth_failed`);
}
