var builder = DistributedApplication.CreateBuilder(args);

var pgSql = builder.AddPostgres("pg-sql")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithPgAdmin()
    ;

var db = pgSql.AddDatabase("default");

builder.AddProject<Projects.GS_LiaraFree_Main>("gs-liarafree-main")
    .WithReference(db)//.WaitFor(db)
    ;

builder.Build().Run();
