"use client";

import { useState } from "react";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import InAppBrowserWarning from "@/components/InAppBrowserWarning";
import { isAndroidUserAgent, isInAppBrowserUserAgent } from "@/lib/inAppBrowser";

// Only ever mounted client-side (see AuthGateLoader's ssr:false dynamic
// import), so this lazy useState initializer runs once, on the client,
// before first paint — no effect needed, and no server/client mismatch
// possible since there's no server-rendered version of this subtree to
// disagree with.
export default function AuthGate() {
  const [ua] = useState(() => (typeof navigator !== "undefined" ? navigator.userAgent : ""));
  const detected = isInAppBrowserUserAgent(ua);
  const isAndroid = isAndroidUserAgent(ua);

  return (
    <>
      <InAppBrowserWarning detected={detected} isAndroid={isAndroid} />
      <SocialLoginButtons blockedByInAppBrowser={detected} />
    </>
  );
}
