// @ts-check
const nextConfig = require('eslint-config-next/core-web-vitals')
const prettierConfig = require('eslint-config-prettier')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Ignore auto-generated and build output files
  {
    ignores: [
      '.contentlayer/**',
      '.next/**',
      'node_modules/**',
      'out/**',
      'public/**',
    ],
  },

  // Next.js rules (includes react, react-hooks, import, jsx-a11y, @next/next)
  ...nextConfig,

  // Prettier: disables formatting rules that conflict with prettier
  prettierConfig,

  // Project-specific overrides
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ── General ─────────────────────────────────────────────────────────
      'no-unused-vars': 'warn',

      // ── React ───────────────────────────────────────────────────────────
      'react/no-unescaped-entities': 'warn',
      // Project does not use PropTypes (no TS either); disable the rule
      'react/prop-types': 'off',

      // ── Next.js ─────────────────────────────────────────────────────────
      // Project uses <img> intentionally in some places
      '@next/next/no-img-element': 'off',

      // ── React Hooks (v7) ────────────────────────────────────────────────
      // New React Compiler pattern rule; downgraded to warn (pre-existing)
      'react-hooks/static-components': 'warn',

      // ── Import organisation ──────────────────────────────────────────────
      // Disable weaker built-in rules so simple-import-sort owns ordering
      'import/order': 'off',
      'sort-imports': 'off',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. React (core framework)
            ['^react$', '^react/'],
            // 2. Next.js (meta-framework)
            ['^next$', '^next/'],
            // 3. External npm packages (@mui/*, other @-scoped, unscoped)
            //    Excludes @/ (internal alias) via negative lookahead
            ['^@mui/', '^@(?!/)[^/]+', '^[a-z]'],
            // 4. Contentlayer generated content
            ['^contentlayer'],
            // 5. Internal project aliases (@/*)
            ['^@/'],
            // 6. Relative imports (./foo, ../foo)
            ['^\\.'],
            // 7. Side-effect imports (CSS, global styles)
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]

module.exports = config
