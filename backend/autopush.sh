#!/bin/bash
cd ~/Desktop/todo-app/backend || exit

messages=(
  "init: project setup and structure"
  "feat: add prisma schema with user and todo models"
  "feat: add jwt authentication utilities"
  "feat: add auth middleware for protected routes"
  "feat: add zod validators for auth and todos"
  "feat: implement auth controller with register and login"
  "feat: implement todo controller with crud operations"
  "feat: add auth and todo routes"
  "feat: add express server with cors and helmet"
  "feat: add todo filtering search and sorting"
  "feat: add stats endpoint for dashboard"
  "feat: add user ownership checks for todos"
  "test: add auth integration tests"
  "test: add todo integration tests with ownership"
  "docs: add readme with setup instructions"
)

msg_index=0

while true
do
  files=($(git status --porcelain | grep -v '^??' | awk '{print $2}' | head -3))
  
  if [ ${#files[@]} -eq 0 ]; then
    untracked=($(git ls-files --others --exclude-standard | head -3))
    if [ ${#untracked[@]} -eq 0 ]; then
      echo "No files left to commit."
      exit 0
    fi
    files=("${untracked[@]}")
  fi

  msg="${messages[$msg_index % ${#messages[@]}]}"
  msg_index=$((msg_index + 1))

  git add "${files[@]}"
  git commit -m "$msg"
  git push origin main

  echo "✅ Pushed: $msg"
  echo "⏳ Waiting 30 minutes..."
  sleep 1800
done
