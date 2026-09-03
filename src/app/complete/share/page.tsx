"use client";

import { useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Figma wireframe: "⑤ 인스타 스토리 공유" (05_IGStoryShare), 9:16
// Layout follows the latest revision: character centered, two arrow-style
// stat lines directly beneath it (streak -> total days, start -> trip date),
// no QR/CTA — just a small "PICAPICO" wordmark at the bottom.
export default function ShareCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = "picapico-story.png";
    link.href = dataUrl;
    link.click();
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

      {/* TODO: replace static copy with today's learning_sessions + profiles data */}
      <div
        ref={cardRef}
        className="relative flex aspect-[9/16] w-full max-w-[320px] flex-col items-center justify-between overflow-hidden rounded-2xl bg-neutral-100 px-6 py-9"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-[15px] font-bold text-ink">PicaPico</span>
          <span className="text-xs font-medium text-neutral-500">8월 31일</span>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- plain
               <img> so html-to-image can rasterize this card reliably; a
               next/image element's srcset/lazy-load can render blank in the
               toPng capture below. */}
            <img
              src="/bird-logo.png"
              alt="PicaPico 콜리브리 캐릭터"
              className="h-[126px] w-auto"
            />
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rosa" />
              <span className="text-lg font-bold text-ink">5일 연속</span>
              <ArrowRight size={14} strokeWidth={2.5} className="text-rosa-200" />
              <span className="text-[15px] font-medium text-neutral-600">
                총 12일째 공부
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="font-medium text-neutral-600">8월 20일 시작</span>
              <ArrowRight size={12} strokeWidth={2.5} className="text-rosa-200" />
              <span aria-hidden>🇪🇸</span>
              <span className="font-bold text-ink">10월 15일 바르셀로나 여행</span>
            </div>
          </div>
        </div>

        <span className="text-[11px] font-bold tracking-wide text-neutral-400">
          PICAPICO
        </span>
      </div>

      <button
        onClick={handleDownload}
        className="w-full max-w-[320px] rounded-2xl bg-rosa py-4 font-bold text-white transition-transform active:scale-95"
      >
        이미지로 저장
      </button>
    </main>
  );
}
