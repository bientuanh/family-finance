using System.Net.Mail;
using FamilyFinance.Api.Data;
using FamilyFinance.Api.DTOs;
using FamilyFinance.Api.Models;
using FamilyFinance.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace FamilyFinance.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController(ApplicationDbContext db) : ControllerBase
{
    [HttpPost("signup")]
    public async Task<ActionResult<AuthResponse>> SignUp(SignUpRequest request)
    {
        var errors = ValidateSignUpRequest(request, out var familyName, out var email, out var password);
        if (errors.Count > 0)
        {
            return BadRequest(ValidationResponse(errors));
        }

        var normalizedEmail = NormalizeEmail(email!);
        if (await db.UserAccounts.AnyAsync(user => user.EmailNormalized == normalizedEmail))
        {
            return Conflict(AccountAlreadyExistsResponse());
        }

        var salt = PasswordHasher.GenerateSalt();
        var passwordHash = PasswordHasher.Hash(password!, salt);

        var userAccount = new UserAccount
        {
            FamilyName = familyName!,
            Email = email!,
            EmailNormalized = normalizedEmail,
            PasswordSalt = salt,
            PasswordHash = passwordHash,
            CreatedAtUtc = DateTime.UtcNow
        };

        db.UserAccounts.Add(userAccount);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (IsEmailUniquenessViolation(exception))
        {
            return Conflict(AccountAlreadyExistsResponse());
        }

        return Created($"/api/v1/auth/users/{userAccount.Id}", Map(userAccount));
    }

    [HttpPost("signin")]
    public async Task<ActionResult<AuthResponse>> SignIn(SignInRequest request)
    {
        var errors = ValidateSignInRequest(request, out var email, out var password);
        if (errors.Count > 0)
        {
            return BadRequest(ValidationResponse(errors));
        }

        var normalizedEmail = NormalizeEmail(email!);
        var userAccount = await db.UserAccounts.SingleOrDefaultAsync(user => user.EmailNormalized == normalizedEmail);
        if (userAccount is null || !PasswordHasher.Verify(password!, userAccount.PasswordSalt, userAccount.PasswordHash))
        {
            return Unauthorized(new ApiErrorResponse
            {
                Code = "INVALID_CREDENTIALS",
                Message = "Email or password is incorrect."
            });
        }

        return Ok(Map(userAccount));
    }

    private static List<ApiFieldError> ValidateSignUpRequest(
        SignUpRequest request,
        out string? familyName,
        out string? email,
        out string? password)
    {
        var errors = new List<ApiFieldError>();
        familyName = request.FamilyName?.Trim();
        email = request.Email?.Trim();
        password = request.Password;

        if (string.IsNullOrEmpty(familyName))
        {
            errors.Add(new ApiFieldError
            {
                Field = "familyName",
                Code = "REQUIRED",
                Message = "Family name is required."
            });
        }
        else if (familyName.Length > 120)
        {
            errors.Add(new ApiFieldError
            {
                Field = "familyName",
                Code = "TOO_LONG",
                Message = "Family name must not exceed 120 characters."
            });
        }

        AddEmailErrors(email, errors);
        AddPasswordErrors(password, errors);
        return errors;
    }

    private static List<ApiFieldError> ValidateSignInRequest(
        SignInRequest request,
        out string? email,
        out string? password)
    {
        var errors = new List<ApiFieldError>();
        email = request.Email?.Trim();
        password = request.Password;

        AddEmailErrors(email, errors);
        AddPasswordErrors(password, errors);
        return errors;
    }

    private static void AddEmailErrors(string? email, List<ApiFieldError> errors)
    {
        if (string.IsNullOrEmpty(email))
        {
            errors.Add(new ApiFieldError
            {
                Field = "email",
                Code = "REQUIRED",
                Message = "Email is required."
            });
            return;
        }

        if (email.Length > 320)
        {
            errors.Add(new ApiFieldError
            {
                Field = "email",
                Code = "TOO_LONG",
                Message = "Email must not exceed 320 characters."
            });
            return;
        }

        try
        {
            var parsedAddress = new MailAddress(email);
            if (!string.Equals(parsedAddress.Address, email, StringComparison.OrdinalIgnoreCase))
            {
                errors.Add(new ApiFieldError
                {
                    Field = "email",
                    Code = "INVALID_VALUE",
                    Message = "Email is invalid."
                });
            }
        }
        catch (FormatException)
        {
            errors.Add(new ApiFieldError
            {
                Field = "email",
                Code = "INVALID_VALUE",
                Message = "Email is invalid."
            });
        }
    }

    private static void AddPasswordErrors(string? password, List<ApiFieldError> errors)
    {
        if (string.IsNullOrEmpty(password))
        {
            errors.Add(new ApiFieldError
            {
                Field = "password",
                Code = "REQUIRED",
                Message = "Password is required."
            });
            return;
        }

        if (password.Length < 8 || password.Length > 128)
        {
            errors.Add(new ApiFieldError
            {
                Field = "password",
                Code = "OUT_OF_RANGE",
                Message = "Password length must be between 8 and 128 characters."
            });
        }

        if (!password.Any(char.IsLetter) || !password.Any(char.IsDigit))
        {
            errors.Add(new ApiFieldError
            {
                Field = "password",
                Code = "INVALID_VALUE",
                Message = "Password must include at least one letter and one digit."
            });
        }
    }

    private static string NormalizeEmail(string email) => email.Trim().ToUpperInvariant();

    private static ApiErrorResponse ValidationResponse(List<ApiFieldError> errors) => new()
    {
        Code = "VALIDATION_ERROR",
        Message = "One or more fields are invalid.",
        Errors = errors
    };

    private static ApiErrorResponse AccountAlreadyExistsResponse() => new()
    {
        Code = "ACCOUNT_ALREADY_EXISTS",
        Message = "An account already exists with this email address."
    };

    private static bool IsEmailUniquenessViolation(DbUpdateException exception) =>
        exception.InnerException is SqliteException { SqliteExtendedErrorCode: 2067 } sqliteException &&
        sqliteException.Message.Contains("UserAccounts.EmailNormalized", StringComparison.OrdinalIgnoreCase);

    private static AuthResponse Map(UserAccount userAccount) => new()
    {
        UserId = userAccount.Id,
        FamilyName = userAccount.FamilyName,
        Email = userAccount.Email
    };
}
