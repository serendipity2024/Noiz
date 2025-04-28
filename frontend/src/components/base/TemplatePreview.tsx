import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Col, Divider, Modal, Image, Button, Row } from '../../zui';
import { NullableReactElement, ShortId } from '../../shared/type-definition/ZTypes';
import cssModule from './TemplatePreview.module.scss';
import i18n from './TemplatePreview.i18n.json';
import useLocale from '../../hooks/useLocale';
import { GQL_GET_PROJECT_TEMPLATE } from '../../graphQL/getProjectTemplate';
import { Visibility } from '../../graphQL/__generated__/globalTypes';
import {
  GetProjectTemplate,
  GetProjectTemplate_projectTemplates_edges_node,
} from '../../graphQL/__generated__/GetProjectTemplate';
import { TemplateDetail } from './TemplateDetail';
import { ProjectCreator } from './ProjectCreator';
import rightArrow from '../../shared/assets/icons/right-arrow.svg';

interface Props {
  visible: boolean;

  onCancel: () => void;
  onProjectCreate: (projectExId: ShortId) => void;
}

export function TemplatePreview(props: Props): NullableReactElement {
  const { visible, onCancel, onProjectCreate } = props;
  const { localizedContent: content } = useLocale({
    EN: i18n.en,
    ZH: i18n.zh
  });
  const [blankVisible, setBlankVisible] = useState(false);
  const templateData = useQuery<GetProjectTemplate>(GQL_GET_PROJECT_TEMPLATE, {
    variables: {
      visibility: Visibility.PUBLIC,
    },
  });
  const [templateDetailData, setTemplateDetailData] = useState<
    GetProjectTemplate_projectTemplates_edges_node | undefined
  >(undefined);

  return (
    <>
      <Modal
        closable={false}
        className={cssModule.container}
        centered
        visible={visible}
        footer={null}
        width="80%"
      >
        <div className={cssModule.titleContainer}>
          <div className={cssModule.title}>{content.title}</div>
        </div>
        <Divider className={cssModule.divider} />
        <div className={cssModule.templateListContainer}>
          <Row className={cssModule.templateList}>
            {templateData.data?.projectTemplates?.edges?.map((item) => (
              <Col span={8} className={cssModule.cardItem} key={item?.node?.exId}>
                <Card
                  hoverable
                  cover={
                    <Image
                      preview={false}
                      alt="cover"
                      width="100%"
                      src={item?.node?.coverImage?.url}
                    />
                  }
                  onClick={() => {
                    setTemplateDetailData(item?.node ?? undefined);
                  }}
                >
                  <div className={cssModule.descriptionContainer}>
                    <div className={cssModule.descriptionTitle}>{item?.node?.name}</div>
                    <div className={cssModule.descriptionContent}>
                      {content.detail}
                      <img className={cssModule.rightIcon} alt="" src={rightArrow} />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className={cssModule.footer}>
          <div className={cssModule.closeButtonContainer}>
            <Button onClick={onCancel} className={cssModule.closeButton}>
              {content.cancel}
            </Button>
          </div>
          <div className={cssModule.blankButtonContainer}>
            <Button onClick={() => setBlankVisible(true)} className={cssModule.blankButton}>
              {content.useBlank}
            </Button>
          </div>
        </div>
      </Modal>
      <TemplateDetail
        templateData={templateDetailData}
        onCancel={() => setTemplateDetailData(undefined)}
        onProjectCreate={onProjectCreate}
      />
      <ProjectCreator
        visible={blankVisible}
        exId=""
        onProjectCreate={onProjectCreate}
        onCancel={() => setBlankVisible(false)}
      />
    </>
  );
}
