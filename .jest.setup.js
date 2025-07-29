import { jest } from '@jest/globals';

// Mock fs before any modules are loaded
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  readdirSync: jest.fn().mockReturnValue([])
}));
