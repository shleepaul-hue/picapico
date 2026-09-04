import Link from "next/link";
import { House, Library, UserSquare, type LucideIcon } from "lucide-react";

type Tab = "home" | "archive" | "profile";

const TABS: { key: Tab; label: string; href: string; Icon: LucideIcon }[] = [
  { key: "home", label: "홈", href: "/", Icon: House },
  { key: "archive", label: "아카이브", href: "/archive", Icon: Library },
  { key: "profile", label: "프로필", href: "/profile", Icon: UserSquare },
];

// Fixed to the bottom of the VIEWPORT rather than sitting inline at the end
// of the page — a scrollable page used to end with this nav in normal flow,
// which meant it could scroll out of view or get momentarily covered/jumped
// by mobile browser chrome (address bar show/hide) while the page moved.
// Pinning it here means every page's own content scrolls independently
// underneath it, and the tab bar itself never moves. Pair with
// `NAV_CLEARANCE_CLASS` (bottom padding on that page's content) so the last
// item never renders hidden behind it.
export const NAV_CLEARANCE_CLASS = "pb-24";

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 left-1/2 z-20 flex w-full max-w-sm -translate-x-1/2 items-center justify-center gap-16 border-t border-neutral-100 bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-label={tab.label}
            className="flex items-center justify-center transition-transform active:scale-90"
          >
            <tab.Icon
              className={`transition-transform ${isActive ? "scale-110" : ""}`}
              size={26}
              strokeWidth={isActive ? 2.4 : 1.8}
              color={isActive ? "var(--rosa)" : "#a3a3a3"}
            />
          </Link>
        );
      })}
    </nav>
  );
}
