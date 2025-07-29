import shuffleArray from './shuffleArray.js';


export function hasBeenMatched(previousMatches, person1, person2) {
    return previousMatches.has(`${person1},${person2}`) || previousMatches.has(`${person2},${person1}`);
}

export function findBestMatch(person, availablePeople, previousMatches) {
    return availablePeople.find(p => !hasBeenMatched(previousMatches, person, p));
}

export default function assignPeopleToTeams(peopleList, previousMatches) {
    const shuffledPeople = shuffleArray([...peopleList]);
    let teams = [];
    let unmatched = [...shuffledPeople];


    while (unmatched.length > 1) {
        const person1 = unmatched.shift();
        const person2 = findBestMatch(person1, unmatched, previousMatches);

        if (person2) {
            teams.push([person1, person2]);
            unmatched.splice(unmatched.indexOf(person2), 1);
        } else {
            // If no match found, put back in unmatched list
            unmatched.push(person1);
        }

        // If we've gone through the whole list without making a match, reset and start over
        if (unmatched.length === peopleList.length) {
            console.log("All possible pairs have been matched. Resetting and starting over.");
            previousMatches.clear();
            return assignPeopleToTeams(peopleList, previousMatches);
        }
    }

    // Handle any remaining unmatched person
    if (unmatched.length === 1) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        randomTeam.push(unmatched[0]);
    }

    // Update previousMatches with new pairs
    teams.forEach(team => {
        for (let i = 0; i < team.length; i++) {
            for (let j = i + 1; j < team.length; j++) {
                previousMatches.add(`${team[i]},${team[j]}`);
            }
        }
    });

    return teams;
}