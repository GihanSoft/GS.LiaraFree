namespace GS.LiaraFree.AppHost;

internal static class EF
{
    extension(IResourceBuilder<ProjectResource> project)
    {
        public IResourceBuilder<ProjectResource> WithEfMigration(IResourceBuilder<IResourceWithConnectionString> db)
        {
            var projectDir = Path.GetDirectoryName(project.Resource.GetProjectMetadata().ProjectPath)
                ?? throw new InvalidOperationException("Project directory is null");
            var migrationExe = project.ApplicationBuilder.AddExecutable(
                project.Resource.Name + "-ef-migration",
                workingDirectory: projectDir,
                command: "dotnet",
                args: [
                    "ef", "database", "update",
                    "--connection", db,
                    "--no-build"
                ])
                .WithEnvironment("DOTNET_ENVIRONMENT", "Development")
                .WithExplicitStart()
                .WithReference(db).WaitFor(db)
                .WithIconName("DatabaseArrowUp", IconVariant.Regular)
                ;

            project.WithChildRelationship(migrationExe);

            return project;
        }
    }
}
