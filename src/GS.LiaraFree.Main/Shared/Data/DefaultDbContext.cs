using Microsoft.EntityFrameworkCore;

namespace GS.LiaraFree.Main.Shared.Data;

internal partial class DefaultDbContext(DbContextOptions<DefaultDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(Program).Assembly);
    }
}
