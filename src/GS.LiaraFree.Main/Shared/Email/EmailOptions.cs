using System.ComponentModel.DataAnnotations;

namespace GS.LiaraFree.Main.Shared.Email;

internal sealed class EmailOptions
{
    public const string SectionName = "Email";

    [Required(AllowEmptyStrings = false, ErrorMessage = "A default 'From' email address is required.")]
    [EmailAddress]
    public string DefaultFromEmail { get; set; } = "";
}
