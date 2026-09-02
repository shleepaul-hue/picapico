import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Railway (and most reverse proxies) terminate TLS and forward the request
// to our container over plain HTTP on an internal port. `request.url`'s
// origin reflects that internal address (e.g. http://localhost:8080)
// instead of the public domain, so building a redirect from it sends
// people to a dead local address after login. Prefer the standard
// forwarded headers the proxy sets, then Railway's own public-domain env
// var, and only fall back to request.url for plain local dev (where there
// is no proxy in front of us and it's accurate).
function resolvePublicOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return `${forwardedProto}://${forwardedHost}`;
  }
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  return new URL(request.url).origin;
}

// Supabase redirects here after Google/Apple OAuth completes.
// We exchange the auth code for a session, then send the person to
// onboarding (if they haven't set a destination/trip date yet) or home.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = resolvePublicOrigin(request);
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
