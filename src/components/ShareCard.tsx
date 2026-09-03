"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toBlob } from "html-to-image";
import { ArrowLeft } from "lucide-react";

type Props = {
  todayLabel: string;
  streak: number;
  destination: string | null;
  destinationFlag: string | null;
  tripDateLabel: string | null;
};

// Card generation + saving, split out from the page (a server component)
// so this piece — the only part that needs the browser — stays a small
// client island.
//
// The "이미지로 저장" button used to just build a data URL and click a
// hidden <a download>. That pattern silently does nothing on iOS Safari and
// most in-app browsers (KakaoTalk, Instagram, etc.) — they don't honor the
// download attribute at all, so tapping it looks like it worked but nothing
// lands in Photos. This isn't a missing library or a build setting; it's a
// platform limitation. The fix is two-pronged: try the Web Share API first
// (the native "저장" sheet on iOS/Android — this is what actually works on
// phones), and always fall back to rendering the finished PNG on-screen so
// a long-press → "이미지 저장" always works even where neither of the
// programmatic paths do.
export default function ShareCard({
  todayLabel,
  streak,
  destination,
  destinationFlag,
  tripDateLabel,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "shared" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSave = async () => {
    if (!cardRef.current || status === "saving") return;
    setStatus("saving");

    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 3 });
      if (!blob) throw new Error("no blob");

      const file = new File([blob], "picapico-story.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };

      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: "PicaPico" });
        setStatus("shared");
        return;
      }

      // Desktop browsers still honor the download attribute, so try it —
      // harmless even where it's ignored, since the preview below covers
      // that case.
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "picapico-story.png";
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPreviewUrl(url);
      setStatus("idle");
    } catch {
      // navigator.share throwing "AbortError" (user cancelled the share
      // sheet) lands here too — that's not a real failure, just no image to
      // show yet, so don't scare them with an error message for that case.
      setStatus("idle");
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center gap-5 px-5 py-8">
      <div className="flex w-full max-w-[320px] items-center gap-2.5">
        <Link
          href="/complete"
          aria-label="뒤로"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform active:scale-90"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <span className="text-sm font-bold text-ink">공유 카드</span>
      </div>

      <div
        ref={cardRef}
        className="relative flex aspect-[9/16] w-full max-w-[320px] flex-col items-center justify-between overflow-hidden rounded-2xl bg-neutral-100 px-6 py-9"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-[15px] font-bold text-ink">PicaPico</span>
          <span className="text-xs font-medium text-neutral-500">{todayLabel}</span>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- plain
               <img> so html-to-image can rasterize this card reliably; a
               next/image element's srcset/lazy-load can render blank in the
               toBlob capture below. */}
            <img
              src="/bird-logo.png"
              alt="PicaPico 콜리브리 캐릭터"
              className="h-[126px] w-auto"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-rosa-50 px-3.5 py-1.5 text-sm font-bold text-rosa-600">
              🔥 {streak}일 연속
            </span>
            {tripDateLabel && (
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
                {tripDateLabel}
                {destinationFlag && <span aria-hidden>{destinationFlag}</span>}
              </span>
            )}
          </div>
        </div>

        <span className="text-[11px] font-bold tracking-wide text-neutral-400">
          PicaPico
        </span>
      </div>

      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="w-full max-w-[320px] rounded-2xl bg-rosa py-4 font-bold text-white transition-transform active:scale-95 disabled:opacity-60"
      >
        {status === "saving" ? "이미지 만드는 중..." : "이미지로 저장"}
      </button>

      {status === "shared" && (
        <p className="text-center text-xs text-neutral-500">공유 완료!</p>
      )}

      {previewUrl && (
        <div className="flex w-full max-w-[320px] flex-col items-center gap-2">
          <p className="text-center text-xs text-neutral-500">
            자동 저장이 안 되면 아래 이미지를 길게 눌러 저장해주세요
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- an
             object URL, not a static app asset, so next/image doesn't
             apply; this is exactly the element people long-press to save. */}
          <img
            src={previewUrl}
            alt="공유 카드 미리보기 — 길게 눌러 저장"
            className="w-full max-w-[220px] rounded-2xl"
          />
        </div>
      )}

      {destination === null && (
        <p className="text-center text-xs text-neutral-400">
          프로필에서 여행지를 설정하면 국기가 함께 표시돼요.
        </p>
      )}
    </main>
  );
}
