# Family Finance Management

Family Finance Management is a web application for planning a household's monthly
income, tracking expenses against budget categories, and reviewing monthly
spending. The frontend is built with Angular and the API with ASP.NET Core; the
API persists data in SQLite and is authoritative for financial calculations.

This repository is an evolving MVP. Some requirement and design documents are
still marked Draft or Proposed, so check their status before treating every
documented behavior as final.

## Features

- Account sign-up and sign-in, with protected application routes.
- Create and review monthly plans using seven predefined budget jars.
- Track expenses assigned to a jar and view monthly spending and dashboard data.
- Store monetary values as whole VND amounts; the frontend displays values
  returned by the API rather than calculating authoritative balances.

The default jar allocations total 100%:

| Jar | Allocation |
| --- | ---: |
| Living Expenses | 35% |
| Food | 20% |
| Children | 10% |
| Emergency Fund | 10% |
| Savings | 10% |
| Investment | 10% |
| Entertainment & Travel | 5% |

## Technology

- **Frontend:** Angular 21, TypeScript, Angular Router, Reactive Forms, and
  Angular CLI unit tests with Vitest.
- **Backend:** ASP.NET Core 8 Web API, C#, and Entity Framework Core 8.
- **Database:** SQLite, with EF Core migrations applied when the API starts.
- **Currency:** whole Vietnamese dong (VND).

## Repository Layout

```text
backend/
  FamilyFinance.Api/   ASP.NET Core API
  FamilyFinance.sln    Backend solution
frontend/
  src/app/             Angular application and features
  src/tests/unit/      Frontend unit tests
docs/
  requirements/        Feature requirements
  design/              Frontend, backend, and architecture specifications
  dev/                 Development plans and task lists
  testing/             Test strategy and feature test cases
  knowledge/           Domain rules
```

## Prerequisites

- Node.js 24.x (recommended for the current Angular and test dependencies).
- npm 10 or later.
- .NET 8 SDK.

Check the installed tools:

```bash
node --version
npm --version
dotnet --version
```

## Run Locally

Start the API in one terminal:

```bash
cd backend/FamilyFinance.Api
dotnet restore
dotnet run
```

The development launch profile listens at `https://localhost:54535` and
`http://localhost:54536`. Swagger UI is available at
`https://localhost:54535/swagger` while the API is running in Development.
The frontend's development environment is configured to call the HTTPS API.
If the local HTTPS certificate is not trusted, configure the .NET development
certificate with `dotnet dev-certs https --trust`.

Then start the Angular app in another terminal:

```bash
cd frontend
npm ci
npm start
```

Open [http://localhost:4200](http://localhost:4200). The API applies pending
EF Core migrations at startup and uses the SQLite connection string in
`backend/FamilyFinance.Api/appsettings.json` (`family-finance.db`). Keep the
database file if you need to preserve local data.

## API Overview

The API is versioned under `/api/v1`:

| Area | Routes |
| --- | --- |
| Authentication | `POST /api/v1/auth/signup`, `POST /api/v1/auth/signin` |
| Plans and defaults | `GET /api/v1/budget-plans/default-jars`, `GET /api/v1/budget-plans`, `POST /api/v1/budget-plans` |
| Plan details | `GET /api/v1/budget-plans/{year}/{month}`, `DELETE /api/v1/budget-plans/{year}/{month}` |
| Dashboard and spending | `GET /api/v1/budget-plans/{year}/{month}/dashboard`, `GET /api/v1/budget-plans/{year}/{month}/spending-by-jars` |
| Expenses | `POST /api/v1/budget-plans/expenses` |

See the [backend design specifications](docs/design/spec-f1-f2-backend.md)
and [frontend design specifications](docs/design/spec-f1-f2-frontend.md) for
request and response contracts.

## Build, Test, and Format

Frontend commands (run from `frontend/`):

```bash
npm run build
npm test
npm run test:coverage
npm run format
```

`npm run test:coverage` runs the Angular/Vitest suite with coverage for the
frontend source. Coverage output is written under `frontend/coverage/`.
`npm run format` runs Prettier across the frontend directory.

Backend build (run from `backend/FamilyFinance.Api/`):

```bash
dotnet build
```

The current backend solution contains the API project; a separate backend test
project is not configured yet.

## Project Documentation

- [Product brief](docs/product-brief.md)
- [Domain rules](docs/knowledge/domain.md)
- [Requirements](docs/requirements/)
- [Design specifications](docs/design/)
- [Development plans and tasks](docs/dev/)
- [Testing strategy and test cases](docs/testing/)
- [Demo flow](docs/demo.md)

The production frontend environment currently expects the API to be available
at the same origin (for example, through hosting rewrites). Update the
environment configuration and deployment routing together if that assumption
changes.
