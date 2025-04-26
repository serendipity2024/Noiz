/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import CustomViewModel from '../../../../models/mobile-components/CustomViewModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { StickyMode, VerticalLayoutMode } from '../../../../shared/type-definition/Layout';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { CustomViewAttributes } from '../../../mobile-components/ZCustomView';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CustomViewConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import { AllStores } from '../../../../mobx/StoreContexts';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import ConfigTab from './ConfigTab';
import SwitchRow from '../shared/SwitchRow';
import { ZThemedColors } from '../../../../utils/ZConst';
import { FoldingMode } from '../../../../shared/type-definition/EventBinding';
import ComponentModelBuilder from '../../../../models/ComponentModelBuilder';
import ComponentModelType from '../../../../shared/type-definition/ComponentModelType';
import BaseMobileContainerModel from '../../../../models/base/BaseMobileContainerModel';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import { UserFlow, useSelectionTrigger } from '../../../../hooks/useUserFlowTrigger';
import { Collapse, InputNumber, Select, Modal, Row } from '../../../../zui';
import { BackgroundConfigRow } from '../config-row/BackgroundConfigRow';
import cssModule from './CustomViewConfigTab.module.scss';

const NONE = 'none';

const CustomViewStyleConfigTab = observer((props: { model: CustomViewModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as CustomViewAttributes;

  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { stickyMode, stickyMarginTop } = model;

  const prepareInputValue = (value: number | string | undefined): number => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    return parseInt(value, 10);
  };

  const bgColor = dataAttributes.backgroundColor;
  return (
    <div key={model.mRef}>
      <SwitchRow
        title={content.label.hasScrollX}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="hasScrollX"
        style={styles.checkbox}
      />
      <SwitchRow
        title={content.label.hasScrollY}
        componentModel={model}
        dataAttribute={dataAttributes}
        field="hasScrollY"
        style={styles.checkbox}
      />
      <ZConfigRowTitle text={content.label.foldMode} />
      <Select
        bordered={false}
        value={dataAttributes.foldingMode}
        size="large"
        style={styles.typeSelect}
        onChange={(value) => {
          const diffItems = [
            ComponentDiff.buildUpdateDataAttributesDiff({
              model,
              valueKey: 'foldingMode',
              newValue: value,
            }),
          ];
          if (model.verticalLayout.layoutMode !== VerticalLayoutMode.WRAP_CONTENT) {
            diffItems.push(
              ComponentDiff.buildUpdateModelDiff({
                model,
                valueKey: 'verticalLayout',
                newValue: {
                  ...model.verticalLayout,
                  layoutMode: VerticalLayoutMode.WRAP_CONTENT,
                  minValue: model.getComponentFrame().size.height,
                },
              })
            );
          }
          AllStores.diffStore.applyDiff(diffItems);
        }}
      >
        {Object.entries(FoldingMode).map(([key, value]) => (
          <Select.Option key={key} value={value}>
            {content.foldMode[value]}
          </Select.Option>
        ))}
      </Select>
      {dataAttributes.foldingMode !== FoldingMode.NONE && (
        <Row justify="space-between" align="middle" style={styles.fixedRow}>
          <ZConfigRowTitle text="foldingHeight" />
          <InputNumber
            type="number"
            value={dataAttributes.foldingHeight}
            min={model.verticalLayout.minValue ?? 0}
            onChange={(value) => {
              model.onUpdateDataAttributes('foldingHeight', value);
            }}
          />
        </Row>
      )}
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        name={commonContent.label.backgroundColor}
        color={bgColor}
        onChange={(color: HexColor) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <BackgroundConfigRow model={model} />
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          {
            title: commonContent.label.components,
            content: <ChildComponentsConfigRow mRef={model.mRef} />,
          },
        ]}
      />

      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          {
            title: content.label.sticky,
            content: (
              <>
                <ZConfigRowTitle text={content.label.mode} />
                <Select
                  style={styles.fullWidth}
                  value={stickyMode ?? NONE}
                  onChange={(value) => {
                    AllStores.diffStore.applyDiff([
                      ComponentDiff.buildUpdateModelDiff({
                        model,
                        valueKey: 'stickyMode',
                        newValue: value === NONE ? undefined : value,
                      }),
                      ComponentDiff.buildUpdateModelDiff({
                        model,
                        valueKey: 'stickyMarginTop',
                        newValue: value === NONE ? undefined : 0,
                      }),
                    ]);
                  }}
                >
                  <Select.Option key={NONE} value={NONE}>
                    {content.mode.none}
                  </Select.Option>
                  {Object.values(StickyMode).map((e) => (
                    <Select.Option key={e} value={e}>
                      {content.mode[e] ?? e}
                    </Select.Option>
                  ))}
                </Select>
                {stickyMode ? (
                  <>
                    <ZConfigRowTitle text={content.label.top} />
                    <InputNumber
                      size="middle"
                      type="number"
                      style={styles.fullWidth}
                      value={stickyMarginTop}
                      onChange={(value) => {
                        model.onUpdateModel('stickyMarginTop', prepareInputValue(value));
                      }}
                    />
                  </>
                ) : undefined}
              </>
            ),
          },
        ]}
      />

      <CombinedStyleConfigRow data={model} />
    </div>
  );
});

