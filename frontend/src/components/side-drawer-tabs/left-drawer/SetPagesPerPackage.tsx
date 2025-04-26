/* eslint-disable import/no-default-export */
import React, { CSSProperties } from 'react';
import useLocale from '../../../hooks/useLocale';
import '../../../shared/SharedStyles.scss';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import ZEDInput from '../../editor/ZEDInput';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import SharedStyles, { GridGutter, GridWidth } from './project-config/SharedStyles';
import i18n from './SetPagesPerPackage.i18n.json';
import useStores from '../../../hooks/useStores';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import ConfigButton from './shared/ConfigButton';
import { Col, Form, Row } from '../../../zui';
import { useConfiguration } from '../../../hooks/useConfiguration';

export default function SetPagesPerPackage(): NullableReactElement {
  const { coreStore } = useStores();
  const { tabBarSetting } = useConfiguration();
  const { localizedContent: content } = useLocale(i18n);
  const displayNotification = useNotificationDisplay();

  const { pageCountInMainPackage, pageCountInSubPackage } = coreStore.wechatConfiguration;

  const { wechatRootMRefs } = coreStore;
  let mainPageCount = 0;
  for (let i = 0, len = wechatRootMRefs.length; i < len; ++i) {
    const screenMRef = wechatRootMRefs[i];
    if (tabBarSetting) {
      let pageCount = 0;
      let initScreen = false;
      tabBarSetting.items.forEach((item) => {
        const itemMRef = item.screenMRef.effectiveValue;
        if (itemMRef === screenMRef) {
          pageCount++;
          initScreen = initScreen || itemMRef === coreStore.wechatConfiguration.initialScreenMRef;
        }
      });
      mainPageCount = pageCount + (initScreen ? 0 : 1);
      break;
    }
  }

  const packageReg = /[1-9][0-9]{0,1}/;

  const handleSubmission = (values: any) => {
    if (
      !packageReg.test(values.pageCountInMainPackage) ||
      !packageReg.test(values.pageCountInSubPackage)
    ) {
      displayNotification('CONFIG_PAGES_PACKAGE_NUMBER_FAILURE');
    } else if (values.pageCountInMainPackage < 1 || values.pageCountInSubPackage < 1) {
      displayNotification('CONFIG_PAGES_PACKAGE_NUMBER_FAILURE');
    } else if (values.pageCountInMainPackage < mainPageCount) {
      displayNotification('CONFIG_PAGES_PACKAGE_NUMBER_FAILURE');
    } else {
      coreStore.updateWechatConfiguration({
        pageCountInMainPackage: parseInt(values.pageCountInMainPackage as string, 10),
        pageCountInSubPackage: parseInt(values.pageCountInSubPackage as string, 10),
      });
      displayNotification('CONFIG_PAGES_PACKAGE_NUMBER_SUCCESS');
    }
  };
  return (
    <div style={SharedStyles.container}>
      <Row gutter={GridGutter.default} align="middle" justify="space-between">
        <Col>
          <LeftDrawerTitle textStyle={styles.label} containerStyle={styles.width}>
            {content.title}
          </LeftDrawerTitle>
        </Col>
      </Row>
      <Form onFinish={handleSubmission}>
        <Row gutter={GridGutter.default} justify="space-between">
          <Col span={GridWidth.ONE_THIRD}>
            <LeftDrawerTitle type="subtitle" textStyle={styles.text}>
              {content.label.pageCountInMainPackage}
            </LeftDrawerTitle>
          </Col>
          <Col span={GridWidth.TWO_THIRDS}>
            <Form.Item name="pageCountInMainPackage" initialValue={pageCountInMainPackage} noStyle>
              <ZEDInput />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={GridGutter.default} justify="space-between">
          <Col span={GridWidth.ONE_THIRD}>
            <LeftDrawerTitle type="subtitle" textStyle={styles.text}>
              {content.label.pageCountInSubPackage}
            </LeftDrawerTitle>
          </Col>
          <Col span={GridWidth.TWO_THIRDS}>
            <Form.Item name="pageCountInSubPackage" initialValue={pageCountInSubPackage} noStyle>
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
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  width: {
    width: 'auto',
  },
  label: {
    fontSize: '14px',
  },
};
