import { Actions, TaskQueue } from 'mailspring-exports';
import { FeatureUsageStore } from '../../src/flux/stores/feature-usage-store';
import { IdentityStore } from '../../src/flux/stores/identity-store';

describe('FeatureUsageStore', function featureUsageStoreSpec() {
  beforeEach(() => {
    spyOn(Actions, 'queueTask');
    spyOn(Actions, 'openModal');
  });

  afterEach(() => {
    TaskQueue._queue = [];
  });

  describe('without a Mailspring ID', () => {
    beforeEach(() => {
      spyOn(IdentityStore, 'identity').andReturn(null);
    });

    it('reports every feature as usable', () => {
      expect(FeatureUsageStore.isUsable('snooze')).toBe(true);
      expect(FeatureUsageStore.isUsable('send-later')).toBe(true);
      expect(FeatureUsageStore.isUsable('unknown-feature')).toBe(true);
    });

    it('reports Pro features as available', () => {
      expect(IdentityStore.hasProFeatures()).toBe(true);
    });

    it('resolves markUsedOrUpgrade without showing an upgrade modal', async () => {
      await FeatureUsageStore.markUsedOrUpgrade('snooze', {} as any);
      expect(Actions.openModal).not.toHaveBeenCalled();
    });

    it('resolves displayUpgradeModal without showing a modal', async () => {
      await FeatureUsageStore.displayUpgradeModal('translation', {} as any);
      expect(Actions.openModal).not.toHaveBeenCalled();
    });

    it('does not queue usage events', () => {
      FeatureUsageStore.markUsed('snooze');
      expect(Actions.queueTask).not.toHaveBeenCalled();
    });
  });

  describe('with a Mailspring ID', () => {
    beforeEach(() => {
      spyOn(IdentityStore, 'identity').andReturn({ id: 'foo', featureUsage: {} } as any);
    });

    it('queues a usage event for client-recorded features', () => {
      FeatureUsageStore.markUsed('snooze');
      expect(Actions.queueTask).toHaveBeenCalled();
    });

    it('does not queue usage events for server-recorded features', () => {
      FeatureUsageStore.markUsed('translation');
      expect(Actions.queueTask).not.toHaveBeenCalled();
    });
  });
});
