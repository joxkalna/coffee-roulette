import fs from "fs";
import path from "path";
import assignPeopleToTeams from './functions/assignPeopleToTeams.js';

// === FILE OPERATIONS ===
// General file reading and writing operations

export function readNamesFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.split(/\r?\n/).map(name => name.trim()).filter(name => name !== '');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

export function writePairsToCSV(teams, filePath) {
    let csvContent = 'Group,People\n';
    teams.forEach((team, index) => {
        csvContent += `Group ${index + 1},${team.join(',')}\n`
    });

    fs.writeFileSync(filePath, csvContent);
}

// === CSV PROCESSING ===
// CSV-specific operations including file management and data processing

export function getAssignedPairsCSVFiles(files) {
    return files.filter(file => file.startsWith('assigned_pairs_run_') && file.endsWith('.csv'))
}

export function getNextRunNumber(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    const runNumbers = getAssignedPairsCSVFiles(files)
        .map(file => parseInt(file.match(/\d+/)[0]))
    return runNumbers.length > 0 ? Math.max(...runNumbers) + 1 : 1;
}

export function sortCSVFilesByNumber(csvFiles) {
    return csvFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0])
        const numB = parseInt(b.match(/\d+/)[0])
        return numB - numA;  // Sort in descending order
    })
}

export function getTeamMemberNames(line) {
    const columns = line.split(',');
    const peopleNames = columns.slice(1); // Skip group name column

    return peopleNames
        .map(name => name.trim())
        .filter(name => name !== '')
}

export function generatePairCombinations(people) {
    const pairs = []
    for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {  // only unidirectional pairs
            pairs.push(`${people[i]}, ${people[j]}`)
        }
    }
    return pairs
}

export function parseCSVContent(content) {
    const lines = content.split('\n').slice(1);
    const allPairs = []

    lines.forEach(line => {
        const people = getTeamMemberNames(line)
        const pairs = generatePairCombinations(people)
        allPairs.push(...pairs)
    })
    return allPairs
}

export function readPreviousMatchesFromCSV(directoryPath) {
    const files = fs.readdirSync(directoryPath)
    const csvFiles = getAssignedPairsCSVFiles(files)
    const sortedFiles = sortCSVFilesByNumber(csvFiles)

    const previousMatches = new Set();

    sortedFiles.forEach(csvFile => {
        const content = fs.readFileSync(path.join(directoryPath, csvFile), 'utf8')
        const pairs = parseCSVContent(content)
        pairs.forEach(pair => previousMatches.add(pair))
    });

    return previousMatches;
}

/*
* === MAIN LOGIC ===
* @main Only run this code when this file is executed directly (not imported)
*/

export function main(artifactsDir = '.') {
    try {
        const peopleList = readNamesFromFile(path.join(artifactsDir, 'people.txt'))
        const previousMatches = readPreviousMatchesFromCSV(artifactsDir)

        const assignedTeams = assignPeopleToTeams(peopleList, previousMatches)
        const nextRunNumber = getNextRunNumber(artifactsDir)
        const outputFileName = path.join(artifactsDir, `assigned_pairs_run_${nextRunNumber}.csv`)
        writePairsToCSV(assignedTeams, outputFileName)

        console.log(`Teams assigned and written to ${outputFileName}`)
        return outputFileName // Return for testing purposes
    } catch (error) {
        console.error('Error running coffee roulette:', error)
        throw error
    }
}

// More reliable check for direct execution in ES modules
const isDirectlyExecuted = process.argv[1] && process.argv[1].endsWith('index.js')

// Only run when executed directly
if (isDirectlyExecuted) {
    const artifactsDir = process.argv[2] || '.'
    main(artifactsDir)
}
