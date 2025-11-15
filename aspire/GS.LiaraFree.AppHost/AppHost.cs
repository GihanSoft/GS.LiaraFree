using System.Diagnostics;

using GS.LiaraFree.AppHost;

var builder = DistributedApplication.CreateBuilder(args);

var pgSql = builder.AddPostgres("pg-sql")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithPgAdmin()
    ;

var db = pgSql.AddDatabase("default");

var mailPit = builder.AddMailPit("email")
    ;

var main = builder.AddProject<Projects.GS_LiaraFree_Main>("main")
    .WithReference(db)//.WaitFor(db)
        .WithEfMigration(db)
    .WithReference(mailPit)//.WaitFor(mailpit)
    .WithEnvironment("Email__DefaultFromEmail", "info@localhost")
    ;

if (!File.Exists("../../src/gs-liara-free/obj/dev-cert.key"))
{
    ProcessStartInfo process = new("dotnet", ["dev-certs", "https", "-ep", "../../src/gs-liara-free/obj/dev-cert.crt", "--format", "pem", "-np"])
    {
        UseShellExecute = true,
        CreateNoWindow = true,
        WindowStyle = ProcessWindowStyle.Hidden,
    };
    Process.Start(process);
}

builder.AddBunApp("frontend", "../../src/gs-liara-free", "dev")
    .WithReference(main).WaitFor(main)
    .WithHttpsEndpoint(env: "PORT")
    .WithBunPackageInstallation()
    ;

builder.Build().Run();
