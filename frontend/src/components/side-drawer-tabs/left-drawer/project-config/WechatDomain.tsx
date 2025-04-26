/* eslint-disable import/no-default-export */
import { WechatOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import React, { CSSProperties } from 'react';
import { GQL_ADD_WEB_VIEW_DOMAIN } from '../../../../graphQL/wechatAPI';
import { AddWechatWebViewDomain } from '../../../../graphQL/__generated__/AddWechatWebViewDomain';
import useLocale from '../../../../hooks/useLocale';
import useLogger from '../../../../hooks/useLogger';
import useNotificationDisplay from '../../../../hooks/useNotificationDisplay';
import useProjectDetails from '../../../../hooks/useProjectDetails';
import '../../../../shared/SharedStyles.scss';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors, ZURLs } from '../../../../utils/ZConst';
import ZEDInput from '../../../editor/ZEDInput';
import ConfigButton from '../shared/ConfigButton';
import LeftDrawerTitle from '../shared/LeftDrawerTitle';
import SharedStyles, { GridGutter, GridWidth } from './SharedStyles';
import i18n from './WechatDomain.i18n.json';
import { Col, Form, Row } from '../../../../zui';

export default function WechatDomainWhiteList(): NullableReactElement {
  const { projectExId } = useProjectDetails();
  const logger = useLogger();
  const notif = useNotificationDisplay();

  const { localizedContent: content } = useLocale(i18n);
  const [addWebViewDomain] = useMutation(GQL_ADD_WEB_VIEW_DOMAIN, {
    onCompleted: (data) => {
      if ((data as AddWechatWebViewDomain).addWechatWebViewDomain) {
        notif('WECHAT_WEBVIEW_DOMAIN_ADD_SUCCESS');
      } else {
        notif('WECHAT_WEBVIEW_DOMAIN_ADD_FAILURE');
      }
    },
    onError: (error) => {
      notif('WECHAT_WEBVIEW_DOMAIN_ADD_FAILURE');
      logger.error('fail-to-add-wechat-webview-domain', error);
    },
  });

  const [form] = Form.useForm();

  const handleSubmission = (values: any) => {
    const { webviewDomain } = values;
    addWebViewDomain({
      variables: {
        projectExId,
        webViewDomainList: [webviewDomain],
      },
    });
    form.resetFields();
  };
  return (
    <div style={SharedStyles.container}>
      <Row gutter={GridGutter.default} align="middle" justify="space-between">
        <Col>
          <LeftDrawerTitle textStyle={styles.label} containerStyle={styles.width}>
            {content.title}
          </LeftDrawerTitle>
        </Col>
        <Col>
          <ConfigButton
            zedType="outline"
            href={ZURLs.WECHAT}
            target="_blank"
            icon={<WechatOutlined />}
            style={styles.width}
          >
            {content.label.url}
          </ConfigButton>
        </Col>
      </Row>

      <Form component={false} form={form} onFinish={handleSubmission}>
        <Row gutter={GridGutter.default} align="middle" justify="space-between">
          <Col span={GridWidth.ONE_THIRD}>
            <label style={styles.labelText}>{content.label.addDomain}</label>
          </Col>
          <Col span={GridWidth.TWO_THIRDS}>
            <Form.Item name="webviewDomain" noStyle>
              <ZEDInput onPressEnter={() => form.submit()} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  labelText: {
    color: ZThemedColors.PRIMARY_TEXT,
  },
  memberInput: {
    flex: 0.8,
  },
  width: {
    width: 'auto',
  },
  label: {
    fontSize: '14px',
  },
};
