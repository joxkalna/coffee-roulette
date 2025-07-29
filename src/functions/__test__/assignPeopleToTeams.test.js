import assignPeopleToTeams, { findBestMatch, hasBeenMatched } from '../assignPeopleToTeams';

// Mock shuffleArray to return a predictable result
jest.mock('../shuffleArray', () => {
    return jest.fn(arr => arr);
});

describe('assignPeopleToTeams', () => {
    it('should assign people to a team correctly', () => {
        const peopleList = ['Alice', 'Bob', 'Charlie', 'David'];
        const previousMatches = new Set();
        const teams = assignPeopleToTeams(peopleList, previousMatches);
        expect(teams).toHaveLength(2)
        expect(teams[0]).toHaveLength(2)
        expect(teams[1]).toHaveLength(2)
        expect(teams).toEqual([["Alice", "Bob"], ["Charlie", "David"]]);
    });
    //test what happens if its an odd number
    // test what happens if array is empty
    // test with an odd number of people left
    // test previously matched people 
    // handls all pairs matched scenario
    // hasBeenMatched - true/fals 
    // update previous matches correclty
    // handles updating existing matches
});

describe('hasBeenMatched', () => {
    it('Should be true when the previous matches includes both people', () => {
        const previousMatches = new Set();
        previousMatches.add('person1,person2')
        previousMatches.add('foo,bar')
        expect(hasBeenMatched(previousMatches, 'person1','person2')).toBeTruthy()
    })
    it('Should be true when the previous matches includes both people reversed', () => {
        const previousMatches = new Set();
        previousMatches.add('person2,person1')
        previousMatches.add('foo,bar')
        expect(hasBeenMatched(previousMatches, 'person1','person2')).toBeTruthy()
    })
    it('Should be false when the previous matches DOESNT includes both people', () => {
        const previousMatches = new Set();
        previousMatches.add('jane,doe')
        previousMatches.add('foo,bar')
        expect(hasBeenMatched(previousMatches, 'person1','person2')).toBeFalsy()
    })
})

describe('findBestMatch', () => {
    it('Should return someone they havent been matched with', () => {
        const peopleList = ['person2', 'person3']
        const previousMatches = new Set();
        previousMatches.add('person1,person2')

        const result = findBestMatch('person1', peopleList, previousMatches)
        expect(result).toEqual('person3')
    })
    it('Should return undefined if theyve been matched with everyone', () => {
        const peopleList = ['person2', 'person3']
        const previousMatches = new Set();
        previousMatches.add('person1,person2')
        previousMatches.add('person1,person3')
        
        const result = findBestMatch('person1', peopleList, previousMatches)
        expect(result).toEqual(undefined)
    })
})
