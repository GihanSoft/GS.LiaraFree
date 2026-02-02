using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Auth;

/// <summary>
/// An <see cref="IResult"/> that on execution invokes <see cref="SignInManager{TUser}.RefreshSignInAsync(TUser)"/>.
/// </summary>
internal sealed partial class IdentityRefreshSignInResult<TUser>(TUser _user) : IResult
    where TUser : class
{
    private readonly TUser _user = _user;

    /// <inheritdoc />
    public async Task ExecuteAsync(HttpContext httpContext)
    {
        ArgumentNullException.ThrowIfNull(httpContext);

        var signInManager = httpContext.RequestServices.GetRequiredService<SignInManager<TUser>>();
        await signInManager.RefreshSignInAsync(_user);
    }
}

internal static partial class HttpTypedResultExtensions
{
    extension(TypedResults)
    {
        public static IdentityRefreshSignInResult<TUser> IdentityRefreshSignIn<TUser>(TUser _user) where TUser : class => new(_user);
    }
}

internal static partial class HttpdResultExtensions
{
    extension(Results)
    {
        public static IResult IdentityRefreshSignIn<TUser>(TUser _user) where TUser : class => new IdentityRefreshSignInResult<TUser>(_user);
    }
}
