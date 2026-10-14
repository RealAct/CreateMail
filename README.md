# 💌 CreateMail

CreateMail is a fork of [Mailspring](https://github.com/Foundry376/Mailspring)
that looks and works like Mailspring, with every **Mailspring Pro** feature
included and unlocked. No Mailspring ID, subscription or quota is needed.

It keeps Mailspring's interface, themes, icons and C++ sync engine
([Mailspring-Sync](https://github.com/Foundry376/Mailspring-Sync)) as they are,
and changes only what is needed to take Pro access off Mailspring's billing
servers and to run the Pro features without them.

CreateMail is not affiliated with or endorsed by Foundry 376 / Mailspring.
Mailspring is open source under the GPLv3, and so is this fork: see
[LICENSE.md](LICENSE.md). If you find Mailspring useful, consider supporting
its authors at [getmailspring.com/pro](https://getmailspring.com/pro).

## How it differs from Mailspring

- **Pro features are always on.** `IdentityStore.hasProFeatures()` is always
  true and `FeatureUsageStore` has no quotas, so snooze, send later,
  reminders, templates and the rest never show an upgrade prompt.
- **No Mailspring ID.** Onboarding goes straight from the tour to adding an
  email account, and the Preferences "Subscription" tab is replaced by a
  "Pro Features" overview.
- **Its own app identity.** The app is `CreateMail.app` with bundle ID
  `io.github.realact.createmail` and stores its data in
  `~/Library/Application Support/CreateMail`, so it can sit next to an
  installed `Mailspring.app` without sharing or touching its data.
- **No calls home.** Auto-update (which would replace this app with official
  Mailspring), Sentry error reporting and crash-report uploads are turned off.

## Mail services and protocols

CreateMail uses Mailspring's sync engine, which speaks **IMAP** (with IDLE,
CONDSTORE/QRESYNC and Gmail's labels extension) and **SMTP** for mail,
**CalDAV** for calendars and **CardDAV** / Google People / Microsoft Graph
for contacts, over TLS or STARTTLS, with **OAuth 2.0 (XOAUTH2)** or password
sign-in.

| Service | Sign-in |
| --- | --- |
| Gmail and Google Workspace | OAuth (needs a Google client, see below) or IMAP app password |
| Outlook.com, Hotmail, Live, MSN | OAuth (needs a Microsoft client, see below) |
| Office 365 / Microsoft 365, including shared mailboxes | OAuth (needs a Microsoft client) |
| iCloud, Yahoo, AOL | IMAP with an app password |
| Fastmail, GMX, Yandex, Zoho, Proton (via Proton Mail Bridge) | IMAP |
| Any other IMAP/SMTP server | IMAP, with automatic server settings for 1,000+ domains |

Gmail and Microsoft sign-in need OAuth clients registered for this app;
Mailspring asks forks not to reuse its own. Setting them up is free and takes
about ten minutes: see [docs/oauth-setup.md](docs/oauth-setup.md). Until then
those sign-in pages explain what to do, and Gmail offers IMAP with an app
password instead.

Not supported by the sync engine: POP3, Exchange ActiveSync / EWS (on-premises
Exchange without IMAP) and JMAP.

## Pro feature status

| Pro feature | Status |
| --- | --- |
| Snooze messages | ✅ Unlocked, runs locally |
| Send Later | ✅ Unlocked, runs locally (CreateMail must be running at send time) |
| Follow-up reminders | ✅ Unlocked, runs locally |
| Mail templates | ✅ Unlocked |
| Mailbox insights (Activity) | ✅ Unlocked, runs locally |
| Unlimited accounts, signatures, mail rules, themes | ✅ No limits |
| Rich contact and company profiles | 🚧 Phase 2: local profiles built from your mail |
| Automatic translation | 🚧 Phase 2: pluggable translation provider |
| Grammar check | 🚧 Phase 2: pluggable grammar provider |
| Thread sharing | 🚧 Phase 2: share as a self-contained HTML file |
| Read receipts | 🚧 Phase 3: self-hostable tracking server |
| Mail merge | 🚧 Phase 2: rebuilt (Mailspring's plugin is closed source) |
| Link tracking | 🚧 Phase 3: self-hostable tracking server |

Features marked 🚧 depend on Mailspring's hosted services, so they are hidden
until CreateMail ships its own replacement for that service.

## Roadmap

1. **Phase 1: Unlock** (this release). Fork upstream Mailspring, remove the
   Pro gating, give the app its own identity, and build it for macOS.
2. **Phase 2: Local replacements** for hosted Pro features that do not need a
   public server: contact profiles from local mail history, translation and
   grammar checking through a configurable provider, thread sharing as an
   exported page.
3. **Phase 3: CreateMail server**, a small self-hostable service for the
   features that need a public URL: read-receipt pixels, link-click
   redirects, and optional cross-device sync of plugin metadata.

## Installing on a Mac

### Download a build

1. Open this repository's **Actions** tab, pick **Build for macOS**, and
   click **Run workflow** (or download a zip from **Releases**).
2. Download `CreateMail-AppleSilicon` (M1 and later) or `CreateMail-Intel`.
3. Unzip it and drag `CreateMail.app` into `/Applications`.
4. The build is not notarized by Apple, so the first launch needs one of:
   - right-click `CreateMail.app` → **Open** → **Open**, or
   - `xattr -cr /Applications/CreateMail.app` in Terminal.

### Build it yourself

Requires Node.js 20+ and the Xcode command line tools.

```
npm install
npm run build
```

The app is written to `app/dist/CreateMail-darwin-<arch>/CreateMail.app` and
zipped to `app/dist/CreateMail.zip`.

To run from source instead: `npm install && npm start`.

## Development

Everything in upstream Mailspring's docs still applies: see
[CONTRIBUTING.md](CONTRIBUTING.md), [CLAUDE.md](CLAUDE.md) and
[PLUGIN_SYSTEM_ARCHITECTURE.md](PLUGIN_SYSTEM_ARCHITECTURE.md).

The sync engine is the `mailsync` submodule, pinned to upstream
Mailspring-Sync. `npm install` downloads the prebuilt binary for that commit,
so you do not need to compile it.

The repository's first commit is the unmodified upstream import, so
`git diff <first commit>` shows every change CreateMail makes to Mailspring.
