using System.Security.Cryptography;

namespace FamilyFinance.Api.Services;

public static class PasswordHasher
{
    private const int SaltLength = 16;
    private const int HashLength = 32;
    private const int Iterations = 100_000;

    public static byte[] GenerateSalt() => RandomNumberGenerator.GetBytes(SaltLength);

    public static byte[] Hash(string password, byte[] salt) =>
        Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashLength);

    public static bool Verify(string password, byte[] salt, byte[] expectedHash)
    {
        var hashedPassword = Hash(password, salt);
        return CryptographicOperations.FixedTimeEquals(hashedPassword, expectedHash);
    }
}
