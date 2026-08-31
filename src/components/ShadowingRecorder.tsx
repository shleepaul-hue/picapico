"use client";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

// Powers the "따라 말해보기 (섀도잉)" section on the Study Session screen.
// TODO: on stopRecording, upload the blob (recorderControls.recordedBlob)
// to Supabase Storage and optionally run pronunciation scoring.
export default function ShadowingRecorder() {
  const recorderControls = useVoiceVisualizer();

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-[13px] font-medium text-neutral-600">
        따라 말해보기 (섀도잉)
      </p>

      <div className="w-full overflow-hidden rounded-xl bg-neutral-100">
        <VoiceVisualizer controls={recorderControls} height={48} />
      </div>

      <button
        onClick={
          recorderControls.isRecordingInProgress
            ? recorderControls.stopRecording
            : recorderControls.startRecording
        }
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          recorderControls.isRecordingInProgress
            ? "bg-red-500"
            : "bg-neutral-900"
        }`}
        aria-label={
          recorderControls.isRecordingInProgress ? "녹음 중지" : "녹음 시작"
        }
      />
    </div>
  );
}
