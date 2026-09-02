// Presentational only — the user-agent check happens once in AuthGate
// (under a client-only dynamic import) and is passed down as props, so this
// component itself needs no hooks and no browser APIs.
type Props = {
  detected: boolean;
  isAndroid: boolean;
};

export default function InAppBrowserWarning({ detected, isAndroid }: Props) {
  if (!detected) return null;

  const openInChrome = () => {
    const url = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-amber-50 p-4 text-left">
      <p className="text-[13px] font-bold text-amber-800">
        ⚠️ 지금 인앱 브라우저로 열려 있어요
      </p>
      <p className="text-[12px] leading-relaxed text-amber-700">
        카카오톡 등 인앱 브라우저에서는 구글 로그인이 끝까지 진행되지 않아요.
        자동으로 다른 브라우저를 열어보는 중이에요 — 잠시 후에도 그대로면,
        {isAndroid ? " 아래 버튼으로 크롬에서 열거나, " : " "}
        오른쪽 아래 메뉴(••• 또는 ⋮)에서 &ldquo;다른 브라우저로 열기&rdquo;를 눌러
        Safari나 Chrome으로 열어주세요.
      </p>
      {isAndroid && (
        <button
          type="button"
          onClick={openInChrome}
          className="self-start rounded-full bg-amber-800 px-3.5 py-2 text-[12px] font-bold text-white"
        >
          크롬에서 열기
        </button>
      )}
    </div>
  );
}
