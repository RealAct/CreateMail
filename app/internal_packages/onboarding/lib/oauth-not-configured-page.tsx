import React from 'react';
import { localized } from 'mailspring-exports';
import { RetinaImg } from 'mailspring-component-kit';
import * as OnboardingActions from './onboarding-actions';

export const OAUTH_SETUP_DOCS_URL =
  'https://github.com/RealAct/CreateMail/blob/master/docs/oauth-setup.md';

interface OAuthNotConfiguredPageProps {
  serviceName: string;
  providerConfig: { headerIcon: string; color: string };
  // Gmail can still be reached over IMAP with an app password. Outlook.com and
  // Office 365 no longer accept passwords, so they have no fallback.
  allowAppPasswordFallback?: boolean;
}

/**
 * Shown in place of the OAuth sign-in page when this build has no OAuth client
 * for the provider (see onboarding-constants.ts).
 */
export default class OAuthNotConfiguredPage extends React.Component<OAuthNotConfiguredPageProps> {
  static displayName = 'OAuthNotConfiguredPage';

  _onUseAppPassword = () => {
    OnboardingActions.chooseAccountProvider('imap');
  };

  render() {
    const { serviceName, providerConfig, allowAppPasswordFallback } = this.props;
    return (
      <div className={`page account-setup ${serviceName.toLowerCase()}`}>
        <div className="logo-container">
          <RetinaImg
            name={providerConfig.headerIcon}
            style={{ backgroundColor: providerConfig.color, borderRadius: 44 }}
            mode={RetinaImg.Mode.ContentPreserve}
            className="logo"
          />
        </div>
        <h2>{localized('%@ sign-in is not set up in this build', serviceName)}</h2>
        <div className="message empty note">
          {localized(
            'Signing in with %@ needs an OAuth client registered for this app. Add one by following the setup guide, then rebuild or restart the app.',
            serviceName
          )}{' '}
          <a style={{ fontWeight: 600 }} href={OAUTH_SETUP_DOCS_URL}>
            {localized('Open the setup guide')}
          </a>
        </div>
        {allowAppPasswordFallback && (
          <div style={{ marginTop: 30 }}>
            <p>
              {localized(
                'You can also connect with IMAP and a Google app password (requires 2-Step Verification on your Google account).'
              )}
            </p>
            <button className="btn btn-large" onClick={this._onUseAppPassword}>
              {localized('Use an App Password')}
            </button>
          </div>
        )}
      </div>
    );
  }
}
