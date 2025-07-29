#!/bin/bash
set -e

echo "Running coffee roulette e2e test..."

# Set up test environment - use CI_PROJECT_DIR if in CI
if [ -n "$CI_PROJECT_DIR" ]; then
    # We're in a CI environment
    TEST_DIR="$CI_PROJECT_DIR/e2e_test_artifacts"
else
    # Local environment
    TEST_DIR="tests/e2e/artifacts"
fi

ARTIFACT_NAME="test_coffee_roulette.csv"

# Clean up previous test runs
rm -rf $TEST_DIR
mkdir -p $TEST_DIR

# Copy test data
cp tests/e2e/test_data/people.txt $TEST_DIR/

# Run the Node.js script with test directory
node src/index.js $TEST_DIR

# Verify output exists
latest_csv=$(ls -t $TEST_DIR/assigned_pairs_run_*.csv 2>/dev/null | head -n1)
if [ -z "$latest_csv" ]; then
    echo "❌ Test failed: No CSV file was generated"
    exit 1
fi

# Verify CSV format (basic check)
if ! grep -q "," "$latest_csv"; then
    echo "❌ Test failed: Generated file doesn't appear to be CSV format"
    exit 1
fi

echo "✅ E2E test passed: Coffee roulette script generated valid output at $latest_csv"
exit 0
