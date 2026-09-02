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
