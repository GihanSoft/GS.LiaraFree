using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GS.LiaraFree.Main.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSystemOwnership : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "admin");

            migrationBuilder.CreateTable(
                name: "system_ownership",
                schema: "admin",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    assigned_by = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    is_current_owner = table.Column<bool>(type: "boolean", nullable: true),
                    start_moment = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    end_moment = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_system_ownership", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_system_ownership_is_current_owner",
                schema: "admin",
                table: "system_ownership",
                column: "is_current_owner",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "system_ownership",
                schema: "admin");
        }
    }
}
