import React from 'react';

import { Account } from 'mailspring-exports';
import { buildOutlookAccountFromAuthResponse, buildO365AuthURL } from './onboarding-helpers';

import OAuthSignInPage from './oauth-signin-page';
import OAuthNotConfiguredPage from './oauth-not-configured-page';
import { MICROSOFT_OAUTH_CONFIGURED } from './onboarding-constants';
import * as OnboardingActions from './onboarding-actions';
import AccountProviders from './account-providers';

export default class AccountSettingsPageOutlook extends React.Component<{ account: Account }> {
  static displayName = 'AccountSettingsPageOutlook';

  _authUrl = buildO365AuthURL();

  onSuccess(account) {
    OnboardingActions.finishAndAddAccount(account);
  }

  render() {
    const providerConfig = AccountProviders.find((a) => a.provider === this.props.account.provider);
    if (!MICROSOFT_OAUTH_CONFIGURED) {
      return <OAuthNotConfiguredPage serviceName="Outlook" providerConfig={providerConfig} />;
    }
    const goBack = () => OnboardingActions.moveToPreviousPage();

    return (
      <OAuthSignInPage
        serviceName="Outlook"
        providerAuthPageUrl={this._authUrl}
        providerConfig={providerConfig}
        buildAccountFromAuthResponse={buildOutlookAccountFromAuthResponse}
        onSuccess={this.onSuccess}
        onTryAgain={goBack}
      />
    );
  }
}
