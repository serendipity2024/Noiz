/* eslint-disable import/no-default-export */
import { Button, Col, Dropdown, Form, Modal, Row, Select, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  QuestionCircleOutlined,
  PlusOutlined,
  MoreOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import Spin from '../../shared/assets/editor/spin.svg';
import useLocale from '../../hooks/useLocale';
import i18n from './ZSmsTemplateSetting.i18n.json';
import {
  FetchAliyunSmsSignatureStatus,
  FetchAliyunSmsSignatureStatusVariables,
} from '../../graphQL/__generated__/FetchAliyunSmsSignatureStatus';
import GQL_FETCH_ALIYUN_SMS_SIGNATURE_STATUS from '../../graphQL/fetchAliyunSmsSignatureStatus';
import useProjectDetails from '../../hooks/useProjectDetails';
import { ProjectConfig } from '../../mobx/stores/ProjectStore';
import useUserFlowTrigger, { UserFlow } from '../../hooks/useUserFlowTrigger';
import { GridGutter, GridWidth } from '../side-drawer-tabs/left-drawer/project-config/SharedStyles';
import LeftDrawerTitle from '../side-drawer-tabs/left-drawer/shared/LeftDrawerTitle';
import { ZURLs } from '../../utils/ZConst';
import styleModule from './ZSmsTemplateSetting.module.scss';
import ConfigButton from '../side-drawer-tabs/left-drawer/shared/ConfigButton';
import { UploadFileIdInput } from '../side-drawer-tabs/right-drawer/shared/UploadFile';
import ZEDInput, { ZEDInputTextArea } from './ZEDInput';
import {
  AliyunSmsSignSourceType,
  AliyunSmsStatus,
  AliyunSmsTemplateType,
} from '../../graphQL/__generated__/globalTypes';
import useStores from '../../hooks/useStores';
import ZSpinningComponent from '../base/ZSpinningComponent';
import { FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus } from '../../graphQL/__generated__/FetchAliyunSmsTemplatesStatus';
import { newTemplateCode } from '../../mobx/stores/SmsTemplateStore';
import ZNotification from '../../utils/notifications/ZNotifications';
import { MenuClickEventInfo } from '../../zui/Menu';
import { ZMenu } from '../../zui';

export interface newSmsTemplates {
  templateCode: string;
  templateName: string;
  templateType: string;
  templateDescription: string;
  templateContent: string;
  createdAt: Date;
  templateStatus: 'NOT_UPLOADED';
  reason: string;
}

export default observer(function ZSmsTemplateSetting(): ReactElement {
  const LOADING_SPIN_SPEED = 1.2;
  const uft = useUserFlowTrigger();
  const { projectExId, projectConfig } = useProjectDetails();
  const { localizedContent } = useLocale(i18n);
  const [modalTitle, setModalTitle] = useState<string>(localizedContent.title);
  const [SmsConfigModelVisible, setSmsConfigModelVisible] = useState<boolean>(false);
  const { smsTemplateStore } = useStores();
  const [selectedTemplate, setSelectedTemplate] = useState<
    FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus | newSmsTemplates
  >();
  const [modalLoadingStatus, setModalLoadingStatus] = useState<boolean>(true);
  const [modifyLoadingStatus, setModifyLoadingStatus] = useState<boolean>(true);
  const [templateList, setTemplateList] = useState<
    (FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus | newSmsTemplates)[] | undefined
  >([]);

  const updateConfiguration: (config: Partial<ProjectConfig>) => void = uft(
    UserFlow.UPDATE_PROJECT_CONFIGURATION
  );

  const { data: signatureStatus, refetch } = useQuery<
    FetchAliyunSmsSignatureStatus,
    FetchAliyunSmsSignatureStatusVariables
  >(GQL_FETCH_ALIYUN_SMS_SIGNATURE_STATUS, {
    variables: {
      projectExId,
    },
    skip: !projectExId,
    onCompleted: () => setModalLoadingStatus(false),
  });

  useEffect(() => {
    setTemplateList(smsTemplateStore.smsTemplatesList);
  }, [smsTemplateStore.smsTemplatesList]);

  useEffect(() => {
    if (templateList && templateList.length !== 0) {
      setSelectedTemplate(templateList[0]);
    }
    if (templateList !== undefined) {
      setModifyLoadingStatus(false);
    } else {
      setModifyLoadingStatus(true);
    }
  }, [templateList]);

  const handleUpdateSmsConfig = (aliyunSmsConfig: any) => {
    updateConfiguration({
      aliyunSmsConfig,
    });
    refetch();
  };

  const renderSmsConfig = (): React.ReactNode => {
    if (
      !signatureStatus ||
      signatureStatus.aliyunSmsSignatureStatus?.signStatus !== AliyunSmsStatus.APPROVED
    ) {
      return renderSignConfig();
    }
    return renderTemplateModify();
  };

  const addNewTemplate = (): void => {
    if (
      templateList &&
      !templateList.find((template) => template.templateCode === newTemplateCode)
    ) {
      setTemplateList([
        {
          templateCode: newTemplateCode,
          templateName: '',
          templateType: '',
          templateDescription: '',
          templateContent: '',
          createdAt: new Date(),
          templateStatus: 'NOT_UPLOADED',
          reason: '',
        },
        ...templateList,
      ]);
    } else {
      const notif = new ZNotification(localizedContent);
      notif.sendTextNotification(localizedContent.createTemplateNotAllowed, 'warning');
    }
  };

  const renderTemplateModify = () => {
    if (modalLoadingStatus)
      return (
        <ZSpinningComponent speed={LOADING_SPIN_SPEED}>
          <img alt="" src={Spin} />
        </ZSpinningComponent>
      );
    if (templateList && templateList.length <= 0) {
      return (
        <div className={styleModule.smsTemplateSettingEmptyTemplates}>
          {localizedContent.templatesConfig.noTemplates},
          <span
            className={styleModule.smsTemplateSettingEmptyTemplatesFont}
            onClick={() => {
              addNewTemplate();
            }}
          >
            {localizedContent.templatesConfig.clickHere}
          </span>
        </div>
      );
    }
    return (
      <div className={styleModule.smsTemplateModifyContainer}>
        <div className={styleModule.smsTemplateLeftContainer}>{renderTemplatesList()}</div>
        <div
          key={selectedTemplate?.templateCode}
          className={styleModule.smsTemplateDetailContainer}
        >
          {renderTemplateDetail()}
        </div>
      </div>
    );
  };

  const renderCardExtra = (
    object: FetchAliyunSmsTemplatesStatus_aliyunSmsTemplatesStatus | newSmsTemplates
  ) => {
    const menu = (
      <ZMenu
        items={[
          {
            key: 'permission',
            icon: <DeleteOutlined />,
            onClick: (param: MenuClickEventInfo) => {
              param.domEvent.stopPropagation();
              smsTemplateStore.deleteTemplate(object.templateCode);
            },
            title: localizedContent.delete,
          },
        ]}
      />
    );
    if (object === selectedTemplate)
      return (
        <Dropdown overlay={menu} trigger={['click', 'hover']}>
          <MoreOutlined
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Dropdown>
      );
    return null;
  };

  const renderTemplatesList = (): React.ReactNode => {
    if (modifyLoadingStatus)
      return (
        <ZSpinningComponent speed={LOADING_SPIN_SPEED}>
          <img alt="" src={Spin} />
        </ZSpinningComponent>
      );
    return (
      templateList && (
        <>
          <div className={styleModule.smsTemplateLeftHeader}>
            <Row align="middle" justify="space-between" gutter={GridGutter.default}>
              <Col>
                <div>{localizedContent.templatesConfig.smsTemplatesHeader}</div>
              </Col>
              <Col>
                <PlusOutlined
                  className={styleModule.smsTemplateAddNewIcon}
                  onClick={() => {
                    addNewTemplate();
                  }}
                />
              </Col>
            </Row>
          </div>
          <div
            className={styleModule.smsTemplateListContainer}
            id={styleModule.smsTemplateScrollBar}
          >
            {templateList
              .filter((element) => element)
              .map((object) => {
                const createAt = new Date(object.createdAt);
                const displayDate =
                  `${createAt.getFullYear()}-${createAt.getMonth()}-${createAt.getDate()}` +
                  ` ${createAt.getHours()}:${createAt.getMinutes()}:${createAt.getSeconds()}`;
                return (
                  <div
                    className={
                      selectedTemplate === object
                        ? styleModule.smsTemplateListCardSelected
                        : styleModule.smsTemplateListCard
                    }
                    key={object.templateCode}
                    onClick={() => {
                      setSelectedTemplate(object);
                    }}
                  >
                    <Row align="middle" justify="space-between">
                      <Col span={24}>
                        <div className={styleModule.smsTemplateListCardtitleContainer}>
                          <span
                            className={
                              selectedTemplate === object
                                ? styleModule.smsTemplateListCardTitleSelected
                                : styleModule.smsTemplateListCardTitle
                            }
                          >
                            {object.templateName === ''
                              ? localizedContent.templatesConfig.newTemplate
                              : object.templateName}
                          </span>
                          <span
                            className={
                              selectedTemplate === object
                                ? styleModule.smsTemplateListCardTimeSelected
                                : styleModule.smsTemplateListCardTime
                            }
                          >
                            {displayDate}
                          </span>
                        </div>
                      </Col>
                      <div className={styleModule.hideDiv}>
                        <Col>{renderCardExtra(object)}</Col>
                      </div>
                    </Row>
                  </div>
                );
              })}
          </div>
        </>
      )
    );
  };

  const renderTemplateDetail = () => {
    if (modifyLoadingStatus)
      return (
        <ZSpinningComponent speed={LOADING_SPIN_SPEED}>
          <img alt="" src={Spin} />
        </ZSpinningComponent>
      );
    return (
      <Form
        initialValues={selectedTemplate}
        onFinish={(values) => {
          setTemplateList(undefined);
          smsTemplateStore.uploadTemplate({ ...values }, selectedTemplate?.templateCode);
        }}
        labelAlign="left"
        layout="vertical"
        colon={false}
      >
        <div className={styleModule.smsTemplateDetail} id={styleModule.smsTemplateScrollBar}>
          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.templatesConfig.smsTemplateDetails.smsTemplateName}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name="templateName"
            label={localizedContent.templatesConfig.smsTemplateDetails.smsTemplateName}
          >
            <ZEDInput
              className={styleModule.settingInput}
              maxLength={localizedContent.templatesConfig.smsTemplateDetails.smsTemplateNameSize}
              minLength={2}
              placeholder={
                localizedContent.templatesConfig.smsTemplateDetails.smsTemplateNamePlaceholder
              }
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.templatesConfig.smsTemplateDetails.smsTemplateType}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name="templateType"
            label={localizedContent.templatesConfig.smsTemplateDetails.smsTemplateType}
          >
            <Select
              className={styleModule.smsTemplateSettingSelector}
              dropdownMatchSelectWidth={false}
              placeholder={
                localizedContent.templatesConfig.smsTemplateDetails.smsTemplateTypePlaceholder
              }
            >
              {Object.values(AliyunSmsTemplateType).map((value) => (
                <Select.Option key={value} value={value}>
                  {localizedContent.templatesConfig.templateType[value]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.templatesConfig.smsTemplateDetails.smsTemplateDescription}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name="templateDescription"
            label={localizedContent.templatesConfig.smsTemplateDetails.smsTemplateDescription}
          >
            <ZEDInput
              className={styleModule.settingInput}
              placeholder={
                localizedContent.templatesConfig.smsTemplateDetails
                  .smsTemplateDescriptionPlaceholder
              }
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.templatesConfig.smsTemplateDetails.smsTemplateContent}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name="templateContent"
            label={
              <label>
                {localizedContent.templatesConfig.smsTemplateDetails.smsTemplateContent}
                <Tooltip title={localizedContent.templatesConfig.contentTooltip}>
                  <QuestionCircleOutlined className={styleModule.tooltipIcon} />
                </Tooltip>
              </label>
            }
          >
            <ZEDInputTextArea
              autoSize
              className={styleModule.textAreaInput}
              placeholder={
                localizedContent.templatesConfig.smsTemplateDetails.smsTemplateContentPlaceholder
              }
            />
          </Form.Item>

          <div
            className={styleModule.whiteFont}
            hidden={
              selectedTemplate && selectedTemplate.templateStatus !== AliyunSmsStatus.AUDIT_FAILED
            }
          >
            {localizedContent.templatesConfig.smsTemplateDetails.smsTemplateReason}
          </div>
          <div
            className={styleModule.auditReason}
            hidden={
              selectedTemplate && selectedTemplate.templateStatus !== AliyunSmsStatus.AUDIT_FAILED
            }
          >
            {selectedTemplate?.reason}
          </div>
        </div>
        <div className={styleModule.smsTemplateDetailFooter}>
          <Row align="middle" justify="space-between" gutter={GridGutter.default}>
            <Col>
              <label className={styleModule.whiteFont}>
                {localizedContent.auditStatus}
                {': '}
                {selectedTemplate?.templateStatus
                  ? localizedContent.statuses[selectedTemplate?.templateStatus]
                  : localizedContent.notUploaded}
              </label>
            </Col>
            <Col>
              <Form.Item noStyle>
                <ConfigButton
                  zedType="primary"
                  disabledstyle={styles.disabledButtonStyle}
                  htmlType="submit"
                  disabled={
                    selectedTemplate &&
                    selectedTemplate.templateStatus !== AliyunSmsStatus.AUDIT_FAILED &&
                    selectedTemplate.templateStatus !== 'NOT_UPLOADED'
                  }
                >
                  {selectedTemplate?.templateStatus === 'NOT_UPLOADED'
                    ? localizedContent.templatesConfig.upload
                    : localizedContent.templatesConfig.reUpload}
                </ConfigButton>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const renderSignConfig = () => {
    return (
      <div className={styleModule.signSettingContainer}>
        <Form
          name="sms"
          onFinish={handleUpdateSmsConfig}
          initialValues={projectConfig?.aliyunSmsConfig ?? undefined}
          labelCol={{ span: GridWidth.ONE_THIRD }}
          labelAlign="left"
          layout="vertical"
          colon={false}
        >
          <Form.Item
            name="powerOfAttorneyImageExId"
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.signatureConfig.powerOfAttorneyImage}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            label={
              <label>
                {localizedContent.signatureConfig.powerOfAttorneyImage}
                <Tooltip
                  title={
                    <Button type="link" href={ZURLs.ALIYUN_ATTORNEY}>
                      {localizedContent.signatureConfig.powerOfAttorneyTemplate}
                    </Button>
                  }
                >
                  <QuestionCircleOutlined className={styleModule.tooltipIcon} />
                </Tooltip>
              </label>
            }
          >
            <UploadFileIdInput />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.signatureConfig.smsSignature}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name={['signature', 'signature']}
            label={localizedContent.signatureConfig.smsSignature}
          >
            <ZEDInput className={styleModule.settingInput} maxLength={12} minLength={2} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.signatureConfig.smsSource}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name={['signature', 'signSource']}
            label={<label>{localizedContent.signatureConfig.smsSource}</label>}
          >
            <Select dropdownMatchSelectWidth={false}>
              {Object.values(AliyunSmsSignSourceType).map((value) => (
                <Select.Option key={value} value={value}>
                  {localizedContent.signatureConfig.smsSources[value]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message:
                  `${localizedContent.signatureConfig.smsDescription}` +
                  `${localizedContent.templatesConfig.smsTemplateDetails.isRequired}`,
              },
            ]}
            name={['signature', 'description']}
            label={<label>{localizedContent.signatureConfig.smsDescription}</label>}
          >
            <ZEDInput className={styleModule.settingInput} />
          </Form.Item>

          <Form.Item className={styleModule.whiteFont}>
            <Row align="middle" justify="space-between" gutter={GridGutter.default}>
              <Col>
                <label>
                  {localizedContent.signatureConfig.smsSignatureStatus}
                  {':  '}
                  {signatureStatus?.aliyunSmsSignatureStatus?.signStatus
                    ? localizedContent.statuses[signatureStatus.aliyunSmsSignatureStatus.signStatus]
                    : localizedContent.notUploaded}
                </label>
              </Col>
              <Col>
                <ConfigButton
                  disabledstyle={styles.disabledButtonStyle}
                  zedType="outline"
                  htmlType="submit"
                  disabled={
                    signatureStatus &&
                    signatureStatus.aliyunSmsSignatureStatus?.signStatus ===
                      AliyunSmsStatus.IN_REVIEW
                  }
                >
                  {signatureStatus?.aliyunSmsSignatureStatus?.signStatus
                    ? localizedContent.templatesConfig.reUpload
                    : localizedContent.templatesConfig.upload}
                </ConfigButton>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    );
  };
  return (
    <>
      <div
        className={styleModule.smsTemplateSettingButton}
        onClick={() => {
          if (signatureStatus?.aliyunSmsSignatureStatus?.signStatus !== AliyunSmsStatus.APPROVED) {
            setModalTitle(`${localizedContent.title}-${localizedContent.signatureConfig.subtitle}`);
          } else {
            smsTemplateStore.fetchTemplates();
            setModalTitle(`${localizedContent.title}-${localizedContent.templatesConfig.subtitle}`);
          }
          setSmsConfigModelVisible(true);
        }}
      >
        <LeftDrawerTitle>{localizedContent.title}</LeftDrawerTitle>
      </div>
      <Modal
        className={styleModule.smsTemplateSetting}
        title={modalTitle}
        mask={false}
        centered
        destroyOnClose
        visible={SmsConfigModelVisible}
        footer={null}
        width="700px"
        onCancel={() => {
          setTemplateList(undefined);
          setSmsConfigModelVisible(false);
        }}
      >
        {renderSmsConfig()}
      </Modal>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  disabledButtonStyle: {
    background: '#4E4F4F',
  },
};
