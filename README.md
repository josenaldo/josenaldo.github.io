# Vite JS React Minimal Template

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Twitter: josenaldomatos](https://img.shields.io/twitter/follow/josenaldomatos.svg?style=social)](https://twitter.com/josenaldomatos)

> This is a minimal template for React applications using Vite JS. It is a template that can be used as a starting point for small projects.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node.js
- You have installed the latest version of Yarn

## Installation and Setup

To install and setup the project, follow these steps:

Use degit to scaffold your project based on this template.

```sh
npx degit josenaldo/vite-js-react-minimal my-project
```

Where `my-project` is the name of your project.

Go to the project directory.

```sh
cd my-project
```

Install all dependencies of the project. Must be run once before other scripts, right after the clone or download.

```sh
yarn install
```

After installing all dependencies, you must configure the environment variables. You can use the `.env.example` file as a template.

```sh
cp .env.example .env
```

## Scripts

### Dev

The page will reload when you make changes. You may also see any lint errors in the console.

Run the application in development mode.

```sh
yarn dev
```

After running the application in development mode, you can access the application via the following URL:

- [http://localhost:PORT](http://localhost:PORT)

Where `PORT` is the port configured in the `.env` file. The default port is `3000`.

### Build

Builds the application for production to the `dist` folder.

```sh
yarn build
```

### Preview

Runs the application in production mode.

```sh
yarn preview
```

### Lint

Runs the ESLint linter on the source code files with `.js` and `.jsx`, extensions located in the `src` directory.

```sh
yarn lint
```

Runs the ESLint linter on the source code files with `.js`, and `.jsx`, extensions located in the `src` directory and automatically fix any fixable problems.

```sh
yarn lint:fix
```

### Deploy

Deploy the application to the production environment.

```sh
yarn deploy
```

### Test

Runs the Jest test runner on the source code files with `.test.js` and `.test.jsx`, extensions located in the `src` directory.

```sh
yarn test
```

Runs the Jest test runner on the source code files with `.test.js` and `.test.jsx`, extensions located in the `src` directory and watch for changes.

```sh
yarn test:watch
```

Runs the Jest test runner on the source code files with `.test.js` and `.test.jsx`, extensions located in the `src` directory and generate a coverage report.

```sh
yarn test:coverage
```

Runs Cypress E2E tests, located in the `cypress` directory.

```sh
yarn test:e2e
```

Open the Cypress Test Runner.

```sh
yarn cypress:open
```

## Technologies

This project uses the following technologies:

### Dependencies

- [axios](https://github.com/axios/axios)
  - A promise-based HTTP client for the browser and Node.js.
- [date-fns](https://date-fns.org/)
  - A lightweight JavaScript library for parsing, validating, manipulating, and formatting dates.
- [date-fns-tz](https://www.npmjs.com/package/date-fns-tz)
  - A date-fns plugin for supporting time zones.
- [prop-types](https://www.npmjs.com/package/prop-types)
  - Runtime type checking for React props.
- [React](https://reactjs.org/)
  - A JavaScript library for building user interfaces.
- [React DOM](https://reactjs.org/docs/react-dom.html)
  - A package for working with the DOM in React.
- [Redux](https://redux.js.org/)
  - A predictable state container for JavaScript apps.

### Dev Dependencies

- [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)
  - Custom Jest matchers to test the state of the DOM.
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
  - A library for testing React components.
- [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event/)
  - A library for simulating user events in testing.
- [@types/react](https://www.npmjs.com/package/@types/react)
  - TypeScript type definitions for React.
- [@types/react-dom](https://www.npmjs.com/package/@types/react-dom)
  - TypeScript type definitions for React DOM.
- [@vitejs/plugin-react](https://github.com/vitejs/vite/tree/main/packages/plugin-react)
  - Vite plugin for using React in a Vite project.
- [cypress](https://www.cypress.io/)
  - A JavaScript end-to-end testing framework.
- [eslint](https://eslint.org/)
  - A pluggable and configurable linter tool for identifying and reporting patterns in JavaScript.
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
  - A configuration for disabling ESLint rules that conflict with Prettier.
- [eslint-plugin-cypress](https://github.com/cypress-io/eslint-plugin-cypress)
  - ESLint rules for Cypress.
- [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)
  - ESLint plugin for Jest.
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
  - React specific linting rules for ESLint.
- [Vite](https://vitejs.dev/)
  - A build tool that aims to provide a faster and leaner development experience for modern web projects.
- [vite-plugin-eslint](https://github.com/ehutch79/vite-plugin-eslint)
  - A Vite plugin for running ESLint during development.

## Author

👤 **Josenaldo de Oliveira Matos Filho**

- Website: <josenaldo.github.io>
- Twitter: [@josenaldomatos](https://twitter.com/josenaldomatos)
- Github: [@josenaldo](https://github.com/josenaldo)
- LinkedIn: [@josenaldo](https://linkedin.com/in/josenaldo)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator) and improved by [ChatGPT](https://chat.openai.com/)_
