@echo off

CALL npm install --no-optional || exit /b 1
CALL npm run prod || exit /b 1

echo DONE
