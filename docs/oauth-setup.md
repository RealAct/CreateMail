# Setting up Gmail and Outlook / Hotmail sign-in

Gmail, Outlook.com / Hotmail / Live and Office 365 accounts sign in with
OAuth. OAuth needs a "client" registered with Google and Microsoft for this
app. Upstream Mailspring ships its own clients and asks forks not to reuse
them, so CreateMail needs its own. Both are free and take about ten minutes
each. You only do this once.

Every other provider (iCloud, Yahoo, Fastmail, AOL, GMX, Yandex, Zoho, your
own server, and so on) works without this setup, using IMAP/SMTP with your
password or an app password.

## 1. Google (Gmail and Google Workspace)

1. Go to <https://console.cloud.google.com/> and create a project, for
   example "CreateMail".
2. **APIs & Services → Library**: enable **Google People API** (contacts) and
   **CalDAV API** (calendar). Mail itself uses IMAP and needs no API.
3. **APIs & Services → OAuth consent screen** (also called **Google Auth
   Platform**):
   - User type: **External**.
   - App name: `CreateMail`. Fill in your email address where it is asked for.
   - Scopes: add `https://mail.google.com/`, `.../auth/userinfo.email`,
     `.../auth/userinfo.profile`, `.../auth/contacts` and
     `.../auth/calendar`.
   - **Publish** the app ("In production"). While it is in "Testing", Google
     expires sign-ins after 7 days. You will not pass Google's verification
     and do not need to: when you sign in, Google shows "Google hasn't
     verified this app". Click **Advanced → Go to CreateMail (unsafe)**. That
     is expected for a personal app (up to 100 users).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Desktop app**.
   - Copy the **Client ID** and **Client secret**.

## 2. Microsoft (Outlook.com, Hotmail, Live, Office 365)

1. Go to <https://entra.microsoft.com/> (any Microsoft account works) →
   **App registrations → New registration**.
   - Name: `CreateMail`.
   - Supported account types: **Accounts in any organizational directory
     and personal Microsoft accounts**.
   - Redirect URI: platform **Public client/native (mobile & desktop)**, URI
     `http://localhost:12141/desktop`.
2. In the new app, **Authentication**: set **Allow public client flows** to
   **Yes** and save.
3. **API permissions → Add a permission → Microsoft Graph → Delegated**, add:
   `offline_access`, `openid`, `email`, `profile`, `User.Read`,
   `IMAP.AccessAsUser.All`, `SMTP.Send`, `Contacts.ReadWrite`,
   `Contacts.ReadWrite.Shared`, `Calendars.ReadWrite`,
   `Calendars.ReadWrite.Shared`.
4. Copy the **Application (client) ID** from the **Overview** page. No client
   secret is needed.

Office 365 work accounts may also need an admin to allow the app and to have
IMAP and authenticated SMTP turned on for the mailbox.

## 3. Give the credentials to CreateMail

### For builds made by GitHub Actions

In the repository on GitHub, **Settings → Secrets and variables → Actions →
New repository secret**, add:

| Secret | Value |
| --- | --- |
| `CREATEMAIL_GMAIL_CLIENT_ID` | Google client ID |
| `CREATEMAIL_GMAIL_CLIENT_SECRET` | Google client secret |
| `CREATEMAIL_MICROSOFT_CLIENT_ID` | Microsoft application (client) ID |

Then run **Actions → Build for macOS** again. The build writes them into the
app.

### For local builds

Create `app/oauth-credentials.json` (it is git-ignored) before
`npm run build` or `npm start`:

```json
{
  "gmailClientId": "…apps.googleusercontent.com",
  "gmailClientSecret": "…",
  "microsoftClientId": "…"
}
```

Environment variables with the same values (`CREATEMAIL_GMAIL_CLIENT_ID`,
`CREATEMAIL_GMAIL_CLIENT_SECRET`, `CREATEMAIL_MICROSOFT_CLIENT_ID`) also work
when running from source.

## Without OAuth

- **Gmail**: the Gmail sign-in page offers **Use an App Password**. Turn on
  2-Step Verification, create an app password at
  <https://myaccount.google.com/apppasswords>, and use it with IMAP.
- **Outlook.com / Hotmail / Office 365**: Microsoft no longer accepts
  passwords for IMAP, so these accounts need the Microsoft client above.
