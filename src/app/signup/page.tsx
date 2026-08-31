// Figma wireframe: "⓪-1 가입" (00_SignUp)
// DB: on successful OAuth, Supabase creates a row in auth.users;
// we then upsert public.profiles (see supabase/schema.sql) on first login.
export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-between px-6 py-16">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-2xl font-bold">PicaPico</h1>

        <div className="flex h-40 w-40 items-center justify-center rounded-full border border-dashed border-neutral-300 bg-neutral-100 text-center text-xs font-medium text-neutral-500">
          [콜리브리 인사 모션]
        </div>

        <h2 className="text-center text-lg font-bold leading-snug">
          여행 스몰토크,
          <br />
          하루 20분으로 시작해요
        </h2>
      </div>

      <div className="flex w-full flex-col gap-3">
        {/* TODO: wire up supabase.auth.signInWithOAuth({ provider: "google" }) */}
        <button className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white py-4 font-bold">
          Google로 계속하기
        </button>
        {/* TODO: wire up supabase.auth.signInWithOAuth({ provider: "apple" }) */}
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 font-bold text-white">
          Apple로 계속하기
        </button>

        <div className="flex items-center gap-2 py-1 text-xs text-neutral-500">
          <span className="h-px flex-1 bg-neutral-300" />
          또는
          <span className="h-px flex-1 bg-neutral-300" />
        </div>

        <button className="text-center text-sm font-medium text-neutral-600">
          이메일로 계속하기
        </button>

        <p className="text-center text-xs text-neutral-400">
          계속 진행 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </main>
  );
}
