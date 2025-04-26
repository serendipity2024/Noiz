/* eslint-disable import/no-default-export */
import { WechatOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import React, { CSSProperties } from 'react';
import { GQL_ADD_WECHAT_TESTER } from '../../../../graphQL/wechatAPI';
import { BindTesterToWechatMiniProgram } from '../../../../graphQL/__generated__/BindTesterToWechatMiniProgram';
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
import i18n from './WechatTesterConfig.i18n.json';
import { Col, Form, Row } from '../../../../zui';

export default function WechatTesterConfig(): NullableReactElement {
  const { projectExId } = useProjectDetails();
  const logger = useLogger();
  const notif = useNotificationDisplay();

  const { localizedContent: content } = useLocale(i18n);
  const [bindTesterToWechatMiniProgram] = useMutation(GQL_ADD_WECHAT_TESTER, {
    onCompleted: (data) => {
      if ((data as BindTesterToWechatMiniProgram).bindTesterToWechatMiniProgram) {
        notif('WECHAT_TESTER_ADD_SUCCESS');
      } else {
        notif('WECHAT_TESTER_ADD_FAILURE');
      }
    },
    onError: (error) => {
      notif('WECHAT_TESTER_ADD_FAILURE');
      logger.error('fail-to-add-wechat-tester', error);
    },
  });

  const [form] = Form.useForm();

  const handleSubmission = (values: any) => {
    const { wechatId } = values;
    bindTesterToWechatMiniProgram({
      variables: {
        projectExId,
        wechatId,
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

      <Form form={form} onFinish={handleSubmission}>
        <Row gutter={GridGutter.default} align="middle" justify="space-between">
          <Col span={GridWidth.ONE_THIRD}>
            <label style={styles.labelText}>{content.label.addMember}</label>
          </Col>
          <Col span={GridWidth.TWO_THIRDS}>
            <Form.Item name="wechatId" noStyle>
              <ZEDInput onPressEnter={() => form.submit()} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={GridGutter.default} justify="end">
          <Col span={GridWidth.TWO_THIRDS}>
            <Form.Item name="submit" noStyle>
              <ConfigButton zedType="primary" htmlType="submit">
                {content.button.add}
              </ConfigButton>
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
