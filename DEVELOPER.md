# Developer Documentation

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Running the App](#running-the-app)
- [Slack Integration (Optional)](#slack-integration-optional)
- [Scheduled Runs (Automation)](#scheduled-runs-automation)
- [Testing](#testing)
- [Code Style](#code-style)
- [API Reference](#api-reference)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🏗️ Architecture Overview

Coffee Roulette is a modular Node.js app for pairing people into teams, with optional Slack and CI/CD integration.

**Key Modules:**
- **File Operations**: Reads/writes participant and result files.
- **Pairing Algorithm**: Assigns unique teams, avoids duplicate pairs.
- **Utilities**: Randomization and helpers.

---

## 📁 Project Structure

```
coffee-roulette/
├── src/
│   ├── index.js                    # Main application logic
│   ├── functions/
│   │   ├── assignPeopleToTeams.js  # Core pairing algorithm
│   │   └── shuffleArray.js         # Randomization utility
│   ├── __test__/
│   │   └── index.test.js           # Unit tests
│   └── people.txt                  # List of participants (edit this!)
├── ci_scripts/                     # (Optional) CI/CD scripts
├── tests/
│   ├── e2e/                        # End-to-end tests
│   └── integration/                # Integration tests
├── coverage/                       # Test coverage reports
├── package.json
├── jest.config.js
└── README.md
```

---

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd coffee-roulette
npm install
```

---

## ▶️ Running the App

### 1. Prepare Participants

Edit `src/people.txt` and list one participant per line.

### 2. Run Manually (No Slack Required)

```bash
node src/index.js
```

- Results will be written to a CSV file in the project directory.
- You can open the CSV manually or share it as needed.

### 3. Run with Slack Integration (Optional)

Set the `SLACK_WEBHOOK` environment variable:

```bash
export SLACK_WEBHOOK="https://hooks.slack.com/services/..."
node src/index.js
```

- If set, results will be posted to the specified Slack channel.
- If not set, the script will skip Slack and only write the CSV.

---

## 💡 Slack Integration (Optional)

- **Not required** for local/manual use.
- If you want Slack notifications, set the `SLACK_WEBHOOK` variable (as an environment variable locally, or as a secret/variable in CI/CD).
- If you don’t have Slack, just run the script and use the CSV output.

---

## ⏰ Scheduled Runs (Automation)

You can automate Coffee Roulette to run on a schedule, generate a CSV, and (optionally) post results to Slack.

### GitHub Actions

- **Already Configured:**  
  This repository includes a pre-configured workflow at `.github/workflows/.coffee-roulette.yml`.
- **How to use:**
  - **Scheduled Run:** The workflow is set up to run on a schedule (see the `on.schedule` section in the YAML).
  - **Manual Run:** Go to the **Actions** tab in GitHub, select the "Coffee Roulette Pipeline" workflow, and click **Run workflow**. You can set the `run_coffee_roulette` input to `true` to trigger a run.
  - **Slack Integration:** Set the `SLACK_WEBHOOK` secret in your repository settings if you want results posted to Slack. If not set, Slack steps will be skipped.
  - **CSV Output:** The workflow uploads the generated CSV as an artifact. You can download it from the workflow run summary.

### GitLab CI/CD

1. **Manual or Scheduled Run:**  
   The pipeline can be triggered manually or on a schedule.  
   To run manually, set the `RUN_COFFEE_ROULETTE` variable to `true` when starting the pipeline.

2. **Sample `.gitlab-ci.yml`:**
   ```yaml
   stages:
     - coffee-roulette

   coffee_roulette_job:
     stage: coffee-roulette
     script:
       - npm ci
       - node src/index.js
     artifacts:
       paths:
         - results/*.csv
     rules:
       - if: '$RUN_COFFEE_ROULETTE == "true"'
   ```
   - **Manual Run:** Go to **CI/CD > Pipelines** in GitLab, click **Run pipeline**, and set `RUN_COFFEE_ROULETTE` to `true`.
   - **Scheduled Run:** Go to **CI/CD > Schedules** in GitLab UI, add a new schedule, and set `RUN_COFFEE_ROULETTE` to `true` in the schedule’s variables.
   - Set the `SLACK_WEBHOOK` variable in your project’s CI/CD settings if you want Slack notifications.

---

**Manual Use:**  
If you don’t want to use CI/CD or Slack, just run `node src/index.js` locally and use the generated CSV.

---

## 🧪 Testing

```bash
npm test                # Run all tests
npm run test:coverage   # Run tests with coverage
```

- Unit, integration, and E2E tests are in the `tests/` and `src/__test__/` folders.

---

## 📝 Code Style

- Use ES6+ features.
- Prefer `const` over `let` where possible.
- Use camelCase for variables/functions, kebab-case for files.
- Add JSDoc for complex functions.

---

## 📚 API Reference

See [README.md](./README.md) for user-facing docs.

**Key Functions:**
- `readNamesFromFile(filePath)`
- `writePairsToCSV(teams, filePath)`
- `getNextRunNumber(directoryPath)`
- `assignPeopleToTeams(peopleList, previousMatches)`

---

## 🔄 CI/CD Integration

### GitHub Actions

- The workflow is already included at `.github/workflows/.coffee-roulette.yml`.
- It automates runs, tests, artifact uploads, and (optionally) Slack notifications.
- Configure secrets (like `SLACK_WEBHOOK`) in your repository settings as needed.

### GitLab CI/CD

- Use `.gitlab-ci.yml` and adapt scripts from `ci_scripts/`.
- Artifacts and Slack integration work similarly; set variables in the GitLab UI.

### Switching Between GitHub and GitLab

- **GitHub**: Use Actions for automation, set secrets in repo settings.
- **GitLab**: Use CI/CD variables and pipeline jobs.
- The codebase is agnostic; only the pipeline scripts differ.

---

## 🐾 Manual vs. Automated Usage

- **Manual**: Edit `people.txt`, run `node src/index.js`, share the CSV.
- **Automated**: Use CI/CD to schedule runs, post to Slack, and store artifacts.

---

## 🐛 Troubleshooting

- **File not found**: Ensure `people.txt` exists and is readable.
- **No Slack notification**: Check `SLACK_WEBHOOK` is set and valid.
- **Duplicate pairs**: Expected if all combinations are exhausted; the app will rematch as needed.
- **Pipeline issues**: Check environment variables and logs.

---

## 🤝 Contributing

1. Branch from `main`.
2. Add features/fixes with tests.
3. Ensure all tests pass.
4. Update docs if needed.
5. Open a pull request (GitHub) or merge request (GitLab).

**Checklist:**
- [ ] Tests pass
- [ ] Code style followed
- [ ] Docs updated
- [ ] No breaking changes

---

For questions, see [README.md](./README.md) or open an