using GS.LiaraFree.Main.Shared.Data;

using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Security;

internal static class SecurityComposition
{
    public static IServiceCollection AddSecurity(this IServiceCollection services)
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
            .AddSingleton<IEmailSender<IdentityUser>, SecurityEmailSender>()
            ;
        return services;
    }

    public static IEndpointRouteBuilder MapSecurity(this IEndpointRouteBuilder app)
    {
        var securityGroup = app.MapGroup("security");
        securityGroup.MapIdentityApi<IdentityUser>();
        return app;
    }
}
