import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // async fetch functions inside effects are a valid pattern
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // context files export a context object + a hook/provider — that's intentional
    files: ['**/context/**', '**/hooks/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
