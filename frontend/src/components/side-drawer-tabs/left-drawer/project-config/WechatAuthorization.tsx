/* eslint-disable import/no-default-export */
import { WechatOutlined } from '@ant-design/icons';
import { useApolloClient } from '@apollo/client';
import { observer } from 'mobx-react';
import React from 'react';
import { getPreAuthPageUrl } from '../../../../graphQL/getPreAuthPageUrl';
import { getWechatMiniAppLink } from '../../../../graphQL/getWechatMiniAppLink';
import useIsDeveloperMode from '../../../../hooks/useIsDeveloperMode';
import useLocale from '../../../../hooks/useLocale';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import useStores from '../../../../hooks/useStores';
import useUserFlowTrigger, { UserFlow } from '../../../../hooks/useUserFlowTrigger';
import '../../../../shared/SharedStyles.scss';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZURLs } from '../../../../utils/ZConst';
import ZEDInput from '../../../editor/ZEDInput';
import { ProjectProgressStep } from '../PublishProgressTab';
import ConfigButton from '../shared/ConfigButton';
import LeftDrawerTitle from '../shared/LeftDrawerTitle';
import SharedStyles, { GridGutter, GridWidth } from './SharedStyles';
import i18n from './WechatAuthorization.i18n.json';
import { Button, Col, Form, Modal, Row } from '../../../../zui';
import cssModule from './WechatAuthorization.module.scss';

export default observer(function WechatAuthorization(): NullableReactElement {
  const client = useApolloClient();
  const uft = useUserFlowTrigger();

  const isDeveloperMode = useIsDeveloperMode();
  const { projectExId, projectConfig } = useProjectDetails();
  const wechatAppConfig = projectConfig?.wechatAppConfig;
  const { localizedContent: content } = useLocale(i18n);
  const { wechatAppId, wechatAppSecret } = wechatAppConfig ?? {};
  const { projectStore } = useStores();
  const { progressStep: currentStep } = projectStore.deploymentStatus ?? {};

  const handleSubmission = (value: Record<string, any>) => {
    const config = {
      wechatAppConfig: {
        wechatAppId: value.appId ?? null,
        wechatAppSecret: value.appSecret ?? null,
      },
    };

    uft(UserFlow.UPDATE_PROJECT_CONFIGURATION)(config);
  };

  const renderAuthorization = () => (
    <Form onFinish={handleSubmission}>
      <Row gutter={GridGutter.default} justify="space-between">
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle type="subtitle" textStyle={styles.text}>
            {content.label.appId}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          <Form.Item name="appId" initialValue={wechatAppId} noStyle>
            <ZEDInput />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={GridGutter.default} justify="space-between">
        <Col span={GridWidth.ONE_THIRD}>
          <LeftDrawerTitle type="subtitle" textStyle={styles.text}>
            {content.label.appSecret}
          </LeftDrawerTitle>
        </Col>
        <Col span={GridWidth.TWO_THIRDS}>
          <Form.Item name="appSecret" initialValue={wechatAppSecret} noStyle>
            <ZEDInput />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={GridGutter.default} justify="end">
        <Col span={GridWidth.TWO_THIRDS}>
          <Form.Item name="submit" noStyle>
            <ConfigButton zedType="primary" htmlType="submit">
              {content.button.save}
            </ConfigButton>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  return (
    <div style={SharedStyles.container} className={cssModule.container}>
      <Row gutter={GridGutter.default} justify="space-between">
        <Col>
          <LeftDrawerTitle textStyle={styles.text} containerStyle={styles.width}>
            {content.title}
          </LeftDrawerTitle>
        </Col>
        <Col>
          {wechatAppConfig ? (
            <ConfigButton
              zedType="outline"
              onClick={() => {
                Modal.confirm({
                  content: content.notification.authorized,
                  okText: content.option.ok,
                  cancelText: content.option.cancel,
                  maskClosable: true,
                  onOk: () => getPreAuthPageUrl(client, projectExId),
                });
              }}
              icon={<WechatOutlined />}
              style={styles.width}
            >
              {content.label.authorized}
            </ConfigButton>
          ) : (
            <ConfigButton
              zedType="outline"
              onClick={() => getPreAuthPageUrl(client, projectExId)}
              icon={<WechatOutlined />}
              style={styles.width}
            >
              {content.label.authorization}
            </ConfigButton>
          )}
        </Col>
      </Row>
      {isDeveloperMode ? renderAuthorization() : <></>}
      <Button
        type="link"
        onClick={() => getWechatMiniAppLink(client)}
        target="_blank"
        rel="noopener noreferrer"
        block
        disabled={currentStep !== ProjectProgressStep.READY}
      >
        {content.button.wechatMiniAppPackageDownload}
      </Button>
      <Button
        type="link"
        href={ZURLs.WECHAT_REGISTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        block
      >
        {content.button.wechatRegistration}
      </Button>
    </div>
  );
});
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'block',
  },
  width: {
    width: 'auto',
  },
  text: {
    fontSize: '14px',
  },
};
