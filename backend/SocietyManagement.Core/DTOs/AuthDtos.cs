using System.ComponentModel.DataAnnotations;

namespace SocietyManagement.Core.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterResidentRequest
{
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    public string SocietyCode { get; set; } = string.Empty; // Used to identify the tenant
    
    [Required]
    public string FlatNumber { get; set; } = string.Empty;
}

public class SocietyOnboardingRequest
{
    [Required]
    public string SocietyName { get; set; } = string.Empty;
    
    [Required]
    public string Domain { get; set; } = string.Empty;
    
    [Required]
    public string AdminFirstName { get; set; } = string.Empty;
    
    [Required]
    public string AdminLastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string AdminEmail { get; set; } = string.Empty;
    
    [Required]
    public string AdminPassword { get; set; } = string.Empty;
    
    public List<string> SelectedModuleIds { get; set; } = new List<string>();
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? TenantId { get; set; }
}
