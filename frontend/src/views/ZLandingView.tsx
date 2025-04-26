/* eslint-disable import/no-default-export */
import React, { CSSProperties, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useHistory, useLocation } from 'react-router-dom';
import ZLocaleSwitch from '../components/base/ZLocaleSwitch';
import ZZionLogo from '../components/editor/ZZionLogo';
import useLocale from '../hooks/useLocale';
import useLogger from '../hooks/useLogger';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import useResponsiveWindow from '../hooks/useResponsiveWindow';
import AccentCircleArrow from '../shared/assets/accent-circle-arrow.svg';
import InvitationCube from '../shared/assets/invitation-cube.png';
import { NullableReactElement } from '../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../utils/ZConst';
import i18n from './ZLandingView.i18n.json';
import { message } from '../zui';

export default function ZLandingView(): NullableReactElement {
  const logger = useLogger();
  const history = useHistory();
  const displayNotif = useNotificationDisplay();
  const { isPortrait, makeResponsiveStyles } = useResponsiveWindow();
  const { localizedContent: content } = useLocale(i18n);
  const query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    // TODO: clean up this hack as we are completing the sharing logic
    if (code === '123321' || code === 'xxxxxx') message.warning('this is a demo code');
    /* eslint-disable-next-line */
  }, []);

  const code = query.get('code')?.substring(0, 8);
  if (!code) {
    history.push('/');
    return null;
  }

  const styles = isPortrait
    ? makeResponsiveStyles(portaitStyles)
    : makeResponsiveStyles(landscapeStyles);

  const renderButton = () => (
    <CopyToClipboard
      text={code}
      onCopy={() => {
        displayNotif('INVITATION_CODE_COPIED');
        logger.info('invitation-code-copied');
      }}
    >
      <div style={styles.button}>
        <span style={styles.buttonTitle}>{code}</span>
        <span style={styles.buttonSubtitle}>{content.buttonSubtitle}</span>
      </div>
    </CopyToClipboard>
  );
  const renderHref = () => (
    <div style={styles.right}>
      <a href="/" style={styles.url} target="_blank">
        {content.url}
      </a>
      <img style={styles.arrow} alt="" src={AccentCircleArrow} />
    </div>
  );
  const renderFooter = () => <span style={styles.footer}>{content.footer}</span>;
  const renderSubtitleRow = () =>
    isPortrait ? (
      <div style={styles.subtitleRow}>
        {renderButton()}
        {renderFooter()}
        {renderHref()}
      </div>
    ) : (
      <>
        <div style={styles.subtitleRow}>
          {renderButton()}
          {renderHref()}
        </div>
        {renderFooter()}
      </>
    );

  return (
    <>
      <ZZionLogo />
      <div style={styles.container}>
        {isPortrait ? <ZLocaleSwitch style={styles.localeSwitch} /> : null}
        <div style={styles.contentContainer}>
          <span style={styles.title}>{content.title1}</span>
          <span style={styles.title}>
            {content.title2a}
            <span style={styles.titleAccent}>{content.title2Accent}</span>
            {content.title2b}
          </span>
          {content.title3 !== 'NULL' && <span style={styles.title}>{content.title3}</span>}
          {renderSubtitleRow()}
        </div>
        <img style={styles.img} alt="" src={InvitationCube} />
      </div>
      {isPortrait ? null : <ZLocaleSwitch />}
    </>
  );
}

const landscapeStyles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    maxWidth: 960,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 550,
  },
  title: {
    color: ZColors.WHITE,
    fontSize: 44,
    fontWeight: 900,
  },
  titleAccent: {
    color: ZThemedColors.ACCENT,
    fontSize: 44,
    fontWeight: 900,
  },
  subtitleRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 55,
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 256,
    height: 92,
    borderRadius: 46,
    backgroundColor: ZThemedColors.PRIMARY,
    cursor: 'pointer',
  },
  buttonTitle: {
    margin: 0,
    color: ZThemedColors.ACCENT,
    fontSize: 40,
    fontWeight: 700,
  },
  buttonSubtitle: {
    color: ZColors.WHITE,
    fontSize: 12,
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 40,
  },
  url: {
    color: ZThemedColors.ACCENT,
    fontSize: 13,
    fontWeight: 500,
    textDecoration: 'underline',
  },
  arrow: {
    width: 14,
    height: 14,
    marginLeft: 10,
  },
  footer: {
    marginTop: 10,
    width: 256,
    textAlign: 'center',
    color: ZColors.WHITE,
    fontSize: 12,
    opacity: 0.2,
  },
  img: {
    marginLeft: 110,
    width: 300,
    height: 'auto',
  },
};

const portaitStyles: Record<string, CSSProperties> = {
  ...landscapeStyles,
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '80px',
    width: '100%',
    minHeight: '600px',
    overflow: 'hidden',
  },
  title: {
    ...landscapeStyles.title,
    fontSize: 22,
    textAlign: 'center',
  },
  titleAccent: {
    ...landscapeStyles.titleAccent,
    fontSize: 22,
  },
  subtitleRow: {
    ...landscapeStyles.subtitleRow,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    ...landscapeStyles.buttonTitle,
    fontSize: 28,
  },
  buttonSubtitle: {
    ...landscapeStyles.buttonSubtitle,
    fontSize: 12,
  },
  right: {
    ...landscapeStyles.right,
    marginTop: 46,
    marginLeft: 0,
  },

  img: {
    marginLeft: 0,
    width: '60%',
    height: 'auto',
    marginBottom: 40,
  },
  localeSwitch: {
    position: 'relative',
    marginTop: 20,
    left: 0,
    transform: 'none',
  },
};
