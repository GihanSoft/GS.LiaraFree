using Nuke.Common;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Utilities.Collections;

class Build : NukeBuild
{
    public static int Main() => Execute<Build>(x => x.Publish);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

    [Parameter("Liara app name for deployment")]
    readonly string AppName;

    [Solution(GenerateProjects = true)] readonly Solution Solution;
    Project MainProject => Solution.src.GS_LiaraFree_Main;
    Project FrontendProject => Solution.src.gs_liara_free;

    AbsolutePath WwwRootDir => MainProject.Directory / "wwwroot";
    AbsolutePath FrontendDist => FrontendProject.Directory / "dist";

    Target Clean => _ => _
        .Executes(() =>
        {
            MainProject.Directory.GlobDirectories("**/bin", "**/obj").ForEach(AbsolutePathExtensions.DeleteDirectory);
            WwwRootDir.CreateOrCleanDirectory();
        });

    Target Restore => _ => _
        .DependsOn(Clean)
        .Executes(() =>
        {
            DotNetTasks.DotNetRestore(s => s
                .SetProjectFile(MainProject)
                );
            ProcessTasks.StartProcess("bun", "install", FrontendProject.Directory)
                .AssertZeroExitCode();
        });


    Target BuildFrontend => _ => _
        .DependsOn(Restore)
        .Before(Compile)
        .Executes(() =>
        {
            ProcessTasks.StartProcess("bun", "run build", FrontendProject.Directory)
                .AssertZeroExitCode();

            FrontendDist
                .Copy(WwwRootDir, ExistsPolicy.MergeAndOverwrite)
                ;
        });


    Target Compile => _ => _
        .DependsOn(Restore)
        .Executes(() =>
        {
            DotNetTasks.DotNetBuild(s => s
                .SetProjectFile(MainProject)
                .SetConfiguration(Configuration)
                .SetNoRestore(true)
                );
        });

    Target Liara => _ => _
        .Requires(() => AppName)
        .DependsOn([Compile, BuildFrontend])
        .Triggers(Cleanup)
        .Executes(() =>
        {
            ProcessTasks.StartProcess("liara", $"deploy --app={AppName} --detach", Solution.Directory)
                .AssertZeroExitCode();
        });

    Target Publish => _ => _
        .DependsOn([Restore, BuildFrontend])
        .Triggers(Cleanup)
        .Executes(() =>
        {
            DotNetTasks.DotNetPublish(s => s
                .SetProject(MainProject)
                .SetOutput(RootDirectory / "publish")
                .SetNoRestore(true));
        });

    Target Cleanup => _ => _
        .Executes(() =>
        {
            WwwRootDir.CreateOrCleanDirectory();
            var nothingTxt = (WwwRootDir / "nothing.txt").TouchFile();
            nothingTxt.WriteAllText("just a placeholder to keep www root alive with git\r\n");
        });
}
