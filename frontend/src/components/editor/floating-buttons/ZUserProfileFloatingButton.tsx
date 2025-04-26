import React, { CSSProperties, ReactElement } from 'react';
import { useHistory } from 'react-router';
import useLocale from '../../../hooks/useLocale';
import UserProfileIcon from '../../../shared/assets/icons/floating-buttons/user-profile.svg';
import UserProfileHighLightIcon from '../../../shared/assets/icons/floating-buttons/user-profile-highlight.svg';
import ZHoverableIcon from '../ZHoverableIcon';
import i18n from './FloatingButtonToolTipsi18n.json';
import useStores from '../../../hooks/useStores';

export function ZUserProfileFloatingButton(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { accountStore } = useStores();
  const history = useHistory();
  const isFinished = !!(
    accountStore.account.userProfile?.ageRange && accountStore.account.userProfile?.industry
  );

  return (
    <>
      {!isFinished && (
        <ZHoverableIcon
          isSelected={false}
          src={UserProfileIcon}
          hoveredSrc={UserProfileHighLightIcon}
          selectedSrc={UserProfileHighLightIcon}
          containerStyle={styles.container}
          iconStyle={styles.icon}
          onClick={() => history.push('/userProfile')}
          toolTip={content.userProfile}
          toolTipPlacement="left"
        />
      )}
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: '40px',
    width: '40px',
  },
};
