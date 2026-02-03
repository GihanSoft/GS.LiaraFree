using GS.LiaraFree.Main.Features.Admin.Dashboard;
using GS.LiaraFree.Main.Features.Admin.Ownership;

namespace GS.LiaraFree.Main.Features.Admin;

internal static class AdminFeature
{
    extension(WebApplicationBuilder builder)
    {
        public void AddAdminFeature()
        {
            builder.Services.AddAuthorizationBuilder().AddPolicy(
                Constants.AdminAuthPolicy,
                b => b.RequireClaim(Constants.Admin, [Constants.TrueAsString]));
            builder.AddOwnershipFeature();
        }
    }

    extension(IEndpointRouteBuilder app)
    {
        public void MapAdminFeature()
        {
            var group = app.MapGroup("admin");
            group.MapOwnershipFeature();
            group.MapDashboard();
        }
    }
}
