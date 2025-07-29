export default {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    setupFiles: ['./.jest.setup.js']
};
