"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ArchiveTab = {
  key: string;
  label: string;
  enabled: boolean;
};

type Props = {
  tabs: ArchiveTab[];
  activeTab: string;
};

// Tabs reflect real DB data: a tab with no matching sessions/phrases renders
// disabled (dimmed, not a Link — no point navigating to an empty filter) and
// tapping it pops a small speech-bubble tooltip instead ("공부가 더
// 필요해요"). Enabled tabs stay plain <Link>s so filtering works without JS.
export default function ArchiveTabs({ tabs, activeTab }: Props) {
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenTooltip(null);
      }
    };
    const timer = setTimeout(() => setOpenTooltip(null), 2200);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearTimeout(timer);
    };
  }, [openTooltip]);

  return (
    <div ref={containerRef} className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        if (!tab.enabled) {
          return (
            <div key={tab.key} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpenTooltip((t) => (t === tab.key ? null : tab.key))}
                className="rounded-full bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-300"
              >
                {tab.label}
              </button>
              {openTooltip === tab.key && (
                <div className="absolute left-1/2 top-full z-10 mt-2 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-[11px] font-medium text-white">
                  공부가 더 필요해요
                  <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={tab.key}
            href={tab.key === "전체" ? "/archive" : `/archive?tab=${encodeURIComponent(tab.key)}`}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
              isActive ? "bg-rosa text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
