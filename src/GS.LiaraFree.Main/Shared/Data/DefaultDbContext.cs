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

        builder.Entity<IdentityUser>().ToTable("asp_net_users", "security");
        builder.Entity<IdentityUserClaim<string>>().ToTable("asp_net_user_claims", "security");
        builder.Entity<IdentityUserLogin<string>>().ToTable("asp_net_user_logins", "security");
        builder.Entity<IdentityUserToken<string>>().ToTable("asp_net_user_tokens", "security");
    }
}
