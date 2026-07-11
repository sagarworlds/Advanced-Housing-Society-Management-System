using System.ComponentModel.DataAnnotations;

namespace SocietyManagement.Core.DTOs;

public class FlatRequest
{
    [Required]
    public string Block { get; set; } = string.Empty;

    [Required]
    public string FlatNumber { get; set; } = string.Empty;

    public int Floor { get; set; }

    public string FlatType { get; set; } = "2BHK";

    [Required]
    public string OwnerName { get; set; } = string.Empty;

    public string OwnerPhone { get; set; } = string.Empty;

    [EmailAddress]
    public string OwnerEmail { get; set; } = string.Empty;

    public string OccupancyStatus { get; set; } = "Owner";

    [Range(1, 100000)]
    public decimal MaintenanceAreaSqFt { get; set; }
}
