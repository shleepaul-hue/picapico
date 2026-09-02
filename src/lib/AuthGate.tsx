"use client";

import { useEffect, useState } from "react";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import InAppBrowserWarning from "@/components/InAppBrowserWarning";
import {
  isAndroidUserAgent,
  isInAppBrowserUserAgent,
  isKakaoTalkUserAgent,
} from "@/lib/inAppBrowser";

// Only ever mounted client-side (see AuthGateLoader's ssr:false dynamic
// import), so this lazy useState initializer runs once, on the client,
// before first paint — no effect needed for the detection itself, and no
// server/client mismatch possible since there's no server-rendered version
// of this subtree to disagree with.
export default function AuthGate() {
  const [ua] = useState(() => (typeof navigator !== "undefined" ? navigator.userAgent : ""));
  const detected = isInAppBrowserUserAgent(ua);
  const isAndroid = isAndroidUserAgent(ua);
  const isKakaoTalk = isKakaoTalkUserAgent(ua);

  // This one IS a real side effect (handing off to another app), not a
  // state update, so it's fine inside an effect. KakaoTalk's in-app
  // browser supports a custom scheme that opens the current URL in the
  // device's default browser automatically — fire it once on mount so
  // people land in Chrome/Safari without hunting for a "open in another
  // browser" menu. If an older KakaoTalk build ignores the scheme, the
  // warning below still shows the manual instructions as a fallback.
  useEffect(() => {
    if (isKakaoTalk) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`;
    }
  }, [isKakaoTalk]);

  return (
    <>
      <InAppBrowserWarning detected={detected} isAndroid={isAndroid} />
      <SocialLoginButtons blockedByInAppBrowser={detected} />
    </>
  );
}
