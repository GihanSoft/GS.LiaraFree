using System.Security.Claims;
using System.Threading.RateLimiting;

using GS.LiaraFree.Main.Features.Auth;
using GS.LiaraFree.Main.Shared.Data;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

using Npgsql;

namespace GS.LiaraFree.Main.Features.Admin.Ownership;

internal static class OwnershipFeature
{
    private const string _ownershipRateLimiterPolicy = "OWNERSHIP";
    private const string _ownerClaim = Constants.Owner;

    public static void AddOwnershipFeature(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthorizationBuilder().AddPolicy(
            Constants.OwnerAuthPolicy,
            b => b.RequireClaim(Constants.Owner, Constants.TrueAsString));

        builder.Services.AddRateLimiter(opt =>
        {
            opt.AddPolicy(_ownershipRateLimiterPolicy, ctx =>
            {
                var partitionKey = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? ctx.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown";

                return RateLimitPartition.Get(
                    partitionKey,
                    _ => RateLimiter.CreateChained([
                        new ConcurrencyLimiter(new ConcurrencyLimiterOptions { PermitLimit = 1, QueueLimit = 0 }),
                        new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10)})
                    ])
                );
            });
        });
    }

    public static void MapOwnershipFeature(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("ownership")
            .RequireRateLimiting(_ownershipRateLimiterPolicy);

        group.MapPost("/", ClaimAsync);
        group.MapPut("/", TransferAsync)
             .RequireAuthorization(Constants.OwnerAuthPolicy);
    }

    private static async ValueTask<IResult> ClaimAsync(
        HttpContext ctx,
        TimeProvider timeProvider,
        DefaultDbContext db,
        UserManager<IdentityUser> userManager,
        CancellationToken ct)
    {
        var user = await userManager.GetUserAsync(ctx.User);
        if (user is null)
        {
            return TypedResults.Unauthorized();
        }

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async Task<IResult> (ct) =>
        {
            try
            {
                var ownership = SystemOwnership.CreateFirstOwner(user.Id, timeProvider);
                await db.Set<SystemOwnership>().AddAsync(ownership, ct);

                await EnsureClaimAsync(db, user.Id, _ownerClaim, Constants.TrueAsString, ct);
                await EnsureClaimAsync(db, user.Id, Constants.AdminClaimType, Constants.TrueAsString, ct);

                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (ex.IsUniqueViolation())
            {
                return TypedResults.Conflict("System already has an owner.");
            }

            await userManager.UpdateSecurityStampAsync(user);
            return TypedResults.IdentityRefreshSignIn(user);
        }, ct);
    }

    private static async ValueTask<IResult> TransferAsync(
        HttpContext ctx,
        TimeProvider timeProvider,
        DefaultDbContext db,
        UserManager<IdentityUser> userManager,
        string newOwnerUserId,
        CancellationToken ct)
    {
        var currentUser = await userManager.GetUserAsync(ctx.User);
        if (currentUser is null)
        {
            return TypedResults.Unauthorized();
        }

        if (currentUser.Id == newOwnerUserId)
        {
            return TypedResults.NoContent();
        }

        var newOwner = await userManager.FindByIdAsync(newOwnerUserId);
        if (newOwner is null)
        {
            return TypedResults.BadRequest("Target user not found.");
        }

        var currentOwnership = await db.Ownerships.AsTracking().FirstOrDefaultAsync(a => a.IsCurrentOwner == true, ct);

        if (currentOwnership is null || currentOwnership.UserId != currentUser.Id)
        {
            return TypedResults.Forbid();
        }

        var strategy = db.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async Task<IResult> (ct) =>
        {

            try
            {
                var newOwnership = currentOwnership.TransferOwnership(newOwnerUserId, timeProvider);
                await db.Ownerships.AddAsync(newOwnership, ct);

                var oldClaims = await db.UserClaims.Where(c => c.UserId == currentUser.Id && c.ClaimType == _ownerClaim).ToListAsync(ct);
                if (oldClaims is not [])
                {
                    db.UserClaims.RemoveRange(oldClaims);
                }

                await EnsureClaimAsync(db, newOwner.Id, _ownerClaim, Constants.TrueAsString, ct);
                await EnsureClaimAsync(db, newOwner.Id, Constants.AdminClaimType, Constants.TrueAsString, ct);

                await db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException ex) when (ex.IsUniqueViolation())
            {
                return TypedResults.Conflict("Ownership updated concurrently.");
            }

            await userManager.UpdateSecurityStampAsync(newOwner);
            await userManager.UpdateSecurityStampAsync(currentUser);

            return TypedResults.IdentityRefreshSignIn(currentUser);
        }, ct);
    }

    private static async ValueTask EnsureClaimAsync(DefaultDbContext db, string userId, string type, string value, CancellationToken ct)
    {
        if (await db.UserClaims.AnyAsync(c => c.UserId == userId && c.ClaimType == type && c.ClaimValue == value, ct) == false)
        {
            await db.UserClaims.AddAsync(new IdentityUserClaim<string> { UserId = userId, ClaimType = type, ClaimValue = value }, ct);
        }
    }
}

internal static class DbExceptionExtensions
{
    public static bool IsUniqueViolation(this DbUpdateException ex)
        => ex.InnerException is PostgresException pg && pg.SqlState == PostgresErrorCodes.UniqueViolation;
}
