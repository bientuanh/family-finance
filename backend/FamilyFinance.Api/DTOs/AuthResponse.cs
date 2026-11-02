namespace FamilyFinance.Api.DTOs;

public class AuthResponse
{
    public int UserId { get; set; }
    public string FamilyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
