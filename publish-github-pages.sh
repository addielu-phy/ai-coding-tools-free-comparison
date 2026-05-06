#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

test -f .nojekyll || : > .nojekyll

echo "== Git status =="
git status --short

git add .
if git diff --cached --quiet; then
  echo "== No changes to commit =="
else
  git commit -m "Update GitHub Pages site"
fi

echo "== Push to GitHub Pages repo =="
git push origin main

echo "== Done =="
echo "Live URL: https://addielu-phy.github.io/ai-coding-tools-free-comparison/"
