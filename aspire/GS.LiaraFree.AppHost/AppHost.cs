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
    .WithReference(mailPit)//.WaitFor(mailpit)
        .WithEnvironment("Email__DefaultFromEmail", "info@localhost")
    ;

builder.AddBunApp("frontend", "../../src/gs-liara-free", "dev")
    .WithReference(main).WaitFor(main)
    .WithHttpsEndpoint(env: "PORT")
    .WithBunPackageInstallation()
    ;

builder.Build().Run();
