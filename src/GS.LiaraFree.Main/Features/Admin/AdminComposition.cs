using GS.LiaraFree.Main.Features.Admin.Dashboard;

namespace GS.LiaraFree.Main.Features.Admin;

internal static class AdminComposition
{
    extension(IEndpointRouteBuilder app)
    {
        public void MapAdmin()
        {
            var group = app.MapGroup("admin");
            group.MapDashboard();
        }
    }
}
