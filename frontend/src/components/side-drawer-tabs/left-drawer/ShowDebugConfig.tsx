/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { observer } from 'mobx-react';
import cssModule from './ShowDebugConfig.module.scss';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import useProjectDetails from '../../../hooks/useProjectDetails';
import useLocale from '../../../hooks/useLocale';
import i18n from './ShowDebugConfig.i18n.json';
import useIsDeveloperMode from '../../../hooks/useIsDeveloperMode';
import useStores from '../../../hooks/useStores';
import Environment from '../../../Environment';
import SearchComponentTab from './SearchComponentTab';
import { Input, ZInput } from '../../../zui';

export default observer(function ShowDebugConfig(): ReactElement {
  const { authStore } = useStores();
  const { userToken } = authStore;
  const { projectExId, projectConfig, managementConsoleUrl } = useProjectDetails();
  const registerToken = projectConfig?.registerToken;
  const wechatAppId = projectConfig?.wechatAppConfig?.wechatAppId;
  const { adminSecret, rootUrl } = projectConfig?.hasuraConfig ?? {};
  const displayNotification = useNotificationDisplay();
  const { localizedContent } = useLocale(i18n);
  const isDeveloperMode = useIsDeveloperMode();

  const handleCopyUrl = () => {
    displayNotification('COPIED_TO_CLIPBOARD');
  };
  const iconScript = `pip3 install -r ./scripts/preprocess/requirements.txt && ./scripts/preprocess/download_tab_bar_icon.py ${projectExId} ${userToken} -s "${Environment.httpServerAddress}/api/graphql"`;
  const wechatScript = `npm run start:wechat -- ./output/data.json ${registerToken} . && npm run projgen:wechat -- ${rootUrl}/v1/graphql ${rootUrl?.replace(
    'https',
    'wss'
  )}/v1/graphql .`;
  const mcScript = `npm run start:wechat -- ./output/data.json ${registerToken} . && npm run build:mc -- ${
    rootUrl?.split('/')[2]
  } true /mc/${projectExId} /${projectExId}/v1/graphql ${
    managementConsoleUrl?.split('token/')[1]
  } .`;

  const renderInputRow = (title: string, state: string, multiLine?: boolean) => (
    <div style={styles.configContainer}>
      <div style={styles.titleCopyContainer}>
        <span style={styles.title}>{title}</span>
        <div style={styles.copyContainer}>
          <CopyToClipboard text={state} onCopy={handleCopyUrl}>
            <span style={styles.copy}>{localizedContent.copy}</span>
          </CopyToClipboard>
        </div>
      </div>
      {multiLine ? (
        <Input.TextArea autoSize style={styles.value} value={state} />
      ) : (
        <ZInput className={cssModule.value} readOnly value={state} lightBackground />
      )}
    </div>
  );

  return (
    <>
      {isDeveloperMode && (
        <div style={styles.container}>
          <LeftDrawerTitle>{localizedContent.debugConfiguration}</LeftDrawerTitle>
          <div style={styles.content}>
            <SearchComponentTab />
            {renderInputRow('WechatApp Id', wechatAppId ?? '')}
            {renderInputRow('Project Id', projectExId)}
            {renderInputRow('Root Url', rootUrl ?? '')}
            {renderInputRow('Register Token', registerToken ?? '')}
            {renderInputRow('Admin Secret', adminSecret ?? '')}
            {renderInputRow('Prebuild Script', iconScript, true)}
            {renderInputRow('Wechat Script', wechatScript, true)}
            {renderInputRow('Management Console', mcScript, true)}
          </div>
        </div>
      )}
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: '12px',
    padding: '20px',
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  configContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  titleCopyContainer: {
    width: '100%',
  },
  title: {
    color: ZThemedColors.ACCENT,
    float: 'left',
    fontSize: '14px',
  },
  copyContainer: {
    width: '15%',
    cursor: 'pointer',
    float: 'right',
  },
  copy: {
    fontSize: '12px',
    color: '#2298FF',
  },
  value: {
    marginTop: '6px',
    marginBottom: '6px',
    width: '100%',
    height: 'auto',
    paddingLeft: '13px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: 'none',
    boxShadow: 'none',
    fontSize: '14px',
    fontWeight: 500,
    userSelect: 'text',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
};
