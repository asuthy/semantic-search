@echo off

set list[2]=vscode-extensions
set list[3]=thunder-client

for /l %%n in (0,1,2,3) do (
  docker volume create %list[%%n]%
)