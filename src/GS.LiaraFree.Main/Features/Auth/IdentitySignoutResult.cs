using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Auth;

/// <summary>
/// An <see cref="IResult"/> that on execution invokes <see cref="SignInManager{TUser}.SignOutAsync"/>.
/// </summary>
internal sealed partial class IdentitySignOutHttpResult<TUser> : IResult
    where TUser : class
{
    /// <inheritdoc />
    public async Task ExecuteAsync(HttpContext httpContext)
    {
        ArgumentNullException.ThrowIfNull(httpContext);

        var signInManager = httpContext.RequestServices.GetRequiredService<SignInManager<TUser>>();
        await signInManager.SignOutAsync();
    }
}

internal static partial class HttpTypedResultExtensions
{
    extension(TypedResults)
    {
        public static IdentitySignOutHttpResult<TUser> IdentitySignOut<TUser>() where TUser : class => new();
    }
}

internal static partial class HttpdResultExtensions
{
    extension(Results)
    {
        public static IResult IdentitySignOut<TUser>() where TUser : class => new IdentitySignOutHttpResult<TUser>();
    }
}
