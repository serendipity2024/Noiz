import React, { ReactElement } from 'react';
import styles from './FloatingButtons.module.scss';
import ZCommunityFloatingButton from './floating-buttons/ZCommunityFloatingButton';
import ZDocumentFloatingButton from './floating-buttons/ZDocumentFloatingButton';
import ZFeedbackFloatingButton from './floating-buttons/ZFeedbackFloatingButton';
import { ZOnboardingFloatingButton } from './floating-buttons/ZOnboardingFloatingButton';
import { ZAcademyFloatingButton } from './floating-buttons/ZAcademyFloatingButton';
import { ZUserProfileFloatingButton } from './floating-buttons/ZUserProfileFloatingButton';
import { FeatureType } from '../../graphQL/__generated__/globalTypes';
import { AllStores } from '../../mobx/StoreContexts';

export const FloatingButtons = (): ReactElement => {
  const { featureStore } = AllStores;
  return (
    <div className={styles.container}>
      <ZOnboardingFloatingButton />
      {featureStore.isFeatureAccessible(FeatureType.SHOW_USER_PROFILE) && (
        <ZUserProfileFloatingButton />
      )}
      <ZAcademyFloatingButton />
      <ZCommunityFloatingButton />
      <ZDocumentFloatingButton />
      <ZFeedbackFloatingButton />
    </div>
  );
};
