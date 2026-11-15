import { defineConfig } from 'vitest/config';

/** Node-only runner for the backend-shaped domain and repository contract. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/test/skhDomain.test.ts'],
  },
});
