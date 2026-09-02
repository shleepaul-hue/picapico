"use client";

import dynamic from "next/dynamic";

// The quiz session randomizes phrase selection + choice order, so it's
// loaded client-only to avoid a server/client hydration mismatch.
const StudySession = dynamic(() => import("@/components/StudySession"), {
  ssr: false,
  loading: () => (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm items-center justify-center px-5 py-6 text-sm text-neutral-400">
      학습 준비 중...
    </main>
  ),
});

export default function StudySessionPage() {
  return <StudySession />;
}
