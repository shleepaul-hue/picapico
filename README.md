# PicaPico

여행 스몰토크 스페인어 학습 PWA. 하루 20분, 퀴즈식 학습 + 발음 듣기 + 섀도잉으로 여행 회화를 익힌다.

와이어프레임: [Figma](https://www.figma.com/design/8xAMqhA5XwBJmEcCjdAEGi)

## 스택

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) — PWA(오프라인 캐싱, 매니페스트, 서비스워커)
- [Supabase](https://supabase.com) — 인증(구글/애플 소셜 로그인) + DB
- [react-voice-visualizer](https://github.com/YZarytskyi/react-voice-visualizer) — 섀도잉 녹음 + 웨이브폼
- [react-activity-calendar](https://github.com/grubersjoe/react-activity-calendar) — 스트릭 히트맵
- [html-to-image](https://github.com/bubkoo/html-to-image) — 인스타 스토리 공유 카드 이미지 생성

## 화면 (와이어프레임 기준)

| 라우트 | 화면 |
| --- | --- |
| `/signup` | ⓪-1 가입 (구글/애플 소셜 로그인) |
| `/onboarding` | ⓪-2 목표 설정 (목적지, 여행 날짜, 아침 알림) |
| `/` | ① 홈 (여행 D-day 배너, 학습 시작 CTA, 주간 스트릭) |
| `/session` | ② 학습 세션 (퀴즈, 발음 듣기, 섀도잉 녹음) |
| `/complete` | ③ 완료 (통계, 오늘 배운 표현) |
| `/complete/share` | ⑤ 인스타 스토리 공유 카드 (PNG 저장) |
| `/archive` | ④ 아카이브 (필터, 히트맵, 지난 세션) |

## 시작하기

```bash
npm install
cp .env.example .env.local   # Supabase URL/anon key 채우기
npm run dev
```

`next dev`/`next build`는 `--webpack`으로 실행한다 — PWA 서비스워커 생성 플러그인이 아직 Turbopack(Next 16 기본값)을 지원하지 않기 때문.

## Supabase 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 프로젝트 생성
2. `supabase/schema.sql`을 SQL Editor에서 실행 (profiles / learning_sessions / phrases 테이블 + RLS 정책 + 회원가입 시 프로필 자동 생성 트리거)
3. `.env.local`에 프로젝트 URL과 anon key 입력

## 소셜 로그인 설정

### Google (연동 완료 — Provider 설정만 하면 바로 동작)

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) > 사용자 인증 정보 만들기 > OAuth 클라이언트 ID
2. 애플리케이션 유형: 웹 애플리케이션
3. 승인된 리디렉션 URI: `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
4. 생성된 클라이언트 ID/보안 비밀번호를 [Supabase 대시보드 > Authentication > Providers > Google](https://supabase.com/dashboard/project/_/auth/providers)에 입력 후 활성화
5. 로컬 개발 시 리디렉션이 `http://localhost:3000/auth/callback`으로 오는지 Supabase Auth > URL Configuration의 Redirect URLs에도 추가

### Apple (미연동 — Apple Developer Program 가입 후 진행)

Apple Developer Program(연 $99) 가입이 필요해서 보류 중. 가입 후:

1. Apple Developer > Certificates, Identifiers & Profiles에서 Services ID 생성
2. [Supabase Dashboard > Authentication > Providers > Apple](https://supabase.com/dashboard/project/_/auth/providers)에 설정 입력
3. `src/components/SocialLoginButtons.tsx`의 Apple 버튼에서 `disabled` 제거하고 `signInWithOAuth({ provider: "apple" })` 연결

## 학습 세션 흐름

하루 세션은 **메인 5문제 → 응용문제 5문제**, 총 10문제로 구성된다 (약 13~16분, 20분 목표 안에서 여유 있게):

1. **메인 라운드 (표현마다 학습→퀴즈 2단계, ×5)** — 콜드 게스로 퀴즈부터 보여주지 않기 위함
   - **학습**: 스페인어 표현 + 뜻 + 발음 듣기(브라우저 TTS) + 발음 정확도 확인(`PronunciationCheck`). 마이크 버튼 하나로 녹음이 곧 음성 인식 시도이고, 말이 끝나면 자동으로 "채점 중..." → 점수 공개까지 이어진다 (버튼 클릭 없이 자동, 참고용 채점 — 아이폰 사파리는 대부분 미지원이라 건너뛰기 제공)
   - **퀴즈**: 뜻 가리고 4지선다로 회상 확인
2. **응용문제 (×5)** — 메인에서 배운 오늘의 5개 표현을 거꾸로(뜻→스페인어) 묻고, 오답도 같은 세션의 나머지 표현들로 채운다 — 방금 배운 것들끼리라 자연히 헷갈리기 쉬운(비슷한 단어/동사) 오답이 나온다. 새 콘텐츠가 필요 없어 DB에 추가로 저장하지 않는다.

화면 전환에 시간이 걸리는 지점(세션 진입 시 청크 로딩, 완료 시 저장 중)은 빈 화면 대신 `BrandTransition`(로고 + 여행지 D-day)을 보여줘 동기부여 요소로 활용한다.

세션 완료 시 `learning_sessions` 1행 + 메인 5문제에서 배운 `phrases` N행(표현마다 1행)만 저장한다 — 응용문제, 개별 퀴즈 시도, 발음 채점 결과는 저장하지 않아 DB가 무한정 늘어나지 않는다. 스트릭·주간 점·완료 화면 통계는 모두 이 두 테이블에서 매번 계산한다 (`src/lib/streak.ts`).

### 20분 세션의 문항 수를 어떻게 정했나

- 메인 5문제: 표현당 학습(TTS 듣기 + 발음 녹음/자동채점, ~60~90초) + 퀴즈(~15초) ≈ 문제당 1.5~2분 → 약 8~10분
- 응용문제 5문제: 발음 체크 없이 회상만 하므로 문제당 ~20~30초 → 약 2~3분
- 인트로/전환 화면 buffer ~2~3분
- 합계 약 13~16분 — 20분 목표 안에 여유를 두어, 표현을 천천히 곱씹거나 재시도해도 부담 없게 설계. 문제 수를 더 늘리기보다는(피로도↑, 완주율↓) 이 정도를 "매일 부담 없이 끝내는" 기준으로 잡았고, 나중에 완주율/체류 데이터를 보면서 조정하면 된다.

## 남은 작업

- 섀도잉 녹음 파일 Supabase Storage 업로드 (지금은 녹음/재생만, 저장 안 함)
- 발음 채점 고도화: 지금은 Web Speech API 텍스트 비교 기반의 대략적인 채점(무료, 아이폰 사파리 미지원). 더 정확한 원어민 비교가 필요해지면 OpenAI/Google 등 유료 TTS+발음 평가 API로 교체 고려
- 아카이브에서 지난 세션 표현으로 다시 퀴즈 보는 "복습 모드" (지금은 목록 열람만 가능 — 응용문제는 당일 세션 내에서만 동작)
- 인스타 스토리 공유 카드에 실제 프로필/스트릭 데이터 연결 (지금은 정적 목업)
