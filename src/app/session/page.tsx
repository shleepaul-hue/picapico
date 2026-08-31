import ShadowingRecorder from "@/components/ShadowingRecorderLoader";

// Figma wireframe: "② 학습 세션" (02_StudySession)
// DB: on finish, insert phrases rows under the active learning_sessions.id
export default function StudySessionPage() {
  const answers = ["어디 출신이세요?", "이름이 뭐예요?", "몇 살이에요?", "어디로 가세요?"];
  const correctIndex = 0;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-6 px-5 py-6">
      <div className="flex items-center gap-2.5">
        <button
          aria-label="닫기"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600"
        >
          X
        </button>
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < 2 ? "bg-neutral-900" : "bg-neutral-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-neutral-300 px-5 py-7">
        <p className="text-xs font-medium text-neutral-600">새로운 표현 발견</p>
        {/* TODO: pull from a phrases bank / next unseen phrase for this user */}
        <p className="text-2xl font-bold">&ldquo;¿De dónde eres?&rdquo;</p>
        {/* TODO: play pronunciation audio (Web Speech API or recorded audio_url) */}
        <button className="flex items-center gap-2 rounded-full bg-neutral-100 px-4.5 py-2.5 text-[13px] font-medium text-neutral-600">
          🔊 발음 듣기
        </button>
        <p className="text-[13px] text-neutral-500">
          &ldquo;이 표현은 무슨 뜻일까요?&rdquo;
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {answers.map((answer, i) => (
          <button
            key={answer}
            className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium ${
              i === correctIndex
                ? "border-2 border-neutral-900"
                : "border-neutral-300"
            }`}
          >
            {answer}
          </button>
        ))}
      </div>

      <ShadowingRecorder />

      {/* TODO: enable once an answer is selected + shadowing attempt recorded */}
      <button
        disabled
        className="w-full rounded-2xl bg-neutral-100 py-4 font-bold text-neutral-400"
      >
        다음
      </button>
    </main>
  );
}
