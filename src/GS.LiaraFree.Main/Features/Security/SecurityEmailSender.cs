using FluentEmail.Core;

using Microsoft.AspNetCore.Identity;

namespace GS.LiaraFree.Main.Features.Security;

internal class SecurityEmailSender(IHttpContextAccessor _httpContextAccessor, IServiceProvider _serviceProvider) : IEmailSender<IdentityUser>
{
    private readonly IHttpContextAccessor _httpContextAccessor = _httpContextAccessor;
    private readonly IServiceProvider _serviceProvider = _serviceProvider;

    private async ValueTask UseFluentEmail(Func<IFluentEmail, ValueTask> func)
    {
        AsyncServiceScope? serviceScope = null;
        try
        {
            var serviceProvider = _httpContextAccessor.HttpContext?.RequestServices;
            if (serviceProvider is null)
            {
                serviceScope = _serviceProvider.CreateAsyncScope();
                serviceProvider = serviceScope.Value.ServiceProvider;
            }

            var fluentEmail = serviceProvider.GetRequiredService<IFluentEmail>();
            await func.Invoke(fluentEmail);
        }
        finally
        {
            if (serviceScope.HasValue)
            {
                await serviceScope.Value.DisposeAsync();
            }
        }
    }

    public async Task SendConfirmationLinkAsync(IdentityUser user, string email, string confirmationLink)
    {
        await UseFluentEmail(async fluentEmail => await fluentEmail
            .To(email)
            .Subject("Confirm Your Email Address for GihanSoft")
            .Header("x-liara-tag", "email-confirmation")
            .UsingTemplate(ConfirmationTemplate, new
            {
                user,
                email,
                secret = System.Net.WebUtility.HtmlDecode(confirmationLink),
            }, true)
            .SendAsync());
    }

    public async Task SendPasswordResetCodeAsync(IdentityUser user, string email, string resetCode)
    {
        await UseFluentEmail(async fluentEmail => await fluentEmail
            .To(email)
            .Subject("Your Password Reset Code for GihanSoft")
            .Header("x-liara-tag", "password-reset")
            .UsingTemplate(PasswordResetCodeTemplate, new
            {
                user,
                email,
                secret = System.Net.WebUtility.HtmlDecode(resetCode),
            }, true)
            .SendAsync());
    }

    public async Task SendPasswordResetLinkAsync(IdentityUser user, string email, string resetLink)
    {
        await UseFluentEmail(async fluentEmail => await fluentEmail
            .To(email)
            .Subject("Password Reset Request for Your GihanSoft Account")
            .Header("x-liara-tag", "password-reset")
            .UsingTemplate(PasswordResetLinkTemplate, new
            {
                user,
                email,
                secret = System.Net.WebUtility.HtmlDecode(resetLink),
            }, true)
            .SendAsync());
    }

    private const string ConfirmationTemplate = """
        <p>Hello {% if user.userName %}{{ user.userName }}{% else %}{{ email }}{% endif %},</p>

        <p>Thank you for registering with GihanSoft. To activate your account and complete your registration, please confirm your email address by clicking the link below:</p>

        <p><a href="{{ secret }}" target="_blank">Confirm My Email Address</a></p>

        <p>If you did not register for an account with GihanSoft, please ignore this email.</p>

        <p>Thanks,<br/>
        The GihanSoft Team</p>

        <p><small>This is an automated email, please do not reply.</small></p>
        """;

    private const string PasswordResetCodeTemplate = """
        <p>Hello {% if user.userName %}{{ user.userName }}{% else %}{{ email }}{% endif %},</p>

        <p>You have requested a password reset for your GihanSoft account. Please use the following code to reset your password:</p>

        <p><strong>Your Reset Code: {{ secret }}</strong></p>

        <p>Please enter this code on the password reset page to continue. This code is valid for a limited time.</p>

        <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>

        <p>Thanks,<br/>
        The GihanSoft Team</p>

        <p><small>This is an automated email, please do not reply.</small></p>
        """;

    private const string PasswordResetLinkTemplate = """
        <p>Hello {% if user.userName %}{{ user.userName }}{% else %}{{ email }}{% endif %},</p>

        <p>You have requested to reset your password for your GihanSoft account. Please click the link below to set a new password:</p>

        <p><a href="{{ secret }}" target="_blank">Reset My Password</a></p>

        <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>

        <p>Thanks,<br/>
        The GihanSoft Team</p>

        <p><small>This is an automated email, please do not reply.</small></p>
        """;
}
