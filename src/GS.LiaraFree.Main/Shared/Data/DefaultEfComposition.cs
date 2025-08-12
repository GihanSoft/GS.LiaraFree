using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace GS.LiaraFree.Main.Shared.Data;

internal static class DefaultEfComposition
{
    public static IServiceCollection AddDefaultEf(this IServiceCollection services)
    {
        services.AddDbContextPool<DefaultDbContext>(ConfigureOptionsBuilder);
        return services;
    }

    private static void ConfigureOptionsBuilder(IServiceProvider sp, DbContextOptionsBuilder builder)
    {
        var configuration = sp.GetRequiredService<IConfiguration>();
        var environment = sp.GetRequiredService<IHostEnvironment>();

        var connectionString = configuration.GetConnectionString("default");
        builder.UseNpgsql(connectionString, opt =>
        {
            opt.MigrationsHistoryTable("__ef_migrations_history");
        });

        builder.UseSnakeCaseNamingConvention();
        builder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

        builder.ConfigureWarnings(opt =>
        opt.Log([
            (CoreEventId.FirstWithoutOrderByAndFilterWarning, LogLevel.Warning),
            (CoreEventId.RowLimitingOperationWithoutOrderByWarning, LogLevel.Warning),
            (CoreEventId.DistinctAfterOrderByWithoutRowLimitingOperatorWarning, LogLevel.Warning),
        ]));

        if (environment.IsDevelopment())
        {
            builder.EnableDetailedErrors();
            builder.EnableSensitiveDataLogging();
        }
    }
}
