// Shared detection for embedded in-app browsers (KakaoTalk, Naver, Instagram,
// Facebook, Line, WhatsApp, Snapchat) whose WebView blocks or breaks Google
// OAuth — used by both the warning banner and the login button (to disable
// the button before the user wastes a tap on a login that can't finish).
export function isInAppBrowserUserAgent(ua: string): boolean {
  return /KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\/|WhatsApp|Snapchat/i.test(ua);
}

export function isAndroidUserAgent(ua: string): boolean {
  return /Android/i.test(ua);
}

// KakaoTalk's in-app browser (and only KakaoTalk's, among the ones above)
// honors a custom URL scheme that hands the current page straight to the
// device's default browser, with no "open in another browser" menu-diving
// required. See AuthGate for where this is used.
export function isKakaoTalkUserAgent(ua: string): boolean {
  return /KAKAOTALK/i.test(ua);
}
