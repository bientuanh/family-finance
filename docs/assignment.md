# Family Finance Management — Angular Frontend

Training assignment | Junior & Senior Developers | Frontend only

Github: https://github.com/lhpchihung/angular-training-assignment/tree/main

## 1. Assignment Overview

Build a working Angular frontend for a family monthly budget application. The trainer supplies HTML/CSS templates, a running ASP.NET Core REST API, and documentation. Students implement components, routing, forms, API integration, and user-interface states.

## 2. Learning Objectives

Understand user stories, acceptance criteria, domain rules, and API contracts.
Convert static HTML into maintainable standalone Angular components.
Implement Angular Router, reactive forms, validation, HttpClient services and typed models.
Display server data and manage loading, empty, success and error states.
Apply component reuse, separation of concerns and basic accessibility.

## 3. Materials Provided by Trainer

| Material | Student usage |
|---|---|
| HTML / CSS templates | Visual references; convert static markup into Angular templates. |
| Running REST API | Connect to existing endpoints; no backend or database implementation. |
| docs/requirements | Read F1, F2, F3 and F5 user stories and acceptance criteria. |
| docs/development | Follow frontend and backend API specifications. |
| docs/knowledge/domain.md | Understand seven jars and finance business rules. |
| docs/design/architecture.md | Understand frontend–API responsibilities. |

## 4. Functional Requirements

### F1 — Monthly Planning (Required)

Route: /monthly-planning.

Select year and month; enter a positive whole-VND monthly income.
Load the seven read-only default jars from API.
Validate required inputs and prevent duplicate submissions.

POST the plan; on success navigate to /monthly-plans/:year/:month.
Show an understandable conflict message if a plan already exists for that month.

### F2 — Income Allocation (Required)

Route: /monthly-plans/:year/:month.

Load an existing monthly plan.
Display income and seven jar names, allocation percentages and backend-calculated budgets.
Show loading, missing-plan navigation, and retry/error states.
Do not calculate or modify financial allocations in the frontend.

### F3 — Add Expense (Required)

Route: /expenses/new.

Provide date, jar, amount and description fields.
Load the plan for the selected expense date; populate jar options only from that plan.
Validate positive whole-VND amount, required jar/date, and non-empty description.
Create one expense via API; disable repeat submissions while saving.
On success show confirmation and server-returned spent/remaining summary. Preserve entered values on error.

### Spending by Jar (Required read-only view)

Route: /monthly-plans/:year/:month/spending.

Call the spending-by-jars API once and render all seven jars in returned order.
Display planned budget, spent budget and percentage used with progress bars.
Show 0% when no expenses exist; visually distinguish over-budget values above 100%.
Handle missing plans, loading and API failure.

Scope note: The supplied files named spec-f5-frontend/backend describe the F4 read-only Spending by Jar API. The F5 user story describes a broader dashboard. Full dashboard aggregation and expense edit/delete are not mandatory without additional contracts.

## 5. API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/budget-plans/default-jars` | Load F1 jar defaults |
| POST | `/api/v1/budget-plans` | Create monthly plan |
| GET | `/api/v1/budget-plans/{year}/{month}` | Load F2 plan and F3 jar options |
| POST | `/api/v1/budget-plans/expenses/` | Create an expense |
| GET | `/api/v1/budget-plans/{year}/{month}/spending-by-jars` | Read spending progress |

API models: monthlyIncomeVnd, budgetVnd, amountVnd, plannedBudgetVnd and spentBudgetVnd are digit-only VND strings; do not use floating-point arithmetic for financial calculations. F3 remainingVnd may be negative.Follow the exact response DTOs and error envelopes in the supplied development specifications.

## 6. Business Rules

| Jar | Rate |
|---|---:|
| Living Expenses | 35% |
| Food | 20% |
| Children | 10% |
| Emergency Fund | 10% |
| Savings | 10% |
| Investment | 10% |
| Entertainment & Travel | 5% |
| **TOTAL** | **100%** |

Exactly one monthly plan per year and month.
Income and expense amounts must be positive for the whole VND.
Every expense belongs to exactly one jar in the plan derived from its date.
The backend is authoritative for allocation, spent, remaining and percentages.
Overspending is allowed; percentage used may exceed 100% and remaining may be negative.

## 7. Suggested Angular Structure

src/app/core/services/budget-plan-api.service.ts
src/app/shared/components/{header,sidebar,loading,jar-card}/
src/app/features/{monthly-planning,income-allocation,expenses,spending-by-jar}/
src/app/models/{budget-plan.model.ts,expense.model.ts}
src/app/app.routes.ts

Students may choose a different structure if responsibilities remain clear. Page components coordinate routing and data; presentation components display reusable UI; services own HTTP calls.

## 8. Acceptance Checklist

[ ] Static HTML has been converted into working Angular templates/components.

[ ] Angular routes and navigation work across feature pages.

[ ] Typed HttpClient services integrate all required APIs.

[ ] F1 and F3 forms validate inputs and prevent duplicate submissions.

[ ] F2 and spending screens display backend data without hardcoded monetary totals.

[ ] Loading, 404, validation, conflict and general error states are handled.

[ ] After adding an expense, refreshed spending data reflects the saved record.

[ ] VND formatting, zero spending and over-budget display work correctly.

[ ] Unit Test coverage at least 80%

## 9. Evaluation Rubric (Proposed)

| Criteria | Weight |
|---|---:|
| Component architecture and code structure | 25% |
| API integration and data binding | 30% |
| Forms and validation | 15% |
| Routing and navigation | 10% |
| UI states and error handling | 10% |
| Code quality and reusability | 10% |

Junior focus: core components, routing, forms and working API calls. Senior focus: reusable component boundaries, typed contracts, state ownership, resilience, accessibility and maintainability.

## 10. Deliverables

Angular frontend source code.
README with prerequisites, API base URL setup, installation and run commands.
Short demonstration: create plan → view allocations → add expense → view spending.
