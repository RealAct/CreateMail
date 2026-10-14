import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const LOCAL_SERVER_PORT = 12141;

/**
 * OAuth credentials for Gmail and Microsoft (Outlook.com / Hotmail / Office 365).
 *
 * Upstream Mailspring embeds its own Google and Microsoft OAuth clients and asks
 * derivative works not to reuse them, so CreateMail ships without any. They are
 * read, in order, from:
 *
 *   1. environment variables (CREATEMAIL_GMAIL_CLIENT_ID, CREATEMAIL_GMAIL_CLIENT_SECRET,
 *      CREATEMAIL_MICROSOFT_CLIENT_ID; the upstream MS_* names also work), or
 *   2. app/oauth-credentials.json, written at build time (see docs/oauth-setup.md).
 *
 * When a provider has no credentials, its sign-in page explains how to add them
 * and, for Gmail, offers IMAP with an app password instead.
 */
interface OAuthCredentialsFile {
  gmailClientId?: string;
  gmailClientSecret?: string;
  microsoftClientId?: string;
}

function loadOAuthCredentialsFile(): OAuthCredentialsFile {
  try {
    const file = path.join(__dirname, '..', '..', '..', 'oauth-credentials.json');
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8')) || {};
  } catch (err) {
    console.warn('Could not read oauth-credentials.json', err);
    return {};
  }
}

const OAuthCredentialsFromFile = loadOAuthCredentialsFile();

export const GMAIL_CLIENT_ID =
  process.env.CREATEMAIL_GMAIL_CLIENT_ID ||
  process.env.MS_GMAIL_CLIENT_ID ||
  OAuthCredentialsFromFile.gmailClientId ||
  '';

// Google issues "Desktop app" clients a secret that cannot be kept confidential in
// a desktop app and treats it as part of the client ID; it still has to be sent.
export const GMAIL_CLIENT_SECRET =
  process.env.CREATEMAIL_GMAIL_CLIENT_SECRET ||
  process.env.MS_GMAIL_CLIENT_SECRET ||
  OAuthCredentialsFromFile.gmailClientSecret ||
  '';

export const GMAIL_OAUTH_CONFIGURED = !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET);

export const GMAIL_SCOPES = [
  'https://mail.google.com/', // email
  'https://www.googleapis.com/auth/userinfo.email', // email address
  'https://www.googleapis.com/auth/userinfo.profile', // G+ profile
  'https://www.googleapis.com/auth/contacts', // contacts
  'https://www.googleapis.com/auth/calendar', // calendar
];

export const O365_CLIENT_ID =
  process.env.CREATEMAIL_MICROSOFT_CLIENT_ID ||
  process.env.MS_O365_CLIENT_ID ||
  OAuthCredentialsFromFile.microsoftClientId ||
  '';

export const MICROSOFT_OAUTH_CONFIGURED = !!O365_CLIENT_ID;

export const O365_SCOPES = [
  'openid', // required for id_token to be returned
  'email', // email claim in id_token
  'profile', // displayName / name claims in id_token
  'user.read', // email address via Graph /me
  'offline_access',
  'Contacts.ReadWrite', // contacts
  'Contacts.ReadWrite.Shared', // contacts
  'Calendars.ReadWrite', // calendar
  'Calendars.ReadWrite.Shared', // calendar

  // Future note: When you exchange the refresh token for an access token, you may
  // request these two OR the above set but NOT BOTH, because Microsoft has mapped
  // two underlying systems with different tokens onto the single flow and you
  // need to get an outlook token and not a Micrsosoft Graph token to use these APIs.
  // https://stackoverflow.com/questions/61597263/
  'https://outlook.office.com/IMAP.AccessAsUser.All', // email
  'https://outlook.office.com/SMTP.Send', // email
];

// Re-created only at onboarding page load / auth session start because storing
// verifier would require additional state refactoring
//
// 32 random bytes base64url-encode to exactly 43 characters, the minimum length
// RFC 7636 §4.1 allows (`code-verifier = 43*128unreserved`). A UUID is only 36
// characters and authorization servers that enforce the minimum reject it.
export const CODE_VERIFIER = crypto
  .randomBytes(32)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
export const CODE_CHALLENGE = crypto
  .createHash('sha256')
  .update(CODE_VERIFIER, 'utf8')
  .digest('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

// Carried alongside PKCE as defense in depth per RFC 6749 §10.12: the authorization
// server echoes it on the redirect, and a callback that does not carry the value from
// the most recently built authorization URL aborts the sign-in instead of exchanging
// the code.
let latestOAuthState: string | null = null;

export function createOAuthState(): string {
  latestOAuthState = crypto
    .randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return latestOAuthState;
}

export function getLatestOAuthState(): string | null {
  return latestOAuthState;
}
