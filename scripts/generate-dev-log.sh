#!/usr/bin/env sh
set -e
SHA=$(git rev-parse --short HEAD)
DATE=$(date +%F-%H%M%S)
FILE="dev-logs/${DATE}-commit-${SHA}.md"
SUBJ=$(git log -1 --pretty=%s)
BODY=$(git log -1 --pretty=%b)
CHANGES=$(git diff-tree --no-commit-id --name-status -r HEAD)
mkdir -p dev-logs
cat > "$FILE" <<EOF
---
title: Commit ${SHA}
date: ${DATE}
---

## Contexto
${SUBJ}

## Mudanças
${BODY}

## Arquivos alterados

ação  arquivo
----- ---------------------------------
${CHANGES}

## Impacto

## Próximos passos
EOF
echo "Dev log criado em: $FILE"
