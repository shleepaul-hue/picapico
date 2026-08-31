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
2. `supabase/schema.sql`을 SQL Editor에서 실행 (profiles / learning_sessions / phrases 테이블 + RLS 정책)
3. Authentication > Providers에서 Google, Apple OAuth 설정
4. `.env.local`에 프로젝트 URL과 anon key 입력

## 남은 작업

- 소셜 로그인 실제 연동 (`supabase.auth.signInWithOAuth`)
- 발음 듣기: Web Speech API 또는 TTS API 연동
- 섀도잉 녹음 파일 Supabase Storage 업로드
- 온보딩 입력값 → `profiles` 테이블 저장
- 학습 세션 진행 상태 관리 (퀴즈 정답 체크, 다음 버튼 활성화)
