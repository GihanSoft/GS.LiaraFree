using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GS.LiaraFree.Main.Features.Admin.Ownership;

internal sealed class SystemOwnership
{
    private SystemOwnership(Guid id, string userId, string assignedBy, bool? isCurrentOwner, DateTime startMoment, DateTime? endMoment)
    {
        Id = id;
        UserId = userId;
        AssignedBy = assignedBy;
        IsCurrentOwner = isCurrentOwner;
        StartMoment = startMoment;
        EndMoment = endMoment;
    }

    public Guid Id { get; private init; }
    public string UserId { get; private init; }
    public string AssignedBy { get; private init; }
    public bool? IsCurrentOwner { get; private set; }
    public DateTime StartMoment { get; private init; }
    public DateTime? EndMoment { get; private set; }

    public SystemOwnership TransferOwnership(string newOwnerUserId, TimeProvider timeProvider)
    {
        if (IsCurrentOwner != true)
        {
            throw new InvalidOperationException("this is not current owner");
        }

        var utcNow = timeProvider.GetUtcNow().UtcDateTime;

        IsCurrentOwner = null;
        EndMoment = utcNow;
        return new SystemOwnership(
            Guid.CreateVersion7(),
            newOwnerUserId,
            UserId,
            true,
            utcNow,
            null);
    }

    public static SystemOwnership CreateFirstOwner(string userId, TimeProvider timeProvider) => new(
        Guid.CreateVersion7(),
        userId,
        userId,
        true,
        timeProvider.GetUtcNow().UtcDateTime,
        null);
}

internal sealed class AppOwnershipConfig : IEntityTypeConfiguration<SystemOwnership>
{
    public void Configure(EntityTypeBuilder<SystemOwnership> builder)
    {
        builder.ToTable("system_ownership", "admin");

        builder.HasIndex(a => a.IsCurrentOwner).IsUnique();

        builder.Property(a => a.UserId).HasMaxLength(36);
        builder.Property(a => a.AssignedBy).HasMaxLength(36);
        builder.Property(a => a.IsCurrentOwner);
    }
}
