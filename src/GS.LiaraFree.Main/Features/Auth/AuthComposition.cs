using GS.LiaraFree.Main.Shared.Data;

using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Auth;

internal static class AuthComposition
{
    public static IServiceCollection AddAuth(this IServiceCollection services)
    {
        services.AddAuthentication();
        services.AddAuthorization();

        services.AddIdentityApiEndpoints<IdentityUser>(
            opt =>
            {
                opt.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<DefaultDbContext>()
            .Services
            .AddScoped<UserManager<IdentityUser>, AspNetUserManager<IdentityUser>>()
            .AddSingleton<IEmailSender<IdentityUser>, AuthEmailSender>()
            ;
        return services;
    }

    public static IEndpointRouteBuilder MapAuth(this IEndpointRouteBuilder app)
    {
        var authGroup = app.MapGroup("auth");
        authGroup.MapIdentityApi<IdentityUser>();
        authGroup.MapPost("/logout", (SignInManager<IdentityUser> signInManager) => signInManager.SignOutAsync());
        return app;
    }
}
