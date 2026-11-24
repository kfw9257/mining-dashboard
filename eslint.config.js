import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import { vitest } from 'vitest'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
       ...vitest.environments.env.globals,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
