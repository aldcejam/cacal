import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:8080/v3/api-docs',
    output: {
      mode: 'tags-split',
      target: './src/api/generated/minhas-contas.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
    },
  },
}); 