import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Modal, Button, Divider, Image, Space, Popover } from '../../zui';
import { GetProjectTemplate_projectTemplates_edges_node } from '../../graphQL/__generated__/GetProjectTemplate';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import cssModule from './TemplateDetail.module.scss';
import { ProjectCreator } from './ProjectCreator';
import i18n from './TemplateDetail.i18n.json';
import useLocale from '../../hooks/useLocale';
import { ZThemedColors } from '../../utils/ZConst';

interface Props {
  templateData: GetProjectTemplate_projectTemplates_edges_node | undefined;

  onCancel: () => void;
  onProjectCreate: (projectExId: ShortId) => void;
}

const COVER_IMAGE_WIDTH = '360px';
const QR_IMAGE_WIDTH = '140px';
const PREVIEW_IMAGE_WIDTH = '315px';

export function TemplateDetail(props: Props): NullableReactElement {
  const { templateData, onCancel, onProjectCreate } = props;
  const { localizedContent: content } = useLocale({
    EN: i18n.en,
    ZH: i18n.zh
  });
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Modal
        closable={false}
        className={cssModule.container}
        centered
        visible={!!templateData}
        footer={null}
        width="80%"
      >
        <div className={cssModule.titleContainer}>
          <div className={cssModule.titleLeftPart}>
            <ArrowLeftOutlined className={cssModule.titleIcon} onClick={onCancel} />
            <div className={cssModule.title}>{templateData?.name}</div>
          </div>
          <CloseOutlined onClick={onCancel} className={cssModule.closeIcon} />
        </div>
        <Divider className={cssModule.divider} />
        <div className={cssModule.slider}>
          <div className={cssModule.detailContainer}>
            <div className={cssModule.coverImage}>
              <Image
                preview={false}
                width={COVER_IMAGE_WIDTH}
                src={templateData?.coverImage?.url}
              />
            </div>
            <div className={cssModule.description}>
              <div className={cssModule.detailTitle}>{templateData?.name}</div>
              <div className={cssModule.detailDescription}>{templateData?.description}</div>
              <Button className={cssModule.useButton} onClick={() => setVisible(true)}>
                {content.startUsing}
              </Button>
              <Popover
                content={
                  <div className={cssModule.popoverContent}>
                    <Image
                      preview={false}
                      width={QR_IMAGE_WIDTH}
                      src={templateData?.templatePreviewQrCodeLink?.url}
                    />
                    <div className={cssModule.popoverDescription}>{content.wechatScan}</div>
                  </div>
                }
                overlayClassName={cssModule.popover}
                placement="bottom"
                trigger="click"
              >
                <Button className={cssModule.previewButton}>{content.expTemplate}</Button>
              </Popover>
            </div>
          </div>
          <Divider className={cssModule.dividerPreview} />
          <div className={cssModule.previewContainer}>
            <div className={cssModule.previewTitle}>{content.preview}</div>
            <div className={cssModule.imageGroup}>
              <span>
                <Space size={40}>
                  {templateData?.previewImages?.map((image: any) => (
                    <Image width={PREVIEW_IMAGE_WIDTH} key={image.url} src={image.url} />
                  ))}
                </Space>
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <ProjectCreator
        visible={visible}
        exId={templateData?.exId}
        onCancel={() => setVisible(false)}
        onProjectCreate={(projextid) => {
          if (onProjectCreate) onProjectCreate(projextid);
        }}
      />
    </>
  );
}
