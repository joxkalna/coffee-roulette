// TODO  - add test coverage

import shuffleArray from '../shuffleArray'

describe('shuffleArray', () => {
    //test if the shuffled array has the same length as original array
    it('should return an array of the same length when shuffled', () => {
        const array = [1, 2, 3, 4, 5]
        const shuffledArray = shuffleArray([...array])
        expect(shuffledArray.length).toBe(array.length)
    })
    // Test if the shuffled array contains the same elements as the original array
    it('should return the same elements as the original array', () => {
        const array = [1, 2, 3, 4, 5]
        const shuffledArray = shuffleArray([...array])
        expect(shuffledArray.sort()).toEqual(array.sort())
    })
})
