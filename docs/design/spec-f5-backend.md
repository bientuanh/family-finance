# F5 Monthly Dashboard - Backend Development Specification

## 1. Feature Overview

Add a read-only dashboard endpoint that returns one monthly plan's overall performance and per-jar performance in a single authoritative payload.

## 2. Endpoint

- **Method:** `GET`
- **URL:** `/api/v1/budget-plans/{year:int}/{month:int}/dashboard`

### Validation and errors

- `400 VALIDATION_ERROR` when year/month is invalid.
- `404 MONTHLY_PLAN_NOT_FOUND` when plan does not exist.
- `500 INTERNAL_ERROR` when plan allocation integrity is invalid.

## 3. Response Contract

```json
{
  "year": 2026,
  "month": 12,
  "currency": "VND",
  "monthlyIncomeVnd": "10000000",
  "totalSpentVnd": "2500000",
  "remainingVnd": "7500000",
  "overallProgressPercentage": 25.0,
  "jars": [
    {
      "jarType": "food",
      "jarName": "Food",
      "allocationPercentage": 20,
      "budgetVnd": "2000000",
      "spentVnd": "500000",
      "remainingVnd": "1500000",
      "progressPercentage": 25.0
    }
  ]
}
```

`jars` always contains the seven canonical jars in canonical order.

## 4. Calculation Rules

- `totalSpentVnd = sum(spentVnd of all jars)`
- `remainingVnd = monthlyIncomeVnd - totalSpentVnd`
- `overallProgressPercentage = round(totalSpentVnd * 100 / monthlyIncomeVnd, 2)`
- `jar.remainingVnd = jar.budgetVnd - jar.spentVnd`
- `jar.progressPercentage = round(jar.spentVnd * 100 / jar.budgetVnd, 2)`

All monetary values are backend-calculated and returned as integer strings (VND).

## 5. Persistence

- No schema or migration change.
- Reuse `BudgetPlan`, `BudgetAllocation`, and `Expense`.
