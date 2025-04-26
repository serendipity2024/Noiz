/* eslint-disable import/no-default-export */
import { MailOutlined, PayCircleOutlined } from '@ant-design/icons';
import { useApolloClient, useQuery } from '@apollo/client';
import _ from 'lodash';
import React, { CSSProperties, ReactElement, ReactNode, useEffect, useState } from 'react';
import { GQL_GET_ALL_CLOUD_CONFIGURATIONS } from '../../../graphQL/getAllCloudConfigurations';
import { getPreAuthPageUrl } from '../../../graphQL/getPreAuthPageUrl';
import { getAllCloudConfigurations } from '../../../graphQL/__generated__/getAllCloudConfigurations';
import { EmailProvider } from '../../../graphQL/__generated__/globalTypes';
import useIsDeveloperMode from '../../../hooks/useIsDeveloperMode';
import useLocale, { Locale, LocaleSpelloutMap } from '../../../hooks/useLocale';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import useProjectDetails from '../../../hooks/useProjectDetails';
import useUserFlowTrigger, { UserFlow } from '../../../hooks/useUserFlowTrigger';
import { ProjectConfig } from '../../../mobx/stores/ProjectStore';
import '../../../shared/SharedStyles.scss';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import { Col, Form, Row, Select, Space } from '../../../zui';
import ZEDInput, { ZEDPasswordInput } from '../../editor/ZEDInput';
import ZSmsTemplateSetting from '../../editor/ZSmsTemplateSetting';
import { UploadType, UploadFile } from '../right-drawer/shared/UploadFile';
import PlaceholderTab from './PlaceholderTab';
import { GridGutter, GridWidth } from './project-config/SharedStyles';
import i18n from './SettingsTab.i18n.json';
import ConfigButton from './shared/ConfigButton';
import LeftDrawerButton from './shared/LeftDrawerButton';
import LeftDrawerTitle from './shared/LeftDrawerTitle';

