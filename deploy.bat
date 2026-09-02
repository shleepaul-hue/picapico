@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ============================
echo   PicaPico 자동 배포
echo ============================
echo.

git add -A

git commit -m "update %date% %time%"
if errorlevel 1 (
  echo (커밋할 변경사항 없음 - 넘어감^)
)

echo.
echo GitHub로 push 중...
git push
if errorlevel 1 (
  echo.
  echo [오류] push가 실패했습니다. 처음 실행이라면 로그인 창이 떴는지 확인해주세요.
  echo 계속 실패하면 아래 명령어를 PowerShell에서 한 번만 실행해보세요:
  echo   git config --global credential.helper manager
  pause
  exit /b 1
)

echo.
echo 완료! GitHub push 성공.
echo Railway가 자동으로 빌드/배포를 시작합니다 (보통 1~2분 소요^).
echo 진행 상황: https://railway.com/project/52e0ca03-d660-4b4f-98bd-9d4dd8ac58dd
echo.
timeout /t 8
