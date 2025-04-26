/* eslint-disable import/no-default-export */
import React, { CSSProperties } from 'react';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useObserver } from 'mobx-react';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import i18n from './PublishConfigureTab.i18n.json';
import useLocale from '../../../hooks/useLocale';
import './PublishConfigureTab.scss';
import SharedStyles, { GridGutter, GridWidth } from './project-config/SharedStyles';
import { ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import WechatTesterConfig from './project-config/WechatTesterConfig';
import WechatAuthorization from './project-config/WechatAuthorization';
import SetPagesPerPackage from './SetPagesPerPackage';
import PublishProgressTab from './PublishProgressTab';
import AuditProgressTab from './AuditProgressTab';
import useStores from '../../../hooks/useStores';
import WechatSvg from '../../../shared/assets/icons/build-target/wechat.svg';
import H5Svg from '../../../shared/assets/icons/build-target/h5.svg';
import useUserFlowTrigger, { UserFlow } from '../../../hooks/useUserFlowTrigger';
import ConfigButton from './shared/ConfigButton';
import useProjectAuditDetails from '../../../hooks/useProjectAuditDetails';
import { AuditStatus } from '../../../graphQL/__generated__/globalTypes';
import { BuildTarget } from '../../../shared/data/BuildTarget';
import WechatDomain from './project-config/WechatDomain';
import useIsDeveloperMode from '../../../hooks/useIsDeveloperMode';
import { ZedSupportedPlatform } from '../../../models/interfaces/ComponentModel';
import { Checkbox, Col, Row, Space, Tabs } from '../../../zui';

export default function PublishConfigureTab(): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore, editorStore } = useStores();
  const { auditStatus, published } = useProjectAuditDetails();
  const utf = useUserFlowTrigger();
  const wechatEnabled = useObserver(
    () => !!coreStore.appConfiguration.buildTarget.find((target) => target === 'WECHAT_MINIPROGRAM')
  );
  const mobileWebEnabled = useObserver(
    () => !!coreStore.appConfiguration.buildTarget.find((target) => target === 'MOBILE_WEB')
  );

  const isDeveloperMode = useIsDeveloperMode();

  const wechatPublishConfigureTab = (
    <Tabs className="publishTab" tabPosition="left" type="card">
      <Tabs.TabPane
        tab={
          <Row justify="space-between" align="middle">
            <img src={WechatSvg} alt="wechat" />
            {content.tab.wechat}
            <Checkbox
              checked={wechatEnabled}
              onChange={(e: CheckboxChangeEvent) => {
                if (e.target.checked) {
                  coreStore.updateAppConfiguration({
                    buildTarget: [...coreStore.appConfiguration.buildTarget, 'WECHAT_MINIPROGRAM'],
                  });
                } else {
                  coreStore.updateAppConfiguration({
                    buildTarget: coreStore.appConfiguration.buildTarget.filter(
                      (value) => value !== 'WECHAT_MINIPROGRAM'
                    ),
                  });
                }
              }}
            />
          </Row>
        }
        key="wechat"
      >
        <div style={styles.innerContainer}>
          <Row justify="space-between" gutter={GridGutter.default}>
            <Col>
              <LeftDrawerTitle containerStyle={styles.width}>
                {content.subtitle.wechat}
              </LeftDrawerTitle>
            </Col>
            <Col>
              <ConfigButton
                zedType="primary"
                disabled={auditStatus !== AuditStatus.SUCCESS || published}
                onClick={utf(UserFlow.PUBLISH)}
                style={styles.width}
              >
                {content.button}
              </ConfigButton>
            </Col>
          </Row>
          <Row justify="space-between" gutter={GridGutter.default}>
            <Col span={GridWidth.HALF}>
              <Row gutter={GridGutter.default}>
                <Col span={GridWidth.ALL}>
                  <WechatTesterConfig />
                </Col>
              </Row>
              <Row gutter={GridGutter.default}>
                <Col span={GridWidth.ALL}>
                  <WechatAuthorization />
                </Col>
              </Row>
              <Row gutter={GridGutter.default}>
                <Col span={GridWidth.ALL}>
                  <SetPagesPerPackage />
                </Col>
              </Row>
            </Col>
            <Col span={GridWidth.HALF}>
              <Col span={GridWidth.ALL}>
                <AuditProgressTab />
              </Col>
              {isDeveloperMode ? (
                <Col span={GridWidth.ALL}>
                  <WechatDomain />
                </Col>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          <Row gutter={GridGutter.default}>
            <Col span={GridWidth.ALL}>
              <PublishProgressTab />
            </Col>
          </Row>
        </div>
      </Tabs.TabPane>
    </Tabs>
  );

  const mobileWebPublishConfigureTab = (
    <Tabs className="publishTab" tabPosition="left" type="card">
      <Tabs.TabPane
        tab={
          <Row justify="space-between" align="middle">
            <img src={H5Svg} alt="html5" />
            {content.tab.web}
            <Checkbox
              checked={mobileWebEnabled}
              onChange={(e: CheckboxChangeEvent) => {
                const buildTarget: BuildTarget[] = e.target.checked
                  ? [...coreStore.appConfiguration.buildTarget, 'MOBILE_WEB']
                  : coreStore.appConfiguration.buildTarget.filter(
                      (value) => value !== 'MOBILE_WEB'
                    );
                coreStore.updateAppConfiguration({ buildTarget });
              }}
            />
          </Row>
        }
        key="html5"
      >
        <div style={styles.innerContainer}>
          <Row gutter={GridGutter.default}>
            <Col span={GridWidth.ALL}>
              <PublishProgressTab />
            </Col>
          </Row>
        </div>
      </Tabs.TabPane>
    </Tabs>
  );

  return (
    <Space direction="vertical" size="large" style={SharedStyles.space}>
      <LeftDrawerTitle>{content.title}</LeftDrawerTitle>
      <div style={styles.container}>
        <LeftDrawerTitle containerStyle={styles.subtitle}>
          {content.subtitle.choice}
        </LeftDrawerTitle>
        {(() => {
          switch (editorStore.editorPlatform) {
            case ZedSupportedPlatform.WECHAT:
              return wechatPublishConfigureTab;
            case ZedSupportedPlatform.MOBILE_WEB:
              return mobileWebPublishConfigureTab;
            default:
              return null;
          }
        })()}
      </div>
    </Space>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.QUINARY_WITH_OPACITY,
    padding: '18px',
  },
  innerContainer: {
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.QUATERNARY,
    padding: '24px',
  },
  width: {
    width: 'auto',
  },
  subtitle: {
    marginBottom: '5px',
  },
};
