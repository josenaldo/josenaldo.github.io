// @ts-check
const nextConfig = require('eslint-config-next/core-web-vitals')
const prettier = require('eslint-config-prettier')

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['node_modules/', 'build/', '.eslintrc.js'],
  },
  ...nextConfig,
  prettier,
  {
    rules: {
      'no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'warn',
    },
  },
]

module.exports = config
