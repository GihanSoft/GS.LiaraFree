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

        var loggerFactory = httpContext.RequestServices.GetRequiredService<ILoggerFactory>();
        var logger = loggerFactory.CreateLogger<IdentitySignOutHttpResult<TUser>>();

        if (logger.IsEnabled(LogLevel.Information))
        {
            SignOutResultExecuting(logger);
        }

        var signInManager = httpContext.RequestServices.GetRequiredService<SignInManager<TUser>>();
        await signInManager.SignOutAsync();
    }

    [LoggerMessage(1, LogLevel.Information,
        "Executing IdentitySignOutResult.",
        EventName = "IdentitySignOutResultExecuting",
        SkipEnabledCheck = true)]
    private static partial void SignOutResultExecuting(ILogger logger);
}

internal static class HttpTypedResultExtensions
{
    extension(TypedResults)
    {
        public static IdentitySignOutHttpResult<TUser> IdentitySignOut<TUser>() where TUser : class => new();
    }
}

internal static class HttpdResultExtensions
{
    extension(Results)
    {
        public static IResult IdentitySignOut<TUser>() where TUser : class => new IdentitySignOutHttpResult<TUser>();
    }
}
