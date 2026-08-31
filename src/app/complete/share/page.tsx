"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";

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
      {/* TODO: replace static copy with today's learning_sessions + profiles data */}
      <div
        ref={cardRef}
        className="relative flex aspect-[9/16] w-full max-w-[320px] flex-col items-center justify-between overflow-hidden rounded-2xl bg-neutral-100 px-6 py-9"
      >
        <div className="flex w-full items-center justify-between">
          <span className="text-[15px] font-bold">PicaPico</span>
          <span className="text-xs font-medium text-neutral-500">8월 31일</span>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border border-dashed border-neutral-400 bg-white text-center text-xs font-medium text-neutral-500">
            [콜리브리 캐릭터 일러스트]
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900" />
              <span className="text-lg font-bold">5일 연속</span>
              <span className="text-neutral-400">→</span>
              <span className="text-[15px] font-medium text-neutral-600">
                총 12일째 공부
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="font-medium text-neutral-600">8월 20일 시작</span>
              <span className="text-neutral-400">→</span>
              <span className="font-bold">10월 15일 발리 여행</span>
            </div>
          </div>
        </div>

        <span className="text-[11px] font-bold tracking-wide text-neutral-400">
          PICAPICO
        </span>
      </div>

      <button
        onClick={handleDownload}
        className="w-full max-w-[320px] rounded-2xl bg-neutral-900 py-4 font-bold text-white"
      >
        이미지로 저장
      </button>
    </main>
  );
}
