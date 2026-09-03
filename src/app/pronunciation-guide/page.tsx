import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 해설페이지 — 학습 세션의 "발음 체크" 카드에서 새 탭으로 열리는 안내 문서.
// 세션 진행 상태를 잃지 않도록 별도 탭에서 열리며, 여기서는 그냥 정적으로
// 스페인어 발음의 핵심만 짧게 정리한다. 발음 체크 기능 자체가 Web Speech
// API 기반 근사치라는 점과, 여행 스몰토크에 실제로 자주 걸리는 발음 포인트
// (모음, r/rr, ñ, ll/y, 강세)를 한국어 화자 기준으로 설명한다.
const POINTS: { title: string; body: string; example?: string }[] = [
  {
    title: "모음은 5개, 항상 같은 소리예요",
    body:
      "a, e, i, o, u는 앞뒤 글자와 상관없이 항상 똑같이 발음돼요. 영어처럼 늘어지거나 이중모음으로 바뀌지 않고, 한국어 '아, 에, 이, 오, 우'에 가깝게 짧고 분명하게 소리 내면 됩니다.",
    example: "gracias → 그.라.시.아스 (한 음절씩 또박또박)",
  },
  {
    title: "r 하나는 살짝 굴리는 'ㄹ', rr은 확실히 굴려요",
    body:
      "단어 중간의 r 하나(pero)는 한국어 'ㄹ'과 비슷하게 혀를 한 번 톡 튕겨요. 반면 rr(perro)이나 단어 맨 앞의 r(recomiendas)은 혀를 여러 번 떨어야 하는 '굴린 r'이에요. 처음엔 잘 안 되는 게 당연하니, 안 되면 그냥 'ㄹ'로 발음해도 의미는 통해요.",
    example: "pero(그런데) vs perro(개) — r 개수로 뜻이 달라져요",
  },
  {
    title: "ñ은 한국어 '냐/녀/뇨/뉴/니'처럼",
    body:
      "ñ은 n에 콧소리 섞인 'ㄴ+이' 소리가 붙어요. año(해/년)를 '아뇨'라고 하면 거의 비슷하게 들립니다.",
    example: "España → 에스빠냐",
  },
  {
    title: "ll, y는 여행지마다 조금씩 달라요",
    body:
      "스페인 본토에서는 '이'에 가깝고, 중남미 대부분(멕시코, 아르헨티나 등)에서는 '지/쉬'에 가깝게 들리기도 해요. 이 앱은 표준 발음으로 안내하지만, 실제 여행지 사람들의 발음이 조금 다르게 들려도 이상한 게 아니에요.",
    example: "llamas → (스페인) 야마스 / (일부 중남미) 자마스",
  },
  {
    title: "강세는 대부분 뒤에서 두 번째 음절",
    body:
      "단어에 강세 부호(´)가 없으면 대부분 뒤에서 두 번째 음절을 강하게 읽어요. 부호가 있으면(예: está, dónde) 그 음절을 강하게 읽으면 됩니다. 강세 위치만 맞아도 훨씬 자연스럽게 들려요.",
    example: "¿Cómo te llamas? → '꼬'모 떼 야마스",
  },
  {
    title: "h는 항상 묵음이에요",
    body: "철자에 h가 보여도 소리 내지 않아요. hablas는 '하블라스'가 아니라 '아블라스'예요.",
    example: "¿Hablas inglés? → 아블라스 잉글레스",
  },
  {
    title: "단어들이 붙어서 들려요 (연음)",
    body:
      "스페인어는 앞 단어의 끝소리와 다음 단어의 첫소리가 자연스럽게 이어져요. 그래서 실제 대화를 들으면 훨씬 빠르고 뭉개진 것처럼 들리는데, 처음엔 한 단어씩 끊어서 천천히 연습하고 익숙해지면 속도를 올리는 게 좋아요.",
  },
];

export default function PronunciationGuidePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col gap-6 px-5 py-6">
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          aria-label="닫기"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-transform active:scale-90"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </Link>
        <span className="text-sm font-bold text-ink">발음 체크 안내</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-lg font-bold text-ink">스페인어 발음, 이 정도만 알아도 충분해요</h1>
        <p className="text-[13px] leading-relaxed text-neutral-500">
          학습 세션의 발음 체크는 브라우저 음성 인식(Web Speech API) 결과를 바탕으로 한
          <span className="font-medium text-neutral-700"> 참고용 근사치 점수</span>예요. 실제
          어학 시험 채점처럼 정밀하지는 않지만, 얼마나 비슷하게 말했는지 감을 잡는 용도로는
          충분해요. 아래는 여행 스몰토크에서 자주 마주치는 발음 포인트예요.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {POINTS.map((p) => (
          <div key={p.title} className="flex flex-col gap-1.5 rounded-2xl bg-rosa-50 p-4">
            <h2 className="text-[13px] font-bold text-rosa-600">{p.title}</h2>
            <p className="text-[13px] leading-relaxed text-neutral-700">{p.body}</p>
            {p.example && (
              <p className="text-[12px] font-medium text-neutral-500">{p.example}</p>
            )}
          </div>
        ))}
      </div>

      <p className="pb-4 text-center text-[11px] text-neutral-400">
        완벽하지 않아도 괜찮아요 — 통하는 게 먼저예요 🙂
      </p>
    </main>
  );
}
