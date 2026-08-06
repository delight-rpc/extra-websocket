import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  }
, test: {
    maxWorkers: 1
  , isolate: false
  }
})
