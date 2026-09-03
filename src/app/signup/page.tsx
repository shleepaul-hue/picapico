import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthGateLoader from "@/components/AuthGateLoader";

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
        <h1 className="text-2xl font-bold tracking-tight text-rosa-600">PICAPICO</h1>

        <div className="animate-drop-in flex h-44 w-44 items-center justify-center">
          <Image
            src="/bird-logo.png"
            alt="PicaPico 콜리브리 캐릭터"
            width={200}
            height={200}
            priority
            className="h-auto w-[168px]"
          />
        </div>

        <h2 className="animate-fade-slide-up text-center text-lg font-bold leading-snug text-ink">
          여행 스몰토크,
          <br />
          하루 20분으로 시작해요
        </h2>
      </div>

      <div className="flex w-full flex-col gap-3">
        <AuthGateLoader />

        <p className="text-center text-xs text-neutral-400">
          계속 진행 시{" "}
          <Link href="/terms" className="font-medium text-rosa-600 underline">
            이용약관 및 개인정보처리방침
          </Link>
          에 동의하게 됩니다
        </p>
      </div>
    </main>
  );
}
