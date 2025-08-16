using GS.LiaraFree.Main.Features.Security;
using GS.LiaraFree.Main.Shared.Data;

using Microsoft.AspNetCore.HttpOverrides;

using Serilog;
using Serilog.Events;

// -----------------------------
// Configure Logging (Serilog)
// -----------------------------
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.Debug()
    .CreateBootstrapLogger();

Log.Information("Starting up!");

try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddSerilog((services, lc) => lc
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .WriteTo.Debug());

    // -----------------------------
    // Configuration
    // -----------------------------
    builder.Services.Configure<ForwardedHeadersOptions>(a =>
    {
        a.KnownNetworks.Clear();
        a.KnownProxies.Clear();
        a.ForwardedHeaders = ForwardedHeaders.All;
    });

    // -----------------------------
    // Services
    // -----------------------------
    builder.Services.AddProblemDetails();

    builder.Services.AddDefaultEf();

    builder.Services.AddSecurity();

    // -----------------------------
    // Build
    // -----------------------------
    var app = builder.Build();

    // -----------------------------
    // Middleware pipeline (order matters)
    // -----------------------------
    app.UseForwardedHeaders();
    _ = app.Environment.IsDevelopment() ? app.UseDeveloperExceptionPage() : app.UseExceptionHandler();
    _ = app.Environment.IsDevelopment() ? app : app.UseHsts();
    _ = app.Environment.IsDevelopment() ? app : app.UseHttpsRedirection();

    app.UseSerilogRequestLogging();

    app.UseRouting();
    app.UseEndpoints(_ => { });

    // -----------------------------
    // Endpoint mappings
    // -----------------------------
    app.MapSecurity();
    app.MapGet("/", () => "Hello World!");

    // -----------------------------
    // Running app
    // -----------------------------
    app.Run();
    Log.Information("Stopped cleanly");
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
