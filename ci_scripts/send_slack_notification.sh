#!/bin/sh
set -e  # Exit immediately if a command exits with a non-zero status

CSV_CONTENT=$(cat "artifacts/${ARTIFACT_NAME}")
SLACK_MESSAGE="Here are this months Coffee Roulette Pairings:\n\`\`\`$CSV_CONTENT\`\`\`"
curl -X POST -H 'Content-type: application/json' --data "{\"text\":\"$SLACK_MESSAGE\"}" "$SLACK_WEBHOOK"