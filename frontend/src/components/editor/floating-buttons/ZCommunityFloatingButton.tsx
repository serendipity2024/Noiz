/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import CommunityHighlight from '../../../shared/assets/icons/floating-buttons/community-highlight.svg';
import CommunityIcon from '../../../shared/assets/icons/floating-buttons/community.svg';
import ZHoverableIcon from '../ZHoverableIcon';
import i18n from './FloatingButtonToolTipsi18n.json';

const ZION_COMMUNITY_URL = 'https://community.functorz.com';

export default function ZCommunityFloatingButton(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  return (
    <ZHoverableIcon
      isSelected={false}
      src={CommunityIcon}
      hoveredSrc={CommunityHighlight}
      selectedSrc={CommunityHighlight}
      containerStyle={styles.container}
      onClick={() => window.open(ZION_COMMUNITY_URL, '_blank', 'noopener')}
      toolTip={content.community}
      toolTipPlacement="left"
    />
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: '40px',
    width: '40px',
  },
};
