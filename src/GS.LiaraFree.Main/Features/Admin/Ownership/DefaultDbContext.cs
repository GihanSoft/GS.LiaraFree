using GS.LiaraFree.Main.Features.Admin.Ownership;

using Microsoft.EntityFrameworkCore;

namespace GS.LiaraFree.Main.Shared.Data;

internal partial class DefaultDbContext
{
    public DbSet<SystemOwnership> Ownerships => Set<SystemOwnership>();
}
