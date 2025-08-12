using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------
// Configuration & recommended services
// -----------------------------
builder.Services.Configure<ForwardedHeadersOptions>(a =>
{
    a.KnownNetworks.Clear();
    a.KnownProxies.Clear();
    a.ForwardedHeaders = ForwardedHeaders.All;
});

// -----------------------------
// Build
// -----------------------------
var app = builder.Build();

// -----------------------------
// Middleware pipeline (order matters)
// -----------------------------
app.UseForwardedHeaders();
_ = app.Environment.IsDevelopment() ? app : app.UseHsts();
_ = app.Environment.IsDevelopment() ? app : app.UseHttpsRedirection();
app.UseRouting();
app.UseEndpoints(_ => { });

// -----------------------------
// Endpoint mappings
// -----------------------------
app.MapGet("/", () => "Hello World!");

app.Run();
