# 배포 방법 (자동 배포 세팅 완료)

## 지금 상태
- GitHub 저장소: https://github.com/shleepaul-hue/picapico
- Railway가 이 저장소에 **이미 연결되어 있어서**, `main` 브랜치에 push만 되면
  Railway가 자동으로 빌드하고 배포함 (보통 1~2분).
  → 즉 "배포"라는 건 사실상 **GitHub에 push 하는 것**과 같음. Railway 쪽엔 따로 할 일 없음.
- 진행 상황 확인: https://railway.com/project/52e0ca03-d660-4b4f-98bd-9d4dd8ac58dd
- 서비스 주소: https://picapico-web-production.up.railway.app

## 지난번에 안 됐던 이유
git remote(origin) 주소에 GitHub PAT(토큰)이 그대로 박혀 있었는데, 그 토큰이
GitHub API 기준으로 "Bad credentials"(무효) 상태였음 — 그래서 push가 막혔던 것.
→ 지금은 그 토큰을 remote 주소에서 제거했고, 대신 아래처럼 Git Credential Manager
(브라우저 로그인 방식)를 쓰도록 바꿨음. PAT를 직접 관리/교체할 필요가 없어짐.

**보안 정리**: GitHub → Settings → Developer settings → Personal access tokens
에서 `github_pat_11CNAZCKA...` 로 시작하는 토큰이 남아있다면 삭제해줘 (이미 무효한
토큰이라 위험하진 않지만 정리 차원).

## 평소 배포하는 법 (둘 중 편한 거 아무거나)

### 방법 1. deploy.bat 더블클릭
이 폴더에 있는 `deploy.bat`을 더블클릭하면 알아서
`git add` → `git commit` → `git push` 까지 한번에 실행됨.
파워쉘 명령어 칠 필요 없음.

- **처음 한 번만**: 더블클릭했을 때 브라우저 로그인 창이 뜨면 GitHub 계정으로 로그인.
  그 이후로는 안 뜸 (Windows에 로그인 정보가 저장됨).
- 만약 로그인 창이 안 뜨고 그냥 오류가 난다면, PowerShell을 이 폴더에서 열고
  아래 명령어를 **딱 한 번만** 실행한 뒤 deploy.bat을 다시 더블클릭:
  ```
  git config --global credential.helper manager
  ```

### 방법 2. 채팅으로 "배포해줘"라고 말하기
이 컴퓨터(hermes)가 Claude 세션에 연결되어 있고 picapico 폴더가 연결된 상태라면,
Claude한테 그냥 "배포해줘"라고 채팅으로 말하면 내가 대신 git add/commit/push를 실행해줌.
이 경우도 PowerShell 필요 없음.

## 참고
- `core.fileMode`를 `false`로 바꿔서, 실제로 바뀐 게 없는데도 파일 전체가
  "modified"로 뜨던 문제를 고쳐놨음.
