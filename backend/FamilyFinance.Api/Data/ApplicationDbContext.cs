using System.Globalization;
using FamilyFinance.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FamilyFinance.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<BudgetPlan> BudgetPlans => Set<BudgetPlan>();
    public DbSet<BudgetAllocation> BudgetAllocations => Set<BudgetAllocation>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BudgetPlan>(entity =>
        {
            entity.HasKey(plan => plan.Id);
            entity.HasIndex(plan => new { plan.UserAccountId, plan.Year, plan.Month }).IsUnique();
            entity.HasMany(plan => plan.Allocations).WithOne(allocation => allocation.BudgetPlan)
                .HasForeignKey(allocation => allocation.BudgetPlanId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(plan => plan.UserAccount).WithMany(user => user.BudgetPlans)
                .HasForeignKey(plan => plan.UserAccountId).OnDelete(DeleteBehavior.Restrict);
            entity.Property(plan => plan.MonthlyIncomeVnd).HasColumnType("INTEGER");
            entity.Property(plan => plan.CreatedAtUtc).HasColumnType("TEXT");
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_BudgetPlans_Year", "\"Year\" BETWEEN 1 AND 9999");
                table.HasCheckConstraint("CK_BudgetPlans_Month", "\"Month\" BETWEEN 1 AND 12");
                table.HasCheckConstraint("CK_BudgetPlans_MonthlyIncomeVnd", "\"MonthlyIncomeVnd\" > 0");
            });
        });

        modelBuilder.Entity<BudgetAllocation>(entity =>
        {
            entity.HasKey(allocation => allocation.Id);
            entity.HasIndex(allocation => new { allocation.BudgetPlanId, allocation.JarType }).IsUnique();
            entity.Property(allocation => allocation.JarType).HasConversion(new ValueConverter<JarType, string>(
                value => value == JarType.LivingExpenses ? "livingExpenses" : value == JarType.Food ? "food" : value == JarType.Children ? "children" : value == JarType.EmergencyFund ? "emergencyFund" : value == JarType.Savings ? "savings" : value == JarType.Investment ? "investment" : "entertainmentAndTravel",
                value => value == "livingExpenses" ? JarType.LivingExpenses : value == "food" ? JarType.Food : value == "children" ? JarType.Children : value == "emergencyFund" ? JarType.EmergencyFund : value == "savings" ? JarType.Savings : value == "investment" ? JarType.Investment : JarType.EntertainmentAndTravel));
            entity.Property(allocation => allocation.PercentagePoints).HasColumnType("INTEGER");
            entity.Property(allocation => allocation.BudgetVnd).HasColumnType("INTEGER");
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_BudgetAllocations_JarType", "\"JarType\" IN ('livingExpenses', 'food', 'children', 'emergencyFund', 'savings', 'investment', 'entertainmentAndTravel')");
                table.HasCheckConstraint("CK_BudgetAllocations_PercentagePoints", "\"PercentagePoints\" BETWEEN 0 AND 100");
                table.HasCheckConstraint("CK_BudgetAllocations_BudgetVnd", "\"BudgetVnd\" >= 0");
            });
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(expense => expense.Id);
            entity.HasIndex(expense => new { expense.BudgetAllocationId, expense.ExpenseDate });
            entity.HasOne(expense => expense.BudgetAllocation).WithMany(allocation => allocation.Expenses)
                .HasForeignKey(expense => expense.BudgetAllocationId).OnDelete(DeleteBehavior.Cascade);
            entity.Property(expense => expense.ExpenseDate)
                .HasConversion(new ValueConverter<DateOnly, string>(
                    value => value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    value => DateOnly.ParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None)))
                .HasColumnType("TEXT");
            entity.Property(expense => expense.AmountVnd).HasColumnType("INTEGER");
            entity.Property(expense => expense.Description).HasMaxLength(500);
            entity.Property(expense => expense.CreatedAtUtc).HasColumnType("TEXT");
            entity.ToTable(table => table.HasCheckConstraint("CK_Expenses_AmountVnd", "\"AmountVnd\" > 0"));
        });

        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.EmailNormalized).IsUnique();
            entity.Property(user => user.FamilyName).IsRequired().HasMaxLength(120);
            entity.Property(user => user.Email).IsRequired().HasMaxLength(320);
            entity.Property(user => user.EmailNormalized).IsRequired().HasMaxLength(320);
            entity.Property(user => user.PasswordSalt).IsRequired().HasColumnType("BLOB");
            entity.Property(user => user.PasswordHash).IsRequired().HasColumnType("BLOB");
            entity.Property(user => user.CreatedAtUtc).HasColumnType("TEXT");
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_UserAccounts_FamilyName", "length(trim(\"FamilyName\")) > 0");
                table.HasCheckConstraint("CK_UserAccounts_Email", "length(trim(\"Email\")) > 0");
                table.HasCheckConstraint("CK_UserAccounts_EmailNormalized", "length(trim(\"EmailNormalized\")) > 0");
            });
        });
    }
}
