using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GS.LiaraFree.Main.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class SecurityToAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "auth");

            migrationBuilder.RenameTable(
                name: "asp_net_users",
                schema: "security",
                newName: "asp_net_users",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "asp_net_user_tokens",
                schema: "security",
                newName: "asp_net_user_tokens",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "asp_net_user_logins",
                schema: "security",
                newName: "asp_net_user_logins",
                newSchema: "auth");

            migrationBuilder.RenameTable(
                name: "asp_net_user_claims",
                schema: "security",
                newName: "asp_net_user_claims",
                newSchema: "auth");

            migrationBuilder.DropSchema(
                name: "security");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "security");

            migrationBuilder.RenameTable(
                name: "asp_net_users",
                schema: "auth",
                newName: "asp_net_users",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "asp_net_user_tokens",
                schema: "auth",
                newName: "asp_net_user_tokens",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "asp_net_user_logins",
                schema: "auth",
                newName: "asp_net_user_logins",
                newSchema: "security");

            migrationBuilder.RenameTable(
                name: "asp_net_user_claims",
                schema: "auth",
                newName: "asp_net_user_claims",
                newSchema: "security");

            migrationBuilder.DropSchema(
                name: "auth");
        }
    }
}
