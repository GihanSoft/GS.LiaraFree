namespace GS.LiaraFree.Main.Features.Admin;

internal static class Constants
{
    public const string Owner = "OWNER";
    public const string Admin = "ADMIN";

    public const string AdminAuthPolicy = Admin;
    public const string OwnerAuthPolicy = Owner;

    public const string AdminClaimType = Admin;

    public static string TrueAsString => string.Intern(true.ToString().ToUpperInvariant());
}
