using GS.LiaraFree.Main.Shared.Data;

using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Security;

internal static class SecurityComposition
{
    public static IServiceCollection AddSecurity(this IServiceCollection services)
    {
        services.AddAuthentication();
        services.AddAuthorization();

        services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<DefaultDbContext>();
        return services;
    }

    public static IEndpointRouteBuilder MapSecurity(this IEndpointRouteBuilder app)
    {
        var securityGroup = app.MapGroup("security");
        securityGroup.MapIdentityApi<IdentityUser>();
        return app;
    }
}
