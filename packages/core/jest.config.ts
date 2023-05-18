import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: ['./src/jest.setup.ts'],
    testPathIgnorePatterns: ["/dist/"]
};
export default config;
