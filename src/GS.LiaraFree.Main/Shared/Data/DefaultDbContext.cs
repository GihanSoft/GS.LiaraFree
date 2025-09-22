using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GS.LiaraFree.Main.Shared.Data;

internal partial class DefaultDbContext(DbContextOptions<DefaultDbContext> options) : IdentityUserContext<IdentityUser>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(Program).Assembly);

        builder.Entity<IdentityUser>().ToTable("asp_net_users", "auth");
        builder.Entity<IdentityUserClaim<string>>().ToTable("asp_net_user_claims", "auth");
        builder.Entity<IdentityUserLogin<string>>().ToTable("asp_net_user_logins", "auth");
        builder.Entity<IdentityUserToken<string>>().ToTable("asp_net_user_tokens", "auth");
    }
}
