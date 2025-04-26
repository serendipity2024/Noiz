import { QueryOptions } from '@apollo/client';
import { action, autorun, observable } from 'mobx';
import { GQL_FEATURE_ACCESSIBLE } from '../../graphQL/featureAccessible';
import { AllFeatures, AllFeaturesVariables } from '../../graphQL/__generated__/AllFeatures';
import { FeatureType } from '../../graphQL/__generated__/globalTypes';
import ZNotification from '../../utils/notifications/ZNotifications';
import { AllStores } from '../StoreContexts';
import i18n from '../../utils/notifications/ZNotifications.i18n.json';

export class FeatureStore {
  constructor() {
    this.featureAccessible = { allFeatures: [] };
  }

  @observable
  featureAccessible: AllFeatures;

  @action
  private setFeature(features: AllFeatures | undefined): void {
    if (!features) return;
    this.featureAccessible = features;
  }

  public isFeatureAccessible(featureType: FeatureType): boolean {
    for (const element of this.featureAccessible.allFeatures) {
      if (element.featureName === featureType) {
        return element.enabled;
      }
    }
    return false;
  }

  public setupFeatureDataSync(): void {
    autorun(() => {
      const { projectStore, persistedStore, sessionStore, authStore } = AllStores;
      if (!authStore.isLoggedIn) return;
      const projectExId = projectStore.projectDetails?.projectExId;
      const handleQueriesForFeatureDetails = (
        query: QueryOptions<AllFeaturesVariables, AllFeatures>
      ) =>
        sessionStore.clientForSession
          .query(query)
          .then((response) => this.setFeature(response.data))
          .catch(() => {
            const notif = new ZNotification(i18n[persistedStore.locale]);
            notif.send('FAILED_TO_FETCH_FEATURES');
          });
      const updateFeatureGatingDetails = (targetProjectExId?: string) =>
        handleQueriesForFeatureDetails({
          query: GQL_FEATURE_ACCESSIBLE,
          variables: { projectExId: targetProjectExId },
        });
      updateFeatureGatingDetails(projectExId);
    });
  }
}
