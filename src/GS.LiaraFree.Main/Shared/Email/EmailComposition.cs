using System.ComponentModel.DataAnnotations;

namespace GS.LiaraFree.Main.Shared.Email;

internal static class EmailComposition
{
    public static WebApplicationBuilder AddEmail(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("email")
            ?? throw new InvalidOperationException("The 'email' connection string is missing, null, or empty.");

        var (host, port, credentials) = EmailConnection.TryParse(connectionString, out var emailConnectionTemp) && emailConnectionTemp is not null
            ? emailConnectionTemp
            : throw new InvalidOperationException("Failed to parse the 'email' connection string. Please ensure it is in a valid format.");

        var emailOptions = new EmailOptions() { DefaultFromEmail = "" };
        builder.Configuration.GetSection(EmailOptions.SectionName).Bind(emailOptions);

        var validationContext = new ValidationContext(emailOptions);
        Validator.ValidateObject(emailOptions, validationContext, validateAllProperties: true);

        FluentEmailServicesBuilder emailBuilder = builder.Services.AddFluentEmail(emailOptions.DefaultFromEmail);

        emailBuilder = credentials is not null
            ? emailBuilder.AddSmtpSender(host, port, credentials.Username, credentials.Password)
            : emailBuilder.AddSmtpSender(host, port);
        _ = emailBuilder.AddLiquidRenderer();

        return builder;
    }
}