const CustomViewActionConfigTab = observer((props: { model: CustomViewModel }) => {
  const { model } = props;

  const { localizedContent: commonContent } = useLocale(commonI18n);
  const dataAttributes = model.dataAttributes as CustomViewAttributes;

  const clickActions = cloneDeep(dataAttributes.clickActions ?? []);

  return (
    <div key={model.mRef}>
      <ZConfigRowTitle text={commonContent.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </div>
  );
});

const CustomViewDataConfigTab = observer((props: { model: CustomViewModel }) => {
  const { model } = props;
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const [visible, setVisible] = useState(false);

  const convertToConditionalContainer = () => {
    const conditionalContainerModel = ComponentModelBuilder.buildByType(
      model.parentMRef,
      ComponentModelType.CONDITIONAL_CONTAINER
    ) as BaseMobileContainerModel;
    conditionalContainerModel.setComponentFrame(model.getComponentFrame());
    conditionalContainerModel.dataAttributes = {
      ...conditionalContainerModel.defaultDataAttributes(),
      ...model.dataAttributes,
    };

    if (conditionalContainerModel.unsavedChildren.length !== 1) throw new Error('error');
    const childContainerModel = conditionalContainerModel.unsavedChildren[0] as BaseContainerModel;
    Object.assign(childContainerModel, { mRef: model.mRef, childMRefs: model.childMRefs });

    const parentModel = StoreHelpers.findComponentModelOrThrow(
      model.parentMRef
    ) as BaseMobileContainerModel;
    const newChildMRefs = parentModel.childMRefs
      .filter((mRef) => mRef !== model.mRef)
      .concat([conditionalContainerModel.mRef]);

    const diffItems = [
      ...ComponentDiff.buildDeleteComponentDiffs(model, true),
      ...conditionalContainerModel.onCreateComponentDiffs(),
      ComponentDiff.buildUpdateChildMRefsDiff(model.parentMRef, newChildMRefs),
    ];
    AllStores.diffStore.applyDiff(diffItems);
    uft(UserFlow.FOCUS_TARGET)(conditionalContainerModel.mRef);
    uft(UserFlow.SELECT_TARGET)(conditionalContainerModel.mRef);
  };

  return (
    <>
      <div
        style={styles.convertedContainer}
        onClick={(e) => {
          e.stopPropagation();
          setVisible(true);
        }}
      >
        <div style={styles.convertedLeft}>
          <div style={styles.convertedTitle}>{content.label.convertToConditionalContainer}</div>
        </div>
        <ArrowRightOutlined />
      </div>
      <Modal
        title={content.label.whetherConvert}
        centered
        destroyOnClose
        maskClosable
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => convertToConditionalContainer()}
      />
    </>
  );
});

export default observer(function CustomViewConfigTab(props: MRefProp) {
  const model = useModel<CustomViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={CustomViewActionConfigTab}
      DataConfigTab={CustomViewDataConfigTab}
      StyleConfigTab={CustomViewStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  typeSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
  },
  numberInput: {
    marginRight: '5px',
    width: '40%',
  },
  marginTop: {
    marginTop: '20px',
  },
  fullWidth: {
    width: '100%',
  },
  fixedRow: {
    marginTop: '10px',
  },
  convertedContainer: {
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
  convertedLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '88%',
  },
  convertedTitle: {
    fontSize: '14px',
    color: ZThemedColors.ACCENT,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
};
