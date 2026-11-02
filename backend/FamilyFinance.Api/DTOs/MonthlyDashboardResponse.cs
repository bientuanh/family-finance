namespace FamilyFinance.Api.DTOs;

public sealed record MonthlyDashboardResponse(
    int Year,
    int Month,
    string Currency,
    string MonthlyIncomeVnd,
    string TotalSpentVnd,
    string RemainingVnd,
    decimal OverallProgressPercentage,
    IReadOnlyList<DashboardJarPerformanceResponse> Jars);

public sealed record DashboardJarPerformanceResponse(
    string JarType,
    string JarName,
    int AllocationPercentage,
    string BudgetVnd,
    string SpentVnd,
    string RemainingVnd,
    decimal ProgressPercentage);
