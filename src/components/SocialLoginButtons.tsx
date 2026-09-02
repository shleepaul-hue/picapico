"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  // Google blocks/breaks OAuth inside KakaoTalk-style in-app browsers, so
  // the button is disabled there instead of letting people tap into a dead
  // end — computed once by the parent (AuthGate) and passed down, since
  // detecting it here would need a browser-only render that can't safely
  // run during this component's normal (non-ssr:false) import.
  blockedByInAppBrowser: boolean;
};

// Real Google OAuth wired to Supabase. Apple stays disabled until an
// Apple Developer Program account ($99/yr) is set up — see README.
export default function SocialLoginButtons({ blockedByInAppBrowser }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, Supabase redirects the browser to Google — no further
    // client-side action needed here.
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <button
        onClick={handleGoogleLogin}
        disabled={loading || blockedByInAppBrowser}
        title={
          blockedByInAppBrowser
            ? "인앱 브라우저에서는 구글 로그인을 완료할 수 없어요"
            : undefined
        }
        className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white py-4 font-bold disabled:opacity-50"
      >
        {loading
          ? "이동 중..."
          : blockedByInAppBrowser
            ? "다른 브라우저로 열어주세요"
            : "Google로 계속하기"}
      </button>

      <button
        disabled
        title="Apple Developer Program 가입 후 연동 예정"
        className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-neutral-300 py-4 font-bold text-neutral-500"
      >
        Apple로 계속하기 (준비 중)
      </button>

      {error && (
        <p className="text-center text-xs text-red-500">
          로그인에 실패했어요: {error}
        </p>
      )}
    </div>
  );
}
