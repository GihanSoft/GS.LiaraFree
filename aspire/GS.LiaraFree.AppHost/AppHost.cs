var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.GS_LiaraFree_Main>("gs-liarafree-main");

builder.Build().Run();
