       import '@testing-library/jest-dom';  // toBeInTheDocument, etc.

       // Mock Next.js router/pathname (pour usePathname/useRouter)
       jest.mock('next/navigation', () => ({
         usePathname: () => '/marketplace',  // Mock par défaut
         useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
       }));

       // Mock useUser  (auth) – Override par test
       jest.mock('@/hooks/useUser ', () => ({
         use:User  jest.fn(() => ({ user: null, loading: false })),  // Default non connecté
       }));

       // Mock signOut (actions)
       jest.mock('@/lib/actions', () => ({
         signOut: jest.fn(() => Promise.resolve()),
       }));

       // Mock DB (drizzle/mysql2) – Pour queries marketplace
       jest.mock('@/lib/db', () => ({
         db: {
           execute: jest.fn(),
         },
       }));
       