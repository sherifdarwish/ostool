# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 15 and Payload CMS project. Application code lives in `src/`, with route handlers and app routes under `src/app/`, Payload configuration in `src/payload.config.ts`, CMS collections in `src/collections/`, reusable UI in `src/components/`, content blocks in `src/blocks/`, and shared helpers in `src/utilities/` and `src/lib/`. Static assets belong in `public/`. Tests are split into `tests/int/` for Vitest integration coverage and `tests/e2e/` for Playwright browser flows. Docker and database support files are at the repository root, including `docker-compose.yml`, `Dockerfile`, and SQL/environment files.

## Build, Test, and Development Commands

Use `pnpm` for project commands.

- `pnpm dev`: start the local Next.js development server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production server after building.
- `pnpm lint`: run Next/ESLint checks.
- `pnpm lint:fix`: apply supported lint fixes.
- `pnpm test:int`: run Vitest tests from `tests/int/**/*.int.spec.ts`.
- `pnpm test:e2e`: run Playwright tests from `tests/e2e/`; this starts or reuses `http://localhost:3000`.
- `pnpm test`: run integration and E2E suites.
- `pnpm generate:types`: regenerate Payload TypeScript types after schema changes.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF endings, two-space indentation, final newline, and trimmed trailing whitespace. Prettier uses single quotes, no semicolons, trailing commas, and a 100-character print width. Prefer TypeScript and React functional components. Use PascalCase for React components, camelCase for functions and variables, and kebab-case for route folders or URL-oriented names. Keep CMS fields, hooks, and blocks colocated with their domain folders when possible.

## Testing Guidelines

Vitest runs in `jsdom` with `vitest.setup.ts`; name integration specs `*.int.spec.ts` under `tests/int/`. Playwright E2E specs belong in `tests/e2e/` and should use stable user-facing selectors or accessible roles where practical. Add focused tests for route handlers, CMS behavior, and user-visible flows touched by a change.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages such as `fix build error` and conventional-style messages such as `chore: update package dependencies and versions`. Prefer concise `type: summary` commits when practical, for example `fix: handle missing blog slug`. Pull requests should describe the change, list test commands run, link relevant issues, and include screenshots for visible UI updates.

## Security & Configuration Tips

Do not commit secrets from `.env` or `.env.local`. Use `test.env` only for test-safe values. When changing Payload schemas or collections, regenerate types and verify migrations or database expectations before opening a PR.
