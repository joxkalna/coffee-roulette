import fs from "fs"
import path from 'path'
import { generatePairCombinations, getAssignedPairsCSVFiles, getNextRunNumber, getTeamMemberNames, parseCSVContent, readNamesFromFile, readPreviousMatchesFromCSV, sortCSVFilesByNumber, writePairsToCSV } from '../index'

// Mock the external dependencies
jest.mock('fs')
jest.mock('../functions/assignPeopleToTeams.js', () => jest.fn())

describe('Coffee Roulette - index.js', () => {
    const artifactsDir = "mock/artifacts/dir"

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('File Operations', () => {
        describe('readNamesFromFile', () => {
            // Mock specific to readNamesFromFile tests
            beforeEach(() => {
                jest.spyOn(console, 'error').mockImplementation(jest.fn())
            })

            it('should read content from a file with a valid path', () => {
                const mockContent = 'Alice\nBob\nCharlie'
                fs.readFileSync.mockImplementation(() => mockContent)

                const filePath = path.join(artifactsDir, 'people.txt')
                const result = readNamesFromFile(filePath)

                expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
                expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
            })

            it('should throw an error if the file does not exist', () => {
                fs.readFileSync.mockImplementation(() => {
                    throw new Error('Error reading file')
                })
                const filePath = path.join(artifactsDir, 'people.txt')
                expect(() => readNamesFromFile(filePath)).toThrow()
            })

            it('should split the content by new lines', () => {
                const mockContent = 'Alice\r\nBob\nCharlie\n \nEve'
                fs.readFileSync.mockImplementation(() => mockContent)

                const filePath = path.join(artifactsDir, 'people.txt')
                const result = readNamesFromFile(filePath)

                expect(result).toEqual(['Alice', 'Bob', 'Charlie', 'Eve'])
            })

            it('should handle a file that contains names with leading and trailing spaces', () => {
                const mockContent = '\n Alice \nBob  \n Charlie\n\n\n Eve \n'
                fs.readFileSync.mockImplementation(() => mockContent)

                const filePath = path.join(artifactsDir, 'people.txt')
                const result = readNamesFromFile(filePath)

                expect(result).toEqual(['Alice', 'Bob', 'Charlie', 'Eve'])
            })
        })

        describe('writePairsToCSV', () => {
            let filePath

            beforeEach(() => {
                filePath = path.join(artifactsDir, 'writePairsToCSV.txt')
                fs.writeFileSync.mockClear()
            })

            it('should write pairs to CSV file correctly', () => {
                const mockContent = [['Alice', 'Bob'], ['Charlie', 'Eve']]
                writePairsToCSV(mockContent, filePath)

                expect(fs.writeFileSync).toHaveBeenCalledWith(
                    filePath,
                    'Group,People\nGroup 1,Alice,Bob\nGroup 2,Charlie,Eve\n'
                )
            })

            it('should handle empty team array', () => {
                const emptyMockContent = []
                writePairsToCSV(emptyMockContent, filePath)

                expect(fs.writeFileSync).toHaveBeenCalledWith(
                    filePath,
                    'Group,People\n'
                )
            })

            it('should handle empty teams array', () => {
                const emptyMockContent = [[], []]
                writePairsToCSV(emptyMockContent, filePath)

                expect(fs.writeFileSync).toHaveBeenCalledWith(
                    filePath,
                    'Group,People\nGroup 1,\nGroup 2,\n'
                )
            })
        })
    })

    describe('CSV Processing', () => {
        describe('sortCSVFilesByNumber', () => {
            it('should sort CSV files in descending order', () => {
                const files = ['assigned_pairs_run_1.csv', 'assigned_pairs_run_2.csv', 'assigned_pairs_run_3.csv']
                const result = sortCSVFilesByNumber(files)

                expect(result).toEqual(['assigned_pairs_run_3.csv', 'assigned_pairs_run_2.csv', 'assigned_pairs_run_1.csv'])
            })

            it('should handle a single CSV file', () => {
                const file = ['assigned_pairs_run_1.csv']
                const result = sortCSVFilesByNumber(file)
                expect(result).toEqual(['assigned_pairs_run_1.csv'])
            })

            it('should handle duplicate run numbers', () => {
                const files = ['assigned_pairs_run_1.csv', 'assigned_pairs_run_1.csv']
                const result = sortCSVFilesByNumber(files)
                expect(result).toEqual(['assigned_pairs_run_1.csv', 'assigned_pairs_run_1.csv'])
            })

            it('should handle large run numbers', () => {
                const files = ['assigned_pairs_run_999.csv', 'assigned_pairs_run_1000.csv']
                const result = sortCSVFilesByNumber(files)
                expect(result).toEqual(['assigned_pairs_run_1000.csv', 'assigned_pairs_run_999.csv'])
            })
        })

        describe('getTeamMemberNames', () => {
            it('should extract team members from CSV line', () => {
                const csvLine = 'Group 1,Alice,Bob,Charlie'
                const result = getTeamMemberNames(csvLine)

                expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
            })

            it('should handle CSV line with extra spaces', () => {
                const csvLine = 'Group 2,Bob,   Charlie, Alice'
                const result = getTeamMemberNames(csvLine)

                expect(result).toEqual(['Bob', 'Charlie', 'Alice'])
            })
        })

        describe('parseCSVContent', () => {
            it('should parse CSV content and return pair combinations', () => {
                const content = 'Group,People\nGroup 1,Alice,Bob\nGroup 2,Charlie,Eve'

                const result = parseCSVContent(content)

                expect(result).toEqual(['Alice, Bob', 'Charlie, Eve'])
            })

            it('should handle empty CSV content', () => {
                const content = 'Group,People\n'

                const result = parseCSVContent(content)

                expect(result).toEqual([])
            })

            it('should handle CSV content with groups of 3 people', () => {
                const content = 'Group,People\nGroup 1,Alice,Bob,Charlie'

                const result = parseCSVContent(content)

                expect(result).toEqual(['Alice, Bob', 'Alice, Charlie', 'Bob, Charlie'])
            })
        })

        describe('getAssignedPairsCSVFiles', () => {
            it('should filter files to only include assigned_pairs_run CSV files', () => {
                const files = [
                    'assigned_pairs_run_1.csv',
                    'assigned_pairs_run_2.csv',
                    'people.txt',
                    'other_file.csv',
                    'assigned_pairs_run_3.csv'
                ]

                const result = getAssignedPairsCSVFiles(files)

                expect(result).toEqual([
                    'assigned_pairs_run_1.csv',
                    'assigned_pairs_run_2.csv',
                    'assigned_pairs_run_3.csv'
                ])
            })

            it('should return empty array when no matching CSV files exist', () => {
                const files = ['people.txt', 'other_file.csv', 'readme.md']

                const result = getAssignedPairsCSVFiles(files)

                expect(result).toEqual([])
            })
        })

        describe('getNextRunNumber', () => {
            beforeEach(() => {
                fs.readdirSync.mockClear()
            })

            it('should return 1 when no CSV files exist', () => {
                fs.readdirSync.mockReturnValue(['assign_pairs_run_*.csv'])

                const runNumber = getNextRunNumber(artifactsDir)
                expect(runNumber).toBe(1)
            })

            it('should calculate next run number from existing files', () => {
                fs.readdirSync.mockReturnValue([
                    'assigned_pairs_run_1.csv',
                    'assigned_pairs_run_2.csv',
                    'assigned_pairs_run_3.csv',
                    'assigned_pairs_run_4.csv',
                ])

                const runNumber = getNextRunNumber(artifactsDir)
                expect(runNumber).toBe(5)
            })

            it('should ignore non-matching files when calculating next run number', () => {
                fs.readdirSync.mockReturnValue([
                    'assigned_pairs_run_1.csv',
                    'assigned_pairs_run_2.csv',
                    'file.txt'
                ])

                const runNumber = getNextRunNumber(artifactsDir)
                expect(runNumber).toBe(3)
            })
        })

        describe('readPreviousMatchesFromCSV', () => {
            beforeEach(() => {
                fs.readdirSync.mockClear()
                fs.readFileSync.mockClear()
            })

            it('should read and parse previous matches from CSV files', () => {
                fs.readdirSync.mockReturnValue([
                    'assigned_pairs_run_1.csv',
                    'assigned_pairs_run_2.csv',
                    'people.txt'
                ])

                const csvContent1 = 'Group,People\nGroup 1,Alice,Bob\nGroup 2,Charlie,Dave'
                const csvContent2 = 'Group,People\nGroup 1,Eve,Frank\nGroup 2,Alice,Charlie'

                fs.readFileSync
                    .mockReturnValueOnce(csvContent1)
                    .mockReturnValueOnce(csvContent2)

                const result = readPreviousMatchesFromCSV(artifactsDir)

                expect(result).toBeInstanceOf(Set)
                expect([...result]).toEqual(expect.arrayContaining([
                    'Alice, Bob',
                    'Charlie, Dave',
                    'Eve, Frank',
                    'Alice, Charlie'
                ]))
                expect(result.size).toBe(4)
            })

            it('should handle directory with no CSV files', () => {
                fs.readdirSync.mockReturnValue(['people.txt', 'readme.md'])

                const result = readPreviousMatchesFromCSV(artifactsDir)

                expect(result).toBeInstanceOf(Set)
                expect(result.size).toBe(0)
            })

            it('should handle empty CSV files', () => {
                fs.readdirSync.mockReturnValue(['assigned_pairs_run_1.csv'])
                fs.readFileSync.mockReturnValue('Group,People\n')

                const result = readPreviousMatchesFromCSV(artifactsDir)

                expect(result).toBeInstanceOf(Set)
                expect(result.size).toBe(0)
            })
        })

        describe('generatePairCombinations', () => {
            // Tests that pairs are only created in one direction (A->B but not B->A)
            it('should generate unidirectional pair combinations for two people', () => {
                const pairs = ['Alice', 'Bob']
                const result = generatePairCombinations(pairs)

                expect(result).toEqual(['Alice, Bob'])
                // Note: Does not include 'Bob, Alice' as we only want unidirectional pairs
            })

            it('should generate unidirectional pair combinations for three people', () => {
                const pairs = ['Alice', 'Bob', 'Megan']
                const result = generatePairCombinations(pairs)

                // Only includes pairs in one direction:
                // Alice -> Bob, Alice -> Megan, Bob -> Megan
                // Does NOT include: Bob -> Alice, Megan -> Alice, Megan -> Bob
                expect(result).toEqual(['Alice, Bob', 'Alice, Megan', 'Bob, Megan'])
            })
        })
    })
})

