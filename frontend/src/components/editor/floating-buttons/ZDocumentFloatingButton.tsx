/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import DocumentHighlight from '../../../shared/assets/icons/floating-buttons/document-highlight.svg';
import DocumentIcon from '../../../shared/assets/icons/floating-buttons/document.svg';
import ZHoverableIcon from '../ZHoverableIcon';
import i18n from './FloatingButtonToolTipsi18n.json';

const ZION_DOCUMENT_URL = 'https://functorz.feishu.cn/docs/doccnKtQIId0VuYaqQ2f5hASqOh#3S8fHn';

export default function ZDocumentFloatingButton(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);

  return (
    <ZHoverableIcon
      isSelected={false}
      src={DocumentIcon}
      hoveredSrc={DocumentHighlight}
      selectedSrc={DocumentHighlight}
      containerStyle={styles.container}
      onClick={() => window.open(ZION_DOCUMENT_URL, '_blank', 'noopener')}
      toolTip={content.document}
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
