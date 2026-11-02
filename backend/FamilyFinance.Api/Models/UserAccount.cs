namespace FamilyFinance.Api.Models;

public class UserAccount
{
    public int Id { get; set; }
    public string FamilyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmailNormalized { get; set; } = string.Empty;
    public byte[] PasswordSalt { get; set; } = [];
    public byte[] PasswordHash { get; set; } = [];
    public DateTime CreatedAtUtc { get; set; }
}
