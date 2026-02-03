using GS.LiaraFree.Main.Shared.Data;
using GS.LiaraFree.Main.Shared.Functional;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace GS.LiaraFree.Main.Features.Admin.Dashboard;

internal static class DashboardComposition
{
    extension(IEndpointRouteBuilder app)
    {
        public void MapDashboard()
        {
            var group = app.MapGroup("dashboard").RequireAuthorization([Constants.AdminAuthPolicy]);
            group.MapGet("/", GetDashboardAsync);
        }
    }

    private static async ValueTask<Ok<DashboardModel>> GetDashboardAsync(DefaultDbContext db, CancellationToken ct)
    {
        var dto = new DashboardModel
        (
            TotalMembers: new StatCard(Value: await db.Users.CountAsync(ct) >> Convert.ToString),
            Members: await db.Users
                .Select(a => new Member(Id: a.Id, Username: a.UserName, Email: a.Email, EmailConfirmed: a.EmailConfirmed))
                .Take(1000)
                .ToListAsync(ct)
        );
        return TypedResults.Ok(dto);
    }

    private sealed record StatCard(string Value);
    private sealed record Member(string Id, string? Username, string? Email, bool EmailConfirmed);
    private sealed record DashboardModel(StatCard TotalMembers, object Members);
}

/*
[JsonConverter(typeof(JsonStringEnumConverter<StatCardTrendDirection>))]
internal enum StatCardTrendDirection
{
    [JsonStringEnumMemberName("up")] Up,
    [JsonStringEnumMemberName("down")] Down,
    [JsonStringEnumMemberName("neutral")] Neutral
}

internal sealed record StatCardTrend(string Value, StatCardTrendDirection Direction, string? Label = null);
*/
