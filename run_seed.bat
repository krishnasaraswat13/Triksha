@echo off
echo Starting Seed Script... > seed_output.txt
node server/seed.js >> seed_output.txt 2>&1
echo Exit Code: %ERRORLEVEL% >> seed_output.txt
echo DONE > seed_params_executed.txt
exit /b %ERRORLEVEL%
