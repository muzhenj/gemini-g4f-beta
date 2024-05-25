# Contributing

Thank you for taking the time to contribute!

## Techstack

Gemini AI is built with the following tools. Ensure you have `bun` [installed](https://bun.sh/).

- [**Bun**](https://bun.sh/) as the package manager
- [**Biome**](https://biomejs.dev/) as the linter and formatter
- [**tsup**](https://tsup.egoist.dev/) as the build tool

Follow the [Github flow](https://docs.github.com/en/get-started/using-github/github-flow) to clone the repo and create a branch.

It is recommended to install Biome integration with your IDE to format your code.

## Scripts

### `bun run build`

Use this to build your project, should you need to test it locally.

It uses `tsup` under the hood.

### `bun run test`

Use this to test your project with existing unit tests. These tests will also be ran on your PR, so ensure they are passing!

It uses `vitest` under the hood.

You can also use `bun run coverage` to check coverage of your tests.

### `bun run check`

Use this to check if your code follows our formatting standards.

It uses Biome under the hood.
