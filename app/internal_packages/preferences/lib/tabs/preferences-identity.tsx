import React from 'react';
import { localized } from 'mailspring-exports';
import { RetinaImg } from 'mailspring-component-kit';

const ProTourFeatures = [
  {
    link: 'https://getmailspring.com/docs/add-reminders-to-sent-messages',
    icon: `icon-composer-reminders.png`,
    title: localized(`Follow-up reminders`),
    text: localized(
      `Never forget to follow up! Mailspring reminds you if your messages haven't received replies.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/view-contact-and-company-profiles',
    icon: `toolbar-person-sidebar.png`,
    title: localized(`Rich contact profiles`),
    text: localized(
      `Write better emails with LinkedIn profiles, Twitter bios, message history, and more in the right sidebar.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/read-receipts-link-tracking-and-activity-reports',
    icon: `icon-composer-eye.png`,
    title: localized(`Read Receipts`),
    text: localized(
      `Get notified when each recipient opens your email to send timely follow-ups and reminders.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/reply-faster-with-email-templates',
    icon: `toolbar-templates.png`,
    title: localized(`Mail Templates`),
    text: localized(
      `Create templated messages and fill them quickly to reply to messages and automate your common workflows.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/read-receipts-link-tracking-and-activity-reports',
    icon: `icon-composer-linktracking.png`,
    title: localized(`Link tracking`),
    text: localized(
      `See when recipients click links in your emails so you can follow up with precision`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/schedule-messages-to-send-later',
    icon: `icon-composer-sendlater.png`,
    title: localized(`Send Later`),
    text: localized(
      `Schedule messages to send at the ideal time to maximize your email reply rate or automate drip emails.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/view-contact-and-company-profiles',
    icon: `icon-composer-reminders.png`,
    title: localized(`Company overviews`),
    text: localized(
      `See detailed information about companies you email, including their size, funding and timezone.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/snooze-emails-to-handle-them-later',
    icon: `toolbar-snooze.png`,
    title: localized(`Snooze messages`),
    text: localized(
      `Schedule messages to re-appear later to keep your inbox clean and focus on immediate todos.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/read-receipts-link-tracking-and-activity-reports',
    icon: `icon-toolbar-activity.png`,
    title: localized(`Mailbox insights`),
    text: localized(
      `Use the Activity tab to get a birds-eye view of your mailbox: open and click rates, subject line effectiveness, and more.`
    ),
  },
  {
    link: 'https://getmailspring.com/docs/automatically-translate-incoming-email',
    icon: `pro-feature-translation.png`,
    title: localized(`Automatic Translation`),
    text: localized(
      `Instantly translate messages you receive into your preferred reading language.`
    ),
  },
];

/**
 * CreateMail replaces Mailspring's "Subscription" tab (Mailspring ID sign-in,
 * plans and billing) with an overview of the Pro features, which are all
 * included and unlocked without an account.
 */
class PreferencesIdentity extends React.Component<Record<string, unknown>> {
  static displayName = 'PreferencesIdentity';

  render() {
    return (
      <div className="container-identity">
        <div className="identity-content-box">
          <div className="row padded">
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div className="basic-explanation">
                <strong>{localized('All Pro features are included')}</strong>
                <br />
                <br />
                {localized(
                  'Snooze, send later, follow-up reminders, read receipts, link tracking, templates, mailbox insights and the rest of the Pro feature set are unlocked, with no quotas and no Mailspring ID or subscription required.'
                )}
              </div>
            </div>
            <ExploreMailspringPro />
          </div>
        </div>
      </div>
    );
  }
}

const ExploreMailspringPro: React.FunctionComponent = () => (
  <>
    <div className="feature-explore-title">{localized('Explore Pro Features')}</div>
    <div className="feature-explore-grid">
      {ProTourFeatures.map((item) => (
        <a key={item.title} className="feature" href={item.link}>
          <div className="popout">
            <RetinaImg name="thread-popout.png" mode={RetinaImg.Mode.ContentDark} />
          </div>
          <h3>
            <RetinaImg
              name={item.icon}
              style={{ paddingRight: 8 }}
              mode={RetinaImg.Mode.ContentDark}
            />
            {item.title}
          </h3>
          <p>{item.text}</p>
        </a>
      ))}
    </div>
  </>
);

export default PreferencesIdentity;
