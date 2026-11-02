namespace FamilyFinance.Api.DTOs;

public class PlannedMonthsResponse
{
    public List<PlannedMonthResponse> Months { get; set; } = [];
}

public class PlannedMonthResponse
{
    public int Year { get; set; }
    public int Month { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