export default function SettingsTab(): ReactElement {
  const uft = useUserFlowTrigger();
  const client = useApolloClient();
  const isDeveloperMode = useIsDeveloperMode();
  const { localizedContent: content, locale, setLocale } = useLocale(i18n);
  const { projectExId, projectName, projectConfig, hasBindCloudConfiguration } =
    useProjectDetails();
  const [projectNameState, setProjectNameState] = useState(projectName);
  const displayNotification = useNotificationDisplay();
  const updateConfiguration: (config: Partial<ProjectConfig>) => void = uft(
    UserFlow.UPDATE_PROJECT_CONFIGURATION
  );

  useEffect(() => {
    setProjectNameState(projectName);
  }, [projectName]);

  const { data: allCloudConfigurations } = useQuery<getAllCloudConfigurations>(
    GQL_GET_ALL_CLOUD_CONFIGURATIONS
  );

  if (!projectExId || !projectName) return <PlaceholderTab text="Loading..." />;

  const handleOnSave = () => {
    const name = projectNameState;

    uft(UserFlow.UPDATAE_PROJECT_DETAILS)({ projectName: name }, () => {
      displayNotification('PROJECT_DETAILS_SAVED');
    });
  };

  const handleUpdateBusinessLicenseImageId = (image: string) => {
    updateConfiguration({ businessLicenseImageExId: image });
  };

  const handleUpdateCloudConfig = (values: any) => {
    updateConfiguration({
      cloudConfigurationExId: values.cloudConfigurationExId,
    });
  };

  const handleUpdateEmailConfig = (emailConfig: any) => {
    updateConfiguration({
      emailConfig,
    });
  };

  const handleUpdateWechatPaymentConfig = (wechatPay: any) => {
    return projectConfig?.wechatAppConfig?.wechatAppId
      ? updateConfiguration({
          wechatAppConfig: { ...projectConfig?.wechatAppConfig, ...wechatPay },
        })
      : getPreAuthPageUrl(client, projectExId);
  };

  const renderInputRow = (
    title: string,
    placeholder: string,
    state: [any, (s: string) => void],
    extraStyle: CSSProperties = {}
  ) => (
    <div style={{ ...styles.inputRow, ...extraStyle }}>
      <span style={styles.inputText}>{title}</span>
      <ZEDInput
        style={styles.input}
        value={state[0]}
        onChange={(e: any) => state[1](e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelectOption = (loc: Locale): ReactNode => {
    const selectedStyle = loc === locale ? styles.selectedOption : null;
    const style = { ...styles.selectOption, ...selectedStyle };
    const onClick = () => setLocale(loc as Locale);
    return (
      <div key={loc} style={style} onClick={onClick}>
        {LocaleSpelloutMap[loc]}
      </div>
    );
  };
  const renderSelector = () => (
    <div style={{ ...styles.inputRow, ...styles.firstInput }}>
      <span style={styles.inputText}>{content.editor.language}</span>
      <div style={styles.selectContainer}>
        {Object.keys(Locale).map((loc) => renderSelectOption(loc as Locale))}
      </div>
    </div>
  );

  const renderProjectCloudConfig = () => (
    <Form
      name="cloud"
      onFinish={handleUpdateCloudConfig}
      labelCol={{ span: GridWidth.ONE_THIRD }}
      labelAlign="left"
      colon={false}
      wrapperCol={{ span: GridWidth.TWO_THIRDS }}
      style={{ width: '100%' }}
    >
      <Row align="middle" justify="space-between" gutter={GridGutter.default}>
        <Col>
          <LeftDrawerTitle>{content.config.cloud}</LeftDrawerTitle>
        </Col>
        <Col>
          <Form.Item noStyle>
            <ConfigButton zedType="outline" htmlType="submit">
              {content.config.save}
            </ConfigButton>
          </Form.Item>
        </Col>
      </Row>
      {allCloudConfigurations && (
        <Form.Item
          name="cloudConfigurationExId"
          label={<label style={styles.labelText}>{content.config.cloudProvider}</label>}
        >
          <Select className="primary-input">
            {(allCloudConfigurations.allCloudConfigurations || []).map((item) => {
              return (
                item && (
                  <Select.Option key={item.exId} value={item.exId}>
                    {item.name}
                  </Select.Option>
                )
              );
            })}
          </Select>
        </Form.Item>
      )}
    </Form>
  );

  const renderEmailConfig = () => (
    <Form
      name="email"
      onFinish={handleUpdateEmailConfig}
      initialValues={projectConfig?.emailConfig ?? undefined}
      labelCol={{ span: GridWidth.ONE_THIRD }}
      labelAlign="left"
      colon={false}
      wrapperCol={{ span: GridWidth.TWO_THIRDS }}
    >
      <Row align="middle" justify="space-between" gutter={GridGutter.default}>
        <Col>
          <LeftDrawerTitle>{content.config.email}</LeftDrawerTitle>
        </Col>
        <Col>
          <Form.Item noStyle>
            <ConfigButton
              zedType="outline"
              htmlType="submit"
              icon={<MailOutlined />}
              style={styles.autoWidth}
            >
              {content.config.save}
            </ConfigButton>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="emailSender"
        label={<label style={styles.labelText}>{content.config.emailAddress}</label>}
      >
        <ZEDInput />
      </Form.Item>
      <Form.Item
        name="emailProvider"
        label={<label style={styles.labelText}>{content.config.emailProvider}</label>}
      >
        <Select className="primary-input">
          {Object.values(EmailProvider).map((value) => (
            <Select.Option key={value} value={value}>
              {content.config.emailProviders[value]}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="emailPassword"
        label={<label style={styles.labelText}>{content.config.emailPassword}</label>}
        labelCol={{ span: GridWidth.ONE_THIRD }}
        wrapperCol={{ span: GridWidth.TWO_THIRDS }}
      >
        <ZEDPasswordInput />
      </Form.Item>
    </Form>
  );

  const renderWechatPaymentConfig = () => (
    <Form
      onFinish={handleUpdateWechatPaymentConfig}
      initialValues={projectConfig?.wechatAppConfig ?? undefined}
      labelCol={{ span: GridWidth.ONE_THIRD }}
      labelAlign="left"
      colon={false}
      wrapperCol={{ span: GridWidth.TWO_THIRDS }}
    >
      <Row align="middle" justify="space-between" gutter={GridGutter.default}>
        <Col>
          <LeftDrawerTitle>{content.config.wechatPay}</LeftDrawerTitle>
        </Col>
        <Col>
          <Form.Item noStyle>
            <ConfigButton
              zedType="outline"
              htmlType="submit"
              icon={<PayCircleOutlined />}
              style={styles.autoWidth}
            >
              {content.config.save}
            </ConfigButton>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="wechatPaymentMerchantId"
        label={<label style={styles.labelText}>{content.config.wechatMerchantId}</label>}
      >
        <ZEDInput />
      </Form.Item>
      <Form.Item
        name="wechatPaymentMerchantKey"
        label={<label style={styles.labelText}>{content.config.wechatMerchantKey}</label>}
      >
        <ZEDInput />
      </Form.Item>
      <Form.Item
        name="wechatPaymentNotifyUrl"
        label={<label style={styles.labelText}>{content.config.wechatPaymentNotifyUrl}</label>}
      >
        <ZEDInput disabled />
      </Form.Item>
    </Form>
  );

  return (
    <Space direction="vertical" style={styles.container} size="large">
      <div>
        <LeftDrawerTitle>{content.project.title}</LeftDrawerTitle>
        <div style={styles.content}>
          {renderInputRow(
            content.project.name,
            'project name',
            [projectNameState, setProjectNameState],
            styles.firstInput
          )}
          <LeftDrawerButton
            type="primary"
            text={content.project.save}
            handleOnClick={handleOnSave}
          />
        </div>
        {!hasBindCloudConfiguration && isDeveloperMode && (
          <div style={styles.content}>{renderProjectCloudConfig()}</div>
        )}
        <div style={styles.content}>{renderEmailConfig()}</div>
        {!_.isNil(projectConfig?.businessLicenseImageExId) && <ZSmsTemplateSetting />}
        <div style={styles.content}>{renderWechatPaymentConfig()}</div>
      </div>
      <div>
        <LeftDrawerTitle>{content.config.businessLicense}</LeftDrawerTitle>
        <UploadFile
          uploadType={UploadType.IMAGE}
          fileExId={projectConfig?.businessLicenseImageExId ?? undefined}
          uploadFileResult={(result) => {
            handleUpdateBusinessLicenseImageId(result.exId);
          }}
        />
      </div>
      <div>
        <LeftDrawerTitle>{content.editor.title}</LeftDrawerTitle>
        <div style={styles.content}>{renderSelector()}</div>
      </div>
    </Space>
  );
}

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
  inputRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: '20px',
    width: '100%',
  },
  inputText: {
    color: ZThemedColors.ACCENT,
    fontSize: '14px',
  },
  input: {
    marginTop: 12,
  },
  firstInput: {
    marginTop: 0,
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '6px',
    width: '100%',
    height: '38px',
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    overflow: 'hidden',
  },
  selectOption: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: ZColors.WHITE,
    cursor: 'pointer',
  },
  selectedOption: {
    backgroundColor: ZThemedColors.ACCENT,
  },
  labelText: {
    color: ZThemedColors.PRIMARY_TEXT,
    whiteSpace: 'normal',
  },
  autoWidth: {
    width: 'auto',
  },
  title: {
    fontSize: '16px',
    color: ZThemedColors.ACCENT,
  },
};
