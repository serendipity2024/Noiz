/* eslint-disable import/no-default-export */
/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
import { ArrowRightOutlined, CloseSquareOutlined } from '@ant-design/icons';
import React, { ReactElement, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from '../hooks/useStores';
import StoreHelpers from '../mobx/StoreHelpers';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { ZThemedBorderRadius, ZThemedColors } from '../utils/ZConst';
import { UploadFileInput } from './side-drawer-tabs/right-drawer/shared/UploadFile';
import i18n from './ZCustomComponentTab.i18n.json';
import useLocale from '../hooks/useLocale';
import useNotificationDisplay from '../hooks/useNotificationDisplay';
import ZComponentSelectionWrapper from './base/ZComponentSelectionWrapper';
import { ComponentTemplate } from '../mobx/stores/CoreStoreDataType';
import './ZCustomComponentTab.scss';
import ComponentDiff from '../diffs/ComponentDiff';
import { replaceAllReferenceFromComponentModel } from '../hooks/useUserFlowTrigger';
import { toModel } from '../models/ComponentModelBuilder';
import { DiffItem } from '../shared/type-definition/Diff';
import { Form, Modal, Button, Row, ZInput } from '../zui';

export interface Prop {
  componentModel: BaseComponentModel;
}

export default observer(function ZCustomComponentTab(props: Prop): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel } = props;

  const notification = useNotificationDisplay();
  const { editorStore, coreStore, diffStore } = useStores();
  const [modelToClone, setModelToClone] = useState<BaseComponentModel | undefined>(undefined);
  const [unbindlingVisible, setUnbindlingVisible] = useState<boolean>(false);

  const onCancel = () => {
    if (modelToClone) {
      StoreHelpers.removeComponent(modelToClone.mRef);
      setModelToClone(undefined);
    }
  };

  const onFinish = async (value: Record<string, any>) => {
    if (!modelToClone) return;

    const clonedModel = modelToClone.createCopy('');
    if (!clonedModel) return;
    clonedModel.isTemplate = true;
    clonedModel.referencedTemplateMRef = undefined;

    const componentTemplate: ComponentTemplate = {
      title: value.title,
      iconImageUrl: value.iconResult.fileUrl,
      rootMRef: clonedModel.mRef,
    };
    const diffItem = ComponentDiff.buildUpdateComponentTemplatesDiff([
      ...coreStore.componentTemplates,
      componentTemplate,
    ]);
    diffStore.applyDiff([...clonedModel.onCreateComponentDiffs(), diffItem]);

    StoreHelpers.removeComponent(modelToClone.mRef);
    setModelToClone(undefined);
    notification('CREATE_COMPONENT_TEMPLATE_SUCCESS');
  };

  const onCreateTemplate = () => {
    const clonedModel = componentModel.createCopy('');
    if (!clonedModel) return;
    clonedModel.save();
    setModelToClone(clonedModel);
    editorStore.selectedLeftDrawerKey = null;
  };

  const onUnbindlingTemplate = () => {
    const referencedTemplateModel = StoreHelpers.findComponentModelOrThrow(
      componentModel.referencedTemplateMRef ?? ''
    );

    editorStore.clipBoardMRefs = [componentModel.mRef];
    const cloned = toModel({
      ...referencedTemplateModel,
      isTemplate: false,
      referencedTemplateMRef: undefined,
    }).createCopy(componentModel.parentMRef);
    editorStore.clipBoardMRefs = [];
    if (!cloned) return;

    let clonedModel = replaceAllReferenceFromComponentModel(cloned);
    editorStore.transientMRefMapCopy = {};
    let jsonString = JSON.stringify(clonedModel);
    jsonString = jsonString.replaceAll(cloned.mRef, componentModel.mRef);
    clonedModel = JSON.parse(jsonString);

    clonedModel = toModel({
      ...clonedModel,
      componentName: componentModel.componentName,
      componentFrame: componentModel.getComponentFrame(),
      inputDataSource: componentModel.inputDataSource,
    });

    const diffItems: DiffItem[] = [
      ...ComponentDiff.buildDeleteComponentDiffs(componentModel),
      ...clonedModel.onCreateComponentDiffs(),
    ];
    diffStore.applyDiff(diffItems);
    setUnbindlingVisible(false);
  };

  const renderCustomComponentForm = () => {
    if (!modelToClone) return null;
    return (
      <Form labelCol={{ span: 5 }} onFinish={onFinish}>
        <Form.Item
          label={content.title}
          name="title"
          rules={[{ required: true, message: content.titleWarning }]}
        >
          <ZInput />
        </Form.Item>

        <Form.Item
          label={content.icon}
          name="iconResult"
          rules={[{ required: true, message: content.iconWarning }]}
        >
          <UploadFileInput />
        </Form.Item>

        <Form.Item label={content.preview}>
          <div style={styles.previewContanier}>
            <div style={styles.previewBack} />
            <Row justify="center">
              <ZComponentSelectionWrapper
                key={modelToClone.mRef}
                component={modelToClone}
                draggable={false}
              >
                {modelToClone.renderForPreview()}
              </ZComponentSelectionWrapper>
            </Row>
          </div>
        </Form.Item>

        <Form.Item>
          <Row justify="end">
            <Button
              type="default"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              {content.cancel}
            </Button>
            <Button style={styles.submitButton} type="primary" htmlType="submit">
              {content.publish}
            </Button>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  const renderCreateComponentTemplate = () => {
    return (
      <div style={styles.itemContainer} onClick={onCreateTemplate}>
        <div style={styles.itemLeft}>
          <div style={styles.itemTitle}>{content.createComponentTemplate}</div>
        </div>
        <ArrowRightOutlined />
      </div>
    );
  };

  const renderUnbindlingComponent = () => {
    return (
      <div style={styles.itemContainer} onClick={() => setUnbindlingVisible(true)}>
        <div style={styles.itemLeft}>
          <div style={styles.itemTitle}>{content.unbindTemplate}</div>
        </div>
        <CloseSquareOutlined />
      </div>
    );
  };

  const renderComponentTemplate = () => {
    return (
      <div style={styles.itemContainer}>
        <div style={styles.itemLeft}>
          <div style={styles.itemTitle}>{content.templateComponent}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {!componentModel.isTemplate &&
        !componentModel.referencedTemplateMRef &&
        renderCreateComponentTemplate()}
      {componentModel.isTemplate && renderComponentTemplate()}
      {componentModel.referencedTemplateMRef && renderUnbindlingComponent()}
      <Modal
        title={content.createComponentTemplate}
        centered
        destroyOnClose
        visible={!!modelToClone}
        footer={null}
        onCancel={onCancel}
      >
        {renderCustomComponentForm()}
      </Modal>
      <Modal
        title={content.unbindPrompt}
        centered
        destroyOnClose
        maskClosable
        visible={unbindlingVisible}
        onCancel={() => setUnbindlingVisible(false)}
        onOk={() => onUnbindlingTemplate()}
      />
    </>
  );
});

export const WRAPPER_PADDING_SIZE = 22;
export const WRAPPER_BORDER_WIDTH = 2;

const styles: Record<string, React.CSSProperties> = {
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: '10px',
    padding: '5px 10px',
    borderRadius: '5px',
    background: ZThemedColors.SECONDARY,
    color: ZThemedColors.ACCENT,
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '88%',
  },
  itemTitle: {
    fontSize: '14px',
    color: ZThemedColors.ACCENT,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
  submitButton: {
    marginLeft: '10px',
  },
  previewContanier: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${WRAPPER_PADDING_SIZE}px`,
  },
  previewBack: {
    position: 'absolute',
    top: `${WRAPPER_BORDER_WIDTH}px`,
    bottom: `${WRAPPER_BORDER_WIDTH}px`,
    left: `${WRAPPER_BORDER_WIDTH}px`,
    right: `${WRAPPER_BORDER_WIDTH}px`,
    border: `${WRAPPER_BORDER_WIDTH}px`,
    borderStyle: 'solid',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    padding: `${WRAPPER_PADDING_SIZE - WRAPPER_BORDER_WIDTH}px`,
    borderColor: ZThemedColors.ACCENT_HIGHLIGHT,
    backgroundColor: ZThemedColors.ACCENT_HIGHLIGHT_WITH_OPACITY,
  },
};
