import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

// 이용약관 + 개인정보처리방침 — 회원가입 화면 하단 고지 링크의 대상 페이지.
// PicaPico는 1인 운영 개인 서비스이므로 사업자 정보 대신 운영자 연락처만
// 안내한다. 약관 자체는 한국 개인정보보호법(PIPA) 기준 표준 항목을 따르되,
// 앱이 실제로 저장하는 데이터(구글 로그인 이메일, 학습 기록)에 맞춰 썼다.
export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-7 px-5 py-6">
      <div className="flex items-center gap-2.5">
        <Link
          href="/signup"
          aria-label="뒤로"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform active:scale-90"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <span className="text-sm font-bold text-ink">이용약관 및 개인정보처리방침</span>
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-bold text-ink">이용약관</h1>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제1조 (목적)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이 약관은 PicaPico(이하 &ldquo;서비스&rdquo;)를 이용함에 있어 서비스와 이용자 간의
            권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제2조 (서비스의 내용)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 여행자를 위한 스페인어 스몰토크 학습 콘텐츠를 제공하며, 매일의 학습
            세션, 퀴즈, 학습 기록 아카이브 등의 기능을 포함합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제3조 (회원가입)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이용자는 구글(Google) 계정을 통한 소셜 로그인으로 서비스에 가입하며, 별도의
            회원가입 절차나 개인정보 입력 없이 구글 계정 인증으로 가입이 완료됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제4조 (이용자의 의무)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이용자는 서비스를 본래 목적 외의 용도로 사용하거나, 타인의 계정을 부정하게
            사용해서는 안 되며, 서비스 운영을 방해하는 행위를 해서는 안 됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제5조 (서비스의 변경 및 중단)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 운영상, 기술상의 필요에 따라 제공하는 콘텐츠를 변경하거나 서비스의
            전부 또는 일부를 중단할 수 있으며, 이 경우 사전에 공지합니다. 다만 긴급한 사유가
            있는 경우 사후에 통지할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제6조 (콘텐츠의 저작권)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스가 제공하는 학습 문구, 디자인, 캐릭터 등 모든 콘텐츠의 저작권은 서비스
            운영자에게 있으며, 이용자는 개인적 학습 목적 외로 이를 복제, 배포, 상업적으로
            이용할 수 없습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제7조 (면책조항)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 학습 보조 도구이며, 발음 채점 기능은 브라우저의 음성 인식 결과를
            기반으로 한 참고용 근사치로 실제 어학 평가를 대체하지 않습니다. 천재지변, 통신
            장애 등 서비스 운영자의 귀책사유가 아닌 사정으로 인한 서비스 중단에 대해서는
            책임을 지지 않습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제8조 (약관의 개정)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이 약관은 관련 법령 또는 서비스 운영 정책 변경에 따라 개정될 수 있으며, 개정 시
            서비스 내 공지를 통해 이용자에게 안내합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">제9조 (준거법 및 관할)</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이 약관은 대한민국 법령에 따라 규율되며, 서비스 이용과 관련하여 분쟁이 발생할
            경우 민사소송법상의 관할 법원에 제소합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">부칙</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이 약관은 2026년 9월 3일부터 적용됩니다.
          </p>
        </div>
      </section>

      <div className="h-px w-full bg-neutral-100" />

      <section className="flex flex-col gap-4">
        <h1 className="text-lg font-bold text-ink">개인정보처리방침</h1>
        <p className="text-[13px] leading-relaxed text-neutral-600">
          PicaPico(이하 &ldquo;서비스&rdquo;)는 「개인정보보호법」 등 관련 법령을 준수하며,
          이용자의 개인정보를 아래와 같이 처리합니다.
        </p>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">1. 수집하는 개인정보 항목</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            구글 소셜 로그인을 통해 이메일 주소, 프로필 이름을 수집합니다. 서비스 이용
            과정에서 여행지, 여행 날짜, 학습 알림 설정, 학습 기록(학습한 날짜, 학습한 표현,
            즐겨찾기 여부)이 자동으로 생성·저장됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">2. 개인정보 수집 및 이용 목적</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            회원 식별 및 로그인 유지, 학습 콘텐츠 및 진행 상황(연속 학습일, D-day) 제공,
            학습 기록 아카이브 제공, 아침 학습 알림 발송을 위해 이용합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            회원 탈퇴 시 또는 수집·이용 목적이 달성된 후에는 지체 없이 파기합니다. 단, 관계
            법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">4. 개인정보의 제3자 제공</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 법령에 근거가
            있거나 이용자가 사전에 동의한 경우에 한하여 제공합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">5. 개인정보 처리의 위탁</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 인증 및 데이터베이스 운영을 위해 Supabase(호스팅: AWS), 배포 및 서버
            운영을 위해 Railway를 이용하며, 각 위탁업체는 자체 보안 정책에 따라 데이터를
            안전하게 관리합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">6. 이용자의 권리와 행사 방법</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            이용자는 언제든지 자신의 개인정보를 조회, 수정할 수 있으며, 아래 연락처를 통해
            회원 탈퇴 및 개인정보 삭제를 요청할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">7. 개인정보의 파기 절차 및 방법</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            수집·이용 목적이 달성된 개인정보는 지체 없이 파기하며, 전자적 파일 형태의 정보는
            복구할 수 없는 기술적 방법으로 삭제합니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">8. 개인정보의 안전성 확보 조치</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 개인정보 암호화 저장, 접근 권한 관리 등 개인정보보호법에서 요구하는
            기술적·관리적 조치를 취하고 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">9. 아동의 개인정보 보호</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            서비스는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[13px] font-bold text-ink">10. 개인정보 관련 문의</h2>
          <p className="text-[13px] leading-relaxed text-neutral-600">
            개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등에 관한 사항은 아래 연락처로
            문의하실 수 있습니다.
          </p>
        </div>
      </section>

      <a
        href="mailto:shleepaul@gmail.com"
        className="flex items-center gap-3 rounded-2xl bg-rosa-50 px-4 py-3.5"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-rosa-600">
          <Mail size={17} strokeWidth={2} />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-medium text-neutral-500">운영 문의</span>
          <span className="text-[13px] font-bold text-rosa-600">shleepaul@gmail.com</span>
        </span>
      </a>

      <p className="pb-4 text-center text-[11px] text-neutral-400">
        공고일 2026년 9월 3일 · 시행일 2026년 9월 3일
      </p>
    </main>
  );
}
