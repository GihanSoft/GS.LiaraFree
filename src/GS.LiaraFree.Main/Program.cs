using GS.LiaraFree.Main.Features.Admin;
using GS.LiaraFree.Main.Features.Admin.Ownership;
using GS.LiaraFree.Main.Features.Auth;
using GS.LiaraFree.Main.Shared.Data;
using GS.LiaraFree.Main.Shared.Email;

using Microsoft.AspNetCore.HttpOverrides;

using Serilog;
using Serilog.Events;

// -----------------------------
// Configure Logging (Serilog)
// -----------------------------
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.OpenTelemetry()
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
        .WriteTo.OpenTelemetry()
        .WriteTo.Console()
        .WriteTo.Debug());

    // -----------------------------
    // Configuration
    // -----------------------------
    builder.Services.Configure<ForwardedHeadersOptions>(a =>
    {
        a.KnownIPNetworks.Clear();
        a.KnownProxies.Clear();
        a.ForwardedHeaders = ForwardedHeaders.All;
    });

    // -----------------------------
    // Services
    // -----------------------------
    builder.AddServiceDefaults();

    builder.Services.AddProblemDetails();

    builder.AddDefaultEf();
    builder.AddEmail();

    builder.Services.AddAuth();
    builder.AddAdminFeature();

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

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseRateLimiter();

    app.UseEndpoints(_ => { });

    // -----------------------------
    // Endpoint mappings
    // -----------------------------
    app.MapDefaultEndpoints();
    app.MapStaticAssets().AllowAnonymous();

    var apiGroup = app.MapGroup("api");
    apiGroup.MapAuth();
    apiGroup.MapAdminFeature();

    app.MapFallbackToFile("index.html").AllowAnonymous();

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
