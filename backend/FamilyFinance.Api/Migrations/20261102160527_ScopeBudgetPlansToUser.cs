using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FamilyFinance.Api.Migrations
{
    /// <inheritdoc />
    public partial class ScopeBudgetPlansToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BudgetPlans_Year_Month",
                table: "BudgetPlans");

            migrationBuilder.AddColumn<int>(
                name: "UserAccountId",
                table: "BudgetPlans",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BudgetPlans_UserAccountId_Year_Month",
                table: "BudgetPlans",
                columns: new[] { "UserAccountId", "Year", "Month" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetPlans_UserAccounts_UserAccountId",
                table: "BudgetPlans",
                column: "UserAccountId",
                principalTable: "UserAccounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetPlans_UserAccounts_UserAccountId",
                table: "BudgetPlans");

            migrationBuilder.DropIndex(
                name: "IX_BudgetPlans_UserAccountId_Year_Month",
                table: "BudgetPlans");

            migrationBuilder.DropColumn(
                name: "UserAccountId",
                table: "BudgetPlans");

            migrationBuilder.CreateIndex(
                name: "IX_BudgetPlans_Year_Month",
                table: "BudgetPlans",
                columns: new[] { "Year", "Month" },
                unique: true);
        }
    }
}
