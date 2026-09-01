import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SocialLoginButtons from "@/components/SocialLoginButtons";

// Figma wireframe: "⓪-1 가입" (00_SignUp)
// DB: on successful OAuth, the on_auth_user_created trigger (supabase/schema.sql)
// creates the matching public.profiles row automatically.
export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/");

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
        <SocialLoginButtons />

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
