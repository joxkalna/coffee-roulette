# Coffee Roulette

Coffee Roulette is a Node.js application that helps you randomly pair or group people for coffee chats, team-building, or networking sessions. It supports both manual and automated runs, with optional Slack integration, and can be used in GitHub or GitLab CI/CD environments.

---

## 🚀 Purpose

- **Randomly pair or group participants** for informal meetings or team-building.
- **Avoid repeat pairings** as much as possible.
- **Flexible usage:**  
  - Run manually on your local machine.
  - Automate via GitHub Actions or GitLab CI/CD.
  - Optionally post results to a Slack channel.

> **Origin:**  
> This project was born out of creating networking opportunities for the Women in Tech network. We’re sharing it so others can use and adapt it for their own communities or teams.
>
> **Note:**  
> While this was originally intended as a coffee roulette project, you can adapt it for any scenario where random pairing or grouping is needed (e.g., mentoring, study groups, social mixers, etc.). Just remember it is pair of 2, do feel free to adjust it if you want larger group to be paired randomly.

---

## 🛠️ Features

- Simple participant management via `src/people.txt`
- Outputs results as a CSV file
- Optional Slack notifications
- Works with or without CI/CD
- Supports both GitHub Actions and GitLab CI/CD pipelines
- **Handles odd numbers:** If there is an odd number of participants, one group will be a trio (group of 3). There will never be a person left out of a pair.

---

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd coffee-roulette
npm install
```

### 2. Add Participants

Edit `src/people.txt` and list one participant per line.

### 3. Run Manually (No Slack Required)

```bash
node src/index.js
```

- Results will be saved as a CSV file in the project directory.

### 4. Run with Slack Integration (Optional)

Set the `SLACK_WEBHOOK` environment variable:

```bash
export SLACK_WEBHOOK="https://hooks.slack.com/services/..."
node src/index.js
```

- If set, results will be posted to the specified Slack channel.

---

## 📂 CSV Files & Historic Pairs

- **Do not delete any CSV files** created by the app if you run it locally.  
  These files are used to track historic pairs and help avoid repeat matchings in future runs.
- If you want to organize your CSV files, you can create a folder (e.g., `results/`) and modify `index.js` to save new CSVs there.

**Example: Save results to a `results/` folder**

1. Create the folder:
   ```bash
   mkdir -p results
   ```

2. In `src/index.js`, change the output path:
   ```javascript
   // filepath: src/index.js
   // ...existing code...
   const outputPath = path.join(__dirname, '../results', `coffee_roulette_${runNumber}.csv`);
   // ...existing code...
   ```

---

## 🤖 CI/CD & Automation

### GitHub Actions

- **Already Configured:**  
  This repo includes a workflow at `.github/workflows/.coffee-roulette.yml`.
- **How to use:**
  - **Scheduled Run:** Runs automatically on a schedule (see workflow YAML).
  - **Manual Run:** Go to the **Actions** tab, select "Coffee Roulette Pipeline", and click **Run workflow**.
  - **Slack Integration:** Set the `SLACK_WEBHOOK` secret in your repo settings if you want Slack notifications.
  - **CSV Output:** Download the generated CSV from the workflow run summary.

### GitLab CI/CD

- Use the provided `.gitlab-ci.yml` or adapt your own.
- **Manual Run:** Start a pipeline and set `RUN_COFFEE_ROULETTE` to `true`.
- **Scheduled Run:** Add a schedule in **CI/CD > Schedules** and set `RUN_COFFEE_ROULETTE` to `true`.
- **Slack Integration:** Set the `SLACK_WEBHOOK` variable in your project’s CI/CD settings.

---

## 💡 Usage Scenarios

- **With Slack:** Set up the `SLACK_WEBHOOK` variable to post results to Slack.
- **No Slack:** Omit the variable; results will be saved as CSV only.
- **GitHub or GitLab:** Use the included workflows or your own automation. The codebase is CI/CD agnostic.
- **Beyond Coffee Roulette:** Use for any random pairing/grouping need—mentoring, study groups, social mixers, etc.

---

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

---

## 🐞 Found an Issue?

If you find a bug or have a suggestion, please [open an issue](https://github.com/<your-org-or-username>/coffee-roulette/issues) or submit a pull request!

---

## 🤝 Contributing

1. Fork the repo and create your branch from `main`.
2. Add your feature or fix with tests.
3. Ensure all tests pass.
4. Open a pull request.

---

## 📚 More Info

- See [DEVELOPER.md](./DEVELOPER.md) for technical and