#!/bin/bash
set -e

if [ -n "$GITLAB_CI" ]; then
    # GitLab CI artifact handling
    curl --header "JOB-TOKEN: $CI_JOB_TOKEN" \
        --output "previous_artifacts.zip" \
        "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/jobs/artifacts/main/download?job=coffee_roulette_run_script" \
        || echo "No previous artifacts found"
elif [ -n "$GITHUB_ACTIONS" ]; then
    # GitHub Actions artifact handling
    echo "Setting up artifacts directory for GitHub Actions"
    # GitHub handles artifacts differently via upload/download actions
else
    echo "Running locally - no artifact download"
fi

# Common logic for both platforms
mkdir -p artifacts
if [ -f "previous_artifacts.zip" ]; then
    unzip -o "previous_artifacts.zip" -d artifacts/ || echo "Failed to unzip artifacts"
    rm "previous_artifacts.zip"
fi

echo "Contents of artifacts directory:"
ls -la artifacts/
