#!/bin/bash
set -e

# Copy all previous run CSVs to artifacts directory
cp src/assigned_pairs_run_*.csv artifacts/ || true

# Run the Node.js script
node src/index.js artifacts

# Copy the latest run to the ARTIFACT_NAME
latest_csv=$(ls -t artifacts/assigned_pairs_run_*.csv | head -n1)
cp "$latest_csv" "artifacts/${ARTIFACT_NAME}"

# Create a dotenv file with the latest CSV filename
echo "LATEST_CSV=$(basename $latest_csv)" > artifacts/latest_csv.env