"use client";

import dynamic from "next/dynamic";

// ssr:false so AuthGate's in-app-browser detection only ever runs on the
// client — see the comment in AuthGate.tsx for why.
const AuthGate = dynamic(() => import("@/components/AuthGate"), {
  ssr: false,
  loading: () => (
    <div className="flex w-full flex-col gap-3">
      <div className="h-14 w-full animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  ),
});

export default function AuthGateLoader() {
  return <AuthGate />;
}
