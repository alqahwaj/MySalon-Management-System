using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MySalon.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedDefaultSalon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Salons",
                columns: new[] { "ID", "Address", "CoverImageUrl", "CreatedAt", "DeletedAt", "Description", "Email", "IsDeleted", "LogoUrl", "Name", "PhoneNumber", "UpdatedAt" },
                values: new object[] { new Guid("5a344038-03d9-4840-9d4a-54e7e9f24531"), "Amman, Jordan", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "نظام إدارة الصالونات المتكامل", "admin@mysalon.com", false, null, "MySalon", "0790000000", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Salons",
                keyColumn: "ID",
                keyValue: new Guid("5a344038-03d9-4840-9d4a-54e7e9f24531"));
        }
    }
}
