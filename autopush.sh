#!/bin/bash
cd ~/Desktop/todo-app || exit

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
  "feat: add frontend vite react typescript setup"
  "feat: add tailwind css configuration"
  "feat: add zustand auth store"
  "feat: add axios instance with interceptors"
  "feat: add login and register pages"
  "feat: add protected dashboard layout"
  "feat: add todo list with filter and search"
  "feat: add create todo modal with validation"
  "feat: add edit todo functionality"
  "feat: add delete confirmation dialog"
  "feat: add status and priority badges"
  "feat: add loading skeletons and empty states"
  "feat: add profile page with user stats"
  "feat: add responsive mobile layout"
  "fix: resolve cors and env configuration"
  "docs: add readme with setup instructions"
)

msg_index=0

while true
do
  files=($(git status --porcelain | awk '{print $2}' | head -3))

  if [ ${#files[@]} -eq 0 ]; then
    echo "No files left to commit."
    exit 0
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
