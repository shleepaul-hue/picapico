"use client";

import dynamic from "next/dynamic";

// react-voice-visualizer touches browser-only APIs (MediaRecorder, AudioContext)
// during its own render, so it can't be server-rendered — load it client-only.
const ShadowingRecorder = dynamic(() => import("./ShadowingRecorder"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[104px] w-full items-center justify-center text-xs text-neutral-400">
      녹음기 준비 중...
    </div>
  ),
});

export default ShadowingRecorder;
