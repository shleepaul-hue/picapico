@echo off
setlocal
cd /d "%~dp0"

echo ============================
echo   PicaPico Auto Deploy
echo ============================
echo.

git add -A

git commit -m "update %date% %time%"
if errorlevel 1 (
  echo (Nothing to commit - skipping^)
)

echo.
echo Pushing to GitHub...
git push
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed.
  echo If this is the first run, check whether a browser login window appeared.
  echo If it keeps failing, run this ONE command in PowerShell, then try again:
  echo   git config --global credential.helper manager
  pause
  exit /b 1
)

echo.
echo Done! Pushed to GitHub successfully.
echo Railway will automatically build and deploy now (usually 1-2 minutes^).
echo Progress: https://railway.com/project/52e0ca03-d660-4b4f-98bd-9d4dd8ac58dd
echo.
timeout /t 8
