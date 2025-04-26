import React, { CSSProperties, ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import ZHoverableIcon from '../ZHoverableIcon';
import AcademyHighlight from '../../../shared/assets/icons/floating-buttons/academy-highlight.svg';
import AcademyNormal from '../../../shared/assets/icons/floating-buttons/academy-normal.svg';
import i18n from './FloatingButtonToolTipsi18n.json';
import { ZURLs } from '../../../utils/ZConst';

export const ZAcademyFloatingButton = (): ReactElement => {
  const { localizedContent: content } = useLocale(i18n);

  return (
    <ZHoverableIcon
      isSelected={false}
      src={AcademyNormal}
      hoveredSrc={AcademyHighlight}
      onClick={() => window.open(ZURLs.ZION_COLLEGE, '_blank', 'noopener')}
      toolTip={content.academy}
      toolTipPlacement="left"
      containerStyle={styles.container}
    />
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    height: '40px',
    width: '40px',
  },
};
