     const nextJest = require('next/jest.js');
     const createJestConfig = nextJest({
       // Fournit context Next.js (appDir: true pour App Router)
       dir: './',
     });

     const customJestConfig = {
       setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // RTL + mocks
       testEnvironment: 'jsdom',  // Simulateur DOM pour React
       moduleNameMapping: {
         '^@/(.*)$': '<rootDir>/src/$1',  // Alias @/ → src/ (tsconfig paths)
       },
       transform: {
         '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],  // Next.js Babel
       },
       moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
       testMatch: ['<rootDir>/__tests__/**/*.ts?(x)', '<rootDir>/src/**/__tests__/**/*.ts?(x)'],  // Dossiers tests
       collectCoverageFrom: [
         'src/**/*.tsx',
         'components/**/*.tsx',
         '!src/app/**/page.tsx',  // Ignore pages server (mockées)
         '!**/*.d.ts',
       ],
       coverageThreshold: {
         global: {
           branches: 80,
           functions: 80,
           lines: 80,
           statements: 80,
         },
       },
     };

     module.exports = createJestConfig(customJestConfig);
     