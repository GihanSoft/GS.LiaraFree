using System.Data.Common;

namespace GS.LiaraFree.Main.Shared.Email;

public sealed record EmailCredentials(string Username, string Password);
public sealed record EmailConnection(string Host, int Port, EmailCredentials? Credentials)
{
    private const string EndpointKeyword = "endpoint";
    private const string UsernameKeyword = "username";
    private const string PasswordKeyword = "password";

    public static bool TryParse(string connectionString, out EmailConnection? emailConnection)
    {
        emailConnection = null;
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            return false;
        }

        var connectionStringBuilder = new DbConnectionStringBuilder { ConnectionString = connectionString };

        if (connectionStringBuilder.TryGetValue(EndpointKeyword, out var endpointObj) == false ||
            endpointObj is not string endpoint ||
            Uri.TryCreate(endpoint, UriKind.Absolute, out var uri) == false)
        {
            return false;
        }

        EmailCredentials? credentials = null;

        if (connectionStringBuilder.TryGetValue(UsernameKeyword, out var usernameObj) &&
            connectionStringBuilder.TryGetValue(PasswordKeyword, out var passwordObj) &&
            usernameObj is string username && !string.IsNullOrWhiteSpace(username) &&
            passwordObj is string password)
        {
            credentials = new EmailCredentials(username, password);
        }

        else if (string.IsNullOrEmpty(uri.UserInfo) == false && uri.UserInfo.Split(':') is [var uriUsername, var uriPassword])
        {
            credentials = new EmailCredentials(uriUsername, uriPassword);
        }

        // 4. Successfully construct the connection object.
        emailConnection = new EmailConnection(uri.Host, uri.Port, credentials);
        return true;
    }
}
