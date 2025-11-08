# BCMClient

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project Overview

This is an Angular 20 app using standalone components, Angular Router, HttpClient, and Angular Material. It includes authentication flow, a dashboard, and a cards management module with dialogs, pagination, file uploads, and QR features.

## Quick Start

- **Install dependencies**
  - npm: `npm i`
  - pnpm: `pnpm i`
- **Run dev server**: `ng serve` then open http://localhost:4200/
- **Build**: `ng build`

## Project Structure (key paths)

- `src/app/app.ts` — root component; redirects based on `token` in `localStorage`.
- `src/app/app.routes.ts` — routes: `login`, `dashboard`, `dashboard/card` with `authorizeGuard`.
- `src/app/app.config.ts` — global providers, Http interceptors, animations, date formats.
- `src/app/core/` — core building blocks
  - `services/api.service.ts` — wraps HttpClient with `environment.BaseURL`.
  - `services/auth.service.ts` — `login` API.
  - `services/card.service.ts` — CRUD, pagination, file/QR imports for cards.
  - `guard/authorize-guard` — protects dashboard routes.
  - `interceptors/` — global HTTP interceptors (e.g., auth/error handling).
  - `utils/` — helpers like date, image, gender mapping.
  - `models/` — shared models and response types.
- `src/app/pages/`
  - `login/` — login page.
  - `dashboard/` — main app area inside `Layout`.
  - `card/` — cards table, filters, dialogs.
- `src/app/shared/components/`
  - `layout/` — shell with header/sidebar and router outlet.
  - `UI/` — reusable dialogs and UI parts:
    - `card-details-dialog`, `card-form-dialog`, `import-dialog`, `qr-scanner-dialog`.

## Environment configuration

- Base API URL comes from: `src/app/env/development.env` via `environment.BaseURL`.
- `ApiService` builds URLs as `${environment.BaseURL}/<path>`.
- Update `BaseURL` to point at your API before running.

## Routing overview

- `/` → redirects to `/login`.
- `/login` → public login screen.
- `/dashboard` → protected area inside `Layout`.
- `/dashboard/card` → cards management.
- Guard: `authorizeGuard` checks access. Root `App` also redirects based on `localStorage.getItem('token')`.

## Authentication

- `AuthService.login({ username, password })` → `POST auth/login`.
- On success, persist `token` in `localStorage` to stay logged in.

## Cards module (high level)

- Listing with pagination and filters.
- Actions: view, edit, delete.
- Dialogs for create/edit, import file, scan QR.
- Example endpoints: `Card/GetAllCards`, `Card/Create`, `Card/Update/:id`, `Card/Delete/:id`, `Card/UploadFile`, `Card/ImportQrCode`.

## How to explore the code

- **Start with routes**: open `src/app/app.routes.ts` to see navigation.
- **Follow the flow**: `login` → token saved → `dashboard`.
- **Inspect services**: API contracts in `core/services/` and models in `core/models/`.
- **Open cards page**: `src/app/pages/card/` for table logic and dialogs wiring.
- **Review shared UI**: dialogs and layout in `shared/components/`.
- **Check providers**: global config and interceptors in `app.config.ts`.
- **Adjust environment**: set `environment.BaseURL` before testing APIs.

## Useful commands

- `ng serve` — run locally on http://localhost:4200/
- `ng build` — production build to `dist/`
- `ng test` — unit tests
- `ng e2e` — end-to-end tests (configure your preferred runner)
