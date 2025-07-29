# Developer Documentation

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Code Style](#code-style)
- [API Reference](#api-reference)
- [Pipeline Integration](#pipeline-integration)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

Coffee Roulette follows a modular architecture with clear separation of concerns:

```
src/
├── index.js              # Main orchestrator and file operations
├── functions/
│   ├── assignPeopleToTeams.js    # Core pairing algorithm
│   └── shuffleArray.js           # Utility for randomization
└── __test__/
    └── index.test.js             # Unit tests
```

### Core Components

1. **File Operations Module** (`index.js`)
   - Handles reading/writing CSV and text files
   - Manages run numbering and file organization
   - Orchestrates the overall workflow

2. **Pairing Algorithm** (`functions/assignPeopleToTeams.js`)
   - Implements the core matching logic
   - Ensures no duplicate pairs until all combinations exhausted
   - Handles odd numbers by creating groups of three

3. **Utility Functions** (`functions/shuffleArray.js`)
   - Provides randomization capabilities
   - Ensures fair and unbiased pairing

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
│   └── people.txt                  # Participant list - please fill it out with your people
├── ci_scripts/                     # Pipeline automation - for slack integration
├── tests/
│   ├── e2e/                        # End-to-end tests
│   └── integration/                # Integration tests
├── coverage/                       # Test coverage reports
├── package.json
├── jest.config.js
└── README.md                       # User documentation
```

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd coffee-roulette

# Install dependencies
npm install

# Verify setup
npm test
```

### Environment Variables
For local development, you may need:
- `SLACK_WEBHOOK` - For testing Slack notifications
- `ARTIFACTS_DIR` - Custom artifacts directory

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test src/__test__/index.test.js

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test function interactions
- **E2E Tests**: Test complete workflow from input to output

## 📝 Code Style

### JavaScript Standards
- Use ES6+ features (import/export, arrow functions, etc.)
- Prefer `const` over `let` when possible
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### File Naming
- Use camelCase for functions and variables
- Use kebab-case for files and directories
- Use PascalCase for classes (if any)

### Function Structure
```javascript
/**
 * Brief description of what the function does
 * @param {string} param1 - Description of parameter
 * @param {number} param2 - Description of parameter
 * @returns {Array} Description of return value
 */
export function functionName(param1, param2) {
    // Implementation
}
```

## 📚 API Reference

### Core Functions

#### `readNamesFromFile(filePath)`
Reads and parses names from a text file.
- **Parameters**: `filePath` (string) - Path to the text file
- **Returns**: `Array<string>` - Array of trimmed names
- **Throws**: Error if file cannot be read

#### `writePairsToCSV(teams, filePath)`
Writes team assignments to a CSV file.
- **Parameters**: 
  - `teams` (Array<Array<string>>) - Array of team arrays
  - `filePath` (string) - Output CSV file path
- **Returns**: void

#### `getNextRunNumber(directoryPath)`
Calculates the next run number based on existing CSV files.
- **Parameters**: `directoryPath` (string) - Directory to scan
- **Returns**: `number` - Next run number

#### `assignPeopleToTeams(peopleList, previousMatches)`
Core pairing algorithm that creates unique team assignments.
- **Parameters**:
  - `peopleList` (Array<string>) - List of participants
  - `previousMatches` (Set<string>) - Previously matched pairs
- **Returns**: `Array<Array<string>>` - Team assignments

### Data Formats

#### Input File (`people.txt`)
```
Alice
Bob
Charlie
Dave
```

#### Output CSV (`assigned_pairs_run_X.csv`)
```csv
Group,People
Group 1,Alice,Bob
Group 2,Charlie,Dave
```

#### Previous Matches Format
```javascript
Set {
  "Alice, Bob",
  "Charlie, Dave",
  "Alice, Charlie"
}
```

## 🔄 Pipeline Integration

### GitLab CI/CD Structure
```
.gitlab-ci.yml
├── coffee_roulette_run_script    # Main execution job
├── handle_artifacts              # Artifact management
└── send_slack_notification       # Notification job
```

### Artifact Management
- Previous run data is preserved as artifacts
- New runs download and build upon historical data
- Ensures continuity across pipeline executions

### Environment Variables
- `SLACK_WEBHOOK`: Slack notification webhook URL
- `ARTIFACT_NAME`: Name of the generated CSV file

## 🐛 Troubleshooting

### Common Issues

#### "File not found" Errors
- Ensure `people.txt` exists in the artifacts directory
- Check file permissions
- Verify working directory

#### Duplicate Pair Warnings
- This is expected behavior when all combinations are exhausted
- The system will automatically start rematching

#### Pipeline Failures
- Check GitLab CI/CD variables are set correctly
- Verify Slack webhook URL is valid
- Review pipeline logs for specific error messages

### Debug Mode
For local debugging, you can add console logs:
```javascript
// Add to index.js for debugging
console.log('People list:', peopleList);
console.log('Previous matches:', previousMatches);
console.log('Assigned teams:', assignedTeams);
```

### Performance Considerations
- Large participant lists (>100 people) may impact performance
- Consider batching for very large groups
- Monitor memory usage with large historical datasets

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Make changes with appropriate tests
3. Ensure all tests pass
4. Update documentation if needed
5. Submit merge request

### Code Review Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes to existing functionality
- [ ] Error handling implemented

---

For questions or issues, please refer to the main README.md or create an issue in the repository. 
