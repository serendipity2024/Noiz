/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useModel from '../../../../hooks/useModel';
import { AllStores } from '../../../../mobx/StoreContexts';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { MultiImageAttributes } from '../../../mobile-components/ZMultiImage';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './MultiImageConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import MultiImageModel from '../../../../models/mobile-components/MultiImageModel';
import ConfigTab from './ConfigTab';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import './MultilmageConfig.scss';
import { EventType } from '../../../../shared/type-definition/EventBinding';
import { InputNumber, Row } from '../../../../zui';

const MultiImageStyleConfigTab = observer((props: { model: MultiImageModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImageAttributes;
  const { backgroundColor, itemBackgroundColor } = dataAttributes;

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <ColorPicker
        style={styles.colorSelect}
        color={itemBackgroundColor}
        name={content.label.itemBackgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('itemBackgroundColor', DataBinding.withColor(color));
        }}
      />
      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.previewImageCount} />
        <InputNumber
          min={1}
          max={dataAttributes.maxImageCount}
          style={styles.inputNumber}
          value={dataAttributes.previewImageCount}
          onChange={(value) => {
            model.onUpdateDataAttributes(
              'previewImageCount',
              typeof value === 'number' ? value : 0
            );
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.maxImageCount} />
        <InputNumber
          min={1}
          max={9}
          style={styles.inputNumber}
          value={dataAttributes.maxImageCount}
          onChange={(value) => {
            const count = typeof value === 'number' ? value : 0;
            const diffItems = [
              ComponentDiff.buildUpdateDataAttributesDiff({
                model,
                valueKey: 'maxImageCount',
                newValue: count,
              }),
            ];
            if (dataAttributes.previewImageCount > count || dataAttributes.previewImageCount <= 0) {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'previewImageCount',
                  newValue: count,
                })
              );
            }
            AllStores.diffStore.applyDiff(diffItems);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.horizontalPadding} />
        <InputNumber
          min={0}
          max={30}
          style={styles.inputNumber}
          value={dataAttributes.horizontalPadding}
          onChange={(value) => {
            model.onUpdateDataAttributes(
              'horizontalPadding',
              typeof value === 'number' ? value : 0
            );
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.verticalPadding} />
        <InputNumber
          min={0}
          max={30}
          style={styles.inputNumber}
          value={dataAttributes.verticalPadding}
          onChange={(value) => {
            model.onUpdateDataAttributes('verticalPadding', typeof value === 'number' ? value : 0);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.itemBorderRadius} />
        <InputNumber
          min={0}
          style={styles.inputNumber}
          value={dataAttributes.itemBorderRadius}
          onChange={(value) => {
            model.onUpdateDataAttributes('itemBorderRadius', typeof value === 'number' ? value : 0);
          }}
        />
      </Row>
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const MultiImageDataConfigTab = observer((props: { model: MultiImageModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImageAttributes;
  return (
    <DataBindingConfigRow
      title={content.label.imageList}
      componentModel={model}
      dataBinding={dataAttributes.imageList}
      onChange={(value) => {
        model.onUpdateDataAttributes('imageList', value);
      }}
    />
  );
});

const MultiIamgeActionConfigTab = observer((props: { model: MultiImageModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as MultiImageAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.itemClickActions} />
      <ClickActionConfigRow
        componentModel={model}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.FULLSCREEN_IMAGE,
            enabled: true,
          },
        ])}
        eventList={cloneDeep(dataAttributes.itemClickActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('itemClickActions', value)}
      />
    </>
  );
});

export default observer(function MultiImageConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<MultiImageModel>(props.mRef);
  if (!model) return null;
  return (
    <ConfigTab
      model={model}
      ActionConfigTab={MultiIamgeActionConfigTab}
      DataConfigTab={MultiImageDataConfigTab}
      StyleConfigTab={MultiImageStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  row: {
    marginTop: '10px',
  },
  inputNumber: {
    borderRadius: '6px',
    border: '0px',
    color: ZColors.WHITE,
    background: ZThemedColors.SECONDARY,
  },
};
