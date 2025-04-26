/* eslint-disable import/no-default-export */
import { useObserver } from 'mobx-react';
import React, { CSSProperties, ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import useStores from '../../../hooks/useStores';
import FeedbackHighlight from '../../../shared/assets/icons/floating-buttons/feedback-highlight.svg';
import FeedbackIcon from '../../../shared/assets/icons/floating-buttons/feedback.svg';
import ZHoverableIcon from '../ZHoverableIcon';
import i18n from './FloatingButtonToolTipsi18n.json';
import ZFeedbackPopup from './ZFeedbackPopup';

export default function ZFeedbackFloatingButton(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { editorStore } = useStores();
  const isSelected = useObserver(() => editorStore.floatingButtonOn === 'feedback');

  const setIsSelected = (target: boolean) => {
    editorStore.floatingButtonOn = target ? 'feedback' : null;
  };

  return (
    <>
      <ZHoverableIcon
        isSelected={isSelected}
        src={FeedbackIcon}
        hoveredSrc={FeedbackHighlight}
        selectedSrc={FeedbackHighlight}
        containerStyle={styles.container}
        onClick={() => setIsSelected(!isSelected)}
        toolTip={content.feedback}
        toolTipPlacement="left"
      />
      {isSelected && <ZFeedbackPopup />}
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: '40px',
    width: '40px',
  },
};
