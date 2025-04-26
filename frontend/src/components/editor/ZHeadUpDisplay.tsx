/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import useLocale from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';
import { DefaultProjectName } from '../../mobx/stores/ProjectStore';
import { EditorMode } from '../../models/interfaces/EditorInfo';
import ArrowDown from '../../shared/assets/icons/arrow-down.svg';
import { ZColors, ZThemedColors } from '../../utils/ZConst';
import i18n from './ZHeadUpDisplay.i18n.json';

export default observer(function ZHeadUpDisplay(): ReactElement {
  const history = useHistory();
  const { localizedContent } = useLocale(i18n);
  const { editorStore, projectStore } = useStores();

  let title;
  let subtitle;
  let handleOnClick;
  let showArrow = true;
  switch (editorStore.editorState.mode) {
    case EditorMode.FOCUS:
      title = localizedContent.focus.title;
      subtitle = localizedContent.focus.subtitle;
      showArrow = false;
      break;

    case EditorMode.HOME:
    default:
      title = projectStore.projectDetails?.projectName ?? DefaultProjectName;
      subtitle = null;
      handleOnClick = () => {
        projectStore.reset();
        history.push('/projects');
      };
  }

  const renderArrow = () =>
    showArrow ? <img alt="" style={styles.arrowDown} src={ArrowDown} /> : null;

  return (
    <>
      <div style={styles.container} onClick={handleOnClick}>
        <span style={styles.titleText}>{title}</span>
        {renderArrow()}
      </div>
      {subtitle ? <span style={styles.subtitleText}>{subtitle}</span> : null}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0 32px',
    minWidth: '176px',
    maxWidth: '280px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: ZColors.BACKGROUND_WITH_OPACITY,
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
  },
  titleText: {
    color: ZThemedColors.ACCENT,
    width: '100%',
    fontSize: '12px',
    lineHeight: '17px',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  arrowDown: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '18px',
    width: '12px',
    height: '6px',
  },
  subtitleText: {
    position: 'fixed',
    top: '75px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '12px',
    color: ZColors.WHITE,
  },
};
