import Rx from 'rx-lite';
import MailspringStore from 'mailspring-store';
import * as Actions from '../actions';
import { IdentityStore } from './identity-store';
import { SendFeatureUsageEventTask } from '../tasks/send-feature-usage-event-task';

class NoProAccessError extends Error {}

const UsageRecordedServerSide = ['contact-profiles', 'translation'];

export interface FeatureLexicon {
  headerText: string;
  rechargeText: string;
  iconUrl: string;
}

/**
 * FeatureUsageStore answers whether a Pro feature may be used.
 *
 * Upstream Mailspring backs this with per-feature quotas returned by the
 * Mailspring ID billing server and shows an upgrade modal when a quota runs
 * out. CreateMail ships every Pro feature unlocked, so there are no quotas:
 * every feature is always usable and the upgrade modal is never shown.
 *
 * The API (including NoProAccessError) is kept so the feature plugins and
 * third-party plugins written against Mailspring keep working unchanged.
 */
class _FeatureUsageStore extends MailspringStore {
  NoProAccessError = NoProAccessError;
  _disp: Rx.Disposable;

  constructor() {
    super();

    this._disp = Rx.Observable.fromStore(IdentityStore).subscribe(() => {
      this.trigger();
    });
  }

  deactivate() {
    this._disp.dispose();
  }

  displayUpgradeModal(_feature: string, _lexicon: FeatureLexicon): Promise<void> {
    return Promise.resolve();
  }

  isUsable(_feature: string) {
    return true;
  }

  async markUsedOrUpgrade(feature: string, _lexicon: FeatureLexicon) {
    this.markUsed(feature);
  }

  markUsed(feature: string) {
    // Usage events are only meaningful to a Mailspring ID server, so they are
    // sent only when the user has optionally signed in to one.
    const identity = IdentityStore.identity();
    if (!identity) return;

    if (!UsageRecordedServerSide.includes(feature)) {
      Actions.queueTask(new SendFeatureUsageEventTask({ feature }));
    }
  }
}

export const FeatureUsageStore = new _FeatureUsageStore();
